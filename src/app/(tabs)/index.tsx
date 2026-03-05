import { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import {
    Droplets,
    Beef,
    Smile,
    Meh,
    Frown,
    Wallet,
    ChevronRight,
    LogOut,
    Sparkles,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// ─── Helpers ──────────────────────────────────────────────

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'Boa madrugada';
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

function getMoodIcon(score: number) {
    if (score <= 2) return { Icon: Frown, color: '#ec4899', label: 'Preciso de cuidado' };
    if (score === 3) return { Icon: Meh, color: '#eab308', label: 'Neutro' };
    return { Icon: Smile, color: '#22c55e', label: 'Estou bem' };
}

// ─── Animated Card Component ──────────────────────────────

function AnimatedCard({
    children,
    delay = 0,
    style,
}: {
    children: React.ReactNode;
    delay?: number;
    style?: any;
}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
}

// ─── Circular Progress ────────────────────────────────────

function CircularProgress({
    progress,
    size = 80,
    strokeWidth = 8,
    color = '#3b82f6',
    bgColor = '#eff6ff',
    children,
}: {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    bgColor?: string;
    children?: React.ReactNode;
}) {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            {/* Background circle */}
            <View
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: bgColor,
                }}
            />
            {/* Progress arc (simplified visual for cross-platform) */}
            <View
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: 'transparent',
                    borderTopColor: color,
                    borderRightColor: clampedProgress > 25 ? color : 'transparent',
                    borderBottomColor: clampedProgress > 50 ? color : 'transparent',
                    borderLeftColor: clampedProgress > 75 ? color : 'transparent',
                    transform: [{ rotate: '-45deg' }],
                }}
            />
            {children}
        </View>
    );
}

// ─── Main Dashboard ───────────────────────────────────────

