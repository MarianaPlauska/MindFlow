import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        // .eq('user_id', '5b889c78-bdd4-4dc2-a91c-da059f0a3be4')
        .gte('logged_at', `${today}T00:00:00`);

    console.log("Returned data:");
    console.log(data);
    console.log("Error:", error);
}

test();
