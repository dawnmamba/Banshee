export function AuthTopographicPattern() {
  return (
    <svg
      className="auth-topographic-pattern absolute inset-0 h-full w-full text-cyan-500/20"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="0.75" opacity="0.6">
        <path d="M0 120 Q200 80 400 120 T800 120" />
        <path d="M0 180 Q220 140 440 180 T800 180" />
        <path d="M0 240 Q180 200 380 240 T800 240" />
        <path d="M0 300 Q240 260 480 300 T800 300" />
        <path d="M0 360 Q200 320 400 360 T800 360" />
        <path d="M0 420 Q220 380 440 420 T800 420" />
        <path d="M0 480 Q180 440 380 480 T800 480" />
      </g>
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.35">
        <path d="M0 150 Q150 110 350 150 T750 150" />
        <path d="M0 270 Q250 230 500 270 T800 270" />
        <path d="M0 390 Q180 350 360 390 T720 390" />
      </g>
    </svg>
  );
}
