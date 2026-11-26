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
