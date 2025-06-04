// user/add-user.tsx
/* import NewUserForm from "@/components/NewUserForm";

export default function AddUserScreen() {
  return (
    <NewUserForm />
  );
} */

// user/add-user.tsx
import { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Button, TextInput, Text, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

type UserRole = 'admin' | 'researcher' | 'owner';

export default function NewUserForm() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole,
  });

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

  const handleSubmit = () => {
    console.log('New user data:', { ...formData, image });
    // Add your user registration logic here
    router.back();
  };

  return (
    <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
    >
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
        value={formData.name}
        onChangeText={text => setFormData({...formData, name: text})}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        label="Username"
        value={formData.name}
        onChangeText={text => setFormData({...formData, name: text})}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        label="Email Address"
        value={formData.email}
        onChangeText={text => setFormData({...formData, email: text})}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.row}>
        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={text => setFormData({...formData, password: text})}
          style={[styles.input, styles.halfWidth]}
          secureTextEntry
        />

        <TextInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={text => setFormData({...formData, confirmPassword: text})}
          style={[styles.input, styles.halfWidth]}
          secureTextEntry
        />
      </View>

      <Menu
        visible={showRoleMenu}
        onDismiss={() => setShowRoleMenu(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setShowRoleMenu(true)}
            style={styles.roleButton} 
            labelStyle={{color: '#333'}}
            icon="account-settings"
          >
            {formData.role || 'Select Role'}
          </Button>
        }
      >
        <Menu.Item
          title="Administrator"
          onPress={() => {
            setFormData({...formData, role: 'admin'});
            setShowRoleMenu(false);
          }}
        />
        <Menu.Item
          title="Researcher"
          onPress={() => {
            setFormData({...formData, role: 'researcher'});
            setShowRoleMenu(false);
          }}
        />
        <Menu.Item
          title="Tree Owner"
          onPress={() => {
            setFormData({...formData, role: 'owner'});
            setShowRoleMenu(false);
          }}
        />
      </Menu>

      <View style={styles.buttonGroup}>
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          style={styles.primaryButton}
          //labelStyle={styles.buttonLabel}
          icon="account-plus"
        >
          Register User
        </Button>
      </View>
    </ScrollView>
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
    padding: 20,
    paddingBottom: 40, 
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
  },
});