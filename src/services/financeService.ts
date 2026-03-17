import { supabase } from '../lib/supabase';

// ─── Payment Methods ────────────────────────────────────

export async function fetchCards(userId: string) {
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at');
    return { data: data || [], error };
}

export async function addCard(userId: string, card: {
    name: string;
    type: string;
    card_limit: number;
    color: string;
}) {
    const { data, error } = await supabase
        .from('payment_methods')
        .insert({ user_id: userId, current_balance: 0, ...card })
        .select()
        .single();
    return { data, error };
}

export async function deleteCard(cardId: string) {
    return supabase.from('payment_methods').delete().eq('id', cardId);
}

// ─── Installments ───────────────────────────────────────

export async function fetchInstallments(userId: string) {
    const { data, error } = await supabase
        .from('installments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at');
    return { data: data || [], error };
}

export async function addInstallment(userId: string, inst: {
    description: string;
    total_value: number;
    remaining_installments: number;
    monthly_value: number;
}) {
    const { data, error } = await supabase
        .from('installments')
        .insert({ user_id: userId, ...inst })
        .select()
        .single();
    return { data, error };
}

// ─── Transactions ───────────────────────────────────────

export async function fetchTransactions(userId: string) {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return { data: data || [], error };
}

export async function addTransaction(userId: string, tx: {
    description: string;
    amount: number;
    category?: string;
    notes?: string | null;
    payment_method_id?: string;
}) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('transactions')
        .insert({
            user_id: userId,
            transaction_date: today,
            ...tx,
        })
        .select()
        .single();
    return { data, error };
}
