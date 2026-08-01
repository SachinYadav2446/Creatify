import { useMemo } from "react";
import { TRACK_COLORS } from "../constants";

function Waveform({ clip, PX_PER_SEC, colors }) {
  const bars = useMemo(() => {
    const n = Math.max(6, Math.floor((clip.duration * PX_PER_SEC) / 4));
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
          background: "#ff8da7",
          opacity: 0.8,
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
          <path d={`M0 40 L${fadeInW} 40 L${fadeInW} 0 Z`} fill="#e1496d" opacity="0.3" />
        </svg>
      )}
      {fadeOutW > 4 && (
        <svg width={fadeOutW} height="100%" viewBox={`0 0 ${fadeOutW} 40`} preserveAspectRatio="none"
          style={{ position: "absolute", right: 0, top: 0, pointerEvents: "none" }}>
          <path d={`M0 0 L0 40 L${fadeOutW} 40 Z`} fill="#e1496d" opacity="0.3" />
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
      <path d={d} fill="#e1496d" opacity="0.35" />
      <path d={d} fill="none" stroke="#ff8da7" strokeWidth="1" opacity="0.7" />
      <text x={side === "in" ? 4 : w - 4} y="20" fontSize="9"
        textAnchor={side === "in" ? "start" : "end"}
        fill="#ff8da7" fontFamily="'Poppins',sans-serif" fontWeight="700">
        {side === "in" ? "◁" : "▷"}
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
        minHeight: 52,
        display: "flex",
        alignItems: "stretch",
        borderBottom: "1px solid rgba(225, 73, 109, 0.12)",
        width: "100%",
        position: "relative",
        background: state.selectedTrack === track.id ? "rgba(225,73,109,0.1)" : "transparent",
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
          width: 156, minWidth: 156, padding: "0 8px 0 10px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#181318",
          borderRight: "1px solid rgba(225, 73, 109, 0.18)",
          fontSize: 11, gap: 4,
          fontFamily: "'Instrument Sans', sans-serif",
          position: "sticky", left: 0, zIndex: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: 2 }}>
          <div style={{
            fontSize: 9, color: "#ff8da7", letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 0, fontWeight: 700,
            fontFamily: "'Poppins', sans-serif", display:"flex", alignItems:"center", gap:"4px"
          }}>
            <span>{trackIconFor(track.type)}</span>
            <span>{track.type}</span>
          </div>
          <input
            value={track.name || ""}
            onChange={(e) => dispatch({ type: "RENAME_TRACK", trackId: track.id, name: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: 11, color: "#e5e5e5", background: "transparent",
              border: "none", outline: "none", padding: 0,
              fontFamily: "'Instrument Sans',sans-serif", fontWeight: 500,
              width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}
            placeholder="Track name..."
          />
        </div>

        <div className="track-label-actions" style={{
          display: "flex", gap: 2, flexShrink: 0, alignItems: "center",
        }}>
          <IconBtn
            title={track.muted ? "Unmute" : "Mute"}
            active={track.muted}
            color={track.muted ? "#ef4444" : "#8c8780"}
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_TRACK_MUTE", trackId: track.id }); }}
          >{track.muted ? "🔇" : "🔊"}</IconBtn>
          <IconBtn
            title={track.solo ? "Unsolo" : "Solo"}
            active={track.solo}
            color={track.solo ? "#f59e0b" : "#8c8780"}
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_TRACK_SOLO", trackId: track.id }); }}
          >S</IconBtn>
          <IconBtn
            title={track.locked ? "Unlock" : "Lock"}
            active={track.locked}
            color={track.locked ? "#f97316" : "#8c8780"}
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_TRACK_LOCK", trackId: track.id }); }}
          >{track.locked ? "🔒" : "🔓"}</IconBtn>
          <IconBtn
            title="Remove track"
            color="#8c8780"
            hoverColor="#ef4444"
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "REMOVE_TRACK", trackId: track.id }); }}
          >✕</IconBtn>
        </div>
      </div>

      {/* ── Clips Area ── */}
      <div
        style={{
          flex: 1, position: "relative", cursor: "crosshair",
          background: track.locked ? "rgba(0,0,0,0.2)" : "transparent",
        }}
        onClick={onTimelineClick}
      >
        {track.clips.map((clip) => {
          const isSelected = selectedIds.has(clip.id);
          const clipW = Math.max(clip.duration * PX_PER_SEC - 2, 10);
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
                top: 6,
                height: 40,
                background: isSelected ? "rgba(225,73,109,0.25)" : "rgba(35, 26, 35, 0.95)",
                border: isSelected ? "2px solid #e1496d" : "1px solid rgba(225, 73, 109, 0.25)",
                borderRadius: 7,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                zIndex: isSelected ? 11 : 10,
                boxShadow: isSelected ? "0 0 12px rgba(225, 73, 109, 0.5)" : "0 2px 6px rgba(0,0,0,0.4)",
                cursor: track.locked ? "not-allowed" : "grab",
                transition: "box-shadow 0.1s, border-color 0.1s",
              }}
            >
              {clip.imageEl && (
                <img
                  src={clip.url} alt=""
                  style={{
                    height: "100%", width: "auto", minWidth: "35%",
                    objectFit: "cover", opacity: 0.8, pointerEvents: "none",
                  }}
                  crossOrigin="anonymous"
                />
              )}
              {clip.type === "audio" && <Waveform clip={clip} PX_PER_SEC={PX_PER_SEC} colors={colors} />}
              {clip.type === "text" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  padding: "0 8px", fontWeight: 700, fontSize: 11,
                  color: "#ff8da7", fontFamily: "'Poppins',sans-serif",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  <span style={{ padding: "1px 6px", borderRadius: 4, background: "rgba(225,73,109,0.2)", border: "1px solid rgba(225,73,109,0.3)", color: "#ff8da7", marginRight: 6 }}>
                    T
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    “{clip.text || ""}”
                  </span>
                </div>
              )}
              {clip.type === "sticker" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {clip.emoji || "✨"}
                </div>
              )}
              {clip.type === "shape" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#e1496d" }}>
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
                  fontSize: 10, color: "#e5e5e5",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  maxWidth: "70%", fontWeight: 600,
                  fontFamily: "'Poppins',sans-serif",
                }}>
                  {clip.type === "text" ? "" : clip.name}
                </span>
              </div>

              {/* Left trim handle */}
              <div
                title="Trim Left"
                style={{
                  position: "absolute", left: 0, top: 0, width: 8, height: "100%",
                  cursor: track.locked ? "not-allowed" : "ew-resize",
                  background: isSelected ? "rgba(225, 73, 109, 0.4)" : "transparent",
                }}
                onMouseDown={(e) => onResizeMouseDown(e, track.id, clip, "left", track.locked)}
              />
              {/* Right trim handle */}
              <div
                title="Trim Right"
                style={{
                  position: "absolute", right: 0, top: 0, width: 8, height: "100%",
                  cursor: track.locked ? "not-allowed" : "ew-resize",
                  background: isSelected ? "rgba(225, 73, 109, 0.4)" : "transparent",
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
    case "video":   return "🎬";
    case "image":   return "🖼";
    case "text":    return "T";
    case "audio":   return "🎵";
    case "shape":   return "◆";
    case "sticker": return "✨";
    default:        return "▢";
  }
}

function IconBtn({ children, onClick, title, active, color, hoverColor }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 18, height: 18, borderRadius: 4, border: "none",
        background: active ? "rgba(225, 73, 109, 0.2)" : "transparent",
        color: color || "#8c8780",
        cursor: "pointer", fontSize: 10, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Poppins',sans-serif",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(225, 73, 109, 0.2)";
        if (hoverColor) e.currentTarget.style.color = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = active ? "rgba(225, 73, 109, 0.2)" : "transparent";
        if (hoverColor) e.currentTarget.style.color = color || "#8c8780";
      }}
    >
      {children}
    </button>
  );
}
