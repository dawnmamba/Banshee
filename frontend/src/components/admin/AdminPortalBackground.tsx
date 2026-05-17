import { AuthTopographicPattern } from '@/components/user-auth/AuthTopographicPattern';

export function AdminPortalBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#030712]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a14] via-[#030712] to-[#020617]" />
      <div className="absolute inset-0 opacity-40">
        <AuthTopographicPattern />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.06),transparent_45%)]" />
    </div>
  );
}
