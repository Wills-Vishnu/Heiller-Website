/**
 * The site-wide primary navigation.
 *
 * Shared by every page that renders `<SiteHeader />`, so adding a page is a
 * change here and nowhere else. Entries are a discriminated union: a plain
 * `link`, or a `menu` that renders as a dropdown on desktop and an expanded
 * group in the mobile sheet.
 *
 * Hrefs are absolute (`/#approach`, not `#approach`) because these render on
 * pages other than the homepage, where a bare hash would resolve against the
 * current route instead of the homepage section.
 */

export type SiteNavLink = {
  readonly label: string;
  readonly href: string;
  /** Optional one-line gloss shown under the label inside a dropdown. */
  readonly hint?: string;
};

export type SiteNavItem =
  | ({ readonly kind: 'link' } & SiteNavLink)
  | {
      readonly kind: 'menu';
      readonly label: string;
      readonly id: string;
      readonly items: readonly SiteNavLink[];
    };

export const siteNav: readonly SiteNavItem[] = [
  { kind: 'link', label: 'Services', href: '/#services' },
  { kind: 'link', label: 'Why Heiller', href: '/#why-heiller' },
  { kind: 'link', label: 'Revenue audit', href: '/#revenue-audit' },
  { kind: 'link', label: 'Our team', href: '/team' },
];

export const siteCta = { label: 'Get a free revenue audit', href: '/#revenue-audit' } as const;

/**
 * True when `href` is the page currently being viewed, including when the
 * active page sits inside a dropdown when a grouped item is present.
 */
export function isActiveHref(href: string, active?: string) {
  return Boolean(active) && href === active;
}

export function menuHasActive(item: SiteNavItem, active?: string) {
  return item.kind === 'menu' && item.items.some((link) => isActiveHref(link.href, active));
}
