import TreeCard from '@/components/TreeCard';
import { useTreeData } from '@/hooks/useTreeData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';


export default function TreeListScreen() {
  const { trees, isLoading, error } = useTreeData(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All'); 
  const router = useRouter();

  const filteredTrees = useMemo(() => {
    return trees.filter(tree => {
      const matchesLocation = selectedLocation === 'All' || tree.city === selectedLocation;
      const matchesSearch = tree.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLocation && matchesSearch;
    });
  }, [trees, searchQuery, selectedLocation]); 

  const locations = useMemo(() => {
    const allLocations = trees.map(tree => tree.city);
    return ['All', ...new Set(allLocations)];
  }, [trees]);

  const LoadingView = () => (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={{ textAlign: 'center' }}>Loading trees...</Text>
    </View>
  );
  
  const ErrorView = ({ message }: { message: string }) => (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );

  if (error) return <ErrorView message={error} />;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        <MaterialCommunityIcons name="tree" size={24} color="#2ecc71" />
        {'  '}Tree Management
      </Text>

      <FlatList
        data={filteredTrees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TreeCard tree={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="tree" size={40} color="#888" />
            <Text style={styles.emptyText}>No matching trees found</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => router.push('../tree/add-tree')} 
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
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 22,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2ecc71',
    borderRadius: 50,
  },
});