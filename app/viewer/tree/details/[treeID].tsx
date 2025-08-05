import { useAuth } from '@/context/AuthContext';
import { Tree } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function TreeDetailsModal({ visible, tree, onClose }: {
  visible: boolean;
  tree?: Tree;
  onClose: () => void;
}) {
  const { user } = useAuth(); // Access user context if needed

  if (!tree) return null; // Early return if no tree data is provided

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Image Section */}
          {tree.image ? (
            <Image 
              source={{ uri: tree.image }}
              style={styles.treeImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.treeImage, styles.imagePlaceholder]}>
              <MaterialIcons name="no-photography" size={40} color="#666" />
            </View>
          )}

          {/* Details Card */}
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.title}>
                Breadfruit Tree #{tree.treeID}
              </Text>

              <View style={styles.detailRow}>
                <MaterialIcons name="location-on" size={20} color="#2ecc71" />
                <Text style={styles.detailText}>{tree.city}</Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Diameter</Text>
                    <Text style={styles.statValue}>{tree.diameter.toFixed(2)}m</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Tracked Date</Text>
                  <Text style={styles.statValue}>
                    {new Date(tree.dateTracked).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Fruit Status</Text>
                  <Text style={styles.statValue}>{tree.fruitStatus}</Text>
                </View>
              </View>

              <View style={styles.coordinateContainer}>
                <MaterialIcons name="map" size={20} color="#2ecc71" />
                <Text style={styles.coordinateText}>
                  {tree.coordinates.latitude.toFixed(6)}, 
                  {tree.coordinates.longitude.toFixed(6)}
                </Text>
              </View>
            </Card.Content>
          </Card>

         {/*  <Button 
            mode="contained" 
            onPress={onClose}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Close Details
          </Button> */}
          <View style={styles.buttonGroup}>
            <Link
              href={{
                pathname: `/researcher/tree/process-fruit/${tree.treeID}`, 
              } as any}
              asChild
            >
              <Button 
                mode="contained" 
                style={styles.button}
                // labelStyle={styles.buttonLabel}
              >
                Send Notification
              </Button>
            </Link>
            {/* {user?.role === 'researcher' ? (
              <Link
                href={{
                  pathname: `/main/tree/edit/${tree.id}`,
                }}
                asChild
              >
                <Button 
                  mode="contained" 
                  style={styles.button}
                  //labelStyle={styles.buttonLabel}
                >
                  Update Details
                </Button>
              </Link>
            ) : (
              <Link
                href={{
                  pathname: `/main/tree/process-fruit/${tree.id}`, 
                }}
                asChild
              >
                <Button 
                  mode="contained" 
                  style={styles.button}
                  // labelStyle={styles.buttonLabel}
                >
                  Send Attachment
                </Button>
              </Link>
            )} */} 
            <Button 
              mode="contained" 
              onPress={onClose}
              style={[styles.button, styles.updateButton]}
              //labelStyle={styles.buttonLabel}
            >
              Close Details
            </Button>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  treeImage: {
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  coordinateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: '#2ecc71',
  },
  updateButton: {
    backgroundColor: '#333', // Different color for update action
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
});