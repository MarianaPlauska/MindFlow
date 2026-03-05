import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { DailyBudgetCard } from '../../components/features/wallet/DailyBudgetCard';
import { IncomePieChart } from '../../components/features/wallet/IncomePieChart';
import { CardCarousel } from '../../components/features/wallet/CardCarousel';
import { AddCardModal } from '../../components/features/wallet/AddCardModal';
import { CardExtrato } from '../../components/features/wallet/CardExtrato';
import { SavingsPanel } from '../../components/features/wallet/SavingsPanel';
import { QuickExpenseInput } from '../../components/features/wallet/QuickExpenseInput';
import { useFinance } from '../../hooks/useFinance';
import { getRandomPhrase, FINANCE_PHRASES } from '../../constants/phrases';

const TABS = ['Visão Geral', 'Cartões', 'Parcelas'];

export default function WalletScreen() {
    const fin = useFinance();
    const [tabIdx, setTabIdx] = useState(0);
    const [showAddCard, setShowAddCard] = useState(false);
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [phrase] = useState(() => getRandomPhrase(FINANCE_PHRASES));

    const installTotal = fin.installments.reduce(
        (a: number, i: any) => a + Number(i.monthly_value), 0
    );

    return (
        <View className="flex-1 bg-calm-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <AnimatedCard delay={0}>
                    <View className="pt-16 pb-2 px-6">
                        <Text className="text-2xl font-bold text-neutral-800">💰 Finanças</Text>
                        <Text className="text-sm text-neutral-400 mt-1">{phrase}</Text>
                    </View>
                </AnimatedCard>

                {/* Segmented */}
                <AnimatedCard delay={80}>
                    <SegmentedControl tabs={TABS} activeIndex={tabIdx} onSelect={setTabIdx} />
                </AnimatedCard>

                {/* ── Tab 0: Visão Geral ── */}
                {tabIdx === 0 && (
                    <>
                        <AnimatedCard delay={120}>
                            <DailyBudgetCard
                                dailyBudget={fin.dailyBudget}
                                daysRemaining={fin.daysRemaining}
                                available={fin.available}
                                monthSpent={fin.monthSpent}
                                hasIncome={fin.income > 0}
                            />
                        </AnimatedCard>

                        <AnimatedCard delay={200}>
                            <View className="mx-6 mb-4">
                                <IncomePieChart
                                    income={fin.income}
                                    fixedExpenses={Number(fin.profile?.fixed_expenses) || 0}
                                    installmentsTotal={installTotal}
                                    monthSpent={fin.monthSpent}
                                />
                            </View>
                        </AnimatedCard>

                        <AnimatedCard delay={300}>
                            <View className="mx-6 mb-4">
                                <QuickExpenseInput
                                    transactions={fin.transactions}
                                    onAdd={fin.addTransaction}
                                />
                            </View>
                        </AnimatedCard>
                    </>
                )}

                {/* ── Tab 1: Cartões ── */}
                {tabIdx === 1 && (
                    <>
                        <AnimatedCard delay={120}>
                            <CardCarousel cards={fin.cards} onAddCard={() => setShowAddCard(true)} />
                        </AnimatedCard>

                        <AnimatedCard delay={220}>
                            <View className="px-6">
                                {fin.cards.length > 0 ? (
                                    <>
                                        <Text className="text-xs text-neutral-400 mb-2">
                                            Toque em "Ver extrato" para detalhes e anotações
                                        </Text>
                                        {fin.cards.map((card: any) => (
                                            <View
                                                key={card.id}
                                                className="bg-white rounded-2xl p-4 mb-2 flex-row items-center"
                                                style={{ shadowColor: '#1e3a5f', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
                                            >
                                                <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: card.color }} />
                                                <View className="flex-1">
                                                    <Text className="text-sm font-medium text-neutral-700">{card.name}</Text>
                                                    <Text className="text-xs text-neutral-400">
                                                        R$ {Number(card.current_balance).toFixed(2).replace('.', ',')} / R$ {Number(card.card_limit).toFixed(2).replace('.', ',')}
                                                    </Text>
                                                </View>
                                                <Text
                                                    className="text-serene-600 text-xs font-semibold"
                                                    onPress={() => setSelectedCard(card)}
                                                >
                                                    Ver extrato →
                                                </Text>
                                            </View>
                                        ))}
                                    </>
                                ) : null}
                            </View>
                        </AnimatedCard>
                    </>
                )}

                {/* ── Tab 2: Parcelas / Poupança ── */}
                {tabIdx === 2 && (
                    <AnimatedCard delay={120}>
                        <View className="px-6">
                            <SavingsPanel
                                installments={fin.installments}
                                income={fin.income}
                                onAddInstallment={fin.addInstallment}
                            />
                        </View>
                    </AnimatedCard>
                )}
            </ScrollView>

            {/* Modals */}
            <AddCardModal
                visible={showAddCard}
                onClose={() => setShowAddCard(false)}
                onAdd={fin.addCard}
            />
            <CardExtrato
                visible={!!selectedCard}
                card={selectedCard}
                transactions={fin.transactions}
                onAddTransaction={(tx: any) => fin.addTransaction({ ...tx, payment_method_id: selectedCard?.id })}
                onClose={() => setSelectedCard(null)}
            />
        </View>
    );
}
