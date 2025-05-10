import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFound() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops! Not Found' }} />
            <View style={styles.container}>
                <Link href={'/(tabs)/dashboard'} style={styles.button}>
                    Go back to home screen!
                </Link>
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