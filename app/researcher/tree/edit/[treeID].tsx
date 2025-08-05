import { LoadingAlert, NotificationAlert } from '@/components/NotificationModal';
import barangayData from '@/constants/barangayData';
import { storage } from '@/firebaseConfig';
import { useTreeData } from '@/hooks/useTreeData';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image as ReactImage,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Menu, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const FRUIT_STATUS_OPTIONS = ['none', 'unripe', 'ripe'];

export default function EditTreeScreen() {
  const router = useRouter();
  const { treeID } = useLocalSearchParams();
  const { trees, isLoading } = useTreeData({ mode: 'single', treeID: treeID.toString() });
  const tree = trees[0];
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [diameter, setDiameter] = useState('');
  const [latitudeInput, setLatitudeInput] = useState('');
  const [longitudeInput, setLongitudeInput] = useState('');
  const [fruitStatus, setFruitStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [image, setImage] = useState('');

  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

  const [cityOptionsMenuVisible, setCityOptionsMenuVisible] = useState(false);
  const [barangayOptionsMenuVisible, setBarangayOptionsMenuVisible] = useState(false);

  const CITY_OPTIONS = Object.keys(barangayData)
  const BARANGAY_OPTIONS = barangayData[city] || [];

  useEffect(() => {
    if (tree) {
      setCity(tree.city);
      setFruitStatus(tree.fruitStatus);
      setBarangay(tree.barangay);
      setDiameter(tree.diameter.toString());
      // setDiameter(tree.diameter !== undefined && tree.diameter !== null ? tree.diameter.toString() : '');
      setLatitudeInput(tree.coordinates.latitude.toString());
      setLongitudeInput(tree.coordinates.longitude.toString());
      setImage(tree.image || '');
    }
  }, [tree]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access photos is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        // setFormData({...formData, image: result.assets[0].uri});
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };
  
  const handleSubmit = (treeID: string) => {
    Alert.alert('Confirm Changes', 'Save changes made for this tree?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const db = getFirestore();
            const docRef = doc(db, 'trees', treeID);

            let downloadURL = '';
            let previousImageURL = tree.image;

            if (image) {
              // Get file name
              const fileName = image.split('/').pop() || `image_${Date.now()}.jpeg`;
      
              // Fetch blob from image URI
              const res = await fetch(image);
              const blob = await res.blob();

              if (previousImageURL) {
                try {
                  const decodedURL = decodeURIComponent(previousImageURL.split('?')[0]);
                  const imagePath = decodedURL.split('/o/')[1]; // Extract path after '/o/'
                  const finalPath = imagePath.replace('%2F', '/'); // Decode the folder path
                  const prevRef = ref(storage, finalPath);
                  await deleteObject(prevRef);
                  console.log('Previous image deleted:', finalPath);
                } catch (deleteError) {
                  console.warn('Failed to delete previous image:', deleteError);
                }
              }
      
              // Upload to Firebase Storage
              const storageRef = ref(storage, `images/${fileName}`);
              await uploadBytes(storageRef, blob, {
                contentType: 'image/jpeg',
              });
      
              downloadURL = await getDownloadURL(storageRef);
              console.log('Upload successful:', fileName);
            }

            const treeData = {
              city: city,
              barangay: barangay,
              fruitStatus: fruitStatus,
              diameter: parseFloat(diameter) || 0,
              coordinates: {
                latitude: parseFloat(latitudeInput) || 0,
                longitude: parseFloat(longitudeInput) || 0,
              },
              image: downloadURL,
            }

            await updateDoc(docRef, treeData);
            
           /*  await updateDoc(docRef, {
              city: city,
              barangay: barangay,
              fruitStatus: fruitStatus,
              diameter: parseFloat(diameter) || 0,
              coordinates: {
                latitude: parseFloat(latitudeInput) || 0,
                longitude: parseFloat(longitudeInput) || 0,
              },
              image: image,
            }); */

            setNotificationVisible(true);
            setNotificationMessage('Successfully saved.');
            setNotificationType('success');
          } catch(error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        },
      },
    ])
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color='#2ecc71' />
      </View>
    );
  }
  
  if (!tree) {
    return (
      <View style={styles.errorContainer}>
        <Text>Tree not found.</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps='handled'>
        <View style={styles.container}>
          <LoadingAlert visible={loading} message="Please wait..." />
          <NotificationAlert
            visible={notificationVisible}
            message={notificationMessage}
            type={notificationType}
            onClose={() => {
              setNotificationVisible(false)
              router.navigate('/researcher/(tabs)/map')
            }}
          />
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {image ? (
              <ReactImage source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="add-a-photo" size={40} color="#2ecc71" />
                <Text style={styles.imageLabel}>Update Tree Picture</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            label="Breadfruit ID"
            value={tree?.treeID}
            style={styles.input}
            readOnly={true}
          />

          <View style={{ marginBottom: 16 }}>
            <Menu
              visible={cityOptionsMenuVisible}
              onDismiss={() => setCityOptionsMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setCityOptionsMenuVisible(true)}>
                  <TextInput
                    label="City/Municipality"
                    value={city}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                    style={{
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#eee',
                    }}
                  />
                </TouchableOpacity>
              }
            >
              {CITY_OPTIONS.map(option => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setCity(option);
                    setCityOptionsMenuVisible(false);
                  }}
                  title={option.charAt(0).toUpperCase() + option.slice(1)}
                />
              ))}
            </Menu>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Menu
              visible={barangayOptionsMenuVisible}
              onDismiss={() => setBarangayOptionsMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setBarangayOptionsMenuVisible(true)}>
                  <TextInput
                    label="Bogo"
                    value={barangay}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                    style={{
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#eee',
                    }}
                  />
                </TouchableOpacity>
              }
            >
              {BARANGAY_OPTIONS.map(option => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setBarangay(option);
                    setBarangayOptionsMenuVisible(false);
                  }}
                  title={option.charAt(0).toUpperCase() + option.slice(1)}
                />
              ))}
            </Menu>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Menu
              visible={showStatusMenu}
              onDismiss={() => setShowStatusMenu(false)}
              anchor={
                <TouchableOpacity onPress={() => setShowStatusMenu(true)}>
                  <TextInput
                    label="Fruit Status"
                    value={fruitStatus}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                    style={{
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#eee',
                    }}
                  />
                </TouchableOpacity>
              }
            >
              {FRUIT_STATUS_OPTIONS.map(option => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setFruitStatus(option);
                    setShowStatusMenu(false);
                  }}
                  title={option.charAt(0).toUpperCase() + option.slice(1)}
                />
              ))}
            </Menu>
          </View>

          <TextInput
            label="Diameter"
            value={diameter}
            onChangeText={setDiameter}
            style={styles.input}
            keyboardType="decimal-pad"
          />

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
            value={tree?.dateTracked}
            style={styles.input}
            readOnly={true}
          />

          <View style={styles.buttonGroup}>
            <Button 
              mode="contained" 
              onPress={() => handleSubmit(treeID.toString())}
              style={styles.primaryButton}
            >
              Save Changes
            </Button>
            <Button
              mode="contained"
              onPress={() => console.log('Image processing in progress:')}
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  halfWidth: { flex: 1 },
  input: {
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
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
  buttonGroup: {
    marginTop: 25,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 25,
  },
  secondaryButton: {
    backgroundColor: '#333',
    borderRadius: 25,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
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
  roleButton: {
    width: '100%',
    borderColor: '#2ecc71',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});