import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as finSvc from '../services/financeService';
import * as savSvc from '../services/savingsService';
import { fetchProfile } from '../services/profileService';

export function useFinance() {
    const { session } = useAuth();
    const [cards, setCards] = useState<any[]>([]);
    const [installments, setInstallments] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [savings, setSavings] = useState<any[]>([]);
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

        const [profileRes, cardsRes, installRes, txRes, savRes] = await Promise.all([
            fetchProfile(userId).catch(() => ({ data: null })),
            finSvc.fetchCards(userId).catch(() => ({ data: [] })),
            finSvc.fetchInstallments(userId).catch(() => ({ data: [] })),
            finSvc.fetchTransactions(userId).catch(() => ({ data: [] })),
            savSvc.fetchSavings(userId).catch(() => ({ data: [] })),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        setCards(cardsRes.data);
        setInstallments(installRes.data);
        setTransactions(txRes.data);
        setSavings(savRes.data);

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
        0,
    ).getDate();
    const dayOfMonth = new Date().getDate();
    const daysRemaining = daysInMonth - dayOfMonth + 1;
    // Savings balance
    const savingsBalance = savSvc.calculateSavingsBalance(savings);

    const available = income - fixedExpenses - installTotal - savingsBalance;
    const remainingForMonth = available - monthSpent;
    const dailyBudget = daysRemaining > 0 ? Math.max(remainingForMonth / daysRemaining, 0) : 0;

    async function handleAddCard(card: {
        name: string; type: string; card_limit: number; color: string;
    }) {
        const { error } = await finSvc.addCard(session!.user.id, card);
        if (!error) await load();
        return { error };
    }

    async function handleAddInstallment(inst: {
        description: string; total_value: number; remaining_installments: number; monthly_value: number;
        notes?: string; category?: string;
    }) {
        const { error } = await finSvc.addInstallment(session!.user.id, inst);
        if (!error) await load();
        return { error };
    }

    async function handleAddTransaction(tx: {
        description: string; amount: number; category?: string; notes?: string | null; payment_method_id?: string;
    }) {
        const { error } = await finSvc.addTransaction(session!.user.id, tx);
        if (!error) await load();
        return { error };
    }

    async function handleAddSavings(entry: {
        description: string; amount: number; type: 'deposit' | 'withdrawal'; notes?: string | null;
    }) {
        const { error } = await savSvc.addSavingsDeposit(session!.user.id, entry);
        if (!error) await load();
        return { error };
    }

    return {
        cards,
        installments,
        transactions,
        savings,
        savingsBalance,
        profile,
        todaySpent,
        monthSpent,
        dailyBudget,
        daysRemaining,
        available,
        remainingForMonth,
        income,
        fixedExpenses,
        loading,
        addCard: handleAddCard,
        addInstallment: handleAddInstallment,
        addTransaction: handleAddTransaction,
        addSavings: handleAddSavings,
        refresh: load,
    };
}
