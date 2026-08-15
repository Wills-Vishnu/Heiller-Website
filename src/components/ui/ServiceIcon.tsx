import {
  Activity,
  BadgeCheck,
  ClipboardList,
  FileCheck2,
  Landmark,
  Layers3,
  ScanLine,
  ShieldAlert,
  Timer,
} from 'lucide-react';
import type { ServiceIconKey } from '@/lib/site';

const ICONS: Record<ServiceIconKey, typeof Activity> = {
  coding: ScanLine,
  charge: ClipboardList,
  eligibility: BadgeCheck,
  submission: FileCheck2,
  denial: ShieldAlert,
  ar: Timer,
  posting: Landmark,
  credentialing: Layers3,
  analytics: Activity,
};

/**
 * Service glyph in a frosted well.
 *
 * The icon and its container animate on separate curves on hover — the well
 * scales and warms while the glyph itself lifts and rotates a degree or two.
 * Two elements moving on slightly different timings is what makes a hover feel
 * crafted rather than switched.
 */
export function ServiceIcon({ name }: { name: ServiceIconKey }) {
  const Icon = ICONS[name];

  return (
    <span
      data-service-icon
      aria-hidden="true"
      className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cobalt-50 ring-1 ring-inset ring-cobalt/12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-cobalt group-hover:ring-cobalt/40 group-hover:shadow-[0_10px_28px_-10px_rgba(47,107,255,0.6)]"
    >
      <Icon
        className="h-[1.35rem] w-[1.35rem] text-cobalt transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-px group-hover:rotate-[-6deg] group-hover:text-frost"
        strokeWidth={1.6}
      />
    </span>
  );
}
