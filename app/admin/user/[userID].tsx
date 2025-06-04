// app/(admin)/users/[id].tsx
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import UserProfile from '@/components/UserProfile';
import UserEditForm from '@/components/UserEditForm';
import { mockUsers } from '@/data/mockUsers';
import { Button, Text } from 'react-native-paper';

export default function UserProfileScreen() {
  const { userID } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const user = mockUsers.find(u => u.id === userID);

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserProfile user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#2ecc71',
    borderRadius: 8,
  },
  editButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
});