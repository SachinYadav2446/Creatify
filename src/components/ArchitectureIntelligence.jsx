import React, { useState, useMemo } from "react";
import {
  FileText, Code2, ShieldAlert, Cpu, Database, Server,
  ArrowRight, Check, Copy, Download, Upload, RefreshCw, Layers,
  ExternalLink, CheckCircle2, AlertTriangle, Play, Zap, FileCode,
  Network, GitBranch, Terminal, HelpCircle, Eye, FileArchive, ShieldCheck,
  ChevronRight, ArrowUpRight, Sparkles, Activity, Info, X
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

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px", color: isDark ? "#fff" : "#111" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Architecture Intelligence Studio</h1>
        <p style={{ color: "#9ca3af", marginTop: 8 }}>Automated HLD, LLD, and ERD system architecture engineering from PRDs and source code.</p>
      </div>
    </div>
  );
}
