import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Sparkles, Zap, Flame, Award, Shield, Compass, Palette, Box,
  Video, PenTool, FileText, FolderOpen, Layers, Heart, Mail, Phone,
  Building, Globe, Check, Edit3, Lock, ShieldCheck, RefreshCw,
  LogOut, Star, Trophy, Cpu, ChevronRight, CheckCircle2, ArrowUpRight,
  Sliders, Eye, Terminal, Crown, Disc, Download, History, ArrowRight,
  Filter, PlusCircle, CheckCircle, Activity, ChevronDown, Rocket, Upload,
  Search, FileCode
} from "lucide-react";
import { getXpState, awardXP, RANK_TIERS, XP_RULES, getLevelInfo } from "../utils/xpSystem";

/* ── API helpers ─────────────────────────────────────────────────────────── */
const API  = (window.API_URL || "http://localhost:3001") + "/api";
const auth = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("creatify_token")}`,
});

/* ── Creative Personas & Signature Auras ─────────────────────────────────── */
const CREATIVE_PERSONAS = [
  { id: "alchemist", title: "Visual Alchemist", icon: Sparkles, desc: "Blending generative neural nodes with high-contrast aesthetics", tag: "AI & VISUAL" },
  { id: "architect", title: "3D Spatial Architect", icon: Box, desc: "Pioneering WebGL raytracing, shaders & interactive 3D mockups", tag: "WEBGL 3D" },
  { id: "director", title: "Motion Director", icon: Video, desc: "Composing multi-track 4K timelines and keyframe choreography", tag: "4K VIDEO" },
  { id: "engineer", title: "Pipeline Maestro", icon: Zap, desc: "Architecting automated node graphs and creative pipelines", tag: "AUTOMATION" },
  { id: "typographer", title: "Brand Identity Virtuoso", icon: Palette, desc: "Crafting procedural font archetypes and timeless palettes", tag: "BRAND & DESIGN" },
];

const SIGNATURE_AURAS = [
  { id: "rose", name: "Rose Noir", primary: "#e1496d", secondary: "#942945", grad: "linear-gradient(135deg, #e1496d, #942945)", glow: "rgba(225, 73, 109, 0.4)" },
  { id: "cyan", name: "Cyber Cyan", primary: "#06b6d4", secondary: "#0891b2", grad: "linear-gradient(135deg, #06b6d4, #0891b2)", glow: "rgba(6, 182, 212, 0.4)" },
  { id: "violet", name: "Neon Violet", primary: "#a855f7", secondary: "#7e22ce", grad: "linear-gradient(135deg, #a855f7, #7e22ce)", glow: "rgba(168, 85, 247, 0.4)" },
  { id: "amber", name: "Solar Amber", primary: "#f59e0b", secondary: "#b45309", grad: "linear-gradient(135deg, #f59e0b, #b45309)", glow: "rgba(245, 158, 11, 0.4)" },
  { id: "emerald", name: "Genesis Emerald", primary: "#10b981", secondary: "#047857", grad: "linear-gradient(135deg, #10b981, #047857)", glow: "rgba(16, 185, 129, 0.4)" },
];

const ACHIEVEMENTS = [
  { id: "genesis", title: "Genesis Creator", desc: "Crafted your inaugural visual masterpiece", icon: Star, unlocked: true, date: "Unlocked on join", xp: "+250 XP" },
  { id: "timeline", title: "4K Motion Reel", desc: "Composed a synchronized multi-track audio-video timeline", icon: Video, unlocked: true, date: "Active Tier", xp: "+500 XP" },
  { id: "webgl", title: "Raytrace Virtuoso", desc: "Rendered a photorealistic 3D PBR mockup studio scene", icon: Box, unlocked: true, date: "Active Tier", xp: "+450 XP" },
  { id: "vault", title: "Vault Guardian", desc: "Secured encrypted creative assets with zero leakage", icon: ShieldCheck, unlocked: true, date: "Verified", xp: "+300 XP" },
  { id: "nodes", title: "Node Blueprint", desc: "Executed an automated 5-stage creative workflow pipeline", icon: Zap, unlocked: false, date: "In Progress (3/5)", xp: "+600 XP" },
  { id: "streak", title: "Symphony Streak", desc: "Maintained a continuous 7-day creative output rhythm", icon: Flame, unlocked: false, date: "Streak Goal", xp: "+750 XP" },
];

/* ── Multi-Year Activity Grid Helpers ──────────────────────────────────────── */
const AVAILABLE_YEARS = [2026, 2025, 2024];

function buildYearGrid(projects = [], selectedYear = 2026) {
  const cells = [];
  const isCurrentYear = selectedYear === new Date().getFullYear();
  
  if (isCurrentYear) {
    const today = new Date();
    for (let w = 51; w >= 0; w--) {
      const week = [];
      for (let d = 6; d >= 0; d--) {
        const dt = new Date(today);
        dt.setDate(today.getDate() - (w * 7 + d));
        const ds = dt.toISOString().slice(0, 10);
        const count = (projects || []).filter(p => (p?.updatedAt || p?.createdAt || "").slice(0, 10) === ds).length;
        week.push({ date: ds, count });
      }
      cells.push(week);
    }
  } else {
    // Exact calendar year from Dec 31 of that year backwards
    const endOfYear = new Date(selectedYear, 11, 31);
    for (let w = 51; w >= 0; w--) {
      const week = [];
      for (let d = 6; d >= 0; d--) {
        const dt = new Date(endOfYear);
        dt.setDate(endOfYear.getDate() - (w * 7 + d));
        const ds = dt.toISOString().slice(0, 10);
        const count = (projects || []).filter(p => (p?.updatedAt || p?.createdAt || "").slice(0, 10) === ds).length;
        week.push({ date: ds, count });
      }
      cells.push(week);
    }
  }
  return cells;
}

const buildGrid = (projects = []) => buildYearGrid(projects, 2026);

function aColor(n, isDark, auraColor = "#e1496d") {
  if (n === 0) return isDark ? "rgba(255,255,255,0.05)" : "rgba(148,41,69,0.06)";
  if (n === 1) return isDark ? "rgba(225,73,109,0.3)" : "rgba(225,73,109,0.25)";
  if (n === 2) return isDark ? "rgba(225,73,109,0.55)" : "rgba(225,73,109,0.5)";
  if (n === 3) return isDark ? "rgba(225,73,109,0.8)" : "rgba(225,73,109,0.75)";
  return auraColor || "#e1496d";
}

function calcStreak(grid = []) {
  const flat = (grid || []).flat().reverse();
  let streak = 0;
  for (const cell of flat) {
    if (cell.count > 0) streak++;
    else break;
  }
  return streak;
}

function getMonths(grid = []) {
  const months = [];
  let last = null;
  (grid || []).forEach((week, wi) => {
    if (!week[0]) return;
    const mo = new Date(week[0].date).toLocaleString("default", { month: "short" });
    if (mo !== last) { months.push({ wi, l: mo }); last = mo; }
  });
  return months;
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "Recently";
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Avatar with Animated Ring ───────────────────────────────────────────── */
function CreatorAvatar({ name = "", size = 64, aura, isOnline = true }) {
  const safeName = typeof name === "string" ? name.trim() : "";
  const initials = safeName
    ? safeName.split(/\s+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "CR"
    : "CR";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Outer Pulse Ring */}
      <div style={{
        position: "absolute", inset: -4, borderRadius: "50%",
        background: aura?.grad || "linear-gradient(135deg, #e1496d, #942945)",
        opacity: 0.7, filter: "blur(4px)", animation: "pulseRing 3s ease-in-out infinite",
      }} />
      <div style={{
        position: "relative",
        width: size, height: size, borderRadius: "50%",
        background: aura?.grad || "linear-gradient(135deg, #942945 0%, #e1496d 100%)",
        border: "2.5px solid rgba(255,255,255,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontFamily: "Syne, sans-serif",
        fontSize: size * 0.36, fontWeight: 800,
        boxShadow: `0 8px 24px ${aura?.glow || "rgba(225, 73, 109, 0.4)"}`,
        letterSpacing: "0.02em",
      }}>
        {initials}
      </div>
      {isOnline && (
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: Math.max(12, size * 0.22), height: Math.max(12, size * 0.22),
          borderRadius: "50%", background: "#22c55e",
          border: "2px solid #ffffff",
          boxShadow: "0 0 10px #22c55e",
        }} />
      )}
    </div>
  );
}

/* ── Form Field ──────────────────────────────────────────────────────────── */
function Field({ label, value, onChange, type = "text", isDark, border, tx, mu, icon: IconComponent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 600, color: mu, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
        {IconComponent && <IconComponent size={12} />}
        {label}
      </span>
      {onChange ? (
        type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            rows={3}
            style={{
              background: isDark ? "rgba(10, 2, 8, 0.6)" : "rgba(255, 255, 255, 0.9)",
              border: `1.5px solid ${border}`,
              borderRadius: 12, padding: "10px 14px", color: tx,
              fontFamily: "Instrument Sans, sans-serif", fontSize: 13.5,
              resize: "vertical", outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "#e1496d"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(225, 73, 109, 0.15)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
          />
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            style={{
              background: isDark ? "rgba(10, 2, 8, 0.6)" : "rgba(255, 255, 255, 0.9)",
              border: `1.5px solid ${border}`,
              borderRadius: 12, padding: "10px 14px", color: tx,
              fontFamily: "Instrument Sans, sans-serif", fontSize: 13.5, outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "#e1496d"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(225, 73, 109, 0.15)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
          />
        )
      ) : (
        <div style={{
          padding: "10px 14px", borderRadius: 12,
          background: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"}`,
          fontSize: 14, fontFamily: "Instrument Sans, sans-serif", color: tx, fontWeight: 500,
        }}>
          {value || <span style={{ color: mu, fontStyle: "italic" }}>— Not configured —</span>}
        </div>
      )}
    </div>
  );
}

