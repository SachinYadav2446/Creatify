import React, { useState, useMemo } from "react";
import {
  Calculator, Zap, Database, Server, HardDrive, Cpu, DollarSign,
  Layers, ArrowRight, Check, Copy, Download, RefreshCw, Sparkles,
  TrendingUp, Shield, Activity, Share2, Globe, Clock, BarChart3,
  Sliders, FileText, ChevronRight, HelpCircle, AlertTriangle, ExternalLink,
  ChevronDown, Flame
} from "lucide-react";

// Real-world System Design Presets
const PRESETS = {
  youtube: {
    id: "youtube",
    name: "YouTube / Netflix",
    tagline: "Video streaming & high egress",
    badge: "100:1 Read Heavy",
    color: "#e1496d",
    icon: "🎬",
    dau: 100000000,
    readsPerUser: 8,
    writesPerUser: 0.05,
    readPayloadKb: 1200,
    writePayloadKb: 80000,
    cdnOffloadPct: 92,
    peakMultiplier: 2.5,
    retentionYears: 5,
    replicationFactor: 3,
    storageOverheadPct: 20,
    cachePct: 20,
    cacheTtlHours: 24,
    qpsPerCore: 150,
  },
  twitter: {
    id: "twitter",
    name: "Twitter / X Feed",
    tagline: "High QPS timeline fanout",
    badge: "50:1 Read Heavy",
    color: "#38bdf8",
    icon: "🐦",
    dau: 50000000,
    readsPerUser: 30,
    writesPerUser: 1.5,
    readPayloadKb: 20,
    writePayloadKb: 4,
    cdnOffloadPct: 75,
    peakMultiplier: 3.0,
    retentionYears: 5,
    replicationFactor: 3,
    storageOverheadPct: 25,
    cachePct: 20,
    cacheTtlHours: 12,
    qpsPerCore: 300,
  },
  uber: {
    id: "uber",
    name: "Uber / Lyft Dispatch",
    tagline: "Real-time geo telemetry",
    badge: "5:1 Write Heavy",
    color: "#10b981",
    icon: "🚗",
    dau: 15000000,
    readsPerUser: 40,
    writesPerUser: 60,
    readPayloadKb: 6,
    writePayloadKb: 2,
    cdnOffloadPct: 15,
    peakMultiplier: 3.5,
    retentionYears: 1,
    replicationFactor: 3,
    storageOverheadPct: 15,
    cachePct: 35,
    cacheTtlHours: 2,
    qpsPerCore: 400,
  },
  stripe: {
    id: "stripe",
    name: "Stripe Payments",
    tagline: "Strict consistency & ACID",
    badge: "1:1 Balanced",
    color: "#a855f7",
    icon: "💳",
    dau: 5000000,
    readsPerUser: 6,
    writesPerUser: 3,
    readPayloadKb: 8,
    writePayloadKb: 8,
    cdnOffloadPct: 10,
    peakMultiplier: 3.0,
    retentionYears: 7,
    replicationFactor: 4,
    storageOverheadPct: 30,
    cachePct: 15,
    cacheTtlHours: 6,
    qpsPerCore: 100,
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp / Discord",
    tagline: "WebSocket persistent chat",
    badge: "High Concurrency",
    color: "#22c55e",
    icon: "💬",
    dau: 200000000,
    readsPerUser: 60,
    writesPerUser: 40,
    readPayloadKb: 3,
    writePayloadKb: 3,
    cdnOffloadPct: 40,
    peakMultiplier: 2.5,
    retentionYears: 3,
    replicationFactor: 3,
    storageOverheadPct: 20,
    cachePct: 15,
    cacheTtlHours: 24,
    qpsPerCore: 500,
  },
  flashsale: {
    id: "flashsale",
    name: "Flash Sale / E-Com",
    tagline: "Sudden 8× traffic spikes",
    badge: "High Spike",
    color: "#f59e0b",
    icon: "🛍️",
    dau: 20000000,
    readsPerUser: 40,
    writesPerUser: 3,
    readPayloadKb: 25,
    writePayloadKb: 10,
    cdnOffloadPct: 90,
    peakMultiplier: 8.0,
    retentionYears: 2,
    replicationFactor: 3,
    storageOverheadPct: 25,
    cachePct: 25,
    cacheTtlHours: 12,
    qpsPerCore: 200,
  },
};

