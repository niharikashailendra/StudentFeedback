
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlockedPage() {
  const [blockedInfo, setBlockedInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get blocked user info from localStorage
    const blockedUser = localStorage.getItem('blocked_user');
    if (blockedUser) {
      setBlockedInfo(JSON.parse(blockedUser));
    } else {
      // If no blocked info, redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // Clear everything and redirect to login
    localStorage.removeItem('blocked_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!blockedInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-8 rounded-lg">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-4">Account Blocked</h1>
          <p className="mb-4">{blockedInfo.message}</p>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Email:</strong> {blockedInfo.email}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Please contact the administrator for assistance
            <br />
      
          </p>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}