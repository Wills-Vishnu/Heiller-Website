/**
 * Content for the interior pages — /security and /about.
 *
 * Split out of `site.ts` to keep that file navigable: it holds the content the
 * landing page and every component share (company, contact, services, nav),
 * whereas everything here is consumed by exactly one route. The rule the
 * codebase actually cares about is unchanged — copy lives in `lib/`, never
 * hard-coded in a component.
 *
 * ⚠️  WHAT'S REAL AND WHAT ISN'T, AS OF THIS PASS
 * `attestations`, `dataLifecycle`, `accessControls`, `aboutStory`,
 * `aboutStats`, `leadership` and `locations` describe heiller as it actually
 * operates — an eight-person, mostly-manual, HIPAA-only, Phoenix-based team —
 * not an idealized or aspirational version of it. Three things are still
 * genuinely open and marked `PLACEHOLDER` below: the `subprocessors` table
 * (needs the real vendor list), the SEV-1 breach-notification window in
 * `incidentTiers` (needs sign-off against the actual BAA language), and the
 * `disclosure` contact commitment (needs a real monitored address). Those
 * three carry real legal weight in healthcare — resolve them with verified
 * fact, or remove them, before this page is treated as final. Asserting an
 * unheld certification or an uncommitted SLA is not a marketing exaggeration,
 * it is a misrepresentation a customer or regulator can act on.
 */

/* ========================================================================== */
/* /security                                                                   */
/* ========================================================================== */

export const securityPage = {
  eyebrow: 'Security',
  title: 'Verifiable. *Not* asserted.',
  lede: 'Anyone can put a padlock icon on a website. What follows is the detail behind ours — the controls we actually run, where protected health information goes, and what happens on the worst day. Where we hold a real attestation we say so; where we do not, we describe the practice instead of implying a certificate that does not exist.',
} as const;

/**
 * Attestations.
 *
 * Only one entry: HIPAA. heiller is an 8-person operation and does not hold
 * SOC 2, HITRUST, or ISO 27001 attestations — those were removed rather than
 * hedged, because "aligned to" a framework the company has never been
 * assessed against is still an overclaim on a site the US government will
 * review. Add a framework back here only once an actual auditor's report or
 * certificate exists to point at.
 *
 * `status` is deliberately a free string rather than a boolean, because the
 * honest answer is usually not binary — "aligned to" a framework is a genuine
 * and defensible position, and it is very different from "certified against"
 * it. Conflating the two is the single most common compliance overclaim on
 * healthcare vendor websites.
 */
export const attestations = [
  {
    id: 'hipaa',
    label: 'HIPAA',
    status: 'Compliant',
    summary:
      'Administrative, physical and technical safeguards under the Security Rule, plus Privacy Rule obligations as a Business Associate.',
    detail:
      'We execute a Business Associate Agreement with every covered entity before any protected health information is transmitted. Workforce training is completed at onboarding and refreshed annually.',
  },
] as const;

/**
 * The PHI lifecycle, start to finish.
 *
 * This section exists because it is the question every serious security
 * reviewer asks and almost no vendor site answers: not "are you encrypted"
 * but "where does my data physically go, who can see it, and when is it
 * destroyed". Answering it up front removes an entire round of diligence.
 */
/**
 * The PHI lifecycle, rewritten to match how an 8-person, mostly-manual team
 * actually handles data — not a description of custom-built multi-tenant SaaS
 * infrastructure heiller doesn't have. The previous version claimed a
 * per-tenant encryption-key architecture, a brokered virtual-desktop
 * environment with clipboard and printing disabled, and a managed KMS with
 * per-tenant key rotation — the kind of build that needs a platform
 * engineering team behind it. heiller runs on standard cloud provider tools
 * with access controls and encryption turned on, operated carefully by a
 * small team; that is a real, defensible posture, and it is what is
 * described below instead.
 */
