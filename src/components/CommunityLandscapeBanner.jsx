import React, { useState } from "react";
import landscapeImg from "../assets/images/community_landscape.jpg";
import { 
  Box, Cpu, Palette, Presentation, Layout, FileText, 
  Sparkles, ArrowRight, Heart, ExternalLink
} from "lucide-react";

export default function CommunityLandscapeBanner({ onNavigate, isDark }) {
  const [hoveredTool, setHoveredTool] = useState(null);

  const tools = [
    { id: "mockup_studio", name: "3D Mockups", tag: "Ray.so Glass Rigs", icon: Box, color: "#0284c7", top: "52%", left: "15%" },
    { id: "pipelines", name: "Pipelines", tag: "Visual DAG Engine", icon: Cpu, color: "#9333ea", top: "48%", left: "33%" },
    { id: "logo_maker", name: "Logo & Tokens", tag: "TSX & Tailwind", icon: Palette, color: "#e1496d", top: "44%", left: "50%" },
    { id: "presentation", name: "Pitch Studio", tag: "Marp Markdown", icon: Presentation, color: "#d97706", top: "50%", left: "70%" },
    { id: "whiteboard", name: "Whiteboard", tag: "Mermaid.js Nodes", icon: Layout, color: "#16a34a", top: "45%", left: "86%" },
  ];

  return (
    <section style={{
      position: "relative",
      width: "100%",
      margin: "0",
      padding: "0",
      overflow: "hidden",
      boxSizing: "border-box",
      background: isDark ? "#090207" : "#eef8f6",
    }}>
      
      {/* ── TOP SCENIC CURVED ARCH TRANSITION (Deep Panoramic Curve) ── */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100px",
        zIndex: 15,
        pointerEvents: "none",
      }}>
        <svg
          viewBox="0 0 1440 100"
          style={{ width: "100%", height: "100%", display: "block" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,5 Q720,95 0,5 Z"
            fill={isDark ? "#070104" : "#fae6ee"}
          />
        </svg>
      </div>

      {/* ── FULL-BLEED SEAMLESS PANORAMIC ARTWORK WRAPPER ── */}
      <div style={{
        position: "relative",
        width: "100%",
        minHeight: "560px",
        maxHeight: "760px",
        overflow: "hidden",
      }}>

        {/* High-Resolution Landscape Artwork Image - Full Width & Free */}
        <img
          src={landscapeImg}
          alt="Creatify Developer Community Landscape"
          style={{
            width: "100%",
            height: "auto",
            minHeight: "560px",
            maxHeight: "760px",
            objectFit: "cover",
            objectPosition: "center 60%",
            display: "block",
          }}
        />

        {/* Subtle Top Sky Vignette to Blend Seamlessly */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "220px",
          background: "linear-gradient(180deg, rgba(238,248,246,0.85) 0%, rgba(238,248,246,0.3) 60%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* ── CLEAN, AIRY SKY HEADLINE ── */}
        <div style={{
          position: "absolute",
          top: "45px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          width: "92%",
          maxWidth: "760px",
          pointerEvents: "auto",
        }}>

          <h2 style={{
            margin: 0,
            fontSize: "clamp(34px, 4.8vw, 56px)",
            fontWeight: 900,
            fontFamily: "Syne, sans-serif",
            color: "#831843",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            textShadow: "0 2px 20px rgba(255, 255, 255, 0.95), 0 0 10px rgba(255, 255, 255, 0.9)",
          }}>
            Free like a bird.
          </h2>

          <p style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 600,
            color: "#4a1525",
            maxWidth: "560px",
            lineHeight: 1.45,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            textShadow: "0 1px 12px rgba(255, 255, 255, 0.9)",
          }}>
            Build 3D mockups, DAG pipelines, brand kits, pitch decks, and tech RFC specs without subscriptions or watermarks.
          </p>

          <a
            href="https://github.com/SachinYadav2446/Creatify"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 24px",
              borderRadius: 99,
              background: "linear-gradient(135deg, #e1496d, #942945)",
              border: "2px solid #ffffff",
              color: "#ffffff",
              fontSize: "12.5px",
              fontWeight: 800,
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(225, 73, 109, 0.35)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(225, 73, 109, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(225, 73, 109, 0.35)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>100% FREE & OPEN SOURCE</span>
            <ExternalLink size={13} style={{ opacity: 0.8 }} />
          </a>
        </div>

        {/* ── INTERACTIVE FLOATING LANDMARK PINS ALONG THE LANDSCAPE ── */}
        {tools.map((t) => {
          const Icon = t.icon;
          const isHovered = hoveredTool === t.id;
          return (
            <div
              key={t.id}
              onClick={() => onNavigate(t.id)}
              onMouseEnter={() => setHoveredTool(t.id)}
              onMouseLeave={() => setHoveredTool(null)}
              style={{
                position: "absolute",
                top: t.top,
                left: t.left,
                transform: isHovered 
                  ? "translate(-50%, -50%) scale(1.1) translateY(-6px)" 
                  : "translate(-50%, -50%) scale(1)",
                zIndex: 12,
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 99,
                background: isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.94)",
                border: `1.5px solid ${t.color}`,
                boxShadow: isHovered 
                  ? `0 12px 28px ${t.color}60, 0 0 14px ${t.color}40`
                  : "0 4px 14px rgba(0,0,0,0.14)",
                backdropFilter: "blur(10px)",
                whiteSpace: "nowrap",
              }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: t.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}>
                  <Icon size={12} />
                </div>
                <div>
                  <div style={{ fontSize: "11.5px", fontWeight: 800, fontFamily: "Syne, sans-serif", color: "#1a040d" }}>
                    {t.name}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>

    </section>
  );
}
