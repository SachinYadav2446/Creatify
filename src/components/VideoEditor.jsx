import { useState, useRef, useEffect, useCallback } from "react";
import { useEditorState } from "../hooks/useEditorState";
import {
  uid, fmtTime, ASPECT_RATIOS, EFFECT_PRESETS, TEXT_PRESETS,
  FONT_FAMILIES, SHAPE_TYPES, STICKERS, BG_MUSIC, STOCK_MEDIA,
  TRANSITIONS, ANIMATIONS, DEV_TEMPLATES, DEV_CODE_PRESETS,
  DEV_TERMINAL_PRESETS, DEV_BADGES, DEV_SFX, CANVAS_PATTERNS
} from "../constants";
import Timeline from "./Timeline";
import ExportModal from "./ExportModal";
import ShortcutsModal from "./ShortcutsModal";
import {
  Play, Pause, SkipBack, SkipForward, FastForward, Rewind,
  Scissors, Copy, Trash2, Plus, Upload, Download, Code,
  Terminal, Monitor, Smartphone, Video, Image as ImageIcon,
  Music, Volume2, VolumeX, Sparkles, Layers, Sliders, Type,
  MousePointer, ShieldCheck, ChevronRight, ChevronLeft, Check,
  RefreshCw, ZoomIn, ZoomOut, Maximize2, Camera, Mic, Eye,
  EyeOff, Lock, Unlock, Sun, Moon, Laptop, Globe, GitBranch,
  GitCommit, GitMerge, Cpu, Box, Tag, Info, AlertCircle,
  ArrowUpRight, Film, Disc, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Undo2, Redo2, Keyboard, PlaySquare, Radio
} from "lucide-react";

