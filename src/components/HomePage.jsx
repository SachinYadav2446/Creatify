import { useState, useEffect, useRef } from "react";
import THEME from "../theme";
import ShowroomHero from "./ShowroomHero";
import { 
  Home, FolderOpen, Wrench, LayoutGrid, 
  Settings, MoreHorizontal, Sparkles,
  Video, Image as ImageIcon, PenTool, Presentation, FileText, Infinity as InfinityIcon, Edit3, Layers,
  Code, Share2, Globe, Cpu, Users, Zap,
  Search, Trash2, Plus, ArrowRight, Check, X,
  Palette, Box, Compass, ChevronLeft, ChevronRight,
  Send, MessageSquare, Copy, CheckCheck, Bug, Lightbulb, Briefcase, Mail, Clock, ShieldCheck
} from "lucide-react";

// Import generated preview images
import videoPrev      from "../assets/images/video_preview.png";
import pptPrev        from "../assets/images/ppt_preview.png";
import socialPrev     from "../assets/images/social_preview.png";
import imagePrev      from "../assets/images/image_preview.png";
import aiPrev         from "../assets/images/ai_preview.png";
import logoPrev       from "../assets/images/logo_preview.png";
import docPrev        from "../assets/images/doc_preview.png";
import whiteboardPrev from "../assets/images/whiteboard_preview.png";

import BrandKit from "./BrandKit";
import TemplatesMarketplace from "./TemplatesMarketplace";
import WorkflowPipelines from "./WorkflowPipelines";
import MockupStudio from "./MockupStudio";
import CreativeCityscapeArt from "./CreativeCityscapeArt";
import ExperienceCreatifySection from "./ExperienceCreatifySection";
import ContactSection from "./ContactSection";
import CommunityLandscapeBanner from "./CommunityLandscapeBanner";
import VaultView from "./VaultView";
import CorePowerTrioSection from "./CorePowerTrioSection";

const TOOL_ACCENTS = {
  "Video Editor": "#ef4444",
  "Presentations": "#3b82f6",
  "Logo Maker": "#10b981",
  "Whiteboard": "#a855f7",
  "Image Editor": "#f59e0b",
  "Documents": "#06b6d4",
  "Social Studio": "#ec4899",
  "Print Design": "#f97316",
  "AI Magic": "#8b5cf6",
  "Infinite Studio": "#e1496d",
};

