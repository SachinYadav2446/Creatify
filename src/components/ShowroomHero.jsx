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
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // Smooth rich cosmic mesh background
        background: isDark
          ? "radial-gradient(circle at 50% 30%, #3b0a1d 0%, #1a040d 45%, #080205 100%)"
          : "radial-gradient(circle at 50% 30%, #fce7f3 0%, #f9d2e2 45%, #f1bbd2 100%)",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: "50px 32px 90px",
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

      {/* ── LEFT ASTRONAUT STANDING ON PLANET CRATER ── */}
      <div
        style={{
          position: "absolute",
          bottom: "-15px",
          left: "2%",
          width: "clamp(220px, 22vw, 340px)",
          pointerEvents: "none",
          zIndex: 5,
          animation: "floatAstronautLeft 8s ease-in-out infinite",
        }}
      >
        <svg
          viewBox="0 0 400 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto", filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.5))" }}
        >
          <path
            d="M-50 440 Q 180 370 450 470"
            stroke={isDark ? "rgba(225,73,109,0.55)" : "rgba(148,41,69,0.35)"}
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />

          <g stroke={isDark ? "#fdf2f4" : "#4a0e22"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="160" cy="120" r="42" fill={isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.5)"} />
            <path d="M135 115 Q 160 90 185 115 Q 185 140 160 142 Q 135 140 135 115 Z" fill="rgba(225, 73, 109, 0.35)" stroke="#e1496d" strokeWidth="2.5" />
            
            <path d="M118 115 L 118 135" />
            <path d="M202 115 L 202 135" />
            <path d="M160 78 L 160 62" />
            <circle cx="160" cy="58" r="4" fill="#e1496d" stroke="none" />

            <rect x="105" y="145" width="110" height="155" rx="16" fill="rgba(225,73,109,0.08)" />

            <path d="M130 160 Q 160 170 190 160 L 195 270 Q 160 280 125 270 Z" />
            <rect x="142" y="185" width="36" height="46" rx="6" fill="rgba(225,73,109,0.2)" />
            <circle cx="152" cy="198" r="4" fill="#e1496d" stroke="none" />
            <circle cx="168" cy="198" r="4" fill="#38bdf8" stroke="none" />
            <path d="M148 218 L 172 218" />

            <path d="M125 165 Q 95 210 100 260 L 115 285 Q 125 275 120 255" />
            <circle cx="110" cy="285" r="10" />
            <path d="M195 165 Q 225 210 220 260 L 205 285 Q 195 275 200 255" />
            <circle cx="210" cy="285" r="10" />

            <path d="M135 270 L 128 375 L 105 400 L 140 405 L 152 375 L 155 275" />
            <path d="M165 275 L 168 375 L 180 405 L 215 400 L 192 375 L 185 270" />
          </g>
        </svg>
      </div>

      {/* ── RIGHT FOREGROUND ASTRONAUT WAVING ── */}
      <div
        style={{
          position: "absolute",
          bottom: "-35px",
          right: "1%",
          width: "clamp(280px, 30vw, 460px)",
          pointerEvents: "none",
          zIndex: 5,
          animation: "floatAstronautRight 9s ease-in-out infinite",
        }}
      >
        <svg
          viewBox="0 0 500 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto", filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.5))" }}
        >
          <g stroke={isDark ? "#fdf2f4" : "#4a0e22"} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="270" cy="180" r="75" fill={isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.5)"} />
            <path
              d="M225 170 Q 270 125 315 170 Q 315 215 270 220 Q 225 215 225 170 Z"
              fill="rgba(56, 189, 248, 0.35)"
              stroke="#38bdf8"
              strokeWidth="3.5"
            />
            <path d="M245 155 Q 265 142 290 148" stroke="rgba(255,255,255,0.9)" strokeWidth="3" />

            <path d="M205 240 Q 270 260 335 240 L 375 480 L 165 480 Z" fill={isDark ? "rgba(225,73,109,0.06)" : "rgba(255,255,255,0.4)"} />
            
            <rect x="230" y="280" width="80" height="95" rx="12" fill="rgba(225,73,109,0.18)" stroke={isDark ? "#fdf2f4" : "#4a0e22"} strokeWidth="3" />
            <circle cx="250" cy="310" r="7" fill="#e1496d" stroke="none" />
            <circle cx="270" cy="310" r="7" fill="#38bdf8" stroke="none" />
            <circle cx="290" cy="310" r="7" fill="#10b981" stroke="none" />

            <path d="M335 240 Q 400 230 420 180 L 440 140" />
            <path d="M430 140 Q 450 110 470 130 Q 480 150 460 170 Q 440 170 430 140 Z" fill="rgba(225,73,109,0.2)" />
            <path d="M445 125 L 452 105" />
            <path d="M458 120 L 468 102" />
            <path d="M470 124 L 482 108" />
            <path d="M480 132 L 492 118" />

            <path d="M205 240 Q 140 280 130 360 L 150 400" />
            <circle cx="150" cy="410" r="16" />
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
        {/* Crisp Badge (No Emoji) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 99,
            background: isDark ? "rgba(225, 73, 109, 0.2)" : "rgba(255, 255, 255, 0.85)",
            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.45)" : "rgba(148, 41, 69, 0.25)"}`,
            backdropFilter: "blur(12px)",
            marginBottom: 16,
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 16px rgba(148,41,69,0.08)",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e1496d", boxShadow: "0 0 8px #e1496d" }} />
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isDark ? "#ff8da7" : "#831843",
            }}
          >
            CREATIFY • ALL-IN-ONE STUDIO
          </span>
        </div>

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
    </div>
  );
}
