
'use client';

import Navbar from '@/components/layout/navbar';

export default function AdminLayout({
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