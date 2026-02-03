'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type Form = {
  _id: string;
  name: string;
  description: string;
  status: string;
  fields: { label: string; type: string; required: boolean; order: number }[];
};

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Form>(`/api/forms/${id}`)
      .then(setForm)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-zinc-400">Loading…</p>;
  if (error || !form) {
    return (
      <div>
        <p className="text-red-400">{error || 'Form not found'}</p>
        <Link href="/dashboard/forms" className="text-green-500 hover:underline mt-2 inline-block">
          Back to forms
        </Link>
      </div>
    );
  }

  const submitUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/public/forms/${form._id}/submit`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">{form.name}</h1>
          {form.description && <p className="text-zinc-400 mt-1">{form.description}</p>}
        </div>
        <span
          className={`text-xs px-2 py-1 rounded ${
            form.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-zinc-700 text-zinc-400'
          }`}
        >
          {form.status}
        </span>
      </div>
      <p className="text-sm text-zinc-400 mb-2">Form ID: <code className="bg-zinc-800 px-1 rounded">{form._id}</code></p>
      <p className="text-sm text-zinc-400 mb-4">Submit URL: <code className="bg-zinc-800 px-1 rounded break-all">{submitUrl}</code></p>
      <p className="text-zinc-400 mb-2">Fields:</p>
      <ul className="list-disc list-inside text-zinc-400 mb-6">
        {form.fields.map((f, i) => (
          <li key={i}>
            {f.label} ({f.type}) {f.required && '*'}
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <Link
          href={`/dashboard/leads?formId=${form._id}`}
          className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 transition"
        >
          View leads
        </Link>
        <Link href="/dashboard/forms" className="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition">
          Back to forms
        </Link>
      </div>
    </div>
  );
}
