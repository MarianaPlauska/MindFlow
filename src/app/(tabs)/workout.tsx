import { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Pressable,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BottomModal } from '../../components/ui/BottomModal';
import { Plus, Dumbbell } from 'lucide-react-native';
import { SHADOWS } from '../../constants/theme';
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

    // Modals state
    const [showExModal, setShowExModal] = useState(false);
    const [newExName, setNewExName] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

        if (!session?.user?.id) return;

        const channel = supabase
            .channel('workout-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'workout_exercises', filter: `user_id=eq.${session.user.id}` }, () => {
                fetchExercises();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'workout_sets' }, () => {
                fetchExercises();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
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

    async function handleAddExercise() {
        if (!newExName || !session?.user.id) return;
        setSubmitting(true);
        const { error } = await supabase.from('workout_exercises').insert({
            user_id: session.user.id,
            name: newExName,
            workout_date: todayISO(),
        });
        if (error) Alert.alert("Erro ao adicionar exercício", error.message);
        setNewExName('');
        setShowExModal(false);
        await fetchExercises();
        setSubmitting(false);
    }

    async function handleAddSet(exerciseId: string, weightKg: number, reps: number) {
        if (!exerciseId || !weightKg || !reps) return;
        
        // Count existing sets to define set_number
        const ex = exercises.find((e) => e.id === exerciseId);
        const nextSetNum = ex ? ex.sets.length + 1 : 1;

        const { error } = await supabase.from('workout_sets').insert({
            exercise_id: exerciseId,
            set_number: nextSetNum,
            weight_kg: weightKg,
            reps: reps,
        });
        if (error) Alert.alert("Erro ao salvar série", error.message);

        await fetchExercises();
    }

    const completed = exercises.filter((e) => e.is_completed).length;
    const total = exercises.length;

    const dateLabel = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    function handleFinishWorkout() {
        // Calculate Total Volume matching weight * reps purely for active exercises
        let totalVolume = 0;
        let totalSets = 0;
        
        exercises.forEach((ex) => {
            ex.sets.forEach((set) => {
                totalVolume += (set.weight_kg * set.reps);
                totalSets += 1;
            });
        });

        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }

        Alert.alert(
            "Parabéns pelo Treino! 💪",
            `Você realizou ${totalSets} séries hoje, movendo um volume total de ${totalVolume.toFixed(0)} kg!\n\nBom descanso e não esqueça de bater a meta de proteína.`,
            [{ text: "Incrível!" }]
        );
    }

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 64, // added explicit pt to avoid notch if no header
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
                <View className="mb-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-2xl font-bold text-neutral-800">
                            Treino de Hoje
                        </Text>
                        <Text className="text-sm text-neutral-400 mt-1 capitalize">
                            {dateLabel}
                        </Text>
                    </View>
                    <Pressable 
                        onPress={() => setShowExModal(true)}
                        className="bg-white px-3 py-2 rounded-xl flex-row items-center border border-neutral-100 active:opacity-70"
                        style={SHADOWS.cardSm}
                    >
                        <Plus size={16} color="#3b82f6" />
                        <Text className="text-serene-600 font-bold ml-1 text-xs">Novo</Text>
                    </Pressable>
                </View>

                {/* Progress badge */}
                {total > 0 && (
                    <View className="bg-white rounded-2xl px-5 py-4 mb-6 flex-row items-center justify-between border border-neutral-100" style={SHADOWS.cardSm}>
                        <Text className="text-sm text-neutral-500 font-medium">
                            Exercícios concluídos
                        </Text>
                        <View className="flex-row items-baseline gap-1">
                            <Text className="text-xl font-bold text-calm-600">
                                {completed}
                            </Text>
                            <Text className="text-sm text-neutral-400 font-medium">
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
                        <Text className="text-4xl mb-4">✨</Text>
                        <Text className="text-base text-neutral-400 text-center px-6">
                            Ainda não há registros por aqui, Mari.{'\n'}Vamos começar?
                        </Text>
                    </View>
                )}

                {!loading &&
                    exercises.map((ex) => (
                        <ExerciseCard
                            key={ex.id}
                            exercise={ex}
                            onToggleExercise={handleToggleExercise}
                            onAddSet={handleAddSet}
                        />
                    ))}

                {!loading && exercises.length > 0 && (
                    <Pressable 
                        onPress={handleFinishWorkout}
                        className="mt-6 bg-calm-600 rounded-2xl py-4 items-center flex-row justify-center active:opacity-80" 
                        style={{ boxShadow: '0px 8px 16px rgba(22, 163, 74, 0.25)' as any }}
                    >
                        <Dumbbell size={20} color="#fff" />
                        <Text className="text-white font-bold text-lg ml-2">Finalizar Treino</Text>
                    </Pressable>
                )}
            </ScrollView>

            {/* Modal de Novo Exercício */}
            <BottomModal visible={showExModal} onClose={() => setShowExModal(false)} title="Adicionar Exercício">
                <Text className="text-sm text-neutral-500 mb-4">
                    Insira o nome do exercício para adicioná-lo ao treino de hoje.
                </Text>
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                    placeholder="Nome (ex: Supino Inclinado)"
                    placeholderTextColor="#a3a3a3"
                    value={newExName}
                    onChangeText={setNewExName}
                />
                <Pressable 
                    onPress={handleAddExercise} 
                    disabled={submitting || !newExName.trim()}
                    className="bg-calm-500 rounded-2xl py-3.5 items-center active:opacity-80"
                    style={{ opacity: (submitting || !newExName.trim()) ? 0.7 : 1 }}
                >
                    <Text className="text-white font-semibold">Salvar Exercício</Text>
                </Pressable>
            </BottomModal>
        </View>
    );
}
