import { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import ExerciseCard, {
    type WorkoutExercise,
} from '../../components/ExerciseCard';

function todayISO(): string {
    return new Date().toISOString().split('T')[0];
}

export default function WorkoutScreen() {
    const { session } = useAuth();
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function fetchExercises() {
        if (!session?.user.id) return;

        const { data: exercisesData } = await supabase
            .from('workout_exercises')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('workout_date', todayISO())
            .order('created_at', { ascending: true });

        if (!exercisesData || exercisesData.length === 0) {
            setExercises([]);
            return;
        }

        const exerciseIds = exercisesData.map((e) => e.id);
        const { data: setsData } = await supabase
            .from('workout_sets')
            .select('*')
            .in('exercise_id', exerciseIds)
            .order('set_number', { ascending: true });

        const merged: WorkoutExercise[] = exercisesData.map((ex) => ({
            ...ex,
            sets: (setsData ?? []).filter((s) => s.exercise_id === ex.id),
        }));

        setExercises(merged);
    }

    useEffect(() => {
        fetchExercises().finally(() => setLoading(false));
    }, [session]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchExercises();
        setRefreshing(false);
    }, [session]);

    async function handleToggleExercise(id: string, current: boolean) {
        setExercises((prev) =>
            prev.map((ex) =>
                ex.id === id ? { ...ex, is_completed: !current } : ex
            )
        );
        await supabase
            .from('workout_exercises')
            .update({ is_completed: !current })
            .eq('id', id);
    }

    const completed = exercises.filter((e) => e.is_completed).length;
    const total = exercises.length;

    const dateLabel = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <View className="flex-1 bg-neutral-950">
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 24,
                    paddingBottom: 40,
                }}
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
                    <Text className="text-2xl font-bold text-neutral-100">
                        Treino de Hoje
                    </Text>
                    <Text className="text-sm text-neutral-500 mt-1 capitalize">
                        {dateLabel}
                    </Text>
                </View>

                {/* Progress badge */}
                {total > 0 && (
                    <View className="bg-neutral-800 rounded-2xl px-5 py-4 mb-6 flex-row items-center justify-between">
                        <Text className="text-sm text-neutral-400">
                            Exercícios concluídos
                        </Text>
                        <View className="flex-row items-baseline gap-1">
                            <Text className="text-xl font-bold text-calm-400">
                                {completed}
                            </Text>
                            <Text className="text-sm text-neutral-500">
                                /{total}
                            </Text>
                        </View>
                    </View>
                )}

                {loading && (
                    <ActivityIndicator
                        size="large"
                        color="#4ade80"
                        style={{ marginTop: 40 }}
                    />
                )}

                {!loading && exercises.length === 0 && (
                    <View className="items-center mt-20">
                        <Text className="text-4xl mb-4">🏋️</Text>
                        <Text className="text-base text-neutral-400 text-center">
                            Nenhum exercício para hoje.{'\n'}Adicione pelo Supabase ou aguarde a UI de criação.
                        </Text>
                    </View>
                )}

                {!loading &&
                    exercises.map((ex) => (
                        <ExerciseCard
                            key={ex.id}
                            exercise={ex}
                            onToggleExercise={handleToggleExercise}
                        />
                    ))}
            </ScrollView>
        </View>
    );
}
