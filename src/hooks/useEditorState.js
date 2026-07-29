import { useReducer, useRef, useCallback } from "react";
import { INITIAL_STATE, uid, DEFAULT_CLIP_FILTERS, DEFAULT_CLIP_TRANSFORM, DEFAULT_CLIP_AUDIO, clamp } from "../constants";

const HISTORY_ACTIONS = new Set([
  "ADD_TRACK", "REMOVE_TRACK", "MOVE_TRACK", "RENAME_TRACK",
  "ADD_CLIP", "REMOVE_CLIP", "MOVE_CLIP", "MOVE_CLIP_BETWEEN_TRACKS",
  "RESIZE_CLIP", "RESIZE_CLIP_LEFT", "TRIM_CLIP", "SPLIT_CLIP", "RIPPLE_DELETE",
  "UPDATE_CLIP", "UPDATE_CLIP_TEXT", "UPDATE_CLIP_VOLUME", "UPDATE_CLIP_FILTERS",
  "UPDATE_CLIP_TRANSFORM", "UPDATE_CLIP_AUDIO", "UPDATE_CLIP_KEYFRAMES",
  "SET_CLIP_SPEED", "SET_CLIP_LOOP",
  "ADD_MARKER", "REMOVE_MARKER", "SET_IN_POINT", "SET_OUT_POINT",
  "SET_ASPECT_RATIO", "SET_CUSTOM_SIZE",
  "SET_BACKGROUND_COLOR", "SET_BACKGROUND_TYPE", "SET_BACKGROUND_GRADIENT",
  "SET_FILTER", "APPLY_PRESET", "RESET_FILTERS",
  "SET_PLAYBACK_SPEED",
  "ADD_TRANSITION", "UPDATE_TRANSITION", "REMOVE_TRANSITION",
  "SET_ANIMATION",
  "REORDER_CLIPS",
]);

const SNAP_THRESHOLD = 0.06;

function findClip(state, clipId) {
  for (const t of state.tracks) {
    const c = t.clips.find((x) => x.id === clipId);
    if (c) return { track: t, clip: c };
  }
  return null;
}

function snapClipToEdges(state, trackId, clipId, proposedStart, proposedDuration, sameTrackClips) {
  if (!state.snap) return { start: proposedStart, dur: proposedDuration, snapped: false };
  const clips = sameTrackClips.filter((c) => c.id !== clipId);
  const proposedEnd = proposedStart + proposedDuration;
  let bestStart = proposedStart;
  let bestDist = Infinity;
  const points = [];
  clips.forEach((c) => {
    points.push({ point: c.start, type: "start", clip: c });
    points.push({ point: c.start + c.duration, type: "end", clip: c });
  });
  points.push({ point: state.playhead, type: "playhead", clip: null });
  state.markers.forEach((m) => points.push({ point: m.time, type: "marker", clip: null }));
  for (const p of points) {
    const dStart = Math.abs(proposedStart - p.point);
    const dEnd = Math.abs(proposedEnd - p.point);
    if (dStart < bestDist && dStart <= SNAP_THRESHOLD) {
      bestDist = dStart; bestStart = p.point;
    }
    if (dEnd < bestDist && dEnd <= SNAP_THRESHOLD) {
      bestDist = dEnd; bestStart = p.point - proposedDuration;
    }
  }
  const snapped = bestDist < Infinity;
  return { start: Math.max(0, bestStart), dur: proposedDuration, snapped };
}

