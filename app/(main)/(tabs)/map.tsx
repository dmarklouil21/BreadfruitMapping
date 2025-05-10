// app/(tabs)/map.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FAB } from 'react-native-paper';
import TreeDetailsModal from '../../../components/TreeDetailsModal';
import { useTreeData } from '../../../hooks/useTreeData';
import { Tree } from '../../../types';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapScreen() {
  const { trees } = useTreeData();
  const params = useLocalSearchParams();
  const [region, setRegion] = useState({
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }); 
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  useEffect(() => {
    if (params.lat && params.lng) {
      setRegion({
        latitude: Number(params.lat),
        longitude: Number(params.lng),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [params.lat, params.lng]); // Only track lat/lng changes

  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const mockTrees = [
    {
      id: 1,
      latitude: 10.3157,
      longitude: 123.8854,
      height: 5.2,
      diameter: 0.45,
      harvestDate: '2024-03-15',
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} 
        onRegionChangeComplete={(newRegion) => {
          // Only update if user manually moved the map
          if (!params.lat && !params.lng) {
            setRegion(newRegion);
          }
        }}
      >
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            coordinate={tree.coordinates}
            onPress={() => {
              setSelectedTree(tree);
              setRegion({
                ...tree.coordinates,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
              setModalVisible(true);
            }}
          />
        ))}
      </MapView>

      <FAB
        icon="camera"
        style={styles.fab}
        color="white"
        customSize={56}
        onPress={() => router.navigate('/camera')}
      />

      <TreeDetailsModal
        visible={modalVisible}
        tree={selectedTree || undefined}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    elevation: 2,
    backgroundColor: '#2ecc71',
    borderRadius: 50,
  },
});