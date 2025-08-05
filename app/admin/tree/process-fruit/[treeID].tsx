import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function ProcessTreeFruit() {
  const { treeID } = useLocalSearchParams();
  // const tree = mockTrees.find(u => u.id === treeID);
  // const [formData, setFormData] = useState(initialValues);
  // const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [image, setImage] = useState('');

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
      //  setFormData({...formData, image: result.assets[0].uri});
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const handleSubmit = () => {
    console.log('Updated user data:');
    // Add your update logic here
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="add-a-photo" size={40} color="#2ecc71" />
            <Text style={styles.imageLabel}>Choose an Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        label="Breadfruit ID"
        // value={tree?.id}
        // onChangeText={text => setFormData({...formData, name: text})}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        label="Location"
        // value={tree?.city}
        // onChangeText={text => setFormData({...formData, username: text})}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        label="Diameter"
        // value={tree?.diameter.toString()}
        //onChangeText={text => setFormData({...formData, email: text})}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        label="Fruit Status"
        // value={tree?.fruitStatus}
        //onChangeText={text => setFormData({...formData, email: text})}
        style={styles.input}
        autoCapitalize="none"
      />

      {/* <Menu
        visible={showRoleMenu}
        onDismiss={() => setShowRoleMenu(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setShowRoleMenu(true)}
            style={styles.roleButton}
            labelStyle={{ color: formData.role ? '#2ecc71' : '#333' }}
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
            setFormData({...formData, role: 'viewer'});
            setShowRoleMenu(false);
          }}
        />
      </Menu> */}

      <View style={styles.buttonGroup}>
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          style={styles.secondaryButton}
          //labelStyle={styles.buttonLabel}
          icon="image-auto-adjust"
        >
          Process Fruit Image
        </Button>

        <Button 
          mode="contained" 
          onPress={() => console.log('Password change logic here')}
          style={styles.primaryButton}
          //labelStyle={styles.buttonLabel}
          icon="content-save"
        >
          Send Result
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
  input: {
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  buttonGroup: {
    gap: 12,
    marginTop: 25,
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
    borderColor: '#2ecc71',
    marginBottom: 16,
  },
});