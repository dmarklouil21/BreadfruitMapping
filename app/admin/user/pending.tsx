import { useState, useMemo, use } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Card, Text, Searchbar, Button, Chip } from 'react-native-paper';
import { Link, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
// import { mockUsers } from '@/data/mockUsers';

const mockUsers = [
  { id: '1', name: 'Mortred', email: 'mortred@ctu.edu', role: 'researcher', requested: '2023-01-15'},
  { id: '2', name: 'Yaphets', email: 'yaphets@ctu.edu', role: 'researcher', requested: '2023-03-22'},
  { id: '3', name: 'Nortrom', email: 'nortrom@ctu.edu', role: 'researcher', requested: '2023-05-10'},
];

const UserCard = ({ user }: { user: typeof mockUsers[0] }) => (
  <Link href={`/admin/user/pending-info/${user.id}`} asChild>
    <Pressable>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.userHeader}>
            <MaterialCommunityIcons 
              name='account'
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
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Text>
            <Text style={styles.userJoined}>
                Requested: {new Date(user.requested).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  </Link>
);

/* const RoleFilter = ({ selected, onSelect }: { 
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
}; */

export default function PendingRequest() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'All' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, selectedRole]);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        <MaterialCommunityIcons name="account-clock" size={24} color="#2ecc71" />
        {'  '}Pending Registration
      </Text>

      {/* <Searchbar
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor="#2ecc71"
        placeholderTextColor="#999"
      /> */}

      {/* <RoleFilter selected={selectedRole} onSelect={setSelectedRole} /> */}

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
    // backgroundColor: '#2ecc71'
  },
  filterTextChip: {
    color: '#2ecc71',
    fontSize: 12,
  }, 
  activeFilterChip: {
    // color: 'white',
    backgroundColor: '#2ecc71',
  },
  activeFilterTextChip: {
    color: 'white',
  },
});