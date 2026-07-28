import { useRef, useMemo } from "react";
import { TRACK_COLORS, uid } from "../constants";

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
          background: colors.border,
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

function DrawFadeHandles({ clip, PX_PER_SEC, colors, onStartResize }) {
  const w = clip.duration * PX_PER_SEC;
  const fadeInW = Math.min((clip.audio?.fadeIn || clip.fadeIn || 0) * PX_PER_SEC, w / 2);
  const fadeOutW = Math.min((clip.audio?.fadeOut || clip.fadeOut || 0) * PX_PER_SEC, w / 2);
  return (
    <>
      {fadeInW > 4 && (
        <svg width={fadeInW} height="100%" viewBox={`0 0 ${fadeInW} 40`} preserveAspectRatio="none"
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <path d={`M0 40 L${fadeInW} 40 L${fadeInW} 0 Z`} fill={colors.accent} opacity="0.25" />
        </svg>
      )}
      {fadeOutW > 4 && (
        <svg width={fadeOutW} height="100%" viewBox={`0 0 ${fadeOutW} 40`} preserveAspectRatio="none"
          style={{ position: "absolute", right: 0, top: 0, pointerEvents: "none" }}>
          <path d={`M0 0 L0 40 L${fadeOutW} 40 Z`} fill={colors.accent} opacity="0.25" />
        </svg>
      )}
    </>
  );
}

