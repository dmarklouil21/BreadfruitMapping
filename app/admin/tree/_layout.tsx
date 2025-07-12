import { Stack } from "expo-router";

export default function TreeLayout() {
  return (
    <Stack>
      <Stack.Screen name="tree-list" options={{headerTitle: 'Trees Tracked'}} />
      <Stack.Screen name="add-tree" options={{headerTitle: 'Add Tree'}} />
      <Stack.Screen name='search' options={{headerShown: false}}/>
      <Stack.Screen name="edit/[treeID]" options={{ headerTitle: 'Edit Tree'}} />
      <Stack.Screen name="process-fruit/[treeID]" options={{ headerTitle: 'Send Attachment'}} />
    </Stack>
  );
}