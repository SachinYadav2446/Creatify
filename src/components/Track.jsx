import { useMemo } from "react";
import { TRACK_COLORS, clamp } from "../constants";
import { Volume2, VolumeX, Lock, Unlock, X, Code, Terminal, Monitor, Type, Music, Sparkles, Shapes, Film, Image as ImageIcon, Tag } from "lucide-react";

function Waveform({ clip, PX_PER_SEC }) {
  const bars = useMemo(() => {
    const n = Math.max(8, Math.floor((clip.duration * PX_PER_SEC) / 4));
    const seed = (clip.id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const arr = [];
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const base = 0.35 + Math.sin(t * 18 + seed) * 0.2 + Math.sin(t * 7.3 + seed * 0.3) * 0.15;
      arr.push(clamp01(base + (pseudoRand(seed + i) - 0.5) * 0.4));
    }
    return arr;
  }, [clip.id, clip.duration, PX_PER_SEC]);

  return (
    <div style={{
      position: "absolute", inset: 0, padding: "6px 10px",
      display: "flex", alignItems: "center", gap: 2, pointerEvents: "none", opacity: 0.9,
    }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 2,
          height: `${Math.max(6, h * 100)}%`,
          borderRadius: 1,
          background: "#e11d48",
          opacity: 0.75,
        }} />
      ))}
    </div>
  );
}

function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function pseudoRand(n) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function DrawFadeHandles({ clip, PX_PER_SEC }) {
  const w = clip.duration * PX_PER_SEC;
  const fadeInW = Math.min((clip.audio?.fadeIn || clip.fadeIn || 0) * PX_PER_SEC, w / 2);
  const fadeOutW = Math.min((clip.audio?.fadeOut || clip.fadeOut || 0) * PX_PER_SEC, w / 2);
  return (
    <>
      {fadeInW > 4 && (
        <svg width={fadeInW} height="100%" viewBox={`0 0 ${fadeInW} 40`} preserveAspectRatio="none"
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <path d={`M0 40 L${fadeInW} 40 L${fadeInW} 0 Z`} fill="#4f46e5" opacity="0.25" />
        </svg>
      )}
      {fadeOutW > 4 && (
        <svg width={fadeOutW} height="100%" viewBox={`0 0 ${fadeOutW} 40`} preserveAspectRatio="none"
          style={{ position: "absolute", right: 0, top: 0, pointerEvents: "none" }}>
          <path d={`M0 0 L0 40 L${fadeOutW} 40 Z`} fill="#4f46e5" opacity="0.25" />
        </svg>
      )}
    </>
  );
}

function TransitionBadge({ clip, PX_PER_SEC, side }) {
  const key = side === "in" ? "transitionIn" : "transitionOut";
  const durKey = side === "in" ? "transitionInDur" : "transitionOutDur";
  const t = clip[key];
  const dur = clip[durKey] || 0;
  if (!t || t === "none" || dur <= 0.01) return null;
  const w = Math.min(dur * PX_PER_SEC, clip.duration * PX_PER_SEC / 2);
  if (w < 8) return null;
  const style = {
    position: "absolute",
    [side === "in" ? "left" : "right"]: 0,
    top: 0,
    width: w,
    height: "100%",
    pointerEvents: "none",
  };
  const d = side === "in"
    ? `M0 0 L${w} 0 L${w * 0.2} 50% L${w} 100% L0 100% Z`
    : `M${w} 0 L0 0 L${w * 0.8} 50% L0 100% L${w} 100% Z`;
  return (
    <svg style={style} width={w} height="100%" viewBox={`0 0 ${w} 40`} preserveAspectRatio="none">
      <path d={d} fill="#4f46e5" opacity="0.2" />
      <path d={d} fill="none" stroke="#4f46e5" strokeWidth="1" opacity="0.6" />
      <text x={side === "in" ? 4 : w - 4} y="20" fontSize="9"
        textAnchor={side === "in" ? "start" : "end"}
        fill="#4f46e5" fontFamily="'Poppins',sans-serif" fontWeight="700">
        {side === "in" ? "◀" : "▶"}
      </text>
    </svg>
  );
}

