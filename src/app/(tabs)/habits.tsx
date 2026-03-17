import { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import HabitItem, { type Habit } from '../../components/HabitItem';

type Profile = {
    protein_goal_g: number;
};

function todayISO(): string {
    return new Date().toISOString().split('T')[0];
}

function isOverdue(habit: Habit): boolean {
    if (!habit.due_date || habit.is_completed) return false;
    return habit.due_date < todayISO();
}

function isToday(habit: Habit): boolean {
    if (habit.is_completed) return false;
    return habit.due_date === todayISO();
}

function isCompletedToday(habit: Habit): boolean {
    if (!habit.is_completed || !habit.completed_at) return false;
    return habit.completed_at.startsWith(todayISO());
}

type SectionProps = {
    label: string;
    accentClass: string;
    habits: Habit[];
    onToggle: (id: string, current: boolean) => void;
    proteinGoalG: number;
};

function Section({ label, accentClass, habits, onToggle, proteinGoalG }: SectionProps) {
    if (habits.length === 0) return null;
    return (
        <View className="mb-6">
            <Text className={`text-xs font-bold tracking-widest mb-2 px-4 ${accentClass}`}>
                {label}
            </Text>
            <View className="bg-neutral-900 rounded-2xl overflow-hidden divide-y divide-neutral-800">
                {habits.map((h, i) => (
                    <View key={h.id}>
                        {i > 0 && <View className="h-px bg-neutral-800 mx-4" />}
                        <HabitItem
                            habit={h}
                            onToggle={onToggle}
                            proteinGoalG={proteinGoalG}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
}

export default function HabitsScreen() {
    const { session } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [proteinGoalG, setProteinGoalG] = useState(100);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function fetchData() {
        if (!session?.user.id) return;
        const [habitsRes, profileRes] = await Promise.all([
            supabase
                .from('habits')
                .select('*')
                .eq('user_id', session.user.id)
                .order('due_date', { ascending: true }),
            supabase
                .from('profiles')
                .select('protein_goal_g')
                .eq('id', session.user.id)
                .single<Profile>(),
        ]);

        if (habitsRes.data) setHabits(habitsRes.data as Habit[]);
        if (profileRes.data?.protein_goal_g) {
            setProteinGoalG(profileRes.data.protein_goal_g);
        }
    }

    useEffect(() => {
        fetchData().finally(() => setLoading(false));
    }, [session]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [session]);

    async function handleToggle(id: string, current: boolean) {
        const nowISO = new Date().toISOString();
        setHabits((prev) =>
            prev.map((h) =>
                h.id === id
                    ? {
                          ...h,
                          is_completed: !current,
                          completed_at: !current ? nowISO : null,
                      }
                    : h
            )
        );
        await supabase
            .from('habits')
            .update({
                is_completed: !current,
                completed_at: !current ? nowISO : null,
            })
            .eq('id', id);
    }

    const overdue = habits.filter(isOverdue);
    const today = habits.filter(isToday);
    const completedToday = habits.filter(isCompletedToday);

    const hasAnything = overdue.length + today.length + completedToday.length > 0;

    return (
        <View className="flex-1 bg-neutral-950">
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4ade80"
                    />
                }
            >
                {/* Page header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-neutral-100">Tarefas</Text>
                    <Text className="text-sm text-neutral-500 mt-1">
                        {new Date().toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        })}
                    </Text>
                </View>

                {loading && (
                    <ActivityIndicator
                        size="large"
                        color="#4ade80"
                        style={{ marginTop: 40 }}
                    />
                )}

                {!loading && !hasAnything && (
                    <View className="items-center mt-20">
                        <Text className="text-4xl mb-4">✅</Text>
                        <Text className="text-base text-neutral-400 text-center">
                            Nenhuma tarefa por aqui.{'\n'}Aproveite o dia!
                        </Text>
                    </View>
                )}

                {!loading && (
                    <>
                        <Section
                            label="VENCIDAS"
                            accentClass="text-warmth-400"
                            habits={overdue}
                            onToggle={handleToggle}
                            proteinGoalG={proteinGoalG}
                        />
                        <Section
                            label="HOJE"
                            accentClass="text-neutral-400"
                            habits={today}
                            onToggle={handleToggle}
                            proteinGoalG={proteinGoalG}
                        />
                        <Section
                            label="CONCLUÍDAS (HOJE)"
                            accentClass="text-calm-600"
                            habits={completedToday}
                            onToggle={handleToggle}
                            proteinGoalG={proteinGoalG}
                        />
                    </>
                )}
            </ScrollView>
        </View>
    );
}
