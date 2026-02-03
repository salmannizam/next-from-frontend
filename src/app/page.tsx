import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-semibold text-zinc-100 mb-2">Form Lead</h1>
      <p className="text-zinc-400 mb-8">Collect and manage leads from your forms</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-lg bg-zinc-700 text-zinc-100 hover:bg-zinc-600 transition"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-500 transition"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
