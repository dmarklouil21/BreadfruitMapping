import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function DashboardScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}> 
      <Text variant="titleLarge" style={styles.title}>
        <MaterialCommunityIcons name="view-dashboard" size={24} color="#2ecc71" />
        {'  '}Admin Dashboard
      </Text>

      {/* Role Statistics Grid */}
      <View style={styles.gridContainer}>
        <Link href={'/admin/(tabs)/user-list'} asChild>
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

        <View style={styles.gridItem}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                <MaterialCommunityIcons name="account-group" size={20} color="#2ecc71" />
                {'  '}All Users
              </Text>
              <Text variant="displayMedium" style={styles.primaryStat}>12</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.gridItem}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                <MaterialCommunityIcons name="account" size={20} color="#2ecc71" /> {/*pine-tree*/}
                {'  '}Researchers
              </Text>
              <Text variant="displayMedium" style={styles.primaryStat}>31</Text>
            </Card.Content>
          </Card>
        </View>

        <Link href={'/admin/user/pending'} asChild>
          <Pressable style={styles.gridItem}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  <MaterialCommunityIcons name="account-clock" size={20} color="#2ecc71" />
                  {'  '}Pending Approvals
                </Text>
                <Text variant="displayMedium" style={styles.primaryStat}>15</Text>
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