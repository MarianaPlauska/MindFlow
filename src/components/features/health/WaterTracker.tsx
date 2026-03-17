import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Droplets } from 'lucide-react-native';
import { WaterWave } from './WaterWave';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    waterToday: number;
    waterGoal: number;
    waterPercent: number;
    onAddWater: () => void;
    loadingWater: boolean;
}

export function WaterTracker({ waterToday, waterGoal, waterPercent, onAddWater, loadingWater }: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    function handlePress() {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start();
        onAddWater();
    }

    const glasses = Math.floor(waterToday / 200);
    const glassesGoal = Math.floor(waterGoal / 200);

    return (
        <View className="bg-white rounded-3xl p-6" style={SHADOWS.card}>
            <View className="flex-row items-center justify-between mb-5">
                <View className="flex-row items-center">
                    <Droplets size={20} color="#3b82f6" />
                    <Text className="text-base font-semibold text-serene-700 ml-2">Hidratação</Text>
                </View>
                <TouchableOpacity onPress={handlePress} disabled={loadingWater} activeOpacity={0.8}>
                    <Animated.View
                        className="bg-serene-500 rounded-2xl px-5 py-2.5 flex-row items-center"
                        style={{ transform: [{ scale: scaleAnim }], opacity: loadingWater ? 0.5 : 1 }}
                    >
                        <Droplets size={16} color="#fff" />
                        <Text className="text-white font-semibold ml-1 text-sm">+ 200ml</Text>
                    </Animated.View>
                </TouchableOpacity>
            </View>

            {/* WaterWave visual */}
            <View className="items-center mb-4">
                <WaterWave percent={waterPercent} size={130} />
                <Text className="text-2xl font-bold text-serene-700 mt-3">
                    {waterToday}ml
                </Text>
                <Text className="text-xs text-neutral-400">
                    {glasses} de {glassesGoal} copos • Meta: {waterGoal}ml
                </Text>
            </View>

            {/* Progress info */}
            <View className="bg-serene-50 rounded-2xl p-3 flex-row justify-between">
                <View className="items-center flex-1">
                    <Text className="text-xs text-neutral-400">Progresso</Text>
                    <Text className="text-sm font-bold text-serene-600">{waterPercent.toFixed(0)}%</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-xs text-neutral-400">Faltam</Text>
                    <Text className="text-sm font-bold text-serene-600">
                        {Math.max(waterGoal - waterToday, 0)}ml
                    </Text>
                </View>
            </View>
        </View>
    );
}
