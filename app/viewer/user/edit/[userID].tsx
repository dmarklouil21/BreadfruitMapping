import { LoadingAlert, NotificationAlert } from '@/components/NotificationModal';
import { storage } from '@/firebaseConfig';
import { useUserData } from '@/hooks/useUserData';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function EditTreeScreen() {
  const router = useRouter();
  const { userID } = useLocalSearchParams();
  const { users, isLoading } = useUserData({ mode: 'single', uid: userID.toString() });
  const user = users[0];
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [image, setImage] = useState('');
  // const [showRoleMenu, setShowRoleMenu] = useState(false);

  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

  const USER_ROLE_OPTIONS = ['admin', 'researcher', 'viewer'];

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role);
      setImage(user.image || '');
    }
  }, [user]);

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
  
  const handleSubmit = (uid: string) => {
    Alert.alert('Confirm Changes', 'Save changes made for this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const db = getFirestore();
            const docRef = doc(db, 'users', uid);

            let downloadURL = '';
            let previousImageURL = user.image;

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
              const storageRef = ref(storage, `images/user-profile/${fileName}`);
              await uploadBytes(storageRef, blob, {
                contentType: 'image/jpeg',
              });
      
              downloadURL = await getDownloadURL(storageRef);
              console.log('Upload successful:', fileName);
            }

            const userData = {
              name: name,
              role: role,
              status: 'verified',
              image: image,
            }

            await updateDoc(docRef, userData);

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color='#2ecc71' />
      </View>
    );
  }
  
  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>User not found.</Text>
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
            {/* <UserEditForm user={user} /> */}
            <View style={styles.container}>
              <LoadingAlert visible={loading} message="Please wait..." />
              <NotificationAlert
                visible={notificationVisible}
                message={notificationMessage}
                type={notificationType}
                onClose={() => {
                  setNotificationVisible(false)
                  router.push('/researcher/(tabs)/profile')
                }}
              />
              <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {image ? (
                  <ReactImage source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <MaterialIcons name="add-a-photo" size={40} color="#2ecc71" />
                    <Text style={styles.imageLabel}>Update Profile Picture</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TextInput
                label="User ID"
                value={user?.uid}
                style={styles.input}
                readOnly={true}
              />

              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="words"
              />

              <TextInput
                label="Email Address"
                value={user?.email}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                readOnly={true}
              />

              <TextInput
                label="Role"
                value={role}
                onChangeText={setRole}
                style={styles.input}
                autoCapitalize="none"
                readOnly
              />

              <TextInput
                label="Date Joined"
                value={user?.joined}
                style={styles.input}
                readOnly={true}
              />

              <View style={styles.buttonGroup}>
                <Button 
                  mode="contained" 
                  onPress={() => handleSubmit(userID.toString())}
                  style={styles.primaryButton}
                >
                  Save Changes
                </Button>
              </View>
            </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  input: {
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  buttonGroup: {
    marginTop: 25,
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