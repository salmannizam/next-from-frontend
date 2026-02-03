'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Form = {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
};

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Form[]>('/api/forms')
      .then(setForms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-zinc-400">Loading forms…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Forms</h1>
        <Link
          href="/dashboard/forms/new"
          className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 transition"
        >
          New form
        </Link>
      </div>
      {forms.length === 0 ? (
        <div className="rounded-xl bg-zinc-800/50 border border-zinc-700 p-8 text-center text-zinc-400">
          No forms yet. Create one to start collecting leads.
          <Link href="/dashboard/forms/new" className="block mt-2 text-green-500 hover:underline">
            Create form
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {forms.map((form) => (
            <li key={form._id}>
              <Link
                href={`/dashboard/forms/${form._id}`}
                className="block rounded-xl bg-zinc-800 border border-zinc-700 p-4 hover:border-zinc-600 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-zinc-100">{form.name}</span>
                    {form.description && (
                      <p className="text-sm text-zinc-400 mt-0.5">{form.description}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      form.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-zinc-700 text-zinc-400'
                    }`}
                  >
                    {form.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
