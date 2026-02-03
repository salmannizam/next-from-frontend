'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAccessToken, setAccessToken, api } from '@/lib/api';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      setReady(true);
      return;
    }
    api<{ accessToken: string }>('/api/auth/refresh', { method: 'POST', skipRefresh: true })
      .then((data) => {
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          setReady(true);
        } else {
          router.replace('/login');
        }
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  async function handleLogout() {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
      router.replace('/login');
      router.refresh();
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <nav className="flex gap-6">
          <Link
            href="/dashboard"
            className={pathname === '/dashboard' ? 'text-green-500 font-medium' : 'text-zinc-400 hover:text-zinc-100'}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/forms"
            className={pathname.startsWith('/dashboard/forms') ? 'text-green-500 font-medium' : 'text-zinc-400 hover:text-zinc-100'}
          >
            Forms
          </Link>
          <Link
            href="/dashboard/leads"
            className={pathname.startsWith('/dashboard/leads') ? 'text-green-500 font-medium' : 'text-zinc-400 hover:text-zinc-100'}
          >
            Leads
          </Link>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          Log out
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
