import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MessageCircle, PenLine } from 'lucide-react-native';
import { BottomModal } from '../../ui/BottomModal';
import { MoodSelector } from './MoodSelector';
import { MOOD_LEVELS } from '../../../constants/categories';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    selectedScore: number | null;
    notes: string;
    setNotes: (v: string) => void;
    saving: boolean;
    scaleAnims: any[];
    onSelect: (index: number, score: number) => void;
    onSave: () => void;
    onCancel: () => void;
}

export function DiaryForm({
    selectedScore,
    notes,
    setNotes,
    saving,
    scaleAnims,
    onSelect,
    onSave,
    onCancel,
}: Props) {
    const moodData = selectedScore
        ? MOOD_LEVELS.find((m) => m.score === selectedScore)
        : null;

    return (
        <View className="bg-white rounded-3xl p-6" style={SHADOWS.card}>
            <View className="flex-row items-center mb-2">
                <PenLine size={18} color="#3b82f6" />
                <Text className="text-base font-semibold text-neutral-800 ml-2">
                    Como você está agora?
                </Text>
            </View>
            <Text className="text-xs text-neutral-400 mb-5">
                Registre seu humor e escreva livremente. Este é seu espaço seguro. 💙
            </Text>

            {/* Mood faces */}
            <View className="flex-row justify-between mb-5">
                {MOOD_LEVELS.map((mood, index) => (
                    <TouchableOpacity
                        key={mood.score}
                        onPress={() => onSelect(index, mood.score)}
                        activeOpacity={0.7}
                    >
                        <View
                            className="items-center px-2 py-2 rounded-2xl"
                            style={{
                                backgroundColor:
                                    selectedScore === mood.score ? mood.bg : 'transparent',
                                transform: [{ scale: selectedScore === mood.score ? 1.15 : 1 }],
                            }}
                        >
                            <Text style={{ fontSize: 28 }}>{mood.emoji}</Text>
                            <Text className="text-xs text-neutral-500 mt-1 text-center" style={{ maxWidth: 64 }}>
                                {mood.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Selected feedback */}
            {moodData && (
                <View
                    className="rounded-2xl p-3 mb-4 flex-row items-center"
                    style={{ backgroundColor: moodData.bg }}
                >
                    <Text style={{ fontSize: 20 }}>{moodData.emoji}</Text>
                    <Text className="ml-2 text-sm font-medium" style={{ color: moodData.color }}>
                        Você está se sentindo: {moodData.label}
                    </Text>
                </View>
            )}

            {/* Diary TextInput */}
            <View className="mb-4">
                <View className="flex-row items-center mb-2">
                    <MessageCircle size={14} color="#a3a3a3" />
                    <Text className="text-sm font-medium text-neutral-500 ml-1">
                        Diário emocional (opcional)
                    </Text>
                </View>
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800"
                    placeholder="Escreva livremente o que está sentindo..."
                    placeholderTextColor="#a3a3a3"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                />
            </View>

            {/* Actions */}
            <View className="flex-row gap-3">
                {selectedScore && (
                    <TouchableOpacity
                        onPress={onCancel}
                        className="flex-1 border border-neutral-200 rounded-2xl py-3.5 items-center"
                    >
                        <Text className="text-neutral-400 font-medium">Limpar</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={onSave}
                    disabled={!selectedScore || saving}
                    className={`rounded-2xl py-3.5 items-center ${selectedScore ? 'flex-1' : 'flex-1'}`}
                    style={{
                        backgroundColor: selectedScore ? '#3b82f6' : '#e5e5e5',
                        opacity: saving ? 0.7 : 1,
                    }}
                >
                    <Text className="text-white font-semibold">
                        {saving ? 'Salvando...' : 'Registrar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
