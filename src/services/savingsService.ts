import { supabase } from '../lib/supabase';

// ─── Savings / Reserve ──────────────────────────────────

export async function fetchSavings(userId: string) {
    const { data, error } = await supabase
        .from('savings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return { data: data || [], error };
}

export async function addSavingsDeposit(userId: string, entry: {
    description: string;
    amount: number;
    type: 'deposit' | 'withdrawal';
    notes?: string | null;
}) {
    const { data, error } = await supabase
        .from('savings')
        .insert({ user_id: userId, ...entry })
        .select()
        .single();
    return { data, error };
}

export function calculateSavingsBalance(records: any[]): number {
    return records.reduce((total: number, r: any) => {
        return r.type === 'deposit'
            ? total + Number(r.amount)
            : total - Number(r.amount);
    }, 0);
}
