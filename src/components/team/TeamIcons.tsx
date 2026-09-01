import { BarChart3, Briefcase, Eye, MessageSquare, Shield, TrendingUp, Users } from 'lucide-react';
import type { Principle, TeamStat } from '@/lib/team-content';

/**
 * Icon lookups keyed by the string tokens in team-content, so the content file
 * stays free of JSX and can be edited by anyone.
 */

const STAT_ICONS = {
  specialists: Users,
  experience: Briefcase,
  compliance: Shield,
  embedded: BarChart3,
} as const satisfies Record<TeamStat['icon'], typeof Users>;

export function StatIcon({ name }: { name: TeamStat['icon'] }) {
  const Icon = STAT_ICONS[name];
  return <Icon strokeWidth={1.6} aria-hidden="true" />;
}

/**
 * The ownership mark is a near-closed ring with an orange terminal — a claim
 * being carried the whole way round. Hand-rolled because no icon set has it.
 */
function OwnershipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19.5 8.4A8.5 8.5 0 1 1 16.6 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="18.3" cy="5.7" r="2.1" fill="#ff6b2c" />
    </svg>
  );
}

const PRINCIPLE_ICONS = {
  ownership: OwnershipIcon,
  communication: MessageSquare,
  proximity: Eye,
  outcomes: TrendingUp,
} as const satisfies Record<Principle['icon'], React.ComponentType<{ strokeWidth?: number }>>;

export function PrincipleIcon({ name }: { name: Principle['icon'] }) {
  const Icon = PRINCIPLE_ICONS[name];
  return <Icon strokeWidth={1.6} />;
}

/** Lucide dropped brand marks, so the LinkedIn glyph is inlined. */
export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 20.5h3.3V9.2H3.4v11.3ZM9.1 9.2h3.16v1.55h.05c.44-.83 1.51-1.71 3.11-1.71 3.33 0 3.94 2.19 3.94 5.03v6.43h-3.29v-5.7c0-1.36-.03-3.11-1.9-3.11-1.9 0-2.19 1.48-2.19 3.01v5.8H9.1V9.2Z" />
    </svg>
  );
}

/** Lucide has no brand marks, so the X glyph is inlined, matching LinkedInIcon. */
export function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.71 10.64 20.35 3h-1.57l-5.77 6.62L8.4 3H3l6.96 9.62L3 20.5h1.57l6.1-7 4.87 7h5.4l-7.23-9.86Zm-2.16 2.48-.71-.98L5.1 4.13h2.41l4.53 6.24.71.98 5.9 8.12h-2.41l-4.79-6.35Z" />
    </svg>
  );
}

/** Matches the arrow used on every CTA across the site. */
export function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
