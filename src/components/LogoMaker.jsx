import { useState, useEffect, useRef } from "react";

const BRAND_PALETTES = [
  { name: "Gold Obsidian", bg: "#1a0f14", primary: "#e1496d", secondary: "#942945", text: "#fdf2f4" },
  { name: "Cyber Neon", bg: "#030712", primary: "#22d3a8", secondary: "#3b82f6", text: "#f3f4f6" },
  { name: "Nordic Forest", bg: "#f7f4f7", primary: "#2d5a27", secondary: "#8fbc8f", text: "#2d2d2d" },
  { name: "Royal Violet", bg: "#0f0728", primary: "#a855f7", secondary: "#ec4899", text: "#fdf2ff" }
];

const PRESET_ICONS = {
  rocket: "M12 2S4.5 8.5 4.5 14.5A7.5 7.5 0 0 0 12 22a7.5 7.5 0 0 0 7.5-7.5C19.5 8.5 12 2 12 2zm0 18a5.5 5.5 0 0 1-5.5-5.5c0-4.4 5.5-9.5 5.5-9.5s5.5 5.1 5.5 9.5A5.5 5.5 0 0 1 12 20z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  leaf: "M12 2C6.48 2 2 6.48 2 12c0 3.06 1.38 5.8 3.56 7.66l.07.06C7.54 18.23 10 16 12 16c2 0 4.46 2.23 6.37 3.72a9.96 9.96 0 0 0 3.63-7.72c0-5.52-4.48-10-10-10zm-1 12V8h2v6h-2z",
  crown: "M2 4l3 7 7-7 7 7 3-7-3 14H5L2 4z",
  gear: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  helix: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
};

const FONT_FAMILIES = ["Syne","Poppins","Outfit","Cinzel","Pacifico","Montserrat","Inter","Playfair Display"];

const COLOR_SWATCHES = ["#ffffff","#000000","#e1496d","#22d3a8","#a855f7","#f59e0b","#3b82f6","#10b981"];

const FONT_PAIRS = [
  { id:"fp1", name:"Modern Minimal", heading:"Syne", body:"Poppins", preview:"Aa", desc:"Clean & contemporary" },
  { id:"fp2", name:"Elegant Classic", heading:"Cinzel", body:"Outfit", preview:"Aa", desc:"Timeless & refined" },
  { id:"fp3", name:"Friendly Bold", heading:"Pacifico", body:"Montserrat", preview:"Aa", desc:"Warm & approachable" },
  { id:"fp4", name:"Tech Forward", heading:"Outfit", body:"Inter", preview:"Aa", desc:"Digital & precise" },
  { id:"fp5", name:"Editorial", heading:"Playfair Display", body:"Poppins", preview:"Aa", desc:"Magazine & luxury" },
  { id:"fp6", name:"Futurist", heading:"Montserrat", body:"Outfit", preview:"Aa", desc:"Bold & geometric" },
  { id:"fp7", name:"Artisan", heading:"Cinzel", body:"Poppins", preview:"Aa", desc:"Craft & heritage" },
  { id:"fp8", name:"Startup Energy", heading:"Syne", body:"Inter", preview:"Aa", desc:"Fast & disruptive" }
];

