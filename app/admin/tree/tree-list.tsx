import TreeCard from '@/components/TreeCard';
import { useTreeData } from '@/hooks/useTreeData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Chip, FAB, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';


const TreeFilter = ({ selected, onSelect }: { 
  selected: string, 
  onSelect: (status: string) => void }) => {
  const fruitStatus = ['All', 'ripe', 'unripe', 'none'];
  
  return (
    <View style={styles.filterContainer}>
      {fruitStatus.map(status => (
        <Chip
          key={status}
          mode="outlined"
          onPress={() => onSelect(status)}
          style={[
            styles.filterChip, 
            selected === status && styles.activeFilterChip
        ]}
          textStyle={[
            styles.filterTextChip, 
            selected === status && styles.activeFilterTextChip
            ]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Chip>
      ))}
    </View>
  );
};

export default function TreeListScreen() {
  const { trees, isLoading, error } = useTreeData(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All'); 
  const router = useRouter();

  const filteredTrees = useMemo(() => {
    return trees.filter(tree => {
      const matchesFruitStatus = selectedStatus === 'All' || tree.fruitStatus === selectedStatus;
      const matchesSearch = tree.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFruitStatus && matchesSearch;
    });
  }, [trees, searchQuery, selectedStatus]); 

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TreeFilter selected={selectedStatus} onSelect={setSelectedStatus} />

        <FlatList
          data={filteredTrees}
          keyExtractor={item => item.treeID}
          renderItem={({ item }) => <TreeCard tree={item} stringPath={`./details/${item.treeID}`}/>}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="tree" size={40} color="#888" />
              <Text style={styles.emptyText}>No matching trees found</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        <FAB
          icon="filter"
          style={styles.fab}
          color="white"
          onPress={() => router.push('../tree/add-tree')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: -38,
    // padding: 20,
    backgroundColor: '#ffffff',
  },
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
    marginBottom: 15,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
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
    bottom: 45,
    // bottom: 0,
    backgroundColor: '#2ecc71',
    borderRadius: 50,
  },
});