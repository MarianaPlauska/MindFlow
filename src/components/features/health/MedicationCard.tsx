import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput, Platform } from 'react-native';
import { Pill, CheckCircle2, Plus, X, Clock, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedCard } from '../../ui/AnimatedCard';
import { BottomModal } from '../../ui/BottomModal';
import { SHADOWS } from '../../../constants/theme';

interface Props {
    displayName: string;
    medicationRoutines: any[];
    medicationLogs: any[];
    onLogMedication: (name: string) => void;
    onAddRoutine?: (routine: { name: string; dosage?: string; scheduled_time?: string }) => Promise<any>;
    onDeleteRoutine?: (id: string) => Promise<any>;
    loading: boolean;
}

export function MedicationCard({ 
    displayName, 
    medicationRoutines, 
    medicationLogs, 
    onLogMedication, 
    onAddRoutine,
    onDeleteRoutine,
    loading 
}: Props) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDosage, setNewDosage] = useState('');
    const [newTime, setNewTime] = useState('08:00');
    const [submitting, setSubmitting] = useState(false);

    const routinesToRender = medicationRoutines && medicationRoutines.length > 0 
        ? medicationRoutines 
        : [];

    async function handleAddRoutine() {
        if (!newName.trim() || !onAddRoutine) return;
        setSubmitting(true);
        await onAddRoutine({ 
            name: newName.trim(), 
            dosage: newDosage.trim() || undefined, 
            scheduled_time: newTime || '08:00' 
        });
        setNewName('');
        setNewDosage('');
        setNewTime('08:00');
        setShowAddModal(false);
        setSubmitting(false);
    }

    return (
        <View>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3 px-1">
                <View className="flex-row items-center">
                    <Pill size={18} color="#ec4899" />
                    <Text className="text-base font-semibold text-neutral-800 ml-2">💊 Medicamentos</Text>
                </View>
                {onAddRoutine && (
                    <Pressable 
                        onPress={() => {
                            if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
                            setShowAddModal(true);
                        }}
                        className="bg-rose-50 px-3 py-1.5 rounded-xl flex-row items-center active:opacity-70"
                    >
                        <Plus size={14} color="#ec4899" />
                        <Text className="text-rose-500 font-semibold ml-1 text-xs">Novo</Text>
                    </Pressable>
                )}
            </View>

            {routinesToRender.length === 0 && (
                <AnimatedCard delay={100}>
                    <View className="bg-white rounded-3xl p-6 items-center border border-neutral-100" style={SHADOWS.card}>
                        <Text className="text-4xl mb-3">💊</Text>
                        <Text className="text-neutral-400 text-sm text-center">
                            Ainda não há medicamentos cadastrados.{'\n'}Toque em "Novo" para adicionar.
                        </Text>
                    </View>
                </AnimatedCard>
            )}

            {routinesToRender.map((routine, idx) => {
                const log = medicationLogs?.find((l: any) => l.medication_name === routine.name);
                const isLast = idx === routinesToRender.length - 1;
                
                if (log) {
                    const date = new Date(log.logged_at);
                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                        <AnimatedCard delay={100 + (idx * 50)} key={routine.id || idx}>
                            <View className={`bg-calm-50 rounded-3xl p-5 flex-row items-center border border-calm-200 ${!isLast ? 'mb-3' : ''}`} style={SHADOWS.cardSm}>
                                <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4" style={SHADOWS.cardSm}>
                                    <CheckCircle2 size={24} color="#22c55e" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-calm-800 font-bold text-sm">{routine.name}</Text>
                                    {routine.dosage && (
                                        <Text className="text-calm-600 text-xs">{routine.dosage}</Text>
                                    )}
                                    <Text className="text-calm-700 text-xs mt-1">
                                        Mari, você confirmou às {timeString}
                                    </Text>
                                </View>
                            </View>
                        </AnimatedCard>
                    );
                }

                return (
                    <AnimatedCard delay={100 + (idx * 50)} key={routine.id || idx}>
                        <View className={`bg-white rounded-3xl p-5 border border-neutral-100 ${!isLast ? 'mb-3' : ''}`} style={SHADOWS.card}>
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-10 h-10 bg-rose-50 rounded-full items-center justify-center mr-3">
                                        <Pill size={20} color="#ec4899" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-neutral-800 font-bold text-sm">{routine.name}</Text>
                                        {routine.dosage && (
                                            <Text className="text-neutral-500 text-xs">{routine.dosage}</Text>
                                        )}
                                        <View className="flex-row items-center mt-0.5">
                                            <Clock size={12} color="#a3a3a3" />
                                            <Text className="text-neutral-400 text-xs ml-1">
                                                Horário: {routine.scheduled_time || '08:00'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {onDeleteRoutine && (
                                    <Pressable 
                                        onPress={() => {
                                            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                                            onDeleteRoutine(routine.id);
                                        }}
                                        className="p-2 active:opacity-50"
                                    >
                                        <Trash2 size={14} color="#d4d4d4" />
                                    </Pressable>
                                )}
                            </View>
                            
                            <Pressable 
                                onPress={() => {
                                    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                                    onLogMedication(routine.name);
                                }} 
                                disabled={loading}
                                className="w-full bg-rose-500 rounded-2xl py-3 items-center flex-row justify-center active:opacity-80"
                                style={{ opacity: loading ? 0.6 : 1 }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} color="#fff" />
                                        <Text className="text-white font-bold ml-2 text-sm">Confirmar Dose</Text>
                                    </>
                                )}
                            </Pressable>
                        </View>
                    </AnimatedCard>
                );
            })}

            {/* Add Routine Modal */}
            <BottomModal 
                visible={showAddModal} 
                onClose={() => setShowAddModal(false)} 
                title="💊 Novo Medicamento"
            >
                <Text className="text-sm text-neutral-500 mb-4">
                    Cadastre um medicamento para lembrar de tomar diariamente.
                </Text>
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                    placeholder="Nome (ex: Minoxidil)"
                    placeholderTextColor="#a3a3a3"
                    value={newName}
                    onChangeText={setNewName}
                />
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                    placeholder="Dosagem (ex: 5mg - opcional)"
                    placeholderTextColor="#a3a3a3"
                    value={newDosage}
                    onChangeText={setNewDosage}
                />
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                    placeholder="Horário (ex: 08:00)"
                    placeholderTextColor="#a3a3a3"
                    value={newTime}
                    onChangeText={setNewTime}
                />
                <Pressable 
                    onPress={handleAddRoutine} 
                    disabled={submitting || !newName.trim()}
                    className="bg-rose-500 rounded-2xl py-3.5 items-center active:opacity-80"
                    style={{ opacity: submitting || !newName.trim() ? 0.6 : 1 }}
                >
                    <Text className="text-white font-semibold">Salvar Medicamento</Text>
                </Pressable>
            </BottomModal>
        </View>
    );
}
