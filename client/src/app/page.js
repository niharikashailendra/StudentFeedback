// src/app/page.js - Enhanced version
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { isUserBlocked } from '@/lib/auth-utils';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is blocked (from localStorage)
      if (isUserBlocked()) {
        router.push('/blocked');
        return;
      }

      if (user) {
        router.push(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}