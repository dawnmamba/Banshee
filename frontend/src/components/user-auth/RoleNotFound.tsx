export function RoleNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-center text-sm text-zinc-600 dark:text-zinc-400">
        This page is not available for your account.
      </p>
    </div>
  );
}
