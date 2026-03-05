import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { BottomModal } from '../../ui/BottomModal';
import { CARD_COLORS } from '../../../constants/categories';

interface Props {
    visible: boolean;
    onClose: () => void;
    onAdd: (card: { name: string; type: string; card_limit: number; color: string }) => void;
}

export function AddCardModal({ visible, onClose, onAdd }: Props) {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [type, setType] = useState('credit_card');
    const [color, setColor] = useState('#3b82f6');

    function handleAdd() {
        if (!name || !limit) return;
        onAdd({ name, type, card_limit: parseFloat(limit) || 0, color });
        setName(''); setLimit(''); onClose();
    }

    return (
        <BottomModal visible={visible} onClose={onClose} title="Novo Cartão">
            <Text className="text-sm font-medium text-neutral-500 mb-2">Nome</Text>
            <TextInput
                className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                placeholder="Ex: Nubank, Vale Refeição"
                placeholderTextColor="#a3a3a3"
                value={name}
                onChangeText={setName}
            />

            <Text className="text-sm font-medium text-neutral-500 mb-2">Limite (R$)</Text>
            <TextInput
                className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                placeholder="5000"
                placeholderTextColor="#a3a3a3"
                value={limit}
                onChangeText={setLimit}
                keyboardType="numeric"
            />

            <Text className="text-sm font-medium text-neutral-500 mb-2">Tipo</Text>
            <View className="flex-row gap-2 mb-4">
                {[{ key: 'credit_card', label: 'Crédito' }, { key: 'benefit', label: 'Benefício' }].map((t) => (
                    <TouchableOpacity
                        key={t.key}
                        onPress={() => setType(t.key)}
                        className={`flex-1 rounded-2xl py-3 items-center border ${type === t.key ? 'bg-serene-50 border-serene-300' : 'bg-white border-neutral-200'
                            }`}
                    >
                        <Text className={`text-sm font-medium ${type === t.key ? 'text-serene-600' : 'text-neutral-400'}`}>
                            {t.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text className="text-sm font-medium text-neutral-500 mb-2">Cor</Text>
            <View className="flex-row gap-3 mb-6">
                {CARD_COLORS.map((c) => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => setColor(c)}
                        style={{
                            width: 36, height: 36, borderRadius: 18, backgroundColor: c,
                            borderWidth: color === c ? 3 : 0, borderColor: '#fff',
                            ...(color === c ? { shadowColor: c, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 } : {}),
                        }}
                    />
                ))}
            </View>

            <TouchableOpacity onPress={handleAdd} className="bg-serene-500 rounded-2xl py-4 items-center">
                <Text className="text-white font-semibold text-base">Adicionar Cartão</Text>
            </TouchableOpacity>
        </BottomModal>
    );
}
