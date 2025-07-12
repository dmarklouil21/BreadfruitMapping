import { LoadingAlert, NotificationAlert } from "@/components/NotificationModal";
import { functions } from "@/firebaseConfig";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { httpsCallable } from "firebase/functions";
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';


export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const { type } = useLocalSearchParams();

  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

  const handleRegister = async () => {
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
      const result = await createNewUser({
        name: name,
        email: email,
        password: password1,
        role: type.toString(),
        image: image,
        status: type.toString() === 'viewer' ? 'verified' : 'pending',
        joined: new Date().toISOString(),
      });

      setNotificationVisible(true);
      setNotificationMessage('Your registration is successfull.');
      setNotificationType('success');
    } catch (error: any) {
      alert("Registration failed: " + error.message);
      console.error("Firebase error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.container}>
          <LoadingAlert visible={loading} message="Please wait..." />
          <NotificationAlert
            visible={notificationVisible}
            message={notificationMessage}
            type={notificationType}
            onClose={() => setNotificationVisible(false)}
          />
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="account-plus" 
              size={80} 
              color="#2ecc71" 
            />
          </View>

          <Text variant="headlineMedium" style={styles.title}>{toTitleCase(type.toString())}</Text>
          
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            autoCapitalize="none"
            left={<TextInput.Icon icon="account-edit" />}
          />
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />
          
          <TextInput
            label="Password"
            value={password1}
            onChangeText={setPassword1}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          <TextInput
            label="Confirm Password"
            value={password2}
            onChangeText={setPassword2}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />
          
          <Button 
            mode="contained" 
            onPress={handleRegister} 
            style={styles.button}
            disabled={loading}
          >
            Create Account
          </Button>
          
          <Link href="/login" asChild>
            <Button mode="text" textColor="#666">
              Already have an account? Login
            </Button>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  button: {
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#2ecc71',
  },
});

