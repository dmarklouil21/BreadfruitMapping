import UserCard from '@/components/UserCard';
import { useUserData } from '@/hooks/useUserData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Chip, Text } from 'react-native-paper';


const RoleFilter = ({ selected, onSelect }: { 
  selected: string, 
  onSelect: (role: string) => void }) => {
  const roles = ['All', 'admin', 'researcher'];
  
  return (
    <View style={styles.filterContainer}>
      {roles.map(role => (
        <Chip
          key={role}
          mode="outlined"
          onPress={() => onSelect(role)}
          style={[
            styles.filterChip, 
            selected === role && styles.activeFilterChip
        ]}
          textStyle={[
            styles.filterTextChip, 
            selected === role && styles.activeFilterTextChip
            ]}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Chip>
      ))}
    </View>
  );
};

export default function PendingRequest() {
  const { users, isLoading } = useUserData({
    mode: 'criteria',
    field: 'status',
    operator: '==',
    value: 'pending',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'All' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color='#2ecc71' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RoleFilter selected={selectedRole} onSelect={setSelectedRole} />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.uid}
        renderItem={({ item }) => <UserCard user={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-remove" size={40} color="#888" />
            <Text style={styles.emptyText}>No users found matching criteria</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 22,
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    elevation: 1,
  },
  searchInput: {
    color: '#333',
    fontSize: 14,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  userName: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  userDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRole: {
    color: '#2ecc71',
    fontWeight: '500',
    fontSize: 14, 
    backgroundColor: '#f0faf3',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  userJoined: {
    color: '#888',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 24,
  }, 
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    borderRadius: 8,
    borderColor: '#2ecc71',
  },
  filterTextChip: {
    color: '#2ecc71',
    fontSize: 12,
  }, 
  activeFilterChip: {
    backgroundColor: '#2ecc71',
  },
  activeFilterTextChip: {
    color: 'white',
  }, 
});