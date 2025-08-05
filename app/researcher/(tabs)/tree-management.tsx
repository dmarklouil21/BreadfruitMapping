import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { collection, getCountFromServer, getFirestore, query, QueryConstraint, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, FAB, Text } from 'react-native-paper';

export default function TreeManagementScreen() {
  const router = useRouter();
  const [allTrees, setAllTrees] = useState(0);
  const [pendings, setPendings] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const db = getFirestore();
  
  const fetchAllCounts = async () => {
    const fetchCount = async (collectionName: string, filters: QueryConstraint[] = []) => {
      const baseCollection = collection(db, collectionName);
      const finalQuery = filters.length > 0 ? query(baseCollection, ...filters) : baseCollection;
      const snapshot = await getCountFromServer(finalQuery);
      return snapshot.data().count;
    };

    try {
      setRefreshing(true);
      const [allTreesCount, pendingCount] = await Promise.all([
        fetchCount('trees', [where('status', '==', 'verified')]),
        fetchCount('trees', [where('status', '==', 'pending')]),
      ]);

      setAllTrees(allTreesCount);
      setPendings(pendingCount);
    } catch (error) {
      console.error("Failed to fetch tree counts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllCounts();
  }, []);
  
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchAllCounts} />
      }  
    > 
      <Text variant="titleLarge" style={styles.title}>
        <MaterialCommunityIcons name="forest" size={24} color="#2ecc71" />
        {'  '}Tree Management
      </Text>

      {/* Role Statistics Grid */}
      <View style={styles.gridContainer}>
        <Link href={'/researcher/tree/tree-list'} asChild>
          <Pressable style={styles.gridItem}>
            <Card style={[styles.card, styles.primaryCard]}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  <MaterialCommunityIcons name="forest" size={20} color="#2ecc71" />
                  {'  '}Trees Tracked
                </Text>
                <Text variant="displayMedium" style={styles.primaryStat}>{allTrees}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>

        <Link href={'/researcher/tree/pending-tree'} asChild>
          <Pressable style={styles.gridItem}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  <MaterialCommunityIcons name="clock" size={20} color="#2ecc71" />
                  {'  '}Pending Approvals
                </Text>
                <Text variant="displayMedium" style={styles.primaryStat}>{pendings}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => router.push('/researcher/tree/add-tree')} 
      />

    </ScrollView>
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