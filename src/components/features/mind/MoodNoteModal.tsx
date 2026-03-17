import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { BottomModal } from '../../ui/BottomModal';

interface Props {
    visible: boolean;
    notes: string;
    setNotes: (v: string) => void;
    saving: boolean;
    onSave: () => void;
    onClose: () => void;
}

export function MoodNoteModal({ visible, notes, setNotes, saving, onSave, onClose }: Props) {
    return (
        <BottomModal visible={visible} onClose={onClose} title="Quer compartilhar mais?">
            <Text className="text-sm text-neutral-400 mb-3">
                Opcional — escreva o que quiser. Este é seu espaço seguro. 💙
            </Text>

            <TextInput
                className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                placeholder="O que está sentindo agora..."
                placeholderTextColor="#a3a3a3"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' }}
            />

            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={onClose}
                    className="flex-1 border border-neutral-200 rounded-2xl py-3.5 items-center"
                >
                    <Text className="text-neutral-400 font-medium">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onSave}
                    disabled={saving}
                    className="flex-1 bg-serene-500 rounded-2xl py-3.5 items-center"
                    style={{ opacity: saving ? 0.7 : 1 }}
                >
                    <Text className="text-white font-semibold">
                        {saving ? 'Salvando...' : 'Salvar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </BottomModal>
    );
}
