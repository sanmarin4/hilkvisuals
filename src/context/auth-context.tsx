"use client";

import { getSupabaseClient } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  fullName: string;
  email: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const supabase = getSupabaseClient()
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email!);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Supabase Initialization Error:', error);
        setIsLoading(false); // Still stop loading even if auth fails
      }
    }

    initializeAuth();

    // Listen for auth changes
    const supabase = getSupabaseClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(id: string, email: string) {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Profile not found or error:', error.message);
        setUser({ id, email, fullName: '' });
      } else if (data) {
        setUser({ id, email, fullName: data.full_name });
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setUser({ id, email, fullName: '' });
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    let user = data.user ?? data.session?.user
    let userId = user?.id
    let userEmail = user?.email ?? email

    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        console.warn('Sign in after sign up failed:', signInError.message)
      } else {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('Could not load session after signup:', sessionError.message)
        }
        if (session?.user) {
          user = session.user
          userId = session.user.id
          userEmail = session.user.email ?? email
          setSession(session)
          await fetchProfile(session.user.id, userEmail)
        }
      }
    }

    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: userId, full_name: fullName, email: userEmail }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }
  }

  async function signIn(email: string, password: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.warn('Could not fetch session after sign in:', sessionError.message)
    }

    if (session?.user) {
      setSession(session)
      await fetchProfile(session.user.id, session.user.email!)
    }
  }

  async function signOut() {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