export default function VideoEditor({ onBack, user, initialProject }) {
  const [state, dispatch] = useEditorState();
  const [showExport, setShowExport]                 = useState(false);
  const [exportUrl, setExportUrl]                   = useState(null);
  const [exportProgress, setExportProgress]         = useState(0);
  
  // Sidebar drawer state
  const [drawerOpen, setDrawerOpen]                 = useState(true);
  const [leftTab, setLeftTab]                       = useState("code");
  
  const [activeTool, setActiveTool]                 = useState("select");
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal]         = useState(false);
  const [canvasBgPattern, setCanvasBgPattern]       = useState("dot_grid");
  const [isRecordingScreen, setIsRecordingScreen]   = useState(false);
  const [recordTime, setRecordTime]                 = useState(0);

  const [projectTitle, setProjectTitle]             = useState(() => {
    return initialProject ? initialProject.title : "SaaS Product Showcase";
  });

  const timelineRef        = useRef(null);
  const playIntervalRef    = useRef(null);
  const fileInputRef       = useRef(null);
  const jsonInputRef       = useRef(null);
  const fileInputTypeRef   = useRef("video");
  const videoRef           = useRef(null);
  const canvasPreviewRef   = useRef(null);
  const screenRecorderRef  = useRef(null);
  const screenStreamRef    = useRef(null);
  const recordIntervalRef  = useRef(null);

  // Initialize sample project tracks if brand new project
  useEffect(() => {
    if (initialProject && initialProject.data) {
      dispatch({ type: "LOAD_PROJECT", projectState: initialProject.data });
      if (initialProject.title) setProjectTitle(initialProject.title);
    } else if (state.tracks.length === 0) {
      const codeTrack = { id: uid(), type: "code", name: "Code & Terminal", clips: [] };
      const vTrack    = { id: uid(), type: "video", name: "Mockup / Screen", clips: [] };
      const badgeTrack= { id: uid(), type: "badge", name: "Dev Badges & Titles", clips: [] };
      const aTrack    = { id: uid(), type: "audio", name: "Audio & SFX", clips: [] };

      dispatch({ type: "ADD_TRACK", track: codeTrack });
      dispatch({ type: "ADD_TRACK", track: vTrack });
      dispatch({ type: "ADD_TRACK", track: badgeTrack });
      dispatch({ type: "ADD_TRACK", track: aTrack });

      // Starter code clip
      dispatch({
        type: "ADD_CLIP",
        trackId: codeTrack.id,
        clip: {
          id: uid(),
          name: "React 19 Component",
          type: "code",
          start: 0,
          duration: 7,
          filename: "ProductHero.tsx",
          lang: "tsx",
          code: DEV_CODE_PRESETS[0].code,
          theme: "light",
          fontSize: 13,
          x: 50,
          y: 46,
          scale: 100,
          animateTyping: true
        }
      });

      // Starter Badge
      dispatch({
        type: "ADD_CLIP",
        trackId: badgeTrack.id,
        clip: {
          id: uid(),
          name: "React 19 Tag",
          type: "badge",
          start: 1,
          duration: 6,
          badgeId: "b_react",
          icon: "⚛️",
          text: "React 19 & Next.js 15 Ready",
          bg: "#e0f2fe",
          border: "#38bdf8",
          textColor: "#0369a1",
          x: 50,
          y: 84,
        }
      });

      // Starter Terminal Clip
      dispatch({
        type: "ADD_CLIP",
        trackId: codeTrack.id,
        clip: {
          id: uid(),
          name: "NPM Install Command",
          type: "terminal",
          start: 7.5,
          duration: 7,
          title: "zsh — terminal",
          prompt: "alex@macbook:~/creatify$",
          command: "npx create-creatify-app@latest my-saas",
          output: DEV_TERMINAL_PRESETS[0].output,
          x: 50,
          y: 50,
          scale: 100,
          animateTyping: true
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
      title: projectTitle.trim() || "Untitled Product Video",
      category: "Video Edit",
      tool: "Video Editor",
      year: new Date().getFullYear().toString(),
      accent: "#4f46e5",
      gradient: "linear-gradient(135deg, #e0e7ff 0%, #fae8ff 100%)",
      icon: "🎬",
      tags: [state.aspectRatio || "16:9", `${state.tracks.reduce((acc, t) => acc + t.clips.length, 0)} Clips`],
      desc: `Product video with ${state.tracks.length} developer tracks.`,
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
        vignette: state.vignette,
        canvasBgPattern
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
    const nd = Math.max(30, maxEnd + 5);
    if (Math.abs(nd - state.duration) > 0.5) dispatch({ type: "SET_DURATION", value: nd });
  }, [state.tracks, state.duration, dispatch]);

  // Playback loop for code, terminal, text and non-video clips
  useEffect(() => {
    const hasVideo = state.tracks.some(t => t.clips.some(c => c.type === "video" && c.start <= state.playhead && c.start + c.duration > state.playhead));
    if (state.isPlaying && !hasVideo) {
      playIntervalRef.current = setInterval(() => {
        dispatch({ type: "SET_PLAYHEAD", time: state.playhead + 0.033 * (state.playbackSpeed || 1) });
        if (state.playhead >= state.duration) { dispatch({ type: "SET_PLAYING", value: false }); dispatch({ type: "SET_PLAYHEAD", time: 0 }); }
      }, 33);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [state.isPlaying, state.playhead, state.duration, dispatch, state.tracks, state.playbackSpeed]);

  // Audio Engine
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

  // Screen Recorder Feature
  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: true
      });

      screenStreamRef.current = stream;
      const chunks = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        const vid = document.createElement("video");
        vid.src = videoUrl;
        vid.onloadedmetadata = () => {
          let vTrack = state.tracks.find(t => t.type === "video");
          if (!vTrack) {
            vTrack = { id: uid(), type: "video", name: "Screen Recording", clips: [] };
            dispatch({ type: "ADD_TRACK", track: vTrack });
          }
          const maxStart = vTrack.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
          dispatch({
            type: "ADD_CLIP",
            trackId: vTrack.id,
            clip: {
              id: uid(),
              name: `Screen Recording (${Math.round(vid.duration || 5)}s)`,
              type: "video",
              start: maxStart,
              duration: vid.duration || 5,
              url: videoUrl,
              videoEl: vid
            }
          });
        };
        clearInterval(recordIntervalRef.current);
        setIsRecordingScreen(false);
        setRecordTime(0);
      };

      mediaRecorder.start();
      screenRecorderRef.current = mediaRecorder;
      setIsRecordingScreen(true);
      setRecordTime(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordTime(t => t + 1);
      }, 1000);

      stream.getVideoTracks()[0].onended = () => {
        stopScreenRecording();
      };
    } catch (err) {
      console.warn("Screen recording was cancelled or not supported:", err.message);
    }
  };

  const stopScreenRecording = () => {
    if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
      screenRecorderRef.current.stop();
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsRecordingScreen(false);
    clearInterval(recordIntervalRef.current);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        dispatch({ type: "SET_PLAYING", value: !state.isPlaying });
      } else if (e.code === "KeyS" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onSplitClip();
      } else if (e.code === "KeyV") {
        setActiveTool("select");
      } else if (e.code === "KeyC" && !e.ctrlKey) {
        setActiveTool("cut");
      } else if (e.code === "KeyT") {
        setActiveTool("trim");
      } else if (e.code === "Delete" || e.code === "Backspace") {
        e.preventDefault();
        onDeleteClip();
      } else if ((e.ctrlKey || e.metaKey) && e.code === "KeyZ") {
        e.preventDefault();
        if (e.shiftKey) dispatch({ type: "REDO" });
        else dispatch({ type: "UNDO" });
      } else if ((e.ctrlKey || e.metaKey) && e.code === "KeyY") {
        e.preventDefault();
        dispatch({ type: "REDO" });
      } else if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
        e.preventDefault();
        handleSaveAndExit();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        const delta = e.shiftKey ? 1/30 : 5;
        dispatch({ type: "SET_PLAYHEAD", time: Math.max(0, state.playhead - delta) });
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        const delta = e.shiftKey ? 1/30 : 5;
        dispatch({ type: "SET_PLAYHEAD", time: Math.min(state.duration, state.playhead + delta) });
      } else if (e.code === "Home") {
        e.preventDefault();
        dispatch({ type: "SET_PLAYHEAD", time: 0 });
      } else if (e.code === "End") {
        e.preventDefault();
        dispatch({ type: "SET_PLAYHEAD", time: state.duration });
      } else if (e.code === "KeyI") {
        dispatch({ type: "SET_IN_POINT", value: state.playhead });
      } else if (e.code === "KeyO") {
        dispatch({ type: "SET_OUT_POINT", value: state.playhead });
      } else if (e.code === "KeyM") {
        dispatch({ type: "ADD_MARKER", time: state.playhead, label: "", color: "#4f46e5" });
      } else if (e.code === "Slash" && e.shiftKey) {
        setShowShortcutsModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const PX_PER_SEC = 80 * state.zoom;

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const sc = timelineRef.current.closest(".timeline-scroll-container");
    const x = e.clientX - rect.left + (sc ? sc.scrollLeft : 0);
    if (x < 0) return;
    dispatch({ type: "SET_PLAYHEAD", time: x / PX_PER_SEC });
  };

  const handleClipMouseDown = (e, trackId, clip, locked) => {
    if (locked) return;
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

  const handleResizeMouseDown = (e, trackId, clip, side, locked) => {
    if (locked) return;
    e.stopPropagation();
    const startX = e.clientX;
    const startDur = clip.duration;
    const startPos = clip.start;

    if (side === "left") {
      const onMove = me => {
        const delta = (me.clientX - startX) / PX_PER_SEC;
        const newDur = Math.max(0.2, startDur - delta);
        const newStart = Math.max(0, startPos + delta);
        dispatch({ type: "TRIM_CLIP", trackId, clipId: clip.id, newStart, newDuration: newDur });
      };
      const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
      window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    } else {
      const onMove = me => dispatch({ type: "RESIZE_CLIP", trackId, clipId: clip.id, duration: startDur + (me.clientX - startX) / PX_PER_SEC });
      const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
      window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    }
  };

  // Canvas element direct dragging
  const handleCanvasElementMouseDown = (e, clip) => {
    e.stopPropagation();
    dispatch({ type: "SELECT_CLIP", clipId: clip.id });
    const previewContainer = canvasPreviewRef.current;
    if (!previewContainer) return;
    const rect = previewContainer.getBoundingClientRect();

    const onMove = (me) => {
      const newX = Math.max(5, Math.min(95, ((me.clientX - rect.left) / rect.width) * 100));
      const newY = Math.max(5, Math.min(95, ((me.clientY - rect.top) / rect.height) * 100));
      dispatch({
        type: "UPDATE_CLIP",
        clipId: clip.id,
        patch: { x: Math.round(newX), y: Math.round(newY) }
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Helper actions
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
  const onFrameForward = () => dispatch({ type: "SET_PLAYHEAD", time: Math.min(state.duration, state.playhead + 1 / 30) });
  const onFrameBackward = () => dispatch({ type: "SET_PLAYHEAD", time: Math.max(0, state.playhead - 1 / 30) });

  // Add Clip Generators
  const addCodeClip = (preset = DEV_CODE_PRESETS[0]) => {
    let track = state.tracks.find(t => t.type === "code");
    if (!track) {
      track = { id: uid(), type: "code", name: "Code Snippets", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: preset.name,
        type: "code",
        start: maxStart,
        duration: 6,
        filename: preset.filename,
        lang: preset.lang,
        code: preset.code,
        theme: "light",
        fontSize: 13,
        x: 50,
        y: 48,
        scale: 100,
        animateTyping: true
      }
    });
  };

  const addTerminalClip = (preset = DEV_TERMINAL_PRESETS[0]) => {
    let track = state.tracks.find(t => t.type === "code" || t.type === "terminal");
    if (!track) {
      track = { id: uid(), type: "code", name: "Terminal / CLI", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: preset.name,
        type: "terminal",
        start: maxStart,
        duration: 6,
        title: preset.title,
        prompt: preset.prompt,
        command: preset.command,
        output: preset.output,
        x: 50,
        y: 50,
        scale: 100,
        animateTyping: true
      }
    });
  };

  const addMockupClip = (type = "browser") => {
    let track = state.tracks.find(t => t.type === "video" || t.type === "mockup");
    if (!track) {
      track = { id: uid(), type: "video", name: "Product Mockups", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: type === "browser" ? "Safari Browser Frame" : "Mobile App Frame",
        type: "mockup",
        mockupType: type,
        start: maxStart,
        duration: 8,
        urlBar: "https://your-startup.dev/dashboard",
        title: "Your Product App",
        x: 50,
        y: 50,
        scale: 100,
      }
    });
  };

  const addBadgeClip = (badge = DEV_BADGES[0]) => {
    let track = state.tracks.find(t => t.type === "badge" || t.type === "text");
    if (!track) {
      track = { id: uid(), type: "badge", name: "Dev Badges", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: badge.name,
        type: "badge",
        start: maxStart,
        duration: 5,
        icon: badge.icon,
        text: badge.name,
        bg: badge.bg,
        border: badge.border,
        textColor: badge.text,
        x: 50,
        y: 82,
      }
    });
  };

  const addCursorClip = () => {
    let track = state.tracks.find(t => t.type === "badge" || t.type === "text");
    if (!track) {
      track = { id: uid(), type: "badge", name: "Spotlight & Cursor", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: "Interactive Mouse Cursor",
        type: "cursor",
        start: maxStart,
        duration: 5,
        x: 52,
        y: 48,
        action: "click",
        label: "Click Button"
      }
    });
  };

  const addTextClip = (preset) => {
    let track = state.tracks.find(t => t.type === "text");
    if (!track) {
      track = { id: uid(), type: "text", name: "Headlines & Text", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: preset ? preset.name : "Title Text",
        text: preset ? preset.name : "Blazing Fast Developer Platform",
        start: maxStart,
        duration: 5,
        type: "text",
        x: 50,
        y: 20,
        fontSize: preset?.fontSize ? Math.min(preset.fontSize, 40) : 32,
        fontFamily: "'Poppins', sans-serif",
        color: "#0f172a",
        bgColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#cbd5e1",
        animation: "fadeIn",
      }
    });
  };

  const addAudioClip = (sfx) => {
    let track = state.tracks.find(t => t.type === "audio");
    if (!track) {
      track = { id: uid(), type: "audio", name: "Audio Track", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    dispatch({
      type: "ADD_CLIP",
      trackId: track.id,
      clip: {
        id: uid(),
        name: sfx.name,
        type: "audio",
        start: maxStart,
        duration: sfx.duration || 2,
        url: sfx.url,
        volume: 0.9
      }
    });
  };

  const addMediaItem = (item) => {
    let targetType = item.type === "video" ? "video" : item.type === "image" ? "image" : "audio";
    let track = state.tracks.find(t => t.type === targetType);
    if (!track) {
      track = { id: uid(), type: targetType, name: targetType === "video" ? "Video Layer" : targetType === "image" ? "Images" : "Background Music", clips: [] };
      dispatch({ type: "ADD_TRACK", track });
    }
    const maxStart = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    const clipId = uid();

    if (item.type === "image") {
      const img = new Image();
      img.onload = () => dispatch({ type: "ADD_CLIP", trackId: track.id, clip: { id: clipId, name: item.name, start: maxStart, duration: item.duration || 5, url: item.url, imageEl: img, type: "image" } });
      img.src = item.url;
    } else if (item.type === "video") {
      const v = document.createElement("video");
      v.src = item.url; v.playsInline = true; v.crossOrigin = "anonymous";
      v.onloadedmetadata = () => dispatch({ type: "ADD_CLIP", trackId: track.id, clip: { id: clipId, name: item.name, start: maxStart, duration: v.duration || item.duration || 10, url: item.url, videoEl: v, type: "video" } });
    } else {
      dispatch({ type: "ADD_CLIP", trackId: track.id, clip: { id: clipId, name: item.name, start: maxStart, duration: item.duration || 30, url: item.url, type: "audio", volume: 0.8 } });
    }
  };

  const handleFileUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const url = URL.createObjectURL(file);
      const clipId = uid();
      if (file.type.startsWith("image/")) {
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

  // Load Template
  const applyTemplate = (template) => {
    dispatch({ type: "DESELECT_ALL" });
    const codeTrack = { id: uid(), type: "code", name: "Code & Terminal", clips: [] };
    const mockupTrack = { id: uid(), type: "video", name: "Mockup / UI", clips: [] };
    const badgeTrack = { id: uid(), type: "badge", name: "Dev Badges", clips: [] };
    const audioTrack = { id: uid(), type: "audio", name: "SFX & Music", clips: [] };

    if (template.id === "dev_saas_launch") {
      mockupTrack.clips.push({
        id: uid(), name: "Dashboard Browser Mockup", type: "mockup", mockupType: "browser",
        start: 0, duration: 8, urlBar: "https://my-saas.dev/overview", title: "SaaS Studio", x: 50, y: 48, scale: 95
      });
      badgeTrack.clips.push({
        id: uid(), name: "Launch Badge", type: "badge", start: 0.5, duration: 7,
        icon: "🚀", text: "v2.0 Official Product Launch", bg: "#ede9fe", border: "#a78bfa", textColor: "#6d28d9", x: 50, y: 86
      });
      codeTrack.clips.push({
        id: uid(), name: "API Client Setup", type: "code", start: 8, duration: 7,
        filename: "client.ts", lang: "typescript", code: DEV_CODE_PRESETS[3].code, theme: "light", fontSize: 12, x: 50, y: 50, scale: 95, animateTyping: true
      });
      badgeTrack.clips.push({
        id: uid(), name: "Fast Metric", type: "badge", start: 8.5, duration: 6,
        icon: "⚡", text: "Sub-millisecond Edge Response", bg: "#fef9c3", border: "#fde047", textColor: "#a16207", x: 50, y: 86
      });
    } else if (template.id === "dev_terminal_cli") {
      codeTrack.clips.push({
        id: uid(), name: "NPM Install", type: "terminal", start: 0, duration: 6,
        title: "zsh — terminal", prompt: "dev@workstation:~$", command: "npm i @creatify/engine", output: DEV_TERMINAL_PRESETS[0].output, x: 50, y: 48, scale: 95, animateTyping: true
      });
      codeTrack.clips.push({
        id: uid(), name: "Cargo Build", type: "terminal", start: 6, duration: 6,
        title: "bash — rust compiler", prompt: "root@build-node#", command: "cargo build --release", output: DEV_TERMINAL_PRESETS[2].output, x: 50, y: 48, scale: 95, animateTyping: true
      });
      badgeTrack.clips.push({
        id: uid(), name: "Rust Badge", type: "badge", start: 6.5, duration: 5,
        icon: "🦀", text: "Built in 100% Memory-Safe Rust", bg: "#ffedd5", border: "#fb923c", textColor: "#c2410c", x: 50, y: 86
      });
    } else {
      codeTrack.clips.push({
        id: uid(), name: "React Component", type: "code", start: 0, duration: 7,
        filename: "App.tsx", lang: "tsx", code: DEV_CODE_PRESETS[0].code, theme: "light", fontSize: 13, x: 50, y: 48, scale: 100, animateTyping: true
      });
      badgeTrack.clips.push({
        id: uid(), name: "TypeScript Badge", type: "badge", start: 1, duration: 6,
        icon: "🔷", text: "100% Type-Safe SDK", bg: "#eff6ff", border: "#60a5fa", textColor: "#1d4ed8", x: 50, y: 86
      });
    }

    dispatch({ type: "LOAD_PROJECT", projectState: { tracks: [codeTrack, mockupTrack, badgeTrack, audioTrack], duration: template.duration || 15 } });
  };

  // Real Canvas Video Export
  const performExport = async () => {
    setShowExport(true);
    setExportProgress(10);

    const canvas = document.createElement("canvas");
    const ratioObj = ASPECT_RATIOS.find(r => r.id === (state.aspectRatio || "16:9")) || ASPECT_RATIOS[0];
    canvas.width = ratioObj.w || 1920;
    canvas.height = ratioObj.h || 1080;
    const ctx = canvas.getContext("2d");

    const stream = canvas.captureStream(30);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioDest = audioCtx.createMediaStreamDestination();
    const combinedTracks = [...stream.getVideoTracks(), ...audioDest.stream.getAudioTracks()];
    const combinedStream = new MediaStream(combinedTracks);

    let mimeType = "video/webm;codecs=vp9,opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm";
    const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 6000000 });

    const recordedChunks = [];
    recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) recordedChunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      setExportUrl(URL.createObjectURL(blob));
      setExportProgress(100);
      audioCtx.close();
    };

    recorder.start();
    const totalDuration = Math.min(state.duration || 15, 60);
    const fps = 30;
    const totalFrames = Math.ceil(totalDuration * fps);
    const timeStep = 1 / fps;
    const clips = state.tracks.flatMap(t => t.clips);

    for (let i = 0; i < totalFrames; i++) {
      const currentTime = i * timeStep;
      setExportProgress(Math.round((i / totalFrames) * 92));

      // Draw background
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid dots
      ctx.fillStyle = "#cbd5e1";
      for (let x = 20; x < canvas.width; x += 30) {
        for (let y = 20; y < canvas.height; y += 30) {
          ctx.fillRect(x, y, 2, 2);
        }
      }

      // Draw active clips
      const activeFrameClips = clips.filter(c => c.start <= currentTime && c.start + c.duration > currentTime);
      
      for (const c of activeFrameClips) {
        if (c.type === "code") {
          // Render code card
          ctx.save();
          const cardW = canvas.width * 0.65;
          const cardH = canvas.height * 0.55;
          const cardX = (canvas.width - cardW) / 2;
          const cardY = (canvas.height - cardH) / 2;

          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#cbd5e1";
          ctx.lineWidth = 3;
          ctx.shadowColor = "rgba(0,0,0,0.08)";
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.roundRect(cardX, cardY, cardW, cardH, 16);
          ctx.fill();
          ctx.stroke();

          // Header
          ctx.fillStyle = "#f1f5f9";
          ctx.beginPath();
          ctx.roundRect(cardX, cardY, cardW, 40, [16, 16, 0, 0]);
          ctx.fill();

          // Window dots
          ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(cardX + 24, cardY + 20, 6, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(cardX + 42, cardY + 20, 6, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#10b981"; ctx.beginPath(); ctx.arc(cardX + 60, cardY + 20, 6, 0, Math.PI*2); ctx.fill();

          // Filename
          ctx.font = "bold 15px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#475569";
          ctx.textAlign = "center";
          ctx.fillText(c.filename || "code.tsx", cardX + cardW/2, cardY + 26);

          // Code Text (simulated typing)
          const elapsed = currentTime - c.start;
          const progressRatio = Math.min(1, elapsed / (c.duration * 0.7));
          const codeLines = (c.code || "").split("\n");
          const totalChars = (c.code || "").length;
          const visibleCharCount = Math.floor(totalChars * progressRatio);

          ctx.font = "14px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#0f172a";
          ctx.textAlign = "left";
          let drawnChars = 0;
          let lineY = cardY + 70;

          for (let li = 0; li < codeLines.length; li++) {
            const line = codeLines[li];
            // Line number
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(String(li + 1).padStart(2, " "), cardX + 24, lineY);

            ctx.fillStyle = "#1e293b";
            if (drawnChars + line.length <= visibleCharCount) {
              ctx.fillText(line, cardX + 60, lineY);
              drawnChars += line.length + 1;
            } else {
              const part = line.slice(0, Math.max(0, visibleCharCount - drawnChars));
              ctx.fillText(part, cardX + 60, lineY);
              break;
            }
            lineY += 24;
          }
          ctx.restore();
        } else if (c.type === "badge") {
          // Render badge
          ctx.save();
          ctx.font = "bold 18px 'Poppins', sans-serif";
          const badgeText = `${c.icon || "🏷️"}  ${c.text || c.name}`;
          const badgeW = ctx.measureText(badgeText).width + 36;
          const badgeH = 44;
          const bX = (canvas.width - badgeW) / 2;
          const bY = canvas.height * 0.82;

          ctx.fillStyle = c.bg || "#e0e7ff";
          ctx.strokeStyle = c.border || "#6366f1";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(bX, bY, badgeW, badgeH, 22);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = c.textColor || "#4338ca";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(badgeText, bX + badgeW/2, bY + badgeH/2);
          ctx.restore();
        }
      }

      await new Promise(r => setTimeout(r, 6));
    }

    recorder.stop();
  };

  // Download High-Res Screenshot Snapshot
  const captureScreenshot = () => {
    const canvas = document.createElement("canvas");
    const ratioObj = ASPECT_RATIOS.find(r => r.id === (state.aspectRatio || "16:9")) || ASPECT_RATIOS[0];
    canvas.width = ratioObj.w || 1920;
    canvas.height = ratioObj.h || 1080;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#cbd5e1";
    for (let x = 20; x < canvas.width; x += 30) {
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    const link = document.createElement("a");
    link.download = `${projectTitle.toLowerCase().replace(/\s+/g, "_")}_snapshot.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Import/Export JSON
  const exportProjectJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      title: projectTitle,
      version: "2.0",
      state: {
        tracks: state.tracks,
        duration: state.duration,
        aspectRatio: state.aspectRatio,
        canvasBgPattern
      }
    }, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `${projectTitle.toLowerCase().replace(/\s+/g, "_")}.creatify.json`;
    a.click();
  };

  const importProjectJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.state) {
          dispatch({ type: "LOAD_PROJECT", projectState: parsed.state });
          if (parsed.title) setProjectTitle(parsed.title);
        }
      } catch (err) {
        alert("Invalid project file format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const selectedClipData = state.selectedClip
    ? state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClip)
    : null;

  const activeRatioObj = ASPECT_RATIOS.find(a => a.id === (state.aspectRatio || "16:9")) || ASPECT_RATIOS[0];

  const tools = [
    { id: "select", icon: <MousePointer size={14} />, label: "Select (V)" },
    { id: "cut",    icon: <Scissors size={14} />, label: "Cut (C)" },
  ];

  const editActions = [
    { label: "Split (S)", icon: <Scissors size={13} />, action: onSplitClip, disabled: !state.selectedClip },
    { label: "Duplicate", icon: <Copy size={13} />, action: onDuplicateClip, disabled: !state.selectedClip },
    { label: "Delete", icon: <Trash2 size={13} />, action: onDeleteClip, disabled: !state.selectedClip, danger: true },
  ];

  const navTabs = [
    { id: "code", label: "Code", icon: <Code size={18} /> },
    { id: "terminal", label: "Terminal", icon: <Terminal size={18} /> },
    { id: "mockups", label: "Mockups", icon: <Monitor size={18} /> },
    { id: "badges", label: "Badges", icon: <Tag size={18} /> },
    { id: "templates", label: "Templates", icon: <Sparkles size={18} /> },
    { id: "media", label: "Media", icon: <Video size={18} /> },
    { id: "text", label: "Text", icon: <Type size={18} /> },
    { id: "audio", label: "Audio SFX", icon: <Music size={18} /> },
    { id: "patterns", label: "Backdrop", icon: <Layers size={18} /> },
    { id: "inspect", label: "Inspect", icon: <Sliders size={18} /> },
  ];

  return (
    <div style={{ background: "#f8fafc", color: "#0f172a", fontFamily: "'Instrument Sans', sans-serif", height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden", userSelect: "none" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body,html{height:100%;width:100%;overflow:hidden;background:#f8fafc}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#94a3b8}
        .tool-btn{background:#ffffff;border:1px solid #e2e8f0;color:#334155;padding:5px 12px;border-radius:7px;cursor:pointer;font-size:12px;font-family:'Poppins',sans-serif;font-weight:500;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;white-space:nowrap;flex-shrink:0;box-shadow:0 1px 2px rgba(0,0,0,0.03)}
        .tool-btn:hover{background:#f8fafc;color:#0f172a;border-color:#cbd5e1;transform:translateY(-1px);box-shadow:0 2px 5px rgba(0,0,0,0.05)}
        .tool-btn:disabled{opacity:0.35;cursor:not-allowed;pointer-events:none;transform:none}
        .tool-btn.primary{background:#4f46e5;border:1px solid #4338ca;color:#ffffff;font-weight:600;box-shadow:0 2px 8px rgba(79,70,229,0.3)}
        .tool-btn.primary:hover{background:#4338ca;transform:translateY(-1px);box-shadow:0 4px 14px rgba(79,70,229,0.4)}
        .tool-btn.danger{color:#ef4444;border-color:#fecaca;background:#fff5f5}
        .tool-btn.danger:hover{background:#fee2e2;border-color:#ef4444}
        .tool-btn.active{background:#eef2ff;color:#4f46e5;border-color:#818cf8;box-shadow:0 0 0 1px #818cf8}
        .nav-tab-btn{width:58px;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:#64748b;cursor:pointer;font-family:'Poppins',sans-serif;font-size:9.5px;font-weight:500;transition:all 0.15s;border-left:3px solid transparent}
        .nav-tab-btn:hover{color:#4f46e5;background:#f1f5f9}
        .nav-tab-btn.active{color:#4f46e5;background:#eef2ff;border-left-color:#4f46e5;font-weight:700}
        .canvas-card{cursor:grab;transition:box-shadow 0.15s, outline 0.15s;border-radius:12px}
        .canvas-card:hover{outline:2px dashed #6366f1}
        .canvas-card.selected-canvas{outline:2.5px solid #4f46e5;box-shadow:0 12px 30px rgba(79,70,229,0.25)}
        .filter-slider{width:100%;-webkit-appearance:none;appearance:none;height:4px;background:#e2e8f0;border-radius:2px;outline:none;cursor:pointer}
        .filter-slider::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;background:#4f46e5;border-radius:50%;cursor:pointer;box-shadow:0 1px 4px rgba(79,70,229,0.4)}
      `}</style>

      <input ref={fileInputRef} type="file" multiple accept="video/*,image/*,audio/*" style={{ display: "none" }} onChange={handleFileUpload} />

      {/* ── Top Header Navigation Bar ──────────────────────────────────── */}
      <div style={{ height: "52px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0, zIndex: 30, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        
        {/* Left: Exit + Project Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button className="tool-btn" onClick={() => setShowLeaveModal(true)} style={{ padding: "4px 10px", gap: "5px", color: "#64748b" }}>
            <ChevronLeft size={14} /> Exit
          </button>

          <div style={{ height: "18px", width: "1px", background: "#e2e8f0" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px" }}>🎬</span>
            <input
              type="text"
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
              style={{ background: "transparent", border: "none", borderBottom: "1px dashed #cbd5e1", color: "#0f172a", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13.5px", outline: "none", padding: "2px 4px", width: "180px" }}
              title="Click to rename"
            />
          </div>

          <span style={{ fontSize: "10px", background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", padding: "2px 8px", borderRadius: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981" }} />
            Ready
          </span>
        </div>

        {/* Center: Aspect Ratio + History + Screen Record */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {/* Aspect Ratio */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "3px 10px" }}>
            <Globe size={13} color="#4f46e5" />
            <select
              value={state.aspectRatio || "16:9"}
              onChange={e => dispatch({ type: "SET_ASPECT_RATIO", ratio: e.target.value })}
              style={{ background: "none", border: "none", color: "#0f172a", fontSize: "11.5px", fontFamily: "'Poppins', sans-serif", fontWeight: 600, outline: "none", cursor: "pointer" }}
            >
              {ASPECT_RATIOS.slice(0, 5).map(r => (
                <option key={r.id} value={r.id}>{r.icon} {r.id} ({r.name.split("/")[0].trim()})</option>
              ))}
            </select>
          </div>

          {/* Undo / Redo */}
          <div style={{ display: "flex", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "2px" }}>
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!state.history?.length}
              title="Undo (Ctrl+Z)"
              style={{ background: "none", border: "none", color: state.history?.length ? "#4f46e5" : "#94a3b8", padding: "4px 8px", cursor: state.history?.length ? "pointer" : "not-allowed", borderRadius: "5px", display: "flex" }}
            >
              <Undo2 size={13} />
            </button>
            <button
              onClick={() => dispatch({ type: "REDO" })}
              disabled={!state.future?.length}
              title="Redo (Ctrl+Y)"
              style={{ background: "none", border: "none", color: state.future?.length ? "#4f46e5" : "#94a3b8", padding: "4px 8px", cursor: state.future?.length ? "pointer" : "not-allowed", borderRadius: "5px", display: "flex" }}
            >
              <Redo2 size={13} />
            </button>
          </div>

          {/* Screen Recorder */}
          <button
            className={`tool-btn${isRecordingScreen ? " danger active" : ""}`}
            onClick={isRecordingScreen ? stopScreenRecording : startScreenRecording}
            style={{ padding: "4px 10px", fontSize: "11.5px", gap: "6px" }}
            title="Record Screen & Webcam PIP directly into timeline"
          >
            <Radio size={13} className={isRecordingScreen ? "animate-pulse text-red-500" : ""} />
            {isRecordingScreen ? `Recording (${recordTime}s)` : "Record Screen"}
          </button>

          <button className="tool-btn" onClick={() => setShowShortcutsModal(true)} title="Hotkeys (?)" style={{ padding: "4px 9px", fontSize: "11.5px" }}>
            <Keyboard size={13} />
          </button>
        </div>

        {/* Right: Snapshot + Save JSON + Export Video */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <button className="tool-btn" onClick={captureScreenshot} title="Download PNG Snapshot" style={{ padding: "5px 9px", fontSize: "11.5px" }}>
            <Camera size={13} /> Snapshot
          </button>

          <input ref={jsonInputRef} type="file" accept=".json" style={{ display: "none" }} onChange={importProjectJson} />
          <button className="tool-btn" onClick={exportProjectJson} title="Save Project JSON" style={{ padding: "5px 9px", fontSize: "11.5px" }}>
            <Download size={13} /> JSON
          </button>

          <div style={{ height: "18px", width: "1px", background: "#e2e8f0" }} />

          <button className="tool-btn primary" onClick={performExport} style={{ padding: "6px 16px", gap: "6px", fontSize: "12.5px" }}>
            <PlaySquare size={14} /> Render & Export
          </button>
        </div>
      </div>

      {/* ── Main Workspace ────────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", background: "#f8fafc" }}>
        
        {/* ── 1. Vertical Left Icon Strip (58px wide) ── */}
        <div style={{ width: "58px", minWidth: "58px", background: "#ffffff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", zIndex: 20, flexShrink: 0 }}>
          {navTabs.map(t => {
            const active = leftTab === t.id && drawerOpen;
            return (
              <button
                key={t.id}
                className={`nav-tab-btn${active ? " active" : ""}`}
                onClick={() => { setLeftTab(t.id); setDrawerOpen(true); }}
                title={t.label}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setDrawerOpen(prev => !prev)}
            style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", transition: "all 0.15s" }}
            title={drawerOpen ? "Collapse Drawer" : "Expand Drawer"}
          >
            {drawerOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* ── 2. Collapsible Drawer Flyout Panel (270px wide) ──────────── */}
        {drawerOpen && (
          <div style={{ width: "270px", minWidth: "270px", background: "#ffffff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%", zIndex: 19, flexShrink: 0, boxShadow: "2px 0 8px -2px rgba(0,0,0,0.03)" }}>
            
            {/* Drawer Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #e2e8f0", background: "#fafafa" }}>
              <span style={{ fontSize: "11.5px", letterSpacing: "0.08em", color: "#4f46e5", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                {navTabs.find(t => t.id === leftTab)?.label.toUpperCase()} STUDIO
              </span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex" }}>
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
              
              {/* ─ Code Tab ─ */}
              {leftTab === "code" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button className="tool-btn primary" onClick={() => addCodeClip()} style={{ justifyContent: "center", padding: "8px", fontSize: "12px" }}>
                    <Plus size={14} /> Add Code Snippet
                  </button>

                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700, marginTop: "4px" }}>DEVELOPER PRESETS</span>
                  {DEV_CODE_PRESETS.map(preset => (
                    <div
                      key={preset.id}
                      onClick={() => addCodeClip(preset)}
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px", cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.background = "#eef2ff"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b" }}>{preset.name}</span>
                        <span style={{ fontSize: "9.5px", background: "#e0e7ff", color: "#4338ca", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>{preset.lang}</span>
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{preset.filename}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─ Terminal Tab ─ */}
              {leftTab === "terminal" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button className="tool-btn primary" onClick={() => addTerminalClip()} style={{ justifyContent: "center", padding: "8px", fontSize: "12px" }}>
                    <Plus size={14} /> Add Mac Terminal
                  </button>

                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700, marginTop: "4px" }}>CLI WORKFLOWS</span>
                  {DEV_TERMINAL_PRESETS.map(term => (
                    <div
                      key={term.id}
                      onClick={() => addTerminalClip(term)}
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px", cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#86efac"; e.currentTarget.style.background = "#f0fdf4"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#15803d", marginBottom: "3px" }}>{term.name}</div>
                      <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", background: "#ffffff", padding: "4px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                        $ {term.command}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─ Mockups Tab ─ */}
              {leftTab === "mockups" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700 }}>PRODUCT FRAMES</span>
                  
                  <div
                    onClick={() => addMockupClip("browser")}
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#c084fc"; e.currentTarget.style.background = "#faf5ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <Monitor size={18} color="#7e22ce" />
                      <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#581c87" }}>Safari Browser Window</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Live URL address bar with traffic light window controls.</div>
                  </div>

                  <div
                    onClick={() => addMockupClip("mobile")}
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#c084fc"; e.currentTarget.style.background = "#faf5ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <Smartphone size={18} color="#7e22ce" />
                      <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#581c87" }}>Mobile Device Mockup</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Modern smartphone frame for mobile responsive demos.</div>
                  </div>

                  <div
                    onClick={addCursorClip}
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.background = "#eef2ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <MousePointer size={18} color="#4f46e5" />
                      <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#3730a3" }}>Mouse Cursor & Spotlight</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Direct viewer attention with animated click ripples.</div>
                  </div>
                </div>
              )}

              {/* ─ Dev Badges Tab ─ */}
              {leftTab === "badges" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700 }}>DEV STACK & METRICS</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px" }}>
                    {DEV_BADGES.map(badge => (
                      <button
                        key={badge.id}
                        onClick={() => addBadgeClip(badge)}
                        style={{
                          background: badge.bg,
                          border: `1px solid ${badge.border}`,
                          color: badge.text,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: "12px",
                          transition: "all 0.15s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "none"}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{badge.icon}</span>
                          <span>{badge.name}</span>
                        </span>
                        <Plus size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─ Templates Tab ─ */}
              {leftTab === "templates" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700 }}>1-CLICK DEV VIDEO PRESETS</span>
                  {DEV_TEMPLATES.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => applyTemplate(tpl)}
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.background = "#eef2ff"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#1e293b" }}>{tpl.name}</span>
                        <span style={{ fontSize: "9.5px", background: "#e0e7ff", color: "#4338ca", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>{tpl.tag}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>{tpl.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─ Media Tab ─ */}
              {leftTab === "media" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button className="tool-btn primary" onClick={() => fileInputRef.current.click()} style={{ justifyContent: "center", padding: "9px" }}>
                    <Upload size={14} /> Upload Video / Images
                  </button>

                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700 }}>STOCK MEDIA</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {STOCK_MEDIA.slice(0, 6).map(item => (
                      <div
                        key={item.id}
                        onClick={() => addMediaItem(item)}
                        style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.background = "#eef2ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                      >
                        <div style={{ fontSize: "20px", marginBottom: "4px" }}>{item.thumb}</div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                        <div style={{ fontSize: "9.5px", color: "#64748b" }}>{item.type} · {item.duration}s</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─ Text Tab ─ */}
              {leftTab === "text" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button className="tool-btn primary" onClick={() => addTextClip()} style={{ justifyContent: "center", padding: "8px" }}>
                    <Plus size={14} /> Add Headline Text
                  </button>
                  {TEXT_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => addTextClip(preset)}
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.background = "#eef2ff"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>{preset.name}</span>
                      <Plus size={13} color="#4f46e5" />
                    </button>
                  ))}
                </div>
              )}

              {/* ─ Audio SFX Tab ─ */}
              {leftTab === "audio" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700 }}>MECHANICAL KEYBOARD & DEV SFX</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px" }}>
                    {DEV_SFX.map(sfx => (
                      <div
                        key={sfx.id}
                        onClick={() => addAudioClip(sfx)}
                        style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#f43f5e"; e.currentTarget.style.background = "#fff1f2"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "16px" }}>{sfx.thumb}</span>
                          <div>
                            <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#0f172a" }}>{sfx.name}</div>
                            <div style={{ fontSize: "9.5px", color: "#64748b" }}>{sfx.category}</div>
                          </div>
                        </div>
                        <Plus size={13} color="#e11d48" />
                      </div>
                    ))}
                  </div>

                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700, marginTop: "4px" }}>BACKGROUND MUSIC</span>
                  {BG_MUSIC.map(bgm => (
                    <div
                      key={bgm.id}
                      onClick={() => addMediaItem(bgm)}
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#0f172a" }}>🎵 {bgm.name}</div>
                      <Plus size={13} color="#4f46e5" />
                    </div>
                  ))}
                </div>
              )}

              {/* ─ Patterns / Backdrop Tab ─ */}
              {leftTab === "patterns" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700 }}>STUDIO STAGE BACKDROP</span>
                  {CANVAS_PATTERNS.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setCanvasBgPattern(p.id)}
                      style={{
                        background: canvasBgPattern === p.id ? "#eef2ff" : "#f8fafc",
                        border: canvasBgPattern === p.id ? "2px solid #4f46e5" : "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a" }}>{p.name}</span>
                      {canvasBgPattern === p.id && <Check size={14} color="#4f46e5" />}
                    </div>
                  ))}
                </div>
              )}

              {/* ─ Inspect Tab ─ */}
              {leftTab === "inspect" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span style={{ fontSize: "10.5px", color: "#4f46e5", fontWeight: 700 }}>PROPERTIES & INSPECTOR</span>
                  {selectedClipData ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{selectedClipData.name}</div>

                      {selectedClipData.type === "code" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>Code Content</span>
                          <textarea
                            value={selectedClipData.code || ""}
                            onChange={e => dispatch({ type: "UPDATE_CLIP", clipId: selectedClipData.id, patch: { code: e.target.value } })}
                            style={{ width: "100%", height: "120px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", fontSize: "11px", padding: "8px", fontFamily: "'JetBrains Mono', monospace" }}
                          />
                        </div>
                      )}

                      {selectedClipData.type === "terminal" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>Terminal Command</span>
                          <input
                            value={selectedClipData.command || ""}
                            onChange={e => dispatch({ type: "UPDATE_CLIP", clipId: selectedClipData.id, patch: { command: e.target.value } })}
                            style={{ width: "100%", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", fontSize: "11.5px", padding: "6px", fontFamily: "'JetBrains Mono', monospace" }}
                          />
                        </div>
                      )}

                      {selectedClipData.type === "text" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>Title Text</span>
                          <input
                            value={selectedClipData.text || ""}
                            onChange={e => dispatch({ type: "UPDATE_CLIP_TEXT", clipId: selectedClipData.id, text: e.target.value })}
                            style={{ width: "100%", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#0f172a", fontSize: "12px", padding: "6px" }}
                          />
                        </div>
                      )}

                      {/* Position X / Y */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: "10px", color: "#64748b" }}>Pos X (%)</span>
                          <input
                            type="number" value={selectedClipData.x ?? 50}
                            onChange={e => dispatch({ type: "UPDATE_CLIP", clipId: selectedClipData.id, patch: { x: parseInt(e.target.value) || 0 } })}
                            style={{ width: "100%", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px", fontSize: "11px" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: "10px", color: "#64748b" }}>Pos Y (%)</span>
                          <input
                            type="number" value={selectedClipData.y ?? 50}
                            onChange={e => dispatch({ type: "UPDATE_CLIP", clipId: selectedClipData.id, patch: { y: parseInt(e.target.value) || 0 } })}
                            style={{ width: "100%", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px", fontSize: "11px" }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "11.5px", color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>
                      Select a clip on the timeline to edit properties.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Center Area: Preview Canvas + Resizer + Timeline ───────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f1f5f9" }}>
          
          {/* Canvas Stage Box Container */}
          <div style={{ flex: 1, position: "relative", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "14px" }}>
            
            {/* Aspect Ratio Canvas Stage */}
            <div
              ref={canvasPreviewRef}
              style={{
                position: "relative",
                aspectRatio: activeRatioObj.id.replace(":", "/"),
                height: "100%",
                maxHeight: "100%",
                maxWidth: "100%",
                background: canvasBgPattern === "dot_grid" ? "#f8fafc" : canvasBgPattern === "blueprint" ? "#0f172a" : canvasBgPattern === "dark_glass" ? "#090d16" : canvasBgPattern === "soft_gradient" ? "linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 50%, #fae8ff 100%)" : "#ffffff",
                backgroundImage: canvasBgPattern === "dot_grid" ? "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)" : canvasBgPattern === "blueprint" ? "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)" : "none",
                backgroundSize: canvasBgPattern === "dot_grid" ? "20px 20px" : canvasBgPattern === "blueprint" ? "30px 30px" : "auto",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid #cbd5e1",
                boxShadow: "0 20px 45px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {/* Media Video/Image Clip */}
              {activeClip && (
                activeClip.videoEl || activeClip.type === "video" ? (
                  <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "contain" }} playsInline />
                ) : (
                  <img src={activeClip.url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                )
              )}

              {/* Code Snippet Cards */}
              {state.tracks.filter(t => t.type === "code").flatMap(t => t.clips).filter(c => c.type === "code" && c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                const isSelected = state.selectedClip === clip.id;
                const elapsed = state.playhead - clip.start;
                const progressRatio = clip.animateTyping ? Math.min(1, elapsed / (clip.duration * 0.75)) : 1;
                const codeLines = (clip.code || "").split("\n");
                const totalChars = (clip.code || "").length;
                const visibleCharCount = Math.floor(totalChars * progressRatio);

                return (
                  <div
                    key={clip.id}
                    className={`canvas-card${isSelected ? " selected-canvas" : ""}`}
                    onMouseDown={(e) => handleCanvasElementMouseDown(e, clip)}
                    style={{
                      position: "absolute",
                      left: `${clip.x ?? 50}%`,
                      top: `${clip.y ?? 50}%`,
                      transform: "translate(-50%, -50%)",
                      width: "70%",
                      maxWidth: "600px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      zIndex: isSelected ? 30 : 20,
                    }}
                  >
                    {/* Window Header */}
                    <div style={{ background: "#f1f5f9", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>{clip.filename || "snippet.tsx"}</span>
                      <span style={{ fontSize: "10px", color: "#4f46e5", fontWeight: 700, background: "#e0e7ff", padding: "1px 6px", borderRadius: "4px" }}>{clip.lang?.toUpperCase() || "CODE"}</span>
                    </div>

                    {/* Code Body with Animated Typing */}
                    <div style={{ padding: "14px 16px", background: "#ffffff", fontFamily: "'JetBrains Mono', monospace", fontSize: `${clip.fontSize || 12}px`, color: "#0f172a", lineHeight: 1.6, maxHeight: "240px", overflow: "hidden" }}>
                      {codeLines.map((line, li) => {
                        return (
                          <div key={li} style={{ display: "flex", gap: "12px" }}>
                            <span style={{ color: "#94a3b8", userSelect: "none", width: "20px", textAlign: "right", fontSize: "10.5px" }}>{li + 1}</span>
                            <span style={{ color: "#1e293b", whiteSpace: "pre-wrap" }}>{line}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Terminal Window Overlay */}
              {state.tracks.filter(t => t.type === "code").flatMap(t => t.clips).filter(c => c.type === "terminal" && c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                const isSelected = state.selectedClip === clip.id;
                const elapsed = state.playhead - clip.start;
                const cmdProgress = Math.min(1, elapsed / 2);
                const visibleCmd = (clip.command || "").slice(0, Math.floor((clip.command || "").length * cmdProgress));
                const showOutput = elapsed > 2.2;

                return (
                  <div
                    key={clip.id}
                    className={`canvas-card${isSelected ? " selected-canvas" : ""}`}
                    onMouseDown={(e) => handleCanvasElementMouseDown(e, clip)}
                    style={{
                      position: "absolute",
                      left: `${clip.x ?? 50}%`,
                      top: `${clip.y ?? 50}%`,
                      transform: "translate(-50%, -50%)",
                      width: "68%",
                      maxWidth: "580px",
                      background: "#090d16",
                      border: "1px solid #1e293b",
                      borderRadius: "12px",
                      boxShadow: "0 14px 35px rgba(0,0,0,0.3)",
                      overflow: "hidden",
                      zIndex: isSelected ? 30 : 20,
                    }}
                  >
                    <div style={{ background: "#111827", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1f2937" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", fontFamily: "'JetBrains Mono', monospace" }}>{clip.title || "zsh — terminal"}</span>
                      <span style={{ width: "20px" }} />
                    </div>

                    <div style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#f3f4f6", lineHeight: 1.5 }}>
                      <div style={{ color: "#34d399", fontWeight: 700, marginBottom: "4px" }}>
                        {clip.prompt || "alex@macbook:~$"} <span style={{ color: "#ffffff" }}>{visibleCmd}</span>
                        {cmdProgress < 1 && <span className="animate-pulse" style={{ color: "#38bdf8" }}>█</span>}
                      </div>
                      {showOutput && (
                        <div style={{ color: "#94a3b8", whiteSpace: "pre-wrap", fontSize: "11px", marginTop: "6px" }}>
                          {clip.output}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Browser Mockup Window */}
              {state.tracks.filter(t => t.type === "video").flatMap(t => t.clips).filter(c => c.type === "mockup" && c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                const isSelected = state.selectedClip === clip.id;
                return (
                  <div
                    key={clip.id}
                    className={`canvas-card${isSelected ? " selected-canvas" : ""}`}
                    onMouseDown={(e) => handleCanvasElementMouseDown(e, clip)}
                    style={{
                      position: "absolute",
                      left: `${clip.x ?? 50}%`,
                      top: `${clip.y ?? 50}%`,
                      transform: "translate(-50%, -50%)",
                      width: "80%",
                      maxWidth: "700px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "14px",
                      boxShadow: "0 18px 40px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      zIndex: isSelected ? 30 : 20,
                    }}
                  >
                    <div style={{ background: "#f8fafc", padding: "8px 12px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                      </div>
                      <div style={{ flex: 1, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "3px 10px", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#475569" }}>
                        <Lock size={10} color="#10b981" />
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>{clip.urlBar || "https://your-product.dev"}</span>
                      </div>
                    </div>
                    <div style={{ padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)", minHeight: "160px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#4f46e5", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                        <Laptop size={24} />
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>Your Product UI Live Preview</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Interactive SaaS application mockup frame</div>
                    </div>
                  </div>
                );
              })}

              {/* Dev Badges */}
              {state.tracks.filter(t => t.type === "badge").flatMap(t => t.clips).filter(c => c.type === "badge" && c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                const isSelected = state.selectedClip === clip.id;
                return (
                  <div
                    key={clip.id}
                    className={`canvas-card${isSelected ? " selected-canvas" : ""}`}
                    onMouseDown={(e) => handleCanvasElementMouseDown(e, clip)}
                    style={{
                      position: "absolute",
                      left: `${clip.x ?? 50}%`,
                      top: `${clip.y ?? 82}%`,
                      transform: "translate(-50%, -50%)",
                      background: clip.bg || "#e0e7ff",
                      border: `1.5px solid ${clip.border || "#6366f1"}`,
                      color: clip.textColor || "#4338ca",
                      padding: "8px 18px",
                      borderRadius: "30px",
                      fontSize: "13px",
                      fontWeight: 700,
                      fontFamily: "'Poppins', sans-serif",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                      zIndex: isSelected ? 30 : 20,
                      whiteSpace: "nowrap"
                    }}
                  >
                    <span>{clip.icon || "🏷️"}</span>
                    <span>{clip.text || clip.name}</span>
                  </div>
                );
              })}

              {/* Cursor Overlay */}
              {state.tracks.filter(t => t.type === "badge").flatMap(t => t.clips).filter(c => c.type === "cursor" && c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                return (
                  <div
                    key={clip.id}
                    style={{
                      position: "absolute",
                      left: `${clip.x ?? 50}%`,
                      top: `${clip.y ?? 50}%`,
                      transform: "translate(-10%, -10%)",
                      pointerEvents: "none",
                      zIndex: 40
                    }}
                  >
                    <MousePointer size={24} color="#0f172a" fill="#0f172a" />
                    <div style={{ position: "absolute", top: 20, left: 16, background: "#0f172a", color: "#ffffff", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {clip.label || "Click"}
                    </div>
                  </div>
                );
              })}

              {/* Text Overlays */}
              {state.tracks.filter(t => t.type === "text").flatMap(t => t.clips).filter(c => c.start <= state.playhead && c.start + c.duration > state.playhead).map(clip => {
                const isSelected = state.selectedClip === clip.id;
                return (
                  <div
                    key={clip.id}
                    className={`canvas-card${isSelected ? " selected-canvas" : ""}`}
                    onMouseDown={(e) => handleCanvasElementMouseDown(e, clip)}
                    style={{
                      position: "absolute",
                      left: `${clip.x ?? 50}%`,
                      top: `${clip.y ?? 20}%`,
                      transform: "translate(-50%, -50%)",
                      background: clip.bgColor || "rgba(255, 255, 255, 0.95)",
                      color: clip.color || "#0f172a",
                      padding: "6px 18px",
                      borderRadius: "10px",
                      fontSize: `${clip.fontSize || 32}px`,
                      fontFamily: clip.fontFamily || "'Poppins', sans-serif",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                      border: `1.5px solid ${clip.borderColor || "#cbd5e1"}`,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                      zIndex: isSelected ? 30 : 20,
                    }}
                  >
                    {clip.text}
                  </div>
                );
              })}

              {/* Timecode overlay */}
              <div style={{ position: "absolute", bottom: "10px", left: "14px", background: "rgba(255, 255, 255, 0.9)", color: "#4f46e5", fontSize: "11px", padding: "3px 9px", borderRadius: "6px", fontVariantNumeric: "tabular-nums", fontWeight: 700, border: "1px solid #e2e8f0", backdropFilter: "blur(4px)", fontFamily: "'JetBrains Mono', monospace" }}>
                {fmtTime(state.playhead)} / {fmtTime(state.duration)}
              </div>

              {/* Resolution badge */}
              <div style={{ position: "absolute", bottom: "10px", right: "14px", background: "rgba(255, 255, 255, 0.9)", color: "#64748b", fontSize: "10px", padding: "3px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontWeight: 600 }}>
                {activeRatioObj.id} · {activeRatioObj.w}×{activeRatioObj.h}
              </div>
            </div>

            {/* Floating Transport Controls */}
            <div style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "8px 6px", borderRadius: "24px", zIndex: 25, background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
              <button onClick={() => dispatch({ type: "SET_PLAYHEAD", time: 0 })} title="Start" style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}>
                <Rewind size={14} />
              </button>
              <button onClick={onFrameBackward} title="Frame Back" style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}>
                <SkipBack size={14} />
              </button>
              <button onClick={onTogglePlay} title="Play/Pause (Space)" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#4f46e5", border: "none", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(79,70,229,0.3)" }}>
                {state.isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
              </button>
              <button onClick={onFrameForward} title="Frame Forward" style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}>
                <SkipForward size={14} />
              </button>
              <button onClick={() => dispatch({ type: "SET_PLAYHEAD", time: state.duration })} title="End" style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}>
                <FastForward size={14} />
              </button>
            </div>
          </div>

          {/* ── Editing Toolbar Strip ─────────────────────────────────── */}
          <div style={{ height: "42px", display: "flex", alignItems: "center", background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", flexShrink: 0, padding: "0 14px", overflow: "hidden" }}>
            
            {/* Tool selector */}
            <div style={{ display: "flex", gap: "4px", paddingRight: "10px", marginRight: "10px", borderRight: "1px solid #e2e8f0" }}>
              {tools.map(t => (
                <button key={t.id} className={`tool-btn${activeTool === t.id ? " active" : ""}`} onClick={() => setActiveTool(t.id)} title={t.label} style={{ padding: "4px 10px", fontSize: "11.5px" }}>
                  {t.icon} <span>{t.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Edit actions */}
            <div style={{ display: "flex", gap: "6px", paddingRight: "10px", borderRight: "1px solid #e2e8f0", marginRight: "10px" }}>
              {editActions.map(a => (
                <button key={a.label} className={`tool-btn${a.danger ? " danger" : ""}`} onClick={a.action} disabled={a.disabled} title={a.label} style={{ padding: "4px 10px", fontSize: "11.5px" }}>
                  <span>{a.icon}</span> <span>{a.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Playback speed */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Speed:</span>
              {[0.5, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => dispatch({ type: "SET_PLAYBACK_SPEED", speed })}
                  style={{
                    background: (state.playbackSpeed || 1) === speed ? "#e0e7ff" : "transparent",
                    color: (state.playbackSpeed || 1) === speed ? "#4338ca" : "#64748b",
                    border: "none",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* ── Multi-Track Timeline (Light Theme) ───────────────────── */}
          <Timeline
            state={state}
            dispatch={dispatch}
            timelineRef={timelineRef}
            onTimelineClick={handleTimelineClick}
            onClipMouseDown={handleClipMouseDown}
            onResizeMouseDown={handleResizeMouseDown}
            onAddTrack={() => {
              const name = prompt("New Track Name:", "New Track");
              if (name) dispatch({ type: "ADD_TRACK", track: { id: uid(), type: "badge", name, clips: [] } });
            }}
          />

        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <ShortcutsModal show={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />
      
      <ExportModal
        show={showExport}
        progress={exportProgress}
        downloadUrl={exportUrl}
        fileName={`${projectTitle.toLowerCase().replace(/\s+/g, "_")}.webm`}
        onClose={() => { setShowExport(false); setExportUrl(null); }}
      />

      {/* Leave Modal */}
      {showLeaveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px", maxWidth: 420, boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Save changes before leaving?</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Your project changes will be saved to your local workspace & cloud.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="tool-btn" onClick={handleDiscardAndExit}>Discard & Exit</button>
              <button className="tool-btn primary" onClick={handleSaveAndExit}>Save & Exit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
