import { useState, useRef } from "react";
import { fmtTime } from "../constants";
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

  const onAreaMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".clip-block") || e.target.closest(".track-label")) return;
    const container = scrollRef.current;
    if (!container) return;
    const startX = e.clientX;
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
    const visibleW = container ? container.clientWidth - 156 - 24 : 800;
    const newZoom = Math.min(6, Math.max(0.2, visibleW / (maxEnd + 2) / 80));
    dispatch({ type: "SET_ZOOM", value: newZoom });
  };

  const btnDarkStyle = (active = false) => ({
    background: active ? "rgba(225, 73, 109, 0.22)" : "rgba(225, 73, 109, 0.06)",
    border: `1px solid ${active ? "#e1496d" : "rgba(225, 73, 109, 0.18)"}`,
    color: active ? "#ff8da7" : "#c5c0b8",
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Instrument Sans', sans-serif", background: "#161217", borderTop: "1px solid rgba(225, 73, 109, 0.18)" }}>
      {/* ═══ Timeline Control Bar ═══ */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px",
        borderBottom: "1px solid rgba(225, 73, 109, 0.15)",
        background: "#181318", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 11, letterSpacing: "0.14em", color: "#e1496d",
            fontWeight: 700, fontFamily: "'Poppins', sans-serif",
          }}>⏱ TIMELINE</span>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{
              fontSize: 12, color: "#ff8da7", fontVariantNumeric: "tabular-nums",
              fontWeight: 700, fontFamily: "'Poppins', sans-serif",
              background: "rgba(225, 73, 109, 0.15)", padding: "2px 8px", borderRadius: 6,
              border: "1px solid rgba(225, 73, 109, 0.25)",
            }}>{fmtTime(state.playhead)}</span>
            <span style={{ fontSize: 11, color: "#5c5650" }}>/</span>
            <span style={{
              fontSize: 12, color: "#8c8780", fontVariantNumeric: "tabular-nums",
              fontWeight: 500, fontFamily: "'Poppins', sans-serif",
            }}>{fmtTime(state.duration)}</span>
            {(state.inPoint !== null || state.outPoint !== null) && (
              <>
                <span style={{ fontSize: 11, color: "#5c5650" }}>|</span>
                <span style={{
                  fontSize: 10, padding: "2px 6px", borderRadius: 4,
                  background: "rgba(59,130,246,0.12)", color: "#60a5fa",
                  fontWeight: 600, border: "1px solid rgba(59,130,246,0.3)",
                }}>I{state.inPoint !== null ? " " + fmtTime(state.inPoint) : ""}</span>
                <span style={{
                  fontSize: 10, padding: "2px 6px", borderRadius: 4,
                  background: "rgba(225,73,109,0.15)", color: "#ff8da7",
                  fontWeight: 600, border: "1px solid rgba(225,73,109,0.3)",
                }}>O{state.outPoint !== null ? " " + fmtTime(state.outPoint) : ""}</span>
                <button
                  title="Clear in/out"
                  style={{
                    padding: "2px 6px", fontSize: 10, color: "#8c8780",
                    background: "transparent", border: "none", cursor: "pointer", borderRadius: 4,
                  }}
                  onClick={() => { dispatch({ type: "SET_IN_POINT", value: null }); dispatch({ type: "SET_OUT_POINT", value: null }); }}
                >✕</button>
              </>
            )}
          </div>
        </div>

        {/* ═══ Right Controls ═══ */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            title={state.snap ? "Snap: ON (magnetic edges)" : "Snap: OFF"}
            onClick={() => dispatch({ type: "SET_SNAP", value: !state.snap })}
            style={{
              padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11,
              fontWeight: 600, fontFamily: "'Poppins',sans-serif",
              ...btnDarkStyle(state.snap),
              transition: "all 0.18s",
            }}
          >🧲 Snap {state.snap ? "ON" : "OFF"}</button>

          <button
            title="Add marker at playhead"
            style={{
              padding: "4px 10px", fontSize: 11, color: "#c5c0b8",
              background: "rgba(225, 73, 109, 0.06)", border: "1px solid rgba(225, 73, 109, 0.18)",
              borderRadius: 6, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
              fontWeight: 500,
            }}
            onClick={() => {
              const l = prompt("Marker label (optional):", "");
              dispatch({ type: "ADD_MARKER", time: state.playhead, label: l ?? "", color: "#e1496d" });
            }}
          >🔖 Marker</button>

          <div style={{ display: "flex", gap: 3 }}>
            <button
              title="Set In point (I)"
              onClick={() => dispatch({ type: "SET_IN_POINT", value: state.playhead })}
              style={{
                padding: "4px 8px", fontSize: 11, color: "#60a5fa",
                background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: 5, cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 600,
              }}
            >[ I ]</button>
            <button
              title="Set Out point (O)"
              onClick={() => dispatch({ type: "SET_OUT_POINT", value: state.playhead })}
              style={{
                padding: "4px 8px", fontSize: 11, color: "#ff8da7",
                background: "rgba(225,73,109,0.15)", border: "1px solid rgba(225,73,109,0.25)",
                borderRadius: 5, cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 600,
              }}
            >[ O ]</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={zoomToFit}
              title="Zoom to fit all clips (Shift+F)"
              style={{
                padding: "4px 8px", fontSize: 11, color: "#c5c0b8",
                background: "rgba(225, 73, 109, 0.06)", border: "1px solid rgba(225, 73, 109, 0.18)",
                borderRadius: 5, cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 500,
              }}
            >⊡ Fit</button>
            <input
              type="range" min="0.2" max="6" step="0.05" value={state.zoom}
              onChange={(e) => dispatch({ type: "SET_ZOOM", value: parseFloat(e.target.value) })}
              style={{
                width: 76, height: 3, borderRadius: 2, accentColor: "#e1496d",
                background: "rgba(225,73,109,0.2)", outline: "none", cursor: "pointer",
              }}
            />
            <span style={{
              fontSize: 10, color: "#ff8da7", fontWeight: 700, minWidth: 36,
              textAlign: "center", fontVariantNumeric: "tabular-nums",
              fontFamily: "'Poppins',sans-serif",
            }}>{Math.round(state.zoom * 100)}%</span>
          </div>

          <div style={{ width: 1, height: 16, background: "rgba(225,73,109,0.18)" }} />

          <button
            onClick={onAddTrack}
            style={{
              padding: "5px 12px", fontSize: 11, fontFamily: "'Poppins', sans-serif",
              fontWeight: 600, borderRadius: 6, cursor: "pointer", transition: "all 0.2s",
              background: "linear-gradient(135deg,#a82348,#e1496d)",
              border: "none", color: "#fff",
              boxShadow: "0 2px 8px rgba(225,73,109,0.3)",
            }}
          >＋ Track</button>
        </div>
      </div>

      {/* ═══ Scroll Area ═══ */}
      <div
        ref={scrollRef}
        className="timeline-scroll-container"
        style={{
          flex: 1, overflowX: "auto", overflowY: "auto",
          background: "#120e12", position: "relative",
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
              display: "flex", borderBottom: "1px solid rgba(225,73,109,0.15)",
              background: "#181318",
            }}>
              <div style={{ width: 156, minWidth: 156, borderRight: "1px solid rgba(225,73,109,0.15)", position: "sticky", left: 0, background: "#181318" }} />
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
                      borderTop: `8px solid ${m.color || "#e1496d"}`,
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                    }} />
                    {m.label && (
                      <span style={{
                        position: "absolute", top: 9, left: 6,
                        fontSize: 9, fontWeight: 600, color: m.color || "#e1496d",
                        fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap",
                      }}>{m.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ruler + playhead row */}
          <div style={{
            display: "flex", flexShrink: 0,
            position: "sticky", top: state.markers.length > 0 ? 18 : 0,
            zIndex: 15, background: "#181318",
            borderBottom: "1px solid rgba(225,73,109,0.18)",
          }}>
            <div style={{
              width: 156, minWidth: 156, background: "#181318",
              borderRight: "1px solid rgba(225,73,109,0.18)",
              position: "sticky", left: 0, zIndex: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#8c8780", letterSpacing: "0.08em",
              fontFamily: "'Poppins',sans-serif", fontWeight: 600,
            }}>
              {state.tracks.length} TRACK{state.tracks.length === 1 ? "" : "S"}
            </div>
            <div
              ref={timelineRef}
              style={{ flex: 1, position: "relative", height: 32, cursor: "crosshair", background: "#120e12" }}
              onClick={onTimelineClick}
            >
              {state.inPoint !== null && state.outPoint !== null && state.inPoint < state.outPoint && (
                <div style={{
                  position: "absolute",
                  left: state.inPoint * PX_PER_SEC,
                  width: Math.max(0, (state.outPoint - state.inPoint) * PX_PER_SEC),
                  top: 0, bottom: 0,
                  background: "linear-gradient(180deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))",
                  borderLeft: `1px dashed #60a5fa`,
                  borderRight: `1px dashed #e1496d`,
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
                        height: major ? 12 : 6,
                        background: major ? "rgba(225,73,109,0.4)" : "rgba(225,73,109,0.2)",
                      }} />
                      {major && (
                        <span style={{
                          fontSize: 9, color: "#8c8780", paddingLeft: 3, marginTop: 1,
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
                top: (state.markers.length > 0 ? 18 : 0) + 32 + selBox.y,
                width: selBox.w,
                height: selBox.h,
                border: "1px dashed #e1496d",
                background: "rgba(225,73,109,0.12)",
                pointerEvents: "none",
                zIndex: 20,
                borderRadius: 3,
              }}
            />
          )}

          {state.tracks.length === 0 && (
            <EmptyTimelineState onAddTrack={onAddTrack} />
          )}

          {/* Tracks */}
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

          <div style={{ height: 24 }} />
        </div>

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
        background: "linear-gradient(180deg, #ff8da7, #e1496d)",
        zIndex: 14, pointerEvents: "none",
        boxShadow: "0 0 10px rgba(225, 73, 109, 0.6)",
      }}
    >
      <div style={{
        position: "absolute", top: markersTop + 0, left: -7,
        width: 16, height: 14, background: "#e1496d",
        clipPath: "polygon(50% 100%, 0 0, 100% 0)",
        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
      }} />
      <div style={{
        position: "absolute", top: markersTop + 15, left: -28,
        fontSize: 10, padding: "2px 6px", borderRadius: 4,
        background: "#e1496d", color: "#fff", fontWeight: 700,
        fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}>{fmtTime(state.playhead)}</div>
    </div>
  );
}

function EmptyTimelineState({ onAddTrack }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "40px 20px", gap: 14,
      background: "#161217",
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 16,
        background: "rgba(225,73,109,0.12)",
        border: "1px dashed rgba(225,73,109,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
      }}>🎬</div>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{
          fontSize: 14, color: "#fff", fontWeight: 600,
          marginBottom: 4, fontFamily: "'Poppins', sans-serif",
        }}>Your timeline is empty</div>
        <div style={{ fontSize: 11, color: "#8c8780", lineHeight: 1.5 }}>
          Add clips from the left sidebar or click <span style={{ color: "#e1496d", fontWeight: 600 }}>＋ Track</span> to add a layer.
        </div>
      </div>
      <button
        onClick={onAddTrack}
        style={{
          padding: "8px 18px", borderRadius: 8, cursor: "pointer",
          background: "linear-gradient(135deg,#a82348,#e1496d)",
          border: "none", color: "#fff", fontSize: 12, fontWeight: 600,
          fontFamily: "'Poppins',sans-serif",
          boxShadow: "0 4px 14px rgba(225,73,109,0.3)",
        }}
      >＋ Add First Track</button>
    </div>
  );
}