export default function Track({
  track, state, dispatch, PX_PER_SEC,
  onTimelineClick, onClipMouseDown, onResizeMouseDown,
  onTrackDragOver, onTrackDrop, onTrackDragStart, index,
}) {
  const colors = TRACK_COLORS[track.type] || TRACK_COLORS.video;
  const selectedIds = new Set(state.selectedClips || [state.selectedClip].filter(Boolean));
  const hasSolo = state.tracks.some((t) => t.solo);
  const muted = track.muted || (hasSolo && !track.solo);

  return (
    <div
      className="track-row"
      draggable
      onDragStart={(e) => onTrackDragStart?.(e, index)}
      onDragOver={(e) => onTrackDragOver?.(e, index)}
      onDrop={(e) => onTrackDrop?.(e, index)}
      style={{
        minHeight: 48,
        display: "flex",
        alignItems: "stretch",
        borderBottom: "1px solid #e2e8f0",
        width: "100%",
        position: "relative",
        background: state.selectedTrack === track.id ? "#f8fafc" : "#ffffff",
        opacity: muted ? 0.5 : 1,
      }}
      onClickCapture={(e) => {
        if (e.target.closest(".clip-block") || e.target.closest(".track-label-actions")) return;
        dispatch({ type: "SET_SELECTED_TRACK", trackId: track.id });
        dispatch({ type: "DESELECT_ALL" });
      }}
    >
      {/* ── Track Label (sticky left) ── */}
      <div
        className="track-label"
        style={{
          width: 170, minWidth: 170, padding: "0 10px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          fontSize: 11, gap: 6,
          fontFamily: "'Instrument Sans', sans-serif",
          position: "sticky", left: 0, zIndex: 12,
          boxShadow: "2px 0 6px -2px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: 1 }}>
          <div style={{
            fontSize: 9, color: colors.label, letterSpacing: "0.06em",
            textTransform: "uppercase", fontWeight: 700,
            fontFamily: "'Poppins', sans-serif", display:"flex", alignItems:"center", gap:"5px"
          }}>
            <span>{trackIconFor(track.type)}</span>
            <span>{track.type}</span>
          </div>
          <input
            value={track.name || ""}
            onChange={(e) => dispatch({ type: "RENAME_TRACK", trackId: track.id, name: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: 11.5, color: "#1e293b", background: "transparent",
              border: "none", outline: "none", padding: 0,
              fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600,
              width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}
            placeholder="Track name..."
          />
        </div>

        <div className="track-label-actions" style={{
          display: "flex", gap: 3, flexShrink: 0, alignItems: "center",
        }}>
          <button
            title={track.muted ? "Unmute" : "Mute"}
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_TRACK_MUTE", trackId: track.id }); }}
            style={btnStyle(track.muted, "#ef4444")}
          >
            {track.muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
          <button
            title={track.solo ? "Unsolo" : "Solo"}
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_TRACK_SOLO", trackId: track.id }); }}
            style={btnStyle(track.solo, "#f59e0b")}
          >
            S
          </button>
          <button
            title={track.locked ? "Unlock" : "Lock"}
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_TRACK_LOCK", trackId: track.id }); }}
            style={btnStyle(track.locked, "#4f46e5")}
          >
            {track.locked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
          <button
            title="Remove track"
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "REMOVE_TRACK", trackId: track.id }); }}
            style={{ ...btnStyle(false), color: "#94a3b8" }}
            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
            onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* ── Clips Area ── */}
      <div
        style={{
          flex: 1, position: "relative", cursor: "crosshair",
          background: track.locked ? "rgba(241,245,249,0.7)" : "#ffffff",
        }}
        onClick={onTimelineClick}
      >
        {track.clips.map((clip) => {
          const isSelected = selectedIds.has(clip.id);
          const clipW = Math.max(clip.duration * PX_PER_SEC - 2, 12);
          const clipColor = TRACK_COLORS[clip.type] || colors;

          return (
            <div
              key={clip.id}
              className={`clip-block${isSelected ? " selected" : ""}`}
              draggable={!track.locked}
              onMouseDown={(e) => onClipMouseDown(e, track.id, clip, track.locked)}
              style={{
                position: "absolute",
                left: clip.start * PX_PER_SEC,
                width: clipW,
                top: 4,
                height: 38,
                background: clipColor.gradient || clipColor.bg,
                border: isSelected ? "2px solid #4f46e5" : `1px solid ${clipColor.border}`,
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                zIndex: isSelected ? 11 : 10,
                boxShadow: isSelected ? "0 0 0 2px rgba(79, 70, 229, 0.2), 0 4px 12px rgba(79, 70, 229, 0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
                cursor: track.locked ? "not-allowed" : "grab",
                transition: "box-shadow 0.1s, border-color 0.1s",
              }}
            >
              {clip.imageEl && (
                <img
                  src={clip.url} alt=""
                  style={{
                    height: "100%", width: "auto", minWidth: "30%",
                    objectFit: "cover", opacity: 0.9, pointerEvents: "none",
                  }}
                  crossOrigin="anonymous"
                />
              )}

              {clip.type === "audio" && <Waveform clip={clip} PX_PER_SEC={PX_PER_SEC} />}

              {/* Code Snippet Tag */}
              {clip.type === "code" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  padding: "0 8px", fontWeight: 700, fontSize: 11,
                  color: "#1e3a8a", fontFamily: "'JetBrains Mono', monospace",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  <span style={{ padding: "1px 5px", borderRadius: 4, background: "#dbeafe", border: "1px solid #bfdbfe", color: "#1d4ed8", marginRight: 6, fontSize: 9.5 }}>
                    &lt;/&gt;
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {clip.filename || clip.name || "Code Snippet"}
                  </span>
                </div>
              )}

              {/* Terminal Window Tag */}
              {clip.type === "terminal" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  padding: "0 8px", fontWeight: 700, fontSize: 11,
                  color: "#14532d", fontFamily: "'JetBrains Mono', monospace",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  <span style={{ padding: "1px 5px", borderRadius: 4, background: "#dcfce7", border: "1px solid #bbf7d0", color: "#15803d", marginRight: 6, fontSize: 9.5 }}>
                    $_
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {clip.command ? `$ ${clip.command.slice(0, 20)}...` : clip.name}
                  </span>
                </div>
              )}

              {/* Browser Mockup Frame Tag */}
              {clip.type === "mockup" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  padding: "0 8px", fontWeight: 700, fontSize: 11,
                  color: "#581c87", fontFamily: "'Poppins', sans-serif",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  <span style={{ padding: "1px 5px", borderRadius: 4, background: "#f3e8ff", border: "1px solid #e9d5ff", color: "#7e22ce", marginRight: 6, fontSize: 9.5 }}>
                    🖥️
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {clip.urlBar || clip.name || "Browser Window"}
                  </span>
                </div>
              )}

              {/* Dev Badge Tag */}
              {clip.type === "badge" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  padding: "0 8px", fontWeight: 700, fontSize: 11,
                  color: "#78350f", fontFamily: "'Poppins', sans-serif",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  <span style={{ marginRight: 6 }}>{clip.icon || "🏷️"}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {clip.name || "Badge"}
                  </span>
                </div>
              )}

              {/* Text clip */}
              {clip.type === "text" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  padding: "0 8px", fontWeight: 700, fontSize: 11,
                  color: "#701a75", fontFamily: "'Poppins',sans-serif",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  <span style={{ padding: "1px 5px", borderRadius: 4, background: "#fae8ff", border: "1px solid #f5d0fe", color: "#a21caf", marginRight: 6, fontSize: 9.5 }}>
                    T
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    “{clip.text || ""}”
                  </span>
                </div>
              )}

              {/* Sticker Emoji */}
              {clip.type === "sticker" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  {clip.emoji || "✨"}
                </div>
              )}

              {/* Shape */}
              {clip.type === "shape" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#0d9488" }}>
                  {clip.shapeIcon || "◆"}
                </div>
              )}

              <TransitionBadge clip={clip} PX_PER_SEC={PX_PER_SEC} side="in" />
              <TransitionBadge clip={clip} PX_PER_SEC={PX_PER_SEC} side="out" />
              <DrawFadeHandles clip={clip} PX_PER_SEC={PX_PER_SEC} />

              <div style={{
                position: "absolute", left: 0, right: 0,
                padding: "2px 6px", display: "flex", alignItems: "flex-end",
                justifyContent: "space-between", bottom: 0, pointerEvents: "none",
              }}>
                <span style={{
                  fontSize: 9.5, color: "#475569",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  maxWidth: "75%", fontWeight: 600,
                  fontFamily: "'Poppins',sans-serif",
                }}>
                  {["text", "code", "terminal", "mockup", "badge"].includes(clip.type) ? "" : clip.name}
                </span>
              </div>

              {/* Left trim handle */}
              <div
                title="Trim Left"
                style={{
                  position: "absolute", left: 0, top: 0, width: 6, height: "100%",
                  cursor: track.locked ? "not-allowed" : "ew-resize",
                  background: isSelected ? "#4f46e5" : "transparent",
                }}
                onMouseDown={(e) => onResizeMouseDown(e, track.id, clip, "left", track.locked)}
              />
              {/* Right trim handle */}
              <div
                title="Trim Right"
                style={{
                  position: "absolute", right: 0, top: 0, width: 6, height: "100%",
                  cursor: track.locked ? "not-allowed" : "ew-resize",
                  background: isSelected ? "#4f46e5" : "transparent",
                }}
                onMouseDown={(e) => onResizeMouseDown(e, track.id, clip, "right", track.locked)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function trackIconFor(type) {
  switch (type) {
    case "video":    return <Film size={12} />;
    case "image":    return <ImageIcon size={12} />;
    case "code":     return <Code size={12} />;
    case "terminal": return <Terminal size={12} />;
    case "mockup":   return <Monitor size={12} />;
    case "badge":    return <Tag size={12} />;
    case "text":     return <Type size={12} />;
    case "audio":    return <Music size={12} />;
    case "shape":    return <Shapes size={12} />;
    case "sticker":  return <Sparkles size={12} />;
    default:         return <Film size={12} />;
  }
}

function btnStyle(active, activeColor = "#4f46e5") {
  return {
    width: 20, height: 20, borderRadius: 4, border: "none",
    background: active ? `${activeColor}15` : "#f1f5f9",
    color: active ? activeColor : "#64748b",
    cursor: "pointer", fontSize: 10, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s, color 0.15s",
  };
}
