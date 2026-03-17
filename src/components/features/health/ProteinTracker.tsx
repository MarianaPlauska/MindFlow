import React from 'react';
import { View, Text } from 'react-native';
import { Beef } from 'lucide-react-native';
import { ProgressBar } from '../../ui/ProgressBar';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    current: number;
    goal: number;
    percent: number;
}

export function ProteinTracker({ current, goal, percent }: Props) {
    return (
        <View className="bg-white rounded-3xl p-6" style={SHADOWS.card}>
            <View className="flex-row items-center mb-3">
                <Beef size={20} color="#22c55e" />
                <Text className="text-base font-semibold text-calm-700 ml-2">
                    Proteína
                </Text>
                <View className="bg-calm-50 rounded-full px-2 py-0.5 ml-auto">
                    <Text className="text-xs font-bold text-calm-600">Meta: {goal}g</Text>
                </View>
            </View>
            <ProgressBar
                percent={percent}
                height={16}
                color="#22c55e"
                bgColor="#dcfce7"
            />
            <View className="flex-row justify-between mt-2">
                <Text className="text-xs text-neutral-400">{current}g / {goal}g</Text>
                <Text className="text-xs font-semibold text-calm-600">{percent.toFixed(0)}%</Text>
            </View>
        </View>
    );
}
