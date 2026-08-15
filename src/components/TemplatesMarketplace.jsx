import React, { useState } from "react";
import { 
  ArrowLeft, Search, Filter, Sparkles, Star, Download, Play, 
  Layers, Eye, ExternalLink, RefreshCw, Grid, Tag, Compass, Flame, Award
} from "lucide-react";

export default function TemplatesMarketplace({ onBack, onNavigate, user }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRatio, setSelectedRatio] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [activeModalTemplate, setActiveModalTemplate] = useState(null);

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "youtube", label: "YouTube Intros & Thumbnails" },
    { id: "pitch", label: "Pitch Decks & Presentations" },
    { id: "social", label: "Social Media & Stories" },
    { id: "logo", label: "Motion Logos & Vectors" },
    { id: "poster", label: "Cyber & Event Posters" },
    { id: "mockup", label: "3D Product Mockups" },
    { id: "doc", label: "Pro Documents & Reports" },
  ];

  const templatesData = [
    {
      id: "tmpl_1",
      title: "Cyberpunk 2099 Holographic Poster",
      category: "poster",
      tool: "Image Editor",
      route: "image_editor_load",
      ratio: "4:5",
      aspectLabel: "1080 × 1350",
      creator: { name: "Aria Thorne", badge: "Pro Creator", avatar: "A" },
      remixes: 1420,
      likes: 890,
      rating: 4.9,
      tags: ["Cyberpunk", "Neon", "Glow", "Poster"],
      colors: ["#e1496d", "#0e060b", "#38bdf8", "#ff8da7"],
      layers: 8,
      fonts: ["Syne", "Space Grotesk"],
      gradient: "linear-gradient(135deg, #e1496d 0%, #1a0826 100%)",
      desc: "Multi-layered layered synthwave aesthetic with adjustable chromatic aberration and neon text masks.",
    },
    {
      id: "tmpl_2",
      title: "SaaS Series-A Pitch Deck (Dark Mode)",
      category: "pitch",
      tool: "Presentations",
      route: "presentation_load",
      ratio: "16:9",
      aspectLabel: "1920 × 1080",
      creator: { name: "Elena Vance", badge: "Staff Pick", avatar: "E" },
      remixes: 3210,
      likes: 2150,
      rating: 5.0,
      tags: ["Investor", "Pitch Deck", "Dark Minimal", "Charts"],
      colors: ["#942945", "#0e060b", "#22d3a8", "#ffffff"],
      layers: 16,
      fonts: ["Syne", "Instrument Sans"],
      gradient: "linear-gradient(135deg, #1e0f18 0%, #0d040a 100%)",
      desc: "Complete 12-slide pitch deck with financial breakdown graphs, market sizing charts, and team roster layouts.",
    },
    {
      id: "tmpl_3",
      title: "Electric Kinetic YouTube Intro",
      category: "youtube",
      tool: "Video Editor",
      route: "editor_load",
      ratio: "16:9",
      aspectLabel: "3840 × 2160 (4K)",
      creator: { name: "Marcus Ray", badge: "Motion Lead", avatar: "M" },
      remixes: 4890,
      likes: 3410,
      rating: 4.8,
      tags: ["YouTube", "Intro", "Glitch", "Audio-Reactive"],
      colors: ["#ef4444", "#3b82f6", "#000000", "#ff8da7"],
      layers: 6,
      fonts: ["Syne", "Outfit"],
      gradient: "linear-gradient(135deg, #ef4444 0%, #0b071a 100%)",
      desc: "Fast-paced kinetic typography video opener with customizable glitch transitions and sound effects.",
    },
    {
      id: "tmpl_4",
      title: "Geometric Monogram Vector Suite",
      category: "logo",
      tool: "Logo Maker",
      route: "logo_maker_load",
      ratio: "1:1",
      aspectLabel: "1200 × 1200",
      creator: { name: "Sora Takahashi", badge: "Identity Designer", avatar: "S" },
      remixes: 2100,
      likes: 1670,
      rating: 4.9,
      tags: ["Minimal", "Vector", "Brandmark", "Luxury"],
      colors: ["#e1496d", "#141117", "#ff8da7"],
      layers: 4,
      fonts: ["Syne", "Space Grotesk"],
      gradient: "linear-gradient(135deg, #942945 0%, #160a12 100%)",
      desc: "Golden-ratio constructed geometric emblem suite with full SVG export capabilities and responsive variants.",
    },
    {
      id: "tmpl_5",
      title: "Viral TikTok / Reel Growth Storyboard",
      category: "social",
      tool: "Social Studio",
      route: "social_studio_load",
      ratio: "9:16",
      aspectLabel: "1080 × 1920",
      creator: { name: "Chloe Bennett", badge: "Social Strategist", avatar: "C" },
      remixes: 5620,
      likes: 4200,
      rating: 4.9,
      tags: ["TikTok", "Instagram Story", "Viral", "Hooks"],
      colors: ["#ec4899", "#0e060b", "#fbbf24"],
      layers: 7,
      fonts: ["Poppins", "Syne"],
      gradient: "linear-gradient(135deg, #ec4899 0%, #140510 100%)",
      desc: "High-retention mobile vertical video layout optimized with subtitles, animated progress bars, and callouts.",
    },
    {
      id: "tmpl_6",
      title: "Next-Gen 3D Device Showcase Stage",
      category: "mockup",
      tool: "3D Mockups",
      route: "mockup_studio",
      ratio: "16:9",
      aspectLabel: "2560 × 1440",
      creator: { name: "PixelForge Studio", badge: "3D Master", avatar: "P" },
      remixes: 3900,
      likes: 2980,
      rating: 5.0,
      tags: ["Three.js", "iPhone 16 Pro", "Studio Lighting", "WebGL"],
      colors: ["#38bdf8", "#0e060b", "#e1496d"],
      layers: 5,
      fonts: ["Syne", "Instrument Sans"],
      gradient: "linear-gradient(135deg, #0284c7 0%, #030712 100%)",
      desc: "Interactive 3D viewport mockup ready for instant high-resolution drag-and-drop artwork rendering.",
    },
    {
      id: "tmpl_7",
      title: "Quarterly Executive Intelligence Report",
      category: "doc",
      tool: "Documents",
      route: "documents_load",
      ratio: "4:5",
      aspectLabel: "A4 Printable",
      creator: { name: "Victor Chen", badge: "Enterprise Lead", avatar: "V" },
      remixes: 1120,
      likes: 780,
      rating: 4.7,
      tags: ["Whitepaper", "Executive", "Data Tables", "Clean"],
      colors: ["#06b6d4", "#0e060b", "#ffffff"],
      layers: 5,
      fonts: ["Instrument Sans", "Syne"],
      gradient: "linear-gradient(135deg, #0891b2 0%, #08151c 100%)",
      desc: "Structured editorial document layout with automatic table of contents, executive summary boxes, and metric highlights.",
    },
    {
      id: "tmpl_8",
      title: "Infinite Neural Concept Map",
      category: "mockup",
      tool: "Whiteboard",
      route: "whiteboard_load",
      ratio: "16:9",
      aspectLabel: "Infinite Canvas",
      creator: { name: "Nova Labs", badge: "Staff Pick", avatar: "N" },
      remixes: 2750,
      likes: 1940,
      rating: 4.8,
      tags: ["Mind Map", "Flowchart", "Strategy", "Brainstorming"],
      colors: ["#a855f7", "#0e060b", "#38bdf8"],
      layers: 12,
      fonts: ["Space Grotesk", "Poppins"],
      gradient: "linear-gradient(135deg, #7e22ce 0%, #0d0417 100%)",
      desc: "Comprehensive multi-node architecture diagram mapping user onboarding journeys and engineering microservices.",
    },
  ];

  // Filtering
  const filteredTemplates = templatesData.filter(t => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesRatio = selectedRatio === "all" || t.ratio === selectedRatio;
    const matchesSearch = searchQuery === "" || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.tool.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRatio && matchesSearch;
  });

  const handleRemix = (tmpl) => {
    const initialProjectData = {
      id: `remix_${Date.now()}`,
      title: `${tmpl.title} (Remix)`,
      category: tmpl.category,
      tool: tmpl.tool,
      date: new Date().toLocaleDateString(),
      tags: tmpl.tags,
      gradient: tmpl.gradient,
      data: {
        layers: Array.from({ length: tmpl.layers }).map((_, i) => ({
          id: i + 1,
          name: `Layer ${i + 1}`,
          type: i === 0 ? "image" : "shape",
          visible: true,
          locked: false,
          opacity: 100,
        })),
        fonts: tmpl.fonts,
      }
    };

    // Save to past works so it appears in Vault
    try {
      const saved = JSON.parse(localStorage.getItem("creatify_past_works") || "[]");
      saved.unshift(initialProjectData);
      localStorage.setItem("creatify_past_works", JSON.stringify(saved));
    } catch (e) {
      console.error(e);
    }

    if (tmpl.route === "mockup_studio") {
      onNavigate("mockup_studio");
    } else {
      onNavigate(tmpl.route, initialProjectData);
    }
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
      
      {/* Top Header */}
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
                Community Templates & Showcase
              </h1>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 99,
                background: "rgba(225, 73, 109, 0.2)", color: "#ff8da7",
                border: "1px solid rgba(225, 73, 109, 0.4)", fontWeight: 700,
              }}>
                1-CLICK REMIXABLE
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
              Explore award-winning layouts created by top artists and clone them directly into your Studio.
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(225,73,109,0.25)",
          borderRadius: 12, padding: "8px 16px", width: 340,
        }}>
          <Search size={16} color="#ff8da7" />
          <input
            type="text"
            placeholder="Search templates, tags, or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              color: "#fff", fontSize: 13, fontFamily: "'Instrument Sans', sans-serif",
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11 }}>✕</button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: 1440, width: "100%", margin: "0 auto", padding: "28px 36px 80px" }}>
        
        {/* Category Pills & Filters */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          {/* Category tabs */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: "7px 16px", borderRadius: 99,
                    background: active ? "linear-gradient(135deg, #e1496d, #942945)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? "#e1496d" : "rgba(255,255,255,0.08)"}`,
                    color: active ? "#fff" : "rgba(255,255,255,0.6)",
                    fontSize: 12.5, fontWeight: active ? 700 : 500, fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s ease",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Aspect Ratio Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700 }}>
              Ratio:
            </span>
            {["all", "16:9", "9:16", "1:1", "4:5"].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRatio(r)}
                style={{
                  padding: "4px 10px", borderRadius: 8,
                  background: selectedRatio === r ? "rgba(225,73,109,0.25)" : "rgba(0,0,0,0.3)",
                  border: `1px solid ${selectedRatio === r ? "#e1496d" : "rgba(255,255,255,0.06)"}`,
                  color: selectedRatio === r ? "#ff8da7" : "rgba(255,255,255,0.5)",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 28,
        }}>
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              style={{
                borderRadius: 22, overflow: "hidden",
                background: "rgba(22, 9, 18, 0.75)",
                border: "1px solid rgba(225, 73, 109, 0.2)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
                display: "flex", flexDirection: "column",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(225, 73, 109, 0.5)";
                e.currentTarget.style.boxShadow = "0 18px 40px rgba(225, 73, 109, 0.25)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(225, 73, 109, 0.2)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)";
              }}
              onClick={() => setActiveModalTemplate(tmpl)}
            >
              {/* Preview Thumbnail Top Area */}
              <div style={{
                height: 180, position: "relative", overflow: "hidden",
                background: tmpl.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 20,
                  background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 26, fontWeight: 800, fontFamily: "Syne, sans-serif",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}>
                  {tmpl.title.charAt(0)}
                </div>

                {/* Aspect Ratio Badge */}
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  padding: "4px 10px", borderRadius: 99,
                  background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
                  fontSize: 10, fontWeight: 700, color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
                }}>
                  {tmpl.ratio} • {tmpl.aspectLabel}
                </div>

                {/* Tool Badge */}
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  padding: "4px 10px", borderRadius: 99,
                  background: "rgba(225, 73, 109, 0.35)", backdropFilter: "blur(8px)",
                  fontSize: 10, fontWeight: 700, color: "#ff8da7", border: "1px solid rgba(225, 73, 109, 0.4)",
                }}>
                  {tmpl.tool}
                </div>
              </div>

              {/* Card Meta Content */}
              <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <h3 style={{
                    margin: "0 0 6px", fontSize: 16, fontWeight: 800,
                    fontFamily: "Syne, sans-serif", color: "#fff",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {tmpl.title}
                  </h3>

                  <p style={{
                    margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.5,
                  }}>
                    {tmpl.desc}
                  </p>

                  {/* Creator Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: "linear-gradient(135deg, #e1496d, #942945)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 10, fontWeight: 700,
                    }}>
                      {tmpl.creator.avatar}
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                      {tmpl.creator.name}
                    </span>
                    <span style={{
                      fontSize: 9, padding: "2px 6px", borderRadius: 4,
                      background: "rgba(225,73,109,0.15)", color: "#ff8da7", fontWeight: 700,
                    }}>
                      {tmpl.creator.badge}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Flame size={13} color="#e1496d" /> {tmpl.remixes}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={13} color="#fbbf24" fill="#fbbf24" /> {tmpl.rating}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemix(tmpl);
                    }}
                    style={{
                      padding: "6px 14px", borderRadius: 10,
                      background: "linear-gradient(135deg, #e1496d, #942945)",
                      border: "none", color: "#fff", fontSize: 12, fontWeight: 700,
                      fontFamily: "Syne, sans-serif", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    Remix in Studio →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect / Preview Modal */}
      {activeModalTemplate && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}
        onClick={() => setActiveModalTemplate(null)}
        >
          <div style={{
            maxWidth: 720, width: "100%", borderRadius: 24,
            background: "linear-gradient(145deg, #180914 0%, #0d040a 100%)",
            border: "1px solid rgba(225, 73, 109, 0.35)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)", overflow: "hidden",
          }}
          onClick={e => e.stopPropagation()}
          >
            <div style={{
              height: 220, background: activeModalTemplate.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif" }}>
                {activeModalTemplate.title.charAt(0)}
              </div>
              <button
                onClick={() => setActiveModalTemplate(null)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)", border: "none", color: "#fff",
                  cursor: "pointer", fontSize: 14,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, fontFamily: "Syne, sans-serif", color: "#fff" }}>
                    {activeModalTemplate.title}
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    Created by {activeModalTemplate.creator.name} • {activeModalTemplate.tool}
                  </p>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: 99,
                  background: "rgba(225,73,109,0.2)", color: "#ff8da7",
                  fontSize: 11, fontWeight: 700, border: "1px solid rgba(225,73,109,0.4)",
                }}>
                  {activeModalTemplate.aspectLabel}
                </div>
              </div>

              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 20 }}>
                {activeModalTemplate.desc}
              </p>

              {/* Template Specs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>LAYERS</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{activeModalTemplate.layers} Editable</div>
                </div>
                <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>FONTS</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#ff8da7" }}>{activeModalTemplate.fonts.join(", ")}</div>
                </div>
                <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>REMIXES</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#22d3a8" }}>{activeModalTemplate.remixes} times</div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => {
                    handleRemix(activeModalTemplate);
                    setActiveModalTemplate(null);
                  }}
                  style={{
                    flex: 1, padding: "12px 0", borderRadius: 12,
                    background: "linear-gradient(135deg, #e1496d, #942945)",
                    border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
                    fontFamily: "Syne, sans-serif", cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(225,73,109,0.35)",
                  }}
                >
                  Clone & Open in {activeModalTemplate.tool} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
