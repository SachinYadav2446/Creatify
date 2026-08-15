import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Palette, Type, Image as ImageIcon, Sparkles, 
  Download, Upload, Copy, Check, Plus, Trash2, Sliders, Shield, Eye, RefreshCw
} from "lucide-react";

export default function BrandKit({ onBack, user, onNavigate }) {
  const [activeTab, setActiveTab] = useState("palettes"); // "palettes", "typography", "assets", "voice", "preview"
  const [copiedHex, setCopiedHex] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const defaultBrandKit = {
    brandName: "Cosmic Odyssey",
    tagline: "Unleash infinite creative velocity through AI-driven design systems.",
    mission: "To empower visionary creators with real-time collaborative toolchains and effortless visual aesthetics.",
    keywords: ["Futuristic", "High-End", "Electric", "Precision", "Minimal"],
    palettes: [
      { id: "primary", name: "Primary Wine", hex: "#942945", role: "Primary Brand Color" },
      { id: "accent", name: "Rose Glow", hex: "#e1496d", role: "Vibrant Accent & CTA" },
      { id: "highlight", name: "Rose Gold", hex: "#ff8da7", role: "Highlight & Badges" },
      { id: "dark", name: "Velvet Obsidian", hex: "#0e060b", role: "Dark Mode Background" },
      { id: "card", name: "Deep Amethyst", hex: "#1a0f16", role: "Surface & Cards" },
      { id: "surfaceLight", name: "Frost White", hex: "#faf5ff", role: "Light Mode Background" },
    ],
    gradients: [
      { name: "Wine to Rose", from: "#942945", to: "#e1496d" },
      { name: "Cosmic Nebula", from: "#e1496d", to: "#38bdf8" },
      { name: "Solar Flare", from: "#ff8da7", to: "#fbbf24" },
    ],
    typography: {
      displayFont: "Syne",
      headingFont: "Syne",
      bodyFont: "Instrument Sans",
      codeFont: "Space Grotesk",
      scale: {
        hero: "56px",
        h1: "40px",
        h2: "28px",
        h3: "20px",
        body: "15px",
        caption: "12px",
      }
    },
    logos: [
      { id: 1, name: "Primary Brand Mark (Dark)", type: "Dark Background", color: "#e1496d", shape: "star" },
      { id: 2, name: "Monochrome Minimal (Light)", type: "Light Background", color: "#0e060b", shape: "circle" },
      { id: 3, name: "Favicon / App Icon", type: "Square Badge", color: "#ff8da7", shape: "hexagon" },
    ],
    voicePersona: {
      formality: 70, // 0 = Informal, 100 = Formal
      energy: 85,    // 0 = Calm, 100 = Energetic
      boldness: 90,  // 0 = Subtle, 100 = Disruptive
      techLevel: 80, // 0 = Simple, 100 = High-Tech
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
      showToast("✓ Brand Kit saved successfully");
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text, hexId) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(hexId);
    showToast(`Copied ${text} to clipboard!`);
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
    const newId = `custom_${Date.now()}`;
    const updated = {
      ...brandKit,
      palettes: [
        ...brandKit.palettes,
        { id: newId, name: "New Accent", hex: "#38bdf8", role: "Custom Accent" }
      ]
    };
    saveBrandKit(updated);
  };

  const handleDeleteColor = (id) => {
    if (brandKit.palettes.length <= 2) {
      alert("You need at least 2 colors in your brand palette.");
      return;
    }
    const updated = {
      ...brandKit,
      palettes: brandKit.palettes.filter(p => p.id !== id)
    };
    saveBrandKit(updated);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brandKit, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${brandKit.brandName.toLowerCase().replace(/\s+/g, "_")}_brand_kit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported Brand Kit JSON file!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0e060b 0%, #160a12 50%, #0a0408 100%)",
      color: "#f3f4f6",
      fontFamily: "'Instrument Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: "linear-gradient(135deg, #e1496d, #942945)",
          color: "#fff", padding: "10px 20px", borderRadius: 12,
          fontSize: 13, fontWeight: 600, fontFamily: "'Poppins', sans-serif",
          boxShadow: "0 8px 24px rgba(225, 73, 109, 0.4)",
          animation: "fadeIn 0.2s ease",
        }}>
          {toastMsg}
        </div>
      )}

      {/* Top Bar Header */}
      <header style={{
        padding: "16px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(225, 73, 109, 0.15)",
        background: "rgba(14, 6, 11, 0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(225, 73, 109, 0.1)",
              border: "1px solid rgba(225, 73, 109, 0.25)",
              color: "#ff8da7", borderRadius: 10,
              padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(225, 73, 109, 0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(225, 73, 109, 0.1)"}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, fontFamily: "Syne, sans-serif", color: "#fff" }}>
                Brand Kit & Design System Hub
              </h1>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 99,
                background: "rgba(225, 73, 109, 0.2)", color: "#ff8da7",
                border: "1px solid rgba(225, 73, 109, 0.4)", fontWeight: 700,
              }}>
                GLOBAL SYNC ON
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
              Define single-source-of-truth brand tokens that automatically theme all studio tools.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={exportJSON}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#e5e7eb", borderRadius: 10, padding: "8px 16px", cursor: "pointer",
              fontSize: 12.5, fontWeight: 600, fontFamily: "'Poppins', sans-serif",
            }}
          >
            <Download size={14} />
            Export Brand JSON
          </button>

          <button
            onClick={() => {
              saveBrandKit(defaultBrandKit);
              showToast("Reset to default brand kit");
            }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "1px solid rgba(225,73,109,0.2)",
              color: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "8px 12px",
              cursor: "pointer", fontSize: 12,
            }}
            title="Reset to defaults"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", padding: "28px 36px 60px", gap: 32 }}>
        
        {/* Left Navigation Tabs */}
        <aside style={{ width: 240, display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {[
            { id: "palettes", label: "Color Palettes", icon: Palette, desc: "Hex tokens & Gradients" },
            { id: "typography", label: "Typography Rules", icon: Type, desc: "Font pairings & Scales" },
            { id: "assets", label: "Logo & Asset Locker", icon: ImageIcon, desc: "Marks, Badges, Watermarks" },
            { id: "voice", label: "Tone & Persona", icon: Sliders, desc: "Keywords & AI Voice" },
            { id: "preview", label: "Brand Styleguide", icon: Eye, desc: "Rendered Spec Sheet" },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "14px 16px", borderRadius: 14,
                  background: active ? "linear-gradient(135deg, rgba(225, 73, 109, 0.22), rgba(148, 41, 69, 0.15))" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${active ? "rgba(225, 73, 109, 0.45)" : "rgba(255,255,255,0.06)"}`,
                  color: active ? "#ff8da7" : "rgba(255,255,255,0.65)",
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                  outline: "none",
                }}
              >
                <Icon size={18} style={{ marginTop: 2, color: active ? "#e1496d" : "rgba(255,255,255,0.4)" }} />
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13.5, fontWeight: 700 }}>
                    {tab.label}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}

          <div style={{ marginTop: "auto", padding: 18, borderRadius: 16, background: "rgba(225,73,109,0.06)", border: "1px solid rgba(225,73,109,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ff8da7", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
              <Shield size={14} />
              Brand Enforcement
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
              When activated, all AI generations in the Image Editor, Social Studio, and Presentation maker prioritize these color palettes and fonts.
            </p>
          </div>
        </aside>

        {/* Right Content Area */}
        <main style={{ flex: 1, minWidth: 0 }}>
          
          {/* TAB 1: COLOR PALETTES */}
          {activeTab === "palettes" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                    Brand Color Tokens
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    Primary hex values and continuous gradients used for UI elements, typography, and graphics.
                  </p>
                </div>
                <button
                  onClick={handleAddColor}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 10,
                    background: "linear-gradient(135deg, #e1496d, #942945)",
                    border: "none", color: "#fff", fontSize: 12.5, fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Plus size={14} /> Add Color Swatch
                </button>
              </div>

              {/* Color Swatch Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 36 }}>
                {brandKit.palettes.map((color) => {
                  const isCopied = copiedHex === color.id;
                  return (
                    <div
                      key={color.id}
                      style={{
                        borderRadius: 18, overflow: "hidden",
                        background: "rgba(22, 9, 18, 0.7)",
                        border: "1px solid rgba(225, 73, 109, 0.2)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Color Preview Block */}
                      <div style={{
                        height: 110, background: color.hex,
                        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                        padding: 12, position: "relative",
                      }}>
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange(color.id, e.target.value)}
                          style={{
                            position: "absolute", top: 10, right: 10,
                            width: 32, height: 32, border: "2px solid #fff",
                            borderRadius: 8, cursor: "pointer", padding: 0,
                            background: "transparent",
                          }}
                          title="Click to pick custom color"
                        />
                        <span style={{
                          padding: "2px 8px", borderRadius: 6,
                          background: "rgba(0,0,0,0.6)", color: "#fff",
                          fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                        }}>
                          {color.hex.toUpperCase()}
                        </span>
                      </div>

                      {/* Swatch Info & Controls */}
                      <div style={{ padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
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
                              color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Syne, sans-serif",
                              width: "70%",
                            }}
                          />
                          <button
                            onClick={() => copyToClipboard(color.hex, color.id)}
                            style={{
                              background: "rgba(255,255,255,0.06)", border: "none",
                              color: isCopied ? "#22c55e" : "rgba(255,255,255,0.6)",
                              borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11,
                              display: "flex", alignItems: "center", gap: 4,
                            }}
                          >
                            {isCopied ? <Check size={12} /> : <Copy size={12} />}
                            {isCopied ? "Copied" : "Copy"}
                          </button>
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
                            color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'Instrument Sans', sans-serif",
                          }}
                        />

                        {brandKit.palettes.length > 2 && (
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                            <button
                              onClick={() => handleDeleteColor(color.id)}
                              style={{
                                background: "none", border: "none", color: "rgba(239,68,68,0.6)",
                                cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4,
                              }}
                            >
                              <Trash2 size={11} /> Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gradients Section */}
              <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "Syne, sans-serif", marginBottom: 14 }}>
                Brand Linear Gradients
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {brandKit.gradients.map((grad, i) => (
                  <div key={i} style={{
                    padding: 16, borderRadius: 16,
                    background: "rgba(22, 9, 18, 0.7)", border: "1px solid rgba(225,73,109,0.18)",
                  }}>
                    <div style={{
                      height: 60, borderRadius: 10,
                      background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                      marginBottom: 10,
                    }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{grad.name}</span>
                      <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
                        {grad.from} → {grad.to}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY */}
          {activeTab === "typography" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                  Typography Hierarchy & Font Pairings
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  Standardized typeface assignments and responsive font sizing scale.
                </p>
              </div>

              {/* Font Assignments */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
                {[
                  { key: "displayFont", label: "Display Hero Typeface", value: brandKit.typography.displayFont, options: ["Syne", "Outfit", "Space Grotesk", "Cinzel"] },
                  { key: "headingFont", label: "Section Headings", value: brandKit.typography.headingFont, options: ["Syne", "Poppins", "Inter", "Plus Jakarta Sans"] },
                  { key: "bodyFont", label: "Body & Paragraphs", value: brandKit.typography.bodyFont, options: ["Instrument Sans", "Inter", "Poppins", "Roboto"] },
                  { key: "codeFont", label: "Monospace & Numbers", value: brandKit.typography.codeFont, options: ["Space Grotesk", "Fira Code", "Courier Prime"] },
                ].map((item) => (
                  <div key={item.key} style={{
                    padding: 18, borderRadius: 16,
                    background: "rgba(22, 9, 18, 0.7)", border: "1px solid rgba(225,73,109,0.2)",
                  }}>
                    <div style={{ fontSize: 11, color: "#ff8da7", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
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
                        background: "rgba(0,0,0,0.5)", border: "1px solid rgba(225,73,109,0.3)",
                        color: "#fff", fontSize: 14, fontWeight: 600, outline: "none",
                        fontFamily: item.value,
                      }}
                    >
                      {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div style={{ marginTop: 12, fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: item.value }}>
                      The quick brown fox jumps over the lazy dog.
                    </div>
                  </div>
                ))}
              </div>

              {/* Type Scale Demonstration */}
              <div style={{
                padding: 24, borderRadius: 20,
                background: "rgba(22, 9, 18, 0.8)", border: "1px solid rgba(225,73,109,0.2)",
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "Syne, sans-serif", marginBottom: 18, color: "#ff8da7" }}>
                  Live Font Scale Specimen
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Hero Headline (56px)</div>
                    <div style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, fontFamily: brandKit.typography.displayFont, color: "#fff", lineHeight: 1.1 }}>
                      Next-Gen Creative Velocity
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>H1 Heading (40px)</div>
                    <div style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, fontFamily: brandKit.typography.headingFont, color: "#e1496d" }}>
                      Unified Digital Brand Systems
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Body Copy (15px)</div>
                    <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", fontFamily: brandKit.typography.bodyFont, maxWidth: 640, lineHeight: 1.6 }}>
                      Every design token defined here acts as the foundation for your marketing campaigns, video edits, and interactive presentations. Consistency creates recognition.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASSETS & LOGOS */}
          {activeTab === "assets" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                  Official Brand Assets & Logomarks
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  Primary brandmarks, lockups, and favicon badges with automatic transparency.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {brandKit.logos.map((logo) => (
                  <div key={logo.id} style={{
                    borderRadius: 18, overflow: "hidden",
                    background: "rgba(22, 9, 18, 0.7)", border: "1px solid rgba(225,73,109,0.2)",
                  }}>
                    <div style={{
                      height: 160,
                      background: logo.type.includes("Light") ? "#faf5ff" : "#0e060b",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderBottom: "1px solid rgba(225,73,109,0.15)",
                    }}>
                      <div style={{
                        width: 70, height: 70, borderRadius: logo.shape === "circle" ? "50%" : 18,
                        background: `linear-gradient(135deg, ${logo.color}, #942945)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 28, fontWeight: 800, fontFamily: "Syne, sans-serif",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      }}>
                        {brandKit.brandName.charAt(0) || "C"}
                      </div>
                    </div>

                    <div style={{ padding: 16 }}>
                      <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                        {logo.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>
                        {logo.type}
                      </p>
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button
                          onClick={() => showToast(`Exported ${logo.name} SVG`)}
                          style={{
                            flex: 1, padding: "6px 0", borderRadius: 8,
                            background: "rgba(225,73,109,0.15)", border: "1px solid rgba(225,73,109,0.3)",
                            color: "#ff8da7", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          Download SVG
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TONE & PERSONA */}
          {activeTab === "voice" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                  Brand Persona & AI Tone Parameters
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  Calibrate AI copywriters and prompt generators to match your exact brand identity.
                </p>
              </div>

              <div style={{
                padding: 24, borderRadius: 20,
                background: "rgba(22, 9, 18, 0.7)", border: "1px solid rgba(225,73,109,0.2)",
                marginBottom: 24,
              }}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 12, color: "#ff8da7", fontWeight: 700, marginBottom: 6 }}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandKit.brandName}
                    onChange={(e) => saveBrandKit({ ...brandKit, brandName: e.target.value })}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      background: "rgba(0,0,0,0.5)", border: "1px solid rgba(225,73,109,0.25)",
                      color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Syne, sans-serif",
                    }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 12, color: "#ff8da7", fontWeight: 700, marginBottom: 6 }}>
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={brandKit.tagline}
                    onChange={(e) => saveBrandKit({ ...brandKit, tagline: e.target.value })}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      background: "rgba(0,0,0,0.5)", border: "1px solid rgba(225,73,109,0.25)",
                      color: "#fff", fontSize: 13.5,
                    }}
                  />
                </div>

                {/* Persona Sliders */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
                  {[
                    { key: "formality", label: "Formality", left: "Casual & Playful", right: "Corporate & Formal" },
                    { key: "energy", label: "Energy Level", left: "Calm & Grounded", right: "Electric & High-Energy" },
                    { key: "boldness", label: "Boldness", left: "Subtle & Understated", right: "Disruptive & Audacious" },
                    { key: "techLevel", label: "Tech Vernacular", left: "Accessible English", right: "High-Tech Technical" },
                  ].map((sl) => (
                    <div key={sl.key} style={{ padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.3)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "#fff" }}>
                        <span>{sl.label}</span>
                        <span style={{ color: "#e1496d" }}>{brandKit.voicePersona[sl.key]}%</span>
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
                        style={{ width: "100%", accentColor: "#e1496d", cursor: "pointer" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                        <span>{sl.left}</span>
                        <span>{sl.right}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STYLEGUIDE PREVIEW */}
          {activeTab === "preview" && (
            <div style={{
              padding: 36, borderRadius: 24,
              background: "linear-gradient(145deg, #180a14 0%, #10050c 100%)",
              border: "1px solid rgba(225, 73, 109, 0.3)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            }}>
              <div style={{ borderBottom: "1px solid rgba(225,73,109,0.2)", paddingBottom: 24, marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e1496d" }}>
                    OFFICIAL BRAND STYLEGUIDE SPECIFICATION
                  </span>
                  <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: "Syne, sans-serif", margin: "6px 0 4px", color: "#fff" }}>
                    {brandKit.brandName}
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
                    "{brandKit.tagline}"
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Version 2.4 — Active Sync</span>
                </div>
              </div>

              {/* Swatches strip */}
              <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
                {brandKit.palettes.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: p.hex }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{p.hex}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Typography Preview */}
              <div style={{ padding: 20, borderRadius: 16, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(225,73,109,0.15)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ff8da7", textTransform: "uppercase", marginBottom: 8 }}>
                  Typography Hierarchy
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: brandKit.typography.headingFont, color: "#fff", marginBottom: 6 }}>
                  {brandKit.typography.headingFont} Headings
                </div>
                <div style={{ fontSize: 14, fontFamily: brandKit.typography.bodyFont, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
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
