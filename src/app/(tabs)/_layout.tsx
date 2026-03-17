import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: '#0f0f0f' },
                headerTintColor: '#e5e5e5',
                headerTitleStyle: { fontWeight: '600' },
                tabBarStyle: {
                    backgroundColor: '#0f0f0f',
                    borderTopColor: '#262626',
                    paddingTop: 4,
                    height: 60,
                },
                tabBarActiveTintColor: '#4ade80',   // calm-400
                tabBarInactiveTintColor: '#525252',  // neutral-600
                tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 20, color }}>🏠</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="habits"
                options={{
                    title: 'Hábitos',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 20, color }}>📋</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="workout"
                options={{
                    title: 'Treinos',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 20, color }}>🏋️</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Finanças',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 20, color }}>💰</Text>
                    ),
                }}
            />
        </Tabs>
    );
}
