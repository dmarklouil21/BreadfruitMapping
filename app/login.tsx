// app/login.tsx
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState(''); // Add username state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement authentication logic
    login({
      username: username,
      email: email,
      role: (username === 'admin' ? 'admin' : username === 'owner' ? 'viewer' : 'researcher'),
      token: 'demo-token'
    });

    if (username === 'admin')
      router.navigate('/admin/(tabs)');
    else if(username === 'researcher')
      router.navigate('/main/(tabs)');
    else 
      router.navigate('/main/(tabs)/map'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name="account-circle" 
          size={80} 
          color="#2ecc71" 
        />
      </View>

      <Text variant="headlineMedium" style={styles.title}>KULO Login</Text>
      
      <TextInput
        label="Email or Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" />}
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
      />
      
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button}
        labelStyle={{ color: 'white' }}
      >
        Sign In
      </Button>
      
      <Link href="/register" asChild>
        <Button mode="text" textColor="#666">
          Don't have an account? Register
        </Button>
      </Link>
    </View>
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
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

