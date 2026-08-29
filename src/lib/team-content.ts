import type { StaticImageData } from 'next/image';
import jaganPhoto from '@/img/team/jagan.png';
import prabhuPhoto from '@/img/team/prabhu.png';
import praneethPhoto from '@/img/team/praneeth.png';
import karthikPhoto from '@/img/team/karthik.png';
import vishnuPhoto from '@/img/team/vishnu.png';
import JijinPhoto from '@/img/team/jijin.png';
import sushanthPhoto from '@/img/team/sushanth.png';

/**
 * Every piece of copy and roster data for the /team page.
 *
 * `body` is the short description shown on the team card.
 * `description` is the detailed profile content shown on the
 * individual person's profile page.
 *
 * Swapping a person is a change here and nowhere else.
 *
 * `img` is the primary image location used by profile pages.
 * `photo` is retained for compatibility with existing components.
 *
 * Images should be placed inside:
 *
 * public/team/
 *
 * Example:
 *
 * public/team/karthik-b.jpg
 *
 * and referenced as:
 *
 * img: '/team/karthik-b.jpg'
 */

export type NavLink = {
  readonly label: string;
  readonly href: string;
};

export type Person = {
  readonly id: string;
  readonly name: string;
  readonly role: string;

  /**
   * Short description shown below the person's image
   * on the team card.
   */
  readonly body: string;

  /**
   * Detailed description shown on the person's
   * individual profile page.
   */
  readonly description: string;

  /**
   * Primary image location.
   *
   * This is the field that should be used by
   * individual profile pages.
   *
   * Example:
   *
   * '/team/karthik-b.jpg'
   */
  readonly img: string | StaticImageData;

  /**
   * Existing image field retained for compatibility
   * with older components.
   *
   * Example:
   *
   * '/team/karthik-b.jpg'
   */
  readonly photo?: string | StaticImageData;

  readonly linkedin?: string;

  /**
   * X (formerly Twitter) profile URL.
   *
   * No one on the roster has one on file yet — this field exists so a
   * future addition is a one-line data change, not a component change.
   * Components must treat it as optional and never fabricate a URL.
   */
  readonly x?: string;
};

export type TeamStat = {
  readonly id: string;
  readonly icon:
    | 'specialists'
    | 'experience'
    | 'compliance'
    | 'embedded';
  readonly value: string;
  readonly label: string;
  readonly body: string;
};

export type Principle = {
  readonly id: string;
  readonly icon:
    | 'ownership'
    | 'communication'
    | 'proximity'
    | 'outcomes';
  readonly title: string;
  readonly body: string;
};



/**
 * Matched against a nav `href` to place the active underline + dot.
 *
 * The nav itself now lives in `@/lib/site-nav` and is shared by every
 * page through <SiteHeader />.
 */
export const TEAM_NAV_ACTIVE = '/team';

/**
 * ---------------------------------------------------------
 * TEAM HERO
 * ---------------------------------------------------------
 */

export const teamHero = {
  eyebrow: 'Our team',

  title: 'People who care about the work behind every claim.',

  body:
    "We're coders, billers, analysts, technologists, and problem-solvers who take ownership, stay close to the details, and focus on results that matter.",
} as const;

/**
 * ---------------------------------------------------------
 * TEAM STATS
 * ---------------------------------------------------------
 */

export const teamStats = [
  {
    id: 'specialists',

    icon: 'specialists',

    value: '50+',

    label: 'RCM specialists',

    body:
      'Experts across coding, billing, denials, A/R, technology, and reporting.',
  },

  {
    id: 'experience',

    icon: 'experience',

    value: '15+',

    label: 'Years of experience',

    body:
      'Collective experience in healthcare revenue cycle operations.',
  },

  {
    id: 'compliance',

    icon: 'compliance',

    value: '100%',

    label: 'HIPAA-conscious',

    body:
      'Security, compliance, and privacy built into everything we do.',
  },

  {
    id: 'embedded',

    icon: 'embedded',

    value: 'One team',

    label: 'Fully embedded',

    body:
      'We work as an extension of your team with the same goals.',
  },
] as const satisfies readonly TeamStat[];

/**
 * ---------------------------------------------------------
 * WORKING PRINCIPLES
 * ---------------------------------------------------------
 */

