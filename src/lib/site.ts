/**
 * Single source of truth for every piece of company-specific content on the
 * site. Nothing else in the codebase should hard-code a phone number, service
 * name, statistic or URL.
 *
 * ⚠️  WHAT'S REAL AND WHAT ISN'T, AS OF THIS PASS
 * heiller is a real, operating company (HEILLER RCM LLC, Phoenix AZ, founded
 * 2026) — this is no longer a fictional placeholder brand. Company identity,
 * contact details, team and founding facts below are real, as supplied by the
 * founders. Anything still marked `PLACEHOLDER` is either an industry-wide
 * benchmark figure (clearly not a claim about heiller's own results) or a
 * genuinely unknown fact — never a specific claim invented to sound
 * impressive. If you have real numbers to replace an industry benchmark with,
 * do it; do not "round up" an industry figure into a heiller claim without
 * something to back it.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://heiller.com';

export const company = {
  name: 'heiller',
  legalName: 'HEILLER RCM LLC',
  tagline: 'Clarity for every claim.',
  description:
    'heiller is a US-based, full-service revenue cycle management partner for hospitals, clinics and physician groups. A small, senior team handles your coding, claims, denials and collections directly — with software and AI speeding up the repetitive work, not replacing the judgment calls that actually recover revenue.',
  founded: '2026',
} as const;

/**
 * Phone: intentionally absent. heiller is email-only for now — a phone
 * number will be added once one exists, not invented to fill the field.
 */
export const contact = {
  email: 'connect@heillerrcm.com',
  emailHref: 'mailto:connect@heillerrcm.com',
  address: {
    // A suite + private mailbox number, not a floor/unit — reproduced exactly
    // as registered rather than reformatted, since this is what should match
    // any business-registry or BAA paperwork someone checks it against.
    street: '3101 N. Central Ave, Ste 183 #7497',
    locality: 'Phoenix',
    region: 'Arizona',
    postalCode: '85012',
    country: 'US',
    display: '3101 N. Central Ave, Ste 183 #7497, Phoenix, AZ 85012',
  },
  // Arizona does not observe daylight saving time, so this is MST year-round
  // — never MDT, unlike the rest of the US Mountain time zone in summer.
  hours: 'Mon–Fri · 08:00–17:00 MST',
} as const;

/**
 * Empty on purpose. The previous placeholder handles pointed at generic
 * platform homepages (linkedin.com, not an actual heiller page) — a social
 * link that goes nowhere specific is worse than no social link on a site
 * meant to hold up under scrutiny. `Footer` hides the "Follow" column
 * entirely while this is empty; add real profile URLs here once they exist
 * and it reappears automatically.
 */
export const socials: ReadonlyArray<{ label: string; href: string; handle: string }> = [];

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
  lede: "heiller's team handles your coding, claims, denials and collections directly — with software and AI speeding up the repetitive work, not replacing the judgment calls that actually recover revenue.",
  badge: 'RCM that delivers',
} as const;

/**
 * Video-hero content — the copy actually rendered on `/`.
 *
 * Replaces a supplied spec written in generic web3/infrastructure language
 * ("decentralized web", "new digital epoch", "builders and communities")
 * that had nothing to do with the business. This version says what heiller
 * actually is: a small, full-cycle RCM team, priced and turned around for
 * practices that can't wait on an enterprise vendor's onboarding queue. No
 * specific turnaround number appears here because none has been confirmed —
 * "fast" and "built to move" are the honest version of that claim.
 */
export const videoHero = {
  headline: ['Full-cycle RCM,', 'built to move fast.'],
  subheadline:
    'A senior team handling your coding, claims, denials and collections end to end — with software and AI speeding up the repetitive work, so revenue moves without the overhead of an enterprise vendor.',
  cta: { label: 'Get a free revenue audit', href: '#contact' },
  /** Supplied asset. Decorative only — carries no information. */
  videoSrc:
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4',
} as const;

