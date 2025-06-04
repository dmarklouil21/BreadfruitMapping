import { View, StyleSheet, Button } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';

export default function NotFound() {
    const router = useRouter();
    return (
        <>
            <Stack.Screen options={{ title: 'Oops! Not Found' }} />
            <View style={styles.container}>
                <Link href={'/main/(tabs)'} style={styles.button}>
                    Go back to home screen!
                </Link>
                {/* <Button title='Go back' onPress={router.navigate('/main/(tabs)')}/> */}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        fontSize: 20,
        color: '#fff',
        textDecorationLine: 'underline',
    },
});