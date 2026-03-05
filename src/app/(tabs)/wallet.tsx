import { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Animated,
    Platform,
} from 'react-native';
import {
    Wallet,
    CreditCard,
    TrendingUp,
    TrendingDown,
    Plus,
    X,
    Calendar,
    PiggyBank,
    AlertCircle,
    ChevronRight,
    Receipt,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// ─── Self-care financial phrases ─────────────────────────
const PHRASES = [
    'Cuidar do dinheiro é cuidar de si. 💙',
    'Cada real economizado é paz de espírito. 🌿',
    'Respire fundo. Suas finanças estão no caminho certo. 🧘',
    'Planejamento é carinho com o futuro você. 🌱',
    'Gastar com consciência é um ato de autocuidado. 💚',
];

// ─── Payment Card Visual Component ──────────────────────
function PaymentCard({
    card,
    onPress,
}: {
    card: any;
    onPress?: () => void;
}) {
    const usedPercent = card.card_limit > 0
        ? (card.current_balance / card.card_limit) * 100
        : 0;
    const clampedPercent = Math.min(usedPercent, 100);
    const isOverBudget = usedPercent > 80;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <View
                className="rounded-3xl p-5 mr-4"
                style={{
                    width: 260,
                    backgroundColor: card.color || '#3b82f6',
                    shadowColor: card.color || '#3b82f6',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.25,
                    shadowRadius: 16,
                    elevation: 8,
                }}
            >
                {/* Card Header */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="bg-white/20 rounded-xl p-2">
                        <CreditCard size={18} color="#fff" />
                    </View>
                    <Text className="text-white/60 text-xs font-medium uppercase tracking-wider">
                        {card.type === 'benefit' ? 'Benefício' : 'Crédito'}
                    </Text>
                </View>

                {/* Card Name */}
                <Text className="text-white text-lg font-bold mb-1">
                    {card.name}
                </Text>

                {/* Balance */}
                <Text className="text-white/70 text-xs mb-1">Gasto atual</Text>
                <Text className="text-white text-2xl font-bold mb-4">
                    R$ {Number(card.current_balance).toFixed(2).replace('.', ',')}
                </Text>

                {/* Progress bar */}
                <View className="mb-2">
                    <View className="bg-white/20 rounded-full h-2 w-full">
                        <View
                            className="rounded-full h-2"
                            style={{
                                width: `${clampedPercent}%`,
                                backgroundColor: isOverBudget ? '#fde047' : '#fff',
                            }}
                        />
                    </View>
                </View>

                {/* Limit info */}
                <View className="flex-row justify-between">
                    <Text className="text-white/60 text-xs">
                        {clampedPercent.toFixed(0)}% usado
                    </Text>
                    <Text className="text-white/60 text-xs">
                        Limite: R$ {Number(card.card_limit).toFixed(2).replace('.', ',')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ─── Animated Card ──────────────────────────────────────
function AnimatedSection({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) {
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

// ─── Main Wallet Screen ─────────────────────────────────
export default function WalletScreen() {
    const { session } = useAuth();
    const [cards, setCards] = useState<any[]>([]);
    const [installments, setInstallments] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [todaySpent, setTodaySpent] = useState(0);
    const [monthSpent, setMonthSpent] = useState(0);
    const [showAddCard, setShowAddCard] = useState(false);
    const [phrase] = useState(PHRASES[Math.floor(Math.random() * PHRASES.length)]);

    // Add Card form
    const [newCardName, setNewCardName] = useState('');
    const [newCardLimit, setNewCardLimit] = useState('');
    const [newCardType, setNewCardType] = useState('credit_card');
    const [newCardColor, setNewCardColor] = useState('#3b82f6');

    const CARD_COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#ec4899', '#f97316', '#1d4ed8'];

    useEffect(() => {
        if (session?.user?.id) fetchAll();
    }, [session]);

    async function fetchAll() {
        const userId = session!.user.id;

        const [profileRes, cardsRes, installmentsRes, txRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).single(),
            supabase.from('payment_methods').select('*').eq('user_id', userId).order('created_at'),
            supabase.from('installments').select('*').eq('user_id', userId).order('created_at'),
            supabase.from('transactions').select('amount, transaction_date').eq('user_id', userId),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (cardsRes.data) setCards(cardsRes.data);
        if (installmentsRes.data) setInstallments(installmentsRes.data);

        if (txRes.data) {
            const today = new Date().toISOString().split('T')[0];
            const thisMonth = today.substring(0, 7); // YYYY-MM
            const todayTotal = txRes.data
                .filter((t: any) => t.transaction_date === today)
                .reduce((a: number, t: any) => a + Number(t.amount), 0);
            const monthTotal = txRes.data
                .filter((t: any) => t.transaction_date?.startsWith(thisMonth))
                .reduce((a: number, t: any) => a + Number(t.amount), 0);
            setTodaySpent(todayTotal);
            setMonthSpent(monthTotal);
        }
    }

    // Daily recommender
    const income = Number(profile?.monthly_income) || 0;
    const fixedExpenses = Number(profile?.fixed_expenses) || 0;
    const installmentsTotal = installments.reduce((a, i) => a + Number(i.monthly_value), 0);
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const dayOfMonth = new Date().getDate();
    const daysRemaining = daysInMonth - dayOfMonth + 1;
    const available = income - fixedExpenses - installmentsTotal - monthSpent;
    const dailyBudget = daysRemaining > 0 ? Math.max(available / daysRemaining, 0) : 0;

    async function handleAddCard() {
        if (!newCardName || !newCardLimit) return;
        const { error } = await supabase.from('payment_methods').insert({
            user_id: session!.user.id,
            name: newCardName,
            type: newCardType,
            card_limit: parseFloat(newCardLimit) || 0,
            current_balance: 0,
            color: newCardColor,
        });
        if (!error) {
            setShowAddCard(false);
            setNewCardName('');
            setNewCardLimit('');
            fetchAll();
        }
    }

    return (
        <View className="flex-1 bg-calm-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <AnimatedSection delay={0}>
                    <View className="pt-16 pb-2 px-6">
                        <Text className="text-2xl font-bold text-neutral-800">
                            💰 Finanças
                        </Text>
                        <Text className="text-sm text-neutral-400 mt-1">
                            {phrase}
                        </Text>
                    </View>
                </AnimatedSection>

                {/* Daily Budget Recommender */}
                <AnimatedSection delay={100}>
                    <View className="mx-6 mt-4 mb-4">
                        <View
                            className="bg-white rounded-3xl p-5"
                            style={{
                                shadowColor: '#1e3a5f',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.06,
                                shadowRadius: 16,
                                elevation: 4,
                            }}
                        >
                            <View className="flex-row items-center mb-3">
                                <View className="bg-calm-50 rounded-2xl p-2 mr-3">
                                    <PiggyBank size={20} color="#22c55e" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-neutral-400">Recomendação diária</Text>
                                    <Text className="text-2xl font-bold text-calm-700">
                                        R$ {dailyBudget.toFixed(2).replace('.', ',')}
                                    </Text>
                                </View>
                                {income === 0 && (
                                    <View className="bg-warmth-50 rounded-xl px-2 py-1">
                                        <AlertCircle size={14} color="#ca8a04" />
                                    </View>
                                )}
                            </View>
                            <View className="flex-row justify-between">
                                <View className="items-center flex-1">
                                    <Text className="text-xs text-neutral-400">Restam</Text>
                                    <Text className="text-sm font-semibold text-serene-600">
                                        {daysRemaining} dias
                                    </Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Text className="text-xs text-neutral-400">Disponível</Text>
                                    <Text className="text-sm font-semibold text-calm-600">
                                        R$ {available.toFixed(0).replace('.', ',')}
                                    </Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Text className="text-xs text-neutral-400">Gasto/mês</Text>
                                    <Text className="text-sm font-semibold text-blush-600">
                                        R$ {monthSpent.toFixed(0).replace('.', ',')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </AnimatedSection>

                {/* Payment Cards */}
                <AnimatedSection delay={200}>
                    <View className="mb-4">
                        <View className="flex-row items-center justify-between px-6 mb-3">
                            <Text className="text-base font-semibold text-neutral-800">
                                Meus Cartões
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowAddCard(true)}
                                className="bg-serene-50 rounded-xl px-3 py-1.5 flex-row items-center"
                            >
                                <Plus size={14} color="#3b82f6" />
                                <Text className="text-serene-600 text-xs font-semibold ml-1">Novo</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                        >
                            {cards.length === 0 ? (
                                <TouchableOpacity
                                    onPress={() => setShowAddCard(true)}
                                    className="border-2 border-dashed border-neutral-200 rounded-3xl items-center justify-center"
                                    style={{ width: 260, height: 180 }}
                                >
                                    <CreditCard size={32} color="#a3a3a3" strokeWidth={1.2} />
                                    <Text className="text-neutral-400 text-sm mt-3">
                                        Adicionar cartão
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                cards.map((card) => (
                                    <PaymentCard key={card.id} card={card} />
                                ))
                            )}
                        </ScrollView>
                    </View>
                </AnimatedSection>

                {/* Installments */}
                <AnimatedSection delay={350}>
                    <View className="px-6 mb-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-base font-semibold text-neutral-800">
                                📋 Parcelas
                            </Text>
                            <View className="flex-row items-center">
                                <Receipt size={14} color="#a3a3a3" />
                                <Text className="text-xs text-neutral-400 ml-1">
                                    {installments.length} ativas
                                </Text>
                            </View>
                        </View>

                        {installments.length === 0 ? (
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
                                <Calendar size={32} color="#a3a3a3" strokeWidth={1.2} />
                                <Text className="text-neutral-400 text-sm mt-3 text-center">
                                    Nenhuma parcela cadastrada.{'\n'}
                                    Adicione para controlar seus compromissos.
                                </Text>
                            </View>
                        ) : (
                            installments.map((inst) => {
                                const commitPercent = income > 0
                                    ? ((Number(inst.monthly_value) / income) * 100).toFixed(1)
                                    : '0';
                                return (
                                    <View
                                        key={inst.id}
                                        className="bg-white rounded-2xl p-4 mb-2 flex-row items-center"
                                        style={{
                                            shadowColor: '#1e3a5f',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.04,
                                            shadowRadius: 8,
                                            elevation: 2,
                                        }}
                                    >
                                        <View className="bg-serene-50 rounded-xl p-2 mr-3">
                                            <Receipt size={16} color="#3b82f6" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-neutral-700">
                                                {inst.description}
                                            </Text>
                                            <Text className="text-xs text-neutral-400">
                                                {inst.remaining_installments}x de R$ {Number(inst.monthly_value).toFixed(2).replace('.', ',')}
                                            </Text>
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-xs font-semibold text-serene-600">
                                                {commitPercent}%
                                            </Text>
                                            <Text className="text-xs text-neutral-400">da renda</Text>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </AnimatedSection>
            </ScrollView>

            {/* Add Card Modal */}
            <Modal visible={showAddCard} animationType="slide" transparent>
                <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View className="bg-white rounded-t-3xl p-6 pb-10">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-lg font-bold text-neutral-800">
                                Novo Cartão
                            </Text>
                            <TouchableOpacity onPress={() => setShowAddCard(false)}>
                                <X size={24} color="#a3a3a3" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-sm font-medium text-neutral-500 mb-2">Nome</Text>
                        <TextInput
                            className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                            placeholder="Ex: Nubank, Vale Refeição"
                            placeholderTextColor="#a3a3a3"
                            value={newCardName}
                            onChangeText={setNewCardName}
                        />

                        <Text className="text-sm font-medium text-neutral-500 mb-2">Limite (R$)</Text>
                        <TextInput
                            className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-base text-neutral-800 mb-4"
                            placeholder="5000"
                            placeholderTextColor="#a3a3a3"
                            value={newCardLimit}
                            onChangeText={setNewCardLimit}
                            keyboardType="numeric"
                        />

                        <Text className="text-sm font-medium text-neutral-500 mb-2">Tipo</Text>
                        <View className="flex-row gap-2 mb-4">
                            {[
                                { key: 'credit_card', label: 'Crédito' },
                                { key: 'benefit', label: 'Benefício' },
                            ].map((t) => (
                                <TouchableOpacity
                                    key={t.key}
                                    onPress={() => setNewCardType(t.key)}
                                    className={`flex-1 rounded-2xl py-3 items-center border ${newCardType === t.key
                                            ? 'bg-serene-50 border-serene-300'
                                            : 'bg-white border-neutral-200'
                                        }`}
                                >
                                    <Text
                                        className={`text-sm font-medium ${newCardType === t.key ? 'text-serene-600' : 'text-neutral-400'
                                            }`}
                                    >
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
                                    onPress={() => setNewCardColor(c)}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: c,
                                        borderWidth: newCardColor === c ? 3 : 0,
                                        borderColor: '#fff',
                                        ...(newCardColor === c
                                            ? {
                                                shadowColor: c,
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.4,
                                                shadowRadius: 6,
                                                elevation: 4,
                                            }
                                            : {}),
                                    }}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={handleAddCard}
                            className="bg-serene-500 rounded-2xl py-4 items-center"
                        >
                            <Text className="text-white font-semibold text-base">
                                Adicionar Cartão
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
