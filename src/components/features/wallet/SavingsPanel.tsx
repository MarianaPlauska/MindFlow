import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {
    Landmark, TrendingDown, ArrowUpCircle, ArrowDownCircle,
    Percent, PiggyBank, Plus, FileText,
} from 'lucide-react-native';
import { BottomModal } from '../../ui/BottomModal';
import { SHADOWS } from '../../../constants/theme';
import { ProgressBar } from '../../ui/ProgressBar';

interface Props {
    installments: any[];
    income: number;
    savings: any[];
    savingsBalance: number;
    onAddInstallment: (inst: any) => void;
    onAddSavings: (entry: any) => void;
}

export function SavingsPanel({
    installments, income, savings, savingsBalance,
    onAddInstallment, onAddSavings,
}: Props) {
    const [showInstModal, setShowInstModal] = useState(false);
    const [showSavModal, setShowSavModal] = useState(false);

    // Installment form
    const [desc, setDesc] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [numInst, setNumInst] = useState('');
    const [instNotes, setInstNotes] = useState('');

    // Savings form
    const [savDesc, setSavDesc] = useState('');
    const [savAmount, setSavAmount] = useState('');
    const [savType, setSavType] = useState<'deposit' | 'withdrawal'>('deposit');

    const totalMonthly = installments.reduce((a: number, i: any) => a + Number(i.monthly_value), 0);
    const commitPct = income > 0 ? (totalMonthly / income) * 100 : 0;
    const freeIncome = Math.max(income - totalMonthly, 0);

    function handleAddInst() {
        if (!desc || !totalValue || !numInst) return;
        const total = parseFloat(totalValue) || 0;
        const num = parseInt(numInst) || 1;
        onAddInstallment({
            description: desc, total_value: total,
            remaining_installments: num,
            monthly_value: Number((total / num).toFixed(2)),
            notes: instNotes.trim() || null,
        });
        setDesc(''); setTotalValue(''); setNumInst(''); setInstNotes('');
        setShowInstModal(false);
    }

    function handleAddSav() {
        if (!savDesc || !savAmount) return;
        onAddSavings({
            description: savDesc,
            amount: parseFloat(savAmount) || 0,
            type: savType,
        });
        setSavDesc(''); setSavAmount(''); setShowSavModal(false);
    }

    return (
        <View>
            {/* ── Impact Summary ── */}
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
                        <Text className="text-sm font-bold text-blush-600">R$ {totalMonthly.toFixed(0)}</Text>
                    </View>
                    <View className="items-center flex-1">
                        <ArrowUpCircle size={18} color="#22c55e" />
                        <Text className="text-xs text-neutral-400 mt-1">Livre</Text>
                        <Text className="text-sm font-bold text-calm-600">R$ {freeIncome.toFixed(0)}</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Percent size={18} color="#3b82f6" />
                        <Text className="text-xs text-neutral-400 mt-1">% Renda</Text>
                        <Text className="text-sm font-bold text-serene-600">{commitPct.toFixed(1)}%</Text>
                    </View>
                </View>
                <ProgressBar percent={commitPct} height={10} color={commitPct > 70 ? '#ec4899' : '#3b82f6'} bgColor="#eff6ff" />
            </View>

            {/* ── Savings / Reserve ── */}
            <View className="bg-white rounded-3xl p-5 mb-4" style={SHADOWS.card}>
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <PiggyBank size={20} color="#22c55e" />
                        <Text className="text-base font-semibold text-neutral-800 ml-2">Poupança</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowSavModal(true)}>
                        <Text className="text-serene-600 text-xs font-semibold">+ Novo</Text>
                    </TouchableOpacity>
                </View>
                <View className="bg-calm-50 rounded-2xl p-4 items-center mb-3">
                    <Text className="text-xs text-neutral-400">Saldo da Reserva</Text>
                    <Text className="text-2xl font-bold text-calm-700">
                        R$ {savingsBalance.toFixed(2).replace('.', ',')}
                    </Text>
                </View>
                {savings.length === 0 ? (
                    <View className="items-center py-2">
                        <FileText size={20} color="#d4d4d4" />
                        <Text className="text-xs text-neutral-300 mt-1">Sem movimentações ainda</Text>
                    </View>
                ) : (
                    savings.slice(0, 5).map((s: any) => (
                        <View key={s.id} className="flex-row items-center py-2 border-b border-neutral-50">
                            <Text className="text-sm mr-2">{s.type === 'deposit' ? '📥' : '📤'}</Text>
                            <View className="flex-1">
                                <Text className="text-xs font-medium text-neutral-600">{s.description}</Text>
                                {s.notes && <Text className="text-xs text-neutral-400">{s.notes}</Text>}
                            </View>
                            <Text className={`text-xs font-semibold ${s.type === 'deposit' ? 'text-calm-600' : 'text-blush-600'}`}>
                                {s.type === 'deposit' ? '+' : '-'}R$ {Number(s.amount).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    ))
                )}
            </View>

            {/* ── Installments ── */}
            {installments.map((inst: any) => {
                const pct = income > 0 ? ((Number(inst.monthly_value) / income) * 100) : 0;
                return (
                    <View key={inst.id} className="bg-white rounded-2xl p-4 mb-2" style={SHADOWS.cardSm}>
                        <View className="flex-row items-center">
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
                        {inst.notes && (
                            <View className="mt-2 bg-neutral-50 rounded-xl px-3 py-2">
                                <Text className="text-xs text-neutral-500">📝 {inst.notes}</Text>
                            </View>
                        )}
                    </View>
                );
            })}

            <TouchableOpacity
                onPress={() => setShowInstModal(true)}
                className="border-2 border-dashed border-neutral-200 rounded-2xl py-4 items-center mt-2"
            >
                <Text className="text-neutral-400 text-sm">+ Adicionar parcela</Text>
            </TouchableOpacity>

            {/* ── Add Installment Modal ── */}
            <BottomModal visible={showInstModal} onClose={() => setShowInstModal(false)} title="Nova Parcela">
                <TextInput className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                    placeholder="Descrição (ex: iPhone, Seguro)" placeholderTextColor="#a3a3a3"
                    value={desc} onChangeText={setDesc} />
                <View className="flex-row gap-3 mb-3">
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-neutral-500 mb-1">Valor Total</Text>
                        <TextInput className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800"
                            placeholder="5000" placeholderTextColor="#a3a3a3"
                            value={totalValue} onChangeText={setTotalValue} keyboardType="numeric" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-neutral-500 mb-1">Nº Parcelas</Text>
                        <TextInput className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800"
                            placeholder="12" placeholderTextColor="#a3a3a3"
                            value={numInst} onChangeText={setNumInst} keyboardType="numeric" />
                    </View>
                </View>
                {totalValue && numInst && (
                    <View className="bg-serene-50 rounded-2xl p-3 mb-3 items-center">
                        <Text className="text-xs text-serene-500">Parcela mensal</Text>
                        <Text className="text-lg font-bold text-serene-700">
                            R$ {((parseFloat(totalValue) || 0) / (parseInt(numInst) || 1)).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                )}
                <TextInput className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-neutral-800 mb-4"
                    placeholder="Anotação contextual (opcional)" placeholderTextColor="#a3a3a3"
                    value={instNotes} onChangeText={setInstNotes} />
                <TouchableOpacity onPress={handleAddInst} className="bg-serene-500 rounded-2xl py-4 items-center">
                    <Text className="text-white font-semibold text-base">Registrar Parcela</Text>
                </TouchableOpacity>
            </BottomModal>

            {/* ── Add Savings Modal ── */}
            <BottomModal visible={showSavModal} onClose={() => setShowSavModal(false)} title="💰 Poupança">
                <TextInput className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                    placeholder="Descrição (ex: Reserva, Emergência)" placeholderTextColor="#a3a3a3"
                    value={savDesc} onChangeText={setSavDesc} />
                <TextInput className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                    placeholder="Valor (R$)" placeholderTextColor="#a3a3a3"
                    value={savAmount} onChangeText={setSavAmount} keyboardType="numeric" />
                <View className="flex-row gap-2 mb-4">
                    {[{ k: 'deposit' as const, l: '📥 Depósito' }, { k: 'withdrawal' as const, l: '📤 Resgate' }].map((t) => (
                        <TouchableOpacity key={t.k} onPress={() => setSavType(t.k)}
                            className={`flex-1 rounded-2xl py-3 items-center border ${savType === t.k ? 'bg-calm-50 border-calm-300' : 'bg-white border-neutral-200'
                                }`}>
                            <Text className={`text-sm font-medium ${savType === t.k ? 'text-calm-600' : 'text-neutral-400'}`}>{t.l}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={handleAddSav} className="bg-calm-500 rounded-2xl py-4 items-center">
                    <Text className="text-white font-semibold text-base">Salvar</Text>
                </TouchableOpacity>
            </BottomModal>
        </View>
    );
}
