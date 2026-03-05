import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { DailyBudgetCard } from '../../components/features/wallet/DailyBudgetCard';
import { CardCarousel } from '../../components/features/wallet/CardCarousel';
import { InstallmentList } from '../../components/features/wallet/InstallmentList';
import { AddCardModal } from '../../components/features/wallet/AddCardModal';
import { useFinance } from '../../hooks/useFinance';
import { getRandomPhrase, FINANCE_PHRASES } from '../../constants/phrases';

export default function WalletScreen() {
    const fin = useFinance();
    const [showAdd, setShowAdd] = useState(false);
    const [phrase] = useState(() => getRandomPhrase(FINANCE_PHRASES));

    return (
        <View className="flex-1 bg-calm-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <AnimatedCard delay={0}>
                    <View className="pt-16 pb-2 px-6">
                        <Text className="text-2xl font-bold text-neutral-800">💰 Finanças</Text>
                        <Text className="text-sm text-neutral-400 mt-1">{phrase}</Text>
                    </View>
                </AnimatedCard>

                <AnimatedCard delay={100}>
                    <DailyBudgetCard
                        dailyBudget={fin.dailyBudget}
                        daysRemaining={fin.daysRemaining}
                        available={fin.available}
                        monthSpent={fin.monthSpent}
                        hasIncome={fin.income > 0}
                    />
                </AnimatedCard>

                <AnimatedCard delay={200}>
                    <CardCarousel cards={fin.cards} onAddCard={() => setShowAdd(true)} />
                </AnimatedCard>

                <AnimatedCard delay={350}>
                    <InstallmentList installments={fin.installments} income={fin.income} />
                </AnimatedCard>
            </ScrollView>

            <AddCardModal
                visible={showAdd}
                onClose={() => setShowAdd(false)}
                onAdd={fin.addCard}
            />
        </View>
    );
}
