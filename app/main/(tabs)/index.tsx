import { StyleSheet, View, Pressable } from 'react-native';
import { Card, Text, FAB } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}> 
      <Text variant="titleLarge" style={styles.title}>
        <MaterialCommunityIcons name="chart-box" size={24} color="#2ecc71" />
        {'  '}Breadfruit Analytics
      </Text>

      <Link href={'/main/(tabs)/tree-list'} asChild>
        <Pressable>
          <Card style={[styles.card, styles.primaryCard]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                <MaterialCommunityIcons name="tree" size={16} color="#2ecc71" />
                {'  '}Total Trees Tracked
              </Text>
              <Text variant="displayMedium" style={styles.primaryStat}>42</Text>
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
          <Text variant="bodyLarge" style={styles.statText}>15 trees ready</Text>
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