function editorReducer(state, action) {
  let next = state;
  const withHistory = HISTORY_ACTIONS.has(action.type);

  switch (action.type) {
    case "LOAD_PROJECT": {
      return {
        ...INITIAL_STATE,
        ...action.projectState,
        history: [],
        future: [],
        isPlaying: false,
        playhead: 0,
      };
    }
    case "UNDO": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...prev,
        history: state.history.slice(0, -1),
        future: [state, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const nx = state.future[0];
      return {
        ...nx,
        history: [...state.history, state],
        future: state.future.slice(1),
      };
    }
    case "SNAPSHOT": {
      return state;
    }
    case "SET_PLAYHEAD": {
      return { ...state, playhead: clamp(action.time, 0, state.duration) };
    }
    case "SET_PLAYING": {
      return { ...state, isPlaying: action.value };
    }
    case "SET_DURATION": {
      return { ...state, duration: Math.max(1, action.value) };
    }
    case "SET_ZOOM": {
      return { ...state, zoom: clamp(action.value, 0.2, 6) };
    }
    case "SET_SNAP": {
      return { ...state, snap: !!action.value };
    }
    case "SET_SELECTED_CLIP":
    case "SELECT_CLIP": {
      return {
        ...state,
        selectedClip: action.clipId || null,
        selectedClips: action.clipId ? [action.clipId] : [],
      };
    }
    case "SELECT_MULTIPLE_CLIPS": {
      return {
        ...state,
        selectedClip: action.clipIds?.[0] || null,
        selectedClips: action.clipIds || [],
      };
    }
    case "DESELECT_ALL": {
      return { ...state, selectedClip: null, selectedClips: [], selectedTrack: null };
    }
    case "SET_SELECTED_TRACK": {
      return { ...state, selectedTrack: action.trackId };
    }
    case "SET_EXPORT_PROGRESS": {
      return { ...state, exportProgress: action.value };
    }
    case "SET_PREVIEW_MODE": {
      return { ...state, previewMode: !!action.value };
    }
    case "SET_GRID": {
      return { ...state, grid: !!action.value };
    }
    case "SET_RULERS": {
      return { ...state, rulers: !!action.value };
    }
    case "SET_SAFE_AREA": {
      return { ...state, safeArea: !!action.value };
    }

    // ── Tracks ─────────────────────────────────────────────────
    case "ADD_TRACK": {
      next = { ...state, tracks: [...state.tracks, action.track] };
      break;
    }
    case "REMOVE_TRACK": {
      const tracks = state.tracks.filter((t) => t.id !== action.trackId);
      const selIds = state.selectedClips.filter((cid) =>
        !tracks.flatMap((t) => t.clips.map((c) => c.id)).includes(cid)
      );
      next = {
        ...state,
        tracks,
        selectedClip: state.selectedClip && selIds.includes(state.selectedClip) ? null : state.selectedClip,
        selectedClips: selIds,
      };
      break;
    }
    case "MOVE_TRACK": {
      const { fromIndex, toIndex } = action;
      const arr = [...state.tracks];
      const [m] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, m);
      next = { ...state, tracks: arr };
      break;
    }
    case "RENAME_TRACK": {
      next = {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id === action.trackId ? { ...t, name: action.name } : t
        ),
      };
      break;
    }
    case "TOGGLE_TRACK_MUTE": {
      return {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id === action.trackId ? { ...t, muted: !t.muted } : t
        ),
      };
    }
    case "TOGGLE_TRACK_SOLO": {
      const hasSolo = state.tracks.some((t) => t.solo);
      const target = state.tracks.find((t) => t.id === action.trackId);
      const wouldBeSolo = !target?.solo;
      return {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id === action.trackId) return { ...t, solo: wouldBeSolo };
          if (!hasSolo && wouldBeSolo) return t;
          if (hasSolo && !wouldBeSolo) return t;
          return t;
        }),
      };
    }
    case "TOGGLE_TRACK_LOCK": {
      return {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id === action.trackId ? { ...t, locked: !t.locked } : t
        ),
      };
    }

    // ── Clips ──────────────────────────────────────────────────
    case "ADD_CLIP": {
      const enriched = {
        filters: DEFAULT_CLIP_FILTERS(),
        transform: DEFAULT_CLIP_TRANSFORM(),
        audio: DEFAULT_CLIP_AUDIO(),
        transitionIn: "fadeIn",
        transitionInDur: 0.3,
        transitionOut: "fadeOut",
        transitionOutDur: 0.3,
        animation: "none",
        animationDur: 0.8,
        speed: 100,
        keyframes: {},
        loop: false,
        ...action.clip,
      };
      let start = enriched.start ?? 0;
      const track = state.tracks.find((t) => t.id === action.trackId);
      if (track) {
        const snap = snapClipToEdges(state, action.trackId, enriched.id, start, enriched.duration, track.clips);
        if (snap.snapped) start = snap.start;
      }
      next = {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id === action.trackId
            ? { ...t, clips: [...t.clips, { ...enriched, start: Math.max(0, start) }] }
            : t
        ),
        selectedClip: enriched.id,
        selectedClips: [enriched.id],
      };
      break;
    }
    case "REMOVE_CLIP": {
      const ids = action.clipIds || [action.clipId];
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.filter((c) => !ids.includes(c.id)),
        })),
        selectedClip: ids.includes(state.selectedClip) ? null : state.selectedClip,
        selectedClips: state.selectedClips.filter((c) => !ids.includes(c)),
      };
      break;
    }
    case "RIPPLE_DELETE": {
      const ids = action.clipIds || [action.clipId];
      const perTrack = {};
      state.tracks.forEach((t) => {
        perTrack[t.id] = t.clips
          .filter((c) => !ids.includes(c.id))
          .map((c) => ({ ...c }));
      });
      ids.forEach((cid) => {
        const info = findClip(state, cid);
        if (!info) return;
        const cutStart = info.clip.start;
        const cutEnd = cutStart + info.clip.duration;
        const list = perTrack[info.track.id] || [];
        list.forEach((c) => {
          if (c.start >= cutEnd) c.start = Math.max(0, c.start - (cutEnd - cutStart));
        });
      });
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({ ...t, clips: perTrack[t.id] || [] })),
        selectedClip: ids.includes(state.selectedClip) ? null : state.selectedClip,
        selectedClips: [],
      };
      break;
    }
    case "MOVE_CLIP": {
      const { trackId, clipId, start } = action;
      const track = state.tracks.find((t) => t.id === trackId);
      if (!track) return state;
      const clip = track.clips.find((c) => c.id === clipId);
      if (!clip) return state;
      const proposedStart = Math.max(0, start ?? clip.start);
      const snap = snapClipToEdges(state, trackId, clipId, proposedStart, clip.duration, track.clips);
      next = {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id !== trackId
            ? t
            : {
                ...t,
                clips: t.clips.map((c) =>
                  c.id !== clipId ? c : { ...c, start: snap.start }
                ),
              }
        ),
      };
      break;
    }
    case "MOVE_CLIP_BETWEEN_TRACKS": {
      const { fromTrackId, toTrackId, clipId, start } = action;
      const fromTrack = state.tracks.find((t) => t.id === fromTrackId);
      const clip = fromTrack?.clips.find((c) => c.id === clipId);
      const toTrack = state.tracks.find((t) => t.id === toTrackId);
      if (!clip || !toTrack) return state;
      const proposedStart = Math.max(0, start ?? clip.start);
      const snap = snapClipToEdges(state, toTrackId, clipId, proposedStart, clip.duration, toTrack.clips);
      next = {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id === fromTrackId) return { ...t, clips: t.clips.filter((c) => c.id !== clipId) };
          if (t.id === toTrackId)
            return { ...t, clips: [...t.clips, { ...clip, start: snap.start }] };
          return t;
        }),
      };
      break;
    }
    case "RESIZE_CLIP": {
      const { trackId, clipId, duration, edge } = action;
      next = {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id !== trackId
            ? t
            : {
                ...t,
                clips: t.clips.map((c) => {
                  if (c.id !== clipId) return c;
                  if (edge === "left") {
                    const delta = (c.duration - Math.max(0.3, duration));
                    return {
                      ...c,
                      start: c.start + delta,
                      duration: Math.max(0.3, duration),
                      trimIn: (c.trimIn || 0) + delta,
                    };
                  }
                  return { ...c, duration: Math.max(0.3, duration) };
                }),
              }
        ),
      };
      break;
    }
    case "SPLIT_CLIP": {
      const splitTime = action.time;
      next = {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id !== action.trackId) return t;
          return {
            ...t,
            clips: t.clips.flatMap((c) => {
              if (c.id !== action.clipId) return [c];
              if (splitTime <= c.start + 0.05 || splitTime >= c.start + c.duration - 0.05) return [c];
              const firstDur = splitTime - c.start;
              const secondDur = c.duration - firstDur;
              return [
                { ...c, duration: firstDur },
                {
                  ...c,
                  id: uid(),
                  start: splitTime,
                  duration: secondDur,
                  trimIn: (c.trimIn || 0) + firstDur,
                  name: c.name + " (2)",
                },
              ];
            }),
          };
        }),
        selectedClip: action.clipId,
      };
      break;
    }
    case "TRIM_CLIP": {
      next = {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id !== action.trackId
            ? t
            : {
                ...t,
                clips: t.clips.map((c) =>
                  c.id !== action.clipId
                    ? c
                    : {
                        ...c,
                        start: action.newStart ?? c.start,
                        duration: Math.max(0.3, action.newDuration ?? c.duration),
                      }
                ),
              }
        ),
      };
      break;
    }
    case "UPDATE_CLIP": {
      const patch = action.patch || {};
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId ? { ...c, ...patch } : c
          ),
        })),
      };
      break;
    }
    case "UPDATE_CLIP_TEXT": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId ? { ...c, text: action.text } : c
          ),
        })),
      };
      break;
    }
    case "UPDATE_CLIP_VOLUME": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId
              ? {
                  ...c,
                  volume: action.volume ?? c.volume,
                  audio: { ...(c.audio || DEFAULT_CLIP_AUDIO()), volume: action.volume ?? 100 },
                }
              : c
          ),
        })),
      };
      break;
    }
    case "UPDATE_CLIP_FILTERS": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId
              ? { ...c, filters: { ...(c.filters || DEFAULT_CLIP_FILTERS()), ...(action.filters || {}) } }
              : c
          ),
        })),
      };
      break;
    }
    case "UPDATE_CLIP_TRANSFORM": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId
              ? { ...c, transform: { ...(c.transform || DEFAULT_CLIP_TRANSFORM()), ...(action.transform || {}) } }
              : c
          ),
        })),
      };
      break;
    }
    case "UPDATE_CLIP_AUDIO": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId
              ? { ...c, audio: { ...(c.audio || DEFAULT_CLIP_AUDIO()), ...(action.audio || {}) } }
              : c
          ),
        })),
      };
      break;
    }
    case "UPDATE_CLIP_KEYFRAMES": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId ? { ...c, keyframes: action.keyframes || {} } : c
          ),
        })),
      };
      break;
    }
    case "SET_CLIP_SPEED": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId
              ? {
                  ...c,
                  speed: action.speed ?? 100,
                  duration: Math.max(0.3, c.duration * (100 / (action.speed ?? 100))),
                }
              : c
          ),
        })),
      };
      break;
    }
    case "SET_CLIP_LOOP": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId ? { ...c, loop: !!action.loop } : c
          ),
        })),
      };
      break;
    }
    case "DUPLICATE_CLIP": {
      const info = findClip(state, action.clipId);
      if (!info) return state;
      const newClip = { ...info.clip, id: uid(), start: info.clip.start + info.clip.duration + 0.1, name: info.clip.name + " Copy" };
      next = {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id !== info.track.id ? t : { ...t, clips: [...t.clips, newClip] }
        ),
        selectedClip: newClip.id,
        selectedClips: [newClip.id],
      };
      break;
    }

    // ── Transitions / Animations ────────────────────────────────
    case "ADD_TRANSITION":
    case "UPDATE_TRANSITION": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) => {
            if (c.id !== action.clipId) return c;
            const out = {};
            if (action.edge === "in" || action.edge === "both") {
              out.transitionIn = action.transition ?? c.transitionIn ?? "none";
              out.transitionInDur = action.duration ?? c.transitionInDur ?? 0.3;
            }
            if (action.edge === "out" || action.edge === "both") {
              out.transitionOut = action.transitionOut ?? c.transitionOut ?? "none";
              out.transitionOutDur = action.durationOut ?? c.transitionOutDur ?? 0.3;
            }
            return { ...c, ...out };
          }),
        })),
      };
      break;
    }
    case "REMOVE_TRANSITION": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) => {
            if (c.id !== action.clipId) return c;
            const out = {};
            if (!action.edge || action.edge === "in") {
              out.transitionIn = "none";
              out.transitionInDur = 0;
            }
            if (!action.edge || action.edge === "out") {
              out.transitionOut = "none";
              out.transitionOutDur = 0;
            }
            return { ...c, ...out };
          }),
        })),
      };
      break;
    }
    case "SET_ANIMATION": {
      next = {
        ...state,
        tracks: state.tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === action.clipId
              ? { ...c, animation: action.animation ?? "none", animationDur: action.duration ?? 0.8 }
              : c
          ),
        })),
      };
      break;
    }

    // ── Markers / In / Out ──────────────────────────────────────
    case "ADD_MARKER": {
      const m = { id: uid(), time: action.time, label: action.label || "", color: action.color || "#e1496d" };
      next = { ...state, markers: [...state.markers, m] };
      break;
    }
    case "REMOVE_MARKER": {
      next = { ...state, markers: state.markers.filter((m) => m.id !== action.markerId) };
      break;
    }
    case "SET_IN_POINT": {
      next = { ...state, inPoint: action.value ?? null };
      break;
    }
    case "SET_OUT_POINT": {
      next = { ...state, outPoint: action.value ?? null };
      break;
    }

    // ── Aspect / Background ─────────────────────────────────────
    case "SET_ASPECT_RATIO": {
      next = { ...state, aspectRatio: action.ratio };
      break;
    }
    case "SET_CUSTOM_SIZE": {
      next = { ...state, customW: Math.max(100, action.w), customH: Math.max(100, action.h) };
      break;
    }
    case "SET_BACKGROUND_COLOR": {
      next = { ...state, backgroundColor: action.value };
      break;
    }
    case "SET_BACKGROUND_TYPE": {
      next = { ...state, backgroundType: action.value };
      break;
    }
    case "SET_BACKGROUND_GRADIENT": {
      next = { ...state, backgroundGradient: action.value };
      break;
    }

    // ── Global Filters ──────────────────────────────────────────
    case "SET_FILTER": {
      return { ...state, [action.key]: action.value };
    }
    case "APPLY_PRESET": {
      const patch = action.preset || {};
      return { ...state, ...patch };
    }
    case "RESET_FILTERS": {
      return { ...state, brightness: 100, contrast: 100, saturation: 100, hue: 0, opacity: 100, sepia: 0, blur: 0, sharpen: 0, vignette: 0 };
    }
    case "SET_PLAYBACK_SPEED": {
      return { ...state, playbackSpeed: action.value };
    }

    default:
      return state;
  }

  if (withHistory && !action.skipHistory) {
    const { history: _h, future: _f, ...snap } = state;
    const newHistory = [...state.history, snap].slice(-100);
    next = { ...next, history: newHistory, future: [] };
  }
  return next;
}

export const useEditorState = () => {
  const [state, rawDispatch] = useReducer(editorReducer, INITIAL_STATE);
  const lastSnapshotRef = useRef(null);

  const dispatch = useCallback((action) => {
    rawDispatch(action);
  }, []);

  const takeSnapshot = useCallback(() => {
    lastSnapshotRef.current = state;
  }, [state]);

  return [state, dispatch, takeSnapshot];
};
