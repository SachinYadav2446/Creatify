import { useState, useRef } from "react";
import { fmtTime } from "../constants";
import Track from "./Track";
import { Magnet, Bookmark, Maximize2, Plus, X, ZoomIn, ZoomOut } from "lucide-react";

export default function Timeline({
  state, dispatch, timelineRef, onTimelineClick,
  onClipMouseDown, onResizeMouseDown, onAddTrack,
}) {
  const PX_PER_SEC = 80 * state.zoom;
  const step = state.zoom < 0.4 ? 10 : state.zoom < 0.75 ? 5 : state.zoom < 1.5 ? 2 : state.zoom < 3 ? 1 : 0.5;
  const timeMarkers = [];
  for (let i = 0; i <= state.duration + step; i += step) timeMarkers.push(i);

  const [dragTrackIndex, setDragTrackIndex] = useState(-1);
  const [dropTrackIndex, setDropTrackIndex] = useState(-1);
  const scrollRef = useRef(null);
  const [selBox, setSelBox] = useState(null);

  const onTrackDragStart = (e, idx) => {
    setDragTrackIndex(idx);
    try { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", `track:${idx}`); } catch {}
  };
  const onTrackDragOver = (e, idx) => {
    e.preventDefault();
    if (dragTrackIndex < 0) return;
    setDropTrackIndex(idx);
  };
  const onTrackDrop = (e, idx) => {
    e.preventDefault();
    if (dragTrackIndex >= 0 && dragTrackIndex !== idx) {
      dispatch({ type: "MOVE_TRACK", fromIndex: dragTrackIndex, toIndex: idx });
    }
    setDragTrackIndex(-1);
    setDropTrackIndex(-1);
  };

  const onAreaMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".clip-block") || e.target.closest(".track-label")) return;
    const container = scrollRef.current;
    if (!container) return;
    const startX = e.clientX;
    const origScroll = container.scrollLeft;
    const rect = container.getBoundingClientRect();
    const startXLocal = startX - rect.left + origScroll - 170;
    setSelBox({ x: startXLocal, y: e.clientY - rect.top, w: 0, h: 0 });
    const onMove = (me) => {
      const mxLocal = me.clientX - rect.left + origScroll - 170;
      const myLocal = me.clientY - rect.top;
      setSelBox({
        x: Math.min(startXLocal, mxLocal),
        y: Math.min(e.clientY - rect.top, myLocal),
        w: Math.abs(mxLocal - startXLocal),
        h: Math.abs(myLocal - (e.clientY - rect.top)),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setSelBox((sb) => {
        if (sb && (sb.w > 8 || sb.h > 8)) {
          const t1 = Math.max(0, sb.x / PX_PER_SEC);
          const t2 = t1 + sb.w / PX_PER_SEC;
          const ids = [];
          state.tracks.forEach((t) => {
            t.clips.forEach((c) => {
              const cEnd = c.start + c.duration;
              if (c.start < t2 && cEnd > t1) ids.push(c.id);
            });
          });
          if (ids.length > 0) dispatch({ type: "SELECT_MULTIPLE_CLIPS", clipIds: ids });
          else dispatch({ type: "DESELECT_ALL" });
        }
        return null;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const zoomToFit = () => {
    let maxEnd = 1;
    state.tracks.forEach((t) => t.clips.forEach((c) => { maxEnd = Math.max(maxEnd, c.start + c.duration); }));
    const container = scrollRef.current;
    const visibleW = container ? container.clientWidth - 170 - 24 : 800;
    const newZoom = Math.min(6, Math.max(0.2, visibleW / (maxEnd + 2) / 80));
    dispatch({ type: "SET_ZOOM", value: newZoom });
  };

  const btnLightStyle = (active = false) => ({
    background: active ? "#e0e7ff" : "#f8fafc",
    border: `1px solid ${active ? "#818cf8" : "#e2e8f0"}`,
    color: active ? "#4338ca" : "#475569",
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Instrument Sans', sans-serif", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
      {/* ═══ Timeline Control Bar ═══ */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 14px",
        borderBottom: "1px solid #e2e8f0",
        background: "#ffffff", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 11, letterSpacing: "0.08em", color: "#4f46e5",
            fontWeight: 700, fontFamily: "'Poppins', sans-serif",
          }}>TIMELINE</span>

          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{
              fontSize: 12, color: "#4338ca", fontVariantNumeric: "tabular-nums",
              fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
              background: "#eef2ff", padding: "2px 7px", borderRadius: 5,
              border: "1px solid #c7d2fe",
            }}>{fmtTime(state.playhead)}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>/</span>
            <span style={{
              fontSize: 12, color: "#64748b", fontVariantNumeric: "tabular-nums",
              fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
            }}>{fmtTime(state.duration)}</span>
            {(state.inPoint !== null || state.outPoint !== null) && (
              <>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>|</span>
                <span style={{
                  fontSize: 10, padding: "1px 5px", borderRadius: 4,
                  background: "#eff6ff", color: "#2563eb",
                  fontWeight: 600, border: "1px solid #bfdbfe",
                }}>IN {state.inPoint !== null ? fmtTime(state.inPoint) : ""}</span>
                <span style={{
                  fontSize: 10, padding: "1px 5px", borderRadius: 4,
                  background: "#fdf2f8", color: "#db2777",
                  fontWeight: 600, border: "1px solid #fbcfe8",
                }}>OUT {state.outPoint !== null ? fmtTime(state.outPoint) : ""}</span>
                <button
                  title="Clear In/Out"
                  style={{
                    padding: "2px", color: "#94a3b8",
                    background: "transparent", border: "none", cursor: "pointer", borderRadius: 4, display: "flex"
                  }}
                  onClick={() => { dispatch({ type: "SET_IN_POINT", value: null }); dispatch({ type: "SET_OUT_POINT", value: null }); }}
                ><X size={12} /></button>
              </>
            )}
          </div>
        </div>

        {/* ═══ Right Controls ═══ */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            title={state.snap ? "Snap: ON (magnetic clip alignment)" : "Snap: OFF"}
            onClick={() => dispatch({ type: "SET_SNAP", value: !state.snap })}
            style={{
              padding: "4px 9px", borderRadius: 6, cursor: "pointer", fontSize: 11,
              fontWeight: 600, fontFamily: "'Poppins',sans-serif",
              display: "inline-flex", alignItems: "center", gap: 4,
              ...btnLightStyle(state.snap),
              transition: "all 0.15s",
            }}
          >
            <Magnet size={12} /> Snap {state.snap ? "ON" : "OFF"}
          </button>

          <button
            title="Add timestamp marker at playhead"
            style={{
              padding: "4px 9px", fontSize: 11, color: "#475569",
              background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 6, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
              fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4
            }}
            onClick={() => {
              const l = prompt("Marker label (optional):", "");
              dispatch({ type: "ADD_MARKER", time: state.playhead, label: l ?? "", color: "#4f46e5" });
            }}
          >
            <Bookmark size={12} /> Marker
          </button>

          <div style={{ display: "flex", gap: 2 }}>
            <button
              title="Set In point (I)"
              onClick={() => dispatch({ type: "SET_IN_POINT", value: state.playhead })}
              style={{
                padding: "3px 6px", fontSize: 10.5, color: "#2563eb",
                background: "#eff6ff", border: "1px solid #bfdbfe",
                borderRadius: 5, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              }}
            >[ I ]</button>
            <button
              title="Set Out point (O)"
              onClick={() => dispatch({ type: "SET_OUT_POINT", value: state.playhead })}
              style={{
                padding: "3px 6px", fontSize: 10.5, color: "#db2777",
                background: "#fdf2f8", border: "1px solid #fbcfe8",
                borderRadius: 5, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              }}
            >[ O ]</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", padding: "2px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <button
              onClick={zoomToFit}
              title="Zoom to fit all clips (Shift+F)"
              style={{
                padding: "2px 6px", fontSize: 11, color: "#475569",
                background: "transparent", border: "none",
                cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 600,
                display: "inline-flex", alignItems: "center", gap: 3
              }}
            >
              <Maximize2 size={11} /> Fit
            </button>
            <ZoomOut size={12} color="#94a3b8" />
            <input
              type="range" min="0.2" max="6" step="0.05" value={state.zoom}
              onChange={(e) => dispatch({ type: "SET_ZOOM", value: parseFloat(e.target.value) })}
              style={{
                width: 70, height: 4, borderRadius: 2, accentColor: "#4f46e5",
                background: "#e2e8f0", outline: "none", cursor: "pointer",
              }}
            />
            <ZoomIn size={12} color="#94a3b8" />
            <span style={{
              fontSize: 10, color: "#4f46e5", fontWeight: 700, minWidth: 32,
              textAlign: "center", fontVariantNumeric: "tabular-nums",
              fontFamily: "'JetBrains Mono', monospace",
            }}>{Math.round(state.zoom * 100)}%</span>
          </div>

          <div style={{ width: 1, height: 16, background: "#e2e8f0" }} />

          <button
            onClick={onAddTrack}
            style={{
              padding: "4px 10px", fontSize: 11, fontFamily: "'Poppins', sans-serif",
              fontWeight: 600, borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
              background: "#4f46e5", border: "none", color: "#fff",
              boxShadow: "0 2px 6px rgba(79, 70, 229, 0.25)",
              display: "inline-flex", alignItems: "center", gap: 4
            }}
          >
            <Plus size={13} /> Add Track
          </button>
        </div>
      </div>

      {/* ═══ Scroll Area ═══ */}
      <div
        ref={scrollRef}
        className="timeline-scroll-container"
        style={{
          flex: 1, overflowX: "auto", overflowY: "auto",
          background: "#f8fafc", position: "relative",
        }}
        onMouseDown={onAreaMouseDown}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.002;
            const newZoom = Math.min(6, Math.max(0.2, state.zoom + delta));
            dispatch({ type: "SET_ZOOM", value: newZoom });
          }
        }}
      >
        <div style={{ width: `${Math.max(1200, state.duration * PX_PER_SEC + 300)}px`, minHeight: "100%", position: "relative" }}>
          
          {/* ── Time Ruler Bar ── */}
          <div
            style={{
              height: 24, background: "#ffffff", borderBottom: "1px solid #e2e8f0",
              display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 15,
              paddingLeft: 170, cursor: "pointer", userSelect: "none"
            }}
            onClick={onTimelineClick}
          >
            {timeMarkers.map((t) => {
              const x = t * PX_PER_SEC;
              return (
                <div key={t} style={{ position: "absolute", left: 170 + x, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", pointerEvents: "none" }}>
                  <span style={{ fontSize: 9.5, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, transform: "translateX(-50%)", marginBottom: 2 }}>
                    {fmtTime(t)}
                  </span>
                  <div style={{ width: 1, height: 6, background: "#cbd5e1" }} />
                </div>
              );
            })}
          </div>

          {/* ── Playhead Scrubbing Line ── */}
          <div
            style={{
              position: "absolute",
              left: 170 + state.playhead * PX_PER_SEC,
              top: 0,
              bottom: 0,
              width: 2,
              background: "#4f46e5",
              zIndex: 20,
              pointerEvents: "none",
              boxShadow: "0 0 8px rgba(79, 70, 229, 0.5)",
            }}
          >
            {/* Playhead Top Handle */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: 14, height: 16, background: "#4f46e5", clipPath: "polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }} />
          </div>

          {/* ── Tracks Container ── */}
          <div ref={timelineRef} style={{ display: "flex", flexDirection: "column" }}>
            {state.tracks.map((track, idx) => (
              <Track
                key={track.id}
                track={track}
                index={idx}
                state={state}
                dispatch={dispatch}
                PX_PER_SEC={PX_PER_SEC}
                onTimelineClick={onTimelineClick}
                onClipMouseDown={onClipMouseDown}
                onResizeMouseDown={onResizeMouseDown}
                onTrackDragStart={onTrackDragStart}
                onTrackDragOver={onTrackDragOver}
                onTrackDrop={onTrackDrop}
              />
            ))}
          </div>

          {/* ── Multi-select box overlay ── */}
          {selBox && (
            <div style={{
              position: "absolute",
              left: 170 + selBox.x,
              top: selBox.y,
              width: selBox.w,
              height: selBox.h,
              background: "rgba(79, 70, 229, 0.12)",
              border: "1px dashed #4f46e5",
              pointerEvents: "none",
              zIndex: 25,
            }} />
          )}

        </div>
      </div>
    </div>
  );
}
