import { Stack } from "expo-router"; 

export default function UserLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="add-user" options={{headerTitle: 'Add User'}} />
                <Stack.Screen name="pending" options={{headerTitle: 'Pending List'}} />
                <Stack.Screen name="[userID]" options={{headerTitle: 'User Details'}} />
                <Stack.Screen name="edit/[userID]" options={{ headerTitle: 'Edit User'}} />
                <Stack.Screen name="pending-info/[userID]" options={{headerTitle: 'Request Details'}} />
            </Stack>
        </>
    );
}