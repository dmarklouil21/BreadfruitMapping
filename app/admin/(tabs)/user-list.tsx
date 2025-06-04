import { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Card, Text, FAB, Chip } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useUserData } from '@/hooks/useUserData';
import { User } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@ctu.edu', role: 'admin', joined: '2023-01-15' },
  { id: '2', name: 'Researcher 1', email: 'researcher1@ctu.edu', role: 'researcher', joined: '2023-03-22' },
  { id: '3', name: 'Tree Owner 1', email: 'owner1@ctu.edu', role: 'owner', joined: '2023-05-10' },
];

const UserCard = ({ user }: { user: User }) => (
  <Link href={`/admin/user/${user.id}`} asChild>
    <Pressable>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.userHeader}>
            <MaterialCommunityIcons 
              name={user.role === 'admin' ? 'shield-crown' : user.role === 'researcher' ? 'flask' : 'pine-tree'}
              size={24}
              color="#2ecc71"
            />
            <Text variant="titleMedium" style={styles.userName}>
              {user.name}
            </Text>
          </View>
          
          <Text style={styles.userDetail}>
            <MaterialCommunityIcons name="email" size={14} color="#666" />
            {'  '}{user.email}
          </Text>
          
          <View style={styles.userMeta}>
            <Text style={styles.userRole}>
              {user.role}
            </Text>
            <Text style={styles.userJoined}>
              Joined: {new Date(user.dateJoined).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  </Link>
);

const RoleFilter = ({ selected, onSelect }: { 
  selected: string, 
  onSelect: (role: string) => void 
}) => {
  const roles = ['All', 'admin', 'researcher', 'owner'];
  
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

export default function UserListScreen() {
  const { users, error } = useUserData(); // Custom hook for data fetching
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const router = useRouter();

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'All' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        <MaterialCommunityIcons name="account-group" size={24} color="#2ecc71" />
        {'  '}Account Management
      </Text>

      <RoleFilter selected={selectedRole} onSelect={setSelectedRole} />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <UserCard user={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-remove" size={40} color="#888" />
            <Text style={styles.emptyText}>No users found matching criteria</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => router.push('/admin/user/add-user')} 
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2ecc71',
    borderRadius: 50,
  },
});