import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { MOOD_LEVELS } from '../../../constants/categories';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    selectedScore: number | null;
    scaleAnims: Animated.Value[];
    onSelect: (index: number, score: number) => void;
}

export function MoodSelector({ selectedScore, scaleAnims, onSelect }: Props) {
    return (
        <View className="bg-white rounded-3xl p-6" style={SHADOWS.card}>
            <Text className="text-base font-semibold text-neutral-800 mb-1">
                Como você está agora?
            </Text>
            <Text className="text-xs text-neutral-400 mb-5">
                Toque para registrar — é seguro e anônimo 💙
            </Text>

            <View className="flex-row justify-between">
                {MOOD_LEVELS.map((mood, index) => (
                    <TouchableOpacity
                        key={mood.score}
                        onPress={() => onSelect(index, mood.score)}
                        activeOpacity={0.7}
                    >
                        <Animated.View
                            className="items-center px-2 py-2 rounded-2xl"
                            style={{
                                transform: [{ scale: scaleAnims[index] }],
                                backgroundColor:
                                    selectedScore === mood.score ? mood.bg : 'transparent',
                            }}
                        >
                            <Text style={{ fontSize: 28 }}>{mood.emoji}</Text>
                            <Text className="text-xs text-neutral-500 mt-1 text-center" style={{ maxWidth: 64 }}>
                                {mood.label}
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
