import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Landmark, TrendingDown, ArrowUpCircle, ArrowDownCircle, Percent } from 'lucide-react-native';
import { BottomModal } from '../../ui/BottomModal';
import { SHADOWS } from '../../../constants/theme';
import { SectionHeader } from '../../ui/SectionHeader';
import { ProgressBar } from '../../ui/ProgressBar';

interface Props {
    installments: any[];
    income: number;
    onAddInstallment: (inst: any) => void;
}

export function SavingsPanel({ installments, income, onAddInstallment }: Props) {
    const [showAdd, setShowAdd] = useState(false);
    const [desc, setDesc] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [numInstallments, setNumInstallments] = useState('');

    const totalMonthly = installments.reduce((a: number, i: any) => a + Number(i.monthly_value), 0);
    const commitPct = income > 0 ? (totalMonthly / income) * 100 : 0;
    const freeIncome = Math.max(income - totalMonthly, 0);

    function handleAdd() {
        if (!desc || !totalValue || !numInstallments) return;
        const total = parseFloat(totalValue) || 0;
        const num = parseInt(numInstallments) || 1;
        onAddInstallment({
            description: desc,
            total_value: total,
            remaining_installments: num,
            monthly_value: Number((total / num).toFixed(2)),
        });
        setDesc(''); setTotalValue(''); setNumInstallments(''); setShowAdd(false);
    }

    return (
        <View>
            {/* Summary */}
            <View className="bg-white rounded-3xl p-5 mb-4" style={SHADOWS.card}>
                <View className="flex-row items-center mb-4">
                    <Landmark size={20} color="#8b5cf6" />
                    <Text className="text-base font-semibold text-neutral-800 ml-2">
                        Impacto no Rendimento
                    </Text>
                </View>

                <View className="flex-row justify-between mb-3">
                    <View className="items-center flex-1">
                        <ArrowDownCircle size={18} color="#ec4899" />
                        <Text className="text-xs text-neutral-400 mt-1">Comprometido</Text>
                        <Text className="text-sm font-bold text-blush-600">
                            R$ {totalMonthly.toFixed(0)}
                        </Text>
                    </View>
                    <View className="items-center flex-1">
                        <ArrowUpCircle size={18} color="#22c55e" />
                        <Text className="text-xs text-neutral-400 mt-1">Livre</Text>
                        <Text className="text-sm font-bold text-calm-600">
                            R$ {freeIncome.toFixed(0)}
                        </Text>
                    </View>
                    <View className="items-center flex-1">
                        <Percent size={18} color="#3b82f6" />
                        <Text className="text-xs text-neutral-400 mt-1">% Renda</Text>
                        <Text className="text-sm font-bold text-serene-600">
                            {commitPct.toFixed(1)}%
                        </Text>
                    </View>
                </View>

                <ProgressBar
                    percent={commitPct}
                    height={10}
                    color={commitPct > 70 ? '#ec4899' : '#3b82f6'}
                    bgColor="#eff6ff"
                />
            </View>

            {/* Installment list */}
            {installments.map((inst: any) => {
                const pct = income > 0 ? ((Number(inst.monthly_value) / income) * 100) : 0;
                return (
                    <View
                        key={inst.id}
                        className="bg-white rounded-2xl p-4 mb-2 flex-row items-center"
                        style={SHADOWS.cardSm}
                    >
                        <View className="bg-serene-50 rounded-xl p-2 mr-3">
                            <TrendingDown size={16} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-neutral-700">{inst.description}</Text>
                            <Text className="text-xs text-neutral-400">
                                {inst.remaining_installments}x • R$ {Number(inst.monthly_value).toFixed(2).replace('.', ',')} / mês
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-xs font-bold text-serene-600">{pct.toFixed(1)}%</Text>
                            <Text className="text-xs text-neutral-300">da renda</Text>
                        </View>
                    </View>
                );
            })}

            {/* Add button */}
            <TouchableOpacity
                onPress={() => setShowAdd(true)}
                className="border-2 border-dashed border-neutral-200 rounded-2xl py-4 items-center mt-2"
            >
                <Text className="text-neutral-400 text-sm">+ Adicionar parcela</Text>
            </TouchableOpacity>

            {/* Add Modal */}
            <BottomModal visible={showAdd} onClose={() => setShowAdd(false)} title="Nova Parcela">
                <Text className="text-sm font-medium text-neutral-500 mb-2">Descrição</Text>
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                    placeholder="Ex: iPhone, Curso, Seguro"
                    placeholderTextColor="#a3a3a3"
                    value={desc}
                    onChangeText={setDesc}
                />
                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-neutral-500 mb-2">Valor Total (R$)</Text>
                        <TextInput
                            className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800"
                            placeholder="5000"
                            placeholderTextColor="#a3a3a3"
                            value={totalValue}
                            onChangeText={setTotalValue}
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-neutral-500 mb-2">Nº Parcelas</Text>
                        <TextInput
                            className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800"
                            placeholder="12"
                            placeholderTextColor="#a3a3a3"
                            value={numInstallments}
                            onChangeText={setNumInstallments}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                {totalValue && numInstallments && (
                    <View className="bg-serene-50 rounded-2xl p-3 mb-4 items-center">
                        <Text className="text-xs text-serene-500">Parcela mensal</Text>
                        <Text className="text-lg font-bold text-serene-700">
                            R$ {(
                                (parseFloat(totalValue) || 0) / (parseInt(numInstallments) || 1)
                            ).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                )}
                <TouchableOpacity onPress={handleAdd} className="bg-serene-500 rounded-2xl py-4 items-center">
                    <Text className="text-white font-semibold text-base">Registrar Parcela</Text>
                </TouchableOpacity>
            </BottomModal>
        </View>
    );
}
