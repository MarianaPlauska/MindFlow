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
    Brain,
    Smile,
    Meh,
    Frown,
    X,
    Plus,
    Sparkles,
    BookOpen,
    MessageCircle,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// ─── Dynamic self-care phrases ──────────────────────────
const PHRASES = [
    'Respirar é o primeiro passo. Você está fazendo o suficiente. 🌿',
    'Seus sentimentos são válidos, sempre. 💙',
    'Hoje é um dia novo — e isso já é um recomeço. 🌅',
    'Seja gentil consigo. A vida não precisa ser perfeita. 💚',
    'A ansiedade mente. Você é mais forte do que pensa. 🦋',
    'Cuidar da mente é tão importante quanto cuidar do corpo. 🧘',
    'Está tudo bem não estar bem. Peça ajuda quando precisar. 💜',
    'Cada respiração profunda é um abraço em si. 🫧',
    'O progresso não é linear — e tudo bem. 🌱',
    'Você merece paz. Permita-se descansar. ☁️',
];

const MOODS = [
    { score: 1, icon: Frown, label: 'Péssimo', color: '#be185d', bg: '#fdf2f8' },
    { score: 2, icon: Frown, label: 'Mal', color: '#ec4899', bg: '#fce7f3' },
    { score: 3, icon: Meh, label: 'Neutro', color: '#eab308', bg: '#fefce8' },
    { score: 4, icon: Smile, label: 'Bem', color: '#22c55e', bg: '#dcfce7' },
    { score: 5, icon: Smile, label: 'Ótimo', color: '#15803d', bg: '#f0fdf4' },
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

// ─── Main Mind Screen ───────────────────────────────────
export default function MindScreen() {
    const { session } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [moodType, setMoodType] = useState<'anxiety' | 'depression'>('anxiety');
    const [notes, setNotes] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [phrase] = useState(PHRASES[Math.floor(Math.random() * PHRASES.length)]);

    // Mood button animations
    const scaleAnims = useRef(MOODS.map(() => new Animated.Value(1))).current;

    useEffect(() => {
        if (session?.user?.id) fetchLogs();
    }, [session]);

    async function fetchLogs() {
        const { data } = await supabase
            .from('mood_logs')
            .select('*')
            .eq('user_id', session!.user.id)
            .order('logged_at', { ascending: false })
            .limit(10);
        if (data) setLogs(data);
    }

    function handleMoodSelect(index: number, score: number) {
        Animated.sequence([
            Animated.timing(scaleAnims[index], { toValue: 1.3, duration: 100, useNativeDriver: true }),
            Animated.spring(scaleAnims[index], { toValue: 1.1, friction: 3, useNativeDriver: true }),
        ]).start();

        // Reset others
        scaleAnims.forEach((anim, i) => {
            if (i !== index) {
                Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            }
        });

        setSelectedMood(score);
        setShowNoteModal(true);
    }

    async function saveMood() {
        if (!selectedMood) return;
        setSaving(true);
        await supabase.from('mood_logs').insert({
            user_id: session!.user.id,
            mood_score: selectedMood,
            mood_type: moodType,
            notes: notes.trim() || null,
        });
        setSelectedMood(null);
        setNotes('');
        setShowNoteModal(false);
        setSaving(false);
        // Reset all scale animations
        scaleAnims.forEach((anim) => {
            Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        });
        fetchLogs();
    }

    function formatTime(dateStr: string) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    function getMoodData(score: number) {
        return MOODS.find((m) => m.score === score) || MOODS[2];
    }

    return (
        <View className="flex-1 bg-calm-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <AnimatedSection delay={0}>
                    <View className="pt-16 pb-2 px-6">
                        <Text className="text-2xl font-bold text-neutral-800">🧠 Mente</Text>
                        <Text className="text-sm text-neutral-400 mt-1">{phrase}</Text>
                    </View>
                </AnimatedSection>

                {/* Dynamic Phrase Card */}
                <AnimatedSection delay={100}>
                    <View className="mx-6 mt-4 mb-4">
                        <View
                            className="rounded-3xl p-5 flex-row items-center"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
                        >
                            <Sparkles size={20} color="#3b82f6" />
                            <Text className="text-sm text-serene-600 ml-3 flex-1 leading-5">
                                {phrase}
                            </Text>
                        </View>
                    </View>
                </AnimatedSection>

                {/* Mood Selector */}
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
                        <Text className="text-base font-semibold text-neutral-800 mb-1">
                            Como você está agora?
                        </Text>
                        <Text className="text-xs text-neutral-400 mb-5">
                            Toque para registrar — é seguro e anônimo 💙
                        </Text>

                        <View className="flex-row justify-between mb-4">
                            {MOODS.map((mood, index) => {
                                const Icon = mood.icon;
                                return (
                                    <TouchableOpacity
                                        key={mood.score}
                                        onPress={() => handleMoodSelect(index, mood.score)}
                                        activeOpacity={0.7}
                                    >
                                        <Animated.View
                                            className="items-center p-2 rounded-2xl"
                                            style={{
                                                transform: [{ scale: scaleAnims[index] }],
                                                backgroundColor: selectedMood === mood.score ? mood.bg : 'transparent',
                                            }}
                                        >
                                            <Icon size={30} color={mood.color} strokeWidth={1.8} />
                                            <Text className="text-xs text-neutral-400 mt-1">{mood.label}</Text>
                                        </Animated.View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Type selector */}
                        <View className="flex-row gap-2">
                            {[
                                { key: 'anxiety' as const, label: 'Ansiedade', emoji: '😰' },
                                { key: 'depression' as const, label: 'Depressão', emoji: '😔' },
                            ].map((t) => (
                                <TouchableOpacity
                                    key={t.key}
                                    onPress={() => setMoodType(t.key)}
                                    className={`flex-1 rounded-2xl py-2.5 items-center border ${moodType === t.key
                                            ? 'bg-serene-50 border-serene-300'
                                            : 'bg-white border-neutral-200'
                                        }`}
                                >
                                    <Text
                                        className={`text-sm font-medium ${moodType === t.key ? 'text-serene-600' : 'text-neutral-400'
                                            }`}
                                    >
                                        {t.emoji} {t.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </AnimatedSection>

                {/* Recent Logs */}
                <AnimatedSection delay={350}>
                    <View className="px-6 mb-4">
                        <View className="flex-row items-center mb-3">
                            <BookOpen size={18} color="#a3a3a3" />
                            <Text className="text-base font-semibold text-neutral-800 ml-2">
                                Diário emocional
                            </Text>
                        </View>

                        {logs.length === 0 ? (
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
                                <Brain size={32} color="#a3a3a3" strokeWidth={1.2} />
                                <Text className="text-neutral-400 text-sm mt-3 text-center">
                                    Nenhum registro ainda.{'\n'}
                                    Compartilhar como se sente ajuda a entender padrões. 🌿
                                </Text>
                            </View>
                        ) : (
                            logs.map((log) => {
                                const moodData = getMoodData(log.mood_score);
                                const Icon = moodData.icon;
                                return (
                                    <View
                                        key={log.id}
                                        className="bg-white rounded-2xl p-4 mb-2 flex-row items-center"
                                        style={{
                                            shadowColor: '#1e3a5f',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.04,
                                            shadowRadius: 8,
                                            elevation: 2,
                                        }}
                                    >
                                        <View
                                            className="rounded-xl p-2 mr-3"
                                            style={{ backgroundColor: moodData.bg }}
                                        >
                                            <Icon size={20} color={moodData.color} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-neutral-700">
                                                {moodData.label} — {log.mood_type === 'anxiety' ? 'Ansiedade' : 'Depressão'}
                                            </Text>
                                            {log.notes && (
                                                <Text className="text-xs text-neutral-400 mt-1" numberOfLines={2}>
                                                    {log.notes}
                                                </Text>
                                            )}
                                        </View>
                                        <Text className="text-xs text-neutral-300">
                                            {formatTime(log.logged_at)}
                                        </Text>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </AnimatedSection>
            </ScrollView>

            {/* Note Modal */}
            <Modal visible={showNoteModal} animationType="slide" transparent>
                <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View className="bg-white rounded-t-3xl p-6 pb-10">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <MessageCircle size={20} color="#3b82f6" />
                                <Text className="text-lg font-bold text-neutral-800 ml-2">
                                    Quer compartilhar mais?
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => { setShowNoteModal(false); setSelectedMood(null); }}>
                                <X size={24} color="#a3a3a3" />
                            </TouchableOpacity>
                        </View>

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
                                onPress={() => { setShowNoteModal(false); setSelectedMood(null); }}
                                className="flex-1 border border-neutral-200 rounded-2xl py-3.5 items-center"
                            >
                                <Text className="text-neutral-400 font-medium">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={saveMood}
                                disabled={saving}
                                className="flex-1 bg-serene-500 rounded-2xl py-3.5 items-center"
                                style={{ opacity: saving ? 0.7 : 1 }}
                            >
                                <Text className="text-white font-semibold">
                                    {saving ? 'Salvando...' : 'Salvar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
