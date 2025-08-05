import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { collection, getCountFromServer, getFirestore, query, QueryConstraint, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function DashboardScreen() {
  const router = useRouter();

  const [allTrees, setAllTrees] = useState(0);
  const [harvestReady, setHarvestReady] = useState(0);
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
      const [allTreesCount, harvestReadyCount] = await Promise.all([
        fetchCount('trees', [where('status', '==', 'verified')]),
        fetchCount('trees', [where('fruitStatus', '==', 'ripe')]),
      ]);

      setAllTrees(allTreesCount);
      setHarvestReady(harvestReadyCount);
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
        <MaterialCommunityIcons name="chart-box" size={24} color="#2ecc71" />
        {'  '}Breadfruit Analytics
      </Text>

      <Link href={'/researcher/tree/tree-list'} asChild>
        <Pressable>
          <Card style={[styles.card, styles.primaryCard]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                <MaterialCommunityIcons name="tree" size={16} color="#2ecc71" />
                {'  '}Total Trees Tracked
              </Text>
              <Text variant="displayMedium" style={styles.primaryStat}>{allTrees}</Text>
            </Card.Content>
          </Card>
        </Pressable>
      </Link>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            <MaterialCommunityIcons name="fruit-pineapple" size={16} color="#2ecc71" />
            {'  '}Harvest Ready
          </Text>
          <Text variant="bodyLarge" style={styles.statText}>{harvestReady} trees ready</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            <MaterialCommunityIcons name="clock" size={16} color="#2ecc71" />
            {'  '}Recent Activity
          </Text>
          <Text variant="bodyLarge" style={styles.statText}>5 new trees today</Text>
        </Card.Content>
      </Card>
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
  card: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  primaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  cardTitle: {
    color: '#2ecc71',
    marginBottom: 12,
    fontWeight: '600',
  },
  primaryStat: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  statText: {
    color: '#666',
    fontSize: 16,
  },
});