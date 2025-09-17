
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';



export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

// src/components/auth/protected-route.js - Add blocked user check
useEffect(() => {
  if (!loading) {
    if (!user) {
      router.push('/login');
    } else if (user.blocked) {
      // Store blocked info and redirect
      localStorage.setItem('blocked_user', JSON.stringify({
        email: user.email,
        message: 'Your account has been blocked. Please contact administrator.'
      }));
      router.push('/blocked');
    } else if (requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }
}, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}