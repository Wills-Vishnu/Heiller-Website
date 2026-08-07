/**
 * Single source of truth for every piece of company-specific content on the
 * site. Nothing else in the codebase should hard-code a phone number, service
 * name, statistic or URL.
 *
 * ⚠️  PLACEHOLDER CONTENT
 * Items marked `PLACEHOLDER` below are illustrative and MUST be replaced with
 * verified figures, real client names and real testimonials before this site is
 * published. Publishing unverified performance claims in healthcare marketing
 * carries real legal exposure.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://evadde.com';

export const company = {
  name: 'evadde',
  legalName: 'evadde',
  tagline: 'Clarity for every claim.',
  description:
    'evadde is a revenue cycle management partner for hospitals, clinics and physician groups. We unify coding, claims, denials and collections into one intelligent, auditable system.',
  founded: '2019',
} as const;

export const contact = {
  // NOTE: verify the country code and formatting before launch.
  phoneDisplay: '93631 108086',
  phoneHref: 'tel:93631108086',
  email: 'sushanth3306@gmail.com',
  emailHref: 'mailto:sushanth3306@gmail.com',
  address: {
    street: '1/454',
    locality: 'Namakkal',
    region: 'Tamil Nadu',
    country: 'IN',
    display: '1/454, Namakkal, Tamil Nadu, India',
  },
  hours: 'Mon–Fri · 09:00–19:00 IST',
} as const;

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', handle: '/company/evadde' },
  { label: 'Instagram', href: 'https://www.instagram.com/', handle: '@evadde' },
  { label: 'Discord', href: 'https://discord.com/', handle: 'evadde' },
] as const;

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Primary navigation.
 *
 * Two kinds of href live here. Entries beginning `#` are sections of the
 * landing page; entries beginning `/` are real routes. `resolveNavHref()`
 * below turns the former into an absolute link when the reader is not on the
 * landing page — a bare `#services` on `/security` would otherwise scroll to
 * nothing and silently do nothing at all.
 */
export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Security', href: '/security' },
  { label: 'Results', href: '#analytics' },
  { label: 'About Us', href: '/about' },
] as const;

/**
 * Makes a nav href usable from any route.
 *
 * On `/` a hash is left alone, so `SmoothScrollProvider`'s `a[href^="#"]`
 * interceptor still catches it and routes the jump through Lenis. Anywhere
 * else it becomes `/#section`, which is a normal navigation back to the
 * landing page at the right position — deliberately NOT intercepted, because
 * there is nothing on the current page to smooth-scroll to.
 */
export function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith('#')) return href;
  return pathname === '/' ? href : `/${href}`;
}

/**
 * Hero headline, as three separately-revealed lines.
 *
 * Held here rather than inline in `Hero.tsx` because the third line is
 * colour-accented and the line breaks are deliberate (not the result of
 * wrapping), so they are content decisions rather than layout ones.
 */
export const heroHeadline = {
  lines: ['Recover More Revenue.', 'Reduce Denials.'],
  accentLine: 'Grow Faster.',
  lede: 'evadde unifies coding, claims, denials and collections into one intelligent system — so your team stops chasing payments and starts predicting them.',
  badge: 'RCM that delivers',
} as const;

/**
 * Video-hero content.
 *
 * ⚠️  COPY MISMATCH — READ BEFORE LAUNCH
 * This copy came from a supplied spec and is generic web3/infrastructure
 * language: "decentralized web", "new digital epoch", "builders and
 * communities". evadde is a healthcare revenue cycle management company
 * selling to hospital administrators and CFOs. None of this describes the
 * business, and the structured data, page metadata and every other section of
 * the site say something completely different.
 *
 * The layout is built exactly to spec; the words need replacing.
 */
export const videoHero = {
  // PLACEHOLDER — see warning above.
  headline: ['Foundation of the', 'new digital epoch'],
  subheadline:
    'Designing products, powering ecosystems and laying the foundation of a decentralized web for enterprises, builders and communities alike.',
  cta: { label: 'Contact Us', href: '#contact' },
  nav: [
    { label: 'Products', href: '#services' },
    { label: 'Docs', href: '#workflow' },
  ],
  navCta: { label: 'Get in touch', href: '#contact' },
  /** Supplied asset. Decorative only — carries no information. */
  videoSrc:
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4',
} as const;