export const workingPrinciples = [
  {
    id: 'ownership',

    icon: 'ownership',

    title: 'We take ownership',

    body:
      'Every claim has a name behind it. We own it from start to finish.',
  },

  {
    id: 'communication',

    icon: 'communication',

    title: 'We communicate clearly',

    body:
      "You always know what's happening and why it matters.",
  },

  {
    id: 'proximity',

    icon: 'proximity',

    title: 'We stay close to the work',

    body:
      "We're involved at every step, not just when there's a problem.",
  },

  {
    id: 'outcomes',

    icon: 'outcomes',

    title: 'We focus on outcomes',

    body:
      'We measure what matters and keep improving every day.',
  },
] as const satisfies readonly Principle[];

/**
 * ---------------------------------------------------------
 * LEADERSHIP INTRO
 * ---------------------------------------------------------
 */

export const leadershipIntro = {
  eyebrow: 'Meet our leadership',

  title: 'Leaders who set the standard.',

  body:
    '',

  /**
   * The heading inside the die-cut card on the desktop showcase.
   *
   * One array entry per rendered line.
   * Keep each line short.
   */
  cardTitle: ['Meet the', 'principals'],
} as const;

/**
 * ---------------------------------------------------------
 * LEADERSHIP TEAM
 * ---------------------------------------------------------
 *
 * BODY:
 * Short card copy.
 *
 * DESCRIPTION:
 * Detailed profile-page copy.
 *
 * IMG:
 * Exact location of the person's profile image.
 * ---------------------------------------------------------
 */