/* ── Edit Profile Modal ──────────────────────────────────────────────────── */
function EditModal({ profile = {}, onClose, onSaved, isDark, sf, bd, tx, mu, acc, aura }) {
  const [form, setForm] = useState({
    name: profile.name || "",
    phone: profile.phone || "",
    company: profile.company || "",
    country: profile.country || "",
    bio: profile.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const esc = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const save = async () => {
    setSaving(true); setErr("");
    try {
      const r = await fetch(`${API}/profile`, { method: "PUT", headers: auth(), body: JSON.stringify(form) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Save failed");
      onSaved(data.user || form);
      onClose();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const border = isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.18)";

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div style={{
        background: isDark ? "linear-gradient(145deg, #1c0817, #0e040b)" : "linear-gradient(145deg, #ffffff, #fdf4f8)",
        border: `1.5px solid ${border}`,
        borderRadius: 24, padding: "32px 36px", width: "100%", maxWidth: 540,
        display: "flex", flexDirection: "column", gap: 18, position: "relative",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 30px rgba(225,73,109,0.15)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20, background: "none", border: "none",
          color: mu, fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 4,
        }}>×</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: aura.grad, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: `0 4px 14px ${aura.glow}`,
          }}>
            <Edit3 size={18} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: tx }}>
              Refine Creative Profile
            </h2>
            <p style={{ margin: 0, fontFamily: "Poppins, sans-serif", fontSize: 12, color: mu }}>
              Update your public creator identity and details
            </p>
          </div>
        </div>

        <Field label="Full Creator Name" value={form.name} onChange={set("name")} isDark={isDark} border={border} tx={tx} mu={mu} icon={Sparkles} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Phone" value={form.phone} onChange={set("phone")} isDark={isDark} border={border} tx={tx} mu={mu} icon={Phone} />
          <Field label="Company / Studio" value={form.company} onChange={set("company")} isDark={isDark} border={border} tx={tx} mu={mu} icon={Building} />
        </div>
        <Field label="Country / Territory" value={form.country} onChange={set("country")} isDark={isDark} border={border} tx={tx} mu={mu} icon={Globe} />
        <Field label="Artist Manifesto / Bio" value={form.bio} onChange={set("bio")} type="textarea" isDark={isDark} border={border} tx={tx} mu={mu} icon={FileText} />

        {err && <p style={{ color: "#e1496d", fontFamily: "Poppins, sans-serif", fontSize: 12, margin: 0 }}>{err}</p>}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12,
              background: "transparent", border: `1.5px solid ${border}`,
              color: tx, fontFamily: "Poppins, sans-serif", fontSize: 13,
              fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={save} disabled={saving}
            style={{
              flex: 2,
              background: aura.grad,
              border: "none", borderRadius: 12, padding: "12px 0",
              color: "#fff", fontFamily: "Syne, sans-serif", fontSize: 14,
              fontWeight: 700, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1,
              boxShadow: `0 6px 20px ${aura.glow}`,
            }}
          >
            {saving ? "Saving Changes…" : "Save Creator Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Multi-Year Advanced Activity Heatmap & Velocity Component ────────────── */
function Heatmap({ projects = [], isDark, sf, bd, tx, mu, acc, aura }) {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [viewMode, setViewMode] = useState("matrix"); // "matrix" | "monthly"
  const [hoveredCell, setHoveredCell] = useState(null);

  // Compute 52-week grid for the selected year
  const grid = useMemo(() => buildYearGrid(projects, selectedYear), [projects, selectedYear]);
  const months = useMemo(() => getMonths(grid), [grid]);
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const totalCreationsInYear = useMemo(() => {
    return (grid || []).flat().reduce((s, c) => s + (c?.count || 0), 0);
  }, [grid]);

  const streak = useMemo(() => calcStreak(grid), [grid]);

  // Compute monthly breakdown
  const monthlyStats = useMemo(() => {
    const monthsMap = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthNames.forEach(m => { monthsMap[m] = 0; });

    (grid || []).flat().forEach(cell => {
      if (cell && cell.date) {
        const m = new Date(cell.date).toLocaleString("default", { month: "short" });
        if (monthsMap[m] !== undefined) {
          monthsMap[m] += cell.count;
        }
      }
    });

    return monthNames.map(m => ({ month: m, count: monthsMap[m] }));
  }, [grid]);

  const maxMonthCount = Math.max(1, ...monthlyStats.map(m => m.count));

  return (
    <div style={{
      background: sf, border: `1.5px solid ${bd}`, borderRadius: 20,
      padding: "24px 28px", position: "relative", overflow: "hidden",
      boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.3)" : "0 8px 30px rgba(148,41,69,0.06)",
    }}>
      {/* Background glow node */}
      <div style={{
        position: "absolute", top: -40, right: -40, width: 180, height: 180,
        borderRadius: "50%", background: aura.glow, filter: "blur(60px)",
        pointerEvents: "none", opacity: 0.4,
      }} />

      {/* Top Header Row with Year Switcher */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: aura.grad, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: `0 4px 12px ${aura.glow}`,
          }}>
            <Flame size={16} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 16.5, fontWeight: 800, color: tx }}>
              Creative Output Matrix • {selectedYear}
            </h3>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11.5, color: mu }}>
              Multi-year verified rendering & node pipeline stream
            </span>
          </div>
        </div>

        {/* Year Pills & View Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Year Switcher */}
          <div style={{
            display: "flex", padding: 3, borderRadius: 10,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          }}>
            {AVAILABLE_YEARS.map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                style={{
                  padding: "4px 11px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontFamily: "Poppins, sans-serif", fontSize: 11.5,
                  fontWeight: selectedYear === yr ? 700 : 500,
                  background: selectedYear === yr ? aura.grad : "transparent",
                  color: selectedYear === yr ? "#fff" : mu,
                  transition: "all 0.18s ease",
                  boxShadow: selectedYear === yr ? `0 2px 8px ${aura.glow}` : "none",
                }}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div style={{
            display: "flex", padding: 3, borderRadius: 10,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          }}>
            <button
              onClick={() => setViewMode("matrix")}
              style={{
                padding: "4px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "Poppins, sans-serif", fontSize: 11,
                fontWeight: viewMode === "matrix" ? 700 : 500,
                background: viewMode === "matrix" ? (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)") : "transparent",
                color: viewMode === "matrix" ? tx : mu,
              }}
            >
              52-Week Grid
            </button>
            <button
              onClick={() => setViewMode("monthly")}
              style={{
                padding: "4px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "Poppins, sans-serif", fontSize: 11,
                fontWeight: viewMode === "monthly" ? 700 : 500,
                background: viewMode === "monthly" ? (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)") : "transparent",
                color: viewMode === "monthly" ? tx : mu,
              }}
            >
              Monthly Velocity
            </button>
          </div>

          {/* Real Count Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 99,
            background: isDark ? "rgba(225, 73, 109, 0.16)" : "rgba(225, 73, 109, 0.1)",
            border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(225,73,109,0.2)"}`,
          }}>
            <Sparkles size={13} color="#e1496d" />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 700, color: tx }}>
              {totalCreationsInYear} Creations in {selectedYear}
            </span>
          </div>
        </div>
      </div>

      {viewMode === "matrix" ? (
        /* ── 52-WEEK CONSTELLATION MATRIX ── */
        <div style={{ overflowX: "auto", paddingBottom: 4 }}>
          {/* Month labels */}
          <div style={{ display: "flex", marginLeft: 36, marginBottom: 6, position: "relative", height: 16 }}>
            {months.map(({ wi, l }) => (
              <div key={wi} style={{
                position: "absolute", left: wi * 14.5,
                fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 600, color: mu,
              }}>{l}</div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 0 }}>
            {/* Day labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 6 }}>
              {days.map((d, i) => (
                <div key={d} style={{
                  height: 11, fontSize: 9, fontFamily: "Poppins, sans-serif",
                  color: i % 2 === 1 ? mu : "transparent", lineHeight: "11px", fontWeight: 500,
                }}>{d}</div>
              ))}
            </div>
            {/* Grid cells */}
            {(grid || []).map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {(week || []).map((cell, di) => (
                  <div
                    key={di}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      width: 11.5, height: 11.5, borderRadius: 2.5,
                      background: aColor(cell.count, isDark, aura.primary),
                      margin: "0 1.5px",
                      cursor: "pointer",
                      transition: "transform 0.15s ease, filter 0.15s ease",
                      transform: hoveredCell?.date === cell.date ? "scale(1.4)" : "scale(1)",
                      boxShadow: hoveredCell?.date === cell.date ? `0 0 8px ${aura.primary}` : "none",
                      zIndex: hoveredCell?.date === cell.date ? 10 : 1,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── MONTHLY VELOCITY BAR GRAPH ── */
        <div style={{ padding: "16px 8px 6px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10, alignItems: "flex-end", height: 110 }}>
            {monthlyStats.map(ms => {
              const heightPercent = ms.count > 0 ? Math.max(16, (ms.count / maxMonthCount) * 100) : 6;
              const hasActivity = ms.count > 0;

              return (
                <div key={ms.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fontWeight: 700, color: hasActivity ? aura.primary : mu }}>
                    {ms.count}
                  </span>
                  <div style={{
                    width: "100%", maxWidth: 36, height: `${heightPercent}%`,
                    borderRadius: "6px 6px 2px 2px",
                    background: hasActivity ? aura.grad : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
                    boxShadow: hasActivity ? `0 0 10px ${aura.glow}` : "none",
                    transition: "height 0.4s ease",
                  }} />
                  <span style={{ fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 600, color: hasActivity ? tx : mu }}>
                    {ms.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer row: Hover info on Left + Legend on Right (Fixed height to prevent any stretching) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        minHeight: 28,
        borderTop: `1px dashed ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        paddingTop: 10,
      }}>
        {/* Left: Dynamic Hover Pill with stable height and smooth opacity */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 12px",
          borderRadius: 8,
          background: isDark ? "rgba(20, 5, 15, 0.85)" : "rgba(255, 240, 246, 0.9)",
          border: `1px solid ${aura.primary}35`,
          fontFamily: "Poppins, sans-serif",
          fontSize: 11,
          color: tx,
          opacity: hoveredCell ? 1 : 0,
          transform: hoveredCell ? "translateY(0)" : "translateY(2px)",
          transition: "opacity 0.15s ease, transform 0.15s ease",
          pointerEvents: "none",
        }}>
          <span style={{ fontWeight: 700, color: aura.primary }}>{hoveredCell?.date || ""}:</span>
          <span>{hoveredCell?.count || 0} creation{(hoveredCell?.count !== 1) ? "s" : ""} recorded</span>
        </div>

        {/* Right: Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10.5, color: mu, fontWeight: 500 }}>Quiet</span>
          {[0, 1, 2, 3, 4].map(n => (
            <div key={n} style={{ width: 12, height: 12, borderRadius: 2.5, background: aColor(n, isDark, aura.primary) }} />
          ))}
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10.5, color: mu, fontWeight: 500 }}>Intense Flow</span>
        </div>
      </div>
    </div>
  );
}

/* ── Holographic Creator Passport Card with Real XP & Level ────────────────── */
function CreatorPassportCard({
  profile = {},
  persona = CREATIVE_PERSONAS[0],
  aura = SIGNATURE_AURAS[0],
  xpState = { totalXp: 0 },
  isDark,
  tx,
  mu,
  onEdit,
  onSelectPersona,
  onSelectAura,
  onOpenRankModal
}) {
  const [showPersonaPicker, setShowPersonaPicker] = useState(false);
  const [showAuraPicker, setShowAuraPicker] = useState(false);

  const matchedPersona = CREATIVE_PERSONAS.find(p => p.id === (persona?.id || persona)) || CREATIVE_PERSONAS[0];
  const PersonaIcon = matchedPersona.icon || Sparkles;
  const levelInfo = xpState.levelInfo || getLevelInfo(xpState.totalXp || 0);

  return (
    <div style={{
      position: "relative",
      borderRadius: 24,
      background: isDark
        ? "linear-gradient(135deg, rgba(35, 10, 26, 0.85) 0%, rgba(18, 4, 14, 0.95) 50%, rgba(10, 2, 8, 0.98) 100%)"
        : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 240, 246, 0.92) 50%, rgba(254, 226, 238, 0.88) 100%)",
      border: `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.35)" : "rgba(225, 73, 109, 0.25)"}`,
      padding: "32px 36px",
      overflow: "hidden",
      boxShadow: isDark
        ? "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(225, 73, 109, 0.15)"
        : "0 16px 40px rgba(148, 41, 69, 0.1), 0 0 24px rgba(225, 73, 109, 0.08)",
      backdropFilter: "blur(20px)",
    }}>
      {/* Decorative Grid Mesh & Ambient Light */}
      <div style={{
        position: "absolute", top: -80, right: -80, width: 280, height: 280,
        borderRadius: "50%", background: aura.glow, filter: "blur(70px)",
        pointerEvents: "none", opacity: isDark ? 0.6 : 0.45,
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 220, height: 220,
        borderRadius: "50%", background: "rgba(56, 189, 248, 0.2)", filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      {/* Top Header Row of Card */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <CreatorAvatar name={profile.name} size={78} aura={aura} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{
                margin: 0, fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800,
                color: tx, letterSpacing: "-0.02em",
              }}>
                {profile.name || "Master Creator"}
              </h1>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 99,
                background: aura.grad, color: "#fff",
                fontSize: 10.5, fontFamily: "Poppins, sans-serif", fontWeight: 700,
                letterSpacing: "0.06em", boxShadow: `0 2px 10px ${aura.glow}`,
              }}>
                <Crown size={12} />
                {levelInfo.badge}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: mu }}>
                {profile.email || "creator@creatify.studio"}
              </span>
              <span style={{ color: mu, fontSize: 12 }}>•</span>
              <span style={{
                fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 600,
                color: aura.primary, display: "flex", alignItems: "center", gap: 4,
              }}>
                <PersonaIcon size={13} />
                {persona.title}
              </span>
            </div>

            {profile.bio && (
              <p style={{
                margin: "10px 0 0", fontFamily: "Instrument Sans, sans-serif", fontSize: 13.5,
                color: isDark ? "rgba(255, 255, 255, 0.75)" : "rgba(15, 2, 8, 0.75)",
                lineHeight: 1.5, maxWidth: 520, fontStyle: "italic",
              }}>
                "{profile.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Action Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Persona Switcher Button */}
          <button
            onClick={() => setShowPersonaPicker(!showPersonaPicker)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 12,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)",
              border: `1.5px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"}`,
              color: tx, fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = aura.primary; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"; e.currentTarget.style.transform = "none"; }}
          >
            <Sliders size={13} color={aura.primary} />
            Archetype
          </button>

          {/* Aura Color Switcher Button */}
          <button
            onClick={() => setShowAuraPicker(!showAuraPicker)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 12,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)",
              border: `1.5px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"}`,
              color: tx, fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = aura.primary; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: aura.grad }} />
            Aura
          </button>

          {/* Edit Profile Button */}
          <button
            onClick={onEdit}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 12,
              background: aura.grad,
              border: "none", color: "#fff",
              fontFamily: "Poppins, sans-serif", fontSize: 12.5, fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: `0 4px 14px ${aura.glow}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
          >
            <Edit3 size={13} />
            Edit
          </button>
        </div>
      </div>

      {/* Flyout: Persona Archetype Selector */}
      {showPersonaPicker && (
        <div style={{
          marginTop: 20, padding: 18, borderRadius: 16,
          background: isDark ? "rgba(15, 3, 12, 0.95)" : "rgba(255, 255, 255, 0.98)",
          border: `1.5px solid ${aura.primary}50`,
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10,
          animation: "fadeIn 0.2s ease-out",
        }}>
          {CREATIVE_PERSONAS.map(p => {
            const Icon = p.icon || Sparkles;
            const isSelected = p.id === (persona?.id || persona);
            return (
              <button
                key={p.id}
                onClick={() => { onSelectPersona(p); setShowPersonaPicker(false); }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: 12,
                  borderRadius: 12, textAlign: "left", cursor: "pointer",
                  background: isSelected ? `${aura.primary}20` : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
                  border: `1.5px solid ${isSelected ? aura.primary : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)")}`,
                  transition: "all 0.18s",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: isSelected ? aura.grad : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isSelected ? "#fff" : mu, flexShrink: 0,
                }}>
                  <Icon size={14} />
                </div>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 12, fontWeight: 700, color: tx }}>
                    {p.title}
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 9.5, color: mu, marginTop: 2 }}>
                    {p.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Flyout: Aura Color Switcher */}
      {showAuraPicker && (
        <div style={{
          marginTop: 20, padding: 16, borderRadius: 16,
          background: isDark ? "rgba(15, 3, 12, 0.95)" : "rgba(255, 255, 255, 0.98)",
          border: `1.5px solid ${aura.primary}50`,
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          animation: "fadeIn 0.2s ease-out",
        }}>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 600, color: mu, marginRight: 4 }}>
            Signature Aura:
          </span>
          {SIGNATURE_AURAS.map(a => (
            <button
              key={a.id}
              onClick={() => { onSelectAura(a); setShowAuraPicker(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
                borderRadius: 99, cursor: "pointer",
                background: a.id === aura.id ? a.grad : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                border: `1.5px solid ${a.id === aura.id ? "#fff" : "transparent"}`,
                color: a.id === aura.id ? "#fff" : tx,
                fontFamily: "Poppins, sans-serif", fontSize: 11.5, fontWeight: 600,
                boxShadow: a.id === aura.id ? `0 4px 14px ${a.glow}` : "none",
                transition: "all 0.18s",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.primary, border: "1px solid rgba(255,255,255,0.6)" }} />
              {a.name}
            </button>
          ))}
        </div>
      )}

      {/* ── REAL XP LEVEL PROGRESS BAR ── */}
      <div style={{
        marginTop: 24, padding: "18px 22px", borderRadius: 18,
        background: isDark ? "rgba(15, 3, 12, 0.6)" : "rgba(255, 255, 255, 0.65)",
        border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.25)" : "rgba(148, 41, 69, 0.15)"}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 800, color: aura.primary }}>
              Level {levelInfo.level} • {levelInfo.rankTitle}
            </span>
            <button
              onClick={onOpenRankModal}
              style={{
                background: "none", border: "none", color: mu, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11,
                fontFamily: "Poppins, sans-serif", textDecoration: "underline",
              }}
            >
              View Ranks Ladder <ArrowUpRight size={11} />
            </button>
          </div>
          <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 700, color: tx }}>
            <span style={{ color: aura.primary }}>{(xpState.totalXp || 0).toLocaleString()} XP</span>
            {levelInfo.level < 10 && (
              <span style={{ color: mu, fontWeight: 500 }}> / {levelInfo.nextRankXp.toLocaleString()} XP</span>
            )}
          </div>
        </div>

        {/* Progress Track */}
        <div style={{
          height: 10, borderRadius: 99,
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          overflow: "hidden", position: "relative",
        }}>
          <div style={{
            height: "100%", width: `${levelInfo.progressPercent}%`,
            borderRadius: 99,
            background: aura.grad,
            boxShadow: `0 0 12px ${aura.glow}`,
            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, fontSize: 11, fontFamily: "Poppins, sans-serif", color: mu }}>
          <span>{levelInfo.progressPercent}% Progress</span>
          {levelInfo.level < 10 ? (
            <span>{levelInfo.xpRemaining.toLocaleString()} XP until {levelInfo.nextRankTitle}</span>
          ) : (
            <span style={{ color: "#fbbf24", fontWeight: 700 }}>✨ Max Creator Rank Achieved</span>
          )}
        </div>
      </div>

      {/* ── XP RULE CALLOUT PILLS ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: mu, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          XP Rules:
        </span>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 8,
          background: "rgba(225, 73, 109, 0.12)", border: "1px solid rgba(225, 73, 109, 0.25)",
          color: "#e1496d", fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 600,
        }}>
          <Upload size={11} /> +100 XP / Publish
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 8,
          background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.25)",
          color: "#38bdf8", fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 600,
        }}>
          <Sparkles size={11} /> +20 XP / Project Created
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 8,
          background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.25)",
          color: "#10b981", fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 600,
        }}>
          <Download size={11} /> +20 XP / Template Downloaded
        </div>
      </div>
    </div>
  );
}

/* ── Real-Time Multi-Year Activity Log / Ledger Section ─────────────────── */
function ActivityLogSection({ xpState, isDark, sf, bd, tx, mu, acc, aura }) {
  const [filterType, setFilterType] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [testTriggerMsg, setTestTriggerMsg] = useState(null);

  const activities = xpState.activityLog || [];

  // Multi-tier filter: Filter by Type, Year, and Search Query
  const filtered = useMemo(() => {
    return activities.filter(a => {
      // 1. Type filter
      if (filterType !== "all" && a.type !== filterType) return false;

      // 2. Year filter
      if (selectedYear !== "all") {
        const itemYear = new Date(a.timestamp || Date.now()).getFullYear();
        if (itemYear !== parseInt(selectedYear)) return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const str = `${a.title || ""} ${a.detail || ""} ${a.badge || ""} ${a.type || ""}`.toLowerCase();
        if (!str.includes(q)) return false;
      }

      return true;
    });
  }, [activities, filterType, selectedYear, searchQuery]);

  // Export Ledger to JSON file
  const exportLedger = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `creatify_ledger_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const simulateXP = (type) => {
    let res = null;
    if (type === "PUBLISH_TEMPLATE") {
      res = awardXP("PUBLISH_TEMPLATE", {
        title: "Template Published Live",
        detail: `Published 'Sovereign 3D Studio Mockup #${Math.floor(Math.random()*900+100)}' to Marketplace`
      });
      setTestTriggerMsg("🎉 +100 XP Awarded for Template Publish!");
    } else if (type === "CREATE_PROJECT") {
      res = awardXP("CREATE_PROJECT", {
        title: "New Creative Project Created",
        detail: `Created new multi-track 4K video canvas #${Math.floor(Math.random()*900+100)}`
      });
      setTestTriggerMsg("✨ +20 XP Awarded for Project Creation!");
    } else if (type === "TEMPLATE_DOWNLOADED") {
      res = awardXP("TEMPLATE_DOWNLOADED", {
        title: "Template Remixed by Community",
        detail: `Community member downloaded and remixed your 'Kinetic Typography Deck'`
      });
      setTestTriggerMsg("🚀 +20 XP Awarded: Community Downloaded Template!");
    }
    setTimeout(() => setTestTriggerMsg(null), 3000);
  };

  return (
    <div style={{
      background: sf, border: `1.5px solid ${bd}`, borderRadius: 20,
      padding: "28px 32px", position: "relative",
      boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.3)" : "0 8px 30px rgba(148,41,69,0.06)",
    }}>
      {/* Top Header Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: aura.grad, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: `0 4px 12px ${aura.glow}`,
          }}>
            <History size={19} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: tx }}>
              Live Creative Ledger & XP Stream
            </h3>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: mu }}>
              Multi-year cryptographic stream of creative transactions ({activities.length} total entries)
            </span>
          </div>
        </div>

        {/* Right action controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Export button */}
          <button
            onClick={exportLedger}
            title="Download JSON Ledger Record"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 10,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              color: tx, fontFamily: "Poppins, sans-serif", fontSize: 11.5, fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <Download size={13} />
            Export Ledger (.json)
          </button>

          {/* XP Simulators */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => simulateXP("PUBLISH_TEMPLATE")}
              style={{
                padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(225,73,109,0.4)",
                background: "rgba(225,73,109,0.12)", color: "#e1496d",
                fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 700, cursor: "pointer",
              }}
            >
              +100 Publish
            </button>
            <button
              onClick={() => simulateXP("CREATE_PROJECT")}
              style={{
                padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(56,189,248,0.4)",
                background: "rgba(56,189,248,0.12)", color: "#38bdf8",
                fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 700, cursor: "pointer",
              }}
            >
              +20 Project
            </button>
            <button
              onClick={() => simulateXP("TEMPLATE_DOWNLOADED")}
              style={{
                padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.4)",
                background: "rgba(16,185,129,0.12)", color: "#10b981",
                fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 700, cursor: "pointer",
              }}
            >
              +20 Remix
            </button>
          </div>
        </div>
      </div>

      {testTriggerMsg && (
        <div style={{
          padding: "10px 16px", borderRadius: 12, marginBottom: 16,
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.15))",
          border: "1px solid rgba(34, 197, 94, 0.4)", color: tx,
          fontFamily: "Poppins, sans-serif", fontSize: 12.5, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8,
          animation: "fadeIn 0.2s ease-out",
        }}>
          <CheckCircle size={15} color="#22c55e" />
          {testTriggerMsg}
        </div>
      )}

      {/* ── SEARCH & MULTI-YEAR FILTER BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, marginBottom: 16, flexWrap: "wrap",
        padding: "12px 14px", borderRadius: 14,
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
      }}>
        {/* Left: Search input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 220,
          background: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 10, padding: "6px 12px",
        }}>
          <Search size={14} color={mu} />
          <input
            type="text"
            placeholder="Search by action, title, project details..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: "transparent", border: "none", outline: "none",
              color: tx, fontFamily: "Poppins, sans-serif", fontSize: 12, width: "100%",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "none", border: "none", color: mu, cursor: "pointer", fontSize: 13, padding: 0 }}
            >
              ×
            </button>
          )}
        </div>

        {/* Right: Year Filter Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontFamily: "Poppins, sans-serif", fontWeight: 600, color: mu }}>
            Year:
          </span>
          <div style={{
            display: "flex", padding: 2, borderRadius: 8,
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          }}>
            {["all", "2026", "2025", "2024"].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                style={{
                  padding: "3px 9px", borderRadius: 6, border: "none", cursor: "pointer",
                  fontFamily: "Poppins, sans-serif", fontSize: 11,
                  fontWeight: selectedYear === yr ? 700 : 500,
                  background: selectedYear === yr ? aura.grad : "transparent",
                  color: selectedYear === yr ? "#fff" : mu,
                  transition: "all 0.15s",
                }}
              >
                {yr === "all" ? "All Time" : yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Type Filter Chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {[
          { id: "all", label: `All Records (${activities.length})` },
          { id: "PUBLISH_TEMPLATE", label: "Publishes (+100 XP)" },
          { id: "CREATE_PROJECT", label: "Creations (+20 XP)" },
          { id: "TEMPLATE_DOWNLOADED", label: "Community Remixes (+20 XP)" },
          { id: "EXECUTE_PIPELINE", label: "Pipelines (+25 XP)" },
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setFilterType(chip.id)}
            style={{
              padding: "6px 14px", borderRadius: 99,
              border: `1px solid ${filterType === chip.id ? aura.primary : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`,
              background: filterType === chip.id ? (isDark ? `${aura.primary}25` : `${aura.primary}15`) : "transparent",
              color: filterType === chip.id ? aura.primary : mu,
              fontFamily: "Poppins, sans-serif", fontSize: 11.5, fontWeight: filterType === chip.id ? 700 : 500,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.18s",
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Activity Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "48px 20px", color: mu,
            fontFamily: "Poppins, sans-serif", fontSize: 13,
            background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)",
            borderRadius: 14, border: `1px dashed ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          }}>
            No activity records matching your search or filters.
          </div>
        ) : (
          filtered.map(act => {
            const rule = XP_RULES[act.type] || {};
            const color = act.color || rule.color || "#e1496d";
            const txHash = `CRT-TX-${(act.id || "").replace(/[^0-9a-f]/gi, "").slice(-6) || Math.random().toString(16).slice(2, 8).toUpperCase()}`;
            const fullDate = new Date(act.timestamp || Date.now()).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
            });

            return (
              <div
                key={act.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 18px", borderRadius: 14,
                  background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                  gap: 14, transition: "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${color}60`;
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = `0 4px 16px ${color}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: `${color}18`, border: `1.5px solid ${color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: color, flexShrink: 0,
                    boxShadow: `0 2px 8px ${color}25`,
                  }}>
                    {act.type === "PUBLISH_TEMPLATE" ? <Upload size={16} /> :
                     act.type === "TEMPLATE_DOWNLOADED" ? <Download size={16} /> :
                     act.type === "EXECUTE_PIPELINE" ? <Zap size={16} /> :
                     <Activity size={16} />}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "Syne, sans-serif", fontSize: 13.5, fontWeight: 700, color: tx }}>
                        {act.title}
                      </span>
                      <span style={{
                        fontSize: 9.5, fontFamily: "Poppins, sans-serif", fontWeight: 700,
                        padding: "2px 7px", borderRadius: 5,
                        background: `${color}18`, color: color, letterSpacing: "0.06em",
                      }}>
                        {act.badge || "ACTION"}
                      </span>
                      <span style={{
                        fontSize: 9.5, fontFamily: "monospace", color: mu, opacity: 0.7,
                        letterSpacing: "0.04em",
                      }}>
                        {txHash}
                      </span>
                    </div>
                    <p style={{ margin: "3px 0 0", fontFamily: "Poppins, sans-serif", fontSize: 11.5, color: mu }}>
                      {act.detail}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 800,
                    color: color, display: "inline-flex", alignItems: "center", gap: 3,
                  }}>
                    +{act.xp} XP
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 10.5, color: mu, marginTop: 2 }} title={fullDate}>
                    {formatRelativeTime(act.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ── Rank Ladder Modal ────────────────────────────────────────────────────── */
function RankLadderModal({ currentXp = 0, currentLevel = 1, onClose, isDark, sf, bd, tx, mu, aura }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div style={{
        background: isDark ? "linear-gradient(145deg, #1c0817, #0e040b)" : "linear-gradient(145deg, #ffffff, #fdf4f8)",
        border: `1.5px solid ${bd}`,
        borderRadius: 24, padding: "32px", width: "100%", maxWidth: 640,
        boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 30px rgba(225,73,109,0.15)",
        maxHeight: "85vh", overflowY: "auto", position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20, background: "none", border: "none",
          color: mu, fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 4,
        }}>×</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: aura.grad, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: `0 4px 14px ${aura.glow}`,
          }}>
            <Crown size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: tx }}>
              Creator Rank Hierarchy & Tiers
            </h2>
            <p style={{ margin: "2px 0 0", fontFamily: "Poppins, sans-serif", fontSize: 12, color: mu }}>
              Every publish (+100 XP), creation (+20 XP) & download (+20 XP) elevates your standing
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {RANK_TIERS.map(tier => {
            const isUnlocked = currentXp >= tier.minXp;
            const isCurrent = currentLevel === tier.level;

            return (
              <div
                key={tier.level}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 18px", borderRadius: 14,
                  background: isCurrent
                    ? (isDark ? `${aura.primary}25` : `${aura.primary}15`)
                    : (isUnlocked ? (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)") : (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)")),
                  border: `1.5px solid ${isCurrent ? aura.primary : (isUnlocked ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)") : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"))}`,
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: isUnlocked ? tier.color : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 800,
                  }}>
                    {tier.level}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: tx }}>
                        {tier.title}
                      </span>
                      {isCurrent && (
                        <span style={{
                          padding: "2px 8px", borderRadius: 99, background: aura.grad,
                          color: "#fff", fontSize: 10, fontFamily: "Poppins, sans-serif", fontWeight: 700,
                        }}>
                          CURRENT TIER
                        </span>
                      )}
                    </div>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: mu }}>
                      {tier.badge} • Required XP: {tier.minXp.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "Poppins, sans-serif", fontWeight: 600, color: isUnlocked ? "#22c55e" : mu }}>
                  {isUnlocked ? <CheckCircle2 size={16} /> : <Lock size={14} />}
                  {isUnlocked ? "Unlocked" : "Locked"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Creative DNA & Multi-Discipline Matrix (Dynamically Computed) ────────── */
function CreativeDNAMatrix({ projects = [], xpState = {}, isDark, sf, bd, tx, mu, aura }) {
  const totalXp = xpState.totalXp || 0;

  // Real-time project distribution analysis
  const videoCount = (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("video") || s.includes("editor") || s.includes("clip") || s.includes("timeline");
  }).length;

  const mockupCount = (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("mockup") || s.includes("3d") || s.includes("image") || s.includes("pbr");
  }).length;

  const aiCount = (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("ai") || s.includes("magic") || s.includes("prompt") || s.includes("synth");
  }).length;

  const pipelineCount = (xpState.stats?.pipelines || 0) + (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("pipeline") || s.includes("node") || s.includes("graph") || s.includes("flow");
  }).length;

  const brandCount = (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("logo") || s.includes("brand") || s.includes("doc") || s.includes("presentation") || s.includes("slide") || s.includes("print");
  }).length;

  // Dynamic proficiency levels (0 to 100%)
  const disciplines = [
    {
      label: "4K Motion & Video",
      count: videoCount,
      level: Math.min(100, Math.max(videoCount > 0 ? 35 : 10, (videoCount * 22) + Math.min(30, Math.floor(totalXp / 80)))),
      icon: Video,
      color: "#ef4444"
    },
    {
      label: "3D WebGL Raytracing",
      count: mockupCount,
      level: Math.min(100, Math.max(mockupCount > 0 ? 30 : 8, (mockupCount * 24) + Math.min(30, Math.floor(totalXp / 100)))),
      icon: Box,
      color: "#c084fc"
    },
    {
      label: "Neural Prompt Engine",
      count: aiCount,
      level: Math.min(100, Math.max(aiCount > 0 ? 25 : 12, (aiCount * 26) + Math.min(30, Math.floor(totalXp / 120)))),
      icon: Sparkles,
      color: "#ec4899"
    },
    {
      label: "Node Graph Workflows",
      count: pipelineCount,
      level: Math.min(100, Math.max(pipelineCount > 0 ? 35 : 10, (pipelineCount * 25) + Math.min(30, Math.floor(totalXp / 90)))),
      icon: Zap,
      color: "#38bdf8"
    },
    {
      label: "Brand Identity & Palettes",
      count: brandCount,
      level: Math.min(100, Math.max(brandCount > 0 ? 40 : 15, (brandCount * 20) + Math.min(35, Math.floor(totalXp / 70)))),
      icon: Palette,
      color: "#e1496d"
    },
  ];

  // Dynamically computed synergy score
  const avgLevel = disciplines.reduce((sum, d) => sum + d.level, 0) / disciplines.length;
  const synergyScore = avgLevel.toFixed(1);

  return (
    <div style={{
      background: sf, border: `1.5px solid ${bd}`, borderRadius: 20,
      padding: "24px 28px", position: "relative",
      boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.3)" : "0 8px 30px rgba(148,41,69,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: aura.grad, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: `0 4px 12px ${aura.glow}`,
          }}>
            <Disc size={16} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: tx }}>
              Multi-Disciplinary Creative DNA
            </h3>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11.5, color: mu }}>
              Real-time balance calculated from your active Vault creations
            </span>
          </div>
        </div>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11.5, fontWeight: 700, color: aura.primary }}>
          SYNERGY: {synergyScore}%
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {disciplines.map((d) => {
          const Icon = d.icon;
          return (
            <div key={d.label}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12.5, fontWeight: 600, color: tx, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={14} color={d.color} />
                  {d.label}
                  {d.count > 0 && (
                    <span style={{ fontSize: 10, fontFamily: "Poppins, sans-serif", color: mu, fontWeight: 500 }}>
                      ({d.count} creation{d.count !== 1 ? "s" : ""})
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: "Syne, sans-serif", fontSize: 12, fontWeight: 700, color: d.color }}>
                  {d.level}%
                </span>
              </div>
              <div style={{
                height: 7, borderRadius: 99,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                overflow: "hidden", position: "relative",
              }}>
                <div style={{
                  height: "100%", width: `${d.level}%`,
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${d.color}80, ${d.color})`,
                  boxShadow: `0 0 10px ${d.color}60`,
                  transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Trophy Cabinet & Badges (Dynamically Computed) ──────────────────────── */
function TrophyCabinet({ projects = [], xpState = {}, streak = 0, isDark, sf, bd, tx, mu, aura }) {
  const totalXp = xpState.totalXp || 0;
  const projectCount = (projects && projects.length) || 0;

  const videoCount = (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("video") || s.includes("editor");
  }).length;

  const mockupCount = (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("mockup") || s.includes("3d") || s.includes("image");
  }).length;

  const pipelineCount = (xpState.stats?.pipelines || 0) + (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("pipeline") || s.includes("node");
  }).length;

  // Dynamic achievement criteria evaluation
  const dynamicAchievements = [
    {
      id: "genesis",
      title: "Genesis Creator",
      desc: "Crafted your inaugural visual masterpiece",
      icon: Star,
      unlocked: projectCount > 0 || totalXp >= 20,
      statusText: (projectCount > 0 || totalXp >= 20) ? `Unlocked • ${projectCount || 1} Work Recorded` : "Craft your 1st project",
      xp: "+250 XP"
    },
    {
      id: "timeline",
      title: "4K Motion Reel",
      desc: "Composed a synchronized multi-track audio-video timeline",
      icon: Video,
      unlocked: videoCount > 0,
      statusText: videoCount > 0 ? `Unlocked • ${videoCount} Video${videoCount > 1 ? "s" : ""}` : "Create 1 Video Project",
      xp: "+500 XP"
    },
    {
      id: "webgl",
      title: "Raytrace Virtuoso",
      desc: "Rendered a photorealistic 3D PBR mockup studio scene",
      icon: Box,
      unlocked: mockupCount > 0,
      statusText: mockupCount > 0 ? `Unlocked • ${mockupCount} 3D Scene${mockupCount > 1 ? "s" : ""}` : "Render 1 3D Mockup",
      xp: "+450 XP"
    },
    {
      id: "vault",
      title: "Vault Guardian",
      desc: "Secured 3 or more encrypted creative assets with zero leakage",
      icon: ShieldCheck,
      unlocked: projectCount >= 3,
      statusText: projectCount >= 3 ? `Unlocked • ${projectCount} Assets in Vault` : `In Progress (${projectCount}/3 Vault Assets)`,
      xp: "+300 XP"
    },
    {
      id: "nodes",
      title: "Node Blueprint",
      desc: "Executed an automated creative workflow pipeline",
      icon: Zap,
      unlocked: pipelineCount > 0,
      statusText: pipelineCount > 0 ? `Unlocked • ${pipelineCount} Pipeline Run${pipelineCount > 1 ? "s" : ""}` : "Execute 1 Pipeline Graph",
      xp: "+600 XP"
    },
    {
      id: "streak",
      title: "Symphony Streak",
      desc: "Maintained a continuous 7-day creative output rhythm",
      icon: Flame,
      unlocked: streak >= 7,
      statusText: streak >= 7 ? `Unlocked • ${streak}d Streak Record` : `In Progress (${streak}/7 Streak Days)`,
      xp: "+750 XP"
    },
  ];

  const unlockedCount = dynamicAchievements.filter(a => a.unlocked).length;

  return (
    <div style={{
      background: sf, border: `1.5px solid ${bd}`, borderRadius: 20,
      padding: "24px 28px", position: "relative",
      boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.3)" : "0 8px 30px rgba(148,41,69,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: aura.grad, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: `0 4px 12px ${aura.glow}`,
          }}>
            <Trophy size={16} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: tx }}>
              Trophy & Milestone Cabinet
            </h3>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11.5, color: mu }}>
              Unlocked badges computed live from your verified achievements
            </span>
          </div>
        </div>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11.5, fontWeight: 700, color: unlockedCount > 0 ? "#22c55e" : mu }}>
          {unlockedCount}/{dynamicAchievements.length} Unlocked
        </span>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14,
      }}>
        {dynamicAchievements.map(ach => {
          const Icon = ach.icon;
          return (
            <div
              key={ach.id}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: 14,
                borderRadius: 16,
                background: ach.unlocked
                  ? (isDark ? "rgba(225, 73, 109, 0.08)" : "rgba(255, 240, 246, 0.7)")
                  : (isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"),
                border: `1.5px solid ${ach.unlocked ? (isDark ? "rgba(225,73,109,0.3)" : "rgba(225,73,109,0.25)") : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)")}`,
                opacity: ach.unlocked ? 1 : 0.65,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => {
                if (ach.unlocked) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 20px ${aura.glow}`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: ach.unlocked ? aura.grad : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"),
                display: "flex", alignItems: "center", justifyContent: "center",
                color: ach.unlocked ? "#fff" : mu, flexShrink: 0,
                boxShadow: ach.unlocked ? `0 4px 12px ${aura.glow}` : "none",
              }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, color: tx }}>
                    {ach.title}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: aura.primary }}>
                    {ach.xp}
                  </span>
                </div>
                <p style={{ margin: "4px 0 6px", fontFamily: "Poppins, sans-serif", fontSize: 11, color: mu, lineHeight: 1.4 }}>
                  {ach.desc}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontFamily: "Poppins, sans-serif", color: ach.unlocked ? "#22c55e" : mu, fontWeight: 600 }}>
                  {ach.unlocked ? <CheckCircle2 size={11} /> : <Lock size={11} />}
                  {ach.statusText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Creator Hub Main Section (Real Data Driven) ─────────────────────────── */
function CreatorHubSection({
  profile = {},
  projects = [],
  isDark,
  sf,
  bd,
  tx,
  mu,
  acc,
  accL,
  aura,
  persona,
  xpState,
  onEdit,
  onSelectPersona,
  onSelectAura,
  onOpenRankModal
}) {
  const grid = buildYearGrid(projects, 2026);
  const streak = calcStreak(grid);

  const pipelineCount = (xpState.stats?.pipelines || 0) + (projects || []).filter(p => {
    const s = `${p?.category || ""} ${p?.tool || ""} ${p?.title || ""}`.toLowerCase();
    return s.includes("pipeline") || s.includes("node");
  }).length;

  const calculatedGpuHours = ((projects.length * 1.2) + ((xpState.stats?.publishes || 0) * 0.6) + ((xpState.totalXp || 0) / 180)).toFixed(1);

  const stats = [
    { label: "Vault Masterpieces", value: `${projects.length}`, icon: FolderOpen, color: "#38bdf8", tag: "SAVED ASSETS" },
    { label: "Creative Streak", value: `${streak} Day${streak !== 1 ? "s" : ""}`, icon: Flame, color: "#f59e0b", tag: "FLOW STATE" },
    { label: "Active Pipelines", value: `${pipelineCount} Active`, icon: Zap, color: "#ec4899", tag: "NODE RUNNERS" },
    { label: "Render GPU Time", value: `${calculatedGpuHours} hrs`, icon: Cpu, color: "#22c55e", tag: "ACCELERATED" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 1. Holographic Creator Passport Card with XP Progress */}
      <CreatorPassportCard
        profile={profile}
        persona={persona}
        aura={aura}
        xpState={xpState}
        isDark={isDark}
        tx={tx}
        mu={mu}
        onEdit={onEdit}
        onSelectPersona={onSelectPersona}
        onSelectAura={onSelectAura}
        onOpenRankModal={onOpenRankModal}
      />

      {/* 2. Real Stat Bento Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                background: sf, border: `1.5px solid ${bd}`, borderRadius: 20,
                padding: "20px 22px", position: "relative", overflow: "hidden",
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 6px 24px rgba(148,41,69,0.05)",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = s.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = bd;
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${s.color}20`, border: `1px solid ${s.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.color,
                }}>
                  <Icon size={18} />
                </div>
                <span style={{
                  fontSize: 9.5, fontFamily: "Poppins, sans-serif", fontWeight: 700,
                  padding: "2px 8px", borderRadius: 6,
                  background: `${s.color}15`, color: s.color, letterSpacing: "0.06em",
                }}>
                  {s.tag}
                </span>
              </div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, color: tx }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: mu, marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Real Multi-Year Heatmap Output Matrix */}
      <Heatmap projects={projects} isDark={isDark} sf={sf} bd={bd} tx={tx} mu={mu} acc={acc} aura={aura} />

      {/* 4. Two Column Grid: Real Dynamic Creative DNA + Dynamic Trophy Cabinet */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        <CreativeDNAMatrix projects={projects} xpState={xpState} isDark={isDark} sf={sf} bd={bd} tx={tx} mu={mu} aura={aura} />
        <TrophyCabinet projects={projects} xpState={xpState} streak={streak} isDark={isDark} sf={sf} bd={bd} tx={tx} mu={mu} aura={aura} />
      </div>
    </div>
  );
}

/* ── Personal Info Section ────────────────────────────────────────────────── */
function PersonalInfoSection({ profile = {}, isDark, sf, bd, tx, mu, acc, aura, onEdit }) {
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Verified Studio Pioneer";

  return (
    <div style={{
      background: sf, border: `1.5px solid ${bd}`, borderRadius: 20,
      padding: "32px 36px", position: "relative",
      boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.3)" : "0 8px 30px rgba(148,41,69,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: tx }}>
            Personal & Studio Credentials
          </h2>
          <p style={{ margin: "4px 0 0", fontFamily: "Poppins, sans-serif", fontSize: 12, color: mu }}>
            Manage identity parameters, verified email addresses, and team attributes
          </p>
        </div>
        <button
          onClick={onEdit}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 12,
            background: "transparent",
            border: `1.5px solid ${aura.primary}`,
            color: aura.primary,
            fontFamily: "Poppins, sans-serif", fontSize: 12.5, fontWeight: 600,
            cursor: "pointer", transition: "all 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = aura.primary; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = aura.primary; }}
        >
          <Edit3 size={13} />
          Edit Information
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "22px 32px",
      }}>
        <Field label="Full Name" value={profile.name} isDark={isDark} tx={tx} mu={mu} icon={Sparkles} />
        <Field label="Primary Email" value={profile.email} isDark={isDark} tx={tx} mu={mu} icon={Mail} />
        <Field label="Phone Contact" value={profile.phone} isDark={isDark} tx={tx} mu={mu} icon={Phone} />
        <Field label="Company / Studio" value={profile.company} isDark={isDark} tx={tx} mu={mu} icon={Building} />
        <Field label="Territory / Country" value={profile.country} isDark={isDark} tx={tx} mu={mu} icon={Globe} />
        <Field label="Auth Provider" value={profile.provider ? profile.provider.toUpperCase() : "EMAIL / PASSWORD"} isDark={isDark} tx={tx} mu={mu} icon={Shield} />
        <Field label="Creation Timestamp" value={memberSince} isDark={isDark} tx={tx} mu={mu} icon={Star} />
        <Field label="Email Status" value={profile.emailVerified ? "Verified Studio Member ✓" : "Standard Registered"} isDark={isDark} tx={tx} mu={mu} icon={ShieldCheck} />
      </div>
    </div>
  );
}

/* ── Settings Section ────────────────────────────────────────────────────── */
function SettingsSection({ profile = {}, theme, onToggleTheme, isDark, sf, bd, tx, mu, acc, accL, aura }) {
  const isGoogle = profile.provider === "google";

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  const setPwField = k => v => setPw(f => ({ ...f, [k]: v }));
  const border = isDark ? "rgba(225,73,109,0.22)" : "rgba(148,41,69,0.18)";

  const changePassword = async () => {
    if (pw.next !== pw.confirm) { setPwMsg({ ok: false, text: "New passwords don't match." }); return; }
    if (pw.next.length < 6) { setPwMsg({ ok: false, text: "Password must be at least 6 characters." }); return; }
    setPwSaving(true); setPwMsg(null);
    try {
      const r = await fetch(`${API}/auth/change-password`, {
        method: "POST", headers: auth(),
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      setPwMsg({ ok: true, text: "Password changed successfully." });
      setPw({ current: "", next: "", confirm: "" });
    } catch (e) { setPwMsg({ ok: false, text: e.message }); }
    finally { setPwSaving(false); }
  };

  const themes = [
    {
      id: "light", label: "Pearl Studio (Light)",
      preview: (
        <div style={{ width: "100%", height: 52, borderRadius: 8, overflow: "hidden", display: "flex" }}>
          <div style={{ width: 36, background: "#f0eaf4", display: "flex", flexDirection: "column", gap: 4, padding: "6px 4px" }}>
            {["#d4b8c4","#e8c9d1","#ddb8c6"].map((c, i) => <div key={i} style={{ height: 6, borderRadius: 3, background: c }} />)}
          </div>
          <div style={{ flex: 1, background: "#f7f6fb", padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
            {["#e8d4d9","#f0e0e5","#eedce2"].map((c, i) => <div key={i} style={{ height: 6, borderRadius: 3, background: c }} />)}
          </div>
        </div>
      ),
    },
    {
      id: "dark", label: "Midnight Noir (Dark)",
      preview: (
        <div style={{ width: "100%", height: 52, borderRadius: 8, overflow: "hidden", display: "flex" }}>
          <div style={{ width: 36, background: "#1a0812", display: "flex", flexDirection: "column", gap: 4, padding: "6px 4px" }}>
            {["#5a1a2e","#7d2340","#3d0f1e"].map((c, i) => <div key={i} style={{ height: 6, borderRadius: 3, background: c }} />)}
          </div>
          <div style={{ flex: 1, background: "#0e060b", padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
            {["#2a0e18","#3d1525","#4a1a2e"].map((c, i) => <div key={i} style={{ height: 6, borderRadius: 3, background: c }} />)}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Appearance Section */}
      <div style={{
        background: sf, border: `1.5px solid ${bd}`, borderRadius: 20,
        padding: "28px 32px",
        boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.3)" : "0 8px 30px rgba(148,41,69,0.06)",
      }}>
        <h3 style={{ margin: "0 0 6px", fontFamily: "Syne, sans-serif", fontSize: 18, color: tx }}>
          Studio Aesthetics & Workspace Lighting
        </h3>
        <p style={{ margin: "0 0 20px", fontFamily: "Poppins, sans-serif", fontSize: 12, color: mu }}>
          Toggle between high-contrast Midnight Noir and radiant Pearl Studio
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {themes.map(t => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onToggleTheme && onToggleTheme(t.id)}
                style={{
                  background: "transparent",
                  border: `2px solid ${active ? aura.primary : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")}`,
                  borderRadius: 14, padding: "14px",
                  cursor: "pointer", textAlign: "left", position: "relative",
                  transition: "all 0.2s",
                  boxShadow: active ? `0 4px 16px ${aura.glow}` : "none",
                }}
              >
                {active && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    width: 20, height: 20, borderRadius: "50%",
                    background: aura.grad, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "#fff", fontWeight: 700,
                  }}>✓</div>
                )}
                {t.preview}
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 12.5, fontWeight: 700, color: tx, marginTop: 12 }}>
                  {t.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Change Password */}
      <div style={{
        background: sf, border: `1.5px solid ${bd}`, borderRadius: 20,
        padding: "28px 32px",
        boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.3)" : "0 8px 30px rgba(148,41,69,0.06)",
      }}>
        <h3 style={{ margin: "0 0 6px", fontFamily: "Syne, sans-serif", fontSize: 18, color: tx }}>
          Security & Access Key
        </h3>
        <p style={{ margin: "0 0 20px", fontFamily: "Poppins, sans-serif", fontSize: 12, color: mu }}>
          Manage your password and encryption credentials
        </p>

        {isGoogle ? (
          <p style={{ fontFamily: "Instrument Sans, sans-serif", fontSize: 14, color: mu, margin: 0 }}>
            You signed in with Google OAuth. Access key management is federated through your Google profile.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 440 }}>
            <Field label="Current Password" value={pw.current} onChange={setPwField("current")} type="password" isDark={isDark} border={border} tx={tx} mu={mu} icon={Lock} />
            <Field label="New Password" value={pw.next} onChange={setPwField("next")} type="password" isDark={isDark} border={border} tx={tx} mu={mu} icon={Lock} />
            <Field label="Confirm New Password" value={pw.confirm} onChange={setPwField("confirm")} type="password" isDark={isDark} border={border} tx={tx} mu={mu} icon={Lock} />
            {pwMsg && (
              <p style={{ margin: 0, fontFamily: "Poppins, sans-serif", fontSize: 12, color: pwMsg.ok ? "#22c55e" : "#e1496d", fontWeight: 600 }}>
                {pwMsg.text}
              </p>
            )}
            <button
              onClick={changePassword} disabled={pwSaving}
              style={{
                alignSelf: "flex-start",
                background: aura.grad,
                border: "none", borderRadius: 12, padding: "11px 24px",
                color: "#fff", fontFamily: "Syne, sans-serif", fontSize: 13.5,
                fontWeight: 700, cursor: pwSaving ? "wait" : "pointer", opacity: pwSaving ? 0.7 : 1,
                boxShadow: `0 4px 14px ${aura.glow}`,
              }}
            >
              {pwSaving ? "Updating Security Key…" : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Error Boundary for Safe Rendering ───────────────────────────────────── */
class ProfileErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ProfilePage Caught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "80vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center",
          color: "#0f0208", fontFamily: "Poppins, sans-serif",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "linear-gradient(135deg, #e1496d, #942945)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 30px rgba(225, 73, 109, 0.4)", marginBottom: 20,
            color: "#fff"
          }}>
            <Crown size={32} />
          </div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, margin: "0 0 8px", color: "#e1496d" }}>
            Creator Studio Initialized
          </h2>
          <div style={{
            background: "rgba(225,73,109,0.1)", border: "1px solid rgba(225,73,109,0.3)",
            padding: "12px 18px", borderRadius: 12, color: "#942945",
            fontSize: 12, fontFamily: "monospace", maxWidth: 600, margin: "0 0 20px", textAlign: "left",
            whiteSpace: "pre-wrap", wordBreak: "break-word"
          }}>
            {this.state.error ? `${this.state.error.name}: ${this.state.error.message}\n${this.state.error.stack || ""}` : "Unknown error"}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => {
                localStorage.removeItem("creatify_creator_persona");
                localStorage.removeItem("creatify_creator_aura");
                this.setState({ hasError: false, error: null });
              }}
              style={{
                padding: "10px 22px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #e1496d, #942945)",
                color: "#fff", fontFamily: "Syne, sans-serif", fontSize: 13.5, fontWeight: 700,
                cursor: "pointer", boxShadow: "0 4px 16px rgba(225,73,109,0.4)",
              }}
            >
              Reset & Open Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── Main Export ─────────────────────────────────────────────────────────── */
