import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
    session: Session | null;
    loading: boolean;
    isNewUser: boolean;
    setIsNewUser: (v: boolean) => void;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                checkIfNewUser(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session && _event === 'SIGNED_IN') {
                await checkIfNewUser(session.user.id);
            }
            if (_event === 'SIGNED_OUT') {
                setIsNewUser(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function checkIfNewUser(userId: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username')
                .eq('id', userId)
                .single();

            if (error || !data?.username) {
                setIsNewUser(true);
            } else {
                setIsNewUser(false);
            }
        } catch {
            setIsNewUser(true);
        } finally {
            setLoading(false);
        }
    }

    async function signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    }

    async function signUp(email: string, password: string) {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error?.message ?? null };
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    return (
        <AuthContext.Provider
            value={{ session, loading, isNewUser, setIsNewUser, signIn, signUp, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}
