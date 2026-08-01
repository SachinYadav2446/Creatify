import { useState, useRef, useEffect, useCallback } from "react";
import { useEditorState } from "../hooks/useEditorState";
import {
  uid, fmtTime, ASPECT_RATIOS, EFFECT_PRESETS, TEXT_PRESETS,
  FONT_FAMILIES, SHAPE_TYPES, STICKERS, BG_MUSIC, STOCK_MEDIA,
  TRANSITIONS, ANIMATIONS
} from "../constants";
import Timeline from "./Timeline";
import ExportModal from "./ExportModal";
import ShortcutsModal from "./ShortcutsModal";

const SFX_LIBRARY = [
  { id: "sfx1", name: "Whoosh Swish", type: "audio", url: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", duration: 1, category: "SFX", thumb: "💨" },
  { id: "sfx2", name: "Pop Click", type: "audio", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", duration: 1, category: "SFX", thumb: "🎈" },
  { id: "sfx3", name: "Success Bell", type: "audio", url: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3", duration: 2, category: "SFX", thumb: "🔔" },
  { id: "sfx4", name: "Camera Shutter", type: "audio", url: "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3", duration: 1, category: "SFX", thumb: "📸" },
  { id: "sfx5", name: "Applause Cheer", type: "audio", url: "https://assets.mixkit.co/active_storage/sfx/2805/2805-preview.mp3", duration: 4, category: "SFX", thumb: "👏" },
  { id: "sfx6", name: "Glitch Buzz", type: "audio", url: "https://assets.mixkit.co/active_storage/sfx/2688/2688-preview.mp3", duration: 2, category: "SFX", thumb: "⚡" },
];

export default function VideoEditor({ onBack, user, initialProject }) {
  const [state, dispatch] = useEditorState();
  const [showExport, setShowExport]               = useState(false);
  const [exportUrl, setExportUrl]                 = useState(null);
  
  // Sidebar state: drawerOpen (true/false) & active tab
  const [drawerOpen, setDrawerOpen]               = useState(true);
  const [leftTab, setLeftTab]                     = useState("media");
  
  // Resizable timeline height state (in px)
  const [timelineHeight, setTimelineHeight]       = useState(260);
  const isResizingTimelineRef                     = useRef(false);

  const [activeTool, setActiveTool]               = useState("select");
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal]       = useState(false);

  const [projectTitle, setProjectTitle]           = useState(() => {
    return initialProject ? initialProject.title : "Cinematic Studio";
  });

  const timelineRef      = useRef(null);
  const playIntervalRef  = useRef(null);
  const fileInputRef     = useRef(null);
  const jsonInputRef     = useRef(null);
  const fileInputTypeRef = useRef("video");
  const videoRef         = useRef(null);
  const canvasPreviewRef = useRef(null);

  // Initialize sample project tracks if brand new project
  useEffect(() => {
    if (initialProject && initialProject.data) {
      dispatch({ type: "LOAD_PROJECT", projectState: initialProject.data });
      if (initialProject.title) setProjectTitle(initialProject.title);
    } else if (state.tracks.length === 0) {
      const vTrack = { id: uid(), type: "video", name: "Video Layer 1", clips: [] };
      const tTrack = { id: uid(), type: "text", name: "Titles & Text", clips: [] };
      const aTrack = { id: uid(), type: "audio", name: "Background Music", clips: [] };
      dispatch({ type: "ADD_TRACK", track: vTrack });
      dispatch({ type: "ADD_TRACK", track: tTrack });
      dispatch({ type: "ADD_TRACK", track: aTrack });

      const starterVideo = STOCK_MEDIA[0];
      dispatch({
        type: "ADD_CLIP",
        trackId: vTrack.id,
        clip: {
          id: uid(),
          name: starterVideo.name,
          start: 0,
          duration: starterVideo.duration,
          url: starterVideo.url,
          type: "video",
        }
      });
      dispatch({
        type: "ADD_CLIP",
        trackId: tTrack.id,
        clip: {
          id: uid(),
          name: "Welcome Title",
          text: "CINÉCUT STUDIO",
          start: 0.5,
          duration: 5,
          type: "text",
          x: 50,
          y: 50,
          fontSize: 40,
          fontFamily: "'Syne', sans-serif",
          color: "#ffffff",
          bgColor: "rgba(18, 14, 18, 0.85)",
          borderColor: "#e1496d",
          animation: "slideUp",
        }
      });
    }
  }, [initialProject, dispatch]);

  const handleSaveAndExit = () => {
    const savedWorks = JSON.parse(localStorage.getItem("creatify_past_works") || "[]");
    const projectId = initialProject?.id || `video_${Date.now()}`;
    const existingIdx = savedWorks.findIndex(w => w.id === projectId);

    const projectData = {
      id: projectId,
      title: projectTitle.trim() || "Untitled Video Project",
      category: "Video Edit",
      tool: "Video Editor",
      year: new Date().getFullYear().toString(),
      accent: "#e1496d",
      gradient: "linear-gradient(135deg, #181318 0%, #2a1520 50%, #120e12 100%)",
      icon: "🎬",
      tags: [state.aspectRatio || "16:9", `${state.tracks.reduce((acc, t) => acc + t.clips.length, 0)} Clips`],
      desc: `Edited project with ${state.tracks.length} tracks.`,
      data: {
        tracks: state.tracks,
        duration: state.duration,
        aspectRatio: state.aspectRatio,
        brightness: state.brightness,
        contrast: state.contrast,
        saturation: state.saturation,
        hue: state.hue,
        opacity: state.opacity,
        sepia: state.sepia,
        playbackSpeed: state.playbackSpeed,
        blur: state.blur,
        sharpen: state.sharpen,
        vignette: state.vignette
      }
    };

    if (existingIdx > -1) savedWorks[existingIdx] = projectData;
    else savedWorks.unshift(projectData);

    localStorage.setItem("creatify_past_works", JSON.stringify(savedWorks));

    if (user && user.email) {
      const userKey = `creatify_video_projects_${user.email}`;
      const userProjects = JSON.parse(localStorage.getItem(userKey) || "[]");
      const uIdx = userProjects.findIndex(p => p.id === projectId);
      if (uIdx > -1) userProjects[uIdx] = projectData;
      else userProjects.unshift(projectData);
      localStorage.setItem(userKey, JSON.stringify(userProjects));
    }

    const token = localStorage.getItem("creatify_token");
    if (token) {
      fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(projectData)
      })
      .then(res => { if (!res.ok) throw new Error("Server rejected save"); })
      .catch(err => console.error("DB save error:", err.message))
      .finally(() => onBack());
    } else {
      onBack();
    }
  };

  const handleDiscardAndExit = () => onBack();

  // Active clip at playhead
  const activeClip = state.tracks.flatMap(t => t.clips).find(c =>
    c.start <= state.playhead && c.start + c.duration > state.playhead && (c.videoEl || c.url) && (c.type === "video" || c.type === "image")
  );

  // Sync video element
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (activeClip?.type === "video" && activeClip?.url) {
      if (video.src !== activeClip.url) { video.src = activeClip.url; video.load(); }
      const videoTime = state.playhead - activeClip.start;
      if (state.isPlaying) { video.play().catch(() => {}); }
      else { video.pause(); if (Math.abs(video.currentTime - videoTime) > 0.05) video.currentTime = videoTime; }
    } else { video.pause(); }
  }, [state.playhead, state.isPlaying, activeClip]);

  useEffect(() => {
    if (!videoRef.current || !state.isPlaying || activeClip?.type !== "video") return;
    const video = videoRef.current;
    const handleTimeUpdate = () => dispatch({ type: "SET_PLAYHEAD", time: activeClip.start + video.currentTime });
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [state.isPlaying, activeClip, dispatch]);

  // Dynamic duration
  useEffect(() => {
    let maxEnd = 0;
    state.tracks.forEach(t => t.clips.forEach(c => { if (c.start + c.duration > maxEnd) maxEnd = c.start + c.duration; }));
    const nd = Math.max(60, maxEnd + 10);
    if (Math.abs(nd - state.duration) > 1) dispatch({ type: "SET_DURATION", value: nd });
  }, [state.tracks, state.duration, dispatch]);

  // Playback loop for image/text only
  useEffect(() => {
    const hasVideo = state.tracks.some(t => t.clips.some(c => c.type === "video" && c.start <= state.playhead && c.start + c.duration > state.playhead));
    if (state.isPlaying && !hasVideo) {
      playIntervalRef.current = setInterval(() => {
        dispatch({ type: "SET_PLAYHEAD", time: state.playhead + 0.033 * state.playbackSpeed });
        if (state.playhead >= state.duration) { dispatch({ type: "SET_PLAYING", value: false }); dispatch({ type: "SET_PLAYHEAD", time: 0 }); }
      }, 33);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [state.isPlaying, state.playhead, state.duration, dispatch, state.tracks, state.playbackSpeed]);

  // Audio elements engine
  const audioElementsRef = useRef({});
  useEffect(() => {
    return () => {
      Object.values(audioElementsRef.current).forEach(audio => { audio.pause(); audio.src = ""; });
    };
  }, []);

  useEffect(() => {
    const audioClips = state.tracks.filter(t => t.type === "audio").flatMap(t => t.clips);
    const activeClipIds = new Set(audioClips.map(c => c.id));

    Object.keys(audioElementsRef.current).forEach(id => {
      if (!activeClipIds.has(id)) {
        const audio = audioElementsRef.current[id];
        audio.pause(); audio.src = "";
        delete audioElementsRef.current[id];
      }
    });

    audioClips.forEach(clip => {
      let audio = audioElementsRef.current[clip.id];
      if (!audio) {
        audio = new Audio(clip.url);
        audio.crossOrigin = "anonymous";
        audioElementsRef.current[clip.id] = audio;
      }
      audio.volume = Math.max(0, Math.min(1, clip.volume ?? 1));
      const offsetTime = state.playhead - clip.start;
      const isWithinClipRange = offsetTime >= 0 && offsetTime < clip.duration;

      if (state.isPlaying && isWithinClipRange) {
        if (Math.abs(audio.currentTime - offsetTime) > 0.15) audio.currentTime = offsetTime;
        if (audio.paused) audio.play().catch(e => console.warn("Audio play blocked:", e.message));
      } else {
        if (!audio.paused) audio.pause();
        if (isWithinClipRange) audio.currentTime = offsetTime;
        else audio.currentTime = 0;
      }
    });
  }, [state.isPlaying, state.playhead, state.tracks]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "Escape") {
        setShowShortcutsModal(false);
        setShowLeaveModal(false);
        dispatch({ type: "DESELECT_ALL" });
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        return;
      }
      switch (e.key) {
        case " ": e.preventDefault(); dispatch({ type: "SET_PLAYING", value: !state.isPlaying }); break;
        case "ArrowLeft":
          e.preventDefault();
          dispatch({ type: "SET_PLAYHEAD", time: Math.max(0, state.playhead - (e.shiftKey ? 0.033 : 5)) }); break;
        case "ArrowRight":
          e.preventDefault();
          dispatch({ type: "SET_PLAYHEAD", time: Math.min(state.duration, state.playhead + (e.shiftKey ? 0.033 : 5)) }); break;
        case "s": case "S":
          if (e.ctrlKey || e.metaKey) { e.preventDefault(); handleSaveAndExit(); }
          else { e.preventDefault(); onSplitClip(); } break;
        case "Delete": case "Backspace": if (state.selectedClip) { e.preventDefault(); onDeleteClip(); } break;
        case "z": case "Z":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) dispatch({ type: "REDO" });
            else dispatch({ type: "UNDO" });
          }
          break;
        case "y": case "Y": if (e.ctrlKey || e.metaKey) { e.preventDefault(); dispatch({ type: "REDO" }); } break;
        case "i": case "I": e.preventDefault(); dispatch({ type: "SET_IN_POINT", value: state.playhead }); break;
        case "o": case "O": e.preventDefault(); dispatch({ type: "SET_OUT_POINT", value: state.playhead }); break;
        case "m": case "M": e.preventDefault(); dispatch({ type: "ADD_MARKER", time: state.playhead, label: "Marker", color: "#e1496d" }); break;
        case "c": case "C": setActiveTool("cut"); break;
        case "v": case "V": setActiveTool("select"); break;
        case "t": case "T": setActiveTool("trim"); break;
        case "Home": e.preventDefault(); dispatch({ type: "SET_PLAYHEAD", time: 0 }); break;
        case "End": e.preventDefault(); dispatch({ type: "SET_PLAYHEAD", time: state.duration }); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedClip, state.playhead, state.duration, state.isPlaying, state.tracks, dispatch]);

  // Selected clip data
  const selectedClipData = state.selectedClip
    ? state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClip)
    : null;

  useEffect(() => {
    if (state.selectedClip) {
      setLeftTab("properties");
      setDrawerOpen(true);
    }
  }, [state.selectedClip]);

  // Tab Icon Click Handler: Toggle Drawer if clicking same active tab
  const handleTabIconClick = (tabId) => {
    if (leftTab === tabId && drawerOpen) {
      setDrawerOpen(false);
    } else {
      setLeftTab(tabId);
      setDrawerOpen(true);
    }
  };

  // Timeline Mouse Resizing Handler
  const handleTimelineResizeMouseDown = (e) => {
    e.preventDefault();
    isResizingTimelineRef.current = true;
    const startY = e.clientY;
    const startH = timelineHeight;

    const onMouseMove = (me) => {
      if (!isResizingTimelineRef.current) return;
      const deltaY = startY - me.clientY;
      const newHeight = Math.max(140, Math.min(520, startH + deltaY));
      setTimelineHeight(newHeight);
    };

    const onMouseUp = () => {
      isResizingTimelineRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Add Clips
  const addTextClip = (preset = null) => {
    let track = state.tracks.find(t => t.type === "text");
    if (!track) {
      track = { id: uid(), type: "text", name: "Text Track", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    const start = Math.max(state.playhead, maxStart);

    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: preset ? preset.name : "Title Text",
        text: preset ? (preset.name === "Big Heading" ? "MAIN HEADLINE" : preset.name) : "Your Title Here",
        start,
        duration: 4,
        type: "text",
        x: 50,
        y: 50,
        fontSize: preset ? Math.round(preset.fontSize / 2.5) : 36,
        fontFamily: preset?.neon ? "'Syne', sans-serif" : "'Poppins', sans-serif",
        color: preset?.color || "#ffffff",
        bgColor: preset?.neon ? "rgba(225, 73, 109, 0.2)" : "rgba(18, 14, 18, 0.85)",
        borderColor: preset?.stroke || "#e1496d",
        animation: preset?.neon ? "pulse" : "slideUp",
      }
    });
  };

  const addStickerClip = (sticker) => {
    let track = state.tracks.find(t => t.type === "sticker");
    if (!track) {
      track = { id: uid(), type: "sticker", name: "Stickers & Emojis", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    const start = Math.max(state.playhead, maxStart);

    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: sticker.name,
        emoji: sticker.emoji,
        start,
        duration: 4,
        type: "sticker",
        x: 50,
        y: 50,
        scale: 1,
        animation: "popIn",
      }
    });
  };

  const addShapeClip = (shape) => {
    let track = state.tracks.find(t => t.type === "shape");
    if (!track) {
      track = { id: uid(), type: "shape", name: "Geometric Shapes", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    const start = Math.max(state.playhead, maxStart);

    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: shape.name,
        shapeIcon: shape.icon,
        shapeType: shape.id,
        start,
        duration: 5,
        type: "shape",
        x: 50,
        y: 50,
        fill: shape.default.fill,
        stroke: shape.default.stroke,
        strokeWidth: shape.default.strokeWidth,
        animation: "fadeIn",
      }
    });
  };

  const addStockMedia = (item) => {
    let track = state.tracks.find(t => t.type === item.type);
    let trackId;
    if (!track) {
      trackId = uid();
      dispatch({ type: "ADD_TRACK", track: { id: trackId, type: item.type, name: item.type.toUpperCase() + " Track", clips: [] } });
    } else trackId = track.id;

    const clipId = uid();
    const newClip = {
      id: clipId,
      name: item.name,
      start: state.playhead,
      duration: item.duration,
      url: item.url,
      type: item.type,
      volume: item.type === "audio" ? 0.8 : 1,
    };

    if (item.type === "image") {
      const img = new Image();
      img.onload = () => dispatch({ type: "ADD_CLIP", trackId, clip: { ...newClip, imageEl: img } });
      img.src = item.url;
    } else if (item.type === "video") {
      const v = document.createElement("video");
      v.src = item.url; v.playsInline = true; v.crossOrigin = "anonymous";
      v.onloadedmetadata = () => dispatch({ type: "ADD_CLIP", trackId, clip: { ...newClip, duration: v.duration || item.duration, videoEl: v } });
    } else {
      dispatch({ type: "ADD_CLIP", trackId, clip: newClip });
    }
  };

  const handleFileUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const type = fileInputTypeRef.current;
      const url = URL.createObjectURL(file);
      const clipId = uid();
      if (type === "image" || file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          let track = state.tracks.find(t => t.type === "image");
          if (!track) { track = { id: uid(), type: "image", name: "Images", clips: [] }; dispatch({ type: "ADD_TRACK", track }); }
          const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
          dispatch({ type: "ADD_CLIP", trackId: track.id, clip: { id: clipId, name: file.name, start: maxStart, duration: 5, url, imageEl: img, type: "image" } });
        };
        img.src = url;
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = url; video.playsInline = true; video.crossOrigin = "anonymous";
        video.onloadedmetadata = () => {
          let track = state.tracks.find(t => t.type === "video");
          if (!track) { track = { id: uid(), type: "video", name: "Video Layer", clips: [] }; dispatch({ type: "ADD_TRACK", track }); }
          const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
          dispatch({ type: "ADD_CLIP", trackId: track.id, clip: { id: clipId, name: file.name, start: maxStart, duration: video.duration || 10, url, videoEl: video, type: "video" } });
        };
      } else if (file.type.startsWith("audio/")) {
        let track = state.tracks.find(t => t.type === "audio");
        if (!track) { track = { id: uid(), type: "audio", name: "Audio Track", clips: [] }; dispatch({ type: "ADD_TRACK", track }); }
        const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
        dispatch({ type: "ADD_CLIP", trackId: track.id, clip: { id: clipId, name: file.name, start: maxStart, duration: 30, url, type: "audio", volume: 1 } });
      }
    });
    e.target.value = "";
  };

  const PX_PER_SEC = 80 * state.zoom;

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const sc = timelineRef.current.closest(".timeline-scroll-container");
    const x = e.clientX - rect.left + (sc ? sc.scrollLeft : 0);
    if (x < 0) return;
    dispatch({ type: "SET_PLAYHEAD", time: x / PX_PER_SEC });
  };

  const handleClipMouseDown = (e, trackId, clip) => {
    e.stopPropagation();
    dispatch({ type: "SELECT_CLIP", clipId: clip.id });
    if (activeTool === "cut") {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) dispatch({ type: "SPLIT_CLIP", trackId, clipId: clip.id, time: state.playhead });
      return;
    }
    const startX = e.clientX, startPos = clip.start;
    const onMove = me => dispatch({ type: "MOVE_CLIP", trackId, clipId: clip.id, start: startPos + (me.clientX - startX) / PX_PER_SEC });
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  };

  const handleResizeMouseDown = (e, trackId, clip) => {
    e.stopPropagation();
    const startX = e.clientX, startDur = clip.duration;
    const onMove = me => dispatch({ type: "RESIZE_CLIP", trackId, clipId: clip.id, duration: startDur + (me.clientX - startX) / PX_PER_SEC });
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  };

  // Canvas Element Dragging
  const handleCanvasElementMouseDown = (e, clip) => {
    e.stopPropagation();
    dispatch({ type: "SELECT_CLIP", clipId: clip.id });
    const previewContainer = canvasPreviewRef.current;
    if (!previewContainer) return;
    const rect = previewContainer.getBoundingClientRect();

    const onMove = (me) => {
      const newXPercentage = Math.max(5, Math.min(95, ((me.clientX - rect.left) / rect.width) * 100));
      const newYPercentage = Math.max(5, Math.min(95, ((me.clientY - rect.top) / rect.height) * 100));
      dispatch({
        type: "UPDATE_CLIP",
        clipId: clip.id,
        patch: { x: Math.round(newXPercentage), y: Math.round(newYPercentage) }
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onSplitClip = () => {
    if (!state.selectedClip) return;
    const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClip);
    const track = state.tracks.find(t => t.clips.some(c => c.id === state.selectedClip));
    if (clip && track) dispatch({ type: "SPLIT_CLIP", trackId: track.id, clipId: state.selectedClip, time: state.playhead });
  };

  const onDeleteClip = () => {
    if (!state.selectedClip) return;
    dispatch({ type: "REMOVE_CLIP", clipId: state.selectedClip });
  };

  const onTrimInAtPlayhead = () => {
    if (!state.selectedClip) return;
    const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClip);
    const track = state.tracks.find(t => t.clips.some(c => c.id === state.selectedClip));
    if (clip && track && state.playhead > clip.start && state.playhead < clip.start + clip.duration) {
      const newDuration = (clip.start + clip.duration) - state.playhead;
      dispatch({ type: "TRIM_CLIP", trackId: track.id, clipId: state.selectedClip, newStart: state.playhead, newDuration });
    }
  };

  const onTrimOutAtPlayhead = () => {
    if (!state.selectedClip) return;
    const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClip);
    const track = state.tracks.find(t => t.clips.some(c => c.id === state.selectedClip));
    if (clip && track && state.playhead > clip.start && state.playhead < clip.start + clip.duration) {
      const newDuration = state.playhead - clip.start;
      dispatch({ type: "TRIM_CLIP", trackId: track.id, clipId: state.selectedClip, newStart: clip.start, newDuration });
    }
  };

  const onDuplicateClip = () => {
    if (!state.selectedClip) return;
    const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClip);
    const track = state.tracks.find(t => t.clips.some(c => c.id === state.selectedClip));
    if (clip && track) {
      dispatch({ type: "ADD_CLIP", trackId: track.id, clip: { ...clip, id: uid(), start: clip.start + clip.duration } });
    }
  };

  const onTogglePlay = () => dispatch({ type: "SET_PLAYING", value: !state.isPlaying });
  const onFrameForward = () => dispatch({ type: "SET_PLAYHEAD", time: Math.min(state.duration, state.playhead + 0.033) });
  const onFrameBackward = () => dispatch({ type: "SET_PLAYHEAD", time: Math.max(0, state.playhead - 0.033) });
  const onSetPlaybackSpeed = (speed) => { dispatch({ type: "SET_PLAYBACK_SPEED", value: speed }); if (videoRef.current) videoRef.current.playbackRate = speed; };
  const onAddTrack = () => { dispatch({ type: "ADD_TRACK", track: { id: uid(), type: "video", name: `Track ${state.tracks.length + 1}`, clips: [] } }); };
  const onResetFilters = () => ["brightness","contrast","saturation","hue","sepia","opacity","blur","sharpen","vignette"].forEach(k => dispatch({ type: "SET_FILTER", key: k, value: k==="hue"||k==="blur"||k==="sharpen"||k==="vignette"||k==="sepia" ? 0 : 100 }));
  const onSetClipVolume = (clipId, volume) => dispatch({ type: "UPDATE_CLIP_VOLUME", clipId, volume });

  const onAddVideo  = () => { fileInputTypeRef.current = "video"; fileInputRef.current.click(); };
  const onAddImage  = () => { fileInputTypeRef.current = "image"; fileInputRef.current.click(); };

  const applyPreset = (name) => {
    if (EFFECT_PRESETS[name]) {
      Object.entries(EFFECT_PRESETS[name]).forEach(([key, value]) => dispatch({ type: "SET_FILTER", key, value }));
    }
  };

  const exportProjectJson = () => {
    const projectData = {
      title: projectTitle,
      tracks: state.tracks,
      duration: state.duration,
      aspectRatio: state.aspectRatio,
      brightness: state.brightness,
      contrast: state.contrast,
      saturation: state.saturation,
      hue: state.hue,
      sepia: state.sepia,
      opacity: state.opacity,
      playbackSpeed: state.playbackSpeed,
      blur: state.blur,
      sharpen: state.sharpen,
      vignette: state.vignette
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle.replace(/\s+/g, "_")}_project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProjectJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.tracks) {
          dispatch({ type: "LOAD_PROJECT", projectState: data });
          if (data.title) setProjectTitle(data.title);
        }
      } catch (err) {
        alert("Invalid project file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Real Export pipeline
  const performRealExport = async () => {
    setShowExport(true);
    dispatch({ type: "SET_EXPORT_PROGRESS", value: 0 });
    setExportUrl(null);

    const canvas = document.createElement("canvas");
    const aspectObj = ASPECT_RATIOS.find(a => a.id === state.aspectRatio) || ASPECT_RATIOS[0];
    canvas.width = aspectObj.w || 1920;
    canvas.height = aspectObj.h || 1080;

    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(30);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioDest = audioCtx.createMediaStreamDestination();

    const combinedTracks = [];
    stream.getVideoTracks().forEach(t => combinedTracks.push(t));
    audioDest.stream.getAudioTracks().forEach(t => combinedTracks.push(t));
    const combinedStream = new MediaStream(combinedTracks);

    let options = { mimeType: 'video/webm;codecs=vp8,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/webm' };

    const chunks = [];
    const recorder = new MediaRecorder(combinedStream, options);

    recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };

    const activeSources = [];

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setExportUrl(url);
      dispatch({ type: "SET_EXPORT_PROGRESS", value: 100 });
      activeSources.forEach(s => { try { s.stop(); } catch(e) {} });
      audioCtx.close();
    };

    recorder.start();

    const totalDuration = Math.min(state.duration || 60, 60);
    const fps = 30;
    const totalFrames = Math.ceil(totalDuration * fps);
    const timeStep = 1 / fps;

    const clips = state.tracks.flatMap(t => t.clips);
    const videoClips = clips.filter(c => c.type === 'video');
    const imageClips = clips.filter(c => c.type === 'image');
    const audioClips = clips.filter(c => c.type === 'audio');

    const loadedImages = {};
    for (const c of imageClips) {
      if (c.imageEl) loadedImages[c.id] = c.imageEl;
      else {
        const img = new Image();
        img.src = c.url;
        await new Promise((res) => { img.onload = res; img.onerror = res; });
        loadedImages[c.id] = img;
      }
    }

    const activeVideoElements = {};
    for (const c of videoClips) {
      const v = document.createElement("video");
      v.src = c.url; v.muted = true; v.playsInline = true; v.crossOrigin = "anonymous";
      await new Promise((res) => {
        v.onloadedmetadata = res; v.onerror = res;
        setTimeout(res, 1000);
      });
      activeVideoElements[c.id] = v;
    }

    const allClipsWithAudio = [...audioClips, ...videoClips];
    for (const c of allClipsWithAudio) {
      try {
        const res = await fetch(c.url);
        if (res.ok) {
          const arrayBuf = await res.arrayBuffer();
          const audioBuf = await audioCtx.decodeAudioData(arrayBuf);
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuf;
          const gainNode = audioCtx.createGain();
          gainNode.gain.value = Math.max(0, Math.min(1, c.volume ?? 1));
          source.connect(gainNode);
          gainNode.connect(audioDest);
          source.start(audioCtx.currentTime + c.start);
          activeSources.push(source);
        }
      } catch (err) {
        console.warn("Audio channel decode note:", c.name, err.message);
      }
    }

    for (let i = 0; i < totalFrames; i++) {
      const currentTimeCode = i * timeStep;
      dispatch({ type: "SET_EXPORT_PROGRESS", value: (i / totalFrames) * 95 });

      ctx.fillStyle = "#120e12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentActiveClips = clips.filter(c => c.start <= currentTimeCode && c.start + c.duration > currentTimeCode);

      for (const c of currentActiveClips) {
        if (c.type === 'image' && loadedImages[c.id]) {
          ctx.save();
          ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%) hue-rotate(${state.hue}deg) opacity(${state.opacity}%) blur(${state.blur}px) sepia(${state.sepia}%)`;
          ctx.drawImage(loadedImages[c.id], 0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else if (c.type === 'video' && activeVideoElements[c.id]) {
          const v = activeVideoElements[c.id];
          const offsetTime = currentTimeCode - c.start;
          v.currentTime = Math.min(v.duration, Math.max(0, offsetTime));
          await new Promise((res) => { v.onseeked = res; setTimeout(res, 40); });

          ctx.save();
          ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%) hue-rotate(${state.hue}deg) opacity(${state.opacity}%) blur(${state.blur}px) sepia(${state.sepia}%)`;
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      }

      if (state.vignette > 0) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 10,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.4
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${state.vignette / 100})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const activeTextClips = currentActiveClips.filter(c => c.type === 'text');
      for (const c of activeTextClips) {
        ctx.save();
        const fontSize = Math.round((c.fontSize || 36) * (canvas.height / 720));
        ctx.font = `700 ${fontSize}px ${c.fontFamily || "'Syne', sans-serif"}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textX = (c.x ?? 50) / 100 * canvas.width;
        const textY = (c.y ?? 80) / 100 * canvas.height;

        const textWidth = ctx.measureText(c.text).width;
        if (c.bgColor) {
          ctx.fillStyle = c.bgColor || 'rgba(18, 14, 18, 0.85)';
          ctx.strokeStyle = c.borderColor || '#e1496d';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(textX - textWidth / 2 - 24, textY - fontSize * 0.7, textWidth + 48, fontSize * 1.4, 12);
          ctx.fill();
          ctx.stroke();
        }

        ctx.fillStyle = c.color || '#ffffff';
        ctx.fillText(c.text, textX, textY);
        ctx.restore();
      }

      const activeStickerClips = currentActiveClips.filter(c => c.type === 'sticker');
      for (const c of activeStickerClips) {
        ctx.save();
        ctx.font = `600 72px 'Segoe UI Emoji', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const stX = (c.x ?? 50) / 100 * canvas.width;
        const stY = (c.y ?? 50) / 100 * canvas.height;
        ctx.fillText(c.emoji || "✨", stX, stY);
        ctx.restore();
      }

      await new Promise(r => setTimeout(r, 5));
    }

    recorder.stop();
  };

  const cssFilter = `brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%) hue-rotate(${state.hue}deg) opacity(${state.opacity}%) blur(${state.blur}px) sepia(${state.sepia}%)`;

  const tools = [
    { id:"select", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 7-7 1.5 2 6.5L5 3z"/></svg>, label:"Select (V)" },
    { id:"cut",    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/></svg>, label:"Cut (C)" },
    { id:"trim",   icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, label:"Trim (T)" },
  ];

  const editActions = [
    { label:"Split (S)",  icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, action: onSplitClip,          disabled: !state.selectedClip },
    { label:"Trim In",    icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>, action: onTrimInAtPlayhead,   disabled: !state.selectedClip },
    { label:"Trim Out",   icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>, action: onTrimOutAtPlayhead,  disabled: !state.selectedClip },
    { label:"Duplicate",  icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>, action: onDuplicateClip,      disabled: !state.selectedClip },
    { label:"Delete",     icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>, action: onDeleteClip,         disabled: !state.selectedClip, danger: true },
  ];

  const activeRatioObj = ASPECT_RATIOS.find(a => a.id === (state.aspectRatio || "16:9")) || ASPECT_RATIOS[0];

  const tabsConfig = [
    { id: "media", label: "Media", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg> },
    { id: "text", label: "Text", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> },
    { id: "stickers", label: "Emoji", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
    { id: "audio", label: "Audio", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
    { id: "presets", label: "Color", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg> },
    { id: "transitions", label: "Effects", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: "properties", label: "Inspect", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
  ];

  return (
    <div style={{ background:"#0e0d11", color:"#e5e5e5", fontFamily:"'Instrument Sans',sans-serif", height:"100vh", width:"100vw", display:"flex", flexDirection:"column", overflow:"hidden", userSelect:"none" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Instrument+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body,html{height:100%;width:100%;overflow:hidden;background:#0e0d11}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#0e0d11}
        ::-webkit-scrollbar-thumb{background:rgba(225,73,109,0.22);border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#e1496d}
        .clip-block{cursor:grab;transition:opacity 0.1s,box-shadow 0.1s}
        .clip-block:hover{opacity:0.92}
        .clip-block.selected{box-shadow:0 0 0 2px #e1496d,inset 0 0 0 1px rgba(225,73,109,0.4);filter:brightness(1.15)}
        .tool-btn{background:rgba(225,73,109,0.06);border:1px solid rgba(225,73,109,0.18);color:#e5e5e5;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:11.5px;font-family:'Poppins',sans-serif;font-weight:500;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;white-space:nowrap;flex-shrink:0}
        .tool-btn:hover{background:rgba(225,73,109,0.15);color:#ff8da7;border-color:rgba(225,73,109,0.4);transform:translateY(-1px)}
        .tool-btn:disabled{opacity:0.3;cursor:not-allowed;pointer-events:none;transform:none}
        .tool-btn.primary{background:linear-gradient(135deg,#a82348,#e1496d);border:none;color:#fff;box-shadow:0 3px 12px rgba(225,73,109,0.35);font-weight:600}
        .tool-btn.primary:hover{transform:translateY(-1px);box-shadow:0 5px 18px rgba(225,73,109,0.5)}
        .tool-btn.danger{color:#ef4444;border-color:rgba(239,68,68,0.25);background:rgba(239,68,68,0.06)}
        .tool-btn.danger:hover{background:rgba(239,68,68,0.18);border-color:#ef4444}
        .tool-btn.active{background:rgba(225,73,109,0.22);color:#ff8da7;border-color:#e1496d;box-shadow:0 0 10px rgba(225,73,109,0.25)}
        .filter-slider{width:100%;-webkit-appearance:none;appearance:none;height:4px;background:rgba(225,73,109,0.18);border-radius:3px;outline:none;cursor:pointer}
        .filter-slider::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;background:#e1496d;border-radius:50%;cursor:pointer;box-shadow:0 0 6px rgba(225,73,109,0.5);transition:all 0.15s}
        .filter-slider::-webkit-slider-thumb:hover{transform:scale(1.25);background:#ff8da7}
        .canvas-element{cursor:move;transition:outline 0.15s;border-radius:8px}
        .canvas-element:hover{outline:1.5px dashed #e1496d}
        .canvas-element.selected-canvas{outline:2px solid #e1496d;box-shadow:0 0 12px rgba(225,73,109,0.4)}
        .nav-icon-btn{width:52px;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:#6c6660;cursor:pointer;font-family:'Poppins',sans-serif;font-size:10px;transition:all 0.18s;border-left:3px solid transparent}
        .nav-icon-btn:hover{color:#ff8da7;background:rgba(225,73,109,0.08)}
        .nav-icon-btn.active{color:#ff8da7;background:rgba(225,73,109,0.15);border-left-color:#e1496d;font-weight:700}
      `}</style>

      <input ref={fileInputRef} type="file" multiple accept="video/*,image/*,audio/*" style={{ display:"none" }} onChange={handleFileUpload} />

      {/* ── Top Header Navigation Bar (Responsive & Compact) ─────────── */}
      <div style={{ height:"48px", background:"#141117", borderBottom:"1px solid rgba(225,73,109,0.18)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", flexShrink:0, zIndex:20, overflow:"hidden", whiteSpace:"nowrap" }}>

        {/* Left: Exit + Project Title */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
          <button className="tool-btn danger" onClick={() => setShowLeaveModal(true)} style={{ padding:"4px 10px", gap:"5px", fontSize:"11.5px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
            Exit
          </button>

          <div style={{ height:"16px", width:"1px", background:"rgba(225,73,109,0.18)" }} />

          <input
            type="text"
            value={projectTitle}
            onChange={e => setProjectTitle(e.target.value)}
            style={{ background:"transparent", border:"none", borderBottom:"1px dashed rgba(225,73,109,0.3)", color:"#fff", fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"13px", outline:"none", padding:"1px 4px", width:"160px", overflow:"hidden", textOverflow:"ellipsis" }}
            title="Click to rename project"
          />

          <span style={{ fontSize:"9.5px", background:"rgba(34,197,94,0.12)", color:"#4ade80", border:"1px solid rgba(34,197,94,0.25)", padding:"2px 6px", borderRadius:"10px", fontWeight:600, display:"inline-flex", alignItems:"center", gap:"3px" }}>
            <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#4ade80" }} />
            Saved
          </span>
        </div>

        {/* Center: Aspect Ratio + History + Hotkeys */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
          {/* Aspect Ratio Selector */}
          <div style={{ display:"flex", alignItems:"center", gap:"5px", background:"rgba(225,73,109,0.06)", border:"1px solid rgba(225,73,109,0.18)", borderRadius:"6px", padding:"2px 8px" }}>
            <span style={{ fontSize:"10px", color:"#e1496d", fontWeight:700 }}>ASPECT</span>
            <select
              value={state.aspectRatio || "16:9"}
              onChange={e => dispatch({ type: "SET_ASPECT_RATIO", ratio: e.target.value })}
              style={{ background:"none", border:"none", color:"#fff", fontSize:"11px", fontFamily:"'Poppins', sans-serif", fontWeight:600, outline:"none", cursor:"pointer" }}
            >
              {ASPECT_RATIOS.slice(0, 5).map(ratio => (
                <option key={ratio.id} value={ratio.id} style={{ background:"#181318", color:"#fff" }}>
                  {ratio.icon} {ratio.id}
                </option>
              ))}
            </select>
          </div>

          {/* Undo / Redo */}
          <div style={{ display:"flex", background:"rgba(225,73,109,0.06)", borderRadius:"6px", border:"1px solid rgba(225,73,109,0.18)", padding:"1px" }}>
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!state.history?.length}
              title="Undo (Ctrl+Z)"
              style={{ background:"none", border:"none", color: state.history?.length ? "#ff8da7" : "#555", padding:"3px 7px", cursor: state.history?.length ? "pointer" : "not-allowed", fontSize:"12px", borderRadius:"4px" }}
            >↶</button>
            <button
              onClick={() => dispatch({ type: "REDO" })}
              disabled={!state.future?.length}
              title="Redo (Ctrl+Y)"
              style={{ background:"none", border:"none", color: state.future?.length ? "#ff8da7" : "#555", padding:"3px 7px", cursor: state.future?.length ? "pointer" : "not-allowed", fontSize:"12px", borderRadius:"4px" }}
            >↷</button>
          </div>

          <button className="tool-btn" onClick={() => setShowShortcutsModal(true)} title="Hotkeys (?)" style={{ padding:"4px 9px", fontSize:"11px", gap:"5px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M6 12h.001M10 12h.001M14 12h.001M18 12h.001M6 16h12"/></svg>
            Keys
          </button>
        </div>

        {/* Right: Import/Export JSON + Export Video */}
        <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
          <input ref={jsonInputRef} type="file" accept=".json" style={{ display: "none" }} onChange={importProjectJson} />
          <button className="tool-btn" onClick={() => jsonInputRef.current.click()} title="Import Project" style={{ padding: "4px 8px", fontSize: "11px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </button>
          <button className="tool-btn" onClick={exportProjectJson} title="Save Project" style={{ padding: "4px 8px", fontSize: "11px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </button>

          <div style={{ height:"16px", width:"1px", background:"rgba(225,73,109,0.18)" }} />

          <button className="tool-btn primary" onClick={performRealExport} style={{ padding:"6px 14px", gap:"6px", fontSize:"12px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* ── Main Workspace ────────────────────────────────────────────── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden", background:"#0e0d11" }}>

        {/* ── 1. Vertical Icon Strip (Always visible on far left, 52px wide) ── */}
        <div style={{ width:"52px", minWidth:"52px", background:"#141117", borderRight:"1px solid rgba(225,73,109,0.15)", display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 0", zIndex:10, flexShrink:0 }}>
          {tabsConfig.map(t => {
            const active = leftTab === t.id && drawerOpen;
            return (
              <button
                key={t.id}
                className={`nav-icon-btn${active ? " active" : ""}`}
                onClick={() => handleTabIconClick(t.id)}
                title={t.label}
              >
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>{t.icon}</span>
                <span style={{ fontSize:"9px", letterSpacing:"0.03em" }}>{t.label}</span>
              </button>
            );
          })}

          <div style={{ flex:1 }} />

          {/* Toggle drawer open/close button */}
          <button
            onClick={() => setDrawerOpen(prev => !prev)}
            style={{ width:"36px", height:"36px", borderRadius:"50%", background:"rgba(225,73,109,0.1)", border:"1px solid rgba(225,73,109,0.2)", color:"#ff8da7", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", transition:"all 0.18s" }}
            title={drawerOpen ? "Collapse Drawer (Close)" : "Expand Drawer (Open)"}
          >
            {drawerOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* ── 2. Collapsible Drawer Flyout Panel (260px wide) ──────────── */}
        {drawerOpen && (
          <div style={{ width:"260px", minWidth:"260px", background:"#161217", borderRight:"1px solid rgba(225,73,109,0.15)", display:"flex", flexDirection:"column", height:"100%", zIndex:9, flexShrink:0 }}>
            {/* Drawer Panel Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderBottom:"1px solid rgba(225,73,109,0.15)", background:"#181318" }}>
              <span style={{ fontSize:"11px", letterSpacing:"0.12em", color:"#e1496d", fontWeight:700, fontFamily:"'Poppins',sans-serif" }}>
                {tabsConfig.find(t => t.id === leftTab)?.label.toUpperCase()} LIBRARY
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background:"none", border:"none", color:"#8c8780", cursor:"pointer", fontSize:"14px", padding:"2px 6px" }}
                title="Close Drawer"
              >✕</button>
            </div>

            {/* Drawer Panel Content */}
            <div style={{ flex:1, overflowY:"auto", padding:"12px" }}>

              {/* ─ Media ─ */}
              {leftTab === "media" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <div style={{ display:"flex", gap:"6px" }}>
                    <button className="tool-btn" onClick={onAddVideo} style={{ flex:1, justifyContent:"center", fontSize:"11px", gap:"5px" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                      Video
                    </button>
                    <button className="tool-btn" onClick={onAddImage} style={{ flex:1, justifyContent:"center", fontSize:"11px", gap:"5px" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      Photo
                    </button>
                  </div>

                  <div style={{ fontSize:"10px", color:"#8c8780", fontWeight:600, letterSpacing:"0.05em" }}>CURATED STOCK MEDIA</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                    {STOCK_MEDIA.map(item => (
                      <div key={item.id} onClick={() => addStockMedia(item)}
                        style={{ background:"rgba(225,73,109,0.06)", border:"1px solid rgba(225,73,109,0.14)", borderRadius:"8px", padding:"8px", cursor:"pointer", transition:"all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#e1496d"; e.currentTarget.style.background="rgba(225,73,109,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(225,73,109,0.14)"; e.currentTarget.style.background="rgba(225,73,109,0.06)"; }}
                      >
                        <div style={{ fontSize:"22px", marginBottom:"4px" }}>{item.thumb}</div>
                        <div style={{ fontSize:"10.5px", fontWeight:600, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                        <div style={{ fontSize:"9px", color:"#8c8780", marginTop:"2px" }}>{item.type} · {item.duration}s</div>
                      </div>
                    ))}
                  </div>

                  <button className="tool-btn" onClick={() => fileInputRef.current.click()} style={{ justifyContent:"center", padding:"10px", fontSize:"11.5px", marginTop:"4px" }}>
                    + Upload Local Files
                  </button>
                </div>
              )}

              {/* ─ Text ─ */}
              {leftTab === "text" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <button className="tool-btn primary" onClick={() => addTextClip()} style={{ justifyContent:"center", padding:"10px", fontSize:"12px" }}>
                    + Add Custom Title
                  </button>
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                    {TEXT_PRESETS.map(preset => (
                      <button key={preset.id} onClick={() => addTextClip(preset)}
                        style={{ background:"rgba(225,73,109,0.06)", border:"1px solid rgba(225,73,109,0.14)", borderRadius:"8px", padding:"8px 12px", cursor:"pointer", transition:"all 0.15s", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#e1496d"; e.currentTarget.style.background="rgba(225,73,109,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(225,73,109,0.14)"; e.currentTarget.style.background="rgba(225,73,109,0.06)"; }}
                      >
                        <div>
                          <div style={{ fontSize:"11.5px", fontWeight:700, color:"#fff" }}>{preset.name}</div>
                          <div style={{ fontSize:"9.5px", color:"#8c8780" }}>{preset.tag} Preset</div>
                        </div>
                        <span style={{ fontSize:"13px", color:"#e1496d" }}>+</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─ Stickers ─ */}
              {leftTab === "stickers" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <span style={{ fontSize:"10px", color:"#e1496d", fontWeight:700 }}>EMOJIS & STICKERS</span>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"6px" }}>
                    {STICKERS.map(st => (
                      <button key={st.id} onClick={() => addStickerClip(st)}
                        style={{ background:"rgba(225,73,109,0.06)", border:"1px solid rgba(225,73,109,0.14)", borderRadius:"8px", padding:"8px 2px", fontSize:"22px", cursor:"pointer", transition:"all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.transform="scale(1.18)"; e.currentTarget.style.borderColor="#e1496d"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="rgba(225,73,109,0.14)"; }}
                        title={st.name}
                      >
                        {st.emoji}
                      </button>
                    ))}
                  </div>

                  <span style={{ fontSize:"10px", color:"#e1496d", fontWeight:700, marginTop:"6px" }}>GEOMETRIC SHAPES</span>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
                    {SHAPE_TYPES.map(shape => (
                      <button key={shape.id} onClick={() => addShapeClip(shape)}
                        style={{ background:"rgba(225,73,109,0.06)", border:"1px solid rgba(225,73,109,0.14)", borderRadius:"8px", padding:"8px", cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:"8px" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#e1496d"; e.currentTarget.style.background="rgba(225,73,109,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(225,73,109,0.14)"; e.currentTarget.style.background="rgba(225,73,109,0.06)"; }}
                      >
                        <span style={{ fontSize:"18px", color:"#e1496d" }}>{shape.icon}</span>
                        <span style={{ fontSize:"10.5px", fontWeight:600, color:"#fff" }}>{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─ Audio ─ */}
              {leftTab === "audio" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <span style={{ fontSize:"10px", color:"#e1496d", fontWeight:700 }}>BACKGROUND MUSIC</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                    {BG_MUSIC.map(bgm => (
                      <div key={bgm.id} onClick={() => addStockMedia(bgm)}
                        style={{ background:"rgba(225,73,109,0.06)", border:"1px solid rgba(225,73,109,0.14)", borderRadius:"8px", padding:"8px 10px", cursor:"pointer", transition:"all 0.15s", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#e1496d"; e.currentTarget.style.background="rgba(225,73,109,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(225,73,109,0.14)"; e.currentTarget.style.background="rgba(225,73,109,0.06)"; }}
                      >
                        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                          <span style={{ fontSize:"18px" }}>{bgm.thumb}</span>
                          <div>
                            <div style={{ fontSize:"11px", fontWeight:600, color:"#fff" }}>{bgm.name}</div>
                            <div style={{ fontSize:"9px", color:"#8c8780" }}>{bgm.mood}</div>
                          </div>
                        </div>
                        <span style={{ fontSize:"12px", color:"#e1496d", fontWeight:700 }}>+</span>
                      </div>
                    ))}
                  </div>

                  <span style={{ fontSize:"10px", color:"#e1496d", fontWeight:700, marginTop:"6px" }}>SOUND EFFECTS (SFX)</span>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
                    {SFX_LIBRARY.map(sfx => (
                      <button key={sfx.id} onClick={() => addStockMedia(sfx)}
                        style={{ background:"rgba(225,73,109,0.06)", border:"1px solid rgba(225,73,109,0.14)", borderRadius:"8px", padding:"8px", cursor:"pointer", transition:"all 0.15s", textAlign:"left" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#e1496d"; e.currentTarget.style.background="rgba(225,73,109,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(225,73,109,0.14)"; e.currentTarget.style.background="rgba(225,73,109,0.06)"; }}
                      >
                        <div style={{ fontSize:"16px" }}>{sfx.thumb}</div>
                        <div style={{ fontSize:"10px", fontWeight:600, color:"#fff" }}>{sfx.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─ LUTs ─ */}
              {leftTab === "presets" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <span style={{ fontSize:"10px", color:"#e1496d", fontWeight:700 }}>CINEMATIC COLOR PRESETS</span>
                  {[
                    { id:"vintage", name:"Vintage Amber", desc:"Warm golden film tone" },
                    { id:"cyber",   name:"Cyberpunk Neon", desc:"High sat neon cyan/magenta" },
                    { id:"noir",    name:"Moody Monochrome", desc:"Deep high-contrast B&W" },
                    { id:"cream",   name:"Sunkissed Glow", desc:"Soft warm pastel cream" },
                    { id:"hdr",     name:"HDR Vivid Pro", desc:"Punchy contrast & sharpness" },
                    { id:"warm",    name:"Warm Sunset", desc:"Sepia warm atmosphere" },
                    { id:"reset",   name:"Reset Colors", desc:"Restore default settings", danger:true },
                  ].map(lut => (
                    <button key={lut.id} onClick={() => applyPreset(lut.id)}
                      style={{ background: lut.danger ? "rgba(239,68,68,0.06)" : "rgba(225,73,109,0.06)", border: lut.danger ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(225,73,109,0.14)", borderRadius:"8px", padding:"8px 10px", cursor:"pointer", transition:"all 0.15s", textAlign:"left" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = lut.danger ? "#ef4444" : "#e1496d"; e.currentTarget.style.background = lut.danger ? "rgba(239,68,68,0.12)" : "rgba(225,73,109,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = lut.danger ? "rgba(239,68,68,0.2)" : "rgba(225,73,109,0.14)"; e.currentTarget.style.background = lut.danger ? "rgba(239,68,68,0.06)" : "rgba(225,73,109,0.06)"; }}
                    >
                      <div style={{ fontSize:"11.5px", fontWeight:700, color: lut.danger ? "#ef4444" : "#fff" }}>{lut.name}</div>
                      <div style={{ fontSize:"9.5px", color:"#8c8780" }}>{lut.desc}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* ─ Transitions ─ */}
              {leftTab === "transitions" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <span style={{ fontSize:"10px", color:"#e1496d", fontWeight:700 }}>SCENE TRANSITIONS</span>
                  <p style={{ fontSize:"10.5px", color:"#8c8780", marginBottom:"4px" }}>Select a timeline clip to apply:</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
                    {TRANSITIONS.slice(0, 10).map(trans => (
                      <button key={trans.id}
                        onClick={() => {
                          if (state.selectedClip) {
                            dispatch({ type: "ADD_TRANSITION", clipId: state.selectedClip, transition: trans.id, edge: "in", duration: trans.duration || 0.5 });
                          } else {
                            alert("Select a clip on timeline first!");
                          }
                        }}
                        style={{ background:"rgba(225,73,109,0.06)", border:"1px solid rgba(225,73,109,0.14)", borderRadius:"8px", padding:"8px", cursor:"pointer", transition:"all 0.15s", textAlign:"center" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#e1496d"; e.currentTarget.style.background="rgba(225,73,109,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(225,73,109,0.14)"; e.currentTarget.style.background="rgba(225,73,109,0.06)"; }}
                      >
                        <div style={{ fontSize:"16px", color:"#e1496d" }}>{trans.icon}</div>
                        <div style={{ fontSize:"10px", fontWeight:600, color:"#fff" }}>{trans.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─ Inspector / Properties ─ */}
              {leftTab === "properties" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <span style={{ fontSize:"10px", color:"#e1496d", fontWeight:700 }}>GLOBAL COLOR GRADE</span>
                  {[
                    { key:"brightness", label:"Brightness", min:0, max:200, def:100 },
                    { key:"contrast",   label:"Contrast",   min:0, max:300, def:100 },
                    { key:"saturation", label:"Saturation", min:0, max:300, def:100 },
                    { key:"hue",        label:"Hue Shift",  min:-180, max:180, def:0 },
                    { key:"sepia",      label:"Sepia",      min:0, max:100, def:0 },
                    { key:"vignette",   label:"Vignette",   min:0, max:100, def:0 },
                  ].map(({ key, label, min, max, def }) => (
                    <div key={key}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px", fontSize:"10.5px", color:"#8c8780" }}>
                        <span>{label}</span>
                        <span style={{ color: state[key]!==def ? "#e1496d" : "#5c5650", fontVariantNumeric:"tabular-nums", fontWeight:600 }}>{Math.round(state[key])}</span>
                      </div>
                      <input type="range" min={min} max={max} step="1" value={state[key]} className="filter-slider" onChange={e => dispatch({ type:"SET_FILTER", key, value:parseFloat(e.target.value) })} />
                    </div>
                  ))}
                  <button className="tool-btn" style={{ justifyContent:"center", fontSize:"10.5px", color:"#e1496d", marginTop:"2px" }} onClick={onResetFilters}>↺ Reset Color Grade</button>

                  {selectedClipData && (
                    <div style={{ marginTop:"8px", paddingTop:"10px", borderTop:"1px solid rgba(225,73,109,0.15)" }}>
                      <div style={{ fontSize:"10px", color:"#e1496d", fontWeight:700, marginBottom:"6px" }}>SELECTED CLIP</div>
                      <div style={{ fontSize:"12px", color:"#fff", fontWeight:700, marginBottom:"8px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selectedClipData.name}</div>

                      {selectedClipData.type === "text" && (
                        <div style={{ display:"flex", flexDirection:"column", gap:"8px", background:"rgba(225,73,109,0.06)", padding:"10px", borderRadius:"8px", border:"1px solid rgba(225,73,109,0.15)" }}>
                          <div style={{ fontSize:"9.5px", color:"#e1496d", fontWeight:700 }}>TEXT CONTENT</div>
                          <textarea
                            value={selectedClipData.text || ""}
                            onChange={e => dispatch({ type:"UPDATE_CLIP_TEXT", clipId:selectedClipData.id, text:e.target.value })}
                            style={{ width:"100%", height:"50px", background:"#120e12", border:"1px solid rgba(225,73,109,0.25)", borderRadius:"6px", color:"#fff", fontSize:"11.5px", padding:"6px", outline:"none", fontFamily:"inherit", resize:"none" }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Center Area: Preview + Resizer + Timeline ────────────────── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#0e0d11" }}>

          {/* Video Preview Box Container (Flex 1 to fill available top height) */}
          <div style={{ flex:1, position:"relative", background:"#080609", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", padding:"12px" }}>

            {/* Canvas Container with Dynamic Aspect Ratio */}
            <div
              ref={canvasPreviewRef}
              style={{
                position:"relative",
                aspectRatio: activeRatioObj.id.replace(":", "/"),
                height:"100%",
                maxHeight:"100%",
                maxWidth:"100%",
                background:"#141015",
                borderRadius:"10px",
                overflow:"hidden",
                border:"1px solid rgba(225,73,109,0.2)",
                boxShadow:"0 14px 40px rgba(0,0,0,0.8)",
                display:"flex",
                alignItems:"center",
                justifyContent:"center"
              }}
            >
              {/* Media element (Video or Image) */}
              {activeClip ? (
                activeClip.videoEl || activeClip.type === "video" ? (
                  <video ref={videoRef} style={{ width:"100%", height:"100%", objectFit:"contain", filter:cssFilter }} playsInline />
                ) : (
                  <img src={activeClip.url} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", filter:cssFilter }} />
                )
              ) : (
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                  <div style={{ width:"50px", height:"50px", borderRadius:"50%", border:"1px dashed rgba(225,73,109,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>
                    🎬
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"13px", color:"rgba(225,73,109,0.7)", fontWeight:600 }}>Timeline Ready</div>
                    <div style={{ fontSize:"10.5px", color:"#5c5650" }}>Add media from sidebar to preview</div>
                  </div>
                </div>
              )}

              {/* Canvas Interactive Text Elements */}
              {state.tracks.filter(t => t.type === "text").map(track =>
                track.clips.filter(c => c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                  const isSelected = state.selectedClip === clip.id;
                  return (
                    <div
                      key={clip.id}
                      className={`canvas-element${isSelected ? " selected-canvas" : ""}`}
                      onMouseDown={(e) => handleCanvasElementMouseDown(e, clip)}
                      style={{
                        position: "absolute",
                        left: `${clip.x ?? 50}%`,
                        top: `${clip.y ?? 80}%`,
                        transform: "translate(-50%, -50%)",
                        background: clip.bgColor || "rgba(18, 14, 18, 0.85)",
                        color: clip.color || "#ffffff",
                        padding: "6px 16px",
                        borderRadius: "8px",
                        fontSize: `${clip.fontSize || 32}px`,
                        fontFamily: clip.fontFamily || "'Syne', sans-serif",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        border: `1.5px solid ${clip.borderColor || "#e1496d"}`,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                        zIndex: isSelected ? 30 : 20,
                      }}
                    >
                      {clip.text}
                    </div>
                  );
                })
              )}

              {/* Canvas Emoji & Sticker Elements */}
              {state.tracks.filter(t => t.type === "sticker").map(track =>
                track.clips.filter(c => c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                  const isSelected = state.selectedClip === clip.id;
                  return (
                    <div
                      key={clip.id}
                      className={`canvas-element${isSelected ? " selected-canvas" : ""}`}
                      onMouseDown={(e) => handleCanvasElementMouseDown(e, clip)}
                      style={{
                        position: "absolute",
                        left: `${clip.x ?? 50}%`,
                        top: `${clip.y ?? 50}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: "56px",
                        zIndex: isSelected ? 30 : 20,
                        lineHeight: 1,
                      }}
                    >
                      {clip.emoji}
                    </div>
                  );
                })
              )}

              {/* Canvas Shape Elements */}
              {state.tracks.filter(t => t.type === "shape").map(track =>
                track.clips.filter(c => c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                  const isSelected = state.selectedClip === clip.id;
                  return (
                    <div
                      key={clip.id}
                      className={`canvas-element${isSelected ? " selected-canvas" : ""}`}
                      onMouseDown={(e) => handleCanvasElementMouseDown(e, clip)}
                      style={{
                        position: "absolute",
                        left: `${clip.x ?? 50}%`,
                        top: `${clip.y ?? 50}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: "48px",
                        color: clip.fill || "#e1496d",
                        zIndex: isSelected ? 30 : 20,
                      }}
                    >
                      {clip.shapeIcon || "◆"}
                    </div>
                  );
                })
              )}

              {/* Timecode overlay */}
              <div style={{ position:"absolute", bottom:"10px", left:"12px", background:"rgba(18,14,18,0.85)", color:"#ff8da7", fontSize:"11px", padding:"3px 10px", borderRadius:"5px", fontVariantNumeric:"tabular-nums", fontWeight:700, border:"1px solid rgba(225,73,109,0.25)", backdropFilter:"blur(6px)", fontFamily:"'Poppins',sans-serif" }}>
                {fmtTime(state.playhead)} / {fmtTime(state.duration)}
              </div>

              {/* Resolution badge */}
              <div style={{ position:"absolute", bottom:"10px", right:"12px", background:"rgba(18,14,18,0.85)", color:"#8c8780", fontSize:"9.5px", padding:"3px 8px", borderRadius:"5px", border:"1px solid rgba(225,73,109,0.12)", fontWeight:600 }}>
                {activeRatioObj.id} · {activeRatioObj.w}×{activeRatioObj.h}
              </div>

              {/* Vignette effect overlay */}
              {state.vignette > 0 && (
                <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at center, transparent ${100-state.vignette}%, rgba(0,0,0,${state.vignette/100}) 100%)`, pointerEvents:"none" }} />
              )}
            </div>

            {/* Floating Transport Controls (Right side of canvas) */}
            <div style={{ position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", padding:"8px 5px", borderRadius:"20px", zIndex:10, background:"rgba(18,14,18,0.88)", border:"1px solid rgba(225,73,109,0.2)" }}>
              {[
                { fn:() => dispatch({type:"SET_PLAYHEAD",time:0}),                                                     icon:<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>,         title:"Start" },
                { fn:() => dispatch({type:"SET_PLAYHEAD",time:Math.max(0,state.playhead-5)}),                          icon:<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6zm.5-6 8.5 6V6z"/></svg>,         title:"Back 5s" },
                { fn:onFrameBackward,                                                                                   icon:<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>, title:"Frame Back" },
                { fn:onTogglePlay, primary:true,                                                                        icon: state.isPlaying ? <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:"1px"}}><path d="M8 5v14l11-7z"/></svg>, title:"Play / Pause" },
                { fn:onFrameForward,                                                                                    icon:<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>, title:"Frame Forward" },
                { fn:() => dispatch({type:"SET_PLAYHEAD",time:Math.min(state.duration,state.playhead+5)}),             icon:<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6zm9-6 8.5 6V6z"/></svg>,         title:"Forward 5s" },
                { fn:() => { dispatch({type:"SET_PLAYING",value:false}); dispatch({type:"SET_PLAYHEAD",time:state.duration}); }, icon:<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6zm9-12v12h2V6z"/></svg>, title:"End" },
              ].map((btn, i) => (
                <button key={i} onClick={btn.fn} title={btn.title} style={{ width: btn.primary ? "28px" : "24px", height: btn.primary ? "28px" : "24px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", padding:0, border:"none", background: btn.primary ? "linear-gradient(135deg,#a82348,#e1496d)" : "transparent", color: btn.primary ? "#fff" : "#8c8780", cursor:"pointer", transition:"all 0.15s" }}
                  onMouseEnter={e => { if (!btn.primary) e.currentTarget.style.color="#ff8da7"; }}
                  onMouseLeave={e => { if (!btn.primary) e.currentTarget.style.color="#8c8780"; }}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>

          {/* ── Editing Toolbar Strip ─────────────────────────────────── */}
          <div style={{ height:"40px", display:"flex", alignItems:"center", background:"#141117", borderTop:"1px solid rgba(225,73,109,0.15)", borderBottom:"1px solid rgba(225,73,109,0.15)", flexShrink:0, padding:"0 12px", overflow:"hidden" }}>
            
            {/* Tool selector */}
            <div style={{ display:"flex", gap:"3px", paddingRight:"8px", marginRight:"8px", borderRight:"1px solid rgba(225,73,109,0.15)" }}>
              {tools.map(t => (
                <button key={t.id} className={`tool-btn${activeTool===t.id?" active":""}`} onClick={() => setActiveTool(t.id)} title={t.label} style={{ padding:"4px 9px", fontSize:"11px", gap:"5px" }}>
                  {t.icon} {t.label.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Edit action buttons */}
            <div style={{ display:"flex", gap:"4px", paddingRight:"8px", borderRight:"1px solid rgba(225,73,109,0.15)", marginRight:"8px" }}>
              {editActions.map(a => (
                <button key={a.label} className={`tool-btn${a.danger?" danger":""}`} onClick={a.action} disabled={a.disabled} title={a.label} style={{ padding:"4px 9px", fontSize:"11px", gap:"4px" }}>
                  <span>{a.icon}</span> <span>{a.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Zoom Controls */}
            <div style={{ display:"flex", alignItems:"center", gap:"6px", paddingRight:"8px", borderRight:"1px solid rgba(225,73,109,0.15)", marginRight:"8px" }}>
              <span style={{ fontSize:"9.5px", color:"#8c8780", fontWeight:600 }}>ZOOM</span>
              <button className="tool-btn" onClick={() => dispatch({ type:"SET_ZOOM", value:Math.max(0.25, state.zoom - 0.25) })} style={{ padding:"2px 6px", fontSize:"11px" }}>−</button>
              <span style={{ fontSize:"10.5px", color:"#ff8da7", fontWeight:700, minWidth:"36px", textAlign:"center", fontVariantNumeric:"tabular-nums" }}>{Math.round(state.zoom*100)}%</span>
              <button className="tool-btn" onClick={() => dispatch({ type:"SET_ZOOM", value:Math.min(4, state.zoom + 0.25) })} style={{ padding:"2px 6px", fontSize:"11px" }}>+</button>
            </div>

            {/* Add Track */}
            <button className="tool-btn" onClick={onAddTrack} style={{ padding:"4px 10px", fontSize:"11px", gap:"5px" }}>
              ＋ Track
            </button>

            <div style={{ flex: 1 }} />

            {/* Hotkey hints */}
            <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
              {[["Space","Play"], ["S","Split"], ["Del","Delete"]].map(([key, label]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"10px", color:"#5c5650" }}>
                  <span style={{ background:"rgba(225,73,109,0.12)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"3px", padding:"1px 4px", fontFamily:"monospace", color:"#ff8da7", fontWeight:700 }}>{key}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. Mouse-Resizable Height Divider Handle ───────────────── */}
          <div
            onMouseDown={handleTimelineResizeMouseDown}
            style={{
              height: "6px",
              background: "rgba(225, 73, 109, 0.15)",
              borderTop: "1px solid rgba(225, 73, 109, 0.25)",
              borderBottom: "1px solid rgba(225, 73, 109, 0.25)",
              cursor: "row-resize",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              zIndex: 18,
              transition: "background 0.15s",
            }}
            title="Drag up or down to adjust timeline height"
            onMouseEnter={e => e.currentTarget.style.background = "rgba(225, 73, 109, 0.4)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(225, 73, 109, 0.15)"}
          >
            <div style={{ width: "36px", height: "2px", borderRadius: "1px", background: "#ff8da7" }} />
          </div>

          {/* ── Timeline Container (Mouse Resizable Height) ─────────────── */}
          <div style={{ height:`${timelineHeight}px`, display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
            <Timeline state={state} dispatch={dispatch} timelineRef={timelineRef} onTimelineClick={handleTimelineClick} onClipMouseDown={handleClipMouseDown} onResizeMouseDown={handleResizeMouseDown} onAddTrack={onAddTrack} />
          </div>
        </div>
      </div>

      <ExportModal show={showExport} progress={state.exportProgress} downloadUrl={exportUrl} fileName={`${projectTitle.replace(/\s+/g, "_")}.webm`} onClose={() => { setShowExport(false); dispatch({ type:"SET_EXPORT_PROGRESS", value:null }); }} />

      <ShortcutsModal show={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />

      {/* Leave Modal */}
      {showLeaveModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(10px)" }}>
          <div style={{ width:"400px", padding:"28px", borderRadius:"20px", textAlign:"center", border:"1px solid rgba(225,73,109,0.3)", background:"#161217", boxShadow:"0 20px 50px rgba(0,0,0,0.8)", color:"#fff" }}>
            <div style={{ fontSize:"38px", marginBottom:"12px" }}>💾</div>
            <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:"20px", fontWeight:800, color:"#fff", marginBottom:"8px" }}>Save project changes?</h3>
            <p style={{ fontSize:"12.5px", color:"#8c8780", lineHeight:1.5, marginBottom:"20px" }}>
              Save your current video edits or exit without saving.
            </p>

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ fontSize: "10.5px", color: "#e1496d", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Project Name</label>
              <input
                type="text"
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
                style={{ width: "100%", background: "#120e12", border: "1px solid rgba(225,73,109,0.25)", borderRadius: "8px", color: "#fff", padding: "8px 12px", fontSize: "12.5px", outline: "none" }}
              />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              <button className="tool-btn primary" onClick={handleSaveAndExit} style={{ justifyContent:"center", padding:"11px", fontSize:"13px" }}>
                Save & Exit to Dashboard
              </button>
              <div style={{ display:"flex", gap:"8px" }}>
                <button className="tool-btn danger" onClick={handleDiscardAndExit} style={{ flex:1, justifyContent:"center", padding:"9px", fontSize:"12px" }}>
                  Discard Edits
                </button>
                <button className="tool-btn" onClick={() => setShowLeaveModal(false)} style={{ flex:1, justifyContent:"center", padding:"9px", fontSize:"12px" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
