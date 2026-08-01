
// ═══════════════════════════════════════════════════════════════════════════
// CREATIFY CENTRAL THEME — Pure Wine (Burgundy) palette
// ═══════════════════════════════════════════════════════════════════════════
// Usage: import THEME from "../theme";
// Then use THEME.wine, THEME.bg, THEME.primary, etc.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Pure palette ─────────────────────────────────────────────────────────
const WINE = {
  50:  "#fdf2f4",
  100: "#fbe5e9",
  200: "#f5cdd6",
  300: "#eba5b6",
  400: "#e1496d",
  500: "#d13a5f",
  600: "#b13453",
  700: "#942945",
  800: "#7c233c",
  900: "#66172e",
  950: "#3a0c19",
};

const PLUM = {
  50:  "#faf5ff",
  100: "#f3e8ff",
  200: "#e9d5ff",
  300: "#d8b4fe",
  400: "#c084fc",
  500: "#a855f7",
  600: "#9333ea",
  700: "#7e22ce",
  800: "#6b21a8",
  900: "#581c87",
};

const ROSE_GOLD = {
  400: "#f472b6",
  500: "#ec4899",
  600: "#db2777",
};

const CREAM = {
  50:  "#fffdfc",
  100: "#fdf4f7",
  200: "#fbe8ef",
  300: "#f5d4e0",
  400: "#ecb9cc",
};

const GRAY_NEUTRAL = {
  50:  "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b",
};

