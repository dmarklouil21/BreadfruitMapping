import { Tree } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function AddTreeForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const initialLocation = {
    latitude: params.latitude? parseFloat(params.latitude as string) : 0,
    longitude: params.longitude? parseFloat(params.longitude as string) : 0
  };
  const [formData, setFormData] = useState<Omit<Tree, 'id'>>({
    city: '',
    diameter: 0,
    coordinates: initialLocation,
    dateTracked: new Date().toISOString(),
    fruitStatus: 'none',
  });

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
        setImage(result.assets[0].uri);
        setFormData({...formData, image: result.assets[0].uri});
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const handleSubmit = () => {
    console.log('New tree data:', formData);
    // Add your API submission logic here
    router.back(); // Return to previous screen after submission
  };

  return (
    <View style={styles.container}>
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

      <TextInput
        label="City Location"
        value={formData.city}
        onChangeText={text => setFormData({...formData, city: text})}
        style={styles.input}
      />

      <View style={styles.row}>
        <TextInput
          label="Latitude"
          value={formData.coordinates.latitude.toString()}
          onChangeText={text => setFormData({
            ...formData,
            coordinates: {
              ...formData.coordinates,
              latitude: parseFloat(text) || 0
            }
          })}
          style={[styles.input, styles.halfWidth]}
          keyboardType="numbers-and-punctuation"
        />

        <TextInput
          label="Longitude"
          value={formData.coordinates.longitude.toString()}
          onChangeText={text => setFormData({
            ...formData,
            coordinates: {
              ...formData.coordinates,
              longitude: parseFloat(text) || 0
            }
          })}
          style={[styles.input, styles.halfWidth]}
          keyboardType="numbers-and-punctuation"
        />
      </View>

      <View style={styles.row}>
        <TextInput
          label="Diameter (meters)"
          value={formData.diameter.toString()}
          onChangeText={text => setFormData({
            ...formData,
            diameter: parseFloat(text) || 0
          })}
          style={[styles.input, styles.halfWidth]}
          keyboardType="numeric"
        />

        <TextInput
          label="Date Tracked"
          value={formData.dateTracked}
          onChangeText={text => setFormData({
            ...formData,
            dateTracked: text
          })}
          style={[styles.input, styles.halfWidth]}
        />

      </View>

      <View style={styles.buttonGroup}>
        <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={styles.primaryButton}
            icon="check"
        >
            Add Tree
        </Button>
      
        <Button 
            mode="contained" 
            onPress={() => console.log('Image processing in progress:', formData)}
            style={styles.secondaryButton}
            icon="image-auto-adjust"
        >
            Process Image
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  halfWidth: {
    flex: 1,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 25,
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
  },
  secondaryButton: {
    backgroundColor: '#333',
  },
  buttonLabel: {
    color: 'white',
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
});