export const dataLifecycle = [
  {
    step: '01',
    title: 'Arrival',
    body: 'PHI reaches us over an encrypted connection — a clearinghouse integration, a secure file transfer, or a direct EHR connection. Nothing is accepted over plain email, and anything sent that way is flagged and handled outside the normal workflow, not processed as-is.',
  },
  {
    step: '02',
    title: 'Access',
    body: "Each client's records live in their own access-controlled workspace. Staff can only reach the accounts they're assigned to — access is granted per client, not given by default to everyone on the team.",
  },
  {
    step: '03',
    title: 'Processing',
    body: "Work happens inside the systems PHI already lives in — the clearinghouse, the EHR, our billing software — over an encrypted connection, on company-managed devices. Files aren't downloaded to personal devices or emailed between staff.",
  },
  {
    step: '04',
    title: 'At rest',
    body: "Data at rest is encrypted (AES-256) through our infrastructure provider, on every volume and backup. We use our provider's managed encryption rather than a custom key-management system — standard, not bespoke, and no less real for it.",
  },
  {
    step: '05',
    title: 'Retention and destruction',
    body: 'Retention is set per contract, defaulting to the shorter of your policy and the statutory minimum. On termination we return your data in an agreed format and then delete it, including backups, and confirm that in writing.',
  },
] as const;

/**
 * Access-control commitments, sized to an 8-person team rather than written
 * as if a dedicated security function enforces them. Same underlying
 * promises as before — named accounts, least privilege, MFA, offboarding,
 * logging — without claiming formal machinery (quarterly recertification
 * cycles, immutable log infrastructure, phishing-resistant hardware keys)
 * that a team this size is unlikely to actually run.
 */
export const accessControls = [
  {
    title: 'Named accounts only',
    body: 'No shared logins anywhere in the production path. Every action in the system resolves to one person.',
  },
  {
    title: 'Least privilege by default',
    body: "Staff only have access to the clients and systems assigned to them — access is not given by default and is removed the moment an assignment ends.",
  },
  {
    title: 'MFA everywhere PHI is touched',
    body: 'Multi-factor authentication is required on every system that handles PHI. No exceptions for convenience.',
  },
  {
    title: 'Access reviewed regularly',
    body: "A small team makes this easier, not harder — access gets reviewed regularly, and anyone whose role changes has their access changed with it, the same week.",
  },
  {
    title: 'Same-day offboarding',
    body: 'Access is revoked the same day someone leaves the team — immediately, where the departure is involuntary.',
  },
  {
    title: 'Logged and checked',
    body: 'Access to PHI is logged. Logs are kept longer than the records themselves, so a question about who accessed something stays answerable after the fact.',
  },
] as const;

/**
 * Subprocessors — real vendor names, as of this pass.
 *
 * `baa` is intentionally NOT marked "Executed" for AWS or Microsoft 365.
 * Both vendors offer a standard HIPAA BAA and it is common for a company this
 * size to have one in place, but that has not been confirmed in this pass —
 * asserting "Executed" without checking would be exactly the kind of
 * compliance claim this whole file exists to avoid. Confirm each BAA is
 * actually signed (AWS: via AWS Artifact; Microsoft: via the Microsoft
 * Online Services HIPAA/BAA terms) and update the status before this table
 * is treated as final. The clearinghouse used for claim submission has not
 * been named yet — replace that row once one is selected.
 *
 * heiller's team also uses general-purpose AI tools (ChatGPT, Claude) for
 * drafting and research, on consumer accounts rather than a business/API tier
 * with a BAA. Those tools are deliberately NOT listed here: no client claims
 * data or PHI is entered into them, so no business-associate relationship
 * exists to disclose. See the note under this table on `/security`. If that
 * ever changes — if PHI starts being pasted into either tool — a BAA-backed
 * enterprise tier becomes mandatory before continuing, not optional.
 */
