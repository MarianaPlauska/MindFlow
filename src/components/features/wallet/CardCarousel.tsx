import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CreditCard, Plus } from 'lucide-react-native';
import { PaymentCard } from './PaymentCard';
import { SectionHeader } from '../../ui/SectionHeader';

interface Props {
    cards: any[];
    onAddCard: () => void;
}

export function CardCarousel({ cards, onAddCard }: Props) {
    return (
        <View className="mb-4">
            <View className="px-6">
                <SectionHeader
                    title="Meus Cartões"
                    actionLabel="+ Novo"
                    onAction={onAddCard}
                />
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            >
                {cards.length === 0 ? (
                    <TouchableOpacity
                        onPress={onAddCard}
                        className="border-2 border-dashed border-neutral-200 rounded-3xl items-center justify-center"
                        style={{ width: 260, height: 180 }}
                    >
                        <CreditCard size={32} color="#a3a3a3" strokeWidth={1.2} />
                        <Text className="text-neutral-400 text-sm mt-3">Adicionar cartão</Text>
                    </TouchableOpacity>
                ) : (
                    cards.map((card) => <PaymentCard key={card.id} card={card} />)
                )}
            </ScrollView>
        </View>
    );
}
