/**
 * Content for the interior pages — /security and /about.
 *
 * Split out of `site.ts` to keep that file navigable: it holds the content the
 * landing page and every component share (company, contact, services, nav),
 * whereas everything here is consumed by exactly one route. The rule the
 * codebase actually cares about is unchanged — copy lives in `lib/`, never
 * hard-coded in a component.
 *
 * ⚠️  PLACEHOLDER CONTENT
 * Security and compliance claims carry real legal weight in healthcare, and
 * this file is full of them. Every item marked `PLACEHOLDER` is illustrative
 * and MUST be replaced with verified fact — or deleted — before launch.
 * Asserting an unheld certification is not a marketing exaggeration, it is a
 * misrepresentation a customer can act on.
 */

/* ========================================================================== */
/* /security                                                                   */
/* ========================================================================== */

export const securityPage = {
  eyebrow: 'Security',
  title: 'Verifiable. *Not* asserted.',
  lede: 'Anyone can put a padlock icon on a website. What follows is the evidence behind ours — the controls, who they are audited by, where protected health information physically lives, and what happens on the worst day.',
} as const;

/**
 * Attestations.
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
    // PLACEHOLDER — confirm with counsel before publishing.
    status: 'Compliant',
    summary:
      'Administrative, physical and technical safeguards under the Security Rule, plus Privacy Rule obligations as a Business Associate.',
    detail:
      'We execute a Business Associate Agreement with every covered entity before any protected health information is transmitted. Workforce training is completed at onboarding and refreshed annually.',
  },
  {
    id: 'soc2',
    label: 'SOC 2',
    // PLACEHOLDER — a Type II report requires a completed observation window.
    status: 'Type II',
    summary:
      'Independent audit of security, availability and confidentiality controls across an observation window.',
    detail:
      'The report is available under NDA. Ask for the current one rather than the summary — a Type II is only meaningful alongside its exceptions, and we would rather walk you through ours than have you discover them at procurement.',
  },
  {
    id: 'hitrust',
    label: 'HITRUST CSF',
    // PLACEHOLDER — "aligned" is not "certified". Do not upgrade this wording
    // without an actual assessment to point at.
    status: 'Aligned',
    summary:
      'Controls mapped to the HITRUST Common Security Framework. Not currently certified.',
    detail:
      'We map to the framework because most of our customers are assessed against it and a shared control language shortens their diligence. We do not claim certification, and we will say so in writing.',
  },
  {
    id: 'iso27001',
    label: 'ISO/IEC 27001',
    // PLACEHOLDER — same caveat as HITRUST.
    status: 'Aligned',
    summary:
      'Information security management system modelled on the standard. Not currently certified.',
    detail:
      'Our ISMS follows the Annex A control set. Certification is on the roadmap; until an accredited body has issued a certificate, this page will keep saying "aligned".',
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
export const dataLifecycle = [
  {
    step: '01',
    title: 'Arrival',
    body: 'PHI reaches us over TLS 1.2+ through an SFTP endpoint, a clearinghouse integration, or a direct EHR connection. Nothing is accepted over email, and attachments sent to a person rather than a system are quarantined and reported, not processed.',
  },
  {
    step: '02',
    title: 'Isolation',
    body: 'Each customer is a separate logical tenant with its own encryption key. There is no shared table with a customer_id column — a query that crosses a tenant boundary does not have a path to run, rather than being blocked by a filter someone could forget.',
  },
  {
    step: '03',
    title: 'Processing',
    body: 'Work happens inside the environment. Analysts operate through a brokered virtual desktop with clipboard, printing and local storage disabled, so PHI never lands on an endpoint — including in an office we control.',
  },
  {
    step: '04',
    title: 'At rest',
    body: 'AES-256 on every volume, snapshot and backup. Keys are held in a managed KMS with rotation, and are separable per tenant so a customer can be cryptographically severed from the platform on request.',
  },
  {
    step: '05',
    title: 'Retention and destruction',
    body: 'Retention is set per contract, defaulting to the shorter of your policy and the statutory minimum. On termination we return your data in an agreed format and then destroy it, including backups, and issue a written certificate of destruction.',
  },
] as const;

/** Concrete access-control commitments, phrased so they can be audited. */
export const accessControls = [
  {
    title: 'Named accounts only',
    body: 'No shared logins anywhere in the production path. Every action in the system resolves to one human being.',
  },
  {
    title: 'Least privilege by default',
    body: 'Access is granted per assignment, not per role, and expires with the assignment. Standing production access is limited to a named on-call rota.',
  },
  {
    title: 'Phishing-resistant MFA',
    body: 'Hardware or platform authenticators for anything touching PHI. SMS one-time codes are not accepted as a second factor.',
  },
  {
    title: 'Quarterly recertification',
    body: 'Every entitlement is re-reviewed by the data owner each quarter. Anything nobody will vouch for is revoked, not renewed.',
  },
  {
    title: 'Same-day offboarding',
    body: 'Access is revoked within four hours of a departure — immediately, and before notice, where the departure is involuntary.',
  },
  {
    title: 'Logged and reviewed',
    body: 'Access to PHI is logged immutably and monitored for anomalies. Logs are retained beyond the record itself so an access question stays answerable after deletion.',
  },
] as const;

