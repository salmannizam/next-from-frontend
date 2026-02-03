import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-100 mb-4">Dashboard</h1>
      <p className="text-zinc-400 mb-6">
        Create forms, share the embed code, and manage leads in one place.
      </p>
      <div className="flex gap-4">
        <Link
          href="/dashboard/forms"
          className="rounded-xl bg-zinc-800 border border-zinc-700 p-6 hover:border-zinc-600 transition max-w-xs"
        >
          <h2 className="font-medium text-zinc-100 mb-2">Forms</h2>
          <p className="text-sm text-zinc-400">Create and manage your forms</p>
        </Link>
        <Link
          href="/dashboard/leads"
          className="rounded-xl bg-zinc-800 border border-zinc-700 p-6 hover:border-zinc-600 transition max-w-xs"
        >
          <h2 className="font-medium text-zinc-100 mb-2">Leads</h2>
          <p className="text-sm text-zinc-400">View and manage submissions</p>
        </Link>
      </div>
    </div>
  );
}
