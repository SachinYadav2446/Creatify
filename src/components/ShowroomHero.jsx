import React, { useState } from "react";

export default function ShowroomHero({ onNavigate, user, isDark, THEME }) {
  const [ideaText, setIdeaText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleIdeas = [
    { label: "4K YouTube Reel", color: "#e1496d" },
    { label: "Minimalist Brand Logo", color: "#38bdf8" },
    { label: "Startup Pitch Deck", color: "#a855f7" },
    { label: "AI Cyberpunk Visual", color: "#10b981" },
    { label: "Media Kit Document", color: "#f59e0b" },
  ];

  const handleGenerate = (e) => {
    e?.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onNavigate(user ? "infinite_studio" : "auth", "signup");
    }, 350);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // Smooth rich cosmic mesh background
        background: isDark
          ? "radial-gradient(circle at 50% 30%, #3b0a1d 0%, #1a0814 45%, #080205 100%)"
          : "radial-gradient(circle at 50% 30%, #fce7f3 0%, #f9d2e2 45%, #f1bbd2 100%)",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: "100px 32px 180px",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes floatAstronautLeft {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-1.5deg); }
        }
        @keyframes floatAstronautRight {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1.5deg); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 0.95; transform: scale(1.3); }
        }
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.12); }
        }
        .unified-prompt-capsule {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 8px 6px 20px;
          border-radius: 99px;
          background: ${isDark ? "rgba(28, 8, 19, 0.85)" : "rgba(255, 255, 255, 0.95)"};
          backdrop-filter: blur(28px);
          border: 1.5px solid ${isDark ? "rgba(225, 73, 109, 0.4)" : "rgba(148, 41, 69, 0.22)"};
          box-shadow: ${isDark ? "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(225, 73, 109, 0.2)" : "0 20px 50px rgba(148, 41, 69, 0.14), 0 0 20px rgba(225,73,109,0.08)"};
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 580px;
          width: 100%;
        }
        .unified-prompt-capsule:hover, .unified-prompt-capsule:focus-within {
          border-color: rgba(225, 73, 109, 0.7);
          transform: translateY(-2px);
          box-shadow: 0 24px 60px rgba(225, 73, 109, 0.35);
        }
        .capsule-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 30px;
          border-radius: 99px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, #e1496d 0%, #b13453 50%, #831843 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
          box-shadow: 0 4px 16px rgba(225, 73, 109, 0.4);
          white-space: nowrap;
        }
        .capsule-submit-btn:hover {
          transform: translateY(-1px) scale(1.03);
          background: linear-gradient(135deg, #f43f5e 0%, #e1496d 50%, #9f1239 100%);
          box-shadow: 0 8px 24px rgba(225, 73, 109, 0.6);
        }
        .chip-suggestion {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 99px;
          background: ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.85)"};
          border: 1px solid ${isDark ? "rgba(225, 73, 109, 0.2)" : "rgba(148, 41, 69, 0.14)"};
          color: ${isDark ? "#fdf2f4" : "#4a0e22"};
          font-family: 'Poppins', sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .chip-suggestion:hover {
          border-color: rgba(225, 73, 109, 0.6);
          background: ${isDark ? "rgba(225, 73, 109, 0.15)" : "rgba(255, 255, 255, 0.98)"};
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── SMOOTH COSMIC NEBULA GLOW MESHES ── */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "25%",
          width: "550px",
          height: "400px",
          background: "radial-gradient(circle, rgba(225, 73, 109, 0.28) 0%, rgba(148, 41, 69, 0.08) 55%, transparent 75%)",
          filter: "blur(70px)",
          animation: "nebulaPulse 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "20%",
          width: "500px",
          height: "350px",
          background: "radial-gradient(circle, rgba(2, 132, 199, 0.22) 0%, rgba(13, 148, 136, 0.06) 55%, transparent 75%)",
          filter: "blur(65px)",
          animation: "nebulaPulse 10s ease-in-out 2s infinite",
          pointerEvents: "none",
        }}
      />

      {/* ── BACKGROUND TWINKLING STARS ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${(i * 17) % 94}%`,
              left: `${(i * 23) % 96}%`,
              width: i % 4 === 0 ? 3 : 2,
              height: i % 4 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#ff8da7" : i % 2 === 0 ? "#38bdf8" : "#ffffff",
              boxShadow: `0 0 6px ${i % 3 === 0 ? "#ff8da7" : "#ffffff"}`,
              animation: `starTwinkle ${2 + (i % 3)}s infinite ease-in-out ${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* ── LEFT ASTRONAUT: THE ASTRO-BUILDER (Detailed Multi-Layer Shaded Vector) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "2%",
          width: "clamp(220px, 22vw, 320px)",
          pointerEvents: "none",
          zIndex: 5,
          animation: "floatAstronautLeft 8s ease-in-out infinite",
        }}
      >
        <svg
          viewBox="0 0 400 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto", filter: "drop-shadow(0 15px 30px rgba(148,41,69,0.25))" }}
        >
          <defs>
            <linearGradient id="heroVisorGradLeft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff8da7" />
              <stop offset="50%" stopColor="#e1496d" />
              <stop offset="100%" stopColor="#942945" />
            </linearGradient>
            <linearGradient id="heroSuitGradLeft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#fdf2f7" />
              <stop offset="100%" stopColor="#f8d3e2" />
            </linearGradient>
            <linearGradient id="heroPackGradLeft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>

          {/* Curved Celestial Crater Horizon */}
          <path
            d="M-40 440 Q 180 390 440 460"
            stroke={isDark ? "rgba(225,73,109,0.6)" : "rgba(148,41,69,0.35)"}
            strokeWidth="3"
            strokeDasharray="6 5"
          />
          <circle cx="90" cy="428" r="14" stroke={isDark ? "rgba(225,73,109,0.4)" : "rgba(148,41,69,0.25)"} strokeWidth="2" strokeDasharray="3 3" fill="none" />
          <circle cx="280" cy="432" r="18" stroke={isDark ? "rgba(225,73,109,0.4)" : "rgba(148,41,69,0.25)"} strokeWidth="2" strokeDasharray="4 3" fill="none" />

          {/* Jetpack Thruster Plumes */}
          <ellipse cx="115" cy="310" rx="8" ry="24" fill="#38bdf8" opacity="0.6" filter="drop-shadow(0 0 10px #38bdf8)" />
          <ellipse cx="115" cy="315" rx="4" ry="16" fill="#ffffff" />

          {/* Jetpack Body */}
          <rect x="98" y="180" width="34" height="110" rx="12" fill="url(#heroPackGradLeft)" stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="3" />
          <circle cx="115" cy="205" r="5" fill="#38bdf8" />
          <circle cx="115" cy="225" r="5" fill="#facc15" />

          {/* Main Space Suit Body */}
          <g stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {/* Legs & Boots */}
            <path d="M142 300 L136 385 L115 410 L152 414 L162 385 L164 300" fill="url(#heroSuitGradLeft)" />
            <path d="M176 300 L178 385 L188 414 L225 410 L204 385 L198 300" fill="url(#heroSuitGradLeft)" />
            
            {/* Knee Armor Pads */}
            <rect x="130" y="340" width="28" height="18" rx="6" fill="#e1496d" />
            <rect x="180" y="340" width="28" height="18" rx="6" fill="#e1496d" />

            {/* Torso & Suit */}
            <path d="M125 170 Q 170 160 215 170 L 222 300 Q 170 310 118 300 Z" fill="url(#heroSuitGradLeft)" />

            {/* Tech Chest Rig with LED & Screen */}
            <rect x="144" y="195" width="52" height="64" rx="10" fill={isDark ? "#1f0918" : "#ffffff"} stroke="#e1496d" strokeWidth="2.5" />
            <rect x="152" y="205" width="36" height="22" rx="4" fill="#0d1117" stroke="none" />
            {/* Screen Waveform */}
            <path d="M156 216 L162 210 L168 222 L174 212 L182 216" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="155" cy="242" r="3.5" fill="#22c55e" stroke="none" />
            <circle cx="170" cy="242" r="3.5" fill="#38bdf8" stroke="none" />
            <circle cx="185" cy="242" r="3.5" fill="#f43f5e" stroke="none" />

            {/* Left Arm & Glove (Holding Digital Stylus) */}
            <path d="M125 180 Q 85 220 95 270 L 115 295" fill="url(#heroSuitGradLeft)" />
            <circle cx="112" cy="295" r="12" fill="#e1496d" />
            
            {/* Glowing Stylus Tool */}
            <line x1="105" y1="280" x2="90" y2="330" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
            <circle cx="89" cy="334" r="5" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)" />

            {/* Right Arm & Glove */}
            <path d="M215 180 Q 245 220 235 270 L 220 295" fill="url(#heroSuitGradLeft)" />
            <circle cx="220" cy="295" r="12" fill="#e1496d" />

            {/* Helmet Bubble */}
            <circle cx="170" cy="115" r="50" fill="url(#heroSuitGradLeft)" />
            <circle cx="170" cy="115" r="44" fill={isDark ? "#140510" : "#ffffff"} />
            
            {/* Iridescent Visor with Sheen */}
            <ellipse cx="170" cy="118" rx="34" ry="26" fill="url(#heroVisorGradLeft)" />
            <path d="M150 102 Q 170 92 190 98" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.8" />
            <circle cx="192" cy="115" r="2.5" fill="#ffffff" opacity="0.9" />

            {/* Antenna & Beacon */}
            <line x1="170" y1="65" x2="170" y2="45" stroke="#e1496d" strokeWidth="3" />
            <circle cx="170" cy="40" r="6" fill="#facc15" stroke="#e1496d" strokeWidth="2" filter="drop-shadow(0 0 6px #facc15)" />

            {/* Ear Comms Modules */}
            <rect x="116" y="105" width="10" height="20" rx="4" fill="#e1496d" />
            <rect x="214" y="105" width="10" height="20" rx="4" fill="#e1496d" />
          </g>
        </svg>
      </div>

      {/* ── RIGHT ASTRONAUT: THE CYBER-NAVIGATOR (Detailed Multi-Layer Shaded Vector) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          right: "1%",
          width: "clamp(260px, 28vw, 420px)",
          pointerEvents: "none",
          zIndex: 5,
          animation: "floatAstronautRight 9s ease-in-out infinite",
        }}
      >
        <svg
          viewBox="0 0 500 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto", filter: "drop-shadow(0 18px 36px rgba(148,41,69,0.25))" }}
        >
          <defs>
            <linearGradient id="heroVisorGradRight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="heroSuitGradRight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fdf2f7" />
              <stop offset="100%" stopColor="#f8d3e2" />
            </linearGradient>
          </defs>

          {/* Floating Companion Drone Satellite */}
          <g transform="translate(390, 80)">
            <ellipse cx="20" cy="20" rx="16" ry="12" fill="#ffffff" stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="2.5" />
            <circle cx="20" cy="20" r="6" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
            <line x1="20" y1="8" x2="20" y2="0" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="20" cy="-2" r="3" fill="#22c55e" />
            <line x1="4" y1="20" x2="-8" y2="20" stroke="#942945" strokeWidth="2.5" />
            <rect x="-18" y="14" width="10" height="12" rx="2" fill="#38bdf8" />
            <line x1="36" y1="20" x2="48" y2="20" stroke="#942945" strokeWidth="2.5" />
            <rect x="48" y="14" width="10" height="12" rx="2" fill="#38bdf8" />
          </g>

          <g stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Suit Torso & Lower Body */}
            <path d="M210 240 Q 280 260 350 240 L 390 480 L 170 480 Z" fill="url(#heroSuitGradRight)" />
            
            {/* Space Utility Belt */}
            <rect x="195" y="420" width="170" height="24" rx="8" fill="#e1496d" />
            <rect x="260" y="415" width="40" height="34" rx="8" fill="#ffffff" />
            <circle cx="280" cy="432" r="6" fill="#38bdf8" />

            {/* High-Tech Chest Control Console */}
            <rect x="235" y="280" width="90" height="105" rx="14" fill={isDark ? "#1f0918" : "#ffffff"} stroke="#e1496d" strokeWidth="3" />
            
            {/* Status Radar Module */}
            <circle cx="280" cy="320" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="280" cy="320" r="14" stroke="rgba(56,189,248,0.4)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            <line x1="280" y1="320" x2="292" y2="310" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            
            {/* Control Buttons */}
            <circle cx="250" cy="362" r="5" fill="#e1496d" stroke="none" />
            <circle cx="270" cy="362" r="5" fill="#38bdf8" stroke="none" />
            <circle cx="290" cy="362" r="5" fill="#facc15" stroke="none" />
            <circle cx="310" cy="362" r="5" fill="#22c55e" stroke="none" />

            {/* Left Arm (Relaxed with Telemetry Wristband) */}
            <path d="M210 240 Q 140 280 130 360 L 150 400" fill="url(#heroSuitGradRight)" />
            <circle cx="150" cy="410" r="18" fill="#e1496d" />
            <rect x="136" y="375" width="28" height="14" rx="4" fill="#38bdf8" />

            {/* Right Arm (Waving Cheerfully) */}
            <path d="M350 240 Q 420 220 440 170 L 460 130" fill="url(#heroSuitGradRight)" />
            
            {/* Waving High-Five Space Glove with Detailed Joint Creases */}
            <path
              d="M450 130 Q 480 95 500 120 Q 510 145 485 165 Q 460 165 450 130 Z"
              fill="#e1496d"
            />
            <path d="M465 110 L 472 85" stroke="#ffffff" strokeWidth="3" />
            <path d="M480 105 L 490 82" stroke="#ffffff" strokeWidth="3" />
            <path d="M494 110 L 506 90" stroke="#ffffff" strokeWidth="3" />
            <path d="M504 122 L 518 105" stroke="#ffffff" strokeWidth="3" />

            {/* Large Spherical Helmet */}
            <circle cx="280" cy="165" r="82" fill="url(#heroSuitGradRight)" />
            <circle cx="280" cy="165" r="74" fill={isDark ? "#140510" : "#ffffff"} />

            {/* Iridescent Cyan-Blue Visor with Starlight Reflection */}
            <ellipse cx="280" cy="168" rx="58" ry="46" fill="url(#heroVisorGradRight)" />
            <path d="M245 142 Q 280 125 315 135" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
            <circle cx="318" cy="165" r="4" fill="#ffffff" opacity="0.9" />

            {/* Golden Comms Antenna */}
            <line x1="280" y1="83" x2="280" y2="55" stroke="#e1496d" strokeWidth="3.5" />
            <circle cx="280" cy="50" r="7" fill="#38bdf8" stroke="#e1496d" strokeWidth="2" filter="drop-shadow(0 0 8px #38bdf8)" />

            {/* Ear Modules */}
            <rect x="194" y="150" width="14" height="30" rx="6" fill="#e1496d" />
            <rect x="352" y="150" width="14" height="30" rx="6" fill="#e1496d" />
          </g>
        </svg>
      </div>

      {/* ── CRISP & SMALL PUNCHY CENTER HEADLINE ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 820,
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Small, Crisp, Punchy Headline with Refined 3D Shadow */}
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(30px, 4.2vw, 54px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: isDark ? "#ffffff" : "#1a040d",
            margin: "0 0 12px",
            textShadow: isDark
              ? "0 4px 0 rgba(0, 0, 0, 0.4), 0 10px 24px rgba(0, 0, 0, 0.6)"
              : "0 3px 0 rgba(148, 41, 69, 0.15), 0 8px 20px rgba(148, 41, 69, 0.12)",
          }}
        >
          Turn Any Idea Into Stunning Design.
        </h1>

        {/* Punchy Callout */}
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(26px, 3.6vw, 48px)",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: isDark ? "#ff8da7" : "#9f1239",
            margin: "0 0 14px",
            textShadow: isDark
              ? "0 4px 0 rgba(0, 0, 0, 0.35), 0 10px 25px rgba(225, 73, 109, 0.3)"
              : "0 2px 0 rgba(148, 41, 69, 0.2)",
          }}
        >
          JUST TYPE AN IDEA!
        </h2>

        {/* Crisp Subtitle */}
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(15px, 1.5vw, 19px)",
            fontWeight: 500,
            color: isDark ? "rgba(253, 242, 244, 0.85)" : "rgba(35, 8, 18, 0.8)",
            margin: "0 0 28px",
            maxWidth: 580,
          }}
        >
          Instant 4K Videos, Vector Logos, Slide Decks &amp; Graphics generated in seconds.
        </p>

        {/* ── UNIFIED MODERN PROMPT & GENERATE CAPSULE (NO EMOJIS) ── */}
        <form
          onSubmit={handleGenerate}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            width: "100%",
          }}
        >
          <div className="unified-prompt-capsule">
            {/* Search / Spark SVG Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#ff8da7" : "#e1496d"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.85 }}>
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>

            <input
              type="text"
              className="hero-transparent-input"
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="Type any prompt or design concept..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                boxShadow: "none",
                fontFamily: "Syne, sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: isDark ? "#ffffff" : "#1a040d",
                letterSpacing: "0.01em",
                padding: "8px 0",
              }}
            />

            {/* Seamless Integrated Generate Button (No Arrows) */}
            <button type="submit" className="capsule-submit-btn">
              <span>{isGenerating ? "GENERATING..." : "GENERATE"}</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Click Chips (Clean Micro-Dots, No Emojis) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 22,
            flexWrap: "wrap",
          }}
        >
          {sampleIdeas.map((idea) => (
            <button
              key={idea.label}
              onClick={() => setIdeaText(idea.label)}
              className="chip-suggestion"
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: idea.color, display: "inline-block" }} />
              <span>{idea.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Seamless curved horizon transition into the next section */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, overflow: "hidden", lineHeight: 0, pointerEvents: "none", zIndex: 6 }}>
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "85px", display: "block" }}
        >
          <path
            d="M0,35 Q720,120 1440,35 L1440,120 L0,120 Z"
            fill={isDark ? "#0e060b" : "#f7f6fb"}
          />
        </svg>
      </div>
    </div>
  );
}
