import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';


export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both username and password');
      return;
    }
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser?.status !== 'verified') {
        alert('Your staff account is still pending for verification');
        return;
      }
    } catch (e) {
      alert('Invalid username or password');
    } finally {
      setLoading(false);
    }
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

      <Text variant="headlineMedium" style={styles.title}>
        Breadfruit Tracker
      </Text>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
        ) : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
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
        disabled={loading}
      > 
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          'Sign In'
        )}
      </Button>

      <Link href="./register/user-type" asChild>
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
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

