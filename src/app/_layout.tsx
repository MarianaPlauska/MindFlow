import '../../global.css';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function RootLayoutNav() {
    const { session, loading, isNewUser } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!session && !inAuthGroup) {
            // Not signed in → go to login
            router.replace('/(auth)/login');
        } else if (session && isNewUser) {
            // Signed in but new → go to onboarding
            router.replace('/(auth)/onboarding');
        } else if (session && !isNewUser && inAuthGroup) {
            // Signed in and not new → go to tabs
            router.replace('/(tabs)');
        }
    }, [session, loading, isNewUser, segments]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-calm-50">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
