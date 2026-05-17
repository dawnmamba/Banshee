import { AuthLiveWallpaper } from './AuthLiveWallpaper';
import {
  portalBadgeClass,
  portalFeatureCardClass,
  portalFooterNoteClass,
  portalGlassCardClass,
  portalGlassCardGlowClass,
  portalGlassCardOuterClass,
  portalIconBoxClass,
  portalIconClass,
  portalSubtitleClass,
  portalTitleClass,
} from '@/lib/theme/portal-theme';

type AuthBrandShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  footerNote?: string;
  children: React.ReactNode;
};

function FeatureCard({ label, title }: { label: string; title: string }) {
  return (
    <div className={portalFeatureCardClass}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-200">{title}</p>
    </div>
  );
}

export function AuthBrandShell({
  badge,
  title,
  subtitle,
  footerNote = 'Authorized access only. All activities may be monitored and logged.',
  children,
}: AuthBrandShellProps) {
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <AuthLiveWallpaper />
      <div className="relative z-10 grid w-full flex-1 lg:grid-cols-[1.15fr_1fr]">
        <div className="hidden flex-col justify-between p-10 lg:flex xl:p-14">
          <div>
            <div className="flex items-center gap-3">
              <div className={portalIconBoxClass}>
                <i className={`pi pi-shield ${portalIconClass}`} aria-hidden />
              </div>
              <span className="text-sm font-bold tracking-[0.25em] text-slate-100">
                BANSHEE
              </span>
            </div>
            <h2 className="mt-10 max-w-lg text-4xl font-bold leading-[1.12] tracking-tight text-white xl:text-[2.75rem]">
              Modern banking for
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                clarity and control.
              </span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-500">
              Secure digital banking for everyday users and operators. Separate
              workspaces, role-based access, and a single trusted platform.
            </p>
          </div>
          <div>
            <div className="grid max-w-md grid-cols-2 gap-4">
              <FeatureCard label="Security" title="Protected workflows" />
              <FeatureCard label="Intelligence" title="Connected insights" />
            </div>
            <p className="mt-8 text-xs text-slate-600">
              © {new Date().getFullYear()} Banshee
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-10 xl:px-14">
          <div className={portalGlassCardOuterClass}>
            <div className={portalGlassCardGlowClass} />
            <div className={`relative ${portalGlassCardClass}`}>
              <div className="mb-6 lg:hidden">
                <div className="flex items-center gap-2">
                  <div className={`h-9 w-9 ${portalIconBoxClass}`}>
                    <i className={`pi pi-shield ${portalIconClass}`} aria-hidden />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-slate-100">
                    BANSHEE
                  </span>
                </div>
              </div>
              <span className={portalBadgeClass}>{badge}</span>
              <h1 className={`mt-5 ${portalTitleClass}`}>{title}</h1>
              <p className={portalSubtitleClass}>{subtitle}</p>
              <div className="mt-8">{children}</div>
              <p className={`mt-8 ${portalFooterNoteClass}`}>{footerNote}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