export default function CapacityCalculator({ onNavigate, isDark = true, THEME }) {
  const [activePreset, setActivePreset] = useState("youtube");
  const [activeSection, setActiveSection] = useState("traffic");
  const [copiedRfc, setCopiedRfc] = useState(false);

  // Core Editable Mathematical Parameters
  const [dau, setDau] = useState(PRESETS.youtube.dau);
  const [readsPerUser, setReadsPerUser] = useState(PRESETS.youtube.readsPerUser);
  const [writesPerUser, setWritesPerUser] = useState(PRESETS.youtube.writesPerUser);
  const [readPayloadKb, setReadPayloadKb] = useState(PRESETS.youtube.readPayloadKb);
  const [writePayloadKb, setWritePayloadKb] = useState(PRESETS.youtube.writePayloadKb);
  const [cdnOffloadPct, setCdnOffloadPct] = useState(PRESETS.youtube.cdnOffloadPct);
  const [peakMultiplier, setPeakMultiplier] = useState(PRESETS.youtube.peakMultiplier);
  const [retentionYears, setRetentionYears] = useState(PRESETS.youtube.retentionYears);
  const [replicationFactor, setReplicationFactor] = useState(PRESETS.youtube.replicationFactor);
  const [storageOverheadPct, setStorageOverheadPct] = useState(PRESETS.youtube.storageOverheadPct);
  const [cachePct, setCachePct] = useState(PRESETS.youtube.cachePct);
  const [cacheTtlHours, setCacheTtlHours] = useState(PRESETS.youtube.cacheTtlHours);
  const [qpsPerCore, setQpsPerCore] = useState(PRESETS.youtube.qpsPerCore);

  // Apply a Preset
  const applyPreset = (presetKey) => {
    setActivePreset(presetKey);
    const p = PRESETS[presetKey];
    if (!p) return;
    setDau(p.dau);
    setReadsPerUser(p.readsPerUser);
    setWritesPerUser(p.writesPerUser);
    setReadPayloadKb(p.readPayloadKb);
    setWritePayloadKb(p.writePayloadKb);
    setCdnOffloadPct(p.cdnOffloadPct);
    setPeakMultiplier(p.peakMultiplier);
    setRetentionYears(p.retentionYears);
    setReplicationFactor(p.replicationFactor);
    setStorageOverheadPct(p.storageOverheadPct);
    setCachePct(p.cachePct);
    setCacheTtlHours(p.cacheTtlHours);
    setQpsPerCore(p.qpsPerCore);
  };

  // Human-Friendly Unit Formatters
  const fmt = (num) => {
    if (!num || isNaN(num) || num <= 0) return "0";
    if (num >= 1000000000000) return (num / 1000000000000).toFixed(1) + "T";
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return Math.round(num).toLocaleString();
  };

  const fmtBytes = (gb) => {
    if (!gb || isNaN(gb) || gb <= 0) return "0 GB";
    if (gb >= 1048576) return (gb / 1048576).toFixed(1) + " PB";
    if (gb >= 1024) return (gb / 1024).toFixed(1) + " TB";
    return gb.toFixed(1) + " GB";
  };

  const fmtCurrency = (val) => {
    if (!val || isNaN(val) || val <= 0) return "$0";
    if (val >= 1000000000) return "$" + (val / 1000000000).toFixed(1) + "B";
    if (val >= 1000000) return "$" + (val / 1000000).toFixed(1) + "M";
    if (val >= 1000) return "$" + (val / 1000).toFixed(1) + "K";
    return "$" + Math.round(val).toLocaleString();
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL EQUATIONS ENGINE
  // ══════════════════════════════════════════════════════════════════════════════
  const math = useMemo(() => {
    const SECONDS_PER_DAY = 86400;

    // 1. Throughput & QPS Math
    const totalDailyReads = dau * readsPerUser;
    const totalDailyWrites = dau * writesPerUser;
    const totalDailyRequests = totalDailyReads + totalDailyWrites;

    const avgReadQps = Math.round(totalDailyReads / SECONDS_PER_DAY);
    const avgWriteQps = Math.round(totalDailyWrites / SECONDS_PER_DAY);
    const avgTotalQps = avgReadQps + avgWriteQps;

    const peakReadQps = Math.round(avgReadQps * peakMultiplier);
    const peakWriteQps = Math.round(avgWriteQps * peakMultiplier);
    const peakTotalQps = Math.round(avgTotalQps * peakMultiplier);

    const readWriteRatio = writesPerUser > 0 ? (readsPerUser / writesPerUser).toFixed(1) : "∞";

    // 2. Bandwidth & Network Math
    const writeBytesPerSec = avgWriteQps * writePayloadKb * 1024;
    const ingressMbps = (writeBytesPerSec * 8) / (1024 * 1024);
    const peakIngressMbps = ingressMbps * peakMultiplier;

    const totalReadBytesPerSec = avgReadQps * readPayloadKb * 1024;
    const originEgressRatio = (100 - cdnOffloadPct) / 100;
    const originEgressBytesPerSec = totalReadBytesPerSec * originEgressRatio;

    const totalEgressGbps = (totalReadBytesPerSec * 8) / (1024 * 1024 * 1024);
    const originEgressGbps = (originEgressBytesPerSec * 8) / (1024 * 1024 * 1024);
    const peakOriginEgressGbps = originEgressGbps * peakMultiplier;

    const monthlyTotalEgressTb = ((totalReadBytesPerSec * SECONDS_PER_DAY * 30.5) / (1024 ** 4)).toFixed(1);
    const monthlyOriginEgressTb = ((originEgressBytesPerSec * SECONDS_PER_DAY * 30.5) / (1024 ** 4)).toFixed(1);

    // 3. Storage Growth Math
    const dailyRawStorageBytes = totalDailyWrites * writePayloadKb * 1024;
    const dailyRawStorageGb = dailyRawStorageBytes / (1024 ** 3);
    const annualRawStorageGb = dailyRawStorageGb * 365;

    const multiplierWithReplication = replicationFactor * (1 + storageOverheadPct / 100);
    const year1UsableStorageGb = annualRawStorageGb * multiplierWithReplication;
    const year3UsableStorageGb = annualRawStorageGb * 3 * multiplierWithReplication;
    const year5UsableStorageGb = annualRawStorageGb * 5 * multiplierWithReplication;

    const recommendedDbShards = Math.max(1, Math.ceil(year1UsableStorageGb / 500));

    // 4. Memory & Cache Sizing Math
    const dailyHotReadsCount = totalDailyReads * (cachePct / 100);
    const ttlFactor = cacheTtlHours / 24;
    const rawCacheSizeBytes = dailyHotReadsCount * ttlFactor * readPayloadKb * 1024;
    const rawCacheSizeGb = rawCacheSizeBytes / (1024 ** 3);
    const safeCacheRamGb = Math.ceil(rawCacheSizeGb * 1.25);

    const redisNodeCount = Math.max(2, Math.ceil(safeCacheRamGb / 26));

    // 5. Compute & Server Cluster Sizing Math
    const totalPeakQpsTarget = peakTotalQps;
    const requiredCpuCores = Math.ceil(totalPeakQpsTarget / qpsPerCore);
    const activeAppNodes = Math.max(2, Math.ceil(requiredCpuCores / 8));
    const totalHaAppNodes = activeAppNodes + 2;

    // 6. Estimated Monthly Cloud Cost Breakdown
    const computeCost = totalHaAppNodes * 140;
    const dbStorageCost = Math.round(year1UsableStorageGb * 0.08);
    const redisCacheCost = redisNodeCount * 165;
    const egressCost = Math.round(parseFloat(monthlyOriginEgressTb) * 1024 * 0.05);
    const totalMonthlyCost = computeCost + dbStorageCost + redisCacheCost + egressCost;

    return {
      totalDailyReads,
      totalDailyWrites,
      totalDailyRequests,
      avgReadQps,
      avgWriteQps,
      avgTotalQps,
      peakReadQps,
      peakWriteQps,
      peakTotalQps,
      readWriteRatio,
      ingressMbps: ingressMbps.toFixed(1),
      peakIngressMbps: peakIngressMbps.toFixed(1),
      totalEgressGbps: totalEgressGbps.toFixed(2),
      originEgressGbps: originEgressGbps.toFixed(2),
      peakOriginEgressGbps: peakOriginEgressGbps.toFixed(2),
      monthlyTotalEgressTb,
      monthlyOriginEgressTb,
      dailyRawStorageGb: dailyRawStorageGb.toFixed(1),
      year1UsableStorageGb,
      year3UsableStorageGb,
      year5UsableStorageGb,
      recommendedDbShards,
      safeCacheRamGb,
      redisNodeCount,
      requiredCpuCores,
      activeAppNodes,
      totalHaAppNodes,
      computeCost,
      dbStorageCost,
      redisCacheCost,
      egressCost,
      totalMonthlyCost,
    };
  }, [
    dau, readsPerUser, writesPerUser, readPayloadKb, writePayloadKb,
    cdnOffloadPct, peakMultiplier, retentionYears, replicationFactor,
    storageOverheadPct, cachePct, cacheTtlHours, qpsPerCore
  ]);

  // Generate RFC Markdown Document
  const rfcMarkdown = `
# System Design RFC: ${PRESETS[activePreset]?.name || "Custom Architecture"} Capacity Plan

## 1. Executive Summary & Load Profile
- **Daily Active Users (DAU)**: ${fmt(dau)}
- **Read : Write Traffic Ratio**: ${math.readWriteRatio} : 1
- **Average QPS**: ${fmt(math.avgTotalQps)} requests/sec (${fmt(math.avgReadQps)} Read / ${fmt(math.avgWriteQps)} Write)
- **Peak Target Throughput (${peakMultiplier}× Spike)**: **${fmt(math.peakTotalQps)} Peak QPS**

## 2. Bandwidth & Network Throughput
- **Origin Ingress (Writes)**: ${math.ingressMbps} Mbps (Peak: ${math.peakIngressMbps} Mbps)
- **Origin Egress (Reads)**: ${math.originEgressGbps} Gbps (${cdnOffloadPct}% Edge CDN Offload)
- **Monthly Data Transfer**: ${math.monthlyTotalEgressTb} TB/month (${math.monthlyOriginEgressTb} TB from origin)

## 3. Database Storage & Multi-Year Growth
- **Daily Ingestion Rate**: ${fmtBytes(parseFloat(math.dailyRawStorageGb))} / day
- **1-Year Usable Storage (${replicationFactor}× HA + ${storageOverheadPct}% Indexing)**: **${fmtBytes(math.year1UsableStorageGb)}**
- **5-Year Projected Total**: **${fmtBytes(math.year5UsableStorageGb)}**
- **Recommended Shard Count**: ${fmt(math.recommendedDbShards)} Database Shards

## 4. In-Memory Cache Sizing (80/20 Rule)
- **Cache Strategy**: ${cachePct}% hot working set with ${cacheTtlHours}h TTL
- **Target RAM (with 25% safety margin)**: **${fmtBytes(math.safeCacheRamGb)}**
- **Cluster Recommendation**: ${fmt(math.redisNodeCount)} × \`cache.r6g.xlarge\` Redis nodes

## 5. Compute Infrastructure & Monthly Cloud Estimate
- **Active Backend Nodes**: ${math.totalHaAppNodes} × 8-Core Nodes (N+2 HA Redundancy)
- **Estimated Total Monthly Cloud Bill**: **${fmtCurrency(math.totalMonthlyCost)} / month**
  - Compute Instances: ${fmtCurrency(math.computeCost)}
  - Database Storage: ${fmtCurrency(math.dbStorageCost)}
  - In-Memory Cache: ${fmtCurrency(math.redisCacheCost)}
  - Egress Bandwidth: ${fmtCurrency(math.egressCost)}
`.trim();

  const handleCopyRfc = () => {
    navigator.clipboard.writeText(rfcMarkdown);
    setCopiedRfc(true);
    setTimeout(() => setCopiedRfc(false), 2000);
  };

  const colors = {
    bg: isDark ? "#090207" : "#f8f6fb",
    studioBg: isDark ? "rgba(22, 7, 19, 0.96)" : "#ffffff",
    border: isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(148, 41, 69, 0.12)",
    text: isDark ? "#ffffff" : "#19040e",
    textMuted: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(25, 4, 14, 0.68)",
    accent: "#e1496d",
    activeNavBg: isDark ? "rgba(225, 73, 109, 0.16)" : "rgba(225, 73, 109, 0.1)",
    inputBg: isDark ? "rgba(14, 4, 12, 0.85)" : "rgba(245, 240, 245, 0.85)",
  };

  const fontSans = "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const fontMono = "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace";

  const NAV_ITEMS = [
    { id: "traffic", label: "Traffic & QPS", icon: Zap, stat: `${fmt(math.peakTotalQps)} QPS` },
    { id: "bandwidth", label: "Bandwidth & CDN", icon: Globe, stat: `${math.originEgressGbps} Gbps` },
    { id: "storage", label: "Storage & Sharding", icon: HardDrive, stat: fmtBytes(math.year5UsableStorageGb) },
    { id: "cache", label: "Memory & Cache", icon: Database, stat: `${fmtBytes(math.safeCacheRamGb)} RAM` },
    { id: "compute", label: "Compute & Costs", icon: Cpu, stat: `${fmtCurrency(math.totalMonthlyCost)}/mo` },
    { id: "rfc", label: "RFC Specification", icon: FileText, stat: "Markdown" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background: isDark
          ? "linear-gradient(180deg, #090207 0%, #150512 35%, #0c0309 100%)"
          : "linear-gradient(180deg, #f8f6fb 0%, #fdf2f7 35%, #f8f6fb 100%)",
        color: colors.text,
        fontFamily: fontSans,
        padding: "32px 24px 80px",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .sizing-studio-container {
          display: grid;
          grid-template-columns: 260px 1fr 340px;
          gap: 0;
          background: ${colors.studioBg};
          border: 1.5px solid ${colors.border};
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.08);
          min-height: 640px;
        }
        @media (max-width: 1180px) {
          .sizing-studio-container {
            grid-template-columns: 240px 1fr;
          }
          .sizing-studio-right-panel {
            grid-column: span 2;
            border-top: 1px solid ${colors.border};
            border-left: none !important;
          }
        }
        @media (max-width: 800px) {
          .sizing-studio-container {
            grid-template-columns: 1fr;
          }
          .sizing-studio-right-panel {
            grid-column: span 1;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        
        {/* ── TOP HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: colors.accent, fontFamily: fontSans }}>
                ✦ Capacity Engineering Studio
              </span>
            </div>
            <h1 style={{ fontFamily: fontSans, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
              System Design Capacity Calculator<span style={{ color: colors.accent }}>.</span>
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleCopyRfc}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 10,
                background: isDark ? "rgba(225, 73, 109, 0.14)" : "rgba(225, 73, 109, 0.08)",
                border: `1.5px solid ${colors.accent}40`,
                color: isDark ? "#ff8da7" : "#9f1239",
                fontFamily: fontSans,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {copiedRfc ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedRfc ? "Copied!" : "Copy RFC"}</span>
            </button>

            <button
              onClick={() => onNavigate("whiteboard")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #e1496d, #be123c)",
                border: "none",
                color: "#ffffff",
                fontFamily: fontSans,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(225, 73, 109, 0.35)",
              }}
            >
              <ExternalLink size={14} />
              <span>Canvas</span>
            </button>
          </div>
        </div>

        {/* ── UNIFIED SIZING STUDIO CONTAINER (SIDEBAR + MAIN + PROOF PANEL) ── */}
        <div className="sizing-studio-container">
          
          {/* 1. LEFT SIDEBAR NAVIGATION */}
          <div
            style={{
              padding: "20px 16px",
              borderRight: `1px solid ${colors.border}`,
              background: isDark ? "rgba(16, 5, 14, 0.6)" : "rgba(250, 246, 250, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div>
              {/* Preset Selector */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: colors.textMuted, fontFamily: fontSans, display: "block", marginBottom: 8 }}>
                  Reference Preset
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {Object.values(PRESETS).map((p) => {
                    const isSelected = activePreset === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => applyPreset(p.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: 8,
                          background: isSelected ? colors.activeNavBg : "transparent",
                          border: isSelected ? `1.5px solid ${colors.accent}` : "1.5px solid transparent",
                          color: isSelected ? colors.text : colors.textMuted,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                          fontFamily: fontSans,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontSize: 14 }}>{p.icon}</span>
                          <span style={{ fontSize: 12.5, fontWeight: isSelected ? 700 : 500 }}>
                            {p.name.split(" ")[0]}
                          </span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: `${p.color}20`, color: p.color }}>
                          {p.badge.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizing Module Nav Links */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: colors.textMuted, fontFamily: fontSans, display: "block", marginBottom: 8 }}>
                  Sizing Modules
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "9px 12px",
                          borderRadius: 10,
                          background: isSelected ? colors.activeNavBg : "transparent",
                          border: isSelected ? `1.5px solid ${colors.accent}` : "1.5px solid transparent",
                          color: isSelected ? colors.accent : colors.textMuted,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                          fontFamily: fontSans,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon size={14} color={isSelected ? colors.accent : colors.textMuted} />
                          <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500 }}>
                            {item.label}
                          </span>
                        </div>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: isSelected ? colors.accent : colors.textMuted, fontVariantNumeric: "tabular-nums" }}>
                          {item.stat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stat Pill */}
            <div style={{ padding: "12px", borderRadius: 10, background: isDark ? "rgba(225,73,109,0.08)" : "rgba(225,73,109,0.05)", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: colors.accent, textTransform: "uppercase", fontFamily: fontSans }}>
                Target Throughput
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: fontSans, color: colors.text, marginTop: 2 }}>
                {fmt(math.peakTotalQps)} <span style={{ fontSize: 11.5, fontWeight: 500, color: colors.textMuted }}>Peak QPS</span>
              </div>
            </div>
          </div>

          {/* 2. CENTER INTERACTIVE SLIDERS WORKBENCH */}
          <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            
            {/* MODULE: TRAFFIC & QPS */}
            {activeSection === "traffic" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <h3 style={{ fontFamily: fontSans, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
                    1. Traffic &amp; QPS Throughput
                  </h3>
                  <p style={{ fontSize: 13.5, color: colors.textMuted, margin: 0 }}>
                    Configure daily active users, actions per user, and peak surge multipliers.
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Daily Active Users (DAU)</label>
                    <span style={{ fontSize: 14, fontWeight: 700, color: colors.accent }}>{fmt(dau)}</span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={1000000000}
                    step={500000}
                    value={dau}
                    onChange={(e) => setDau(Number(e.target.value))}
                    style={{ width: "100%", accentColor: colors.accent }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {[1000000, 10000000, 50000000, 100000000, 500000000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setDau(v)}
                        style={{
                          fontSize: 11.5,
                          padding: "4px 9px",
                          borderRadius: 6,
                          background: dau === v ? colors.accent : colors.inputBg,
                          color: dau === v ? "#fff" : colors.textMuted,
                          border: "none",
                          cursor: "pointer",
                          fontFamily: fontSans,
                          fontWeight: 500,
                        }}
                      >
                        {fmt(v)}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Reads / User / Day</label>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#38bdf8" }}>{readsPerUser}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={200}
                      value={readsPerUser}
                      onChange={(e) => setReadsPerUser(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#38bdf8" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Writes / User / Day</label>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#10b981" }}>{writesPerUser}</span>
                    </div>
                    <input
                      type="range"
                      min={0.01}
                      max={100}
                      step={0.1}
                      value={writesPerUser}
                      onChange={(e) => setWritesPerUser(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#10b981" }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Peak Traffic Surge Multiplier</label>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#f59e0b" }}>{peakMultiplier}×</span>
                  </div>
                  <input
                    type="range"
                    min={1.5}
                    max={12}
                    step={0.5}
                    value={peakMultiplier}
                    onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#f59e0b" }}
                  />
                  <span style={{ fontSize: 12, color: colors.textMuted, marginTop: 4, display: "block" }}>
                    Standard daily peak: 2×–3× • Flash Sales / Live Events: 6×–10×
                  </span>
                </div>
              </div>
            )}

            {/* MODULE: BANDWIDTH */}
            {activeSection === "bandwidth" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <h3 style={{ fontFamily: fontSans, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
                    2. Bandwidth &amp; CDN Offload
                  </h3>
                  <p style={{ fontSize: 13.5, color: colors.textMuted, margin: 0 }}>
                    Payload sizes, origin network egress, and edge CDN cache offload.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Read Payload</label>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#38bdf8" }}>{readPayloadKb} KB</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10000}
                      step={10}
                      value={readPayloadKb}
                      onChange={(e) => setReadPayloadKb(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#38bdf8" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Write Payload</label>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#10b981" }}>{writePayloadKb} KB</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={200000}
                      step={100}
                      value={writePayloadKb}
                      onChange={(e) => setWritePayloadKb(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#10b981" }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Edge CDN Cache Offload</label>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: colors.accent }}>{cdnOffloadPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={98}
                    value={cdnOffloadPct}
                    onChange={(e) => setCdnOffloadPct(Number(e.target.value))}
                    style={{ width: "100%", accentColor: colors.accent }}
                  />
                  <span style={{ fontSize: 12, color: colors.textMuted, marginTop: 4, display: "block" }}>
                    Origin servers only process {100 - cdnOffloadPct}% of read egress traffic.
                  </span>
                </div>
              </div>
            )}

            {/* MODULE: STORAGE */}
            {activeSection === "storage" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <h3 style={{ fontFamily: fontSans, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
                    3. Storage Growth &amp; Sharding
                  </h3>
                  <p style={{ fontSize: 13.5, color: colors.textMuted, margin: 0 }}>
                    Multi-year retention, replica replication, and database shard sizing.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Retention Period</label>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#10b981" }}>{retentionYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={retentionYears}
                      onChange={(e) => setRetentionYears(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#10b981" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>HA Replication Factor</label>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#a855f7" }}>{replicationFactor}× Replicas</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={replicationFactor}
                      onChange={(e) => setReplicationFactor(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#a855f7" }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>DB Indexing &amp; Log Overhead</label>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#f59e0b" }}>{storageOverheadPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={storageOverheadPct}
                    onChange={(e) => setStorageOverheadPct(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#f59e0b" }}
                  />
                </div>
              </div>
            )}

            {/* MODULE: CACHE */}
            {activeSection === "cache" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <h3 style={{ fontFamily: fontSans, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
                    4. Memory &amp; Redis Cache Sizing
                  </h3>
                  <p style={{ fontSize: 13.5, color: colors.textMuted, margin: 0 }}>
                    Pareto 80/20 rule, working set TTL, and cluster node sizing.
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Hot Data Working Set (Pareto 80/20)</label>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#a855f7" }}>{cachePct}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={cachePct}
                    onChange={(e) => setCachePct(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#a855f7" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Cache Time-To-Live (TTL)</label>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#38bdf8" }}>{cacheTtlHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={72}
                    value={cacheTtlHours}
                    onChange={(e) => setCacheTtlHours(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#38bdf8" }}
                  />
                </div>
              </div>
            )}

            {/* MODULE: COMPUTE */}
            {activeSection === "compute" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <h3 style={{ fontFamily: fontSans, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
                    5. Compute Cluster &amp; Cost Estimation
                  </h3>
                  <p style={{ fontSize: 13.5, color: colors.textMuted, margin: 0 }}>
                    CPU core capacity, HA instances, and cloud bill breakdown.
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Throughput Capacity per CPU Core</label>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#f59e0b" }}>{qpsPerCore} QPS / Core</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={1000}
                    step={10}
                    value={qpsPerCore}
                    onChange={(e) => setQpsPerCore(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#f59e0b" }}
                  />
                </div>
              </div>
            )}

            {/* MODULE: RFC SPECIFICATION */}
            {activeSection === "rfc" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontFamily: fontSans, fontSize: 18, fontWeight: 700, margin: 0 }}>
                    6. RFC Specification Document
                  </h3>
                  <button
                    onClick={handleCopyRfc}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 8,
                      background: colors.accent,
                      color: "#fff",
                      border: "none",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontFamily: fontSans,
                    }}
                  >
                    {copiedRfc ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedRfc ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={rfcMarkdown}
                  style={{
                    width: "100%",
                    height: "320px",
                    background: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: "14px",
                    color: colors.text,
                    fontSize: 12.5,
                    fontFamily: fontMono,
                    lineHeight: 1.55,
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>

          {/* 3. RIGHT PANEL: LIVE MATHEMATICAL PROOF & CLOUD METRICS */}
          <div
            className="sizing-studio-right-panel"
            style={{
              padding: "24px 20px",
              borderLeft: `1px solid ${colors.border}`,
              background: isDark ? "rgba(16, 5, 14, 0.4)" : "rgba(250, 246, 250, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${colors.border}`, paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Activity size={15} color={colors.accent} />
                <span style={{ fontFamily: fontSans, fontSize: 13.5, fontWeight: 700 }}>
                  Mathematical Proof
                </span>
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                Auto-Calibrated
              </span>
            </div>

            {/* Metric 1: QPS */}
            <div style={{ padding: "10px 12px", borderRadius: 10, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.accent, marginBottom: 2, fontFamily: fontSans }}>
                ⚡ QPS Throughput
              </div>
              <div style={{ fontSize: 12, fontFamily: fontMono, color: colors.text }}>
                Avg QPS = <strong>{fmt(math.avgTotalQps)} QPS</strong>
              </div>
              <div style={{ fontSize: 12, fontFamily: fontMono, color: colors.accent }}>
                Peak ({peakMultiplier}×) = <strong>{fmt(math.peakTotalQps)} Peak QPS</strong>
              </div>
            </div>

            {/* Metric 2: Bandwidth */}
            <div style={{ padding: "10px 12px", borderRadius: 10, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", marginBottom: 2, fontFamily: fontSans }}>
                🌐 Network Egress
              </div>
              <div style={{ fontSize: 12, fontFamily: fontMono, color: colors.text }}>
                Ingress = <strong>{math.ingressMbps} Mbps</strong>
              </div>
              <div style={{ fontSize: 12, fontFamily: fontMono, color: "#38bdf8" }}>
                Origin Egress = <strong>{math.originEgressGbps} Gbps</strong>
              </div>
            </div>

            {/* Metric 3: Storage */}
            <div style={{ padding: "10px 12px", borderRadius: 10, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", marginBottom: 2, fontFamily: fontSans }}>
                💾 5-Year Storage
              </div>
              <div style={{ fontSize: 12, fontFamily: fontMono, color: colors.text }}>
                Daily = <strong>{fmtBytes(parseFloat(math.dailyRawStorageGb))} / day</strong>
              </div>
              <div style={{ fontSize: 12, fontFamily: fontMono, color: "#10b981" }}>
                5-Yr Usable = <strong>{fmtBytes(math.year5UsableStorageGb)}</strong> ({fmt(math.recommendedDbShards)} Shards)
              </div>
            </div>

            {/* Metric 4: Cache */}
            <div style={{ padding: "10px 12px", borderRadius: 10, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", marginBottom: 2, fontFamily: fontSans }}>
                🧠 Memory Cache (80/20)
              </div>
              <div style={{ fontSize: 12, fontFamily: fontMono, color: "#a855f7" }}>
                Target RAM = <strong>{fmtBytes(math.safeCacheRamGb)}</strong> ({fmt(math.redisNodeCount)} × Redis Nodes)
              </div>
            </div>

            {/* Metric 5: Estimated Monthly Cloud Bill */}
            <div style={{ padding: "12px 14px", borderRadius: 12, background: isDark ? "rgba(225,73,109,0.12)" : "rgba(225,73,109,0.06)", border: `1.5px solid ${colors.accent}40`, marginTop: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: fontSans, color: colors.accent }}>
                  EST. CLOUD BILL
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: fontSans, color: colors.accent }}>
                  {fmtCurrency(math.totalMonthlyCost)}/mo
                </span>
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>
                Compute, Storage, Redis &amp; Egress
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
