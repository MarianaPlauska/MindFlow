import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as finSvc from '../services/financeService';
import { fetchProfile } from '../services/profileService';

export function useFinance() {
    const { session } = useAuth();
    const [cards, setCards] = useState<any[]>([]);
    const [installments, setInstallments] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [todaySpent, setTodaySpent] = useState(0);
    const [monthSpent, setMonthSpent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) load();
    }, [session]);

    async function load() {
        const userId = session!.user.id;
        setLoading(true);

        const [profileRes, cardsRes, installRes, txRes] = await Promise.all([
            fetchProfile(userId),
            finSvc.fetchCards(userId),
            finSvc.fetchInstallments(userId),
            finSvc.fetchTransactions(userId),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        setCards(cardsRes.data);
        setInstallments(installRes.data);

        const today = new Date().toISOString().split('T')[0];
        const thisMonth = today.substring(0, 7);
        const dayTotal = txRes.data
            .filter((t: any) => t.transaction_date === today)
            .reduce((a: number, t: any) => a + Number(t.amount), 0);
        const mTotal = txRes.data
            .filter((t: any) => t.transaction_date?.startsWith(thisMonth))
            .reduce((a: number, t: any) => a + Number(t.amount), 0);

        setTodaySpent(dayTotal);
        setMonthSpent(mTotal);
        setLoading(false);
    }

    // Daily budget recommender
    const income = Number(profile?.monthly_income) || 0;
    const fixedExpenses = Number(profile?.fixed_expenses) || 0;
    const installTotal = installments.reduce((a, i) => a + Number(i.monthly_value), 0);
    const daysInMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
    ).getDate();
    const dayOfMonth = new Date().getDate();
    const daysRemaining = daysInMonth - dayOfMonth + 1;
    const available = income - fixedExpenses - installTotal - monthSpent;
    const dailyBudget = daysRemaining > 0 ? Math.max(available / daysRemaining, 0) : 0;

    async function handleAddCard(card: {
        name: string;
        type: string;
        card_limit: number;
        color: string;
    }) {
        const { error } = await finSvc.addCard(session!.user.id, card);
        if (!error) await load();
        return { error };
    }

    return {
        cards,
        installments,
        profile,
        todaySpent,
        monthSpent,
        dailyBudget,
        daysRemaining,
        available,
        income,
        loading,
        addCard: handleAddCard,
        refresh: load,
    };
}
