import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, type AppStateStatus } from 'react-native';

const supabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    'https://opjoyiougllhinzuyhwq.supabase.co';
const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wam95aW91Z2xsaGluenV5aHdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzIwNzEsImV4cCI6MjA4ODIwODA3MX0.tXGrLwsZt6HMd53hPOnqnnCrTQsWECIuQdNZI6ztZSU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Auto-refresh token when app comes back to foreground
AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});