const LOGO_TEMPLATES = [
  {
    id:"t1", name:"Minimal Tech", bg:"#030712",
    elements:[
      { id:"el_icon", type:"icon", shape:"gear", x:150, y:100, size:65, color:"#22d3a8", opacity:1, rotate:0, fillType:"solid", strokeColor:"#22d3a8", strokeWidth:0, strokeType:"none" },
      { id:"el_brand", type:"text", text:"TECHLAB", x:150, y:200, size:28, font:"Syne", color:"#f3f4f6", letterSpacing:6, rotate:0, fillType:"solid", strokeColor:"#22d3a8", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"next gen solutions", x:150, y:235, size:10, font:"Outfit", color:"#3b82f6", letterSpacing:3, rotate:0, fillType:"solid", strokeColor:"#3b82f6", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t2", name:"Bold Impact", bg:"#1a0f14",
    elements:[
      { id:"el_icon", type:"icon", shape:"shield", x:150, y:95, size:80, color:"#e1496d", opacity:1, rotate:0, fillType:"solid", strokeColor:"#e1496d", strokeWidth:0, strokeType:"none" },
      { id:"el_brand", type:"text", text:"FORTRESS", x:150, y:210, size:32, font:"Syne", color:"#fdf2f4", letterSpacing:4, rotate:0, fillType:"solid", strokeColor:"#e1496d", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"built to last", x:150, y:248, size:11, font:"Poppins", color:"#942945", letterSpacing:2, rotate:0, fillType:"solid", strokeColor:"#942945", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t3", name:"Eco Organic", bg:"#f7f4f7",
    elements:[
      { id:"el_icon", type:"icon", shape:"leaf", x:150, y:100, size:72, color:"#2d5a27", opacity:1, rotate:0, fillType:"solid", strokeColor:"#2d5a27", strokeWidth:0, strokeType:"none" },
      { id:"el_brand", type:"text", text:"Verdant", x:150, y:210, size:30, font:"Pacifico", color:"#2d2d2d", letterSpacing:1, rotate:0, fillType:"solid", strokeColor:"#2d5a27", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"grow naturally", x:150, y:248, size:11, font:"Poppins", color:"#8fbc8f", letterSpacing:1, rotate:0, fillType:"solid", strokeColor:"#8fbc8f", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t4", name:"Royal Crest", bg:"#0f0728",
    elements:[
      { id:"el_icon", type:"icon", shape:"crown", x:150, y:95, size:70, color:"#a855f7", opacity:1, rotate:0, fillType:"solid", strokeColor:"#a855f7", strokeWidth:0, strokeType:"none" },
      { id:"el_brand", type:"text", text:"REGALIA", x:150, y:205, size:28, font:"Cinzel", color:"#fdf2ff", letterSpacing:5, rotate:0, fillType:"solid", strokeColor:"#a855f7", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"premium crafted", x:150, y:242, size:10, font:"Outfit", color:"#ec4899", letterSpacing:3, rotate:0, fillType:"solid", strokeColor:"#ec4899", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t5", name:"Circle Badge", bg:"#1a0f14",
    elements:[
      { id:"el_bg_circle", type:"shape", shapeType:"circle", x:150, y:140, size:120, color:"#942945", opacity:1, rotate:0, fillType:"solid", strokeColor:"#e1496d", strokeWidth:2, strokeType:"solid" },
      { id:"el_brand", type:"text", text:"BRAND", x:150, y:135, size:26, font:"Syne", color:"#fdf2f4", letterSpacing:5, rotate:0, fillType:"solid", strokeColor:"#e1496d", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"EST. 2024", x:150, y:165, size:9, font:"Montserrat", color:"#fdf2f4", letterSpacing:3, rotate:0, fillType:"solid", strokeColor:"#e1496d", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t6", name:"Hexagon Grid", bg:"#030712",
    elements:[
      { id:"el_hex", type:"shape", shapeType:"hexagon", x:150, y:120, size:90, color:"#3b82f6", opacity:0.85, rotate:0, fillType:"solid", strokeColor:"#22d3a8", strokeWidth:2, strokeType:"solid" },
      { id:"el_brand", type:"text", text:"NEXUS", x:150, y:215, size:30, font:"Outfit", color:"#f3f4f6", letterSpacing:6, rotate:0, fillType:"solid", strokeColor:"#3b82f6", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"connected systems", x:150, y:250, size:10, font:"Inter", color:"#22d3a8", letterSpacing:2, rotate:0, fillType:"solid", strokeColor:"#22d3a8", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t7", name:"Rocket Launch", bg:"#0f0728",
    elements:[
      { id:"el_icon", type:"icon", shape:"rocket", x:150, y:100, size:80, color:"#ec4899", opacity:1, rotate:-30, fillType:"solid", strokeColor:"#ec4899", strokeWidth:0, strokeType:"none" },
      { id:"el_brand", type:"text", text:"LAUNCH", x:150, y:215, size:30, font:"Syne", color:"#fdf2ff", letterSpacing:4, rotate:0, fillType:"solid", strokeColor:"#ec4899", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"to the stars", x:150, y:250, size:11, font:"Poppins", color:"#a855f7", letterSpacing:2, rotate:0, fillType:"solid", strokeColor:"#a855f7", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t8", name:"Star Burst", bg:"#1a0f14",
    elements:[
      { id:"el_star", type:"shape", shapeType:"star", x:150, y:125, size:95, color:"#f59e0b", opacity:1, rotate:0, fillType:"solid", strokeColor:"#f59e0b", strokeWidth:0, strokeType:"none" },
      { id:"el_brand", type:"text", text:"STELLAR", x:150, y:220, size:28, font:"Montserrat", color:"#fdf2f4", letterSpacing:4, rotate:0, fillType:"solid", strokeColor:"#f59e0b", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"shine brighter", x:150, y:254, size:10, font:"Poppins", color:"#f59e0b", letterSpacing:2, rotate:0, fillType:"solid", strokeColor:"#f59e0b", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t9", name:"Ring Emblem", bg:"#030712",
    elements:[
      { id:"el_ring", type:"shape", shapeType:"ring", x:150, y:130, size:100, color:"none", opacity:1, rotate:0, fillType:"none", strokeColor:"#22d3a8", strokeWidth:3, strokeType:"solid" },
      { id:"el_icon", type:"icon", shape:"helix", x:150, y:130, size:55, color:"#22d3a8", opacity:1, rotate:0, fillType:"solid", strokeColor:"#22d3a8", strokeWidth:0, strokeType:"none" },
      { id:"el_brand", type:"text", text:"ORBIT", x:150, y:220, size:28, font:"Syne", color:"#f3f4f6", letterSpacing:8, rotate:0, fillType:"solid", strokeColor:"#22d3a8", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t10", name:"Minimal Mono", bg:"#ffffff",
    elements:[
      { id:"el_brand", type:"text", text:"MONOLITH", x:150, y:155, size:28, font:"Cinzel", color:"#111111", letterSpacing:4, rotate:0, fillType:"solid", strokeColor:"#111111", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_line", type:"shape", shapeType:"box", x:150, y:185, size:4, color:"#111111", opacity:1, rotate:0, fillType:"solid", strokeColor:"#111111", strokeWidth:0, strokeType:"none" },
      { id:"el_tag", type:"text", text:"less is more", x:150, y:215, size:11, font:"Outfit", color:"#555555", letterSpacing:4, rotate:0, fillType:"solid", strokeColor:"#555555", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t11", name:"Glow Neon", bg:"#030712",
    elements:[
      { id:"el_circle", type:"shape", shapeType:"circle", x:150, y:130, size:80, color:"none", opacity:1, rotate:0, fillType:"none", strokeColor:"#ec4899", strokeWidth:2, strokeType:"dashed" },
      { id:"el_icon", type:"icon", shape:"gear", x:150, y:130, size:50, color:"#ec4899", opacity:1, rotate:45, fillType:"solid", strokeColor:"#ec4899", strokeWidth:0, strokeType:"none" },
      { id:"el_brand", type:"text", text:"NEONLAB", x:150, y:220, size:26, font:"Outfit", color:"#ec4899", letterSpacing:5, rotate:0, fillType:"solid", strokeColor:"#ec4899", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_tag", type:"text", text:"illuminate ideas", x:150, y:254, size:10, font:"Inter", color:"#a855f7", letterSpacing:2, rotate:0, fillType:"solid", strokeColor:"#a855f7", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  },
  {
    id:"t12", name:"Elegant Script", bg:"#1a0f14",
    elements:[
      { id:"el_brand", type:"text", text:"Lumière", x:150, y:155, size:36, font:"Playfair Display", color:"#fdf2f4", letterSpacing:2, rotate:0, fillType:"solid", strokeColor:"#e1496d", strokeWidth:0, strokeType:"none", opacity:1 },
      { id:"el_divider", type:"shape", shapeType:"box", x:150, y:180, size:3, color:"#942945", opacity:0.8, rotate:0, fillType:"solid", strokeColor:"#942945", strokeWidth:0, strokeType:"none" },
      { id:"el_tag", type:"text", text:"art de vivre", x:150, y:210, size:11, font:"Cinzel", color:"#942945", letterSpacing:5, rotate:0, fillType:"solid", strokeColor:"#942945", strokeWidth:0, strokeType:"none", opacity:1 }
    ]
  }
];

export default function LogoMaker({ onBack, user, initialProject }) {
  const [projectTitle, setProjectTitle] = useState(() => {
    return initialProject ? initialProject.title : "My Brand Identity";
  });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState("ai"); // ai | editor | mockups | templates | fontpairs
  const [activeMockup, setActiveMockup] = useState("card");

  // AI Generator Panel states
  const [brandName, setBrandName] = useState("CineCut");
  const [tagline, setTagline] = useState("Create without limits");
  const [styleKeyword, setStyleKeyword] = useState("tech startup");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Zoom state
  const [zoom, setZoom] = useState(100);

  // Canvas background quick swatches picker visibility
  const [showBgPicker, setShowBgPicker] = useState(false);

  // Shape picker / icon picker visibility in layers tab
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Editor states
  const [logoElements, setLogoElements] = useState([
    { id: "el_icon", type: "icon", shape: "rocket", x: 150, y: 110, size: 70, color: "#e1496d", opacity: 1, rotate: 0, fillType: "solid", strokeColor: "#e1496d", strokeWidth: 0, strokeType: "none" },
    { id: "el_brand", type: "text", text: "CINECUT", x: 150, y: 220, size: 32, font: "Syne", color: "#fdf2f4", letterSpacing: 3, rotate: 0, fillType: "solid", strokeColor: "#e1496d", strokeWidth: 0, strokeType: "none", opacity: 1 },
    { id: "el_tag", type: "text", text: "Create without limits", x: 150, y: 260, size: 12, font: "Poppins", color: "#8c8780", letterSpacing: 1, rotate: 0, fillType: "solid", strokeColor: "#e1496d", strokeWidth: 0, strokeType: "none", opacity: 1 }
  ]);
  const [canvasBg, setCanvasBg] = useState("#1a0f14");
  const [lastCanvasColor, setLastCanvasColor] = useState("#1a0f14");
  const [activeElementId, setActiveElementId] = useState("el_icon");
  const [activePaletteIdx, setActivePaletteIdx] = useState(0);

  // Undo / Redo history
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Helper: update elements with history tracking
  const updateElements = (newElements) => {
    // Slice history to current index (discard redo future)
    const sliced = historyRef.current.slice(0, historyIndexRef.current + 1);
    sliced.push(JSON.parse(JSON.stringify(newElements)));
    if (sliced.length > 20) sliced.shift();
    historyRef.current = sliced;
    historyIndexRef.current = sliced.length - 1;
    setLogoElements(newElements);
  };

  const handleUndo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const prev = historyRef.current[historyIndexRef.current];
    setLogoElements(JSON.parse(JSON.stringify(prev)));
  };

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const next = historyRef.current[historyIndexRef.current];
    setLogoElements(JSON.parse(JSON.stringify(next)));
  };

  // Initialize if loaded from project
  useEffect(() => {
    if (initialProject && initialProject.data) {
      const d = initialProject.data;
      if (d.elements) { setLogoElements(d.elements); historyRef.current = [JSON.parse(JSON.stringify(d.elements))]; historyIndexRef.current = 0; }
      if (d.canvasBg) { setCanvasBg(d.canvasBg); if (d.canvasBg !== "transparent") setLastCanvasColor(d.canvasBg); }
      if (d.brandName) setBrandName(d.brandName);
      if (d.tagline) setTagline(d.tagline);
    }
  }, [initialProject]);

  // Mouse event handlers for SVG dragging
  const handleSvgElementMouseDown = (e, id) => {
    e.stopPropagation();
    setActiveElementId(id);
    isDraggingRef.current = true;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 300;
    const clickY = ((e.clientY - rect.top) / rect.height) * 300;
    const element = logoElements.find(el => el.id === id);
    if (element) dragOffsetRef.current = { x: clickX - element.x, y: clickY - element.y };
  };

  const handleSvgMouseMove = (e) => {
    if (!isDraggingRef.current || !activeElementId) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    setLogoElements(prev => prev.map(el => {
      if (el.id === activeElementId) {
        return { ...el, x: Math.round(x - dragOffsetRef.current.x), y: Math.round(y - dragOffsetRef.current.y) };
      }
      return el;
    }));
  };

  const handleSvgMouseUp = () => {
    if (isDraggingRef.current) {
      // Commit drag to history
      setLogoElements(prev => { updateElements(prev); return prev; });
    }
    isDraggingRef.current = false;
  };

  // AI Generator
  const generateAISuggestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const suggestions = [
        {
          name: "Emblem Fusion",
          elements: [
            { id: "el_icon", type: "icon", shape: "shield", x: 150, y: 100, size: 80, color: "#22d3a8", opacity: 1, rotate: 0, fillType: "solid", strokeColor: "#22d3a8", strokeWidth: 0, strokeType: "none" },
            { id: "el_brand", type: "text", text: brandName.toUpperCase(), x: 150, y: 220, size: 30, font: "Syne", color: "#ffffff", letterSpacing: 4, rotate: 0, fillType: "solid", strokeColor: "#22d3a8", strokeWidth: 0, strokeType: "none", opacity: 1 },
            { id: "el_tag", type: "text", text: tagline, x: 150, y: 260, size: 11, font: "Outfit", color: "#a8a29e", letterSpacing: 2, rotate: 0, fillType: "solid", strokeColor: "#22d3a8", strokeWidth: 0, strokeType: "none", opacity: 1 }
          ],
          bg: "#030712"
        },
        {
          name: "Linear Synthwave",
          elements: [
            { id: "el_icon", type: "icon", shape: "helix", x: 150, y: 110, size: 70, color: "#ec4899", opacity: 1, rotate: 45, fillType: "solid", strokeColor: "#ec4899", strokeWidth: 0, strokeType: "none" },
            { id: "el_brand", type: "text", text: brandName.toUpperCase(), x: 150, y: 215, size: 32, font: "Poppins", color: "#fdf2ff", letterSpacing: 2, rotate: 0, fillType: "solid", strokeColor: "#ec4899", strokeWidth: 0, strokeType: "none", opacity: 1 },
            { id: "el_tag", type: "text", text: tagline, x: 150, y: 255, size: 10, font: "Poppins", color: "#a855f7", letterSpacing: 3, rotate: 0, fillType: "solid", strokeColor: "#a855f7", strokeWidth: 0, strokeType: "none", opacity: 1 }
          ],
          bg: "#0f0728"
        },
        {
          name: "Organic Eco",
          elements: [
            { id: "el_icon", type: "icon", shape: "leaf", x: 150, y: 110, size: 75, color: "#2d5a27", opacity: 1, rotate: 0, fillType: "solid", strokeColor: "#2d5a27", strokeWidth: 0, strokeType: "none" },
            { id: "el_brand", type: "text", text: brandName, x: 150, y: 220, size: 28, font: "Outfit", color: "#2d2d2d", letterSpacing: 1, rotate: 0, fillType: "solid", strokeColor: "#2d5a27", strokeWidth: 0, strokeType: "none", opacity: 1 },
            { id: "el_tag", type: "text", text: tagline, x: 150, y: 255, size: 12, font: "Poppins", color: "#8fbc8f", letterSpacing: 0, rotate: 0, fillType: "solid", strokeColor: "#8fbc8f", strokeWidth: 0, strokeType: "none", opacity: 1 }
          ],
          bg: "#f7f4f7"
        },
        {
          name: "Modern Stellar",
          elements: [
            { id: "el_icon", type: "icon", shape: "rocket", x: 150, y: 100, size: 85, color: "#e1496d", opacity: 1, rotate: -30, fillType: "solid", strokeColor: "#e1496d", strokeWidth: 0, strokeType: "none" },
            { id: "el_brand", type: "text", text: brandName.toUpperCase(), x: 150, y: 220, size: 30, font: "Syne", color: "#fdf2f4", letterSpacing: 3, rotate: 0, fillType: "solid", strokeColor: "#e1496d", strokeWidth: 0, strokeType: "none", opacity: 1 },
            { id: "el_tag", type: "text", text: tagline, x: 150, y: 260, size: 10, font: "Poppins", color: "#942945", letterSpacing: 1, rotate: 0, fillType: "solid", strokeColor: "#942945", strokeWidth: 0, strokeType: "none", opacity: 1 }
          ],
          bg: "#1a0f14"
        }
      ];
      setAiSuggestions(suggestions);
      setIsGenerating(false);
    }, 1200);
  };

  const loadSuggestion = (sug) => {
    updateElements(sug.elements);
    setCanvasBg(sug.bg);
    setActiveTab("editor");
    if (sug.elements.length > 0) setActiveElementId(sug.elements[0].id);
  };

  const loadTemplate = (tpl) => {
    updateElements(tpl.elements);
    setCanvasBg(tpl.bg);
    setActiveTab("editor");
    if (tpl.elements.length > 0) setActiveElementId(tpl.elements[0].id);
  };

  const applyFontPair = (pair) => {
    const updated = logoElements.map(el => {
      if (el.id === "el_brand") return { ...el, font: pair.heading };
      if (el.id === "el_tag") return { ...el, font: pair.body };
      return el;
    });
    updateElements(updated);
  };

  // Shape insert
  const addShape = (shapeType) => {
    const id = `shape_${Date.now()}`;
    const newElement = {
      id, type: "shape", shapeType, x: 150, y: 150, size: 60, color: "#e1496d",
      opacity: 1, rotate: 0, fillType: "solid", strokeColor: "#e1496d", strokeWidth: 0, strokeType: "none"
    };
    const updated = [...logoElements, newElement];
    updateElements(updated);
    setActiveElementId(id);
    setShowShapePicker(false);
  };

  // Insert Icon
  const addIcon = (iconName) => {
    const id = `icon_${Date.now()}`;
    const newElement = {
      id, type: "icon", shape: iconName, x: 150, y: 150, size: 70, color: "#e1496d",
      opacity: 1, rotate: 0, fillType: "solid", strokeColor: "#e1496d", strokeWidth: 0, strokeType: "none"
    };
    const updated = [...logoElements, newElement];
    updateElements(updated);
    setActiveElementId(id);
    setShowIconPicker(false);
  };

  // Insert Text layer
  const addText = () => {
    const id = `text_${Date.now()}`;
    const newElement = {
      id, type: "text", text: "NEW BRAND", x: 150, y: 180, size: 24, font: "Syne", color: "#ffffff",
      letterSpacing: 2, rotate: 0, fillType: "solid", strokeColor: "#e1496d", strokeWidth: 0, strokeType: "none", opacity: 1
    };
    const updated = [...logoElements, newElement];
    updateElements(updated);
    setActiveElementId(id);
  };

  // Delete Element
  const deleteElement = (id) => {
    const updated = logoElements.filter(el => el.id !== id);
    updateElements(updated);
    if (activeElementId === id) setActiveElementId(null);
  };

  // Duplicate element
  const duplicateElement = (id) => {
    const el = logoElements.find(e => e.id === id);
    if (!el) return;
    const newEl = { ...JSON.parse(JSON.stringify(el)), id: `${el.type}_${Date.now()}`, x: el.x + 15, y: el.y + 15 };
    const updated = [...logoElements, newEl];
    updateElements(updated);
    setActiveElementId(newEl.id);
  };

  // Modify Element property
  const updateElementProp = (prop, val) => {
    const updated = logoElements.map(el => el.id === activeElementId ? { ...el, [prop]: val } : el);
    updateElements(updated);
  };

  // Alignment utilities
  const alignElementCenter = () => { if (activeElementId) updateElementProp("x", 150); };
  const alignElementMiddle = () => { if (activeElementId) updateElementProp("y", 150); };
  const resetElementRotation = () => { if (activeElementId) updateElementProp("rotate", 0); };

  const bringToFront = () => {
    if (!activeElementId) return;
    const activeEl = logoElements.find(el => el.id === activeElementId);
    if (!activeEl) return;
    updateElements([...logoElements.filter(el => el.id !== activeElementId), activeEl]);
  };

  const sendToBack = () => {
    if (!activeElementId) return;
    const activeEl = logoElements.find(el => el.id === activeElementId);
    if (!activeEl) return;
    updateElements([activeEl, ...logoElements.filter(el => el.id !== activeElementId)]);
  };

  const applyBrandPalette = (pal, idx) => {
    setActivePaletteIdx(idx);
    setCanvasBg(pal.bg);
    setLastCanvasColor(pal.bg);
    const updated = logoElements.map(el => {
      if (el.type === "icon" || el.type === "shape") return { ...el, color: pal.primary };
      if (el.type === "text" && el.id === "el_tag") return { ...el, color: pal.secondary };
      if (el.type === "text") return { ...el, color: pal.text };
      return el;
    });
    updateElements(updated);
  };

  // Save changes
  const handleSaveAndExit = () => {
    const savedWorks = JSON.parse(localStorage.getItem("creatify_past_works") || "[]");
    const projectId = initialProject?.id || `logo_${Date.now()}`;
    const existingIdx = savedWorks.findIndex(w => w.id === projectId);
    const projectData = {
      id: projectId, title: projectTitle.trim() || "Untitled Logo Design",
      category: "Logo Design", tool: "Logo Maker", year: new Date().getFullYear().toString(),
      accent: "#ec4899", gradient: "linear-gradient(135deg, #1a0f14 0%, #3a0c19 40%, #1a0f14 100%)",
      image: "", icon: "✦", tags: ["SVG Vector", `${logoElements.length} Shapes`, "Mockups"],
      desc: `Geometric brand logo design containing ${logoElements.length} vector nodes.`,
      data: { canvasBg, brandName, tagline, elements: logoElements }
    };
    if (existingIdx > -1) savedWorks[existingIdx] = projectData;
    else savedWorks.unshift(projectData);
    localStorage.setItem("creatify_past_works", JSON.stringify(savedWorks));
    const token = localStorage.getItem("creatify_token");
    if (token) {
      fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(projectData)
      }).then(res => { if (!res.ok) throw new Error("Server rejected save"); })
        .catch(err => console.error("DB save error:", err.message))
        .finally(() => onBack());
    } else { onBack(); }
  };

  const handleDiscardAndExit = () => onBack();

  // Export SVG
  const triggerSVGExport = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);
    if (!source.match(/^<svg[^>]+xmlns="http\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    source = source.replace(/<rect[^>]*stroke-dasharray="4,?\s*3"[^>]*><\/rect>/g, "");
    source = source.replace(/<rect[^>]*stroke-dasharray="4,?\s*3"[^>]*\/>/g, "");
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    const link = document.createElement("a");
    link.download = `${projectTitle.replace(/\s+/g, "_")}.svg`;
    link.href = url; link.click();
  };

  const triggerPNGExport = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);
    source = source.replace(/<rect[^>]*stroke-dasharray="4,?\s*3"[^>]*><\/rect>/g, "");
    source = source.replace(/<rect[^>]*stroke-dasharray="4,?\s*3"[^>]*\/>/g, "");
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200; canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (canvasBg === "transparent") ctx.clearRect(0, 0, 1200, 1200);
      else { ctx.fillStyle = canvasBg; ctx.fillRect(0, 0, 1200, 1200); }
      ctx.drawImage(img, 0, 0, 1200, 1200);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${projectTitle.replace(/\s+/g, "_")}.png`;
      link.href = pngUrl; link.click();
    };
    img.src = url;
  };

  const triggerMockupExport = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);
    source = source.replace(/<rect[^>]*stroke-dasharray="4,?\s*3"[^>]*><\/rect>/g, "");
    source = source.replace(/<rect[^>]*stroke-dasharray="4,?\s*3"[^>]*\/>/g, "");
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200; canvas.height = 900;
      const ctx = canvas.getContext("2d");
      if (activeMockup === "card") {
        ctx.fillStyle = "#111111"; ctx.fillRect(0, 0, 1200, 900);
        ctx.save(); ctx.translate(600, 450);
        ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 40; ctx.shadowOffsetX = 10; ctx.shadowOffsetY = 20;
        ctx.transform(1, -0.05, 0.1, 0.9, 0, 0);
        ctx.fillStyle = "#1c1917"; ctx.strokeStyle = "#292524"; ctx.lineWidth = 4;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-300, -170, 600, 340, 20);
        else ctx.rect(-300, -170, 600, 340);
        ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
        ctx.drawImage(img, -120, -120, 240, 240); ctx.restore();
      } else if (activeMockup === "mug") {
        ctx.fillStyle = "#e5e7eb"; ctx.fillRect(0, 0, 1200, 900);
        ctx.save(); ctx.translate(600, 450);
        ctx.beginPath(); ctx.ellipse(0, 240, 200, 30, 0, 0, 2*Math.PI);
        ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.fill();
        ctx.strokeStyle = "#fcfaf2"; ctx.lineWidth = 45; ctx.lineCap = "round";
        ctx.beginPath(); ctx.arc(120, 40, 90, -Math.PI/2.2, Math.PI/2.2); ctx.stroke();
        ctx.strokeStyle = "#f0ede0"; ctx.lineWidth = 15;
        ctx.beginPath(); ctx.arc(120, 40, 90, -Math.PI/2.2, Math.PI/2.2); ctx.stroke();
        ctx.fillStyle = "#fcfaf2";
        ctx.beginPath(); ctx.ellipse(0, -200, 180, 25, 0, 0, 2*Math.PI); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-180,-200); ctx.lineTo(-180,200);
        ctx.quadraticCurveTo(-180,240,0,240); ctx.quadraticCurveTo(180,240,180,200);
        ctx.lineTo(180,-200); ctx.closePath(); ctx.fill();
        ctx.drawImage(img, -100, -60, 200, 200); ctx.restore();
      } else if (activeMockup === "sticker") {
        ctx.fillStyle = "#2d3748"; ctx.fillRect(0, 0, 1200, 900);
        ctx.save(); ctx.translate(600, 450);
        ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 15;
        ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(0, 0, 280, 0, 2*Math.PI); ctx.fill();
        ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
        ctx.fillStyle = canvasBg === "transparent" ? lastCanvasColor : canvasBg;
        ctx.beginPath(); ctx.arc(0, 0, 250, 0, 2*Math.PI); ctx.fill();
        ctx.drawImage(img, -170, -170, 340, 340); ctx.restore();
      }
      URL.revokeObjectURL(url);
      const mockupUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${projectTitle.replace(/\s+/g, "_")}_mockup_${activeMockup}.png`;
      link.href = mockupUrl; link.click();
    };
    img.src = url;
  };

  // Render SVG Elements
  const renderSVGNodes = () => {
    const getStarPoints = (size) => {
      const spikes = 5, outerRadius = size / 2, innerRadius = size / 4.5;
      let rot = Math.PI / 2 * 3, pts = [];
      const step = Math.PI / spikes;
      for (let i = 0; i < spikes; i++) {
        pts.push(`${Math.cos(rot)*outerRadius},${Math.sin(rot)*outerRadius}`); rot += step;
        pts.push(`${Math.cos(rot)*innerRadius},${Math.sin(rot)*innerRadius}`); rot += step;
      }
      return pts.join(" ");
    };
    const getHexagonPoints = (size) => {
      const r = size / 2;
      return Array.from({length:6}, (_, i) => {
        const angle = (Math.PI/3)*i + Math.PI/6;
        return `${Math.cos(angle)*r},${Math.sin(angle)*r}`;
      }).join(" ");
    };
    const shieldPath = "M 0,-50 C 30,-50 50,-40 50,-10 C 50,20 20,45 0,50 C -20,45 -50,20 -50,-10 C -50,-40 -30,-50 0,-50 Z";

    return logoElements.map(el => {
      const transform = `translate(${el.x}, ${el.y}) rotate(${el.rotate ?? 0})`;
      const opacity = el.opacity ?? 1;
      const isActive = el.id === activeElementId;
      const fillVal = el.fillType === "none" ? "none" : el.color;
      const strokeVal = el.strokeType === "none" ? "none" : el.strokeColor || el.color;
      const strokeWidthVal = el.strokeType === "none" ? 0 : el.strokeWidth ?? 1.5;
      const strokeDashVal = el.strokeType === "dashed" ? "3 3" : "none";
      let border = null;
      if (isActive) {
        if (el.type === "icon" || el.type === "shape") {
          const half = el.size / 2;
          border = <rect x={-half-6} y={-half-6} width={el.size+12} height={el.size+12} fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4 3" style={{ pointerEvents:"none" }} />;
        } else if (el.type === "text") {
          const textWidth = (el.text||"").length * el.size * 0.55;
          const textHeight = el.size;
          border = <rect x={-textWidth/2-6} y={-textHeight/2-6} width={textWidth+12} height={textHeight+12} fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4 3" style={{ pointerEvents:"none" }} />;
        }
      }
      const fontFamilyMap = {
        "Syne":"Syne, sans-serif","Outfit":"Outfit, sans-serif","Cinzel":"Cinzel, serif",
        "Pacifico":"Pacifico, cursive","Montserrat":"Montserrat, sans-serif","Inter":"Inter, sans-serif",
        "Playfair Display":"Playfair Display, serif","Poppins":"Poppins, sans-serif"
      };
      if (el.type === "icon") {
        const path = PRESET_ICONS[el.shape] || PRESET_ICONS.rocket;
        return (
          <g key={el.id} transform={transform} opacity={opacity} style={{ cursor:"grab" }} onMouseDown={(e) => handleSvgElementMouseDown(e, el.id)}>
            <path d={path} fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} transform={`scale(${el.size/24}) translate(-12,-12)`} />
            {border}
          </g>
        );
      } else if (el.type === "text") {
        return (
          <g key={el.id} transform={transform} opacity={opacity} style={{ cursor:"grab" }} onMouseDown={(e) => handleSvgElementMouseDown(e, el.id)}>
            <text fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} fontSize={el.size} fontFamily={fontFamilyMap[el.font] || "Poppins, sans-serif"} fontWeight={el.bold ? "bold" : "bold"} fontStyle={el.italic ? "italic" : "normal"} letterSpacing={el.letterSpacing||0} textAnchor="middle" dominantBaseline="middle">
              {el.uppercase ? (el.text||"").toUpperCase() : el.text}
            </text>
            {border}
          </g>
        );
      } else if (el.type === "shape") {
        return (
          <g key={el.id} transform={transform} opacity={opacity} style={{ cursor:"grab" }} onMouseDown={(e) => handleSvgElementMouseDown(e, el.id)}>
            {el.shapeType === "circle" && <circle cx={0} cy={0} r={el.size/2} fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} />}
            {el.shapeType === "box" && <rect x={-el.size/2} y={-el.size/2} width={el.size} height={el.size} fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} rx={8} />}
            {el.shapeType === "triangle" && <polygon points={`0,${-el.size/2} ${el.size/2},${el.size/2} ${-el.size/2},${el.size/2}`} fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} />}
            {el.shapeType === "star" && <polygon points={getStarPoints(el.size)} fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} />}
            {el.shapeType === "hexagon" && <polygon points={getHexagonPoints(el.size)} fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} />}
            {el.shapeType === "shield" && <path d={shieldPath} fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} transform={`scale(${el.size/100})`} />}
            {el.shapeType === "ring" && <circle cx={0} cy={0} r={el.size/2} fill="none" stroke={strokeVal||el.color} strokeWidth={strokeWidthVal||2} strokeDasharray={strokeDashVal} />}
            {el.shapeType === "badge" && <g><circle cx={0} cy={0} r={el.size/2} fill={fillVal} stroke={strokeVal} strokeWidth={strokeWidthVal} strokeDasharray={strokeDashVal} /><circle cx={0} cy={0} r={el.size/2-4} fill="none" stroke={strokeVal} strokeWidth={1} strokeDasharray="3 2" /></g>}
            {border}
          </g>
        );
      }
      return null;
    });
  };

  const activeElement = logoElements.find(el => el.id === activeElementId);

  const inputStyle = { width:"100%", background:"#1a0f14", border:"1px solid rgba(225,73,109,0.15)", borderRadius:"6px", color:"#fff", padding:"6px 10px", fontSize:"12px", fontFamily:"'Poppins',sans-serif", boxSizing:"border-box" };
  const labelStyle = { fontSize:"10px", color:"#5c5650", display:"block", marginBottom:"4px", fontFamily:"'Poppins',sans-serif" };
  const sliderStyle = { width:"100%", cursor:"pointer", accentColor:"#ec4899" };
  const sectionLabel = { fontSize:"10px", color:"#5c5650", display:"block", marginBottom:"8px", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", fontFamily:"'Poppins',sans-serif" };

  return (
    <div style={{ background:"#1a0f14", color:"#e5e5e5", fontFamily:"'Poppins',sans-serif", height:"100vh", width:"100vw", display:"flex", flexDirection:"column", overflow:"hidden", userSelect:"none" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Syne:wght@700;800&family=Outfit:wght@400;600&family=Cinzel:wght@600;800&family=Pacifico&family=Montserrat:wght@400;700&family=Inter:wght@400;500&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />

      {/* Main Studio Body */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ===================== LEFT PANEL ===================== */}
        <div style={{ width:"320px", minWidth:"320px", borderRight:"1px solid rgba(225,73,109,0.12)", background:"rgba(10,8,7,0.5)", display:"flex", flexDirection:"column" }}>

          {/* Tabs bar — 5 tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid rgba(225,73,109,0.08)", overflowX:"auto" }}>
            {[
              { id:"ai", label:"AI" },
              { id:"editor", label:"Layers" },
              { id:"mockups", label:"Mockups" },
              { id:"templates", label:"Templates" },
              { id:"fontpairs", label:"Font Pairs" }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex:1, minWidth:"52px", padding:"11px 4px 9px", background:"none", border:"none", borderBottom: isActive ? "2px solid #ec4899" : "2px solid transparent", color: isActive ? "#ec4899" : "#666", fontWeight: isActive ? 600 : 400, fontSize:"10px", cursor:"pointer", transition:"all 0.2s", fontFamily:"'Poppins',sans-serif", whiteSpace:"nowrap" }}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>

            {/* ---- AI Panel ---- */}
            {activeTab === "ai" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <span style={{ fontSize:"10px", color:"#ec4899", fontWeight:600, letterSpacing:"0.05em" }}>AI LOGO GENERATOR</span>
                <div>
                  <label style={labelStyle}>Brand / Company Name</label>
                  <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Slogan / Tagline</label>
                  <input type="text" value={tagline} onChange={e => setTagline(e.target.value)} style={inputStyle} />
                </div>
                <button onClick={generateAISuggestions} disabled={isGenerating} style={{ padding:"10px", background:"linear-gradient(135deg,#942945,#ec4899)", border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontFamily:"'Poppins',sans-serif", fontWeight:500 }}>
                  {isGenerating ? "Processing design matrices..." : "✦ Generate Design Suggestions"}
                </button>
                {aiSuggestions.length > 0 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginTop:"8px" }}>
                    <span style={sectionLabel}>SELECT SUGGESTED LOGO</span>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                      {aiSuggestions.map((sug, i) => (
                        <div key={i} onClick={() => loadSuggestion(sug)} style={{ background:"#1a0f14", border:"1px solid rgba(225,73,109,0.12)", borderRadius:"10px", padding:"12px", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor="#ec4899"} onMouseLeave={e => e.currentTarget.style.borderColor="rgba(225,73,109,0.12)"}>
                          <div style={{ fontSize:"28px", marginBottom:"4px" }}>✦</div>
                          <span style={{ fontSize:"11px", fontWeight:500 }}>{sug.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---- Editor / Layers Panel ---- */}
            {activeTab === "editor" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

                {/* Brand color themes */}
                <div>
                  <span style={sectionLabel}>BRAND COLOR THEMES</span>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"6px" }}>
                    {BRAND_PALETTES.map((pal, idx) => (
                      <button key={pal.name} onClick={() => applyBrandPalette(pal, idx)} style={{ height:"24px", borderRadius:"6px", background:pal.bg, border: idx===activePaletteIdx ? "2px solid #ec4899" : "1px solid rgba(255,255,255,0.15)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"2px" }}>
                        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:pal.primary }} />
                        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:pal.secondary }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add elements — NEW prominent buttons */}
                <div>
                  <span style={sectionLabel}>ADD ELEMENTS</span>
                  <div style={{ display:"flex", gap:"6px", marginBottom:"8px" }}>
                    <button onClick={addText} style={{ flex:1, padding:"8px 4px", background:"rgba(236,72,153,0.12)", border:"1px solid rgba(225,73,109,0.3)", borderRadius:"8px", color:"#ec4899", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif", fontWeight:500 }}>
                      T Add Text
                    </button>
                    <button onClick={() => { setShowShapePicker(v => !v); setShowIconPicker(false); }} style={{ flex:1, padding:"8px 4px", background: showShapePicker ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.25)", borderRadius:"8px", color:"#ccc", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif", fontWeight:500 }}>
                      ● Shape
                    </button>
                    <button onClick={() => { setShowIconPicker(v => !v); setShowShapePicker(false); }} style={{ flex:1, padding:"8px 4px", background: showIconPicker ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.25)", borderRadius:"8px", color:"#ccc", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif", fontWeight:500 }}>
                      ✦ Icon
                    </button>
                  </div>

                  {showShapePicker && (
                    <div style={{ background:"rgba(10,8,7,0.9)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"8px", padding:"10px", marginBottom:"8px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"6px" }}>
                      {[["circle","●"],["box","■"],["triangle","▲"],["star","★"],["hexagon","⬡"],["shield","🛡"],["ring","○"],["badge","◎"]].map(([s,ic]) => (
                        <button key={s} onClick={() => addShape(s)} style={{ padding:"8px 4px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(225,73,109,0.15)", borderRadius:"6px", color:"#ddd", cursor:"pointer", fontSize:"13px", display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }} title={s}>
                          <span>{ic}</span>
                          <span style={{ fontSize:"8px", color:"#888" }}>{s}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {showIconPicker && (
                    <div style={{ background:"rgba(10,8,7,0.9)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"8px", padding:"10px", marginBottom:"8px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"6px" }}>
                      {Object.keys(PRESET_ICONS).map(ic => (
                        <button key={ic} onClick={() => addIcon(ic)} style={{ padding:"8px 4px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(225,73,109,0.15)", borderRadius:"6px", color:"#ddd", cursor:"pointer", fontSize:"11px", textTransform:"capitalize", fontFamily:"'Poppins',sans-serif" }}>
                          {ic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ height:"1px", background:"rgba(225,73,109,0.08)" }} />

                {/* Vector Hierarchy */}
                <div>
                  <span style={sectionLabel}>VECTOR HIERARCHY</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                    {logoElements.map(el => {
                      const isAct = activeElementId === el.id;
                      return (
                        <div key={el.id} onClick={() => setActiveElementId(el.id)} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 10px", borderRadius:"6px", background: isAct ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.02)", border:`1px solid ${isAct ? "#ec4899" : "rgba(255,255,255,0.05)"}`, cursor:"pointer", fontSize:"11px" }}>
                          <span>{el.type==="icon"?"✦":el.type==="text"?"T":"●"}</span>
                          <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{el.id}</span>
                          <button onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }} style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"12px", lineHeight:1 }}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {activeElement && (
                  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                    <div style={{ height:"1px", background:"rgba(225,73,109,0.08)" }} />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:"10px", color:"#ec4899", fontWeight:700 }}>EDIT: {activeElement.id}</span>
                    </div>
                    <div>
                      <span style={sectionLabel}>ALIGN ELEMENT</span>
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button onClick={alignElementCenter} style={{ flex:1, padding:"5px", fontSize:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"6px", color:"#ccc", cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>Center X</button>
                        <button onClick={alignElementMiddle} style={{ flex:1, padding:"5px", fontSize:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"6px", color:"#ccc", cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>Center Y</button>
                        <button onClick={resetElementRotation} style={{ flex:1, padding:"5px", fontSize:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"6px", color:"#ccc", cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>Reset °</button>
                      </div>
                    </div>
                    <div>
                      <span style={sectionLabel}>ORDER DEPTH</span>
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button onClick={bringToFront} style={{ flex:1, padding:"5px", fontSize:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"6px", color:"#ccc", cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>Bring Front</button>
                        <button onClick={sendToBack} style={{ flex:1, padding:"5px", fontSize:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"6px", color:"#ccc", cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>Send Back</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---- Mockups Panel ---- */}
            {activeTab === "mockups" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <span style={sectionLabel}>MOCKUP SELECTION</span>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {[
                    { id:"card", name:"Premium Black Card", desc:"Minimalist business layout" },
                    { id:"mug", name:"Ceramic Coffee Mug", desc:"Centered cylinder product stamp" },
                    { id:"sticker", name:"Modern Laptop Sticker", desc:"Glow background laptop skin" }
                  ].map(mock => {
                    const isAct = activeMockup === mock.id;
                    return (
                      <div key={mock.id} onClick={() => setActiveMockup(mock.id)} style={{ padding:"12px", borderRadius:"10px", background: isAct ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.02)", border:`1px solid ${isAct ? "#ec4899" : "rgba(255,255,255,0.05)"}`, cursor:"pointer", transition:"all 0.2s" }}>
                        <div style={{ fontSize:"12px", fontWeight:600, color: isAct ? "#ec4899" : "#fff" }}>{mock.name}</div>
                        <div style={{ fontSize:"10px", color:"#666", marginTop:"2px" }}>{mock.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---- Templates Panel ---- */}
            {activeTab === "templates" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                <span style={sectionLabel}>LOGO TEMPLATES</span>
                <p style={{ fontSize:"10px", color:"#5c5650", margin:0, lineHeight:1.5 }}>Click a template to apply it to your canvas.</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                  {LOGO_TEMPLATES.map(tpl => (
                    <div key={tpl.id} onClick={() => loadTemplate(tpl)} style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid rgba(225,73,109,0.12)", cursor:"pointer", transition:"all 0.2s", background:tpl.bg || "#1a0f14" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor="#ec4899"; e.currentTarget.style.transform="scale(1.02)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(225,73,109,0.12)"; e.currentTarget.style.transform="scale(1)"; }}>
                      <div style={{ height:"80px", display:"flex", alignItems:"center", justifyContent:"center", background:tpl.bg || "#1a0f14" }}>
                        <svg width="70" height="70" viewBox="0 0 300 300">
                          {tpl.elements.map(el => {
                            const t = `translate(${el.x},${el.y}) rotate(${el.rotate||0})`;
                            if (el.type==="icon") {
                              const p = PRESET_ICONS[el.shape] || PRESET_ICONS.rocket;
                              return <g key={el.id} transform={t} opacity={el.opacity||1}><path d={p} fill={el.fillType==="none"?"none":el.color} transform={`scale(${el.size/24}) translate(-12,-12)`} /></g>;
                            } else if (el.type==="text") {
                              return <g key={el.id} transform={t} opacity={el.opacity||1}><text fill={el.color} fontSize={el.size} fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{el.text}</text></g>;
                            } else if (el.type==="shape") {
                              const fv = el.fillType==="none"?"none":el.color;
                              const sw = el.strokeType==="none"?0:el.strokeWidth||1.5;
                              const scv = el.strokeType==="none"?"none":el.strokeColor||el.color;
                              if (el.shapeType==="circle") return <circle key={el.id} cx={el.x} cy={el.y} r={el.size/2} fill={fv} stroke={scv} strokeWidth={sw} />;
                              if (el.shapeType==="ring") return <circle key={el.id} cx={el.x} cy={el.y} r={el.size/2} fill="none" stroke={scv||el.color} strokeWidth={sw||2} />;
                              return <rect key={el.id} x={el.x-el.size/2} y={el.y-el.size/2} width={el.size} height={el.size} fill={fv} stroke={scv} strokeWidth={sw} rx={4} />;
                            }
                            return null;
                          })}
                        </svg>
                      </div>
                      <div style={{ padding:"6px 8px", background:"rgba(0,0,0,0.4)" }}>
                        <span style={{ fontSize:"10px", fontWeight:600, color:"#ddd", fontFamily:"'Poppins',sans-serif" }}>{tpl.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- Font Pairs Panel ---- */}
            {activeTab === "fontpairs" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                <span style={sectionLabel}>FONT COMBINATIONS</span>
                <p style={{ fontSize:"10px", color:"#5c5650", margin:0, lineHeight:1.5 }}>Click to apply fonts to your brand name and tagline.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {FONT_PAIRS.map(pair => (
                    <div key={pair.id} onClick={() => applyFontPair(pair)} style={{ padding:"12px", borderRadius:"10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(225,73,109,0.12)", cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor="#ec4899"}
                      onMouseLeave={e => e.currentTarget.style.borderColor="rgba(225,73,109,0.12)"}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                        <span style={{ fontSize:"11px", fontWeight:600, color:"#fff", fontFamily:"'Poppins',sans-serif" }}>{pair.name}</span>
                        <span style={{ fontSize:"9px", color:"#ec4899", background:"rgba(236,72,153,0.12)", padding:"2px 6px", borderRadius:"20px" }}>{pair.desc}</span>
                      </div>
                      <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"16px", fontFamily:`'${pair.heading}', serif`, color:"#fdf2f4", lineHeight:1.2 }}>Heading</div>
                          <div style={{ fontSize:"9px", color:"#5c5650", marginTop:"2px" }}>{pair.heading}</div>
                        </div>
                        <div style={{ width:"1px", height:"30px", background:"rgba(225,73,109,0.2)" }} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"12px", fontFamily:`'${pair.body}', sans-serif`, color:"#8c8780", lineHeight:1.2 }}>Body text</div>
                          <div style={{ fontSize:"9px", color:"#5c5650", marginTop:"2px" }}>{pair.body}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
        {/* ===================== END LEFT PANEL ===================== */}

        {/* ===================== CENTER CANVAS ===================== */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#0f070b", position:"relative", minWidth:0 }}>

          {/* Top Toolbar */}
          <div style={{ height:"48px", background:"rgba(10,8,7,0.95)", borderBottom:"1px solid rgba(225,73,109,0.12)", display:"flex", alignItems:"center", padding:"0 16px", justifyContent:"space-between", gap:"8px" }}>

            {/* Left: Exit + Title */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
              <button onClick={() => setShowLeaveModal(true)} style={{ padding:"5px 12px", background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"6px", color:"#ef4444", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif" }}>Exit</button>
              <div style={{ width:"1px", height:"16px", background:"rgba(225,73,109,0.15)" }} />
              <span style={{ fontFamily:"Syne", fontSize:"15px", fontWeight:800 }}>LogoStudio</span>
            </div>

            {/* Center: Undo/Redo + Zoom + BG */}
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              {/* Undo / Redo */}
              <button onClick={handleUndo} title="Undo" style={{ padding:"5px 9px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.18)", borderRadius:"6px", color:"#aaa", cursor:"pointer", fontSize:"13px", fontFamily:"'Poppins',sans-serif" }}>↩</button>
              <button onClick={handleRedo} title="Redo" style={{ padding:"5px 9px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.18)", borderRadius:"6px", color:"#aaa", cursor:"pointer", fontSize:"13px", fontFamily:"'Poppins',sans-serif" }}>↪</button>

              <div style={{ width:"1px", height:"16px", background:"rgba(225,73,109,0.15)" }} />

              {/* Zoom */}
              <button onClick={() => setZoom(z => Math.max(50, z-10))} style={{ padding:"5px 8px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.18)", borderRadius:"6px", color:"#aaa", cursor:"pointer", fontSize:"12px" }}>−</button>
              <span style={{ fontSize:"11px", color:"#8c8780", minWidth:"38px", textAlign:"center" }}>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z+10))} style={{ padding:"5px 8px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.18)", borderRadius:"6px", color:"#aaa", cursor:"pointer", fontSize:"12px" }}>+</button>

              <div style={{ width:"1px", height:"16px", background:"rgba(225,73,109,0.15)" }} />

              {/* Canvas BG quick swatches */}
              <div style={{ position:"relative" }}>
                <button onClick={() => setShowBgPicker(v => !v)} style={{ display:"flex", alignItems:"center", gap:"5px", padding:"4px 8px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.18)", borderRadius:"6px", cursor:"pointer", fontSize:"11px", color:"#aaa", fontFamily:"'Poppins',sans-serif" }}>
                  <div style={{ width:"14px", height:"14px", borderRadius:"3px", background: canvasBg==="transparent" ? "repeating-conic-gradient(#555 0% 25%,#333 0% 50%) 0% 0% / 8px 8px" : canvasBg, border:"1px solid rgba(255,255,255,0.2)" }} />
                  BG
                </button>
                {showBgPicker && (
                  <div style={{ position:"absolute", top:"34px", left:0, background:"#131110", border:"1px solid rgba(225,73,109,0.25)", borderRadius:"10px", padding:"10px", zIndex:100, minWidth:"160px", boxShadow:"0 8px 24px rgba(0,0,0,0.5)" }}>
                    <div style={{ fontSize:"9px", color:"#5c5650", marginBottom:"8px", fontWeight:600 }}>CANVAS BACKGROUND</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"6px", marginBottom:"8px" }}>
                      {["#1a0f14","#030712","#0f0728","#f7f4f7","#111111","#ffffff","#030712","transparent"].map(c => (
                        <button key={c} onClick={() => { if(c==="transparent"){setCanvasBg("transparent");}else{setCanvasBg(c);setLastCanvasColor(c);} setShowBgPicker(false); }} style={{ width:"28px", height:"28px", borderRadius:"6px", background: c==="transparent" ? "repeating-conic-gradient(#555 0% 25%,#333 0% 50%) 0% 0% / 8px 8px" : c, border: canvasBg===c ? "2px solid #ec4899" : "1px solid rgba(255,255,255,0.2)", cursor:"pointer" }} title={c} />
                      ))}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <span style={{ fontSize:"10px", color:"#8c8780" }}>Custom:</span>
                      <input type="color" value={canvasBg==="transparent" ? lastCanvasColor : canvasBg} onChange={e => { setCanvasBg(e.target.value); setLastCanvasColor(e.target.value); }} style={{ width:"28px", height:"22px", border:"none", background:"none", cursor:"pointer", padding:0 }} />
                    </div>
                    <label style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"8px", fontSize:"10px", color:"#8c8780", cursor:"pointer" }}>
                      <input type="checkbox" checked={canvasBg==="transparent"} onChange={e => { if(e.target.checked)setCanvasBg("transparent"); else setCanvasBg(lastCanvasColor); }} style={{ accentColor:"#ec4899" }} />
                      Transparent
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Export */}
            <div style={{ display:"flex", gap:"8px", alignItems:"center", flexShrink:0 }}>
              {activeTab === "mockups" ? (
                <button onClick={triggerMockupExport} style={{ padding:"5px 12px", background:"linear-gradient(135deg,#942945,#ec4899)", border:"none", color:"#fff", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif" }}>Download Mockup PNG</button>
              ) : (
                <>
                  <button onClick={triggerSVGExport} style={{ padding:"5px 12px", border:"1px solid rgba(225,73,109,0.25)", color:"#fff", background:"rgba(255,255,255,0.02)", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif" }}>Export SVG</button>
                  <button onClick={triggerPNGExport} style={{ padding:"5px 12px", background:"linear-gradient(135deg,#942945,#ec4899)", border:"none", color:"#fff", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif" }}>Export PNG</button>
                </>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px", overflow:"hidden" }} onClick={() => setShowBgPicker(false)}>
            {activeTab === "mockups" ? (
              <div style={{ width:"100%", maxWidth:"600px", height:"100%", maxHeight:"400px", borderRadius:"20px", overflow:"hidden", boxShadow:"0 20px 50px rgba(0,0,0,0.6)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", background: activeMockup==="card" ? "#111" : activeMockup==="mug" ? "#e5e7eb" : "#2d3748", position:"relative" }}>
                {activeMockup === "card" && (
                  <div style={{ width:"380px", height:"210px", background:"#1c1917", borderRadius:"12px", border:"1px solid #292524", boxShadow:"0 10px 30px rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", transform:"rotateX(20deg) rotateY(-20deg)", transformStyle:"preserve-3d" }}>
                    <svg width="220" height="150" viewBox="0 0 300 300">{renderSVGNodes()}</svg>
                  </div>
                )}
                {activeMockup === "mug" && (
                  <div style={{ width:"160px", height:"220px", background:"#fcfaf2", borderRadius:"0 0 40px 40px", borderTop:"2px solid #e5e5e5", boxShadow:"0 15px 35px rgba(0,0,0,0.15)", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ position:"absolute", right:"-35px", top:"50px", width:"45px", height:"110px", borderRadius:"0 40px 40px 0", border:"16px solid #fcfaf2", borderLeft:"none", zIndex:-1 }} />
                    <svg width="100" height="120" viewBox="0 0 300 300">{renderSVGNodes()}</svg>
                  </div>
                )}
                {activeMockup === "sticker" && (
                  <div style={{ width:"240px", height:"240px", borderRadius:"50%", background:"#ffffff", padding:"10px", boxShadow:"0 10px 30px rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:canvasBg, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                      <svg width="140" height="140" viewBox="0 0 300 300">{renderSVGNodes()}</svg>
                    </div>
                  </div>
                )}
                <div style={{ position:"absolute", top:"16px", left:"16px", background:"rgba(0,0,0,0.6)", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", border:"1px solid rgba(255,255,255,0.12)", color:"#ec4899", fontWeight:600 }}>MOCKUP SIMULATION</div>
              </div>
            ) : (
              <div style={{ background: canvasBg==="transparent" ? "repeating-conic-gradient(#141210 0% 25%, #24201c 0% 50%) 0% 0% / 24px 24px" : canvasBg, width:`${zoom}%`, maxWidth:"500px", aspectRatio:"1/1", borderRadius:"24px", boxShadow:"0 25px 60px rgba(0,0,0,0.55)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", transition:"background 0.3s, width 0.2s" }}>
                <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 300 300" style={{ display:"block" }} onMouseMove={handleSvgMouseMove} onMouseUp={handleSvgMouseUp} onMouseLeave={handleSvgMouseUp}>
                  {renderSVGNodes()}
                </svg>
              </div>
            )}
          </div>
        </div>
        {/* ===================== END CENTER ===================== */}

        {/* ===================== RIGHT PROPERTIES PANEL ===================== */}
        {activeElementId && activeElement && (
          <div style={{ width:"240px", minWidth:"240px", borderLeft:"1px solid rgba(225,73,109,0.12)", background:"rgba(10,8,7,0.5)", display:"flex", flexDirection:"column", overflowY:"auto" }}>
            <div style={{ padding:"14px 14px 10px", borderBottom:"1px solid rgba(225,73,109,0.08)" }}>
              <span style={{ fontSize:"10px", color:"#ec4899", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>Properties</span>
              <div style={{ fontSize:"9px", color:"#5c5650", marginTop:"2px" }}>{activeElement.type} · {activeElement.id}</div>
            </div>

            <div style={{ padding:"12px", display:"flex", flexDirection:"column", gap:"14px" }}>

              {/* TEXT properties */}
              {activeElement.type === "text" && (
                <>
                  <div>
                    <label style={labelStyle}>Text Content</label>
                    <input type="text" value={activeElement.text||""} onChange={e => updateElementProp("text", e.target.value)} style={{...inputStyle, padding:"6px 8px"}} />
                  </div>

                  <div>
                    <label style={labelStyle}>Font Family</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px" }}>
                      {FONT_FAMILIES.map(f => (
                        <button key={f} onClick={() => updateElementProp("font", f)} style={{ padding:"5px 4px", background: activeElement.font===f ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.03)", border:`1px solid ${activeElement.font===f ? "#ec4899" : "rgba(225,73,109,0.15)"}`, borderRadius:"5px", color: activeElement.font===f ? "#ec4899" : "#aaa", cursor:"pointer", fontSize:"9px", fontFamily:`'${f}', sans-serif`, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                      <label style={{...labelStyle, marginBottom:0}}>Font Size</label>
                      <span style={{ fontSize:"10px", color:"#ec4899" }}>{activeElement.size}px</span>
                    </div>
                    <input type="range" min="8" max="120" value={activeElement.size} onChange={e => updateElementProp("size", parseInt(e.target.value))} style={sliderStyle} />
                  </div>

                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                      <label style={{...labelStyle, marginBottom:0}}>Letter Spacing</label>
                      <span style={{ fontSize:"10px", color:"#ec4899" }}>{activeElement.letterSpacing??0}</span>
                    </div>
                    <input type="range" min="-5" max="20" value={activeElement.letterSpacing??0} onChange={e => updateElementProp("letterSpacing", parseInt(e.target.value))} style={sliderStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Style</label>
                    <div style={{ display:"flex", gap:"5px" }}>
                      {[["Bold","bold"],["Italic","italic"],["Upper","uppercase"]].map(([lbl, prop]) => {
                        const isOn = prop==="bold" ? activeElement.bold!==false : prop==="italic" ? !!activeElement.italic : !!activeElement.uppercase;
                        return (
                          <button key={prop} onClick={() => updateElementProp(prop, !isOn)} style={{ flex:1, padding:"5px", background: isOn ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.04)", border:`1px solid ${isOn ? "#ec4899" : "rgba(225,73,109,0.2)"}`, borderRadius:"5px", color: isOn ? "#ec4899" : "#888", cursor:"pointer", fontSize:"10px", fontFamily:"'Poppins',sans-serif" }}>
                            {lbl}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Text Color</label>
                    <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"6px" }}>
                      {COLOR_SWATCHES.map(c => (
                        <button key={c} onClick={() => updateElementProp("color", c)} style={{ width:"22px", height:"22px", borderRadius:"4px", background:c, border: activeElement.color===c ? "2px solid #ec4899" : "1px solid rgba(255,255,255,0.2)", cursor:"pointer" }} />
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                      <input type="color" value={activeElement.color||"#ffffff"} onChange={e => updateElementProp("color", e.target.value)} style={{ width:"28px", height:"24px", border:"none", background:"none", cursor:"pointer", padding:0 }} />
                      <input type="text" value={activeElement.color||"#ffffff"} onChange={e => updateElementProp("color", e.target.value)} style={{...inputStyle, flex:1, padding:"4px 6px", fontSize:"11px"}} placeholder="#hex" />
                    </div>
                  </div>
                </>
              )}

              {/* ICON / SHAPE properties */}
              {(activeElement.type === "icon" || activeElement.type === "shape") && (
                <>
                  <div>
                    <label style={labelStyle}>Color</label>
                    <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"6px" }}>
                      {COLOR_SWATCHES.map(c => (
                        <button key={c} onClick={() => updateElementProp("color", c)} style={{ width:"22px", height:"22px", borderRadius:"4px", background:c, border: activeElement.color===c ? "2px solid #ec4899" : "1px solid rgba(255,255,255,0.2)", cursor:"pointer" }} />
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                      <input type="color" value={activeElement.color||"#e1496d"} onChange={e => updateElementProp("color", e.target.value)} style={{ width:"28px", height:"24px", border:"none", background:"none", cursor:"pointer", padding:0 }} />
                      <input type="text" value={activeElement.color||"#e1496d"} onChange={e => updateElementProp("color", e.target.value)} style={{...inputStyle, flex:1, padding:"4px 6px", fontSize:"11px"}} placeholder="#hex" />
                    </div>
                  </div>

                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                      <label style={{...labelStyle, marginBottom:0}}>Size</label>
                      <span style={{ fontSize:"10px", color:"#ec4899" }}>{activeElement.size}px</span>
                    </div>
                    <input type="range" min="20" max="200" value={activeElement.size} onChange={e => updateElementProp("size", parseInt(e.target.value))} style={sliderStyle} />
                  </div>

                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                      <label style={{...labelStyle, marginBottom:0}}>Opacity</label>
                      <span style={{ fontSize:"10px", color:"#ec4899" }}>{Math.round((activeElement.opacity??1)*100)}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={Math.round((activeElement.opacity??1)*100)} onChange={e => updateElementProp("opacity", parseFloat(e.target.value)/100)} style={sliderStyle} />
                  </div>

                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                      <label style={{...labelStyle, marginBottom:0}}>Rotation</label>
                      <span style={{ fontSize:"10px", color:"#ec4899" }}>{activeElement.rotate??0}°</span>
                    </div>
                    <input type="range" min="-180" max="180" value={activeElement.rotate??0} onChange={e => updateElementProp("rotate", parseInt(e.target.value))} style={sliderStyle} />
                  </div>

                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                      <label style={{...labelStyle, marginBottom:0}}>Stroke Width</label>
                      <span style={{ fontSize:"10px", color:"#ec4899" }}>{activeElement.strokeWidth??0}</span>
                    </div>
                    <input type="range" min="0" max="10" value={activeElement.strokeWidth??0} onChange={e => { updateElementProp("strokeWidth", parseInt(e.target.value)); if(parseInt(e.target.value)>0 && activeElement.strokeType==="none") updateElementProp("strokeType","solid"); }} style={sliderStyle} />
                  </div>
                </>
              )}

              {/* ALL elements: X/Y position */}
              <div style={{ borderTop:"1px solid rgba(225,73,109,0.08)", paddingTop:"12px" }}>
                <label style={labelStyle}>Position</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
                  <div>
                    <label style={{...labelStyle, marginBottom:"2px"}}>X</label>
                    <input type="number" value={activeElement.x} onChange={e => updateElementProp("x", parseInt(e.target.value)||0)} style={{...inputStyle, padding:"5px 8px"}} />
                  </div>
                  <div>
                    <label style={{...labelStyle, marginBottom:"2px"}}>Y</label>
                    <input type="number" value={activeElement.y} onChange={e => updateElementProp("y", parseInt(e.target.value)||0)} style={{...inputStyle, padding:"5px 8px"}} />
                  </div>
                </div>
              </div>

              {/* Delete + Duplicate */}
              <div style={{ display:"flex", gap:"6px", borderTop:"1px solid rgba(225,73,109,0.08)", paddingTop:"12px" }}>
                <button onClick={() => duplicateElement(activeElement.id)} style={{ flex:1, padding:"7px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"6px", color:"#ccc", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif" }}>⧉ Duplicate</button>
                <button onClick={() => deleteElement(activeElement.id)} style={{ flex:1, padding:"7px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"6px", color:"#ef4444", cursor:"pointer", fontSize:"11px", fontFamily:"'Poppins',sans-serif" }}>✕ Delete</button>
              </div>

            </div>
          </div>
        )}
        {/* ===================== END RIGHT PANEL ===================== */}

      </div>

      {/* Exit confirmation modal */}
      {showLeaveModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(12px)" }}>
          <div style={{ width:"420px", padding:"30px", borderRadius:"24px", textAlign:"center", border:"1px solid rgba(225,73,109,0.25)", background:"#131110" }}>
            <div style={{ fontSize:"40px", marginBottom:"16px" }}>✦</div>
            <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:"22px", fontWeight:800, color:"#fff", marginBottom:"10px", letterSpacing:"-0.03em" }}>Save brand identity?</h3>
            <p style={{ fontSize:"13.5px", color:"#8c8780", lineHeight:1.6, marginBottom:"24px", fontWeight:300 }}>
              Would you like to save this brand logo design to your past works, or discard your current edits?
            </p>
            <div style={{ marginBottom:"24px", textAlign:"left" }}>
              <label style={{ fontSize:"11px", color:"#ec4899", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", display:"block", marginBottom:"8px" }}>Brand Identity Name</label>
              <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} style={{ width:"100%", background:"#1a0f14", border:"1px solid rgba(225,73,109,0.18)", borderRadius:"8px", color:"#fff", padding:"10px 14px", fontSize:"13px", outline:"none", fontFamily:"'Poppins',sans-serif", boxSizing:"border-box" }} placeholder="My Brand Name" />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              <button onClick={handleSaveAndExit} style={{ width:"100%", padding:"12px", background:"linear-gradient(135deg,#942945,#ec4899)", border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:500, fontFamily:"'Poppins',sans-serif" }}>
                Save &amp; Exit to Dashboard
              </button>
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={handleDiscardAndExit} style={{ flex:1, padding:"10px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"8px", color:"#ef4444", cursor:"pointer", fontSize:"12.5px", fontFamily:"'Poppins',sans-serif" }}>Discard Edits</button>
                <button onClick={() => setShowLeaveModal(false)} style={{ flex:1, padding:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"8px", color:"#ccc", cursor:"pointer", fontSize:"12.5px", fontFamily:"'Poppins',sans-serif" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
