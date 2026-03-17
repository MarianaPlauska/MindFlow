import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Pill, ShoppingBag, Check, Heart, Plus } from 'lucide-react-native';
import { SHADOWS } from '../../../constants/theme';
import { SectionHeader } from '../../ui/SectionHeader';
import { BottomModal } from '../../ui/BottomModal';

interface Props {
    reminders: any[];
    onToggle: (id: string, isDone: boolean) => void;
    onAdd: (name: string, type: string) => void;
}

export function ReminderList({ reminders, onToggle, onAdd }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('take');

    function handleAdd() {
        if (!name.trim()) return;
        onAdd(name.trim(), type);
        setName('');
        setShowModal(false);
    }

    return (
        <View>
            <SectionHeader
                title="Lembretes"
                icon={<Pill size={18} color="#8b5cf6" />}
                actionLabel="+ Novo"
                onAction={() => setShowModal(true)}
            />

            {reminders.length === 0 ? (
                <View className="bg-white rounded-3xl p-6 items-center" style={SHADOWS.card}>
                    <Heart size={32} color="#a3a3a3" strokeWidth={1.2} />
                    <Text className="text-neutral-400 text-sm mt-3 text-center">
                        Sem lembretes para hoje.{'\n'}Adicione medicações ou tarefas de saúde!
                    </Text>
                </View>
            ) : (
                reminders.map((rem) => (
                    <TouchableOpacity
                        key={rem.id}
                        onPress={() => onToggle(rem.id, rem.is_done)}
                        className="bg-white rounded-2xl p-4 mb-2 flex-row items-center"
                        style={{ ...SHADOWS.cardSm, opacity: rem.is_done ? 0.6 : 1 }}
                    >
                        <View className={`rounded-xl p-2 mr-3 ${rem.is_done ? 'bg-calm-100' : 'bg-blush-50'}`}>
                            {rem.is_done ? <Check size={16} color="#22c55e" />
                                : rem.reminder_type === 'buy' ? <ShoppingBag size={16} color="#ec4899" />
                                    : <Pill size={16} color="#8b5cf6" />}
                        </View>
                        <View className="flex-1">
                            <Text className={`text-sm font-medium ${rem.is_done ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
                                {rem.name}
                            </Text>
                            <Text className="text-xs text-neutral-400">
                                {rem.reminder_type === 'buy' ? 'Comprar' : 'Tomar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))
            )}

            <BottomModal visible={showModal} onClose={() => setShowModal(false)} title="Novo Lembrete">
                <Text className="text-sm font-medium text-neutral-500 mb-2">Descrição</Text>
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                    placeholder="Ex: Tomar remédio, Comprar vitamina"
                    placeholderTextColor="#a3a3a3"
                    value={name}
                    onChangeText={setName}
                />
                <Text className="text-sm font-medium text-neutral-500 mb-2">Tipo</Text>
                <View className="flex-row gap-2 mb-6">
                    {[{ key: 'take', label: '💊 Tomar' }, { key: 'buy', label: '🛒 Comprar' }].map((t) => (
                        <TouchableOpacity
                            key={t.key}
                            onPress={() => setType(t.key)}
                            className={`flex-1 rounded-2xl py-3 items-center border ${type === t.key ? 'bg-calm-50 border-calm-300' : 'bg-white border-neutral-200'
                                }`}
                        >
                            <Text className={`text-sm font-medium ${type === t.key ? 'text-calm-600' : 'text-neutral-400'}`}>
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={handleAdd} className="bg-calm-500 rounded-2xl py-4 items-center">
                    <Text className="text-white font-semibold text-base">Adicionar</Text>
                </TouchableOpacity>
            </BottomModal>
        </View>
    );
}
