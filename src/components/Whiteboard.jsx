import { useState, useRef, useEffect } from "react";
import { 
  Home, FileText, Maximize2, Edit3, Settings, Share2,
  LayoutTemplate, Shapes, Type, Award, Upload, Wrench, FolderOpen,
  Square, Circle, Triangle, Star, Pentagon, Hexagon, Heart, Cloud,
  Minus, ArrowRight, ArrowRightLeft, CornerUpRight, Link2,
  BarChart3, TrendingUp, PieChart, Donut,
  Grid3x3, Grid2x2, MoreHorizontal,
  Frame, RectangleHorizontal,
  MousePointer2, Pen, Highlighter, Eraser,
  Image as ImageIcon, StickyNote,
  ZoomIn, ZoomOut, HelpCircle, Maximize,
  FileEdit, Clock
} from "lucide-react";

export default function Whiteboard({ onBack, user, initialProject }) {
  // Canvas refs
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const bgRef = useRef(null);
  const fileInputRef = useRef(null);

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
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [projectTitle, setProjectTitle] = useState(initialProject?.title || "Untitled Board");
  const [sidebarTab, setSidebarTab] = useState("tools"); // tools, elements, projects
  const [userProjects, setUserProjects] = useState([]);
  
  // Colors
  const colorPalette = [
    "#942945", "#e1496d", "#ec4899", "#f472b6", "#fce7f3",
    "#000000", "#374151", "#6b7280", "#d1d5db", "#ffffff",
    "#dc2626", "#f97316", "#eab308", "#22c55e", "#06b6d4",
    "#3b82f6", "#8b5cf6", "#d946ef", "#f59e0b", "#10b981"
  ];
  
  const fonts = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New", 
                 "Verdana", "Comic Sans MS", "Impact", "Brush Script MT"];
  
  // Tool categories
  const toolGroups = {
    draw: [
      { id: "select", Icon: MousePointer2, name: "Select", key: "V", color: "#3b82f6" },
      { id: "pen", Icon: Pen, name: "Pen", key: "P", color: "#8b5cf6" },
      { id: "highlighter", Icon: Highlighter, name: "Marker", key: "H", color: "#f59e0b" },
      { id: "eraser", Icon: Eraser, name: "Eraser", key: "E", color: "#ef4444" },
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
      { id: "table-2x2", Icon: Grid2x2, name: "2Ã—2 Table", rows: 2, cols: 2, color: "#6366f1" },
      { id: "table-3x3", Icon: Grid3x3, name: "3Ã—3 Table", rows: 3, cols: 3, color: "#8b5cf6" },
      { id: "table-4x4", Icon: MoreHorizontal, name: "4Ã—4 Table", rows: 4, cols: 4, color: "#a855f7" },
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

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const bg = bgRef.current;
    if (!canvas || !overlay || !bg) return;

    const w = window.innerWidth - 352; // Account for sidebars (72px + 280px)
    const h = window.innerHeight - 56; // Account for bottom bar only (56px, no header)

    canvas.width = overlay.width = bg.width = w;
    canvas.height = overlay.height = bg.height = h;

    const c = canvas.getContext("2d");
    const o = overlay.getContext("2d");
    const b = bg.getContext("2d");
    
    c.lineCap = o.lineCap = "round";
    c.lineJoin = o.lineJoin = "round";

    setCtx(c);
    setOverlayCtx(o);
    setBgCtx(b);

    drawBackground(b, w, h);
    saveHistory();
    
    // Load user projects
    loadUserProjects();
  }, []);

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
    // Placeholder chart - you can enhance this
    const x = 100;
    const y = 100;
    const w = 300;
    const h = 200;
    
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    
    // Simple bar chart visualization
    if (chartType.id === "bar-chart") {
      const bars = [0.6, 0.8, 0.5, 0.9, 0.7];
      const barWidth = w / (bars.length * 2);
      bars.forEach((height, i) => {
        const barX = x + i * barWidth * 2 + barWidth / 2;
        const barHeight = height * (h - 40);
        ctx.fillStyle = currentColor;
        ctx.fillRect(barX, y + h - barHeight - 20, barWidth, barHeight);
      });
    }
    
    ctx.fillStyle = "#64748b";
    ctx.font = "14px Arial";
    ctx.fillText(chartType.name, x + 10, y + 20);
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
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
      y: (e.clientY || e.touches?.[0]?.clientY) - rect.top
    };
  };

  const startDrawing = (e) => {
    const pos = getPos(e);
    
    if (currentTool === "pan" || e.button === 1) {
      setIsPanning(true);
      setPanStart(pos);
      return;
    }

    if (currentTool === "select") {
      // Selection logic
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

    if (isPanning) {
      const dx = pos.x - panStart.x;
      const dy = pos.y - panStart.y;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      setPanStart(pos);
      return;
    }

    if (!isDrawing) return;

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
      color: "#fef3c7"
    }]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 400;
        const maxH = 400;
        let w = img.width;
        let h = img.height;
        
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w *= ratio;
          h *= ratio;
        }
        
        ctx.drawImage(img, 50, 50, w, h);
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
    const link = document.createElement("a");
    link.download = `${projectTitle}.${format}`;
    link.href = canvasRef.current.toDataURL(`image/${format}`);
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

      if (res.ok) alert("âœ… Saved!");
      else alert("âŒ Failed to save");
    } catch (err) {
      alert("âŒ Error saving");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") { e.preventDefault(); undo(); }
        if (e.key === "y") { e.preventDefault(); redo(); }
        if (e.key === "s") { e.preventDefault(); saveProject(); }
      }
      if (e.key === " " && !textInput) {
        e.preventDefault();
        setCurrentTool("pan");
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === " " && currentTool === "pan") setCurrentTool("pen");
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
            <button title="Settings"
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
                            {project.tool} â€¢ {project.category}
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
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#e8eaed" }}>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload}
            accept="image/*" style={{ display: "none" }} />
          
          {/* Active Tool Indicator */}
          {currentTool && currentTool !== "select" && (
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
          
          <div style={{
            position: "absolute", inset: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            borderRadius: "12px", overflow: "hidden"
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
                cursor: currentTool === "pan" ? "grab" : "crosshair"
              }}
            />
            <canvas ref={overlayRef}
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            />

            {/* Sticky Notes */}
            {stickyNotes.map(note => (
              <div key={note.id}
                style={{
                  position: "absolute", left: note.x, top: note.y,
                  background: note.color, padding: "12px", borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)", minWidth: "150px",
                  maxWidth: "200px", fontSize: "13px", fontFamily: "'Comic Sans MS', cursive",
                  transform: "rotate(-2deg)", cursor: "move"
                }}
                onDoubleClick={() => {
                  const text = prompt("Edit note:", note.text);
                  if (text !== null) {
                    setStickyNotes(stickyNotes.map(n =>
                      n.id === note.id ? { ...n, text } : n
                    ));
                  }
                }}
              >
                {note.text}
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
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            color: "#666", fontSize: "13px", fontWeight: 500,
            padding: "6px 12px", borderRadius: "6px", transition: "all 0.2s"
          }}
            onMouseEnter={e => e.target.style.background = "#f5f5f5"}
            onMouseLeave={e => e.target.style.background = "none"}
          >
            <FileEdit size={16} /> Notes
          </button>
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            color: "#666", fontSize: "13px", fontWeight: 500,
            padding: "6px 12px", borderRadius: "6px", transition: "all 0.2s"
          }}
            onMouseEnter={e => e.target.style.background = "#f5f5f5"}
            onMouseLeave={e => e.target.style.background = "none"}
          >
            <Clock size={16} /> Timer
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
                opacity: historyStep <= 0 ? 0.5 : 1
              }}
              onMouseEnter={e => {
                if (historyStep > 0) e.target.style.background = "#f8fafc";
              }}
              onMouseLeave={e => {
                if (historyStep > 0) e.target.style.background = "#fff";
              }}
            >
              â†¶ Undo
            </button>
            <button onClick={redo} disabled={historyStep >= history.length - 1}
              title="Redo (Ctrl+Y)"
              style={{
                background: historyStep >= history.length - 1 ? "#f8fafc" : "#fff",
                border: "1px solid #e0e0e0",
                padding: "6px 10px", borderRadius: "6px", cursor: historyStep >= history.length - 1 ? "not-allowed" : "pointer",
                fontSize: "13px", color: historyStep >= history.length - 1 ? "#cbd5e1" : "#64748b",
                fontWeight: 600, transition: "all 0.2s",
                opacity: historyStep >= history.length - 1 ? 0.5 : 1
              }}
              onMouseEnter={e => {
                if (historyStep < history.length - 1) e.target.style.background = "#f8fafc";
              }}
              onMouseLeave={e => {
                if (historyStep < history.length - 1) e.target.style.background = "#fff";
              }}
            >
              Redo â†·
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
          <input type="range" min="10" max="200" value={zoom * 100}
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
          <button onClick={() => exportImage("png")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "6px", color: "#666",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "6px", transition: "all 0.2s"
            }}
            title="Export"
            onMouseEnter={e => e.target.style.background = "#f5f5f5"}
            onMouseLeave={e => e.target.style.background = "none"}
          >
            <Maximize size={16} color="#64748b" />
          </button>
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "6px", color: "#666",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "6px", transition: "all 0.2s"
          }}
            title="Help"
            onMouseEnter={e => e.target.style.background = "#f5f5f5"}
            onMouseLeave={e => e.target.style.background = "none"}
          >
            <HelpCircle size={16} color="#64748b" />
          </button>
        </div>
      </div>
    </div>
  );
}
