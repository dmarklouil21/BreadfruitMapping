import NotificationBell from '@/components/NotificationBell';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

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
        name="account-management"
        options={{
          title: 'Accounts',
          headerRight: () => (
            <Pressable onPress={() => router.push('../user/search')}>
              <MaterialCommunityIcons
                  name='magnify'
                  size={24}
                  style={{ marginRight: 16 }}
              />
            </Pressable>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="people" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tree-management"
        options={{
          title: 'Trees',
          headerRight: () => (
            <Pressable onPress={() => router.push('../tree/search')}>
              <MaterialCommunityIcons
                  name='magnify'
                  size={24}
                  style={{ marginRight: 16 }}
              />
            </Pressable>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="forest" size={24} color={color} />
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