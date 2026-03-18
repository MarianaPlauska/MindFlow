import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SHADOWS } from '../constants/theme';

export type WorkoutSet = {
    id: string;
    set_number: number;
    weight_kg: number;
    reps: number;
    is_completed: boolean;
};

export type WorkoutExercise = {
    id: string;
    name: string;
    is_completed: boolean;
    workout_date: string;
    sets: WorkoutSet[];
};

type Props = {
    exercise: WorkoutExercise;
    onToggleExercise: (id: string, current: boolean) => void;
    onAddSet?: (exerciseId: string, weightKg: number, reps: number) => Promise<void>;
};

export default function ExerciseCard({ exercise, onToggleExercise, onAddSet }: Props) {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSaveSet() {
        if (!weight || !reps || !onAddSet) return;
        setSubmitting(true);
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        await onAddSet(exercise.id, parseFloat(weight.replace(',', '.')), parseInt(reps, 10));
        setWeight('');
        setReps('');
        setSubmitting(false);
    }
    return (
        <View
            className="bg-white rounded-3xl p-5 mb-5 border border-neutral-100"
            style={SHADOWS.card}
        >
            {/* Header */}
            <Pressable
                onPress={() => {
                    if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
                    onToggleExercise(exercise.id, exercise.is_completed);
                }}
                className="flex-row items-center mb-5 active:opacity-70"
            >
                <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                        exercise.is_completed
                            ? 'bg-calm-500 border-calm-500'
                            : 'border-neutral-300'
                    }`}
                >
                    {exercise.is_completed && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                </View>
                <Text
                    className={`text-lg font-bold ${
                        exercise.is_completed
                            ? 'text-neutral-400 line-through'
                            : 'text-neutral-800'
                    }`}
                >
                    {exercise.name}
                </Text>
            </Pressable>

            {/* Sets table */}
            {exercise.sets.length > 0 && (
                <View>
                    {/* Table header */}
                    <View className="flex-row mb-3 px-1">
                        <Text className="text-[10px] font-bold text-neutral-400 w-16 tracking-widest">SÉRIE</Text>
                        <Text className="text-[10px] font-bold text-neutral-400 flex-1 text-center tracking-widest">KG</Text>
                        <Text className="text-[10px] font-bold text-neutral-400 flex-1 text-right tracking-widest">REPS</Text>
                    </View>
                    {/* Divider */}
                    <View className="h-px bg-neutral-100 mb-2" />
                    {/* Rows */}
                    {exercise.sets.map((set) => (
                        <View
                            key={set.id}
                            className="flex-row items-center px-1 py-3 border-b border-neutral-50"
                        >
                            <Text className="text-sm text-neutral-500 font-medium w-16">
                                {set.set_number}
                            </Text>
                            <Text className="text-base text-neutral-700 font-semibold flex-1 text-center">
                                {set.weight_kg % 1 === 0
                                    ? set.weight_kg.toFixed(0)
                                    : set.weight_kg.toFixed(1)}
                            </Text>
                            <Text className="text-base text-neutral-700 font-semibold flex-1 text-right">
                                {set.reps}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

                    {/* Input Row for New Set */}
                    {onAddSet && !exercise.is_completed && (
                        <View className="flex-row items-center px-1 py-3 mt-2 border-t border-neutral-50">
                            <Text className="text-sm text-neutral-400 font-bold w-16 px-1">
                                {exercise.sets.length + 1}
                            </Text>
                            <View className="flex-1 px-1">
                                <TextInput
                                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-center text-neutral-800 font-semibold"
                                    placeholder="KG"
                                    placeholderTextColor="#a3a3a3"
                                    keyboardType="decimal-pad"
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            </View>
                            <View className="flex-1 px-1">
                                <TextInput
                                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-center text-neutral-800 font-semibold"
                                    placeholder="Reps"
                                    placeholderTextColor="#a3a3a3"
                                    keyboardType="number-pad"
                                    value={reps}
                                    onChangeText={setReps}
                                />
                            </View>
                            <Pressable 
                                onPress={handleSaveSet}
                                disabled={submitting || !weight || !reps}
                                className="w-10 h-10 rounded-xl items-center justify-center bg-calm-100 active:opacity-70 ml-2"
                                style={{ opacity: (!weight || !reps || submitting) ? 0.5 : 1 }}
                            >
                                {submitting ? <ActivityIndicator size="small" color="#22c55e" /> : <Check size={18} color="#22c55e" />}
                            </Pressable>
                        </View>
                    )}
        </View>
    );
}
