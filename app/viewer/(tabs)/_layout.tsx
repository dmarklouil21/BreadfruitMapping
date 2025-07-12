import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabsLayout() {
  const { user } = useAuth(); 
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: '#333',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#eee',
          paddingVertical: 8,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          color: '#333',
          fontWeight: 'bold',
        },
        headerRight: () => <NotificationBell />,
      }}
    >
      {/* <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tree-list"
        options={{
          title: 'Tree List',
          headerRight: () => (
            <Pressable onPress={() => router.push('../search')}>
              <MaterialCommunityIcons
                name='magnify'
                size={24}
                //color='#666'
                style={{ marginRight: 16 }}
              />
            </Pressable>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}