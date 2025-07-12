import { AuthGate } from '@/components/AuthGate';
import { AuthProvider } from '@/context/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