export const subprocessors = [
  {
    name: 'Amazon Web Services (AWS)',
    purpose: 'Compute, storage, hosting and infrastructure logging',
    region: 'United States',
    // PLACEHOLDER — confirm the AWS BAA is executed via AWS Artifact.
    baa: 'Confirm before publishing',
  },
  {
    name: 'Microsoft 365',
    purpose: 'Business email and office productivity',
    region: 'United States',
    // PLACEHOLDER — confirm the Microsoft BAA is executed for this tenant.
    baa: 'Confirm before publishing',
  },
  {
    name: 'Clearinghouse',
    purpose: 'Claim submission and remittance routing',
    region: 'United States',
    // PLACEHOLDER — name the actual clearinghouse once one is selected.
    baa: 'Vendor not yet named',
  },
] as const;

/**
 * Incident severity ladder.
 *
 * Notification windows are commitments, not aspirations — the whole point of
 * publishing them is that a customer can hold us to them. Anything here that
 * your contracts do not actually promise must be changed before launch.
 */
/**
 * `severity` is 0–1 and drives the width of the bar behind each tier on the
 * page. It carries no meaning beyond visual weight — the definition and the
 * response window are the actual content — so changing it is a design decision,
 * not a policy one.
 */
export const incidentTiers = [
  {
    level: 'SEV-1',
    definition: 'Confirmed unauthorised access to, or acquisition of, PHI.',
    // Confirmed committable by the team — HIPAA's outer limit is 60 days,
    // so 24 hours is a real, deliberately tighter promise, not the default.
    response: 'Customer notified within 24 hours of confirmation',
    window: 24,
    unit: 'h',
    severity: 1,
  },
  {
    level: 'SEV-2',
    definition:
      'Suspected exposure, or a control failure that could have permitted access.',
    response: 'Customer notified within 72 hours, with findings on close',
    window: 72,
    unit: 'h',
    severity: 0.62,
  },
  {
    level: 'SEV-3',
    definition:
      'Service disruption or degradation with no indication of data exposure.',
    response: 'Status updates through the incident, postmortem within 5 days',
    window: 5,
    unit: 'd',
    severity: 0.3,
  },
] as const;

/**
 * A dedicated security address, separate from the general company inbox.
 * `email`/`emailHref` route disclosure reports to `security@heillerrcm.com`
 * specifically — this inbox needs to actually exist and be monitored before
 * this page goes live; a dedicated address nobody checks is worse than
 * routing through the general one.
 */
export const disclosure = {
  title: 'Found something?',
  body: 'If you believe you have found a vulnerability, tell us before you tell anyone else and we will work the problem with you. We do not pursue legal action against researchers who act in good faith, stay within their own test data, and give us reasonable time to remediate.',
  commitment: 'Acknowledgement within one business day.',
  email: 'security@heillerrcm.com',
  emailHref: 'mailto:security@heillerrcm.com',
} as const;

/* ========================================================================== */
/* /about                                                                      */
/* ========================================================================== */

export const aboutPage = {
  eyebrow: 'About us',
  title: 'A denial is a *defect.* Not a cost of doing business.',
  lede: 'heiller exists because too much good clinical work gets written off over a missing modifier — and because most revenue cycle vendors get paid the same whether that stops happening or not.',
} as const;

export const aboutStory = [
  'Most revenue cycle vendors are staffing companies with a dashboard bolted on. You send them the backlog, they send back throughput, and the underlying failure rate rarely moves — because nobody is paid specifically to make it move.',
  'We started heiller on the opposite premise: that a denial is a defect, and a defect has a cause upstream of where it surfaced. A claim rejected for eligibility is not a collections problem. It is a registration problem that took forty-five days to become visible, and it will happen again tomorrow unless someone changes registration.',
  "So that's how heiller actually operates, even as a small team without a large engineering department behind it. Every failure gets routed back to the step that produced it, by a person who owns that step, and we track the rate at which each step produces them. That number is uncomfortable at first. It's also the only one that has ever made a revenue cycle permanently better.",
] as const;

