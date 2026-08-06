import React, { useState, useEffect, useCallback } from "react";

/* ── API helpers ─────────────────────────────────────────────────────────── */
const API  = (window.API_URL || "http://localhost:3001") + "/api";
const auth = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("creatify_token")}`,
});

/* ── Activity-grid helpers ───────────────────────────────────────────────── */
function buildGrid(projects) {
  const today = new Date();
  const cells = [];
  for (let w = 51; w >= 0; w--) {
    const week = [];
    for (let d = 6; d >= 0; d--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - (w * 7 + d));
      const ds = dt.toISOString().slice(0, 10);
      const count = projects.filter(p => (p.updatedAt || p.createdAt || "").slice(0, 10) === ds).length;
      week.push({ date: ds, count });
    }
    cells.push(week);
  }
  return cells;
}

function aColor(n, dark) {
  if (n === 0) return dark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.07)";
  if (n === 1) return dark ? "#5a1a2e" : "#f2c4cf";
  if (n === 2) return dark ? "#7d2340" : "#e8899a";
  if (n === 3) return dark ? "#a82e54" : "#c95070";
  return dark ? "#942945" : "#942945";
}

function calcStreak(grid) {
  const flat = grid.flat().reverse();
  let streak = 0;
  for (const cell of flat) {
    if (cell.count > 0) streak++;
    else break;
  }
  return streak;
}

function getMonths(grid) {
  const months = [];
  let last = null;
  grid.forEach((week, wi) => {
    const mo = new Date(week[0].date).toLocaleString("default", { month: "short" });
    if (mo !== last) { months.push({ wi, l: mo }); last = mo; }
  });
  return months;
}

/* ── Small reusable components ───────────────────────────────────────────── */
function Avatar({ name = "", size = 52 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg,#942945 0%,#e1496d 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontFamily: "Syne,sans-serif",
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", isDark, border, tx, mu }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, fontFamily: "Poppins,sans-serif", color: mu, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
      {onChange ? (
        type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            rows={3}
            style={{
              background: "transparent", border: `1px solid ${border}`,
              borderRadius: 8, padding: "8px 12px", color: tx,
              fontFamily: "Instrument Sans,sans-serif", fontSize: 13,
              resize: "vertical", outline: "none",
            }}
          />
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            style={{
              background: "transparent", border: `1px solid ${border}`,
              borderRadius: 8, padding: "8px 12px", color: tx,
              fontFamily: "Instrument Sans,sans-serif", fontSize: 13, outline: "none",
            }}
          />
        )
      ) : (
        <span style={{ fontSize: 14, fontFamily: "Instrument Sans,sans-serif", color: tx }}>
          {value || <span style={{ color: mu, fontStyle: "italic" }}>—</span>}
        </span>
      )}
    </div>
  );
}

/* ── Edit Profile Modal ──────────────────────────────────────────────────── */
function EditModal({ profile, onClose, onSaved, isDark, sf, bd, tx, mu, acc }) {
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

  const border = isDark ? "rgba(225,73,109,0.22)" : "rgba(148,41,69,0.18)";

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: sf, border: `1px solid ${bd}`,
        borderRadius: 16, padding: "32px 36px", width: "100%", maxWidth: 520,
        display: "flex", flexDirection: "column", gap: 20, position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 18, background: "none", border: "none",
          color: mu, fontSize: 22, cursor: "pointer", lineHeight: 1,
        }}>×</button>
        <h2 style={{ margin: 0, fontFamily: "Syne,sans-serif", fontSize: 20, color: tx }}>Edit Profile</h2>
        <Field label="Name" value={form.name} onChange={set("name")} isDark={isDark} border={border} tx={tx} mu={mu} />
        <Field label="Phone" value={form.phone} onChange={set("phone")} isDark={isDark} border={border} tx={tx} mu={mu} />
        <Field label="Company" value={form.company} onChange={set("company")} isDark={isDark} border={border} tx={tx} mu={mu} />
        <Field label="Country" value={form.country} onChange={set("country")} isDark={isDark} border={border} tx={tx} mu={mu} />
        <Field label="Bio" value={form.bio} onChange={set("bio")} type="textarea" isDark={isDark} border={border} tx={tx} mu={mu} />
        {err && <p style={{ color: "#e1496d", fontFamily: "Poppins,sans-serif", fontSize: 12, margin: 0 }}>{err}</p>}
        <button
          onClick={save} disabled={saving}
          style={{
            background: `linear-gradient(135deg,${acc} 0%,#e1496d 100%)`,
            border: "none", borderRadius: 10, padding: "11px 0",
            color: "#fff", fontFamily: "Syne,sans-serif", fontSize: 14,
            fontWeight: 700, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ── Activity Heatmap ────────────────────────────────────────────────────── */
function Heatmap({ grid, isDark, sf, bd, tx, mu, acc }) {
  const months = getMonths(grid);
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const total = grid.flat().reduce((s, c) => s + c.count, 0);
  const streak = calcStreak(grid);

  return (
    <div style={{
      background: sf, border: `1px solid ${bd}`, borderRadius: 16,
      padding: "24px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontFamily: "Syne,sans-serif", fontSize: 16, color: tx }}>
          Activity
        </h3>
        <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: mu }}>
          {total} contributions this year · {streak} day streak
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        {/* Month labels */}
        <div style={{ display: "flex", marginLeft: 36, marginBottom: 4, position: "relative", height: 16 }}>
          {months.map(({ wi, l }) => (
            <div key={wi} style={{
              position: "absolute", left: wi * 14,
              fontFamily: "Poppins,sans-serif", fontSize: 10, color: mu,
            }}>{l}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {/* Day labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 6 }}>
            {days.map((d, i) => (
              <div key={d} style={{
                height: 11, fontSize: 9, fontFamily: "Poppins,sans-serif",
                color: i % 2 === 1 ? mu : "transparent", lineHeight: "11px",
              }}>{d}</div>
            ))}
          </div>
          {/* Grid cells */}
          {grid.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {week.map((cell, di) => (
                <div
                  key={di}
                  title={`${cell.date}: ${cell.count} project${cell.count !== 1 ? "s" : ""}`}
                  style={{
                    width: 11, height: 11, borderRadius: 2,
                    background: aColor(cell.count, isDark),
                    margin: "0 1px",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, justifyContent: "flex-end" }}>
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, color: mu }}>Less</span>
          {[0, 1, 2, 3, 4].map(n => (
            <div key={n} style={{ width: 11, height: 11, borderRadius: 2, background: aColor(n, isDark) }} />
          ))}
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, color: mu }}>More</span>
        </div>
      </div>
    </div>
  );
}

/* ── Profile Section ─────────────────────────────────────────────────────── */
function ProfileSection({ profile, projects, isDark, sf, bd, tx, mu, acc, accL, onProfileSaved }) {
  const [showEdit, setShowEdit] = useState(false);
  const grid = buildGrid(projects);
  const streak = calcStreak(grid);

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "—";

  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Activity", value: grid.flat().reduce((s, c) => s + c.count, 0) },
    { label: "Streak", value: `${streak}d` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Info card */}
      <div style={{ background: sf, border: `1px solid ${bd}`, borderRadius: 16, padding: "24px 28px", position: "relative" }}>
        <button
          onClick={() => setShowEdit(true)}
          style={{
            position: "absolute", top: 20, right: 20,
            background: "transparent", border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.25)"}`,
            borderRadius: 8, padding: "6px 14px", color: acc,
            fontFamily: "Poppins,sans-serif", fontSize: 12, fontWeight: 600,
            cursor: "pointer", transition: "all 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = acc; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = acc; }}
        >
          Edit Profile
        </button>
        <h3 style={{ margin: "0 0 20px", fontFamily: "Syne,sans-serif", fontSize: 16, color: tx }}>
          Personal Information
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: "18px 28px",
        }}>
          <Field label="Full Name" value={profile.name} isDark={isDark} tx={tx} mu={mu} />
          <Field label="Email" value={profile.email} isDark={isDark} tx={tx} mu={mu} />
          <Field label="Phone" value={profile.phone} isDark={isDark} tx={tx} mu={mu} />
          <Field label="Company" value={profile.company} isDark={isDark} tx={tx} mu={mu} />
          <Field label="Country" value={profile.country} isDark={isDark} tx={tx} mu={mu} />
          <Field label="Provider" value={profile.provider || "Email"} isDark={isDark} tx={tx} mu={mu} />
          <Field label="Member Since" value={memberSince} isDark={isDark} tx={tx} mu={mu} />
          <Field label="Email Verified" value={profile.emailVerified ? "Yes ✓" : "No"} isDark={isDark} tx={tx} mu={mu} />
        </div>
      </div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{
            background: sf, border: `1px solid ${bd}`, borderRadius: 16,
            padding: "22px 24px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 32, fontWeight: 700, color: acc }}>{value}</div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: mu, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
      {/* Heatmap */}
      <Heatmap grid={grid} isDark={isDark} sf={sf} bd={bd} tx={tx} mu={mu} acc={acc} />
      {showEdit && (
        <EditModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={onProfileSaved}
          isDark={isDark} sf={sf} bd={bd} tx={tx} mu={mu} acc={acc}
        />
      )}
    </div>
  );
}

/* ── Settings Section ────────────────────────────────────────────────────── */
function SettingsSection({ profile, theme, onToggleTheme, isDark, sf, bd, tx, mu, acc, accL }) {
  const isGoogle = profile.provider === "google";

  /* Change Password state */
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
      id: "light", label: "Pearl Studio",
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
      id: "dark", label: "Midnight Noir",
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Change Password */}
      <div style={{ background: sf, border: `1px solid ${bd}`, borderRadius: 16, padding: "24px 28px" }}>
        <h3 style={{ margin: "0 0 20px", fontFamily: "Syne,sans-serif", fontSize: 16, color: tx }}>Change Password</h3>
        {isGoogle ? (
          <p style={{ fontFamily: "Instrument Sans,sans-serif", fontSize: 14, color: mu, margin: 0 }}>
            You signed in with Google. Password management is handled through your Google account.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Current Password" value={pw.current} onChange={setPwField("current")} type="password" isDark={isDark} border={border} tx={tx} mu={mu} />
            <Field label="New Password" value={pw.next} onChange={setPwField("next")} type="password" isDark={isDark} border={border} tx={tx} mu={mu} />
            <Field label="Confirm New Password" value={pw.confirm} onChange={setPwField("confirm")} type="password" isDark={isDark} border={border} tx={tx} mu={mu} />
            {pwMsg && (
              <p style={{ margin: 0, fontFamily: "Poppins,sans-serif", fontSize: 12, color: pwMsg.ok ? "#4ade80" : "#e1496d" }}>
                {pwMsg.text}
              </p>
            )}
            <button
              onClick={changePassword} disabled={pwSaving}
              style={{
                alignSelf: "flex-start",
                background: `linear-gradient(135deg,${acc} 0%,${accL} 100%)`,
                border: "none", borderRadius: 10, padding: "10px 24px",
                color: "#fff", fontFamily: "Syne,sans-serif", fontSize: 14,
                fontWeight: 700, cursor: pwSaving ? "wait" : "pointer", opacity: pwSaving ? 0.7 : 1,
              }}
            >
              {pwSaving ? "Updating…" : "Update Password"}
            </button>
          </div>
        )}
      </div>
      {/* Appearance */}
      <div style={{ background: sf, border: `1px solid ${bd}`, borderRadius: 16, padding: "24px 28px" }}>
        <h3 style={{ margin: "0 0 20px", fontFamily: "Syne,sans-serif", fontSize: 16, color: tx }}>Appearance</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {themes.map(t => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onToggleTheme && onToggleTheme(t.id)}
                style={{
                  background: "transparent",
                  border: `2px solid ${active ? acc : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")}`,
                  borderRadius: 12, padding: "14px 14px 12px",
                  cursor: "pointer", textAlign: "left", position: "relative",
                  transition: "border-color 0.2s",
                }}
              >
                {active && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    width: 18, height: 18, borderRadius: "50%",
                    background: acc, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#fff", fontWeight: 700,
                  }}>✓</div>
                )}
                {t.preview}
                <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, fontWeight: 600, color: tx, marginTop: 10 }}>
                  {t.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main Export ─────────────────────────────────────────────────────────── */
export default function ProfilePage({ onBack, user, onSignOut, theme = "light", onToggleTheme }) {
  const isDark = theme === "dark";
  const bg   = isDark ? "#0e060b"                    : "#f7f6fb";
  const sf   = isDark ? "rgba(28,10,18,0.9)"         : "rgba(255,255,255,0.96)";
  const bd   = isDark ? "rgba(225,73,109,0.14)"      : "rgba(148,41,69,0.10)";
  const tx   = isDark ? "#fdf2f4"                    : "#0f0208";
  const mu   = isDark ? "rgba(255,255,255,0.38)"     : "rgba(15,2,8,0.44)";
  const acc  = "#942945";
  const accL = "#e1496d";

  const [activeNav, setActiveNav] = useState("profile");
  const [profile, setProfile]   = useState(user || {});
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

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
          setProfile(pData.user || pData);
        }
        if (alive && prRes.ok) {
          const prData = await prRes.json();
          setProjects(Array.isArray(prData) ? prData : (prData.projects || []));
        }
      } catch (_) { /* ignore */ }
      if (alive) setLoading(false);
    };
    load();
    return () => { alive = false; };
  }, []);

  const navBtn = (id, label) => (
    <button
      key={id}
      onClick={() => setActiveNav(id)}
      style={{
        width: "100%", textAlign: "left",
        background: activeNav === id
          ? (isDark ? "rgba(148,41,69,0.18)" : "rgba(148,41,69,0.10)")
          : "transparent",
        border: "none", borderRadius: 10,
        padding: "10px 14px",
        color: activeNav === id ? acc : mu,
        fontFamily: "Poppins,sans-serif", fontSize: 13, fontWeight: activeNav === id ? 600 : 400,
        cursor: "pointer", transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );

  const colors = { isDark, sf, bd, tx, mu, acc, accL };

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: bg, fontFamily: "Instrument Sans,sans-serif",
    }}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Poppins:wght@400;500;600&family=Instrument+Sans:wght@400;500;600&display=swap');`}</style>

      {/* ── Left Sidebar ── */}
      <aside style={{
        width: 200, flexShrink: 0,
        background: sf, borderRight: `1px solid ${bd}`,
        display: "flex", flexDirection: "column",
        padding: "28px 16px 24px",
      }}>
        {/* Back */}
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", color: mu,
            fontFamily: "Poppins,sans-serif", fontSize: 12,
            cursor: "pointer", textAlign: "left", marginBottom: 28,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back
        </button>

        {/* Avatar + Name */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <Avatar name={profile.name || user?.name || ""} size={52} />
          <span style={{
            fontFamily: "Syne,sans-serif", fontSize: 14, fontWeight: 600,
            color: tx, textAlign: "center", wordBreak: "break-word",
          }}>
            {profile.name || user?.name || "User"}
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {navBtn("profile", "Profile")}
          {navBtn("settings", "Settings")}
        </nav>

        {/* Sign Out */}
        <button
          onClick={onSignOut}
          style={{
            width: "100%", background: "none",
            border: `1px solid ${isDark ? "rgba(225,73,109,0.22)" : "rgba(148,41,69,0.18)"}`,
            borderRadius: 10, padding: "9px 0",
            color: accL, fontFamily: "Poppins,sans-serif",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(225,73,109,0.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
        >
          Sign Out
        </button>
      </aside>

      {/* ── Right Content ── */}
      <main style={{ flex: 1, overflow: "auto", padding: "36px 40px" }}>
        {loading ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "100%", color: mu, fontFamily: "Poppins,sans-serif", fontSize: 14,
          }}>
            Loading…
          </div>
        ) : activeNav === "profile" ? (
          <ProfileSection
            profile={profile}
            projects={projects}
            onProfileSaved={u => setProfile(prev => ({ ...prev, ...u }))}
            {...colors}
          />
        ) : (
          <SettingsSection
            profile={profile}
            theme={theme}
            onToggleTheme={onToggleTheme}
            {...colors}
          />
        )}
      </main>
    </div>
  );
}