/**
 * `nav` and `navCta` used to seed a floating pill navbar inside the hero
 * itself; that nav was removed as a duplicate landmark (the site already has
 * one persistent `Navbar`), so those two fields went with it rather than
 * sitting here unused. `secondary` on the CTA pair below is gone for the same
 * reason — nothing has rendered it since the hero moved to a single-CTA video
 * layout, and it pointed at `#workflow`, a section that no longer exists.
 */
export const cta = {
  primary: { label: 'Get a free revenue audit', href: '#contact' },
} as const;

/* -------------------------------------------------------------------------- */
/* Chapter 1 — The problem                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Real, sourced industry figures — not illustrative placeholders.
 *
 *   12%   — initial claim denial rate. Industry trackers put the 2024–2025
 *           range at roughly 10–15%, trending upward; 12% sits inside that
 *           range rather than at either edge.
 *   65%   — share of denied claims never reworked or resubmitted. Cited
 *           consistently across RCM industry sources (MGMA-adjacent
 *           benchmarking data puts the floor above 50%, with 65% the more
 *           commonly repeated figure).
 *   $248B — annual US billing-and-coding administrative waste. From Shrank
 *           et al., "Waste in the US Health Care System," JAMA, 2019 — the
 *           most-cited peer-reviewed estimate for this category, distinct
 *           from the broader (and less precise) total administrative-waste
 *           range some sources quote in the hundreds of billions.
 */
