/** Simplified continent coastline dots for the rotating globe visualization.
 *  ~350 {lat, lng} points tracing major landmasses. */

export const CONTINENT_DOTS: { lat: number; lng: number }[] = [
  // ─── NORTH AMERICA ───────────────────────────────────────
  // Alaska
  { lat: 64, lng: -153 }, { lat: 62, lng: -150 }, { lat: 60, lng: -147 },
  { lat: 58, lng: -152 }, { lat: 56, lng: -157 }, { lat: 55, lng: -162 },
  { lat: 60, lng: -165 }, { lat: 64, lng: -165 }, { lat: 66, lng: -164 },
  { lat: 68, lng: -163 }, { lat: 71, lng: -157 },
  // Canadian Arctic / Hudson Bay
  { lat: 70, lng: -130 }, { lat: 68, lng: -115 }, { lat: 66, lng: -110 },
  { lat: 64, lng: -96 }, { lat: 62, lng: -92 }, { lat: 60, lng: -85 },
  { lat: 58, lng: -80 }, { lat: 56, lng: -78 }, { lat: 55, lng: -82 },
  { lat: 53, lng: -80 }, { lat: 51, lng: -80 },
  // West coast Canada/US
  { lat: 60, lng: -140 }, { lat: 57, lng: -136 }, { lat: 54, lng: -132 },
  { lat: 51, lng: -128 }, { lat: 49, lng: -126 }, { lat: 48, lng: -124 },
  { lat: 46, lng: -124 }, { lat: 43, lng: -124 }, { lat: 40, lng: -124 },
  { lat: 38, lng: -123 }, { lat: 36, lng: -122 }, { lat: 34, lng: -120 },
  { lat: 33, lng: -118 }, { lat: 32, lng: -117 },
  // Mexico west coast
  { lat: 30, lng: -115 }, { lat: 27, lng: -112 }, { lat: 24, lng: -110 },
  { lat: 22, lng: -106 }, { lat: 20, lng: -105 }, { lat: 18, lng: -103 },
  { lat: 16, lng: -96 },
  // Central America
  { lat: 15, lng: -92 }, { lat: 14, lng: -88 }, { lat: 12, lng: -86 },
  { lat: 10, lng: -84 }, { lat: 9, lng: -80 }, { lat: 8, lng: -77 },
  // Gulf coast
  { lat: 18, lng: -88 }, { lat: 20, lng: -90 }, { lat: 22, lng: -90 },
  { lat: 25, lng: -90 }, { lat: 27, lng: -90 }, { lat: 29, lng: -89 },
  { lat: 30, lng: -87 }, { lat: 30, lng: -84 }, { lat: 28, lng: -82 },
  { lat: 26, lng: -80 },
  // US East coast
  { lat: 25, lng: -80 }, { lat: 27, lng: -80 }, { lat: 30, lng: -81 },
  { lat: 32, lng: -80 }, { lat: 34, lng: -77 }, { lat: 36, lng: -76 },
  { lat: 37, lng: -76 }, { lat: 39, lng: -74 }, { lat: 41, lng: -72 },
  { lat: 42, lng: -71 }, { lat: 44, lng: -68 }, { lat: 46, lng: -67 },
  // Canadian East coast
  { lat: 47, lng: -64 }, { lat: 48, lng: -60 }, { lat: 47, lng: -56 },
  { lat: 49, lng: -55 }, { lat: 52, lng: -56 }, { lat: 54, lng: -58 },
  { lat: 56, lng: -60 }, { lat: 58, lng: -62 },
  // Interior fill (Great Lakes region, central US)
  { lat: 45, lng: -85 }, { lat: 43, lng: -88 }, { lat: 42, lng: -83 },
  { lat: 44, lng: -79 }, { lat: 46, lng: -84 }, { lat: 48, lng: -90 },
  { lat: 40, lng: -100 }, { lat: 38, lng: -95 }, { lat: 35, lng: -100 },
  { lat: 42, lng: -110 }, { lat: 46, lng: -105 }, { lat: 50, lng: -110 },
  { lat: 53, lng: -120 }, { lat: 56, lng: -125 },

  // ─── SOUTH AMERICA ───────────────────────────────────────
  // North coast
  { lat: 12, lng: -72 }, { lat: 11, lng: -75 }, { lat: 10, lng: -67 },
  { lat: 8, lng: -62 }, { lat: 7, lng: -58 }, { lat: 5, lng: -54 },
  { lat: 3, lng: -51 }, { lat: 0, lng: -50 },
  // East coast Brazil
  { lat: -2, lng: -44 }, { lat: -5, lng: -35 }, { lat: -8, lng: -35 },
  { lat: -10, lng: -37 }, { lat: -13, lng: -38 }, { lat: -16, lng: -39 },
  { lat: -18, lng: -40 }, { lat: -21, lng: -41 }, { lat: -23, lng: -43 },
  { lat: -25, lng: -48 }, { lat: -28, lng: -49 },
  // South coast
  { lat: -30, lng: -51 }, { lat: -33, lng: -52 }, { lat: -35, lng: -57 },
  { lat: -38, lng: -57 }, { lat: -40, lng: -62 }, { lat: -42, lng: -64 },
  { lat: -45, lng: -66 }, { lat: -48, lng: -66 }, { lat: -50, lng: -68 },
  { lat: -53, lng: -70 }, { lat: -55, lng: -69 },
  // West coast
  { lat: -53, lng: -74 }, { lat: -48, lng: -75 }, { lat: -44, lng: -73 },
  { lat: -40, lng: -73 }, { lat: -36, lng: -73 }, { lat: -33, lng: -72 },
  { lat: -30, lng: -71 }, { lat: -27, lng: -71 }, { lat: -24, lng: -70 },
  { lat: -20, lng: -70 }, { lat: -16, lng: -75 }, { lat: -12, lng: -77 },
  { lat: -8, lng: -80 }, { lat: -4, lng: -81 }, { lat: -1, lng: -80 },
  { lat: 2, lng: -78 }, { lat: 4, lng: -77 },
  // Interior fill
  { lat: -5, lng: -55 }, { lat: -8, lng: -50 }, { lat: -10, lng: -55 },
  { lat: -15, lng: -50 }, { lat: -12, lng: -60 }, { lat: -18, lng: -56 },
  { lat: -15, lng: -65 }, { lat: -20, lng: -60 }, { lat: -25, lng: -58 },
  { lat: -3, lng: -60 }, { lat: -6, lng: -65 }, { lat: -8, lng: -70 },

  // ─── EUROPE ──────────────────────────────────────────────
  // Iberian Peninsula
  { lat: 36, lng: -6 }, { lat: 37, lng: -9 }, { lat: 39, lng: -9 },
  { lat: 41, lng: -9 }, { lat: 43, lng: -8 }, { lat: 43, lng: -3 },
  { lat: 42, lng: 3 }, { lat: 38, lng: 0 }, { lat: 37, lng: -2 },
  // France / Mediterranean
  { lat: 43, lng: 5 }, { lat: 44, lng: 7 }, { lat: 46, lng: 5 },
  { lat: 48, lng: -4 }, { lat: 49, lng: -1 }, { lat: 48, lng: 2 },
  // Italy
  { lat: 44, lng: 10 }, { lat: 42, lng: 12 }, { lat: 40, lng: 16 },
  { lat: 38, lng: 16 }, { lat: 37, lng: 15 }, { lat: 39, lng: 18 },
  // Balkans / Greece
  { lat: 42, lng: 20 }, { lat: 40, lng: 22 }, { lat: 38, lng: 24 },
  { lat: 36, lng: 23 }, { lat: 35, lng: 25 },
  // British Isles
  { lat: 50, lng: -5 }, { lat: 52, lng: -5 }, { lat: 53, lng: -3 },
  { lat: 55, lng: -5 }, { lat: 56, lng: -3 }, { lat: 58, lng: -5 },
  { lat: 51, lng: 1 }, { lat: 53, lng: 0 },
  // Scandinavia
  { lat: 56, lng: 8 }, { lat: 58, lng: 6 }, { lat: 60, lng: 5 },
  { lat: 62, lng: 6 }, { lat: 64, lng: 11 }, { lat: 66, lng: 14 },
  { lat: 68, lng: 16 }, { lat: 70, lng: 20 }, { lat: 70, lng: 28 },
  { lat: 68, lng: 28 }, { lat: 66, lng: 26 }, { lat: 64, lng: 24 },
  { lat: 62, lng: 20 }, { lat: 60, lng: 18 }, { lat: 58, lng: 16 },
  // Central / Eastern Europe interior
  { lat: 50, lng: 14 }, { lat: 52, lng: 20 }, { lat: 48, lng: 20 },
  { lat: 46, lng: 15 }, { lat: 54, lng: 18 },

  // ─── AFRICA ──────────────────────────────────────────────
  // North coast
  { lat: 36, lng: -1 }, { lat: 37, lng: 3 }, { lat: 37, lng: 10 },
  { lat: 33, lng: 12 }, { lat: 32, lng: 24 }, { lat: 31, lng: 32 },
  // East coast
  { lat: 28, lng: 34 }, { lat: 24, lng: 37 }, { lat: 20, lng: 38 },
  { lat: 15, lng: 42 }, { lat: 12, lng: 44 }, { lat: 10, lng: 45 },
  { lat: 5, lng: 46 }, { lat: 2, lng: 44 }, { lat: -1, lng: 42 },
  { lat: -4, lng: 40 }, { lat: -8, lng: 39 }, { lat: -12, lng: 40 },
  { lat: -15, lng: 40 }, { lat: -20, lng: 35 }, { lat: -25, lng: 35 },
  { lat: -28, lng: 33 }, { lat: -32, lng: 29 }, { lat: -34, lng: 26 },
  // South coast
  { lat: -34, lng: 22 }, { lat: -34, lng: 18 },
  // West coast
  { lat: -33, lng: 18 }, { lat: -30, lng: 16 }, { lat: -25, lng: 14 },
  { lat: -20, lng: 12 }, { lat: -15, lng: 12 }, { lat: -10, lng: 13 },
  { lat: -5, lng: 12 }, { lat: 0, lng: 9 }, { lat: 4, lng: 7 },
  { lat: 6, lng: 2 }, { lat: 5, lng: -2 }, { lat: 7, lng: -5 },
  { lat: 5, lng: -8 }, { lat: 8, lng: -13 }, { lat: 12, lng: -16 },
  { lat: 15, lng: -17 }, { lat: 20, lng: -17 }, { lat: 24, lng: -16 },
  { lat: 28, lng: -10 }, { lat: 32, lng: -5 }, { lat: 35, lng: -2 },
  // Interior fill
  { lat: 10, lng: 15 }, { lat: 5, lng: 20 }, { lat: 0, lng: 25 },
  { lat: -5, lng: 28 }, { lat: -10, lng: 25 }, { lat: -15, lng: 28 },
  { lat: 15, lng: 30 }, { lat: 10, lng: 35 }, { lat: 20, lng: 20 },
  { lat: 25, lng: 10 }, { lat: 5, lng: 30 }, { lat: -5, lng: 18 },
  { lat: -20, lng: 25 }, { lat: -25, lng: 22 },

  // ─── ASIA ────────────────────────────────────────────────
  // Middle East
  { lat: 32, lng: 35 }, { lat: 34, lng: 36 }, { lat: 36, lng: 36 },
  { lat: 37, lng: 40 }, { lat: 38, lng: 44 }, { lat: 36, lng: 52 },
  { lat: 30, lng: 48 }, { lat: 26, lng: 50 }, { lat: 24, lng: 54 },
  { lat: 22, lng: 59 }, { lat: 20, lng: 58 }, { lat: 16, lng: 53 },
  { lat: 13, lng: 45 }, { lat: 12, lng: 43 },
  // Central Asia / Russia south
  { lat: 40, lng: 52 }, { lat: 42, lng: 60 }, { lat: 44, lng: 65 },
  { lat: 46, lng: 68 }, { lat: 50, lng: 70 }, { lat: 52, lng: 75 },
  { lat: 54, lng: 80 }, { lat: 56, lng: 85 }, { lat: 58, lng: 90 },
  // Siberia coast
  { lat: 60, lng: 100 }, { lat: 62, lng: 110 }, { lat: 64, lng: 120 },
  { lat: 66, lng: 130 }, { lat: 68, lng: 140 }, { lat: 66, lng: 170 },
  { lat: 64, lng: 178 },
  // India
  { lat: 28, lng: 68 }, { lat: 24, lng: 67 }, { lat: 20, lng: 73 },
  { lat: 16, lng: 73 }, { lat: 12, lng: 75 }, { lat: 8, lng: 77 },
  { lat: 10, lng: 80 }, { lat: 14, lng: 80 }, { lat: 18, lng: 84 },
  { lat: 22, lng: 88 }, { lat: 24, lng: 89 }, { lat: 28, lng: 86 },
  { lat: 30, lng: 80 }, { lat: 32, lng: 76 }, { lat: 34, lng: 74 },
  // Sri Lanka
  { lat: 7, lng: 80 }, { lat: 8, lng: 81 },
  // Southeast Asia
  { lat: 22, lng: 92 }, { lat: 18, lng: 96 }, { lat: 14, lng: 98 },
  { lat: 10, lng: 99 }, { lat: 7, lng: 100 }, { lat: 3, lng: 101 },
  { lat: 1, lng: 104 }, { lat: -2, lng: 106 }, { lat: -6, lng: 106 },
  { lat: -8, lng: 110 }, { lat: -8, lng: 115 },
  // Philippines
  { lat: 18, lng: 121 }, { lat: 14, lng: 121 }, { lat: 10, lng: 124 },
  { lat: 7, lng: 126 },
  // China coast
  { lat: 22, lng: 114 }, { lat: 24, lng: 118 }, { lat: 28, lng: 121 },
  { lat: 30, lng: 122 }, { lat: 32, lng: 121 }, { lat: 35, lng: 120 },
  { lat: 38, lng: 118 }, { lat: 40, lng: 120 }, { lat: 42, lng: 125 },
  // Korea
  { lat: 35, lng: 129 }, { lat: 37, lng: 127 }, { lat: 38, lng: 126 },
  // Japan
  { lat: 33, lng: 131 }, { lat: 35, lng: 135 }, { lat: 36, lng: 140 },
  { lat: 38, lng: 140 }, { lat: 40, lng: 140 }, { lat: 42, lng: 144 },
  { lat: 44, lng: 145 },
  // Russia far east
  { lat: 46, lng: 135 }, { lat: 50, lng: 137 }, { lat: 54, lng: 135 },
  { lat: 58, lng: 140 }, { lat: 60, lng: 150 }, { lat: 62, lng: 160 },
  // Interior fill
  { lat: 40, lng: 75 }, { lat: 35, lng: 70 }, { lat: 45, lng: 90 },
  { lat: 48, lng: 100 }, { lat: 50, lng: 115 }, { lat: 30, lng: 105 },
  { lat: 34, lng: 110 }, { lat: 26, lng: 100 },

  // ─── AUSTRALIA ───────────────────────────────────────────
  { lat: -12, lng: 131 }, { lat: -14, lng: 127 }, { lat: -18, lng: 122 },
  { lat: -22, lng: 114 }, { lat: -26, lng: 113 }, { lat: -30, lng: 115 },
  { lat: -33, lng: 116 }, { lat: -35, lng: 118 }, { lat: -35, lng: 122 },
  { lat: -34, lng: 135 }, { lat: -35, lng: 138 }, { lat: -38, lng: 145 },
  { lat: -37, lng: 150 }, { lat: -34, lng: 151 }, { lat: -30, lng: 153 },
  { lat: -26, lng: 153 }, { lat: -22, lng: 150 }, { lat: -18, lng: 146 },
  { lat: -15, lng: 145 }, { lat: -12, lng: 142 }, { lat: -12, lng: 136 },
  // Interior
  { lat: -24, lng: 134 }, { lat: -26, lng: 128 }, { lat: -22, lng: 140 },
  { lat: -28, lng: 140 }, { lat: -30, lng: 135 },
  // New Zealand
  { lat: -37, lng: 175 }, { lat: -40, lng: 176 }, { lat: -42, lng: 172 },
  { lat: -45, lng: 170 }, { lat: -46, lng: 168 },

  // ─── GREENLAND ───────────────────────────────────────────
  { lat: 60, lng: -46 }, { lat: 64, lng: -50 }, { lat: 68, lng: -52 },
  { lat: 72, lng: -55 }, { lat: 76, lng: -60 }, { lat: 78, lng: -68 },
  { lat: 76, lng: -20 }, { lat: 72, lng: -22 }, { lat: 68, lng: -28 },
  { lat: 64, lng: -38 }, { lat: 62, lng: -42 },

  // ─── INDONESIA / BORNEO / PAPUA ─────────────────────────
  { lat: 2, lng: 110 }, { lat: -1, lng: 110 }, { lat: -3, lng: 114 },
  { lat: 0, lng: 117 }, { lat: 3, lng: 116 },
  { lat: -2, lng: 134 }, { lat: -4, lng: 138 }, { lat: -6, lng: 142 },
  { lat: -4, lng: 144 }, { lat: -2, lng: 140 },
  { lat: -5, lng: 120 }, { lat: -8, lng: 125 },
];
