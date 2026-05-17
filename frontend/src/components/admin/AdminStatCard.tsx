import { adminCardClass, adminIconWrapClass } from './admin-ui';

type AdminStatCardProps = {
  label: string;
  value: number | string;
  iconClass: string;
  hint?: string;
};

export function AdminStatCard({
  label,
  value,
  iconClass,
  hint,
}: AdminStatCardProps) {
  return (
    <div
      className={`${adminCardClass} flex flex-col gap-4 p-6 transition hover:border-zinc-300 dark:hover:border-zinc-600`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
        </div>
        <div className={adminIconWrapClass}>
          <i className={`${iconClass} text-lg`} aria-hidden />
        </div>
      </div>
      {hint ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}
