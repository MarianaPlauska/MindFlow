import React from 'react';
import { View, Text } from 'react-native';
import { PiggyBank, TrendingUp, AlertCircle } from 'lucide-react-native';
import { GlassCard } from '../../ui/GlassCard';

interface Props {
    dailyBudget: number;
    daysRemaining: number;
    available: number;
    monthSpent: number;
    income: number;
    hasIncome: boolean;
}

export function DailyBudgetCard({ dailyBudget, daysRemaining, available, monthSpent, income, hasIncome }: Props) {
    return (
        <GlassCard className="mx-6 mb-4">
            <View className="flex-row items-center justify-between mb-4 border-b border-black/5 pb-4">
                <View>
                    <View className="flex-row items-center mb-1">
                        <TrendingUp size={16} color="#64748b" />
                        <Text className="text-xs text-neutral-500 ml-1">Rendimento Total</Text>
                    </View>
                    <Text className="text-lg font-bold text-neutral-800">
                        R$ {income.toFixed(2).replace('.', ',')}
                    </Text>
                </View>
                <View className="items-end">
                    <View className="flex-row items-center mb-1">
                        <PiggyBank size={16} color="#22c55e" />
                        <Text className="text-xs text-calm-600 ml-1 font-medium">Saldo Livre</Text>
                    </View>
                    <Text className="text-2xl font-black text-calm-600">
                        R$ {available.toFixed(2).replace('.', ',')}
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between pt-1">
                <View className="items-center flex-1">
                    <Text className="text-xs text-neutral-400">Recomendação/Dia</Text>
                    <Text className="text-sm font-semibold text-calm-600">R$ {dailyBudget.toFixed(0)}</Text>
                    <Text className="text-[10px] text-neutral-400 mt-0.5">Para {daysRemaining} dias</Text>
                </View>
                
                <View className="w-px h-full bg-black/5" />
                
                <View className="items-center flex-1">
                    <Text className="text-xs text-neutral-400">Gasto no Mês</Text>
                    <Text className="text-sm font-semibold text-blush-600">R$ {monthSpent.toFixed(0)}</Text>
                    {!hasIncome && (
                         <Text className="text-[10px] text-amber-500 mt-0.5 font-medium">
                             Sem Renda Fixa
                         </Text>
                    )}
                </View>
            </View>
        </GlassCard>
    );
}
