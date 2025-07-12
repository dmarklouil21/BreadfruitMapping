import { Stack } from "expo-router";

export default function RegisterLayout() {
  return (
    <Stack>
      <Stack.Screen name="user-type" options={{headerTitle: 'Select User Type'}} />
        <Stack.Screen name="[type]" options={{ headerTitle: 'Register'}} />
    </Stack>
  );
}