export const problemStats = [
  {
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
    value: 248,
    prefix: '$',
    suffix: 'B',
    label: 'lost annually to billing and coding waste',
    note: 'JAMA, 2019 — US healthcare administrative complexity',
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

/**
 * Nine service lines. Rewritten to match how heiller actually operates — a
 * small team doing the work directly, software and AI speeding up the
 * repetitive parts, not a claims-processing platform running itself.
 *
 * Earlier drafts described "automated charge reconciliation," "real-time
 * benefit checks," a "live edit library," and a "live view" refreshed daily
 * — plus a specific unverified coder-certification claim (AAPC/AHIMA) and
 * absolute guarantees ("never," "zero-lapse," "nothing... goes unbilled").
 * None of that is true of an 8-person, mostly-manual operation, so it is
 * rewritten below to describe the actual process: people checking things,
 * on a schedule, with software where it genuinely helps. "Fast" and
 * "cheap" remain the honest differentiators — no specific turnaround
 * number is claimed here because none has been confirmed.
 */
export const services: Service[] = [
  {
    id: 'medical-coding',
    index: '01',
    title: 'Medical Coding',
    summary:
      'Every encounter coded to ICD-10, CPT and HCPCS by a member of our team, with a second set of eyes on complex or high-dollar claims before they go out.',
    icon: 'coding',
    metric: 'ICD-10 · CPT · HCPCS',
  },
  {
    id: 'charge-entry',
    index: '02',
    title: 'Charge Entry',
    summary:
      'Charges captured and checked against the schedule so a rendered service does not quietly go unbilled.',
    icon: 'charge',
    metric: 'Checked against the schedule',
  },
  {
    id: 'eligibility-verification',
    index: '03',
    title: 'Eligibility Verification',
    summary:
      'Benefits and prior-authorisation requirements verified before the patient is roomed, not discovered after the claim comes back denied.',
    icon: 'eligibility',
    metric: 'Verified before every visit',
  },
  {
    id: 'claim-submission',
    index: '04',
    title: 'Claim Submission',
    summary:
      'Claims reviewed against payer-specific rules before submission, filed electronically, and reconciled against the payer acknowledgement.',
    icon: 'submission',
    metric: 'Reviewed before every claim',
  },
  {
    id: 'denial-management',
    index: '05',
    title: 'Denial Management',
    summary:
      'Each denial traced to its root cause, appealed inside the payer window, and fed back to the step that caused it so it stops repeating.',
    icon: 'denial',
    metric: 'Appeal + prevent',
  },
  {
    id: 'ar-follow-up',
    index: '06',
    title: 'A/R Follow-Up',
    summary:
      'Aged receivables worked by dollar-weighted priority rather than by date, so the largest recoverable balances get attention first.',
    icon: 'ar',
    metric: 'Priority by dollar value',
  },
  {
    id: 'payment-posting',
    index: '07',
    title: 'Payment Posting',
    summary:
      'ERA and manual posting with contractual-allowance validation — underpayments are flagged for follow-up, not absorbed.',
    icon: 'posting',
    metric: 'ERA + EOB reconciled',
  },
  {
    id: 'credentialing',
    index: '08',
    title: 'Credentialing',
    summary:
      'Enrolment, re-validation and CAQH upkeep tracked on a calendar, so a lapsed credential does not catch a provider by surprise.',
    icon: 'credentialing',
    metric: 'Tracked on a calendar',
  },
  {
    id: 'revenue-analytics',
    index: '09',
    title: 'Revenue Reporting',
    summary:
      'Regular reporting on yield by payer, provider and procedure, with the variance walked through by our team — not just handed to you as a chart.',
    icon: 'analytics',
    metric: 'Reviewed with your team',
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

/**
 * Same rewrite principle as `dataLifecycle` and `accessControls` in
 * `page-content.ts`: describe the security posture an 8-person, mostly-
 * manual team running on standard cloud infrastructure actually has, not a
 * custom-built enterprise security program. "Isolated tenancy," "private
 * networking," "infrastructure defined in code," and "geographically
 * separated replicas" previously appeared here — all plausible for a
 * platform engineering team, none of it something heiller has built.
 */
export const securityPillars = [
  {
    id: 'encryption',
    title: 'Encryption',
    body: "AES-256 at rest, TLS 1.2+ in transit — our infrastructure provider's standard encryption, not a custom-built key-management system.",
    glyph: 'lock',
  },
  {
    id: 'compliance',
    title: 'HIPAA Compliance',
    body: 'Executed BAAs, an annual Security Risk Analysis, and a documented breach-notification process.',
    glyph: 'shield',
  },
  {
    id: 'audit',
    title: 'Audit Trails',
    body: 'Access to PHI is logged — who, what and when — and checked when something looks wrong, not filed and forgotten.',
    glyph: 'trail',
  },
  {
    id: 'cloud',
    title: 'Secure Cloud',
    body: "Each client's data lives in its own access-controlled workspace, hosted on an established cloud provider rather than hardware we run ourselves.",
    glyph: 'cloud',
  },
  {
    id: 'access',
    title: 'Access Control',
    body: 'Role-based, least-privilege access with mandatory MFA, reviewed regularly rather than left to run indefinitely.',
    glyph: 'key',
  },
  {
    id: 'continuity',
    title: 'Continuity',
    body: "Regular, automated backups through our infrastructure provider, with a restore process we've actually tested rather than only assumed would work.",
    glyph: 'orbit',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Chapter 6 — Analytics                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Industry benchmark figures — not heiller's own claimed results.
 *
 * heiller has three active clients as of 2026. That is nowhere near enough
 * claim volume for a "median across the book of business" statistic to mean
 * anything, and there is no independently audited outcome history to
 * publish yet. Presenting invented before/after deltas as our own performance
 * is exactly the kind of claim a government reviewer checks first.
 *
 * So this shows the standard instead: the same ranges MGMA (Medical Group
 * Management Association) publishes in its practice-benchmarking data, which
 * is what "good" looks like across the industry regardless of who is doing
 * the billing. `benchmark` names the specific published range or threshold;
 * `caption` explains what the figure means in plain terms. Replace this
 * section with heiller's own audited numbers once there is a real,
 * citable track record to publish — see `Analytics.tsx` for the honesty
 * note on how that swap should happen.
 */
export const analyticsMetrics = [
  {
    id: 'clean-claim',
    label: 'Clean claim rate',
    value: 95,
    suffix: '%+',
    decimals: 0,
    benchmark: 'MGMA top-performer benchmark',
    caption: 'What every claim is scrubbed against before submission.',
  },
  {
    id: 'denial',
    label: 'Denial rate',
    value: 5,
    suffix: '%',
    decimals: 0,
    benchmark: 'MGMA best-in-class ceiling',
    caption: 'Industry average runs 10–12%. The target is staying under this.',
  },
  {
    id: 'ar-days',
    label: 'Days in A/R',
    value: 35,
    suffix: '',
    decimals: 0,
    benchmark: 'MGMA benchmark range: 30–40 days',
    caption: 'How long a clean claim should take to convert to cash.',
  },
  {
    id: 'collection',
    label: 'Net collection rate',
    value: 96,
    suffix: '%+',
    decimals: 0,
    benchmark: 'MGMA benchmark for effective collection',
    caption: 'Collected against the contracted rate, not billed charges.',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Chapter 7 — Trust                                                           */
/* -------------------------------------------------------------------------- */

/**
 * heiller has three active clients as of 2026 — not enough for a public logo
 * wall or a bank of testimonials that would read as more established than
 * the company actually is. `clientNames` and `testimonials` used to live
 * here as placeholders: an invented client-logo marquee and three quotes
 * attributed to named people who do not exist. Publishing fabricated
 * customer endorsements is deceptive advertising, not a layout placeholder
 * — both are removed rather than replaced with new fictional ones. Real
 * client logos and attributable quotes belong here once permission exists
 * to publish them.
 *
 * In their place: three honest reasons to trust a small, new company,
 * instead of manufactured proof that it is an established one.
 */
export const trustPoints = [
  {
    id: 'direct-access',
    title: 'Direct access, not a ticket queue',
    body: "heiller is eight people. When you have a question about a claim, you're talking to the person who worked it — not filing a request into a support rotation.",
  },
  {
    id: 'honest-about-scale',
    title: 'Honest about where we are',
    body: "We're a new company with three active clients, not an enterprise vendor with a decade of case studies. What we do have: a senior team that has done this work before, and the bandwidth to actually pay attention to your account.",
  },
  {
    id: 'references',
    title: 'References on request',
    body: "We'd rather introduce you to a current client directly than publish a quote you can't verify. Ask, and we'll make the connection.",
  },
] as const;

/**
 * HIPAA only. SOC 2, HITRUST and ISO 27001 previously appeared here (even
 * hedged as "Aligned" rather than "Certified") — heiller doesn't hold any of
 * the three, and a compliance badge row is exactly the kind of claim a
 * government reviewer or a customer's counsel will try to verify. Add one
 * back only once it's actually true, with the attestation to prove it.
 */
export const complianceBadges = [{ label: 'HIPAA', detail: 'Compliant' }] as const;

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
  { label: 'Full-Cycle RCM', icon: 'badge' },
  { label: 'Fast Turnaround', icon: 'clock' },
  { label: '100% US-Based', icon: 'globe' },
] as const;

export type HeroSignalIcon = (typeof heroTrustSignals)[number]['icon'];

/* -------------------------------------------------------------------------- */
/* Story chapters — shared between the 3D rig and the DOM sections             */
/* -------------------------------------------------------------------------- */

/**
 * ORPHANED — not imported anywhere in the codebase.
 *
 * This drove a scroll-position camera/lattice/lighting rig for the WebGL
 * background scene that was removed in full (see "What changed, and why
 * it's worth knowing" in the README). It was never updated when Workflow and
 * Security were removed from the homepage — it still lists all nine original
 * chapters, including the two that no longer render — because nothing
 * consumes it anymore to make that drift visible. Left here rather than
 * deleted in case the 3D system is ever rebuilt; do not treat it as
 * authoritative for the current page order. `app/page.tsx`'s own doc comment
 * is the accurate, current chapter list.
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
