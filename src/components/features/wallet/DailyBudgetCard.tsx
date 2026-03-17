import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PiggyBank, AlertCircle } from 'lucide-react-native';
import { GlassCard } from '../../ui/GlassCard';

interface Props {
    dailyBudget: number;
    daysRemaining: number;
    available: number;
    monthSpent: number;
    hasIncome: boolean;
}

export function DailyBudgetCard({ dailyBudget, daysRemaining, available, monthSpent, hasIncome }: Props) {
    return (
        <GlassCard className="mx-6 mb-4">
            <View className="flex-row items-center mb-3">
                <View className="bg-calm-50 rounded-2xl p-2 mr-3">
                    <PiggyBank size={20} color="#22c55e" />
                </View>
                <View className="flex-1">
                    <Text className="text-xs text-neutral-400">Recomendação diária</Text>
                    <Text className="text-2xl font-bold text-calm-700">
                        R$ {dailyBudget.toFixed(2).replace('.', ',')}
                    </Text>
                </View>
                {!hasIncome && (
                    <View className="bg-warmth-50 rounded-xl px-2 py-1">
                        <AlertCircle size={14} color="#ca8a04" />
                    </View>
                )}
            </View>
            <View className="flex-row justify-between">
                <View className="items-center flex-1">
                    <Text className="text-xs text-neutral-400">Restam</Text>
                    <Text className="text-sm font-semibold text-serene-600">{daysRemaining} dias</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-xs text-neutral-400">Disponível</Text>
                    <Text className="text-sm font-semibold text-calm-600">R$ {available.toFixed(0)}</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-xs text-neutral-400">Gasto/mês</Text>
                    <Text className="text-sm font-semibold text-blush-600">R$ {monthSpent.toFixed(0)}</Text>
                </View>
            </View>
        </GlassCard>
    );
}
