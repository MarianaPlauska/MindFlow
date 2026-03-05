import React from 'react';
import { View, Text } from 'react-native';
import { Receipt, Calendar } from 'lucide-react-native';
import { SHADOWS } from '../../../constants/theme';
import { SectionHeader } from '../../ui/SectionHeader';

interface Props {
    installments: any[];
    income: number;
}

export function InstallmentList({ installments, income }: Props) {
    return (
        <View className="px-6 mb-4">
            <SectionHeader
                title="📋 Parcelas"
                actionLabel={`${installments.length} ativas`}
                icon={<Receipt size={14} color="#a3a3a3" />}
            />

            {installments.length === 0 ? (
                <View className="bg-white rounded-3xl p-6 items-center" style={SHADOWS.card}>
                    <Calendar size={32} color="#a3a3a3" strokeWidth={1.2} />
                    <Text className="text-neutral-400 text-sm mt-3 text-center">
                        Nenhuma parcela cadastrada.{'\n'}Adicione para controlar compromissos.
                    </Text>
                </View>
            ) : (
                installments.map((inst) => {
                    const pct = income > 0
                        ? ((Number(inst.monthly_value) / income) * 100).toFixed(1)
                        : '0';
                    return (
                        <View
                            key={inst.id}
                            className="bg-white rounded-2xl p-4 mb-2 flex-row items-center"
                            style={SHADOWS.cardSm}
                        >
                            <View className="bg-serene-50 rounded-xl p-2 mr-3">
                                <Receipt size={16} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-medium text-neutral-700">{inst.description}</Text>
                                <Text className="text-xs text-neutral-400">
                                    {inst.remaining_installments}x de R$ {Number(inst.monthly_value).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-xs font-semibold text-serene-600">{pct}%</Text>
                                <Text className="text-xs text-neutral-400">da renda</Text>
                            </View>
                        </View>
                    );
                })
            )}
        </View>
    );
}
