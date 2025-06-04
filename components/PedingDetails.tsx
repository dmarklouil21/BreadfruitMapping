// components/UserProfile.tsx
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
// import { View } from '../app/(admin)/users/edit/[id]';

// Add User type
/* type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  image?: string;
}; */

export default function PendingUserProfile({ user }:{ user: User}) {
  // const { user } = useAuth(); // Assuming we're viewing current user's profile

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.avatarContainer}>
          {user?.image ? (
            <Image 
              source={{ uri: user.image }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialCommunityIcons name="account" size={40} color="#666" />
            </View>
          )}
          <Text variant="titleLarge" style={styles.title}>
            {user?.name || 'Anonymous User'}
          </Text>
          <Text style={styles.roleBadge}>
            {user?.role?.toUpperCase() || 'USER'}
          </Text>
        </View>

        {/* Details Card */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="email" size={20} color="#2ecc71" />
              <Text style={styles.detailText}>{user?.email || 'No email provided'}</Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="account-cog" size={20} color="#2ecc71" />
              <Text style={styles.detailText}>
                {user?.role === 'admin' ? 'Administrator' : 
                 user?.role === 'researcher' ? 'Researcher' : 'Tree Owner'}
              </Text>
            </View>

            {user?.dateJoined && (
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="calendar" size={20} color="#2ecc71" />
                <Text style={styles.detailText}>
                  Requested: {new Date(user.dateJoined).toLocaleDateString()}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Link href={{
            pathname: `/admin/user/edit/${user.id}`,
                /* params: {
                  id: user.id,
                  name: user.name,
                  username: user.username,
                  email: user.email,
                  dateJoined: user.dateJoined,
            } */
          }} 
          asChild
          >
            <Button 
              mode="contained" 
              style={styles.button}
              //labelStyle={styles.buttonLabel}
            >
              Approve
            </Button>
          </Link>

          <Button 
            mode="contained" 
            style={[styles.button, styles.adminButton]}
            //labelStyle={styles.buttonLabel}
            onPress={() => console.log('Admin action')}
          >
              Reject
        </Button>
          
          {/* {user?.role === 'admin' && (
            
          )} */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: '#f0faf3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#2ecc71',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsCard: {
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    backgroundColor: '#fff',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 16,
  },
  button: {
    borderRadius: 25,
    backgroundColor: '#2ecc71',
  },
  adminButton: {
    backgroundColor: '#333',
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});