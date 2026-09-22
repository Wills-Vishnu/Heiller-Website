/**
 * Our Details - Interactive Map Controller
 * Initializes Leaflet map with clean OpenStreetMap tiles and custom animated beacon marker.
 */

(function () {
  const mapContainer = document.getElementById("our-details-map");
  if (!mapContainer) return;

  const PHOENIX_COORDS = [33.4839, -112.0740]; // 3101 N Central Ave, Phoenix, AZ 85012
  const ZOOM_LEVEL = 13;

  function initMap() {
    if (!window.L || mapContainer._leaflet_id) return;

    try {
      const map = window.L.map(mapContainer, {
        center: PHOENIX_COORDS,
        zoom: ZOOM_LEVEL,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      // Keep zoom in/out controls positioned in the top right
      window.L.control.zoom({ position: "topright" }).addTo(map);

      // CARTO Voyager tiles with user license key and automatic OpenStreetMap fallback
      const cartoTileUrl =
        "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_2jeu_1_c0503e1108327151a000e303";
      const osmTileUrl =
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      const tileLayer = window.L.tileLayer(cartoTileUrl, {
        subdomains: "abcd",
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
      });

      let fallbackUsed = false;
      tileLayer.on("tileerror", function () {
        if (fallbackUsed) return;
        fallbackUsed = true;
        console.warn("CARTO tile error; switching to OpenStreetMap fallback.");
        tileLayer.setUrl(osmTileUrl);
      });

      tileLayer.addTo(map);

      // Custom pulsing beacon marker positioned at exact office coordinates
      const markerHtml = `
        <div class="our-details__marker" aria-hidden="true">
          <div class="our-details__marker-ring"></div>
          <div class="our-details__marker-halo"></div>
          <div class="our-details__marker-dot"></div>
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: "our-details__marker-wrap",
        html: markerHtml,
        iconSize: [64, 64],
        iconAnchor: [32, 32],
      });

      const marker = window.L.marker(PHOENIX_COORDS, {
        icon: customIcon,
        interactive: true,
        title: "Heiller Office - 3101 N Central Ave, Phoenix, AZ",
      }).addTo(map);

      marker.on("click", () => {
        window.open(
          "https://maps.google.com/?q=3101+N+Central+Ave+Ste+183+Phoenix+AZ+85012",
          "_blank",
          "noopener,noreferrer"
        );
      });

      // Recenter helper that reliably re-computes viewport and locks center
      function reCenter() {
        map.invalidateSize();
        map.setView(PHOENIX_COORDS, ZOOM_LEVEL, { animate: false });
      }

      // Multiple milestones ensuring layout dimensions are settled
      reCenter();
      setTimeout(reCenter, 100);
      setTimeout(reCenter, 300);
      setTimeout(reCenter, 700);

      // Re-center when scrolled into view
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reCenter();
            }
          });
        }, { threshold: 0.15 });
        io.observe(mapContainer);
      }

      // Responsive resize observation
      if ("ResizeObserver" in window) {
        const ro = new ResizeObserver(() => {
          map.invalidateSize();
        });
        ro.observe(mapContainer);
      }

      window.addEventListener("resize", () => {
        map.invalidateSize();
      });
    } catch (err) {
      console.warn("Could not initialize Our Details map:", err);
    }
  }

  // Load when Leaflet is available or observe container
  if (window.L) {
    initMap();
  } else {
    // Wait for Leaflet script to finish loading
    const checkInterval = setInterval(() => {
      if (window.L) {
        clearInterval(checkInterval);
        initMap();
      }
    }, 40);

    // If primary CDN is blocked or delayed, load from alternate CDN
    setTimeout(() => {
      if (!window.L && !document.getElementById("leaflet-fallback-script")) {
        const script = document.createElement("script");
        script.id = "leaflet-fallback-script";
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
        script.onload = () => {
          if (window.L) {
            clearInterval(checkInterval);
            initMap();
          }
        };
        document.head.appendChild(script);
      }
    }, 1500);

    // Timeout after 6 seconds
    setTimeout(() => clearInterval(checkInterval), 6000);
  }
})();
