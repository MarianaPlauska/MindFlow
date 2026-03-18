import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Droplets, Beef, Wallet, LogOut, ChevronRight } from 'lucide-react-native';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { WeeklySummary } from '../../components/features/dashboard/WeeklySummary';
import { ReminderManager } from '../../components/features/dashboard/ReminderManager';
import { TodayFocus } from '../../components/features/dashboard/TodayFocus';
import { LineChart } from 'react-native-wagmi-charts';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useHealth } from '../../hooks/useHealth';
import { supabase } from '../../lib/supabase';
import { SHADOWS } from '../../constants/theme';
import { MOOD_LEVELS } from '../../constants/categories';
import { WATER_GOAL_ML, PROTEIN_GOAL_G } from '../../constants/goals';
import { WaterTracker } from '../../components/features/health/WaterTracker';
import { MedicationCard } from '../../components/features/health/MedicationCard';


export default function HomeScreen() {
    const { session, signOut } = useAuth();
    const { displayName, greeting, profile } = useProfile();
    const { 
        waterToday, waterGoal, waterPercent, addWater, clearWater, loadingWater, 
        proteinCurrent, medicationLogs, medicationRoutines, logMedication, loadingMedication,
        addMedicationRoutine, deleteMedicationRoutine,
    } = useHealth();
    const [lastMood, setLastMood] = useState<any>(null);
    const [todaySpent, setTodaySpent] = useState(0);
    const [recentTx, setRecentTx] = useState<any[]>([]);
    const [weeklyVolume, setWeeklyVolume] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });

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

        // Fetch real weekly workout volume
        try {
            const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const labels: string[] = [];
            const data: number[] = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                labels.push(weekDays[d.getDay()]);
                const dateStr = d.toISOString().split('T')[0];
                const { data: exData } = await supabase
                    .from('workout_exercises')
                    .select('id')
                    .eq('user_id', uid)
                    .eq('workout_date', dateStr);
                if (exData && exData.length > 0) {
                    const exIds = exData.map((e: any) => e.id);
                    const { data: setsData } = await supabase
                        .from('workout_sets')
                        .select('weight_kg, reps')
                        .in('exercise_id', exIds);
                    const vol = (setsData || []).reduce((a: number, s: any) => a + (Number(s.weight_kg) * Number(s.reps)), 0);
                    data.push(vol);
                } else {
                    data.push(0);
                }
            }
            setWeeklyVolume({ labels, data });
        } catch (e) {
            // silently fail — chart will show empty state
        }
    }

    const proteinGoal = profile?.protein_goal_g || PROTEIN_GOAL_G;

    const screenWidth = Dimensions.get('window').width;

    return (
        <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
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

            {/* Interactive Real Water Tracker */}
            <AnimatedCard delay={50}>
                <View className="mx-6 mb-4">
                    <WaterTracker 
                        waterToday={waterToday} 
                        waterGoal={waterGoal} 
                        waterPercent={waterPercent} 
                        onAddWater={(amount) => addWater(amount)} 
                        onClearWater={() => clearWater()}
                        loadingWater={loadingWater} 
                    />
                </View>
            </AnimatedCard>



            {/* Weekly Summary */}
            <AnimatedCard delay={100}>
                <View className="mx-6 mb-4">
                    <WeeklySummary />
                </View>
            </AnimatedCard>

            {/* Anti-Anxiety Medication Module */}
            <View className="mx-6 mb-4">
                <MedicationCard 
                    displayName={displayName}
                    medicationRoutines={medicationRoutines}
                    medicationLogs={medicationLogs}
                    onLogMedication={logMedication}
                    onAddRoutine={addMedicationRoutine}
                    onDeleteRoutine={deleteMedicationRoutine}
                    loading={loadingMedication}
                />
            </View>

            {/* Health & Charts */}
            <AnimatedCard delay={200}>
                <View className="mx-6 mb-4 bg-white rounded-3xl p-6" style={SHADOWS.card}>
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-base font-semibold text-neutral-800">💪 Performance</Text>
                        <ChevronRight size={16} color="#a3a3a3" />
                    </View>
                    
                    {/* Linha: Evolução de Volume Semanal */}
                    <Text className="text-xs font-semibold text-neutral-400 tracking-wider uppercase mb-2">Volume Semanal (kg×reps)</Text>
                    <Animated.View entering={FadeInUp.delay(300)}>
                        {weeklyVolume.data.length > 0 && weeklyVolume.data.some(v => v > 0) ? (
                            <View style={{ width: '100%', marginTop: 10 }}>
                                <LineChart.Provider data={weeklyVolume.data.map((v, i) => ({ timestamp: i, value: v || 0 }))}>
                                    <LineChart height={150}>
                                        <LineChart.Path color="#3b82f6" width={3}>
                                            <LineChart.Gradient color="#3b82f6" />
                                        </LineChart.Path>
                                        <LineChart.CursorCrosshair color="#3b82f6">
                                            <LineChart.Tooltip 
                                                textProps={{ style: { backgroundColor: '#3b82f6', color: '#fff', padding: 4, borderRadius: 4, overflow: 'hidden' } }}
                                            />
                                        </LineChart.CursorCrosshair>
                                    </LineChart>
                                </LineChart.Provider>
                                <View className="flex-row justify-between px-2 mt-2">
                                    {weeklyVolume.labels.map((lbl, idx) => (
                                        <Text key={idx} className="text-[10px] text-neutral-400 font-medium">{lbl}</Text>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <View className="bg-neutral-50 rounded-2xl py-6 items-center">
                                <Text className="text-3xl mb-2">🏋️</Text>
                                <Text className="text-neutral-400 text-xs text-center">
                                    Sem treinos esta semana ainda.{"\n"}Registre séries para ver sua progressão!
                                </Text>
                            </View>
                        )}
                    </Animated.View>

                    {/* Barra: Consumo de Proteína */}
                    <Text className="text-xs font-semibold text-neutral-400 tracking-wider uppercase mt-6 mb-2">Proteína vs Meta ({proteinGoal}g)</Text>
                    <Animated.View entering={FadeInUp.delay(500)}>
                        <View className="flex-row items-end justify-around h-32 mt-4">
                            <View className="items-center flex-1">
                                <Text className="text-xs font-bold text-neutral-400 mb-2">{proteinGoal}g</Text>
                                <View className="w-16 bg-neutral-100 rounded-t-xl" style={{ height: 100 }} />
                                <Text className="text-xs font-semibold text-neutral-500 mt-2">Meta</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-xs font-bold text-calm-600 mb-2">{proteinCurrent.toFixed(0)}g</Text>
                                <View className="w-16 bg-calm-500 rounded-t-xl" style={{ height: `${Math.max((proteinCurrent / proteinGoal) * 100, 5)}%` as any }} />
                                <Text className="text-xs font-semibold text-neutral-800 mt-2">Hoje</Text>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </AnimatedCard>

            {/* Mind */}
            <AnimatedCard delay={300}>
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
            <AnimatedCard delay={400}>
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

            {/* Reminder Manager */}
            <AnimatedCard delay={500}>
                <View className="mx-6 mb-4">
                    <ReminderManager displayName={displayName} />
                </View>
            </AnimatedCard>
        </ScrollView>
    );
}
