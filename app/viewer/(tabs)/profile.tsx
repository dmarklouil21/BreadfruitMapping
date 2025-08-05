import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Get initials for avatar
  const getInitials = () => {
    if (!user?.name) return 'GU';
    const names = user.name.split(' ');
    return names.map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }; 

  // Handle logout
  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {user?.image ? (
        <Avatar.Image 
          size={80} 
          source={{ uri: user.image }} 
          style={styles.avatar}
        />
      ) : (
        <Avatar.Text 
          size={80} 
          label={getInitials()} 
          style={styles.avatar}
          color="#ffffff"
          theme={{ colors: { primary: '#2ecc71' } }}
        />
      )}
      {/* <Avatar.Text 
        size={80} 
        label={getInitials()} 
        style={styles.avatar}
        color="#ffffff"
        theme={{ colors: { primary: '#2ecc71' } }}
      /> */}
      
      <Text variant="titleLarge" style={styles.name}>
        {user?.name || 'Guest User'}
      </Text>
      
      <Text variant="bodyMedium" style={styles.email}>
        {user?.email || 'No email provided'}
      </Text>

      <Button 
        mode="contained" 
        onPress={() => router.navigate(`../user/edit/${user?.uid}`)}
        style={styles.button}
        icon="account-edit"
      >
        Edit Profile
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

        {/* <Button 
          mode="text"
          style={styles.settingButton}
          icon="history"
          textColor="#333"
        >
          Track History
        </Button> */}

        <Button 
          mode="text"
          style={styles.settingButton}
          icon="logout"
          textColor="#333"
          onPress={handleLogout}
        >
          Logout
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
    borderRadius: 25,
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