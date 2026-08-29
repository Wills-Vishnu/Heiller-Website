'use client';

import dynamic from 'next/dynamic';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { contactDetails } from '@/lib/home-content';
import { LinkedInIcon, XIcon } from '@/components/team/TeamIcons';
import styles from './our-details.module.css';

// Dynamic import for Leaflet map (client-side only)
const CompanyLocationMap = dynamic(
  () => import('./CompanyLocationMap').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.mapFallback}>
        <span>Loading map...</span>
      </div>
    ),
  },
);

export function OurDetailsSection() {
  return (
    <section
      id="our-details"
      className={styles.detailsSection}
      aria-labelledby="details-heading"
      data-home-section
    >
      <div className={styles.detailsCard}>
        {/* Left Information Block */}
        <div className={styles.leftContent}>
          {contactDetails.eyebrow ? (
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              <span>{contactDetails.eyebrow}</span>
            </div>
          ) : null}

          <h2 id="details-heading" className={styles.title}>
            {contactDetails.title}
          </h2>

          <h3 className={styles.subtitle}>{contactDetails.subtitle}</h3>

          <div className={styles.addressGroup}>
            <span className={styles.officeLabel}>{contactDetails.officeLabel}</span>
            {contactDetails.addressLines.map((line, idx) => (
              <p key={idx} className={styles.addressText}>
                {line}
              </p>
            ))}
          </div>

          <div className={styles.contactRow}>
            <div className={styles.contactItem}>
              <span className={styles.contactPrefix}>E:</span>
              <a
                className={styles.contactLink}
                href={`mailto:${contactDetails.email}`}
              >
                {contactDetails.email}
              </a>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.contactPrefix}>T:</span>
              <a
                className={styles.contactLink}
                href={contactDetails.phoneHref}
              >
                {contactDetails.phone}
              </a>
            </div>
          </div>

          <div className={styles.actionsRow}>
            {contactDetails.mapLink ? (
              <a
                className={styles.mapExternalLink}
                href={contactDetails.mapLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Open in Maps</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ) : null}

            <div className={styles.socialsList}>
              <a
                className={styles.socialLink}
                href={contactDetails.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                className={styles.socialLink}
                href={contactDetails.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
              <a
                className={styles.socialLink}
                href={contactDetails.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Interactive Map with Left-to-Right Soft Fade */}
        <div className={styles.mapWrapper} aria-label="Interactive office location map">
          <CompanyLocationMap
            latitude={contactDetails.coordinates.latitude}
            longitude={contactDetails.coordinates.longitude}
            zoom={contactDetails.zoom}
          />
          <div className={styles.mapFadeOverlay} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

