import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { collection, getCountFromServer, getFirestore, query, QueryConstraint, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function DashboardScreen() {
  const router = useRouter();

  const [allTrees, setAllTrees] = useState(0);
  const [allUsers, setAllUsers] = useState(0);
  const [researcher, setResearchers] = useState(0);
  const [pendingUser, setPendingUser] = useState(0);
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
      const [allTreesCount, allUsersCount, researchersCount, pendingUsersCount] = await Promise.all([
        fetchCount('trees', [where('status', '==', 'verified')]),
        fetchCount('users', [where('status', '==', 'verified')]),
        fetchCount('users', [
          where('role', '==', 'researcher'),
          where('status', '==', 'verified')
        ]),
        fetchCount('users', [where('status', '==', 'pending')]),
      ]);

      setAllTrees(allTreesCount);
      setAllUsers(allUsersCount);
      setResearchers(researchersCount);
      setPendingUser(pendingUsersCount);
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
        <MaterialCommunityIcons name="view-dashboard" size={24} color="#2ecc71" />
        {'  '}Admin Dashboard
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
                <Text variant="displayMedium" style={styles.primaryStat}>{allTrees}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>

        <Link href={'/admin/user/user-list'} asChild>
          <Pressable style={styles.gridItem}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  <MaterialCommunityIcons name="account-group" size={20} color="#2ecc71" />
                  {'  '}All Users
                </Text>
                <Text variant="displayMedium" style={styles.primaryStat}>{allUsers}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>

        <Link
          href={{
            pathname: '/admin/user/user-list',
            params: { status: 'researcher' }
          }}
          asChild
        >
          <Pressable style={styles.gridItem}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  <MaterialCommunityIcons name="account" size={20} color="#2ecc71" /> {/*pine-tree*/}
                  {'  '}Researchers
                </Text>
                <Text variant="displayMedium" style={styles.primaryStat}>{researcher}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>

        <Link href={'/admin/user/pending'} asChild>
          <Pressable style={styles.gridItem}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  <MaterialCommunityIcons name="account-clock" size={20} color="#2ecc71" />
                  {'  '}Pending Approvals
                </Text>
                <Text variant="displayMedium" style={styles.primaryStat}>{pendingUser}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>
      </View>

      {/* Recent Activity Section */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            <MaterialCommunityIcons name="clock" size={20} color="#2ecc71" />
            {'  '}Recent Activity
          </Text>
          <Text variant="bodyLarge" style={styles.statText}>
            • Juan added a new tree{"\n"}
            • Maria updated tree #42 details{"\n"}
            • 3 new registrations approved
          </Text>
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
  sectionCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#2ecc71',
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 16,
  },
  statText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
});