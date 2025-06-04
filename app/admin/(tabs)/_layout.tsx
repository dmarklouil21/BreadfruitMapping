import { Tabs, router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import NotificationBell from '@/components/NotificationBell';

export default function TabsLayout() {
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user-list"
        options={{
          title: 'User List',
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