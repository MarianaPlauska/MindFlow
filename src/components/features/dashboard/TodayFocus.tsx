import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pill, AlertTriangle, Droplets, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSequence, 
    withTiming,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    displayName: string;
    todaySpent: number;
    dailyBudget?: number;
    waterProgress: number; // 0 to 1
    waterGoal: number;
}

export function TodayFocus({ displayName, todaySpent, dailyBudget = 100, waterProgress, waterGoal }: Props) {
    const [medTaken, setMedTaken] = useState(false);
    
    // Water vibration animation
    const rotation = useSharedValue(0);
    const translateX = useSharedValue(0);
    
    useEffect(() => {
        const hour = new Date().getHours();
        const expectedProgress = (hour - 8) / 14; // Assuming 8am to 10pm window
        
        if (waterProgress < expectedProgress && waterProgress < 1) {
            // Trigger gentle vibration/wobble every few seconds
            const interval = setInterval(() => {
                rotation.value = withSequence(
                    withTiming(-5, { duration: 50 }),
                    withTiming(5, { duration: 50 }),
                    withTiming(-5, { duration: 50 }),
                    withTiming(5, { duration: 50 }),
                    withTiming(0, { duration: 50 })
                );
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [waterProgress]);

    const waterAnimStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }]
    }));

    // Medicine Swipe Gesture
    const handleMedTaken = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setMedTaken(true);
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationX > 0) {
                translateX.value = event.translationX;
            }
        })
        .onEnd((event) => {
            if (event.translationX > 100) {
                translateX.value = withSpring(400); // Swipe away
                runOnJS(handleMedTaken)();
            } else {
                translateX.value = withSpring(0); // Reset
            }
        });

    const medAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: medTaken ? 0 : 1
    }));

    const isBudgetTight = todaySpent > (dailyBudget * 0.8);

    return (
        <View className="mb-4">
            <Text className="text-sm font-bold text-neutral-800 ml-6 mb-3 uppercase tracking-wider">Foco de Hoje</Text>

            <View className="px-6 space-y-3">
                {/* Medicine Reminder - Swipeable */}
                {!medTaken && (
                    <GestureDetector gesture={panGesture}>
                        <Animated.View 
                            className="bg-white rounded-3xl p-4 flex-row items-center border border-blush-100" 
                            style={[SHADOWS.cardSm, medAnimStyle]}
                        >
                            <View className="bg-blush-50 rounded-2xl p-3 mr-4">
                                <Pill size={20} color="#db2777" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-neutral-800">Vitamina D</Text>
                                <Text className="text-xs text-neutral-500">Agendado para agora</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => {
                                    translateX.value = withSpring(400);
                                    handleMedTaken();
                                }}
                                className="bg-blush-50 px-4 py-2 rounded-xl flex-row items-center"
                            >
                                <Check size={14} color="#db2777" />
                                <Text className="text-xs font-bold text-blush-600 ml-1">Já tomei</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </GestureDetector>
                )}

                {/* Financial Focus Alert */}
                {isBudgetTight && (
                    <View className="bg-warmth-50 rounded-3xl p-4 flex-row items-center border border-warmth-200" style={SHADOWS.cardSm}>
                        <View className="bg-warmth-100 rounded-2xl p-3 mr-4">
                            <AlertTriangle size={20} color="#ca8a04" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-bold text-warmth-800">Orçamento apertado</Text>
                            <Text className="text-xs text-warmth-700 leading-tight">
                                Mari, hoje o orçamento está apertado. Que tal economizar no jantar?
                            </Text>
                        </View>
                    </View>
                )}

                {/* Pending Habit (Water) */}
                <Animated.View className="bg-calm-50 rounded-3xl p-4 flex-row items-center border border-calm-200" style={[SHADOWS.cardSm, waterAnimStyle]}>
                    <View className="bg-white rounded-2xl p-3 mr-4" style={SHADOWS.cardSm}>
                        <Droplets size={20} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-bold text-calm-800">Beba mais água</Text>
                        <Text className="text-xs text-calm-700">Você está um pouco abaixo da meta para este horário.</Text>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}