export const aboutPrinciples = [
  {
    title: 'The cause, not the symptom',
    body: 'Reworking a denial is a cost. Preventing the next one is an asset. We measure ourselves on the second, which is why our reporting leads with first-pass rate rather than collections recovered.',
  },
  {
    title: 'Show the working',
    body: 'Every figure we publish to a client is traceable to the claims behind it. If you cannot click through from a number to the records that produced it, we consider that a defect in our reporting.',
  },
  {
    title: 'Your data is yours',
    body: 'No lock-in through obscurity. Your data is exportable in a documented format at any time, during the contract and after it, without an offboarding fee.',
  },
  {
    title: 'Say the unwelcome thing',
    body: 'If an audit shows the problem is on your side of the boundary — documentation, front-desk process, a payer contract you should renegotiate — we will tell you that, even when the finding is worth less revenue to us.',
  },
] as const;

/**
 * Real figures. heiller is small and new — 2026, eight people, three
 * clients — and that is the honest story rather than something to round up.
 * No turnaround-time stat appears here because no specific number has been
 * confirmed; "fast" is claimed elsewhere without a fabricated hour count
 * attached to it.
 */
export const aboutStats = [
  { value: '2026', label: 'Founded' },
  { value: '8', label: 'People on the team' },
  { value: '3', label: 'Active clients' },
  { value: '100%', label: 'US-based operations' },
] as const;

export const engagementModel = [
  {
    step: '01',
    title: 'Audit',
    body: 'We review ninety days of your claims and quantify leakage by root cause. You get the findings whether or not you work with us, in a format your own team can act on.',
  },
  {
    step: '02',
    title: 'Scope',
    body: 'Take one function or the whole cycle. We will tell you which single function would return the most, and it is frequently not the one you expected.',
  },
  {
    step: '03',
    title: 'Transition',
    body: 'Parallel running until the numbers agree. We do not take a queue live on trust — your team and ours reconcile the same claims until the variance is explainable.',
  },
  {
    step: '04',
    title: 'Operate and report',
    body: 'Named owners, measured handoffs, and a monthly review that leads with what got worse. Anything trending the wrong way arrives with a cause and a plan attached.',
  },
] as const;

/**
 * Real names and titles. No bios are published here because none were
 * written — a one-line filler bio ("ran the coding team for years," "deep
 * RCM background") would just be a smaller, easier-to-miss version of the
 * same fabrication problem this section used to have with invented people
 * entirely. Add a bio only once there is a real, specific, checkable
 * sentence to put there — where someone worked, what they ran, for how
 * long. A healthcare buyer will look these names up during diligence, and a
 * vague or embellished bio is worse than none at all.
 *
 * `image` is optional and unset for everyone right now — no real photos
 * exist yet, so `TeamGrid` (`AboutMotion.tsx`) falls back to a monogram card
 * for anyone without one. That's a deliberate design choice, not a broken
 * placeholder: it's not an AI-generated stand-in face pretending to be a
 * real photo. To add a real photo once one exists, set
 * `image: '/team/name.jpg'` on that person's entry and drop the file in
 * `public/team/`.
 */
export interface LeadershipMember {
  name: string;
  role: string;
  initials: string;
  image?: string;
}

export const leadership: LeadershipMember[] = [
  { name: 'Karthik B', role: 'Founder & CEO', initials: 'KB' },
  { name: 'Sushanth Kirushna', role: 'CIO', initials: 'SK' },
  { name: 'Vishnuvarshan', role: 'CTO', initials: 'VV' },
  { name: 'Jijin Jose', role: 'COO', initials: 'JJ' },
  { name: 'Praneeth', role: 'VP', initials: 'PR' },
  { name: 'Jaganath', role: 'VP', initials: 'JA' },
  { name: 'Prabhu', role: 'VP', initials: 'PB' },
  { name: 'Nishanth Nandhakumar', role: 'Investor', initials: 'NN' },
];

/**
 * A single location. heiller operates out of one US office rather than the
 * two-region (US + India) setup this used to describe — collapsed to match
 * reality rather than kept as two entries with one quietly removed.
 */
export const locations = [
  {
    city: 'Phoenix, Arizona',
    region: 'Headquarters',
    body: 'The whole team works out of Phoenix — coding, claims, client operations and compliance oversight, all in the same US time zone your payers answer the phone in.',
  },
] as const;