/**
 * Subprocessors.
 *
 * PLACEHOLDER — this table must reflect your actual vendor list before launch.
 * Publishing it is not optional in spirit: customers are entitled to know who
 * else can reach their data, and most BAAs require notice of new subprocessors
 * anyway. An out-of-date table is worse than none.
 */
export const subprocessors = [
  {
    name: 'Cloud infrastructure provider',
    purpose: 'Compute, storage and managed database hosting',
    region: 'United States',
    baa: 'Executed',
  },
  {
    name: 'Clearinghouse',
    purpose: 'Claim submission and remittance routing',
    region: 'United States',
    baa: 'Executed',
  },
  {
    name: 'Observability platform',
    purpose: 'Application logs and performance monitoring',
    region: 'United States',
    baa: 'Executed — PHI excluded by configuration',
  },
  {
    name: 'Transactional email provider',
    purpose: 'System notifications to named staff users',
    region: 'United States',
    baa: 'Executed — no PHI in message bodies',
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
    // PLACEHOLDER — align with your BAA. HIPAA's outer limit is 60 days;
    // committing to less is a real obligation, so make sure you can meet it.
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

export const disclosure = {
  title: 'Found something?',
  body: 'If you believe you have found a vulnerability, tell us before you tell anyone else and we will work the problem with you. We do not pursue legal action against researchers who act in good faith, stay within their own test data, and give us reasonable time to remediate.',
  // PLACEHOLDER — stand up a dedicated, monitored address before publishing.
  commitment: 'Acknowledgement within one business day.',
} as const;

/* ========================================================================== */
/* /about                                                                      */
/* ========================================================================== */

export const aboutPage = {
  eyebrow: 'About us',
  title: 'We have worked the *denial queue.*',
  lede: 'heiller was built by people who spent years inside revenue cycle operations, and got tired of watching good clinical work get written off over a missing modifier.',
} as const;

export const aboutStory = [
  'Most revenue cycle vendors are staffing companies with a dashboard bolted on. You send them the backlog, they send back throughput, and the underlying failure rate never moves — because nobody is paid to make it move.',
  'We started heiller on the opposite premise: that a denial is a defect, and a defect has a cause upstream of where it surfaced. A claim rejected for eligibility is not a collections problem. It is a registration problem that took forty-five days to become visible, and it will happen again tomorrow unless someone changes registration.',
  'So the system we built does something slightly unusual for this industry. It routes every failure back to the step that produced it, and it reports the rate at which each step produces them. That number is uncomfortable at first. It is also the only number that has ever made a revenue cycle permanently better.',
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

/** PLACEHOLDER — every figure below must be verified before launch. */
export const aboutStats = [
  { value: '2019', label: 'Founded' },
  { value: '40+', label: 'Revenue cycle specialists' },
  { value: '2', label: 'Delivery regions — US and India' },
  { value: '24h', label: 'Median claim turnaround' },
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
 * PLACEHOLDER — fictional people.
 *
 * Do not publish invented leadership. Beyond the obvious credibility problem,
 * a healthcare buyer will look these names up during diligence, and not finding
 * them is worse than having no team section at all.
 */
export const leadership = [
  {
    name: 'Add a real name',
    role: 'Founder & Chief Executive',
    bio: 'Two or three sentences of verifiable background — where they worked, what they ran, how long they have been in revenue cycle.',
    initials: '—',
  },
  {
    name: 'Add a real name',
    role: 'Head of Revenue Cycle Operations',
    bio: 'Operational credibility matters more than seniority here. Say what queues they have personally run.',
    initials: '—',
  },
  {
    name: 'Add a real name',
    role: 'Head of Compliance',
    bio: 'Name the certifications this person actually holds — CHC, CHPC, CPC. Buyers check.',
    initials: '—',
  },
] as const;

export const locations = [
  {
    city: 'Namakkal',
    region: 'Tamil Nadu, India',
    body: 'Delivery centre. Coding, charge entry, claim submission and A/R follow-up, operating on US business hours.',
  },
  {
    city: 'United States',
    region: 'Client operations',
    body: 'Client-facing operations, payer escalation and compliance oversight, in the time zone your payers answer the phone in.',
  },
] as const;
