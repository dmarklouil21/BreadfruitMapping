import { Stack } from "expo-router";

export default function TreeLayout() {
  return (
    <Stack>
      <Stack.Screen name="process-fruit/[treeID]" options={{ headerTitle: 'Send Attachment'}} />
    </Stack>
  );
}