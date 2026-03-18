import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Beef } from 'lucide-react-native';
import { ProgressBar } from '../../ui/ProgressBar';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    current: number;
    goal: number;
    percent: number;
    onAddProtein?: (amount: number) => void;
    loadingProtein?: boolean;
}

export function ProteinTracker({ current, goal, percent, onAddProtein, loadingProtein }: Props) {
    return (
        <View className="bg-white rounded-3xl p-6" style={SHADOWS.card}>
            <View className="flex-row items-center mb-4">
                <View className="flex-row items-center flex-1">
                    <Beef size={20} color="#22c55e" />
                    <Text className="text-base font-semibold text-calm-700 ml-2">
                        Proteína
                    </Text>
                </View>
                {onAddProtein && (
                    <View className="flex-row space-x-2">
                        <TouchableOpacity onPress={() => onAddProtein(15)} disabled={loadingProtein} activeOpacity={0.8} className="mr-2">
                            <View className="bg-calm-100 rounded-2xl px-3 py-2 flex-row items-center" style={{ opacity: loadingProtein ? 0.5 : 1 }}>
                                <Beef size={14} color="#22c55e" />
                                <Text className="text-calm-700 font-bold ml-1 text-xs">+15g</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onAddProtein(30)} disabled={loadingProtein} activeOpacity={0.8}>
                            <View className="bg-calm-500 rounded-2xl px-3 py-2 flex-row items-center" style={{ opacity: loadingProtein ? 0.5 : 1 }}>
                                <Beef size={14} color="#fff" />
                                <Text className="text-white font-bold ml-1 text-xs">+30g</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
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
