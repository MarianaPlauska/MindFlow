import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FileText, Plus, Trash2, Tag } from 'lucide-react-native';
import { BottomModal } from '../../ui/BottomModal';
import { SHADOWS } from '../../../constants/theme';
import { TX_CATEGORIES } from '../../../constants/categories';
import { SectionHeader } from '../../ui/SectionHeader';

interface Props {
    card: any;
    transactions: any[];
    onAddTransaction: (tx: any) => void;
    onClose: () => void;
    visible: boolean;
}

export function CardExtrato({ card, transactions, onAddTransaction, onClose, visible }: Props) {
    const [showAdd, setShowAdd] = useState(false);
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [category, setCategory] = useState('outros');

    function handleAdd() {
        if (!desc || !amount) return;
        onAddTransaction({
            description: desc,
            amount: parseFloat(amount) || 0,
            notes: notes.trim() || null,
            category,
        });
        setDesc(''); setAmount(''); setNotes(''); setShowAdd(false);
    }

    const filtered = transactions.filter((t: any) => t.payment_method_id === card?.id);

    return (
        <BottomModal visible={visible} onClose={onClose} title={`📋 ${card?.name || 'Extrato'}`}>
            <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
                {filtered.length === 0 ? (
                    <View className="items-center py-6">
                        <FileText size={36} color="#d4d4d4" strokeWidth={1.2} />
                        <Text className="text-neutral-400 text-sm mt-3 text-center">
                            Sem lançamentos neste cartão.{'\n'}Adicione para acompanhar seus gastos.
                        </Text>
                    </View>
                ) : (
                    filtered.map((tx: any, i: number) => {
                        const cat = TX_CATEGORIES.find((c) => c.key === tx.category);
                        return (
                            <View key={tx.id || i} className="flex-row items-center py-3 border-b border-neutral-100">
                                <Text className="text-base mr-2">{cat?.emoji || '📌'}</Text>
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-neutral-700">{tx.description}</Text>
                                    {tx.notes && (
                                        <Text className="text-xs text-neutral-400 mt-0.5">{tx.notes}</Text>
                                    )}
                                </View>
                                <Text className="text-sm font-semibold text-blush-600">
                                    -R$ {Number(tx.amount).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            <TouchableOpacity
                onPress={() => setShowAdd(!showAdd)}
                className="bg-serene-50 rounded-2xl py-3 items-center mt-4 flex-row justify-center"
            >
                <Plus size={16} color="#3b82f6" />
                <Text className="text-serene-600 font-semibold ml-1">Registrar Gasto</Text>
            </TouchableOpacity>

            {showAdd && (
                <View className="mt-4">
                    <TextInput
                        className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                        placeholder="Descrição (ex: Almoço)"
                        placeholderTextColor="#a3a3a3"
                        value={desc}
                        onChangeText={setDesc}
                    />
                    <TextInput
                        className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                        placeholder="Valor (R$)"
                        placeholderTextColor="#a3a3a3"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />

                    <Text className="text-xs font-medium text-neutral-500 mb-2">Categoria</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                        {TX_CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.key}
                                onPress={() => setCategory(cat.key)}
                                className={`mr-2 px-3 py-1.5 rounded-full border ${category === cat.key ? 'bg-serene-50 border-serene-300' : 'border-neutral-200'
                                    }`}
                            >
                                <Text className={`text-xs ${category === cat.key ? 'text-serene-600' : 'text-neutral-400'}`}>
                                    {cat.emoji} {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TextInput
                        className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-neutral-800 mb-4"
                        placeholder="Anotação (opcional)"
                        placeholderTextColor="#a3a3a3"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />

                    <TouchableOpacity onPress={handleAdd} className="bg-serene-500 rounded-2xl py-3.5 items-center">
                        <Text className="text-white font-semibold">Salvar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </BottomModal>
    );
}
