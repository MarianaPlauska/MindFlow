import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreditCard, Utensils } from 'lucide-react-native';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    card: any;
    spent?: number;
    onPress?: () => void;
}

export function PaymentCard({ card, spent, onPress }: Props) {
    const actualSpent = spent ?? Number(card.current_balance) ?? 0;
    const usedPct = card.card_limit > 0
        ? (actualSpent / card.card_limit) * 100
        : 0;
    const clamped = Math.min(usedPct, 100);
    const isOver = usedPct > 80;
    const isVR = card.type === 'benefit' || card.name.toLowerCase().includes('vr');

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <View
                className="rounded-[32px] p-5 mr-4"
                style={{
                    width: 280,
                    height: 170,
                    backgroundColor: card.color || '#3b82f6',
                    ...SHADOWS.coloredCard(card.color || '#3b82f6'),
                    overflow: 'hidden',
                }}
            >
                {/* Subtle Logo in Background */}
                <View className="absolute -right-6 -bottom-6 opacity-10">
                    {isVR ? <Utensils size={140} color="#fff" /> : <CreditCard size={140} color="#fff" />}
                </View>

                <View className="flex-row items-center justify-between mb-2">
                    <View className="bg-white/20 rounded-xl px-3 py-1.5 flex-row items-center">
                        {isVR ? <Utensils size={14} color="#fff" /> : <CreditCard size={14} color="#fff" />}
                        <Text className="text-white/90 text-[10px] font-bold uppercase tracking-widest ml-1.5">
                            {isVR ? 'BENEFÍCIO VR' : 'CRÉDITO'}
                        </Text>
                    </View>
                </View>

                {/* Card Name */}
                <Text className="text-white text-lg font-bold mb-1">{card.name}</Text>

                <View className="flex-1 justify-end">
                    <View className="flex-row justify-between items-end mb-3">
                        <View>
                            <Text className="text-white/70 text-[10px] uppercase font-bold tracking-wider mb-1">Gasto Atual</Text>
                            <Text className="text-white text-3xl font-extrabold tracking-tight">
                                R$ {actualSpent.toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    </View>

                    <View className="mt-1">
                        <View className="flex-row justify-between mb-2 px-0.5">
                            <Text className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                                Livre: R$ {Math.max(0, card.card_limit - actualSpent).toFixed(2).replace('.', ',')}
                            </Text>
                            <Text className="text-white/60 text-[10px] uppercase tracking-wider font-bold">
                                {clamped.toFixed(0)}% usado
                            </Text>
                        </View>
                        <View className="bg-white/20 rounded-full h-1.5 w-full">
                            <View
                                className="rounded-full h-1.5"
                                style={{
                                    width: `${clamped}%`,
                                    backgroundColor: isOver ? '#fde047' : '#fff',
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
