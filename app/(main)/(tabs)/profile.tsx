import { useAuth } from '../../../context/AuthContext';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  // Get initials for avatar
  const getInitials = () => {
    if (!user?.username) return 'GU';
    const names = user.username.split(' ');
    return names.map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }; 

  // Handle logout
  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  }

  return (
    <View style={styles.container}>
      <Avatar.Text 
        size={80} 
        label={getInitials()} 
        style={styles.avatar}
        color="#ffffff"
        theme={{ colors: { primary: '#2ecc71' } }}
      />
      
      <Text variant="titleLarge" style={styles.name}>
        {user?.username || 'Guest User'}
      </Text>
      
      <Text variant="bodyMedium" style={styles.email}>
        {user?.email || 'No email provided'}
      </Text>

      <Button 
        mode="contained" 
        onPress={handleLogout}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        icon="logout"
      >
        Logout
      </Button>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Settings</Text>

        <Button 
          mode="text"
          style={styles.settingButton}
          icon="bell"
          textColor="#333"
        >
          Notification Preferences
        </Button>

        <Button 
          mode="text"
          style={styles.settingButton}
          icon="account-cog"
          textColor="#333"
        >
          Account Settings
        </Button>

        <Button 
          mode="text"
          style={styles.settingButton}
          icon="palette"
          textColor="#333"
        >
          Appearance
        </Button>

        <Button 
          mode="text"
          style={styles.settingButton}
          icon="history"
          textColor="#333"
        >
          Track History
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
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 15,
    backgroundColor: '#2ecc71',
  },
  name: {
    marginBottom: 5,
    color: '#333',
    fontWeight: '600',
  },
  email: {
    marginBottom: 20,
    color: '#666',
    fontSize: 14,
  },
  button: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#2ecc71',
    marginBottom: 30,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    width: '100%',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  sectionTitle: {
    color: '#2ecc71',
    fontWeight: 'bold',
    marginBottom: 15,
    paddingLeft: 8,
  },
  settingButton: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 8,
  },
});