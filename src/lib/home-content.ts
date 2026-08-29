export type AnchorLink = {
  readonly label: string;
  readonly href: `#${string}`;
};

export type CopyItem = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

export const homeNav = [
  { label: 'Services', href: '#services' },
  { label: 'Approach', href: '#approach' },
  { label: 'Performance', href: '#results' },
  { label: 'Why Heiller', href: '#why-heiller' },
  { label: 'Revenue audit', href: '#revenue-audit' },
] as const satisfies readonly AnchorLink[];

export const complianceItems = [
  {
    id: 'hipaa',
    title: 'HIPAA-conscious operations',
    body: 'Safeguards and working practices are designed around the responsible handling of protected health information.',
  },
  {
    id: 'access',
    title: 'Controlled access',
    body: 'Named access and clear ownership keep sensitive work limited to the people responsible for it.',
  },
  {
    id: 'encryption',
    title: 'Protected movement',
    body: 'Sensitive information is protected while it moves between systems and while it is stored.',
  },
  {
    id: 'audit',
    title: 'Traceable activity',
    body: 'Important actions stay attributable so questions can be investigated instead of guessed at.',
  },
  {
    id: 'infrastructure',
    title: 'Secure infrastructure',
    body: 'Operational systems are structured to reduce unnecessary exposure and fragile handoffs.',
  },
  {
    id: 'continuity',
    title: 'Continuity by design',
    body: 'Documented ownership and recovery practices keep revenue work moving when conditions change.',
  },
] as const satisfies readonly CopyItem[];

export const servicePills = [
  { id: 'credentialing', label: 'Credentialing', from: '#f49cff', to: '#b725d0', accent: '#705cff' },
  { id: 'registration', label: 'Patient registration', from: '#ff9b7d', to: '#f43725', accent: '#ffcf62' },
  { id: 'authorization', label: 'Authorization', from: '#ffb3a7', to: '#ff6a4d', accent: '#ffc46b' },
  { id: 'coding', label: 'Coding', from: '#8ee8b8', to: '#16bd72', accent: '#56d6d6' },
  { id: 'billing', label: 'Billing', from: '#ffe889', to: '#f4ca17', accent: '#ff9d57' },
  { id: 'denials', label: 'Denial management', from: '#91b5ff', to: '#3d6de8', accent: '#8c62ee' },
  { id: 'ar', label: 'A/R follow-up', from: '#ff9ac9', to: '#f05098', accent: '#c55cff' },
  { id: 'eligibility', label: 'Eligibility', from: '#ffc06c', to: '#ee7b24', accent: '#ff5f55' },
  { id: 'reporting', label: 'Revenue reporting', from: '#9be8d6', to: '#50c9aa', accent: '#63a7ff' },
] as const;

export const whyHeillerItems = [
  {
    id: 'ownership',
    title: 'One accountable owner',
    body: 'Every claim and handoff has a named owner, so work does not disappear between teams.',
  },
  {
    id: 'handoffs',
    title: 'Fewer stalled handoffs',
    body: 'The next action stays visible, helping queues move without repeated status chasing.',
  },
  {
    id: 'experience',
    title: 'Revenue-cycle focus',
    body: 'The operating model is built around registration, coding, billing, denials, and collections.',
  },
  {
    id: 'visibility',
    title: 'Work you can inspect',
    body: 'Reporting shows what moved, what stalled, and where attention is needed next.',
  },
  {
    id: 'flexibility',
    title: 'A flexible extension',
    body: 'Use Heiller for one revenue-cycle function or connect the work across the full cycle.',
  },
] as const satisfies readonly CopyItem[];

