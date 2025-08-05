import { useAuth } from '@/context/AuthContext';
import { useTreeData } from '@/hooks/useTreeData';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text, TextInput } from 'react-native-paper';


export default function SearchScreen() {
  const { trees } = useTreeData();
  const [searchQuery, setSearchQuery] = useState('');
  const [ isFocuesd, setIsFocused ] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const filteredTrees = useMemo(() => {
    return trees.filter(tree => 
      tree.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.treeID.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search for trees..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={
            <TextInput.Icon 
              icon={() => (
                <MaterialIcons name="arrow-back" size={24} color="#666" />
              )}
              onPress={() => router.back()}
            />
          }
          // onSubmitEditing={handleSearch}
          mode="outlined"
          outlineColor="transparent"
          activeOutlineColor="transparent"
          cursorColor='#2ecc71'
          theme={{
            colors: {
              primary: '#2ecc71',
              background: '#ffffff',
              text: '#000000',
            }
          }}
        />
      </View>

      <FlatList
        data={filteredTrees}
        keyExtractor={item => item.treeID}
        renderItem={({ item }) => (
          <Card 
            style={styles.card}
            onPress={() => router.push({
              pathname: `./details/${item.treeID}`,
              params: {
                lat: item.coordinates.latitude,
                lng: item.coordinates.longitude
              }
            })}
          >
            <Card.Content>
              <Text style={styles.treeIdText}>
                <MaterialCommunityIcons name="tree" size={16} color="#2ecc71" />
                {'  '}{item.treeID}
              </Text>
              <Text style={styles.location}>
                <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
                {' '}{item.city}
              </Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No trees found</Text>
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
  searchBar: {
    marginTop: 25,
    marginBottom: 16,
    elevation: 1,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  }, 
  searchInput: {
    backgroundColor: 'transparent',
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  location: {
    color: '#666',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  }, 
  treeIdText: { 
    fontSize: 16,
    fontWeight: '600', 
    color: '#333',
    marginBottom: 4, 
  },
});