export default function HomeScreen() {
    const { session, signOut } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [lastMood, setLastMood] = useState<any>(null);
    const [todaySpent, setTodaySpent] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        if (session?.user?.id) {
            fetchData();
        }
    }, [session]);

    async function fetchData() {
        const userId = session!.user.id;

        // Fetch profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (profileData) setProfile(profileData);

        // Fetch last mood
        const { data: moodData } = await supabase
            .from('mood_logs')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: false })
            .limit(1);
        if (moodData && moodData.length > 0) setLastMood(moodData[0]);

        // Fetch today's transactions
        const today = new Date().toISOString().split('T')[0];
        const { data: txData } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .eq('transaction_date', today)
            .order('created_at', { ascending: false })
            .limit(5);
        if (txData) {
            setRecentTransactions(txData);
            const total = txData.reduce((acc: number, tx: any) => acc + Number(tx.amount), 0);
            setTodaySpent(total);
        }
    }

    const displayName = profile?.username?.split(' ')[0] || 'usuário';
    const waterGoal = profile?.water_goal_ml || 2000;
    const proteinGoal = profile?.protein_goal_g || 100;

    // TODO: Replace with real tracked values
    const waterCurrent = 0;
    const proteinCurrent = 0;
    const waterPercent = (waterCurrent / waterGoal) * 100;
    const proteinPercent = (proteinCurrent / proteinGoal) * 100;

    return (
        <ScrollView
            className="flex-1 bg-calm-50"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Header ───────────────────────────── */}
            <AnimatedCard delay={0}>
                <View className="pt-16 pb-4 px-6">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className="text-sm text-neutral-400 mb-1">
                                {getGreeting()} 👋
                            </Text>
                            <Text className="text-2xl font-bold text-neutral-800">
                                {displayName}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={signOut}
                            className="bg-white rounded-full p-3"
                            style={{
                                shadowColor: '#1e3a5f',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <LogOut size={18} color="#a3a3a3" />
                        </TouchableOpacity>
                    </View>
                </View>
            </AnimatedCard>

            {/* ── Daily Insight ────────────────────── */}
            <AnimatedCard delay={100}>
                <View className="mx-6 mb-4">
                    <View
                        className="rounded-3xl p-5 flex-row items-center"
                        style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.08)',
                        }}
                    >
                        <Sparkles size={20} color="#3b82f6" />
                        <Text className="text-sm text-serene-600 ml-3 flex-1">
                            Cuide de si com gentileza hoje. Cada pequeno passo conta. 💙
                        </Text>
                    </View>
                </View>
            </AnimatedCard>

            {/* ── Health Card ──────────────────────── */}
            <AnimatedCard delay={200}>
                <View
                    className="mx-6 mb-4 bg-white rounded-3xl p-6"
                    style={{
                        shadowColor: '#1e3a5f',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.06,
                        shadowRadius: 16,
                        elevation: 4,
                    }}
                >
                    <View className="flex-row items-center justify-between mb-5">
                        <Text className="text-base font-semibold text-neutral-800">
                            💚 Saúde
                        </Text>
                        <ChevronRight size={16} color="#a3a3a3" />
                    </View>

                    <View className="flex-row items-center">
                        {/* Water - Circular Progress */}
                        <View className="items-center mr-6">
                            <CircularProgress
                                progress={waterPercent}
                                size={76}
                                strokeWidth={7}
                                color="#3b82f6"
                                bgColor="#eff6ff"
                            >
                                <Droplets size={20} color="#3b82f6" />
                            </CircularProgress>
                            <Text className="text-xs text-neutral-400 mt-2">Água</Text>
                            <Text className="text-xs font-semibold text-serene-600">
                                {waterCurrent}/{waterGoal}ml
                            </Text>
                        </View>

                        {/* Protein - Horizontal Bar */}
                        <View className="flex-1">
                            <View className="flex-row items-center mb-2">
                                <Beef size={16} color="#22c55e" />
                                <Text className="text-sm font-medium text-neutral-600 ml-2">
                                    Proteína
                                </Text>
                            </View>
                            <View className="bg-calm-100 rounded-full h-3 w-full mb-1">
                                <View
                                    className="bg-calm-500 rounded-full h-3"
                                    style={{ width: `${Math.min(proteinPercent, 100)}%` }}
                                />
                            </View>
                            <Text className="text-xs text-neutral-400">
                                {proteinCurrent}g / {proteinGoal}g
                            </Text>
                        </View>
                    </View>
                </View>
            </AnimatedCard>

            {/* ── Mental Health Card ───────────────── */}
            <AnimatedCard delay={350}>
                <View
                    className="mx-6 mb-4 bg-white rounded-3xl p-6"
                    style={{
                        shadowColor: '#1e3a5f',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.06,
                        shadowRadius: 16,
                        elevation: 4,
                    }}
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-semibold text-neutral-800">
                            🧠 Mente
                        </Text>
                        <ChevronRight size={16} color="#a3a3a3" />
                    </View>

                    {lastMood ? (
                        <View className="flex-row items-center">
                            {(() => {
                                const { Icon, color, label } = getMoodIcon(lastMood.mood_score);
                                return (
                                    <>
                                        <View
                                            className="rounded-2xl p-3 mr-4"
                                            style={{ backgroundColor: `${color}15` }}
                                        >
                                            <Icon size={28} color={color} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-neutral-700">
                                                {label}
                                            </Text>
                                            <Text className="text-xs text-neutral-400 mt-1">
                                                Último registro
                                            </Text>
                                        </View>
                                    </>
                                );
                            })()}
                        </View>
                    ) : (
                        <View className="items-center py-2">
                            <Meh size={32} color="#a3a3a3" strokeWidth={1.5} />
                            <Text className="text-sm text-neutral-400 mt-2 text-center">
                                Nenhum registro ainda
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity className="bg-serene-50 rounded-2xl py-3 mt-4 items-center">
                        <Text className="text-serene-600 text-sm font-semibold">
                            Como estou agora? 💭
                        </Text>
                    </TouchableOpacity>
                </View>
            </AnimatedCard>

            {/* ── Financial Card ───────────────────── */}
            <AnimatedCard delay={500}>
                <View
                    className="mx-6 mb-4 bg-white rounded-3xl p-6"
                    style={{
                        shadowColor: '#1e3a5f',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.06,
                        shadowRadius: 16,
                        elevation: 4,
                    }}
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-semibold text-neutral-800">
                            💰 Finanças
                        </Text>
                        <ChevronRight size={16} color="#a3a3a3" />
                    </View>

                    <View className="flex-row items-center mb-4">
                        <View className="bg-serene-50 rounded-2xl p-3 mr-4">
                            <Wallet size={24} color="#3b82f6" />
                        </View>
                        <View>
                            <Text className="text-xs text-neutral-400">Gastos de hoje</Text>
                            <Text className="text-xl font-bold text-neutral-800">
                                R$ {todaySpent.toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    </View>

                    {recentTransactions.length > 0 ? (
                        <View>
                            <Text className="text-xs text-neutral-400 mb-2">Recentes</Text>
                            {recentTransactions.slice(0, 3).map((tx: any) => (
                                <View
                                    key={tx.id}
                                    className="flex-row justify-between items-center py-2 border-b border-neutral-100"
                                >
                                    <Text className="text-sm text-neutral-600">
                                        {tx.description}
                                    </Text>
                                    <Text className="text-sm font-semibold text-blush-600">
                                        -R$ {Number(tx.amount).toFixed(2).replace('.', ',')}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="bg-neutral-50 rounded-2xl py-3 items-center">
                            <Text className="text-sm text-neutral-400">
                                Nenhum gasto registrado hoje
                            </Text>
                        </View>
                    )}
                </View>
            </AnimatedCard>
        </ScrollView>
    );
}
