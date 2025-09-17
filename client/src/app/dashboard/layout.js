// src/app/dashboard/layout.tsx
'use client';

import Navbar from '@/components/layout/navbar';

export default function DashboardLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}