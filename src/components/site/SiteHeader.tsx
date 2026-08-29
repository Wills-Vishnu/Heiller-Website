'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { Brand } from '@/components/Brand';
import { SmartLink } from '@/components/SmartLink';
import { isActiveHref, menuHasActive, siteCta, siteNav } from '@/lib/site-nav';
import type { SiteNavItem, SiteNavLink } from '@/lib/site-nav';
import styles from './site-header.module.css';

/**
 * The site-wide header. Drop it into any page's dark hero band and pass the
 * current route as `active` to get the underline + accent dot in the right
 * place — no per-page edits needed.
 *
 * Nav content lives in `@/lib/site-nav`, so a new page is one entry there.
 */
export function SiteHeader({ active }: { active?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // A sheet left open while the page scrolls away is just an obstruction.
  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener('scroll', close, { passive: true, once: true });
    return () => window.removeEventListener('scroll', close);
  }, [mobileOpen]);

  return (
    <>
      <header className={styles.header} data-site-header>
        <SmartLink className={styles.brand} href="/" aria-label="Heiller home">
          <Brand inverse />
        </SmartLink>

        <nav className={styles.nav} aria-label="Primary">
          {siteNav.map((item) =>
            item.kind === 'menu' ? (
              <NavMenu key={item.id} item={item} active={active} />
            ) : (
              <NavLink key={item.href} link={item} active={active} />
            ),
          )}
        </nav>

        <SmartLink className={`${styles.cta} ${styles.headerCta}`} href={siteCta.href}>
          {siteCta.label}
          <ArrowUpRight aria-hidden="true" />
        </SmartLink>

        <button
          className={styles.menuButton}
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="site-mobile-menu"
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div
        id="site-mobile-menu"
        className={styles.mobileMenu}
        data-open={mobileOpen || undefined}
        hidden={!mobileOpen}
      >
        <nav aria-label="Mobile primary">
          {siteNav.map((item) =>
            item.kind === 'menu' ? (
              // Dropdowns flatten into a labelled group on mobile: a second
              // tap target to open a submenu inside a sheet is needless.
              <div key={item.id} className={styles.mobileGroup}>
                <p className={styles.mobileGroupTitle}>{item.label}</p>
                {item.items.map((link) => (
                  <SmartLink key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                    {link.label}
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </SmartLink>
                ))}
              </div>
            ) : (
              <SmartLink key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                {item.label}
                <ArrowUpRight aria-hidden="true" size={18} />
              </SmartLink>
            ),
          )}
          <SmartLink href={siteCta.href} onClick={() => setMobileOpen(false)}>
            {siteCta.label}
            <ArrowUpRight aria-hidden="true" size={18} />
          </SmartLink>
        </nav>
      </div>
    </>
  );
}

function NavLink({ link, active }: { link: SiteNavLink; active?: string }) {
  const isActive = isActiveHref(link.href, active);
  return (
    <SmartLink
      className={`${styles.navLink} ${isActive ? styles.navActive : ''}`}
      href={link.href}
      aria-current={isActive ? 'page' : undefined}
    >
      {link.label}
      {isActive ? <span className={styles.navDot} aria-hidden="true" /> : null}
    </SmartLink>
  );
}

/**
 * Disclosure-pattern dropdown rather than a full ARIA menu widget: these are
 * ordinary navigation links, so a button that expands a group of anchors is
 * both simpler and better supported by screen readers than role="menu",
 * which would promise arrow-key semantics we do not want here.
 *
 * Opens on hover for fine pointers, on click/Enter/Space for everyone.
 * Closes on Escape, on click outside, and when focus leaves the whole group.
 */
function NavMenu({ item, active }: { item: Extract<SiteNavItem, { kind: 'menu' }>; active?: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const panelId = `${useId()}-menu`;
  const hasActive = menuHasActive(item, active);

  /**
   * Whether the menu is being held open by an explicit click rather than by
   * the pointer merely resting on it. Without this the two open paths fight:
   * hovering sets open, then the click that follows toggles it straight back
   * shut, so clicking the trigger appears to do nothing at all.
   */
  const latched = useRef(false);

  const close = () => {
    latched.current = false;
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      // Return focus to the trigger so keyboard users are not dumped at the
      // top of the document.
      wrap.current?.querySelector('button')?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  // Hover-to-open is a desktop affordance only; on touch the click handler
  // owns it, and firing both would make the first tap open-then-close.
  const finePointer = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  return (
    <div
      ref={wrap}
      className={styles.menuWrap}
      onPointerEnter={() => {
        if (finePointer()) setOpen(true);
      }}
      onPointerLeave={() => {
        if (finePointer() && !latched.current) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) close();
      }}
    >
      <button
        type="button"
        className={`${styles.navLink} ${styles.menuTrigger} ${hasActive ? styles.navActive : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          // Clicking an already-latched menu closes it; clicking one that is
          // merely hovered promotes it to latched so it survives pointerleave.
          if (open && latched.current) close();
          else {
            latched.current = true;
            setOpen(true);
          }
        }}
      >
        {item.label}
        <ChevronDown className={styles.menuChevron} aria-hidden="true" size={13} />
        {hasActive ? <span className={styles.navDot} aria-hidden="true" /> : null}
      </button>

      <div id={panelId} className={styles.menuPanel} data-open={open || undefined}>
        {item.items.map((link) => {
          const isActive = isActiveHref(link.href, active);
          return (
            <SmartLink
              key={link.href}
              className={styles.menuItem}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              data-active={isActive || undefined}
              onClick={close}
            >
              <span className={styles.menuItemLabel}>{link.label}</span>
              {link.hint ? <span className={styles.menuItemHint}>{link.hint}</span> : null}
            </SmartLink>
          );
        })}
      </div>
    </div>
  );
}
