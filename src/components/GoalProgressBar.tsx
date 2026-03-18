import { View, Text } from 'react-native';

type Props = {
    title: string;
    current: number;
    target: number;
    accentColor?: string;
};

function formatCurrency(value: number): string {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
    }
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function GoalProgressBar({
    title,
    current,
    target,
    accentColor = '#4ade80', // calm-400
}: Props) {
    const pct = target > 0 ? Math.min(current / target, 1) : 0;
    const pctLabel = Math.round(pct * 100);

    return (
        <View
            className="bg-neutral-800 rounded-2xl p-5 mb-4"
            style={{
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.35)',
            }}
        >
            {/* Title row */}
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-semibold text-neutral-100">
                    {title}
                </Text>
                <Text className="text-sm font-bold" style={{ color: accentColor }}>
                    {pctLabel}%
                </Text>
            </View>

            {/* Amount row */}
            <View className="flex-row justify-between items-baseline mb-4">
                <Text className="text-2xl font-bold text-white">
                    {formatCurrency(current)}
                </Text>
                <Text className="text-xs text-neutral-500">
                    meta: {formatCurrency(target)}
                </Text>
            </View>

            {/* Progress track */}
            <View className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                <View
                    className="h-full rounded-full"
                    style={{
                        width: `${pctLabel}%`,
                        backgroundColor: accentColor,
                    }}
                />
            </View>
        </View>
    );
}