function TransitionBadge({ clip, PX_PER_SEC, colors, side }) {
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
      <path d={d} fill={colors.accent} opacity="0.3" />
      <path d={d} fill="none" stroke={colors.border} strokeWidth="1" opacity="0.6" />
      <text x={side === "in" ? 4 : w - 4} y="20" fontSize="9"
        textAnchor={side === "in" ? "start" : "end"}
        fill={colors.label} fontFamily="'Poppins',sans-serif" fontWeight="600">
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
        minHeight: 58,
        display: "flex",
        alignItems: "stretch",
        borderBottom: "1px solid rgba(139,90,43,0.1)",
        width: "100%",
        position: "relative",
        background: state.selectedTrack === track.id ? "rgba(212,165,116,0.04)" : "transparent",
        opacity: muted ? 0.45 : 1,
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
          background: "#131110",
          borderRight: "1px solid rgba(139,90,43,0.12)",
          fontSize: 11, gap: 4,
          fontFamily: "'Instrument Sans', sans-serif",
          position: "sticky", left: 0, zIndex: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: 2 }}>
          <div style={{
            fontSize: 9, color: colors.label, letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 0, fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
          }}>
            <span style={{ marginRight: 4 }}>{trackIconFor(track.type)}</span>
            {track.type}
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
            color={track.solo ? "#facc15" : "#8c8780"}
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
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "REMOVE_TRACK", trackId: track.id }); }}
          >✕</IconBtn>
        </div>
      </div>

      {/* ── Clips Area ── */}
      <div
        style={{
          flex: 1, position: "relative", cursor: "crosshair",
          background: track.locked ? "rgba(100,100,100,0.02)" : "transparent",
        }}
        onClick={onTimelineClick}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
        onDrop={(e) => {
          e.preventDefault();
          const data = safeGetDropData(e, ["application/vnd.clip", "application/vnd.asset", "Files"]);
          if (!data) return;
          if (data.type === "file") {
            window.__dropFileOnTrack?.({
              files: data.files, trackId: track.id,
              xOffsetPx: e.clientX - (e.currentTarget.getBoundingClientRect().left),
              PX_PER_SEC,
            });
          } else if (data.asset) {
            window.__dropAssetOnTrack?.({
              asset: data.asset, trackId: track.id,
              xOffsetPx: e.clientX - (e.currentTarget.getBoundingClientRect().left),
              PX_PER_SEC,
            });
          }
        }}
      >
        {track.clips.map((clip) => {
          const isSelected = selectedIds.has(clip.id);
          const clipW = Math.max(clip.duration * PX_PER_SEC - 2, 10);
          const thumb = clipThumbSrc(clip);
          return (
            <div
              key={clip.id}
              className={`clip-block${isSelected ? " selected" : ""}`}
              draggable={!track.locked}
              onDragStart={(e) => {
                if (track.locked) return;
                e.stopPropagation();
                try {
                  e.dataTransfer.setData("application/vnd.clip",
                    JSON.stringify({ clipId: clip.id, fromTrackId: track.id }));
                  e.dataTransfer.effectAllowed = "move";
                } catch {}
              }}
              onDragOver={(e) => {
                e.stopPropagation(); e.preventDefault();
              }}
              onDrop={(e) => {
                e.stopPropagation(); e.preventDefault();
                const data = safeGetDropData(e, ["application/vnd.clip", "application/vnd.asset"]);
                if (!data) return;
                if (data.type === "clip" && data.clipId && data.clipId !== clip.id) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const localX = e.clientX - rect.left;
                  const dropBefore = localX < rect.width / 2;
                  const newStart = dropBefore ? clip.start - 0.01 : clip.start + clip.duration + 0.01;
                  dispatch({
                    type: "MOVE_CLIP_BETWEEN_TRACKS",
                    fromTrackId: data.fromTrackId, toTrackId: track.id,
                    clipId: data.clipId, start: newStart,
                  });
                }
              }}
              style={{
                position: "absolute",
                left: clip.start * PX_PER_SEC,
                width: clipW,
                top: 7,
                height: 44,
                background: colors.bg,
                border: isSelected ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                borderRadius: 7,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                zIndex: isSelected ? 11 : 10,
                boxShadow: isSelected ? `0 0 0 2px ${colors.accent}66,0 4px 14px rgba(0,0,0,0.5)` : "none",
                cursor: track.locked ? "not-allowed" : "grab",
                transition: "box-shadow 0.1s, border-color 0.1s",
              }}
              onMouseDown={(e) => onClipMouseDown(e, track.id, clip, track.locked)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (clip.type === "text") {
                  const txt = prompt("Edit text:", clip.text || "");
                  if (txt !== null) dispatch({ type: "UPDATE_CLIP_TEXT", clipId: clip.id, text: txt });
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault(); e.stopPropagation();
                const action = prompt(
                  "Clip menu:\n1 = Split at playhead\n2 = Delete\n3 = Duplicate\n4 = Ripple delete\n5 = Fade in 1s\n6 = Fade out 1s\n7 = Clear fades\n8 = Loop (toggle)\n(Type 1-8):",
                  "1"
                );
                if (!action) return;
                switch (action.trim()) {
                  case "1": dispatch({ type: "SPLIT_CLIP", trackId: track.id, clipId: clip.id, time: state.playhead }); break;
                  case "2": dispatch({ type: "REMOVE_CLIP", clipId: clip.id }); break;
                  case "3": dispatch({ type: "DUPLICATE_CLIP", clipId: clip.id }); break;
                  case "4": dispatch({ type: "RIPPLE_DELETE", clipId: clip.id }); break;
                  case "5": dispatch({ type: "UPDATE_CLIP_AUDIO", clipId: clip.id, audio: { fadeIn: 1, fadeOut: clip.audio?.fadeOut || 0 } }); break;
                  case "6": dispatch({ type: "UPDATE_CLIP_AUDIO", clipId: clip.id, audio: { fadeIn: clip.audio?.fadeIn || 0, fadeOut: 1 } }); break;
                  case "7": dispatch({ type: "UPDATE_CLIP_AUDIO", clipId: clip.id, audio: { fadeIn: 0, fadeOut: 0 } }); break;
                  case "8": dispatch({ type: "SET_CLIP_LOOP", clipId: clip.id, loop: !clip.loop }); break;
                }
              }}
            >
              {/* Thumbnail / visual */}
              {clip.imageEl && (
                <img
                  src={clip.url} alt=""
                  style={{
                    height: "100%", width: "auto", minWidth: "40%",
                    objectFit: "cover", opacity: 0.75, pointerEvents: "none",
                    filter: `saturate(${clip.filters?.saturation ?? 100}%) brightness(${clip.filters?.brightness ?? 100}%)`,
                  }}
                  crossOrigin="anonymous"
                />
              )}
              {clip.videoEl && (
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(90deg, ${colors.bg}, ${colors.accent}22, ${colors.bg})`,
                  pointerEvents: "none",
                }} />
              )}
              {clip.type === "audio" && <Waveform clip={clip} PX_PER_SEC={PX_PER_SEC} colors={colors} />}
              {clip.type === "text" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  padding: "0 10px", fontWeight: 700, fontSize: 12,
                  color: colors.label, fontFamily: "'Poppins',sans-serif",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(34,211,168,0.12)", border: "1px solid rgba(34,211,168,0.3)" }}>
                    T
                  </span>
                  <span style={{ marginLeft: 8, overflow: "hidden", textOverflow: "ellipsis" }}>
                    “{clip.text || ""}”
                  </span>
                </div>
              )}
              {clip.type === "shape" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20, color: colors.label,
                }}>
                  {clip.shapeIcon || "◆"}
                </div>
              )}
              {clip.type === "sticker" && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 22,
                }}>
                  {clip.emoji || "✨"}
                </div>
              )}

              {/* Transitions */}
              <TransitionBadge clip={clip} PX_PER_SEC={PX_PER_SEC} colors={colors} side="in" />
              <TransitionBadge clip={clip} PX_PER_SEC={PX_PER_SEC} colors={colors} side="out" />
              <DrawFadeHandles clip={clip} PX_PER_SEC={PX_PER_SEC} colors={colors} />

              {/* Label / name */}
              <div style={{
                position: "absolute", left: 0, right: 0,
                padding: "2px 8px", display: "flex", alignItems: "flex-end",
                justifyContent: "space-between", bottom: 0,
              }}>
                <span style={{
                  fontSize: 10, color: colors.label,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  maxWidth: "60%", fontWeight: 600,
                  fontFamily: "'Poppins',sans-serif",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}>
                  {clip.type === "text" ? "" : clip.name}
                </span>
                {clip.speed && clip.speed !== 100 && (
                  <span style={{
                    fontSize: 9, padding: "1px 4px", borderRadius: 3,
                    background: "rgba(0,0,0,0.45)", color: colors.accent, fontWeight: 700,
                  }}>
                    {clip.speed}%
                  </span>
                )}
                {clip.loop && (
                  <span style={{
                    fontSize: 9, padding: "1px 4px", borderRadius: 3, marginLeft: 3,
                    background: "rgba(34,211,168,0.15)", color: "#22d3a8", fontWeight: 700,
                  }}>
                    ⟳
                  </span>
                )}
              </div>

              {/* Left resize handle */}
              <div
                title="Trim (left edge)"
                style={{
                  position: "absolute", left: 0, top: 0, width: 10, height: "100%",
                  cursor: track.locked ? "not-allowed" : "ew-resize",
                  background: isSelected ? `${colors.accent}55` : "transparent",
                  opacity: 0.9,
                }}
                onMouseDown={(e) => onResizeMouseDown(e, track.id, clip, "left", track.locked)}
              >
                <div style={{
                  position: "absolute", left: 2, top: "50%", transform: "translateY(-50%)",
                  width: 2, height: 16, borderRadius: 1, background: colors.accent, opacity: 0.6,
                }} />
              </div>
              {/* Right resize handle */}
              <div
                title="Trim (right edge)"
                style={{
                  position: "absolute", right: 0, top: 0, width: 10, height: "100%",
                  cursor: track.locked ? "not-allowed" : "ew-resize",
                  background: isSelected ? `${colors.accent}55` : "transparent",
                }}
                onMouseDown={(e) => onResizeMouseDown(e, track.id, clip, "right", track.locked)}
              >
                <div style={{
                  position: "absolute", right: 2, top: "50%", transform: "translateY(-50%)",
                  width: 2, height: 16, borderRadius: 1, background: colors.accent, opacity: 0.6,
                }} />
              </div>
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

function clipThumbSrc(clip) {
  if (clip.type === "image") return clip.url;
  return null;
}

function IconBtn({ children, onClick, title, active, color }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 20, height: 20, borderRadius: 4, border: "none",
        background: active ? "rgba(212,165,116,0.15)" : "transparent",
        color: color || "#8c8780",
        cursor: "pointer", fontSize: 10, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Poppins',sans-serif",
        transition: "background 0.15s,color 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,165,116,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = active ? "rgba(212,165,116,0.15)" : "transparent"; }}
    >
      {children}
    </button>
  );
}

function safeGetDropData(e, types) {
  for (const t of types) {
    try {
      if (t === "Files") {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          return { type: "file", files: Array.from(e.dataTransfer.files) };
        }
        continue;
      }
      const raw = e.dataTransfer.getData(t);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (t === "application/vnd.clip") return { type: "clip", ...parsed };
        if (t === "application/vnd.asset") return { type: "asset", asset: parsed };
      }
    } catch {}
  }
  return null;
}
