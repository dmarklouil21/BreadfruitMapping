import { LoadingAlert, NotificationAlert } from "@/components/NotificationModal";
import { functions, storage } from "@/firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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

export default function NewUserForm() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

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
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !password1 || !password2) {
      setNotificationVisible(true);
      setNotificationMessage('All fields are required.');
      return;
    }

    if (password1 !== password2) {
      setNotificationVisible(true);
      setNotificationMessage('Passwords do not match.');
      return;
    }

    const createNewUser = httpsCallable(functions, 'createNewUser');
    setLoading(true);

    try {
      let downloadURL = '';
      if (image) {
        // Get file name
        const fileName = image.split('/').pop() || `image_${Date.now()}.jpeg`;

        // Fetch blob from image URI
        const res = await fetch(image);
        const blob = await res.blob();

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
        email: email,
        password: password1,
        role: role,
        image: downloadURL,
        status: 'verified',
        joined: new Date().toISOString(),
      }

      await createNewUser(userData);

      setNotificationVisible(true);
      setNotificationMessage('User created successfully.');
      setNotificationType('success');
    } catch (error: any) {
      alert("Registration failed: " + error.message);
      console.error("Firebase error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        // style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <LoadingAlert visible={loading} message="Please wait..." />
          <NotificationAlert
            visible={notificationVisible}
            message={notificationMessage}
            type={notificationType}
            onClose={() => {
              setNotificationVisible(false)
              router.push('/admin/(tabs)/account-management')
            }}
          />
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="add-a-photo" size={40} color="#2ecc71" />
                <Text style={styles.imageLabel}>Add Profile Picture</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            // onChangeText={text => setFormData({...formData, name: text})}
            style={styles.input}
            autoCapitalize="words"
          />

          <TextInput
            label="Email Address"
            value={email}
            // onChangeText={text => setFormData({...formData, email: text})}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password1}
            onChangeText={setPassword1}
            // onChangeText={text => setFormData({...formData, password: text})}
            style={[styles.input, styles.halfWidth]}
            secureTextEntry
          />

          <TextInput
            label="Confirm Password"
            value={password2}
            // onChangeText={text => setFormData({...formData, confirmPassword: text})}
            onChangeText={setPassword2}
            style={[styles.input, styles.halfWidth]}
            secureTextEntry
          />

          <Menu
            visible={showRoleMenu}
            onDismiss={() => setShowRoleMenu(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setShowRoleMenu(true)}
                style={styles.roleButton} 
                labelStyle={{color: '#333'}}
                // icon="account-settings"
              >
                {role || 'Select Role'}
              </Button>
            }
          >
            <Menu.Item
              title="Administrator"
              onPress={() => {
                // setFormData({...formData, role: 'admin'});
                setRole('admin');
                setShowRoleMenu(false);
              }}
            />
            <Menu.Item
              title="Researcher"
              onPress={() => {
                // setFormData({...formData, role: 'researcher'});
                setRole('researcher');
                setShowRoleMenu(false);
              }}
            />
            <Menu.Item
              title="Viewer"
              onPress={() => {
                // setFormData({...formData, role: 'owner'});
                setRole('viewer');
                setShowRoleMenu(false);
              }}
            />
          </Menu>

          <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={styles.primaryButton}
          >
            Register User
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Keep the same styles, just update the component name
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  }, 
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    /* padding: 20,
    paddingBottom: 40,  */
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  halfWidth: {
    flex: 1,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 15,
  },
  primaryButton: {
    marginVertical: 10,
    backgroundColor: '#2ecc71',
    borderRadius: 25,
    //paddingVertical: 4,
  },
  secondaryButton: {
    backgroundColor: '#333',
    borderRadius: 25,
    //paddingVertical: 4,
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
    borderRadius: 25, 
    //paddingVertical: 4,
    borderColor: '#333',
    // marginBottom: 5,
  }
});