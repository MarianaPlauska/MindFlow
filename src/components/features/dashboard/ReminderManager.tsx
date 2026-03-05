import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { Bell, BellOff, Droplets, Pill, BookOpen, ShoppingBag, Clock, Check, AlertCircle } from 'lucide-react-native';
import { SHADOWS } from '../../../constants/theme';
import { SectionHeader } from '../../ui/SectionHeader';
import { BottomModal } from '../../ui/BottomModal';
import * as notifSvc from '../../../services/notificationService';

interface ReminderConfig {
    waterEnabled: boolean;
    diaryEnabled: boolean;
    medReminders: { name: string; hour: number; minute: number }[];
    groceryItems: { name: string; date: string }[];
}

interface Props {
    displayName: string;
}

export function ReminderManager({ displayName }: Props) {
    const [config, setConfig] = useState<ReminderConfig>({
        waterEnabled: true,
        diaryEnabled: true,
        medReminders: [],
        groceryItems: [],
    });
    const [showMedModal, setShowMedModal] = useState(false);
    const [showGroceryModal, setShowGroceryModal] = useState(false);
    const [medName, setMedName] = useState('');
    const [medHour, setMedHour] = useState('8');
    const [groceryName, setGroceryName] = useState('');
    const [groceryDate, setGroceryDate] = useState('');
    const [permissionOk, setPermissionOk] = useState(false);

    useEffect(() => {
        notifSvc.requestPermissions().then(setPermissionOk);
    }, []);

    async function toggleWater(val: boolean) {
        setConfig((c) => ({ ...c, waterEnabled: val }));
        if (val) {
            for (const h of [9, 11, 14, 16, 18]) {
                await notifSvc.scheduleWaterReminder(h, 0);
            }
        }
    }

    async function toggleDiary(val: boolean) {
        setConfig((c) => ({ ...c, diaryEnabled: val }));
        if (val) await notifSvc.scheduleDiaryInvite(displayName);
    }

    async function addMedReminder() {
        if (!medName) return;
        const hour = parseInt(medHour) || 8;
        await notifSvc.scheduleMedicationReminder(medName, hour, 0);
        setConfig((c) => ({
            ...c,
            medReminders: [...c.medReminders, { name: medName, hour, minute: 0 }],
        }));
        setMedName(''); setShowMedModal(false);
    }

    async function addGroceryItem() {
        if (!groceryName || !groceryDate) return;
        const date = new Date(groceryDate);
        if (isNaN(date.getTime())) return;
        await notifSvc.scheduleGroceryReminder(groceryName, date);
        setConfig((c) => ({
            ...c,
            groceryItems: [...c.groceryItems, { name: groceryName, date: groceryDate }],
        }));
        setGroceryName(''); setGroceryDate(''); setShowGroceryModal(false);
    }

    return (
        <View>
            <SectionHeader title="🔔 Grande Amigo" icon={<Bell size={18} color="#ca8a04" />} />

            {!permissionOk && (
                <View className="bg-warmth-50 rounded-2xl p-4 mb-3 flex-row items-center">
                    <AlertCircle size={16} color="#ca8a04" />
                    <Text className="text-xs text-warmth-700 ml-2 flex-1">
                        Permita notificações para receber lembretes carinhosos 💙
                    </Text>
                    <TouchableOpacity
                        onPress={() => notifSvc.requestPermissions().then(setPermissionOk)}
                        className="bg-warmth-100 rounded-xl px-3 py-1"
                    >
                        <Text className="text-xs font-semibold text-warmth-700">Permitir</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Water toggle */}
            <View className="bg-white rounded-2xl p-4 mb-2 flex-row items-center" style={SHADOWS.cardSm}>
                <Droplets size={18} color="#3b82f6" />
                <View className="flex-1 ml-3">
                    <Text className="text-sm font-medium text-neutral-700">Beber Água</Text>
                    <Text className="text-xs text-neutral-400">9h, 11h, 14h, 16h, 18h</Text>
                </View>
                <Switch value={config.waterEnabled} onValueChange={toggleWater} trackColor={{ true: '#93c5fd' }} />
            </View>

            {/* Diary toggle */}
            <View className="bg-white rounded-2xl p-4 mb-2 flex-row items-center" style={SHADOWS.cardSm}>
                <BookOpen size={18} color="#8b5cf6" />
                <View className="flex-1 ml-3">
                    <Text className="text-sm font-medium text-neutral-700">Diário (20h)</Text>
                    <Text className="text-xs text-neutral-400">
                        "Como foi seu dia, {displayName}?"
                    </Text>
                </View>
                <Switch value={config.diaryEnabled} onValueChange={toggleDiary} trackColor={{ true: '#c4b5fd' }} />
            </View>

            {/* Medication reminders */}
            <View className="bg-white rounded-2xl p-4 mb-2" style={SHADOWS.cardSm}>
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                        <Pill size={18} color="#ec4899" />
                        <Text className="text-sm font-medium text-neutral-700 ml-3">Medicações</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowMedModal(true)}>
                        <Text className="text-serene-600 text-xs font-semibold">+ Novo</Text>
                    </TouchableOpacity>
                </View>
                {config.medReminders.length === 0 ? (
                    <Text className="text-xs text-neutral-300">Nenhum lembrete de medicação</Text>
                ) : (
                    config.medReminders.map((m, i) => (
                        <View key={i} className="flex-row items-center py-1">
                            <Clock size={12} color="#a3a3a3" />
                            <Text className="text-xs text-neutral-500 ml-2">{m.name} às {m.hour}h</Text>
                        </View>
                    ))
                )}
            </View>

            {/* Grocery list */}
            <View className="bg-white rounded-2xl p-4 mb-2" style={SHADOWS.cardSm}>
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                        <ShoppingBag size={18} color="#22c55e" />
                        <Text className="text-sm font-medium text-neutral-700 ml-3">Mercado</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowGroceryModal(true)}>
                        <Text className="text-serene-600 text-xs font-semibold">+ Novo</Text>
                    </TouchableOpacity>
                </View>
                {config.groceryItems.length === 0 ? (
                    <Text className="text-xs text-neutral-300">Nenhum item na lista</Text>
                ) : (
                    config.groceryItems.map((g, i) => (
                        <View key={i} className="flex-row items-center py-1">
                            <Check size={12} color="#22c55e" />
                            <Text className="text-xs text-neutral-500 ml-2">{g.name} — {g.date}</Text>
                        </View>
                    ))
                )}
            </View>

            {/* Med Modal */}
            <BottomModal visible={showMedModal} onClose={() => setShowMedModal(false)} title="💊 Lembrete de Medicação">
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                    placeholder="Nome (ex: Vitamina D)"
                    placeholderTextColor="#a3a3a3"
                    value={medName}
                    onChangeText={setMedName}
                />
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                    placeholder="Hora (ex: 8)"
                    placeholderTextColor="#a3a3a3"
                    value={medHour}
                    onChangeText={setMedHour}
                    keyboardType="numeric"
                />
                <TouchableOpacity onPress={addMedReminder} className="bg-blush-500 rounded-2xl py-3.5 items-center">
                    <Text className="text-white font-semibold">Salvar Lembrete</Text>
                </TouchableOpacity>
            </BottomModal>

            {/* Grocery Modal */}
            <BottomModal visible={showGroceryModal} onClose={() => setShowGroceryModal(false)} title="🛒 Item de Mercado">
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-3"
                    placeholder="Item (ex: Leite, Frutas)"
                    placeholderTextColor="#a3a3a3"
                    value={groceryName}
                    onChangeText={setGroceryName}
                />
                <TextInput
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                    placeholder="Data (YYYY-MM-DD)"
                    placeholderTextColor="#a3a3a3"
                    value={groceryDate}
                    onChangeText={setGroceryDate}
                />
                <TouchableOpacity onPress={addGroceryItem} className="bg-calm-500 rounded-2xl py-3.5 items-center">
                    <Text className="text-white font-semibold">Adicionar</Text>
                </TouchableOpacity>
            </BottomModal>
        </View>
    );
}
