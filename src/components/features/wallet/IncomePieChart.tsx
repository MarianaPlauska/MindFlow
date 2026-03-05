import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { SHADOWS } from '../../../constants/theme';

interface Slice {
    label: string;
    value: number;
    color: string;
}

interface Props {
    income: number;
    fixedExpenses: number;
    installmentsTotal: number;
    monthSpent: number;
}

export function IncomePieChart({ income, fixedExpenses, installmentsTotal, monthSpent }: Props) {
    if (income <= 0) {
        return (
            <View className="bg-white rounded-3xl p-6 items-center" style={SHADOWS.card}>
                <Text className="text-neutral-400 text-sm text-center">
                    Configure sua renda mensal{'\n'}para ver o gráfico de comprometimento 💰
                </Text>
            </View>
        );
    }

    const variableSpent = Math.max(monthSpent - fixedExpenses, 0);
    const free = Math.max(income - fixedExpenses - installmentsTotal - variableSpent, 0);

    const slices: Slice[] = [
        { label: 'Gastos Fixos', value: fixedExpenses, color: '#ec4899' },
        { label: 'Parcelas', value: installmentsTotal, color: '#f97316' },
        { label: 'Variáveis', value: variableSpent, color: '#eab308' },
        { label: 'Livre', value: free, color: '#22c55e' },
    ].filter((s) => s.value > 0);

    const total = slices.reduce((a, s) => a + s.value, 0);
    const size = 140;
    const cx = size / 2;
    const cy = size / 2;
    const r = 55;

    let currentAngle = -Math.PI / 2;
    const paths = slices.map((slice) => {
        const angle = (slice.value / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(currentAngle);
        const y1 = cy + r * Math.sin(currentAngle);
        const x2 = cx + r * Math.cos(currentAngle + angle);
        const y2 = cy + r * Math.sin(currentAngle + angle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        currentAngle += angle;
        return { d, color: slice.color, key: slice.label };
    });

    return (
        <View className="bg-white rounded-3xl p-5" style={SHADOWS.card}>
            <Text className="text-base font-semibold text-neutral-800 mb-4">
                📊 Comprometimento da Renda
            </Text>

            <View className="flex-row items-center">
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <G>
                        {paths.map((p) => (
                            <Path key={p.key} d={p.d} fill={p.color} />
                        ))}
                    </G>
                </Svg>

                <View className="flex-1 ml-4">
                    {slices.map((s) => {
                        const pct = ((s.value / total) * 100).toFixed(0);
                        return (
                            <View key={s.label} className="flex-row items-center mb-2">
                                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s.color }} className="mr-2" />
                                <View className="flex-1">
                                    <Text className="text-xs text-neutral-600">{s.label}</Text>
                                </View>
                                <Text className="text-xs font-semibold text-neutral-700">{pct}%</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
