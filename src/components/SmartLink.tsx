import Link from 'next/link';

/**
 * Routes internal hrefs through `next/link` (client-side navigation, prefetch)
 * while letting `mailto:`, `tel:` and absolute URLs fall through to a plain
 * anchor. Content files can then hold a single flat list of hrefs without
 * knowing which kind each one is.
 */
export function SmartLink({
  href,
  children,
  ...rest
}: { href: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return <Link href={href} {...rest}>{children}</Link>;
  }
  return <a href={href} {...rest}>{children}</a>;
}
