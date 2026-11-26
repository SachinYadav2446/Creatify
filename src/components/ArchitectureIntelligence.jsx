import React, { useState, useMemo } from "react";
import {
  FileText, Code2, ShieldAlert, Cpu, Database, Server,
  ArrowRight, Check, Copy, Download, Upload, RefreshCw, Layers,
  ExternalLink, CheckCircle2, AlertTriangle, Play, Zap, FileCode,
  Network, GitBranch, Terminal, HelpCircle, Eye, FileArchive, ShieldCheck,
  ChevronRight, ArrowUpRight, Sparkles, Activity, Settings, Key, EyeOff, AlertCircle, Cpu as ChipIcon, Info, X
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

  ai_rag: {
    id: "ai_rag",
    title: "Enterprise Agentic RAG Platform",
    category: "Data Science & LLMs",
    type: "PRD",
    badge: "15k Tokens/s",
    tag: "Vector Search & Agentic Loop",
    color: "#38bdf8",
    docName: "Agentic_RAG_Enterprise_Spec.md",
    docSize: "52 KB · 2,400 words",
    hld: {
      nodes: [
        { id: "query_gateway", name: "Prompt & Multimodal Gateway", role: "Ingress & Guardrails", tech: "FastAPI / Envoy + LlamaGuard", latency: "< 15ms", status: "Active" },
        { id: "semantic_cache", name: "Semantic Embedding Cache", role: "Cost Reducer", tech: "Redis (Cosine Sim Cache)", latency: "< 2ms", status: "Active" },
        { id: "retriever_core", name: "Hybrid RAG Retriever", role: "Context Aggregation", tech: "Dense (E5) + Sparse (BM25) Reranker", latency: "28ms", status: "Active" },
        { id: "vector_store", name: "Distributed Vector DB", role: "Embedding Index", tech: "Qdrant / Milvus (HNSW Graphs)", latency: "12ms", status: "Active" },
        { id: "agent_orchestrator", name: "Multi-Agent Task Executor", role: "Agentic Core", tech: "LangGraph / Async Worker Mesh", latency: "45ms", status: "Active" },
        { id: "llm_inference", name: "TensorRT-LLM Inference Engine", role: "Model Serving", tech: "vLLM / Triton (A100 Tensor Parallel)", latency: "< 75ms", status: "Active" }
      ],
      connections: [
        { from: "Prompt & Multimodal Gateway", to: "Semantic Embedding Cache", protocol: "HTTP POST /v1/chat", throughput: "Token Rate-Limited" },
        { from: "Semantic Embedding Cache", to: "Hybrid RAG Retriever", protocol: "Cache-Miss Fallthrough", throughput: "94.2% Context Recall" },
        { from: "Hybrid RAG Retriever", to: "Distributed Vector DB", protocol: "gRPC Vector Search", throughput: "HNSW top_k=20" },
        { from: "Hybrid RAG Retriever", to: "Multi-Agent Task Executor", protocol: "Grounding Payload", throughput: "Context Window Bound" },
        { from: "Multi-Agent Task Executor", to: "TensorRT-LLM Inference Engine", protocol: "HTTP/2 SSE Streaming", throughput: "Continuous Batching" }
      ]
    },
    lld: [
      {
        name: "RAGRetrievalPipeline",
        pattern: "Pipeline + Strategy (Hybrid Search)",
        methods: [
          "embedQuery(text: string): FloatVector",
          "retrieveContext(vector: FloatVector, filter: MetadataFilter): List<Chunk>",
          "crossEncodeRerank(query: string, candidates: List<Chunk>): List<GroundingChunk>"
        ],
        fields: [
          "embeddingModel: IEmbeddingClient",
          "vectorIndex: IQdrantCluster",
          "reranker: CohereRerankService"
        ]
      },
      {
        name: "AgentExecutionOrchestrator",
        pattern: "ReAct Loop + Tool Invocation Proxy",
        methods: [
          "executePlan(goal: AgentGoal, memory: AgentMemory): ExecutionTrace",
          "invokeToolSafely(toolName: string, args: JsonMap): ToolResult"
        ],
        fields: [
          "llmClient: IVllmClient",
          "toolRegistry: AgentToolRegistry",
          "safetyGuardrail: INeMoSafetyChecker"
        ]
      }
    ],
    erd: [
      {
        table: "document_chunks",
        pk: "chunk_id (UUID)",
        sharding: "collection_id (Hash Partitioned)",
        columns: [
          "chunk_id UUID NOT NULL",
          "collection_id UUID NOT NULL",
          "document_id UUID NOT NULL",
          "content TEXT NOT NULL",
          "embedding VECTOR(1536) NOT NULL",
          "token_count INT",
          "metadata JSONB",
          "created_at TIMESTAMPTZ"
        ],
        indexes: [
          "idx_chunks_hnsw (embedding vector_cosine_ops USING hnsw)",
          "idx_chunks_doc_meta (document_id, created_at DESC)"
        ]
      },
      {
        table: "agent_execution_traces",
        pk: "trace_id (UUID)",
        sharding: "Time-series partition",
        columns: [
          "trace_id UUID NOT NULL",
          "session_id VARCHAR(64)",
          "user_id VARCHAR(64)",
          "model_name VARCHAR(64)",
          "prompt_tokens INT",
          "completion_tokens INT",
          "total_latency_ms FLOAT",
          "cost_usd DECIMAL(10, 6)",
          "timestamp TIMESTAMPTZ"
        ],
        indexes: [
          "idx_traces_user_time (user_id, timestamp DESC)",
          "idx_traces_model (model_name)"
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
    title: "High-Surge Flash Sale Engine",
    category: "Dual Cross-Audit",
    type: "AUDIT",
    badge: "3 Drift Critical",
    tag: "PRD Promises vs. Code Reality",
    color: "#ef4444",
    docName: "Flash_Sale_Architecture_Audit.pdf",
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
  const [topologyView, setTopologyView] = useState("flow"); // "flow" | "grid"
  const [flowAnimation, setFlowAnimation] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [activeDiffIssue, setActiveDiffIssue] = useState(null);

  // AI Integration State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem("arch_ai_provider") || "gemini");
  const [aiKey, setAiKey] = useState(() => localStorage.getItem("arch_ai_key") || "");
  const [aiModel, setAiModel] = useState(() => localStorage.getItem("arch_ai_model") || "gemini-1.5-flash");
  const [aiBaseUrl, setAiBaseUrl] = useState(() => localStorage.getItem("arch_ai_base_url") || "");
  const [showKeyText, setShowKeyText] = useState(false);
  const [keyVerifyStatus, setKeyVerifyStatus] = useState(null);

  const handleVerifyKey = async () => {
    if (!aiKey && !aiBaseUrl) {
      setKeyVerifyStatus({ checking: false, valid: false, message: "Please enter an API key or base URL first." });
      return;
    }
    setKeyVerifyStatus({ checking: true });
    try {
      const apiUrl = window.API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/api/arch/verify-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: aiProvider,
          apiKey: aiKey.trim(),
          customBaseUrl: aiBaseUrl.trim() || undefined
        })
      });
      const data = await res.json();
      setKeyVerifyStatus({
        checking: false,
        valid: data.valid,
        message: data.valid ? (data.message || "Key verified & operational!") : (data.error || "Verification failed.")
      });
    } catch (e) {
      setKeyVerifyStatus({ checking: false, valid: false, message: e.message });
    }
  };

  const handleSaveAiSettings = () => {
    localStorage.setItem("arch_ai_provider", aiProvider);
    localStorage.setItem("arch_ai_key", aiKey.trim());
    localStorage.setItem("arch_ai_model", aiModel);
    localStorage.setItem("arch_ai_base_url", aiBaseUrl.trim());
    setShowAiModal(false);
    showToast(aiKey ? `Configured ${aiProvider.toUpperCase()} AI credentials!` : "Using deterministic heuristic engine.");
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Fetch synthesis from backend API
  const fetchSynthesis = async (mode = activeMode, preset = selectedPreset, customDoc = null, customCode = null) => {
    setIsAnalyzing(true);
    try {
      const apiUrl = window.API_URL || "http://localhost:3001";
      const activeDoc = customDoc || docFile;
      const activeCode = customCode || codeFile;
      const activeFile = mode === "code_to_arch" ? activeCode : (activeDoc || activeCode);
      const docName = activeFile?.name || (preset ? DEMO_SANDBOXES[preset]?.docName : "Custom Architecture Spec");

      let docText = "";
      if (activeDoc && (activeDoc.type?.startsWith("text/") || activeDoc.name?.match(/\\.(md|txt|json|yaml|yml|py|js|ts|go)$/i))) {
        try {
          docText = await activeDoc.text();
        } catch (e) {
          console.warn("Could not read text from file:", e);
        }
      }

      let zipBase64 = null;
      if (activeCode && activeCode.name?.toLowerCase().endsWith(".zip")) {
        try {
          zipBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(activeCode);
          });
        } catch (err) {
          console.warn("Could not convert zip file to base64:", err);
        }
      }

      const res = await fetch(`${apiUrl}/api/arch/synthesize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(aiKey ? { "x-api-key": aiKey.trim() } : {})
        },
        body: JSON.stringify({
          mode,
          presetId: (activeDoc || activeCode) ? null : preset,
          docName: docName,
          docText: docText || undefined,
          codeSnippet: activeCode?.name || undefined,
          zipBase64: zipBase64 || undefined,
          archiveName: activeCode?.name || undefined,
          apiKey: aiKey ? aiKey.trim() : undefined,
          provider: aiProvider,
          model: aiModel,
          customBaseUrl: aiBaseUrl.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLiveData(data);
        setApiConnected(true);
        if (data.hld?.nodes?.[0]?.id) {
          setSelectedNodeId(data.hld.nodes[0].id);
        }
        if (data.manifest) {
          showToast(`📦 Ingested ${data.manifest.totalFiles} files from ${data.manifest.archiveName || "repository"}!`);
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

  // Selected node computation
  const selectedNode = useMemo(() => {
    if (!currentData?.hld?.nodes) return null;
    return currentData.hld.nodes.find(n => n.id === selectedNodeId) || currentData.hld.nodes[0];
  }, [currentData, selectedNodeId]);

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
    fetchSynthesis(mode, nextPreset, null, null);
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
    fetchSynthesis(activeMode, presetKey, null, null);
  };

  const handleRunAnalysis = () => {
    fetchSynthesis(activeMode, selectedPreset, docFile, codeFile);
  };

  // 1. Open in Whiteboard / Canvas
  const handleOpenInCanvas = () => {
    if (!currentData?.hld?.nodes) {
      if (onNavigate) onNavigate("whiteboard");
      return;
    }
    const nodes = currentData.hld.nodes;
    const conns = currentData.hld.connections || [];

    const mappedNodes = nodes.map((node, i) => {
      const roleLower = (node.role || "").toLowerCase();
      let type = "service";
      let color = "#a855f7";
      if (roleLower.includes("database") || roleLower.includes("store") || roleLower.includes("db") || roleLower.includes("gis")) {
        type = "database";
        color = "#22c55e";
      } else if (roleLower.includes("queue") || roleLower.includes("stream") || roleLower.includes("broker") || roleLower.includes("bus")) {
        type = "queue";
        color = "#e1496d";
      } else if (roleLower.includes("gateway") || roleLower.includes("edge") || roleLower.includes("ingress") || roleLower.includes("proxy")) {
        type = "gateway";
        color = "#38bdf8";
      }
      return {
        id: node.id || `node_${i}`,
        type,
        label: node.name,
        subLabel: `${node.role} · ${node.tech}`,
        x: 80 + (i % 3) * 260,
        y: 120 + Math.floor(i / 3) * 200,
        width: 220,
        color,
        metrics: `${node.latency || "< 10ms"} · ${node.status || "Active"}`
      };
    });

    const mappedWires = conns.map((conn, idx) => {
      const fromNode = nodes.find(n => n.name === conn.from) || nodes[idx % nodes.length];
      const toNode = nodes.find(n => n.name === conn.to) || nodes[(idx + 1) % nodes.length];
      return {
        id: `wire_${idx}`,
        from: fromNode?.id || `node_${idx}`,
        to: toNode?.id || `node_${(idx + 1) % nodes.length}`,
        label: `${conn.protocol}`
      };
    });

    if (onNavigate) {
      onNavigate("whiteboard_load", {
        title: `${currentData.title || "Architecture"} Design`,
        archNodes: mappedNodes,
        archWires: mappedWires
      });
    }
  };

  // 2. Download Architecture RFC Markdown
  const handleDownloadMarkdown = () => {
    let md = `# ${currentData.title || "Architecture Specification"}\n\n`;
    md += `**Domain:** ${currentData.domain || currentData.tag || "Distributed Systems"}\n`;
    md += `**Target Throughput:** ${currentData.metrics?.targetQps || "N/A"}\n`;
    md += `**p99 Latency SLA:** ${currentData.metrics?.p99Latency || "N/A"}\n`;
    md += `**High Availability:** ${currentData.metrics?.haSla || "99.99%"}\n\n`;
    md += `## 1. High-Level Design (HLD) Topology\n\n`;
    md += `| Node Name | Architectural Role | Technology Stack | Latency SLA | Status |\n`;
    md += `|---|---|---|---|---|\n`;
    currentData.hld?.nodes?.forEach(n => {
      md += `| ${n.name} | ${n.role} | ${n.tech} | ${n.latency} | ${n.status} |\n`;
    });
    md += `\n### Service Interconnect Contracts\n\n`;
    md += `| Ingress Node | Target Node | Protocol | Throughput Profile |\n`;
    md += `|---|---|---|---|\n`;
    currentData.hld?.connections?.forEach(c => {
      md += `| ${c.from} | ${c.to} | ${c.protocol} | ${c.throughput} |\n`;
    });
    if (currentData.lld) {
      md += `\n## 2. Low-Level Design (LLD) Class Contracts\n\n`;
      currentData.lld.forEach(cls => {
        md += `### Class: ` + "`" + cls.name + "`" + ` (${cls.pattern})\n`;
        md += `**Dependencies:**\n`;
        cls.fields?.forEach(f => { md += `- ` + "`" + f + "`" + `\n`; });
        md += `**Public Interface:**\n`;
        cls.methods?.forEach(m => { md += `- ` + "`+ " + m + "`" + `\n`; });
        md += `\n`;
      });
    }
    if (currentData.erd) {
      md += `\n## 3. Database Schema & Indexing (ERD)\n\n`;
      currentData.erd.forEach(tbl => {
        md += `### Table: ` + "`" + tbl.table + "`" + ` (PK: ` + "`" + tbl.pk + "`" + `, Shard: ` + "`" + tbl.sharding + "`" + `)\n`;
        md += `**Columns:**\n`;
        tbl.columns?.forEach(c => { md += `- ` + "`" + c + "`" + `\n`; });
        md += `**Indexes:**\n`;
        tbl.indexes?.forEach(idx => { md += `- ` + "`" + idx + "`" + `\n`; });
        md += `\n`;
      });
    }
    if (currentData.driftIssues) {
      md += `\n## 4. Architectural Drift & Compliance Findings\n\n`;
      currentData.driftIssues.forEach(d => {
        md += `### [${d.severity}] ${d.title}\n`;
        md += `- **PRD Promise:** ${d.prdQuote}\n`;
        md += `- **Code Reality:** ${d.codeEvidence}\n`;
        md += `- **Remediation:** ${d.remediation}\n\n`;
      });
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentData.title || "architecture_spec").replace(/\s+/g, "_")}_RFC.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded Architecture RFC (.md)");
  };

  // 3. Copy Mermaid Diagram
  const handleCopyMermaid = () => {
    let mmd = "graph TD\n";
    const nodes = currentData.hld?.nodes || [];
    const conns = currentData.hld?.connections || [];
    nodes.forEach((n, idx) => {
      const safeId = (n.id || `node_${idx}`).replace(/[^a-zA-Z0-9_]/g, "_");
      mmd += `  ${safeId}["${n.name} (${n.role})"]\n`;
    });
    conns.forEach(c => {
      const fromNode = nodes.find(n => n.name === c.from);
      const toNode = nodes.find(n => n.name === c.to);
      const fromId = (fromNode?.id || "client").replace(/[^a-zA-Z0-9_]/g, "_");
      const toId = (toNode?.id || "db").replace(/[^a-zA-Z0-9_]/g, "_");
      mmd += `  ${fromId} -->|${c.protocol}| ${toId}\n`;
    });
    navigator.clipboard.writeText(mmd);
    showToast("Copied Mermaid Diagram to clipboard!");
  };

  // 4. Download JSON
  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentData.title || "architecture").replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded Architecture JSON");
  };

  // 8. Generate Docker Compose YAML
  const generateDockerCompose = () => {
    const nodes = currentData.hld?.nodes || [];
    let yaml = `version: "3.8"\n\n`;
    yaml += `networks:\n  arch_net:\n    driver: bridge\n\n`;
    yaml += `volumes:\n  db_data:\n  redis_data:\n  broker_data:\n\n`;
    yaml += `services:\n`;

    nodes.forEach((n, idx) => {
      const safeId = (n.id || `service_${idx}`).replace(/[^a-zA-Z0-9_]/g, "_");
      const r = (n.role + " " + n.name + " " + n.tech).toLowerCase();

      yaml += `  # [${n.role}] ${n.name}\n`;
      yaml += `  ${safeId}:\n`;

      if (r.includes("redis") || r.includes("cache")) {
        yaml += `    image: redis:7-alpine\n`;
        yaml += `    command: redis-server --appendonly yes\n`;
        yaml += `    ports:\n      - "6379:6379"\n`;
        yaml += `    volumes:\n      - redis_data:/data\n`;
      } else if (r.includes("postgres") || r.includes("sql") || r.includes("citus") || r.includes("db") || r.includes("database")) {
        yaml += `    image: pgvector/pgvector:pg16\n`;
        yaml += `    environment:\n      - POSTGRES_USER=postgres\n      - POSTGRES_PASSWORD=postgres\n      - POSTGRES_DB=app_db\n`;
        yaml += `    ports:\n      - "5432:5432"\n`;
        yaml += `    volumes:\n      - db_data:/var/lib/postgresql/data\n`;
      } else if (r.includes("kafka") || r.includes("stream") || r.includes("broker")) {
        yaml += `    image: apache/kafka:latest\n`;
        yaml += `    environment:\n      - KAFKA_NODE_ID=1\n      - KAFKA_PROCESS_ROLES=broker,controller\n      - KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093\n      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://${safeId}:9092\n      - KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093\n`;
        yaml += `    ports:\n      - "9092:9092"\n`;
        yaml += `    volumes:\n      - broker_data:/var/lib/kafka/data\n`;
      } else if (r.includes("qdrant") || r.includes("vector")) {
        yaml += `    image: qdrant/qdrant:latest\n`;
        yaml += `    ports:\n      - "6333:6333"\n`;
      } else if (r.includes("gateway") || r.includes("ingress") || r.includes("proxy") || idx === 0) {
        yaml += `    image: envoyproxy/envoy:v1.28-latest\n`;
        yaml += `    ports:\n      - "8080:8080"\n`;
      } else {
        const port = 8000 + idx;
        yaml += `    build:\n      context: ./${safeId}\n      dockerfile: Dockerfile\n`;
        yaml += `    environment:\n      - PORT=${port}\n      - NODE_ENV=production\n`;
        yaml += `    ports:\n      - "${port}:${port}"\n`;
      }

      yaml += `    networks:\n      - arch_net\n`;
      yaml += `    restart: unless-stopped\n\n`;
    });

    return yaml;
  };

  const handleDownloadDockerCompose = () => {
    const yaml = generateDockerCompose();
    const blob = new Blob([yaml], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "docker-compose.yml";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded docker-compose.yml!");
  };

  // 9. Generate Terraform AWS Infrastructure (main.tf)
  const generateTerraform = () => {
    const title = (currentData.title || "architecture").toLowerCase().replace(/[^a-z0-9]/g, "_");
    let tf = `terraform {\n  required_version = ">= 1.5.0"\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\n`;
    tf += `provider "aws" {\n  region = var.aws_region\n}\n\n`;
    tf += `variable "aws_region" {\n  default = "us-east-1"\n}\n\n`;
    tf += `variable "project_name" {\n  default = "${title}"\n}\n\n`;
    tf += `# 1. VPC & High-Availability Network Topology\n`;
    tf += `resource "aws_vpc" "main" {\n  cidr_block           = "10.0.0.0/16"\n  enable_dns_hostnames = true\n  enable_dns_support   = true\n  tags = { Name = "\${var.project_name}-vpc" }\n}\n\n`;
    tf += `# 2. ECS Fargate Cluster for Core Microservices\n`;
    tf += `resource "aws_ecs_cluster" "main" {\n  name = "\${var.project_name}-cluster"\n}\n\n`;
    tf += `# 3. Elasticache Redis Cluster (Low-Latency Cache)\n`;
    tf += `resource "aws_elasticache_cluster" "redis" {\n  cluster_id           = "\${var.project_name}-redis"\n  engine               = "redis"\n  node_type            = "cache.t4g.medium"\n  num_cache_nodes      = 1\n  parameter_group_name = "default.redis7"\n  port                 = 6379\n}\n\n`;
    tf += `# 4. Multi-AZ PostgreSQL RDS Instance\n`;
    tf += `resource "aws_db_instance" "primary" {\n  allocated_storage   = 50\n  engine              = "postgres"\n  engine_version      = "16.1"\n  instance_class      = "db.t4g.large"
  db_name             = "\${var.project_name}_db"\n  username            = "app_admin"\n  password            = "ChangeMeInProd123!"\n  skip_final_snapshot = true\n  multi_az            = true\n}\n`;
    return tf;
  };

  const handleDownloadTerraform = () => {
    const tf = generateTerraform();
    const blob = new Blob([tf], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.tf";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded main.tf (Terraform)!");
  };

  // 5. Copy Class Interface
  const handleCopyClassContract = (cls) => {
    let code = `// Contract for ${cls.name} (${cls.pattern})\n`;
    code += `export interface I${cls.name} {\n`;
    cls.fields?.forEach(f => {
      const parts = f.split(":");
      code += `  ${parts[0]?.trim() || f}: ${parts[1]?.trim() || "any"};\n`;
    });
    cls.methods?.forEach(m => {
      code += `  ${m};\n`;
    });
    code += "}\n";
    navigator.clipboard.writeText(code);
    showToast(`Copied I${cls.name} interface!`);
  };

  // 6. Copy ERD SQL DDL
  const handleCopyDDL = (t) => {
    let ddl = `CREATE TABLE ${t.table} (\n`;
    const colDefs = (t.columns || []).map(c => `  ${c}`).join(",\n");
    ddl += `${colDefs},\n  PRIMARY KEY (${t.pk})\n);\n\n`;
    (t.indexes || []).forEach((idx, i) => {
      ddl += `CREATE INDEX idx_${t.table}_${i} ON ${t.table} (${idx});\n`;
    });
    navigator.clipboard.writeText(ddl);
    showToast(`Copied SQL DDL for ${t.table}!`);
  };

  // 7. Copy Remediation Patch
  const handleCopyRemediation = (issue) => {
    navigator.clipboard.writeText(issue.remediation);
    showToast("Copied remediation fix to clipboard!");
  };

  // 10. Generate Unified Git Diff Patch
  const generateUnifiedPatch = (issue) => {
    const rawFile = (issue.codeEvidence?.split("—")[0] || issue.category || "service.py").trim().split(" ")[0].replace(/:[0-9]+$/, "");
    const fileName = rawFile.includes(".") ? rawFile : "architecture_fix.py";
    let patch = `diff --git a/${fileName} b/${fileName}\n`;
    patch += `--- a/${fileName}\n`;
    patch += `+++ b/${fileName}\n`;
    patch += `@@ -1,5 +1,12 @@\n`;
    patch += `- // VIOLATION: ${issue.title}\n`;
    patch += `- // OBSERVED: ${issue.codeEvidence}\n`;
    patch += `+ // REMEDIATION PATCH: ${issue.title}\n`;
    patch += `+ // PRD COMPLIANCE: ${issue.prdQuote}\n`;
    patch += `+ ${issue.remediation}\n`;
    return patch;
  };

  const handleDownloadFullPatch = () => {
    let fullPatch = `# ArchForge Architecture Compliance Remediation Patch\n`;
    fullPatch += `# Generated on ${new Date().toISOString()}\n`;
    fullPatch += `# Target System: ${currentData.title || "Architecture"}\n\n`;
    (currentData.driftIssues || []).forEach((issue, idx) => {
      fullPatch += `\n# --- Issue #${idx + 1}: [${issue.severity}] ${issue.title} ---\n`;
      fullPatch += generateUnifiedPatch(issue);
      fullPatch += `\n`;
    });
    const blob = new Blob([fullPatch], { type: "text/x-diff;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentData.title || "architecture").replace(/\s+/g, "_")}_remediation.patch`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded unified remediation .patch file!");
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
        position: "relative",
      }}
    >
      {/* Toast Notification Pill */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            padding: "9px 18px",
            borderRadius: 99,
            background: isDark ? "rgba(28, 9, 24, 0.95)" : "rgba(20, 4, 13, 0.92)",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            border: "1px solid rgba(225, 73, 109, 0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 7,
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          <CheckCircle2 size={14} color="#10b981" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        
        {/* ── 1. MINIMALIST EDITORIAL HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
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
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: colors.border }} />
              {/* AI Engine Model Settings Button */}
              <button
                onClick={() => setShowAiModal(true)}
                title="Configure Live AI Provider (Gemini / OpenAI / Custom LLM)"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: aiKey ? "rgba(225, 73, 109, 0.12)" : "rgba(100, 116, 139, 0.1)",
                  border: `1px solid ${aiKey ? "rgba(225, 73, 109, 0.3)" : colors.borderSubtle}`,
                  cursor: "pointer",
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: aiKey ? colors.accent : colors.textMuted,
                  transition: "all 0.15s ease",
                }}
              >
                <Sparkles size={11} color={aiKey ? colors.accent : colors.textMuted} />
                <span>{aiKey ? (aiProvider === "openai" ? "OpenAI " + aiModel : "Gemini " + aiModel) : "AI Engine (Fallback)"}</span>
                <Settings size={10} style={{ marginLeft: 2, opacity: 0.7 }} />
              </button>
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

        {/* ── 2. UNIFIED WORKBENCH ── */}
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

              {/* Upload Drop Zone(s) */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  {activeMode === "dual_audit" ? "Dual Source Ingestion" : "Custom Source Ingestion"}
                </div>

                {/* Drop Zone 1: PRD / Document (shown in doc_to_arch and dual_audit) */}
                {activeMode !== "code_to_arch" && (
                  <div
                    style={{
                      border: `1px dashed ${docFile ? colors.accent : colors.border}`,
                      borderRadius: 10,
                      padding: "12px 10px",
                      textAlign: "center",
                      background: docFile ? (isDark ? "rgba(225, 73, 109, 0.08)" : "rgba(225, 73, 109, 0.04)") : (isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)"),
                      overflow: "hidden",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                      marginBottom: activeMode === "dual_audit" ? 10 : 0,
                    }}
                  >
                    <Upload size={16} color={docFile ? colors.accent : colors.textMuted} style={{ margin: "0 auto 4px" }} />
                    <div
                      title={docFile?.name}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: colors.text,
                        maxWidth: "100%",
                        wordBreak: "break-all",
                        overflowWrap: "anywhere",
                        lineHeight: 1.3,
                        padding: "0 2px",
                      }}
                    >
                      {docFile?.name || "1. PRD Document (.pdf, .md, .txt)"}
                    </div>
                    <div style={{ fontSize: 9.5, color: colors.textMuted, marginTop: 2 }}>
                      {docFile ? `${(docFile.size / 1024).toFixed(1)} KB Attached` : "Specs, RFCs, Architecture Docs"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6 }}>
                      <label
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: colors.accent,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {docFile ? "Replace" : "Select PRD"}
                        <input
                          type="file"
                          accept=".pdf,.md,.docx,.txt,.json"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDocFile(file);
                              setSelectedPreset(null);
                              fetchSynthesis(activeMode, null, file, codeFile);
                            }
                          }}
                        />
                      </label>
                      {docFile && (
                        <button
                          onClick={() => {
                            setDocFile(null);
                            if (!codeFile) setSelectedPreset("prd_uber");
                            fetchSynthesis(activeMode, codeFile ? null : "prd_uber", null, codeFile);
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
                )}

                {/* Drop Zone 2: Codebase (shown in code_to_arch and dual_audit) */}
                {activeMode !== "doc_to_arch" && (
                  <div
                    style={{
                      border: `1px dashed ${codeFile ? colors.accent : colors.border}`,
                      borderRadius: 10,
                      padding: "12px 10px",
                      textAlign: "center",
                      background: codeFile ? (isDark ? "rgba(225, 73, 109, 0.08)" : "rgba(225, 73, 109, 0.04)") : (isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)"),
                      overflow: "hidden",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <FileCode size={16} color={codeFile ? colors.accent : colors.textMuted} style={{ margin: "0 auto 4px" }} />
                    <div
                      title={codeFile?.name}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: colors.text,
                        maxWidth: "100%",
                        wordBreak: "break-all",
                        overflowWrap: "anywhere",
                        lineHeight: 1.3,
                        padding: "0 2px",
                      }}
                    >
                      {codeFile?.name || "2. Codebase Archive (.zip, .tar)"}
                    </div>
                    <div style={{ fontSize: 9.5, color: colors.textMuted, marginTop: 2 }}>
                      {codeFile ? `${(codeFile.size / (1024 * 1024) > 1 ? (codeFile.size / (1024 * 1024)).toFixed(1) + " MB" : (codeFile.size / 1024).toFixed(1) + " KB")} Attached` : "Source Code, AST, Repos"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6 }}>
                      <label
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: colors.accent,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {codeFile ? "Replace" : "Select Code"}
                        <input
                          type="file"
                          accept=".zip,.tar.gz,.gz,.tar,.go,.py,.js,.ts,.rs"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCodeFile(file);
                              setSelectedPreset(null);
                              fetchSynthesis(activeMode, null, docFile, file);
                            }
                          }}
                        />
                      </label>
                      {codeFile && (
                        <button
                          onClick={() => {
                            setCodeFile(null);
                            if (!docFile) setSelectedPreset("code_stripe");
                            fetchSynthesis(activeMode, docFile ? null : "code_stripe", docFile, null);
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
                )}
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
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {/* Clean Minimalist Text Tabs */}
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {[
                  { id: "topology", label: "Topology (HLD)", icon: Network },
                  { id: "components", label: "Components (LLD)", icon: Layers },
                  { id: "schema", label: "Data Schema (ERD)", icon: Database },
                  ...(currentData.driftIssues ? [{ id: "audit", label: "Audit Scorecard", icon: ShieldAlert }] : []),
                  ...(currentData.manifest ? [{ id: "ast", label: "Repo AST Explorer", icon: FileArchive }] : [])
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

              {/* Action Toolbar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Export Markdown RFC */}
                <button
                  onClick={handleDownloadMarkdown}
                  title="Download Architecture RFC Specification"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 9px",
                    borderRadius: 6,
                    background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                    border: `1px solid ${colors.borderSubtle}`,
                    color: colors.text,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: fontSans,
                  }}
                >
                  <Download size={11} />
                  <span>Export RFC (.md)</span>
                </button>

                {/* Copy Mermaid */}
                <button
                  onClick={handleCopyMermaid}
                  title="Copy Mermaid DAG Diagram code"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 9px",
                    borderRadius: 6,
                    background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                    border: `1px solid ${colors.borderSubtle}`,
                    color: colors.text,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: fontSans,
                  }}
                >
                  <Copy size={11} />
                  <span>Mermaid</span>
                </button>

                
                {/* Download Docker Compose */}
                <button
                  onClick={handleDownloadDockerCompose}
                  title="Generate &amp; Download runnable docker-compose.yml"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 9px",
                    borderRadius: 6,
                    background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                    border: `1px solid ${colors.borderSubtle}`,
                    color: colors.text,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: fontSans,
                  }}
                >
                  <Server size={11} />
                  <span>Docker Compose</span>
                </button>

                {/* Download Terraform */}
                <button
                  onClick={handleDownloadTerraform}
                  title="Generate &amp; Download AWS Terraform main.tf"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 9px",
                    borderRadius: 6,
                    background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                    border: `1px solid ${colors.borderSubtle}`,
                    color: colors.text,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: fontSans,
                  }}
                >
                  <Database size={11} />
                  <span>Terraform</span>
                </button>
{/* Open in Canvas */}
                <button
                  onClick={handleOpenInCanvas}
                  title="Open live interactive DAG inside Creatify Whiteboard Canvas"
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
            </div>

            {/* Content Body */}
            <div style={{ padding: "20px 22px 28px", flex: 1 }}>
              
              {/* ── TAB 1: TOPOLOGY (HLD) ── */}
              {activeTab === "topology" && currentData.hld && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  
                  {/* System Header Info */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: colors.text }}>
                          {currentData.title || currentData.systemTitle || "System Architecture Flow"}
                        </span>
                        {(!selectedPreset && (docFile || codeFile)) && (
                          <span style={{ fontSize: 9.5, padding: "1px 6px", borderRadius: 4, background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontWeight: 700 }}>
                            Live Synthesized
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: colors.textMuted }}>
                        {currentData.metrics?.targetQps || "Verified Architecture"} · {currentData.metrics?.haSla || "Active"}
                      </span>
                    </div>

                    
                    {/* View Switcher & Animation Toggle Bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, background: colors.surfaceElevated, padding: 3, borderRadius: 8, border: `1px solid ${colors.borderSubtle}` }}>
                        <button
                          onClick={() => setTopologyView("flow")}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: topologyView === "flow" ? colors.accent : "transparent",
                            color: topologyView === "flow" ? "#ffffff" : colors.textMuted,
                            border: "none",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Network size={12} />
                          <span>Interactive Flow Diagram</span>
                        </button>
                        <button
                          onClick={() => setTopologyView("grid")}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: topologyView === "grid" ? colors.accent : "transparent",
                            color: topologyView === "grid" ? "#ffffff" : colors.textMuted,
                            border: "none",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Layers size={12} />
                          <span>Node Spec Cards</span>
                        </button>
                      </div>

                      {topologyView === "flow" && (
                        <button
                          onClick={() => setFlowAnimation(!flowAnimation)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 9px",
                            borderRadius: 6,
                            background: flowAnimation ? "rgba(225, 73, 109, 0.12)" : "rgba(100, 116, 139, 0.1)",
                            border: `1px solid ${flowAnimation ? "rgba(225, 73, 109, 0.3)" : colors.borderSubtle}`,
                            color: flowAnimation ? colors.accent : colors.textMuted,
                            fontSize: 10.5,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          <Zap size={11} color={flowAnimation ? colors.accent : colors.textMuted} />
                          <span>Packet Flow Animation: {flowAnimation ? "ON" : "OFF"}</span>
                        </button>
                      )}
                    </div>

                    {/* ── 1A: INTERACTIVE ANIMATED SVG FLOW DIAGRAM ── */}
                    {topologyView === "flow" && (
                      <div
                        style={{
                          borderRadius: 12,
                          background: isDark ? "rgba(14, 5, 12, 0.65)" : "#faf8fa",
                          border: `1px solid ${colors.borderSubtle}`,
                          padding: "16px 14px",
                          position: "relative",
                          overflow: "hidden",
                          marginBottom: 16,
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      >
                        {/* Background Grid Accent */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: isDark
                              ? "radial-gradient(rgba(225, 73, 109, 0.08) 1px, transparent 1px)"
                              : "radial-gradient(rgba(148, 41, 69, 0.06) 1px, transparent 1px)",
                            backgroundSize: "16px 16px",
                            pointerEvents: "none",
                          }}
                        />

                        {(() => {
                          const nodes = currentData.hld.nodes || [];
                          const conns = currentData.hld.connections || [];
                          const total = nodes.length;

                          // Compute column stages (4 columns layout)
                          const stages = [[], [], [], []];
                          nodes.forEach((n, idx) => {
                            const r = (n.role + " " + n.name).toLowerCase();
                            if (idx === 0 || r.includes("client") || r.includes("edge") || r.includes("ingress")) {
                              stages[0].push(n);
                            } else if (r.includes("gateway") || r.includes("proxy") || r.includes("router") || r.includes("auth")) {
                              stages[1].push(n);
                            } else if (r.includes("db") || r.includes("database") || r.includes("store") || r.includes("postgres") || r.includes("citus") || r.includes("vector")) {
                              stages[3].push(n);
                            } else {
                              stages[2].push(n);
                            }
                          });

                          // Balance stages if any is empty
                          stages.forEach((st, sIdx) => {
                            if (st.length === 0 && sIdx > 0 && stages[sIdx - 1].length > 2) {
                              st.push(stages[sIdx - 1].pop());
                            }
                          });

                          const colX = [95, 290, 520, 745];
                          const nodeCoords = new Map();

                          stages.forEach((st, sIdx) => {
                            const x = colX[sIdx];
                            const count = st.length || 1;
                            const spacing = 280 / (count + 1);
                            st.forEach((n, nIdx) => {
                              const y = 35 + spacing * (nIdx + 1);
                              nodeCoords.set(n.name, { x, y, node: n });
                              nodeCoords.set(n.id, { x, y, node: n });
                            });
                          });

                          return (
                            <svg
                              viewBox="0 0 850 320"
                              style={{ width: "100%", height: "auto", minHeight: 270, display: "block" }}
                            >
                              <defs>
                                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#e1496d" stopOpacity="0.4" />
                                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                                </linearGradient>
                                <marker
                                  id="arrowEnd"
                                  viewBox="0 0 10 10"
                                  refX="9"
                                  refY="5"
                                  markerWidth="6"
                                  markerHeight="6"
                                  orient="auto-start-reverse"
                                >
                                  <path d="M 0 1 L 9 5 L 0 9 z" fill={isDark ? "#e1496d" : "#c13b5a"} opacity="0.8" />
                                </marker>
                                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                                  <feGaussianBlur stdDeviation="3" result="blur" />
                                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                              </defs>

                              {/* Stage Column Labels */}
                              {["CLIENT / EDGE", "GATEWAY / ROUTING", "CORE COMPUTE / AI", "PERSISTENT STORES"].map((label, i) => (
                                <text
                                  key={i}
                                  x={colX[i]}
                                  y={18}
                                  textAnchor="middle"
                                  fill={colors.textMuted}
                                  fontSize="9"
                                  fontWeight="700"
                                  letterSpacing="0.08em"
                                  opacity="0.65"
                                >
                                  {label}
                                </text>
                              ))}

                              {/* Connections & Animated Flow Particles */}
                              {conns.map((c, cIdx) => {
                                const from = nodeCoords.get(c.from) || { x: 100, y: 150 };
                                const to = nodeCoords.get(c.to) || { x: 740, y: 150 };
                                const isHighlighted = selectedNodeId === from.node?.id || selectedNodeId === to.node?.id;

                                // Cubic Bezier Curve
                                const dx = Math.abs(to.x - from.x) * 0.45;
                                const pathD = `M ${from.x + 65} ${from.y} C ${from.x + 65 + dx} ${from.y}, ${to.x - 65 - dx} ${to.y}, ${to.x - 65} ${to.y}`;

                                return (
                                  <g key={cIdx}>
                                    {/* Background glow path */}
                                    <path
                                      d={pathD}
                                      fill="none"
                                      stroke={isHighlighted ? colors.accent : (isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(148, 41, 69, 0.16)")}
                                      strokeWidth={isHighlighted ? 2.5 : 1.5}
                                      strokeDasharray={isHighlighted ? "none" : "4 3"}
                                      markerEnd="url(#arrowEnd)"
                                      opacity={isHighlighted ? 1 : 0.75}
                                    />

                                    {/* Protocol badge on wire */}
                                    <text
                                      x={(from.x + to.x) / 2}
                                      y={(from.y + to.y) / 2 - 5}
                                      textAnchor="middle"
                                      fill={isHighlighted ? colors.accent : colors.textMuted}
                                      fontSize="8"
                                      fontWeight="600"
                                      fontFamily={fontMono}
                                      opacity="0.85"
                                    >
                                      {c.protocol}
                                    </text>

                                    {/* Animated Flow Particle */}
                                    {flowAnimation && (
                                      <circle r={isHighlighted ? "3.5" : "2.5"} fill={isHighlighted ? "#ffffff" : colors.accent} filter="url(#glowFilter)">
                                        <animateMotion
                                          path={pathD}
                                          dur={`${2.0 + (cIdx % 3) * 0.4}s`}
                                          repeatCount="indefinite"
                                        />
                                      </circle>
                                    )}
                                  </g>
                                );
                              })}

                              {/* Nodes Cards in SVG */}
                              {nodes.map((node) => {
                                const coord = nodeCoords.get(node.id) || nodeCoords.get(node.name) || { x: 100, y: 100 };
                                const isSelected = selectedNodeId === node.id;

                                return (
                                  <g
                                    key={node.id}
                                    transform={`translate(${coord.x}, ${coord.y})`}
                                    onClick={() => setSelectedNodeId(node.id)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {/* Outer Card Body */}
                                    <rect
                                      x="-65"
                                      y="-30"
                                      width="130"
                                      height="60"
                                      rx="8"
                                      fill={isSelected ? (isDark ? "#280b22" : "#ffffff") : (isDark ? "#160714" : "#ffffff")}
                                      stroke={isSelected ? colors.accent : colors.borderSubtle}
                                      strokeWidth={isSelected ? "2" : "1"}
                                      filter={isSelected ? "url(#glowFilter)" : "none"}
                                      style={{ transition: "all 0.2s ease" }}
                                    />

                                    {/* Node Role Badge */}
                                    <text
                                      x="0"
                                      y="-14"
                                      textAnchor="middle"
                                      fill={colors.accent}
                                      fontSize="8"
                                      fontWeight="700"
                                      letterSpacing="0.04em"
                                    >
                                      {node.role.slice(0, 20)}
                                    </text>

                                    {/* Node Name */}
                                    <text
                                      x="0"
                                      y="3"
                                      textAnchor="middle"
                                      fill={colors.text}
                                      fontSize="10"
                                      fontWeight="700"
                                    >
                                      {node.name.length > 18 ? node.name.slice(0, 16) + "…" : node.name}
                                    </text>

                                    {/* Latency & Status pill */}
                                    <text
                                      x="0"
                                      y="19"
                                      textAnchor="middle"
                                      fill="#10b981"
                                      fontSize="8"
                                      fontWeight="600"
                                      fontFamily={fontMono}
                                    >
                                      ⚡ {node.latency}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          );
                        })()}
                      </div>
                    )}

                    {topologyView === "grid" && (
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
                              boxShadow: isSelected ? "0 4px 14px rgba(225, 73, 109, 0.15)" : "none",
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
                  )}
                  </div>

                  {/* ── INTERACTIVE NODE INSPECTOR PANEL ── */}
                  {selectedNode && (
                    <div
                      style={{
                        borderRadius: 10,
                        border: `1px solid ${colors.accent}40`,
                        background: isDark ? "rgba(25, 8, 22, 0.6)" : "rgba(254, 245, 248, 0.7)",
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>
                            {selectedNode.name}
                          </span>
                          <span style={{ fontSize: 9.5, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(225, 73, 109, 0.15)", color: colors.accent }}>
                            {selectedNode.role}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 10.5, fontFamily: fontMono, color: colors.textMuted }}>
                            Tech: <strong style={{ color: colors.text }}>{selectedNode.tech}</strong>
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(selectedNode, null, 2));
                              showToast(`Copied ${selectedNode.name} spec!`);
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              background: "transparent",
                              border: `1px solid ${colors.borderSubtle}`,
                              borderRadius: 4,
                              padding: "2px 7px",
                              fontSize: 10.5,
                              color: colors.textMuted,
                              cursor: "pointer",
                            }}
                          >
                            <Copy size={10} />
                            <span>Copy Spec</span>
                          </button>
                        </div>
                      </div>

                      {/* Node Connections Insight */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                        <div style={{ fontSize: 11, color: colors.textMuted }}>
                          <span style={{ fontWeight: 600, color: colors.text }}>Ingress Flow: </span>
                          {currentData.hld.connections?.filter(c => c.to === selectedNode.name).map(c => `${c.from} (${c.protocol})`).join(", ") || "Edge Entry Point / API Ingress"}
                        </div>
                        <div style={{ fontSize: 11, color: colors.textMuted }}>
                          <span style={{ fontWeight: 600, color: colors.text }}>Egress Pipeline: </span>
                          {currentData.hld.connections?.filter(c => c.from === selectedNode.name).map(c => `${c.to} (${c.protocol})`).join(", ") || "Terminal Data Store"}
                        </div>
                      </div>
                    </div>
                  )}

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
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8" }}>
                            {cls.pattern}
                          </span>
                          <button
                            onClick={() => handleCopyClassContract(cls)}
                            title="Copy TypeScript / Python interface contract"
                            style={{
                              background: "transparent",
                              border: `1px solid ${colors.borderSubtle}`,
                              borderRadius: 4,
                              padding: "2px 6px",
                              cursor: "pointer",
                              color: colors.textMuted,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                            }}
                          >
                            <Copy size={10} />
                            <span>Copy Contract</span>
                          </button>
                        </div>
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", marginBottom: 3 }}>
                          Dependencies &amp; State
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
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 9.5, color: colors.textMuted }}>
                            PK: {t.pk}
                          </span>
                          <button
                            onClick={() => handleCopyDDL(t)}
                            title="Generate and copy SQL DDL table definition"
                            style={{
                              background: "transparent",
                              border: `1px solid ${colors.borderSubtle}`,
                              borderRadius: 4,
                              padding: "2px 6px",
                              cursor: "pointer",
                              color: colors.textMuted,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                            }}
                          >
                            <Copy size={10} />
                            <span>Copy DDL</span>
                          </button>
                        </div>
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
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Compliance Scorecard Banner */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      borderRadius: 10,
                      background: isDark ? "rgba(239, 68, 68, 0.08)" : "rgba(254, 242, 242, 0.8)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>
                          Architecture Compliance Score: {currentData.complianceScore || 78}%
                        </span>
                        <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
                          {currentData.driftIssues.filter(d => d.severity === "CRITICAL").length} Critical Drift
                        </span>
                        <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                          → 100% Projected Post-PR
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
                        Cross-analyzed PRD commitments against real code AST. {currentData.driftIssues.length} remediation patches available.
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={handleDownloadFullPatch}
                        title="Download all fixes as a unified Git .patch file"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: colors.accent,
                          color: "#ffffff",
                          border: "none",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <Download size={11} />
                        <span>Download Remediation PR Patch (.patch)</span>
                      </button>
                    </div>
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
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: issue.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)", color: issue.severity === "CRITICAL" ? "#ef4444" : "#f59e0b" }}>
                            {issue.severity}
                          </span>
                          <button
                            onClick={() => setActiveDiffIssue(issue)}
                            title="View unified side-by-side Git Diff patch"
                            style={{
                              background: "rgba(56, 189, 248, 0.12)",
                              border: "1px solid rgba(56, 189, 248, 0.3)",
                              borderRadius: 4,
                              padding: "2px 8px",
                              cursor: "pointer",
                              color: "#38bdf8",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            <GitBranch size={10} />
                            <span>Inspect PR Diff</span>
                          </button>
                          <button
                            onClick={() => handleCopyRemediation(issue)}
                            title="Copy remediation patch code"
                            style={{
                              background: "transparent",
                              border: `1px solid ${colors.borderSubtle}`,
                              borderRadius: 4,
                              padding: "2px 6px",
                              cursor: "pointer",
                              color: "#10b981",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            <Copy size={10} />
                            <span>Copy Fix</span>
                          </button>
                        </div>
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
              {/* ── TAB 5: REPO AST EXPLORER (CODEBASE ZIP) ── */}
              {activeTab === "ast" && currentData.manifest && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Summary Bar */}
                  <div
                    style={{
                      borderRadius: 10,
                      background: colors.surfaceElevated,
                      border: `1px solid ${colors.borderSubtle}`,
                      padding: "16px 20px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 20,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: colors.accent, letterSpacing: "0.06em" }}>
                        Scanned Codebase Archive
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginTop: 2 }}>
                        {currentData.manifest.archiveName || "Repository"}
                      </div>
                      <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
                        {currentData.manifest.totalFiles} files · {currentData.manifest.totalLinesOfCode?.toLocaleString() || "N/A"} lines of analyzed source code
                      </div>
                    </div>

                    {/* Languages Breakdown */}
                    {currentData.manifest.languages && Object.keys(currentData.manifest.languages).length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: colors.textMuted }}>
                          Language Distribution
                        </div>
                        <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: colors.borderSubtle, gap: 1 }}>
                          {Object.entries(currentData.manifest.languages).map(([lang, pct], idx) => {
                            const langColors = ["#38bdf8", "#10b981", "#f59e0b", "#a855f7", "#e1496d"];
                            return (
                              <div
                                key={lang}
                                style={{
                                  width: `${pct}%`,
                                  background: langColors[idx % langColors.length],
                                }}
                                title={`${lang}: ${pct}%`}
                              />
                            );
                          })}
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {Object.entries(currentData.manifest.languages).map(([lang, pct], idx) => {
                            const langColors = ["#38bdf8", "#10b981", "#f59e0b", "#a855f7", "#e1496d"];
                            return (
                              <div key={lang} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: colors.textMuted }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: langColors[idx % langColors.length] }} />
                                <span>{lang} ({pct}%)</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Detected Stack Badges */}
                  {currentData.manifest.detectedStack && currentData.manifest.detectedStack.length > 0 && (
                    <div style={{ borderRadius: 10, background: colors.surfaceElevated, border: `1px solid ${colors.borderSubtle}`, padding: "14px 18px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.textMuted, marginBottom: 8 }}>
                        Detected Architecture Stack &amp; Frameworks
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {currentData.manifest.detectedStack.map((tech, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "4px 10px",
                              borderRadius: 6,
                              background: "rgba(225, 73, 109, 0.1)",
                              border: "1px solid rgba(225, 73, 109, 0.25)",
                              color: colors.accent,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <Cpu size={11} />
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discovered API Endpoints & Routes */}
                  {currentData.manifest.routes && currentData.manifest.routes.length > 0 && (
                    <div style={{ borderRadius: 10, background: colors.surfaceElevated, border: `1px solid ${colors.borderSubtle}`, padding: "14px 18px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.textMuted, marginBottom: 10 }}>
                        Discovered API Endpoints ({currentData.manifest.routes.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 240, overflowY: "auto" }}>
                        {currentData.manifest.routes.map((r, i) => {
                          const methodColor = r.method === "GET" ? "#10b981" : r.method === "POST" ? "#38bdf8" : r.method === "DELETE" ? "#ef4444" : "#f59e0b";
                          return (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "6px 10px",
                                borderRadius: 6,
                                background: "rgba(0, 0, 0, 0.15)",
                                border: `1px solid ${colors.borderSubtle}`,
                                fontSize: 11.5,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: `${methodColor}20`, color: methodColor, fontFamily: fontMono }}>
                                  {r.method}
                                </span>
                                <span style={{ fontFamily: fontMono, color: colors.text, fontWeight: 600 }}>{r.path}</span>
                              </div>
                              <span style={{ fontSize: 10.5, color: colors.textMuted, fontFamily: fontMono }}>{r.file}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Discovered Database Models */}
                  {currentData.manifest.models && currentData.manifest.models.length > 0 && (
                    <div style={{ borderRadius: 10, background: colors.surfaceElevated, border: `1px solid ${colors.borderSubtle}`, padding: "14px 18px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.textMuted, marginBottom: 10 }}>
                        Discovered Entity Contracts &amp; Models ({currentData.manifest.models.length})
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                        {currentData.manifest.models.map((m, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 7,
                              background: "rgba(0, 0, 0, 0.15)",
                              border: `1px solid ${colors.borderSubtle}`,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", fontFamily: fontMono }}>{m.name}</span>
                              <span style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 3, background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>{m.kind}</span>
                            </div>
                            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, fontFamily: fontMono }}>
                              {m.file}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}


            </div>
          </div>
        </div>
      </div>


      {/* ── UNIFIED GIT DIFF / PR REMEDIATION MODAL ── */}
      {activeDiffIssue && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setActiveDiffIssue(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 680,
              background: isDark ? "#160714" : "#ffffff",
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
              padding: 22,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              color: colors.text,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${colors.borderSubtle}`, paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(56, 189, 248, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GitBranch size={15} color="#38bdf8" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                    PR Remediation: {activeDiffIssue.title}
                  </h3>
                  <div style={{ fontSize: 11, color: colors.textMuted, fontFamily: fontMono, marginTop: 2 }}>
                    git checkout -b fix/arch-{activeDiffIssue.id}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveDiffIssue(null)}
                style={{ background: "transparent", border: "none", color: colors.textMuted, cursor: "pointer", padding: 4 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Spec Promise vs Code Reality */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ padding: "10px 12px", borderRadius: 7, background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", marginBottom: 3 }}>
                  Observed Code Reality
                </div>
                <div style={{ fontSize: 11, fontFamily: fontMono, color: "#f59e0b" }}>
                  {activeDiffIssue.codeEvidence}
                </div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 7, background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#10b981", textTransform: "uppercase", marginBottom: 3 }}>
                  PRD Contract Commitment
                </div>
                <div style={{ fontSize: 11, color: colors.textMuted, fontStyle: "italic" }}>
                  "{activeDiffIssue.prdQuote}"
                </div>
              </div>
            </div>

            {/* Unified Git Diff View */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", marginBottom: 6 }}>
                Unified Patch Diff
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: 14,
                  borderRadius: 8,
                  background: isDark ? "#090208" : "#f1f0f2",
                  border: `1px solid ${colors.borderSubtle}`,
                  fontSize: 11,
                  fontFamily: fontMono,
                  lineHeight: 1.5,
                  overflowX: "auto",
                  maxHeight: 220,
                  color: colors.text,
                }}
              >
                <div style={{ color: colors.textMuted }}>--- a/service.py</div>
                <div style={{ color: colors.textMuted }}>+++ b/service.py</div>
                <div style={{ color: "#38bdf8" }}>@@ -1,5 +1,12 @@</div>
                <div style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)" }}>- // VIOLATION: {activeDiffIssue.codeEvidence}</div>
                <div style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>+ // REMEDIATION: {activeDiffIssue.title}</div>
                <div style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>+ {activeDiffIssue.remediation}</div>
              </pre>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 12 }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateUnifiedPatch(activeDiffIssue));
                  showToast("Copied unified Git diff patch!");
                }}
                style={{
                  padding: "7px 12px",
                  borderRadius: 6,
                  background: colors.surfaceElevated,
                  border: `1px solid ${colors.borderSubtle}`,
                  color: colors.text,
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Copy size={11} />
                <span>Copy Diff Patch</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeDiffIssue.remediation);
                  showToast("Copied remediation code!");
                  setActiveDiffIssue(null);
                }}
                style={{
                  padding: "7px 16px",
                  borderRadius: 6,
                  background: colors.accent,
                  border: "none",
                  color: "#ffffff",
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Apply Fix
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── AI ENGINE CONFIGURATION MODAL ── */}
      {showAiModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setShowAiModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: isDark ? "#1a0818" : "#ffffff",
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              color: colors.text,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${colors.borderSubtle}`, paddingBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(225, 73, 109, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={16} color={colors.accent} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>AI Model Configuration</h3>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>Synthesize architectures with real LLMs</div>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                style={{ background: "transparent", border: "none", color: colors.textMuted, cursor: "pointer", padding: 4 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Provider Selector */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                AI Provider
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { id: "gemini", name: "Google Gemini", sub: "1.5 Flash / Pro" },
                  { id: "openai", name: "OpenAI", sub: "GPT-4o / Mini" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setAiProvider(p.id);
                      setAiModel(p.id === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini");
                      setKeyVerifyStatus(null);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: aiProvider === p.id ? "rgba(225, 73, 109, 0.12)" : colors.surfaceElevated,
                      border: `1px solid ${aiProvider === p.id ? colors.accent : colors.borderSubtle}`,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: aiProvider === p.id ? colors.accent : colors.text }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 10, color: colors.textMuted }}>{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
                  {aiProvider === "gemini" ? "Gemini API Key" : "OpenAI API Key"}
                </label>
                <a
                  href={aiProvider === "gemini" ? "https://aistudio.google.com/app/apikey" : "https://platform.openai.com/api-keys"}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 10.5, color: colors.accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}
                >
                  <span>Get API Key</span>
                  <ExternalLink size={9} />
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showKeyText ? "text" : "password"}
                  value={aiKey}
                  onChange={(e) => {
                    setAiKey(e.target.value);
                    setKeyVerifyStatus(null);
                  }}
                  placeholder={aiProvider === "gemini" ? "AIzaSy..." : "sk-..."}
                  style={{
                    width: "100%",
                    padding: "9px 36px 9px 12px",
                    borderRadius: 7,
                    background: colors.surfaceElevated,
                    border: `1px solid ${colors.borderSubtle}`,
                    color: colors.text,
                    fontSize: 12,
                    fontFamily: fontMono,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: colors.textMuted,
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  {showKeyText ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Model Selector Dropdown */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Model Variant
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 7,
                  background: colors.surfaceElevated,
                  border: `1px solid ${colors.borderSubtle}`,
                  color: colors.text,
                  fontSize: 12,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {aiProvider === "gemini" ? (
                  <>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, Recommended)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                    <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-4o-mini">GPT-4o Mini (Fast &amp; Cost Effective)</option>
                    <option value="gpt-4o">GPT-4o (High Performance)</option>
                  </>
                )}
              </select>
            </div>

            {/* Custom Base URL (Optional) */}
            {aiProvider === "openai" && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Custom Base URL (Optional / Ollama / vLLM)
                </label>
                <input
                  type="text"
                  value={aiBaseUrl}
                  onChange={(e) => setAiBaseUrl(e.target.value)}
                  placeholder="https://api.openai.com/v1 or http://localhost:11434/v1"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 7,
                    background: colors.surfaceElevated,
                    border: `1px solid ${colors.borderSubtle}`,
                    color: colors.text,
                    fontSize: 12,
                    fontFamily: fontMono,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {/* Key Verification Status Feedback */}
            {keyVerifyStatus && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: keyVerifyStatus.valid ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${keyVerifyStatus.valid ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  color: keyVerifyStatus.valid ? "#10b981" : "#ef4444",
                  fontSize: 11.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {keyVerifyStatus.valid ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                <span>{keyVerifyStatus.message}</span>
              </div>
            )}

            <div style={{ fontSize: 10.5, color: colors.textMuted, lineHeight: 1.4 }}>
              🔒 Keys are stored only in your local browser storage. When no key is entered, ArchForge uses the built-in deterministic architecture synthesis engine.
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: 14 }}>
              <button
                type="button"
                onClick={handleVerifyKey}
                disabled={keyVerifyStatus?.checking}
                style={{
                  padding: "7px 12px",
                  borderRadius: 6,
                  background: colors.surfaceElevated,
                  border: `1px solid ${colors.borderSubtle}`,
                  color: colors.text,
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {keyVerifyStatus?.checking ? "Verifying..." : "Test Connection"}
              </button>
              <button
                type="button"
                onClick={handleSaveAiSettings}
                style={{
                  padding: "7px 16px",
                  borderRadius: 6,
                  background: colors.accent,
                  border: "none",
                  color: "#ffffff",
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}