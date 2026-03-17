import { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import GoalProgressBar from '../../components/GoalProgressBar';

type FinancialGoal = {
    id: string;
    user_id: string;
    title: string;
    target_amount: number;
    current_amount: number;
    created_at: string;
};

// One accent per goal (cycles through list)
const ACCENTS = ['#4ade80', '#60a5fa', '#f472b6', '#fde047', '#a78bfa'];

export default function WalletScreen() {
    const { session } = useAuth();
    const [goals, setGoals] = useState<FinancialGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function fetchGoals() {
        if (!session?.user.id) return;
        const { data } = await supabase
            .from('financial_goals')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: true });
        setGoals((data ?? []) as FinancialGoal[]);
    }

    useEffect(() => {
        fetchGoals().finally(() => setLoading(false));
    }, [session]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchGoals();
        setRefreshing(false);
    }, [session]);

    const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
    const totalCurrent = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);

    return (
        <View className="flex-1 bg-neutral-950">
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 24,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4ade80"
                    />
                }
            >
                {/* Page header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-neutral-100">
                        Finanças
                    </Text>
                    <Text className="text-sm text-neutral-500 mt-1">
                        Acompanhe suas metas financeiras
                    </Text>
                </View>

                {/* Summary card */}
                {goals.length > 0 && (
                    <View
                        className="bg-neutral-900 rounded-3xl p-5 mb-8"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.4,
                            shadowRadius: 10,
                            elevation: 6,
                        }}
                    >
                        <Text className="text-xs font-bold tracking-widest text-neutral-500 mb-3">
                            TOTAL ACUMULADO
                        </Text>
                        <Text className="text-3xl font-bold text-white mb-1">
                            R${' '}
                            {totalCurrent.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                            })}
                        </Text>
                        <Text className="text-sm text-neutral-500">
                            de R${' '}
                            {totalTarget.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                            })}{' '}
                            em metas
                        </Text>
                    </View>
                )}

                {/* Section header */}
                <Text className="text-xs font-bold tracking-widest text-neutral-500 mb-4 px-1">
                    METAS FINANCEIRAS
                </Text>

                {loading && (
                    <ActivityIndicator
                        size="large"
                        color="#4ade80"
                        style={{ marginTop: 40 }}
                    />
                )}

                {!loading && goals.length === 0 && (
                    <View className="items-center mt-16">
                        <Text className="text-4xl mb-4">🎯</Text>
                        <Text className="text-base text-neutral-400 text-center">
                            Nenhuma meta cadastrada ainda.{'\n'}Adicione pelo Supabase ou aguarde a UI de criação.
                        </Text>
                    </View>
                )}

                {!loading &&
                    goals.map((goal, i) => (
                        <GoalProgressBar
                            key={goal.id}
                            title={goal.title}
                            current={Number(goal.current_amount)}
                            target={Number(goal.target_amount)}
                            accentColor={ACCENTS[i % ACCENTS.length]}
                        />
                    ))}
            </ScrollView>
        </View>
    );
}
