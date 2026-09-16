import React, { useState, useMemo } from "react";
import {
  FileText, Code2, ShieldAlert, Cpu, Database, Server,
  ArrowRight, Check, Copy, Download, Upload, RefreshCw, Layers,
  ExternalLink, CheckCircle2, AlertTriangle, Play, Zap, FileCode,
  Network, GitBranch, Terminal, HelpCircle, Eye, FileArchive, ShieldCheck,
  ChevronRight, ArrowUpRight, Sparkles, Activity
} from "lucide-react";

// Preloaded Reference Sandboxes
const DEMO_SANDBOXES = {
  prd_uber: {
    id: "prd_uber",
    title: "Uber / Lyft Real-Time Dispatch",
    category: "PRD to Architecture",
    type: "PRD",
    badge: "120k QPS",
    tag: "High-Write Geo Telemetry",
    color: "#10b981",
    docName: "Uber_Dispatch_PRD_v2.4.md",
    docSize: "48 KB · 1,840 words",
    hld: {
      nodes: [
        { id: "client", name: "Rider & Driver Apps", role: "Client Edge", tech: "iOS / Android WebSocket", latency: "< 35ms", status: "Active" },
        { id: "gateway", name: "Geo WebSocket Gateway", role: "Edge Proxy", tech: "Envoy (gRPC / WSS)", latency: "4ms", status: "Active" },
        { id: "dispatch_svc", name: "Dispatch & Match Core", role: "Compute Engine", tech: "Go Spatial Indexer", latency: "18ms", status: "Active" },
        { id: "geo_cache", name: "H3 Hex Spatial Cache", role: "In-Memory Store", tech: "Redis Cluster (Geospatial)", latency: "< 1ms", status: "Active" },
        { id: "event_bus", name: "Trip Lifecycle Stream", role: "Message Bus", tech: "Apache Kafka (3x Multi-AZ)", latency: "2ms", status: "Active" },
        { id: "trip_db", name: "Trips & Ledger Database", role: "Persistent Store", tech: "PostgreSQL 16 + Citus", latency: "8ms", status: "Active" }
      ],
      connections: [
        { from: "Rider & Driver Apps", to: "Geo WebSocket Gateway", protocol: "WSS (Dual Channel)", throughput: "120,000 pings/sec" },
        { from: "Geo WebSocket Gateway", to: "Dispatch & Match Core", protocol: "gRPC Streaming", throughput: "Bidirectional" },
        { from: "Dispatch & Match Core", to: "H3 Hex Spatial Cache", protocol: "RESP / Sub-millisecond", throughput: "99.9% Hit Ratio" },
        { from: "Dispatch & Match Core", to: "Trip Lifecycle Stream", protocol: "Kafka (acks=all)", throughput: "Ordered Events" },
        { from: "Trip Lifecycle Stream", to: "Trips & Ledger Database", protocol: "Idempotent Worker", throughput: "Batch Ingestion" }
      ]
    },
    lld: [
      {
        name: "DispatchService",
        pattern: "Strategy + Observer",
        methods: [
          "findEligibleDrivers(h3Index, radiusKm): List<Driver>",
          "lockDriverForTrip(driverId, tripId): Result<Lock>"
        ],
        fields: [
          "geoSpatialIndex: H3SpatialIndex",
          "driverCache: IRedisDriverStore",
          "eventPublisher: IKafkaProducer"
        ]
      },
      {
        name: "H3SpatialIndex",
        pattern: "Hexagonal Spatial Grid",
        methods: [
          "kRing(originHex, radiusStep): Set<HexIndex>",
          "updateLocation(driverId, lat, lon): void"
        ],
        fields: [
          "resolutionLevel: int = 8",
          "hexMap: ConcurrentHashMap<Long, Set<DriverId>>"
        ]
      }
    ],
    erd: [
      {
        table: "trips",
        pk: "trip_id (UUID)",
        sharding: "rider_id (Hash Partitioned)",
        columns: [
          "rider_id UUID NOT NULL",
          "driver_id UUID",
          "status VARCHAR(24)",
          "pickup_point GEOMETRY",
          "created_at TIMESTAMPTZ"
        ],
        indexes: [
          "idx_trips_rider_status (rider_id, status)",
          "idx_trips_created (created_at DESC)"
        ]
      },
      {
        table: "driver_telemetry",
        pk: "driver_id + timestamp",
        sharding: "Time-series (TimescaleDB)",
        columns: [
          "driver_id UUID NOT NULL",
          "h3_index BIGINT",
          "latitude DOUBLE PRECISION",
          "longitude DOUBLE PRECISION",
          "speed_kmh FLOAT"
        ],
        indexes: [
          "idx_telemetry_h3 (h3_index, timestamp DESC)"
        ]
      }
    ]
  },

  code_stripe: {
    id: "code_stripe",
    title: "Stripe-Grade Payment Engine",
    category: "Code to Architecture",
    type: "CODE",
    badge: "ACID Ledger",
    tag: "Reverse-Engineered from Go ZIP",
    color: "#a855f7",
    docName: "payments-core-service-master.zip",
    docSize: "14.2 MB · 32 Go source files",
    hld: {
      nodes: [
        { id: "api_client", name: "Checkout & API Clients", role: "Consumer", tech: "HTTPS / TLS 1.3", latency: "< 50ms", status: "Active" },
        { id: "idemp_layer", name: "Idempotency Guard", role: "Middleware", tech: "Redis Distributed Lock", latency: "1.2ms", status: "Active" },
        { id: "payment_svc", name: "Payments Core Engine", role: "Core Domain", tech: "Go 1.22 + Chi Router", latency: "14ms", status: "Active" },
        { id: "ledger_db", name: "Double-Entry Ledger DB", role: "ACID Store", tech: "PostgreSQL 16 (Serializable)", latency: "12ms", status: "Active" },
        { id: "banking_gw", name: "Banking / Card Network", role: "External Provider", tech: "mTLS ISO-8583 / REST", latency: "280ms", status: "Active" },
        { id: "webhook_bus", name: "Webhook Dispatch Queue", role: "Event Queue", tech: "Kafka 'charge.events'", latency: "2ms", status: "Active" }
      ],
      connections: [
        { from: "Checkout & API Clients", to: "Idempotency Guard", protocol: "HTTP POST /v1/charges", throughput: "Idempotent" },
        { from: "Idempotency Guard", to: "Payments Core Engine", protocol: "Context-bound Handler", throughput: "Lock Acquired" },
        { from: "Payments Core Engine", to: "Double-Entry Ledger DB", protocol: "pgxpool / ACID Tx", throughput: "Two-Phase Commit" },
        { from: "Payments Core Engine", to: "Banking / Card Network", protocol: "Outbound mTLS (3s Timeout)", throughput: "Direct Settle" },
        { from: "Payments Core Engine", to: "Webhook Dispatch Queue", protocol: "Transactional Outbox", throughput: "Guaranteed Delivery" }
      ]
    },
    lld: [
      {
        name: "PaymentProcessor",
        pattern: "Transactional Outbox",
        methods: [
          "ProcessCharge(req: ChargeCommand): ChargeResult",
          "HandleAcquirerWebhook(payload: byte[]): void"
        ],
        fields: [
          "idempotencyService: IIdempotencyStore",
          "ledger: ILedgerRepository",
          "circuitBreaker: gobreaker.TwoStepCircuitBreaker"
        ]
      },
      {
        name: "IdempotencyGuard",
        pattern: "Distributed Key Lock",
        methods: [
          "LockOrGetCached(key: string, timeout: Duration): LockStatus",
          "CommitResult(key: string, result: byte[]): void"
        ],
        fields: [
          "redisClient: *redis.ClusterClient",
          "ttl: 24 * time.Hour"
        ]
      }
    ],
    erd: [
      {
        table: "charges",
        pk: "charge_id (UUID)",
        sharding: "account_id (Tenant Key)",
        columns: [
          "account_id UUID NOT NULL",
          "amount_cents BIGINT NOT NULL",
          "currency VARCHAR(3)",
          "idempotency_key VARCHAR(64) UNIQUE",
          "status VARCHAR(20)"
        ],
        indexes: [
          "idx_charges_idemp (idempotency_key)",
          "idx_charges_account_status (account_id, status)"
        ]
      },
      {
        table: "ledger_entries",
        pk: "entry_id (BIGSERIAL)",
        sharding: "account_id (Tenant Key)",
        columns: [
          "charge_id UUID REFERENCES charges",
          "debit_account VARCHAR(64)",
          "credit_account VARCHAR(64)",
          "amount_cents BIGINT",
          "created_at TIMESTAMPTZ"
        ],
        indexes: [
          "idx_ledger_charge (charge_id)",
          "idx_ledger_created (created_at DESC)"
        ]
      }
    ]
  },

  audit_flashsale: {
    id: "audit_flashsale",
    title: "Flash Sale Inventory Audit",
    category: "Dual Cross-Audit",
    type: "AUDIT",
    badge: "74% Match",
    tag: "PRD Spec vs. Codebase AST",
    color: "#ef4444",
    docName: "Flash_Sale_Architecture_Audit.air",
    docSize: "PRD Spec (34 KB) vs. Repo (84 Files)",
    driftIssues: [
      {
        id: "drift-1",
        severity: "CRITICAL",
        category: "Concurrency & Race Condition",
        title: "PRD mandates atomic Redis token reservations; code executes non-atomic SQL SELECT then UPDATE",
        prdQuote: "PRD §4.2: 'Inventory reservations during peak flash sales MUST execute via atomic Redis Lua script (DECRBY) with zero direct database writes until final order placement.'",
        codeEvidence: "inventory_service.py:118 — Executes 'SELECT stock FROM products' followed by non-locked 'UPDATE products SET stock = stock - 1'.",
        impact: "Under 20,000+ QPS flash surges, this race condition will cause severe negative stock overselling.",
        remediation: "Execute atomic Redis decrement: 'EVALSHA redis_decr_script 1 item_id 1' and sync mutations asynchronously via Kafka."
      },
      {
        id: "drift-2",
        severity: "HIGH",
        category: "Single Point of Failure (SPOF)",
        title: "PRD requires multi-region active replica failover; code hardcodes single DB host",
        prdQuote: "PRD §2.1: 'Database infrastructure must support automated failover across us-east-1 and us-west-2 with read-replica offloading.'",
        codeEvidence: "db_config.py:23 — 'DATABASE_URL = postgresql://admin:***@10.0.4.12:5432/flash_db' with no connection pool failover or replica endpoints.",
        impact: "If the 10.0.4.x availability zone degrades, the checkout pipeline will experience a 100% hard outage.",
        remediation: "Deploy AWS Aurora Global Database endpoint with pgpool-II connection balancer and automated health-check failover."
      },
      {
        id: "drift-3",
        severity: "MEDIUM",
        category: "Missing Performance Index",
        title: "Missing composite index on orders table for customer active orders lookup",
        prdQuote: "PRD §5.3: 'Active order status queries must return in under 15ms p99.'",
        codeEvidence: "models.py (OrderModel) — Primary index on 'id' only; queries filter on '(customer_id, status, created_at)'.",
        impact: "Full sequential table scan on 10M+ records will spike database CPU to 100% under traffic.",
        remediation: "Apply composite index: 'CREATE INDEX idx_orders_cust_status ON orders (customer_id, status, created_at DESC);'"
      }
    ]
  }
};

