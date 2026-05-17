'use client';

export function AdminDashboard() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-black/[.08] bg-white p-10 text-center shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Admin dashboard
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Operator area — user banking routes are not available from this
          account.
        </p>
      </div>
    </div>
  );
}
