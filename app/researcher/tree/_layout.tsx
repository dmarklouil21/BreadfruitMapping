import { useAuth } from '@/context/AuthContext';
import { Stack } from "expo-router";

export default function TreeLayout() {
  const { user } = useAuth();

  return (
    <Stack>
      <Stack.Screen name="add-tree" options={{headerTitle: 'Add Tree'}} />
      <Stack.Screen name="tree-list" options={{headerTitle: 'Trees Tracked'}} />
      <Stack.Screen name="pending-tree" options={{headerTitle: 'Pending Approvals'}} />
      <Stack.Screen name="edit/[treeID]" options={{ headerTitle: 'Edit Tree'}} />
      <Stack.Screen name="pending/[treeID]" options={{ headerTitle: 'Pending Tree'}} />
      <Stack.Screen name="user/tracked-trees" options={{ headerTitle: `${user?.name}'s Tracked Trees`}} />
      <Stack.Screen name="process-fruit/[treeID]" options={{ headerTitle: 'Send Attachment'}} />
    </Stack>
  );
}