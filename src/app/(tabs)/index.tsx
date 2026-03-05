import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Droplets, Beef, Wallet, Sparkles, LogOut, ChevronRight } from 'lucide-react-native';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { supabase } from '../../lib/supabase';
import { SHADOWS } from '../../constants/theme';
import { MOOD_LEVELS } from '../../constants/categories';
import { WATER_GOAL_ML, PROTEIN_GOAL_G } from '../../constants/goals';

export default function HomeScreen() {
    const { session, signOut } = useAuth();
    const { displayName, greeting, profile } = useProfile();
    const [lastMood, setLastMood] = useState<any>(null);
    const [todaySpent, setTodaySpent] = useState(0);
    const [recentTx, setRecentTx] = useState<any[]>([]);

    useEffect(() => {
        if (session?.user?.id) fetchDashboard();
    }, [session]);

    async function fetchDashboard() {
        const uid = session!.user.id;
        const today = new Date().toISOString().split('T')[0];

        const [moodRes, txRes] = await Promise.all([
            supabase.from('mood_logs').select('*').eq('user_id', uid).order('logged_at', { ascending: false }).limit(1),
            supabase.from('transactions').select('*').eq('user_id', uid).eq('transaction_date', today).order('created_at', { ascending: false }).limit(5),
        ]);

        if (moodRes.data?.[0]) setLastMood(moodRes.data[0]);
        if (txRes.data) {
            setRecentTx(txRes.data);
            setTodaySpent(txRes.data.reduce((a: number, t: any) => a + Number(t.amount), 0));
        }
    }

    const waterGoal = profile?.water_goal_ml || WATER_GOAL_ML;
    const proteinGoal = profile?.protein_goal_g || PROTEIN_GOAL_G;

    return (
        <ScrollView className="flex-1 bg-calm-50" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <AnimatedCard delay={0}>
                <View className="pt-16 pb-4 px-6 flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-sm text-neutral-400 mb-1">{greeting} 👋</Text>
                        <Text className="text-2xl font-bold text-neutral-800">{displayName}</Text>
                    </View>
                    <TouchableOpacity onPress={signOut} className="bg-white rounded-full p-3" style={SHADOWS.cardSm}>
                        <LogOut size={18} color="#a3a3a3" />
                    </TouchableOpacity>
                </View>
            </AnimatedCard>

            {/* Insight */}
            <AnimatedCard delay={100}>
                <View className="mx-6 mb-4 rounded-3xl p-5 flex-row items-center" style={{ backgroundColor: 'rgba(59,130,246,0.08)' }}>
                    <Sparkles size={20} color="#3b82f6" />
                    <Text className="text-sm text-serene-600 ml-3 flex-1">Cuide de si com gentileza hoje. 💙</Text>
                </View>
            </AnimatedCard>

            {/* Health */}
            <AnimatedCard delay={200}>
                <View className="mx-6 mb-4 bg-white rounded-3xl p-6" style={SHADOWS.card}>
                    <View className="flex-row items-center justify-between mb-5">
                        <Text className="text-base font-semibold text-neutral-800">💚 Saúde</Text>
                        <ChevronRight size={16} color="#a3a3a3" />
                    </View>
                    <View className="flex-row items-center">
                        <View className="items-center mr-6">
                            <CircularProgress progress={0} size={76} strokeWidth={7} color="#3b82f6" bgColor="#eff6ff">
                                <Droplets size={20} color="#3b82f6" />
                            </CircularProgress>
                            <Text className="text-xs text-neutral-400 mt-2">Água</Text>
                            <Text className="text-xs font-semibold text-serene-600">0/{waterGoal}ml</Text>
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-center mb-2">
                                <Beef size={16} color="#22c55e" />
                                <Text className="text-sm font-medium text-neutral-600 ml-2">Proteína</Text>
                            </View>
                            <ProgressBar percent={0} height={12} color="#22c55e" bgColor="#dcfce7" />
                            <Text className="text-xs text-neutral-400 mt-1">0g / {proteinGoal}g</Text>
                        </View>
                    </View>
                </View>
            </AnimatedCard>

            {/* Mind */}
            <AnimatedCard delay={350}>
                <View className="mx-6 mb-4 bg-white rounded-3xl p-6" style={SHADOWS.card}>
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-semibold text-neutral-800">🧠 Mente</Text>
                        <ChevronRight size={16} color="#a3a3a3" />
                    </View>
                    {lastMood ? (
                        <View className="flex-row items-center">
                            {(() => {
                                const m = MOOD_LEVELS.find((l) => l.score === lastMood.mood_score) || MOOD_LEVELS[2];
                                return (
                                    <>
                                        <View className="rounded-2xl p-3 mr-4" style={{ backgroundColor: m.bg }}>
                                            <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-neutral-700">{m.label}</Text>
                                            <Text className="text-xs text-neutral-400 mt-1">Último registro</Text>
                                        </View>
                                    </>
                                );
                            })()}
                        </View>
                    ) : (
                        <View className="items-center py-2">
                            <Text style={{ fontSize: 28 }}>😐</Text>
                            <Text className="text-sm text-neutral-400 mt-2">Nenhum registro ainda</Text>
                        </View>
                    )}
                </View>
            </AnimatedCard>

            {/* Finance */}
            <AnimatedCard delay={500}>
                <View className="mx-6 mb-4 bg-white rounded-3xl p-6" style={SHADOWS.card}>
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-semibold text-neutral-800">💰 Finanças</Text>
                        <ChevronRight size={16} color="#a3a3a3" />
                    </View>
                    <View className="flex-row items-center mb-4">
                        <View className="bg-serene-50 rounded-2xl p-3 mr-4">
                            <Wallet size={24} color="#3b82f6" />
                        </View>
                        <View>
                            <Text className="text-xs text-neutral-400">Gastos de hoje</Text>
                            <Text className="text-xl font-bold text-neutral-800">R$ {todaySpent.toFixed(2).replace('.', ',')}</Text>
                        </View>
                    </View>
                    {recentTx.length > 0 ? (
                        recentTx.slice(0, 3).map((tx: any) => (
                            <View key={tx.id} className="flex-row justify-between items-center py-2 border-b border-neutral-100">
                                <Text className="text-sm text-neutral-600">{tx.description}</Text>
                                <Text className="text-sm font-semibold text-blush-600">-R$ {Number(tx.amount).toFixed(2).replace('.', ',')}</Text>
                            </View>
                        ))
                    ) : (
                        <View className="bg-neutral-50 rounded-2xl py-3 items-center">
                            <Text className="text-sm text-neutral-400">Nenhum gasto registrado hoje</Text>
                        </View>
                    )}
                </View>
            </AnimatedCard>
        </ScrollView>
    );
}
