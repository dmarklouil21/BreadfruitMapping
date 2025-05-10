// app/tree/add/_layout.tsx
import { Stack } from 'expo-router';

export default function EditTreeLayout() {
  return (
    <Stack
        screenOptions={{
          headerTitle: 'Add Tree',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          presentation: 'modal', // Makes edit screen slide up as modal
        }}
      >
    </Stack>
  );
}
