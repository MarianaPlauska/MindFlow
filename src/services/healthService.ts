import { supabase } from '../lib/supabase';

// ─── Water Logs ─────────────────────────────────────────

export async function fetchWaterToday(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('water_logs')
        .select('amount_ml')
        .eq('user_id', userId)
        .gte('logged_at', `${today}T00:00:00`);
    if (error) return { total: 0, error };
    const total = (data || []).reduce((a: number, w: any) => a + w.amount_ml, 0);
    return { total, error: null };
}

export async function addWaterLog(userId: string, amountMl: number) {
    return supabase.from('water_logs').insert({
        user_id: userId,
        amount_ml: amountMl,
    });
}

// ─── Medication Reminders ───────────────────────────────

export async function fetchReminders(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('medication_reminders')
        .select('*')
        .eq('user_id', userId)
        .eq('due_date', today)
        .order('created_at');
    return { data: data || [], error };
}

export async function addReminder(userId: string, reminder: {
    name: string;
    reminder_type: string;
}) {
    const today = new Date().toISOString().split('T')[0];
    return supabase.from('medication_reminders').insert({
        user_id: userId,
        due_date: today,
        ...reminder,
    });
}

export async function toggleReminderDone(id: string, isDone: boolean) {
    return supabase
        .from('medication_reminders')
        .update({ is_done: !isDone })
        .eq('id', id);
}
