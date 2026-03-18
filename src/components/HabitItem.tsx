import { View, Text, TouchableOpacity } from 'react-native';
import { Droplet, Pill, Dumbbell, Salad, CheckCircle2 } from 'lucide-react-native';

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

const getIconForHabit = (title: string, isCompleted: boolean) => {
    const t = title.toLowerCase();
    const defaultColor = isCompleted ? '#d4d4d4' : '#8b5cf6';
    if (t.includes('água') || t.includes('agua')) return <Droplet size={20} color={isCompleted ? '#d4d4d4' : '#3b82f6'} />;
    if (t.includes('minoxidil') || t.includes('remédio')) return <Pill size={20} color={isCompleted ? '#d4d4d4' : '#ec4899'} />;
    if (t.includes('treinar') || t.includes('treino') || t.includes('academia')) return <Dumbbell size={20} color={isCompleted ? '#d4d4d4' : '#f59e0b'} />;
    if (t.includes('dieta') || t.includes('comer') || t.includes('proteína')) return <Salad size={20} color={isCompleted ? '#d4d4d4' : '#22c55e'} />;
    return <CheckCircle2 size={20} color={defaultColor} />;
};

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
            className="flex-row items-center py-4 px-4 bg-white"
        >
            {/* Outline Checkbox */}
            <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 flex-shrink-0 ${
                    habit.is_completed
                        ? 'bg-calm-500 border-calm-500'
                        : isOverdue
                        ? 'border-warmth-500 bg-warmth-50'
                        : 'border-neutral-300 bg-neutral-50'
                }`}
            >
                {habit.is_completed && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                )}
            </View>
            
            {/* Dynamic Lucide Icon */}
            <View className="mr-3 p-2 bg-neutral-50 rounded-xl">
                {getIconForHabit(habit.title, habit.is_completed)}
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text
                    className={`text-base font-semibold ${
                        habit.is_completed
                            ? 'text-neutral-400 line-through'
                            : 'text-neutral-800'
                    }`}
                >
                    {habit.title}
                </Text>
                {habit.habit_type === 'protein' && !habit.is_completed && (
                    <Text className="text-xs text-calm-500 mt-0.5 font-medium">
                        0/{proteinGoalG}g consumido hoje
                    </Text>
                )}
                {dueDateLabel && (
                    <Text
                        className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                            isOverdue ? 'text-warmth-500' : 'text-neutral-400'
                        }`}
                    >
                        {isOverdue ? '⚠ ' : ''}
                        {dueDateLabel}
                        {isOverdue && (
                            <Text className="text-warmth-500"> VENCIDA</Text>
                        )}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}
