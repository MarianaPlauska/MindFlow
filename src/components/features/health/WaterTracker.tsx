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

    return (
        <View className="bg-white rounded-3xl p-6" style={SHADOWS.card}>
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <Droplets size={20} color="#3b82f6" />
                    <Text className="text-base font-semibold text-serene-700 ml-2">Água</Text>
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

            <View className="items-center mb-3">
                <WaterWave percent={waterPercent} size={110} />
            </View>

            <View className="flex-row justify-between">
                <Text className="text-xs text-neutral-400">{waterToday}ml de {waterGoal}ml</Text>
                <Text className="text-xs font-semibold text-serene-600">{waterPercent.toFixed(0)}%</Text>
            </View>
        </View>
    );
}