export const workflowCards = [
  {
    id: 'intake',
    kicker: 'Start clean',
    title: 'Intake and registration',
    body: 'Capture the patient, coverage, and authorization details that determine whether the claim can move cleanly.',
    visual: 'registration',
  },
  {
    id: 'prepare',
    kicker: 'Build accurately',
    title: 'Coding and claim preparation',
    body: 'Turn documentation into an accurate, complete claim before it reaches the payer.',
    visual: 'coding',
  },
  {
    id: 'submit',
    kicker: 'Move on time',
    title: 'Claim submission',
    body: 'Submit on schedule, monitor acceptance, and resolve early rejections before they become delays.',
    visual: 'submission',
  },
  {
    id: 'recover',
    kicker: 'Resolve the cause',
    title: 'Denial recovery',
    body: 'Work the denial, identify its cause, and return the learning to the step that created it.',
    visual: 'denial',
  },
  {
    id: 'follow-up',
    kicker: 'Keep aging visible',
    title: 'A/R follow-up',
    body: 'Prioritize aging balances and keep the next payer action visible until the account is resolved.',
    visual: 'ar',
  },
  {
    id: 'report',
    kicker: 'See the operation',
    title: 'Revenue reporting',
    body: 'See what moved, where revenue is waiting, and which handoff needs attention.',
    visual: 'reporting',
  },
] as const;

export const resultMetrics = [
  {
    id: 'clean-claim',
    value: '95%',
    label: 'Clean claim rate',
    context: 'Operating target based on a strong first-submission benchmark.',
  },
  {
    id: 'denial-rate',
    value: '5%',
    label: 'Denial rate',
    context: 'Target ceiling measured against common industry benchmarks.',
  },
  {
    id: 'days-ar',
    value: '35',
    label: 'Days in A/R',
    context: 'Target within a 30 to 40 day benchmark range.',
  },
  {
    id: 'net-collection',
    value: '96%',
    label: 'Net collection rate',
    context: 'Target measured against an effective-collection benchmark.',
  },
] as const;

export const auditFaqs = [
  {
    id: 'includes',
    question: 'What does the revenue audit include?',
    answer: 'A focused review of the reporting and workflow information you already have, followed by a prioritized view of where revenue may be delayed or lost.',
  },
  {
    id: 'information',
    question: 'What information do you need?',
    answer: 'We begin with existing reports and operational context. The first conversation determines what can be reviewed without creating unnecessary preparation work.',
  },
  {
    id: 'timing',
    question: 'How long does it take?',
    answer: 'Timing depends on scope and data availability. We confirm a realistic review window before any information is shared.',
  },
  {
    id: 'privacy',
    question: 'How is sensitive information handled?',
    answer: 'We agree on a secure sharing method and limit the review to the information required for the agreed scope.',
  },
  {
    id: 'next',
    question: 'What happens after the review?',
    answer: 'You receive prioritized findings and recommended next actions, whether or not you engage Heiller for ongoing work.',
  },
] as const;

export const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Services', href: '#services' },
      { label: 'Approach', href: '#approach' },
      { label: 'Performance', href: '#results' },
      { label: 'Why Heiller', href: '#why-heiller' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Revenue audit', href: '#revenue-audit' },
      { label: 'Privacy', href: '#footer' },
    ],
  },
  {
    title: 'Contact',
    links: [{ label: 'connect@heillerrcm.com', href: 'mailto:connect@heillerrcm.com' }],
  },
] as const;

export const contactDetails = {
  eyebrow: 'Contact & location',
  title: 'Our Details',
  subtitle: '',
  officeLabel: 'Office:',
  addressLines: [
    '3101 N. CENTRAL AVE, STE 183 #7497,',
    'Phoenix, AZ, 85012, Maricopa, United States',
  ],
  email: 'connect@heillerrcm.com',
  phone: '+1 (800) 434-5537',
  phoneHref: 'tel:+18004345537',
  coordinates: {
    latitude: 33.48422,
    longitude: -112.07379,
  },
  zoom: 13,
  mapLink: 'https://maps.google.com/?q=3101+N.+Central+Ave,+STE+183+%237497,+Phoenix,+AZ+85012',
  socials: {
    linkedin: 'https://www.linkedin.com/company/143444949',
    x: 'https://x.com',
    instagram: 'https://www.instagram.com/heillerhealth/',
  },
} as const;
