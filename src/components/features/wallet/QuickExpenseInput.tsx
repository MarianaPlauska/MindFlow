import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Search, Plus, FileText } from 'lucide-react-native';
import { TX_CATEGORIES } from '../../../constants/categories';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    transactions: any[];
    onAdd: (tx: { description: string; amount: number; category: string; notes: string | null }) => void;
}

export function QuickExpenseInput({ transactions, onAdd }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('outros');
    const [notes, setNotes] = useState('');
    const [search, setSearch] = useState('');

    function handleAdd() {
        if (!desc || !amount) return;
        onAdd({
            description: desc,
            amount: parseFloat(amount) || 0,
            category,
            notes: notes.trim() || null,
        });
        setDesc(''); setAmount(''); setNotes(''); setExpanded(false);
    }

    const filtered = search
        ? transactions.filter((t: any) =>
            t.description?.toLowerCase().includes(search.toLowerCase()) ||
            t.notes?.toLowerCase().includes(search.toLowerCase())
        )
        : transactions.slice(0, 5);

    return (
        <View className="bg-white rounded-3xl p-5" style={SHADOWS.card}>
            {/* Search */}
            <View className="flex-row items-center bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2.5 mb-3">
                <Search size={16} color="#a3a3a3" />
                <TextInput
                    className="flex-1 ml-2 text-sm text-neutral-800"
                    placeholder="Buscar gastos ou anotar..."
                    placeholderTextColor="#a3a3a3"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Quick add toggle */}
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                className="flex-row items-center mb-3"
            >
                <Plus size={14} color="#3b82f6" />
                <Text className="text-serene-600 text-xs font-semibold ml-1">
                    {expanded ? 'Cancelar' : 'Registrar gasto rápido'}
                </Text>
            </TouchableOpacity>

            {/* Expanded form */}
            {expanded && (
                <View className="mb-3">
                    <View className="flex-row gap-2 mb-2">
                        <TextInput
                            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-800"
                            placeholder="Descrição"
                            placeholderTextColor="#a3a3a3"
                            value={desc}
                            onChangeText={setDesc}
                        />
                        <TextInput
                            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-800"
                            style={{ width: 80 }}
                            placeholder="R$"
                            placeholderTextColor="#a3a3a3"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                        {TX_CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.key}
                                onPress={() => setCategory(cat.key)}
                                className={`mr-1.5 px-2.5 py-1 rounded-full border ${category === cat.key ? 'bg-serene-50 border-serene-300' : 'border-neutral-200'
                                    }`}
                            >
                                <Text className={`text-xs ${category === cat.key ? 'text-serene-600' : 'text-neutral-400'}`}>
                                    {cat.emoji} {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TextInput
                        className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 mb-2"
                        placeholder="Anotação (opcional)"
                        placeholderTextColor="#a3a3a3"
                        value={notes}
                        onChangeText={setNotes}
                    />

                    <TouchableOpacity onPress={handleAdd} className="bg-serene-500 rounded-xl py-2.5 items-center">
                        <Text className="text-white font-semibold text-sm">Salvar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Recent / Search results */}
            {filtered.length > 0 ? (
                filtered.map((tx: any, i: number) => {
                    const cat = TX_CATEGORIES.find((c) => c.key === tx.category);
                    return (
                        <View key={tx.id || i} className="flex-row items-center py-2 border-b border-neutral-50">
                            <Text className="text-sm mr-2">{cat?.emoji || '📌'}</Text>
                            <View className="flex-1">
                                <Text className="text-xs font-medium text-neutral-600">{tx.description}</Text>
                                {tx.notes && <Text className="text-xs text-neutral-400">{tx.notes}</Text>}
                            </View>
                            <Text className="text-xs font-semibold text-blush-600">
                                -R$ {Number(tx.amount).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    );
                })
            ) : (
                <View className="items-center py-3">
                    <FileText size={20} color="#d4d4d4" />
                    <Text className="text-xs text-neutral-300 mt-1">
                        {search ? 'Nenhum resultado' : 'Sem gastos recentes'}
                    </Text>
                </View>
            )}
        </View>
    );
}
