'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type Form = { _id: string; name: string };
type Lead = {
  _id: string;
  formId: Form;
  data: Record<string, unknown>;
  status: string;
  createdAt: string;
};

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get('formId') ?? '';
  const statusParam = searchParams.get('status') ?? '';
  const [leads, setLeads] = useState<Lead[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [formId, setFormId] = useState(formIdParam);
  const [status, setStatus] = useState(statusParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Form[]>('/api/forms').then(setForms).catch(() => setForms([]));
  }, []);

  useEffect(() => {
    const q = new URLSearchParams();
    if (formId) q.set('formId', formId);
    if (status) q.set('status', status);
    api<Lead[]>(`/api/leads?${q.toString()}`)
      .then(setLeads)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [formId, status]);

  useEffect(() => {
    setFormId(formIdParam);
    setStatus(statusParam);
  }, [formIdParam, statusParam]);

  if (loading && leads.length === 0) return <p className="text-zinc-400">Loading leads…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-100 mb-4">Leads</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Form</label>
          <select
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-600 text-zinc-100"
          >
            <option value="">All forms</option>
            {forms.map((f) => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-600 text-zinc-100"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      {leads.length === 0 ? (
        <div className="rounded-xl bg-zinc-800/50 border border-zinc-700 p-8 text-center text-zinc-400">
          No leads yet. Submissions from your forms will appear here.
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-800 border-b border-zinc-700">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-zinc-400">Form</th>
                <th className="px-4 py-3 text-sm font-medium text-zinc-400">Data</th>
                <th className="px-4 py-3 text-sm font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-zinc-400">Date</th>
                <th className="px-4 py-3 text-sm font-medium text-zinc-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-zinc-800/50">
                  <td className="px-4 py-3 text-zinc-300">
                    {typeof lead.formId === 'object' && lead.formId?.name ? lead.formId.name : String(lead.formId)}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-sm max-w-xs truncate">
                    {JSON.stringify(lead.data)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${lead.status === 'new' ? 'bg-blue-900/50 text-blue-400' : lead.status === 'contacted' ? 'bg-amber-900/50 text-amber-400' : 'bg-zinc-700 text-zinc-400'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-sm">
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/leads/${lead._id}`} className="text-green-500 hover:underline text-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
