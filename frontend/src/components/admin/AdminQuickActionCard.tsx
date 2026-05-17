import Link from 'next/link';
import { adminCardClass, adminIconWrapClass } from './admin-ui';

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
      className={`${adminCardClass} group flex flex-col gap-4 p-6 transition hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-600`}
    >
      <div className="flex items-start gap-4">
        <div className={adminIconWrapClass}>
          <i className={`${iconClass} text-lg`} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>
      <span className="text-sm font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
        {cta} →
      </span>
    </Link>
  );
}
