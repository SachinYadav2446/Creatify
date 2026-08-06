import { useState, useEffect } from "react";

const API  = (window.API_URL || "http://localhost:3001") + "/api";
const auth = () => ({ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("creatify_token")}` });

// ── Tiny UI mock inside each theme card ──────────────────────────────────────
function ThemeMockUI({ isDarkTheme }) {
  const bg    = isDarkTheme ? "#0e060b" : "#f7f6fb";
  const surf  = isDarkTheme ? "#1a0f14" : "#ffffff";
  const bd    = isDarkTheme ? "rgba(225,73,109,0.18)" : "rgba(148,41,69,0.10)";
  const tx    = isDarkTheme ? "#fdf2f4" : "#0f0208";
  const mu    = isDarkTheme ? "rgba(255,255,255,0.28)" : "rgba(15,2,8,0.3)";
  const acc   = "#942945";
  const accL  = "#e1496d";
  const side  = isDarkTheme ? "rgba(14,6,11,0.96)" : "rgba(253,248,250,0.96)";

  return (
    <div style={{ width:"100%", height:"100%", background:bg, borderRadius:10, overflow:"hidden", position:"relative", display:"flex" }}>
      {/* Sidebar strip */}
      <div style={{ width:28, background:side, borderRight:`1px solid ${bd}`, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:8, gap:5, flexShrink:0 }}>
        <div style={{ width:14, height:14, borderRadius:"50%", background:`linear-gradient(135deg,${acc},${accL})` }}/>
        <div style={{ width:1, height:8, background:bd, margin:"2px 0" }}/>
        {[accL, mu, mu, mu].map((c,i)=>(
          <div key={i} style={{ width:16, height:16, borderRadius:4, background: i===0?`${acc}25`:"transparent",
            border: i===0?`1.5px solid ${acc}50`:"none",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:8, height:8, borderRadius:2, background: i===0?acc:mu, opacity: i===0?1:0.4 }}/>
          </div>
        ))}
      </div>
      {/* Main area */}
      <div style={{ flex:1, padding:"8px 10px", overflow:"hidden", display:"flex", flexDirection:"column", gap:6 }}>
        {/* Hero band */}
        <div style={{ borderRadius:6, background: isDarkTheme
          ? "linear-gradient(135deg,#0f0408,#1a0f14)"
          : "linear-gradient(135deg,#fdf2f4,#f7edf1)",
          padding:"8px 10px", display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ width:"55%", height:7, borderRadius:3, background:`linear-gradient(90deg,${acc},${accL})`, opacity:0.9 }}/>
          <div style={{ width:"38%", height:5, borderRadius:2, background:mu, opacity:0.5 }}/>
          <div style={{ marginTop:3, width:52, height:16, borderRadius:20,
            background:`linear-gradient(135deg,${acc},${accL})`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:28, height:4, borderRadius:2, background:"rgba(255,255,255,0.7)" }}/>
          </div>
        </div>
        {/* Content cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:4, flex:1 }}>
          {[acc, accL, "#b13453"].map((c,i)=>(
            <div key={i} style={{ background:surf, border:`1px solid ${bd}`, borderRadius:6,
              padding:"5px 6px", display:"flex", flexDirection:"column", gap:3 }}>
              <div style={{ width:"60%", height:4, borderRadius:2, background:c, opacity:0.8 }}/>
              <div style={{ width:"90%", height:3, borderRadius:2, background:mu, opacity:0.4 }}/>
              <div style={{ width:"70%", height:3, borderRadius:2, background:mu, opacity:0.3 }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Theme preview images (screenshots of actual app themes) ────────────────
import darkThemeImg  from "../assets/images/theme_dark.png";
import lightThemeImg from "../assets/images/theme_light.png";

const THEMES = [
  {
    id:      "light",
    name:    "Pearl Studio",
    tagline: "Crisp daylight mode",
    desc:    "A clean, minimal canvas bathed in soft blush tones. Built for clarity and focus in bright environments.",
    img:     lightThemeImg,
  },
  {
    id:      "dark",
    name:    "Midnight Noir",
    tagline: "Immersive dark mode",
    desc:    "Deep wine-black aesthetic with crimson accents. Reduces eye strain and intensifies creative focus.",
    img:     darkThemeImg,
  },
];

export default function SettingsPage({ onBack, user, onSignOut, theme="light", onToggleTheme }) {
  const dk      = theme === "dark";
  const bg      = dk ? "#0e060b"               : "#f7f6fb";
  const sf      = dk ? "rgba(28,10,18,0.88)"   : "rgba(255,255,255,0.96)";
  const bd      = dk ? "rgba(225,73,109,0.14)" : "rgba(148,41,69,0.10)";
  const tx      = dk ? "#fdf2f4"               : "#0f0208";
  const mu      = dk ? "rgba(255,255,255,0.38)": "rgba(15,2,8,0.44)";
  const accent  = "#942945";
  const accentL = "#e1496d";

  const [profile,   setProfile]   = useState(null);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew,     setPwNew]     = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg,     setPwMsg]     = useState("");
  const [pwSaving,  setPwSaving]  = useState(false);
  const [hovered,   setHovered]   = useState(null);

  useEffect(() => {
    fetch(`${API}/profile`,{headers:auth()}).then(r=>r.json())
      .then(d=>setProfile(d.user||d||user||{}))
      .catch(()=>setProfile(user||{}));
  },[]);

  async function handleChangePassword(e) {
    e.preventDefault();
    if (pwNew !== pwConfirm) { setPwMsg("Passwords do not match."); return; }
    if (pwNew.length < 6)    { setPwMsg("Minimum 6 characters."); return; }
    setPwSaving(true); setPwMsg("");
    try {
      const res  = await fetch(`${API}/auth/change-password`,{
        method:"POST", headers:auth(),
        body:JSON.stringify({ currentPassword:pwCurrent, newPassword:pwNew }),
      });
      const data = await res.json();
      setPwMsg(res.ok ? "Password updated." : data.error||"Failed.");
      if (res.ok) { setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
    } catch { setPwMsg("Network error."); }
    finally { setPwSaving(false); setTimeout(()=>setPwMsg(""),3500); }
  }

  const isGoogle = profile?.provider && profile.provider !== "email";

  const inpStyle = { width:"100%", boxSizing:"border-box",
    background:dk?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)",
    border:`1px solid ${bd}`, borderRadius:9, padding:"11px 14px",
    fontFamily:"'Instrument Sans',sans-serif", fontSize:13, color:tx, outline:"none" };

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"'Instrument Sans',sans-serif", color:tx }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Poppins:wght@400;500;600&family=Instrument+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:rgba(148,41,69,0.22);border-radius:5px;}
        input:focus,textarea:focus{outline:none;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      `}</style>

      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:50, height:58,
        background:dk?"rgba(14,6,11,0.95)":"rgba(247,246,251,0.95)",
        backdropFilter:"blur(14px)", borderBottom:`1px solid ${bd}`,
        display:"flex", alignItems:"center", gap:14, padding:"0 32px" }}>
        <button onClick={onBack} style={{ background:"none", border:`1px solid ${bd}`,
          borderRadius:9, padding:"6px 14px", color:mu, cursor:"pointer",
          fontFamily:"'Poppins',sans-serif", fontSize:12, display:"flex", alignItems:"center", gap:5,
          transition:"border-color 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=accent}
          onMouseLeave={e=>e.currentTarget.style.borderColor=bd}>
          ← Back
        </button>
        <span style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18,
          background:`linear-gradient(90deg,${accent},${accentL})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Settings</span>
      </div>

      {/* Body */}
      <div style={{ maxWidth:780, margin:"0 auto", padding:"40px 28px",
        display:"flex", flexDirection:"column", gap:28, animation:"fadeIn 0.35s ease" }}>

        {/* ══ APPEARANCE ══════════════════════════════════════════════════════ */}
        <div style={{ background:sf, border:`1px solid ${bd}`, borderRadius:20,
          padding:"28px 32px", backdropFilter:"blur(20px)" }}>

          <div style={{ marginBottom:24 }}>
            <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:20,
              color:tx, margin:"0 0 4px" }}>Appearance</h3>
            <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:14,
              color:mu, margin:0 }}>Choose the visual identity of your workspace.</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {THEMES.map(t => {
              const active  = theme === t.id;
              const isHov   = hovered === t.id;
              return (
                <button key={t.id}
                  onClick={() => onToggleTheme && onToggleTheme(t.id)}
                  onMouseEnter={() => setHovered(t.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    border: `2px solid ${active ? accent : (isHov ? accentL+"55" : bd)}`,
                    borderRadius: 16, overflow:"hidden", cursor:"pointer",
                    background: "none", padding:0, textAlign:"left", outline:"none",
                    transition:"border-color 0.2s, transform 0.2s",
                    transform: isHov && !active ? "translateY(-2px)" : "none",
                  }}>

                  {/* Preview window — actual screenshot */}
                  <div style={{ height:180, position:"relative", overflow:"hidden" }}>
                    <img src={t.img} alt={t.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top left", display:"block",
                        filter: isHov && !active ? "brightness(1.05)" : "none", transition:"filter 0.2s" }}
                    />
                    {/* Active glow overlay */}
                    {active && (
                      <div style={{ position:"absolute", inset:0, borderRadius:"14px 14px 0 0",
                        background:`linear-gradient(135deg,${accent}15,${accentL}10)`,
                        pointerEvents:"none" }}/>
                    )}
                    {/* Active checkmark badge */}
                    {active && (
                      <div style={{ position:"absolute", top:10, right:10,
                        width:26, height:26, borderRadius:"50%",
                        background:`linear-gradient(135deg,${accent},${accentL})`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:`0 4px 12px ${accent}60` }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div style={{
                    padding:"16px 18px",
                    background: active
                      ? (dk ? "rgba(148,41,69,0.14)" : "rgba(148,41,69,0.06)")
                      : (dk ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"),
                    borderTop: `1px solid ${active ? accent+"30" : bd}`,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                      <span style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:15,
                        color: active ? accent : tx }}>
                        {t.name}
                      </span>
                      <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:600,
                        color: active ? accentL : mu, letterSpacing:"0.04em",
                        background: active ? `${accentL}18` : "transparent",
                        padding: active ? "1px 8px" : "0",
                        borderRadius: active ? 20 : 0,
                        border: active ? `1px solid ${accentL}30` : "none" }}>
                        {active ? "Active" : t.tagline}
                      </span>
                    </div>
                    <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:12.5,
                      color:mu, margin:0, lineHeight:1.55 }}>{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ CHANGE PASSWORD ══════════════════════════════════════════════════ */}
        <div style={{ background:sf, border:`1px solid ${bd}`, borderRadius:20,
          padding:"28px 32px", backdropFilter:"blur(20px)" }}>
          <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:20,
            color:tx, margin:"0 0 4px" }}>Security</h3>
          <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:14,
            color:mu, margin:"0 0 22px" }}>
            {isGoogle
              ? "You signed in with Google — manage your password through your Google account."
              : "Update your account password anytime. Minimum 6 characters."}
          </p>

          {!isGoogle && (
            <form onSubmit={handleChangePassword}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 18px", marginBottom:16 }}>
                {[
                  ["Current Password", pwCurrent, setPwCurrent],
                  ["New Password",     pwNew,     setPwNew],
                  ["Confirm New",      pwConfirm, setPwConfirm],
                ].map(([lbl,val,set]) => (
                  <div key={lbl}>
                    <label style={{ display:"block", fontFamily:"'Poppins',sans-serif", fontSize:11,
                      fontWeight:600, color:mu, marginBottom:7,
                      letterSpacing:"0.05em", textTransform:"uppercase" }}>{lbl}</label>
                    <input type="password" value={val}
                      onChange={e=>set(e.target.value)} placeholder="••••••••"
                      style={inpStyle}
                      onFocus={e=>e.target.style.borderColor=accent}
                      onBlur={e=>e.target.style.borderColor=bd}/>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <button type="submit" disabled={pwSaving} style={{
                  background:`linear-gradient(135deg,${accent},${accentL})`,
                  border:"none", borderRadius:10, padding:"11px 28px",
                  color:"#fff", fontFamily:"'Poppins',sans-serif", fontWeight:600,
                  fontSize:14, cursor:pwSaving?"wait":"pointer", opacity:pwSaving?0.7:1,
                  transition:"transform 0.2s" }}
                  onMouseEnter={e=>{ if(!pwSaving) e.currentTarget.style.transform="translateY(-1px)"; }}
                  onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  {pwSaving ? "Updating…" : "Update Password"}
                </button>
                {pwMsg && (
                  <span style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:13,
                    color: pwMsg === "Password updated." ? "#4ade80" : accentL }}>
                    {pwMsg}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>

        {/* ══ SIGN OUT ══════════════════════════════════════════════════════════ */}
        <div style={{ background:sf,
          border:`1px solid ${dk?"rgba(225,73,109,0.14)":"rgba(148,41,69,0.10)"}`,
          borderRadius:20, padding:"24px 32px", backdropFilter:"blur(20px)",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:24 }}>
          <div>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:17,
              color:tx, marginBottom:4 }}>Sign Out</div>
            <div style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:13.5, color:mu }}>
              Signed in as <strong style={{ color:tx }}>{user?.email||"—"}</strong>.
              This will end your session on this device.
            </div>
          </div>
          <button onClick={onSignOut} style={{
            background:`linear-gradient(135deg,rgba(225,73,109,0.12),rgba(148,41,69,0.08))`,
            border:"1px solid rgba(225,73,109,0.32)", borderRadius:12,
            padding:"12px 28px", color:accentL,
            fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:14,
            cursor:"pointer", flexShrink:0, transition:"all 0.2s", whiteSpace:"nowrap" }}
            onMouseEnter={e=>{
              e.currentTarget.style.background=`linear-gradient(135deg,rgba(225,73,109,0.22),rgba(148,41,69,0.18))`;
              e.currentTarget.style.borderColor="rgba(225,73,109,0.55)";
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background=`linear-gradient(135deg,rgba(225,73,109,0.12),rgba(148,41,69,0.08))`;
              e.currentTarget.style.borderColor="rgba(225,73,109,0.32)";
            }}>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
