import { supabase } from '../lib/supabase';

export async function fetchMoodLogs(userId: string, limit = 10) {
    const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(limit);
    return { data: data || [], error };
}

export async function saveMoodLog(userId: string, log: {
    mood_score: number;
    mood_type: string;
    notes?: string | null;
}) {
    return supabase.from('mood_logs').insert({
        user_id: userId,
        ...log,
    });
}
