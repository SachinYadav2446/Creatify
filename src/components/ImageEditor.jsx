import { useState, useRef, useEffect, useCallback, useReducer } from "react";

// ── Stock Images ──────────────────────────────────────────────────────────────
const STOCK_IMAGES = [
  { id:"s1", name:"Ocean Sunset",  url:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { id:"s2", name:"Tokyo Neon",    url:"https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" },
  { id:"s3", name:"Mountain Peak", url:"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80" },
  { id:"s4", name:"Forest Path",   url:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80" },
  { id:"s5", name:"Desert Dune",   url:"https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=80" },
  { id:"s6", name:"Neon Abstract", url:"https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80" },
  { id:"s7", name:"City Lights",   url:"https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80" },
  { id:"s8", name:"Waterfall",     url:"https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80" },
];

const LUTS = [
  { id:"none",    name:"Original",      br:100,co:100,sa:100,hu:0, bl:0,se:0,vi:0 },
  { id:"vintage", name:"Vintage Warm",  br:105,co:115,sa:85, hu:12,bl:0,se:30,vi:40 },
  { id:"neon",    name:"Cyber Neon",    br:110,co:130,sa:170,hu:-15,bl:0,se:0,vi:20 },
  { id:"noir",    name:"Mono Noir",     br:90, co:145,sa:0,  hu:0, bl:0,se:0,vi:55 },
  { id:"cross",   name:"Cross Process", br:100,co:140,sa:130,hu:30,bl:0,se:0,vi:30 },
  { id:"faded",   name:"Faded Film",    br:108,co:85, sa:70, hu:8, bl:0.5,se:20,vi:25 },
  { id:"matte",   name:"Matte Black",   br:92, co:100,sa:60, hu:0, bl:0,se:0,vi:60 },
  { id:"pastel",  name:"Pastel Dream",  br:115,co:90, sa:80, hu:-8,bl:0.3,se:10,vi:0 },
];

const FONTS = ["Syne","Poppins","Outfit","Playfair Display","Space Grotesk","Inter","DM Serif Display"];
const BLEND_MODES = ["source-over","multiply","screen","overlay","soft-light","hard-light","color-dodge","difference"];
const BLEND_LABELS = ["Normal","Multiply","Screen","Overlay","Soft Light","Hard Light","Color Dodge","Difference"];
const CANVAS_PRESETS = [
  { id:"hd",    name:"16:9 HD",    w:1280, h:720  },
  { id:"sq",    name:"1:1 Square", w:1080, h:1080 },
  { id:"port",  name:"4:5 Portrait",w:1080,h:1350 },
  { id:"a4",    name:"A4 Print",   w:794,  h:1123 },
  { id:"wide",  name:"Wide 21:9",  w:1280, h:549  },
];

let _lid = 1;
const uid = () => `layer_${_lid++}_${Math.random().toString(36).slice(2,6)}`;

// ── Reducer ───────────────────────────────────────────────────────────────────
function layerReducer(state, action) {
  switch(action.type) {
    case "SET_LAYERS": return { ...state, layers: action.layers, history: [...state.history.slice(-19), state.layers] };
    case "ADD_LAYER":  return { ...state, layers: [action.layer, ...state.layers], history: [...state.history.slice(-19), state.layers] };
    case "UPDATE_LAYER": return {
      ...state,
      layers: state.layers.map(l => l.id === action.id ? { ...l, ...action.patch } : l),
      history: [...state.history.slice(-19), state.layers]
    };
    case "DELETE_LAYER": return {
      ...state,
      layers: state.layers.filter(l => l.id !== action.id),
      history: [...state.history.slice(-19), state.layers]
    };
    case "REORDER": {
      const newLayers = [...state.layers];
      const [removed] = newLayers.splice(action.from, 1);
      newLayers.splice(action.to, 0, removed);
      return { ...state, layers: newLayers, history: [...state.history.slice(-19), state.layers] };
    }
    case "UNDO": {
      if (!state.history.length) return state;
      const prev = state.history[state.history.length - 1];
      return { ...state, layers: prev, history: state.history.slice(0,-1), future: [state.layers, ...state.future.slice(0,19)] };
    }
    case "REDO": {
      if (!state.future.length) return state;
      const next = state.future[0];
      return { ...state, layers: next, future: state.future.slice(1), history: [...state.history.slice(-19), state.layers] };
    }
    case "LOAD": return { layers: action.layers, history: [], future: [] };
    default: return state;
  }
}

export default function ImageEditor({ onBack, user, initialProject }) {
  const [projectTitle, setProjectTitle] = useState(initialProject?.title || "Untitled Artwork");
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Tool state
  const [activeTool, setActiveTool] = useState("select");
  const [brushColor, setBrushColor] = useState("#e1496d");
  const [brushSize, setBrushSize] = useState(12);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [shapeType, setShapeType] = useState("rect");
  const [shapeColor, setShapeColor] = useState("#e1496d");
  const [shapeFill, setShapeFill] = useState(true);
  const [shapeStrokeColor, setShapeStrokeColor] = useState("#ffffff");
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);
  const [textInput, setTextInput] = useState("Your Text");
  const [textFont, setTextFont] = useState("Syne");
  const [textSize, setTextSize] = useState(32);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);

  // Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [activeLut, setActiveLut] = useState("none");

  // Layer state
  const [layerState, layerDispatch] = useReducer(layerReducer, { layers: [], history: [], future: [] });
  const { layers } = layerState;
  const [activeLayerId, setActiveLayerId] = useState(null);

  // Canvas/zoom
  const [zoom, setZoom] = useState(0.75);
  const [canvasW, setCanvasW] = useState(1280);
  const [canvasH, setCanvasH] = useState(720);
  const [exportFormat, setExportFormat] = useState("png");
  const [exportQuality, setExportQuality] = useState(92);

  // UI state
  const [leftTab, setLeftTab] = useState("assets");
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isPaintingRef = useRef(false);
  const shapeStartRef = useRef(null);
  const lastPosRef = useRef({ x:0, y:0 });
  const isDraggingLayerRef = useRef(false);
  const dragOffsetRef = useRef({ x:0, y:0 });
  const activeDrawPathRef = useRef([]);
  const animFrameRef = useRef(null);
  const vignetteCanvasRef = useRef(null);
  const shapePreviewRef = useRef(null); // { start, current }

  // ── Load initial project ───────────────────────────────────────────────────
  useEffect(() => {
    if (initialProject?.data?.layers?.length) {
      const loaded = initialProject.data.layers.map(l => {
        if (l.type === "image" && l.url) {
          const img = new Image(); img.crossOrigin = "anonymous"; img.src = l.url;
          return { ...l, imgEl: img };
        }
        return l;
      });
      layerDispatch({ type: "LOAD", layers: loaded });
      setActiveLayerId(loaded[0]?.id || null);
      if (initialProject.data.adj) {
        const a = initialProject.data.adj;
        setBrightness(a.brightness ?? 100); setContrast(a.contrast ?? 100);
        setSaturation(a.saturation ?? 100); setHue(a.hue ?? 0);
        setBlur(a.blur ?? 0); setSepia(a.sepia ?? 0); setVignette(a.vignette ?? 0);
      }
    } else {
      // Seed with a stock image layer
      const img = new Image(); img.crossOrigin = "anonymous";
      img.src = STOCK_IMAGES[0].url;
      img.onload = () => {
        const id = uid();
        layerDispatch({ type: "ADD_LAYER", layer: { id, name: "Background", type:"image", url: STOCK_IMAGES[0].url, imgEl: img, visible:true, locked:false, opacity:1, blendMode:"source-over", x:0, y:0, width: canvasW, height: canvasH } });
        setActiveLayerId(id);
      };
    }
  }, []);

  // ── Canvas Render Loop ─────────────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Checkerboard background
    const sq = 16;
    for (let y = 0; y < canvas.height; y += sq) {
      for (let x = 0; x < canvas.width; x += sq) {
        ctx.fillStyle = (Math.floor(x/sq) + Math.floor(y/sq)) % 2 === 0 ? "#2a2a2a" : "#1e1e1e";
        ctx.fillRect(x, y, sq, sq);
      }
    }

    // Draw layers bottom-to-top (last in array = bottom)
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      if (!layer.visible) continue;
      ctx.save();
      ctx.globalAlpha = layer.opacity ?? 1;
      ctx.globalCompositeOperation = layer.blendMode || "source-over";

      if (layer.type === "image" && layer.imgEl?.complete) {
        ctx.drawImage(layer.imgEl, layer.x ?? 0, layer.y ?? 0, layer.width || canvas.width, layer.height || canvas.height);
      } else if (layer.type === "draw" && layer.strokes) {
        layer.strokes.forEach(stroke => {
          ctx.save();
          ctx.globalAlpha = stroke.opacity ?? 1;
          ctx.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.size;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          stroke.pts.forEach((pt, j) => j === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
          ctx.stroke();
          ctx.restore();
        });
      } else if (layer.type === "text") {
        const weight = layer.bold ? "bold " : "";
        const style = layer.italic ? "italic " : "";
        ctx.font = `${style}${weight}${layer.size || 32}px '${layer.font || "Poppins"}', sans-serif`;
        ctx.fillStyle = layer.color || "#ffffff";
        ctx.textBaseline = "top";
        ctx.fillText(layer.text || "", layer.x ?? 100, layer.y ?? 100);
      } else if (layer.type === "shape") {
        drawShape(ctx, layer);
      }
      ctx.restore();
    }

    // Shape preview while drawing
    if (shapePreviewRef.current && activeTool === "shape") {
      const { start, current } = shapePreviewRef.current;
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "#e1496d";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(Math.min(start.x, current.x), Math.min(start.y, current.y), Math.abs(current.x - start.x), Math.abs(current.y - start.y));
      ctx.restore();
    }

    // Selection handles
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (activeLayer && activeLayer.visible) {
      drawSelection(ctx, activeLayer, canvas);
    }

    // Vignette overlay
    if (vignette > 0) {
      const vCtx = ctx;
      const grad = vCtx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.width*0.3, canvas.width/2, canvas.height/2, canvas.width*0.9);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, `rgba(0,0,0,${vignette/100})`);
      vCtx.save();
      vCtx.globalCompositeOperation = "source-over";
      vCtx.fillStyle = grad;
      vCtx.fillRect(0, 0, canvas.width, canvas.height);
      vCtx.restore();
    }
  }, [layers, activeLayerId, activeTool, vignette]);

  function drawShape(ctx, layer) {
    const { shapeKind, x, y, width, height, color, strokeColor, strokeWidth, filled } = layer;
    ctx.beginPath();
    if (shapeKind === "circle") {
      ctx.ellipse((x||0)+(width||80)/2, (y||0)+(height||80)/2, (width||80)/2, (height||80)/2, 0, 0, Math.PI*2);
    } else if (shapeKind === "triangle") {
      ctx.moveTo((x||0)+(width||80)/2, y||0);
      ctx.lineTo((x||0)+(width||80), (y||0)+(height||80));
      ctx.lineTo(x||0, (y||0)+(height||80));
      ctx.closePath();
    } else if (shapeKind === "star") {
      const cx = (x||0)+(width||80)/2, cy = (y||0)+(height||80)/2;
      const outerR = Math.min((width||80),(height||80))/2;
      const innerR = outerR*0.4;
      for (let i = 0; i < 10; i++) {
        const angle = (i*Math.PI/5) - Math.PI/2;
        const r = i%2===0 ? outerR : innerR;
        i===0 ? ctx.moveTo(cx+r*Math.cos(angle), cy+r*Math.sin(angle)) : ctx.lineTo(cx+r*Math.cos(angle), cy+r*Math.sin(angle));
      }
      ctx.closePath();
    } else if (shapeKind === "rounded") {
      const r = 12;
      const lx=x||0, ly=y||0, lw=width||80, lh=height||80;
      ctx.moveTo(lx+r, ly); ctx.lineTo(lx+lw-r, ly);
      ctx.quadraticCurveTo(lx+lw, ly, lx+lw, ly+r);
      ctx.lineTo(lx+lw, ly+lh-r);
      ctx.quadraticCurveTo(lx+lw, ly+lh, lx+lw-r, ly+lh);
      ctx.lineTo(lx+r, ly+lh);
      ctx.quadraticCurveTo(lx, ly+lh, lx, ly+lh-r);
      ctx.lineTo(lx, ly+r);
      ctx.quadraticCurveTo(lx, ly, lx+r, ly);
      ctx.closePath();
    } else if (shapeKind === "line") {
      ctx.moveTo(x||0, y||0); ctx.lineTo((x||0)+(width||80), (y||0)+(height||80));
    } else {
      ctx.rect(x||0, y||0, width||80, height||80);
    }
    if (filled !== false && shapeKind !== "line") { ctx.fillStyle = color||"#e1496d"; ctx.fill(); }
    if (strokeWidth > 0) { ctx.strokeStyle = strokeColor||"#ffffff"; ctx.lineWidth = strokeWidth||2; ctx.stroke(); }
  }

  function drawSelection(ctx, layer, canvas) {
    let x=0, y=0, w=80, h=80;
    if (layer.type==="image") { x=layer.x||0; y=layer.y||0; w=layer.width||canvas.width; h=layer.height||canvas.height; }
    else if (layer.type==="text") {
      ctx.font = `${layer.size||32}px '${layer.font||"Poppins"}'`;
      w = ctx.measureText(layer.text||"").width + 8;
      h = (layer.size||32) + 8;
      x = (layer.x||0)-4; y = (layer.y||0)-4;
    }
    else if (layer.type==="shape"||layer.type==="draw") { x=layer.x||0; y=layer.y||0; w=layer.width||80; h=layer.height||80; }
    ctx.save();
    ctx.setLineDash([6,3]);
    ctx.strokeStyle = "#e1496d";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
    // Corner handles
    [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach(([hx,hy]) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(hx-4, hy-4, 8, 8);
      ctx.strokeStyle = "#e1496d";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.strokeRect(hx-4, hy-4, 8, 8);
    });
    ctx.restore();
  }

  // Apply CSS filter to canvas element for global adjustments
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px) sepia(${sepia}%)`;
  }, [brightness, contrast, saturation, hue, blur, sepia]);

  useEffect(() => {
    const loop = () => { render(); animFrameRef.current = requestAnimationFrame(loop); };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [render]);

  // ── Canvas Coordinate Conversion ───────────────────────────────────────────
  const getCanvasPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x:0, y:0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  // ── Mouse Handlers ─────────────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    e.preventDefault();
    const pos = getCanvasPos(e);

    if (activeTool === "select") {
      // Hit-test layers top to bottom
      const hit = layers.find(l => {
        if (!l.visible || l.locked) return false;
        const lx = l.x||0, ly = l.y||0, lw = l.width||(l.type==="text"?200:80), lh = l.height||(l.type==="text"?(l.size||32):80);
        return pos.x >= lx && pos.x <= lx+lw && pos.y >= ly && pos.y <= ly+lh;
      });
      if (hit) {
        setActiveLayerId(hit.id);
        isDraggingLayerRef.current = true;
        dragOffsetRef.current = { x: pos.x - (hit.x||0), y: pos.y - (hit.y||0) };
      }
    } else if (activeTool === "brush" || activeTool === "eraser") {
      isPaintingRef.current = true;
      lastPosRef.current = pos;
      activeDrawPathRef.current = [pos];
      // Ensure there's a draw layer active
      const active = layers.find(l => l.id === activeLayerId);
      if (!active || active.type !== "draw") {
        const id = uid();
        layerDispatch({ type: "ADD_LAYER", layer: { id, name: "Paint Layer", type:"draw", visible:true, locked:false, opacity:1, blendMode:"source-over", x:0,y:0, width:canvasW, height:canvasH, strokes:[] } });
        setActiveLayerId(id);
      }
    } else if (activeTool === "shape") {
      shapeStartRef.current = pos;
      shapePreviewRef.current = { start: pos, current: pos };
    } else if (activeTool === "text") {
      const id = uid();
      layerDispatch({ type: "ADD_LAYER", layer: { id, name: textInput.slice(0,12)||"Text", type:"text", text:textInput, font:textFont, size:textSize, color:textColor, bold:textBold, italic:textItalic, visible:true, locked:false, opacity:1, blendMode:"source-over", x: pos.x, y: pos.y } });
      setActiveLayerId(id);
    } else if (activeTool === "eyedropper") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const px = ctx.getImageData(Math.floor(pos.x), Math.floor(pos.y), 1, 1).data;
      const hex = `#${[px[0],px[1],px[2]].map(v=>v.toString(16).padStart(2,'0')).join('')}`;
      setBrushColor(hex);
      setShapeColor(hex);
    }
  };

  const handleMouseMove = (e) => {
    const pos = getCanvasPos(e);

    if (activeTool === "select" && isDraggingLayerRef.current) {
      const newX = pos.x - dragOffsetRef.current.x;
      const newY = pos.y - dragOffsetRef.current.y;
      layerDispatch({ type: "UPDATE_LAYER", id: activeLayerId, patch: { x: newX, y: newY } });
    } else if ((activeTool === "brush" || activeTool === "eraser") && isPaintingRef.current) {
      activeDrawPathRef.current.push(pos);
      lastPosRef.current = pos;
    } else if (activeTool === "shape" && shapeStartRef.current) {
      shapePreviewRef.current = { start: shapeStartRef.current, current: pos };
    }
  };

  const handleMouseUp = (e) => {
    const pos = getCanvasPos(e);

    if (activeTool === "select") {
      isDraggingLayerRef.current = false;
    } else if ((activeTool === "brush" || activeTool === "eraser") && isPaintingRef.current) {
      isPaintingRef.current = false;
      if (activeDrawPathRef.current.length > 0) {
        const activeLayer = layers.find(l => l.id === activeLayerId && l.type === "draw");
        if (activeLayer) {
          const newStroke = { pts: [...activeDrawPathRef.current], color: brushColor, size: brushSize, opacity: brushOpacity, erase: activeTool === "eraser" };
          layerDispatch({ type: "UPDATE_LAYER", id: activeLayerId, patch: { strokes: [...(activeLayer.strokes||[]), newStroke] } });
        }
      }
      activeDrawPathRef.current = [];
    } else if (activeTool === "shape" && shapeStartRef.current) {
      const start = shapeStartRef.current;
      const w = Math.abs(pos.x - start.x);
      const h = Math.abs(pos.y - start.y);
      if (w > 5 && h > 5) {
        const id = uid();
        layerDispatch({ type: "ADD_LAYER", layer: {
          id, name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
          type:"shape", shapeKind: shapeType,
          x: Math.min(start.x, pos.x), y: Math.min(start.y, pos.y),
          width: w, height: h,
          color: shapeColor, filled: shapeFill, strokeColor: shapeStrokeColor, strokeWidth: shapeStrokeWidth,
          visible:true, locked:false, opacity:1, blendMode:"source-over"
        }});
        setActiveLayerId(id);
      }
      shapeStartRef.current = null;
      shapePreviewRef.current = null;
    }
  };

  // ── Add Image Layer ────────────────────────────────────────────────────────
  const addImageLayer = useCallback((url, w, h, name) => {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => {
      const id = uid();
      const lw = Math.min(w||img.naturalWidth, canvasW);
      const lh = h ? (lw/w)*h : (lw/img.naturalWidth)*img.naturalHeight;
      layerDispatch({ type:"ADD_LAYER", layer:{ id, name: name||"Image Layer", type:"image", url, imgEl:img, visible:true, locked:false, opacity:1, blendMode:"source-over", x:0, y:0, width:lw, height:lh }});
      setActiveLayerId(id);
    };
    img.src = url;
  }, [canvasW, canvasH]);

  const handleFileUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      addImageLayer(url, 0, 0, file.name.replace(/\.[^.]+$/, ""));
    });
    e.target.value = "";
  };

  // ── LUT Presets ────────────────────────────────────────────────────────────
  const applyLut = (lut) => {
    setActiveLut(lut.id);
    setBrightness(lut.br); setContrast(lut.co); setSaturation(lut.sa);
    setHue(lut.hu); setBlur(lut.bl); setSepia(lut.se); setVignette(lut.vi);
  };

  // ── Layer Actions ──────────────────────────────────────────────────────────
  const addDrawLayer = () => {
    const id = uid();
    layerDispatch({ type:"ADD_LAYER", layer:{ id, name:"Paint Layer", type:"draw", visible:true, locked:false, opacity:1, blendMode:"source-over", x:0,y:0, width:canvasW, height:canvasH, strokes:[] }});
    setActiveLayerId(id);
    setActiveTool("brush");
  };

  const addTextLayer = () => {
    const id = uid();
    layerDispatch({ type:"ADD_LAYER", layer:{ id, name:textInput.slice(0,14)||"Text", type:"text", text:textInput, font:textFont, size:textSize, color:textColor, bold:textBold, italic:textItalic, visible:true, locked:false, opacity:1, blendMode:"source-over", x:canvasW/2-100, y:canvasH/2-textSize/2 }});
    setActiveLayerId(id);
  };

  const addShapeLayer = (kind) => {
    const id = uid();
    layerDispatch({ type:"ADD_LAYER", layer:{ id, name:kind.charAt(0).toUpperCase()+kind.slice(1), type:"shape", shapeKind:kind, x:canvasW/2-60, y:canvasH/2-60, width:120, height:120, color:shapeColor, filled:shapeFill, strokeColor:shapeStrokeColor, strokeWidth:shapeStrokeWidth, visible:true, locked:false, opacity:1, blendMode:"source-over" }});
    setActiveLayerId(id);
  };

  const duplicateLayer = (id) => {
    const src = layers.find(l => l.id === id);
    if (!src) return;
    const newId = uid();
    layerDispatch({ type:"ADD_LAYER", layer:{ ...src, id:newId, name:src.name+" Copy", x:(src.x||0)+20, y:(src.y||0)+20 }});
    setActiveLayerId(newId);
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  const triggerExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mime = exportFormat === "jpeg" ? "image/jpeg" : exportFormat === "webp" ? "image/webp" : "image/png";
    const q = exportFormat === "png" ? undefined : exportQuality / 100;
    const url = canvas.toDataURL(mime, q);
    const a = document.createElement("a");
    a.download = `${projectTitle.replace(/\s+/g,"_")}.${exportFormat}`;
    a.href = url; a.click();
  };

  // ── Save & Exit ─────────────────────────────────────────────────────────────
  const handleSaveAndExit = () => {
    const projectId = initialProject?.id || `image_${Date.now()}`;
    const thumbnail = canvasRef.current?.toDataURL("image/jpeg", 0.3) || "";
    const projectData = {
      id: projectId, title: projectTitle.trim() || "Untitled Artwork",
      category:"Image Edit", tool:"Image Editor",
      year: new Date().getFullYear().toString(),
      accent:"#e1496d", gradient:"linear-gradient(135deg,#1e1b18 0%,#30261c 50%,#1a0f14 100%)",
      image: thumbnail, icon:"🖼️",
      tags:["Canvas", `${layers.length} Layers`],
      data: { adj:{brightness,contrast,saturation,hue,blur,sepia,vignette}, layers: layers.map(l=>({...l,imgEl:undefined})) }
    };
    const saved = JSON.parse(localStorage.getItem("creatify_past_works")||"[]");
    const idx = saved.findIndex(w=>w.id===projectId);
    if (idx>-1) saved[idx]=projectData; else saved.unshift(projectData);
    localStorage.setItem("creatify_past_works", JSON.stringify(saved));
    onBack();
  };

  // ── Keyboard Shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
      const k = e.key.toLowerCase();
      if (e.ctrlKey||e.metaKey) {
        if (k==="z") { e.preventDefault(); layerDispatch({ type: e.shiftKey?"REDO":"UNDO" }); }
        if (k==="y") { e.preventDefault(); layerDispatch({ type:"REDO" }); }
        if (k==="d") { e.preventDefault(); if (activeLayerId) duplicateLayer(activeLayerId); }
        return;
      }
      const toolMap = { v:"select", b:"brush", e:"eraser", s:"shape", t:"text", i:"eyedropper", c:"crop" };
      if (toolMap[k]) setActiveTool(toolMap[k]);
      if (k==="[") setBrushSize(s=>Math.max(1,s-2));
      if (k==="]") setBrushSize(s=>Math.min(80,s+2));
      if ((k==="delete"||k==="backspace") && activeLayerId) {
        layerDispatch({ type:"DELETE_LAYER", id:activeLayerId });
        setActiveLayerId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeLayerId]);

  const activeLayer = layers.find(l=>l.id===activeLayerId);

  // ── TAB ICONS ──────────────────────────────────────────────────────────────
  const tabsConfig = [
    { id:"assets",  label:"Assets",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
    { id:"layers",  label:"Layers",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
    { id:"adjust",  label:"Adjust",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg> },
    { id:"shapes",  label:"Shapes",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="8" height="8" rx="1"/><circle cx="17" cy="7" r="4"/><path d="M3 21l4.5-8 4.5 8"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg> },
    { id:"text",    label:"Text",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> },
  ];

  const tools = [
    { id:"select",     label:"Move (V)",      icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 3l14 7-7 1.5 2 6.5L5 3z"/></svg> },
    { id:"brush",      label:"Brush (B)",     icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 3l3 3L7 20H4v-3L18 3z"/><path d="M15 6l3 3"/></svg> },
    { id:"eraser",     label:"Eraser (E)",    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 20H7L3 16l13-13 7 7-3 10z"/><path d="M6.26 18.67L13 12"/></svg> },
    { id:"shape",      label:"Shape (S)",     icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> },
    { id:"text",       label:"Text (T)",      icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> },
    { id:"eyedropper", label:"Pick (I)",      icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 0 1 8 8c0 5.5-8 14-8 14S4 15.5 4 10a10 10 0 0 1 8-8z"/><circle cx="12" cy="10" r="3"/></svg> },
  ];

  const iS = { // inputStyle
    background:"rgba(255,255,255,0.05)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"6px",
    color:"#e5e5e5", padding:"6px 10px", fontSize:"12px", outline:"none", width:"100%"
  };

  const sliderRow = (label, val, setter, min, max, step=1) => (
    <div style={{ marginBottom:"14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px", fontSize:"11px" }}>
        <span style={{ color:"#8c8780" }}>{label}</span>
        <span style={{ color:"#e1496d", fontWeight:600 }}>{typeof val==="number"&&!Number.isInteger(val)?val.toFixed(1):val}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={e=>setter(parseFloat(e.target.value))} className="ie-slider" />
    </div>
  );

  return (
    <div style={{ background:"#0e0d11", color:"#e5e5e5", fontFamily:"'Instrument Sans','Poppins',sans-serif", height:"100vh", width:"100vw", display:"flex", flexDirection:"column", overflow:"hidden", userSelect:"none" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Instrument+Sans:wght@400;500;600&family=Syne:wght@700;800&family=Outfit:wght@400;600&family=Space+Grotesk:wght@400;600&family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display:"none" }} onChange={handleFileUpload}/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#0e0d11}
        ::-webkit-scrollbar-thumb{background:rgba(225,73,109,0.25);border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#e1496d}
        .tool-btn{background:rgba(225,73,109,0.07);border:1px solid rgba(225,73,109,0.2);color:#e5e5e5;padding:5px 11px;border-radius:6px;cursor:pointer;font-size:11px;font-family:'Poppins',sans-serif;font-weight:500;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;white-space:nowrap}
        .tool-btn:hover{background:rgba(225,73,109,0.18);color:#ff8da7;border-color:rgba(225,73,109,0.45)}
        .tool-btn.active{background:rgba(225,73,109,0.25);color:#ff8da7;border-color:#e1496d}
        .tool-btn.primary{background:linear-gradient(135deg,#a82348,#e1496d);border:none;color:#fff;font-weight:600;box-shadow:0 3px 12px rgba(225,73,109,0.35)}
        .tool-btn.primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(225,73,109,0.5)}
        .tool-btn.danger{color:#ef4444;border-color:rgba(239,68,68,0.25);background:rgba(239,68,68,0.06)}
        .tool-btn.danger:hover{background:rgba(239,68,68,0.18);border-color:#ef4444}
        .ie-slider{width:100%;-webkit-appearance:none;height:3px;background:rgba(225,73,109,0.2);border-radius:3px;outline:none;cursor:pointer}
        .ie-slider::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;background:#e1496d;border-radius:50%;cursor:pointer;box-shadow:0 0 5px rgba(225,73,109,0.5)}
        .nav-icon-btn{width:52px;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:#6c6660;cursor:pointer;font-size:9px;transition:all 0.18s;border-left:3px solid transparent;font-family:'Poppins',sans-serif}
        .nav-icon-btn:hover{color:#ff8da7;background:rgba(225,73,109,0.08)}
        .nav-icon-btn.active{color:#ff8da7;background:rgba(225,73,109,0.15);border-left-color:#e1496d}
        @keyframes fadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── Top Header ───────────────────────────────────────────────────── */}
      <div style={{ height:"48px", background:"#141117", borderBottom:"1px solid rgba(225,73,109,0.18)", display:"flex", alignItems:"center", padding:"0 14px", gap:"12px", flexShrink:0, zIndex:20 }}>
        {/* Left */}
        <button className="tool-btn danger" onClick={()=>setShowLeaveModal(true)} style={{ padding:"4px 10px", fontSize:"11px", gap:"5px" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg> Exit
        </button>
        <div style={{ width:"1px", height:"16px", background:"rgba(225,73,109,0.2)" }}/>
        <input value={projectTitle} onChange={e=>setProjectTitle(e.target.value)} style={{ background:"transparent", border:"none", borderBottom:"1px dashed rgba(225,73,109,0.35)", color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"13px", outline:"none", padding:"1px 4px", width:"160px" }}/>
        <div style={{ width:"1px", height:"16px", background:"rgba(225,73,109,0.2)" }}/>

        {/* Center: Tools */}
        <div style={{ display:"flex", gap:"4px", flex:1, justifyContent:"center" }}>
          {tools.map(t=>(
            <button key={t.id} className={`tool-btn${activeTool===t.id?" active":""}`} onClick={()=>setActiveTool(t.id)} title={t.label} style={{ padding:"5px 9px" }}>
              {t.icon}
            </button>
          ))}
          <div style={{ width:"1px", height:"16px", background:"rgba(225,73,109,0.2)", alignSelf:"center", margin:"0 4px" }}/>
          {activeTool==="brush"||activeTool==="eraser" ? (
            <>
              <input type="color" value={brushColor} onChange={e=>setBrushColor(e.target.value)} style={{ width:"24px", height:"24px", border:"none", background:"none", cursor:"pointer", borderRadius:"4px" }} title="Brush Color"/>
              <input type="range" min={1} max={80} value={brushSize} onChange={e=>setBrushSize(parseInt(e.target.value))} className="ie-slider" style={{ width:"80px" }} title={`Size: ${brushSize}px`}/>
              <span style={{ fontSize:"10px", color:"#8c8780", minWidth:"30px" }}>{brushSize}px</span>
            </>
          ) : activeTool==="shape" ? (
            <>
              {["rect","rounded","circle","triangle","star","line"].map(s=>(
                <button key={s} className={`tool-btn${shapeType===s?" active":""}`} onClick={()=>setShapeType(s)} style={{ padding:"4px 7px", fontSize:"10px" }}>
                  {s==="rect"?"▬":s==="rounded"?"▭":s==="circle"?"●":s==="triangle"?"▲":s==="star"?"★":"╱"}
                </button>
              ))}
              <input type="color" value={shapeColor} onChange={e=>setShapeColor(e.target.value)} style={{ width:"24px",height:"24px",border:"none",background:"none",cursor:"pointer" }} title="Fill Color"/>
            </>
          ) : null}
        </div>

        {/* Right: Zoom + Export */}
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <button className="tool-btn" onClick={()=>setZoom(z=>Math.max(0.25,z-0.1))} style={{ padding:"3px 7px" }}>−</button>
          <span style={{ fontSize:"11px", color:"#e1496d", minWidth:"38px", textAlign:"center" }}>{Math.round(zoom*100)}%</span>
          <button className="tool-btn" onClick={()=>setZoom(z=>Math.min(4,z+0.1))} style={{ padding:"3px 7px" }}>+</button>
          <button className="tool-btn" onClick={()=>setZoom(0.75)} style={{ padding:"3px 7px", fontSize:"10px" }}>Fit</button>
          <div style={{ width:"1px", height:"16px", background:"rgba(225,73,109,0.2)" }}/>
          <select value={exportFormat} onChange={e=>setExportFormat(e.target.value)} style={{ ...iS, width:"auto", padding:"4px 7px", fontSize:"11px" }}>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
          <button className="tool-btn primary" onClick={triggerExport} style={{ padding:"5px 14px", gap:"5px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* ── Main Workspace ──────────────────────────────────────────────── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ── Icon Strip ──────────────────────────────────────────────── */}
        <div style={{ width:"52px", minWidth:"52px", background:"#141117", borderRight:"1px solid rgba(225,73,109,0.15)", display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 0", zIndex:10, flexShrink:0 }}>
          {tabsConfig.map(t=>{
            const active = leftTab===t.id&&drawerOpen;
            return (
              <button key={t.id} className={`nav-icon-btn${active?" active":""}`} onClick={()=>{ if(leftTab===t.id&&drawerOpen) setDrawerOpen(false); else { setLeftTab(t.id); setDrawerOpen(true); } }} title={t.label}>
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>{t.icon}</span>
                <span style={{ fontSize:"9px" }}>{t.label}</span>
              </button>
            );
          })}
          <div style={{ flex:1 }}/>
          <button onClick={()=>setDrawerOpen(p=>!p)} style={{ width:"36px",height:"36px",borderRadius:"50%",background:"rgba(225,73,109,0.1)",border:"1px solid rgba(225,73,109,0.2)",color:"#ff8da7",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",transition:"all 0.18s",marginBottom:"8px" }}>
            {drawerOpen?"◀":"▶"}
          </button>
        </div>

        {/* ── Collapsible Left Drawer ──────────────────────────────────── */}
        {drawerOpen && (
          <div style={{ width:"276px", minWidth:"276px", background:"#161217", borderRight:"1px solid rgba(225,73,109,0.15)", display:"flex", flexDirection:"column", height:"100%", zIndex:9, flexShrink:0, animation:"fadeIn 0.15s ease" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", borderBottom:"1px solid rgba(225,73,109,0.15)", background:"#181318", flexShrink:0 }}>
              <span style={{ fontSize:"10px", letterSpacing:"0.12em", color:"#e1496d", fontWeight:700 }}>
                {tabsConfig.find(t=>t.id===leftTab)?.label.toUpperCase()}
              </span>
              <button onClick={()=>setDrawerOpen(false)} style={{ background:"none",border:"none",color:"#8c8780",cursor:"pointer",fontSize:"14px",padding:"2px 6px" }}>✕</button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"12px" }}>

              {/* ASSETS TAB */}
              {leftTab==="assets" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <button className="tool-btn primary" onClick={()=>fileInputRef.current.click()} style={{ width:"100%", justifyContent:"center", padding:"9px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload Image
                  </button>
                  <div>
                    <div style={{ fontSize:"10px", color:"#8c8780", fontWeight:600, letterSpacing:"0.08em", marginBottom:"8px" }}>STOCK PHOTOS</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"7px" }}>
                      {STOCK_IMAGES.map(img=>(
                        <div key={img.id} onClick={()=>addImageLayer(img.url,0,0,img.name)} style={{ borderRadius:"8px", overflow:"hidden", cursor:"pointer", border:"1px solid rgba(225,73,109,0.15)", height:"70px", position:"relative" }}
                          onMouseEnter={e=>e.currentTarget.style.borderColor="#e1496d"}
                          onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(225,73,109,0.15)"}>
                          <img src={img.url} alt={img.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} crossOrigin="anonymous"/>
                          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,0.6)", padding:"3px 6px", fontSize:"9px", color:"#fff" }}>{img.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:"10px", color:"#8c8780", fontWeight:600, letterSpacing:"0.08em", marginBottom:"8px" }}>CANVAS SIZE</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                      {CANVAS_PRESETS.map(p=>(
                        <button key={p.id} className="tool-btn" onClick={()=>{ setCanvasW(p.w); setCanvasH(p.h); }} style={{ justifyContent:"space-between", fontSize:"11px" }}>
                          <span>{p.name}</span>
                          <span style={{ color:"#8c8780", fontSize:"10px" }}>{p.w}×{p.h}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LAYERS TAB */}
              {leftTab==="layers" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <div style={{ display:"flex", gap:"5px" }}>
                    <button className="tool-btn" onClick={addDrawLayer} style={{ flex:1, justifyContent:"center", fontSize:"10px", padding:"5px" }}>+ Draw Layer</button>
                    <button className="tool-btn" onClick={()=>activeLayerId&&duplicateLayer(activeLayerId)} style={{ padding:"5px 8px", fontSize:"10px" }}>⊕</button>
                    <button className="tool-btn danger" onClick={()=>{ if(activeLayerId){ layerDispatch({type:"DELETE_LAYER",id:activeLayerId}); setActiveLayerId(null); }}} style={{ padding:"5px 8px", fontSize:"10px" }}>✕</button>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                    {layers.map((layer, idx)=>{
                      const isActive = activeLayerId===layer.id;
                      return (
                        <div key={layer.id} onClick={()=>setActiveLayerId(layer.id)} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"7px 9px", borderRadius:"8px", background:isActive?"rgba(225,73,109,0.14)":"rgba(255,255,255,0.025)", border:`1px solid ${isActive?"#e1496d":"rgba(255,255,255,0.06)"}`, cursor:"pointer", transition:"all 0.12s" }}>
                          <div style={{ width:"28px", height:"20px", borderRadius:"3px", background:"#0e0d11", border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:"#666" }}>
                            {layer.type==="image"?"IMG":layer.type==="text"?"TXT":layer.type==="shape"?"SHP":"BRS"}
                          </div>
                          <span style={{ fontSize:"11px", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:isActive?"#fff":"#c5c5c5" }}>{layer.name}</span>
                          <button onClick={e=>{e.stopPropagation();layerDispatch({type:"UPDATE_LAYER",id:layer.id,patch:{visible:!layer.visible}})}} style={{ background:"none",border:"none",cursor:"pointer",fontSize:"11px",color:layer.visible?"#e1496d":"#444",padding:"0 2px" }}>
                            {layer.visible?<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 1 12s4 7 11 7a9.74 9.74 0 0 0 5.39-1.61"/></svg>}
                          </button>
                          <button onClick={e=>{e.stopPropagation();if(idx>0)layerDispatch({type:"REORDER",from:idx,to:idx-1})}} style={{ background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:"9px" }}>▲</button>
                          <button onClick={e=>{e.stopPropagation();if(idx<layers.length-1)layerDispatch({type:"REORDER",from:idx,to:idx+1})}} style={{ background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:"9px" }}>▼</button>
                        </div>
                      );
                    })}
                    {layers.length===0&&<div style={{ textAlign:"center",color:"#555",fontSize:"11px",padding:"20px 0" }}>No layers yet.<br/>Upload an image or add a shape.</div>}
                  </div>
                  {activeLayer&&(
                    <div style={{ background:"rgba(225,73,109,0.06)",border:"1px solid rgba(225,73,109,0.2)",borderRadius:"10px",padding:"12px",display:"flex",flexDirection:"column",gap:"10px" }}>
                      <div style={{ fontSize:"10px",color:"#e1496d",fontWeight:700,letterSpacing:"0.08em" }}>LAYER PROPERTIES</div>
                      <div>
                        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"5px",fontSize:"11px" }}>
                          <span style={{ color:"#8c8780" }}>Opacity</span>
                          <span style={{ color:"#e1496d" }}>{Math.round((activeLayer.opacity??1)*100)}%</span>
                        </div>
                        <input type="range" min={0} max={100} value={Math.round((activeLayer.opacity??1)*100)} onChange={e=>layerDispatch({type:"UPDATE_LAYER",id:activeLayerId,patch:{opacity:parseFloat(e.target.value)/100}})} className="ie-slider"/>
                      </div>
                      <div>
                        <div style={{ fontSize:"11px",color:"#8c8780",marginBottom:"5px" }}>Blend Mode</div>
                        <select value={activeLayer.blendMode||"source-over"} onChange={e=>layerDispatch({type:"UPDATE_LAYER",id:activeLayerId,patch:{blendMode:e.target.value}})} style={{ ...iS }}>
                          {BLEND_MODES.map((m,i)=><option key={m} value={m}>{BLEND_LABELS[i]}</option>)}
                        </select>
                      </div>
                      {activeLayer.type==="text"&&(
                        <>
                          <div>
                            <label style={{ fontSize:"10px",color:"#8c8780",display:"block",marginBottom:"4px" }}>Text Content</label>
                            <input value={activeLayer.text||""} onChange={e=>layerDispatch({type:"UPDATE_LAYER",id:activeLayerId,patch:{text:e.target.value}})} style={{ ...iS }}/>
                          </div>
                          <div style={{ display:"flex",gap:"6px" }}>
                            <div style={{ flex:1 }}>
                              <label style={{ fontSize:"10px",color:"#8c8780",display:"block",marginBottom:"4px" }}>Color</label>
                              <input type="color" value={activeLayer.color||"#fff"} onChange={e=>layerDispatch({type:"UPDATE_LAYER",id:activeLayerId,patch:{color:e.target.value}})} style={{ width:"100%",height:"28px",background:"none",border:"1px solid rgba(225,73,109,0.2)",borderRadius:"5px",cursor:"pointer" }}/>
                            </div>
                            <div style={{ flex:1 }}>
                              <label style={{ fontSize:"10px",color:"#8c8780",display:"block",marginBottom:"4px" }}>Font Size</label>
                              <input type="number" min={8} max={200} value={activeLayer.size||32} onChange={e=>layerDispatch({type:"UPDATE_LAYER",id:activeLayerId,patch:{size:parseInt(e.target.value)}})} style={{ ...iS }}/>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ADJUSTMENTS TAB */}
              {leftTab==="adjust" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <div>
                    <div style={{ fontSize:"10px", color:"#8c8780", fontWeight:600, letterSpacing:"0.08em", marginBottom:"8px" }}>QUICK LUT PRESETS</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px" }}>
                      {LUTS.map(lut=>(
                        <button key={lut.id} className={`tool-btn${activeLut===lut.id?" active":""}`} onClick={()=>applyLut(lut)} style={{ fontSize:"10px", padding:"6px", justifyContent:"center" }}>
                          {lut.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ height:"1px", background:"rgba(225,73,109,0.12)" }}/>
                  <div>
                    <div style={{ fontSize:"10px", color:"#8c8780", fontWeight:600, letterSpacing:"0.08em", marginBottom:"10px" }}>MANUAL ADJUSTMENTS</div>
                    {sliderRow("Brightness", brightness, setBrightness, 0, 200)}
                    {sliderRow("Contrast", contrast, setContrast, 0, 200)}
                    {sliderRow("Saturation", saturation, setSaturation, 0, 200)}
                    {sliderRow("Hue Rotate", hue, setHue, -180, 180)}
                    {sliderRow("Blur", blur, setBlur, 0, 20, 0.5)}
                    {sliderRow("Sepia", sepia, setSepia, 0, 100)}
                    {sliderRow("Vignette", vignette, setVignette, 0, 100)}
                    <button className="tool-btn" onClick={()=>{setBrightness(100);setContrast(100);setSaturation(100);setHue(0);setBlur(0);setSepia(0);setVignette(0);setActiveLut("none");}} style={{ width:"100%", justifyContent:"center", fontSize:"10px", marginTop:"4px" }}>
                      Reset All
                    </button>
                  </div>
                </div>
              )}

              {/* SHAPES TAB */}
              {leftTab==="shapes" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <div>
                    <div style={{ fontSize:"10px", color:"#8c8780", fontWeight:600, letterSpacing:"0.08em", marginBottom:"8px" }}>ADD SHAPE</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
                      {[["rect","Rectangle"],["rounded","Rounded"],["circle","Circle"],["triangle","Triangle"],["star","Star"],["line","Line"]].map(([k,n])=>(
                        <button key={k} className="tool-btn" onClick={()=>addShapeLayer(k)} style={{ fontSize:"11px", padding:"8px 5px", justifyContent:"center" }}>{n}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:"10px", color:"#8c8780", fontWeight:600, letterSpacing:"0.08em", marginBottom:"8px" }}>SHAPE STYLE</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <label style={{ fontSize:"11px", color:"#8c8780" }}>Fill Color</label>
                        <input type="color" value={shapeColor} onChange={e=>setShapeColor(e.target.value)} style={{ width:"40px",height:"26px",background:"none",border:"none",cursor:"pointer",borderRadius:"4px" }}/>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <label style={{ fontSize:"11px", color:"#8c8780" }}>Stroke Color</label>
                        <input type="color" value={shapeStrokeColor} onChange={e=>setShapeStrokeColor(e.target.value)} style={{ width:"40px",height:"26px",background:"none",border:"none",cursor:"pointer",borderRadius:"4px" }}/>
                      </div>
                      {sliderRow("Stroke Width", shapeStrokeWidth, setShapeStrokeWidth, 0, 20)}
                      <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"11px", color:"#8c8780", cursor:"pointer" }}>
                        <input type="checkbox" checked={shapeFill} onChange={e=>setShapeFill(e.target.checked)} style={{ accentColor:"#e1496d" }}/> Filled
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TEXT TAB */}
              {leftTab==="text" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <div>
                    <label style={{ fontSize:"10px", color:"#8c8780", display:"block", marginBottom:"5px", fontWeight:600 }}>TEXT CONTENT</label>
                    <textarea value={textInput} onChange={e=>setTextInput(e.target.value)} rows={3} style={{ ...iS, resize:"none", lineHeight:1.5 }}/>
                  </div>
                  <div>
                    <label style={{ fontSize:"10px", color:"#8c8780", display:"block", marginBottom:"5px", fontWeight:600 }}>FONT</label>
                    <select value={textFont} onChange={e=>setTextFont(e.target.value)} style={{ ...iS }}>
                      {FONTS.map(f=><option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  {sliderRow("Font Size", textSize, setTextSize, 8, 200)}
                  <div>
                    <label style={{ fontSize:"10px", color:"#8c8780", display:"block", marginBottom:"5px", fontWeight:600 }}>COLOR</label>
                    <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} style={{ width:"100%",height:"32px",background:"none",border:"1px solid rgba(225,73,109,0.2)",borderRadius:"6px",cursor:"pointer" }}/>
                  </div>
                  <div style={{ display:"flex", gap:"6px" }}>
                    <button className={`tool-btn${textBold?" active":""}`} onClick={()=>setTextBold(p=>!p)} style={{ flex:1, justifyContent:"center", fontWeight:700 }}>B</button>
                    <button className={`tool-btn${textItalic?" active":""}`} onClick={()=>setTextItalic(p=>!p)} style={{ flex:1, justifyContent:"center", fontStyle:"italic" }}>I</button>
                  </div>
                  <button className="tool-btn primary" onClick={addTextLayer} style={{ width:"100%", justifyContent:"center", padding:"9px" }}>
                    + Add Text Layer
                  </button>
                  <div style={{ fontSize:"10px", color:"#555", textAlign:"center" }}>Or select Text tool (T) and click on canvas</div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── Canvas Area ──────────────────────────────────────────────── */}
        <div style={{ flex:1, background:"#0a0810", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", overflow:"auto", padding:"20px" }}
            onWheel={e=>{ if(e.ctrlKey){ e.preventDefault(); setZoom(z=>Math.max(0.25,Math.min(4,z-(e.deltaY>0?0.1:-0.1)))); }}}>
            <div style={{ transform:`scale(${zoom})`, transformOrigin:"center center", transition:"transform 0.1s", flexShrink:0 }}>
              <canvas
                ref={canvasRef}
                width={canvasW}
                height={canvasH}
                style={{ display:"block", borderRadius:"4px", boxShadow:"0 8px 48px rgba(0,0,0,0.7)", cursor: activeTool==="brush"?"crosshair":activeTool==="eraser"?"cell":activeTool==="eyedropper"?"crosshair":activeTool==="text"?"text":"default" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </div>
          {/* Status bar */}
          <div style={{ height:"28px", background:"rgba(10,8,16,0.9)", borderTop:"1px solid rgba(225,73,109,0.1)", display:"flex", alignItems:"center", padding:"0 14px", gap:"16px", fontSize:"10px", color:"#5c5650", flexShrink:0 }}>
            <span style={{ color:"#e1496d" }}>{activeTool.toUpperCase()} TOOL</span>
            <span>Canvas: {canvasW}×{canvasH}</span>
            <span>Layers: {layers.length}</span>
            <span>Zoom: {Math.round(zoom*100)}%</span>
            <span style={{ marginLeft:"auto", color:"#555" }}>Ctrl+Z Undo · Ctrl+Y Redo · Del Delete Layer</span>
          </div>
        </div>
      </div>

      {/* ── Leave Modal ───────────────────────────────────────────────── */}
      {showLeaveModal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,backdropFilter:"blur(12px)" }}>
          <div style={{ width:"420px",padding:"32px",borderRadius:"24px",background:"#131110",border:"1px solid rgba(225,73,109,0.25)",textAlign:"center" }}>
            <div style={{ fontSize:"36px",marginBottom:"14px" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e1496d" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <h3 style={{ fontFamily:"Syne,sans-serif",fontSize:"22px",fontWeight:800,color:"#fff",marginBottom:"8px" }}>Save your artwork?</h3>
            <p style={{ fontSize:"13px",color:"#8c8780",lineHeight:1.6,marginBottom:"24px" }}>Save this image editing session to your Past Works, or discard changes.</p>
            <div style={{ marginBottom:"20px",textAlign:"left" }}>
              <label style={{ fontSize:"10px",color:"#e1496d",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",display:"block",marginBottom:"6px" }}>Artwork Name</label>
              <input type="text" value={projectTitle} onChange={e=>setProjectTitle(e.target.value)} style={{ ...iS }} placeholder="Untitled Artwork"/>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
              <button className="tool-btn primary" onClick={handleSaveAndExit} style={{ width:"100%",justifyContent:"center",padding:"11px",fontSize:"13px" }}>Save & Exit</button>
              <div style={{ display:"flex",gap:"8px" }}>
                <button className="tool-btn danger" onClick={()=>onBack()} style={{ flex:1,justifyContent:"center",padding:"9px" }}>Discard</button>
                <button className="tool-btn" onClick={()=>setShowLeaveModal(false)} style={{ flex:1,justifyContent:"center",padding:"9px" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
