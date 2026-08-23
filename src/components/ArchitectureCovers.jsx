import React from "react";

// ── 1. HLD System Architecture Cover Component ──
export function HldCover({ isDark = false }) {
  return (
    <div style={{
      width: "100%", height: "100%", minHeight: 180,
      background: isDark ? "#0d040c" : "#fdf6f9",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Soft Ambient Aura */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "220px", height: "120px",
        background: "radial-gradient(circle, rgba(225,73,109,0.22) 0%, transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none"
      }} />

      <svg viewBox="0 0 420 200" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <pattern id="hldGridDots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="1" fill={isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.15)"} />
          </pattern>
          <linearGradient id="hldClientGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="hldGwGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e1496d" />
            <stop offset="100%" stopColor="#942945" />
          </linearGradient>
          <linearGradient id="hldDbGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#hldGridDots)" />

        {/* Connecting Data Orthogonal Wires */}
        <path d="M 85 100 L 140 100" stroke="#e1496d" strokeWidth="2.5" strokeDasharray="4 3" />
        <path d="M 220 100 L 275 60 L 315 60" stroke="#0284c7" strokeWidth="2" fill="none" />
        <path d="M 220 100 L 275 140 L 315 140" stroke="#10b981" strokeWidth="2" fill="none" />
        <path d="M 220 100 L 315 100" stroke="#a855f7" strokeWidth="2" fill="none" />

        {/* Node 1: Client / Web App */}
        <g transform="translate(25, 75)">
          <rect width="60" height="50" rx="10" fill="url(#hldClientGrad)" filter="drop-shadow(0 4px 10px rgba(2,132,199,0.3))" />
          <text x="30" y="24" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="system-ui, sans-serif">CLIENT</text>
          <text x="30" y="38" fill="#bae6fd" fontSize="7" fontWeight="600" textAnchor="middle" fontFamily="monospace">Next.js 15</text>
        </g>

        {/* Node 2: API Gateway / Cloudflare */}
        <g transform="translate(140, 72)">
          <rect width="80" height="56" rx="10" fill="url(#hldGwGrad)" stroke="#ff8da7" strokeWidth="1.5" filter="drop-shadow(0 6px 14px rgba(225,73,109,0.35))" />
          <text x="40" y="24" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">GATEWAY</text>
          <text x="40" y="38" fill="#fecdd3" fontSize="7.5" fontWeight="600" textAnchor="middle" fontFamily="monospace">Nginx / CDN</text>
          <text x="40" y="48" fill="#ffffff" fontSize="6" fontWeight="700" textAnchor="middle" fontFamily="monospace">SSL :443</text>
        </g>

        {/* Node 3: Auth & Identity Microservice */}
        <g transform="translate(315, 38)">
          <rect width="82" height="42" rx="8" fill={isDark ? "#200b2e" : "#ffffff"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="41" y="20" fill={isDark ? "#e9d5ff" : "#6b21a8"} fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="system-ui, sans-serif">AUTH SVC</text>
          <text x="41" y="32" fill="#a855f7" fontSize="7" fontWeight="600" textAnchor="middle" fontFamily="monospace">OAuth2 / JWT</text>
        </g>

        {/* Node 4: Kafka / Event Queue */}
        <g transform="translate(315, 82)">
          <rect width="82" height="38" rx="8" fill={isDark ? "#1f0918" : "#ffffff"} stroke="#e1496d" strokeWidth="1.5" />
          <text x="41" y="18" fill="#e1496d" fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="system-ui, sans-serif">KAFKA STREAM</text>
          <text x="41" y="30" fill={isDark ? "#9ca3af" : "#6b7280"} fontSize="7" fontWeight="600" textAnchor="middle" fontFamily="monospace">Pub / Sub</text>
        </g>

        {/* Node 5: PostgreSQL Database Cluster */}
        <g transform="translate(315, 122)">
          <rect width="82" height="42" rx="8" fill="url(#hldDbGrad)" filter="drop-shadow(0 4px 10px rgba(16,185,129,0.3))" />
          <text x="41" y="20" fill="#ffffff" fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="system-ui, sans-serif">POSTGRES</text>
          <text x="41" y="32" fill="#d1fae5" fontSize="7" fontWeight="600" textAnchor="middle" fontFamily="monospace">Cluster (Sharded)</text>
        </g>
      </svg>
    </div>
  );
}

