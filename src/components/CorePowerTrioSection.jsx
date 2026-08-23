import React, { useState } from "react";
import { 
  Box, Sparkles, Cpu, Check, ArrowRight, Layers, Eye, Zap, 
  Globe, Download, Star, Share2, Play, ExternalLink, ChevronRight, Database, Server
} from "lucide-react";

export default function CorePowerTrioSection({ onNavigate, isDark = true, THEME }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const colors = {
    bg: isDark
      ? "linear-gradient(180deg, #0a0308 0%, #150512 50%, #0d0309 100%)"
      : "linear-gradient(180deg, #f8f6fb 0%, #fdf2f7 50%, #f8f6fb 100%)",
    cardBg: isDark ? "rgba(24, 8, 20, 0.94)" : "rgba(255, 255, 255, 0.98)",
    cardBorder: isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(225, 73, 109, 0.16)",
    textPrimary: isDark ? "#ffffff" : "#19040e",
    textMuted: isDark ? "rgba(255, 255, 255, 0.68)" : "rgba(25, 4, 14, 0.7)",
  };

  const featureCards = [
    {
      id: "hld",
      tag: "Cloud Topologies",
      tagColor: "#e1496d",
      title: "HLD Architecture Studio",
      tagline: "Microservices & Mesh",
      desc: "Design resilient cloud infrastructure with AWS/GCP nodes, API Gateways, Kafka clusters, Redis caches, and sharded PostgreSQL databases.",
      metric: "< 1.8ms",
      metricLabel: "AST Parse Latency",
      route: "whiteboard",
      actionLabel: "Launch HLD Studio",
      accentColor: "#e1496d",
      gradient: "linear-gradient(135deg, rgba(225,73,109,0.12), rgba(148,41,69,0.04))",
      marginTop: 48,
      pendulumClass: "card-pendulum-1",
      icon: Layers,
      checklist: [
        "AWS, GCP, Azure, K8s & Docker node library",
        "Kafka pub-sub streams & Redis cluster cache links",
        "API Gateway, Nginx reverse proxy & CDN routing",
        "1-Click 4K SVG, PNG & Terraform topology export"
      ],
    },
    {
      id: "erd",
      tag: "Visual Schema Engine",
      tagColor: "#e1496d",
      title: "Database ERD Modeler",
      tagline: "PostgreSQL & Prisma",
      desc: "Model relational database schemas visually with Primary/Foreign keys, Crow's foot 1-N relationships, GIN indexes, and instant SQL DDL export.",
      metric: "100%",
      metricLabel: "Type-Safe SQL & Prisma",
      route: "whiteboard",
      actionLabel: "Launch ERD Studio",
      accentColor: "#e1496d",
      gradient: "linear-gradient(135deg, rgba(225,73,109,0.14), rgba(148,41,69,0.04))",
      isFeatured: true,
      marginTop: 0,
      pendulumClass: "card-pendulum-2",
      icon: Database,
      checklist: [
        "Interactive table columns with [PK], [FK] & ENUMs",
        "Crow's foot 1-1, 1-N, and N-N relationship connectors",
        "Live SQL DDL generation for PostgreSQL & MySQL",
        "Direct export to Prisma schema.prisma and DBML"
      ],
    },
    {
      id: "pipelines",
      tag: "Distributed Event DAG",
      tagColor: "#e1496d",
      title: "Event Pipelines & DAGs",
      tagline: "Kafka & Stream Flow",
      desc: "Connect event producers, Flink stream processors, and cloud data lakes with real-time reactive nodes and payload schema validation.",
      metric: "Real-Time",
      metricLabel: "Event-Driven Wires",
      route: "pipelines",
      actionLabel: "Launch Pipeline Studio",
      accentColor: "#e1496d",
      gradient: "linear-gradient(135deg, rgba(225,73,109,0.12), rgba(148,41,69,0.04))",
      marginTop: 48,
      pendulumClass: "card-pendulum-3",
      icon: Zap,
      checklist: [
        "Visual Kafka producer ➔ consumer streaming wires",
        "ETL data ingestion nodes with payload inspection",
        "Airflow DAG workflows & microservice triggers",
        "Live node latency profiling & message simulation"
      ],
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        background: colors.bg,
        padding: "100px 24px 120px",
        overflow: "hidden",
      }}
    >
      <style>{`
        /* Realistic Physics: Pendulum Sway around the top wall peg */
        @keyframes pendulumSway1 {
          0%   { transform: rotate(0deg) translateY(0px); }
          25%  { transform: rotate(1.6deg) translateY(-2px); }
          50%  { transform: rotate(0deg) translateY(0px); }
          75%  { transform: rotate(-1.4deg) translateY(-1.5px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }
        @keyframes pendulumSway2 {
          0%   { transform: rotate(0deg) translateY(0px); }
          30%  { transform: rotate(-1.7deg) translateY(-2.5px); }
          60%  { transform: rotate(1.5deg) translateY(-1.8px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }
        @keyframes pendulumSway3 {
          0%   { transform: rotate(0deg) translateY(0px); }
          20%  { transform: rotate(1.5deg) translateY(-1.8px); }
          55%  { transform: rotate(-1.8deg) translateY(-2.2px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }

        .card-pendulum-1 {
          animation: pendulumSway1 5.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-origin: 50% -60px;
        }
        .card-pendulum-2 {
          animation: pendulumSway2 6.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite -2.1s;
          transform-origin: 50% -60px;
        }
        .card-pendulum-3 {
          animation: pendulumSway3 5.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite -3.8s;
          transform-origin: 50% -60px;
        }

        /* Stop natural swing and apply responsive elastic tilt when hovered */
        .card-physics-wrapper:hover .card-pendulum-1,
        .card-physics-wrapper:hover .card-pendulum-2,
        .card-physics-wrapper:hover .card-pendulum-3 {
          animation-play-state: paused;
        }
      `}</style>

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: "99px",
              background: isDark ? "rgba(225, 73, 109, 0.14)" : "rgba(255, 255, 255, 0.9)",
              border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.16)"}`,
              marginBottom: 14,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e1496d" }} />
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: isDark ? "#ff8da7" : "#9f1239",
              }}
            >
              The Architecture Power Trio
            </span>
          </div>

          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(26px, 3.5vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.15,
              color: colors.textPrimary,
              margin: "0 0 10px",
            }}
          >
            High-Level, Low-Level &amp; Data Blueprints<span style={{ color: "#e1496d" }}>.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "15px",
              color: colors.textMuted,
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.55,
            }}
          >
            From multi-cloud infrastructure topologies to relational database ERDs and event stream message pipelines.
          </p>
        </div>

        {/* Feature Cards Grid with Physics-Driven Pendulum Sway */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 36,
            alignItems: "start",
            marginTop: 80,
          }}
        >
          {featureCards.map((card) => {
            const isHovered = hoveredCard === card.id;
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="card-physics-wrapper"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: "relative",
                  marginTop: card.marginTop,
                }}
              >
                {/* ── Pendulum Container: Card & Chain physically sway together around the top wall peg ── */}
                <div
                  className={card.pendulumClass}
                  style={{
                    position: "relative",
                    transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isHovered ? "translateY(-10px) scale(1.025) rotate(-0.8deg)" : undefined,
                  }}
                >
                  {/* ── Wall Bolt, Hanging Chain & Heavy Clamp in Theme Wine & Rose Gold ── */}
                  <div
                    style={{
                      position: "absolute",
                      top: -76,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 180,
                      height: 120,
                      zIndex: 30,
                      pointerEvents: "none",
                    }}
                  >
                    <svg viewBox="0 0 180 120" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      <defs>
                        {/* Theme-Matched Wine & Rose-Gold Gradients */}
                        <linearGradient id="themeMountWineDark" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#831843" />
                          <stop offset="35%" stopColor="#500724" />
                          <stop offset="75%" stopColor="#380417" />
                          <stop offset="100%" stopColor="#1a020a" />
                        </linearGradient>
                        <linearGradient id="themeMountRoseGold" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fff1f4" />
                          <stop offset="30%" stopColor="#ff8da7" />
                          <stop offset="70%" stopColor="#e1496d" />
                          <stop offset="100%" stopColor="#942945" />
                        </linearGradient>
                        <linearGradient id="themeMountChain" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffe4e6" />
                          <stop offset="40%" stopColor="#f43f5e" />
                          <stop offset="80%" stopColor="#be123c" />
                          <stop offset="100%" stopColor="#500724" />
                        </linearGradient>
                        <filter id="themeMountShadow" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.45" floodColor="#000000" />
                        </filter>
                      </defs>

                      {/* 1. Theme-Matched Wall Mounting Flange Stud */}
                      <g filter="url(#themeMountShadow)">
                        <circle cx="90" cy="16" r="15" fill="url(#themeMountWineDark)" stroke="#1a020a" strokeWidth="2" />
                        <circle cx="90" cy="16" r="11" fill="url(#themeMountRoseGold)" stroke="#500724" strokeWidth="1.2" />
                        {/* Fastener Hex Screws */}
                        <circle cx="82" cy="10" r="1.5" fill="#fff1f4" />
                        <circle cx="98" cy="10" r="1.5" fill="#fff1f4" />
                        <circle cx="82" cy="22" r="1.5" fill="#fff1f4" />
                        <circle cx="98" cy="22" r="1.5" fill="#fff1f4" />
                        {/* Center Steel Eye-Bolt with Hex Socket */}
                        <circle cx="90" cy="16" r="5.5" fill="#1a020a" stroke="#ff8da7" strokeWidth="1.5" />
                        <polygon points="90,13 92.5,14.5 92.5,17.5 90,19 87.5,17.5 87.5,14.5" fill="#fff1f4" />
                      </g>

                      {/* 2. Theme-Matched Interlocking Metallic Chain Links */}
                      <g filter="url(#themeMountShadow)">
                        {/* Link 1 (Vertical) */}
                        <rect x="86" y="18" width="8" height="15" rx="4" fill="url(#themeMountChain)" stroke="#1a020a" strokeWidth="1.2" />
                        <rect x="88" y="21" width="4" height="9" rx="2" fill="#1a020a" opacity="0.7" />

                        {/* Link 2 (Horizontal flat link) */}
                        <ellipse cx="90" cy="34" rx="7.5" ry="4" fill="url(#themeMountRoseGold)" stroke="#500724" strokeWidth="1.2" />
                        <ellipse cx="90" cy="34" rx="3.5" ry="1.5" fill="#1a020a" opacity="0.7" />

                        {/* Link 3 (Vertical link) */}
                        <rect x="86" y="38" width="8" height="16" rx="4" fill="url(#themeMountChain)" stroke="#1a020a" strokeWidth="1.2" />
                        <rect x="88" y="41" width="4" height="10" rx="2" fill="#1a020a" opacity="0.7" />

                        {/* Link 4 (Horizontal flat link) */}
                        <ellipse cx="90" cy="54" rx="7.5" ry="4" fill="url(#themeMountRoseGold)" stroke="#500724" strokeWidth="1.2" />

                        {/* Top Rigging Eyelet of the Card Clamp */}
                        <circle cx="90" cy="62" r="6" fill="#1a020a" stroke="url(#themeMountRoseGold)" strokeWidth="3" />
                        <circle cx="90" cy="62" r="3.5" fill="#380417" />
                      </g>

                      {/* 3. SOLID THEME-MATCHED MOUNTING CLAMP BRACKET */}
                      <g filter="url(#themeMountShadow)">
                        {/* Heavy Mounting Clamp Body */}
                        <rect x="58" y="66" width="64" height="24" rx="5" fill="url(#themeMountWineDark)" stroke="#1a020a" strokeWidth="2" />
                        
                        {/* Rose Gold Inlaid Plate */}
                        <rect x="62" y="70" width="56" height="14" rx="3" fill="url(#themeMountRoseGold)" stroke="#500724" strokeWidth="1" />
                        
                        {/* Precision Clamping Hex Bolts */}
                        <circle cx="68" cy="77" r="4.5" fill="#1a020a" stroke="#ff8da7" strokeWidth="1.2" />
                        <polygon points="68,74.5 70,75.5 70,78.5 68,79.5 66,78.5 66,75.5" fill="#fff1f4" />

                        <circle cx="112" cy="77" r="4.5" fill="#1a020a" stroke="#ff8da7" strokeWidth="1.2" />
                        <polygon points="112,74.5 114,75.5 114,78.5 112,79.5 110,78.5 110,75.5" fill="#fff1f4" />

                        {/* Center Glowing Crimson Status Rivet */}
                        <circle cx="90" cy="77" r="3" fill="#e1496d" stroke="#ffffff" strokeWidth="1" filter="drop-shadow(0 0 6px #e1496d)" />

                        {/* Lower Jaws clamping onto the Card face */}
                        <path d="M64,88 L116,88 L112,94 L68,94 Z" fill="#1a020a" opacity="0.85" />
                      </g>
                    </svg>
                  </div>

                  {/* ── Main Hanging Card Container with Solid Red Action Buttons ── */}
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 24,
                      background: colors.cardBg,
                      border: `1.5px solid ${isHovered ? card.accentColor : (card.isFeatured ? `${card.accentColor}66` : colors.cardBorder)}`,
                      padding: "48px 28px 28px",
                      boxShadow: isHovered
                        ? `0 28px 60px ${card.accentColor}35, 0 8px 24px rgba(0,0,0,0.15)`
                        : (card.isFeatured
                          ? (isDark ? "0 20px 48px rgba(0,0,0,0.65)" : "0 14px 38px rgba(148,41,69,0.12)")
                          : (isDark ? "0 10px 32px rgba(0,0,0,0.4)" : "0 6px 22px rgba(148,41,69,0.06)")),
                      transition: "box-shadow 0.35s ease, border-color 0.35s ease",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 460,
                    }}
                  >
                    <div>
                      {/* Top Header: Sleek Pill Tag & Category */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "'Instrument Sans', -apple-system, sans-serif",
                          padding: "4px 10px",
                          borderRadius: 99,
                          background: isDark ? "rgba(225, 73, 109, 0.12)" : "rgba(225, 73, 109, 0.08)",
                          color: isDark ? "#ff8da7" : "#9f1239",
                          border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.28)" : "rgba(225, 73, 109, 0.2)"}`,
                        }}>
                          <Icon size={13} strokeWidth={2.2} />
                          <span>{card.tag}</span>
                        </div>

                        <span style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: isDark ? "rgba(255, 255, 255, 0.55)" : "rgba(25, 4, 14, 0.55)",
                          fontFamily: "'Instrument Sans', sans-serif",
                        }}>
                          {card.tagline}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontFamily: "Syne, sans-serif",
                          fontSize: "21px",
                          fontWeight: 800,
                          letterSpacing: "-0.025em",
                          color: colors.textPrimary,
                          margin: "0 0 14px",
                          lineHeight: 1.25,
                        }}
                      >
                        {card.title}
                      </h3>

                      {/* Sleek Glassmorphic Metric Stat Box */}
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: isDark ? "rgba(225, 73, 109, 0.08)" : "rgba(225, 73, 109, 0.04)",
                          border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(225, 73, 109, 0.14)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 16,
                        }}
                      >
                        <span style={{
                          fontSize: 15,
                          fontWeight: 800,
                          fontFamily: "Syne, sans-serif",
                          color: isDark ? "#ff8da7" : "#be123c",
                          letterSpacing: "-0.01em",
                        }}>
                          {card.metric}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: "'Instrument Sans', sans-serif",
                          color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(25, 4, 14, 0.65)",
                        }}>
                          {card.metricLabel}
                        </span>
                      </div>

                      {/* Clean Descriptive Copy */}
                      <p
                        style={{
                          fontFamily: "'Instrument Sans', sans-serif",
                          fontSize: "13.5px",
                          color: colors.textMuted,
                          lineHeight: 1.6,
                          margin: "0 0 20px",
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {card.desc}
                      </p>

                      {/* High-Legibility Spec Checklist */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 26 }}>
                        {card.checklist.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <div
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: isDark ? "rgba(225, 73, 109, 0.18)" : "rgba(225, 73, 109, 0.1)",
                                border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.6)" : "rgba(225, 73, 109, 0.4)"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: isDark ? "#ff8da7" : "#be123c",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              <Check size={9} strokeWidth={3} />
                            </div>
                            <span
                              style={{
                                fontSize: "12.5px",
                                color: isDark ? "rgba(255,255,255,0.85)" : "#334155",
                                fontFamily: "'Instrument Sans', sans-serif",
                                lineHeight: 1.45,
                                fontWeight: 500,
                              }}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bold Vibrant Red / Crimson Action Button on ALL 3 CARDS */}
                    <button
                      onClick={() => onNavigate(card.route)}
                      style={{
                        width: "100%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "13px 24px",
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #e1496d 0%, #be123c 100%)",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        color: "#ffffff",
                        fontFamily: "Syne, sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        boxShadow: "0 6px 22px rgba(225, 73, 109, 0.38), 0 2px 6px rgba(0,0,0,0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #f43f5e 0%, #e1496d 100%)";
                        e.currentTarget.style.boxShadow = "0 8px 28px rgba(225, 73, 109, 0.55), 0 2px 8px rgba(0,0,0,0.2)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #e1496d 0%, #be123c 100%)";
                        e.currentTarget.style.boxShadow = "0 6px 22px rgba(225, 73, 109, 0.38), 0 2px 6px rgba(0,0,0,0.15)";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <span>{card.actionLabel}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