export const leadership = [
  {
    id: 'karthik-b',

    name: 'Karthik B',

    role: 'Founder & Chief Executive Officer (CEO)',

    body:
      'Leads company strategy, client relationships, claims oversight, growth, team leadership, and operational excellence.',

    description:
      'Karthik B is the Founder and Chief Executive Officer, responsible for shaping the company’s overall vision, strategy, and direction. He leads key client relationships and works closely with partners to understand their needs and deliver long-term value. Karthik oversees claims performance and maintains a strong focus on operational excellence across the organization. His leadership is centered on building scalable systems, developing high-performing teams, and creating a culture of accountability. He works across the business to align people, processes, and technology toward measurable outcomes. His focus is on sustainable growth while maintaining the quality and reliability that clients expect. Through hands-on leadership and strategic decision-making, he continues to drive the company forward.',

    img:  karthikPhoto,

    photo: karthikPhoto,

    linkedin:
      'https://www.linkedin.com/in/karthik-b-70a1b7163/',
  },

  {
    id: 'prabhu',

    name: 'Prabhu',

    role: 'Chief Coding & Compliance Officer (CCO)',

    body:
      'Leads coding quality, audits, compliance, clinical documentation, education, and accuracy across client accounts.',

    description:
      'Prabhu serves as the Chief Coding & Compliance Officer, leading the organization’s coding quality and compliance functions. His responsibilities include overseeing coding audits, maintaining accuracy, and ensuring that coding practices align with established regulatory and clinical standards. He works closely with coding teams to identify quality gaps and strengthen documentation practices across client accounts. Prabhu also supports continuous education and process improvement to help teams maintain consistent coding performance. His approach combines detailed quality reviews with practical guidance for improving day-to-day coding operations. He plays an important role in protecting the integrity of the revenue cycle through accurate and compliant coding. His focus remains on building reliable standards that support both clients and healthcare organizations.',

    img: prabhuPhoto,

    photo: prabhuPhoto,

    linkedin: '#',
  },

  {
    id: 'Jaganath',

    name: 'Jagan',

    role: 'Chief Billing Officer (CBO)',

    body:
      'Leads billing operations, SOPs, workflow ownership, process improvement, accuracy, efficiency, and billing excellence.',

    description:
      'Jagan serves as the Chief Billing Officer, overseeing the organization’s billing operations and the processes that support consistent revenue performance. He owns billing workflows and standard operating procedures, ensuring that teams have clear and reliable processes to follow. Jagan focuses on improving efficiency, accuracy, and turnaround times throughout the billing cycle. He continuously evaluates workflows to identify bottlenecks, reduce errors, and create opportunities for improvement. His leadership helps establish consistent execution across billing teams while maintaining a strong focus on quality. He works closely with operational teams to ensure billing processes remain aligned with client requirements and business goals. His objective is to build billing operations that are efficient, scalable, measurable, and dependable.',

    img: jaganPhoto,

    photo: jaganPhoto,

    linkedin: 'https://www.linkedin.com/in/jagan-k-533732199/',
  },

  {
    id: 'praneeth',

    name: 'Praneeth',

    role: 'Chief Revenue Cycle Officer (CRO)',

    body:
      'Leads A/R, denials, charge entry, revenue-cycle operations, collections, financial performance, and process improvement.',

    description:
      'Praneeth serves as the Chief Revenue Cycle Officer, leading key areas of revenue-cycle operations including accounts receivable, denials, charge entry, and overall financial performance. He focuses on improving collections while identifying and addressing factors that contribute to revenue leakage. Praneeth works closely with operational teams to strengthen account resolution, reduce delays, and improve cash-flow performance. He analyzes revenue-cycle trends and performance data to identify opportunities for process improvement. His leadership connects day-to-day operational execution with broader financial objectives. He is focused on creating efficient revenue-cycle processes that deliver measurable improvements for clients. Through continuous monitoring and optimization, he works to ensure every stage of the revenue cycle contributes to stronger and more sustainable results.',

    img: praneethPhoto,

    photo: praneethPhoto,

    linkedin:
      'https://www.linkedin.com/in/praneeth-kumar-309aa1235/',
  },

  {
    id: 'vishnu',

    name: 'Vishnu Varshan',

    role: 'Chief Technology Officer (CTO)',

    body:
      'Leads technology vision, digital strategy, product development, automation, infrastructure, security, and innovation.',

    description:
      'Vishnu Varshan serves as the Chief Technology Officer, leading the company’s technology vision and digital strategy. He focuses on building scalable technology solutions that support modern revenue-cycle operations and improve the way teams work. His responsibilities include overseeing product development, technical infrastructure, automation, and technology-driven process improvements. Vishnu works to connect business requirements with practical and reliable technology solutions. He places strong emphasis on security, scalability, performance, and long-term maintainability. Through automation and digital innovation, he aims to reduce repetitive work and improve operational efficiency. His focus is on building technology that is dependable, scalable, and capable of creating measurable value for clients.',

    img: vishnuPhoto,

    photo: vishnuPhoto,

    linkedin: 'https://www.linkedin.com/in/vishnuvarshan-saravanakarthikeyan/',
  },

  {
    id: 'sushanth',

    name: 'Sushanth Krushna',

    role: 'Chief Technology Architect (CTA)',

    body:
      'Leads technical architecture, scalable systems, solution design, security standards, optimization, and engineering direction.',

    description:
      'Sushanth Krushna serves as the Chief Technology Architect, responsible for designing and guiding the technical architecture behind the company’s digital solutions. He focuses on creating reliable, scalable, and maintainable systems that can support evolving business requirements. Sushanth establishes technical standards around system performance, security, reliability, and long-term maintainability. He works closely with engineering teams to guide important architectural and technical decisions. His role also involves identifying opportunities to modernize existing systems and improve overall technology performance. By creating strong technical foundations, he helps ensure that new solutions can scale effectively as the organization grows. His focus is on building technology architectures that are practical, secure, resilient, and ready for the future.',

    img: sushanthPhoto,

    photo: sushanthPhoto,

    linkedin: '#',
  },

  {
    id: 'jijin',

    name: 'Jijin Jose',

    role: 'Chief Strategy Officer (CSO)',

    body:
      'Leads business strategy, growth initiatives, market opportunities, client value, strategic planning, and long-term direction.',

    description:
      'Jijin Jose serves as the Chief Strategy Officer, helping shape the company’s strategic direction and long-term growth initiatives. He focuses on identifying opportunities that strengthen the organization’s services, capabilities, and value to clients. Jijin works across teams to translate broader business objectives into clear and actionable strategic priorities. He evaluates market trends, emerging opportunities, and operational insights to support informed decision-making. His role involves improving alignment between different areas of the organization and ensuring that strategic initiatives are executed effectively. He maintains a strong focus on creating sustainable competitive advantages while keeping client value at the center of strategic planning. Through thoughtful planning and cross-functional collaboration, he helps position the organization for continued growth and impact.',

    img: JijinPhoto,

    photo: JijinPhoto,

    linkedin: 'https://www.linkedin.com/in/jijinjose/',
  },
] as const satisfies readonly Person[];

/**
 * ---------------------------------------------------------
 * TEAM MEMBERS INTRO
 * ---------------------------------------------------------
 */

