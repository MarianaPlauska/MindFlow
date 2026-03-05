import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Home, Wallet, Heart, Brain } from 'lucide-react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#3b82f6',   // serene-500
                tabBarInactiveTintColor: '#a3a3a3', // neutral-400
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginBottom: Platform.OS === 'ios' ? 0 : 6,
                },
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 24 : 12,
                    left: 20,
                    right: 20,
                    height: 70,
                    borderRadius: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderTopWidth: 0,
                    shadowColor: '#1e3a5f',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 20,
                    elevation: 12,
                    paddingBottom: Platform.OS === 'ios' ? 8 : 10,
                    paddingTop: 10,
                    ...Platform.select({
                        web: {
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 -4px 30px rgba(30, 58, 95, 0.08)',
                        },
                    }),
                },
                tabBarItemStyle: {
                    borderRadius: 16,
                    marginHorizontal: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Home
                                size={22}
                                color={color}
                                strokeWidth={focused ? 2.5 : 1.8}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Finanças',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Wallet
                                size={22}
                                color={color}
                                strokeWidth={focused ? 2.5 : 1.8}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="health"
                options={{
                    title: 'Saúde',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Heart
                                size={22}
                                color={color}
                                strokeWidth={focused ? 2.5 : 1.8}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="mind"
                options={{
                    title: 'Mente',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Brain
                                size={22}
                                color={color}
                                strokeWidth={focused ? 2.5 : 1.8}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
