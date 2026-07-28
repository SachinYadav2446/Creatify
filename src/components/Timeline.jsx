import { useState, useRef } from "react";
import { fmtTime, TRACK_COLORS } from "../constants";
import Track from "./Track";

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
  const selBoxRef = useRef(null);
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

  // Selection box for marquee select
  const onAreaMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".clip-block") || e.target.closest(".track-label")) return;
    const container = scrollRef.current;
    if (!container) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origScroll = container.scrollLeft;
    const rect = container.getBoundingClientRect();
    const startXLocal = startX - rect.left + origScroll - 156;
    setSelBox({ x: startXLocal, y: e.clientY - rect.top, w: 0, h: 0 });
    const onMove = (me) => {
      const mxLocal = me.clientX - rect.left + origScroll - 156;
      const myLocal = me.clientY - rect.top;
      setSelBox({
        x: Math.min(startXLocal, mxLocal),
        y: Math.min(e.clientY - rect.top, myLocal),
        w: Math.abs(mxLocal - startXLocal),
        h: Math.abs(myLocal - (e.clientY - rect.top)),
      });
    };
    const onUp = (me) => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setSelBox((sb) => {
        if (sb && (sb.w > 8 || sb.h > 8)) {
          const t1 = Math.max(0, sb.x / PX_PER_SEC);
          const t2 = t1 + sb.w / PX_PER_SEC;
          const ids = [];
          state.tracks.forEach((t, trackIdx) => {
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
    const visibleW = container ? container.clientWidth - 156 - 24 : 800;
    const newZoom = Math.min(6, Math.max(0.2, visibleW / (maxEnd + 2) / 80));
    dispatch({ type: "SET_ZOOM", value: newZoom });
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* ═══ Top bar ═══ */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", borderBottom: "1px solid rgba(139,90,43,0.15)",
        background: "#131110", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            fontSize: 11, letterSpacing: "0.14em", color: "#d4a574",
            fontWeight: 700, fontFamily: "'Poppins', sans-serif",
          }}>⏱ TIMELINE</span>

          {/* Playhead indicators */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{
              fontSize: 13, color: "#d4a574", fontVariantNumeric: "tabular-nums",
              fontWeight: 700, fontFamily: "'Poppins', sans-serif",
              background: "rgba(212,165,116,0.08)", padding: "2px 8px", borderRadius: 4,
              border: "1px solid rgba(212,165,116,0.15)",
            }}>{fmtTime(state.playhead)}</span>
            <span style={{ fontSize: 13, color: "rgba(139,90,43,0.3)" }}>／</span>
            <span style={{
              fontSize: 13, color: "#8c8780", fontVariantNumeric: "tabular-nums",
              fontWeight: 500, fontFamily: "'Poppins', sans-serif",
            }}>{fmtTime(state.duration)}</span>
            {(state.inPoint !== null || state.outPoint !== null) && (
              <>
                <span style={{ fontSize: 11, color: "#3c3834" }}>｜</span>
                <span style={{
                  fontSize: 11, padding: "2px 6px", borderRadius: 3,
                  background: "rgba(59,130,246,0.1)", color: "#60a5fa",
                  fontWeight: 600, border: "1px solid rgba(59,130,246,0.2)",
                }}>I{state.inPoint !== null ? " " + fmtTime(state.inPoint) : ""}</span>
                <span style={{
                  fontSize: 11, padding: "2px 6px", borderRadius: 3,
                  background: "rgba(239,68,68,0.1)", color: "#f87171",
                  fontWeight: 600, border: "1px solid rgba(239,68,68,0.2)",
                }}>O{state.outPoint !== null ? " " + fmtTime(state.outPoint) : ""}</span>
                <button className="tool-btn" style={{ padding: "2px 8px", fontSize: 10, color: "#8c8780" }}
                  onClick={() => { dispatch({ type: "SET_IN_POINT", value: null }); dispatch({ type: "SET_OUT_POINT", value: null }); }}
                  title="Clear in/out">✕</button>
              </>
            )}
          </div>
        </div>

        {/* ═══ Right controls ═══ */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Snap toggle */}
          <button
            title={state.snap ? "Snap: ON (magnetic edges)" : "Snap: OFF"}
            onClick={() => dispatch({ type: "SET_SNAP", value: !state.snap })}
            style={{
              padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11,
              fontWeight: 600, fontFamily: "'Poppins',sans-serif",
              background: state.snap ? "rgba(212,165,116,0.15)" : "rgba(139,90,43,0.05)",
              border: `1px solid ${state.snap ? "#d4a574" : "rgba(139,90,43,0.2)"}`,
              color: state.snap ? "#d4a574" : "#8c8780",
              transition: "all 0.18s",
            }}
          >🧲 Snap {state.snap ? "ON" : "OFF"}</button>

          {/* Markers quick add */}
          <button className="tool-btn"
            style={{ padding: "5px 10px", fontSize: 11, color: "#8c8780", gap: 5 }}
            title="Add marker at playhead"
            onClick={() => {
              const l = prompt("Marker label (optional):", "");
              dispatch({
                type: "ADD_MARKER", time: state.playhead,
                label: l ?? "", color: "#d4a574",
              });
            }}
          >🔖 Marker</button>

          {/* In/Out */}
          <div style={{ display: "flex", gap: 4 }}>
            <button className="tool-btn"
              style={{ padding: "5px 8px", fontSize: 11, color: "#60a5fa", borderColor: "rgba(59,130,246,0.2)" }}
              title="Set In point (I)"
              onClick={() => dispatch({ type: "SET_IN_POINT", value: state.playhead })}
            >[ I ]</button>
            <button className="tool-btn"
              style={{ padding: "5px 8px", fontSize: 11, color: "#f87171", borderColor: "rgba(239,68,68,0.2)" }}
              title="Set Out point (O)"
              onClick={() => dispatch({ type: "SET_OUT_POINT", value: state.playhead })}
            >[ O ]</button>
          </div>

          {/* Undo/Redo */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <button
              className="tool-btn"
              title="Undo (Ctrl+Z)"
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!state.history?.length}
              style={{
                opacity: state.history?.length ? 1 : 0.35, padding: "5px 8px", borderRadius: 6,
                background: "rgba(139,90,43,0.08)", border: "1px solid rgba(139,90,43,0.25)",
                color: "#d4a574", cursor: state.history?.length ? "pointer" : "not-allowed",
              }}
            >↶</button>
            <button
              className="tool-btn"
              title="Redo (Ctrl+Shift+Z)"
              onClick={() => dispatch({ type: "REDO" })}
              disabled={!state.future?.length}
              style={{
                opacity: state.future?.length ? 1 : 0.35, padding: "5px 8px", borderRadius: 6,
                background: "rgba(139,90,43,0.08)", border: "1px solid rgba(139,90,43,0.25)",
                color: "#d4a574", cursor: state.future?.length ? "pointer" : "not-allowed",
              }}
            >↷</button>
          </div>

          {/* Zoom */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="tool-btn" onClick={zoomToFit}
              title="Zoom to fit all clips (Shift+F)"
              style={{ padding: "4px 8px", fontSize: 11, color: "#8c8780" }}
            >⊡ Fit</button>
            <input
              type="range" min="0.2" max="6" step="0.05" value={state.zoom}
              onChange={(e) => dispatch({ type: "SET_ZOOM", value: parseFloat(e.target.value) })}
              style={{
                width: 90, height: 4, borderRadius: 2, accentColor: "#d4a574",
                background: "rgba(139,90,43,0.25)", outline: "none", cursor: "pointer",
              }}
            />
            <span style={{
              fontSize: 11, color: "#d4a574", fontWeight: 700, minWidth: 42,
              textAlign: "center", fontVariantNumeric: "tabular-nums",
            }}>{Math.round(state.zoom * 100)}%</span>
          </div>

          <div style={{ width: 1, height: 18, background: "rgba(212,165,116,0.12)" }} />

          <button className="tool-btn"
            style={{
              padding: "6px 14px", fontSize: 11, fontFamily: "'Poppins', sans-serif",
              fontWeight: 500, borderRadius: 6,
              background: "rgba(212,165,116,0.1)", border: "1px solid rgba(212,165,116,0.35)",
              color: "#d4a574", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,165,116,0.2)"; e.currentTarget.style.borderColor = "#d4a574"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,165,116,0.1)"; e.currentTarget.style.borderColor = "rgba(212,165,116,0.35)"; }}
            onClick={onAddTrack}
          >＋ New Track</button>
        </div>
      </div>

      {/* ═══ Scroll area ═══ */}
      <div
        ref={scrollRef}
        className="timeline-scroll-container"
        style={{
          flex: 1, overflowX: "auto", overflowY: "auto",
          background: "#0c0a09", position: "relative",
        }}
        onMouseDown={onAreaMouseDown}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.002;
            dispatch({ type: "SET_ZOOM", value: Math.min(6, Math.max(0.2, state.zoom + delta)) });
          }
        }}
      >
        <div style={{
          width: 156 + state.duration * PX_PER_SEC + 400,
          display: "flex", flexDirection: "column",
          minWidth: "100%", position: "relative", minHeight: "100%",
        }}>

          {/* Markers row */}
          {state.markers.length > 0 && (
            <div style={{
              position: "sticky", top: 0, zIndex: 13, height: 18,
              display: "flex", borderBottom: "1px solid rgba(139,90,43,0.08)",
              background: "#0f0d0b",
            }}>
              <div style={{ width: 156, minWidth: 156, borderRight: "1px solid rgba(139,90,43,0.1)", position: "sticky", left: 0, background: "#0f0d0b" }} />
              <div style={{ flex: 1, position: "relative" }}>
                {state.markers.map((m) => (
                  <div
                    key={m.id}
                    title={`Marker ${m.label ? `“${m.label}”` : ""} @ ${fmtTime(m.time)} — right-click to remove`}
                    style={{
                      position: "absolute", left: m.time * PX_PER_SEC,
                      top: 2, cursor: "pointer", zIndex: 15,
                    }}
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: "SET_PLAYHEAD", time: m.time }); }}
                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); dispatch({ type: "REMOVE_MARKER", markerId: m.id }); }}
                  >
                    <div style={{
                      width: 0, height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: `8px solid ${m.color || "#d4a574"}`,
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                    }} />
                    {m.label && (
                      <span style={{
                        position: "absolute", top: 9, left: 6,
                        fontSize: 9, fontWeight: 600, color: m.color || "#d4a574",
                        fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap",
                        textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                      }}>{m.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ In / Out bars over ruler ═══ */}

          {/* Ruler + playhead row */}
          <div style={{
            display: "flex", flexShrink: 0,
            position: "sticky", top: state.markers.length > 0 ? 18 : 0,
            zIndex: 15, background: "#131110",
            borderBottom: "1px solid rgba(139,90,43,0.12)",
          }}>
            <div style={{
              width: 156, minWidth: 156, background: "#131110",
              borderRight: "1px solid rgba(139,90,43,0.12)",
              position: "sticky", left: 0, zIndex: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, color: "#3c3834", letterSpacing: "0.08em",
            }}>
              {state.tracks.length} TRACK{state.tracks.length === 1 ? "" : "S"}
            </div>
            <div
              ref={timelineRef}
              style={{ flex: 1, position: "relative", height: 34, cursor: "crosshair" }}
              onClick={onTimelineClick}
            >
              {/* In/Out selection overlay */}
              {state.inPoint !== null && state.outPoint !== null && state.inPoint < state.outPoint && (
                <div style={{
                  position: "absolute",
                  left: state.inPoint * PX_PER_SEC,
                  width: Math.max(0, (state.outPoint - state.inPoint) * PX_PER_SEC),
                  top: 0, bottom: 0,
                  background: "linear-gradient(180deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))",
                  borderLeft: "1px dashed #3b82f6",
                  borderRight: "1px dashed #ef4444",
                  pointerEvents: "none",
                }} />
              )}

              <div style={{ height: "100%", position: "relative" }}>
                {timeMarkers.map((t, i) => {
                  const major = i % (state.zoom < 0.6 ? 1 : 2) === 0;
                  return (
                    <div key={t} style={{
                      position: "absolute", left: t * PX_PER_SEC, top: 0,
                      height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start",
                    }}>
                      <div style={{
                        width: 1,
                        height: major ? 14 : 7,
                        background: major ? "rgba(139,90,43,0.35)" : "rgba(139,90,43,0.18)",
                      }} />
                      {major && (
                        <span style={{
                          fontSize: 9, color: "#6b6560", paddingLeft: 3, marginTop: 1,
                          fontFamily: "'Poppins', sans-serif", fontVariantNumeric: "tabular-nums",
                        }}>{fmtTime(t)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selection box */}
          {selBox && (
            <div
              ref={selBoxRef}
              style={{
                position: "absolute",
                left: 156 + selBox.x,
                top: (state.markers.length > 0 ? 18 : 0) + 34 + selBox.y,
                width: selBox.w,
                height: selBox.h,
                border: "1px dashed #d4a574",
                background: "rgba(212,165,116,0.08)",
                pointerEvents: "none",
                zIndex: 20,
              }}
            />
          )}

          {/* Empty state */}
          {state.tracks.length === 0 && (
            <EmptyTimelineState onAddTrack={onAddTrack} />
          )}

          {/* ═══ Tracks ═══ */}
          {state.tracks.map((track, i) => (
            <Track
              key={track.id}
              track={track}
              index={i}
              state={state}
              dispatch={dispatch}
              PX_PER_SEC={PX_PER_SEC}
              onTimelineClick={onTimelineClick}
              onClipMouseDown={onClipMouseDown}
              onResizeMouseDown={onResizeMouseDown}
              onTrackDragOver={onTrackDragOver}
              onTrackDrop={onTrackDrop}
              onTrackDragStart={onTrackDragStart}
            />
          ))}

          {/* Spacer */}
          <div style={{ height: 24 }} />
        </div>

        {/* Playhead overlay (fixed to scroll container) */}
        <PlayheadOverlay state={state} PX_PER_SEC={PX_PER_SEC} markersTop={state.markers.length > 0 ? 18 : 0} />
      </div>
    </div>
  );
}

function PlayheadOverlay({ state, PX_PER_SEC, markersTop }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 156 + state.playhead * PX_PER_SEC,
        top: 0, bottom: 0, width: 2,
        background: "linear-gradient(180deg, #ef4444, #b91c1c)",
        zIndex: 14, pointerEvents: "none",
        boxShadow: "0 0 6px rgba(239,68,68,0.4)",
      }}
    >
      <div style={{
        position: "absolute", top: markersTop + 0, left: -7,
        width: 16, height: 14, background: "#ef4444",
        clipPath: "polygon(50% 100%, 0 0, 100% 0)",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
      }} />
      <div style={{
        position: "absolute", top: markersTop + 15, left: -26,
        fontSize: 10, padding: "1px 5px", borderRadius: 3,
        background: "#ef4444", color: "#fff", fontWeight: 700,
        fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
      }}>{fmtTime(state.playhead)}</div>
    </div>
  );
}

function EmptyTimelineState({ onAddTrack }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px 20px", color: "#3c3834",
      gap: 16,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: "linear-gradient(135deg, rgba(212,165,116,0.12), rgba(139,90,43,0.05))",
        border: "1px dashed rgba(212,165,116,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32,
      }}>🎬</div>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{
          fontSize: 15, color: "#a09890", fontWeight: 600,
          marginBottom: 6, fontFamily: "'Poppins', sans-serif",
        }}>Your timeline is empty — let’s start creating!</div>
        <div style={{ fontSize: 12, color: "#5c5650", lineHeight: 1.6 }}>
          Drag & drop videos, images, audio, or text from the left sidebar onto any track,
          or click <span style={{ color: "#d4a574", fontWeight: 600 }}>＋ New Track</span> to add a layer.
        </div>
      </div>
      <button
        onClick={onAddTrack}
        style={{
          padding: "10px 22px", borderRadius: 10, cursor: "pointer",
          background: "linear-gradient(135deg, #8b5a2b, #d4a574)",
          border: "none", color: "#fff", fontSize: 13, fontWeight: 600,
          fontFamily: "'Poppins',sans-serif", letterSpacing: "0.02em",
          boxShadow: "0 4px 18px rgba(139,90,43,0.35)",
          marginTop: 4,
        }}
      >＋ Create First Track</button>
    </div>
  );
}
