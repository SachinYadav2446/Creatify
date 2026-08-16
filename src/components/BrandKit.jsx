import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Palette, Type, Image as ImageIcon, Sparkles, 
  Download, Upload, Copy, Check, Plus, Trash2, Sliders, Shield, Eye, RefreshCw,
  Code2, CheckCircle2, AlertCircle, ExternalLink, Zap, Terminal, Laptop, Layers,
  Compass, Share2, Sparkle
} from "lucide-react";

// Curated Developer & SaaS Brand Theme Presets
const PRESET_BRAND_KITS = [
  {
    id: "linear_rose",
    name: "Linear Obsidian",
    tagline: "Issue tracking built for high-performance software teams.",
    primary: "#e1496d",
    accent: "#942945",
    dark: "#0b0409",
    card: "#150912",
    surfaceLight: "#fff5f8",
    displayFont: "Syne",
    headingFont: "Syne",
    bodyFont: "Plus Jakarta Sans",
    codeFont: "JetBrains Mono",
    keywords: ["Velocity", "Precision", "Dark", "Minimal"],
  },
  {
    id: "supabase_emerald",
    name: "Supabase Emerald",
    tagline: "The open source Firebase alternative for modern builders.",
    primary: "#16a34a",
    accent: "#0284c7",
    dark: "#06130b",
    card: "#0d2417",
    surfaceLight: "#f0fdf4",
    displayFont: "Space Grotesk",
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
    codeFont: "JetBrains Mono",
    keywords: ["Open Source", "Database", "Realtime", "SQL"],
  },
  {
    id: "stripe_indigo",
    name: "Stripe Indigo",
    tagline: "Financial infrastructure for the global internet economy.",
    primary: "#4f46e5",
    accent: "#9333ea",
    dark: "#080914",
    card: "#101326",
    surfaceLight: "#eef2ff",
    displayFont: "Plus Jakarta Sans",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    codeFont: "JetBrains Mono",
    keywords: ["Fintech", "Global", "Reliable", "Scalable"],
  },
  {
    id: "raycast_neon",
    name: "Raycast Cyber",
    tagline: "Supercharged productivity tool for engineers and creators.",
    primary: "#e11d48",
    accent: "#ea580c",
    dark: "#0c0406",
    card: "#18080d",
    surfaceLight: "#fff1f2",
    displayFont: "Outfit",
    headingFont: "Outfit",
    bodyFont: "Plus Jakarta Sans",
    codeFont: "JetBrains Mono",
    keywords: ["Blazing Fast", "Keyboard First", "Extensions"],
  },
  {
    id: "tailwind_cyan",
    name: "Tailwind Horizon",
    tagline: "Rapidly build modern websites without ever leaving your HTML.",
    primary: "#0284c7",
    accent: "#0d9488",
    dark: "#030d14",
    card: "#071a26",
    surfaceLight: "#f0f9ff",
    displayFont: "Inter",
    headingFont: "Inter",
    bodyFont: "Inter",
    codeFont: "JetBrains Mono",
    keywords: ["Utility First", "Responsive", "Modern"],
  }
];

