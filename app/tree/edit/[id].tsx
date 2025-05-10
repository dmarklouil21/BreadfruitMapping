// app/tree/edit/[id].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import TreeForm from '@/components/TreeForm';

export default function EditTreeScreen() {
  const params = useLocalSearchParams();
  
  // Parse coordinates from stringified JSON
  const coordinates = JSON.parse(params.coordinates as string);
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TreeForm 
          initialValues={{
            id: params.id as string,
            location: params.location as string,
            diameter: parseFloat(params.diameter as string),
            dateTracked: params.dateTracked as string,
            coordinates: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            }
          }}
        />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
});