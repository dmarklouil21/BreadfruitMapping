import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { storage } from '@/firebaseConfig'; // Stop from here
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function CameraScreen() {
  const [status, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions(); 
  const cameraRef = useRef<CameraView>(null); 
  const [uri, setUri] = useState<string | null>(null);
  // New states for diameter calculation and profile selection
  const [isProfile, setIsProfile] = useState(false);
  const [showDiameterOptions, setShowDiameterOptions] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) return (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionText}>
        We need your permission to use the camera
      </Text>
      <Button mode="contained" onPress={requestPermission}>
        Grant permission
      </Button>
    </View>
  ); 

  const handleSetProfile = async () => {
    setIsProfile(!isProfile);
    // Here you would typically send to your backend/state management
    console.log('Image set as profile:', !isProfile);
    if (!uri) return;

    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = fetch(uri);
      const blob = await response.then(res => res.blob());
      
      // Convert to blob
      // const blob = new Blob([base64], { type: 'image/jpeg' });
      /* const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], {
        type: 'image/jpeg', // Explicit type
      }); */
      /* const byteCharacters = atob(base64);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' }); */
      
      const fileName = uri.split('/').pop() || `image_${Date.now()}.jpeg`; // uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${fileName}`);
      console.log(storageRef);
      
      await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg', // Explicit content type
      });

      console.log('Upload successful:', fileName);
      return await getDownloadURL(storageRef);
      // console.log('Upload success!', downloadURL);
      
      // Now use downloadURL to save to your database
    } catch (error) {
      console.error('Upload failed:', error);
    }
    /* const response = await fetch(uri ? uri : '');
    const blob = await response.blob();

    const fileName = uri?.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `images/${Date.now()}_${fileName}`);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Image uploaded successfully:', downloadURL); */
  };

  const handleDiameterMeasurement = () => {
    // Add your diameter measurement logic here
    console.log('Initiate diameter measurement for:', uri);
    setShowDiameterOptions(true);
  };

  const pickImage = async () => {
    try {
      if (!status?.granted) {
        const permission = await requestGalleryPermission();
        if (!permission.granted) return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    /* const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri ?? null); */
    /* try {
      const photo = await cameraRef.current?.takePictureAsync();
      setUri(photo?.uri ?? null);
    } catch (error) {
      console.log('Error taking picture:', error);
    } */
   try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (!photo?.uri) return;
      
      // Fix orientation and compress
      const processed = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      setUri(processed.uri);
    } catch (error) {
      console.log('Error taking picture:', error);
    }
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView  
          style={styles.camera} 
          ref={cameraRef}
          facing={facing} 
          responsiveOrientationWhenOrientationLocked
        />
        <View style={styles.controlsContainer}>
          <Pressable onPress={pickImage} style={styles.iconButton}>
            <MaterialIcons name="photo-library" size={32} color="2ecc71" />
          </Pressable>
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View style={[
                styles.shutterBtn,
                { opacity: pressed ? 0.5 : 1 }
              ]}>
                <View style={styles.shutterBtnInner} />
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleCameraFacing} style={styles.iconButton}>
            <FontAwesome6 name="rotate-left" size={32} color="2ecc71" />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderPicture = () => {
    return (
      <View style={styles.pictureContainer}>
        <Image
            source={{ uri: uri ?? '' }}
            contentFit="contain"
            style={styles.imagePreview}
          /> 

          <View style={styles.optionsContainer}>
            <Button 
              mode="contained"
              onPress={handleSetProfile}
              style={styles.profileButton}
              // labelStyle={{ color: '#333' }}
            >
              Add Tree
            </Button>
            
            <Button 
              mode="contained" 
              onPress={() => setUri(null)}
              style={styles.processButton}
            >
              Take Another Picture
            </Button>
          </View>

        {/* <Button 
          mode="outlined" 
          onPress={() => setUri(null)}
          style={styles.retakeButton}
          labelStyle={{ color: '#333' }}
        >
          Take Another Picture
        </Button> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  }, 
  cameraContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  }, 
  controlsContainer: {
    position: 'absolute',
    bottom: 55,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 20,
  }, 
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "#2ecc71",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  }, 
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#2ecc71',
  }, 
  iconButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'ffffff',
  }, 
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  }, 
  pictureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  }, 
  imagePreview: {
    width: '100%',
    height: '70%',
    borderRadius: 10,
    marginBottom: 30,
    // borderWidth: 2,
    borderColor: '#eee',
  }, 
  retakeButton: {
    width: '100%',
    alignSelf: 'center',
    // backgroundColor: '#2ecc71',
    borderRadius: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  }, 
  profileButton: {
    width: '48%',
    backgroundColor: '#2ecc71',
    borderRadius: 25,
  },
  processButton: {
    width: '48%',
    backgroundColor: '#333',
    borderRadius: 25,
  },
});