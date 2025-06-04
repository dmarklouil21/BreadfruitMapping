// app/main/tree/edit/[userID].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import PendingUserProfile from '@/components/PedingDetails';
import { mockUsers } from '@/data/mockUsers';

export default function PendingScreen() {
  const { userID } = useLocalSearchParams();
  const user = mockUsers.find(u => u.id === userID);
  
  if (!user) {
    return (
      <View style={styles.scrollContainer}>
        <Text>User not found.</Text>
      </View>
    );
  }
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PendingUserProfile user={user} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
});