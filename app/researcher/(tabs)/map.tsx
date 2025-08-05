import { useTreeData } from '@/hooks/useTreeData';
import { Tree } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Text, TextInput } from 'react-native-paper';
import TreeDetailsModal from '../tree/details/[treeID]';
// import debounce from 'lodash.debounce';

export default function MapScreen() {
  const { trees, isLoading, error } = useTreeData();
  const params = useLocalSearchParams();
  const { width, height } = Dimensions.get('window');
  const [region, setRegion] = useState({
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 1.5, //0.0922,
    longitudeDelta: 1.5 * (width / height), //0.0421,
  }); 
  const [searchQuery, setSearchQuery] = useState('');
  const [droppedPin, setDroppedPin] = useState<{
    coordinate: { latitude: number; longitude: number };
    title?: string;
  } | null>(null);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }
    // Implement geocoding or tree search here
    try{
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please enable location services to search',
          [{ text: 'OK' }]
        );
        return;
      }
      const geocode = await Location.geocodeAsync(searchQuery.trim());
      if (geocode.length > 0) {
        setRegion({
          latitude: geocode[0].latitude,
          longitude: geocode[0].longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
       //setSearchQuery('');
      }
    }
    catch (error) {
      console.error('Error searching for location:', error);
      Alert.alert(
        'Search failed',
        'Could not find this location. Please try a different search term.'
      );
    }
    finally {
      setSearchQuery(''); // Clear search input after search
    }
  };

  return (
    <View style={styles.container}> 
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search for locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={
            <TextInput.Icon 
              icon={() => (
                <MaterialIcons name="location-on" size={24} color="#D32F2F" />
              )}
            />
          }
          onSubmitEditing={handleSearch}
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
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onLongPress={(e) => {
          setDroppedPin({
            coordinate: e.nativeEvent.coordinate,
            title: 'New Tree',
          })
        }}
        showsCompass={false}
        region={region} 
        onRegionChangeComplete={(newRegion) => {
          // Only update if user manually moved the map
          if (!params.lat && !params.lng) {
            setRegion(newRegion);
          }
        }}
      >
        {(trees || []).map((tree) => (
          <Marker
            key={tree.treeID}
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
        {/* Dropped Pin Marker */}
        {droppedPin && (
          <Marker
            coordinate={droppedPin.coordinate}
            title={droppedPin.title}
            draggable
            onDragEnd={(e) => setDroppedPin({
              ...droppedPin,
              coordinate: e.nativeEvent.coordinate
            })}
          >
          </Marker>
        )}
      </MapView>
      {droppedPin && (
          <View style={styles.pinConfirmation}>
          <Text>Add New Tree at this location?</Text>
          <View style={styles.pinButtons}>
            <Button 
              mode="contained" 
              onPress={() => {
                router.push({
                  pathname: '../tree/add-tree',
                  params:{
                    latitude: droppedPin.coordinate.latitude,
                    longitude: droppedPin.coordinate.longitude,
                    // Add any other data you need:
                    initialTitle: droppedPin.title || 'New Mark Tree'
                  }
                });
                setDroppedPin(null);
              }}
              style={styles.confirmButton}
            >
              Confirm
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => setDroppedPin(null)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      )}
      {/* <FAB
        icon="camera"
        style={styles.fab}
        color="white"
        customSize={56}
        onPress={() => router.push('../camera')}
      /> */}
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
  searchBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 1,
    elevation: 3,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 25,
  }, 
  searchInput: {
    backgroundColor: 'transparent',
    height: 48,
    fontSize: 16,
    borderRadius: 25,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pinConfirmation: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  }, 
  pinButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  }, 
  confirmButton: {
    backgroundColor: '#2ecc71',
    flex: 1,
    marginRight: 10,
  }, 
  cancelButton: {
    flex: 1,
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