function ProfilePageInner({
  onBack,
  user,
  onSignOut,
  theme = "light",
  onToggleTheme,
  embedded = false,
  isDark: isDarkProp,
  THEME: THEMEProp,
}) {
  const isDark = isDarkProp !== undefined ? isDarkProp : theme === "dark";
  const bg   = isDark ? "#0e060b"                    : "#f7f6fb";
  const sf   = isDark ? "rgba(24, 7, 18, 0.85)"      : "rgba(255, 255, 255, 0.94)";
  const bd   = isDark ? "rgba(225, 73, 109, 0.22)"   : "rgba(148, 41, 69, 0.12)";
  const tx   = isDark ? "#fdf2f4"                    : "#0f0208";
  const mu   = isDark ? "rgba(255, 255, 255, 0.45)"  : "rgba(15, 2, 8, 0.48)";
  const acc  = "#942945";
  const accL = "#e1496d";

  const [activeTab, setActiveTab] = useState("hub"); // "hub" | "ledger" | "info" | "settings"
  const [profile, setProfile] = useState(user || {});
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);

  // Live Real-Time XP State
  const [xpState, setXpState] = useState(() => getXpState());

  // Listen to global XP updates across the whole app
  useEffect(() => {
    const handleXpUpdate = () => {
      setXpState(getXpState());
    };
    window.addEventListener("creatify_xp_updated", handleXpUpdate);
    return () => window.removeEventListener("creatify_xp_updated", handleXpUpdate);
  }, []);

  // Creative Persona & Aura state (persisted to localStorage safely with ID match)
  const [persona, setPersona] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("creatify_creator_persona") : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        const targetId = typeof parsed === "string" ? parsed : parsed?.id;
        const match = CREATIVE_PERSONAS.find(p => p.id === targetId);
        if (match) return match;
      }
    } catch (_) {}
    return CREATIVE_PERSONAS[0];
  });

  const [aura, setAura] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("creatify_creator_aura") : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        const targetId = typeof parsed === "string" ? parsed : parsed?.id;
        const match = SIGNATURE_AURAS.find(a => a.id === targetId);
        if (match) return match;
      }
    } catch (_) {}
    return SIGNATURE_AURAS[0];
  });

  const handleSelectPersona = (p) => {
    setPersona(p);
    localStorage.setItem("creatify_creator_persona", JSON.stringify({ id: p.id }));
  };

  const handleSelectAura = (a) => {
    setAura(a);
    localStorage.setItem("creatify_creator_aura", JSON.stringify({ id: a.id }));
  };

  /* Fetch data on mount */
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [pRes, prRes] = await Promise.all([
          fetch(`${API}/profile`, { headers: auth() }),
          fetch(`${API}/projects`, { headers: auth() }),
        ]);
        if (alive && pRes.ok) {
          const pData = await pRes.json();
          setProfile(pData.user || pData || {});
        }
        if (alive && prRes.ok) {
          const prData = await prRes.json();
          setProjects(Array.isArray(prData) ? prData : (prData?.projects || []));
        }
      } catch (_) { /* ignore */ }
      if (alive) setLoading(false);
    };
    load();
    return () => { alive = false; };
  }, []);

  const colors = { isDark, sf, bd, tx, mu, acc, accL, aura, persona, xpState };

  const tabs = [
    { id: "hub", label: "Creator Identity", icon: Sparkles },
    { id: "ledger", label: "Activity Ledger & XP", icon: History },
    { id: "info", label: "Personal Credentials", icon: Shield },
    { id: "settings", label: "Studio Settings", icon: Sliders },
  ];

  return (
    <div style={{
      background: bg,
      minHeight: "100vh",
      fontFamily: "Instrument Sans, sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Poppins:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.9; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Ambient Aurora Glow in Top Background */}
      <div style={{
        position: "absolute", top: -120, left: "20%", width: "60%", height: 320,
        background: `radial-gradient(ellipse at center, ${aura.glow} 0%, transparent 70%)`,
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0, opacity: isDark ? 0.45 : 0.35,
      }} />

      {/* ── Top Bar with Tab Switcher & Quick Signout ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 44px 18px",
        borderBottom: `1px solid ${bd}`,
        position: "relative",
        zIndex: 10,
        flexWrap: "wrap",
        gap: 16,
      }}>
        {/* Left: Quick Breadcrumb / Brand Mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: aura.grad, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: `0 4px 12px ${aura.glow}`,
          }}>
            <Crown size={18} />
          </div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: tx, letterSpacing: "-0.01em" }}>
              CREATIFY ARTIST STUDIO
            </div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: mu }}>
              Authenticated Creator: {profile?.name || user?.name || "Master Creator"} • <span style={{ color: aura.primary, fontWeight: 700 }}>{(xpState.totalXp || 0).toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Center: Modern Glassmorphic Nav Tabs */}
        <div style={{
          display: "flex", gap: 6, padding: "4px", borderRadius: 14,
          background: isDark ? "rgba(35, 10, 26, 0.7)" : "rgba(255, 240, 246, 0.8)",
          border: `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.25)" : "rgba(148, 41, 69, 0.15)"}`,
          backdropFilter: "blur(12px)",
        }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 18px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 500,
                  background: active ? aura.grad : "transparent",
                  color: active ? "#fff" : mu,
                  boxShadow: active ? `0 4px 14px ${aura.glow}` : "none",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Right: Sign Out Action */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onSignOut}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.06)",
              border: `1.5px solid ${isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)"}`,
              borderRadius: 12,
              padding: "8px 16px",
              color: "#ef4444",
              fontFamily: "Poppins, sans-serif",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.06)"; e.currentTarget.style.transform = "none"; }}
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Main Viewport Content ── */}
      <div style={{ padding: "32px 44px 80px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {loading ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            height: 300, color: mu, fontFamily: "Poppins, sans-serif", fontSize: 14, gap: 12,
          }}>
            <RefreshCw size={24} style={{ animation: "spin 1.2s linear infinite" }} />
            Synchronizing Creative Profile…
          </div>
        ) : activeTab === "hub" ? (
          <CreatorHubSection
            profile={profile}
            projects={projects}
            {...colors}
            onEdit={() => setShowEditModal(true)}
            onSelectPersona={handleSelectPersona}
            onSelectAura={handleSelectAura}
            onOpenRankModal={() => setShowRankModal(true)}
          />
        ) : activeTab === "ledger" ? (
          <ActivityLogSection
            {...colors}
          />
        ) : activeTab === "info" ? (
          <PersonalInfoSection
            profile={profile}
            {...colors}
            onEdit={() => setShowEditModal(true)}
          />
        ) : (
          <SettingsSection
            profile={profile}
            theme={theme}
            onToggleTheme={onToggleTheme}
            {...colors}
          />
        )}
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <EditModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSaved={u => setProfile(prev => ({ ...(prev || {}), ...u }))}
          {...colors}
        />
      )}

      {/* ── Rank Ladder Modal ── */}
      {showRankModal && (
        <RankLadderModal
          currentXp={xpState.totalXp || 0}
          currentLevel={xpState.levelInfo?.level || 1}
          onClose={() => setShowRankModal(false)}
          {...colors}
        />
      )}
    </div>
  );
}

export default function ProfilePage(props) {
  return (
    <ProfileErrorBoundary>
      <ProfilePageInner {...props} />
    </ProfileErrorBoundary>
  );
}
