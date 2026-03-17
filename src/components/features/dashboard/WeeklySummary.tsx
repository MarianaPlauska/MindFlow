import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, Droplets, Brain, Wallet, TrendingUp } from 'lucide-react-native';
import { useWeeklyInsights } from '../../../hooks/useWeeklyInsights';
import { SHADOWS } from '../../../constants/theme';
import { MOOD_LEVELS } from '../../../constants/categories';

export function WeeklySummary() {
    const { insight, loading } = useWeeklyInsights();

    if (loading || !insight) {
        return (
            <View className="bg-white rounded-3xl p-6 items-center" style={SHADOWS.card}>
                <Sparkles size={24} color="#d4d4d4" />
                <Text className="text-neutral-400 text-sm mt-2">Calculando seus insights...</Text>
            </View>
        );
    }

    const moodData = MOOD_LEVELS.find((m) => m.score === Math.round(insight.moodAvgScore));

    return (
        <View className="bg-white rounded-3xl p-6" style={SHADOWS.card}>
            {/* Header */}
            <View className="flex-row items-center mb-4">
                <View className="bg-warmth-50 rounded-2xl p-2 mr-3">
                    <TrendingUp size={20} color="#ca8a04" />
                </View>
                <View>
                    <Text className="text-base font-semibold text-neutral-800">Resumo Semanal</Text>
                    <Text className="text-xs text-neutral-400">Últimos 7 dias</Text>
                </View>
            </View>

            {/* Warm message */}
            <View className="bg-serene-50 rounded-2xl p-4 mb-4">
                <Text className="text-sm text-serene-700 leading-5">
                    {insight.message}
                </Text>
            </View>

            {/* Stats grid */}
            <View className="flex-row flex-wrap">
                <View className="w-1/2 pr-1 mb-3">
                    <View className="bg-calm-50 rounded-2xl p-3 items-center">
                        <Droplets size={18} color="#3b82f6" />
                        <Text className="text-lg font-bold text-serene-700 mt-1">
                            {insight.waterDaysHit}/7
                        </Text>
                        <Text className="text-xs text-neutral-400">Meta de água</Text>
                    </View>
                </View>

                <View className="w-1/2 pl-1 mb-3">
                    <View className="bg-calm-50 rounded-2xl p-3 items-center">
                        <Brain size={18} color="#8b5cf6" />
                        <Text className="text-lg font-bold text-serene-700 mt-1">
                            {insight.moodStablePct}%
                        </Text>
                        <Text className="text-xs text-neutral-400">Humor estável</Text>
                    </View>
                </View>

                <View className="w-1/2 pr-1">
                    <View className="bg-calm-50 rounded-2xl p-3 items-center">
                        <Text style={{ fontSize: 18 }}>{moodData?.emoji || '😐'}</Text>
                        <Text className="text-sm font-semibold text-neutral-700 mt-1">
                            {insight.dominantMood}
                        </Text>
                        <Text className="text-xs text-neutral-400">Humor dominante</Text>
                    </View>
                </View>

                <View className="w-1/2 pl-1">
                    <View className="bg-calm-50 rounded-2xl p-3 items-center">
                        <Wallet size={18} color="#22c55e" />
                        <Text className="text-lg font-bold text-calm-700 mt-1">
                            R$ {insight.totalSpent.toFixed(0)}
                        </Text>
                        <Text className="text-xs text-neutral-400">Gasto total</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
