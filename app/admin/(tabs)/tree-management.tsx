import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, FAB, Text } from 'react-native-paper';

export default function TreeManagementScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}> 
      <Text variant="titleLarge" style={styles.title}>
        <MaterialCommunityIcons name="forest" size={24} color="#2ecc71" />
        {'  '}Tree Management
      </Text>

      {/* Role Statistics Grid */}
      <View style={styles.gridContainer}>
        <Link href={'/admin/tree/tree-list'} asChild>
          <Pressable style={styles.gridItem}>
            <Card style={[styles.card, styles.primaryCard]}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  <MaterialCommunityIcons name="forest" size={20} color="#2ecc71" />
                  {'  '}Trees Tracked
                </Text>
                <Text variant="displayMedium" style={styles.primaryStat}>1</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>

        <Link href={'/admin/user/pending'} asChild>
          <Pressable style={styles.gridItem}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  <MaterialCommunityIcons name="clock" size={20} color="#2ecc71" />
                  {'  '}Pending Approvals
                </Text>
                <Text variant="displayMedium" style={styles.primaryStat}>15</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => router.push('/admin/tree/add-tree')} 
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridItem: {
    width: '48%', // Allows 2 items per row with gap
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
    minHeight: 120,
  },
  primaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  cardTitle: {
    color: '#2ecc71',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  primaryStat: {
    color: '#2ecc71',
    fontWeight: 'bold',
    fontSize: 28,
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