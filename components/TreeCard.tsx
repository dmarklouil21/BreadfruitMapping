import { useAuth } from '@/context/AuthContext';
import { Tree } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

type TreeCardProps = {
  tree: Tree;
  stringPath: string;
}

export default function TreeCard ({ tree, stringPath }: TreeCardProps) { 
  const { user } = useAuth();

  // const stringPath = user?.role === 'admin' ? `./details/${tree.treeID}` : '/app/researcher/(tabs)/map';

  return (
    <Link
      href={{
        /* pathname: user?.role === 'admin'
          ? `./details/${tree.treeID}` //stringPath,
          : tree.status === 'pending' 
          ? `./pending/${tree.treeID}`
          // ? `/app/researcher/tree/pending/${tree.treeID}`
          : '../(tabs)/map', */
        pathname: stringPath,
        params: {
          lat: tree.coordinates.latitude,
          lng: tree.coordinates.longitude,
          // treeID: tree.treeID
        }
      } as any}
      asChild
    >
      <Pressable>
        <Card style={styles.treeCard}>
          <Card.Content>
            <Text style={styles.treeID}>
              <MaterialCommunityIcons name="tree" size={16} color="#2ecc71" />
              {'  '}{tree.treeID}
            </Text>
            <Text style={styles.treeDetail}>
              <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
              {'  '}{tree.city}
            </Text>
          </Card.Content>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  treeCard: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 12,
    // padding: 5,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
    // marginHorizontal: 16,
    // width: '100%',
    // alignSelf: 'center',
  },
  treeID: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  treeDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    // marginBottom: 4,
  },
});