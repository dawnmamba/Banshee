import {
  adminCardClass,
  adminCardGlowClass,
  adminIconWrapClass,
} from './admin-ui';

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
      className={`${adminCardClass} ${adminCardGlowClass} relative flex flex-col gap-4 p-6 transition hover:border-cyan-500/20`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className={adminIconWrapClass}>
          <i className={`${iconClass} text-lg`} aria-hidden />
        </div>
      </div>
      {hint ? <p className="text-xs text-slate-600">{hint}</p> : null}
    </div>
  );
}


