import { mockTrees } from '@/data/mockTrees';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function TreeForm() {
  const { treeID } = useLocalSearchParams();
  const tree = mockTrees.find(u => u.id === treeID);

  return (
    <View style={styles.container}>
      <TextInput
        label="City Location"
        value={tree?.city || 'Somewhere down the road'}
        style={styles.input}
      />
      
      <TextInput
        label="Diameter (m)"
        value={tree?.diameter.toString() || '12 inches'}
        //onChangeText={text => setFormData({...formData, diameter: parseFloat(text)})}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Date Tracked"
        value={tree?.dateTracked.toString() || 'Someday'}
        // onChangeText={text => setFormData({...formData, dateTracked: new Date(text).toLocaleDateString()})}
        style={styles.input}
      />

      <TextInput
        label="Fruit Status"
        value={tree?.fruitStatus || 'hinog'}
        // onChangeText={text => setFormData({...formData, fruitStatus: text as 'ripe' | 'unripe' | 'none'})}
        style={styles.input}
      />
      
      <View style={styles.buttonGroup}>
        <Button 
          mode="contained" 
          // onPress={() => console.log('Submit updated data:', formData)}
          style={styles.primaryButton}
          //labelStyle={styles.buttonLabel}
          icon="content-save"
        >
          Save Changes
        </Button>

        <Button 
          mode="contained" 
          // onPress={() => console.log('Image processing in progress:', formData)}
          style={styles.secondaryButton}
          //labelStyle={styles.buttonLabel}
          icon="image-auto-adjust"
        >
          Process Image
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  input: {
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  }, 
  buttonGroup: {
    gap: 12,
    marginTop: 25,
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 25,
  },
  secondaryButton: {
    borderRadius: 25,
    backgroundColor: '#333',
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});