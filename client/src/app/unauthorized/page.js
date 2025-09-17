
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
        
        <div className="space-y-3">
          {user && (
            <p className="text-gray-600">
              Logged in as: <strong>{user.email}</strong> ({user.role})
            </p>
          )}
          
          <div className="flex justify-center space-x-4">
            <Link
              href={user?.role === 'admin' ? '/admin' : '/dashboard'}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go to My Dashboard
            </Link>
            
            <button
              onClick={logout}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}