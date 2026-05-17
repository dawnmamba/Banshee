/** Shared dark portal theme for auth + admin surfaces */

export const portalPageClass =
  'relative min-h-0 flex-1 overflow-hidden bg-[#030712] px-4 py-8 sm:px-8';

export const portalContainerClass = 'relative z-10 mx-auto w-full max-w-6xl space-y-6';

export const portalCardClass =
  'rounded-2xl border border-white/[0.06] bg-[#0a1018]/90 shadow-2xl shadow-black/50 backdrop-blur-xl';

export const portalCardGlowClass =
  'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-400/40 before:to-transparent';

export const portalHeroClass = `${portalCardClass} ${portalCardGlowClass} relative overflow-hidden p-8 sm:p-10`;

export const portalGlassCardOuterClass = 'relative w-full max-w-[440px]';

export const portalGlassCardGlowClass =
  'pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-500/30 via-cyan-500/5 to-transparent opacity-90';

export const portalGlassCardClass = `${portalCardClass} rounded-3xl p-8 sm:p-10`;

export const portalBadgeClass =
  'inline-block rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300';

export const portalTitleClass = 'text-3xl font-bold tracking-tight text-white';

export const portalSubtitleClass = 'mt-2 text-sm leading-relaxed text-slate-400';

export const portalSectionLabelClass =
  'text-xs font-semibold uppercase tracking-[0.2em] text-slate-500';

export const portalFeatureCardClass =
  'rounded-xl border border-white/[0.06] bg-black/30 px-5 py-4 backdrop-blur-sm';

export const portalIconBoxClass =
  'flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-[#0a1628] shadow-lg shadow-cyan-950/40';

export const portalIconClass = 'text-lg text-cyan-300';

export const portalStatIconClass = `${portalIconBoxClass} h-10 w-10`;

export const portalTableHeadClass =
  'border-b border-white/[0.06] bg-black/20 text-slate-400';

export const portalTableRowClass = 'border-t border-white/[0.04]';

export const portalHeaderClass =
  'relative flex min-h-16 items-center justify-end gap-6 border-b border-white/[0.06] bg-[#050a14]/90 px-8 py-4 backdrop-blur-xl';

export const portalNavLinkActiveClass =
  'text-sm font-semibold text-cyan-300';

export const portalNavLinkClass =
  'text-sm text-slate-400 transition hover:text-cyan-200';

export const portalFooterNoteClass =
  'text-center text-[11px] leading-relaxed text-slate-600';

export const portalButtonOutlineClass =
  'rounded-xl border border-cyan-500/25 bg-cyan-500/5 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 disabled:opacity-50';

export const portalFormLabelClass =
  'mb-1.5 block text-xs font-medium text-slate-400';

export const portalFormInputClass =
  'w-full rounded-xl border border-white/[0.08] bg-[#0c1219] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/30';
