import React, { useState } from "react";
import { 
  Calculator, ArrowLeft, Cpu, Database, HardDrive, Wifi, Server,
  Sparkles, Layers, RefreshCw, Copy, Check, Info, ShieldCheck, Zap
} from "lucide-react";

export default function CapacityCalculator({ onBack, onNavigate, isDark = false, THEME }) {
  // Input parameters for capacity math
  const [dau, setDau] = useState(10000000); // 10M DAU
  const [requestsPerUser, setRequestsPerUser] = useState(25); // 25 actions/user/day
  const [readWriteRatio, setReadWriteRatio] = useState(10); // 10:1 Read to Write ratio
  const [avgPayloadKb, setAvgPayloadKb] = useState(8); // 8 KB average payload
  const [peakMultiplier, setPeakMultiplier] = useState(2.5); // 2.5x Peak load factor
  const [retentionYears, setRetentionYears] = useState(5); // 5 Years storage
  const [copied, setCopied] = useState(false);

  // Calculations
  const totalDailyRequests = dau * requestsPerUser;
  const avgQps = Math.round(totalDailyRequests / 86400);
  const peakQps = Math.round(avgQps * peakMultiplier);
  
  // Reads vs Writes
  const writeQps = Math.round(avgQps / (readWriteRatio + 1));
  const readQps = Math.round(writeQps * readWriteRatio);
  
  // Bandwidth
  const dailyBandwidthGb = (totalDailyRequests * avgPayloadKb) / (1024 * 1024);
  const avgBandwidthMbps = ((avgQps * avgPayloadKb * 8) / 1024).toFixed(2);
  const peakBandwidthGbps = (((peakQps * avgPayloadKb * 8) / 1024) / 1024).toFixed(3);

  // Storage
  const dailyStorageGb = (totalDailyRequests * (1 / (readWriteRatio + 1)) * avgPayloadKb) / (1024 * 1024);
  const annualStorageTb = ((dailyStorageGb * 365) / 1024).toFixed(2);
  const totalStorageTb = (parseFloat(annualStorageTb) * retentionYears).toFixed(2);

  // Memory Cache (80/20 Rule: 20% of daily read data cached in Redis)
  const memoryCacheGb = ((dailyBandwidthGb * 0.20)).toFixed(1);

  // Estimated Infrastructure Nodes (Assume 1 server handles ~1,500 peak QPS)
  const appServersNeeded = Math.max(2, Math.ceil(peakQps / 1500));
  const redisNodesNeeded = Math.max(2, Math.ceil(parseFloat(memoryCacheGb) / 64)); // 64GB RAM nodes
  const dbReplicasNeeded = Math.max(2, Math.ceil(readQps / 4000)); // 1 Primary + N Read Replicas

  const copySummary = () => {
    const summaryText = `--- System Design Capacity Planning Estimate ---
• Daily Active Users (DAU): ${(dau / 1e6).toFixed(1)}M
• Average QPS: ${avgQps.toLocaleString()} req/s | Peak QPS: ${peakQps.toLocaleString()} req/s
• Read QPS: ${readQps.toLocaleString()} | Write QPS: ${writeQps.toLocaleString()} (${readWriteRatio}:1 Ratio)
• Ingestion Bandwidth: ${avgBandwidthMbps} Mbps (Peak: ${peakBandwidthGbps} Gbps)
• Storage Growth: ${annualStorageTb} TB/year (Total 5-Yr: ${totalStorageTb} TB)
• Redis Memory Cache (80/20 rule): ${memoryCacheGb} GB RAM
• Estimated Minimum Infrastructure: ${appServersNeeded}x App Servers, ${redisNodesNeeded}x Redis Clusters, ${dbReplicasNeeded}x DB Nodes`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: isDark ? "#0e040c" : "#faf5f8",
      color: isDark ? "#fdf2f4" : "#1a040d",
      padding: "36px 32px 80px",
      boxSizing: "border-box",
      fontFamily: "'Instrument Sans', sans-serif"
    }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{
        maxWidth: 1200, margin: "0 auto 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
      }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: "12px",
            background: isDark ? "rgba(225,73,109,0.12)" : "rgba(255,255,255,0.9)",
            border: `1px solid ${isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.15)"}`,
            color: isDark ? "#ff8da7" : "#942945",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            fontFamily: "Syne, sans-serif"
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={copySummary}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 18px", borderRadius: "12px",
              background: copied ? "#10b981" : (isDark ? "#e1496d" : "#942945"),
              color: "#ffffff", border: "none",
              fontSize: "12.5px", fontWeight: 700, cursor: "pointer",
              fontFamily: "Syne, sans-serif",
              transition: "all 0.2s"
            }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? "Copied Spec!" : "Copy Architecture Spec"}</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div style={{ maxWidth: 1200, margin: "0 auto 40px", textAlign: "left" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: isDark ? "rgba(225,73,109,0.15)" : "rgba(148,41,69,0.08)",
          border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.18)"}`,
          padding: "4px 12px", borderRadius: 99,
          fontSize: "11px", fontWeight: 800, color: "#e1496d",
          letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12,
          fontFamily: "Syne, sans-serif"
        }}>
          <Calculator size={13} />
          <span>System Design Math & Capacity Estimator</span>
        </div>
        <h1 style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(26px, 3.5vw, 42px)",
          fontWeight: 800,
          letterSpacing: "-0.035em",
          margin: "0 0 10px",
          color: isDark ? "#ffffff" : "#1a040d"
        }}>
          System Traffic, QPS &amp; Storage Calculator<span style={{ color: "#e1496d" }}>.</span>
        </h1>
        <p style={{
          fontSize: "15px", color: isDark ? "rgba(255,255,255,0.7)" : "#5a1529",
          maxWidth: 720, lineHeight: 1.5, margin: 0
        }}>
          Model traffic spikes, throughput benchmarks, memory cache sizing, and cluster server node requirements for your system architecture RFCs and interview reviews.
        </p>
      </div>

      {/* Main Grid: Parameters on Left, Output Blueprint on Right */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: 28, alignItems: "start"
      }}>
        
        {/* LEFT COLUMN: Input Sliders & Parameters */}
        <div style={{
          background: isDark ? "rgba(20, 7, 18, 0.85)" : "#ffffff",
          border: `1.5px solid ${isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.12)"}`,
          borderRadius: 22, padding: "28px 26px",
          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 8px 30px rgba(148,41,69,0.06)"
        }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 800, margin: "0 0 22px", display: "flex", alignItems: "center", gap: 8 }}>
            <Cpu size={18} color="#e1496d" /> Traffic &amp; Scale Inputs
          </h2>

          {/* 1. DAU */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "13px", fontWeight: 700 }}>
              <span>Daily Active Users (DAU)</span>
              <span style={{ color: "#e1496d", fontFamily: "monospace", fontSize: "14px" }}>{(dau / 1e6).toFixed(1)}M Users</span>
            </div>
            <input
              type="range" min="100000" max="100000000" step="500000"
              value={dau} onChange={e => setDau(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#e1496d", cursor: "pointer" }}
            />
          </div>

          {/* 2. Requests per User per Day */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "13px", fontWeight: 700 }}>
              <span>Actions / Requests per User / Day</span>
              <span style={{ color: "#e1496d", fontFamily: "monospace", fontSize: "14px" }}>{requestsPerUser} req/day</span>
            </div>
            <input
              type="range" min="1" max="200" step="1"
              value={requestsPerUser} onChange={e => setRequestsPerUser(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#e1496d", cursor: "pointer" }}
            />
          </div>

          {/* 3. Read to Write Ratio */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "13px", fontWeight: 700 }}>
              <span>Read : Write Ratio</span>
              <span style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "14px" }}>{readWriteRatio} : 1 ({Math.round(100 * (readWriteRatio / (readWriteRatio + 1)))}% Reads)</span>
            </div>
            <input
              type="range" min="1" max="50" step="1"
              value={readWriteRatio} onChange={e => setReadWriteRatio(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#38bdf8", cursor: "pointer" }}
            />
          </div>

          {/* 4. Average Payload Size */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "13px", fontWeight: 700 }}>
              <span>Average Request Payload Size</span>
              <span style={{ color: "#10b981", fontFamily: "monospace", fontSize: "14px" }}>{avgPayloadKb} KB</span>
            </div>
            <input
              type="range" min="0.5" max="64" step="0.5"
              value={avgPayloadKb} onChange={e => setAvgPayloadKb(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
            />
          </div>

          {/* 5. Peak Factor */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "13px", fontWeight: 700 }}>
              <span>Peak Load Multiplier</span>
              <span style={{ color: "#a855f7", fontFamily: "monospace", fontSize: "14px" }}>{peakMultiplier}x Spike</span>
            </div>
            <input
              type="range" min="1.2" max="6.0" step="0.1"
              value={peakMultiplier} onChange={e => setPeakMultiplier(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#a855f7", cursor: "pointer" }}
            />
          </div>

          {/* 6. Retention Years */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "13px", fontWeight: 700 }}>
              <span>Data Retention Period</span>
              <span style={{ color: "#f97316", fontFamily: "monospace", fontSize: "14px" }}>{retentionYears} Years</span>
            </div>
            <input
              type="range" min="1" max="10" step="1"
              value={retentionYears} onChange={e => setRetentionYears(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#f97316", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Output Computed Architecture Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Card 1: QPS & Throughput */}
          <div style={{
            background: isDark ? "rgba(20, 7, 18, 0.85)" : "#ffffff",
            border: `1.5px solid ${isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.12)"}`,
            borderRadius: 22, padding: "24px 24px",
            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 8px 30px rgba(148,41,69,0.06)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={17} color="#e1496d" /> Throughput (QPS)
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "rgba(225,73,109,0.15)", color: "#e1496d" }}>
                p99 Real-time
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              <div style={{ background: isDark ? "#140410" : "#fdf2f6", padding: "14px 16px", borderRadius: 14, border: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.1)"}` }}>
                <div style={{ fontSize: "11px", color: isDark ? "rgba(255,255,255,0.6)" : "#731835", fontWeight: 600, marginBottom: 4 }}>AVERAGE QPS</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: 900, color: "#e1496d" }}>{avgQps.toLocaleString()} <span style={{ fontSize: "12px", fontWeight: 600 }}>req/s</span></div>
              </div>

              <div style={{ background: isDark ? "#1c0414" : "#fbe6ee", padding: "14px 16px", borderRadius: 14, border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.18)"}` }}>
                <div style={{ fontSize: "11px", color: isDark ? "#fca5a5" : "#991b1b", fontWeight: 700, marginBottom: 4 }}>PEAK LOAD QPS</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: 900, color: "#f43f5e" }}>{peakQps.toLocaleString()} <span style={{ fontSize: "12px", fontWeight: 600 }}>req/s</span></div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: "12px", color: isDark ? "rgba(255,255,255,0.7)" : "#5a1529" }}>
              <span>📖 Reads: <b style={{ color: "#38bdf8" }}>{readQps.toLocaleString()} QPS</b></span>
              <span>✍️ Writes: <b style={{ color: "#10b981" }}>{writeQps.toLocaleString()} QPS</b></span>
            </div>
          </div>

          {/* Card 2: Network Bandwidth & Storage */}
          <div style={{
            background: isDark ? "rgba(20, 7, 18, 0.85)" : "#ffffff",
            border: `1.5px solid ${isDark ? "rgba(56,189,248,0.2)" : "rgba(2,132,199,0.15)"}`,
            borderRadius: 22, padding: "24px 24px",
            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 8px 30px rgba(148,41,69,0.06)"
          }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <HardDrive size={17} color="#38bdf8" /> Bandwidth &amp; Storage Sizing
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <div style={{ background: isDark ? "#091220" : "#f0f7ff", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(56,189,248,0.2)" }}>
                <div style={{ fontSize: "10px", color: isDark ? "#93c5fd" : "#0369a1", fontWeight: 700 }}>BANDWIDTH</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 900, color: "#38bdf8", marginTop: 4 }}>{avgBandwidthMbps} <span style={{ fontSize: "10px" }}>Mbps</span></div>
              </div>

              <div style={{ background: isDark ? "#061814" : "#ecfdf5", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ fontSize: "10px", color: isDark ? "#6ee7b7" : "#047857", fontWeight: 700 }}>ANNUAL STORAGE</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 900, color: "#10b981", marginTop: 4 }}>{annualStorageTb} <span style={{ fontSize: "10px" }}>TB/yr</span></div>
              </div>

              <div style={{ background: isDark ? "#170a24" : "#f5f3ff", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(168,85,247,0.2)" }}>
                <div style={{ fontSize: "10px", color: isDark ? "#c084fc" : "#6b21a8", fontWeight: 700 }}>REDIS RAM (80/20)</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 900, color: "#a855f7", marginTop: 4 }}>{memoryCacheGb} <span style={{ fontSize: "10px" }}>GB RAM</span></div>
              </div>
            </div>
          </div>

          {/* Card 3: Recommended Minimum Cluster Nodes */}
          <div style={{
            background: isDark ? "linear-gradient(135deg, #180918 0%, #1f0b20 100%)" : "linear-gradient(135deg, #fdf4f7 0%, #fae8ee 100%)",
            border: `1.5px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"}`,
            borderRadius: 22, padding: "24px 24px"
          }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Server size={17} color="#e1496d" /> Recommended Architecture Nodes
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                <span>🚀 App Service Instances:</span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#e1496d", background: isDark ? "#280a1c" : "#ffffff", padding: "2px 10px", borderRadius: 6 }}>
                  {appServersNeeded} Nodes (c6g.xlarge)
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                <span>⚡ Redis Cache Cluster:</span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#a855f7", background: isDark ? "#280a1c" : "#ffffff", padding: "2px 10px", borderRadius: 6 }}>
                  {redisNodesNeeded} Primary + Replicas
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                <span>🗄️ Database Cluster:</span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#10b981", background: isDark ? "#280a1c" : "#ffffff", padding: "2px 10px", borderRadius: 6 }}>
                  1 Primary + {dbReplicasNeeded - 1} Read Replicas
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