export default function ArchitectureIntelligence({ onNavigate, isDark = true }) {
  const [activeMode, setActiveMode] = useState("doc_to_arch");
  const [selectedPreset, setSelectedPreset] = useState("prd_uber");
  const [docFile, setDocFile] = useState(null);
  const [codeFile, setCodeFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("topology");
  const [selectedNodeId, setSelectedNodeId] = useState("dispatch_svc");
  const [apiConnected, setApiConnected] = useState(false);
  const [liveData, setLiveData] = useState(null);

  // Fetch synthesis from backend API
  const fetchSynthesis = async (mode = activeMode, preset = selectedPreset, customFile = null) => {
    setIsAnalyzing(true);
    try {
      const apiUrl = window.API_URL || "http://localhost:3001";
      const activeFile = customFile || (mode === "code_to_arch" ? codeFile : docFile);
      const docName = activeFile?.name || (preset ? DEMO_SANDBOXES[preset]?.docName : "Custom Architecture Spec");

      const res = await fetch(`${apiUrl}/api/arch/synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          presetId: activeFile ? null : preset, // If custom file is present, ignore preset!
          docName: docName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLiveData(data);
        setApiConnected(true);
        if (data.hld?.nodes?.[0]?.id) {
          setSelectedNodeId(data.hld.nodes[0].id);
        }
      }
    } catch (err) {
      console.warn("Backend synthesis fallback to local data:", err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initial load
  React.useEffect(() => {
    fetchSynthesis(activeMode, selectedPreset);
  }, []);

  // Compute current active architecture data
  const currentData = useMemo(() => {
    if (liveData && liveData.hld) {
      if (!selectedPreset) {
        // Custom uploaded file active: use 100% dynamic liveData!
        return {
          id: "custom_synthesis",
          title: liveData.systemTitle || docFile?.name || codeFile?.name || "Custom Architecture",
          category: activeMode === "code_to_arch" ? "Code to Architecture" : activeMode === "dual_audit" ? "Dual Cross-Audit" : "PRD to Architecture",
          type: activeMode === "code_to_arch" ? "CODE" : activeMode === "dual_audit" ? "AUDIT" : "PRD",
          badge: "Synthesized",
          tag: liveData.domain || "Custom Architecture Engine",
          color: "#e1496d",
          docName: docFile?.name || codeFile?.name || "Custom File",
          ...liveData,
        };
      }
      return {
        ...DEMO_SANDBOXES[selectedPreset],
        ...liveData,
      };
    }
    return DEMO_SANDBOXES[selectedPreset] || DEMO_SANDBOXES.prd_uber;
  }, [selectedPreset, liveData, docFile, codeFile, activeMode]);

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setDocFile(null);
    setCodeFile(null);
    let nextPreset = "prd_uber";
    if (mode === "doc_to_arch") {
      nextPreset = "prd_uber";
      setSelectedPreset("prd_uber");
      setActiveTab("topology");
    } else if (mode === "code_to_arch") {
      nextPreset = "code_stripe";
      setSelectedPreset("code_stripe");
      setActiveTab("topology");
    } else {
      nextPreset = "audit_flashsale";
      setSelectedPreset("audit_flashsale");
      setActiveTab("audit");
    }
    fetchSynthesis(mode, nextPreset, null);
  };

  const handleSelectPreset = (presetKey) => {
    setSelectedPreset(presetKey);
    setDocFile(null);
    setCodeFile(null);
    const sb = DEMO_SANDBOXES[presetKey];
    if (sb) {
      if (sb.type === "PRD") setActiveMode("doc_to_arch");
      else if (sb.type === "CODE") setActiveMode("code_to_arch");
      else setActiveMode("dual_audit");
    }
    fetchSynthesis(activeMode, presetKey, null);
  };

  const handleRunAnalysis = () => {
    const activeFile = activeMode === "code_to_arch" ? codeFile : docFile;
    fetchSynthesis(activeMode, selectedPreset, activeFile);
  };

  const colors = {
    bg: isDark ? "transparent" : "transparent",
    surface: isDark ? "rgba(20, 7, 18, 0.75)" : "#ffffff",
    surfaceElevated: isDark ? "rgba(28, 9, 24, 0.65)" : "#faf8fa",
    border: isDark ? "rgba(225, 73, 109, 0.18)" : "rgba(148, 41, 69, 0.10)",
    borderSubtle: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
    text: isDark ? "#ffffff" : "#14040d",
    textMuted: isDark ? "rgba(255, 255, 255, 0.60)" : "rgba(20, 4, 13, 0.55)",
    accent: "#e1496d",
    accentGlow: "rgba(225, 73, 109, 0.12)",
  };

  const fontSans = "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const fontMono = "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        color: colors.text,
        fontFamily: fontSans,
        padding: "24px 24px 80px",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        
        {/* ── 1. MINIMALIST EDITORIAL HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.accent, fontFamily: fontSans }}>
                ArchForge Studio
              </span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: colors.border }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: apiConnected ? "#22c55e" : "#eab308", boxShadow: apiConnected ? "0 0 6px #22c55e" : "none" }} />
                <span style={{ fontSize: 11, color: colors.textMuted }}>
                  {apiConnected ? "API Connected (Port 3001)" : "Synthesizer Ready"}
                </span>
              </div>
            </div>
            <h1 style={{ fontFamily: fontSans, fontSize: "clamp(22px, 2.6vw, 32px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.2 }}>
              Software Architecture Intelligence
            </h1>
          </div>

          {/* Mode Switcher Pills */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: 3,
              borderRadius: 10,
              background: isDark ? "rgba(25, 8, 22, 0.7)" : "rgba(240, 235, 240, 0.8)",
              border: `1px solid ${colors.border}`,
              gap: 2,
            }}
          >
            {[
              { id: "doc_to_arch", label: "PRD to Architecture", icon: FileText },
              { id: "code_to_arch", label: "Code to Architecture", icon: Code2 },
              { id: "dual_audit", label: "Dual Cross-Audit", icon: ShieldCheck },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 13px",
                    borderRadius: 8,
                    background: isSelected ? colors.surface : "transparent",
                    color: isSelected ? colors.accent : colors.textMuted,
                    border: isSelected ? `1px solid ${colors.border}` : "1px solid transparent",
                    cursor: "pointer",
                    fontFamily: fontSans,
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 500,
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 2px 6px rgba(0,0,0,0.04)" : "none",
                  }}
                >
                  <Icon size={13} color={isSelected ? colors.accent : colors.textMuted} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. UNIFIED WORKBENCH (NO NESTED BOXES) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 0,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 12px 36px rgba(0,0,0,0.04)",
            minHeight: 620,
          }}
        >
          {/* ── LEFT EXPLORER RAIL (280px) ── */}
          <div
            style={{
              padding: "20px 18px",
              borderRight: `1px solid ${colors.border}`,
              background: isDark ? "rgba(16, 5, 14, 0.4)" : "rgba(252, 250, 252, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div>
              {/* Presets List */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  Reference Sandboxes
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {Object.values(DEMO_SANDBOXES).map((sb) => {
                    const isSelected = selectedPreset === sb.id;
                    return (
                      <button
                        key={sb.id}
                        onClick={() => handleSelectPreset(sb.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: 8,
                          background: isSelected ? (isDark ? "rgba(225, 73, 109, 0.14)" : "rgba(225, 73, 109, 0.08)") : "transparent",
                          border: isSelected ? `1px solid ${colors.accent}40` : "1px solid transparent",
                          color: isSelected ? colors.text : colors.textMuted,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.12s ease",
                          fontFamily: fontSans,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: isSelected ? 700 : 500 }}>
                            {sb.title}
                          </div>
                          <div style={{ fontSize: 10.5, color: colors.textMuted, marginTop: 1 }}>
                            {sb.category}
                          </div>
                        </div>
                        <span style={{ fontSize: 9.5, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: `${sb.color}15`, color: sb.color }}>
                          {sb.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  Custom Source Upload
                </div>
                <div
                  style={{
                    border: `1px dashed ${colors.border}`,
                    borderRadius: 10,
                    padding: "16px 12px",
                    textAlign: "center",
                    background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
                    overflow: "hidden",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Upload size={18} color={colors.accent} style={{ margin: "0 auto 6px" }} />
                  <div
                    title={activeMode === "code_to_arch" ? codeFile?.name : docFile?.name}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: colors.text,
                      maxWidth: "100%",
                      wordBreak: "break-all",
                      overflowWrap: "anywhere",
                      lineHeight: 1.35,
                      padding: "0 4px",
                    }}
                  >
                    {activeMode === "code_to_arch"
                      ? (codeFile?.name || "Drop Codebase .zip")
                      : (docFile?.name || "Drop PRD (.pdf, .md)")}
                  </div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
                    Drag &amp; drop or browse
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
                    <label
                      style={{
                        display: "inline-block",
                        fontSize: 11,
                        fontWeight: 600,
                        color: colors.accent,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Select file
                      <input
                        type="file"
                        accept={activeMode === "code_to_arch" ? ".zip,.tar.gz,.gz" : ".pdf,.md,.docx,.txt"}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (activeMode === "code_to_arch") {
                              setCodeFile(file);
                            } else {
                              setDocFile(file);
                            }
                            setSelectedPreset(null);
                            fetchSynthesis(activeMode, null, file);
                          }
                        }}
                      />
                    </label>

                    {(docFile || codeFile) && (
                      <button
                        onClick={() => {
                          setDocFile(null);
                          setCodeFile(null);
                          setSelectedPreset("prd_uber");
                          fetchSynthesis(activeMode, "prd_uber", null);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          fontSize: 10.5,
                          color: colors.textMuted,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #e1496d, #be123c)",
                border: "none",
                color: "#ffffff",
                fontFamily: fontSans,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: isAnalyzing ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow: "0 2px 10px rgba(225, 73, 109, 0.25)",
              }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={13} className="spin-icon" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Play size={13} />
                  <span>Re-synthesize Graph</span>
                </>
              )}
            </button>
          </div>

          {/* ── RIGHT INTERACTIVE WORKSPACE ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            
            {/* Top Workspace Bar */}
            <div
              style={{
                padding: "12px 20px",
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: isDark ? "rgba(16, 5, 14, 0.3)" : "rgba(250, 248, 250, 0.4)",
              }}
            >
              {/* Clean Minimalist Text Tabs */}
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {[
                  { id: "topology", label: "Topology (HLD)", icon: Network },
                  { id: "components", label: "Components (LLD)", icon: Layers },
                  { id: "schema", label: "Data Schema (ERD)", icon: Database },
                  ...(activeMode === "dual_audit" ? [{ id: "audit", label: "Audit Scorecard", icon: ShieldAlert }] : [])
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 0",
                        background: "transparent",
                        border: "none",
                        borderBottom: isSelected ? `2px solid ${colors.accent}` : "2px solid transparent",
                        color: isSelected ? colors.text : colors.textMuted,
                        cursor: "pointer",
                        fontSize: 12.5,
                        fontWeight: isSelected ? 700 : 500,
                        fontFamily: fontSans,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Icon size={14} color={isSelected ? colors.accent : colors.textMuted} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Link */}
              <button
                onClick={() => onNavigate("whiteboard")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  borderRadius: 6,
                  background: isDark ? "rgba(225, 73, 109, 0.12)" : "rgba(225, 73, 109, 0.06)",
                  border: `1px solid ${colors.accent}35`,
                  color: colors.accent,
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: fontSans,
                }}
              >
                <ExternalLink size={12} />
                <span>Open in Canvas</span>
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: "24px 24px 32px", flex: 1 }}>
              
              {/* ── TAB 1: TOPOLOGY (HLD) ── */}
              {activeTab === "topology" && currentData.hld && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  
                  {/* Visual Node Flow Stream */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>
                          {currentData.title || currentData.systemTitle || "System Architecture Flow"}
                        </span>
                        {(!selectedPreset && (docFile || codeFile)) && (
                          <span style={{ fontSize: 9.5, padding: "1px 6px", borderRadius: 4, background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontWeight: 700 }}>
                            Custom Source
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: colors.textMuted }}>
                        {currentData.metrics?.targetQps || "Verified Architecture"} · {currentData.metrics?.haSla || "Active"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                        gap: 10,
                      }}
                    >
                      {currentData.hld.nodes.map((node) => {
                        const isSelected = selectedNodeId === node.id;
                        return (
                          <div
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            style={{
                              padding: "12px",
                              borderRadius: 10,
                              background: isSelected ? (isDark ? "rgba(225, 73, 109, 0.12)" : "rgba(225, 73, 109, 0.06)") : colors.surfaceElevated,
                              border: isSelected ? `1.5px solid ${colors.accent}` : `1px solid ${colors.borderSubtle}`,
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              minWidth: 0,
                              overflow: "hidden",
                              boxSizing: "border-box",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: 9.5, fontWeight: 700, color: colors.accent, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {node.role}
                              </span>
                              <span style={{ fontSize: 9, color: "#10b981", fontWeight: 600, flexShrink: 0 }}>{node.latency}</span>
                            </div>
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: colors.text, marginBottom: 2, overflowWrap: "anywhere" }}>
                              {node.name}
                            </div>
                            <div style={{ fontSize: 10.5, color: colors.textMuted, fontFamily: fontMono, overflowWrap: "anywhere" }}>
                              {node.tech}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interconnect Pipeline Table */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                      Service Interconnect Contracts
                    </div>
                    <div style={{ borderRadius: 8, border: `1px solid ${colors.borderSubtle}`, overflow: "hidden" }}>
                      {currentData.hld.connections.map((conn, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            background: idx % 2 === 0 ? colors.surfaceElevated : "transparent",
                            fontSize: 11.5,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontWeight: 600, color: colors.text }}>{conn.from}</span>
                            <ArrowRight size={11} color={colors.accent} />
                            <span style={{ fontWeight: 600, color: colors.text }}>{conn.to}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 10.5, color: colors.textMuted }}>{conn.throughput}</span>
                            <span style={{ fontFamily: fontMono, fontSize: 10.5, fontWeight: 600, color: colors.accent }}>
                              {conn.protocol}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: COMPONENTS (LLD) ── */}
              {activeTab === "components" && currentData.lld && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {currentData.lld.map((cls, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: 10,
                        background: colors.surfaceElevated,
                        border: `1px solid ${colors.borderSubtle}`,
                        padding: 14,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: fontMono, color: colors.accent }}>
                          class {cls.name}
                        </span>
                        <span style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8" }}>
                          {cls.pattern}
                        </span>
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", marginBottom: 3 }}>
                          Dependencies
                        </div>
                        {cls.fields.map((f, fi) => (
                          <div key={fi} style={{ fontSize: 11, fontFamily: fontMono, color: colors.text, padding: "1px 0" }}>
                            • {f}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", marginBottom: 3 }}>
                          Public Interface
                        </div>
                        {cls.methods.map((m, mi) => (
                          <div key={mi} style={{ fontSize: 11, fontFamily: fontMono, color: "#10b981", padding: "1px 0" }}>
                            + {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 3: DATA SCHEMA (ERD) ── */}
              {activeTab === "schema" && currentData.erd && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {currentData.erd.map((t, ti) => (
                    <div
                      key={ti}
                      style={{
                        borderRadius: 10,
                        background: colors.surfaceElevated,
                        border: `1px solid ${colors.borderSubtle}`,
                        padding: 14,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, borderBottom: `1px solid ${colors.borderSubtle}`, paddingBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: fontMono }}>
                          table {t.table}
                        </span>
                        <span style={{ fontSize: 9.5, color: colors.textMuted }}>
                          PK: {t.pk}
                        </span>
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        {t.columns.map((col, ci) => (
                          <div key={ci} style={{ fontSize: 11, fontFamily: fontMono, color: colors.text, padding: "2px 0" }}>
                            {col}
                          </div>
                        ))}
                      </div>

                      <div style={{ borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 6 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", marginBottom: 3 }}>
                          Indexes &amp; Partitioning
                        </div>
                        <div style={{ fontSize: 10.5, fontFamily: fontMono, color: "#38bdf8", marginBottom: 2 }}>
                          Shard Key: {t.sharding}
                        </div>
                        {t.indexes.map((idx, ii) => (
                          <div key={ii} style={{ fontSize: 10.5, fontFamily: fontMono, color: "#10b981", padding: "1px 0" }}>
                            ⚡ {idx}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 4: AUDIT SCORECARD (MODE C) ── */}
              {activeTab === "audit" && currentData.driftIssues && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: colors.text }}>
                      Alignment Score: 74% · 3 Architectural Discrepancies Found
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444" }}>
                      ACTION REQUIRED
                    </span>
                  </div>

                  {currentData.driftIssues.map((issue) => (
                    <div
                      key={issue.id}
                      style={{
                        borderRadius: 8,
                        background: colors.surfaceElevated,
                        border: `1px solid ${issue.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.3)" : colors.borderSubtle}`,
                        padding: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>
                          {issue.title}
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: issue.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)", color: issue.severity === "CRITICAL" ? "#ef4444" : "#f59e0b" }}>
                          {issue.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.4, margin: "4px 0" }}>
                        <strong>Promise:</strong> {issue.prdQuote}
                      </div>
                      <div style={{ fontSize: 11, color: "#f59e0b", fontFamily: fontMono, margin: "2px 0" }}>
                        <strong>Reality:</strong> {issue.codeEvidence}
                      </div>
                      <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>
                        <strong>Fix:</strong> {issue.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
