import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Menu, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingAlert, NotificationAlert } from '@/components/NotificationModal';
import barangayData from '@/constants/barangayData';
import { useAuth } from '@/context/AuthContext';
import { functions } from '@/firebaseConfig';
import { Tree } from '@/types';

const FRUIT_STATUS_OPTIONS = ['none', 'unripe', 'ripe'];

export default function AddTreeForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const initialLocation = {
    latitude: params.latitude ? parseFloat(params.latitude as string) : 0,
    longitude: params.longitude ? parseFloat(params.longitude as string) : 0,
  };

  const [image, setImage] = useState('');
  const [diameterInput, setDiameterInput] = useState('');
  const [latitudeInput, setLatitudeInput] = useState(initialLocation.latitude.toString());
  const [longitudeInput, setLongitudeInput] = useState(initialLocation.longitude.toString());
  const [fruitStatusMenuVisible, setFruitStatusMenuVisible] = useState(false);
  const [cityOptionsMenuVisible, setCityOptionsMenuVisible] = useState(false);
  const [barangayOptionsMenuVisible, setBarangayOptionsMenuVisible] = useState(false);

  const [formData, setFormData] = useState<Tree>({
    treeID: '',
    city: '',
    barangay: '',
    diameter: 0,
    coordinates: initialLocation,
    dateTracked: new Date().toISOString().split('T')[0],
    fruitStatus: 'none',
    image: image,
    status: 'pending',
    trackedBy: user?.name || '',
  });

  const CITY_OPTIONS = Object.keys(barangayData)
  const BARANGAY_OPTIONS = barangayData[formData.city] || [];

  const [loading, setLoading] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'info' | 'error'>('info');

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to select images!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        setFormData(prev => ({ ...prev, image: uri }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCoordinateChange = (key: 'latitude' | 'longitude', value: string) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [key]: parseFloat(value) || 0,
      },
    }));
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setNotificationMessage('Permission to access location was denied');
        setNotificationType('error');
        setNotificationVisible(true);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLatitudeInput(latitude.toString());
      setLongitudeInput(longitude.toString());
    } catch (error) {
      console.error('Error getting location:', error);
      setNotificationMessage('Failed to get location');
      setNotificationType('error');
      setNotificationVisible(true);
    }
  };


  const handleSubmit = async () => {
    const addNewTree = httpsCallable(functions, 'addNewTree');
    setLoading(true);
    try {
      const result = await addNewTree ({
        ...formData, 
        diameter: parseFloat(diameterInput) || 0,
        coordinates: {
          latitude: parseFloat(latitudeInput) || 0,
          longitude: parseFloat(longitudeInput) || 0,
        }
      });
      
      setNotificationMessage('Added successfully');
      setNotificationType('success');
      setNotificationVisible(true);
    } catch (error) {
      console.error('Error adding document:', error);
      setNotificationMessage('Failed to add tree data.');
      setNotificationType('error');
      setNotificationVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <LoadingAlert visible={loading} message="Please wait..." />
            <NotificationAlert
              visible={notificationVisible}
              message={notificationMessage}
              type={notificationType}
              onClose={() => setNotificationVisible(false)}
            />

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="add-a-photo" size={40} color="#2ecc71" />
                  <Text style={styles.imageLabel}>Add Tree Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={[styles.input, styles.halfWidth]}>
                <Menu
                  visible={cityOptionsMenuVisible}
                  onDismiss={() => setCityOptionsMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setCityOptionsMenuVisible(true)}>
                      <TextInput
                        label="City"
                        value={formData.city}
                        editable={false}
                        right={<TextInput.Icon icon="menu-down" />}
                        style={{ backgroundColor: '#f8f8f8'}}
                      />
                    </TouchableOpacity>
                  }
                >
                  {CITY_OPTIONS.map(option => (
                    <Menu.Item
                      key={option}
                      onPress={() => {
                        handleChange('city', option);
                        handleChange('barangay', '');
                        setCityOptionsMenuVisible(false);
                      }}
                      title={option.charAt(0).toUpperCase() + option.slice(1)}
                    />
                  ))}
                </Menu>
              </View>
              <View style={[styles.input, styles.halfWidth]}>
                <Menu
                  visible={barangayOptionsMenuVisible}
                  onDismiss={() => setBarangayOptionsMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setBarangayOptionsMenuVisible(true)}>
                      <TextInput
                        label="Barangay"
                        value={formData.barangay}
                        editable={false}
                        right={<TextInput.Icon icon="menu-down" />}
                        style={{ backgroundColor: '#f8f8f8'}}
                      />
                    </TouchableOpacity>
                  }
                >
                  {BARANGAY_OPTIONS.map(option => (
                    <Menu.Item
                      key={option}
                      onPress={() => {
                        handleChange('barangay', option);
                        setBarangayOptionsMenuVisible(false);
                      }}
                      title={option.charAt(0).toUpperCase() + option.slice(1)}
                    />
                  ))}
                </Menu>
              </View>
            </View>

            <View style={styles.row}>
              <TextInput
                label="Diameter (meters)"
                value={diameterInput}
                onChangeText={setDiameterInput}
                style={[styles.input, styles.halfWidth]}
                keyboardType="decimal-pad"
              />

              <View style={[styles.input, styles.halfWidth]}>
                <Menu
                  visible={fruitStatusMenuVisible}
                  onDismiss={() => setFruitStatusMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setFruitStatusMenuVisible(true)}>
                      <TextInput
                        label="Fruit Status"
                        value={formData.fruitStatus}
                        editable={false}
                        right={<TextInput.Icon icon="menu-down" />}
                        style={{ backgroundColor: '#f8f8f8'}}
                      />
                    </TouchableOpacity>
                  }
                >
                  {FRUIT_STATUS_OPTIONS.map(option => (
                    <Menu.Item
                      key={option}
                      onPress={() => {
                        handleChange('fruitStatus', option);
                        setFruitStatusMenuVisible(false);
                      }}
                      title={option.charAt(0).toUpperCase() + option.slice(1)}
                    />
                  ))}
                </Menu>
              </View>
            </View>

            <View style={styles.coordinateGroup}>
              <View style={styles.coordinateLegend}>
                <Text style={styles.legendText}>Coordinates</Text>
              </View>
              <View style={styles.rowLegend}>
                <TextInput
                  label="Latitude"
                  value={latitudeInput}
                  onChangeText={setLatitudeInput}
                  style={[styles.input, styles.halfWidth, styles.coordinateInput]}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  label="Longitude"
                  value={longitudeInput}
                  onChangeText={setLongitudeInput}
                  style={[styles.input, styles.halfWidth, styles.coordinateInput]}
                  keyboardType="decimal-pad"
                />
              </View>
              <TouchableOpacity onPress={getCurrentLocation}>
                <Text style={styles.useLocationText}>Use Location</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              label="Date Tracked"
              value={formData.dateTracked}
              onChangeText={text => handleChange('dateTracked', text)}
              style={styles.input}
            />

            <View style={styles.buttonGroup}>
              <Button mode="contained" onPress={handleSubmit} style={styles.primaryButton}>
                Save
              </Button>
              <Button
                mode="contained"
                onPress={() => console.log('Image processing in progress:', formData)}
                style={styles.secondaryButton}
              >
                Image Processing
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, marginTop: -38, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, marginBottom: 15 },
  input: {
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  halfWidth: { flex: 1 },
  coordinateGroup: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    position: 'relative',
  },
  coordinateLegend: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLegend: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  legendText: { color: '#2ecc71', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  coordinateInput: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  useLocationText: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginLeft: 4,
  },
  buttonGroup: { gap: 12, marginTop: 25 },
  primaryButton: { backgroundColor: '#2ecc71' },
  secondaryButton: { backgroundColor: '#333' },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderStyle: 'dashed',
    borderColor: '#2ecc71',
  },
  imageLabel: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: '500',
  },
});