// ── SidebarIcon —  defined at module scope so React never remounts it on re-render ──
function SidebarIcon({ active, icon: IconComponent, label, onClick, THEME, crownBadge, bottom = false, animationType = "scale" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick();
  };

  const getAnimationStyles = () => {
    if (isClicked) {
      return {
        transform: animationType === "rotate" ? "scale(0.9) rotate(180deg)" : "scale(0.9)",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      };
    }
    if (isHovered && !active) {
      switch(animationType) {
        case "rotate": return { transform: "scale(1.1) rotate(15deg)" };
        case "bounce": return { transform: "scale(1.1) translateY(-2px)" };
        case "pulse":  return { transform: "scale(1.15)" };
        default:       return { transform: "scale(1.1)" };
      }
    }
    return {};
  };

  const wine = THEME?.wine || "#942945";
  const textMuted = THEME?.textMuted || "#8c8780";

  return (
    <div style={{
      position: "relative", width: "100%",
      display: "flex", flexDirection: "column", alignItems: "center",
      marginBottom: bottom ? 4 : 0
    }}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={label}
        style={{
          width: 42, height: 42, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: active
            ? "linear-gradient(135deg, rgba(225, 73, 109, 0.35), rgba(148, 41, 69, 0.25))"
            : isHovered
              ? "rgba(225, 73, 109, 0.14)"
              : "transparent",
          border: active ? "1.5px solid rgba(225, 73, 109, 0.55)" : "1.5px solid transparent",
          color: active ? "#ff8da7" : isHovered ? "#ff8da7" : "#9ca3af",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          outline: "none",
          position: "relative",
          boxShadow: active
            ? "0 4px 16px rgba(225, 73, 109, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
            : isHovered ? "0 2px 10px rgba(225, 73, 109, 0.15)" : "none",
        }}
      >
        <div style={{
          ...getAnimationStyles(),
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}>
          <IconComponent
            size={20}
            strokeWidth={active ? 2.5 : 2}
            style={{ filter: active ? `drop-shadow(0 0 4px rgba(148,41,69,0.3))` : "none" }}
          />
        </div>
        {crownBadge && (
          <div style={{
            position: "absolute", top: -3, right: -3,
            background: "linear-gradient(135deg, #f6d365, #fda085)",
            width: 13, height: 13, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}>✨</div>
        )}
      </button>
      <span style={{
        fontSize: 8.5, marginTop: 2,
        color: active ? wine : isHovered ? wine : textMuted,
        fontFamily: "'Poppins',sans-serif",
        fontWeight: active ? 600 : 400,
        letterSpacing: "-0.01em",
        transition: "color 0.2s ease",
        opacity: isHovered || active ? 1 : 0.8
      }}>{label}</span>
    </div>
  );
}


// ─── Studio Picker Modal ──────────────────────────────────────────────────
const STUDIO_TOOLS = [
  {
    id: "editor",       name: "Video Editor",
    desc: "Multi-track timeline, color grading, audio mixing",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    color: "#e1496d", tag: "WebGL · WASM",
  },
  {
    id: "presentation",  name: "Presentations",
    desc: "Animated slides, 500+ templates, PPTX export",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/></svg>,
    color: "#942945", tag: "PPTX · PDF · HTML5",
  },
  {
    id: "whiteboard",    name: "Whiteboard",
    desc: "Infinite canvas, sticky notes, live multiplayer",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    color: "#b13453", tag: "Canvas · Real-time",
  },
  {
    id: "logo_maker",    name: "Logo Maker",
    desc: "Vector studio, AI suggestions, SVG export",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    color: "#e1496d", tag: "SVG · AI-assisted",
  },
  {
    id: "social_studio", name: "Social Studio",
    desc: "Instagram, X, LinkedIn — all formats in one place",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    color: "#942945", tag: "All social formats",
  },
  {
    id: "image_editor",  name: "Image Editor",
    desc: "Layers, masks, filters, blend modes",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    color: "#b13453", tag: "Canvas API",
  },
  {
    id: "documents",     name: "Documents",
    desc: "Rich docs with media, tables, charts",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    color: "#e1496d", tag: "DOCX · PDF",
  },
  {
    id: "infinite_studio", name: "Infinite Studio",
    desc: "Executable canvas, live APIs, multiplayer",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>,
    color: "#942945", tag: "React · Live APIs",
  },
  {
    id: "templates",     name: "Templates Marketplace",
    desc: "1-Click remixable community showcases & decks",
    icon: <Compass size={22} />,
    color: "#e1496d", tag: "Community · Remix",
  },
  {
    id: "brand_kit",     name: "Brand Kit Hub",
    desc: "Global palettes, typography hierarchy, logos",
    icon: <Palette size={22} />,
    color: "#38bdf8", tag: "Design Systems",
  },
  {
    id: "pipelines",     name: "Workflow Pipelines",
    desc: "Visual Unreal Blueprint AI automation wires",
    icon: <Zap size={22} />,
    color: "#a855f7", tag: "Blueprints · AI",
  },
  {
    id: "mockup_studio", name: "3D Mockup Studio",
    desc: "Interactive Three.js 3D devices & packaging stages",
    icon: <Box size={22} />,
    color: "#22d3a8", tag: "Three.js · WebGL",
  },
];

function StudioPicker({ onClose, onSelect, isDark }) {
  const [hovered, setHovered] = useState(null);
  const bg     = isDark ? "rgba(18,8,14,0.98)"  : "rgba(255,255,255,0.98)";
  const border = isDark ? "rgba(225,73,109,0.16)": "rgba(148,41,69,0.12)";
  const tx     = isDark ? "#fdf2f4"              : "#0f0208";
  const mu     = isDark ? "rgba(255,255,255,0.38)": "rgba(15,2,8,0.44)";

  // Close on backdrop click
  const handleBackdrop = e => { if (e.target === e.currentTarget) onClose(); };

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div onClick={handleBackdrop} style={{
      position:"fixed", inset:0, zIndex:9000,
      background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
    }}>
      <div style={{
        background:bg, border:`1px solid ${border}`, borderRadius:24,
        width:"100%", maxWidth:760, maxHeight:"85vh", overflow:"hidden",
        display:"flex", flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.4)",
      }}>
        {/* Header */}
        <div style={{ padding:"24px 28px 20px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:22, color:tx, margin:0, letterSpacing:"-0.03em" }}>
              Choose a tool
            </h2>
            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:mu, margin:"4px 0 0" }}>
              Pick where you want to start creating
            </p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${border}`, borderRadius:8, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:mu, fontSize:18, flexShrink:0 }}>
            ×
          </button>
        </div>

        {/* Tool grid */}
        <div style={{ overflow:"auto", padding:"20px 24px 24px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:12 }}>
            {STUDIO_TOOLS.map(tool => (
              <button key={tool.id}
                onClick={() => { onSelect(tool.id); onClose(); }}
                onMouseEnter={() => setHovered(tool.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered===tool.id ? (isDark?`${tool.color}18`:`${tool.color}0d`) : "transparent",
                  border: `1.5px solid ${hovered===tool.id ? tool.color+"55" : border}`,
                  borderRadius:14, padding:"16px 18px", cursor:"pointer",
                  display:"flex", alignItems:"flex-start", gap:14, textAlign:"left",
                  transition:"all 0.18s", outline:"none",
                }}>
                {/* Icon */}
                <div style={{
                  width:44, height:44, borderRadius:12, flexShrink:0,
                  background: hovered===tool.id ? `${tool.color}22` : (isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)"),
                  border:`1px solid ${hovered===tool.id ? tool.color+"44" : border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: hovered===tool.id ? tool.color : mu,
                  transition:"all 0.18s",
                }}>
                  {tool.icon}
                </div>
                {/* Text */}
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:14, color: hovered===tool.id ? tool.color : tx, marginBottom:3, transition:"color 0.18s" }}>
                    {tool.name}
                  </div>
                  <div style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:12, color:mu, lineHeight:1.5, marginBottom:5 }}>
                    {tool.desc}
                  </div>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:600, color: hovered===tool.id ? tool.color : mu, opacity: hovered===tool.id ? 1 : 0.6, letterSpacing:"0.04em", transition:"all 0.18s" }}>
                    {tool.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




export default function HomePage({ onNavigate, user, onSignOut, theme = "light", initialNav = "home" }) {
  const [hoveredCard, setHoveredCard]         = useState(null);
  const [revealedSections, setRevealedSections] = useState(new Set());
  const [animatedStats, setAnimatedStats]     = useState(new Set());
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showStudioPicker, setShowStudioPicker] = useState(false);
  const [activeNav, setActiveNav]             = useState(initialNav || "home");

  useEffect(() => {
    if (initialNav) {
      setActiveNav(initialNav);
      window.scrollTo(0, 0);
    }
  }, [initialNav]);

  const [navScrolled, setNavScrolled]         = useState(false);
  const [heroSettled, setHeroSettled]         = useState(false);
  const [studioScrollProgress, setStudioScrollProgress] = useState(0);
  const infiniteStudioSectionRef = useRef(null);

  const infiniteStudioCards = [
    {
      num: "01",
      title: "Spatial Infinite Node Graph",
      tag: "Infinite Viewport & Splines",
      desc: "Infinite 2D spatial canvas with freeform pan & multi-scale zoom (5% to 800%). Draw dynamic bezier logic connections between component ports to orchestrate data flows across visual artboards.",
      capabilities: ["Infinite Pan & Multi-Scale Zoom (5% to 800%)", "Dynamic Bezier Spline Cables with Snap Points", "Multi-Port Real-Time Data Synchronization"],
      Icon: Share2,
      iconColor: "#ff8da7",
      gradient: "linear-gradient(135deg, rgba(225,73,109,0.25), rgba(148,41,69,0.1))",
      demoType: "nodes",
    },
    {
      num: "02",
      title: "Code-to-Canvas React & JSX DOM",
      tag: "Executable Live DOM",
      desc: "Elements on canvas aren't static vector drawings—they compile to live, interactive React & Tailwind DOM nodes with bidirectional real-time state synchronization and live inspection.",
      capabilities: ["Live React 18 & JSX Compilation", "Dev Mode Spacing & Computed CSS Box Rulers", "Instant Tailwind & Clean Component Code Export"],
      Icon: Code,
      iconColor: "#38bdf8",
      gradient: "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(14,165,233,0.1))",
      demoType: "code",
    },
    {
      num: "03",
      title: "Neural Prompt-to-Layout Synthesis",
      tag: "AI Blueprint Engine",
      desc: "Describe any UI layout, flowchart, or marketing asset in natural language. AI synthesizes full structured canvas nodes with auto-layout constraints, accessible palettes, and responsive breakpoints.",
      capabilities: ["Multi-Modal Natural Language Parsing", "Auto-Layout Flexbox & CSS Grid Hierarchy", "Instant Component Hierarchy Synthesis"],
      Icon: Sparkles,
      iconColor: "#c084fc",
      gradient: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(126,34,206,0.1))",
      demoType: "ai",
    },
    {
      num: "04",
      title: "Real-Time Multi-Player CRDT Sync",
      tag: "Sub-10ms Spatial Presence",
      desc: "Collaborate simultaneously on the same infinite canvas with sub-10ms peer-to-peer spatial sync. Enjoy live multiplayer cursors, non-destructive layer locking, and version history branches.",
      capabilities: ["Sub-10ms Conflict-Free Replicated Data (CRDT)", "Live Multi-Cursor Presence with User Avatars", "Granular Element Locking & Version Timelines"],
      Icon: Users,
      iconColor: "#10b981",
      gradient: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.1))",
      demoType: "collab",
    },
    {
      num: "05",
      title: "Universal Multi-Format Export Engine",
      tag: "Production Delivery",
      desc: "Export any frame, graph branch, or nested artboard directly into production-ready SVG, 4K WebM alpha video, 3D WebGL GLTF scenes, or clean Tailwind React component bundles.",
      capabilities: ["Clean SVG & Vector Shader Code Export", "4K 60FPS Video Alpha Channel Render", "Optimized WebGL GLTF & Three.js Packages"],
      Icon: Zap,
      iconColor: "#f59e0b",
      gradient: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.1))",
      demoType: "export",
    },
  ];

  // Scroll listener for sticky 3-step feature progression
  useEffect(() => {
    const handleStudioScroll = () => {
      const el = infiniteStudioSectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalDist = el.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;
      const progress = Math.min(Math.max(-rect.top / totalDist, 0), 1);
      setStudioScrollProgress(progress);
    };

    window.addEventListener("scroll", handleStudioScroll, { passive: true });
    handleStudioScroll();
    return () => window.removeEventListener("scroll", handleStudioScroll);
  }, []);



  // Dynamic Past Works state
  const [pastWorks, setPastWorks] = useState(() => {
    const saved = localStorage.getItem("creatify_past_works");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse past works", e);
      }
    }
    
    // Fallback seed projects
    const defaultWorks = [
      {
        id: "cinema-intro",
        title: "Cinematic Intro Reel",
        category: "Video Edit",
        tool: "Video Editor",
        year: "2026",
        accent: "#b13453",
        gradient: "linear-gradient(135deg, #1a0f14 0%, #3a0c19 45%, #581c87 100%)",
        image: videoPrev,
        tags: ["4K UHD", "LUTs", "15s"],
        desc: "Cinematic intro sequence with wine-toned color LUTs and silk-smooth title transitions.",
        data: {
          tracks: [
            { id: "track_v1", type: "video", name: "Video Track 1", clips: [
              { id: "clip_v1", name: "Cinematic Forest", start: 0, duration: 10, type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" }
            ]},
            { id: "track_t1", type: "text", name: "Title Overlay", clips: [
              { id: "clip_t1", name: "Main Title", start: 2, duration: 6, type: "text", text: "THE CINEMATIC EXPERIENCE" }
            ]}
          ],
          duration: 15
        }
      },
      {
        id: "pitch-deck",
        title: "Startup Pitch Deck",
        category: "Presentation",
        tool: "Slide Studio",
        year: "2026",
        accent: "#7e22ce",
        gradient: "linear-gradient(135deg, #180825 0%, #3a0e5b 45%, #1a0f14 100%)",
        image: pptPrev,
        tags: ["10 Slides", "Vector", "Pitch"],
        desc: "Modern corporate pitch deck with plum accents and razor-sharp vector grid alignment.",
        data: {
          themeIdx: 0,
          slides: [
            { id: "s1", layout: "title", title: "Next Gen Platform", subtitle: "Building the future of creation", bulletPoints: ["Empowering millions of creators", "Zero friction deployment", "Fully decentralized platform"], elements: [] },
            { id: "s2", layout: "split", title: "Market Growth", subtitle: "Traction and projections", bulletPoints: ["300% YoY growth", "High user retention", "Profitable from day one"], elements: [] }
          ]
        }
      }
    ];

    localStorage.setItem("creatify_past_works", JSON.stringify(defaultWorks));
    return defaultWorks;
  });

  // Reload past works when component mounts or user session changes
  useEffect(() => {
    const token = localStorage.getItem("creatify_token");
    if (token) {
      fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch from DB");
      })
      .then(dbProjects => {
        if (dbProjects) {
          // If we have projects in DB, prioritize them
          if (dbProjects.length > 0) {
            setPastWorks(dbProjects);
            localStorage.setItem("creatify_past_works", JSON.stringify(dbProjects));
          } else {
            // DB is empty, check if we have localStorage work we can sync to DB!
            const localSaved = localStorage.getItem("creatify_past_works");
            if (localSaved) {
              try {
                const parsed = JSON.parse(localSaved);
                if (parsed.length > 0) {
                  setPastWorks(parsed);
                  // Sync local projects to the server DB
                  parsed.forEach(proj => {
                    fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                      body: JSON.stringify(proj)
                    }).catch(e => console.error("Auto-sync project failed:", e));
                  });
                }
              } catch (e) {}
            }
          }
        }
      })
      .catch(err => {
        console.warn("DB load failed, falling back to local:", err.message);
        const saved = localStorage.getItem("creatify_past_works");
        if (saved) {
          try {
            setPastWorks(JSON.parse(saved));
          } catch (e) {}
        }
      });
    } else {
      const saved = localStorage.getItem("creatify_past_works");
      if (saved) {
        try {
          setPastWorks(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to reload past works", e);
        }
      }
    }
  }, [user]);

  const handleDeletePastWork = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const token = localStorage.getItem("creatify_token");
    if (token) {
      try {
        await fetch(`${window.API_URL || "http://localhost:3001"}/api/projects/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log("Deleted project from DB successfully");
      } catch (err) {
        console.error("Failed to delete project from DB:", err.message);
      }
    }

    const saved = JSON.parse(localStorage.getItem("creatify_past_works") || "[]");
    const updated = saved.filter(w => w.id !== id);
    localStorage.setItem("creatify_past_works", JSON.stringify(updated));
    setPastWorks(updated);

    if (user && user.email) {
      const videoKey = `creatify_video_projects_${user.email}`;
      const savedVideos = JSON.parse(localStorage.getItem(videoKey) || "[]");
      localStorage.setItem(videoKey, JSON.stringify(savedVideos.filter(p => p.id !== id)));

      const pptKey = `creatify_presentations_${user.email}`;
      const savedPpts = JSON.parse(localStorage.getItem(pptKey) || "[]");
      localStorage.setItem(pptKey, JSON.stringify(savedPpts.filter(p => p.id !== id)));
    }
  };
  const canvasRef  = useRef(null);
  const profileDropdownRef = useRef(null);

  // Track scroll position for nav shrink effect
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll helper
  const scrollTo = (id, label) => {
    setActiveNav(label);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDark = theme === "dark";

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showProfileDropdown]);

  // Interactive state for card micro-animations
  const [timelinePlayhead, setTimelinePlayhead] = useState(15);
  const [aiPromptText, setAiPromptText]         = useState("");
  const [promptIdx, setPromptIdx]               = useState(0);
  const [logoAngle, setLogoAngle]               = useState(0);
  const [activeSlide, setActiveSlide]           = useState(0);
  const [imageSliderPos, setImageSliderPos]     = useState(50);

  // Interactive Gallery State
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [hoveredWork, setHoveredWork]         = useState(null);
  const [pastWorkHoveredId, setPastWorkHoveredId] = useState(null);
  const pastWorkScrollRef = useRef(null);

  // Vault Hub state
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultCategory, setVaultCategory] = useState("all");
  const [vaultView, setVaultView] = useState("both"); // "both", "graph", "grid"

  const handleDeleteProject = (projectId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project from your Vault?")) return;
    const updated = pastWorks.filter(p => p.id !== projectId);
    setPastWorks(updated);
    try {
      localStorage.setItem("creatify_past_works", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const handlePastWorkClick = (work) => {
    if (!work) return;
    const cat = (work.category || "").toLowerCase();
    const tool = (work.tool || "").toLowerCase();

    if (cat.includes("video") || tool.includes("video")) {
      onNavigate("editor_load", work);
    } else if (cat.includes("presentation") || tool.includes("presentation") || tool.includes("slide")) {
      onNavigate("presentation_load", work);
    } else if (cat.includes("image") || tool.includes("image")) {
      onNavigate("image_editor_load", work);
    } else if (cat.includes("logo") || tool.includes("logo")) {
      onNavigate("logo_maker_load", work);
    } else if (cat.includes("social") || tool.includes("social")) {
      onNavigate("social_studio_load", work);
    } else if (cat.includes("document") || tool.includes("document") || tool.includes("doc")) {
      onNavigate("documents_load", work);
    } else if (cat.includes("print") || tool.includes("print")) {
      onNavigate("print_design_load", work);
    } else if (tool.includes("whiteboard") || cat.includes("whiteboard")) {
      onNavigate("whiteboard_load", work);
    } else if (tool.includes("pipeline") || cat.includes("pipeline")) {
      onNavigate("pipelines");
    } else if (tool.includes("mockup") || cat.includes("mockup")) {
      onNavigate("mockup_studio");
    } else if (tool.includes("infinite") || cat.includes("infinite")) {
      onNavigate("infinite_studio");
    } else {
      onNavigate("editor_load", work);
    }
  };


  const prompts = [
    "cinematic retro synthwave skyline, 3d render...",
    "elegant minimalist swan logo, vector...",
    "modern dark-mode presentation layout slide...",
    "premium neon-glow color-grading LUT template...",
  ];

  useEffect(() => {
    if (hoveredCard !== "video") return;
    const t = setInterval(() => setTimelinePlayhead(p => p >= 95 ? 5 : p + 1.2), 25);
    return () => clearInterval(t);
  }, [hoveredCard]);

  useEffect(() => {
    if (hoveredCard !== "ai") { setAiPromptText(""); return; }
    const full = prompts[promptIdx]; let i = 0; setAiPromptText("");
    const t = setInterval(() => {
      if (i < full.length) { setAiPromptText(full.substring(0, i + 1)); i++; }
      else { clearInterval(t); setTimeout(() => setPromptIdx(p => (p + 1) % prompts.length), 1500); }
    }, 40);
    return () => clearInterval(t);
  }, [hoveredCard, promptIdx]);

  useEffect(() => {
    if (hoveredCard !== "logo") { setLogoAngle(0); return; }
    const t = setInterval(() => setLogoAngle(p => (p + 1) % 360), 16);
    return () => clearInterval(t);
  }, [hoveredCard]);

  useEffect(() => {
    if (hoveredCard !== "ppt") return;
    const t = setInterval(() => setActiveSlide(p => (p + 1) % 3), 1500);
    return () => clearInterval(t);
  }, [hoveredCard]);

  useEffect(() => {
    if (hoveredCard !== "image") { setImageSliderPos(50); return; }
    let dir = 1;
    const t = setInterval(() => setImageSliderPos(p => { if (p >= 85) dir = -1; if (p <= 15) dir = 1; return p + dir * 1.5; }), 30);
    return () => clearInterval(t);
  }, [hoveredCard]);


  // Scroll-reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setRevealedSections(s => new Set([...s, e.target.id])); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Three.js background (Plexus Particle Network)
  useEffect(() => {
    if (!canvasRef.current) return;
    let cleanup;
    (async () => {
      try {
        const THREE = (await import("three")).default;
        const canvas   = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);

        // 120 particles
        const particleCount = 120;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
          const x = (Math.random() - 0.5) * 35;
          const y = (Math.random() - 0.5) * 20;
          const z = (Math.random() - 0.5) * 15;
          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;
          
          velocities.push({
            x: (Math.random() - 0.5) * 0.015,
            y: (Math.random() - 0.5) * 0.015,
            z: (Math.random() - 0.5) * 0.01
          });
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create canvas-based particle texture for soft glowing circles
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 16;
        pCanvas.height = 16;
        const ctx = pCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(212, 165, 116, 1)');
        grad.addColorStop(1, 'rgba(212, 165, 116, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        const pTexture = new THREE.CanvasTexture(pCanvas);

        const particleMaterial = new THREE.PointsMaterial({
          size: 0.28,
          map: pTexture,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Dynamic Line Segments
        const maxLines = 400;
        const linePositions = new Float32Array(maxLines * 6);
        const lineColors = new Float32Array(maxLines * 6);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0.35
        });
        
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        let mx = 0, my = 0, targetMx = 0, targetMy = 0;
        const mm = e => {
          targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
          targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", mm);

        let animationFrameId;
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          
          mx += (targetMx - mx) * 0.08;
          my += (targetMy - my) * 0.08;

          const posAttr = particleGeometry.attributes.position;
          let lineIndex = 0;

          // Mouse coordinate projected coordinates
          const mouse3D = new THREE.Vector3(mx * 16, -my * 10, 0);

          for (let i = 0; i < particleCount; i++) {
            let px = posAttr.getX(i);
            let py = posAttr.getY(i);
            let pz = posAttr.getZ(i);

            px += velocities[i].x;
            py += velocities[i].y;
            pz += velocities[i].z;

            const boxX = 22, boxY = 13, boxZ = 10;
            if (px > boxX || px < -boxX) velocities[i].x *= -1;
            if (py > boxY || py < -boxY) velocities[i].y *= -1;
            if (pz > boxZ || pz < -boxZ) velocities[i].z *= -1;

            const dx = px - mouse3D.x;
            const dy = py - mouse3D.y;
            const dz = pz - mouse3D.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 5) {
              const force = (5 - dist) * 0.02;
              px += (dx / dist) * force;
              py += (dy / dist) * force;
              pz += (dz / dist) * force;
            }

            posAttr.setXYZ(i, px, py, pz);
          }
          posAttr.needsUpdate = true;

          const lp = lineGeometry.attributes.position.array;
          const lc = lineGeometry.attributes.color.array;
          
          for (let i = 0; i < particleCount; i++) {
            const ix = posAttr.getX(i);
            const iy = posAttr.getY(i);
            const iz = posAttr.getZ(i);

            for (let j = i + 1; j < particleCount; j++) {
              if (lineIndex >= maxLines) break;

              const jx = posAttr.getX(j);
              const jy = posAttr.getY(j);
              const jz = posAttr.getZ(j);

              const dx = ix - jx;
              const dy = iy - jy;
              const dz = iz - jz;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

              if (dist < 6) {
                const alpha = (6 - dist) / 6;
                
                lp[lineIndex * 6] = ix;
                lp[lineIndex * 6 + 1] = iy;
                lp[lineIndex * 6 + 2] = iz;
                lp[lineIndex * 6 + 3] = jx;
                lp[lineIndex * 6 + 4] = jy;
                lp[lineIndex * 6 + 5] = jz;

                lc[lineIndex * 6] = 212/255 * alpha;
                lc[lineIndex * 6 + 1] = 165/255 * alpha;
                lc[lineIndex * 6 + 2] = 116/255 * alpha;

                lc[lineIndex * 6 + 3] = 139/255 * alpha;
                lc[lineIndex * 6 + 4] = 90/255 * alpha;
                lc[lineIndex * 6 + 5] = 43/255 * alpha;

                lineIndex++;
              }
            }
          }

          for (let i = lineIndex; i < maxLines; i++) {
            lp[i * 6] = 0; lp[i * 6 + 1] = 0; lp[i * 6 + 2] = 0;
            lp[i * 6 + 3] = 0; lp[i * 6 + 4] = 0; lp[i * 6 + 5] = 0;
          }
          lineGeometry.attributes.position.needsUpdate = true;
          lineGeometry.attributes.color.needsUpdate = true;

          camera.position.x += (mx * 4 - camera.position.x) * 0.05;
          camera.position.y += (-my * 3 - camera.position.y) * 0.05;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);
        
        cleanup = () => {
          window.removeEventListener("mousemove", mm);
          window.removeEventListener("resize", onResize);
          cancelAnimationFrame(animationFrameId);
          renderer.dispose();
        };
      } catch(e) { console.log("Three.js error:", e); }
    })();
    return () => cleanup && cleanup();
  }, []);

  // ── Tool definitions (ordered for Bento layout) ──────────────────────────
  // Grid: 3 columns  2 rows. All tools equally sized to fit in one studio without gaps
  const tools = [
    { id:"video",   name:"Video Editor",       desc:"Full multi-track timeline with WebGL color grading, audio mixing & in-browser rendering. No uploads needed.", icon:"🎬", color:"#942945",  tag:"WebGL · WASM",           colSpan:1, rowSpan:1, image: videoPrev      },
    { id:"image",   name:"Image Editor",       desc:"Layers, masks, filters, blend modes. Pro-grade photo editing in your browser.",                                icon:"🖼️", color:"#e1496d",  tag:"Canvas API",             colSpan:1, rowSpan:1, image: imagePrev      },
    { id:"logo",    name:"Logo Maker",         desc:"Vector-based logo studio. AI suggestions, custom icons, SVG export.",                                          icon:"✦",  color:"#ec4899",  tag:"SVG · AI-assisted",      colSpan:1, rowSpan:1, image: logoPrev       },
    { id:"ppt",     name:"Presentations",      desc:"Slides that animate. Real-time collaboration, 500+ templates, one-click export.",                              icon:"🎠", color:"#7c233c",  tag:"PPTX · PDF · HTML5",     colSpan:1, rowSpan:1, image: pptPrev        },
    { id:"white",   name:"Whiteboard",         desc:"Freehand canvas with sticky notes, arrows, shapes, laser pointer & live multiplayer cursors.",                  icon:"🖊️",  color:"#be185d",  tag:"Canvas · Real-time",     colSpan:1, rowSpan:1, image: whiteboardPrev },
    { id:"doc",     name:"Documents",          desc:"Rich docs with embedded media, tables, charts. Beautiful by default.",                                         icon:"📄", color:"#eba5b6",  tag:"DOCX · PDF",             colSpan:1, rowSpan:1, image: docPrev        },
  ];

  const pricing = [
    { name:"Free",  price:0,  period:"forever free",              popular:false, features:["5 active projects","Basic templates","2GB storage","Export PNG & PDF","Community support"] },
    { name:"Pro",   price:16, period:"per month, billed annually", popular:true,  features:["Unlimited projects","500K+ premium templates","100GB storage","All export formats","AI design tools","Brand kit","Priority support"] },
    { name:"Team",  price:42, period:"per month, up to 5 seats",  popular:false, features:["Everything in Pro","Real-time collaboration","Shared brand assets","Admin controls","1TB storage","Dedicated support"] },
  ];

  // ── Gradient fallbacks for cards without images ──────────────────────────
  const cardGradients = isDark ? {
    logo:  "linear-gradient(135deg, #1a0f14 0%, #3a0c19 40%, #ec489920 100%)",
    doc:   "linear-gradient(135deg, #170b11 0%, #23141b 50%, #eba5b620 100%)",
    white: "linear-gradient(135deg, #140a0f 0%, #2a0d1b 45%, #be185d25 100%)",
  } : {
    logo:  "linear-gradient(135deg, #fff0f3 0%, #fce7f3 50%, #ec489912 100%)",
    doc:   "linear-gradient(135deg, #fdf2f4 0%, #fce8ef 50%, #eba5b615 100%)",
    white: "linear-gradient(135deg, #f8f0f5 0%, #fce7f3 45%, #be185d12 100%)",
  };

  const colors = {
    bg: isDark ? "#1a0f14" : "#f7f4f7",
    text: isDark ? "#fdf2f4" : "#2d2d2d",
    textMuted: isDark ? "#9d8e94" : "#666",
    navBg: isDark ? "rgba(14, 6, 10, 0.95)" : "rgba(253, 248, 250, 0.95)",
    border: isDark ? "rgba(225,73,109,0.18)" : "rgba(148,41,69,0.10)",
    btnBg: isDark ? "rgba(225,73,109,0.10)" : "rgba(148,41,69,0.07)",
    btnBorder: isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.18)",
    marqueeBg: isDark ? "#160b12" : "#fdf2f4",
    logoGlow: isDark ? "rgba(212, 165, 116, 0.2)" : "rgba(139, 90, 43, 0.35)",
    cardBorder: isDark ? "rgba(225,73,109,0.16)" : "rgba(148,41,69,0.12)",
    cardShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(148,41,69,0.08)",
  };

  const [homeTab, setHomeTab] = useState("home");
  const [searchVal, setSearchVal] = useState("");

  const sidebarW = 64;
  const pageMax = 1400;

  const AvatarCircle = ({ size = 36, onClick, showBorder = false }) => (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: user?.avatar && user.avatar.length > 2 ? "transparent" : "linear-gradient(135deg, #942945, #e1496d)",
        color: "#fff", border: showBorder ? `1.5px solid ${isDark ? "rgba(225,73,109,0.5)" : "rgba(148,41,69,0.3)"}` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.38, fontFamily: "'Poppins',sans-serif",
        cursor: "pointer", overflow: "hidden", padding: 0, outline: "none",
        boxShadow: "0 2px 8px rgba(148,41,69,0.18)",
      }}
    >
      {user?.avatar && user.avatar.length > 2 ? (
        <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : user ? (
        (user.name ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : user.email?.[0]?.toUpperCase() || "U")
      ) : "U"}
    </button>
  );


  const HeroToolBtn = ({ icon, label, bg, onClick, isCrown }) => {
    const [h, setH] = useState(false);
    return (
      <button onClick={onClick}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
          background: "none", border: "none", cursor: "pointer", padding: 0,
          minWidth: 72, outline: "none",
        }}>
        <div style={{
          width: 58, height: 58, borderRadius: "50%", background: bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, color: "#fff", position: "relative",
          transform: h ? "translateY(-2px) scale(1.06)" : "none",
          transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: h ? "0 10px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          {icon}
          {isCrown && <div style={{ position: "absolute", top: -4, right: -4, fontSize: 14 }}>✨</div>}
        </div>
        <span style={{
          fontSize: 11.5, color: isDark ? "rgba(245,240,232,0.78)" : "rgba(45,45,45,0.82)",
          fontFamily: "'Poppins',sans-serif", fontWeight: 400, whiteSpace: "nowrap",
        }}>{label}</span>
      </button>
    );
  };

  const AnimatedCreateRow = ({ onNavigate, user, isDark, THEME }) => (
    <div style={{ width:"100%", boxSizing:"border-box" }}>
      <style>{`
        @keyframes hFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hGrad   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes hOrb1   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-20px)} }
        @keyframes hOrb2   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,25px)} }
        @keyframes hShine  { from{left:-100%} to{left:160%} }
        @keyframes studioScrollDot { 0%,100%{transform:translateX(-50%) translateY(0); opacity:0.95} 50%{transform:translateX(-50%) translateY(9px); opacity:0.25} }

        .h4-cta {
          display:inline-flex; align-items:center; gap:10px;
          padding:16px 36px; border-radius:50px; border:none; cursor:pointer;
          font-family:'Poppins',sans-serif; font-size:16px; font-weight:600;
          letter-spacing:-0.01em; position:relative; overflow:hidden;
          background: linear-gradient(135deg,#7c1d35,#b13453,#e1496d);
          background-size:200% 200%; animation:hGrad 5s ease-in-out infinite;
          color:#fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
          transition:transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s;
        }
        .h4-cta::after {
          content:''; position:absolute; top:0; left:-100%; width:40%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          animation:hShine 3s ease-in-out 1s infinite;
        }
        .h4-cta:hover { transform:translateY(-3px) scale(1.02); }

        .h4-ghost {
          display:inline-flex; align-items:center; gap:8px;
          padding:15px 28px; border-radius:50px; cursor:pointer;
          font-family:'Poppins',sans-serif; font-size:15px; font-weight:500;
          letter-spacing:-0.01em; background:none;
          border:1.5px solid ${isDark?"rgba(255,255,255,0.15)":"rgba(15,2,8,0.14)"};
          color:${isDark?"rgba(255,255,255,0.65)":"rgba(15,2,8,0.55)"};
          transition:border-color 0.2s, background 0.2s, color 0.2s;
        }
        .h4-ghost:hover {
          border-color:${isDark?"rgba(255,255,255,0.35)":"rgba(148,41,69,0.4)"};
          background:${isDark?"rgba(255,255,255,0.05)":"rgba(148,41,69,0.04)"};
          color:${isDark?"#fff":"#7c1d35"};
        }

        .h4-mock-browser {
          border-radius: 16px;
          background: ${isDark ? "#1e0f16" : "#fdfaf9"};
          box-shadow: 0 20px 80px rgba(148,41,69,0.15), 0 4px 20px rgba(0,0,0,0.06);
          overflow: hidden;
          border: 1px solid ${isDark ? "rgba(225,73,109,0.10)" : "rgba(148,41,69,0.08)"};
        }
      `}</style>

      {/* ─── TOP HERO BAND ─── */}
      <div style={{
        width:"100%", padding:"88px 72px 80px",
        boxSizing:"border-box", textAlign:"center",
        position:"relative", overflow:"hidden",
        background: isDark
          ? "linear-gradient(180deg,#0f0408 0%,#1a0f14 100%)"
          : "linear-gradient(180deg,#fdf2f4 0%,#f7edf1 100%)",
      }}>
        {/* Background orbs */}
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", top:"-200px", left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(225,73,109,0.18) 0%,transparent 65%)", filter:"blur(60px)", animation:"hOrb1 12s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", bottom:"-100px", left:"20%", background:"radial-gradient(circle,rgba(148,41,69,0.12) 0%,transparent 65%)", filter:"blur(48px)", animation:"hOrb2 16s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", bottom:"-60px", right:"15%", background:"radial-gradient(circle,rgba(168,85,247,0.09) 0%,transparent 65%)", filter:"blur(40px)", animation:"hOrb1 20s ease-in-out 3s infinite", pointerEvents:"none" }} />

        {/* Content */}
        <div style={{ position:"relative", zIndex:1, maxWidth:760, margin:"0 auto" }}>

          {/* Headline — 2 rows */}
          <h1 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, margin:"0 0 18px", fontSize:"clamp(36px,4.8vw,64px)", letterSpacing:"-0.04em", lineHeight:1.08, color:isDark?"#fdf2f4":"#0f0208", animation:"hFadeUp 0.7s ease 0.08s both" }}>
            Design anything.<br/>
            <span style={{ background:"linear-gradient(135deg,#e1496d,#b13453,#f472b6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", backgroundSize:"200% 200%", animation:"hGrad 5s ease-in-out infinite" }}>
              Create everywhere.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize:17, lineHeight:1.68, margin:"0 0 40px", color:isDark?"rgba(255,255,255,0.5)":"rgba(15,2,8,0.48)", fontFamily:"'Instrument Sans',sans-serif", maxWidth:500, marginLeft:"auto", marginRight:"auto", animation:"hFadeUp 0.7s ease 0.16s both" }}>
            {user
              ? `Hey ${(user.name||"").split(" ")[0]||"there"} — your studio is ready. Jump back in.`
              : "Video, presentations, whiteboards, social graphics and AI — all in one browser-native studio. Free forever."}
          </p>

          {/* CTAs */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, flexWrap:"wrap", animation:"hFadeUp 0.7s ease 0.24s both" }}>
            <button className="h4-cta" onClick={() => user ? setShowStudioPicker(true) : onNavigate("auth","signup")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
              {user ? "Open Studio" : "Start for free"}
            </button>
            {!user && (
              <button className="h4-ghost" onClick={() => onNavigate("auth","signin")}>
                Sign in
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ─── MOCK STUDIO PREVIEW ─── */}
      <div style={{
        width:"100%", boxSizing:"border-box",
        background: isDark ? "#1a0f14" : "#f7edf1",
        padding:"0 72px 56px",
        position:"relative",
      }}>

        <div className="h4-mock-browser" style={{
          width:"100%", maxWidth:1000, margin:"0 auto",
          boxShadow: isDark
            ? "0 8px 60px rgba(148,41,69,0.15), 0 2px 20px rgba(0,0,0,0.3)"
            : "0 8px 60px rgba(148,41,69,0.10), 0 2px 20px rgba(148,41,69,0.08)",
          position:"relative", zIndex:1,
        }}>
          {/* Browser chrome bar */}
          <div style={{ height:38, background:isDark?"#1f0d14":"#f5edf0", borderBottom:"1px solid "+(isDark?"rgba(255,255,255,0.06)":"rgba(148,41,69,0.08)"), display:"flex", alignItems:"center", padding:"0 16px", gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#ff5f57" }} />
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#febc2e" }} />
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#28c840" }} />
            <div style={{ flex:1, margin:"0 16px", height:20, borderRadius:6, background:isDark?"rgba(255,255,255,0.06)":"rgba(148,41,69,0.07)", display:"flex", alignItems:"center", paddingLeft:10 }}>
              <span style={{ fontSize:10, color:isDark?"rgba(255,255,255,0.3)":"rgba(148,41,69,0.4)", fontFamily:"'Poppins',sans-serif" }}>creatify.app/studio</span>
            </div>
          </div>

          {/* Studio UI mockup — pure CSS */}
          <div style={{ display:"flex", height:340 }}>

            {/* Left tool palette */}
            <div style={{ width:52, background:isDark?"#180b10":"#fdf2f4", borderRight:"1px solid "+(isDark?"rgba(255,255,255,0.05)":"rgba(148,41,69,0.08)"), display:"flex", flexDirection:"column", alignItems:"center", paddingTop:16, gap:14 }}>
              {[
                <svg key="a" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
                <svg key="b" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
                <svg key="c" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>,
                <svg key="d" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.8 5.5 21 7 14 2 9.3 9 8.5"/></svg>,
              ].map((icon,i) => (
                <div key={i} style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:i===0?"linear-gradient(135deg,#e1496d,#942945)":"transparent", color:i===0?"#fff":isDark?"rgba(255,255,255,0.3)":"rgba(148,41,69,0.4)" }}>
                  {icon}
                </div>
              ))}
            </div>

            {/* Canvas area */}
            <div style={{ flex:1, background:isDark?"#150910":"#faf5f7", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* Dot grid */}
              <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,"+(isDark?"rgba(225,73,109,0.12)":"rgba(148,41,69,0.08)")+" 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }} />

              {/* Mock design card */}
              <div style={{ position:"relative", zIndex:1, width:320, height:200, borderRadius:16, background:isDark?"linear-gradient(135deg,#2a0f1a,#1f0a14)":"linear-gradient(135deg,#fff,#fdf2f4)", border:"1px solid "+(isDark?"rgba(225,73,109,0.18)":"rgba(148,41,69,0.12)"), boxShadow:"0 20px 60px rgba(148,41,69,0.2)", padding:24, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                <div>
                  <div style={{ width:48, height:6, borderRadius:3, background:"linear-gradient(90deg,#e1496d,#f472b6)", marginBottom:10 }} />
                  <div style={{ width:"80%", height:5, borderRadius:3, background:isDark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.06)", marginBottom:7 }} />
                  <div style={{ width:"60%", height:5, borderRadius:3, background:isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)" }} />
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  {["#e1496d","#a855f7","#3b82f6"].map((c,i) => (
                    <div key={i} style={{ flex:1, height:40, borderRadius:8, background:c, opacity:0.85 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right properties panel */}
            <div style={{ width:160, background:isDark?"#180b10":"#fdf2f4", borderLeft:"1px solid "+(isDark?"rgba(255,255,255,0.05)":"rgba(148,41,69,0.08)"), padding:16, display:"flex", flexDirection:"column", gap:12 }}>
              {[["Font","Syne"],["Size","48px"],["Color","Crimson"],["Weight","Bold"]].map(([k,v],i) => (
                <div key={i}>
                  <div style={{ fontSize:9, color:isDark?"rgba(255,255,255,0.25)":"rgba(148,41,69,0.4)", fontFamily:"'Poppins',sans-serif", letterSpacing:"0.06em", marginBottom:3 }}>{k.toUpperCase()}</div>
                  <div style={{ fontSize:11, color:isDark?"rgba(255,255,255,0.6)":"rgba(15,2,8,0.6)", fontFamily:"'Poppins',sans-serif", fontWeight:500, background:isDark?"rgba(255,255,255,0.04)":"rgba(148,41,69,0.05)", borderRadius:6, padding:"4px 8px" }}>{v}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div style={{
      margin: 0, padding: 0, width: "100%",
      background: isDark ? "#0e060b" : "#f7f6fb",
      color: colors.text,
      fontFamily: "'Instrument Sans',sans-serif", overflowX: "clip",
      transition: "background 0.3s, color 0.3s", minHeight: "100vh",
    }}>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Instrument+Sans:wght@300;400;500;600&family=Syne:wght@700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />

      {/* ─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢ CANVA-STYLE VERTICAL SIDEBAR ─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢ */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: sidebarW,
        background: isDark
          ? "rgba(12, 4, 10, 0.88)"
          : "rgba(255, 245, 248, 0.92)",
        borderRight: "1px solid rgba(225, 73, 109, 0.22)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
        zIndex: 200,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "16px 0 12px",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
      }}>
        {/* Avatar at top of sidebar */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0 10px" }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <AvatarCircle size={40} onClick={() => onNavigate("profile")} showBorder />
              <div style={{
                position: "absolute", bottom: -1, right: -1, width: 12, height: 12,
                borderRadius: "50%", background: "#22c55e", border: "2px solid #fff",
              }} />
            </div>
          ) : (
            <button
              onClick={() => onNavigate("auth", "signin")}
              title="Sign in"
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: THEME.grad.primary,
                color: "#fff", fontWeight: 700, fontFamily: "'Poppins',sans-serif",
                cursor: "pointer", border: "none", fontSize: 13,
                boxShadow: THEME.shadow.chip, outline: "none",
              }}
            >U</button>
          )}
        </div>

        <div style={{ 
          width: "70%", 
          height: 1, 
          background: `linear-gradient(90deg, transparent 0%, ${THEME.hexA(THEME.wine, 0.15)} 50%, transparent 100%)`,
          margin: "8px 0 12px",
          transition: "all 0.3s ease"
        }} />

        {/* Nav stack */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", overflowY: "auto", overflowX: "hidden", padding: "4px 0" }}>
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "home"}
            label="Home"
            onClick={() => { setActiveNav("home"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
            icon={Home}
            animationType="bounce"
          />
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "projects" || activeNav === "vault"}
            label="Vault"
            onClick={() => {
              setActiveNav("vault");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            icon={FolderOpen}
            animationType="scale"
          />
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "templates"}
            label="Templates"
            onClick={() => {
              setActiveNav("templates");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            icon={Compass}
            animationType="rotate"
          />
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "brand_kit"}
            label="Brand Kit"
            onClick={() => {
              setActiveNav("brand_kit");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            icon={Palette}
            animationType="scale"
          />
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "pipelines"}
            label="Pipelines"
            onClick={() => {
              setActiveNav("pipelines");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            icon={Zap}
            animationType="bounce"
          />
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "mockup_studio"}
            label="3D Mockups"
            onClick={() => {
              setActiveNav("mockup_studio");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            icon={Box}
            animationType="scale"
          />

          <div style={{ width: "60%", height: 1, background: "rgba(225,73,109,0.15)", margin: "2px 0" }} />

          <SidebarIcon
            THEME={THEME}
            active={activeNav === "tools"}
            label="Tools"
            onClick={() => {
              setActiveNav("home");
              setTimeout(() => {
                const el = document.getElementById("tools-section");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 150);
            }}
            icon={Wrench}
            animationType="rotate"
          />
        </div>
      </aside>

      {/* ────────────────── MAIN CONTENT (full width with sidebar padding) ────────────────── */}
      <main style={{ width: "100%", position: "relative", overflowX: "clip", paddingLeft: `${sidebarW}px` }}>

        {/* Conditional rendering based on activeNav */}
        {(activeNav === "projects" || activeNav === "vault") ? (
          <VaultView
            pastWorks={pastWorks}
            onNavigate={onNavigate}
            onOpenWork={handlePastWorkClick}
            onDeleteWork={handleDeleteProject}
            user={user}
            isDark={isDark}
            THEME={THEME}
            colors={colors}
            setShowStudioPicker={setShowStudioPicker}
            setActiveNav={setActiveNav}
          />
        ) : activeNav === "templates" ? (
          /* ── TEMPLATES MARKETPLACE INLINE VIEW — Keeps sidebar visible ── */
          <div style={{ minHeight: "100vh" }}>
            <TemplatesMarketplace
              onBack={() => { setActiveNav("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onNavigate={onNavigate}
              user={user}
              isEmbedded={true}
              isDark={isDark}
              THEME={THEME}
              colors={colors}
            />
          </div>
        ) : activeNav === "brand_kit" ? (
          /* ── BRAND KIT DESIGN SYSTEM INLINE VIEW — Keeps sidebar visible ── */
          <div style={{ minHeight: "100vh" }}>
            <BrandKit
              onBack={() => { setActiveNav("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onNavigate={onNavigate}
              user={user}
              isEmbedded={true}
            />
          </div>
        ) : activeNav === "pipelines" ? (
          /* ── PIPELINES OVERVIEW & DETAIL PAGE — Keeps sidebar visible ── */
          <div style={{ padding: "48px 48px 80px", minHeight: "100vh", maxWidth: "1440px", margin: "0 auto" }}>
            
            {/* Top Pipelines Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "5px 14px", borderRadius: 99,
                  background: isDark ? "rgba(168, 85, 247, 0.16)" : "rgba(255, 255, 255, 0.9)",
                  border: `1px solid ${isDark ? "rgba(168, 85, 247, 0.35)" : "rgba(148, 41, 69, 0.2)"}`,
                  marginBottom: 12,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 8px #a855f7" }} />
                  <span style={{
                    fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase", color: isDark ? "#c084fc" : "#6b21a8",
                  }}>
                    AUTOMATION PIPELINES • BLUEPRINT ENGINE
                  </span>
                </div>

                <h1 style={{
                  fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 4.5vw, 48px)",
                  fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 8px",
                  color: colors.text,
                }}>
                  Visual Workflow <span style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #ff8da7 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>Pipelines</span><span style={{ color: "#a855f7" }}>.</span>
                </h1>
                <p style={{ margin: 0, fontSize: 15, color: colors.textMuted, fontFamily: "'Instrument Sans', sans-serif", maxWidth: 680 }}>
                  Design, test, and execute multi-agent creative pipelines. Connect text prompts to neural image diffusion, voice synthesis, and multi-track video timeline rendering.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => onNavigate("pipelines")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "linear-gradient(135deg, #a855f7, #e1496d)",
                    border: "none", borderRadius: 12, padding: "12px 24px", cursor: "pointer",
                    color: "#fff", fontSize: 13.5, fontWeight: 700,
                    fontFamily: "Syne, sans-serif", boxShadow: "0 8px 24px rgba(168,85,247,0.35)",
                  }}
                >
                  <Zap size={16} /> Open Blueprint Canvas →
                </button>
              </div>
            </div>

            {/* Pipelines Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16, marginBottom: 36,
            }}>
              {[
                { label: "Active Pipelines", val: "4 Online", color: "#c084fc" },
                { label: "Average Speed", val: "1.4s Run Time", color: "#38bdf8" },
                { label: "Compute Engine", val: "WebGL / GPU Turbo", color: "#22d3a8" },
                { label: "Execution Leak", val: "Zero (100% Client)", color: "#ff8da7" },
              ].map((stat, sIdx) => (
                <div key={sIdx} style={{
                  padding: "16px 20px", borderRadius: 16,
                  background: isDark ? "rgba(22, 9, 18, 0.65)" : "rgba(255, 255, 255, 0.85)",
                  border: `1px solid ${isDark ? "rgba(168,85,247,0.2)" : "rgba(148,41,69,0.12)"}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: stat.color, fontFamily: "Syne, sans-serif" }}>
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Production Blueprint Pipelines Grid */}
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: colors.text, margin: "0 0 20px" }}>
              Production Blueprint Automations
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 24,
            }}>
              {[
                {
                  id: "pipe_1",
                  title: "Prompt ➔ Viral TikTok / Reel Auto-Generator",
                  tag: "Video · Audio · Diffusion",
                  color: "#a855f7",
                  desc: "Generates a 3-scene narrative screenplay from a prompt, synthesizes 4K diffusion keyframes, clones neural voiceover, and renders a ready-to-post MP4 video.",
                  steps: ["Prompt Tokenizer", "Neural LLM Script", "Diffusion 4K", "Voice Synthesizer", "Video Stitcher"],
                },
                {
                  id: "pipe_2",
                  title: "E-Commerce 3D Product Mockup Suite",
                  tag: "Packaging · 3D PBR · Batch",
                  color: "#38bdf8",
                  desc: "Batch-processes raw product photos, strips backgrounds with AI rembg, applies PBR surface reflections, and exports 4K multi-angle packaging renders.",
                  steps: ["Asset Ingest", "Rembg AI", "3D Texture Map", "PBR Shaders", "4K Render"],
                },
                {
                  id: "pipe_3",
                  title: "Vector Brand Identity & Logomark Suite",
                  tag: "Design System · Vector · SVG",
                  color: "#e1496d",
                  desc: "Converts brand keywords and company taglines into scalable SVG emblems, extracts harmonic color palettes, and generates complete brand styleguides.",
                  steps: ["Brand Prompt", "Vector Logo AI", "Palette Extractor", "Styleguide Spec"],
                },
                {
                  id: "pipe_4",
                  title: "AI Podcast to Multi-Clip Video Snippets",
                  tag: "Audio · Waveforms · Captions",
                  color: "#22d3a8",
                  desc: "Extracts key highlights from long-form audio tracks, adds real-time dynamic reactive waveforms, auto-generates captions, and outputs formatted video snippets.",
                  steps: ["Audio File", "Waveform Generator", "Whisper Subtitles", "MP4 Exporter"],
                },
              ].map((pipe) => (
                <div
                  key={pipe.id}
                  style={{
                    borderRadius: 22, overflow: "hidden",
                    background: isDark ? "rgba(22, 9, 18, 0.85)" : "rgba(255, 255, 255, 0.95)",
                    border: `1.5px solid ${isDark ? "rgba(168,85,247,0.22)" : "rgba(148,41,69,0.12)"}`,
                    boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(148,41,69,0.06)",
                    padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.borderColor = pipe.color;
                    e.currentTarget.style.boxShadow = `0 18px 40px ${pipe.color}35`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = isDark ? "rgba(168,85,247,0.22)" : "rgba(148,41,69,0.12)";
                    e.currentTarget.style.boxShadow = isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(148,41,69,0.06)";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{
                        fontSize: 10, padding: "3px 10px", borderRadius: 99,
                        background: `${pipe.color}18`, color: pipe.color, fontWeight: 700,
                        border: `1px solid ${pipe.color}35`, fontFamily: "'Poppins', sans-serif",
                      }}>
                        {pipe.tag}
                      </span>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: pipe.color }} />
                    </div>

                    <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: colors.text, fontFamily: "Syne, sans-serif" }}>
                      {pipe.title}
                    </h3>

                    <p style={{ margin: "0 0 18px", fontSize: 13, color: colors.textMuted, lineHeight: 1.5, fontFamily: "'Instrument Sans', sans-serif" }}>
                      {pipe.desc}
                    </p>

                    {/* Step pills flow */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                      {pipe.steps.map((step, idx) => (
                        <span key={idx} style={{
                          fontSize: 10.5, padding: "3px 8px", borderRadius: 6,
                          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                          color: isDark ? "rgba(255,255,255,0.7)" : "#374151",
                          fontFamily: "monospace",
                        }}>
                          {idx + 1}. {step}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate("pipelines")}
                    style={{
                      width: "100%", padding: "10px 0", borderRadius: 12,
                      background: `linear-gradient(135deg, ${pipe.color}, #942945)`,
                      border: "none", color: "#fff", fontSize: 12.5, fontWeight: 700,
                      fontFamily: "Syne, sans-serif", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <Zap size={14} /> Launch in Blueprint Canvas →
                  </button>
                </div>
              ))}
            </div>

          </div>
        ) : activeNav === "mockup_studio" ? (
          /* ── 3D MOCKUPS OVERVIEW & DETAIL PAGE — Keeps sidebar visible ── */
          <div style={{ padding: "48px 48px 80px", minHeight: "100vh", maxWidth: "1440px", margin: "0 auto" }}>
            
            {/* Top 3D Mockups Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "5px 14px", borderRadius: 99,
                  background: isDark ? "rgba(56, 189, 248, 0.16)" : "rgba(255, 255, 255, 0.9)",
                  border: `1px solid ${isDark ? "rgba(56, 189, 248, 0.35)" : "rgba(148, 41, 69, 0.2)"}`,
                  marginBottom: 12,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                  <span style={{
                    fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase", color: isDark ? "#7dd3fc" : "#0369a1",
                  }}>
                    WEBGL 3D VIEWPORT • THREE.JS STAGES
                  </span>
                </div>

                <h1 style={{
                  fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 4.5vw, 48px)",
                  fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 8px",
                  color: colors.text,
                }}>
                  3D Device & Packaging <span style={{
                    background: "linear-gradient(135deg, #38bdf8 0%, #ff8da7 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>Mockup Studio</span><span style={{ color: "#38bdf8" }}>.</span>
                </h1>
                <p style={{ margin: 0, fontSize: 15, color: colors.textMuted, fontFamily: "'Instrument Sans', sans-serif", maxWidth: 680 }}>
                  Showcase your digital artwork, UI designs, and brand identities mapped in real-time onto photorealistic 3D hardware, apparel, and packaging.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => onNavigate("mockup_studio")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "linear-gradient(135deg, #38bdf8, #942945)",
                    border: "none", borderRadius: 12, padding: "12px 24px", cursor: "pointer",
                    color: "#fff", fontSize: 13.5, fontWeight: 700,
                    fontFamily: "Syne, sans-serif", boxShadow: "0 8px 24px rgba(56,189,248,0.35)",
                  }}
                >
                  <Box size={16} /> Launch 3D WebGL Studio Viewport →
                </button>
              </div>
            </div>

            {/* 3D Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16, marginBottom: 36,
            }}>
              {[
                { label: "Render Engine", val: "Three.js WebGL", color: "#38bdf8" },
                { label: "Lighting Models", val: "PBR & Softbox HDR", color: "#e1496d" },
                { label: "Export Quality", val: "4K PNG + 360° Spin", color: "#22d3a8" },
                { label: "Texture Resolution", val: "Up to 4096px", color: "#ff8da7" },
              ].map((stat, sIdx) => (
                <div key={sIdx} style={{
                  padding: "16px 20px", borderRadius: 16,
                  background: isDark ? "rgba(22, 9, 18, 0.65)" : "rgba(255, 255, 255, 0.85)",
                  border: `1px solid ${isDark ? "rgba(56,189,248,0.2)" : "rgba(148,41,69,0.12)"}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: stat.color, fontFamily: "Syne, sans-serif" }}>
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>

            {/* 3D Stages Showcase Grid */}
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: colors.text, margin: "0 0 20px" }}>
              Available 3D Stage Environments
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}>
              {[
                {
                  id: "stg_iphone",
                  title: "iPhone 16 Pro Stage",
                  category: "Hardware",
                  tag: "Natural Titanium",
                  color: "#e1496d",
                  desc: "Curved aerospace titanium chassis with realistic Dynamic Island, screen texture mapping, and orbital softbox reflections.",
                  specs: ["1080 × 2340 Screen", "PBR Titanium", "Curved Bevels"],
                },
                {
                  id: "stg_macbook",
                  title: "MacBook Pro M3 Stage",
                  category: "Hardware",
                  tag: "Space Black",
                  color: "#38bdf8",
                  desc: "Anodized aluminum unibody with Liquid Retina XDR display, glass specular highlights, and angled hinge rotation.",
                  specs: ["16:10 Liquid Retina", "Space Black", "PBR Aluminum"],
                },
                {
                  id: "stg_can",
                  title: "Aluminum Beverage Can Packaging",
                  category: "Packaging",
                  tag: "PBR Metallic",
                  color: "#ff8da7",
                  desc: "Continuous cylindrical UV texture mapping with metallic reflections, customizable roughness, and rim lighting.",
                  specs: ["Metallic Shaders", "360° Wrap", "Studio Rim Light"],
                },
                {
                  id: "stg_glass",
                  title: "Floating Frosted Glass Slab",
                  category: "Showcase",
                  tag: "Translucent Glass",
                  color: "#22d3a8",
                  desc: "High-refractive physical glass shader with translucent transmission, rainbow dispersion highlights, and floating badge elevation.",
                  specs: ["Transmission Glass", "Refraction 1.5", "Beveled Edges"],
                },
              ].map((stage) => (
                <div
                  key={stage.id}
                  style={{
                    borderRadius: 22, overflow: "hidden",
                    background: isDark ? "rgba(22, 9, 18, 0.85)" : "rgba(255, 255, 255, 0.95)",
                    border: `1.5px solid ${isDark ? "rgba(56,189,248,0.22)" : "rgba(148,41,69,0.12)"}`,
                    boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(148,41,69,0.06)",
                    padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.borderColor = stage.color;
                    e.currentTarget.style.boxShadow = `0 18px 40px ${stage.color}35`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = isDark ? "rgba(56,189,248,0.22)" : "rgba(148,41,69,0.12)";
                    e.currentTarget.style.boxShadow = isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(148,41,69,0.06)";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{
                        fontSize: 10, padding: "3px 10px", borderRadius: 99,
                        background: `${stage.color}18`, color: stage.color, fontWeight: 700,
                        border: `1px solid ${stage.color}35`, fontFamily: "'Poppins', sans-serif",
                      }}>
                        {stage.tag}
                      </span>
                      <Box size={16} color={stage.color} />
                    </div>

                    <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: colors.text, fontFamily: "Syne, sans-serif" }}>
                      {stage.title}
                    </h3>

                    <p style={{ margin: "0 0 18px", fontSize: 13, color: colors.textMuted, lineHeight: 1.5, fontFamily: "'Instrument Sans', sans-serif" }}>
                      {stage.desc}
                    </p>

                    {/* Specs */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                      {stage.specs.map((sp, idx) => (
                        <span key={idx} style={{
                          fontSize: 10.5, padding: "3px 8px", borderRadius: 6,
                          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                          color: isDark ? "rgba(255,255,255,0.7)" : "#374151",
                          fontFamily: "monospace",
                        }}>
                          • {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate("mockup_studio")}
                    style={{
                      width: "100%", padding: "10px 0", borderRadius: 12,
                      background: `linear-gradient(135deg, ${stage.color}, #942945)`,
                      border: "none", color: "#fff", fontSize: 12.5, fontWeight: 700,
                      fontFamily: "Syne, sans-serif", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <Box size={14} /> Customize in 3D Viewport →
                  </button>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <>
        {/* SHOWROOM 3D ROTATING HERO SECTION */}
        <section id="hero-showroom" style={{ position:"relative", padding:0, overflow:"hidden", minHeight: "100vh", width: "100%" }}>
          <ShowroomHero onNavigate={onNavigate} user={user} isDark={isDark} THEME={THEME} />
        </section>

      {/* ── SPACIOUS GAP TRACK BETWEEN HERO AND INFINITE STUDIO ── */}
      <div style={{
        height: "120px",
        width: "100%",
        background: isDark ? "#0e060b" : "#f7f6fb",
      }} />

      {/* ── INFINITE STUDIO DEDICATED STICKY 5-STEP SCROLL MEGA SECTION ── */}
      <div
        ref={infiniteStudioSectionRef}
        id="infinite-studio-section"
        style={{
          position: "relative",
          height: "450vh", // Tall track for 5 scroll stages
          background: isDark
            ? "linear-gradient(180deg, #0e060b 0%, #1a0814 25%, #150610 50%, #1a0814 75%, #0e060b 100%)"
            : "linear-gradient(180deg, #f7f6fb 0%, #fdf2f4 25%, #fae8ee 50%, #fdf2f4 75%, #f7f6fb 100%)",
        }}
      >
        {/* Sticky 100vh Viewport Stage */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            padding: "60px 24px 40px",
            boxSizing: "border-box",
          }}
        >
          {/* Ambient Glow Orb */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "650px",
              height: "450px",
              background: "radial-gradient(circle, rgba(225, 73, 109, 0.2) 0%, rgba(148, 41, 69, 0.06) 50%, transparent 75%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: "960px",
              width: "100%",
              margin: "0 auto",
              position: "relative",
              zIndex: 10,
              textAlign: "center",
            }}
          >
            
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "clamp(32px, 4.5vw, 54px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: colors.text,
                  margin: "0 0 8px",
                }}
              >
                Meet <span style={{
                  background: "linear-gradient(135deg, #e1496d 0%, #ff8da7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Infinite Studio</span><span style={{ color: "#e1496d" }}>.</span>
              </h2>

              <p
                style={{
                  fontSize: "14.5px",
                  color: colors.textMuted,
                  maxWidth: "640px",
                  margin: "0 auto",
                  lineHeight: 1.5,
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                The executable infinite graph canvas. Scroll down or select any feature below to discover all 5 core capabilities.
              </p>
            </div>

            {/* ═══════════════ EXPANDED 2-COLUMN SHOWROOM STAGE ═══════════════ */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "960px",
                height: "420px",
                margin: "0 auto 20px",
              }}
            >
              {infiniteStudioCards.map((f, i) => {
                const IconComp = f.Icon;
                const activeIndex = Math.min(4, Math.max(0, Math.floor(studioScrollProgress * 5)));
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;

                return (
                  <div
                    key={f.num}
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "32px 36px",
                      borderRadius: "28px",
                      background: isDark ? "rgba(22, 8, 17, 0.92)" : "rgba(255, 255, 255, 0.97)",
                      border: `1.5px solid ${isActive ? "rgba(225, 73, 109, 0.55)" : "rgba(225, 73, 109, 0.15)"}`,
                      boxShadow: isActive
                        ? isDark
                          ? "0 28px 70px rgba(0, 0, 0, 0.75), 0 0 50px rgba(225, 73, 109, 0.22)"
                          : "0 24px 60px rgba(148, 41, 69, 0.16), 0 0 35px rgba(225, 73, 109, 0.14)"
                        : "none",
                      backdropFilter: "blur(28px)",
                      transition: "all 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0px) scale(1)"
                        : isPast
                          ? "translateY(-70px) scale(0.94)"
                          : "translateY(70px) scale(0.94)",
                      filter: isActive ? "blur(0px)" : "blur(6px)",
                      pointerEvents: isActive ? "auto" : "none",
                      display: "grid",
                      gridTemplateColumns: "1.1fr 1fr",
                      gap: "28px",
                      alignItems: "center",
                      textAlign: "left",
                    }}
                  >
                    {/* LEFT COLUMN: Feature Info & Detailed Capabilities */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                          <div
                            style={{
                              width: "46px",
                              height: "46px",
                              borderRadius: "14px",
                              background: f.gradient,
                              border: "1px solid rgba(225,73,109,0.35)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <IconComp size={22} color={f.iconColor} />
                          </div>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#ff8da7",
                              background: "rgba(225,73,109,0.15)",
                              padding: "4px 12px",
                              borderRadius: 99,
                              letterSpacing: "0.03em",
                              border: "1px solid rgba(225,73,109,0.28)",
                            }}
                          >
                            {f.tag}
                          </span>
                        </div>

                        <div style={{ fontSize: "11px", fontWeight: 800, color: "#e1496d", letterSpacing: "0.08em", marginBottom: "4px", textTransform: "uppercase" }}>
                          Feature {f.num} of 05
                        </div>

                        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "23px", fontWeight: 800, color: colors.text, marginBottom: "8px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                          {f.title}
                        </h3>

                        <p style={{ fontSize: "13px", color: colors.textMuted, lineHeight: 1.5, fontFamily: "'Instrument Sans', sans-serif", margin: "0 0 14px" }}>
                          {f.desc}
                        </p>

                        {/* Capabilities List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          {f.capabilities.map((cap, capIdx) => (
                            <div key={capIdx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "11.5px", color: isDark ? "rgba(255,255,255,0.85)" : "#374151" }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#e1496d" }} />
                              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!user) return onNavigate("auth", "signup");
                          onNavigate("infinite_studio");
                        }}
                        style={{
                          alignSelf: "flex-start",
                          marginTop: 14,
                          padding: "9px 20px",
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #e1496d, #942945)",
                          border: "none",
                          color: "#fff",
                          fontSize: "12.5px",
                          fontWeight: 700,
                          fontFamily: "Syne, sans-serif",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          transition: "all 0.25s ease",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                      >
                        <span>Open in Studio</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* RIGHT COLUMN: Live Interactive Mockup Visual */}
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "20px",
                        background: isDark ? "rgba(10, 3, 8, 0.7)" : "rgba(245, 235, 240, 0.75)",
                        border: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.15)"}`,
                        padding: "18px",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      {f.demoType === "nodes" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                          {/* Node 1 */}
                          <div style={{ padding: "10px 14px", borderRadius: 10, background: isDark ? "#1e0b17" : "#fff", border: "1px solid rgba(225,73,109,0.35)", width: "65%", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#ff8da7", textTransform: "uppercase" }}>Input Node</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>User Prompt & Assets</div>
                          </div>
                          {/* Node 2 */}
                          <div style={{ padding: "10px 14px", borderRadius: 10, background: isDark ? "#280d1f" : "#fff", border: "1.5px solid #e1496d", width: "70%", alignSelf: "flex-end", boxShadow: "0 6px 20px rgba(225,73,109,0.25)" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#22d3a8", textTransform: "uppercase" }}>✦ Neural Engine</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>Executable React Canvas</div>
                          </div>
                          {/* Node 3 */}
                          <div style={{ padding: "10px 14px", borderRadius: 10, background: isDark ? "#1e0b17" : "#fff", border: "1px solid rgba(225,73,109,0.35)", width: "60%", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>Export Port</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>Clean Production Code</div>
                          </div>
                        </div>
                      )}

                      {f.demoType === "code" && (
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: isDark ? "#e2e8f0" : "#1e293b", display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid rgba(225,73,109,0.2)" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                            <span style={{ fontSize: 10, color: colors.textMuted, marginLeft: 6 }}>LiveComponent.jsx</span>
                          </div>
                          <div><span style={{ color: "#e1496d" }}>export default</span> <span style={{ color: "#38bdf8" }}>function</span> <span style={{ color: "#facc15" }}>Artboard</span>() &#123;</div>
                          <div style={{ paddingLeft: 12 }}><span style={{ color: "#e1496d" }}>return</span> (</div>
                          <div style={{ paddingLeft: 24, color: "#38bdf8" }}>&lt;<span style={{ color: "#ff8da7" }}>div</span> <span style={{ color: "#22d3a8" }}>className</span>=<span style={{ color: "#a855f7" }}>"canvas-node"</span>&gt;</div>
                          <div style={{ paddingLeft: 36, color: "#facc15" }}>&lt;InteractiveDOM /&gt;</div>
                          <div style={{ paddingLeft: 24, color: "#38bdf8" }}>&lt;/<span style={{ color: "#ff8da7" }}>div</span>&gt;</div>
                          <div style={{ paddingLeft: 12 }}>);</div>
                          <div>&#125;</div>
                        </div>
                      )}

                      {f.demoType === "ai" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ padding: "8px 12px", borderRadius: 10, background: isDark ? "rgba(225,73,109,0.18)" : "#fff", border: "1px solid rgba(225,73,109,0.3)", fontSize: 11, color: colors.text, display: "flex", alignItems: "center", gap: 6 }}>
                            <span>✨</span>
                            <span style={{ fontWeight: 600 }}>"Generate 3-tier Pricing Table"</span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div style={{ padding: 10, borderRadius: 10, background: isDark ? "#1b0a14" : "#fff", border: "1px solid rgba(225,73,109,0.25)", textAlign: "center" }}>
                              <div style={{ fontSize: 9, color: "#ff8da7", fontWeight: 700 }}>PRO TIER</div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>$29/mo</div>
                            </div>
                            <div style={{ padding: 10, borderRadius: 10, background: isDark ? "#280d1f" : "#fff", border: "1.5px solid #e1496d", textAlign: "center" }}>
                              <div style={{ fontSize: 9, color: "#22d3a8", fontWeight: 700 }}>ENTERPRISE</div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>$99/mo</div>
                            </div>
                          </div>
                          <div style={{ fontSize: 10, color: "#22d3a8", textAlign: "center", fontWeight: 600 }}>
                            ✓ 18 DOM Nodes Generated with Flexbox Auto-Layout
                          </div>
                        </div>
                      )}

                      {f.demoType === "collab" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {/* Live Canvas Mock with Presence Cursors */}
                          <div style={{
                            padding: "12px", borderRadius: 12,
                            background: isDark ? "#180612" : "#fff",
                            border: "1px solid rgba(16, 185, 129, 0.35)",
                            position: "relative", minHeight: 120,
                            display: "flex", flexDirection: "column", justifyContent: "space-between"
                          }}>
                            {/* Cursor 1: Alex */}
                            <div style={{ position: "absolute", top: 18, left: 24, display: "flex", alignItems: "center", gap: 4 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                              <span style={{ fontSize: 9.5, padding: "2px 6px", borderRadius: 4, background: "#10b981", color: "#fff", fontWeight: 700 }}>
                                Alex (Lead)
                              </span>
                            </div>

                            {/* Cursor 2: Sam */}
                            <div style={{ position: "absolute", bottom: 22, right: 30, display: "flex", alignItems: "center", gap: 4 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                              <span style={{ fontSize: 9.5, padding: "2px 6px", borderRadius: 4, background: "#38bdf8", color: "#000", fontWeight: 700 }}>
                                Sam (Dev)
                              </span>
                            </div>

                            <div style={{ textAlign: "center", padding: "16px 0" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>CRDT Spatial Session #4821</div>
                              <div style={{ fontSize: 9.5, color: colors.textMuted, marginTop: 2 }}>Sub-10ms Latency • 0 Conflicts</div>
                            </div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#10b981", fontWeight: 600 }}>
                            <span>● Live Peer Sync</span>
                            <span>Granular Object Locking Active</span>
                          </div>
                        </div>
                      )}

                      {f.demoType === "export" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase" }}>
                            Universal Export Console
                          </div>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            <div style={{ padding: "6px 10px", borderRadius: 8, background: isDark ? "rgba(245,158,11,0.12)" : "#fff", border: "1px solid rgba(245,158,11,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 10.5, fontWeight: 700, color: colors.text }}>SVG Vector</span>
                              <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>✓ READY</span>
                            </div>
                            <div style={{ padding: "6px 10px", borderRadius: 8, background: isDark ? "rgba(245,158,11,0.12)" : "#fff", border: "1px solid rgba(245,158,11,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 10.5, fontWeight: 700, color: colors.text }}>4K Alpha Video</span>
                              <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>✓ 60FPS</span>
                            </div>
                            <div style={{ padding: "6px 10px", borderRadius: 8, background: isDark ? "rgba(245,158,11,0.12)" : "#fff", border: "1px solid rgba(245,158,11,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 10.5, fontWeight: 700, color: colors.text }}>React JSX</span>
                              <span style={{ fontSize: 9, color: "#38bdf8", fontWeight: 700 }}>✓ TAILWIND</span>
                            </div>
                            <div style={{ padding: "6px 10px", borderRadius: 8, background: isDark ? "rgba(245,158,11,0.12)" : "#fff", border: "1px solid rgba(245,158,11,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 10.5, fontWeight: 700, color: colors.text }}>3D GLTF</span>
                              <span style={{ fontSize: 9, color: "#c084fc", fontWeight: 700 }}>✓ PBR</span>
                            </div>
                          </div>

                          <div style={{ padding: "8px 10px", borderRadius: 8, background: isDark ? "#1b0a14" : "#fff", border: "1px solid rgba(245,158,11,0.2)", display: "flex", justifyContent: "space-between", fontSize: 10, color: colors.textMuted }}>
                            <span>Resolution: 3840 × 2160</span>
                            <span style={{ color: "#f59e0b", fontWeight: 700 }}>Lossless 99.8%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Progress Indicators & Jump Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              {[
                { label: "01 Nodes", idx: 0 },
                { label: "02 Live DOM", idx: 1 },
                { label: "03 AI Engine", idx: 2 },
                { label: "04 Real-Time Sync", idx: 3 },
                { label: "05 Universal Export", idx: 4 },
              ].map((step) => {
                const activeIndex = Math.min(4, Math.max(0, Math.floor(studioScrollProgress * 5)));
                const isStepActive = step.idx === activeIndex;

                return (
                  <button
                    key={step.idx}
                    onClick={() => {
                      const el = infiniteStudioSectionRef.current;
                      if (!el) return;
                      const targetY = el.offsetTop + (el.offsetHeight - window.innerHeight) * (step.idx / 4.5);
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 14px",
                      borderRadius: 99,
                      background: isStepActive ? "linear-gradient(135deg, #e1496d, #942945)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.08)",
                      border: `1px solid ${isStepActive ? "transparent" : isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.15)"}`,
                      color: isStepActive ? "#fff" : isDark ? "rgba(255,255,255,0.6)" : "rgba(148,41,69,0.6)",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                  >
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Hint */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: "11.5px",
                fontFamily: "'Poppins', sans-serif",
                color: isDark ? "rgba(255,255,255,0.45)" : "rgba(148,41,69,0.5)",
                fontWeight: 500,
              }}
            >
              <span>
                {studioScrollProgress >= 0.88 ? "Keep scrolling to explore Tools ↓" : "Scroll down to advance feature ↓"}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ── BENTO GRID TOOLS SECTION ── */}
      <div id="tools">
        <div className="reveal" id="tools-section" style={{
          padding:"100px 48px", maxWidth:"1400px", margin:"0 auto",
          opacity: revealedSections.has("tools-section") ? 1 : 0,
          transform: revealedSections.has("tools-section") ? "translateY(0)" : "translateY(40px)",
          transition:"opacity 0.7s, transform 0.7s"
        }}>
          {/* Section header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"56px", flexWrap:"wrap", gap:"16px" }}>
            <div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,5vw,60px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1, color:colors.text }}>One studio.<br/>All formats<span style={{ color: THEME.wine }}>.</span></h2>
            </div>
            <p style={{ fontSize:"16px", color:colors.textMuted, maxWidth:"440px", lineHeight:1.65, fontWeight:400, fontFamily:"'Instrument Sans',sans-serif" }}>
              From a cinematic edit to a full brand deck — Creatify handles every format your ideas demand.
            </p>
          </div>

          {/* Bento Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gridTemplateRows:"repeat(2, 200px)", gap:"14px" }}>
            {tools.map(tool => {
              const isHovered = hoveredCard === tool.id;
              return (
                <div
                  key={tool.id}
                  onMouseEnter={() => { setHoveredCard(tool.id); }}
                  onMouseLeave={() => { setHoveredCard(null); }}
                  onClick={() => {
                    if (!user) return onNavigate("auth", "signup");
                    if (tool.id === "video") onNavigate("editor");
                    else if (tool.id === "ppt") onNavigate("presentation");
                    else if (tool.id === "image") onNavigate("image_editor");
                    else if (tool.id === "logo") onNavigate("logo_maker");
                    else if (tool.id === "doc") onNavigate("documents");
                    else if (tool.id === "white") onNavigate("whiteboard");
                    else if (tool.id === "studio") onNavigate("infinite_studio");
                    else onNavigate("auth", "signup");
                  }}
                  style={{
                    gridColumn: `span ${tool.colSpan}`,
                    gridRow:    `span ${tool.rowSpan}`,
                    position:"relative", borderRadius:"20px", overflow:"hidden",
                    cursor:"pointer", transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    transform: isHovered ? "translateY(-3px) scale(1.01)" : "none",
                    boxShadow: "0 3px 14px rgba(148,41,69,0.07)",
                    border: `1px solid ${isHovered ? tool.color + "60" : "rgba(148,41,69,0.14)"}`,
                  }}
                >
                  {/* Background: image or gradient */}
                  {tool.image ? (
                    <div style={{ position:"absolute", inset:0 }}>
                      <img src={tool.image} alt={tool.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }} />
                      {/* Dark overlay that lightens on hover */}
                      <div style={{ position:"absolute", inset:0, background: isHovered ? "rgba(0,0,0,0.42)" : "rgba(0,0,0,0.62)", transition:"background 0.4s" }} />
                    </div>
                  ) : (
                    <div style={{ position:"absolute", inset:0, background: cardGradients[tool.id] || `linear-gradient(135deg, ${isDark ? "#111318" : "#fdf8fa"}, ${tool.color}${isDark?"20":"14"})` }}>
                      {/* Subtle pattern for no-image cards */}
                      <div style={{ position:"absolute", inset:0, opacity:0.06, backgroundImage:`radial-gradient(${tool.color} 1px, transparent 1px)`, backgroundSize:"24px 24px" }} />
                    </div>
                  )}

                  {/* Accent glow on hover */}
                  <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 30% 20%, ${tool.color}25, transparent 60%)`, opacity: isHovered ? 1 : 0, transition:"opacity 0.4s", pointerEvents:"none" }} />

                  {/* Content */}
                  <div style={{ position:"relative", zIndex:2, padding:"20px 22px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                    {/* Tag chip */}
                    <div style={{ alignSelf:"flex-start", background:"rgba(255,255,255,0.1)", backdropFilter:"blur(7px)", border:"1px solid rgba(255,255,255,0.16)", borderRadius:"18px", padding:"2px 10px", fontSize:"9px", color:"rgba(255,255,255,0.8)", letterSpacing:"0.04em", marginBottom:"auto", marginTop:"0" }}>
                      {tool.tag}
                    </div>

                    {/* Icon + name + desc */}
                    <div>
                      {/* Interactive micro-animation for logo card (no image) */}
                      {tool.id === "logo" && (
                        <div style={{ marginBottom:"10px" }}>
                          <svg width="36" height="36" viewBox="0 0 100 100" style={{ transform:`rotate(${logoAngle}deg)`, transition:"transform 0.05s linear", display:"block" }}>
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="15,10"/>
                            <polygon points="50,18 78,66 22,66" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinejoin="round"/>
                            <circle cx="50" cy="50" r="8" fill="#ec4899"/>
                          </svg>
                        </div>
                      )}

                      {/* Doc card decoration */}
                      {tool.id === "doc" && (
                        <div style={{ marginBottom:"10px", display:"flex", flexDirection:"column", gap:"3px" }}>
                          <div style={{ width:"46%", height:"4px", background:tool.color, borderRadius:"2px", opacity:0.9 }} />
                          <div style={{ width:"78%", height:"2.5px", background:"rgba(255,255,255,0.2)", borderRadius:"2px" }} />
                          <div style={{ width:"66%", height:"2.5px", background:"rgba(255,255,255,0.14)", borderRadius:"2px" }} />
                        </div>
                      )}

                      {/* Whiteboard card decoration — sticky notes + marker lines */}
                      {tool.id === "white" && (
                        <div style={{ marginBottom:"10px", position:"relative", height:"34px" }}>
                          {/* Soft whiteboard grid bg shape */}
                          <div style={{ position:"absolute", inset:0, borderRadius:"6px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }} />
                          {/* Sticky note pink */}
                          <div style={{ position:"absolute", left:"6px", top:"5px", width:"14px", height:"14px", borderRadius:"2px",
                                        background:"linear-gradient(135deg,#ec4899,#be185d)", transform:"rotate(-6deg)",
                                        boxShadow:"0 2px 6px rgba(190,24,93,0.45)" }} />
                          {/* Sticky note plum */}
                          <div style={{ position:"absolute", left:"24px", top:"8px", width:"12px", height:"12px", borderRadius:"2px",
                                        background:"linear-gradient(135deg,#c084fc,#7e22ce)", transform:"rotate(5deg)",
                                        boxShadow:"0 2px 6px rgba(126,34,206,0.4)" }} />
                          {/* Arrow marker right */}
                          <svg style={{ position:"absolute", right:"6px", top:"12px", width:"30px", height:"14px", color:"#fda4af" }}
                               viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="8" x2="30" y2="8" />
                            <polyline points="24 3 32 8 24 13" />
                          </svg>
                        </div>
                      )}

                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                        <span style={{ fontSize:"18px" }}>{tool.icon}</span>
                        <span style={{ fontFamily:"Syne,sans-serif", fontSize: tool.colSpan >= 2 ? "19px" : "15px", fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>{tool.name}</span>
                      </div>
                      <p style={{ fontSize:"11.5px", color:"rgba(255,255,255,0.72)", lineHeight:1.5, fontWeight:300, margin:0, maxWidth: tool.colSpan >= 2 ? "300px" : "none" }}>
                        {tool.desc}
                      </p>

                      {/* CTA arrow */}
                      <div style={{ marginTop:"10px", display:"flex", alignItems:"center", gap:"6px", fontSize:"11px", color:tool.color, fontFamily:"'Poppins',sans-serif", fontWeight:400, opacity: isHovered ? 1 : 0, transform: isHovered ? "translateX(0)" : "translateX(-6px)", transition:"all 0.3s" }}>
                        <span>Open {tool.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Video playhead overlay */}
                  {tool.id === "video" && isHovered && (
                    <div style={{ position:"absolute", bottom:"76px", left:"22px", right:"22px", zIndex:3 }}>
                      <div style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", borderRadius:"8px", padding:"8px", border:"1px solid rgba(148,41,69,0.3)" }}>
                        <div style={{ fontSize:"7.5px", color:"#22d3a8", fontWeight:700, marginBottom:"5px" }}>— LIVE PLAYBACK</div>
                        <div style={{ position:"relative", height:"5px", background:"rgba(255,255,255,0.1)", borderRadius:"2.5px" }}>
                          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${timelinePlayhead}%`, background:`linear-gradient(90deg, #942945, #e1496d)`, borderRadius:"2.5px", transition:"width 0.05s" }} />
                          <div style={{ position:"absolute", top:"-2.5px", width:"10px", height:"10px", borderRadius:"50%", background:"#ef4444", boxShadow:"0 0 6px #ef4444", transition:"left 0.05s", left:`calc(${timelinePlayhead}% - 5px)` }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* PPT slides overlay */}
                  {tool.id === "ppt" && isHovered && (
                    <div style={{ position:"absolute", top:"18px", right:"18px", zIndex:3, display:"flex", gap:"5px" }}>
                      {[0,1,2].map(idx => {
                        const off = (idx - activeSlide + 3) % 3;
                        return (
                          <div key={idx} style={{ width:"40px", height:"26px", borderRadius:"3px", background:"rgba(255,255,255,0.14)", backdropFilter:"blur(6px)", border:`1.5px solid rgba(255,255,255,${0.6 - off*0.2})`, opacity: 1 - off*0.3, transform:`translateY(${off*-3}px) scale(${1-off*0.06})`, transition:"all 0.4s" }}>
                            <div style={{ width:"38%", height:"2.5px", background:"#7c233c", borderRadius:"1px", margin:"4px 3px 2px" }} />
                            <div style={{ display:"flex", gap:"1.5px", alignItems:"flex-end", padding:"0 3px 3px", height:"10px" }}>
                              {[7,11,5,8].map((h,i) => <div key={i} style={{ flex:1, height:`${h}px`, background:"rgba(124,35,60,0.6)", borderRadius:"1px" }} />)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3D MOCKUPS, TEMPLATES & PIPELINE CORE POWER TRIO SHOWCASE ── */}
      <CorePowerTrioSection onNavigate={onNavigate} isDark={isDark} THEME={THEME} />

      {/* ── DELIGHTFUL PANORAMIC VECTOR CITYSCAPE ART BANNER ── */}
      <CreativeCityscapeArt onNavigate={onNavigate} isDark={isDark} THEME={THEME} />

      {/* ── JOLLY CURVY RIVER LIVE CREATIVE STRIP (UNINTERRUPTED CONTINUOUS FLOW) ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        padding: "32px 0 36px",
        background: isDark
          ? "linear-gradient(180deg, #0e040b 0%, #1c0817 35%, #160613 70%, #0d0309 100%)"
          : "linear-gradient(180deg, #fdf8fa 0%, #fdeff4 35%, #fae6ed 70%, #fdf8fa 100%)",
      }}>
        {/* Top Curvy River Wave SVG Border */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", lineHeight: 0, overflow: "hidden", pointerEvents: "none", zIndex: 4 }}>
          <svg viewBox="0 0 1440 36" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: "30px", display: "block" }}>
            <path
              d="M0,0 C240,32 480,-6 720,20 C960,38 1200,2 1440,18 L1440,0 L0,0 Z"
              fill={isDark ? "#090307" : "#faf5f8"}
            />
            <path
              d="M0,6 C240,36 480,0 720,26 C960,42 1200,8 1440,24"
              stroke="rgba(225, 73, 109, 0.35)"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>
        </div>

        {/* Dynamic Animated Liquid River Current Streams in Background */}
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2, opacity: isDark ? 0.35 : 0.45
        }}>
          <svg viewBox="0 0 2880 120" style={{ width: "200%", height: "100%", animation: "riverStreamSlide 22s linear infinite" }}>
            <path
              d="M0,60 C360,100 720,20 1080,60 C1440,100 1800,20 2160,60 C2520,100 2880,20 3240,60"
              stroke="url(#riverStreamGrad1)"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M0,35 C400,0 800,80 1200,35 C1600,0 2000,80 2400,35 C2800,0 3200,80 3600,35"
              stroke="url(#riverStreamGrad2)"
              strokeWidth="2.5"
              strokeDasharray="12 16"
              fill="none"
            />
            <path
              d="M0,85 C320,110 640,55 960,85 C1280,110 1600,55 1920,85 C2240,110 2560,55 2880,85"
              stroke="url(#riverStreamGrad1)"
              strokeWidth="2"
              strokeDasharray="8 12"
              fill="none"
            />
            <defs>
              <linearGradient id="riverStreamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e1496d" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#e1496d" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="riverStreamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff8da7" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#c084fc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ff8da7" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Ambient Curvy Water Mist Glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", width: "85%", height: "100%",
          background: "radial-gradient(ellipse at center, rgba(225, 73, 109, 0.22) 0%, rgba(56, 189, 248, 0.1) 50%, transparent 80%)",
          filter: "blur(50px)", pointerEvents: "none", zIndex: 1,
        }} />

        {/* Deep Left Mirror River Fade */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 170,
          background: `linear-gradient(90deg, ${isDark ? "#0e040b" : "#fdf8fa"} 35%, transparent)`,
          zIndex: 6, pointerEvents: "none",
        }} />

        {/* Deep Right Mirror River Fade */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 170,
          background: `linear-gradient(270deg, ${isDark ? "#0e040b" : "#fdf8fa"} 35%, transparent)`,
          zIndex: 6, pointerEvents: "none",
        }} />

        {/* Flowing River Badge Train (NEVER STOPS ON HOVER) */}
        <div style={{ display: "flex", overflow: "hidden", width: "100%", position: "relative", zIndex: 5, padding: "16px 0" }}>
          <div
            className="creative-live-ticker"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              whiteSpace: "nowrap",
              animation: "marquee 36s linear infinite",
              willChange: "transform",
              padding: "12px 0",
            }}
          >
            {[...Array(2)].flatMap((_, gi) =>
              [
                { toolId: "editor", label: "4K Multi-Track Video Timeline", tag: "GPU ACCELERATED", icon: Video, color: "#ef4444", live: true },
                { toolId: "pipelines", label: "Visual Workflow Blueprints", tag: "NODE ENGINE", icon: Zap, color: "#38bdf8", live: true },
                { toolId: "mockup_studio", label: "3D WebGL Mockup Studio", tag: "PBR RAYTRACING", icon: Box, color: "#c084fc", live: true },
                { toolId: "image_editor", label: "Layered 32-Bit Image Studio", tag: "LUT PRESETS", icon: ImageIcon, color: "#f59e0b", live: true },
                { toolId: "brand_kit", label: "Procedural Brand Identity", tag: "COLOR PALETTES", icon: Palette, color: "#e1496d", live: true },
                { toolId: "presentation", label: "Interactive Pitch Slide Studio", tag: "AUTO LAYOUT", icon: Presentation, color: "#10b981", live: true },
                { toolId: "whiteboard", label: "Spatial Infinite Whiteboard", tag: "REAL-TIME", icon: PenTool, color: "#a855f7", live: true },
                { toolId: "ai_magic", label: "Neural Prompt-to-DOM Engine", tag: "JSX COMPILER", icon: Sparkles, color: "#ec4899", live: true },
                { toolId: "documents", label: "Rich Markdown Document Publisher", tag: "EXPORT PDF", icon: FileText, color: "#06b6d4", live: true },
                { toolId: "vault", label: "Encrypted Creative Vault", tag: "ZERO LEAK", icon: FolderOpen, color: "#4ade80", live: true },
              ].map((item, idx) => {
                const Icon = item.icon;
                const waveClass = idx % 4 === 0 ? "river-badge-wave1" : idx % 4 === 1 ? "river-badge-wave2" : idx % 4 === 2 ? "river-badge-wave3" : "river-badge-wave4";
                
                return (
                  <div
                    key={`${gi}-${idx}`}
                    className={waveClass}
                    onClick={() => {
                      if (item.toolId === "vault") setActiveNav("vault");
                      else onNavigate(item.toolId);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 18px 9px 12px",
                      borderRadius: 99,
                      background: isDark ? "rgba(30, 10, 23, 0.9)" : "rgba(255, 255, 255, 0.96)",
                      border: `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.32)" : "rgba(225, 73, 109, 0.22)"}`,
                      cursor: "pointer",
                      backdropFilter: "blur(20px)",
                      transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease",
                      boxShadow: isDark
                        ? "0 8px 24px rgba(0,0,0,0.4), 0 0 16px rgba(225, 73, 109, 0.15)"
                        : "0 6px 20px rgba(148,41,69,0.09), 0 0 12px rgba(225, 73, 109, 0.1)",
                      animationDelay: `${(idx % 8) * 0.3}s`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "scale(1.16) translateY(-10px) rotate(3deg)";
                      e.currentTarget.style.background = isDark ? "rgba(48, 14, 36, 0.98)" : "#ffffff";
                      e.currentTarget.style.borderColor = item.color;
                      e.currentTarget.style.boxShadow = `0 16px 36px ${item.color}50, 0 0 24px ${item.color}40`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.background = isDark ? "rgba(30, 10, 23, 0.9)" : "rgba(255, 255, 255, 0.96)";
                      e.currentTarget.style.borderColor = isDark ? "rgba(225, 73, 109, 0.32)" : "rgba(225, 73, 109, 0.22)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 8px 24px rgba(0,0,0,0.4), 0 0 16px rgba(225, 73, 109, 0.15)"
                        : "0 6px 20px rgba(148,41,69,0.09), 0 0 12px rgba(225, 73, 109, 0.1)";
                    }}
                  >
                    {/* Glowing Icon Pip with Playful Hover Spin */}
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${item.color}40, ${item.color}15)`,
                      border: `1.5px solid ${item.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: item.color, flexShrink: 0,
                      boxShadow: `0 0 12px ${item.color}50`,
                      transition: "transform 0.3s ease",
                    }}>
                      <Icon size={14} />
                    </div>

                    {/* Title */}
                    <span style={{
                      fontSize: 13,
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 800,
                      color: colors.text,
                      letterSpacing: "-0.01em",
                    }}>
                      {item.label}
                    </span>

                    {/* Pill Tag */}
                    <span style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      fontFamily: "'Poppins', sans-serif",
                      padding: "2px 9px",
                      borderRadius: 6,
                      background: `${item.color}22`,
                      color: item.color,
                      letterSpacing: "0.06em",
                      border: `1px solid ${item.color}45`,
                    }}>
                      {item.tag}
                    </span>

                    {/* Water Ripple Live Pulse Dot */}
                    <div style={{
                      position: "relative", width: 9, height: 9, marginLeft: 2,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{
                        position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
                        background: "#22c55e", opacity: 0.8,
                        animation: "ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
                      }} />
                      <div style={{
                        width: 5.5, height: 5.5, borderRadius: "50%",
                        background: "#22c55e", boxShadow: "0 0 10px #22c55e",
                      }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Curvy River Wave SVG Border */}
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", lineHeight: 0, overflow: "hidden", pointerEvents: "none", zIndex: 4 }}>
          <svg viewBox="0 0 1440 36" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: "30px", display: "block" }}>
            <path
              d="M0,18 C240,0 480,38 720,14 C960,-8 1200,30 1440,10 L1440,36 L0,36 Z"
              fill={isDark ? "#280a1c" : "#60122e"}
            />
            <path
              d="M0,12 C240,-4 480,32 720,8 C960,-14 1200,24 1440,4"
              stroke="rgba(225, 73, 109, 0.35)"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* ── IT'S TIME TO EXPERIENCE CREATIFY (CONVEX DOME ARCH WITH 3 VALUE CARDS & NATURE HORIZON) ── */}
      <ExperienceCreatifySection onNavigate={onNavigate} user={user} isDark={isDark} THEME={THEME} />

      {/* ── UPGRADED LUXURY CONTACT & FEEDBACK FOOTER SECTION ── */}
      <ContactSection user={user} onNavigate={onNavigate} isDark={isDark} THEME={THEME} />

      {/* ── PANORAMIC DEVELOPER COMMUNITY LANDSCAPE ARTWORK (FREE LIKE A BIRD) ── */}
      <CommunityLandscapeBanner onNavigate={onNavigate} isDark={isDark} />

          </>
        )}
      </main>

      {/* Studio Picker Modal */}
      {showStudioPicker && (
        <StudioPicker
          isDark={isDark}
          onClose={() => setShowStudioPicker(false)}
          onSelect={(toolId) => onNavigate(toolId)}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&family=Poppins:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
        @keyframes slideInFromRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse      { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes ping       { 75%, 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes marquee    { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes riverStreamSlide { from { transform:translateX(0); } to { transform:translateX(-50%); } }

        /* Sinuous 4-tier Serpentine River Wave Animations */
        @keyframes riverWave1 {
          0%, 100% { transform: translateY(-9px) rotate(-2deg); }
          50% { transform: translateY(9px) rotate(2deg); }
        }
        @keyframes riverWave2 {
          0%, 100% { transform: translateY(8px) rotate(2deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes riverWave3 {
          0%, 100% { transform: translateY(-6px) rotate(1.5deg); }
          50% { transform: translateY(7px) rotate(-1.5deg); }
        }
        @keyframes riverWave4 {
          0%, 100% { transform: translateY(7px) rotate(-1.5deg); }
          50% { transform: translateY(-7px) rotate(1.5deg); }
        }

        .river-badge-wave1 { animation: riverWave1 3.4s ease-in-out infinite; }
        .river-badge-wave2 { animation: riverWave2 3.8s ease-in-out infinite; }
        .river-badge-wave3 { animation: riverWave3 4.2s ease-in-out infinite; }
        .river-badge-wave4 { animation: riverWave4 3.6s ease-in-out infinite; }

        @keyframes scrollAnim { 0% { transform:scaleY(0); transform-origin:top; } 50% { transform:scaleY(1); transform-origin:top; } 51% { transform:scaleY(1); transform-origin:bottom; } 100% { transform:scaleY(0); transform-origin:bottom; } }
        @keyframes float1     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
        @keyframes float2     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        @keyframes spin       { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}
