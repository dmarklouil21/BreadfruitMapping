import { Stack, Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Searchbar, Text, Card, FAB } from 'react-native-paper';
import { useTreeData } from '@/hooks/useTreeData';
import { LocationFilter } from '@/components/LocationFilter';
import { Tree } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useAuth } from '@/context/AuthContext';

const TreeCard = ({ tree }: { tree: Tree }) => (
  <Link
    href={{
      pathname: './map',
      params: {
        lat: tree.coordinates.latitude,
        lng: tree.coordinates.longitude,
        treeId: tree.id
      }
    }}
    asChild
  >
    <Pressable>
      <Card style={styles.treeCard}>
        <Card.Content>
          <Text style={styles.treeID}>
            <MaterialCommunityIcons name="tree" size={16} color="#2ecc71" />
            {'  '}Tree #{tree.id}
          </Text>
          <Text style={styles.treeDetail}>
            <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
            {'  '}{tree.city}
          </Text>
        </Card.Content>
      </Card>
    </Pressable>
  </Link>
);

export default function TreeListScreen() {
  const { trees, isLoading, error } = useTreeData(); // Custom hook for data fetching
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All'); 
  const router = useRouter();
  const { user } = useAuth(); 

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

  // if (isLoading) return <LoadingView />;
  if (error) return <ErrorView message={error} />;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        <MaterialCommunityIcons name="tree" size={24} color="#2ecc71" />
        {'  '}{user?.role === 'researcher' ? ('Tree Management') : ('Breadfruit Trees')}
      </Text>

      {/* <LocationFilter
        selected={selectedLocation}
        onSelect={setSelectedLocation}
        locations={locations}
      /> */}

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
      {user?.role === 'researcher' && (
        <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => router.push('../tree/add-tree')} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'stretch',
    padding: 20,
    // paddingVertical: 16,
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
  searchBar: {
    // marginTop: 0,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    elevation: 1,
    // height: 45,
  },
  searchInput: {
    color: '#333',
    fontSize: 14,
  },
  /* filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  }, */
  treeCard: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 12,
    // padding: 5,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
    // marginHorizontal: 16,
    // width: '100%',
    // alignSelf: 'center',
  },
  treeID: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  treeDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    // marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    // marginTop: 40,
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