import { supabase } from '../lib/supabase';

// ─── Water Logs ─────────────────────────────────────────

export async function fetchWaterToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDayISO = today.toISOString();
    const { data, error } = await supabase
        .from('water_logs')
        .select('amount_ml')
        .eq('user_id', userId)
        .gte('logged_at', startOfDayISO);
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

export async function clearWaterLog(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDayISO = today.toISOString();
    return supabase.from('water_logs')
        .delete()
        .eq('user_id', userId)
        .gte('logged_at', startOfDayISO);
}

// ─── Protein / Meal Logs ────────────────────────────────

export async function fetchProteinToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDayISO = today.toISOString();
    const { data, error } = await supabase
        .from('meal_logs')
        .select('protein_g')
        .eq('user_id', userId)
        .gte('logged_at', startOfDayISO);
    if (error) return { total: 0, error };
    const total = (data || []).reduce((a: number, m: any) => a + Number(m.protein_g), 0);
    return { total, error: null };
}

export async function addProteinLog(userId: string, proteinG: number, name: string = 'Refeição') {
    return supabase.from('meal_logs').insert({
        user_id: userId,
        protein_g: proteinG,
        name,
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

// ─── Medication Tracking (Anti-Anxiety) ─────────────────

export async function fetchMedicationLogsToday(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', `${today}T00:00:00`)
        .order('logged_at', { ascending: false });
    return { data: data || [], error };
}

export async function addMedicationLog(userId: string, medicationName: string = 'Medicação Diária') {
    return supabase.from('medication_logs').insert({
        user_id: userId,
        medication_name: medicationName,
    });
}

export async function fetchMedicationRoutines(userId: string) {
    const { data, error } = await supabase
        .from('medication_routines')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('scheduled_time', { ascending: true });
    return { data: data || [], error };
}

export async function addMedicationRoutine(userId: string, routine: {
    name: string;
    dosage?: string;
    scheduled_time?: string;
}) {
    return supabase.from('medication_routines').insert({
        user_id: userId,
        scheduled_time: '08:00',
        ...routine,
    });
}

export async function deleteMedicationRoutine(id: string) {
    return supabase.from('medication_routines')
        .update({ is_active: false })
        .eq('id', id);
}