// ── 2. LLD & UML Class / Sequence Cover Component ──
export function LldCover({ isDark = false }) {
  return (
    <div style={{
      width: "100%", height: "100%", minHeight: 180,
      background: isDark ? "#060912" : "#f0f7ff",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "220px", height: "120px",
        background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none"
      }} />

      <svg viewBox="0 0 420 200" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* UML Class Card 1: IPaymentEngine */}
        <g transform="translate(24, 20)">
          <rect width="168" height="160" rx="8" fill={isDark ? "#0d1526" : "#ffffff"} stroke="#38bdf8" strokeWidth="1.5" />
          <rect width="168" height="28" rx="8" fill="#0284c7" />
          <text x="84" y="14" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="system-ui, sans-serif">«Interface»</text>
          <text x="84" y="24" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">IPaymentEngine</text>

          {/* Properties */}
          <line x1="0" y1="28" x2="168" y2="28" stroke="#38bdf8" strokeWidth="1" />
          <text x="10" y="44" fill={isDark ? "#93c5fd" : "#0369a1"} fontSize="7" fontFamily="monospace">+ apiKey: string</text>
          <text x="10" y="58" fill={isDark ? "#93c5fd" : "#0369a1"} fontSize="7" fontFamily="monospace">+ timeoutMs: number</text>
          <text x="10" y="72" fill={isDark ? "#93c5fd" : "#0369a1"} fontSize="7" fontFamily="monospace">+ isSandbox: boolean</text>

          {/* Methods */}
          <line x1="0" y1="84" x2="168" y2="84" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="1" />
          <text x="10" y="100" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="7" fontWeight="700" fontFamily="monospace">+ charge(token): Promise</text>
          <text x="10" y="116" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="7" fontWeight="700" fontFamily="monospace">+ refund(id): boolean</text>
          <text x="10" y="132" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="7" fontWeight="700" fontFamily="monospace">+ verifyWebhook(): Result</text>
        </g>

        {/* Implementation Arrow */}
        <path d="M 192 100 L 230 100" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
        <polygon points="230,100 220,94 220,106" fill="#38bdf8" />

        {/* UML Class Card 2: StripeEngine */}
        <g transform="translate(230, 28)">
          <rect width="166" height="144" rx="8" fill={isDark ? "#0d1526" : "#ffffff"} stroke="#0284c7" strokeWidth="1.5" />
          <rect width="166" height="26" rx="8" fill="#38bdf8" />
          <text x="83" y="17" fill="#0f172a" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">StripeEngine</text>

          <text x="10" y="44" fill={isDark ? "#bae6fd" : "#0369a1"} fontSize="7" fontFamily="monospace">- client: StripeSDK</text>
          <text x="10" y="58" fill={isDark ? "#bae6fd" : "#0369a1"} fontSize="7" fontFamily="monospace">- webhookSecret: str</text>
          
          <line x1="0" y1="70" x2="166" y2="70" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="1" />
          <text x="10" y="88" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="7" fontWeight="700" fontFamily="monospace">+ charge() &#123; return &#125;</text>
          <text x="10" y="104" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="7" fontWeight="700" fontFamily="monospace">+ createCustomer()</text>
          <text x="10" y="120" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="7" fontWeight="700" fontFamily="monospace">+ handleIdempotency()</text>
        </g>
      </svg>
    </div>
  );
}

// ── 3. Database & ERD Modeler Cover Component ──
export function ErdCover({ isDark = false }) {
  return (
    <div style={{
      width: "100%", height: "100%", minHeight: 180,
      background: isDark ? "#030c08" : "#ecfdf5",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "220px", height: "120px",
        background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none"
      }} />

      <svg viewBox="0 0 420 200" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Table 1: users */}
        <g transform="translate(24, 25)">
          <rect width="168" height="150" rx="8" fill={isDark ? "#071711" : "#ffffff"} stroke="#10b981" strokeWidth="1.5" />
          <rect width="168" height="24" rx="8" fill="#10b981" />
          <text x="84" y="16" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">table: users</text>

          <text x="10" y="42" fill="#10b981" fontSize="7.5" fontWeight="800" fontFamily="monospace">🔑 id (UUID) [PK]</text>
          <text x="10" y="58" fill={isDark ? "#d1fae5" : "#065f46"} fontSize="7" fontFamily="monospace">email (VARCHAR)</text>
          <text x="10" y="74" fill={isDark ? "#d1fae5" : "#065f46"} fontSize="7" fontFamily="monospace">hashed_pw (TEXT)</text>
          <text x="10" y="90" fill={isDark ? "#d1fae5" : "#065f46"} fontSize="7" fontFamily="monospace">created_at (TIMESTAMP)</text>
          <text x="10" y="106" fill={isDark ? "#d1fae5" : "#065f46"} fontSize="7" fontFamily="monospace">tier (ENUM)</text>
          <text x="10" y="124" fill={isDark ? "#6ee7b7" : "#047857"} fontSize="6.5" fontWeight="700" fontFamily="monospace">⚡ INDEX (email)</text>
        </g>

        {/* 1-to-Many Relationship Connector with Crow's Foot */}
        <path d="M 192 70 L 234 70" stroke="#10b981" strokeWidth="2" />
        <circle cx="196" cy="70" r="3" fill="#10b981" />
        <path d="M 228 65 L 234 70 L 228 75" stroke="#10b981" strokeWidth="2" fill="none" />

        {/* Table 2: projects */}
        <g transform="translate(234, 25)">
          <rect width="162" height="150" rx="8" fill={isDark ? "#071711" : "#ffffff"} stroke="#059669" strokeWidth="1.5" />
          <rect width="162" height="24" rx="8" fill="#059669" />
          <text x="81" y="16" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">table: projects</text>

          <text x="10" y="42" fill="#10b981" fontSize="7.5" fontWeight="800" fontFamily="monospace">🔑 id (UUID) [PK]</text>
          <text x="10" y="58" fill="#34d399" fontSize="7" fontWeight="700" fontFamily="monospace">🔗 user_id (UUID) [FK]</text>
          <text x="10" y="74" fill={isDark ? "#d1fae5" : "#065f46"} fontSize="7" fontFamily="monospace">title (VARCHAR)</text>
          <text x="10" y="90" fill={isDark ? "#d1fae5" : "#065f46"} fontSize="7" fontFamily="monospace">schema_json (JSONB)</text>
          <text x="10" y="106" fill={isDark ? "#d1fae5" : "#065f46"} fontSize="7" fontFamily="monospace">version (INT)</text>
          <text x="10" y="124" fill={isDark ? "#6ee7b7" : "#047857"} fontSize="6.5" fontWeight="700" fontFamily="monospace">⚡ GIN (schema_json)</text>
        </g>
      </svg>
    </div>
  );
}

