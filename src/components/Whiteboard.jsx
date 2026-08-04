import { useState, useRef, useEffect, useCallback } from "react";
import {
  Home, FileText, Settings, Share2, Download, Trash2, X, Layers,
  LayoutTemplate, Shapes, Type, Upload, Wrench, FolderOpen,
  Square, Circle, Triangle, Star, Pentagon, Hexagon, Heart, Cloud,
  Minus, ArrowRight, ArrowRightLeft, CornerUpRight, Link2,
  BarChart3, TrendingUp, PieChart, Donut,
  Grid3x3, Grid2x2, MoreHorizontal,
  Frame, RectangleHorizontal,
  MousePointer2, Pen, Highlighter, Eraser, Hand, Zap,
  Image as ImageIcon, StickyNote,
  ZoomIn, ZoomOut, HelpCircle, Maximize, Maximize2,
  FileEdit, Clock, Bold, Italic, RotateCcw, RotateCw, ChevronLeft,
  Lock, Unlock, Eye, EyeOff, Plus, Palette, Copy
} from "lucide-react";
import THEME from "../theme";

export default function Whiteboard({ onBack, user, initialProject }) {
  // Canvas refs
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const bgRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const previousToolRef = useRef("pen");
  const imageClickPosRef = useRef(null);
  const draggingNoteRef = useRef(null);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.1);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes iconHover {
        0%, 100% {
          transform: scale(1) rotate(0deg);
        }
        25% {
          transform: scale(1.1) rotate(-5deg);
        }
        75% {
          transform: scale(1.1) rotate(5deg);
        }
      }
      
      .sidebar-icon-btn:hover svg {
        animation: iconHover 0.5s ease-in-out;
      }
      
      .tool-button:active {
        transform: scale(0.95);
      }
      
      input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(90deg, #942945 0%, #e1496d 100%);
        outline: none;
      }
      
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #942945;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(148, 41, 69, 0.4);
        transition: all 0.2s;
      }
      
      input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(148, 41, 69, 0.6);
      }
      
      input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #942945;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 8px rgba(148, 41, 69, 0.4);
        transition: all 0.2s;
      }
      
      input[type="range"]::-moz-range-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(148, 41, 69, 0.6);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  // Contexts
  const [ctx, setCtx] = useState(null);
  const [overlayCtx, setOverlayCtx] = useState(null);
  const [bgCtx, setBgCtx] = useState(null);
  
  // Core drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState("pen");
  const [currentColor, setCurrentColor] = useState("#942945");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(3);
  const [opacity, setOpacity] = useState(100);
  const [startPos, setStartPos] = useState(null);
  
  // Shape settings
  const [shapeFilled, setShapeFilled] = useState(false);
  const [sides, setSides] = useState(5); // For polygon/star
  
  // Text settings
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [textInput, setTextInput] = useState(null);
  
  // Selection and transform
  const [selectedElements, setSelectedElements] = useState([]);
  const [elements, setElements] = useState([]);
  const [selectionBox, setSelectionBox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [transformHandle, setTransformHandle] = useState(null);
  
  // Layers
  const [layers, setLayers] = useState([
    { id: 1, name: "Background", visible: true, locked: true, opacity: 100 },
    { id: 2, name: "Layer 1", visible: true, locked: false, opacity: 100 }
  ]);
  const [activeLayer, setActiveLayer] = useState(2);
  
  // Sticky notes
  const [stickyNotes, setStickyNotes] = useState([]);
  
  // Background
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  
  // Zoom & Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  
  // History
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  
  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [boardNotes, setBoardNotes] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [projectTitle, setProjectTitle] = useState(initialProject?.title || "Untitled Board");
  const [sidebarTab, setSidebarTab] = useState("tools");
  const [userProjects, setUserProjects] = useState([]);
  const [laserPos, setLaserPos] = useState(null);
  const [stickyNoteColor, setStickyNoteColor] = useState("#fef3c7");
  
  // Colors
  const colorPalette = [
    "#942945", "#e1496d", "#ec4899", "#f472b6", "#fce7f3",
    "#000000", "#374151", "#6b7280", "#d1d5db", "#ffffff",
    "#dc2626", "#f97316", "#eab308", "#22c55e", "#06b6d4",
    "#3b82f6", "#8b5cf6", "#d946ef", "#f59e0b", "#10b981"
  ];

  const stickyNoteColors = [
    "#fef3c7", "#fecdd3", "#bbf7d0", "#bfdbfe", "#e9d5ff", "#fed7aa"
  ];
  
  const fonts = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New", 
                 "Verdana", "Comic Sans MS", "Impact", "Brush Script MT"];
  
  // Tool categories
  const templates = [
    { id: "blank", name: "Blank", bg: "#ffffff", grid: true },
    { id: "brainstorm", name: "Brainstorm", bg: "#fdf2f4", grid: true },
    { id: "dark", name: "Dark Mode", bg: "#1a0f14", grid: false },
    { id: "blueprint", name: "Blueprint", bg: "#0f172a", grid: true },
    { id: "paper", name: "Paper", bg: "#fefce8", grid: false },
    { id: "grid", name: "Grid Board", bg: "#ffffff", grid: true },
  ];

  const toolGroups = {
    draw: [
      { id: "select", Icon: MousePointer2, name: "Select", key: "V", color: "#3b82f6" },
      { id: "pan", Icon: Hand, name: "Pan", key: "H", color: "#64748b" },
      { id: "pen", Icon: Pen, name: "Pen", key: "P", color: "#8b5cf6" },
      { id: "highlighter", Icon: Highlighter, name: "Marker", key: "M", color: "#f59e0b" },
      { id: "eraser", Icon: Eraser, name: "Eraser", key: "E", color: "#ef4444" },
      { id: "laser", Icon: Zap, name: "Laser", key: "K", color: "#dc2626" },
    ],
    shapes: [
      { id: "line", Icon: Minus, name: "Line", key: "L", color: "#64748b" },
      { id: "arrow", Icon: ArrowRight, name: "Arrow", key: "A", color: "#7c3aed" },
      { id: "rectangle", Icon: Square, name: "Rectangle", key: "R", color: "#3b82f6" },
      { id: "circle", Icon: Circle, name: "Circle", key: "C", color: "#8b5cf6" },
      { id: "triangle", Icon: Triangle, name: "Triangle", key: "T", color: "#ec4899" },
      { id: "star", Icon: Star, name: "Star", key: "S", color: "#f59e0b" },
    ],
    insert: [
      { id: "text", Icon: Type, name: "Text", key: "X", color: "#1e293b" },
      { id: "sticky", Icon: StickyNote, name: "Note", key: "N", color: "#fbbf24" },
      { id: "image", Icon: ImageIcon, name: "Image", key: "I", color: "#10b981" },
    ]
  };

  // Elements library
  const elementsLibrary = {
    shapes: [
      { id: "rectangle", Icon: Square, name: "Rectangle", type: "shape", color: "#3b82f6" },
      { id: "circle", Icon: Circle, name: "Circle", type: "shape", color: "#8b5cf6" },
      { id: "triangle", Icon: Triangle, name: "Triangle", type: "shape", color: "#ec4899" },
      { id: "star", Icon: Star, name: "Star", type: "shape", color: "#f59e0b" },
      { id: "pentagon", Icon: Pentagon, name: "Pentagon", type: "shape", color: "#10b981" },
      { id: "hexagon", Icon: Hexagon, name: "Hexagon", type: "shape", color: "#06b6d4" },
      { id: "heart", Icon: Heart, name: "Heart", type: "shape", color: "#ef4444" },
      { id: "cloud", Icon: Cloud, name: "Cloud", type: "shape", color: "#94a3b8" },
    ],
    lines: [
      { id: "line", Icon: Minus, name: "Line", type: "line", color: "#64748b" },
      { id: "arrow", Icon: ArrowRight, name: "Arrow", type: "line", color: "#7c3aed" },
      { id: "double-arrow", Icon: ArrowRightLeft, name: "Double Arrow", type: "line", color: "#0891b2" },
      { id: "curved-arrow", Icon: CornerUpRight, name: "Curved Arrow", type: "line", color: "#ea580c" },
      { id: "connector", Icon: Link2, name: "Connector", type: "line", color: "#16a34a" },
    ],
    charts: [
      { id: "bar-chart", Icon: BarChart3, name: "Bar Chart", type: "chart", color: "#3b82f6" },
      { id: "line-chart", Icon: TrendingUp, name: "Line Chart", type: "chart", color: "#10b981" },
      { id: "pie-chart", Icon: PieChart, name: "Pie Chart", type: "chart", color: "#f59e0b" },
      { id: "donut-chart", Icon: Donut, name: "Donut Chart", type: "chart", color: "#ec4899" },
    ],
    tables: [
      { id: "table-2x2", Icon: Grid2x2, name: "2x2 Table", rows: 2, cols: 2, color: "#6366f1" },
      { id: "table-3x3", Icon: Grid3x3, name: "3x3 Table", rows: 3, cols: 3, color: "#8b5cf6" },
      { id: "table-4x4", Icon: MoreHorizontal, name: "4x4 Table", rows: 4, cols: 4, color: "#a855f7" },
    ],
    grids: [
      { id: "grid-square", Icon: Grid3x3, name: "Square Grid", type: "grid", color: "#64748b" },
      { id: "grid-dots", Icon: MoreHorizontal, name: "Dot Grid", type: "grid", color: "#94a3b8" },
      { id: "grid-iso", Icon: Hexagon, name: "Isometric", type: "grid", color: "#06b6d4" },
    ],
    frames: [
      { id: "frame-basic", Icon: Frame, name: "Basic Frame", type: "frame", color: "#475569" },
      { id: "frame-rounded", Icon: RectangleHorizontal, name: "Rounded", type: "frame", color: "#64748b" },
      { id: "frame-dashed", Icon: Square, name: "Dashed", type: "frame", color: "#94a3b8" },
    ]
  };

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const bg = bgRef.current;
    if (!canvas || !overlay || !bg) return;

    const w = window.innerWidth - 352 - 260;
    const h = window.innerHeight - 112;

    canvas.width = overlay.width = bg.width = Math.max(w, 400);
    canvas.height = overlay.height = bg.height = Math.max(h, 300);

    const c = canvas.getContext("2d");
    const o = overlay.getContext("2d");
    const b = bg.getContext("2d");

    c.lineCap = o.lineCap = "round";
    c.lineJoin = o.lineJoin = "round";

    setCtx(c);
    setOverlayCtx(o);
    setBgCtx(b);
    drawBackground(b, canvas.width, canvas.height);
  }, [bgColor, showGrid, gridSize]);

  // Initialize canvas
  useEffect(() => {
    initCanvas();
    saveHistory();
    loadUserProjects();

    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (bgCtx && canvasRef.current) {
      drawBackground(bgCtx, canvasRef.current.width, canvasRef.current.height);
    }
  }, [bgColor, showGrid, gridSize, bgCtx]);

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // Load saved project
  useEffect(() => {
    if (!ctx || !initialProject?.data?.imageData) return;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      if (initialProject.data.stickyNotes?.length) {
        setStickyNotes(initialProject.data.stickyNotes);
      }
      saveHistory();
    };
    img.src = initialProject.data.imageData;
  }, [ctx, initialProject]);

  // Sticky note drag
  useEffect(() => {
    const onMove = (e) => {
      const drag = draggingNoteRef.current;
      if (!drag) return;
      const dx = (e.clientX - drag.startX) / zoom;
      const dy = (e.clientY - drag.startY) / zoom;
      setStickyNotes(notes => notes.map(n =>
        n.id === drag.id ? { ...n, x: drag.noteX + dx, y: drag.noteY + dy } : n
      ));
    };
    const onUp = () => { draggingNoteRef.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [zoom]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom(z => Math.min(3, Math.max(0.25, +(z + delta).toFixed(2))));
  };

  const fitToScreen = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const startNoteDrag = (e, noteId) => {
    e.stopPropagation();
    const note = stickyNotes.find(n => n.id === noteId);
    if (!note) return;
    draggingNoteRef.current = {
      id: noteId, startX: e.clientX, startY: e.clientY, noteX: note.x, noteY: note.y
    };
  };

  const deleteStickyNote = (id) => {
    setStickyNotes(notes => notes.filter(n => n.id !== id));
  };

  const duplicateStickyNote = (note) => {
    setStickyNotes(notes => [...notes, {
      ...note, id: Date.now(), x: note.x + 20, y: note.y + 20
    }]);
  };

  const addLayer = () => {
    const id = Date.now();
    setLayers(l => [...l, { id, name: `Layer ${l.length}`, visible: true, locked: false, opacity: 100 }]);
    setActiveLayer(id);
  };

  const toggleLayerVisibility = (id) => {
    setLayers(l => l.map(layer => layer.id === id ? { ...layer, visible: !layer.visible } : layer));
  };

  const toggleLayerLock = (id) => {
    setLayers(l => l.map(layer => layer.id === id ? { ...layer, locked: !layer.locked } : layer));
  };

  const applyTemplate = (template) => {
    setBgColor(template.bg);
    setShowGrid(template.grid);
    if (ctx && canvasRef.current) {
      drawBackground(bgCtx, canvasRef.current.width, canvasRef.current.height);
      saveHistory();
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const loadUserProjects = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("creatify_token");
      const res = await fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const projects = await res.json();
        setUserProjects(projects);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const insertElement = (element) => {
    // Handle different element types
    if (element.type === "chart") {
      insertChart(element);
    } else if (element.rows && element.cols) {
      insertTable(element);
    } else if (element.type === "shape") {
      // Set the tool to draw the shape
      setCurrentTool(element.id);
    } else if (element.type === "line") {
      // Set the line drawing tool
      setCurrentTool(element.id);
    } else if (element.type === "grid") {
      insertGrid(element);
    } else if (element.type === "frame") {
      insertFrame(element);
    }
  };

  const insertChart = (chartType) => {
    if (!ctx) return;
    const x = 120;
    const y = 120;
    const w = 320;
    const h = 220;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    if (chartType.id === "bar-chart") {
      const bars = [0.6, 0.8, 0.5, 0.9, 0.7];
      const barWidth = w / (bars.length * 2);
      bars.forEach((height, i) => {
        const barX = x + i * barWidth * 2 + barWidth / 2;
        const barHeight = height * (h - 50);
        ctx.fillStyle = currentColor;
        ctx.fillRect(barX, y + h - barHeight - 30, barWidth, barHeight);
      });
    } else if (chartType.id === "line-chart") {
      const points = [0.5, 0.7, 0.4, 0.9, 0.6, 0.8];
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      points.forEach((val, i) => {
        const px = x + 30 + (i * (w - 60)) / (points.length - 1);
        const py = y + h - 30 - val * (h - 60);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      points.forEach((val, i) => {
        const px = x + 30 + (i * (w - 60)) / (points.length - 1);
        const py = y + h - 30 - val * (h - 60);
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (chartType.id === "pie-chart") {
      const cx = x + w / 2;
      const cy = y + h / 2 + 10;
      const r = Math.min(w, h) / 3;
      const slices = [0.35, 0.25, 0.2, 0.2];
      const colors = [currentColor, "#e1496d", "#8b5cf6", "#f59e0b"];
      let angle = -Math.PI / 2;
      slices.forEach((slice, i) => {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice * Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        angle += slice * Math.PI * 2;
      });
    } else if (chartType.id === "donut-chart") {
      const cx = x + w / 2;
      const cy = y + h / 2 + 10;
      const r = Math.min(w, h) / 3;
      const slices = [0.4, 0.3, 0.3];
      const colors = [currentColor, "#e1496d", "#8b5cf6"];
      let angle = -Math.PI / 2;
      slices.forEach((slice, i) => {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(cx, cy, r, angle, angle + slice * Math.PI * 2);
        ctx.arc(cx, cy, r * 0.55, angle + slice * Math.PI * 2, angle, true);
        ctx.closePath();
        ctx.fill();
        angle += slice * Math.PI * 2;
      });
    }

    ctx.fillStyle = "#64748b";
    ctx.font = "14px Arial";
    ctx.fillText(chartType.name, x + 12, y + 22);
    saveHistory();
  };

  const insertTable = (tableConfig) => {
    const x = 100;
    const y = 100;
    const cellW = 100;
    const cellH = 40;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    
    for (let row = 0; row <= tableConfig.rows; row++) {
      ctx.beginPath();
      ctx.moveTo(x, y + row * cellH);
      ctx.lineTo(x + cellW * tableConfig.cols, y + row * cellH);
      ctx.stroke();
    }
    
    for (let col = 0; col <= tableConfig.cols; col++) {
      ctx.beginPath();
      ctx.moveTo(x + col * cellW, y);
      ctx.lineTo(x + col * cellW, y + cellH * tableConfig.rows);
      ctx.stroke();
    }
    
    saveHistory();
  };

  const insertGrid = (gridConfig) => {
    const x = 100;
    const y = 100;
    const w = 400;
    const h = 400;
    const gridSize = 40;
    
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    
    if (gridConfig.id === "grid-square") {
      // Square grid
      for (let i = 0; i <= w; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + i, y + h);
        ctx.stroke();
      }
      for (let i = 0; i <= h; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, y + i);
        ctx.lineTo(x + w, y + i);
        ctx.stroke();
      }
    } else if (gridConfig.id === "grid-dots") {
      // Dot grid
      ctx.fillStyle = "#94a3b8";
      for (let i = 0; i <= w; i += gridSize) {
        for (let j = 0; j <= h; j += gridSize) {
          ctx.beginPath();
          ctx.arc(x + i, y + j, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (gridConfig.id === "grid-iso") {
      // Isometric grid
      const isoSize = 30;
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          const px = x + i * isoSize + (j % 2) * (isoSize / 2);
          const py = y + j * (isoSize * 0.866);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + isoSize, py);
          ctx.moveTo(px + isoSize / 2, py - isoSize * 0.433);
          ctx.lineTo(px + isoSize / 2, py + isoSize * 0.433);
          ctx.stroke();
        }
      }
    }
    
    saveHistory();
  };

  const insertFrame = (frameConfig) => {
    const x = 100;
    const y = 100;
    const w = 400;
    const h = 300;
    
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    
    if (frameConfig.id === "frame-basic") {
      // Basic frame
      ctx.strokeRect(x, y, w, h);
    } else if (frameConfig.id === "frame-rounded") {
      // Rounded frame
      const radius = 20;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.stroke();
    } else if (frameConfig.id === "frame-dashed") {
      // Dashed frame
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    }
    
    saveHistory();
  };

  const importProject = (project) => {
    if (project.data?.imageData) {
      const img = new Image();
      img.onload = () => {
        const scale = 0.5; // Scale down imported projects
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, 50, 50, w, h);
        saveHistory();
      };
      img.src = project.data.imageData;
    }
  };

  const drawBackground = (context, w, h) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, w, h);
    
    if (showGrid) {
      context.strokeStyle = "rgba(0,0,0,0.08)";
      context.lineWidth = 1;
      for (let x = 0; x < w; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, h);
        context.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(w, y);
        context.stroke();
      }
    }
  };

  const saveHistory = () => {
    if (!ctx) return;
    const data = canvasRef.current.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(data);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyStep - 1];
      setHistoryStep(historyStep - 1);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyStep + 1];
      setHistoryStep(historyStep + 1);
    }
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const getScreenPos = (e) => ({
    x: e.clientX ?? e.touches?.[0]?.clientX ?? 0,
    y: e.clientY ?? e.touches?.[0]?.clientY ?? 0
  });

  const startDrawing = (e) => {
    if (e.button === 2) return;
    const pos = getPos(e);

    if (currentTool === "pan" || e.button === 1) {
      setIsPanning(true);
      setPanStart(getScreenPos(e));
      return;
    }

    if (currentTool === "laser") {
      setLaserPos(pos);
      return;
    }

    if (currentTool === "select") {
      setSelectionBox({ x: pos.x, y: pos.y, w: 0, h: 0 });
      return;
    }

    if (currentTool === "text") {
      setTextInput({ x: pos.x, y: pos.y, text: "" });
      return;
    }

    if (currentTool === "sticky") {
      addStickyNote(pos);
      return;
    }

    if (currentTool === "image") {
      imageClickPosRef.current = pos;
      fileInputRef.current?.click();
      return;
    }

    setIsDrawing(true);
    setStartPos(pos);

    if (["pen", "highlighter", "eraser"].includes(currentTool)) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e) => {
    const pos = getPos(e);

    if (isPanning && panStart) {
      const screen = getScreenPos(e);
      setPan(p => ({
        x: p.x + screen.x - panStart.x,
        y: p.y + screen.y - panStart.y
      }));
      setPanStart(screen);
      return;
    }

    if (currentTool === "laser") {
      setLaserPos(pos);
      if (overlayCtx && overlayRef.current) {
        overlayCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
        const grd = overlayCtx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 24);
        grd.addColorStop(0, "rgba(255,50,50,0.9)");
        grd.addColorStop(0.4, "rgba(255,50,50,0.3)");
        grd.addColorStop(1, "rgba(255,50,50,0)");
        overlayCtx.fillStyle = grd;
        overlayCtx.beginPath();
        overlayCtx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
        overlayCtx.fill();
        overlayCtx.fillStyle = "#ff2222";
        overlayCtx.beginPath();
        overlayCtx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        overlayCtx.fill();
      }
      return;
    }

    if (currentTool === "select" && selectionBox) {
      setSelectionBox({
        ...selectionBox,
        w: pos.x - selectionBox.x,
        h: pos.y - selectionBox.y
      });
      if (overlayCtx && overlayRef.current) {
        overlayCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
        overlayCtx.strokeStyle = THEME.wine;
        overlayCtx.lineWidth = 1.5;
        overlayCtx.setLineDash([6, 4]);
        overlayCtx.fillStyle = "rgba(148,41,69,0.08)";
        overlayCtx.fillRect(selectionBox.x, selectionBox.y, pos.x - selectionBox.x, pos.y - selectionBox.y);
        overlayCtx.strokeRect(selectionBox.x, selectionBox.y, pos.x - selectionBox.x, pos.y - selectionBox.y);
        overlayCtx.setLineDash([]);
      }
      return;
    }

    if (!isDrawing || !startPos) return;

    overlayCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

    if (currentTool === "pen") {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = opacity / 100;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === "highlighter") {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth * 3;
      ctx.globalAlpha = 0.3;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 4;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    } else if (currentTool === "line") {
      overlayCtx.strokeStyle = currentColor;
      overlayCtx.lineWidth = lineWidth;
      overlayCtx.beginPath();
      overlayCtx.moveTo(startPos.x, startPos.y);
      overlayCtx.lineTo(pos.x, pos.y);
      overlayCtx.stroke();
    } else if (currentTool === "arrow") {
      drawArrow(overlayCtx, startPos, pos, currentColor, lineWidth);
    } else if (currentTool === "rectangle") {
      drawRect(overlayCtx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "circle") {
      drawCircle(overlayCtx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "triangle") {
      drawTriangle(overlayCtx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "star") {
      drawStar(overlayCtx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "pentagon") {
      drawPolygon(overlayCtx, startPos, pos, 5, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "hexagon") {
      drawPolygon(overlayCtx, startPos, pos, 6, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "heart") {
      drawHeart(overlayCtx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "cloud") {
      drawCloud(overlayCtx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "double-arrow") {
      drawDoubleArrow(overlayCtx, startPos, pos, currentColor, lineWidth);
    } else if (currentTool === "curved-arrow") {
      drawCurvedArrow(overlayCtx, startPos, pos, currentColor, lineWidth);
    } else if (currentTool === "connector") {
      drawConnector(overlayCtx, startPos, pos, currentColor, lineWidth);
    }
  };

  const stopDrawing = (e) => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      return;
    }

    if (currentTool === "laser") {
      setLaserPos(null);
      if (overlayCtx && overlayRef.current) {
        overlayCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      }
      return;
    }

    if (currentTool === "select") {
      if (overlayCtx && overlayRef.current) {
        overlayCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      }
      setSelectionBox(null);
      return;
    }

    if (!isDrawing) return;

    const pos = getPos(e);

    // Finalize shape on main canvas
    if (currentTool === "line") {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === "arrow") {
      drawArrow(ctx, startPos, pos, currentColor, lineWidth);
    } else if (currentTool === "rectangle") {
      drawRect(ctx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "circle") {
      drawCircle(ctx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "triangle") {
      drawTriangle(ctx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "star") {
      drawStar(ctx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "pentagon") {
      drawPolygon(ctx, startPos, pos, 5, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "hexagon") {
      drawPolygon(ctx, startPos, pos, 6, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "heart") {
      drawHeart(ctx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "cloud") {
      drawCloud(ctx, startPos, pos, currentColor, fillColor, shapeFilled, lineWidth);
    } else if (currentTool === "double-arrow") {
      drawDoubleArrow(ctx, startPos, pos, currentColor, lineWidth);
    } else if (currentTool === "curved-arrow") {
      drawCurvedArrow(ctx, startPos, pos, currentColor, lineWidth);
    } else if (currentTool === "connector") {
      drawConnector(ctx, startPos, pos, currentColor, lineWidth);
    }

    overlayCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    setIsDrawing(false);
    ctx.globalAlpha = 1;
    saveHistory();
  };

  // Drawing helpers
  const drawArrow = (context, from, to, color, width) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLen = 20;
    
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = width;
    
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    
    context.beginPath();
    context.moveTo(to.x, to.y);
    context.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
    context.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fill();
  };

  const drawRect = (context, start, end, stroke, fill, filled, width) => {
    context.strokeStyle = stroke;
    context.lineWidth = width;
    if (filled) {
      context.fillStyle = fill;
      context.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }
    context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  };

  const drawCircle = (context, start, end, stroke, fill, filled, width) => {
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    context.strokeStyle = stroke;
    context.lineWidth = width;
    context.beginPath();
    context.arc(start.x, start.y, radius, 0, Math.PI * 2);
    if (filled) {
      context.fillStyle = fill;
      context.fill();
    }
    context.stroke();
  };

  const drawTriangle = (context, start, end, stroke, fill, filled, width) => {
    const w = end.x - start.x;
    const h = end.y - start.y;
    context.strokeStyle = stroke;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(start.x + w / 2, start.y);
    context.lineTo(start.x, start.y + h);
    context.lineTo(start.x + w, start.y + h);
    context.closePath();
    if (filled) {
      context.fillStyle = fill;
      context.fill();
    }
    context.stroke();
  };

  const drawStar = (context, start, end, stroke, fill, filled, width) => {
    const cx = start.x;
    const cy = start.y;
    const outerRadius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const innerRadius = outerRadius / 2.5;
    const points = 5;
    
    context.strokeStyle = stroke;
    context.lineWidth = width;
    context.beginPath();
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    
    context.closePath();
    if (filled) {
      context.fillStyle = fill;
      context.fill();
    }
    context.stroke();
  };

  const drawPolygon = (context, start, end, sides, stroke, fill, filled, width) => {
    const cx = start.x;
    const cy = start.y;
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    
    context.strokeStyle = stroke;
    context.lineWidth = width;
    context.beginPath();
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    
    context.closePath();
    if (filled) {
      context.fillStyle = fill;
      context.fill();
    }
    context.stroke();
  };

  const drawHeart = (context, start, end, stroke, fill, filled, width) => {
    const cx = start.x;
    const cy = start.y;
    const size = Math.abs(end.x - start.x);
    
    context.strokeStyle = stroke;
    context.lineWidth = width;
    context.beginPath();
    
    // Heart shape using curves
    context.moveTo(cx, cy + size * 0.3);
    context.bezierCurveTo(cx, cy, cx - size * 0.5, cy - size * 0.3, cx - size * 0.5, cy + size * 0.1);
    context.bezierCurveTo(cx - size * 0.5, cy + size * 0.4, cx, cy + size * 0.7, cx, cy + size);
    context.bezierCurveTo(cx, cy + size * 0.7, cx + size * 0.5, cy + size * 0.4, cx + size * 0.5, cy + size * 0.1);
    context.bezierCurveTo(cx + size * 0.5, cy - size * 0.3, cx, cy, cx, cy + size * 0.3);
    
    if (filled) {
      context.fillStyle = fill;
      context.fill();
    }
    context.stroke();
  };

  const drawCloud = (context, start, end, stroke, fill, filled, width) => {
    const cx = start.x;
    const cy = start.y;
    const w = Math.abs(end.x - start.x);
    const h = Math.abs(end.y - start.y);
    
    context.strokeStyle = stroke;
    context.lineWidth = width;
    context.beginPath();
    
    // Cloud shape using multiple arcs
    context.arc(cx + w * 0.25, cy, w * 0.25, Math.PI, 0, false);
    context.arc(cx + w * 0.6, cy + h * 0.1, w * 0.3, Math.PI * 1.2, 0, false);
    context.arc(cx + w * 0.8, cy + h * 0.4, w * 0.25, Math.PI * 1.5, Math.PI * 0.5, false);
    context.arc(cx + w * 0.4, cy + h * 0.5, w * 0.3, 0, Math.PI, false);
    context.arc(cx + w * 0.15, cy + h * 0.3, w * 0.25, Math.PI * 0.5, Math.PI * 1.2, false);
    
    context.closePath();
    if (filled) {
      context.fillStyle = fill;
      context.fill();
    }
    context.stroke();
  };

  const drawDoubleArrow = (context, from, to, color, width) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLen = 20;
    
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = width;
    
    // Line
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    
    // Arrow head at end
    context.beginPath();
    context.moveTo(to.x, to.y);
    context.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
    context.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fill();
    
    // Arrow head at start
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(from.x + headLen * Math.cos(angle - Math.PI / 6), from.y + headLen * Math.sin(angle - Math.PI / 6));
    context.lineTo(from.x + headLen * Math.cos(angle + Math.PI / 6), from.y + headLen * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fill();
  };

  const drawCurvedArrow = (context, from, to, color, width) => {
    const headLen = 20;
    const controlX = (from.x + to.x) / 2 + (to.y - from.y) * 0.3;
    const controlY = (from.y + to.y) / 2 - (to.x - from.x) * 0.3;
    
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = width;
    
    // Curved line
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.quadraticCurveTo(controlX, controlY, to.x, to.y);
    context.stroke();
    
    // Calculate angle at endpoint
    const dx = to.x - controlX;
    const dy = to.y - controlY;
    const angle = Math.atan2(dy, dx);
    
    // Arrow head
    context.beginPath();
    context.moveTo(to.x, to.y);
    context.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
    context.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fill();
  };

  const drawConnector = (context, from, to, color, width) => {
    context.strokeStyle = color;
    context.lineWidth = width;
    
    // Elbow connector
    const midX = (from.x + to.x) / 2;
    
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(midX, from.y);
    context.lineTo(midX, to.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    
    // Connection dots
    context.fillStyle = color;
    context.beginPath();
    context.arc(from.x, from.y, width * 2, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(to.x, to.y, width * 2, 0, Math.PI * 2);
    context.fill();
  };

  const addStickyNote = (pos) => {
    setStickyNotes([...stickyNotes, {
      id: Date.now(),
      x: pos.x,
      y: pos.y,
      text: "Double-click to edit",
      color: stickyNoteColor
    }]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !ctx) return;
    e.target.value = "";

    const pos = imageClickPosRef.current || { x: 80, y: 80 };
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 420;
        const maxH = 420;
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w *= ratio;
          h *= ratio;
        }
        ctx.drawImage(img, pos.x, pos.y, w, h);
        saveHistory();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const clearCanvas = () => {
    if (window.confirm("Clear everything? This cannot be undone.")) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setStickyNotes([]);
      drawBackground(bgCtx, canvasRef.current.width, canvasRef.current.height);
      saveHistory();
    }
  };

  const exportImage = (format = "png") => {
    const canvas = canvasRef.current;
    const bg = bgRef.current;
    if (!canvas || !bg) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");
    exportCtx.drawImage(bg, 0, 0);
    exportCtx.drawImage(canvas, 0, 0);

    stickyNotes.forEach(note => {
      exportCtx.fillStyle = note.color;
      exportCtx.fillRect(note.x, note.y, 180, 100);
      exportCtx.fillStyle = "#1e293b";
      exportCtx.font = "13px Comic Sans MS";
      exportCtx.fillText(note.text.slice(0, 40), note.x + 12, note.y + 30);
    });

    const link = document.createElement("a");
    link.download = `${projectTitle}.${format}`;
    link.href = exportCanvas.toDataURL(`image/${format}`);
    link.click();
    setShowExportMenu(false);
  };

  const saveProject = async () => {
    if (!user) {
      alert("Please sign in to save!");
      return;
    }

    const data = canvasRef.current.toDataURL();
    const projectData = {
      id: initialProject?.id || `whiteboard_${Date.now()}`,
      title: projectTitle,
      category: "Design",
      tool: "Whiteboard",
      year: new Date().getFullYear().toString(),
      accent: "#be185d",
      gradient: "linear-gradient(135deg, #be185d, #e11d48)",
      image: data.substring(0, 100),
      icon: "âœï¸",
      tags: ["whiteboard", "design"],
      description: "Whiteboard project",
      data: { imageData: data, stickyNotes, layers }
    };

    try {
      const token = localStorage.getItem("creatify_token");
      const res = await fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (res.ok) alert("Saved successfully!");
      else alert("Failed to save");
    } catch (err) {
      alert("Error saving project");
    }
  };

  const allTools = Object.values(toolGroups).flat();
  const toolKeyMap = Object.fromEntries(allTools.map(t => [t.key.toLowerCase(), t.id]));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (textInput) return;
      const key = e.key.toLowerCase();

      if (e.ctrlKey || e.metaKey) {
        if (key === "z") { e.preventDefault(); undo(); return; }
        if (key === "y") { e.preventDefault(); redo(); return; }
        if (key === "s") { e.preventDefault(); saveProject(); return; }
      }

      if (key === " " && !textInput) {
        e.preventDefault();
        if (currentTool !== "pan") {
          previousToolRef.current = currentTool;
          setCurrentTool("pan");
        }
        return;
      }

      if (toolKeyMap[key]) {
        e.preventDefault();
        setCurrentTool(toolKeyMap[key]);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === " " && currentTool === "pan") {
        setCurrentTool(previousToolRef.current || "pen");
      }
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [historyStep, currentTool, textInput]);

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", flexDirection: "column",
      background: "#f8f9fa", fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* Main Content - No Header */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Sidebar - Enhanced with Settings */}
        <div style={{
          width: "72px", background: "#fff", borderRight: "1px solid #e0e0e0",
          display: "flex", flexDirection: "column", alignItems: "center",
          paddingTop: "16px", gap: "8px", justifyContent: "space-between"
        }}>
          {/* Top Section - Navigation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            {/* Home Button */}
            <button onClick={onBack} title="Home"
              style={{
                width: "56px", padding: "12px 8px",
                background: "transparent", border: "2px solid transparent",
                borderRadius: "12px", cursor: "pointer", display: "flex",
                flexDirection: "column", alignItems: "center", gap: "4px",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Home size={24} color="#64748b" strokeWidth={2} />
              <span style={{ fontSize: "9px", fontWeight: 600, color: "#666" }}>Home</span>
            </button>

            {/* Separator */}
            <div style={{ width: "40px", height: "1px", background: "#e0e0e0", margin: "4px 0" }} />

            {/* Tab Navigation */}
            {[
              { id: "templates", Icon: LayoutTemplate, label: "Templates", color: "#3b82f6" },
              { id: "elements", Icon: Shapes, label: "Elements", color: "#8b5cf6" },
              { id: "text", Icon: Type, label: "Text", color: "#1e293b" },
              { id: "uploads", Icon: Upload, label: "Uploads", color: "#10b981" },
              { id: "tools", Icon: Wrench, label: "Tools", color: "#ef4444" },
              { id: "projects", Icon: FolderOpen, label: "Projects", color: "#06b6d4" },
            ].map(item => {
              const IconComponent = item.Icon;
              const isActive = sidebarTab === item.id;
              return (
                <button key={item.id}
                  onClick={() => setSidebarTab(item.id)}
                  title={item.label}
                  className="sidebar-icon-btn"
                  style={{
                    width: "56px", padding: "12px 8px", 
                    background: isActive ? "#f0f4ff" : "transparent",
                    border: isActive ? "2px solid #942945" : "2px solid transparent",
                    borderRadius: "12px", cursor: "pointer", display: "flex",
                    flexDirection: "column", alignItems: "center", gap: "4px",
                    position: "relative", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isActive ? "0 2px 8px rgba(148, 41, 69, 0.15)" : "none"
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f5f5f5";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                >
                  <IconComponent
                    size={24}
                    color={isActive ? "#942945" : item.color}
                    strokeWidth={2}
                    style={{ transition: "all 0.3s" }}
                  />
                  <span style={{
                    fontSize: "9px", fontWeight: 600,
                    color: isActive ? "#942945" : "#666",
                    textAlign: "center", lineHeight: 1.2
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div style={{
                      position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                      width: "3px", height: "70%", background: "#942945",
                      borderRadius: "0 3px 3px 0"
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Section - Settings & Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", paddingBottom: "16px" }}>
            {/* Separator */}
            <div style={{ width: "40px", height: "1px", background: "#e0e0e0", margin: "4px 0" }} />
            
            {/* Settings Button */}
            <button title="Settings" onClick={() => setShowSettings(true)}
              style={{
                width: "56px", padding: "12px 8px",
                background: "transparent", border: "2px solid transparent",
                borderRadius: "12px", cursor: "pointer", display: "flex",
                flexDirection: "column", alignItems: "center", gap: "4px",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Settings size={24} color="#64748b" strokeWidth={2} />
              <span style={{ fontSize: "9px", fontWeight: 600, color: "#666" }}>Settings</span>
            </button>

            {/* Save/Share Button */}
            <button onClick={saveProject} title="Save & Share"
              style={{
                width: "56px", padding: "12px 8px",
                background: "#942945", border: "none",
                borderRadius: "12px", cursor: "pointer", display: "flex",
                flexDirection: "column", alignItems: "center", gap: "4px",
                transition: "all 0.3s", boxShadow: "0 2px 8px rgba(148, 41, 69, 0.3)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#7a1f37";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(148, 41, 69, 0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#942945";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(148, 41, 69, 0.3)";
              }}
            >
              <Share2 size={24} color="#fff" strokeWidth={2} />
              <span style={{ fontSize: "9px", fontWeight: 600, color: "#fff" }}>Share</span>
            </button>
          </div>
        </div>

        {/* Expanded Panel - Canva Style */}
        <div style={{
          width: sidebarTab ? "280px" : "0",
          background: "#fff",
          borderRight: "1px solid #e0e0e0",
          transition: "width 0.3s",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          {sidebarTab && (
            <>
              {/* Panel Header */}
              <div style={{
                padding: "16px", borderBottom: "1px solid #e0e0e0",
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <h3 style={{
                  margin: 0, fontSize: "16px", fontWeight: 700,
                  color: "#1a1a1a", textTransform: "capitalize"
                }}>
                  {sidebarTab}
                </h3>
                <input type="text" placeholder="Search..."
                  style={{
                    padding: "6px 12px", borderRadius: "6px",
                    border: "1px solid #e0e0e0", fontSize: "12px",
                    outline: "none", width: "140px"
                  }}
                />
              </div>

              {/* Panel Content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>

            {/* TEMPLATES TAB */}
            {sidebarTab === "templates" && (
              <div>
                <div style={{
                  fontSize: "11px", fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
                }}>Board Templates</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {templates.map(t => (
                    <button key={t.id} onClick={() => applyTemplate(t)}
                      style={{
                        padding: "12px", background: t.bg, border: "2px solid #e2e8f0",
                        borderRadius: "12px", cursor: "pointer", textAlign: "left",
                        transition: "all 0.2s", minHeight: "80px", position: "relative", overflow: "hidden"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = THEME.wine}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                    >
                      {t.grid && (
                        <div style={{
                          position: "absolute", inset: 0, opacity: 0.15,
                          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                          backgroundSize: "16px 16px"
                        }} />
                      )}
                      <div style={{
                        fontSize: "12px", fontWeight: 700, color: t.bg === "#1a0f14" || t.bg === "#0f172a" ? "#fff" : "#1e293b",
                        position: "relative"
                      }}>{t.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TEXT TAB */}
            {sidebarTab === "text" && (
              <div>
                <div style={{
                  fontSize: "11px", fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
                }}>Font</div>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}
                  style={{
                    width: "100%", padding: "10px", borderRadius: "8px",
                    border: "1px solid #e2e8f0", fontSize: "13px", marginBottom: "16px", outline: "none"
                  }}>
                  {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                </select>

                <div style={{
                  fontSize: "11px", fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px"
                }}>Size: {fontSize}px</div>
                <input type="range" min="12" max="96" value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  style={{ width: "100%", marginBottom: "16px" }} />

                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  <button onClick={() => setTextBold(!textBold)}
                    style={{
                      flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer",
                      background: textBold ? THEME.wine : "#f8fafc",
                      color: textBold ? "#fff" : "#64748b",
                      border: textBold ? "none" : "1px solid #e2e8f0",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      fontWeight: 600, fontSize: "13px"
                    }}>
                    <Bold size={16} /> Bold
                  </button>
                  <button onClick={() => setTextItalic(!textItalic)}
                    style={{
                      flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer",
                      background: textItalic ? THEME.wine : "#f8fafc",
                      color: textItalic ? "#fff" : "#64748b",
                      border: textItalic ? "none" : "1px solid #e2e8f0",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      fontWeight: 600, fontSize: "13px"
                    }}>
                    <Italic size={16} /> Italic
                  </button>
                </div>

                <div style={{
                  fontSize: "11px", fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px"
                }}>Text Color</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "16px" }}>
                  {colorPalette.slice(0, 15).map(c => (
                    <button key={c} onClick={() => setCurrentColor(c)}
                      style={{
                        width: "100%", aspectRatio: "1", borderRadius: "8px", background: c,
                        border: currentColor === c ? `3px solid ${THEME.wine}` : "1px solid #e2e8f0",
                        cursor: "pointer"
                      }} />
                  ))}
                </div>

                <button onClick={() => setCurrentTool("text")}
                  style={{
                    width: "100%", padding: "14px", borderRadius: "10px", cursor: "pointer",
                    background: THEME.btn.primaryBg, color: "#fff", border: "none",
                    fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px"
                  }}>
                  <Type size={18} /> Click Canvas to Add Text
                </button>

                <div style={{
                  marginTop: "16px", padding: "20px", background: "#f8fafc", borderRadius: "10px",
                  border: "1px solid #e2e8f0", textAlign: "center",
                  fontFamily: fontFamily, fontSize: `${Math.min(fontSize, 28)}px`,
                  fontWeight: textBold ? "bold" : "normal",
                  fontStyle: textItalic ? "italic" : "normal",
                  color: currentColor
                }}>
                  Preview Text
                </div>
              </div>
            )}

            {/* UPLOADS TAB */}
            {sidebarTab === "uploads" && (
              <div>
                <button onClick={() => { setCurrentTool("image"); fileInputRef.current?.click(); }}
                  style={{
                    width: "100%", padding: "32px 16px", borderRadius: "12px", cursor: "pointer",
                    background: "#f8fafc", border: "2px dashed #cbd5e1",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                    transition: "all 0.2s", marginBottom: "20px"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = THEME.wine; e.currentTarget.style.background = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.background = "#f8fafc"; }}
                >
                  <Upload size={32} color={THEME.wine} />
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>Upload Image</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>PNG, JPG, GIF, WebP</div>
                </button>

                <div style={{
                  fontSize: "11px", fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
                }}>Quick Insert</div>
                {elementsLibrary.charts.map(chart => {
                  const IconComponent = chart.Icon;
                  return (
                    <button key={chart.id} onClick={() => insertChart(chart)}
                      style={{
                        width: "100%", padding: "12px", marginBottom: "8px",
                        background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
                        transition: "all 0.2s", textAlign: "left"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = THEME.wine}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                    >
                      <IconComponent size={22} color={chart.color} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{chart.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ELEMENTS TAB */}
            {sidebarTab === "elements" && (
              <div>
                {Object.entries(elementsLibrary).map(([category, items]) => (
                  <div key={category} style={{ marginBottom: "24px" }}>
                    <div style={{
                      fontSize: "11px", fontWeight: 700, color: "#64748b",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      marginBottom: "12px"
                    }}>
                      {category}
                    </div>
                    <div style={{
                      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px"
                    }}>
                      {items.map(item => {
                        const IconComponent = item.Icon;
                        return (
                          <button key={item.id}
                            onClick={() => insertElement(item)}
                            style={{
                              aspectRatio: "1", background: "#f8fafc",
                              border: "1px solid #e2e8f0", borderRadius: "10px",
                              cursor: "pointer", fontSize: "24px", display: "flex",
                              flexDirection: "column", alignItems: "center",
                              justifyContent: "center", gap: "4px",
                              transition: "all 0.2s", padding: "8px"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = "#fff";
                              e.currentTarget.style.borderColor = "#942945";
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = "#f8fafc";
                              e.currentTarget.style.borderColor = "#e2e8f0";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <IconComponent size={28} color={item.color} strokeWidth={2} />
                            <span style={{ fontSize: "9px", color: "#64748b", fontWeight: 500 }}>
                              {item.name.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TOOLS TAB */}
            {sidebarTab === "tools" && (
              <div>
                {Object.entries(toolGroups).map(([category, tools]) => (
                  <div key={category} style={{ marginBottom: "24px" }}>
                    <div style={{
                      fontSize: "11px", fontWeight: 700, color: "#64748b",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      marginBottom: "12px"
                    }}>
                      {category}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {tools.map(tool => {
                        const IconComponent = tool.Icon;
                        const isSelected = currentTool === tool.id;
                        return (
                          <button key={tool.id}
                            onClick={() => setCurrentTool(tool.id)}
                            style={{
                              padding: "12px 16px",
                              background: isSelected ? "linear-gradient(135deg, #f0f4ff, #fef3f2)" : "#f8fafc",
                              border: isSelected ? "2px solid #942945" : "1px solid #e2e8f0",
                              borderRadius: "10px", cursor: "pointer",
                              display: "flex", alignItems: "center", gap: "12px",
                              transition: "all 0.2s", textAlign: "left",
                              position: "relative",
                              boxShadow: isSelected ? "0 4px 12px rgba(148, 41, 69, 0.15)" : "none"
                            }}
                            onMouseEnter={e => {
                              if (!isSelected) e.currentTarget.style.background = "#fff";
                            }}
                            onMouseLeave={e => {
                              if (!isSelected) e.currentTarget.style.background = "#f8fafc";
                            }}
                          >
                            {isSelected && (
                              <div style={{
                                position: "absolute", left: 0, top: "50%", 
                                transform: "translateY(-50%)", width: "4px", height: "70%",
                                background: "#942945", borderRadius: "0 4px 4px 0"
                              }} />
                            )}
                            <IconComponent 
                              size={20} 
                              color={isSelected ? "#942945" : tool.color} 
                              strokeWidth={isSelected ? 2.5 : 2} 
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontSize: "13px", 
                                fontWeight: isSelected ? 700 : 600, 
                                color: isSelected ? "#942945" : "#1e293b" 
                              }}>
                                {tool.name}
                              </div>
                              <div style={{ 
                                fontSize: "10px", 
                                color: isSelected ? "#942945" : "#94a3b8", 
                                marginTop: "2px",
                                opacity: isSelected ? 0.8 : 1
                              }}>
                                {isSelected ? "Selected" : `Shortcut: ${tool.key}`}
                              </div>
                            </div>
                            {isSelected && (
                              <div style={{
                                width: "8px", height: "8px", borderRadius: "50%",
                                background: "#942945", boxShadow: "0 0 0 3px rgba(148, 41, 69, 0.2)"
                              }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS TAB */}
            {sidebarTab === "projects" && (
              <div>
                <div style={{
                  fontSize: "11px", fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  marginBottom: "12px"
                }}>
                  Your Projects
                </div>
                
                {!user ? (
                  <div style={{
                    padding: "20px", textAlign: "center", color: "#64748b",
                    fontSize: "13px", background: "#f8fafc", borderRadius: "10px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>ðŸ”’</div>
                    <div>Sign in to access your projects</div>
                  </div>
                ) : userProjects.length === 0 ? (
                  <div style={{
                    padding: "20px", textAlign: "center", color: "#64748b",
                    fontSize: "13px", background: "#f8fafc", borderRadius: "10px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>ðŸ“‚</div>
                    <div>No projects yet</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {userProjects.map(project => (
                      <button key={project.id}
                        onClick={() => importProject(project)}
                        style={{
                          padding: "12px", background: "#f8fafc",
                          border: "1px solid #e2e8f0", borderRadius: "10px",
                          cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                          display: "flex", alignItems: "center", gap: "12px"
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = "#fff";
                          e.target.style.borderColor = "#942945";
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = "#f8fafc";
                          e.target.style.borderColor = "#e2e8f0";
                        }}
                      >
                        <div style={{
                          width: "50px", height: "50px", borderRadius: "8px",
                          background: project.gradient || "#e2e8f0",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "24px"
                        }}>
                          {project.icon || "ðŸ“„"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: "13px", fontWeight: 600, color: "#1e293b",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                          }}>
                            {project.title}
                          </div>
                          <div style={{
                            fontSize: "11px", color: "#94a3b8", marginTop: "2px"
                          }}>
                            {project.tool} • {project.category}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Charts Section */}
                <div style={{ marginTop: "32px" }}>
                  <div style={{
                    fontSize: "11px", fontWeight: 700, color: "#64748b",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    marginBottom: "12px"
                  }}>
                    Quick Charts
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {elementsLibrary.charts.map(chart => {
                      const IconComponent = chart.Icon;
                      return (
                        <button key={chart.id}
                          onClick={() => insertChart(chart)}
                          style={{
                            padding: "16px 8px", background: "#f8fafc",
                            border: "1px solid #e2e8f0", borderRadius: "10px",
                            cursor: "pointer", display: "flex",
                            flexDirection: "column", alignItems: "center", gap: "8px",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.borderColor = "#942945";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = "#f8fafc";
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <IconComponent size={32} color={chart.color} strokeWidth={2} />
                          <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 500 }}>
                            {chart.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
              </>
            )}
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#e8eaed" }}
          onWheel={handleWheel}>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload}
            accept="image/*" style={{ display: "none" }} />

          {/* Floating Quick Toolbar */}
          <div style={{
            position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
            zIndex: 20, background: "#fff", borderRadius: "14px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)", padding: "6px 8px",
            display: "flex", alignItems: "center", gap: "4px", border: "1px solid #e2e8f0"
          }}>
            {toolGroups.draw.map(tool => {
              const IconComponent = tool.Icon;
              const active = currentTool === tool.id;
              return (
                <button key={tool.id} onClick={() => setCurrentTool(tool.id)}
                  title={`${tool.name} (${tool.key})`}
                  style={{
                    width: "38px", height: "38px", borderRadius: "10px", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? THEME.wine : "transparent",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f1f5f9"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <IconComponent size={18} color={active ? "#fff" : tool.color} strokeWidth={2} />
                </button>
              );
            })}
            <div style={{ width: "1px", height: "24px", background: "#e2e8f0", margin: "0 4px" }} />
            {toolGroups.shapes.slice(0, 4).map(tool => {
              const IconComponent = tool.Icon;
              const active = currentTool === tool.id;
              return (
                <button key={tool.id} onClick={() => setCurrentTool(tool.id)}
                  title={`${tool.name} (${tool.key})`}
                  style={{
                    width: "38px", height: "38px", borderRadius: "10px", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? THEME.wine : "transparent", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f1f5f9"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <IconComponent size={18} color={active ? "#fff" : tool.color} strokeWidth={2} />
                </button>
              );
            })}
          </div>
          
          {/* Active Tool Indicator */}
          {currentTool && currentTool !== "select" && currentTool !== "pan" && (
            <div style={{
              position: "absolute", top: "20px", left: "20px", zIndex: 10,
              background: "#fff", padding: "10px 16px", borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", gap: "10px",
              border: "2px solid #942945"
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#942945",
                animation: "pulse 2s infinite"
              }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#942945" }}>
                {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)} Tool Active
              </span>
              <button onClick={() => setCurrentTool("select")}
                style={{
                  background: "#f8fafc", border: "none", padding: "4px 8px",
                  borderRadius: "6px", cursor: "pointer", fontSize: "11px",
                  fontWeight: 600, color: "#64748b", transition: "all 0.2s"
                }}
                onMouseEnter={e => e.target.style.background = "#e2e8f0"}
                onMouseLeave={e => e.target.style.background = "#f8fafc"}
              >
                Deselect
              </button>
            </div>
          )}
          
          <div ref={canvasContainerRef} style={{
            position: "absolute", inset: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            borderRadius: "12px", overflow: "hidden",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.05s ease-out"
          }}>
            <canvas ref={bgRef} style={{ position: "absolute", top: 0, left: 0 }} />
            <canvas ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{
                position: "absolute", top: 0, left: 0,
                cursor: currentTool === "pan" ? (isPanning ? "grabbing" : "grab")
                  : currentTool === "text" ? "text"
                  : currentTool === "eraser" ? "cell"
                  : "crosshair"
              }}
            />
            <canvas ref={overlayRef}
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            />

            {/* Sticky Notes */}
            {stickyNotes.map(note => (
              <div key={note.id}
                onMouseDown={e => startNoteDrag(e, note.id)}
                style={{
                  position: "absolute", left: note.x, top: note.y,
                  background: note.color, padding: "12px 12px 28px", borderRadius: "4px",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.18)", minWidth: "160px",
                  maxWidth: "220px", fontSize: "13px", fontFamily: "'Segoe UI', sans-serif",
                  transform: "rotate(-1deg)", cursor: "move", userSelect: "none",
                  borderTop: "4px solid rgba(0,0,0,0.08)"
                }}
                onDoubleClick={e => {
                  e.stopPropagation();
                  const text = prompt("Edit note:", note.text);
                  if (text !== null) {
                    setStickyNotes(stickyNotes.map(n =>
                      n.id === note.id ? { ...n, text } : n
                    ));
                  }
                }}
              >
                {note.text}
                <div style={{
                  position: "absolute", bottom: "6px", right: "6px",
                  display: "flex", gap: "4px"
                }}>
                  <button onClick={e => { e.stopPropagation(); duplicateStickyNote(note); }}
                    style={{
                      background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "4px",
                      padding: "2px 5px", cursor: "pointer", fontSize: "10px"
                    }} title="Duplicate">
                    <Copy size={10} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteStickyNote(note.id); }}
                    style={{
                      background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "4px",
                      padding: "2px 5px", cursor: "pointer", fontSize: "10px", color: "#dc2626"
                    }} title="Delete">
                    <X size={10} />
                  </button>
                </div>
              </div>
            ))}

            {/* Text Input */}
            {textInput && (
              <input type="text" autoFocus
                value={textInput.text}
                onChange={e => setTextInput({ ...textInput, text: e.target.value })}
                onBlur={() => {
                  if (textInput.text.trim()) {
                    ctx.fillStyle = currentColor;
                    ctx.font = `${textBold ? "bold " : ""}${textItalic ? "italic " : ""}${fontSize}px ${fontFamily}`;
                    ctx.fillText(textInput.text, textInput.x, textInput.y);
                    saveHistory();
                  }
                  setTextInput(null);
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    if (textInput.text.trim()) {
                      ctx.fillStyle = currentColor;
                      ctx.font = `${textBold ? "bold " : ""}${textItalic ? "italic " : ""}${fontSize}px ${fontFamily}`;
                      ctx.fillText(textInput.text, textInput.x, textInput.y);
                      saveHistory();
                    }
                    setTextInput(null);
                  }
                }}
                style={{
                  position: "absolute", left: textInput.x, top: textInput.y - 25,
                  border: "2px solid #942945", padding: "8px", borderRadius: "6px",
                  fontSize: `${fontSize}px`, fontFamily: fontFamily, color: currentColor,
                  background: "rgba(255,255,255,0.95)", outline: "none"
                }}
              />
            )}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div style={{
          width: "260px", background: "#fff", borderLeft: "1px solid #e0e0e0",
          display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          <div style={{
            padding: "16px", borderBottom: "1px solid #e0e0e0",
            fontSize: "14px", fontWeight: 700, color: "#1a1a1a",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <Palette size={18} color={THEME.wine} /> Properties
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {/* Stroke Color */}
            <div style={{
              fontSize: "11px", fontWeight: 700, color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px"
            }}>Stroke Color</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "16px" }}>
              {colorPalette.map(c => (
                <button key={c} onClick={() => setCurrentColor(c)}
                  style={{
                    width: "100%", aspectRatio: "1", borderRadius: "8px", background: c,
                    border: currentColor === c ? `3px solid ${THEME.wine}` : "1px solid #e2e8f0",
                    cursor: "pointer", transition: "transform 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              ))}
            </div>

            {/* Custom color */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <input type="color" value={currentColor} onChange={e => setCurrentColor(e.target.value)}
                style={{ width: "36px", height: "36px", border: "none", borderRadius: "8px", cursor: "pointer", padding: 0 }} />
              <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{currentColor}</span>
            </div>

            {/* Stroke Width */}
            <div style={{
              fontSize: "11px", fontWeight: 700, color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px"
            }}>Stroke Width: {lineWidth}px</div>
            <input type="range" min="1" max="40" value={lineWidth}
              onChange={e => setLineWidth(Number(e.target.value))}
              style={{ width: "100%", marginBottom: "16px" }} />

            {/* Opacity */}
            <div style={{
              fontSize: "11px", fontWeight: 700, color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px"
            }}>Opacity: {opacity}%</div>
            <input type="range" min="10" max="100" value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              style={{ width: "100%", marginBottom: "16px" }} />

            {/* Fill options for shapes */}
            {["rectangle", "circle", "triangle", "star", "pentagon", "hexagon", "heart", "cloud"].includes(currentTool) && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, color: "#64748b",
                    textTransform: "uppercase", letterSpacing: "0.05em"
                  }}>Fill Shape</span>
                  <button onClick={() => setShapeFilled(!shapeFilled)}
                    style={{
                      width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: shapeFilled ? THEME.wine : "#e2e8f0", position: "relative", transition: "background 0.2s"
                    }}>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
                      position: "absolute", top: "3px", left: shapeFilled ? "23px" : "3px", transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }} />
                  </button>
                </div>
                {shapeFilled && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)}
                      style={{ width: "36px", height: "36px", border: "none", borderRadius: "8px", cursor: "pointer", padding: 0 }} />
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Fill color</span>
                  </div>
                )}
              </>
            )}

            {/* Sticky note colors */}
            {currentTool === "sticky" && (
              <>
                <div style={{
                  fontSize: "11px", fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px"
                }}>Note Color</div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
                  {stickyNoteColors.map(c => (
                    <button key={c} onClick={() => setStickyNoteColor(c)}
                      style={{
                        width: "32px", height: "32px", borderRadius: "6px", background: c,
                        border: stickyNoteColor === c ? `3px solid ${THEME.wine}` : "2px solid #e2e8f0",
                        cursor: "pointer"
                      }} />
                  ))}
                </div>
              </>
            )}

            <div style={{ height: "1px", background: "#e2e8f0", margin: "8px 0 16px" }} />

            {/* Layers */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px"
            }}>
              <span style={{
                fontSize: "11px", fontWeight: 700, color: "#64748b",
                textTransform: "uppercase", letterSpacing: "0.05em",
                display: "flex", alignItems: "center", gap: "6px"
              }}>
                <Layers size={14} /> Layers
              </span>
              <button onClick={addLayer} title="Add layer"
                style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px",
                  padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center"
                }}>
                <Plus size={14} color={THEME.wine} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
              {[...layers].reverse().map(layer => (
                <div key={layer.id} onClick={() => setActiveLayer(layer.id)}
                  style={{
                    padding: "8px 10px", borderRadius: "8px", cursor: "pointer",
                    background: activeLayer === layer.id ? "#fdf2f4" : "#f8fafc",
                    border: activeLayer === layer.id ? `1px solid ${THEME.wine}` : "1px solid #e2e8f0",
                    display: "flex", alignItems: "center", gap: "8px", transition: "all 0.15s"
                  }}>
                  <button onClick={e => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                    {layer.visible ? <Eye size={14} color="#64748b" /> : <EyeOff size={14} color="#cbd5e1" />}
                  </button>
                  <span style={{
                    flex: 1, fontSize: "12px", fontWeight: activeLayer === layer.id ? 700 : 500,
                    color: layer.visible ? "#1e293b" : "#94a3b8"
                  }}>{layer.name}</span>
                  <button onClick={e => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                    {layer.locked ? <Lock size={12} color="#94a3b8" /> : <Unlock size={12} color="#cbd5e1" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={clearCanvas}
                style={{
                  padding: "10px", borderRadius: "8px", cursor: "pointer",
                  background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
                  fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "6px"
                }}>
                <Trash2 size={14} /> Clear Canvas
              </button>
              <button onClick={() => exportImage("png")}
                style={{
                  padding: "10px", borderRadius: "8px", cursor: "pointer",
                  background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b",
                  fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "6px"
                }}>
                <Download size={14} /> Export PNG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Enhanced */}
      <div style={{
        height: "56px", background: "#fff", borderTop: "1px solid #e0e0e0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", fontSize: "12px", color: "#666",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)"
      }}>
        {/* Left - Project Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={18} color="#942945" />
            <input type="text" value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
              placeholder="Untitled Project"
              style={{
                background: "transparent", border: "none", 
                color: "#1e293b", fontSize: "14px", fontWeight: 600,
                outline: "none", minWidth: "200px",
                padding: "6px 8px", borderRadius: "6px",
                transition: "all 0.2s"
              }}
              onFocus={e => {
                e.target.style.background = "#f8fafc";
                e.target.style.borderBottom = "2px solid #942945";
              }}
              onBlur={e => {
                e.target.style.background = "transparent";
                e.target.style.borderBottom = "none";
              }}
            />
          </div>
          <div style={{ width: "1px", height: "30px", background: "#e0e0e0" }} />
          <button onClick={() => setShowNotes(!showNotes)}
            style={{
              background: showNotes ? "#fdf2f4" : "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              color: showNotes ? THEME.wine : "#666", fontSize: "13px", fontWeight: 500,
              padding: "6px 12px", borderRadius: "6px", transition: "all 0.2s"
            }}
          >
            <FileEdit size={16} /> Notes
          </button>
          <button onClick={() => setShowTimer(!showTimer)}
            style={{
              background: showTimer ? "#fdf2f4" : "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              color: showTimer ? THEME.wine : "#666", fontSize: "13px", fontWeight: 500,
              padding: "6px 12px", borderRadius: "6px", transition: "all 0.2s"
            }}
          >
            <Clock size={16} /> {timerRunning ? formatTime(timerSeconds) : "Timer"}
          </button>
        </div>

        {/* Right - Actions & Zoom */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Undo/Redo */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={undo} disabled={historyStep <= 0}
              title="Undo (Ctrl+Z)"
              style={{
                background: historyStep <= 0 ? "#f8fafc" : "#fff",
                border: "1px solid #e0e0e0",
                padding: "6px 10px", borderRadius: "6px", cursor: historyStep <= 0 ? "not-allowed" : "pointer",
                fontSize: "13px", color: historyStep <= 0 ? "#cbd5e1" : "#64748b",
                fontWeight: 600, transition: "all 0.2s",
                opacity: historyStep <= 0 ? 0.5 : 1,
                display: "flex", alignItems: "center", gap: "4px"
              }}
              onMouseEnter={e => {
                if (historyStep > 0) e.target.style.background = "#f8fafc";
              }}
              onMouseLeave={e => {
                if (historyStep > 0) e.target.style.background = "#fff";
              }}
            >
              <RotateCcw size={14} /> Undo
            </button>
            <button onClick={redo} disabled={historyStep >= history.length - 1}
              title="Redo (Ctrl+Y)"
              style={{
                background: historyStep >= history.length - 1 ? "#f8fafc" : "#fff",
                border: "1px solid #e0e0e0",
                padding: "6px 10px", borderRadius: "6px", cursor: historyStep >= history.length - 1 ? "not-allowed" : "pointer",
                fontSize: "13px", color: historyStep >= history.length - 1 ? "#cbd5e1" : "#64748b",
                fontWeight: 600, transition: "all 0.2s",
                opacity: historyStep >= history.length - 1 ? 0.5 : 1,
                display: "flex", alignItems: "center", gap: "4px"
              }}
              onMouseEnter={e => {
                if (historyStep < history.length - 1) e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={e => {
                if (historyStep < history.length - 1) e.currentTarget.style.background = "#fff";
              }}
            >
              Redo <RotateCw size={14} />
            </button>
          </div>

          <div style={{ width: "1px", height: "30px", background: "#e0e0e0" }} />

          {/* Zoom Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
              style={{
                background: "none", border: "1px solid #e0e0e0",
                padding: "6px", borderRadius: "6px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.target.style.background = "#f8fafc"}
              onMouseLeave={e => e.target.style.background = "none"}
            >
              <ZoomOut size={16} color="#64748b" />
            </button>
          <input type="range" min="25" max="300" value={zoom * 100}
            onChange={e => setZoom(Number(e.target.value) / 100)}
            style={{
              width: "100px", cursor: "pointer",
              accentColor: "#942945"
            }}
          />
          <div style={{
            minWidth: "50px", textAlign: "center",
            fontWeight: 700, color: "#942945",
            fontSize: "13px"
          }}>
            {Math.round(zoom * 100)}%
          </div>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            style={{
              background: "none", border: "1px solid #e0e0e0",
              padding: "6px", borderRadius: "6px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.target.style.background = "#f8fafc"}
            onMouseLeave={e => e.target.style.background = "none"}
          >
            <ZoomIn size={16} color="#64748b" />
          </button>
        </div>

        <div style={{ width: "1px", height: "30px", background: "#e0e0e0" }} />

        {/* Quick Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "6px", color: "#666",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "6px", transition: "all 0.2s"
          }}
            title="View Grid"
            onMouseEnter={e => e.target.style.background = "#f5f5f5"}
            onMouseLeave={e => e.target.style.background = "none"}
            onClick={() => {
              setShowGrid(!showGrid);
              drawBackground(bgCtx, canvasRef.current?.width, canvasRef.current?.height);
            }}
          >
            <Grid3x3 size={16} color={showGrid ? "#942945" : "#64748b"} />
          </button>
          <button onClick={fitToScreen} title="Fit to screen"
            style={{
              background: "none", border: "1px solid #e0e0e0",
              padding: "6px", borderRadius: "6px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <Maximize2 size={16} color="#64748b" />
          </button>
          <button onClick={() => exportImage("png")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "6px", color: "#666",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "6px", transition: "all 0.2s"
            }}
            title="Export PNG"
            onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <Download size={16} color="#64748b" />
          </button>
          <button onClick={() => setShowHelp(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "6px", color: "#666",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "6px", transition: "all 0.2s"
            }}
            title="Help & Shortcuts"
            onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <HelpCircle size={16} color="#64748b" />
          </button>
        </div>
      </div>
    </div>

      {/* Board Notes Panel */}
      {showNotes && (
        <div style={{
          position: "fixed", bottom: "72px", left: "372px", width: "320px",
          background: "#fff", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          border: "1px solid #e2e8f0", zIndex: 100, overflow: "hidden"
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>Board Notes</span>
            <button onClick={() => setShowNotes(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={16} color="#64748b" />
            </button>
          </div>
          <textarea value={boardNotes} onChange={e => setBoardNotes(e.target.value)}
            placeholder="Jot down ideas, agenda items, or meeting notes..."
            style={{
              width: "100%", height: "180px", border: "none", padding: "16px",
              fontSize: "13px", resize: "none", outline: "none", fontFamily: "inherit",
              lineHeight: 1.6, boxSizing: "border-box"
            }} />
        </div>
      )}

      {/* Timer Panel */}
      {showTimer && (
        <div style={{
          position: "fixed", bottom: "72px", left: "372px", width: "280px",
          background: "#fff", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          border: "1px solid #e2e8f0", zIndex: 100, padding: "24px", textAlign: "center"
        }}>
          <div style={{
            fontSize: "48px", fontWeight: 800, color: THEME.wine,
            fontFamily: "monospace", marginBottom: "16px", letterSpacing: "2px"
          }}>{formatTime(timerSeconds)}</div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button onClick={() => setTimerRunning(!timerRunning)}
              style={{
                padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: timerRunning ? "#fef2f2" : THEME.btn.primaryBg,
                color: timerRunning ? "#dc2626" : "#fff", fontWeight: 700, fontSize: "13px"
              }}>
              {timerRunning ? "Pause" : "Start"}
            </button>
            <button onClick={() => { setTimerSeconds(0); setTimerRunning(false); }}
              style={{
                padding: "10px 16px", borderRadius: "8px", cursor: "pointer",
                background: "#f8fafc", border: "1px solid #e2e8f0",
                color: "#64748b", fontWeight: 600, fontSize: "13px"
              }}>
              Reset
            </button>
            <button onClick={() => setShowTimer(false)}
              style={{
                padding: "10px", borderRadius: "8px", cursor: "pointer",
                background: "#f8fafc", border: "1px solid #e2e8f0"
              }}>
              <X size={16} color="#64748b" />
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }} onClick={() => setShowSettings(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: "16px", width: "400px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden"
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>Board Settings</span>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color="#64748b" />
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  Background Color
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    style={{ width: "40px", height: "40px", border: "none", borderRadius: "8px", cursor: "pointer" }} />
                  <span style={{ fontSize: "13px", color: "#64748b", fontFamily: "monospace" }}>{bgColor}</span>
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Show Grid</label>
                  <button onClick={() => setShowGrid(!showGrid)}
                    style={{
                      width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: showGrid ? THEME.wine : "#e2e8f0", position: "relative"
                    }}>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
                      position: "absolute", top: "3px", left: showGrid ? "23px" : "3px", transition: "left 0.2s"
                    }} />
                  </button>
                </div>
                {showGrid && (
                  <>
                    <label style={{ fontSize: "12px", color: "#64748b" }}>Grid size: {gridSize}px</label>
                    <input type="range" min="10" max="50" value={gridSize}
                      onChange={e => setGridSize(Number(e.target.value))}
                      style={{ width: "100%", marginTop: "6px" }} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }} onClick={() => setShowHelp(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: "16px", width: "440px", maxHeight: "80vh",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden"
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>Keyboard Shortcuts</span>
              <button onClick={() => setShowHelp(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color="#64748b" />
              </button>
            </div>
            <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "60vh" }}>
              {[
                ["Ctrl + Z", "Undo"], ["Ctrl + Y", "Redo"], ["Ctrl + S", "Save project"],
                ["Space (hold)", "Pan canvas"], ["Scroll wheel", "Zoom in/out"],
                ...allTools.map(t => [t.key, t.name])
              ].map(([key, action]) => (
                <div key={key + action} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 0", borderBottom: "1px solid #f1f5f9"
                }}>
                  <span style={{ fontSize: "13px", color: "#1e293b" }}>{action}</span>
                  <kbd style={{
                    background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px",
                    fontSize: "11px", fontWeight: 700, color: "#64748b", fontFamily: "monospace"
                  }}>{key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
  </div>
  );
}
