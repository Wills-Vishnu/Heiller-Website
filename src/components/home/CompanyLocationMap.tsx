'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './location-map.module.css';

interface CompanyLocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export default function CompanyLocationMap({
  latitude,
  longitude,
  zoom = 13,
}: CompanyLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize Leaflet map
    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom,
      zoomControl: true,
      scrollWheelZoom: false, // Prevents intercepting page scroll accidentally
      attributionControl: true,
    });

    // CartoDB Positron - Light & clean monochrome map style
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      },
    ).addTo(map);

    // Custom glowing gradient marker
    const customIcon = L.divIcon({
      className: 'custom-location-pin',
      html: `
        <div class="${styles.markerWrapper}">
          <div class="${styles.markerHalo}"></div>
          <div class="${styles.markerDot}"></div>
        </div>
      `,
      iconSize: [58, 58],
      iconAnchor: [29, 29],
    });

    // Add marker
    const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    marker.bindPopup(
      `<div style="font-family: inherit; font-size: 13px; font-weight: 500; color: #111;">
        <strong>Heiller</strong><br/><span style="font-size: 11px; color: #666;">Office Location</span>
      </div>`,
      { closeButton: false, offset: [0, -10] },
    );

    mapRef.current = map;

    // Resize handling
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className={styles.mapContainer}>
      <div ref={containerRef} className={styles.mapElement} />
    </div>
  );
}

