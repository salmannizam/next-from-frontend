'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type Lead = {
  _id: string;
  formId: { _id: string; name: string };
  data: Record<string, unknown>;
  status: string;
  sourceIp: string | null;
  userAgent: string | null;
  createdAt: string;
};
type Comment = { _id: string; content: string; createdAt: string };

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api<Lead>(`/api/leads/${id}`)
      .then((l) => {
        setLead(l);
        setStatus(l.status);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    api<Comment[]>(`/api/leads/${id}/comments`)
      .then(setComments)
      .catch(() => setComments([]));
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleStatusChange() {
    if (!lead || status === lead.status) return;
    setSubmitting(true);
    try {
      await api(`/api/leads/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setLead((l) => (l ? { ...l, status } : null));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await api(`/api/leads/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment.trim() }),
      });
      setNewComment('');
      load();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && !lead) return <p className="text-zinc-400">Loading…</p>;
  if (error || !lead) {
    return (
      <div>
        <p className="text-red-400">{error || 'Lead not found'}</p>
        <Link href="/dashboard/leads" className="text-green-500 hover:underline mt-2 inline-block">
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Lead</h1>
        <Link href="/dashboard/leads" className="text-green-500 hover:underline">
          Back to leads
        </Link>
      </div>
      <div className="rounded-xl bg-zinc-800/50 border border-zinc-700 p-6 mb-6">
        <p className="text-sm text-zinc-400 mb-2">
          Form: {typeof lead.formId === 'object' && lead.formId?.name ? lead.formId.name : String(lead.formId)}
        </p>
        <p className="text-sm text-zinc-400 mb-4">
          Received: {new Date(lead.createdAt).toLocaleString()}
          {lead.sourceIp && ` · IP: ${lead.sourceIp}`}
        </p>
        <div className="grid gap-2 mb-4">
          {Object.entries(lead.data).map(([key, value]) => (
            <div key={key} className="flex gap-2 text-sm">
              <span className="text-zinc-400 w-32 shrink-0">{key}:</span>
              <span className="text-zinc-200">{String(value)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-400">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onBlur={handleStatusChange}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-600 text-zinc-100 text-sm"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
          {status !== lead.status && (
            <button
              type="button"
              onClick={handleStatusChange}
              disabled={submitting}
              className="text-sm text-green-500 hover:underline disabled:opacity-50"
            >
              Save
            </button>
          )}
        </div>
      </div>
      <div className="rounded-xl bg-zinc-800/50 border border-zinc-700 p-6">
        <h2 className="font-medium text-zinc-100 mb-4">Comments</h2>
        <ul className="space-y-3 mb-6">
          {comments.map((c) => (
            <li key={c._id} className="text-sm text-zinc-300 border-l-2 border-zinc-600 pl-3 py-1">
              {c.content}
              <span className="text-zinc-500 text-xs ml-2">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
          {comments.length === 0 && <li className="text-zinc-500 text-sm">No comments yet.</li>}
        </ul>
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 disabled:opacity-50 transition"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