// ── 4. Engineering RFC & Technical Spec Document Cover ──
export function RfcCover({ isDark = false }) {
  return (
    <div style={{
      width: "100%", height: "100%", minHeight: 180,
      background: isDark ? "#12050e" : "#fdf2f8",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "220px", height: "120px",
        background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none"
      }} />

      <svg viewBox="0 0 420 200" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Document Sheet */}
        <g transform="translate(60, 16)">
          <rect width="300" height="168" rx="10" fill={isDark ? "#1a0815" : "#ffffff"} stroke="#ec4899" strokeWidth="1.5" />
          
          {/* Header Title */}
          <text x="20" y="26" fill={isDark ? "#f472b6" : "#be185d"} fontSize="9.5" fontWeight="900" fontFamily="system-ui, sans-serif">RFC-042: Distributed Cache Invalidation</text>
          <text x="20" y="38" fill={isDark ? "#9ca3af" : "#6b7280"} fontSize="7" fontFamily="system-ui, sans-serif">Status: APPROVED • Author: Staff Architect</text>
          <line x1="20" y1="46" x2="280" y2="46" stroke={isDark ? "#2e1226" : "#fbcfe8"} strokeWidth="1" />

          {/* Section 1: Abstract */}
          <text x="20" y="62" fill={isDark ? "#ffffff" : "#1f2937"} fontSize="8" fontWeight="800" fontFamily="system-ui, sans-serif">1. Abstract & Motivation</text>
          <rect x="20" y="68" width="240" height="4" rx="2" fill={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} />
          <rect x="20" y="76" width="190" height="4" rx="2" fill={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} />

          {/* Section 2: Architecture Decision Record (ADR) */}
          <text x="20" y="98" fill={isDark ? "#ffffff" : "#1f2937"} fontSize="8" fontWeight="800" fontFamily="system-ui, sans-serif">2. Proposed Solution (Redis Pub/Sub)</text>
          <rect x="20" y="104" width="260" height="30" rx="6" fill={isDark ? "#10030c" : "#fdf2f8"} stroke="#f472b6" strokeWidth="1" />
          <text x="30" y="116" fill="#ec4899" fontSize="6.5" fontWeight="700" fontFamily="monospace">const channel = redis.createPubSub();</text>
          <text x="30" y="126" fill="#ec4899" fontSize="6.5" fontWeight="700" fontFamily="monospace">await channel.broadcast("cache:purge", key);</text>

          {/* Section 3: Rollout Plan */}
          <text x="20" y="148" fill="#10b981" fontSize="7" fontWeight="800" fontFamily="monospace">✓ SLA: p99 &lt; 2.4ms (99.99% Availability)</text>
        </g>
      </svg>
    </div>
  );
}