export default function BrandKit({ onBack, user, onNavigate }) {
  const [activeTab, setActiveTab] = useState("palettes"); // "palettes", "playground", "typography", "dev_tokens", "assets", "voice", "preview"
  const [copiedHex, setCopiedHex] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [tokenTab, setTokenTab] = useState("tailwind"); // "tailwind" | "css" | "json" | "typescript"

  const ui = {
    bg: "radial-gradient(ellipse at 50% 0%, #fdf2f7 0%, #f7edf3 60%, #f2e6ee 100%)",
    headerBg: "rgba(255, 255, 255, 0.94)",
    headerBorder: "rgba(148, 41, 69, 0.12)",
    subHeaderBg: "rgba(255, 255, 255, 0.8)",
    subHeaderBorder: "rgba(148, 41, 69, 0.08)",
    cardBg: "#ffffff",
    cardBorder: "rgba(148, 41, 69, 0.14)",
    textPrimary: "#1a040d",
    textSecondary: "rgba(26, 4, 13, 0.62)",
    sidebarActiveBg: "linear-gradient(135deg, rgba(225, 73, 109, 0.15), rgba(148, 41, 69, 0.08))",
    sidebarInactiveBg: "rgba(255, 255, 255, 0.75)",
    sidebarTextActive: "#e1496d",
    sidebarTextInactive: "rgba(26, 4, 13, 0.7)",
    inputBg: "rgba(255, 255, 255, 0.95)",
    inputBorder: "rgba(148, 41, 69, 0.22)",
    codeBg: "#0f172a",
    codeText: "#38bdf8",
  };

  const defaultBrandKit = {
    brandName: "Creatify Engine",
    tagline: "High-performance creative engineering and visual design suite.",
    mission: "To empower software engineers, creators, and dev teams to build world-class brand identities and technical diagrams effortlessly.",
    keywords: ["Velocity", "High-End", "WASM", "Precision", "Developer-First"],
    palettes: [
      { id: "primary", name: "Primary Rose", hex: "#e1496d", role: "Primary Brand & Main CTA" },
      { id: "accent", name: "Cyber Cyan", hex: "#0284c7", role: "Interactive Highlights & Badges" },
      { id: "secondary", name: "Deep Wine", hex: "#942945", role: "Secondary Accents & Borders" },
      { id: "success", name: "Emerald Green", hex: "#16a34a", role: "Success States & Metrics" },
      { id: "dark", name: "Charcoal Slate", hex: "#0f172a", role: "Contrast Dark Surfaces" },
      { id: "surfaceLight", name: "Pure Canvas", hex: "#ffffff", role: "Main Light Surface" },
    ],
    gradients: [
      { name: "Electric Rose", from: "#e1496d", to: "#942945" },
      { name: "Cyber Sunset", from: "#e1496d", to: "#0284c7" },
      { name: "Aurora Wave", from: "#0284c7", to: "#16a34a" },
    ],
    typography: {
      displayFont: "Syne",
      headingFont: "Syne",
      bodyFont: "Plus Jakarta Sans",
      codeFont: "JetBrains Mono",
      scale: {
        hero: "48px",
        h1: "36px",
        h2: "26px",
        h3: "18px",
        body: "14px",
        caption: "11px",
      }
    },
    logos: [
      { id: 1, name: "Primary Brand Mark", type: "Light Background", color: "#e1496d", icon: "terminal" },
      { id: 2, name: "Monochrome Dark Mark", type: "Dark Background", color: "#0f172a", icon: "brackets" },
      { id: 3, name: "Favicon / Micro Badge", type: "App Store Badge", color: "#0284c7", icon: "cube" },
    ],
    voicePersona: {
      formality: 70,
      energy: 85,
      boldness: 90,
      techLevel: 95,
    }
  };

  const [brandKit, setBrandKit] = useState(() => {
    try {
      const saved = localStorage.getItem("creatify_brand_kit");
      return saved ? JSON.parse(saved) : defaultBrandKit;
    } catch {
      return defaultBrandKit;
    }
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const saveBrandKit = (updated) => {
    setBrandKit(updated);
    try {
      localStorage.setItem("creatify_brand_kit", JSON.stringify(updated));
      showToast("✓ Brand Kit saved & synced across all tools");
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text, identifier) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(identifier);
    showToast(`Copied "${text}" to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleColorChange = (id, newHex) => {
    const updated = {
      ...brandKit,
      palettes: brandKit.palettes.map(p => p.id === id ? { ...p, hex: newHex } : p)
    };
    saveBrandKit(updated);
  };

  const handleAddColor = () => {
    const newId = `color_${Date.now()}`;
    const updated = {
      ...brandKit,
      palettes: [
        ...brandKit.palettes,
        { id: newId, name: "New Accent", hex: "#9333ea", role: "Custom Accent" }
      ]
    };
    saveBrandKit(updated);
  };

  const handleDeleteColor = (id) => {
    if (brandKit.palettes.length <= 2) {
      alert("You must maintain at least 2 primary brand colors in your system.");
      return;
    }
    const updated = {
      ...brandKit,
      palettes: brandKit.palettes.filter(p => p.id !== id)
    };
    saveBrandKit(updated);
  };

  const applyPreset = (preset) => {
    const updated = {
      ...brandKit,
      brandName: preset.name,
      tagline: preset.tagline,
      keywords: preset.keywords,
      palettes: [
        { id: "primary", name: "Primary Brand", hex: preset.primary, role: "Primary Brand & Main CTA" },
        { id: "accent", name: "Accent Highlight", hex: preset.accent, role: "Interactive Highlights & Badges" },
        { id: "secondary", name: "Secondary Dark", hex: preset.dark, role: "Contrast Dark Surfaces" },
        { id: "surfaceLight", name: "Pure Canvas", hex: preset.surfaceLight, role: "Main Light Surface" },
      ],
      gradients: [
        { name: "Primary Glow", from: preset.primary, to: preset.accent },
        { name: "Soft Fade", from: preset.primary, to: preset.surfaceLight }
      ],
      typography: {
        ...brandKit.typography,
        displayFont: preset.displayFont,
        headingFont: preset.headingFont,
        bodyFont: preset.bodyFont,
        codeFont: preset.codeFont,
      }
    };
    saveBrandKit(updated);
    showToast(`✓ Applied "${preset.name}" preset!`);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brandKit, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${brandKit.brandName.toLowerCase().replace(/\s+/g, "_")}_tokens.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("✓ Exported Design Tokens JSON!");
  };

  const primaryColor = brandKit.palettes.find(p => p.id === "primary")?.hex || "#e1496d";
  const accentColor = brandKit.palettes.find(p => p.id === "accent")?.hex || "#0284c7";

  // Code Exporters
  const generateTailwindConfig = () => {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
${brandKit.palettes.map(p => `          ${p.id}: "${p.hex}",`).join("\n")}
        }
      },
      fontFamily: {
        display: ["${brandKit.typography.displayFont}", "sans-serif"],
        heading: ["${brandKit.typography.headingFont}", "sans-serif"],
        body: ["${brandKit.typography.bodyFont}", "sans-serif"],
        mono: ["${brandKit.typography.codeFont}", "monospace"],
      }
    }
  }
};`;
  };

  const generateCSSVariables = () => {
    return `:root {
  /* Brand Color Tokens */
${brandKit.palettes.map(p => `  --color-${p.id}: ${p.hex};`).join("\n")}

  /* Typography */
  --font-display: '${brandKit.typography.displayFont}', sans-serif;
  --font-heading: '${brandKit.typography.headingFont}', sans-serif;
  --font-body: '${brandKit.typography.bodyFont}', sans-serif;
  --font-mono: '${brandKit.typography.codeFont}', monospace;
}`;
  };

  const generateTypeScriptTokens = () => {
    return `export const BrandTokens = {
  name: "${brandKit.brandName}",
  colors: {
${brandKit.palettes.map(p => `    ${p.id}: "${p.hex}",`).join("\n")}
  },
  typography: {
    display: "${brandKit.typography.displayFont}",
    heading: "${brandKit.typography.headingFont}",
    body: "${brandKit.typography.bodyFont}",
    mono: "${brandKit.typography.codeFont}",
  }
} as const;

export type BrandColor = keyof typeof BrandTokens.colors;`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: ui.bg,
      color: ui.textPrimary,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: 20, right: 24, zIndex: 9999,
          background: "linear-gradient(135deg, #e1496d, #942945)",
          color: "#fff", padding: "10px 20px", borderRadius: 12,
          fontSize: 13, fontWeight: 700,
          boxShadow: "0 10px 30px rgba(225, 73, 109, 0.3)",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", gap: 8,
          animation: "fadeIn 0.2s ease",
        }}>
          <CheckCircle2 size={16} />
          {toastMsg}
        </div>
      )}

      {/* Top Navigation Bar */}
      <header style={{
        padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${ui.headerBorder}`,
        background: ui.headerBg,
        backdropFilter: "blur(16px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(225, 73, 109, 0.1)",
              border: "1px solid rgba(225, 73, 109, 0.25)",
              color: "#e1496d", borderRadius: 10,
              padding: "7px 14px", cursor: "pointer", fontSize: 12.5, fontWeight: 700,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(225, 73, 109, 0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(225, 73, 109, 0.1)"}
          >
            <ArrowLeft size={15} />
            Back to Hub
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, fontFamily: "Syne, sans-serif", color: ui.textPrimary }}>
                Brand Kit & Design System
              </h1>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 99,
                background: "rgba(22, 163, 74, 0.12)", color: "#16a34a",
                border: "1px solid rgba(22, 163, 74, 0.3)", fontWeight: 800,
              }}>
                ⚡ LIVE TOKENS SYNCED
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 11.5, color: ui.textSecondary }}>
              Single source of truth for colors, typography, code tokens, and UI components across all Creatify tools.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={exportJSON}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(2, 132, 199, 0.12)", border: "1px solid rgba(2, 132, 199, 0.3)",
              color: "#0284c7", borderRadius: 10, padding: "7px 14px", cursor: "pointer",
              fontSize: 12, fontWeight: 700,
            }}
          >
            <Download size={13} />
            Export Tokens JSON
          </button>

          <button
            onClick={() => {
              saveBrandKit(defaultBrandKit);
              showToast("Reset to default Creatify Engine Brand Kit");
            }}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: `1px solid ${ui.headerBorder}`,
              color: ui.textSecondary, borderRadius: 10, padding: "7px 12px",
              cursor: "pointer", fontSize: 12,
            }}
            title="Reset to default brand kit"
          >
            <RefreshCw size={12} />
            Reset
          </button>
        </div>
      </header>

      {/* Quick Curated Brand Theme Bar */}
      <div style={{
        padding: "10px 28px",
        background: ui.subHeaderBg,
        borderBottom: `1px solid ${ui.subHeaderBorder}`,
        display: "flex", alignItems: "center", gap: 12, overflowX: "auto"
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#e1496d", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
          ⚡ 1-CLICK PRESETS:
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {PRESET_BRAND_KITS.map(p => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "4px 12px", borderRadius: 8,
                background: "#ffffff",
                border: "1px solid rgba(148, 41, 69, 0.14)",
                color: ui.textPrimary, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                whiteSpace: "nowrap", transition: "all 0.15s ease",
                boxShadow: "0 2px 6px rgba(148, 41, 69, 0.04)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(225,73,109,0.1)"; e.currentTarget.style.borderColor = "rgba(225,73,109,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "rgba(148, 41, 69, 0.14)"; }}
            >
              <div style={{ display: "flex", gap: 3 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.primary }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.accent }} />
              </div>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Body: 2-Column Split */}
      <div style={{ display: "flex", flex: 1, maxWidth: 1480, width: "100%", margin: "0 auto", padding: "24px 28px 48px", gap: 28 }}>
        
        {/* Left Navigation Sidebar Tabs */}
        <aside style={{ width: 240, display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {[
            { id: "palettes", label: "Color Tokens", icon: Palette, desc: "Hex Swatches & Gradients" },
            { id: "playground", label: "Live UI Playground", icon: Laptop, desc: "Interactive Component Demo" },
            { id: "typography", label: "Typography Rules", icon: Type, desc: "Font Pairings & Scale" },
            { id: "dev_tokens", label: "Developer Tokens", icon: Code2, desc: "Tailwind, CSS, TypeScript" },
            { id: "assets", label: "Logo & Asset Locker", icon: ImageIcon, desc: "Vector Marks & Favicons" },
            { id: "voice", label: "Voice & Persona", icon: Sliders, desc: "Tone, Keywords & AI Specs" },
            { id: "preview", label: "Styleguide Spec", icon: Eye, desc: "Official Brand Document" },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 14px", borderRadius: 12,
                  background: active ? ui.sidebarActiveBg : ui.sidebarInactiveBg,
                  border: `1px solid ${active ? "rgba(225, 73, 109, 0.4)" : ui.cardBorder}`,
                  color: active ? ui.sidebarTextActive : ui.sidebarTextInactive,
                  cursor: "pointer", textAlign: "left", transition: "all 0.18s ease",
                  outline: "none",
                  boxShadow: active ? "0 4px 12px rgba(225, 73, 109, 0.08)" : "none"
                }}
              >
                <Icon size={18} style={{ marginTop: 2, color: active ? "#e1496d" : ui.textSecondary }} />
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 800 }}>
                    {tab.label}
                  </div>
                  <div style={{ fontSize: 10.5, color: ui.textSecondary, marginTop: 2 }}>
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}

          <div style={{ marginTop: "auto", padding: 14, borderRadius: 12, background: "rgba(225,73,109,0.06)", border: `1px solid ${ui.headerBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#e1496d", fontSize: 11.5, fontWeight: 700, marginBottom: 4 }}>
              <Shield size={13} />
              Global Enforcement
            </div>
            <p style={{ margin: 0, fontSize: 10.5, color: ui.textSecondary, lineHeight: 1.45 }}>
              All 3D Mockups, Pipelines, Slide Decks, and Whiteboard nodes automatically synchronize with these active tokens.
            </p>
          </div>
        </aside>

        {/* Main Content Workspace Panel */}
        <main style={{ flex: 1, minWidth: 0 }}>
          
          {/* TAB 1: COLOR PALETTES */}
          {activeTab === "palettes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif", color: ui.textPrimary }}>
                    Brand Color Tokens
                  </h2>
                  <p style={{ margin: 0, fontSize: 12.5, color: ui.textSecondary }}>
                    Click any hex code to copy or click the color square to customize. Tokens sync instantly to CSS & Tailwind.
                  </p>
                </div>
                <button
                  onClick={handleAddColor}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 10,
                    background: "linear-gradient(135deg, #e1496d, #942945)",
                    border: "none", color: "#fff", fontSize: 12, fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(225, 73, 109, 0.25)"
                  }}
                >
                  <Plus size={14} /> Add Color Swatch
                </button>
              </div>

              {/* Color Swatches Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {brandKit.palettes.map((color) => {
                  const isCopied = copiedHex === color.id;
                  return (
                    <div
                      key={color.id}
                      style={{
                        borderRadius: 14, overflow: "hidden",
                        background: ui.cardBg,
                        border: `1px solid ${ui.cardBorder}`,
                        boxShadow: "0 6px 20px rgba(148, 41, 69, 0.05)",
                      }}
                    >
                      {/* Swatch Top Preview Box */}
                      <div style={{
                        height: 95, background: color.hex,
                        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                        padding: 12, position: "relative",
                      }}>
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange(color.id, e.target.value)}
                          style={{
                            position: "absolute", top: 8, right: 8,
                            width: 28, height: 28, border: "2px solid #fff",
                            borderRadius: 6, cursor: "pointer", padding: 0,
                            background: "transparent",
                          }}
                          title="Click to pick new hex color"
                        />
                        <button
                          onClick={() => copyToClipboard(color.hex, color.id)}
                          style={{
                            padding: "3px 8px", borderRadius: 6,
                            background: "rgba(0,0,0,0.75)", color: "#fff",
                            fontSize: 11, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
                            border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                          }}
                        >
                          <span>{color.hex.toUpperCase()}</span>
                          {isCopied ? <Check size={10} color="#22c55e" /> : <Copy size={10} />}
                        </button>
                      </div>

                      {/* Swatch Metadata Fields */}
                      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <input
                            type="text"
                            value={color.name}
                            onChange={(e) => {
                              const updated = {
                                ...brandKit,
                                palettes: brandKit.palettes.map(p => p.id === color.id ? { ...p, name: e.target.value } : p)
                              };
                              saveBrandKit(updated);
                            }}
                            style={{
                              background: "transparent", border: "none", outline: "none",
                              color: ui.textPrimary, fontSize: 14, fontWeight: 800, fontFamily: "Syne, sans-serif",
                              width: "80%",
                            }}
                          />
                          {brandKit.palettes.length > 2 && (
                            <button
                              onClick={() => handleDeleteColor(color.id)}
                              style={{
                                background: "none", border: "none", color: "rgba(239,68,68,0.7)",
                                cursor: "pointer", padding: 2,
                              }}
                              title="Delete swatch"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={color.role}
                          onChange={(e) => {
                            const updated = {
                              ...brandKit,
                              palettes: brandKit.palettes.map(p => p.id === color.id ? { ...p, role: e.target.value } : p)
                            };
                            saveBrandKit(updated);
                          }}
                          placeholder="Role (e.g. Primary CTA)"
                          style={{
                            width: "100%", background: "transparent", border: "none", outline: "none",
                            color: ui.textSecondary, fontSize: 11.5,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gradients Section */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "Syne, sans-serif", marginBottom: 12, color: ui.textPrimary }}>
                  Brand Continuous Linear Gradients
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                  {brandKit.gradients.map((grad, i) => (
                    <div key={i} style={{
                      padding: 14, borderRadius: 14,
                      background: ui.cardBg, border: `1px solid ${ui.cardBorder}`,
                      boxShadow: "0 4px 14px rgba(148, 41, 69, 0.04)"
                    }}>
                      <div style={{
                        height: 55, borderRadius: 8,
                        background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        marginBottom: 8,
                      }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: ui.textPrimary }}>{grad.name}</span>
                        <button
                          onClick={() => copyToClipboard(`linear-gradient(135deg, ${grad.from}, ${grad.to})`, `grad_${i}`)}
                          style={{
                            background: "none", border: "none", color: "#0284c7",
                            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4, fontWeight: 700
                          }}
                        >
                          <Copy size={11} />
                          CSS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE COMPONENT PLAYGROUND */}
          {activeTab === "playground" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif", color: ui.textPrimary }}>
                  Live Component Playground
                </h2>
                <p style={{ margin: 0, fontSize: 12.5, color: ui.textSecondary }}>
                  Real-time preview of how your brand tokens render across web navigation, hero buttons, cards, and code snippets.
                </p>
              </div>

              {/* Rendered Mockup Container */}
              <div style={{
                borderRadius: 16, overflow: "hidden",
                border: "1px solid rgba(148,41,69,0.18)",
                background: "#ffffff",
                color: "#0f172a",
                boxShadow: "0 16px 40px rgba(148,41,69,0.08)",
                padding: "24px", display: "flex", flexDirection: "column", gap: "20px"
              }}>
                
                {/* 1. Header Navigation Bar */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 16px", borderRadius: 10,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 11 }}>
                      {brandKit.brandName.charAt(0)}
                    </div>
                    <span style={{ fontFamily: brandKit.typography.displayFont, fontWeight: 800, fontSize: 14 }}>
                      {brandKit.brandName}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, opacity: 0.8 }}>
                    <span>Features</span>
                    <span>Documentation</span>
                    <span>Pricing</span>
                  </div>
                  <button style={{
                    padding: "6px 14px", borderRadius: 6, border: "none",
                    background: primaryColor, color: "#fff",
                    fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                    boxShadow: `0 4px 12px ${primaryColor}30`
                  }}>
                    Deploy App
                  </button>
                </div>

                {/* 2. Hero Section Card */}
                <div style={{
                  padding: "28px", borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(225,73,109,0.06), rgba(2,132,199,0.04))",
                  border: "1px solid rgba(148,41,69,0.15)",
                  textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12
                }}>
                  <span style={{
                    fontSize: 10.5, padding: "3px 10px", borderRadius: 99,
                    background: `${accentColor}18`, color: accentColor,
                    border: `1px solid ${accentColor}35`, fontWeight: 800
                  }}>
                    ✨ VERSION 2.4.0 NOW LIVE
                  </span>
                  <h3 style={{
                    fontFamily: brandKit.typography.headingFont,
                    fontSize: "26px", fontWeight: 800, margin: 0,
                    maxWidth: 480, lineHeight: 1.2
                  }}>
                    {brandKit.tagline}
                  </h3>
                  <p style={{
                    fontFamily: brandKit.typography.bodyFont,
                    fontSize: "13px", opacity: 0.75, maxWidth: 520, margin: 0
                  }}>
                    {brandKit.mission}
                  </p>
                  <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                    <button style={{
                      padding: "8px 18px", borderRadius: 8, border: "none",
                      background: primaryColor, color: "#fff", fontSize: 12, fontWeight: 700
                    }}>
                      Start Building Free
                    </button>
                    <button style={{
                      padding: "8px 16px", borderRadius: 8,
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      color: "#0f172a",
                      fontSize: 12, fontWeight: 600
                    }}>
                      View Architecture Spec
                    </button>
                  </div>
                </div>

                {/* 3. Code Snippet & Telemetry Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{
                    background: "#0f172a", border: "1px solid #334155",
                    borderRadius: 10, padding: 14, fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#eab308" }} />
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
                      <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 4 }}>pipeline.ts</span>
                    </div>
                    <pre style={{ margin: 0, fontSize: 11, color: "#38bdf8", lineHeight: 1.45 }}>{`import { CreatifyEngine } from "${brandKit.brandName.toLowerCase().replace(/\s+/g, "-")}";

const client = new CreatifyEngine({
  primaryColor: "${primaryColor}",
  accentColor: "${accentColor}"
});`}</pre>
                  </div>

                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between"
                  }}>
                    <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 700 }}>RENDER PERFORMANCE</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: primaryColor, fontFamily: "'JetBrains Mono', monospace" }}>
                      2.4ms <small style={{ fontSize: 12, color: "#16a34a" }}>+99.8%</small>
                    </div>
                    <div style={{ fontSize: 10.5, opacity: 0.6 }}>Zero-copy WebAssembly memory buffer compile speed.</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === "typography" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif", color: ui.textPrimary }}>
                  Typography Hierarchy & Font Pairings
                </h2>
                <p style={{ margin: 0, fontSize: 12.5, color: ui.textSecondary }}>
                  Assign primary display fonts, section headings, body typography, and developer monospace fonts.
                </p>
              </div>

              {/* Font Assignments */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                {[
                  { key: "displayFont", label: "Display Hero Font", value: brandKit.typography.displayFont, options: ["Syne", "Outfit", "Space Grotesk", "Cinzel"] },
                  { key: "headingFont", label: "Section Headings", value: brandKit.typography.headingFont, options: ["Syne", "Plus Jakarta Sans", "Poppins", "Inter"] },
                  { key: "bodyFont", label: "Body & Paragraphs", value: brandKit.typography.bodyFont, options: ["Plus Jakarta Sans", "Inter", "Instrument Sans", "Roboto"] },
                  { key: "codeFont", label: "Developer Code / Mono", value: brandKit.typography.codeFont, options: ["JetBrains Mono", "Space Grotesk", "Fira Code"] },
                ].map((item) => (
                  <div key={item.key} style={{
                    padding: 16, borderRadius: 14,
                    background: ui.cardBg, border: `1px solid ${ui.cardBorder}`,
                    boxShadow: "0 4px 14px rgba(148, 41, 69, 0.04)"
                  }}>
                    <div style={{ fontSize: 10.5, color: "#e1496d", fontWeight: 800, textTransform: "uppercase", marginBottom: 6 }}>
                      {item.label}
                    </div>
                    <select
                      value={item.value}
                      onChange={(e) => {
                        const updated = {
                          ...brandKit,
                          typography: { ...brandKit.typography, [item.key]: e.target.value }
                        };
                        saveBrandKit(updated);
                      }}
                      style={{
                        width: "100%", padding: "8px 12px", borderRadius: 8,
                        background: ui.inputBg, border: `1px solid ${ui.inputBorder}`,
                        color: ui.textPrimary, fontSize: 13, fontWeight: 700, outline: "none",
                        fontFamily: item.value, cursor: "pointer"
                      }}
                    >
                      {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div style={{ marginTop: 10, fontSize: 13, color: ui.textSecondary, fontFamily: item.value }}>
                      The quick brown fox jumps over the lazy dog.
                    </div>
                  </div>
                ))}
              </div>

              {/* Type Scale Specimen */}
              <div style={{
                padding: 20, borderRadius: 16,
                background: ui.cardBg, border: `1px solid ${ui.cardBorder}`,
                display: "flex", flexDirection: "column", gap: 16,
                boxShadow: "0 4px 14px rgba(148, 41, 69, 0.04)"
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, fontFamily: "Syne, sans-serif", margin: 0, color: "#e1496d" }}>
                  Live Font Scale Specimen
                </h3>
                <div>
                  <div style={{ fontSize: 10, color: ui.textSecondary, marginBottom: 2 }}>Hero Headline (48px)</div>
                  <div style={{ fontSize: "44px", fontWeight: 800, fontFamily: brandKit.typography.displayFont, color: ui.textPrimary, lineHeight: 1.1 }}>
                    Next-Gen Creative Suite
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: ui.textSecondary, marginBottom: 2 }}>H1 Section Heading (36px)</div>
                  <div style={{ fontSize: "32px", fontWeight: 800, fontFamily: brandKit.typography.headingFont, color: primaryColor }}>
                    Unified Engineering Design System
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: ui.textSecondary, marginBottom: 2 }}>Body Copy (14px)</div>
                  <div style={{ fontSize: "14px", fontFamily: brandKit.typography.bodyFont, color: ui.textSecondary, maxWidth: 620, lineHeight: 1.6 }}>
                    Every design token defined here acts as the foundation for your marketing campaigns, video edits, and interactive presentations. Consistency creates recognition.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEVELOPER TOKENS */}
          {activeTab === "dev_tokens" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif", color: ui.textPrimary }}>
                  Developer Design Tokens & Configs
                </h2>
                <p style={{ margin: 0, fontSize: 12.5, color: ui.textSecondary }}>
                  Export ready-to-use configurations for Tailwind CSS, CSS Custom Properties, and TypeScript.
                </p>
              </div>

              {/* Exporter Tabs */}
              <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${ui.headerBorder}`, paddingBottom: 8 }}>
                {[
                  { id: "tailwind", label: "tailwind.config.js" },
                  { id: "css", label: "variables.css (:root)" },
                  { id: "typescript", label: "tokens.ts (TypeScript)" },
                  { id: "json", label: "tokens.json (Style Dictionary)" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setTokenTab(tab.id)}
                    style={{
                      padding: "6px 12px", borderRadius: 8, border: "none",
                      background: tokenTab === tab.id ? "linear-gradient(135deg, #e1496d, #942945)" : "rgba(148,41,69,0.06)",
                      color: tokenTab === tab.id ? "#fff" : ui.textSecondary,
                      fontSize: 11.5, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                      cursor: "pointer"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Code Display Card */}
              <div style={{
                borderRadius: 14, overflow: "hidden",
                background: ui.codeBg, border: "1px solid rgba(148,41,69,0.25)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 14px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
                    // Auto-generated design system tokens
                  </span>
                  <button
                    onClick={() => {
                      let code = "";
                      if (tokenTab === "tailwind") code = generateTailwindConfig();
                      else if (tokenTab === "css") code = generateCSSVariables();
                      else if (tokenTab === "typescript") code = generateTypeScriptTokens();
                      else code = JSON.stringify(brandKit, null, 2);
                      copyToClipboard(code, "token_code");
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)",
                      color: "#38bdf8", borderRadius: 6, padding: "4px 10px",
                      cursor: "pointer", fontSize: 11, fontWeight: 700,
                    }}
                  >
                    <Copy size={12} />
                    Copy Code
                  </button>
                </div>
                <pre style={{
                  margin: 0, padding: 16,
                  color: "#38bdf8", fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: 1.5, overflowX: "auto"
                }}>
                  {tokenTab === "tailwind" && generateTailwindConfig()}
                  {tokenTab === "css" && generateCSSVariables()}
                  {tokenTab === "typescript" && generateTypeScriptTokens()}
                  {tokenTab === "json" && JSON.stringify(brandKit, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: ASSETS & LOGOS */}
          {activeTab === "assets" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif", color: ui.textPrimary }}>
                  Official Brand Assets & Logomarks
                </h2>
                <p style={{ margin: 0, fontSize: 12.5, color: ui.textSecondary }}>
                  Procedural tech vector marks and badges with instant SVG export.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {brandKit.logos.map((logo) => (
                  <div key={logo.id} style={{
                    borderRadius: 14, overflow: "hidden",
                    background: ui.cardBg, border: `1px solid ${ui.cardBorder}`,
                    boxShadow: "0 4px 14px rgba(148, 41, 69, 0.04)"
                  }}>
                    <div style={{
                      height: 140,
                      background: logo.type.includes("Light") ? "#faf5ff" : "#0f172a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderBottom: `1px solid ${ui.cardBorder}`,
                    }}>
                      <div style={{
                        width: 60, height: 60, borderRadius: 14,
                        background: `linear-gradient(135deg, ${logo.color}, #942945)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 24, fontWeight: 800, fontFamily: "Syne, sans-serif",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                      }}>
                        {brandKit.brandName.charAt(0)}
                      </div>
                    </div>

                    <div style={{ padding: "12px 14px" }}>
                      <h4 style={{ margin: "0 0 2px", fontSize: 13.5, fontWeight: 800, color: ui.textPrimary }}>
                        {logo.name}
                      </h4>
                      <p style={{ margin: "0 0 10px", fontSize: 11, color: ui.textSecondary }}>
                        {logo.type}
                      </p>
                      <button
                        onClick={() => showToast(`✓ Downloaded ${logo.name} vector SVG`)}
                        style={{
                          width: "100%", padding: "6px 0", borderRadius: 6,
                          background: "rgba(225,73,109,0.12)", border: "1px solid rgba(225,73,109,0.25)",
                          color: "#e1496d", fontSize: 11, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        Download SVG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TONE & PERSONA */}
          {activeTab === "voice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif", color: ui.textPrimary }}>
                  Brand Persona & AI Calibration
                </h2>
                <p style={{ margin: 0, fontSize: 12.5, color: ui.textSecondary }}>
                  Fine-tune AI copywriters, prompt generators, and documentation generators to match your company voice.
                </p>
              </div>

              <div style={{
                padding: 20, borderRadius: 16,
                background: ui.cardBg, border: `1px solid ${ui.cardBorder}`,
                display: "flex", flexDirection: "column", gap: 16,
                boxShadow: "0 4px 14px rgba(148, 41, 69, 0.04)"
              }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "#e1496d", fontWeight: 700, marginBottom: 4 }}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandKit.brandName}
                    onChange={(e) => saveBrandKit({ ...brandKit, brandName: e.target.value })}
                    style={{
                      width: "100%", padding: "8px 12px", borderRadius: 8,
                      background: ui.inputBg, border: `1px solid ${ui.inputBorder}`,
                      color: ui.textPrimary, fontSize: 14, fontWeight: 700, fontFamily: "Syne, sans-serif",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, color: "#e1496d", fontWeight: 700, marginBottom: 4 }}>
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={brandKit.tagline}
                    onChange={(e) => saveBrandKit({ ...brandKit, tagline: e.target.value })}
                    style={{
                      width: "100%", padding: "8px 12px", borderRadius: 8,
                      background: ui.inputBg, border: `1px solid ${ui.inputBorder}`,
                      color: ui.textPrimary, fontSize: 12.5,
                    }}
                  />
                </div>

                {/* Persona Sliders */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { key: "formality", label: "Formality", left: "Casual / Hacker", right: "Corporate" },
                    { key: "energy", label: "Energy Level", left: "Calm / Stoic", right: "High-Energy" },
                    { key: "boldness", label: "Boldness", left: "Subtle", right: "Disruptive" },
                    { key: "techLevel", label: "Tech Vernacular", left: "Plain English", right: "Engineering First" },
                  ].map((sl) => (
                    <div key={sl.key} style={{ padding: 12, borderRadius: 10, background: "rgba(148, 41, 69, 0.04)", border: `1px solid ${ui.cardBorder}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, marginBottom: 6, color: ui.textPrimary }}>
                        <span>{sl.label}</span>
                        <span style={{ color: primaryColor }}>{brandKit.voicePersona[sl.key]}%</span>
                      </div>
                      <input
                        type="range"
                        min="0" max="100"
                        value={brandKit.voicePersona[sl.key]}
                        onChange={(e) => {
                          const updated = {
                            ...brandKit,
                            voicePersona: { ...brandKit.voicePersona, [sl.key]: Number(e.target.value) }
                          };
                          saveBrandKit(updated);
                        }}
                        style={{ width: "100%", accentColor: primaryColor, cursor: "pointer" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: ui.textSecondary, marginTop: 2 }}>
                        <span>{sl.left}</span>
                        <span>{sl.right}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: STYLEGUIDE PREVIEW */}
          {activeTab === "preview" && (
            <div style={{
              padding: 28, borderRadius: 16,
              background: "#ffffff",
              border: `1px solid ${ui.cardBorder}`,
              boxShadow: "0 16px 40px rgba(148,41,69,0.08)",
              display: "flex", flexDirection: "column", gap: 24
            }}>
              <div style={{ borderBottom: `1px solid ${ui.headerBorder}`, paddingBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: primaryColor }}>
                    OFFICIAL DESIGN SYSTEM SPECIFICATION
                  </span>
                  <h2 style={{ fontSize: 30, fontWeight: 800, fontFamily: brandKit.typography.displayFont, margin: "4px 0 2px", color: ui.textPrimary }}>
                    {brandKit.brandName}
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: ui.textSecondary, fontStyle: "italic" }}>
                    "{brandKit.tagline}"
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>● Active in Workspace</span>
                </div>
              </div>

              {/* Swatches Strip */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {brandKit.palettes.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, background: "#f8fafc", border: `1px solid ${ui.cardBorder}` }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: p.hex }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: ui.textPrimary }}>{p.name}</div>
                      <div style={{ fontSize: 9.5, color: ui.textSecondary, fontFamily: "'JetBrains Mono', monospace" }}>{p.hex}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Typography Preview */}
              <div style={{ padding: 16, borderRadius: 12, background: "#f8fafc", border: `1px solid ${ui.cardBorder}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#e1496d", textTransform: "uppercase", marginBottom: 6 }}>
                  Typography Hierarchy
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: brandKit.typography.headingFont, color: ui.textPrimary, marginBottom: 4 }}>
                  {brandKit.typography.headingFont} Headings
                </div>
                <div style={{ fontSize: 13, fontFamily: brandKit.typography.bodyFont, color: ui.textSecondary, lineHeight: 1.6 }}>
                  {brandKit.mission}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
