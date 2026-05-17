import { AuthTopographicPattern } from './AuthTopographicPattern';

export function AuthLiveWallpaper() {
  return (
    <div
      className="auth-live-wallpaper pointer-events-none absolute inset-0 overflow-hidden bg-[#030712]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#050a14] to-[#020617]" />
      <div className="absolute inset-0 lg:w-[58%]">
        <AuthTopographicPattern />
        <div
          className="auth-live-wallpaper__orb absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-cyan-600/15 blur-3xl"
          style={{ animation: 'auth-wallpaper-pulse 12s ease-in-out infinite' }}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(34,211,238,0.05),transparent_50%)]" />
    </div>
  );
}