// ─── Theme object: use THEME.xxx directly across components ──────────────
const THEME = {
  // Core colors
  wine:       WINE[700],  // #942945  — button background, primary accents
  wineDeep:   WINE[800],  // #7c233c  — hover, headers
  wineDarker: WINE[900],  // #66172e  — strong borders, dark mode bg
  wineMid:    WINE[600],  // #b13453  — main primary (buttons, logos)
  wineLight:  WINE[400],  // #e1496d  — glows, highlights
  wineBg:     WINE[100],  // #fbe5e9  — soft tinted background
  wineTint:   WINE[50],   // #fdf2f4  — very subtle

  // Plum accents
  plum:       PLUM[700],  // #7e22ce  — secondary accents
  plumMid:    PLUM[600],  // #9333ea
  plumLight:  PLUM[400],  // #c084fc

  // Rose gold accents (replaces old coffee/gold)
  roseGold:   ROSE_GOLD[500],
  roseGoldLight: ROSE_GOLD[400],
  roseGoldDeep: ROSE_GOLD[600],

  white:      CREAM[50],  // page background
  bg:         CREAM[100], // surface / panels
  panel:      "#ffffff",
  border:     CREAM[300], // panel borders
  borderSoft: CREAM[200],

  // Text
  text:       GRAY_NEUTRAL[900],
  textMuted:  GRAY_NEUTRAL[500],
  textSoft:   GRAY_NEUTRAL[400],
  textInvert: "#ffffff",

  // Legacy gold alias mapped to rose gold (for backwards compat)
  gold:       ROSE_GOLD[500],
  goldDeep:   ROSE_GOLD[600],
  goldLight:  ROSE_GOLD[400],

  // Sidebar / editor / video studio
  editor: {
    bg:          "#120e12",      // video editor outermost
    panelBg:     "#181318",      // panels, sidebar, inspector
    panelDark:   "#0f0b0f",      // timeline background
    border:      "rgba(225,73,109,0.15)",
    borderBold:  "rgba(225,73,109,0.35)",
    accent:      "#e1496d",      // playhead, primary accents
    accentHover: "#ff8da7",
    accentSoft:  "rgba(225,73,109,0.15)",      // selected item chip
    accentText:  "#ff8da7",
    playhead:    "#e1496d",
    playheadTip: "#ff8da7",
    selectedRing:"#e1496d",
    text:        "#e5e5e5",
    textMuted:   "#8c8780",
    textSoft:    "#5c5650",
    sliderTrack: "rgba(225,73,109,0.2)",
    sliderThumb: "#e1496d",
    danger:      "#ef4444",
  },

  // Dark variant (editor inner dark mode optional)
  editorDark: {
    bg:          "#1a0f14",
    panelBg:     "#23141b",
    panelDark:   "#170b11",
    border:      "rgba(239,68,68,0.18)",
    accent:      "#e1496d",
    accentSoft:  "rgba(225,73,109,0.16)",
    accentText:  "#f489a0",
    text:        "#f7ecef",
    textMuted:   "#9c878e",
    textSoft:    "#6d5d64",
    playhead:    "#e1496d",
  },

  // Track colors (pure wine + complementary plum + rose gold)
  trackColors: {
    video:   { bg: hexA(WINE[600], 0.15),  border: hexA(WINE[700], 0.55), label: WINE[700],   accent: WINE[500]  },
    image:   { bg: hexA(PLUM[500], 0.14),  border: hexA(PLUM[600], 0.45), label: PLUM[700],  accent: PLUM[400]  },
    text:    { bg: hexA(WINE[400], 0.10),  border: hexA(WINE[500], 0.40), label: WINE[600],   accent: WINE[300]  },
    audio:   { bg: hexA(ROSE_GOLD[500], 0.10), border: hexA(ROSE_GOLD[600], 0.40), label: ROSE_GOLD[600], accent: ROSE_GOLD[400] },
    shape:   { bg: hexA(PLUM[600], 0.12),  border: hexA(PLUM[700], 0.45), label: PLUM[700],  accent: PLUM[500]  },
    sticker: { bg: hexA(WINE[500], 0.12),  border: hexA(WINE[600], 0.45), label: WINE[700],   accent: WINE[400]  },
  },

  // Gradients — all wine & rose gold, NO coffee/brown
  grad: {
    primary:  "linear-gradient(135deg,#b13453 0%,#942945 50%,#7c233c 100%)",
    primarySoft:"linear-gradient(135deg,#e1496d 0%,#b13453 100%)",
    gold:     "linear-gradient(135deg,#f472b6 0%,#db2777 100%)",
    sidebar:  "linear-gradient(180deg,#fdf2f4 0%,#ffffff 100%)",
    hero:     "linear-gradient(135deg,#fdf2f4 0%,#f3e8ff 35%,#ffffff 70%,#fbe5e9 100%)",
    heroDark: "linear-gradient(135deg,#3a0c19 0%,#581c87 40%,#1a0f14 100%)",
  },

  // Buttons
  btn: {
    primaryBg:   "linear-gradient(135deg,#b13453,#942945)",
    primaryHover:"linear-gradient(135deg,#e1496d,#b13453)",
    ghostBg:     "rgba(148,41,69,0.06)",
    ghostBorder: "rgba(148,41,69,0.25)",
    ghostText:   WINE[700],
  },

  // Fonts (Google — ensure link is loaded in App)
  fonts: {
    display:  "'Syne', sans-serif",
    serif:    "'Instrument Serif', serif",
    sans:     "'Instrument Sans', sans-serif",
    ui:       "'Poppins', sans-serif",
  },

  // Shadows — wine-tinted
  shadow: {
    sm:   "0 2px 6px rgba(148,41,69,0.08)",
    md:   "0 6px 20px rgba(148,41,69,0.12)",
    lg:   "0 14px 40px rgba(148,41,69,0.18)",
    chip: "0 2px 10px rgba(148,41,69,0.15)",
  },

  // Helpers: hex alpha, rgba builder
  hexA,
  rgba,
};

// ─── Helpers ─────────────────────────────────────────────────────────────
function hexA(hex, alpha) {
  const h = hex.replace("#","");
  const bigint = parseInt(h.length === 3
    ? h.split("").map(c => c + c).join("")
    : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
function rgba(r,g,b,a) { return `rgba(${r},${g},${b},${a})`; }

export default THEME;
export { WINE, PLUM, ROSE_GOLD, CREAM, GRAY_NEUTRAL };
