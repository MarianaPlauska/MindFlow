import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, Droplets, Brain, Dumbbell } from 'lucide-react-native';
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

    return (
        <View className="bg-white rounded-[32px] p-6" style={{ boxShadow: '0px 12px 32px rgba(0,0,0,0.06)' }}>
            {/* Header */}
            <View className="flex-row items-center mb-5">
                <View className="w-10 h-10 bg-warmth-50 rounded-2xl items-center justify-center mr-3">
                    <Sparkles size={20} color="#ca8a04" />
                </View>
                <View>
                    <Text className="text-sm font-extrabold text-neutral-800 tracking-wider uppercase">Sua Semana</Text>
                    <Text className="text-xs text-neutral-400 font-medium">Insights da IA</Text>
                </View>
            </View>

            {/* AI Message in focus */}
            <View className="mb-8 px-1">
                <Text className="text-lg font-serif italic text-neutral-700 leading-snug">
                    "{insight.message}"
                </Text>
            </View>

            {/* Floating Badges */}
            <View className="flex-row justify-between items-center px-4">
                
                {/* Water Badge */}
                <View className="items-center">
                    <View className="relative">
                        <View className="w-14 h-14 bg-calm-50 rounded-full items-center justify-center">
                            <Droplets size={24} color="#3b82f6" />
                        </View>
                        <View className="absolute -top-1 -right-3 bg-white rounded-full p-1" style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}>
                            <View className="bg-calm-500 rounded-full min-w-[24px] h-6 px-1.5 items-center justify-center">
                                <Text className="text-white text-[10px] font-extrabold">{insight.waterDaysHit}/7</Text>
                            </View>
                        </View>
                    </View>
                    <Text className="text-[10px] font-bold text-neutral-500 mt-2 uppercase tracking-wider">Água</Text>
                </View>

                {/* Training Badge */}
                <View className="items-center">
                    <View className="relative">
                        <View className="w-14 h-14 bg-warmth-50 rounded-full items-center justify-center">
                            <Dumbbell size={24} color="#f59e0b" />
                        </View>
                        <View className="absolute -top-1 -right-3 bg-white rounded-full p-1" style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}>
                            <View className="bg-warmth-500 rounded-full min-w-[24px] h-6 px-1.5 items-center justify-center">
                                <Text className="text-white text-[10px] font-extrabold">{insight.workoutDaysHit || 0}/7</Text>
                            </View>
                        </View>
                    </View>
                    <Text className="text-[10px] font-bold text-neutral-500 mt-2 uppercase tracking-wider">Treino</Text>
                </View>

                {/* Mood Badge */}
                <View className="items-center">
                    <View className="relative">
                        <View className="w-14 h-14 bg-serene-50 rounded-full items-center justify-center">
                            <Brain size={24} color="#8b5cf6" />
                        </View>
                        <View className="absolute -top-1 -right-3 bg-white rounded-full p-1" style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}>
                            <View className="bg-serene-500 rounded-full min-w-[24px] h-6 px-1.5 items-center justify-center">
                                <Text className="text-white text-[10px] font-extrabold">{insight.moodStablePct}%</Text>
                            </View>
                        </View>
                    </View>
                    <Text className="text-[10px] font-bold text-neutral-500 mt-2 uppercase tracking-wider">Humor</Text>
                </View>

            </View>
        </View>
    );
}
