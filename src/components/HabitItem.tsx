import { View, Text, TouchableOpacity } from 'react-native';

export type Habit = {
    id: string;
    user_id: string;
    title: string;
    due_date: string | null;
    is_completed: boolean;
    completed_at: string | null;
    habit_type: 'task' | 'protein';
    created_at: string;
};

type Props = {
    habit: Habit;
    onToggle: (id: string, current: boolean) => void;
    proteinGoalG?: number;
};

function formatDueDate(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr + 'T00:00:00');
    const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === -1) return 'Ontem';
    if (diff < 0) {
        const d = due.getDate().toString().padStart(2, '0');
        const m = (due.getMonth() + 1).toString().padStart(2, '0');
        return `${d}/${m}`;
    }
    if (diff === 1) return 'Amanhã';
    return `${diff} dias`;
}

export default function HabitItem({ habit, onToggle, proteinGoalG = 100 }: Props) {
    const dueDateLabel = formatDueDate(habit.due_date);
    const isOverdue =
        !habit.is_completed &&
        habit.due_date !== null &&
        new Date(habit.due_date + 'T00:00:00') <
            (() => {
                const t = new Date();
                t.setHours(0, 0, 0, 0);
                return t;
            })();

    return (
        <TouchableOpacity
            onPress={() => onToggle(habit.id, habit.is_completed)}
            activeOpacity={0.7}
            className="flex-row items-center py-3 px-4"
        >
            {/* Circle checkbox */}
            <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 flex-shrink-0 ${
                    habit.is_completed
                        ? 'bg-calm-500 border-calm-500'
                        : isOverdue
                        ? 'border-warmth-400'
                        : 'border-neutral-500'
                }`}
            >
                {habit.is_completed && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                )}
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text
                    className={`text-sm font-medium ${
                        habit.is_completed
                            ? 'text-neutral-600 line-through'
                            : 'text-neutral-100'
                    }`}
                >
                    {habit.title}
                </Text>
                {habit.habit_type === 'protein' && !habit.is_completed && (
                    <Text className="text-xs text-calm-400 mt-0.5">
                        0/{proteinGoalG}g proteína
                    </Text>
                )}
                {dueDateLabel && (
                    <Text
                        className={`text-xs mt-0.5 ${
                            isOverdue ? 'text-warmth-400' : 'text-neutral-500'
                        }`}
                    >
                        {isOverdue ? '⚠ ' : ''}
                        {dueDateLabel}
                        {isOverdue && (
                            <Text className="text-warmth-400"> VENCIDA</Text>
                        )}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}
