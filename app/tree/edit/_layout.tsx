// app/tree/edit/_layout.tsx
import { Stack } from 'expo-router';

export default function EditTreeLayout() {
  return (
    <Stack
        screenOptions={{
          headerTitle: 'Edit Tree',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          presentation: 'modal', // Makes edit screen slide up as modal
        }}
      >
    </Stack>
  );
}
