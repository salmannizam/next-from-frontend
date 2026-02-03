'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token');
      return;
    }
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.message?.includes('verified') ? 'ok' : 'error');
        setMessage(data.message || '');
      })
      .catch(() => {
        setStatus('error');
        setMessage('Verification failed');
      });
  }, [token]);

  if (status === 'loading') {
    return <p className="text-zinc-400">Verifying your email…</p>;
  }
  if (status === 'ok') {
    return (
      <div className="text-center">
        <p className="text-green-400 mb-4">{message}</p>
        <Link href="/login" className="text-green-500 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }
  return (
    <div className="text-center">
      <p className="text-red-400 mb-4">{message}</p>
      <Link href="/register" className="text-green-500 hover:underline">
        Back to sign up
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl bg-zinc-800/50 border border-zinc-700 p-6">
        <h1 className="text-xl font-semibold text-zinc-100 mb-4">Verify email</h1>
        <Suspense fallback={<p className="text-zinc-400">Loading…</p>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
