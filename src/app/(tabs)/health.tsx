import { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Animated,
} from 'react-native';
import {
    Droplets,
    Beef,
    Plus,
    X,
    Pill,
    Check,
    Heart,
    ShoppingBag,
    Sparkles,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// ─── Self-care health phrases ───────────────────────────
const PHRASES = [
    'Seu corpo merece hidratação e cuidado. 💧',
    'Cada copo de água é um ato de amor próprio. 💙',
    'Proteína constrói força — e força começa por dentro. 💪',
    'Lembrar do remédio é lembrar de si. 💊',
    'Pequenos hábitos constroem grandes mudanças. 🌱',
    'Cuide do corpo como cuida de quem ama. 💚',
];

// ─── Animated Section ───────────────────────────────────
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(16)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {children}
        </Animated.View>
    );
}

// ─── Water Bubble Button ────────────────────────────────
function WaterButton({ onPress, disabled }: { onPress: () => void; disabled: boolean }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    function handlePress() {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start();
        onPress();
    }

    return (
        <TouchableOpacity onPress={handlePress} disabled={disabled} activeOpacity={0.8}>
            <Animated.View
                className="bg-serene-500 rounded-2xl px-6 py-3 flex-row items-center"
                style={{ transform: [{ scale: scaleAnim }], opacity: disabled ? 0.5 : 1 }}
            >
                <Droplets size={18} color="#fff" />
                <Text className="text-white font-semibold ml-2">+ 200ml</Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

// ─── Main Health Screen ─────────────────────────────────
export default function HealthScreen() {
    const { session } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [waterToday, setWaterToday] = useState(0);
    const [reminders, setReminders] = useState<any[]>([]);
    const [showAddReminder, setShowAddReminder] = useState(false);
    const [newReminderName, setNewReminderName] = useState('');
    const [newReminderType, setNewReminderType] = useState('take');
    const [loadingWater, setLoadingWater] = useState(false);
    const [phrase] = useState(PHRASES[Math.floor(Math.random() * PHRASES.length)]);

    // Water fill animation
    const waterFillAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (session?.user?.id) fetchAll();
    }, [session]);

    useEffect(() => {
        const waterGoal = profile?.water_goal_ml || 2000;
        const targetPercent = Math.min(waterToday / waterGoal, 1);
        Animated.timing(waterFillAnim, {
            toValue: targetPercent,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [waterToday, profile]);

    async function fetchAll() {
        const userId = session!.user.id;
        const today = new Date().toISOString().split('T')[0];

        const [profileRes, waterRes, reminderRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).single(),
            supabase.from('water_logs').select('amount_ml').eq('user_id', userId).gte('logged_at', `${today}T00:00:00`),
            supabase.from('medication_reminders').select('*').eq('user_id', userId).eq('due_date', today).order('created_at'),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (waterRes.data) {
            const total = waterRes.data.reduce((a: number, w: any) => a + w.amount_ml, 0);
            setWaterToday(total);
        }
        if (reminderRes.data) setReminders(reminderRes.data);
    }

    async function addWater() {
        setLoadingWater(true);
        await supabase.from('water_logs').insert({
            user_id: session!.user.id,
            amount_ml: 200,
        });
        setWaterToday((prev) => prev + 200);
        setLoadingWater(false);
    }

    async function toggleReminder(id: string, current: boolean) {
        await supabase.from('medication_reminders').update({ is_done: !current }).eq('id', id);
        setReminders((prev) =>
            prev.map((r) => (r.id === id ? { ...r, is_done: !current } : r))
        );
    }

    async function addReminder() {
        if (!newReminderName.trim()) return;
        const today = new Date().toISOString().split('T')[0];
        await supabase.from('medication_reminders').insert({
            user_id: session!.user.id,
            name: newReminderName.trim(),
            reminder_type: newReminderType,
            due_date: today,
        });
        setNewReminderName('');
        setShowAddReminder(false);
        fetchAll();
    }

    const waterGoal = profile?.water_goal_ml || 2000;
    const proteinGoal = profile?.protein_goal_g || 100;
    const waterPercent = Math.min((waterToday / waterGoal) * 100, 100);
    const proteinCurrent = 0; // TODO: integrate with food logging
    const proteinPercent = Math.min((proteinCurrent / proteinGoal) * 100, 100);

    return (
        <View className="flex-1 bg-calm-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <AnimatedSection delay={0}>
                    <View className="pt-16 pb-2 px-6">
                        <Text className="text-2xl font-bold text-neutral-800">💚 Saúde</Text>
                        <Text className="text-sm text-neutral-400 mt-1">{phrase}</Text>
                    </View>
                </AnimatedSection>

                {/* Water Card */}
                <AnimatedSection delay={100}>
                    <View
                        className="mx-6 mt-4 mb-4 bg-white rounded-3xl p-6"
                        style={{
                            shadowColor: '#1e3a5f',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.06,
                            shadowRadius: 16,
                            elevation: 4,
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <Droplets size={20} color="#3b82f6" />
                                <Text className="text-base font-semibold text-serene-700 ml-2">Água</Text>
                            </View>
                            <WaterButton onPress={addWater} disabled={loadingWater} />
                        </View>

                        {/* Animated water bar */}
                        <View className="bg-serene-50 rounded-full h-5 w-full mb-2 overflow-hidden">
                            <Animated.View
                                className="bg-serene-400 rounded-full h-5"
                                style={{
                                    width: waterFillAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                }}
                            />
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-xs text-neutral-400">
                                {waterToday}ml de {waterGoal}ml
                            </Text>
                            <Text className="text-xs font-semibold text-serene-600">
                                {waterPercent.toFixed(0)}%
                            </Text>
                        </View>
                    </View>
                </AnimatedSection>

                {/* Protein Card */}
                <AnimatedSection delay={200}>
                    <View
                        className="mx-6 mb-4 bg-white rounded-3xl p-6"
                        style={{
                            shadowColor: '#1e3a5f',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.06,
                            shadowRadius: 16,
                            elevation: 4,
                        }}
                    >
                        <View className="flex-row items-center mb-3">
                            <Beef size={20} color="#22c55e" />
                            <Text className="text-base font-semibold text-calm-700 ml-2">Proteína</Text>
                        </View>
                        <View className="bg-calm-50 rounded-full h-4 w-full mb-2">
                            <View className="bg-calm-400 rounded-full h-4" style={{ width: `${proteinPercent}%` }} />
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-xs text-neutral-400">{proteinCurrent}g / {proteinGoal}g</Text>
                            <Text className="text-xs font-semibold text-calm-600">{proteinPercent.toFixed(0)}%</Text>
                        </View>
                    </View>
                </AnimatedSection>

                {/* Medication / Reminders */}
                <AnimatedSection delay={300}>
                    <View className="px-6 mb-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center">
                                <Pill size={18} color="#8b5cf6" />
                                <Text className="text-base font-semibold text-neutral-800 ml-2">
                                    Lembretes
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowAddReminder(true)}
                                className="bg-calm-50 rounded-xl px-3 py-1.5 flex-row items-center"
                            >
                                <Plus size={14} color="#22c55e" />
                                <Text className="text-calm-600 text-xs font-semibold ml-1">Novo</Text>
                            </TouchableOpacity>
                        </View>

                        {reminders.length === 0 ? (
                            <View
                                className="bg-white rounded-3xl p-6 items-center"
                                style={{
                                    shadowColor: '#1e3a5f',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.06,
                                    shadowRadius: 16,
                                    elevation: 4,
                                }}
                            >
                                <Heart size={32} color="#a3a3a3" strokeWidth={1.2} />
                                <Text className="text-neutral-400 text-sm mt-3 text-center">
                                    Sem lembretes para hoje.{'\n'}
                                    Adicione medicações ou tarefas de saúde!
                                </Text>
                            </View>
                        ) : (
                            reminders.map((rem) => (
                                <TouchableOpacity
                                    key={rem.id}
                                    onPress={() => toggleReminder(rem.id, rem.is_done)}
                                    className="bg-white rounded-2xl p-4 mb-2 flex-row items-center"
                                    style={{
                                        shadowColor: '#1e3a5f',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.04,
                                        shadowRadius: 8,
                                        elevation: 2,
                                        opacity: rem.is_done ? 0.6 : 1,
                                    }}
                                >
                                    <View
                                        className={`rounded-xl p-2 mr-3 ${rem.is_done ? 'bg-calm-100' : 'bg-blush-50'
                                            }`}
                                    >
                                        {rem.is_done ? (
                                            <Check size={16} color="#22c55e" />
                                        ) : rem.reminder_type === 'buy' ? (
                                            <ShoppingBag size={16} color="#ec4899" />
                                        ) : (
                                            <Pill size={16} color="#8b5cf6" />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <Text
                                            className={`text-sm font-medium ${rem.is_done ? 'text-neutral-400 line-through' : 'text-neutral-700'
                                                }`}
                                        >
                                            {rem.name}
                                        </Text>
                                        <Text className="text-xs text-neutral-400">
                                            {rem.reminder_type === 'buy' ? 'Comprar' : 'Tomar'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </AnimatedSection>
            </ScrollView>

            {/* Add Reminder Modal */}
            <Modal visible={showAddReminder} animationType="slide" transparent>
                <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View className="bg-white rounded-t-3xl p-6 pb-10">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-lg font-bold text-neutral-800">Novo Lembrete</Text>
                            <TouchableOpacity onPress={() => setShowAddReminder(false)}>
                                <X size={24} color="#a3a3a3" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-sm font-medium text-neutral-500 mb-2">Descrição</Text>
                        <TextInput
                            className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                            placeholder="Ex: Tomar remédio, Comprar vitamina"
                            placeholderTextColor="#a3a3a3"
                            value={newReminderName}
                            onChangeText={setNewReminderName}
                        />

                        <Text className="text-sm font-medium text-neutral-500 mb-2">Tipo</Text>
                        <View className="flex-row gap-2 mb-6">
                            {[
                                { key: 'take', label: '💊 Tomar', icon: Pill },
                                { key: 'buy', label: '🛒 Comprar', icon: ShoppingBag },
                            ].map((t) => (
                                <TouchableOpacity
                                    key={t.key}
                                    onPress={() => setNewReminderType(t.key)}
                                    className={`flex-1 rounded-2xl py-3 items-center border ${newReminderType === t.key
                                            ? 'bg-calm-50 border-calm-300'
                                            : 'bg-white border-neutral-200'
                                        }`}
                                >
                                    <Text
                                        className={`text-sm font-medium ${newReminderType === t.key ? 'text-calm-600' : 'text-neutral-400'
                                            }`}
                                    >
                                        {t.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={addReminder}
                            className="bg-calm-500 rounded-2xl py-4 items-center"
                        >
                            <Text className="text-white font-semibold text-base">Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
