import { useState, useRef, useEffect } from "react";
import THEME from "../theme";

export default function Whiteboard({ onBack, user, initialProject }) {
  // Canvas and drawing state
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [overlayCtx, setOverlayCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState("pen");
  const [currentColor, setCurrentColor] = useState("#942945");
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  
  // Shape drawing
  const [startPos, setStartPos] = useState(null);
  
  // Sticky notes
  const [stickyNotes, setStickyNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Text tool
  const [textInput, setTextInput] = useState(null);
  
  // Zoom and pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  
  // UI state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [projectTitle, setProjectTitle] = useState(initialProject?.title || "Untitled Whiteboard");

  // Preset colors
  const presetColors = [
    "#942945", "#e1496d", "#ec4899", "#f472b6",
    "#000000", "#374151", "#6b7280", "#9ca3af",
    "#ef4444", "#f97316", "#f59e0b", "#eab308",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"
  ];

  // Tools configuration
  const tools = [
    { id: "pen", icon: "✏️", label: "Pen", hotkey: "P" },
    { id: "highlighter", icon: "🖍️", label: "Highlighter", hotkey: "H" },
    { id: "eraser", icon: "🧹", label: "Eraser", hotkey: "E" },
    { id: "line", icon: "📏", label: "Line", hotkey: "L" },
    { id: "arrow", icon: "➡️", label: "Arrow", hotkey: "A" },
    { id: "rectangle", icon: "▭", label: "Rectangle", hotkey: "R" },
    { id: "circle", icon: "○", label: "Circle", hotkey: "C" },
    { id: "text", icon: "T", label: "Text", hotkey: "T" },
    { id: "sticky", icon: "📝", label: "Sticky Note", hotkey: "S" },
    { id: "pan", icon: "✋", label: "Pan", hotkey: "Space" }
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlayCanvas.width = window.innerWidth;
    overlayCanvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    const overlayContext = overlayCanvas.getContext("2d");
    
    context.lineCap = "round";
    context.lineJoin = "round";
    overlayContext.lineCap = "round";
    overlayContext.lineJoin = "round";

    setCtx(context);
    setOverlayCtx(overlayContext);

    // Draw grid background
    drawGrid(context);
    
    // Load initial project if provided
    if (initialProject?.data?.imageData) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        saveToHistory();
      };
      img.src = initialProject.data.imageData;
    } else {
      saveToHistory();
    }

    // Handle window resize
    const handleResize = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      overlayCanvas.width = window.innerWidth;
      overlayCanvas.height = window.innerHeight;
      context.putImageData(imageData, 0, 0);
      drawGrid(context);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw grid background
  const drawGrid = (context) => {
    const gridSize = 20;
    context.strokeStyle = "rgba(0,0,0,0.05)";
    context.lineWidth = 1;

    for (let x = 0; x < context.canvas.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, context.canvas.height);
      context.stroke();
    }
    for (let y = 0; y < context.canvas.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(context.canvas.width, y);
      context.stroke();
    }
  };

  // Save canvas state to history
  const saveToHistory = () => {
    if (!ctx) return;
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawGrid(ctx);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyStep - 1];
    }
  };

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawGrid(ctx);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyStep + 1];
    }
  };

  // Get mouse/touch position
  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
  };

  // Start drawing
  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getPosition(e);

    if (currentTool === "pan" || e.button === 1 || (e.shiftKey && e.button === 0)) {
      setIsPanning(true);
      setPanStart(pos);
      return;
    }

    if (currentTool === "sticky") {
      addStickyNote(pos);
      return;
    }

    if (currentTool === "text") {
      setTextInput({ x: pos.x, y: pos.y, text: "" });
      return;
    }

    setIsDrawing(true);
    setStartPos(pos);

    if (currentTool === "pen" || currentTool === "highlighter" || currentTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  // Drawing
  const draw = (e) => {
    e.preventDefault();
    const pos = getPosition(e);

    if (isPanning && panStart) {
      const dx = pos.x - panStart.x;
      const dy = pos.y - panStart.y;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      setPanStart(pos);
      return;
    }

    if (!isDrawing) return;

    // Clear overlay for preview
    overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);

    if (currentTool === "pen") {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = 1;
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
      drawArrowPreview(overlayCtx, startPos, pos);
    } else if (currentTool === "rectangle") {
      overlayCtx.strokeStyle = currentColor;
      overlayCtx.lineWidth = lineWidth;
      overlayCtx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      overlayCtx.strokeStyle = currentColor;
      overlayCtx.lineWidth = lineWidth;
      overlayCtx.beginPath();
      overlayCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      overlayCtx.stroke();
    }
  };

  // Stop drawing
  const stopDrawing = (e) => {
    e?.preventDefault();
    
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      return;
    }

    if (!isDrawing) return;

    const pos = getPosition(e);

    // Finalize shape on main canvas
    if (currentTool === "line") {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === "arrow") {
      drawArrowPreview(ctx, startPos, pos);
    } else if (currentTool === "rectangle") {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Clear overlay
    overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);

    setIsDrawing(false);
    setStartPos(null);
    ctx.globalAlpha = 1;
    saveToHistory();
  };

  // Draw arrow helper
  const drawArrowPreview = (context, from, to) => {
    const headLength = 20;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);

    context.strokeStyle = currentColor;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();

    // Arrow head
    context.beginPath();
    context.moveTo(to.x, to.y);
    context.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(to.x, to.y);
    context.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    context.stroke();
  };

  // Add sticky note
  const addStickyNote = (pos) => {
    const newNote = {
      id: Date.now(),
      x: pos.x,
      y: pos.y,
      text: "Double-click to edit",
      color: "#fef3c7"
    };
    setStickyNotes([...stickyNotes, newNote]);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (window.confirm("Clear the entire whiteboard? This cannot be undone.")) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawGrid(ctx);
      setStickyNotes([]);
      saveToHistory();
    }
  };

  // Export as image
  const exportImage = (format = "png") => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `${projectTitle}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
    setShowExportMenu(false);
  };

  // Save project
  const saveProject = async () => {
    if (!user) {
      alert("Please sign in to save your work!");
      return;
    }

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    const projectData = {
      id: initialProject?.id || `whiteboard_${Date.now()}`,
      title: projectTitle,
      category: "Design",
      tool: "Whiteboard",
      year: new Date().getFullYear().toString(),
      accent: "#be185d",
      gradient: "linear-gradient(135deg, #be185d 0%, #e11d48 50%, #be185d 100%)",
      image: imageData.substring(0, 100) + "...",
      icon: "✏️",
      tags: ["whiteboard", "drawing", "design"],
      description: "Collaborative whiteboard",
      data: { imageData, stickyNotes }
    };

    try {
      const token = localStorage.getItem("creatify_token");
      const response = await fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        alert("✅ Whiteboard saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save. Please try again.");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          undo();
        } else if (e.key === "y" || (e.shiftKey && e.key === "Z")) {
          e.preventDefault();
          redo();
        } else if (e.key === "s") {
          e.preventDefault();
          saveProject();
        }
      }
      // Tool shortcuts
      if (e.key === "p") setCurrentTool("pen");
      if (e.key === "h") setCurrentTool("highlighter");
      if (e.key === "e") setCurrentTool("eraser");
      if (e.key === "l") setCurrentTool("line");
      if (e.key === "a") setCurrentTool("arrow");
      if (e.key === "r") setCurrentTool("rectangle");
      if (e.key === "c") setCurrentTool("circle");
      if (e.key === " " && !textInput) {
        e.preventDefault();
        setCurrentTool("pan");
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === " " && currentTool === "pan") {
        setCurrentTool("pen");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [historyStep, history, currentTool, textInput]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#f8fafc",
      display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif"
    }}>
      {/* Top Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px", background: "#ffffff",
        borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        zIndex: 100
      }}>
        {/* Left: Back button & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={onBack} style={{
            background: "none", border: "none", fontSize: "20px",
            cursor: "pointer", padding: "8px", borderRadius: "8px",
            transition: "background 0.2s", display: "flex", alignItems: "center"
          }}
            onMouseEnter={e => e.target.style.background = "#f1f5f9"}
            onMouseLeave={e => e.target.style.background = "none"}
          >
            ←
          </button>
          <input type="text" value={projectTitle}
            onChange={e => setProjectTitle(e.target.value)}
            style={{
              border: "none", fontSize: "16px", fontWeight: 600,
              color: "#1e293b", background: "none", outline: "none",
              width: "300px"
            }}
          />
        </div>

        {/* Center: Tools */}
        <div style={{
          display: "flex", gap: "8px", background: "#f8fafc",
          padding: "6px", borderRadius: "12px", border: "1px solid #e2e8f0"
        }}>
          {tools.map(tool => (
            <button key={tool.id}
              onClick={() => setCurrentTool(tool.id)}
              title={`${tool.label} (${tool.hotkey})`}
              style={{
                background: currentTool === tool.id ? "#942945" : "transparent",
                color: currentTool === tool.id ? "#fff" : "#64748b",
                border: "none", padding: "10px 14px", borderRadius: "8px",
                fontSize: "18px", cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onMouseEnter={e => {
                if (currentTool !== tool.id) e.target.style.background = "#e2e8f0";
              }}
              onMouseLeave={e => {
                if (currentTool !== tool.id) e.target.style.background = "transparent";
              }}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Undo/Redo */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={undo} disabled={historyStep <= 0}
              style={{
                background: "none", border: "1px solid #e2e8f0",
                padding: "8px 12px", borderRadius: "8px", fontSize: "14px",
                cursor: historyStep <= 0 ? "not-allowed" : "pointer",
                opacity: historyStep <= 0 ? 0.5 : 1, transition: "all 0.2s"
              }}
              onMouseEnter={e => { if (historyStep > 0) e.target.style.background = "#f1f5f9"; }}
              onMouseLeave={e => e.target.style.background = "none"}
            >
              ↶
            </button>
            <button onClick={redo} disabled={historyStep >= history.length - 1}
              style={{
                background: "none", border: "1px solid #e2e8f0",
                padding: "8px 12px", borderRadius: "8px", fontSize: "14px",
                cursor: historyStep >= history.length - 1 ? "not-allowed" : "pointer",
                opacity: historyStep >= history.length - 1 ? 0.5 : 1, transition: "all 0.2s"
              }}
              onMouseEnter={e => { if (historyStep < history.length - 1) e.target.style.background = "#f1f5f9"; }}
              onMouseLeave={e => e.target.style.background = "none"}
            >
              ↷
            </button>
          </div>

          {/* Clear */}
          <button onClick={clearCanvas}
            style={{
              background: "none", border: "1px solid #e2e8f0",
              padding: "8px 16px", borderRadius: "8px", fontSize: "13px",
              cursor: "pointer", transition: "all 0.2s", fontWeight: 500,
              color: "#ef4444"
            }}
            onMouseEnter={e => e.target.style.background = "#fef2f2"}
            onMouseLeave={e => e.target.style.background = "none"}
          >
            🗑️ Clear
          </button>

          {/* Export */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowExportMenu(!showExportMenu)}
              style={{
                background: "none", border: "1px solid #e2e8f0",
                padding: "8px 16px", borderRadius: "8px", fontSize: "13px",
                cursor: "pointer", transition: "all 0.2s", fontWeight: 500
              }}
              onMouseEnter={e => e.target.style.background = "#f1f5f9"}
              onMouseLeave={e => e.target.style.background = "none"}
            >
              💾 Export
            </button>
            {showExportMenu && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: "12px", padding: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 1000, minWidth: "150px"
              }}>
                <button onClick={() => exportImage("png")}
                  style={{
                    width: "100%", textAlign: "left", padding: "10px 12px",
                    background: "none", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontSize: "13px", fontWeight: 500, transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.background = "#f1f5f9"}
                  onMouseLeave={e => e.target.style.background = "none"}
                >
                  PNG Image
                </button>
                <button onClick={() => exportImage("jpg")}
                  style={{
                    width: "100%", textAlign: "left", padding: "10px 12px",
                    background: "none", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontSize: "13px", fontWeight: 500, transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.background = "#f1f5f9"}
                  onMouseLeave={e => e.target.style.background = "none"}
                >
                  JPG Image
                </button>
              </div>
            )}
          </div>

          {/* Save */}
          <button onClick={saveProject}
            style={{
              background: "linear-gradient(135deg, #942945, #e1496d)",
              color: "#fff", border: "none", padding: "8px 20px",
              borderRadius: "8px", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(148,41,69,0.2)"
            }}
            onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.target.style.transform = "none"}
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Secondary Toolbar - Color & Size */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "12px 20px", background: "#ffffff",
        borderBottom: "1px solid #e2e8f0", gap: "24px", zIndex: 99
      }}>
        {/* Color Picker */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Color:</span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "400px" }}>
            {presetColors.map(color => (
              <button key={color}
                onClick={() => setCurrentColor(color)}
                style={{
                  width: "28px", height: "28px", borderRadius: "6px",
                  background: color, border: currentColor === color ? "3px solid #942945" : "2px solid #e2e8f0",
                  cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
                onMouseEnter={e => e.target.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
              />
            ))}
          </div>
        </div>

        {/* Line Width */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Size:</span>
          <input type="range" min="1" max="20" value={lineWidth}
            onChange={e => setLineWidth(Number(e.target.value))}
            style={{ width: "120px", cursor: "pointer" }}
          />
          <span style={{
            fontSize: "12px", fontWeight: 600, color: "#1e293b",
            background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px",
            minWidth: "35px", textAlign: "center"
          }}>
            {lineWidth}
          </span>
        </div>

        {/* Zoom */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            style={{
              background: "none", border: "1px solid #e2e8f0",
              padding: "6px 12px", borderRadius: "6px", fontSize: "14px",
              cursor: "pointer", fontWeight: 600
            }}
          >
            −
          </button>
          <span style={{
            fontSize: "12px", fontWeight: 600, color: "#1e293b",
            minWidth: "60px", textAlign: "center"
          }}>
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            style={{
              background: "none", border: "1px solid #e2e8f0",
              padding: "6px 12px", borderRadius: "6px", fontSize: "14px",
              cursor: "pointer", fontWeight: 600
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div style={{
        flex: 1, position: "relative", overflow: "hidden",
        cursor: currentTool === "pan" || isPanning ? "grab" : 
               currentTool === "eraser" ? "crosshair" : "crosshair"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: "0 0", transition: isPanning ? "none" : "transform 0.2s"
        }}>
          {/* Main Canvas */}
          <canvas ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          
          {/* Overlay Canvas for preview */}
          <canvas ref={overlayCanvasRef}
            style={{
              position: "absolute", top: 0, left: 0,
              pointerEvents: "none"
            }}
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
                const newText = prompt("Edit note:", note.text);
                if (newText !== null) {
                  setStickyNotes(stickyNotes.map(n => 
                    n.id === note.id ? { ...n, text: newText } : n
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
                  ctx.font = `${lineWidth * 8}px Arial`;
                  ctx.fillText(textInput.text, textInput.x, textInput.y);
                  saveToHistory();
                }
                setTextInput(null);
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (textInput.text.trim()) {
                    ctx.fillStyle = currentColor;
                    ctx.font = `${lineWidth * 8}px Arial`;
                    ctx.fillText(textInput.text, textInput.x, textInput.y);
                    saveToHistory();
                  }
                  setTextInput(null);
                }
              }}
              style={{
                position: "absolute", left: textInput.x, top: textInput.y - 20,
                border: "2px solid #942945", padding: "8px", borderRadius: "6px",
                fontSize: `${lineWidth * 8}px`, fontFamily: "Arial",
                color: currentColor, background: "rgba(255,255,255,0.95)",
                outline: "none", zIndex: 1000
              }}
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 20px", background: "#f8fafc",
        borderTop: "1px solid #e2e8f0", fontSize: "12px", color: "#64748b"
      }}>
        <div>Tool: <strong>{currentTool}</strong></div>
        <div>Color: <strong style={{ color: currentColor }}>{currentColor}</strong></div>
        <div>Size: <strong>{lineWidth}px</strong></div>
        <div>Zoom: <strong>{Math.round(zoom * 100)}%</strong></div>
      </div>
    </div>
  );
}
