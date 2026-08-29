import { Brand } from '@/components/Brand';
import { SmartLink } from '@/components/SmartLink';
import { teamFooterGroups } from '@/lib/team-content';
import { contactDetails } from '@/lib/home-content';
import { ArrowUpRightIcon, LinkedInIcon, XIcon } from './TeamIcons';
import { Instagram } from 'lucide-react';
import styles from './team.module.css';

export function TeamFooter() {
  return (
    <footer id="footer" className={styles.footer} data-anim="footer">
      <div className={styles.footerTop}>
        <SmartLink href="/" aria-label="Heiller home"><Brand /></SmartLink>
        <p className={styles.footerBlurb}>
          Revenue-cycle work with clear ownership, close collaboration, and fewer lost handoffs.
        </p>
        <SmartLink className={`${styles.cta} ${styles.ctaSolid}`} href="/#revenue-audit">
          Start with a revenue audit
          <ArrowUpRightIcon />
        </SmartLink>
      </div>

      <div className={styles.footerLinks}>
        {teamFooterGroups.map((group) => (
          <div key={group.title}>
            <strong>{group.title}</strong>
            {group.links.map((link) => (
              <SmartLink key={link.label} href={link.href}>{link.label}</SmartLink>
            ))}
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
        <span>© 2026 Heiller RCM</span>
        <span>Revenue cycle management</span>
      </div>
    </footer>
  );
}
