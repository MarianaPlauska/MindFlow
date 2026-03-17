import { View, Text, TouchableOpacity } from 'react-native';

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
};

export default function ExerciseCard({ exercise, onToggleExercise }: Props) {
    return (
        <View
            className="bg-neutral-800 rounded-2xl p-4 mb-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
            }}
        >
            {/* Header */}
            <TouchableOpacity
                onPress={() => onToggleExercise(exercise.id, exercise.is_completed)}
                className="flex-row items-center mb-4"
                activeOpacity={0.7}
            >
                <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                        exercise.is_completed
                            ? 'bg-calm-500 border-calm-500'
                            : 'border-neutral-500'
                    }`}
                >
                    {exercise.is_completed && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                </View>
                <Text
                    className={`text-base font-semibold ${
                        exercise.is_completed
                            ? 'text-neutral-500 line-through'
                            : 'text-neutral-100'
                    }`}
                >
                    {exercise.name}
                </Text>
            </TouchableOpacity>

            {/* Sets table */}
            {exercise.sets.length > 0 && (
                <View>
                    {/* Table header */}
                    <View className="flex-row mb-2 px-1">
                        <Text className="text-xs font-semibold text-neutral-500 w-16">
                            SÉRIE
                        </Text>
                        <Text className="text-xs font-semibold text-neutral-500 flex-1 text-center">
                            KG
                        </Text>
                        <Text className="text-xs font-semibold text-neutral-500 flex-1 text-right">
                            REPS
                        </Text>
                    </View>
                    {/* Divider */}
                    <View className="h-px bg-neutral-700 mb-2" />
                    {/* Rows */}
                    {exercise.sets.map((set) => (
                        <View
                            key={set.id}
                            className="flex-row items-center px-1 py-2"
                        >
                            <Text className="text-sm text-neutral-300 w-16">
                                {set.set_number}
                            </Text>
                            <Text className="text-sm text-neutral-100 font-medium flex-1 text-center">
                                {set.weight_kg % 1 === 0
                                    ? set.weight_kg.toFixed(0)
                                    : set.weight_kg.toFixed(1)}
                            </Text>
                            <Text className="text-sm text-neutral-100 font-medium flex-1 text-right">
                                {set.reps}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {exercise.sets.length === 0 && (
                <Text className="text-xs text-neutral-600 italic">
                    Nenhuma série cadastrada
                </Text>
            )}
        </View>
    );
}
