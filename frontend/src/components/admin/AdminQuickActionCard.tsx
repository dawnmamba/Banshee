import Link from 'next/link';
import { adminCardClass, adminCardGlowClass, adminIconWrapClass } from './admin-ui';

type AdminQuickActionCardProps = {
  href: string;
  title: string;
  description: string;
  iconClass: string;
  cta: string;
};

export function AdminQuickActionCard({
  href,
  title,
  description,
  iconClass,
  cta,
}: AdminQuickActionCardProps) {
  return (
    <Link
      href={href}
      className={`${adminCardClass} ${adminCardGlowClass} group relative flex flex-col gap-4 p-6 transition hover:border-cyan-500/25`}
    >
      <div className="flex items-start gap-4">
        <div className={adminIconWrapClass}>
          <i className={`${iconClass} text-lg`} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-cyan-300 group-hover:text-cyan-200">
        {cta} →
      </span>
    </Link>
  );
}
