import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Search, Plus, FileText, Sparkles, Send } from 'lucide-react-native';
import { TX_CATEGORIES } from '../../../constants/categories';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    transactions: any[];
    onAdd: (tx: { description: string; amount: number; category: string; notes: string | null }) => void;
}

export function QuickExpenseInput({ transactions, onAdd }: Props) {
    const [desc, setDesc] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    // AI Simulation
    function handleAdd() {
        if (!desc.trim()) return;
        
        setIsThinking(true);
        setTimeout(() => {
            // Very simple deterministic parsing for demo
            const amountMatches = desc.match(/\d+(?:[.,]\d+)?/);
            const amount = amountMatches ? parseFloat(amountMatches[0].replace(',', '.')) : 0;
            const category = desc.toLowerCase().includes('ifood') || desc.toLowerCase().includes('almoço') ? 'alimentacao' : 'outros';

            onAdd({
                description: desc.trim(),
                amount,
                category,
                notes: null,
            });
            setDesc('');
            setIsThinking(false);
        }, 800);
    }

    const recent = transactions.slice(0, 3);

    return (
        <View className="bg-white rounded-3xl p-5" style={{ boxShadow: '0px 8px 24px rgba(0,0,0,0.06)' }}>
            <View className="flex-row items-center mb-4">
                <Sparkles size={16} color="#8b5cf6" />
                <Text className="ml-2 text-sm font-bold text-neutral-800">MindFlow AI</Text>
            </View>

            {/* AI Chat Input */}
            <View className="flex-row items-center bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2 mb-4">
                <TextInput
                    className="flex-1 ml-1 text-sm text-neutral-800 h-10"
                    placeholder="Ex: Paguei 45 no almoço..."
                    placeholderTextColor="#a3a3a3"
                    value={desc}
                    onChangeText={setDesc}
                    onSubmitEditing={handleAdd}
                />
                <TouchableOpacity 
                    onPress={handleAdd} 
                    className={`w-9 h-9 rounded-full items-center justify-center ml-2 ${desc.length > 0 ? 'bg-serene-500' : 'bg-neutral-200'}`}
                    disabled={!desc.trim() || isThinking}
                >
                    {isThinking ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Send size={14} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>

            {/* Recent Additions */}
            {recent.length > 0 ? (
                <View>
                    <Text className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Lançamentos Recentes</Text>
                    {recent.map((tx: any, i: number) => {
                        const cat = TX_CATEGORIES.find((c) => c.key === tx.category);
                        return (
                            <View key={tx.id || i} className="flex-row items-center py-2.5 border-b border-neutral-50">
                                <View className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center mr-3">
                                    <Text className="text-sm">{cat?.emoji || '📌'}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-neutral-700">{tx.description}</Text>
                                    <Text className="text-xs text-neutral-400">{cat?.label || 'Outros'}</Text>
                                </View>
                                <Text className="text-sm font-bold text-blush-600">
                                    -R$ {Number(tx.amount).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            ) : null}
        </View>
    );
}
