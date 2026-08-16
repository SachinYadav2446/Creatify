import React, { useState, useEffect } from "react";
import { 
  Box, Cpu, Palette, Presentation, Layout, FileText, 
  Sparkles, ArrowRight, Terminal, Shield, Zap, CheckCircle2,
  Code2, ExternalLink, MessageCircle, Heart, Flame, Compass, Layers
} from "lucide-react";

export default function PanoramicCreativeArt({ onNavigate, isDark }) {
  const [hoveredTool, setHoveredTool] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPulseTick(p => (p + 1) % 100), 50);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    setMousePos({ x, y });
  };

  const showcaseTools = [
    {
      id: "mockup_studio",
      title: "3D Mockup Studio",
      subtitle: "Ray.so Glass & AST AST Syntax Rigs",
      tag: "THREE.JS 4K",
      icon: Box,
      accent: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.4)",
      x: 14,
      y: 52,
    },
    {
      id: "pipelines",
      title: "Workflow Pipelines",
      subtitle: "Visual DAG Engine & CI/CD Export",
      tag: "GITHUB ACTIONS",
      icon: Cpu,
      accent: "#a855f7",
      glow: "rgba(168, 85, 247, 0.4)",
      x: 30,
      y: 68,
    },
    {
      id: "logo_maker",
      title: "Logo Maker & Tokens",
      subtitle: "Procedural Vectors & TSX Components",
      tag: "TAILWIND TOKENS",
      icon: Palette,
      accent: "#e1496d",
      glow: "rgba(225, 73, 109, 0.45)",
      x: 50,
      y: 60,
    },
    {
      id: "presentation",
      title: "Slide & Pitch Studio",
      subtitle: "Code Splits, Benchmarks & Marp",
      tag: "MARP & SLIDEV",
      icon: Presentation,
      accent: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.4)",
      x: 70,
      y: 68,
    },
    {
      id: "whiteboard",
      title: "Arch Whiteboard",
      subtitle: "Kafka, Microservices & Mermaid",
      tag: "MERMAID.JS",
      icon: Layout,
      accent: "#10b981",
      glow: "rgba(16, 185, 129, 0.4)",
      x: 86,
      y: 52,
    },
  ];

  return (
    <section 
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        width: "100%",
        background: "linear-gradient(180deg, #090207 0%, #060105 100%)",
        padding: "60px 20px 40px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── AMBIENT CYBER GLOW ORBS ── */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "20%",
        width: 600,
        height: 400,
        background: "radial-gradient(circle, rgba(225, 73, 109, 0.18) 0%, transparent 70%)",
        filter: "blur(90px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: 100,
        right: "15%",
        width: 500,
        height: 400,
        background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
        filter: "blur(80px)",
        pointerEvents: "none",
      }} />

      {/* ── MAIN PANORAMIC THEATER CARD (Curved Convex Glass Frame) ── */}
      <div style={{
        position: "relative",
        maxWidth: 1440,
        margin: "0 auto",
        borderRadius: "32px",
        overflow: "hidden",
        border: "1px solid rgba(225, 73, 109, 0.35)",
        background: "linear-gradient(180deg, #11050e 0%, #090207 100%)",
        boxShadow: "0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(225, 73, 109, 0.15)",
      }}>

        {/* ── TOP HUD STATUS BAR ── */}
        <div style={{
          padding: "12px 28px",
          background: "rgba(18, 6, 15, 0.85)",
          borderBottom: "1px solid rgba(225, 73, 109, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          zIndex: 20,
          position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            </div>
            <span style={{ color: "#ff8da7", fontWeight: 700 }}>CREATIFY.ENGINE // FREEDOM_HORIZON_V2.4</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ color: "#38bdf8" }}>LATENCY: 2.4MS</span>
            <span style={{ color: "#22c55e" }}>● 100% OPEN SOURCE & FREE</span>
            <span style={{ color: "#e1496d" }}>NO PAYWALLS</span>
          </div>
        </div>

        {/* ── CANVAS ARTWORK PORTAL (580px High-Fidelity Landscape) ── */}
        <div style={{
          position: "relative",
          width: "100%",
          height: 600,
          background: "radial-gradient(ellipse at 50% 90%, #2a081e 0%, #150410 45%, #080106 100%)",
          overflow: "hidden",
        }}>

          {/* 1. Curved Canopy Top Arch */}
          <svg
            viewBox="0 0 1440 90"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 70,
              zIndex: 15,
              pointerEvents: "none",
            }}
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L1440,0 L1440,15 Q720,80 0,15 Z"
              fill="#11050e"
            />
            <path
              d="M0,15 Q720,80 1440,15"
              stroke="rgba(225, 73, 109, 0.4)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* 2. Stars & Constellation Mesh */}
          <svg
            viewBox="0 0 1440 600"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          >
            {/* Constellation Lines */}
            <line x1="200" y1="120" x2="340" y2="180" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="340" y1="180" x2="480" y2="140" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="1000" y1="130" x2="1120" y2="90" stroke="rgba(225,73,109,0.25)" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="1120" y1="90" x2="1280" y2="160" stroke="rgba(225,73,109,0.25)" strokeWidth="1" strokeDasharray="3,3" />

            {/* Glowing Star Nodes */}
            {[
              { cx: 120, cy: 90, r: 2, c: "#fff" },
              { cx: 200, cy: 120, r: 3, c: "#38bdf8" },
              { cx: 340, cy: 180, r: 2.5, c: "#fff" },
              { cx: 480, cy: 140, r: 3, c: "#e1496d" },
              { cx: 620, cy: 80, r: 2, c: "#fff" },
              { cx: 850, cy: 100, r: 2.5, c: "#ff8da7" },
              { cx: 1000, cy: 130, r: 3, c: "#38bdf8" },
              { cx: 1120, cy: 90, r: 2, c: "#fff" },
              { cx: 1280, cy: 160, r: 3, c: "#e1496d" },
              { cx: 1360, cy: 110, r: 2, c: "#fff" },
            ].map((s, idx) => (
              <circle key={idx} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} filter="drop-shadow(0 0 4px #fff)" />
            ))}
          </svg>

          {/* 3. Glowing Horizon Cyber-Sun & Radiant Laser Rays */}
          <div style={{
            position: "absolute",
            bottom: 160,
            left: "50%",
            transform: `translateX(calc(-50% + ${mousePos.x * 0.3}px))`,
            width: 380,
            height: 190,
            borderRadius: "190px 190px 0 0",
            background: "linear-gradient(180deg, #e1496d 0%, #942945 40%, #f59e0b 90%, #facc15 100%)",
            boxShadow: "0 0 120px rgba(225, 73, 109, 0.7), 0 0 200px rgba(245, 158, 11, 0.4)",
            zIndex: 2,
            transition: "transform 0.1s ease-out",
          }}>
            {/* Horizontal Sun Raster Scanlines */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(180deg, transparent 0px, transparent 6px, rgba(14, 3, 10, 0.8) 7px, rgba(14, 3, 10, 0.8) 9px)",
              borderRadius: "190px 190px 0 0",
            }} />
          </div>

          {/* Radiant Diagonal Sunburst Laser Rays */}
          <svg
            viewBox="0 0 1000 500"
            style={{
              position: "absolute",
              bottom: 150,
              left: "50%",
              transform: "translateX(-50%)",
              width: 1100,
              height: 500,
              opacity: 0.45,
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <line x1="500" y1="360" x2="100" y2="50" stroke="#ff8da7" strokeWidth="1.5" strokeDasharray="8,8" />
            <line x1="500" y1="360" x2="280" y2="20" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="8,8" />
            <line x1="500" y1="360" x2="500" y2="0" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10,10" />
            <line x1="500" y1="360" x2="720" y2="20" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="8,8" />
            <line x1="500" y1="360" x2="900" y2="50" stroke="#ff8da7" strokeWidth="1.5" strokeDasharray="8,8" />
          </svg>

          {/* 4. Layered Cyber Mountains & Neon Wireframe Meshes */}
          <svg
            viewBox="0 0 1440 600"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 3,
            }}
            preserveAspectRatio="none"
          >
            {/* Distant Mountain Peaks (Left & Right) */}
            <polygon points="-80,420 160,180 420,420" fill="url(#mountGradDark)" opacity="0.9" />
            <polygon points="110,230 160,180 210,230 180,220 160,225 140,220" fill="#ff8da7" opacity="0.6" />
            <line x1="160" y1="180" x2="280" y2="420" stroke="rgba(225,73,109,0.3)" strokeWidth="1.5" />

            <polygon points="1060,420 1300,160 1520,420" fill="url(#mountGradDark)" opacity="0.9" />
            <polygon points="1250,215 1300,160 1350,215 1320,205 1300,210 1280,205" fill="#38bdf8" opacity="0.6" />
            <line x1="1300" y1="160" x2="1180" y2="420" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" />

            {/* Midground Rolling Cyber Terraces (Deep Plum & Emerald Obsidian) */}
            <path
              d="M-50,440 Q280,290 560,390 Q850,280 1180,380 Q1360,320 1520,440 L1520,600 L-50,600 Z"
              fill="url(#terraceGrad1)"
            />
            <path
              d="M-50,470 Q340,350 720,430 Q1100,340 1520,470 L1520,600 L-50,600 Z"
              fill="url(#terraceGrad2)"
            />

            {/* Sinuous Neon Cyber River (Liquid Fiber-Optic Glow) */}
            <path
              d="M660,430 C620,460 550,470 500,510 C440,560 390,580 340,650 L920,650 C890,570 850,530 800,490 C760,460 720,450 680,430 Z"
              fill="url(#riverNeonGrad)"
              opacity="0.95"
              filter="drop-shadow(0 0 25px rgba(56, 189, 248, 0.6))"
            />

            {/* River Cyber Data Pulses & Grid Stream */}
            <path d="M540,490 Q570,482 600,490" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.8" />
            <path d="M680,515 Q710,507 740,515" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.8" />
            <path d="M600,550 Q640,540 680,550" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" filter="drop-shadow(0 0 8px #38bdf8)" />

            <defs>
              <linearGradient id="mountGradDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#280b20" />
                <stop offset="100%" stopColor="#0f030d" />
              </linearGradient>
              <linearGradient id="terraceGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e0817" />
                <stop offset="50%" stopColor="#140510" />
                <stop offset="100%" stopColor="#0a0208" />
              </linearGradient>
              <linearGradient id="terraceGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2c0d23" />
                <stop offset="100%" stopColor="#10030c" />
              </linearGradient>
              <linearGradient id="riverNeonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#e1496d" />
                <stop offset="100%" stopColor="#942945" />
              </linearGradient>
            </defs>
          </svg>

          {/* 5. Cyber-Pines & Bioluminescent Forests (Left & Right) */}
          <div style={{ position: "absolute", bottom: 60, left: 10, zIndex: 4, display: "flex", gap: -16, pointerEvents: "none" }}>
            {[
              { h: 160, w: 80, col: "#e1496d" },
              { h: 210, w: 100, col: "#942945" },
              { h: 250, w: 120, col: "#1e0818" },
              { h: 190, w: 90, col: "#942945" },
              { h: 150, w: 75, col: "#e1496d" },
            ].map((t, idx) => (
              <svg key={idx} width={t.w} height={t.h} viewBox="0 0 100 220" style={{ marginLeft: idx > 0 ? -32 : 0 }}>
                <rect x="45" y="170" width="10" height="50" fill="#140510" rx="2" />
                <polygon points="50,20 15,75 30,75 10,125 25,125 5,175 95,175 75,125 90,125 70,75 85,75" fill={t.col} />
                <path d="M50,20 L15,75 M50,75 L10,125 M50,125 L5,175" stroke="rgba(255,141,167,0.4)" strokeWidth="2" fill="none" />
                <circle cx="50" cy="20" r="3" fill="#ff8da7" filter="drop-shadow(0 0 6px #ff8da7)" />
              </svg>
            ))}
          </div>

          <div style={{ position: "absolute", bottom: 60, right: 20, zIndex: 4, display: "flex", gap: -14, pointerEvents: "none" }}>
            {[
              { h: 150, w: 75, col: "#38bdf8" },
              { h: 190, w: 95, col: "#0284c7" },
              { h: 230, w: 110, col: "#082f49" },
              { h: 170, w: 85, col: "#0284c7" },
            ].map((t, idx) => (
              <svg key={idx} width={t.w} height={t.h} viewBox="0 0 100 220" style={{ marginLeft: idx > 0 ? -28 : 0 }}>
                <rect x="45" y="170" width="10" height="50" fill="#031726" rx="2" />
                <polygon points="50,20 15,75 30,75 10,125 25,125 5,175 95,175 75,125 90,125 70,75 85,75" fill={t.col} />
                <path d="M50,20 L15,75 M50,75 L10,125 M50,125 L5,175" stroke="rgba(56,189,248,0.4)" strokeWidth="2" fill="none" />
                <circle cx="50" cy="20" r="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
              </svg>
            ))}
          </div>

          {/* 6. Central Cyber Headline & 1-Click Launch Button */}
          <div style={{
            position: "absolute",
            top: 75,
            left: "50%",
            transform: `translateX(calc(-50% + ${mousePos.x * -0.2}px))`,
            textAlign: "center",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            width: "92%",
            maxWidth: 720,
            transition: "transform 0.1s ease-out",
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 14px",
              borderRadius: 99,
              background: "rgba(225, 73, 109, 0.15)",
              border: "1px solid rgba(225, 73, 109, 0.4)",
              color: "#ff8da7",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.08em",
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              boxShadow: "0 0 20px rgba(225, 73, 109, 0.25)",
            }}>
              <Sparkles size={12} />
              <span>THE SOVEREIGN DEVELOPER CREATIVE SUITE</span>
            </div>

            <h2 style={{
              margin: 0,
              fontSize: "clamp(38px, 5.2vw, 64px)",
              fontWeight: 900,
              fontFamily: "Syne, sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              background: "linear-gradient(135deg, #ffffff 30%, #ff8da7 70%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 30px rgba(225,73,109,0.4))",
            }}>
              Free like a bird.
            </h2>

            <p style={{
              margin: 0,
              fontSize: "14.5px",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: 540,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              From 3D terminal mockups and visual DAG pipelines to tech RFC docs and SVG brand marks — build and ship without barriers.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
              <button
                onClick={() => onNavigate("mockup_studio")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 28px",
                  borderRadius: 99,
                  background: "linear-gradient(135deg, #e1496d, #942945)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: "Syne, sans-serif",
                  cursor: "pointer",
                  boxShadow: "0 10px 35px rgba(225, 73, 109, 0.5), 0 0 20px rgba(225, 73, 109, 0.3)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 14px 45px rgba(225, 73, 109, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 35px rgba(225, 73, 109, 0.5)";
                }}
              >
                <span>Launch 3D Studio Free</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => onNavigate("pipelines")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 99,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  fontSize: 12.5,
                  fontWeight: 700,
                  fontFamily: "Syne, sans-serif",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.borderColor = "#38bdf8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <Cpu size={14} color="#38bdf8" />
                <span>Explore Pipelines</span>
              </button>
            </div>
          </div>

          {/* 7. Soaring Cyber Falcon / Mascot (High-End Vector & Particle Trail) */}
          <div
            onClick={() => onNavigate("pipelines")}
            style={{
              position: "absolute",
              top: 140,
              right: "18%",
              zIndex: 12,
              cursor: "pointer",
              transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.4}px)`,
              transition: "transform 0.15s ease-out",
              filter: "drop-shadow(0 15px 30px rgba(56, 189, 248, 0.5))",
            }}
            title="Cyber Falcon Mascot — Click to open Workflow Pipelines!"
          >
            {/* Glowing Embers / Energy Jet Stream */}
            <div style={{
              position: "absolute",
              top: 30,
              right: 110,
              display: "flex",
              gap: 8,
              opacity: 0.9,
              pointerEvents: "none",
            }}>
              <span style={{ color: "#38bdf8", fontSize: 16, animation: "float1 2s ease-in-out infinite" }}>⚡</span>
              <span style={{ color: "#ff8da7", fontSize: 12, animation: "float2 1.5s ease-in-out infinite" }}>✦</span>
              <span style={{ color: "#facc15", fontSize: 10 }}>●</span>
            </div>

            {/* Futuristic Vector Falcon */}
            <svg width="140" height="100" viewBox="0 0 140 100">
              <defs>
                <linearGradient id="birdWingL" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="birdWingR" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e1496d" />
                  <stop offset="100%" stopColor="#942945" />
                </linearGradient>
                <linearGradient id="birdBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Left Cyber Wing (Swept forward) */}
              <path
                d="M55,50 C30,15 5,25 2,42 C12,46 25,52 48,56 Z"
                fill="url(#birdWingL)"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <line x1="15" y1="36" x2="45" y2="52" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />

              {/* Right Cyber Wing */}
              <path
                d="M75,50 C100,15 125,25 128,42 C118,46 105,52 82,56 Z"
                fill="url(#birdWingR)"
                stroke="#ff8da7"
                strokeWidth="1.5"
              />
              <line x1="115" y1="36" x2="85" y2="52" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />

              {/* Aerodynamic Body */}
              <ellipse cx="65" cy="54" rx="22" ry="15" fill="url(#birdBody)" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="65,30 54,48 76,48" fill="#0f172a" stroke="#ff8da7" strokeWidth="1.5" />

              {/* Cyber Visor Eye (Laser Glow) */}
              <path d="M72,42 Q82,40 88,44 L80,47 Z" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
              <circle cx="78" cy="43" r="2" fill="#ffffff" />

              {/* Gold Micro Antenna */}
              <line x1="65" y1="30" x2="62" y2="20" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
              <circle cx="62" cy="19" r="2" fill="#facc15" filter="drop-shadow(0 0 4px #facc15)" />

              {/* Laser Tail Plumes */}
              <polygon points="45,58 25,68 46,62" fill="#e1496d" />
              <polygon points="48,60 28,74 49,64" fill="#38bdf8" />
            </svg>
          </div>

          {/* 8. Interactive Glassmorphic Studio Nodes ("What we bring to the table") */}
          {showcaseTools.map((tool) => {
            const Icon = tool.icon;
            const isHovered = hoveredTool === tool.id;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                style={{
                  position: "absolute",
                  left: `${tool.x}%`,
                  top: `${tool.y}%`,
                  zIndex: 14,
                  cursor: "pointer",
                  transform: isHovered 
                    ? `translate(-50%, -50%) scale(1.1) translateY(-8px)` 
                    : `translate(-50%, -50%) scale(1)`,
                  transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <div style={{
                  padding: "8px 14px",
                  borderRadius: 14,
                  background: isHovered 
                    ? "rgba(26, 8, 22, 0.95)" 
                    : "rgba(16, 5, 14, 0.82)",
                  border: `1.5px solid ${isHovered ? tool.accent : "rgba(225, 73, 109, 0.3)"}`,
                  boxShadow: isHovered 
                    ? `0 12px 30px ${tool.glow}, 0 0 20px ${tool.accent}50` 
                    : "0 8px 24px rgba(0,0,0,0.6)",
                  backdropFilter: "blur(16px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  whiteSpace: "nowrap",
                }}>
                  {/* Icon Badge */}
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, ${tool.accent}, #942945)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    boxShadow: `0 0 12px ${tool.glow}`,
                  }}>
                    <Icon size={14} />
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        fontSize: 12.5,
                        fontWeight: 800,
                        fontFamily: "Syne, sans-serif",
                        color: "#ffffff",
                      }}>
                        {tool.title}
                      </span>
                      <span style={{
                        fontSize: 8.5,
                        padding: "1px 5px",
                        borderRadius: 4,
                        background: `${tool.accent}20`,
                        color: tool.accent,
                        border: `1px solid ${tool.accent}40`,
                        fontWeight: 800,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {tool.tag}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: "rgba(255, 255, 255, 0.55)",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                      {tool.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* ── FOOTER DOCK BAR (Seamless Dark Theme) ── */}
        <div style={{
          background: "rgba(14, 4, 12, 0.95)",
          borderTop: "1px solid rgba(225, 73, 109, 0.2)",
          padding: "18px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          color: "#ffffff",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: "linear-gradient(135deg, #e1496d, #942945)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 900,
            }}>
              C
            </div>
            <span style={{ fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
              Creat<span style={{ color: "#e1496d" }}>ify</span>™
            </span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ opacity: 0.7, fontSize: 12 }}>
              The Sovereign Creative Suite for Engineers & Visionary Builders.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {[
              { id: "mockup_studio", label: "3D Mockups" },
              { id: "pipelines", label: "Pipelines" },
              { id: "brand_kit", label: "Brand Kit" },
              { id: "whiteboard", label: "Whiteboard" },
              { id: "documents", label: "RFC Docs" },
              { id: "templates", label: "Marketplace" },
            ].map(item => (
              <span
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{ cursor: "pointer", transition: "color 0.15s ease" }}
                onMouseEnter={e => e.currentTarget.style.color = "#ff8da7"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
