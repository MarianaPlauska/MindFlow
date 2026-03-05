import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: '#f0fdf4' },  // calm-50
                headerTintColor: '#1d4ed8',                     // serene-700
                headerTitleStyle: { fontWeight: '600' },
                tabBarStyle: {
                    backgroundColor: '#fafafa',         // neutral-50
                    borderTopColor: '#e5e5e5',          // neutral-200
                    paddingTop: 4,
                    height: 60,
                },
                tabBarActiveTintColor: '#3b82f6',     // serene-500
                tabBarInactiveTintColor: '#a3a3a3',   // neutral-400
                tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>🏠</Text>
                    ),
                }}
            />
        </Tabs>
    );
}
