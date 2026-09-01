'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Drawer } from 'vaul';
import styles from './home.module.css';

const policySections = [
  {
    title: 'Information you provide',
    body: 'When you request a revenue audit or contact us, we may collect your name, work email, organization, scheduling selection, and the details you choose to share about your revenue-cycle needs.',
  },
  {
    title: 'Technical information',
    body: 'Our website and hosting providers may record information such as your IP address, browser and device type, referring page, access time, and pages viewed. This information helps us operate, secure, and improve the site.',
  },
  {
    title: 'Cookies and similar technologies',
    body: 'Where used, cookies and similar technologies support essential site functions, remember preferences, maintain security, and help us understand site performance. You can control cookies through your browser settings, although some features may then work differently.',
  },
  {
    title: 'How we use information',
    body: 'We use information to respond to requests, arrange and deliver revenue audits, provide and improve our services, protect the website, maintain business records, and meet legal obligations.',
  },
  {
    title: 'How information is shared',
    body: 'We may share information with service providers and professional advisers that support our operations, only when they need it for that work. We may also disclose information when required by law or to protect rights and safety. Heiller does not sell or rent your contact information.',
  },
  {
    title: 'Security and retention',
    body: 'We use reasonable administrative, technical, and organizational safeguards designed to protect information. No online system can guarantee absolute security. We retain information only as long as reasonably necessary for the purpose collected, our legitimate business needs, or legal requirements.',
  },
  {
    title: 'Your choices',
    body: 'Depending on applicable law, you may ask to access, correct, or delete personal information we hold about you. You may also opt out of non-essential communications at any time.',
  },
  {
    title: 'Updates and contact',
    body: 'We may update this notice as our website or practices change. The effective date below shows when it was last revised. For privacy questions or requests, email us at',
  },
] as const;

export function PrivacyDrawer() {
  const [open, setOpen] = useState(false);
  const previousHash = useRef('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncFromHash = () => setOpen(window.location.hash === '#privacy');
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousBodyPosition = body.style.position;
    const previousBodyPositionPriority = body.style.getPropertyPriority('position');
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const scrollPosition = window.scrollY;

    root.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    body.style.setProperty('position', 'fixed', 'important');
    body.style.top = `-${scrollPosition}px`;
    body.style.width = '100%';

    return () => {
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;
      body.style.setProperty('position', previousBodyPosition, previousBodyPositionPriority);
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      if (scrollPosition > 0) window.scrollTo(0, scrollPosition);
    };
  }, [open]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      if (window.location.hash !== '#privacy') previousHash.current = window.location.hash;
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#privacy`);
      return;
    }

    if (window.location.hash === '#privacy') {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}${previousHash.current}`,
      );
    }
  }, []);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={handleOpenChange}
      direction="bottom"
      modal
      disablePreventScroll={false}
    >
      <Drawer.Trigger asChild>
        <button type="button" className={styles.privacyTrigger}>Privacy</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className={styles.privacyOverlay} />
        <Drawer.Content
          className={styles.privacyDrawer}
          aria-describedby={undefined}
          onWheel={(event) => {
            const scrollArea = scrollAreaRef.current;
            if (!scrollArea) return;
            event.preventDefault();
            if (typeof scrollArea.scrollBy === 'function') {
              scrollArea.scrollBy({ top: event.deltaY, behavior: 'smooth' });
            } else {
              scrollArea.scrollTop += event.deltaY;
            }
          }}
        >
          <div className={styles.privacyHeader}>
            <div className={styles.privacyHandleWrap} aria-hidden="true">
              <Drawer.Handle className={styles.privacyHandle} />
            </div>
            <div>
              <Drawer.Title className={styles.privacyTitle}>Privacy notice</Drawer.Title>
            </div>
            <Drawer.Close asChild>
              <button type="button" className={styles.privacyClose} aria-label="Close privacy notice">
                <X aria-hidden="true" />
              </button>
            </Drawer.Close>
          </div>

          <div ref={scrollAreaRef} className={styles.privacyBody} data-testid="privacy-scroll-area">
            <p className={styles.privacyEffective}>Effective August 22, 2026</p>
            <p className={styles.privacyLead}>
              This notice explains how Heiller collects and uses information when you visit this website,
              request a revenue audit, or contact us.
            </p>
            {policySections.map((section) => (
              <section key={section.title} className={styles.privacySection}>
                <h3>{section.title}</h3>
                <p>
                  {section.body}
                  {section.title === 'Updates and contact' ? (
                    <> <a href="mailto:connect@heillerrcm.com">connect@heillerrcm.com</a>.</>
                  ) : null}
                </p>
              </section>
            ))}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
