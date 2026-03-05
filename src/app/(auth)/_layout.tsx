import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f0fdf4' }, // calm-50
                animation: 'fade',
            }}
        />
    );
}
