'use client';

import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/context/auth-context';

export default function Index() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (session) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth');
    }
  }, [isLoading, session, router]);

  return null;
}

/* Original HomeScreen content for reference ... */
