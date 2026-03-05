import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    card: any;
    onPress?: () => void;
}

export function PaymentCard({ card, onPress }: Props) {
    const usedPct = card.card_limit > 0
        ? (card.current_balance / card.card_limit) * 100
        : 0;
    const clamped = Math.min(usedPct, 100);
    const isOver = usedPct > 80;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <View
                className="rounded-3xl p-5 mr-4"
                style={{
                    width: 260,
                    backgroundColor: card.color || '#3b82f6',
                    ...SHADOWS.coloredCard(card.color || '#3b82f6'),
                }}
            >
                <View className="flex-row items-center justify-between mb-4">
                    <View className="bg-white/20 rounded-xl p-2">
                        <CreditCard size={18} color="#fff" />
                    </View>
                    <Text className="text-white/60 text-xs font-medium uppercase tracking-wider">
                        {card.type === 'benefit' ? 'Benefício' : 'Crédito'}
                    </Text>
                </View>

                <Text className="text-white text-lg font-bold mb-1">{card.name}</Text>
                <Text className="text-white/70 text-xs mb-1">Gasto atual</Text>
                <Text className="text-white text-2xl font-bold mb-4">
                    R$ {Number(card.current_balance).toFixed(2).replace('.', ',')}
                </Text>

                <View className="mb-2">
                    <View className="bg-white/20 rounded-full h-2 w-full">
                        <View
                            className="rounded-full h-2"
                            style={{
                                width: `${clamped}%`,
                                backgroundColor: isOver ? '#fde047' : '#fff',
                            }}
                        />
                    </View>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-white/60 text-xs">{clamped.toFixed(0)}% usado</Text>
                    <Text className="text-white/60 text-xs">
                        Limite: R$ {Number(card.card_limit).toFixed(2).replace('.', ',')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
