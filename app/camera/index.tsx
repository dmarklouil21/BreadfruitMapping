// app/camera.tsx
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Pressable, Modal, TextInput } from 'react-native';
import { Button, Text } from 'react-native-paper'; 
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"; 
import * as ImagePicker from 'expo-image-picker'; 
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Audio } from 'expo-av'; // Added for sound control

export default function CameraScreen() {
  const [status, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions(); 
  const ref = useRef<CameraView>(null); 
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

  const handleSetProfile = () => {
    setIsProfile(!isProfile);
    // Here you would typically send to your backend/state management
    console.log('Image set as profile:', !isProfile);
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
    try {
      // Mute system sounds temporarily
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const photo = await ref.current?.takePictureAsync();
      setUri(photo?.uri ?? null);
    } catch (error) {
      console.log('Error taking picture:', error);
    } finally {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: false });
    }
  } 

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView  
          style={styles.camera} 
          ref={ref}
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
    borderRadius: 8,
  },
  processButton: {
    width: '48%',
    backgroundColor: '#333',
    borderRadius: 8,
  },
});