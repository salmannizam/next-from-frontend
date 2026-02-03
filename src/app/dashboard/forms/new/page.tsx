'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const FIELD_TYPES = ['text', 'email', 'number', 'textarea', 'select', 'checkbox'] as const;

type Field = {
  label: string;
  type: (typeof FIELD_TYPES)[number];
  required: boolean;
  order: number;
  options: string[];
};

export default function NewFormPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([
    { label: 'Name', type: 'text', required: true, order: 0, options: [] },
    { label: 'Email', type: 'email', required: true, order: 1, options: [] },
  ]);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [formId, setFormId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function addField() {
    setFields((f) => [
      ...f,
      { label: '', type: 'text', required: false, order: f.length, options: [] },
    ]);
  }

  function updateField(index: number, patch: Partial<Field>) {
    setFields((f) => f.map((x, i) => (i === index ? { ...x, ...patch } : x)));
  }

  function removeField(index: number) {
    setFields((f) => f.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api<{ form: { _id: string }; publicKey: string }>('/api/forms', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          status: 'active',
          fields: fields.map((f) => ({
            label: f.label || 'Field',
            type: f.type,
            required: f.required,
            order: f.order,
            options: f.options,
          })),
        }),
      });
      setFormId(res.form._id);
      setPublicKey(res.publicKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form');
    } finally {
      setLoading(false);
    }
  }

  if (formId && publicKey) {
    const submitUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/public/forms/${formId}/submit`;
    const embedSnippet = `<!-- Form Lead embed -->
<form id="form-lead-${formId}" data-form-id="${formId}" data-public-key="${publicKey}">
  <input name="Name" type="text" required placeholder="Name" />
  <input name="Email" type="email" required placeholder="Email" />
  <button type="submit">Submit</button>
</form>
<script>
(function() {
  var form = document.getElementById('form-lead-${formId}');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var fd = new FormData(form);
    var data = {};
    fd.forEach(function(v, k) { data[k] = v; });
    fetch('${submitUrl}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicKey: form.dataset.publicKey, data: data })
    }).then(function(r) { return r.json(); })
      .then(function(d) { alert(d.success ? 'Submitted!' : d.message || 'Error'); })
      .catch(function() { alert('Error'); });
  });
})();
</script>`;
    return (
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100 mb-4">Form created</h1>
        <p className="text-zinc-400 mb-2">Save your <strong>Public Key</strong> — it won’t be shown again:</p>
        <pre className="rounded-lg bg-zinc-900 border border-zinc-700 p-4 text-sm text-green-400 break-all mb-4">
          {publicKey}
        </pre>
        <p className="text-zinc-400 mb-2">Submit URL (POST):</p>
        <pre className="rounded-lg bg-zinc-900 border border-zinc-700 p-4 text-sm text-zinc-300 break-all mb-6">
          {submitUrl}
        </pre>
        <p className="text-zinc-400 mb-2">Sample HTML embed (adjust field names to match your form):</p>
        <pre className="rounded-lg bg-zinc-900 border border-zinc-700 p-4 text-xs text-zinc-400 overflow-x-auto whitespace-pre-wrap">
          {embedSnippet}
        </pre>
        <Link href="/dashboard/forms" className="text-green-500 hover:underline">
          Back to forms
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-100 mb-4">New form</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Form name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-600 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Contact form"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-600 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Main website form"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-zinc-400">Fields</label>
            <button type="button" onClick={addField} className="text-sm text-green-500 hover:underline">
              + Add field
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((f, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg bg-zinc-800/50 border border-zinc-700 p-3">
                <input
                  type="text"
                  value={f.label}
                  onChange={(e) => updateField(i, { label: e.target.value })}
                  placeholder="Label"
                  className="flex-1 min-w-[100px] px-2 py-1.5 rounded bg-zinc-900 border border-zinc-600 text-zinc-100 text-sm"
                />
                <select
                  value={f.type}
                  onChange={(e) => updateField(i, { type: e.target.value as Field['type'] })}
                  className="px-2 py-1.5 rounded bg-zinc-900 border border-zinc-600 text-zinc-100 text-sm"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={f.required}
                    onChange={(e) => updateField(i, { required: e.target.checked })}
                    className="rounded"
                  />
                  Required
                </label>
                <button type="button" onClick={() => removeField(i)} className="text-red-400 text-sm hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 disabled:opacity-50 transition"
          >
            {loading ? 'Creating…' : 'Create form'}
          </button>
          <Link href="/dashboard/forms" className="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