export const membersIntro = {
  eyebrow: 'Our team members',

  title: 'The team behind your success.',

  body:
    'A dedicated group of specialists working together as an extension of your team—focused on accuracy, efficiency, technology, and outcomes.',
} as const;

/**
 * ---------------------------------------------------------
 * TEAM MEMBERS
 * ---------------------------------------------------------
 */

export const teamMembers = [
  {
    id: 'vivek-tiwari',

    name: 'Vivek Tiwari',

    role: 'AR Follow-up Specialist',

    body:
      'Focused on A/R follow-ups, patient communication, account resolution, and reducing outstanding receivables.',

    description:
      'Vivek Tiwari specializes in accounts receivable follow-up and works closely with teams to resolve outstanding balances efficiently. His responsibilities include monitoring accounts, conducting timely follow-ups, and communicating with patients and relevant stakeholders when required. He focuses on identifying barriers that delay account resolution and helping move outstanding receivables toward closure. Vivek pays close attention to account details and follows structured processes to maintain consistent follow-up activity. His work supports improved A/R performance and helps reduce unnecessary delays in the revenue cycle. He contributes to maintaining accurate account status and ensuring that unresolved items receive appropriate attention. His focus is on consistent execution, timely communication, and improving overall A/R outcomes.',

    img: '/team/vivek-tiwari.jpg',

    photo: '/team/vivek-tiwari.jpg',

    linkedin: '#',
  },

  {
    id: 'pooja-desai',

    name: 'Pooja Desai',

    role: 'Eligibility Specialist',

    body:
      'Focused on eligibility verification, benefits validation, accuracy, patient coverage, and smoother front-end workflows.',

    description:
      'Pooja Desai specializes in eligibility verification and benefits validation, helping ensure accurate coverage information is available throughout the patient journey. She carefully reviews insurance eligibility and benefit details to identify coverage information that may affect billing and claims. Her work helps teams reduce avoidable errors and improve the accuracy of information captured during the front-end process. Pooja follows structured verification procedures while paying close attention to important coverage details. She supports smoother workflows by helping ensure that eligibility information is accurate and available when needed. Her attention to detail contributes to reducing preventable billing and claim issues. Her focus is on accuracy, consistency, and creating a stronger foundation for the revenue cycle.',

    img: '/team/pooja-desai.jpg',

    photo: '/team/pooja-desai.jpg',

    linkedin: '#',
  },

  {
    id: 'aditya-singh',

    name: 'Aditya Singh',

    role: 'Reporting Analyst',

    body:
      'Builds reports, dashboards, performance insights, operational metrics, data analysis, and actionable business intelligence.',

    description:
      'Aditya Singh works as a Reporting Analyst, transforming operational and revenue-cycle data into clear and actionable insights. He develops reports and dashboards that help teams understand performance, identify trends, and monitor important operational metrics. Aditya focuses on presenting complex information in a way that supports faster and more informed decision-making. His work helps leadership and operational teams identify areas of improvement and track progress over time. He pays close attention to data accuracy, consistency, and meaningful performance indicators. By connecting data with operational objectives, he helps teams better understand what is working and where improvements are needed. His focus is on making reporting practical, transparent, and useful for driving measurable results.',

    img: '/team/aditya-singh.jpg',

    photo: '/team/aditya-singh.jpg',

    linkedin: '#',
  },
] as const satisfies readonly Person[];



/**
 * ---------------------------------------------------------
 * FOOTER
 * ---------------------------------------------------------
 */

export const teamFooterGroups = [
  {
    title: 'Explore',

    links: [
      {
        label: 'Approach',
        href: '/#approach',
      },

      {
        label: 'Services',
        href: '/#services',
      },

      {
        label: 'Why Heiller',
        href: '/#why-heiller',
      },

      {
        label: 'Revenue audit',
        href: '/#revenue-audit',
      },
    ],
  },

  {
    title: 'Company',

    links: [
      {
        label: 'About us',
        href: '/#approach',
      },

      {
        label: 'Careers',
        href: 'mailto:connect@heillerrcm.com',
      },

      {
        label: 'Privacy',
        href: '/#footer',
      },
    ],
  },

  {
    title: 'Contact',

    links: [
      {
        label: 'connect@heillerrcm.com',
        href: 'mailto:connect@heillerrcm.com',
      },
    ],
  },
] as const satisfies readonly {
  title: string;
  links: readonly NavLink[];
}[];

