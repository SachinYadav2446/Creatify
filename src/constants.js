export const TRACK_COLORS = {
  video:    { bg: "#f1f5f9", border: "#cbd5e1", label: "#334155", accent: "#4f46e5", gradient: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", text: "#1e1b4b" },
  image:    { bg: "#f8fafc", border: "#cbd5e1", label: "#475569", accent: "#0ea5e9", gradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", text: "#0c4a6e" },
  code:     { bg: "#f8fafc", border: "#93c5fd", label: "#1d4ed8", accent: "#2563eb", gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", text: "#1e3a8a" },
  terminal: { bg: "#f8fafc", border: "#86efac", label: "#15803d", accent: "#16a34a", gradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", text: "#14532d" },
  mockup:   { bg: "#faf5ff", border: "#d8b4fe", label: "#7e22ce", accent: "#9333ea", gradient: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", text: "#581c87" },
  badge:    { bg: "#fffbeb", border: "#fde68a", label: "#b45309", accent: "#d97706", gradient: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", text: "#78350f" },
  text:     { bg: "#fdf4ff", border: "#f0abfc", label: "#a21caf", accent: "#c026d3", gradient: "linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)", text: "#701a75" },
  audio:    { bg: "#fff1f2", border: "#fecdd3", label: "#be123c", accent: "#e11d48", gradient: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)", text: "#881337" },
  shape:    { bg: "#f0fdfa", border: "#99f6e4", label: "#0f766e", accent: "#0d9488", gradient: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)", text: "#134e4a" },
  sticker:  { bg: "#fff7ed", border: "#fed7aa", label: "#c2410c", accent: "#ea580c", gradient: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", text: "#7c2d12" },
};


export const ASPECT_RATIOS = [
  { id: "16:9",  name: "YouTube / Desktop",  w: 1920, h: 1080, icon: "▬" },
  { id: "9:16",  name: "TikTok / Reels / Shorts", w: 1080, h: 1920, icon: "▮" },
  { id: "1:1",   name: "Instagram / Square", w: 1080, h: 1080, icon: "■" },
  { id: "4:5",   name: "Instagram Portrait", w: 1080, h: 1350, icon: "▯" },
  { id: "4:3",   name: "Classic / Slide",    w: 1440, h: 1080, icon: "▭" },
  { id: "3:4",   name: "Pinterest / Mobile", w: 810,  h: 1080, icon: "▰" },
  { id: "21:9",  name: "Cinematic Ultrawide", w: 2560, h: 1080, icon: "▬▬" },
  { id: "2.39:1",name: "Cinematic Scope",    w: 2048, h: 858,  icon: "▬▬▬" },
  { id: "5:4",   name: "Facebook Frame",     w: 1280, h: 1024, icon: "▤" },
  { id: "3:2",   name: "Photo / Print",      w: 1620, h: 1080, icon: "▥" },
  { id: "custom",name: "Custom Size",         w: 1280, h: 720,  icon: "✦" },
];

export const TRANSITIONS = [
  { id: "none",        name: "None",             duration: 0.0 },
  { id: "fade",        name: "Crossfade",        duration: 0.6, icon: "◐" },
  { id: "dissolve",    name: "Dissolve",         duration: 0.8, icon: "◒" },
  { id: "wipeLeft",    name: "Wipe Left",        duration: 0.5, icon: "◀" },
  { id: "wipeRight",   name: "Wipe Right",       duration: 0.5, icon: "▶" },
  { id: "wipeUp",      name: "Wipe Up",          duration: 0.5, icon: "▲" },
  { id: "wipeDown",    name: "Wipe Down",        duration: 0.5, icon: "▼" },
  { id: "slideLeft",   name: "Slide In Left",    duration: 0.5, icon: "⇦" },
  { id: "slideRight",  name: "Slide In Right",   duration: 0.5, icon: "⇨" },
  { id: "slideUp",     name: "Slide In Up",      duration: 0.5, icon: "⇧" },
  { id: "slideDown",   name: "Slide In Down",    duration: 0.5, icon: "⇩" },
  { id: "zoomIn",      name: "Zoom In",          duration: 0.8, icon: "⊕" },
  { id: "zoomOut",     name: "Zoom Out",         duration: 0.8, icon: "⊖" },
  { id: "spin",        name: "Spin",             duration: 0.8, icon: "⟳" },
  { id: "flash",       name: "Flash White",      duration: 0.3, icon: "✦" },
  { id: "blur",        name: "Blur Transition",  duration: 0.6, icon: "◌" },
  { id: "heart",       name: "Heart Wipe",       duration: 0.7, icon: "♥" },
  { id: "circle",      name: "Circle Reveal",    duration: 0.8, icon: "◯" },
  { id: "star",        name: "Star Wipe",        duration: 0.7, icon: "★" },
  { id: "bars",        name: "Bars",             duration: 0.6, icon: "║" },
];

export const TEXT_PRESETS = [
  { id: "h1",     name: "Big Heading",     fontSize: 120, fontWeight: 800, color: "#ffffff", stroke: "#000000", strokeWidth: 0, letterSpacing: -2, align: "center", shadow: true, tag: "H1" },
  { id: "h2",     name: "Sub Heading",     fontSize: 72,  fontWeight: 700, color: "#ffffff", stroke: "",       strokeWidth: 0, letterSpacing: 0,  align: "center", shadow: true, tag: "H2" },
  { id: "h3",     name: "Small Heading",   fontSize: 48,  fontWeight: 700, color: "#ffffff", stroke: "",       strokeWidth: 0, letterSpacing: 1,  align: "left",   shadow: true, tag: "H3" },
  { id: "body",   name: "Body Text",       fontSize: 32,  fontWeight: 500, color: "#e5e5e5", stroke: "",       strokeWidth: 0, letterSpacing: 0,  align: "left",   shadow: false, tag: "¶"  },
  { id: "caption",name: "Caption",         fontSize: 24,  fontWeight: 500, color: "#ffffff", stroke: "#000000", strokeWidth: 4, letterSpacing: 0.5,align: "center", shadow: false, tag: "CC" },
  { id: "bold",   name: "Bold Title",      fontSize: 96,  fontWeight: 900, color: "#fff1f4", stroke: "#942945", strokeWidth: 5, letterSpacing: 1,  align: "center", shadow: true, tag: "Bold" },
  { id: "neon",   name: "Neon Glow",       fontSize: 80,  fontWeight: 700, color: "#ff6b8a", stroke: "#ff6b8a", strokeWidth: 0, letterSpacing: 3,  align: "center", shadow: true, neon: true, tag: "Neon" },
  { id: "vintage",name: "Vintage Stamp",   fontSize: 64,  fontWeight: 700, color: "#b13453", stroke: "#66172e", strokeWidth: 3, letterSpacing: 4,  align: "center", shadow: false, tag: "Old" },
  { id: "minimal",name: "Minimal Line",    fontSize: 40,  fontWeight: 300, color: "#ffffff", stroke: "",       strokeWidth: 0, letterSpacing: 8,  align: "center", shadow: false, tag: "—"  },
  { id: "outlined",name: "Hollow Outline", fontSize: 110, fontWeight: 900, color: "transparent", stroke: "#ffffff", strokeWidth: 3, letterSpacing: -2, align: "center", shadow: false, tag: "◯" },
];

export const FONT_FAMILIES = [
  { id: "syne",      name: "Syne",        stack: "'Syne', sans-serif", weights: [400,500,600,700,800], display: true },
  { id: "poppins",   name: "Poppins",     stack: "'Poppins', sans-serif", weights: [100,200,300,400,500,600,700,800,900] },
  { id: "instrument",name: "Instrument Sans", stack: "'Instrument Sans', sans-serif", weights: [300,400,500,600,700] },
  { id: "inter",     name: "Inter",       stack: "'Inter', sans-serif", weights: [100,200,300,400,500,600,700,800,900] },
  { id: "playfair",  name: "Playfair",    stack: "'Playfair Display', serif", weights: [400,500,600,700,800,900], display: true },
  { id: "ebg",       name: "EB Garamond", stack: "'EB Garamond', serif", weights: [400,500,600,700,800] },
  { id: "roboto",    name: "Roboto Mono", stack: "'Roboto Mono', monospace", weights: [100,300,400,500,700] },
  { id: "space",     name: "Space Grotesk", stack: "'Space Grotesk', sans-serif", weights: [300,400,500,600,700] },
  { id: "bebas",     name: "Bebas Neue",  stack: "'Bebas Neue', sans-serif", weights: [400], display: true },
  { id: "lobster",   name: "Lobster",     stack: "'Lobster', cursive", weights: [400], display: true },
  { id: "anton",     name: "Anton",       stack: "'Anton', sans-serif", weights: [400], display: true },
  { id: "archivo",   name: "Archivo Black", stack: "'Archivo Black', sans-serif", weights: [400,900], display: true },
];

export const SHAPE_TYPES = [
  { id: "rect",   name: "Rounded Rectangle", icon: "▢", default: { w: 400, h: 240, radius: 16, fill: "#942945", stroke: "#ffffff", strokeWidth: 0, opacity: 100 } },
  { id: "square", name: "Square",            icon: "■", default: { w: 300, h: 300, radius: 0,  fill: "#b13453", stroke: "#fbe5e9", strokeWidth: 2, opacity: 100 } },
  { id: "circle", name: "Circle",            icon: "●", default: { w: 280, h: 280, radius: 999, fill: "#e1496d", stroke: "#ffffff", strokeWidth: 0, opacity: 100 } },
  { id: "ellipse",name: "Ellipse",           icon: "◉", default: { w: 360, h: 220, radius: 999, fill: "#d13a5f", stroke: "#ffffff", strokeWidth: 0, opacity: 100 } },
  { id: "triangle",name:"Triangle",          icon: "▲", default: { w: 280, h: 240, radius: 0, fill: "#7c233c", stroke: "#ffffff", strokeWidth: 0, opacity: 100 } },
  { id: "line",   name: "Line",              icon: "━", default: { w: 500, h: 6,   radius: 3, fill: "#942945", stroke: "",       strokeWidth: 0, opacity: 100 } },
  { id: "arrowL", name: "Left Arrow",        icon: "◀", default: { w: 200, h: 80, radius: 0, fill: "#b13453", stroke: "",       strokeWidth: 0, opacity: 100, arrow: "left" } },
  { id: "arrowR", name: "Right Arrow",       icon: "▶", default: { w: 200, h: 80, radius: 0, fill: "#b13453", stroke: "",       strokeWidth: 0, opacity: 100, arrow: "right" } },
  { id: "star",   name: "Star",              icon: "★", default: { w: 260, h: 260, points: 5, fill: "#ec4899", stroke: "#ffffff", strokeWidth: 0, opacity: 100 } },
  { id: "heart",  name: "Heart",             icon: "♥", default: { w: 260, h: 240, fill: "#d13a5f", stroke: "#ffffff", strokeWidth: 0, opacity: 100 } },
  { id: "burst",  name: "Sunburst",          icon: "☀", default: { w: 280, h: 280, rays: 12, fill: "#942945", stroke: "#ffffff", strokeWidth: 0, opacity: 100 } },
  { id: "frame",  name: "Frame Border",      icon: "▭", default: { w: 800, h: 600, radius: 0, fill: "transparent", stroke: "#942945", strokeWidth: 16, opacity: 100 } },
  { id: "pill",   name: "Pill / Badge",      icon: "▮", default: { w: 340, h: 100, radius: 50, fill: "rgba(102,23,46,0.85)", stroke: "#e1496d", strokeWidth: 3, opacity: 100 } },
  { id: "cloud",  name: "Speech Bubble",     icon: "💬", default: { w: 400, h: 200, radius: 32, fill: "#ffffff", stroke: "#942945", strokeWidth: 3, opacity: 100, bubble: true } },
];

export const EFFECT_PRESETS = {
  vintage: { brightness:108, contrast:112, saturation:130, hue:6,   blur:0, sharpen:6,  vignette:22, sepia:20 },
  cyber:   { brightness:100, contrast:128, saturation:165, hue:305, blur:0, sharpen:24, vignette:16, sepia:0  },
  noir:    { brightness:94,  contrast:140, saturation:0,   hue:0,   blur:0, sharpen:10, vignette:42, sepia:0  },
  cream:   { brightness:112, contrast:90,  saturation:92,  hue:12,  blur:2, sharpen:0,  vignette:10, sepia:15 },
  cine:    { brightness:98,  contrast:120, saturation:85,  hue:2,   blur:0, sharpen:14, vignette:30, sepia:12 },
  dream:   { brightness:114, contrast:95,  saturation:110, hue:-4,  blur:3, sharpen:0,  vignette:6,  sepia:8  },
  hdr:     { brightness:100, contrast:155, saturation:135, hue:0,   blur:0, sharpen:40, vignette:12, sepia:0  },
  warm:    { brightness:106, contrast:110, saturation:118, hue:-6,  blur:0, sharpen:4,  vignette:14, sepia:24 },
  cool:    { brightness:100, contrast:110, saturation:95,  hue:200, blur:0, sharpen:6,  vignette:12, sepia:0  },
  reset:   { brightness:100, contrast:100, saturation:100, hue:0,   blur:0, sharpen:0,  vignette:0,  sepia:0, opacity:100 },
};

export const ANIMATIONS = [
  { id: "none",        name: "None",            duration: 0.0 },
  { id: "fadeIn",      name: "Fade In",         duration: 0.6, icon: "◐" },
  { id: "fadeOut",     name: "Fade Out",        duration: 0.6, icon: "◑" },
  { id: "fadeInOut",   name: "Fade In/Out",     duration: 0.6, icon: "◒" },
  { id: "popIn",       name: "Pop In",          duration: 0.5, icon: "◉" },
  { id: "slideUp",     name: "Slide Up",        duration: 0.7, icon: "⇧" },
  { id: "slideDown",   name: "Slide Down",      duration: 0.7, icon: "⇩" },
  { id: "slideLeft",   name: "Slide Left",      duration: 0.7, icon: "⇦" },
  { id: "slideRight",  name: "Slide Right",     duration: 0.7, icon: "⇨" },
  { id: "zoomIn",      name: "Zoom In",         duration: 0.8, icon: "⊕" },
  { id: "zoomOut",     name: "Zoom Out",        duration: 0.8, icon: "⊖" },
  { id: "kenBurns",    name: "Ken Burns (Pan)", duration: 5.0, icon: "⤡" },
  { id: "typewriter",  name: "Typewriter",      duration: 2.0, icon: "⌨" },
  { id: "bounceIn",    name: "Bounce In",       duration: 0.7, icon: "⤴" },
  { id: "rotateIn",    name: "Rotate In",       duration: 0.8, icon: "⟲" },
  { id: "pulse",       name: "Pulse Loop",      duration: 1.2, icon: "♥" },
  { id: "float",       name: "Float Loop",      duration: 3.0, icon: "☁" },
  { id: "shake",       name: "Shake",           duration: 0.5, icon: "〰" },
  { id: "glitch",      name: "Glitch Flicker",  duration: 0.4, icon: "⚡" },
  { id: "rise",        name: "Rise on Enter",   duration: 1.0, icon: "↑" },
  { id: "spotlight",   name: "Spotlight",       duration: 1.0, icon: "☀" },
];

export const GRADIENTS = [
  { id: "wine",    name: "Burgundy Noir", css: "linear-gradient(135deg,#3a0c19 0%,#7c233c 50%,#b13453 100%)" },
  { id: "rosé",    name: "Rosé Sunset",   css: "linear-gradient(135deg,#e1496d 0%,#b13453 50%,#7c233c 100%)" },
  { id: "crimson", name: "Crimson Tide",  css: "linear-gradient(135deg,#fdf2f4 0%,#d13a5f 40%,#66172e 100%)" },
  { id: "gold",    name: "Rose Gold",     css: "linear-gradient(135deg,#fce7f3 0%,#f472b6 50%,#db2777 100%)" },
  { id: "wineGold",name: "Wine & Rose",   css: "linear-gradient(135deg,#7c233c 0%,#b13453 45%,#ec4899 100%)" },
  { id: "roseG",   name: "Rosé Blush",    css: "linear-gradient(135deg,#fce7f3 0%,#f9a8d4 50%,#f472b6 100%)" },
  { id: "velvet",  name: "Velvet Night",  css: "linear-gradient(135deg,#2d0a15 0%,#4a1025 40%,#6b1530 100%)" },
  { id: "cream",   name: "Blush Cream",   css: "linear-gradient(135deg,#fffdfc 0%,#fdf2f4 50%,#fbe5e9 100%)" },
  { id: "plum",    name: "Plum Dusk",     css: "linear-gradient(135deg,#3a0c19 0%,#7e22ce 100%)" },
  { id: "pearl",   name: "Pearl & Wine",  css: "linear-gradient(135deg,#fdf2f4 0%,#f3e8ff 50%,#fdf2f4 100%)" },
  { id: "coral",   name: "Soft Rose",     css: "linear-gradient(135deg,#fdf2f4 0%,#f472b6 100%)" },
  { id: "noir",    name: "Midnight Noir", css: "linear-gradient(135deg,#23141b 0%,#3a0c19 100%)" },
];

export const BG_MUSIC = [
  { id: "bgm1", name: "Upbeat Synthwave",  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: 372, thumb: "🎵", mood: "Energetic" },
  { id: "bgm2", name: "Ambient Piano",     url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: 372, thumb: "🎹", mood: "Calm" },
  { id: "bgm3", name: "Corporate Uplift",  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: 372, thumb: "🎶", mood: "Motivational" },
  { id: "bgm4", name: "Lo-Fi Chill",       url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",duration: 372, thumb: "🎧", mood: "Chill" },
  { id: "bgm5", name: "Epic Trailer",      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", duration: 372, thumb: "🎺", mood: "Epic" },
  { id: "bgm6", name: "Happy Acoustic",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: 372, thumb: "🎸", mood: "Happy" },
];

export const STOCK_MEDIA = [
  { id: "sv1", name: "Data Animation",       type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-animation-of-a-screen-with-graphs-34356-large.mp4", duration: 8,  thumb: "📊" },
  { id: "sv2", name: "Modern Office",        type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-in-a-bright-office-42323-large.mp4", duration: 12, thumb: "💻" },
  { id: "sv3", name: "Cinematic Forest",     type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-forest-and-river-42358-large.mp4", duration: 15, thumb: "🌲" },
  { id: "sv4", name: "City Timelapse",       type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-street-with-vehicles-in-the-city-at-night-34731-large.mp4", duration: 9, thumb: "🏙" },
  { id: "sv5", name: "Abstract Particles",   type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-shimmering-lights-turning-in-circle-42957-large.mp4", duration: 14, thumb: "✨" },
  { id: "sv6", name: "Flying Through Clouds",type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-flying-through-the-clouds-in-a-timelapse-168-large.mp4", duration: 18, thumb: "☁" },
  { id: "si1", name: "Hero Landscape",       type: "image", url: "https://picsum.photos/id/1018/1920/1080", duration: 5, thumb: "🏔" },
  { id: "si2", name: "City Street",          type: "image", url: "https://picsum.photos/id/1067/1920/1080", duration: 5, thumb: "🛣" },
  { id: "si3", name: "Tech Workspace",       type: "image", url: "https://picsum.photos/id/180/1920/1080", duration: 5, thumb: "📸" },
  { id: "si4", name: "Creative Palette",     type: "image", url: "https://picsum.photos/id/200/1920/1080", duration: 5, thumb: "🎨" },
  { id: "si5", name: "Ocean Horizon",        type: "image", url: "https://picsum.photos/id/1015/1920/1080", duration: 5, thumb: "🌊" },
  { id: "si6", name: "Desert Dunes",         type: "image", url: "https://picsum.photos/id/1019/1920/1080", duration: 5, thumb: "🏜" },
  ...BG_MUSIC,
];

export const STICKERS = [
  { id: "st1", name: "Fire",     emoji: "🔥" },
  { id: "st2", name: "Sparkles", emoji: "✨" },
  { id: "st3", name: "Heart",    emoji: "❤️" },
  { id: "st4", name: "Like",     emoji: "👍" },
  { id: "st5", name: "Wow",      emoji: "😮" },
  { id: "st6", name: "Laugh",    emoji: "😂" },
  { id: "st7", name: "Star",     emoji: "⭐" },
  { id: "st8", name: "Party",    emoji: "🎉" },
  { id: "st9", name: "Music",    emoji: "🎵" },
  { id: "st10",name: "Check",    emoji: "✅" },
  { id: "st11",name: "Arrow",    emoji: "➡️" },
  { id: "st12",name: "Lightbulb",emoji: "💡" },
  { id: "st13",name: "Lightning",emoji: "⚡" },
  { id: "st14",name: "Gift",     emoji: "🎁" },
  { id: "st15",name: "Crown",    emoji: "👑" },
  { id: "st16",name: "Globe",    emoji: "🌍" },
  { id: "st17",name: "Coffee",   emoji: "☕" },
  { id: "st18",name: "Camera",   emoji: "📸" },
  { id: "st19",name: "Rocket",   emoji: "🚀" },
  { id: "st20",name: "Diamond",  emoji: "💎" },
];

export const DEV_TEMPLATES = [
  {
    id: "dev_saas_launch",
    name: "🚀 SaaS Hero & Product Launch",
    desc: "Browser mockup frame, animated headline, feature callouts & CTA for product releases",
    duration: 15,
    tag: "Launch",
    icon: "🚀"
  },
  {
    id: "dev_terminal_cli",
    name: "💻 CLI & Terminal Walkthrough",
    desc: "Mac terminal window, live typing commands, fast build output, and version badge",
    duration: 12,
    tag: "Developer Tool",
    icon: "💻"
  },
  {
    id: "dev_code_spotlight",
    name: "⚡ Code & API Feature Spotlight",
    desc: "Syntax-highlighted code editor card, line highlight spotlight, benchmark badges",
    duration: 14,
    tag: "API & SDK",
    icon: "⚡"
  },
  {
    id: "dev_changelog",
    name: "📦 Release Changelog & Fixes",
    desc: "Version bump announcement, split feature breakdown, and star on GitHub callout",
    duration: 10,
    tag: "Changelog",
    icon: "📦"
  },
  {
    id: "dev_mobile_web",
    name: "📱 Responsive Cross-Platform Demo",
    desc: "Side-by-side desktop browser and mobile device mockup showcase",
    duration: 16,
    tag: "Multi-Platform",
    icon: "📱"
  }
];

export const DEV_CODE_PRESETS = [
  {
    id: "code_react",
    name: "React 19 Server Component",
    lang: "tsx",
    filename: "ProductHero.tsx",
    code: `export async function ProductHero({ orgId }: Props) {
  const analytics = await getRealtimeMetrics(orgId);
  
  return (
    <div className="flex items-center gap-4 p-8 rounded-2xl bg-indigo-50 border border-indigo-200">
      <SparklesIcon className="w-8 h-8 text-indigo-600 animate-pulse" />
      <div>
        <h1 className="text-3xl font-black text-slate-900">Blazing Fast Studio</h1>
        <p className="text-sm text-slate-600">Active Nodes: {analytics.totalActive}</p>
      </div>
    </div>
  );
}`
  },
  {
    id: "code_python",
    name: "FastAPI Async AI Service",
    lang: "python",
    filename: "main.py",
    code: `@app.post("/api/v1/generate-video")
async def generate_product_video(payload: VideoRequest):
    pipeline = AICompositionEngine(gpu_acceleration=True)
    result = await pipeline.render_async(
        timeline=payload.timeline,
        codec="h264",
        fps=60
    )
    return {"status": "success", "latency_ms": 42.8, "url": result.cdn_url}`
  },
  {
    id: "code_rust",
    name: "Rust High-Speed Codec",
    lang: "rust",
    filename: "engine.rs",
    code: `pub fn process_timeline_frame(buffer: &mut [u8], width: u32, height: u32) -> Result<(), RenderError> {
    let raw_pixels = RayonParallelIterator::new(buffer);
    raw_pixels.for_each(|pixel| {
        apply_shader_grade(pixel, ColorSpace::LinearRgb);
    });
    Ok(())
}`
  },
  {
    id: "code_typescript",
    name: "TypeScript Client SDK",
    lang: "typescript",
    filename: "client.ts",
    code: `import { CreatifyClient } from '@creatify/sdk';

const creatify = new CreatifyClient({
  apiKey: process.env.CREATIFY_KEY,
  region: 'us-east-1',
  cache: true,
});

const video = await creatify.videos.create({
  template: 'saas-hero',
  theme: 'light',
  exportFormat: 'mp4',
});`
  },
  {
    id: "code_docker",
    name: "Docker Compose Microservices",
    lang: "yaml",
    filename: "docker-compose.yml",
    code: `version: '3.8'
services:
  creatify-engine:
    image: creatify/video-worker:latest
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - CONCURRENCY=16
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]`
  }
];

export const DEV_TERMINAL_PRESETS = [
  {
    id: "term_npm",
    name: "NPM Package Install",
    title: "zsh — creatify-app — 80x24",
    prompt: "alex@macbook:~/projects/creatify$",
    command: "npx create-creatify-app@latest my-startup --template=saas",
    output: `✔ Resolving packages...
✔ Installing React 19, Vite, Tailwind CSS v4, Lucide Icons
✔ Compiling native video WASM acceleration engine
✨ Project created successfully in 1.4s!

To start development:
  cd my-startup
  npm run dev  --> http://localhost:5173`
  },
  {
    id: "term_git",
    name: "Git Release Commit & Push",
    title: "zsh — git repo — 80x24",
    prompt: "dev@workstation:~/creatify-core (main)$",
    command: 'git commit -m "feat(engine): 60fps canvas renderer + developer light studio"',
    output: `[main 8a93bf1] feat(engine): 60fps canvas renderer + developer light studio
 8 files changed, 542 insertions(+), 18 deletions(-)
 create mode 100644 src/components/DeveloperStudio.jsx
🚀 Pushed to origin/main (all CI checks passed)`
  },
  {
    id: "term_cargo",
    name: "Cargo Build Optimized",
    title: "bash — rust compiler",
    prompt: "root@render-node-01:~/wasm-core#",
    command: "cargo build --release --target wasm32-unknown-unknown",
    output: `   Compiling creatify-wasm-pipeline v2.4.0
   Compiling ffmpeg-next-sys v5.1.2
   Compiling image-filters v0.9.1
    Finished release [optimized + lto] target(s) in 3.12s
⚡ Binary size: 480 KB (Gzipped)`
  },
  {
    id: "term_curl",
    name: "REST API Curl Request",
    title: "zsh — api client",
    command: `curl -X POST https://api.creatify.dev/v1/projects \\
  -H "Authorization: Bearer dev_sec_9942" \\
  -d '{"template":"saas_launch","fps":60}'`,
    output: `{
  "status": "success",
  "project_id": "proj_88fa29",
  "render_time_ms": 128.4,
  "download_url": "https://cdn.creatify.dev/export/saas_v1.mp4"
}`
  }
];

export const DEV_BADGES = [
  { id: "b_react", name: "React 19", category: "Stack", bg: "#e0f2fe", border: "#38bdf8", text: "#0369a1", icon: "⚛️" },
  { id: "b_next", name: "Next.js 15", category: "Stack", bg: "#f1f5f9", border: "#64748b", text: "#0f172a", icon: "▲" },
  { id: "b_ts", name: "TypeScript", category: "Stack", bg: "#dbeafe", border: "#60a5fa", text: "#1d4ed8", icon: "🔷" },
  { id: "b_rust", name: "Rust", category: "Stack", bg: "#ffedd5", border: "#fb923c", text: "#c2410c", icon: "🦀" },
  { id: "b_python", name: "Python", category: "Stack", bg: "#fef3c7", border: "#facc15", text: "#854d0e", icon: "🐍" },
  { id: "b_docker", name: "Docker Ready", category: "Stack", bg: "#e0f2fe", border: "#0ea5e9", text: "#0369a1", icon: "🐳" },
  { id: "b_tailwind", name: "Tailwind CSS", category: "Stack", bg: "#ccfbf1", border: "#2dd4bf", text: "#0f766e", icon: "🎨" },
  { id: "b_ai", name: "AI Powered", category: "Stack", bg: "#f3e8ff", border: "#c084fc", text: "#7e22ce", icon: "✨" },
  { id: "b_fast", name: "⚡ 10x Blazing Fast", category: "Metric", bg: "#fef9c3", border: "#fde047", text: "#a16207", icon: "⚡" },
  { id: "b_stars", name: "⭐ 15k GitHub Stars", category: "Metric", bg: "#fff7ed", border: "#fdba74", text: "#c2410c", icon: "⭐" },
  { id: "b_zero", name: "Zero Dependencies", category: "Metric", bg: "#ecfdf5", border: "#34d399", text: "#047857", icon: "🛡️" },
  { id: "b_typesafe", name: "100% Type-Safe", category: "Metric", bg: "#eff6ff", border: "#60a5fa", text: "#1d4ed8", icon: "🔒" },
  { id: "b_v2", name: "🚀 v2.0 Released", category: "Release", bg: "#ede9fe", border: "#a78bfa", text: "#6d28d9", icon: "🚀" },
  { id: "b_new", name: "✨ New Feature", category: "Release", bg: "#fdf2f8", border: "#f472b6", text: "#be185d", icon: "✨" },
  { id: "b_bug", name: "🐛 Bug Fixed", category: "Release", bg: "#fef2f2", border: "#f87171", text: "#b91c1c", icon: "🐛" },
  { id: "b_open", name: "Open Source (MIT)", category: "Release", bg: "#f0fdf4", border: "#4ade80", text: "#15803d", icon: "💚" },
];

export const DEV_SFX = [
  { id: "sfx_key1", name: "Keyboard Click", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", duration: 1, thumb: "⌨️", category: "Mechanical" },
  { id: "sfx_bell", name: "Terminal Bell", url: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3", duration: 2, thumb: "🔔", category: "Terminal" },
  { id: "sfx_pop", name: "Button Pop", url: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", duration: 1, thumb: "🔘", category: "UI" },
  { id: "sfx_snap", name: "Snap / Shutter", url: "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3", duration: 1, thumb: "📸", category: "Mockup" },
  { id: "sfx_cheer", name: "Deploy Fanfare", url: "https://assets.mixkit.co/active_storage/sfx/2805/2805-preview.mp3", duration: 4, thumb: "🎉", category: "Launch" },
  { id: "sfx_whoosh", name: "Fast Whoosh", url: "https://assets.mixkit.co/active_storage/sfx/2688/2688-preview.mp3", duration: 2, thumb: "💨", category: "Transition" },
];

export const CANVAS_PATTERNS = [
  { id: "dot_grid", name: "Developer Dot Grid", bg: "#f8fafc", gridColor: "#cbd5e1", type: "dots" },
  { id: "blueprint", name: "Engineering Blueprint", bg: "#0f172a", gridColor: "#334155", type: "grid" },
  { id: "clean_white", name: "Clean Studio Light", bg: "#ffffff", gridColor: "transparent", type: "solid" },
  { id: "soft_gradient", name: "Indigo Mesh Glow", bg: "linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 50%, #fae8ff 100%)", type: "gradient" },
  { id: "dark_glass", name: "Midnight Terminal Dark", bg: "#090d16", gridColor: "#1e293b", type: "dots" },
];

export const TEMPLATES = DEV_TEMPLATES;


export const INITIAL_STATE = {
  tracks: [],
  playhead: 0,
  inPoint: null,
  outPoint: null,
  markers: [],
  isPlaying: false,
  duration: 60,
  zoom: 1,
  snap: true,
  selectedClip: null,
  selectedClips: [],
  selectedTrack: null,
  aspectRatio: "16:9",
  customW: 1920,
  customH: 1080,
  backgroundColor: "#fdf2f4",
  backgroundType: "color",
  backgroundGradient: "wine",
  grid: false,
  rulers: false,
  safeArea: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  opacity: 100,
  sepia: 0,
  blur: 0,
  sharpen: 0,
  vignette: 0,
  exportProgress: null,
  previewMode: false,
  playbackSpeed: 1,
  history: [],
  future: [],
};

export const DEFAULT_CLIP_FILTERS = () => ({
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  sepia: 0,
  blur: 0,
  sharpen: 0,
  opacity: 100,
  vignette: 0,
});

export const DEFAULT_CLIP_TRANSFORM = () => ({
  x: 0,
  y: 0,
  scale: 100,
  scaleX: 100,
  scaleY: 100,
  rotation: 0,
  flipH: false,
  flipV: false,
  cropX: 0,
  cropY: 0,
  cropW: 100,
  cropH: 100,
  cornerRadius: 0,
  borderColor: "",
  borderWidth: 0,
  shadowBlur: 0,
  shadowColor: "rgba(0,0,0,0.5)",
  shadowOffsetX: 0,
  shadowOffsetY: 6,
  zIndex: 0,
});

export const DEFAULT_CLIP_AUDIO = () => ({
  volume: 100,
  mute: false,
  solo: false,
  fadeIn: 0,
  fadeOut: 0,
  pitch: 100,
  pan: 0,
});

let _id = 1;
export const uid = () => `id_${Date.now().toString(36)}_${_id++}_${Math.random().toString(36).slice(2, 7)}`;

export const fmtTime = (s) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 100);
  return `${m}:${String(sec).padStart(2,"0")}.${String(ms).padStart(2,"0")}`;
};

export const fmtTimeLong = (s) => {
  if (!isFinite(s) || s < 0) s = 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  return `${m}:${String(sec).padStart(2,"0")}`;
};

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutElastic = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
