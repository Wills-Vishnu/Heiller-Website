'use client';

import { useRef, useState } from 'react';
import {
  Check,
  Folder,
  Instagram,
  Layers,
  LockKeyhole,
  Plus,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Brand } from '@/components/Brand';
import { HeroSection } from '@/components/site/HeroSection';
import { SiteHeader } from '@/components/site/SiteHeader';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { LinkedInIcon, XIcon } from '@/components/team/TeamIcons';
import {
  auditFaqs,
  complianceItems,
  contactDetails,
  footerGroups,
  resultMetrics,
  servicePills,
  whyHeillerItems,
} from '@/lib/home-content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import {
  dampAngularVelocity,
  getOrbitBlur,
  getOrbitDepth,
  getOrbitTransform,
  getTargetAngularVelocity,
} from '@/lib/orbit-motion';
import styles from './home.module.css';
import { WorkflowLedger } from './WorkflowLedger';
import { HeroFlow } from './HeroFlow';
import { MetricMeshProvider, MetricMeshValue } from './MetricMeshValues';
import { ArrowButton } from './ArrowButton';
import { PrivacyDrawer } from './PrivacyDrawer';
import { CalBooking } from './CalBooking';
import { OurDetailsSection } from './OurDetailsSection';

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`${styles.eyebrow} ${light ? styles.eyebrowLight : ''}`} data-eyebrow><span data-eyebrow-marker aria-hidden="true" />{children}</p>;
}

function Hero() {
  return (
    <HeroSection id="top" className={styles.hero} data-home-section aria-labelledby="hero-title">
      <SiteHeader />
      <HeroFlow />
      <div className={styles.heroCopy} data-hero-copy>
        <h1 id="hero-title">Revenue cycle management for healthcare teams</h1>
        <p>One accountable team handles the work behind every claim, from registration through payment.</p>
        <ArrowButton label="Get a free revenue audit" href="#revenue-audit" />
      </div>
    </HeroSection>
  );
}

function ApproachVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className={`${styles.approachVisual} ${styles.approachShield}`} aria-hidden="true">
        <span className={styles.dotField} />
        <ShieldCheck />
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className={`${styles.approachVisual} ${styles.approachIdentity}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <UserRound />
        <i><LockKeyhole size={15} /></i>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className={`${styles.approachVisual} ${styles.approachTransfer}`} aria-hidden="true">
        <svg viewBox="0 0 170 110">
          <path d="M16 82 H104 Q134 82 134 52 V24" />
          <circle cx="16" cy="82" r="3" />
          <circle cx="134" cy="24" r="3" />
          {/* Rides the route above. cx/cy stay at 0 — CSS `offset-path` in
              home.module.css places it, using the same `d` as the path so it
              tracks the real curve rather than an approximation. */}
          <circle className={styles.transferDot} cx="0" cy="0" r="2.6" />
        </svg>
        <Folder />
        <i><ShieldCheck size={18} /></i>
      </div>
    );
  }

  if (index === 3) {
    return (
      <div className={`${styles.approachVisual} ${styles.approachTrace}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <i />
        <b />
      </div>
    );
  }

  if (index === 4) {
    return (
      <div className={`${styles.approachVisual} ${styles.approachLayers}`} aria-hidden="true">
        <Layers />
        <span />
        <span />
      </div>
    );
  }

  return (
    <div className={`${styles.approachVisual} ${styles.approachContinuity}`} aria-hidden="true">
      <svg viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="58" />
        <circle cx="80" cy="80" r="29" />
      </svg>
      <Check />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function ComplianceApproach() {
  return (
    <section id="approach" className={styles.approach} data-home-section aria-labelledby="approach-title">
      <div className={styles.approachIntro}>
        <Eyebrow>Our approach</Eyebrow>
        <h2 id="approach-title">
          <span>You focus on care.</span>
          <span>We’ll keep the work behind it secure and supported.</span>
        </h2>
      </div>
      <div className={styles.complianceGrid}>
        {complianceItems.map((item, index) => (
          <article key={item.id} className={index === 3 ? styles.complianceDark : ''} data-compliance-card>
            <div className={styles.complianceTop}>
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <ApproachVisual index={index} />
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DedicatedTeam() {
  return (
    <section id="services" className={styles.team} data-home-section aria-labelledby="team-title">
      <div className={styles.pillField} data-pill-field>
        <h2 id="team-title">A dedicated team,<br />fully embedded</h2>
        {servicePills.map((pill, index) => (
          <span
            key={pill.id}
            className={styles.servicePill}
            data-service-pill
            data-pill-palette={pill.id}
            data-index={index}
            style={{ '--pill-from': pill.from, '--pill-to': pill.to, '--pill-accent': pill.accent } as React.CSSProperties}
          >{pill.label}</span>
        ))}
      </div>
    </section>
  );
}

const REASON_ROUTE_PATH = 'M34 0 V82 M154 82 H834 Q842 82 842 90 V202 M842 202 H154 Q146 202 146 210 V322 M154 322 H842 Q850 322 850 330 V442 M154 442 H842 Q850 442 850 450 V556';

function WhyHeiller() {
  return (
    <section id="why-heiller" className={styles.why} data-home-section aria-labelledby="why-title">
      <div className={styles.whyIntro}>
        <div>
          <Eyebrow>Why Heiller</Eyebrow>
          <h2 id="why-title">Built to stay close<br />to the work.</h2>
        </div>
        <p className={styles.whyStatement}>At Heiller, we work as an extension of your team. We take ownership, stay close to the work, and keep every handoff visible.</p>
      </div>
      <div className={styles.reasonRoute}>
        <svg className={styles.reasonPath} viewBox="0 0 990 620" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="reason-route-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#F3A7C8" stopOpacity="1" />
              <stop offset="0.28" stopColor="#EE8FAE" stopOpacity="1" />
              <stop offset="0.56" stopColor="#FF8E7B" stopOpacity=".96" />
              <stop offset="0.8" stopColor="#FF9E68" stopOpacity=".72" />
              <stop offset="1" stopColor="#C1A8E8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.reasonPathBase} d={REASON_ROUTE_PATH} pathLength={1000} />
          <path className={styles.reasonPathGlow} d={REASON_ROUTE_PATH} pathLength={1000} />
        </svg>
        <ol className={styles.reasonList}>
          {whyHeillerItems.slice(0, 4).map((item, index) => {
            const number = String(index + 1).padStart(2, '0');
            const rightAligned = index % 2 === 1;

            return (
              <li
                key={item.id}
                className={styles.reason}
                data-reason-row
                data-number-side={rightAligned ? 'right' : 'left'}
              >
                <span className={styles.reasonNumber} aria-hidden="true">{number}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
      <div className={styles.whyCtaArrow} aria-hidden="true">
        <svg width="18" height="30" viewBox="0 0 18 30" fill="none">
          <path d="M9 0 V22 M4 17 L9 23 L14 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className={styles.whyCta}><ArrowButton label="See how we work" href="#team-extension" /></div>
    </section>
  );
}

function TeamExtension() {
  return (
    <section id="team-extension" className={styles.work} data-home-section aria-labelledby="work-title">
      <div className={styles.workHead}>
        <h2 id="work-title">We work as an extension of your team</h2>
      </div>
      <WorkflowLedger />
    </section>
  );
}

function Results() {
  return (
    <section id="results" className={styles.results} data-home-section aria-labelledby="results-title">
      <div className={styles.resultsHead}>
        <Eyebrow>Performance standard</Eyebrow>
        <h2 id="results-title">
          <span className={styles.headingLine}>Measure the work</span>{' '}
          <span className={styles.headingLine}>that moves revenue.</span>
        </h2>
      </div>
      <MetricMeshProvider>
        <div className={styles.metricGrid}>
          {resultMetrics.map((metric, index) => (
            <article key={metric.id} data-result-metric>
              <MetricMeshValue id={metric.id} value={metric.value} index={index} animate />
              <h3>{metric.label}</h3>
              <p>{metric.context}</p>
            </article>
          ))}
        </div>
      </MetricMeshProvider>
    </section>
  );
}

function AuditBooking() {
  const [openFaq, setOpenFaq] = useState<string | null>('includes');
  return (
    <section id="revenue-audit" className={styles.audit} data-home-section aria-labelledby="audit-title">
      <div className={styles.auditHead}>
        <div>
          <Eyebrow>Free revenue audit</Eyebrow>
          <h2 id="audit-title">
            <span className={styles.headingLine}>Find where revenue</span>{' '}
            <span className={styles.headingLine}>is getting stuck.</span>
          </h2>
        </div>
        <p>We review the reporting you already have, identify the most important leaks, and show you what to fix first.</p>
      </div>
      <CalBooking />
      <OurDetailsSection />
      <div className={styles.faqWrap}>
        <div>
          <Eyebrow>Faq</Eyebrow>
          <h2>
            <span className={styles.headingLine}>Questions before</span>{' '}
            <span className={styles.headingLine}>we begin</span>
          </h2>
        </div>
        <div className={styles.faqList}>
          {auditFaqs.map((faq) => {
            const open = openFaq === faq.id;
            return (
              <article key={faq.id}>
                <button type="button" aria-expanded={open} aria-controls={`answer-${faq.id}`} onClick={() => setOpenFaq(open ? null : faq.id)}>
                  <span>{faq.question}</span><Plus size={17} />
                </button>
                <div id={`answer-${faq.id}`} className={styles.faqAnswer} data-open={open || undefined}><p>{faq.answer}</p></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}



function RevealFooter() {
  return (
    <footer id="footer" className={styles.footer} data-home-section>
      <div className={styles.footerTop}>
        <Brand />
        <p>Revenue-cycle work with clear ownership, close collaboration, and fewer lost handoffs.</p>
        <ArrowButton label="Start with a revenue audit" href="#revenue-audit" dark />
      </div>
      <div className={styles.footerLinks}>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <strong>{group.title}</strong>
            {group.links.map((link) => {
              if (link.label === 'Privacy') {
                return <PrivacyDrawer key={link.label} />;
              }
              const isExternal = link.href.startsWith('http');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
            {group.title === 'Contact' ? (
              <div className={styles.footerSocialLogos}>
                <a
                  href={contactDetails.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={styles.footerSocialLink}
                >
                  <LinkedInIcon />
                </a>
                <a
                  href={contactDetails.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className={styles.footerSocialLink}
                >
                  <XIcon />
                </a>
                <a
                  href={contactDetails.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={styles.footerSocialLink}
                >
                  <Instagram size={14} />
                </a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className={styles.footerBottom}>
        <span>© 2026 Heiller</span>
        <span>Revenue cycle management</span>
      </div>
    </footer>
  );
}

export function HomeExperience() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const context = gsap.matchMedia();
    context.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-hero-copy] > *', { y: 28, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out' });
      gsap.utils.toArray<HTMLElement>('[data-compliance-card]').forEach((card, index) => {
        gsap.from(card, { y: 50, autoAlpha: 0, duration: 0.7, delay: index * 0.02, scrollTrigger: { trigger: card, start: 'top 88%' } });
      });
      gsap.from('[data-service-pill]', { autoAlpha: 0, stagger: 0.05, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: '#services', start: 'top 70%' } });
      gsap.utils.toArray<HTMLElement>('[data-reason-row]').forEach((row) => gsap.from(row, { y: 24, autoAlpha: 0, scrollTrigger: { trigger: row, start: 'top 86%' } }));
      gsap.from('[data-result-metric]', { y: 50, autoAlpha: 0, stagger: 0.08, scrollTrigger: { trigger: '#results', start: 'top 70%' } });

    });

    context.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-workflow-row]').forEach((row) => {
        gsap.from(row, { y: 20, autoAlpha: 0, duration: 0.5, scrollTrigger: { trigger: row, start: 'top 90%' } });
      });
    });

    const field = root.current?.querySelector<HTMLElement>('[data-pill-field]');
    const pills = field ? Array.from(field.querySelectorAll<HTMLElement>('[data-service-pill]')) : [];
    if (!field || pills.length === 0) return () => context.revert();

    let bounds = field.getBoundingClientRect();
    let orbitAngle = 0;
    let angularVelocity = 0;
    let sampledScrollVelocity = 0;
    let lastScrollSample = 0;
    let lastTick = 0;
    let inView = false;
    let pageVisible = document.visibilityState === 'visible';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const layoutOrbit = () => {
      const compact = bounds.width < 768;
      const mobileDepth = window.innerWidth < 768;
      pills.forEach((pill, index) => {
        const transform = getOrbitTransform({
          index,
          angle: orbitAngle,
          width: bounds.width,
          height: bounds.height,
          compact,
        });
        gsap.set(pill, {
          x: transform.x,
          y: transform.y,
          xPercent: -50,
          yPercent: -50,
          rotation: 0,
          zIndex: getOrbitDepth(transform.x),
          filter: `blur(${getOrbitBlur({
            x: transform.x,
            width: bounds.width,
            mobile: mobileDepth,
            reducedMotion,
          })}px)`,
          force3D: true,
        });
      });
    };

    const updateBounds = () => {
      bounds = field.getBoundingClientRect();
      layoutOrbit();
    };
    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === 'visible';
    };
    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(field);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false;
    }, { rootMargin: '12% 0px' });
    intersectionObserver.observe(field);

    const orbitTrigger = ScrollTrigger.create({
      trigger: field,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        sampledScrollVelocity = self.getVelocity();
        lastScrollSample = performance.now();
      },
    });

    const renderOrbit = (time: number) => {
      const deltaSeconds = lastTick === 0 ? 0 : Math.min(time - lastTick, 0.05);
      lastTick = time;
      if (!pageVisible) return;

      const freshScrollSample = performance.now() - lastScrollSample <= 80;
      const targetVelocity = !reducedMotion && inView && freshScrollSample
        ? getTargetAngularVelocity(sampledScrollVelocity)
        : 0;
      angularVelocity = dampAngularVelocity(angularVelocity, targetVelocity, deltaSeconds);
      if (!reducedMotion && inView) orbitAngle += angularVelocity * deltaSeconds;
      if (inView || Math.abs(angularVelocity) > 0.001) layoutOrbit();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    gsap.ticker.add(renderOrbit);
    layoutOrbit();

    return () => {
      context.revert();
      gsap.ticker.remove(renderOrbit);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      orbitTrigger.kill();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, { scope: root });

  return (
    <>
      <div ref={root} className={styles.home} data-home-experience>
        <Hero />
        <DedicatedTeam />
        <ComplianceApproach />
        <Results />
        <WhyHeiller />
        <TeamExtension />
        <AuditBooking />
        <RevealFooter />
      </div>
      <div className={styles.viewportBlur} aria-hidden="true">
        <ProgressiveBlur position="bottom" height="100%" />
      </div>
    </>
  );
}