// ── 5. System Design Review Presentation Deck Cover ──
export function DeckCover({ isDark = false }) {
  return (
    <div style={{
      width: "100%", height: "100%", minHeight: 180,
      background: isDark ? "#0d0414" : "#f5f3ff",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "220px", height: "120px",
        background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none"
      }} />

      <svg viewBox="0 0 420 200" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Slide 1 Screen */}
        <g transform="translate(50, 20)">
          <rect width="320" height="160" rx="10" fill={isDark ? "#170824" : "#ffffff"} stroke="#a855f7" strokeWidth="1.5" />
          
          <rect width="320" height="26" rx="10" fill="#7e22ce" />
          <text x="160" y="17" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">SYSTEM DESIGN REVIEW: YOUTUBE ARCHITECTURE</text>

          {/* Metric Pillars */}
          <g transform="translate(18, 42)">
            <rect width="86" height="96" rx="8" fill={isDark ? "#220c36" : "#f5f3ff"} stroke="#a855f7" strokeWidth="1" />
            <text x="43" y="24" fill="#a855f7" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">5B</text>
            <text x="43" y="38" fill={isDark ? "#c084fc" : "#6b21a8"} fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">Videos / Day</text>
            <text x="43" y="60" fill={isDark ? "#9ca3af" : "#6b7280"} fontSize="6.5" textAnchor="middle" fontFamily="system-ui, sans-serif">Chunk Transcoder</text>
            <text x="43" y="74" fill={isDark ? "#9ca3af" : "#6b7280"} fontSize="6.5" textAnchor="middle" fontFamily="system-ui, sans-serif">HLS / MPEG-DASH</text>
          </g>

          <g transform="translate(116, 42)">
            <rect width="86" height="96" rx="8" fill={isDark ? "#220c36" : "#f5f3ff"} stroke="#a855f7" strokeWidth="1" />
            <text x="43" y="24" fill="#a855f7" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">500h</text>
            <text x="43" y="38" fill={isDark ? "#c084fc" : "#6b21a8"} fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">Upload / Min</text>
            <text x="43" y="60" fill={isDark ? "#9ca3af" : "#6b7280"} fontSize="6.5" textAnchor="middle" fontFamily="system-ui, sans-serif">Blob S3 Store</text>
            <text x="43" y="74" fill={isDark ? "#9ca3af" : "#6b7280"} fontSize="6.5" textAnchor="middle" fontFamily="system-ui, sans-serif">CDN Cache Layer</text>
          </g>

          <g transform="translate(214, 42)">
            <rect width="86" height="96" rx="8" fill={isDark ? "#220c36" : "#f5f3ff"} stroke="#a855f7" strokeWidth="1" />
            <text x="43" y="24" fill="#a855f7" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">99.99</text>
            <text x="43" y="38" fill={isDark ? "#c084fc" : "#6b21a8"} fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">% SLA Uptime</text>
            <text x="43" y="60" fill={isDark ? "#9ca3af" : "#6b7280"} fontSize="6.5" textAnchor="middle" fontFamily="system-ui, sans-serif">Multi-Region</text>
            <text x="43" y="74" fill={isDark ? "#9ca3af" : "#6b7280"} fontSize="6.5" textAnchor="middle" fontFamily="system-ui, sans-serif">Failover Cluster</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

// ── 6. Distributed Pipelines & Event Flow Cover Component ──
export function PipelineCover({ isDark = false }) {
  return (
    <div style={{
      width: "100%", height: "100%", minHeight: 180,
      background: isDark ? "#140802" : "#fff7ed",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "220px", height: "120px",
        background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none"
      }} />

      <svg viewBox="0 0 420 200" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Nodes & Stream Wire */}
        <path d="M 75 100 C 140 40, 180 160, 240 100 S 310 40, 345 100" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="5 4" />

        {/* Node 1: Kafka Event Source */}
        <g transform="translate(30, 78)">
          <rect width="68" height="44" rx="10" fill="#ea580c" filter="drop-shadow(0 4px 10px rgba(234,88,12,0.3))" />
          <text x="34" y="20" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">KAFKA</text>
          <text x="34" y="32" fill="#ffedd5" fontSize="7" textAnchor="middle" fontFamily="monospace">Pub/Sub</text>
        </g>

        {/* Node 2: Stream Processor */}
        <g transform="translate(175, 75)">
          <rect width="84" height="50" rx="10" fill="#c2410c" stroke="#fed7aa" strokeWidth="1.5" filter="drop-shadow(0 6px 12px rgba(194,65,12,0.35))" />
          <text x="42" y="22" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">FLINK / SPARK</text>
          <text x="42" y="35" fill="#ffedd5" fontSize="7" textAnchor="middle" fontFamily="monospace">Real-time DAG</text>
        </g>

        {/* Node 3: S3 Data Lake Sink */}
        <g transform="translate(320, 78)">
          <rect width="68" height="44" rx="10" fill="#9a3412" filter="drop-shadow(0 4px 10px rgba(154,52,18,0.3))" />
          <text x="34" y="20" fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">S3 LAKE</text>
          <text x="34" y="32" fill="#ffedd5" fontSize="7" textAnchor="middle" fontFamily="monospace">Parquet Sink</text>
        </g>
      </svg>
    </div>
  );
}
