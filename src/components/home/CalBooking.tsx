'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
import styles from './home.module.css';

const CAL_LINK = 'heiller/revenue-audit';

export function CalBooking() {
  useEffect(() => {
    void getCalApi({ namespace: 'revenue-audit' }).then((cal) => {
      cal('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#ff682c' },
          dark: { 'cal-brand': '#ff682c' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    });
  }, []);

  return (
    <Cal
      namespace="revenue-audit"
      calLink={CAL_LINK}
      config={{ layout: 'month_view', theme: 'light' }}
      className={styles.calBooking}
      data-cal-link={CAL_LINK}
      aria-label="Book a free revenue audit"
    />
  );
}