export const cta = {
  primary: { label: 'Get a free revenue audit', href: '#contact' },
  secondary: { label: 'See how it works', href: '#workflow' },
} as const;

/* -------------------------------------------------------------------------- */
/* Chapter 1 — The problem                                                     */
/* -------------------------------------------------------------------------- */

export const problemStats = [
  {
    // PLACEHOLDER — replace with a cited industry figure.
    value: 12,
    suffix: '%',
    label: 'of claims are denied on first pass',
    note: 'Industry average across commercial payers',
  },
  {
    value: 65,
    suffix: '%',
    label: 'of denials are never reworked',
    note: 'Because the appeal costs more than the claim',
  },
  {
    value: 118,
    prefix: '$',
    suffix: 'B',
    label: 'lost annually to administrative waste',
    note: 'US healthcare, billing and insurance-related costs',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Chapter 2 — Complexity                                                      */
/* -------------------------------------------------------------------------- */

export const complexityFacets = [
  {
    title: 'Payer rules that move',
    body: 'Every payer publishes its own edits, modifiers and medical-necessity policies — and revises them quarterly. Your billers are chasing a moving target.',
  },
  {
    title: 'Documentation drift',
    body: 'A note written for the clinician and a note written for the payer are not the same artefact. The gap between them is where revenue quietly disappears.',
  },
  {
    title: 'Eligibility that expires',
    body: 'Coverage verified on Monday is not coverage on Thursday. Front-desk errors surface 45 days later as a denial nobody owns.',
  },
  {
    title: 'Handoffs without memory',
    body: 'Registration, coding, billing and collections each hold one fragment of the truth. No single system remembers the whole claim.',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Chapter 3 — Services                                                        */
/* -------------------------------------------------------------------------- */

export type ServiceIconKey =
  | 'coding'
  | 'charge'
  | 'eligibility'
  | 'submission'
  | 'denial'
  | 'ar'
  | 'posting'
  | 'credentialing'
  | 'analytics';

export interface Service {
  id: string;
  index: string;
  title: string;
  summary: string;
  icon: ServiceIconKey;
  metric: string;
}

export const services: Service[] = [
  {
    id: 'medical-coding',
    index: '01',
    title: 'Medical Coding',
    summary:
      'AAPC- and AHIMA-credentialed coders working your specialty, with a second-pass audit on every high-value encounter.',
    icon: 'coding',
    metric: 'ICD-10 · CPT · HCPCS',
  },
  {
    id: 'charge-entry',
    index: '02',
    title: 'Charge Entry',
    summary:
      'Same-day capture with automated charge reconciliation against the schedule, so nothing rendered goes unbilled.',
    icon: 'charge',
    metric: '24h turnaround',
  },
  {
    id: 'eligibility-verification',
    index: '03',
    title: 'Eligibility Verification',
    summary:
      'Real-time benefit checks and prior-authorisation tracking before the patient is roomed, not after the claim is denied.',
    icon: 'eligibility',
    metric: 'Pre-visit, every visit',
  },
  {
    id: 'claim-submission',
    index: '04',
    title: 'Claim Submission',
    summary:
      'Payer-specific scrubbing against a live edit library, with electronic submission and acknowledgement reconciliation.',
    icon: 'submission',
    metric: 'Clean-claim first pass',
  },
  {
    id: 'denial-management',
    index: '05',
    title: 'Denial Management',
    summary:
      'Root-cause coding of every denial, appeals filed inside payer windows, and a feedback loop back into the front end.',
    icon: 'denial',
    metric: 'Appeal + prevent',
  },
  {
    id: 'ar-follow-up',
    index: '06',
    title: 'A/R Follow-Up',
    summary:
      'Aged receivables worked by dollar-weighted priority rather than by date, so the recoverable balance moves first.',
    icon: 'ar',
    metric: 'Value-ranked queues',
  },
  {
    id: 'payment-posting',
    index: '07',
    title: 'Payment Posting',
    summary:
      'ERA and manual posting with contractual-allowance validation — underpayments are flagged, not absorbed.',
    icon: 'posting',
    metric: 'ERA + EOB reconciled',
  },
  {
    id: 'credentialing',
    index: '08',
    title: 'Credentialing',
    summary:
      'Enrolment, re-validation and CAQH upkeep managed on a calendar, so a lapsed credential never freezes a provider.',
    icon: 'credentialing',
    metric: 'Zero-lapse tracking',
  },
  {
    id: 'revenue-analytics',
    index: '09',
    title: 'Revenue Analytics',
    summary:
      'A live view of yield by payer, provider and CPT — with the variance explained, not just plotted.',
    icon: 'analytics',
    metric: 'Daily refresh',
  },
];

/* -------------------------------------------------------------------------- */
/* Chapter 4 — Workflow                                                        */
/* -------------------------------------------------------------------------- */

export interface WorkflowStep {
  id: string;
  step: string;
  title: string;
  body: string;
  duration: string;
}

export const workflowSteps: WorkflowStep[] = [
  {
    id: 'patient',
    step: '01',
    title: 'Patient',
    body: 'Demographics and coverage captured once, validated at the source, and carried forward without re-keying.',
    duration: 'Day 0',
  },
  {
    id: 'verification',
    step: '02',
    title: 'Verification',
    body: 'Benefits, deductibles and authorisation requirements confirmed against the payer before the encounter.',
    duration: 'Day 0',
  },
  {
    id: 'coding',
    step: '03',
    title: 'Coding',
    body: 'Documentation abstracted to ICD-10, CPT and HCPCS, with specificity and modifier logic reviewed by a second coder.',
    duration: 'Day 1',
  },
  {
    id: 'submission',
    step: '04',
    title: 'Claim Submission',
    body: 'Scrubbed against payer-specific edits, submitted electronically, and reconciled against the 277 acknowledgement.',
    duration: 'Day 1–2',
  },
  {
    id: 'adjudication',
    step: '05',
    title: 'Insurance Processing',
    body: 'Claim status polled through adjudication. Silence is treated as a signal, not as progress.',
    duration: 'Day 3–21',
  },
  {
    id: 'posting',
    step: '06',
    title: 'Payment Posting',
    body: 'Remittances posted line-by-line, with every allowance checked against the contracted rate.',
    duration: 'Day 21–30',
  },
  {
    id: 'reporting',
    step: '07',
    title: 'Reporting',
    body: 'Yield, denial reason and A/R ageing surfaced by payer, provider and procedure — refreshed daily.',
    duration: 'Continuous',
  },
  {
    id: 'optimisation',
    step: '08',
    title: 'Optimisation',
    body: 'Every denial reason routed back to the step that caused it. The cycle gets measurably tighter each quarter.',
    duration: 'Continuous',
  },
];

/* -------------------------------------------------------------------------- */
/* Chapter 5 — Security                                                        */
/* -------------------------------------------------------------------------- */

export const securityPillars = [
  {
    id: 'encryption',
    title: 'Encryption',
    body: 'AES-256 at rest, TLS 1.3 in transit. Keys rotated on a fixed schedule and never co-located with the data they protect.',
    glyph: 'lock',
  },
  {
    id: 'compliance',
    title: 'HIPAA Compliance',
    body: 'Executed BAAs, an annually reviewed Security Risk Analysis, and a documented breach-notification runbook.',
    glyph: 'shield',
  },
  {
    id: 'audit',
    title: 'Audit Trails',
    body: 'Every read and write against PHI is written to an append-only ledger with actor, purpose and timestamp.',
    glyph: 'trail',
  },
  {
    id: 'cloud',
    title: 'Secure Cloud',
    body: 'Isolated tenancy, private networking, and infrastructure defined in code so drift is impossible to introduce quietly.',
    glyph: 'cloud',
  },
  {
    id: 'access',
    title: 'Access Control',
    body: 'Role-based, least-privilege access with mandatory MFA and quarterly entitlement reviews.',
    glyph: 'key',
  },
  {
    id: 'continuity',
    title: 'Continuity',
    body: 'Point-in-time recovery, geographically separated replicas, and restore drills that are actually run.',
    glyph: 'orbit',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Chapter 6 — Analytics                                                       */
/* -------------------------------------------------------------------------- */

/** PLACEHOLDER — replace with audited client outcomes before publishing. */
export const analyticsMetrics = [
  {
    id: 'clean-claim',
    label: 'Clean claim rate',
    value: 98.4,
    suffix: '%',
    decimals: 1,
    delta: '+6.2 pts',
    direction: 'up' as const,
    caption: 'First-pass acceptance across managed payers',
  },
  {
    id: 'denial',
    label: 'Denial rate',
    value: 3.1,
    suffix: '%',
    decimals: 1,
    delta: '−41%',
    direction: 'down' as const,
    caption: 'Reduction within two quarters of onboarding',
  },
  {
    id: 'ar-days',
    label: 'Days in A/R',
    value: 21,
    suffix: '',
    decimals: 0,
    delta: '−17 days',
    direction: 'down' as const,
    caption: 'Median across the active book of business',
  },
  {
    id: 'collection',
    label: 'Net collection rate',
    value: 97.2,
    suffix: '%',
    decimals: 1,
    delta: '+9.4 pts',
    direction: 'up' as const,
    caption: 'Collected against contractually allowed amount',
  },
] as const;

/** Normalised 0–1 series driving the revenue/denial chart. 12 monthly points. */
export const revenueSeries = [
  0.34, 0.38, 0.36, 0.44, 0.49, 0.53, 0.58, 0.62, 0.69, 0.74, 0.82, 0.91,
];
export const denialSeries = [
  0.72, 0.68, 0.7, 0.61, 0.55, 0.5, 0.44, 0.4, 0.33, 0.29, 0.24, 0.19,
];

/* -------------------------------------------------------------------------- */
/* Chapter 7 — Trust                                                           */
/* -------------------------------------------------------------------------- */

/** PLACEHOLDER — fictional names. Swap for real, permissioned client logos. */
export const clientNames = [
  'Northline Health',
  'Cedarpoint Medical',
  'Vantage Care Group',
  'Arbor Physicians',
  'Meridian Clinics',
  'Halcyon Health',
] as const;

/** PLACEHOLDER — fictional. Never publish a testimonial you cannot attribute. */
export const testimonials = [
  {
    id: 't1',
    quote:
      'We had three people doing nothing but reworking denials. Six months in, that queue is a report nobody has to open — and our A/R is the shortest it has been in a decade.',
    name: 'Dr. Anita Raghavan',
    role: 'Managing Partner',
    org: 'Meridian Clinics',
  },
  {
    id: 't2',
    quote:
      'What changed was not the collections work. It was that every denial finally had a cause attached to it, and the cause got fixed upstream.',
    name: 'Marcus Bell',
    role: 'VP, Revenue Operations',
    org: 'Northline Health',
  },
  {
    id: 't3',
    quote:
      'Our credentialing used to be a spreadsheet and a prayer. Now a lapse is impossible to reach — it gets flagged ninety days out.',
    name: 'Priya Desai',
    role: 'Practice Administrator',
    org: 'Arbor Physicians',
  },
] as const;

export const complianceBadges = [
  { label: 'HIPAA', detail: 'Compliant' },
  { label: 'SOC 2', detail: 'Type II' },
  { label: 'HITRUST', detail: 'Aligned' },
  { label: 'ISO 27001', detail: 'Aligned' },
] as const;

/**
 * The four signals in the bar beneath the hero.
 *
 * `icon` keys map to a lookup in `Hero.tsx`; keeping them as strings rather
 * than imported components means this file stays free of JSX imports and can
 * be read by anything (including the OG image route, which runs in a
 * different runtime).
 */
export const heroTrustSignals = [
  { label: 'HIPAA Compliant', icon: 'shield' },
  { label: 'SOC 2 Type II', icon: 'badge' },
  { label: '24h Claim Turnaround', icon: 'clock' },
  { label: 'US + IN Delivery', icon: 'globe' },
] as const;

export type HeroSignalIcon = (typeof heroTrustSignals)[number]['icon'];

/* -------------------------------------------------------------------------- */
/* Story chapters — shared between the 3D rig and the DOM sections             */
/* -------------------------------------------------------------------------- */

/**
 * The scroll narrative is nine chapters long. `CHAPTER_COUNT - 1` is the
 * maximum index, and normalised scroll progress (0–1) is multiplied by it to
 * produce a fractional chapter position that every scroll-driven system —
 * camera, lattice morph, lighting, ambient colour field — reads from.
 *
 * Keep this array in sync with the section order in `src/app/page.tsx`.
 */
export const CHAPTERS = [
  'hero',
  'problem',
  'complexity',
  'services',
  'workflow',
  'security',
  'analytics',
  'trust',
  'contact',
] as const;

export type Chapter = (typeof CHAPTERS)[number];
export const CHAPTER_COUNT = CHAPTERS.length;
