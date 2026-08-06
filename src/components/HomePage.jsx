import { useState, useEffect, useRef } from "react";
import THEME from "../theme";
import { 
  Home, FolderOpen, Wrench, LayoutGrid, 
  Settings, MoreHorizontal, Sparkles,
  Video, Image as ImageIcon, PenTool, Presentation, FileText, Infinity as InfinityIcon, Edit3, Layers,
  Code, Share2, Globe, Cpu, Users, Zap
} from "lucide-react";

// Import generated preview images
import videoPrev      from "../assets/images/video_preview.png";
import pptPrev        from "../assets/images/ppt_preview.png";
import socialPrev     from "../assets/images/social_preview.png";
import imagePrev      from "../assets/images/image_preview.png";
import aiPrev         from "../assets/images/ai_preview.png";
import logoPrev       from "../assets/images/logo_preview.png";
import docPrev        from "../assets/images/doc_preview.png";
import whiteboardPrev from "../assets/images/whiteboard_preview.png";

const TOOL_ACCENTS = {
  "Video Editor": "#ef4444",
  "Presentations": "#3b82f6",
  "Logo Maker": "#10b981",
  "Whiteboard": "#a855f7",
  "Image Editor": "#f59e0b",
  "Documents": "#06b6d4",
  "Social Studio": "#ec4899",
  "Print Design": "#f97316",
  "AI Magic": "#8b5cf6",
  "Infinite Studio": "#e1496d",
};

// ──¬ ADVANCED MIND MAP GRAPH COMPONENT ──────────────────────────────────────¬
function MindMapGraph({ pastWorks, isDark, THEME, colors, onNavigate, user, onSwitchTab }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const hoveredNodeRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const isDraggingRef = useRef(false);
  const dragNodeRef = useRef(null);
  const tooltipRef = useRef(null);
  const selectedNodeRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 900, h: 600 });
  const [stats, setStats] = useState({ nodes: 0, edges: 0, active: 0 });

  // Derive activity nodes ONLY from real project fields — zero hardcoded data
  const getActivitiesForProject = (proj) => {
    const acts = [];
    // From tags (real data on the project)
    if (proj.tags?.length > 0) {
      proj.tags.slice(0, 2).forEach((tag, i) => {
        const tagColors = ["#3b82f6","#10b981","#f59e0b","#ec4899","#8b5cf6","#06b6d4"];
        acts.push({
          label: tag,
          color: tagColors[i % tagColors.length],
        });
      });
    }
    // From tool name
    if (proj.tool && acts.length < 3) {
      const toolColors = {
        "Video Editor":"#ef4444","Presentations":"#3b82f6","Logo Maker":"#10b981",
        "Whiteboard":"#a855f7","Image Editor":"#f59e0b","Documents":"#06b6d4",
        "Social Studio":"#ec4899","AI Magic":"#8b5cf6","Slide Studio":"#3b82f6",
      };
      acts.push({
        label: proj.tool,
        color: toolColors[proj.tool] || proj.accent || "#94a3b8",
      });
    }
    // From category
    if (proj.category && acts.length < 3) {
      acts.push({ label: proj.category, color: proj.accent || THEME.wine });
    }
    // From year
    if (proj.year && acts.length < 3) {
      acts.push({ label: proj.year, color: "#94a3b8" });
    }
    return acts.slice(0, 3);
  };

  // Build graph from real pastWorks
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const W = container.offsetWidth;
    const H = container.offsetHeight || 600;
    setDimensions({ w: W, h: H });

    const cx = W / 2, cy = H / 2;
    const projects = pastWorks.slice(0, 7);
    if (projects.length === 0) return;

    const TOOL_COLORS = {
      "Video Editor": "#ef4444", "Presentations": "#3b82f6",
      "Logo Maker": "#10b981", "Whiteboard": "#a855f7",
      "Image Editor": "#f59e0b", "Documents": "#06b6d4",
      "Social Studio": "#ec4899", "AI Magic": "#8b5cf6",
    };

    // Hub node
    const hubNode = {
      id: "hub", label: "Studio", sublabel: user?.name?.split(" ")[0] || "Your",
      x: cx, y: cy, r: 52,
      color: THEME.wine, type: "hub",
      pulse: 0, floatOffset: 0, isActive: true,
      glowIntensity: 1,
    };

    // Project nodes — golden spiral placement
    const mainNodes = projects.map((proj, i) => {
      const angle = (i / projects.length) * 2 * Math.PI - Math.PI / 2;
      const orbitR = Math.min(W, H - 100) * 0.3 + (i % 2) * 20;
      return {
        id: proj.id || `proj_${i}`,
        label: proj.title || "Untitled",
        sublabel: proj.tool || proj.category || "Design",
        x: cx + orbitR * Math.cos(angle),
        y: Math.min(cy + orbitR * Math.sin(angle), H - 110),
        r: 40, color: TOOL_COLORS[proj.tool] || proj.accent || THEME.wine,
        type: "main", angle,
        isActive: Math.random() > 0.4,
        pulse: Math.random() * Math.PI * 2,
        floatOffset: Math.random() * Math.PI * 2,
        proj,
        activities: getActivitiesForProject(proj),
        glowIntensity: Math.random() * 0.5 + 0.5,
        tags: proj.tags || [],
      };
    });

    // Branch nodes — real data only, no fake timestamps
    const branchNodes = [];
    mainNodes.forEach(mn => {
      mn.activities.forEach((act, b) => {
        if (!act?.label) return;
        const spreadAngle = mn.angle + (b - mn.activities.length / 2 + 0.5) * 0.55;
        const br = 88 + b * 8;
        const bx = Math.max(80, Math.min(W - 80, mn.x + br * Math.cos(spreadAngle)));
        const by = Math.max(50, Math.min(H - 90, mn.y + br * Math.sin(spreadAngle)));
        branchNodes.push({
          id: `${mn.id}_b${b}`,
          label: act.label,
          sublabel: null,   // no fake timestamps ever
          x: bx, y: by, r: 18,
          color: act.color,
          type: "branch", parentId: mn.id,
          pulse: Math.random() * Math.PI * 2,
          floatOffset: Math.random() * Math.PI * 2,
          glowIntensity: 0.6,
        });
      });
    });

    // Edges
    const edges = [];
    // Hub ”™ main (with multiple animated pulses)
    mainNodes.forEach(mn => {
      edges.push({
        from: "hub", to: mn.id, type: "main",
        pulses: [
          { t: Math.random(), speed: 0.3 + Math.random() * 0.2 },
          { t: Math.random(), speed: 0.3 + Math.random() * 0.2 },
        ],
        active: mn.isActive, color: mn.color,
      });
    });
    // Main ”™ branch
    branchNodes.forEach(bn => {
      const parent = mainNodes.find(m => m.id === bn.parentId);
      edges.push({
        from: bn.parentId, to: bn.id, type: "branch",
        pulses: [{ t: Math.random(), speed: 0.15 + Math.random() * 0.1 }],
        active: false, color: bn.color,
      });
    });

    // Background ambient particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      color: [THEME.wine, "#3b82f6", "#8b5cf6", "#10b981"][Math.floor(Math.random() * 4)],
    }));

    nodesRef.current = [hubNode, ...mainNodes, ...branchNodes];
    edgesRef.current = edges;
    particlesRef.current = particles;
    setStats({ nodes: 1 + mainNodes.length, edges: edges.length, active: mainNodes.filter(m => m.isActive).length });
  }, [pastWorks]);

  // Advanced canvas draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const hexRgba = (hex, a) => {
      if (!hex || hex.length < 7) return `rgba(148,41,69,${a})`;
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b2 = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b2},${a})`;
    };
    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
      ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
      ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
    };
    const bezierPt = (ax,ay,cpx,cpy,bx,by,t) => ({
      x:(1-t)*(1-t)*ax+2*(1-t)*t*cpx+t*t*bx,
      y:(1-t)*(1-t)*ay+2*(1-t)*t*cpy+t*t*by,
    });

    const draw = () => {
      const { w, h } = dimensions;
      // DPR-aware canvas sizing — this is the fix for blurriness
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.014;
      const t = timeRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const nodeMap = {};
      nodesRef.current.forEach(n => { nodeMap[n.id] = n; });

      // 1. Ambient particles
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=w; if (p.x>w) p.x=0;
        if (p.y<0) p.y=h; if (p.y>h) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = hexRgba(p.color, p.opacity*0.5); ctx.fill();
      });

      // 2. Float animation
      nodesRef.current.forEach(n => {
        if (n.type==="branch") { n.x+=Math.sin(t*0.7+n.floatOffset)*0.22; n.y+=Math.cos(t*0.55+n.floatOffset)*0.18; }
        else if (n.type==="main") { n.x+=Math.sin(t*0.35+n.floatOffset)*0.1; n.y+=Math.cos(t*0.3+n.floatOffset)*0.1; }
        else if (n.type==="hub") { n.x+=Math.sin(t*0.2)*0.04; n.y+=Math.cos(t*0.18)*0.04; }
      });

      // 3. Draw edges with gradient + animated orbs
      const edgeCurves = {};
      edgesRef.current.forEach(edge => {
        const a = nodeMap[edge.from], b = nodeMap[edge.to];
        if (!a||!b) return;
        const isMain = edge.type==="main";
        const cpx = (a.x+b.x)/2+(b.y-a.y)*0.15, cpy = (a.y+b.y)/2-(b.x-a.x)*0.15;
        edgeCurves[`${edge.from}-${edge.to}`] = {cpx,cpy};
        // Gradient stroke
        const lg = ctx.createLinearGradient(a.x,a.y,b.x,b.y);
        lg.addColorStop(0, hexRgba(a.color, isMain?0.3:0.15));
        lg.addColorStop(1, hexRgba(b.color, isMain?0.2:0.08));
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.quadraticCurveTo(cpx,cpy,b.x,b.y);
        ctx.strokeStyle=lg; ctx.lineWidth=isMain?1.8:1; ctx.setLineDash(isMain?[]:[4,7]); ctx.stroke(); ctx.setLineDash([]);
        // Pulse orbs
        edge.pulses.forEach(pulse => {
          pulse.t = (pulse.t + pulse.speed*0.012)%1;
          const pt = bezierPt(a.x,a.y,cpx,cpy,b.x,b.y,pulse.t);
          if (isMain) {
            const orb = ctx.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,9);
            orb.addColorStop(0,hexRgba(edge.color||a.color,0.95));
            orb.addColorStop(0.4,hexRgba(edge.color||a.color,0.5));
            orb.addColorStop(1,hexRgba(edge.color||a.color,0));
            ctx.beginPath(); ctx.arc(pt.x,pt.y,9,0,Math.PI*2); ctx.fillStyle=orb; ctx.fill();
            ctx.beginPath(); ctx.arc(pt.x,pt.y,2.5,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
          } else {
            ctx.beginPath(); ctx.arc(pt.x,pt.y,3,0,Math.PI*2);
            ctx.fillStyle=hexRgba(b.color,0.6); ctx.fill();
          }
        });
      });

      // 4. Draw nodes
      nodesRef.current.forEach(n => {
        const isHov = hoveredNodeRef.current===n.id;
        const isSel = selectedNodeRef.current?.id===n.id;
        const r = n.r*(isHov?1.12:isSel?1.08:1);
        const prox = Math.max(0,1-Math.hypot(n.x-mx,n.y-my)/180);

        if (n.type==="hub") {
          // Atmosphere rings
          for (let ring=3;ring>=1;ring--) {
            const rr = r+20+ring*16+Math.sin(t*0.8+ring*1.2)*5;
            ctx.beginPath(); ctx.arc(n.x,n.y,rr,0,Math.PI*2);
            ctx.strokeStyle=hexRgba(n.color,0.06/ring); ctx.lineWidth=1.2; ctx.stroke();
          }
          // Glow
          const gw = ctx.createRadialGradient(n.x,n.y,r*0.3,n.x,n.y,r+30+Math.sin(t)*5);
          gw.addColorStop(0,hexRgba(n.color,0.4)); gw.addColorStop(1,hexRgba(n.color,0));
          ctx.beginPath(); ctx.arc(n.x,n.y,r+35,0,Math.PI*2); ctx.fillStyle=gw; ctx.fill();
          // Body
          const bd = ctx.createRadialGradient(n.x-r*0.25,n.y-r*0.25,0,n.x,n.y,r);
          bd.addColorStop(0,hexRgba(n.color,1)); bd.addColorStop(0.6,hexRgba(n.color,0.9)); bd.addColorStop(1,"rgba(10,0,5,0.92)");
          ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2);
          ctx.fillStyle=bd; ctx.shadowColor=n.color; ctx.shadowBlur=24+Math.sin(t*1.5)*6; ctx.fill(); ctx.shadowBlur=0;
          ctx.strokeStyle="rgba(255,255,255,0.22)"; ctx.lineWidth=1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(n.x-r*0.15,n.y-r*0.3,r*0.55,Math.PI*1.2,Math.PI*1.9);
          ctx.strokeStyle="rgba(255,255,255,0.15)"; ctx.lineWidth=3; ctx.stroke();
          ctx.fillStyle="#fff"; ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.font=`bold 13px 'Poppins',sans-serif`; ctx.shadowColor="rgba(0,0,0,0.5)"; ctx.shadowBlur=4;
          ctx.fillText(n.sublabel,n.x,n.y-8);
          ctx.font=`500 9px 'Poppins',sans-serif`; ctx.fillStyle="rgba(255,255,255,0.65)";
          ctx.fillText("Studio",n.x,n.y+8); ctx.shadowBlur=0;

        } else if (n.type==="main") {
          // Halo
          const halo = ctx.createRadialGradient(n.x,n.y,r*0.5,n.x,n.y,r+22+prox*10);
          halo.addColorStop(0,hexRgba(n.color,0.22+prox*0.08)); halo.addColorStop(1,hexRgba(n.color,0));
          ctx.beginPath(); ctx.arc(n.x,n.y,r+25,0,Math.PI*2); ctx.fillStyle=halo; ctx.fill();
          // Body
          ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2);
          ctx.fillStyle=isDark?"#1a0b12":"#ffffff";
          ctx.shadowColor=n.color; ctx.shadowBlur=isHov?28:10+prox*12; ctx.fill(); ctx.shadowBlur=0;
          // Ring
          ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2);
          ctx.strokeStyle=isHov||isSel?n.color:hexRgba(n.color,0.6);
          ctx.lineWidth=isHov?2.5:2; ctx.stroke();
          // Top arc accent
          ctx.beginPath(); ctx.arc(n.x,n.y,r-1,Math.PI*1.15,Math.PI*1.85);
          ctx.strokeStyle=n.color; ctx.lineWidth=3; ctx.stroke();
          // Active badge
          if (n.isActive) {
            const bp = 0.6+Math.sin(t*2.5+n.pulse)*0.4;
            ctx.beginPath(); ctx.arc(n.x+r*0.68,n.y-r*0.68,7*bp,0,Math.PI*2);
            ctx.fillStyle=hexRgba("#22c55e",0.2); ctx.fill();
            ctx.beginPath(); ctx.arc(n.x+r*0.68,n.y-r*0.68,4.5,0,Math.PI*2);
            ctx.fillStyle="#22c55e"; ctx.shadowColor="#22c55e"; ctx.shadowBlur=10; ctx.fill(); ctx.shadowBlur=0;
          }
          // Labels
          const mw=r*1.55;
          ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillStyle=n.color; ctx.font=`700 9.5px 'Poppins',sans-serif`;
          ctx.shadowColor=isDark?"rgba(0,0,0,0.8)":"rgba(255,255,255,0.8)"; ctx.shadowBlur=3;
          let lbl=n.label; while(ctx.measureText(lbl).width>mw&&lbl.length>3)lbl=lbl.slice(0,-1); if(lbl!==n.label)lbl+="...";
          ctx.fillText(lbl,n.x,n.y-7);
          ctx.font=`400 8px 'Poppins',sans-serif`; ctx.fillStyle=isDark?"rgba(255,255,255,0.42)":"rgba(0,0,0,0.38)";
          let sub=n.sublabel; while(ctx.measureText(sub).width>mw&&sub.length>3)sub=sub.slice(0,-1); if(sub!==n.sublabel)sub+="...";
          ctx.fillText(sub,n.x,n.y+7); ctx.shadowBlur=0;

        } else if (n.type==="branch") {
          const pw=86,ph=n.sublabel?26:20,pr=10;
          // Shadow
          ctx.fillStyle=hexRgba("#000",0.1); ctx.filter="blur(3px)";
          roundRect(n.x-pw/2,n.y-ph/2+3,pw,ph,pr); ctx.fill(); ctx.filter="none";
          // Body
          const pbg=ctx.createLinearGradient(n.x-pw/2,n.y,n.x+pw/2,n.y);
          pbg.addColorStop(0,isDark?"#1a0b12":"#ffffff"); pbg.addColorStop(1,isDark?"#200d16":"#fdf8ff");
          roundRect(n.x-pw/2,n.y-ph/2,pw,ph,pr); ctx.fillStyle=pbg; ctx.fill();
          ctx.strokeStyle=hexRgba(n.color,isHov?0.85:0.4); ctx.lineWidth=isHov?1.5:1; ctx.stroke();
          // Color dot
          ctx.beginPath(); ctx.arc(n.x-pw/2+10,n.y,3.5,0,Math.PI*2);
          ctx.fillStyle=n.color; ctx.shadowColor=n.color; ctx.shadowBlur=7; ctx.fill(); ctx.shadowBlur=0;
          // Label only — no timestamps
          ctx.textBaseline="middle"; ctx.textAlign="left";
          ctx.fillStyle=isDark?"rgba(255,255,255,0.85)":"rgba(0,0,0,0.78)";
          ctx.font=`600 8px 'Poppins',sans-serif`;
          let bl=n.label;
          while(ctx.measureText(bl).width>pw-24&&bl.length>3)bl=bl.slice(0,-1);
          if(bl!==n.label)bl+="...";
          ctx.fillText(bl,n.x-pw/2+20,n.y);
        }
      });

      // 5. Mouse aura
      if (mx>0&&my>0) {
        const mg=ctx.createRadialGradient(mx,my,0,mx,my,55);
        mg.addColorStop(0,hexRgba(THEME.wine,0.05)); mg.addColorStop(1,hexRgba(THEME.wine,0));
        ctx.beginPath(); ctx.arc(mx,my,55,0,Math.PI*2); ctx.fillStyle=mg; ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [dimensions, isDark]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ w: width, h: height });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };
    let found = null;
    for (const n of nodesRef.current) {
      const hitR = n.type==="branch" ? 44 : n.r + 8;
      if (Math.hypot(n.x-mx, n.y-my) < hitR) { found = n; break; }
    }
    hoveredNodeRef.current = found?.id || null;

    // Update tooltip via direct DOM — no React re-render
    const tip = tooltipRef.current;
    if (!tip) return;
    if (found && found.type !== "hub") {
      const tipX = Math.min(found.x, dimensions.w - 200);
      const tipY = Math.max(8, found.y - found.r - 60);
      tip.style.left = tipX + "px";
      tip.style.top = tipY + "px";
      tip.style.borderColor = found.color + "50";
      tip.style.boxShadow = `0 12px 40px ${found.color}30, 0 4px 12px rgba(0,0,0,0.15)`;
      tip.style.opacity = "1";
      tip.style.pointerEvents = "none";
      tip.style.transform = "translate(-50%, -100%) scale(1)";
      tip.querySelector(".tip-dot").style.background = found.color;
      tip.querySelector(".tip-dot").style.boxShadow = `0 0 8px ${found.color}`;
      tip.querySelector(".tip-title").textContent = found.label || "";
      tip.querySelector(".tip-title").style.color = found.color;
      tip.querySelector(".tip-sub").textContent = found.sublabel || found.type === "main" ? (found.sublabel || "") : "";
      const hint = tip.querySelector(".tip-hint");
      if (hint) hint.textContent = found.type === "main" ? "Click to select" : "";
    } else {
      tip.style.opacity = "0";
      tip.style.transform = "translate(-50%, -100%) scale(0.95)";
    }
    // Update cursor
    if (canvasRef.current) canvasRef.current.style.cursor = found ? "pointer" : "default";
  };

  const handleClick = () => {
    const n = nodesRef.current.find(x => x.id === hoveredNodeRef.current);
    if (!n) return;
    if (n.type === "main") {
      // Toggle selection via ref only — no state update
      selectedNodeRef.current = selectedNodeRef.current?.id === n.id ? null : n;
      // Update selected pill in stats bar via DOM
      const pill = document.getElementById("mg-selected-pill");
      if (pill) {
        if (selectedNodeRef.current) {
          pill.style.display = "flex";
          pill.style.background = `linear-gradient(135deg, ${selectedNodeRef.current.color}, ${selectedNodeRef.current.color}cc)`;
          pill.style.boxShadow = `0 4px 12px ${selectedNodeRef.current.color}40`;
          const pillLabel = pill.querySelector(".pill-label");
          if (pillLabel) pillLabel.textContent = selectedNodeRef.current.label;
        } else {
          pill.style.display = "none";
        }
      }
    }
  };

  return (
    <div ref={containerRef} style={{
      position: "relative", width: "100%", height: "600px",
      borderRadius: "0",
      background: "transparent",
      border: "none",
      overflow: "hidden",
      boxShadow: "none",
      paddingBottom: "52px",  /* reserve space for stats bar */
      boxSizing: "border-box",
    }}>
      {/* No background overlays — graph floats freely */}

      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, cursor: "default" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          hoveredNodeRef.current = null;
          mouseRef.current = { x: -999, y: -999 };
          const tip = tooltipRef.current;
          if (tip) { tip.style.opacity = "0"; tip.style.transform = "translate(-50%,-100%) scale(0.95)"; }
          if (canvasRef.current) canvasRef.current.style.cursor = "default";
        }}
        onClick={handleClick}
      />

      {/* Tooltip — updated via DOM ref, never causes React re-render */}
      <div ref={tooltipRef} style={{
        position: "absolute", opacity: 0, pointerEvents: "none",
        transform: "translate(-50%, -100%) scale(0.95)",
        transition: "opacity 0.15s ease, transform 0.15s ease",
        background: isDark ? "linear-gradient(135deg,#1e0f16,#2a1020)" : "linear-gradient(135deg,#ffffff,#fdf4f8)",
        border: "1px solid transparent",
        borderRadius: "14px", padding: "12px 16px",
        boxShadow: "none", zIndex: 20, minWidth: 140, maxWidth: 200,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <div className="tip-dot" style={{ width:10, height:10, borderRadius:"50%", flexShrink:0, background:"#942945" }} />
          <span className="tip-title" style={{ fontSize:12, fontWeight:700, fontFamily:"'Poppins',sans-serif", lineHeight:1.2 }} />
        </div>
        <div className="tip-sub" style={{ fontSize:10, color: isDark?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.45)", fontFamily:"'Instrument Sans',sans-serif", marginBottom:4 }} />
        <div className="tip-hint" style={{ fontSize:9, color: isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.28)", fontFamily:"'Poppins',sans-serif" }} />
      </div>

      {/* Top-left: Title badge */}
      <div style={{
        position:"absolute", top:20, left:20,
        display:"flex", alignItems:"center", gap:10,
      }}>
        <div style={{
          background: isDark?"rgba(15,8,12,0.8)":"rgba(255,255,255,0.85)",
          border:`1px solid ${isDark?"rgba(148,41,69,0.2)":"rgba(148,41,69,0.12)"}`,
          borderRadius:12, padding:"8px 14px",
          backdropFilter:"blur(12px)",
          display:"flex", alignItems:"center", gap:8,
        }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:THEME.wine, boxShadow:`0 0 10px ${THEME.wine}`, animation:"pulse 1.8s ease-in-out infinite" }} />
          <span style={{ fontSize:11, fontWeight:700, color: isDark?"rgba(255,255,255,0.8)":THEME.wine, fontFamily:"'Poppins',sans-serif", letterSpacing:"0.04em" }}>
            Activity Graph
          </span>
        </div>
      </div>

      {/* Top-right: Live + Stats */}
      <div style={{ position:"absolute", top:20, right:20, display:"flex", gap:8 }}>
        <div style={{
          background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)",
          borderRadius:99, padding:"5px 12px",
          display:"flex", alignItems:"center", gap:6,
          backdropFilter:"blur(8px)",
        }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse 1.4s ease-in-out infinite" }} />
          <span style={{ fontSize:10, fontWeight:700, color:"#22c55e", fontFamily:"'Poppins',sans-serif" }}>Live</span>
        </div>
      </div>

      {/* Bottom: Stats bar */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        background: "transparent",
        borderTop: `1px solid ${isDark?"rgba(148,41,69,0.1)":"rgba(148,41,69,0.07)"}`,
        padding:"10px 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", gap:28 }}>
          {[
            { label:"Projects", value: stats.nodes - 1, color: THEME.wine },
            { label:"Active now", value: stats.active, color:"#22c55e" },
            { label:"Connections", value: stats.edges, color:"#3b82f6" },
          ].map(s => (
            <div key={s.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:s.color, boxShadow:`0 0 6px ${s.color}80` }} />
              <span style={{ fontSize:11, fontWeight:700, color:s.color, fontFamily:"'Poppins',sans-serif" }}>{s.value}</span>
              <span style={{ fontSize:10, color:isDark?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)", fontFamily:"'Instrument Sans',sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          {/* Selected project quick action — hidden by default, shown via DOM */}
          <button
            id="mg-selected-pill"
            onClick={() => onSwitchTab && onSwitchTab("projects")}
            style={{
              display: "none", alignItems: "center", gap: 6,
              border: "none", borderRadius: 99,
              padding: "6px 14px", cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <span className="pill-label" style={{ fontSize:10, fontWeight:700, color:"#fff", fontFamily:"'Poppins',sans-serif" }} />
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.75)", fontFamily:"'Poppins',sans-serif" }}>”™ View projects</span>
          </button>
          {[
            { color:"#22c55e", label:"Active" },
            { color: THEME.wine, label:"Project" },
            { color:"#94a3b8", label:"Activity" },
          ].map(l => (
            <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:l.color, boxShadow:`0 0 5px ${l.color}60` }} />
              <span style={{ fontSize:10, color:isDark?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.45)", fontFamily:"'Poppins',sans-serif" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {pastWorks.length === 0 && (
        <div style={{
          position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:12, pointerEvents:"none",
        }}>
          <div style={{ fontSize:40, opacity:0.3 }}>¸─¢¸</div>
          <div style={{ fontSize:14, fontWeight:600, color:isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.25)", fontFamily:"'Poppins',sans-serif" }}>
            Create your first project to see the graph
          </div>
        </div>
      )}
    </div>
  );
}

// ── SidebarIcon — defined at module scope so React never remounts it on re-render ──
function SidebarIcon({ active, icon: IconComponent, label, onClick, THEME, crownBadge, bottom = false, animationType = "scale" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick();
  };

  const getAnimationStyles = () => {
    if (isClicked) {
      return {
        transform: animationType === "rotate" ? "scale(0.9) rotate(180deg)" : "scale(0.9)",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      };
    }
    if (isHovered && !active) {
      switch(animationType) {
        case "rotate": return { transform: "scale(1.1) rotate(15deg)" };
        case "bounce": return { transform: "scale(1.1) translateY(-2px)" };
        case "pulse":  return { transform: "scale(1.15)" };
        default:       return { transform: "scale(1.1)" };
      }
    }
    return {};
  };

  const wine = THEME?.wine || "#942945";
  const textMuted = THEME?.textMuted || "#8c8780";

  return (
    <div style={{
      position: "relative", width: "100%",
      display: "flex", flexDirection: "column", alignItems: "center",
      marginBottom: bottom ? 4 : 0
    }}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={label}
        style={{
          width: 40, height: 40, borderRadius: 11,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: active
            ? `linear-gradient(135deg, rgba(148,41,69,0.15), rgba(148,41,69,0.08))`
            : isHovered
              ? `linear-gradient(135deg, rgba(148,41,69,0.08), rgba(148,41,69,0.03))`
              : "transparent",
          border: active ? `2px solid rgba(148,41,69,0.4)` : `2px solid transparent`,
          color: active ? wine : isHovered ? wine : textMuted,
          cursor: "pointer",
          transition: "all 0.2s ease",
          outline: "none",
          position: "relative",
          boxShadow: active
            ? `0 4px 12px rgba(148,41,69,0.2)`
            : isHovered ? `0 2px 8px rgba(148,41,69,0.1)` : "none",
        }}
      >
        <div style={{
          ...getAnimationStyles(),
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}>
          <IconComponent
            size={20}
            strokeWidth={active ? 2.5 : 2}
            style={{ filter: active ? `drop-shadow(0 0 4px rgba(148,41,69,0.3))` : "none" }}
          />
        </div>
        {crownBadge && (
          <div style={{
            position: "absolute", top: -3, right: -3,
            background: "linear-gradient(135deg, #f6d365, #fda085)",
            width: 13, height: 13, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}>✨</div>
        )}
      </button>
      <span style={{
        fontSize: 8.5, marginTop: 2,
        color: active ? wine : isHovered ? wine : textMuted,
        fontFamily: "'Poppins',sans-serif",
        fontWeight: active ? 600 : 400,
        letterSpacing: "-0.01em",
        transition: "color 0.2s ease",
        opacity: isHovered || active ? 1 : 0.8
      }}>{label}</span>
    </div>
  );
}


// ─── Studio Picker Modal ──────────────────────────────────────────────────
const STUDIO_TOOLS = [
  {
    id: "editor",       name: "Video Editor",
    desc: "Multi-track timeline, color grading, audio mixing",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    color: "#e1496d", tag: "WebGL · WASM",
  },
  {
    id: "presentation",  name: "Presentations",
    desc: "Animated slides, 500+ templates, PPTX export",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/></svg>,
    color: "#942945", tag: "PPTX · PDF · HTML5",
  },
  {
    id: "whiteboard",    name: "Whiteboard",
    desc: "Infinite canvas, sticky notes, live multiplayer",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    color: "#b13453", tag: "Canvas · Real-time",
  },
  {
    id: "logo_maker",    name: "Logo Maker",
    desc: "Vector studio, AI suggestions, SVG export",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    color: "#e1496d", tag: "SVG · AI-assisted",
  },
  {
    id: "social_studio", name: "Social Studio",
    desc: "Instagram, X, LinkedIn — all formats in one place",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    color: "#942945", tag: "All social formats",
  },
  {
    id: "image_editor",  name: "Image Editor",
    desc: "Layers, masks, filters, blend modes",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    color: "#b13453", tag: "Canvas API",
  },
  {
    id: "documents",     name: "Documents",
    desc: "Rich docs with media, tables, charts",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    color: "#e1496d", tag: "DOCX · PDF",
  },
  {
    id: "infinite_studio", name: "Infinite Studio",
    desc: "Executable canvas, live APIs, multiplayer",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>,
    color: "#942945", tag: "React · Live APIs",
  },
];

function StudioPicker({ onClose, onSelect, isDark }) {
  const [hovered, setHovered] = useState(null);
  const bg     = isDark ? "rgba(18,8,14,0.98)"  : "rgba(255,255,255,0.98)";
  const border = isDark ? "rgba(225,73,109,0.16)": "rgba(148,41,69,0.12)";
  const tx     = isDark ? "#fdf2f4"              : "#0f0208";
  const mu     = isDark ? "rgba(255,255,255,0.38)": "rgba(15,2,8,0.44)";

  // Close on backdrop click
  const handleBackdrop = e => { if (e.target === e.currentTarget) onClose(); };

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div onClick={handleBackdrop} style={{
      position:"fixed", inset:0, zIndex:9000,
      background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
    }}>
      <div style={{
        background:bg, border:`1px solid ${border}`, borderRadius:24,
        width:"100%", maxWidth:760, maxHeight:"85vh", overflow:"hidden",
        display:"flex", flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.4)",
      }}>
        {/* Header */}
        <div style={{ padding:"24px 28px 20px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:22, color:tx, margin:0, letterSpacing:"-0.03em" }}>
              Choose a tool
            </h2>
            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:mu, margin:"4px 0 0" }}>
              Pick where you want to start creating
            </p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${border}`, borderRadius:8, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:mu, fontSize:18, flexShrink:0 }}>
            ×
          </button>
        </div>

        {/* Tool grid */}
        <div style={{ overflow:"auto", padding:"20px 24px 24px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:12 }}>
            {STUDIO_TOOLS.map(tool => (
              <button key={tool.id}
                onClick={() => { onSelect(tool.id); onClose(); }}
                onMouseEnter={() => setHovered(tool.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered===tool.id ? (isDark?`${tool.color}18`:`${tool.color}0d`) : "transparent",
                  border: `1.5px solid ${hovered===tool.id ? tool.color+"55" : border}`,
                  borderRadius:14, padding:"16px 18px", cursor:"pointer",
                  display:"flex", alignItems:"flex-start", gap:14, textAlign:"left",
                  transition:"all 0.18s", outline:"none",
                }}>
                {/* Icon */}
                <div style={{
                  width:44, height:44, borderRadius:12, flexShrink:0,
                  background: hovered===tool.id ? `${tool.color}22` : (isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)"),
                  border:`1px solid ${hovered===tool.id ? tool.color+"44" : border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: hovered===tool.id ? tool.color : mu,
                  transition:"all 0.18s",
                }}>
                  {tool.icon}
                </div>
                {/* Text */}
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:14, color: hovered===tool.id ? tool.color : tx, marginBottom:3, transition:"color 0.18s" }}>
                    {tool.name}
                  </div>
                  <div style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:12, color:mu, lineHeight:1.5, marginBottom:5 }}>
                    {tool.desc}
                  </div>
                  <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:600, color: hovered===tool.id ? tool.color : mu, opacity: hovered===tool.id ? 1 : 0.6, letterSpacing:"0.04em", transition:"all 0.18s" }}>
                    {tool.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Form Component ──────────────────────────────────────────────────
function ContactForm({ isDark, user }) {
  const [form, setForm] = useState({ name: user?.name || "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [errMsg, setErrMsg] = useState("");

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.message) {
      setErrMsg("Please fill in your name and message."); return;
    }
    setStatus("sending"); setErrMsg("");
    try {
      const apiBase = (window.API_URL || "http://localhost:3001") + "/api";
      const token = localStorage.getItem("creatify_token");
      const res = await fetch(`${apiBase}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setStatus("sent");
      setForm({ name: user?.name || "", subject: "", message: "" });
    } catch(err) {
      setErrMsg("Connection error. Please try again."); setStatus("error");
    }
  };

  const inp = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 13,
    color: "#fff",
    fontFamily: "'Poppins',sans-serif",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  };

  if (status === "sent") return (
    <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:16, padding:"36px 28px", textAlign:"center" }}>
      <div style={{ fontSize:36, marginBottom:12 }}>✓</div>
      <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:18, color:"#fff", margin:"0 0 8px" }}>Message sent!</h3>
      <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", fontFamily:"'Poppins',sans-serif", margin:"0 0 20px", lineHeight:1.6 }}>
        We'll reply to <strong style={{ color:"rgba(255,255,255,0.7)" }}>{user?.email}</strong> within 24 hours.
      </p>
      <button onClick={() => setStatus(null)} style={{ background:"none", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.6)", borderRadius:99, padding:"8px 20px", fontSize:12, fontFamily:"'Poppins',sans-serif", cursor:"pointer" }}>
        Send another
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>

      {/* User email badge — read only */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.18)", borderRadius:10 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)", fontFamily:"'Poppins',sans-serif" }}>
          Reply will be sent to <strong style={{ color:"rgba(255,255,255,0.8)" }}>{user?.email}</strong>
        </span>
      </div>

      {/* Name + Subject row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          <label style={{ fontSize:10.5, color:"rgba(255,255,255,0.35)", fontFamily:"'Poppins',sans-serif", fontWeight:500, letterSpacing:"0.04em", display:"block", marginBottom:5 }}>NAME *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={inp}
            onFocus={e => e.target.style.borderColor="rgba(225,73,109,0.5)"}
            onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
        </div>
        <div>
          <label style={{ fontSize:10.5, color:"rgba(255,255,255,0.35)", fontFamily:"'Poppins',sans-serif", fontWeight:500, letterSpacing:"0.04em", display:"block", marginBottom:5 }}>SUBJECT</label>
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" style={inp}
            onFocus={e => e.target.style.borderColor="rgba(225,73,109,0.5)"}
            onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={{ fontSize:10.5, color:"rgba(255,255,255,0.35)", fontFamily:"'Poppins',sans-serif", fontWeight:500, letterSpacing:"0.04em", display:"block", marginBottom:5 }}>MESSAGE *</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us more..." rows={4}
          style={{ ...inp, resize:"vertical", lineHeight:1.6 }}
          onFocus={e => e.target.style.borderColor="rgba(225,73,109,0.5)"}
          onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
      </div>

      {errMsg && <p style={{ fontSize:12, color:"#f87171", fontFamily:"'Poppins',sans-serif", margin:0 }}>{errMsg}</p>}

      <button type="submit" disabled={status === "sending"}
        style={{
          background: status === "sending" ? "rgba(148,41,69,0.5)" : "linear-gradient(135deg,#942945,#e1496d)",
          color:"#fff", border:"none", borderRadius:10, padding:"13px 0",
          fontSize:14, fontWeight:600, fontFamily:"'Poppins',sans-serif",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          transition:"opacity 0.2s, transform 0.2s", letterSpacing:"-0.01em",
        }}
        onMouseEnter={e => { if(status !== "sending") e.currentTarget.style.transform="translateY(-1px)"; }}
        onMouseLeave={e => e.currentTarget.style.transform="none"}>
        {status === "sending" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}


export default function HomePage({ onNavigate, user, onSignOut, theme = "light" }) {
  const [hoveredCard, setHoveredCard]         = useState(null);
  const [revealedSections, setRevealedSections] = useState(new Set());
  const [animatedStats, setAnimatedStats]     = useState(new Set());
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showStudioPicker, setShowStudioPicker] = useState(false);
  const [activeNav, setActiveNav]             = useState("home");
  const [navScrolled, setNavScrolled]         = useState(false);
  const [heroSettled, setHeroSettled]         = useState(false);

  // Dynamic Past Works state
  const [pastWorks, setPastWorks] = useState(() => {
    const saved = localStorage.getItem("creatify_past_works");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse past works", e);
      }
    }
    
    // Fallback seed projects
    const defaultWorks = [
      {
        id: "cinema-intro",
        title: "Cinematic Intro Reel",
        category: "Video Edit",
        tool: "Video Editor",
        year: "2026",
        accent: "#b13453",
        gradient: "linear-gradient(135deg, #1a0f14 0%, #3a0c19 45%, #581c87 100%)",
        image: videoPrev,
        tags: ["4K UHD", "LUTs", "15s"],
        desc: "Cinematic intro sequence with wine-toned color LUTs and silk-smooth title transitions.",
        data: {
          tracks: [
            { id: "track_v1", type: "video", name: "Video Track 1", clips: [
              { id: "clip_v1", name: "Cinematic Forest", start: 0, duration: 10, type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" }
            ]},
            { id: "track_t1", type: "text", name: "Title Overlay", clips: [
              { id: "clip_t1", name: "Main Title", start: 2, duration: 6, type: "text", text: "THE CINEMATIC EXPERIENCE" }
            ]}
          ],
          duration: 15
        }
      },
      {
        id: "pitch-deck",
        title: "Startup Pitch Deck",
        category: "Presentation",
        tool: "Slide Studio",
        year: "2026",
        accent: "#7e22ce",
        gradient: "linear-gradient(135deg, #180825 0%, #3a0e5b 45%, #1a0f14 100%)",
        image: pptPrev,
        tags: ["10 Slides", "Vector", "Pitch"],
        desc: "Modern corporate pitch deck with plum accents and razor-sharp vector grid alignment.",
        data: {
          themeIdx: 0,
          slides: [
            { id: "s1", layout: "title", title: "Next Gen Platform", subtitle: "Building the future of creation", bulletPoints: ["Empowering millions of creators", "Zero friction deployment", "Fully decentralized platform"], elements: [] },
            { id: "s2", layout: "split", title: "Market Growth", subtitle: "Traction and projections", bulletPoints: ["300% YoY growth", "High user retention", "Profitable from day one"], elements: [] }
          ]
        }
      }
    ];

    localStorage.setItem("creatify_past_works", JSON.stringify(defaultWorks));
    return defaultWorks;
  });

  // Reload past works when component mounts or user session changes
  useEffect(() => {
    const token = localStorage.getItem("creatify_token");
    if (token) {
      fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch from DB");
      })
      .then(dbProjects => {
        if (dbProjects) {
          // If we have projects in DB, prioritize them
          if (dbProjects.length > 0) {
            setPastWorks(dbProjects);
            localStorage.setItem("creatify_past_works", JSON.stringify(dbProjects));
          } else {
            // DB is empty, check if we have localStorage work we can sync to DB!
            const localSaved = localStorage.getItem("creatify_past_works");
            if (localSaved) {
              try {
                const parsed = JSON.parse(localSaved);
                if (parsed.length > 0) {
                  setPastWorks(parsed);
                  // Sync local projects to the server DB
                  parsed.forEach(proj => {
                    fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                      body: JSON.stringify(proj)
                    }).catch(e => console.error("Auto-sync project failed:", e));
                  });
                }
              } catch (e) {}
            }
          }
        }
      })
      .catch(err => {
        console.warn("DB load failed, falling back to local:", err.message);
        const saved = localStorage.getItem("creatify_past_works");
        if (saved) {
          try {
            setPastWorks(JSON.parse(saved));
          } catch (e) {}
        }
      });
    } else {
      const saved = localStorage.getItem("creatify_past_works");
      if (saved) {
        try {
          setPastWorks(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to reload past works", e);
        }
      }
    }
  }, [user]);

  const handleDeletePastWork = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const token = localStorage.getItem("creatify_token");
    if (token) {
      try {
        await fetch(`${window.API_URL || "http://localhost:3001"}/api/projects/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log("Deleted project from DB successfully");
      } catch (err) {
        console.error("Failed to delete project from DB:", err.message);
      }
    }

    const saved = JSON.parse(localStorage.getItem("creatify_past_works") || "[]");
    const updated = saved.filter(w => w.id !== id);
    localStorage.setItem("creatify_past_works", JSON.stringify(updated));
    setPastWorks(updated);

    if (user && user.email) {
      const videoKey = `creatify_video_projects_${user.email}`;
      const savedVideos = JSON.parse(localStorage.getItem(videoKey) || "[]");
      localStorage.setItem(videoKey, JSON.stringify(savedVideos.filter(p => p.id !== id)));

      const pptKey = `creatify_presentations_${user.email}`;
      const savedPpts = JSON.parse(localStorage.getItem(pptKey) || "[]");
      localStorage.setItem(pptKey, JSON.stringify(savedPpts.filter(p => p.id !== id)));
    }
  };
  const canvasRef  = useRef(null);
  const profileDropdownRef = useRef(null);

  // Track scroll position for nav shrink effect
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll helper
  const scrollTo = (id, label) => {
    setActiveNav(label);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDark = theme === "dark";

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showProfileDropdown]);

  // Interactive state for card micro-animations
  const [timelinePlayhead, setTimelinePlayhead] = useState(15);
  const [aiPromptText, setAiPromptText]         = useState("");
  const [promptIdx, setPromptIdx]               = useState(0);
  const [logoAngle, setLogoAngle]               = useState(0);
  const [activeSlide, setActiveSlide]           = useState(0);
  const [imageSliderPos, setImageSliderPos]     = useState(50);

  // Interactive Gallery State
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [hoveredWork, setHoveredWork]         = useState(null);
  const [pastWorkHoveredId, setPastWorkHoveredId] = useState(null);
  const pastWorkScrollRef = useRef(null);

  const handlePastWorkClick = (work) => {
    if (!user) return onNavigate("auth", "signup");
    if (work.category === "Video Edit" || work.tool === "Video Editor") {
      onNavigate("editor_load", work);
    } else if (work.category === "Presentation" || work.tool === "Presentations") {
      onNavigate("presentation_load", work);
    } else if (work.category === "Image Edit" || work.tool === "Image Editor") {
      onNavigate("image_editor_load", work);
    } else if (work.category === "Logo Design" || work.tool === "Logo Maker") {
      onNavigate("logo_maker_load", work);
    } else if (work.category === "Social Post" || work.tool === "Social Studio") {
      onNavigate("social_studio_load", work);
    } else if (work.category === "Document" || work.tool === "Documents") {
      onNavigate("documents_load", work);
    } else if (work.category === "Print Layout" || work.tool === "Print Design") {
      onNavigate("print_design_load", work);
    } else if (work.tool === "Whiteboard") {
      onNavigate("whiteboard_load", work);
    } else if (work.tool === "Infinite Studio") {
      onNavigate("infinite_studio");
    } else {
      onNavigate("editor_load", work);
    }
  };


  const prompts = [
    "cinematic retro synthwave skyline, 3d render...",
    "elegant minimalist swan logo, vector...",
    "modern dark-mode presentation layout slide...",
    "premium neon-glow color-grading LUT template...",
  ];

  useEffect(() => {
    if (hoveredCard !== "video") return;
    const t = setInterval(() => setTimelinePlayhead(p => p >= 95 ? 5 : p + 1.2), 25);
    return () => clearInterval(t);
  }, [hoveredCard]);

  useEffect(() => {
    if (hoveredCard !== "ai") { setAiPromptText(""); return; }
    const full = prompts[promptIdx]; let i = 0; setAiPromptText("");
    const t = setInterval(() => {
      if (i < full.length) { setAiPromptText(full.substring(0, i + 1)); i++; }
      else { clearInterval(t); setTimeout(() => setPromptIdx(p => (p + 1) % prompts.length), 1500); }
    }, 40);
    return () => clearInterval(t);
  }, [hoveredCard, promptIdx]);

  useEffect(() => {
    if (hoveredCard !== "logo") { setLogoAngle(0); return; }
    const t = setInterval(() => setLogoAngle(p => (p + 1) % 360), 16);
    return () => clearInterval(t);
  }, [hoveredCard]);

  useEffect(() => {
    if (hoveredCard !== "ppt") return;
    const t = setInterval(() => setActiveSlide(p => (p + 1) % 3), 1500);
    return () => clearInterval(t);
  }, [hoveredCard]);

  useEffect(() => {
    if (hoveredCard !== "image") { setImageSliderPos(50); return; }
    let dir = 1;
    const t = setInterval(() => setImageSliderPos(p => { if (p >= 85) dir = -1; if (p <= 15) dir = 1; return p + dir * 1.5; }), 30);
    return () => clearInterval(t);
  }, [hoveredCard]);


  // Scroll-reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setRevealedSections(s => new Set([...s, e.target.id])); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Three.js background (Plexus Particle Network)
  useEffect(() => {
    if (!canvasRef.current) return;
    let cleanup;
    (async () => {
      try {
        const THREE = (await import("three")).default;
        const canvas   = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);

        // 120 particles
        const particleCount = 120;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
          const x = (Math.random() - 0.5) * 35;
          const y = (Math.random() - 0.5) * 20;
          const z = (Math.random() - 0.5) * 15;
          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;
          
          velocities.push({
            x: (Math.random() - 0.5) * 0.015,
            y: (Math.random() - 0.5) * 0.015,
            z: (Math.random() - 0.5) * 0.01
          });
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create canvas-based particle texture for soft glowing circles
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 16;
        pCanvas.height = 16;
        const ctx = pCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(212, 165, 116, 1)');
        grad.addColorStop(1, 'rgba(212, 165, 116, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        const pTexture = new THREE.CanvasTexture(pCanvas);

        const particleMaterial = new THREE.PointsMaterial({
          size: 0.28,
          map: pTexture,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Dynamic Line Segments
        const maxLines = 400;
        const linePositions = new Float32Array(maxLines * 6);
        const lineColors = new Float32Array(maxLines * 6);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0.35
        });
        
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        let mx = 0, my = 0, targetMx = 0, targetMy = 0;
        const mm = e => {
          targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
          targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", mm);

        let animationFrameId;
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          
          mx += (targetMx - mx) * 0.08;
          my += (targetMy - my) * 0.08;

          const posAttr = particleGeometry.attributes.position;
          let lineIndex = 0;

          // Mouse coordinate projected coordinates
          const mouse3D = new THREE.Vector3(mx * 16, -my * 10, 0);

          for (let i = 0; i < particleCount; i++) {
            let px = posAttr.getX(i);
            let py = posAttr.getY(i);
            let pz = posAttr.getZ(i);

            px += velocities[i].x;
            py += velocities[i].y;
            pz += velocities[i].z;

            const boxX = 22, boxY = 13, boxZ = 10;
            if (px > boxX || px < -boxX) velocities[i].x *= -1;
            if (py > boxY || py < -boxY) velocities[i].y *= -1;
            if (pz > boxZ || pz < -boxZ) velocities[i].z *= -1;

            const dx = px - mouse3D.x;
            const dy = py - mouse3D.y;
            const dz = pz - mouse3D.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 5) {
              const force = (5 - dist) * 0.02;
              px += (dx / dist) * force;
              py += (dy / dist) * force;
              pz += (dz / dist) * force;
            }

            posAttr.setXYZ(i, px, py, pz);
          }
          posAttr.needsUpdate = true;

          const lp = lineGeometry.attributes.position.array;
          const lc = lineGeometry.attributes.color.array;
          
          for (let i = 0; i < particleCount; i++) {
            const ix = posAttr.getX(i);
            const iy = posAttr.getY(i);
            const iz = posAttr.getZ(i);

            for (let j = i + 1; j < particleCount; j++) {
              if (lineIndex >= maxLines) break;

              const jx = posAttr.getX(j);
              const jy = posAttr.getY(j);
              const jz = posAttr.getZ(j);

              const dx = ix - jx;
              const dy = iy - jy;
              const dz = iz - jz;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

              if (dist < 6) {
                const alpha = (6 - dist) / 6;
                
                lp[lineIndex * 6] = ix;
                lp[lineIndex * 6 + 1] = iy;
                lp[lineIndex * 6 + 2] = iz;
                lp[lineIndex * 6 + 3] = jx;
                lp[lineIndex * 6 + 4] = jy;
                lp[lineIndex * 6 + 5] = jz;

                lc[lineIndex * 6] = 212/255 * alpha;
                lc[lineIndex * 6 + 1] = 165/255 * alpha;
                lc[lineIndex * 6 + 2] = 116/255 * alpha;

                lc[lineIndex * 6 + 3] = 139/255 * alpha;
                lc[lineIndex * 6 + 4] = 90/255 * alpha;
                lc[lineIndex * 6 + 5] = 43/255 * alpha;

                lineIndex++;
              }
            }
          }

          for (let i = lineIndex; i < maxLines; i++) {
            lp[i * 6] = 0; lp[i * 6 + 1] = 0; lp[i * 6 + 2] = 0;
            lp[i * 6 + 3] = 0; lp[i * 6 + 4] = 0; lp[i * 6 + 5] = 0;
          }
          lineGeometry.attributes.position.needsUpdate = true;
          lineGeometry.attributes.color.needsUpdate = true;

          camera.position.x += (mx * 4 - camera.position.x) * 0.05;
          camera.position.y += (-my * 3 - camera.position.y) * 0.05;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);
        
        cleanup = () => {
          window.removeEventListener("mousemove", mm);
          window.removeEventListener("resize", onResize);
          cancelAnimationFrame(animationFrameId);
          renderer.dispose();
        };
      } catch(e) { console.log("Three.js error:", e); }
    })();
    return () => cleanup && cleanup();
  }, []);

  // ── Tool definitions (ordered for Bento layout) ──────────────────────────
  // Grid: 3 columns  2 rows. All tools equally sized to fit in one studio without gaps
  const tools = [
    { id:"video",   name:"Video Editor",       desc:"Full multi-track timeline with WebGL color grading, audio mixing & in-browser rendering. No uploads needed.", icon:"🎬", color:"#942945",  tag:"WebGL · WASM",           colSpan:1, rowSpan:1, image: videoPrev      },
    { id:"image",   name:"Image Editor",       desc:"Layers, masks, filters, blend modes. Pro-grade photo editing in your browser.",                                icon:"🖼️", color:"#e1496d",  tag:"Canvas API",             colSpan:1, rowSpan:1, image: imagePrev      },
    { id:"logo",    name:"Logo Maker",         desc:"Vector-based logo studio. AI suggestions, custom icons, SVG export.",                                          icon:"✦",  color:"#ec4899",  tag:"SVG · AI-assisted",      colSpan:1, rowSpan:1, image: logoPrev       },
    { id:"ppt",     name:"Presentations",      desc:"Slides that animate. Real-time collaboration, 500+ templates, one-click export.",                              icon:"🎠", color:"#7c233c",  tag:"PPTX · PDF · HTML5",     colSpan:1, rowSpan:1, image: pptPrev        },
    { id:"white",   name:"Whiteboard",         desc:"Freehand canvas with sticky notes, arrows, shapes, laser pointer & live multiplayer cursors.",                  icon:"🖊️",  color:"#be185d",  tag:"Canvas · Real-time",     colSpan:1, rowSpan:1, image: whiteboardPrev },
    { id:"doc",     name:"Documents",          desc:"Rich docs with embedded media, tables, charts. Beautiful by default.",                                         icon:"📄", color:"#eba5b6",  tag:"DOCX · PDF",             colSpan:1, rowSpan:1, image: docPrev        },
  ];

  const pricing = [
    { name:"Free",  price:0,  period:"forever free",              popular:false, features:["5 active projects","Basic templates","2GB storage","Export PNG & PDF","Community support"] },
    { name:"Pro",   price:16, period:"per month, billed annually", popular:true,  features:["Unlimited projects","500K+ premium templates","100GB storage","All export formats","AI design tools","Brand kit","Priority support"] },
    { name:"Team",  price:42, period:"per month, up to 5 seats",  popular:false, features:["Everything in Pro","Real-time collaboration","Shared brand assets","Admin controls","1TB storage","Dedicated support"] },
  ];

  // ── Gradient fallbacks for cards without images ──────────────────────────
  const cardGradients = isDark ? {
    logo:  "linear-gradient(135deg, #1a0f14 0%, #3a0c19 40%, #ec489920 100%)",
    doc:   "linear-gradient(135deg, #170b11 0%, #23141b 50%, #eba5b620 100%)",
    white: "linear-gradient(135deg, #140a0f 0%, #2a0d1b 45%, #be185d25 100%)",
  } : {
    logo:  "linear-gradient(135deg, #fff0f3 0%, #fce7f3 50%, #ec489912 100%)",
    doc:   "linear-gradient(135deg, #fdf2f4 0%, #fce8ef 50%, #eba5b615 100%)",
    white: "linear-gradient(135deg, #f8f0f5 0%, #fce7f3 45%, #be185d12 100%)",
  };

  const colors = {
    bg: isDark ? "#1a0f14" : "#f7f4f7",
    text: isDark ? "#fdf2f4" : "#2d2d2d",
    textMuted: isDark ? "#9d8e94" : "#666",
    navBg: isDark ? "rgba(14, 6, 10, 0.95)" : "rgba(253, 248, 250, 0.95)",
    border: isDark ? "rgba(225,73,109,0.18)" : "rgba(148,41,69,0.10)",
    btnBg: isDark ? "rgba(225,73,109,0.10)" : "rgba(148,41,69,0.07)",
    btnBorder: isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.18)",
    marqueeBg: isDark ? "#160b12" : "#fdf2f4",
    logoGlow: isDark ? "rgba(212, 165, 116, 0.2)" : "rgba(139, 90, 43, 0.35)",
    cardBorder: isDark ? "rgba(225,73,109,0.16)" : "rgba(148,41,69,0.12)",
    cardShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(148,41,69,0.08)",
  };

  const [homeTab, setHomeTab] = useState("home");
  const [searchVal, setSearchVal] = useState("");

  const sidebarW = 64;
  const pageMax = 1400;

  const AvatarCircle = ({ size = 36, onClick, showBorder = false }) => (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: user?.avatar && user.avatar.length > 2 ? "transparent" : "linear-gradient(135deg, #942945, #e1496d)",
        color: "#fff", border: showBorder ? `1.5px solid ${isDark ? "rgba(225,73,109,0.5)" : "rgba(148,41,69,0.3)"}` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.38, fontFamily: "'Poppins',sans-serif",
        cursor: "pointer", overflow: "hidden", padding: 0, outline: "none",
        boxShadow: "0 2px 8px rgba(148,41,69,0.18)",
      }}
    >
      {user?.avatar && user.avatar.length > 2 ? (
        <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : user ? (
        (user.name ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : user.email?.[0]?.toUpperCase() || "U")
      ) : "U"}
    </button>
  );


  const HeroToolBtn = ({ icon, label, bg, onClick, isCrown }) => {
    const [h, setH] = useState(false);
    return (
      <button onClick={onClick}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
          background: "none", border: "none", cursor: "pointer", padding: 0,
          minWidth: 72, outline: "none",
        }}>
        <div style={{
          width: 58, height: 58, borderRadius: "50%", background: bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, color: "#fff", position: "relative",
          transform: h ? "translateY(-2px) scale(1.06)" : "none",
          transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: h ? "0 10px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          {icon}
          {isCrown && <div style={{ position: "absolute", top: -4, right: -4, fontSize: 14 }}>✨</div>}
        </div>
        <span style={{
          fontSize: 11.5, color: isDark ? "rgba(245,240,232,0.78)" : "rgba(45,45,45,0.82)",
          fontFamily: "'Poppins',sans-serif", fontWeight: 400, whiteSpace: "nowrap",
        }}>{label}</span>
      </button>
    );
  };

  const AnimatedCreateRow = ({ onNavigate, user, isDark, THEME }) => (
    <div style={{ width:"100%", boxSizing:"border-box" }}>
      <style>{`
        @keyframes hFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hGrad   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes hOrb1   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-20px)} }
        @keyframes hOrb2   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,25px)} }
        @keyframes hShine  { from{left:-100%} to{left:160%} }

        .h4-cta {
          display:inline-flex; align-items:center; gap:10px;
          padding:16px 36px; border-radius:50px; border:none; cursor:pointer;
          font-family:'Poppins',sans-serif; font-size:16px; font-weight:600;
          letter-spacing:-0.01em; position:relative; overflow:hidden;
          background: linear-gradient(135deg,#7c1d35,#b13453,#e1496d);
          background-size:200% 200%; animation:hGrad 5s ease-in-out infinite;
          color:#fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
          transition:transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s;
        }
        .h4-cta::after {
          content:''; position:absolute; top:0; left:-100%; width:40%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          animation:hShine 3s ease-in-out 1s infinite;
        }
        .h4-cta:hover { transform:translateY(-3px) scale(1.02); }

        .h4-ghost {
          display:inline-flex; align-items:center; gap:8px;
          padding:15px 28px; border-radius:50px; cursor:pointer;
          font-family:'Poppins',sans-serif; font-size:15px; font-weight:500;
          letter-spacing:-0.01em; background:none;
          border:1.5px solid ${isDark?"rgba(255,255,255,0.15)":"rgba(15,2,8,0.14)"};
          color:${isDark?"rgba(255,255,255,0.65)":"rgba(15,2,8,0.55)"};
          transition:border-color 0.2s, background 0.2s, color 0.2s;
        }
        .h4-ghost:hover {
          border-color:${isDark?"rgba(255,255,255,0.35)":"rgba(148,41,69,0.4)"};
          background:${isDark?"rgba(255,255,255,0.05)":"rgba(148,41,69,0.04)"};
          color:${isDark?"#fff":"#7c1d35"};
        }

        .h4-mock-browser {
          border-radius: 16px;
          background: ${isDark ? "#1e0f16" : "#fdfaf9"};
          box-shadow: 0 20px 80px rgba(148,41,69,0.15), 0 4px 20px rgba(0,0,0,0.06);
          overflow: hidden;
          border: 1px solid ${isDark ? "rgba(225,73,109,0.10)" : "rgba(148,41,69,0.08)"};
        }
      `}</style>

      {/* ─── TOP HERO BAND ─── */}
      <div style={{
        width:"100%", padding:"88px 72px 80px",
        boxSizing:"border-box", textAlign:"center",
        position:"relative", overflow:"hidden",
        background: isDark
          ? "linear-gradient(180deg,#0f0408 0%,#1a0f14 100%)"
          : "linear-gradient(180deg,#fdf2f4 0%,#f7edf1 100%)",
      }}>
        {/* Background orbs */}
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", top:"-200px", left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(225,73,109,0.18) 0%,transparent 65%)", filter:"blur(60px)", animation:"hOrb1 12s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", bottom:"-100px", left:"20%", background:"radial-gradient(circle,rgba(148,41,69,0.12) 0%,transparent 65%)", filter:"blur(48px)", animation:"hOrb2 16s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", bottom:"-60px", right:"15%", background:"radial-gradient(circle,rgba(168,85,247,0.09) 0%,transparent 65%)", filter:"blur(40px)", animation:"hOrb1 20s ease-in-out 3s infinite", pointerEvents:"none" }} />

        {/* Content */}
        <div style={{ position:"relative", zIndex:1, maxWidth:760, margin:"0 auto" }}>

          {/* Headline — 2 rows */}
          <h1 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, margin:"0 0 18px", fontSize:"clamp(36px,4.8vw,64px)", letterSpacing:"-0.04em", lineHeight:1.08, color:isDark?"#fdf2f4":"#0f0208", animation:"hFadeUp 0.7s ease 0.08s both" }}>
            Design anything.<br/>
            <span style={{ background:"linear-gradient(135deg,#e1496d,#b13453,#f472b6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", backgroundSize:"200% 200%", animation:"hGrad 5s ease-in-out infinite" }}>
              Create everywhere.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize:17, lineHeight:1.68, margin:"0 0 40px", color:isDark?"rgba(255,255,255,0.5)":"rgba(15,2,8,0.48)", fontFamily:"'Instrument Sans',sans-serif", maxWidth:500, marginLeft:"auto", marginRight:"auto", animation:"hFadeUp 0.7s ease 0.16s both" }}>
            {user
              ? `Hey ${(user.name||"").split(" ")[0]||"there"} — your studio is ready. Jump back in.`
              : "Video, presentations, whiteboards, social graphics and AI — all in one browser-native studio. Free forever."}
          </p>

          {/* CTAs */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, flexWrap:"wrap", animation:"hFadeUp 0.7s ease 0.24s both" }}>
            <button className="h4-cta" onClick={() => user ? setShowStudioPicker(true) : onNavigate("auth","signup")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
              {user ? "Open Studio" : "Start for free"}
            </button>
            {!user && (
              <button className="h4-ghost" onClick={() => onNavigate("auth","signin")}>
                Sign in
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ─── MOCK STUDIO PREVIEW ─── */}
      <div style={{
        width:"100%", boxSizing:"border-box",
        background: isDark ? "#1a0f14" : "#f7edf1",
        padding:"0 72px 56px",
        position:"relative",
      }}>

        <div className="h4-mock-browser" style={{
          width:"100%", maxWidth:1000, margin:"0 auto",
          boxShadow: isDark
            ? "0 8px 60px rgba(148,41,69,0.15), 0 2px 20px rgba(0,0,0,0.3)"
            : "0 8px 60px rgba(148,41,69,0.10), 0 2px 20px rgba(148,41,69,0.08)",
          position:"relative", zIndex:1,
        }}>
          {/* Browser chrome bar */}
          <div style={{ height:38, background:isDark?"#1f0d14":"#f5edf0", borderBottom:"1px solid "+(isDark?"rgba(255,255,255,0.06)":"rgba(148,41,69,0.08)"), display:"flex", alignItems:"center", padding:"0 16px", gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#ff5f57" }} />
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#febc2e" }} />
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#28c840" }} />
            <div style={{ flex:1, margin:"0 16px", height:20, borderRadius:6, background:isDark?"rgba(255,255,255,0.06)":"rgba(148,41,69,0.07)", display:"flex", alignItems:"center", paddingLeft:10 }}>
              <span style={{ fontSize:10, color:isDark?"rgba(255,255,255,0.3)":"rgba(148,41,69,0.4)", fontFamily:"'Poppins',sans-serif" }}>creatify.app/studio</span>
            </div>
          </div>

          {/* Studio UI mockup — pure CSS */}
          <div style={{ display:"flex", height:340 }}>

            {/* Left tool palette */}
            <div style={{ width:52, background:isDark?"#180b10":"#fdf2f4", borderRight:"1px solid "+(isDark?"rgba(255,255,255,0.05)":"rgba(148,41,69,0.08)"), display:"flex", flexDirection:"column", alignItems:"center", paddingTop:16, gap:14 }}>
              {[
                <svg key="a" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
                <svg key="b" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
                <svg key="c" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>,
                <svg key="d" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.8 5.5 21 7 14 2 9.3 9 8.5"/></svg>,
              ].map((icon,i) => (
                <div key={i} style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:i===0?"linear-gradient(135deg,#e1496d,#942945)":"transparent", color:i===0?"#fff":isDark?"rgba(255,255,255,0.3)":"rgba(148,41,69,0.4)" }}>
                  {icon}
                </div>
              ))}
            </div>

            {/* Canvas area */}
            <div style={{ flex:1, background:isDark?"#150910":"#faf5f7", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* Dot grid */}
              <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,"+(isDark?"rgba(225,73,109,0.12)":"rgba(148,41,69,0.08)")+" 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }} />

              {/* Mock design card */}
              <div style={{ position:"relative", zIndex:1, width:320, height:200, borderRadius:16, background:isDark?"linear-gradient(135deg,#2a0f1a,#1f0a14)":"linear-gradient(135deg,#fff,#fdf2f4)", border:"1px solid "+(isDark?"rgba(225,73,109,0.18)":"rgba(148,41,69,0.12)"), boxShadow:"0 20px 60px rgba(148,41,69,0.2)", padding:24, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                <div>
                  <div style={{ width:48, height:6, borderRadius:3, background:"linear-gradient(90deg,#e1496d,#f472b6)", marginBottom:10 }} />
                  <div style={{ width:"80%", height:5, borderRadius:3, background:isDark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.06)", marginBottom:7 }} />
                  <div style={{ width:"60%", height:5, borderRadius:3, background:isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)" }} />
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  {["#e1496d","#a855f7","#3b82f6"].map((c,i) => (
                    <div key={i} style={{ flex:1, height:40, borderRadius:8, background:c, opacity:0.85 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right properties panel */}
            <div style={{ width:160, background:isDark?"#180b10":"#fdf2f4", borderLeft:"1px solid "+(isDark?"rgba(255,255,255,0.05)":"rgba(148,41,69,0.08)"), padding:16, display:"flex", flexDirection:"column", gap:12 }}>
              {[["Font","Syne"],["Size","48px"],["Color","Crimson"],["Weight","Bold"]].map(([k,v],i) => (
                <div key={i}>
                  <div style={{ fontSize:9, color:isDark?"rgba(255,255,255,0.25)":"rgba(148,41,69,0.4)", fontFamily:"'Poppins',sans-serif", letterSpacing:"0.06em", marginBottom:3 }}>{k.toUpperCase()}</div>
                  <div style={{ fontSize:11, color:isDark?"rgba(255,255,255,0.6)":"rgba(15,2,8,0.6)", fontFamily:"'Poppins',sans-serif", fontWeight:500, background:isDark?"rgba(255,255,255,0.04)":"rgba(148,41,69,0.05)", borderRadius:6, padding:"4px 8px" }}>{v}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div style={{
      margin: 0, padding: 0, width: "100%",
      background: isDark ? "#0e060b" : "#f7f6fb",
      color: colors.text,
      fontFamily: "'Instrument Sans',sans-serif", overflowX: "hidden",
      transition: "background 0.3s, color 0.3s", minHeight: "100vh",
    }}>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Instrument+Sans:wght@300;400;500;600&family=Syne:wght@700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />

      {/* ─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢ CANVA-STYLE VERTICAL SIDEBAR ─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢ */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: sidebarW,
        background: isDark
          ? "rgba(14, 6, 11, 0.96)"
          : "rgba(253, 248, 250, 0.96)",
        borderRight: isDark
          ? "1px solid rgba(225,73,109,0.12)"
          : "1px solid rgba(148,41,69,0.10)",
        zIndex: 200,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "16px 0 12px",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
      }}>
        {/* Avatar at Top */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 12 }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <AvatarCircle size={40} onClick={() => onNavigate("profile")} showBorder />
              <div style={{
                position: "absolute", bottom: -1, right: -1, width: 12, height: 12,
                borderRadius: "50%", background: "#22c55e", border: "2px solid #fff",
              }} />
            </div>
          ) : (
            <button
              onClick={() => onNavigate("auth", "signin")}
              title="Sign in"
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: THEME.grad.primary,
                color: "#fff", fontWeight: 700, fontFamily: "'Poppins',sans-serif",
                cursor: "pointer", border: "none", fontSize: 13,
                boxShadow: THEME.shadow.chip, outline: "none",
              }}
            >U</button>
          )}
        </div>

        <div style={{ 
          width: "70%", 
          height: 1, 
          background: `linear-gradient(90deg, transparent 0%, ${THEME.hexA(THEME.wine, 0.15)} 50%, transparent 100%)`,
          margin: "8px 0 12px",
          transition: "all 0.3s ease"
        }} />

        {/* Nav stack */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", overflowY: "auto", overflowX: "hidden", padding: "4px 0" }}>
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "home"}
            label="Home"
            onClick={() => { setActiveNav("home"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
            icon={Home}
            animationType="bounce"
          />
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "projects"}
            label="Projects"
            onClick={() => { setActiveNav("projects"); }}
            icon={FolderOpen}
            animationType="scale"
          />
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "tools"}
            label="Tools"
            onClick={() => {
              setActiveNav("home");
              setTimeout(() => {
                const el = document.getElementById("tools-section");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 150);
            }}
            icon={Wrench}
            animationType="rotate"
          />

          <div style={{ width: "60%", height: 1, background: "rgba(225,73,109,0.15)", margin: "4px 0" }} />

          <SidebarIcon
            THEME={THEME}
            active={activeNav === "studio"}
            label="Studio"
            onClick={() => {
              setActiveNav("home");
              setTimeout(() => {
                const el = document.getElementById("infinite-studio-section");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 150);
            }}
            icon={InfinityIcon}
            animationType="pulse"
          />
        </div>

        {/* Bottom section with Settings & More */}
        <div style={{ 
          width: "70%", 
          height: 1, 
          background: `linear-gradient(90deg, transparent 0%, ${THEME.hexA(THEME.wine, 0.15)} 50%, transparent 100%)`,
          margin: "8px 0 12px",
          transition: "all 0.3s ease"
        }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", paddingBottom: 8 }}>
          <SidebarIcon
            THEME={THEME}
            active={activeNav === "more"}
            label="More"
            onClick={() => setActiveNav("more")}
            icon={MoreHorizontal}
            animationType="scale"
          />
        </div>
      </aside>

      {/* ─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢ MAIN CONTENT (full width with sidebar padding) ─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢─¢ */}
      <main style={{ width: "100%", position: "relative", overflow: "hidden", paddingLeft: `${sidebarW}px` }}>

        {/* Conditional rendering based on activeNav */}
        {activeNav === "projects" ? (
          /* ── INLINE PROJECTS VIEW — keeps sidebar visible ── */
          <div style={{ padding: "48px", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:40 }}>
              <div>
                <h1 style={{
                  fontFamily:"Syne,sans-serif", fontSize:"clamp(28px,4vw,44px)",
                  fontWeight:800, letterSpacing:"-0.04em", margin:"0 0 6px",
                  color: THEME.wine,
                }}>Your Projects</h1>
                <p style={{ margin:0, fontSize:14, color:colors.textMuted, fontFamily:"'Instrument Sans',sans-serif" }}>
                  {pastWorks.length} {pastWorks.length===1?"project":"projects"} created
                </p>
              </div>
              <button
                onClick={() => { setActiveNav("home"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
                style={{
                  display:"flex", alignItems:"center", gap:8,
                  background:"none", border:`1px solid ${THEME.hexA(THEME.wine,0.2)}`,
                  borderRadius:10, padding:"8px 16px", cursor:"pointer",
                  color: THEME.wine, fontSize:13, fontWeight:600,
                  fontFamily:"'Poppins',sans-serif", transition:"all 0.2s",
                }}
                onMouseEnter={e=>e.currentTarget.style.background=THEME.wineTint}
                onMouseLeave={e=>e.currentTarget.style.background="none"}
              >
                ─  Back to Home
              </button>
            </div>

            {/* Empty state */}
            {pastWorks.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🎨</div>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:700, color:colors.text, margin:"0 0 8px" }}>
                  No projects yet
                </h3>
                <p style={{ color:colors.textMuted, fontSize:14, fontFamily:"'Instrument Sans',sans-serif" }}>
                  Start creating to see your work here.
                </p>
              </div>
            ) : (
              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",
                gap:28,
              }}>
                {pastWorks.map((proj) => {
                  const accent = proj.accent || THEME.wine;
                  return (
                    <div key={proj.id}
                      style={{
                        borderRadius:20, overflow:"hidden",
                        background: isDark ? "#1a0f16" : "#fff",
                        border:`1px solid ${THEME.hexA(accent, 0.15)}`,
                        boxShadow:`0 4px 20px ${THEME.hexA(accent, 0.08)}`,
                        transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
                        cursor:"pointer",
                      }}
                      onMouseEnter={e=>{
                        e.currentTarget.style.transform="translateY(-4px)";
                        e.currentTarget.style.boxShadow=`0 4px 20px ${THEME.hexA(accent,0.08)}`;
                        e.currentTarget.style.borderColor=THEME.hexA(accent,0.4);
                      }}
                      onMouseLeave={e=>{
                        e.currentTarget.style.transform="translateY(0)";
                        e.currentTarget.style.boxShadow=`0 4px 20px ${THEME.hexA(accent,0.08)}`;
                        e.currentTarget.style.borderColor=THEME.hexA(accent,0.15);
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        height:170, position:"relative", overflow:"hidden",
                        background: proj.gradient || `linear-gradient(135deg, ${accent}22, ${accent}44)`,
                      }}>
                        {proj.image && typeof proj.image === "string" && proj.image.startsWith("data:") ? (
                          <img src={proj.image} alt={proj.title}
                            style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        ) : proj.image && !proj.image.startsWith("data:") ? (
                          <img src={proj.image} alt={proj.title}
                            style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        ) : (
                          <div style={{
                            width:"100%", height:"100%", display:"flex",
                            alignItems:"center", justifyContent:"center",
                            fontSize:40, opacity:0.4,
                          }}>
                            {proj.icon || "🎨"}
                          </div>
                        )}
                        {/* Tool badge */}
                        <div style={{
                          position:"absolute", top:10, left:10,
                          background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)",
                          borderRadius:99, padding:"3px 10px",
                        }}>
                          <span style={{ fontSize:10, color:"#fff", fontFamily:"'Poppins',sans-serif", fontWeight:600 }}>
                            {proj.tool || proj.category || "Design"}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding:"16px 18px 18px" }}>
                        <h3 style={{
                          margin:"0 0 4px", fontSize:15, fontWeight:700,
                          color: accent, fontFamily:"'Poppins',sans-serif",
                          letterSpacing:"-0.02em",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                        }}>{proj.title || "Untitled"}</h3>
                        <p style={{
                          margin:"0 0 10px", fontSize:12, color:colors.textMuted,
                          fontFamily:"'Instrument Sans',sans-serif",
                        }}>
                          {proj.category || proj.tool || "Design"} · {proj.year || new Date().getFullYear()}
                        </p>
                        {/* Tags — real data only */}
                        {proj.tags?.length > 0 && (
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                            {proj.tags.slice(0,3).map(tag => (
                              <span key={tag} style={{
                                fontSize:10, padding:"2px 8px", borderRadius:99,
                                background:`${accent}15`, color:accent,
                                fontFamily:"'Poppins',sans-serif", fontWeight:600,
                              }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
        {/*  HERO SECTION  */}
        <section style={{ position:"relative", padding:0, background:isDark?"linear-gradient(135deg,#1a0f14 0%,#0f0408 100%)":THEME.grad.hero, overflow:"hidden" }}>
          <AnimatedCreateRow onNavigate={onNavigate} user={user} isDark={isDark} THEME={THEME} />
        </section>

      {/* Live strip */}
      <div style={{
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        background: isDark ? "rgba(14,6,11,0.8)" : "rgba(253,248,250,0.9)",
        backdropFilter: "blur(8px)",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Left fade */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:`linear-gradient(90deg,${isDark?"#0e060b":"#f7f6fb"},transparent)`, zIndex:2, pointerEvents:"none" }} />
        {/* Right fade */}
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:`linear-gradient(270deg,${isDark?"#0e060b":"#f7f6fb"},transparent)`, zIndex:2, pointerEvents:"none" }} />

        <div style={{ display:"flex", padding:"0", overflow:"hidden" }}>
          <div style={{ display:"flex", whiteSpace:"nowrap", animation:"marquee 35s linear infinite", alignItems:"stretch" }}>
            {[...Array(2)].flatMap((_, gi) =>
              [
                { label:"Video Editor",    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>, color:"#e1496d" },
                { label:"Presentations",   icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/></svg>, color:"#942945" },
                { label:"Whiteboard",      icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, color:"#b13453" },
                { label:"Logo Maker",      icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, color:"#e1496d" },
                { label:"Social Studio",   icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>, color:"#942945" },
                { label:"Image Editor",    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>, color:"#b13453" },
                { label:"Documents",       icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, color:"#e1496d" },
                { label:"Infinite Studio", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>, color:"#942945" },
                { label:"AI Magic",        icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, color:"#b13453" },
                { label:"Print Design",    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>, color:"#e1496d" },
              ].map((t, i) => (
                <span key={`${gi}-${i}`} style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  padding:"16px 32px",
                  fontSize:12, fontFamily:"'Poppins',sans-serif", fontWeight:500,
                  letterSpacing:"0.03em",
                  color: isDark ? "rgba(255,255,255,0.45)" : "rgba(15,2,8,0.45)",
                  borderRight: `1px solid ${colors.border}`,
                  whiteSpace:"nowrap",
                  transition:"color 0.2s",
                  cursor:"default",
                }}>
                  <span style={{ color: t.color, opacity: 0.7 }}>{t.icon}</span>
                  {t.label}
                </span>
              ))
            )}
          </div>
        </div>
      </div>


      {/* ── INFINITE STUDIO DEDICATED MEGA SECTION ──────────────────────¬ */}
      <section className="reveal" id="infinite-studio-section" style={{
        padding: "100px 48px",
        background: `linear-gradient(180deg, ${colors.bg} 0%, rgba(148,41,69,0.06) 50%, ${colors.bg} 100%)`,
        borderTop: `1px solid rgba(225,73,109,0.15)`,
        borderBottom: `1px solid rgba(225,73,109,0.15)`,
        opacity: revealedSections.has("infinite-studio-section") ? 1 : 0,
        transform: revealedSections.has("infinite-studio-section") ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s, transform 0.7s",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Glow backdrop removed */}

        <div style={{ maxWidth: "1350px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlignment: "center", textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{
              fontFamily: "Syne, sans-serif", fontSize: "clamp(40px, 5.5vw, 68px)", fontWeight: 800,
              letterSpacing: "-0.04em", lineHeight: 1.05, color: colors.text, marginBottom: "20px"
            }}>
              Meet <span style={{
                background: `linear-gradient(135deg, ${THEME.wine} 0%, ${THEME.roseGold} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Infinite Studio</span><span style={{ color: THEME.wine }}>.</span>
            </h2>

            <p style={{
              fontSize: "18px", color: colors.textMuted, maxWidth: "680px", margin: "0 auto 36px",
              lineHeight: 1.6, fontFamily: "'Instrument Sans', sans-serif"
            }}>
              The world's first executable infinite graph canvas. Design code, connect live REST APIs, trigger AI layout engines, and collaborate with multiplayer ghost replays.
            </p>

            <button
              onClick={() => {
                if (!user) return onNavigate("auth", "signup");
                onNavigate("infinite_studio");
              }}
              style={{
                padding: "16px 42px", borderRadius: "16px",
                background: `linear-gradient(135deg, ${THEME.wine}, ${THEME.roseGold})`,
                border: "none", color: "#fff", fontSize: "16px", fontWeight: 700,
                fontFamily: "Syne, sans-serif", cursor: "pointer",
                boxShadow: "none",
                display: "inline-flex", alignItems: "center", gap: "12px",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <span style={{ fontSize: "20px" }}>∞</span> Open Infinite Studio
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>

          {/* 6 Killer Features Grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px"
          }}>
            {[
              {
                num: "01",
                title: "Code-to-Canvas Bounding",
                tag: "React & JSX Nodes",
                desc: "Elements on canvas aren't static images—they are executable React & Web components. Inspect, modify live JSX/CSS, and export clean production code.",
                Icon: Code,
                iconColor: "#ff8da7",
                gradient: "linear-gradient(135deg, rgba(225,73,109,0.15), rgba(148,41,69,0.05))"
              },
              {
                num: "02",
                title: "Spatial Infinite Node Graph",
                tag: "Interactive Wireframes",
                desc: "Infinite 2D spatial graph with pan & zoom. Draw logic bezier connections between component ports to craft interactive user journeys across artboards.",
                Icon: Share2,
                iconColor: "#ff8da7",
                gradient: "linear-gradient(135deg, rgba(148,41,69,0.15), rgba(225,73,109,0.05))"
              },
              {
                num: "03",
                title: "Live API Data Pinning",
                tag: "REST Endpoint Polling",
                desc: "Bind any card, text, or graph node directly to live REST APIs or webhooks. See live server metrics and user data auto-update inside the design canvas.",
                Icon: Globe,
                iconColor: "#22d3a8",
                gradient: "linear-gradient(135deg, rgba(34,211,168,0.15), rgba(16,185,129,0.05))"
              },
              {
                num: "04",
                title: "Dev-Mode Spatial Handoff",
                tag: "CSS Rulers & Tailwind",
                desc: "One click toggles Dev Mode—exposing pixel spacing between nodes, calculated CSS Flexbox/Grid properties, and instant Tailwind class copying.",
                Icon: Cpu,
                iconColor: "#f59e0b",
                gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.05))"
              },
              {
                num: "05",
                title: "Multiplayer & Ghost Replay",
                tag: "Spatial Audio & Replays",
                desc: "See live peer cursors in real time. Hit 'Record' and press 'Play' to watch an animated ghost cursor re-enact your teammate's exact design steps.",
                Icon: Users,
                iconColor: "#a855f7",
                gradient: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(126,34,206,0.05))"
              },
              {
                num: "06",
                title: "AI Prompt-to-DOM Engine",
                tag: "Structured Layout Generation",
                desc: "Type 'Create a dark pricing table with 3 tiers' and AI outputs structured, fully-editable canvas DOM nodes with auto-layout constraints and text boxes.",
                Icon: Sparkles,
                iconColor: "#ff8da7",
                gradient: "linear-gradient(135deg, rgba(225,73,109,0.2), rgba(255,141,167,0.1))"
              }
            ].map(f => {
              const IconComp = f.Icon;
              return (
                <div
                  key={f.num}
                  style={{
                    padding: "32px", borderRadius: "24px",
                    background: isDark ? "rgba(20,17,23,0.85)" : "#ffffff",
                    border: `1px solid rgba(225,73,109,0.18)`,
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    position: "relative", overflow: "hidden"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "rgba(225,73,109,0.45)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.borderColor = "rgba(225,73,109,0.18)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "14px",
                      background: f.gradient, border: "1px solid rgba(225,73,109,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <IconComp size={22} color={f.iconColor} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: THEME.roseGold, background: "rgba(225,73,109,0.1)", padding: "4px 10px", borderRadius: "12px" }}>
                      {f.tag}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: colors.text, marginBottom: "10px" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: colors.textMuted, lineHeight: 1.65, fontFamily: "'Instrument Sans', sans-serif" }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID TOOLS SECTION ── */}
      <div id="tools">
        <div className="reveal" id="tools-section" style={{
          padding:"100px 48px", maxWidth:"1400px", margin:"0 auto",
          opacity: revealedSections.has("tools-section") ? 1 : 0,
          transform: revealedSections.has("tools-section") ? "translateY(0)" : "translateY(40px)",
          transition:"opacity 0.7s, transform 0.7s"
        }}>
          {/* Section header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"56px", flexWrap:"wrap", gap:"16px" }}>
            <div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,5vw,60px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1, color:colors.text }}>One studio.<br/>All formats<span style={{ color: THEME.wine }}>.</span></h2>
            </div>
            <p style={{ fontSize:"16px", color:colors.textMuted, maxWidth:"440px", lineHeight:1.65, fontWeight:400, fontFamily:"'Instrument Sans',sans-serif" }}>
              From a cinematic edit to a full brand deck — Creatify handles every format your ideas demand.
            </p>
          </div>

          {/* Bento Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gridTemplateRows:"repeat(2, 200px)", gap:"14px" }}>
            {tools.map(tool => {
              const isHovered = hoveredCard === tool.id;
              return (
                <div
                  key={tool.id}
                  onMouseEnter={() => { setHoveredCard(tool.id); }}
                  onMouseLeave={() => { setHoveredCard(null); }}
                  onClick={() => {
                    if (!user) return onNavigate("auth", "signup");
                    if (tool.id === "video") onNavigate("editor");
                    else if (tool.id === "ppt") onNavigate("presentation");
                    else if (tool.id === "image") onNavigate("image_editor");
                    else if (tool.id === "logo") onNavigate("logo_maker");
                    else if (tool.id === "doc") onNavigate("documents");
                    else if (tool.id === "white") onNavigate("whiteboard");
                    else if (tool.id === "studio") onNavigate("infinite_studio");
                    else onNavigate("auth", "signup");
                  }}
                  style={{
                    gridColumn: `span ${tool.colSpan}`,
                    gridRow:    `span ${tool.rowSpan}`,
                    position:"relative", borderRadius:"20px", overflow:"hidden",
                    cursor:"pointer", transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    transform: isHovered ? "translateY(-3px) scale(1.01)" : "none",
                    boxShadow: "0 3px 14px rgba(148,41,69,0.07)",
                    border: `1px solid ${isHovered ? tool.color + "60" : "rgba(148,41,69,0.14)"}`,
                  }}
                >
                  {/* Background: image or gradient */}
                  {tool.image ? (
                    <div style={{ position:"absolute", inset:0 }}>
                      <img src={tool.image} alt={tool.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }} />
                      {/* Dark overlay that lightens on hover */}
                      <div style={{ position:"absolute", inset:0, background: isHovered ? "rgba(0,0,0,0.42)" : "rgba(0,0,0,0.62)", transition:"background 0.4s" }} />
                    </div>
                  ) : (
                    <div style={{ position:"absolute", inset:0, background: cardGradients[tool.id] || `linear-gradient(135deg, ${isDark ? "#111318" : "#fdf8fa"}, ${tool.color}${isDark?"20":"14"})` }}>
                      {/* Subtle pattern for no-image cards */}
                      <div style={{ position:"absolute", inset:0, opacity:0.06, backgroundImage:`radial-gradient(${tool.color} 1px, transparent 1px)`, backgroundSize:"24px 24px" }} />
                    </div>
                  )}

                  {/* Accent glow on hover */}
                  <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 30% 20%, ${tool.color}25, transparent 60%)`, opacity: isHovered ? 1 : 0, transition:"opacity 0.4s", pointerEvents:"none" }} />

                  {/* Content */}
                  <div style={{ position:"relative", zIndex:2, padding:"20px 22px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                    {/* Tag chip */}
                    <div style={{ alignSelf:"flex-start", background:"rgba(255,255,255,0.1)", backdropFilter:"blur(7px)", border:"1px solid rgba(255,255,255,0.16)", borderRadius:"18px", padding:"2px 10px", fontSize:"9px", color:"rgba(255,255,255,0.8)", letterSpacing:"0.04em", marginBottom:"auto", marginTop:"0" }}>
                      {tool.tag}
                    </div>

                    {/* Icon + name + desc */}
                    <div>
                      {/* Interactive micro-animation for logo card (no image) */}
                      {tool.id === "logo" && (
                        <div style={{ marginBottom:"10px" }}>
                          <svg width="36" height="36" viewBox="0 0 100 100" style={{ transform:`rotate(${logoAngle}deg)`, transition:"transform 0.05s linear", display:"block" }}>
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="15,10"/>
                            <polygon points="50,18 78,66 22,66" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinejoin="round"/>
                            <circle cx="50" cy="50" r="8" fill="#ec4899"/>
                          </svg>
                        </div>
                      )}

                      {/* Doc card decoration */}
                      {tool.id === "doc" && (
                        <div style={{ marginBottom:"10px", display:"flex", flexDirection:"column", gap:"3px" }}>
                          <div style={{ width:"46%", height:"4px", background:tool.color, borderRadius:"2px", opacity:0.9 }} />
                          <div style={{ width:"78%", height:"2.5px", background:"rgba(255,255,255,0.2)", borderRadius:"2px" }} />
                          <div style={{ width:"66%", height:"2.5px", background:"rgba(255,255,255,0.14)", borderRadius:"2px" }} />
                        </div>
                      )}

                      {/* Whiteboard card decoration — sticky notes + marker lines */}
                      {tool.id === "white" && (
                        <div style={{ marginBottom:"10px", position:"relative", height:"34px" }}>
                          {/* Soft whiteboard grid bg shape */}
                          <div style={{ position:"absolute", inset:0, borderRadius:"6px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }} />
                          {/* Sticky note pink */}
                          <div style={{ position:"absolute", left:"6px", top:"5px", width:"14px", height:"14px", borderRadius:"2px",
                                        background:"linear-gradient(135deg,#ec4899,#be185d)", transform:"rotate(-6deg)",
                                        boxShadow:"0 2px 6px rgba(190,24,93,0.45)" }} />
                          {/* Sticky note plum */}
                          <div style={{ position:"absolute", left:"24px", top:"8px", width:"12px", height:"12px", borderRadius:"2px",
                                        background:"linear-gradient(135deg,#c084fc,#7e22ce)", transform:"rotate(5deg)",
                                        boxShadow:"0 2px 6px rgba(126,34,206,0.4)" }} />
                          {/* Arrow marker right */}
                          <svg style={{ position:"absolute", right:"6px", top:"12px", width:"30px", height:"14px", color:"#fda4af" }}
                               viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="8" x2="30" y2="8" />
                            <polyline points="24 3 32 8 24 13" />
                          </svg>
                        </div>
                      )}

                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                        <span style={{ fontSize:"18px" }}>{tool.icon}</span>
                        <span style={{ fontFamily:"Syne,sans-serif", fontSize: tool.colSpan >= 2 ? "19px" : "15px", fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>{tool.name}</span>
                      </div>
                      <p style={{ fontSize:"11.5px", color:"rgba(255,255,255,0.72)", lineHeight:1.5, fontWeight:300, margin:0, maxWidth: tool.colSpan >= 2 ? "300px" : "none" }}>
                        {tool.desc}
                      </p>

                      {/* CTA arrow */}
                      <div style={{ marginTop:"10px", display:"flex", alignItems:"center", gap:"6px", fontSize:"11px", color:tool.color, fontFamily:"'Poppins',sans-serif", fontWeight:400, opacity: isHovered ? 1 : 0, transform: isHovered ? "translateX(0)" : "translateX(-6px)", transition:"all 0.3s" }}>
                        <span>Open {tool.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Video playhead overlay */}
                  {tool.id === "video" && isHovered && (
                    <div style={{ position:"absolute", bottom:"76px", left:"22px", right:"22px", zIndex:3 }}>
                      <div style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", borderRadius:"8px", padding:"8px", border:"1px solid rgba(148,41,69,0.3)" }}>
                        <div style={{ fontSize:"7.5px", color:"#22d3a8", fontWeight:700, marginBottom:"5px" }}>— LIVE PLAYBACK</div>
                        <div style={{ position:"relative", height:"5px", background:"rgba(255,255,255,0.1)", borderRadius:"2.5px" }}>
                          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${timelinePlayhead}%`, background:`linear-gradient(90deg, #942945, #e1496d)`, borderRadius:"2.5px", transition:"width 0.05s" }} />
                          <div style={{ position:"absolute", top:"-2.5px", width:"10px", height:"10px", borderRadius:"50%", background:"#ef4444", boxShadow:"0 0 6px #ef4444", transition:"left 0.05s", left:`calc(${timelinePlayhead}% - 5px)` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PPT slides overlay */}
                  {tool.id === "ppt" && isHovered && (
                    <div style={{ position:"absolute", top:"18px", right:"18px", zIndex:3, display:"flex", gap:"5px" }}>
                      {[0,1,2].map(idx => {
                        const off = (idx - activeSlide + 3) % 3;
                        return (
                          <div key={idx} style={{ width:"40px", height:"26px", borderRadius:"3px", background:"rgba(255,255,255,0.14)", backdropFilter:"blur(6px)", border:`1.5px solid rgba(255,255,255,${0.6 - off*0.2})`, opacity: 1 - off*0.3, transform:`translateY(${off*-3}px) scale(${1-off*0.06})`, transition:"all 0.4s" }}>
                            <div style={{ width:"38%", height:"2.5px", background:"#7c233c", borderRadius:"1px", margin:"4px 3px 2px" }} />
                            <div style={{ display:"flex", gap:"1.5px", alignItems:"flex-end", padding:"0 3px 3px", height:"10px" }}>
                              {[7,11,5,8].map((h,i) => <div key={i} style={{ flex:1, height:`${h}px`, background:"rgba(124,35,60,0.6)", borderRadius:"1px" }} />)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* ── PAST WORK —œ Horizontal Scrollable Showcase ── */}
      <section className="reveal" id="past-work-section" style={{
        padding: "96px 0 96px",
        background: isDark
          ? "linear-gradient(180deg, #1a0f14 0%, #23141b 50%, #1a0f14 100%)"
          : "linear-gradient(180deg, #f7f4f7 0%, #fdf2f4 45%, #faf5ff 100%)",
        opacity: revealedSections.has("past-work-section") ? 1 : 0,
        transform: revealedSections.has("past-work-section") ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s, transform 0.7s",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Section ambient gradient blobs removed */}

        {/* Section header */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 48px", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              
              <h2 style={{
                fontFamily: "Syne,sans-serif", fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 800,
                letterSpacing: "-0.04em", lineHeight: 1.05, color: colors.text,
              }}>
                Your recent work<span style={{ color: THEME.wine }}>.</span>
              </h2>
            </div>
            <p style={{
              fontSize: "15px", color: colors.textMuted, maxWidth: "420px", lineHeight: 1.6,
              fontWeight: 400, fontFamily: "'Instrument Sans',sans-serif",
            }}>
              Jump back into active projects or start a new creation from your personal workspace history.
            </p>
          </div>
        </div>

        {/* Scrollable track with cards */}
        {pastWorks.length === 0 ? (
          <div style={{
            maxWidth: "1400px", margin: "0 auto", padding: "0 48px",
          }}>
            <div style={{
              padding: "48px", borderRadius: "24px",
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(148,41,69,0.03)",
              border: `1.5px dashed ${colors.border}`,
              textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
            }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "rgba(148,41,69,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
                color: THEME.wine, fontSize: "24px",
              }}>
                ✦
              </div>
              <div>
                <h3 style={{ fontFamily: "Syne,sans-serif", fontSize: "20px", fontWeight: 700, color: colors.text, marginBottom: "6px" }}>
                  No past projects yet
                </h3>
                <p style={{ fontSize: "14px", color: colors.textMuted, maxWidth: "380px", margin: "0 auto" }}>
                  Pick any editor from above to create your first artwork, presentation, or video!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            position: "relative", width: "100%", overflow: "hidden", padding: "12px 0 24px",
          }}>
            {/* Left/Right scroll fade gradients */}
            <div aria-hidden style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", zIndex: 10,
              background: `linear-gradient(90deg, ${isDark ? "#1a0f14" : "#f7f4f7"} 0%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            <div aria-hidden style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", zIndex: 10,
              background: `linear-gradient(270deg, ${isDark ? "#1a0f14" : "#faf5ff"} 0%, transparent 100%)`,
              pointerEvents: "none",
            }} />

            <div style={{
              display: "flex", gap: "20px", overflowX: "auto", padding: "8px 48px 20px",
              scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}>
              {pastWorks.map((pw) => {
                const accentColor = TOOL_ACCENTS[pw.tool] || "#942945";
                const isHovered = pastWorkHoveredId === pw.id;
                return (
                  <div
                    key={pw.id}
                    onMouseEnter={() => setPastWorkHoveredId(pw.id)}
                    onMouseLeave={() => setPastWorkHoveredId(null)}
                    onClick={() => handlePastWorkClick(pw)}
                    style={{
                      flexShrink: 0,
                      width: "300px",
                      borderRadius: "20px",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      scrollSnapAlign: "start",
                      background: isDark
                        ? `linear-gradient(145deg, #1e0f16 0%, #160b12 100%)`
                        : `linear-gradient(145deg, #ffffff 0%, #fdf5f7 100%)`,
                      border: `1.5px solid ${isHovered ? accentColor + "55" : (isDark ? "rgba(225,73,109,0.10)" : "rgba(148,41,69,0.08)")}`,
                      boxShadow: isHovered
                        ? `0 8px 24px rgba(0,0,0,0.12)`
                        : `0 2px 16px rgba(0,0,0,0.06)`,
                      transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                      transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {/* ── Cover area ── */}
                    <div style={{
                      height: "160px",
                      position: "relative",
                      overflow: "hidden",
                      background: isDark
                        ? `linear-gradient(135deg, ${accentColor}20 0%, #0f0408 100%)`
                        : `linear-gradient(135deg, ${accentColor}14 0%, #faf3f6 100%)`,
                    }}>
                      {/* Animated mesh gradient orbs removed */}

                      {/* Tool tag */}
                      <div style={{
                        position: "absolute", top: 12, left: 12, zIndex: 3,
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 99,
                        background: isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.80)",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${accentColor}30`,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.85)" : "#2d2d2d", fontFamily: "'Poppins',sans-serif", letterSpacing: "0.03em" }}>
                          {pw.tool}
                        </span>
                      </div>

                      {/* Center avatar */}
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transform: isHovered ? "scale(1.1) translateY(-4px)" : "scale(1) translateY(0)",
                        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                      }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: 16,
                          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontWeight: 800, fontSize: 22,
                          fontFamily: "Syne,sans-serif",
                          boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
                          border: "2px solid rgba(255,255,255,0.2)",
                        }}>
                          {pw.tool?.charAt(0) || "C"}
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div style={{
                        position: "absolute", inset: 0, zIndex: 4,
                        background: `linear-gradient(180deg, transparent 30%, ${accentColor}dd 100%)`,
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        display: "flex", alignItems: "flex-end", padding: "12px 14px",
                      }}>
                        <span style={{
                          color: "#fff", fontSize: 12, fontWeight: 700,
                          fontFamily: "Syne,sans-serif",
                          display: "flex", alignItems: "center", gap: 6,
                        }}>
                          Resume Project
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </span>
                      </div>
                    </div>

                    {/* ── Footer ── */}
                    <div style={{ padding: "14px 16px 16px" }}>
                      <h4 style={{
                        fontFamily: "Syne,sans-serif", fontSize: 14, fontWeight: 700,
                        color: isDark ? "#fdf2f4" : "#0f0208", margin: "0 0 5px",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {pw.title}
                      </h4>

                      <p style={{
                        fontSize: 11, color: isDark ? "rgba(255,255,255,0.38)" : "rgba(15,2,8,0.4)",
                        margin: "0 0 12px", display: "flex", alignItems: "center", gap: 5,
                        fontFamily: "'Poppins',sans-serif", fontWeight: 400,
                      }}>
                        <span>{pw.category}</span>
                        <span style={{ opacity: 0.4 }}>·</span>
                        <span>{pw.date}</span>
                      </p>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{
                          fontSize: 10, padding: "3px 9px", borderRadius: 99,
                          background: isDark ? `${accentColor}15` : `${accentColor}0d`,
                          color: accentColor, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                          border: `1px solid ${accentColor}25`,
                        }}>
                          {pw.data?.layers ? `${pw.data.layers.length} layers` : "Saved"}
                        </span>
                        <span style={{
                          fontSize: 11, color: accentColor, fontWeight: 700,
                          fontFamily: "'Poppins',sans-serif",
                          display: "flex", alignItems: "center", gap: 4,
                          opacity: isHovered ? 1 : 0.6, transition: "opacity 0.2s",
                        }}>
                          Open
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── REAL-TIME CREATIVE ECOSYSTEM (MIND MAP GRAPH) ────────────────¬ */}
      <section className="reveal" id="mindmap-section" style={{
        padding: "80px 0 100px",
        background: isDark
          ? "linear-gradient(180deg, #160d12 0%, #0d060a 100%)"
          : "linear-gradient(180deg, #fdf2f4 0%, #f5ebf2 100%)",
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        opacity: revealedSections.has("mindmap-section") ? 1 : 0,
        transform: revealedSections.has("mindmap-section") ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s, transform 0.7s, background 0.3s",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 48px" }}>
          {/* Section header */}
          <div style={{ marginBottom: "36px" }}>
            
            <h2 style={{
              fontFamily: "Syne,sans-serif", fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 800,
              letterSpacing: "-0.04em", lineHeight: 1.05, color: colors.text,
            }}>
              Your creative graph,<br />
              <span style={{
                background: `linear-gradient(135deg, ${THEME.wine} 0%, ${THEME.roseGold} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>alive & connected.</span>
            </h2>
            <p style={{ fontSize: "15px", color: colors.textMuted, marginTop: "12px", fontFamily: "'Instrument Sans',sans-serif", maxWidth: 480 }}>
              Every project is a living node. Watch activity pulse through your creative ecosystem in real-time.
            </p>
          </div>

          {/* Graph Canvas */}
          <MindMapGraph pastWorks={pastWorks} isDark={isDark} THEME={THEME} colors={colors} onNavigate={onNavigate} user={user} onSwitchTab={setActiveNav} />
        </div>
      </section>
      <section className="reveal" id="features-section" style={{ background:colors.marqueeBg, borderBottom:`1px solid ${colors.border}`, opacity: revealedSections.has("features-section") ? 1 : 0, transform: revealedSections.has("features-section") ? "translateY(0)" : "translateY(40px)", transition:"opacity 0.7s, transform 0.7s, background 0.3s, border-color 0.3s" }}>
        <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"100px 48px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"11px", letterSpacing:"0.14em", color:"#942945", textTransform:"uppercase", marginBottom:"16px", fontWeight:500 }}>The Editor</div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,5vw,60px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1, marginBottom:"20px", color:colors.text }}>A canvas<br/>built for<br/><em style={{ fontFamily:"Instrument Serif,serif", color:"#942945" }}>flow.</em></h2>
            <p style={{ fontSize:"16px", color:colors.textMuted, lineHeight:1.7, margin:"0 0 32px", fontWeight:300 }}>Every tool is one click away. No buried menus. No learning curve. Just your ideas, amplified.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {[
                { icon:"🎨", title:"Smart layers & artboards",  desc:"Unlimited layers with blend modes and masks",      color:"#942945" },
                { icon:"✦", title:"Real-time collaboration",   desc:"Edit with your team simultaneously",               color:"#22d3a8" },
                { icon:"✨", title:"Export anywhere",           desc:"PNG, SVG, MP4, PPTX, PDF — all from browser",     color:"#e1496d" },
              ].map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 18px", background: isDark ? "rgba(225,73,109,0.06)" : "rgba(148,41,69,0.05)", border: isDark ? "1px solid rgba(225,73,109,0.15)" : "1px solid rgba(148,41,69,0.1)", borderRadius:"12px" }}>
                  <div style={{ width:"36px", height:"36px", background:`${f.color}20`, borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{f.icon}</div>
                  <div><div style={{ fontSize:"14px", fontWeight:500, marginBottom:"2px", color:colors.text }}>{f.title}</div><div style={{ fontSize:"12px", color:colors.textMuted }}>{f.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          {/* Visual mockup */}
          <div style={{ position:"relative", aspectRatio:"4/3", borderRadius:"24px", overflow:"hidden", background:isDark?"#111318":"#fff", border:`1px solid ${isDark?"rgba(148,41,69,0.15)":"rgba(148,41,69,0.12)"}` }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(148,41,69,0.12), rgba(34,211,168,0.06))" }} />
            <div style={{ position:"absolute", width:"52px", top:0, bottom:0, left:0, background:isDark?"rgba(255,255,255,0.03)":"rgba(148,41,69,0.04)", borderRight:isDark?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(148,41,69,0.08)", display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 0", gap:"8px" }}>
              {["”“","","®","”","T"].map((ic,i) => <div key={i} style={{ width:"32px", height:"32px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", background:i===0?"#942945":isDark?"rgba(255,255,255,0.05)":"rgba(148,41,69,0.06)", color:i===0?"#fff":isDark?"rgba(255,255,255,0.5)":"rgba(148,41,69,0.45)" }}>{ic}</div>)}
            </div>
            <div style={{ position:"absolute", inset:0, left:"52px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:"28px", fontWeight:800, color:isDark?"rgba(255,255,255,0.06)":"rgba(148,41,69,0.08)", letterSpacing:"-0.04em" }}>CREATIFY</div>
            </div>
            <div style={{ position:"absolute", width:"120px", height:"80px", top:"20px", left:"80px", borderRadius:"12px", background:isDark?"linear-gradient(135deg,rgba(225,73,109,0.3),rgba(196,154,108,0.2))":"linear-gradient(135deg,rgba(225,73,109,0.2),rgba(196,154,108,0.15))", border:"1px solid rgba(225,73,109,0.3)", animation:"float1 4s ease-in-out infinite" }} />
            <div style={{ position:"absolute", width:"80px", height:"100px", top:"40px", right:"30px", borderRadius:"12px", background:isDark?"linear-gradient(135deg,rgba(148,41,69,0.3),rgba(245,200,66,0.2))":"linear-gradient(135deg,rgba(148,41,69,0.2),rgba(245,200,66,0.15))", border:"1px solid rgba(148,41,69,0.3)", animation:"float2 5s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className="reveal" id="about-section" style={{
        opacity: revealedSections.has("about-section") ? 1 : 0,
        transform: revealedSections.has("about-section") ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s, transform 0.8s",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Top rule */}
        <div style={{ height:"1px", background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)` }} />

        {/* ─¬ Top editorial band: full-width dark */}
        <div style={{
          background: isDark ? "#0d060a" : "#180d12",
          padding: "80px 48px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle grid */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage: `linear-gradient(rgba(225,73,109,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(225,73,109,0.04) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }} />
          {/* Glow orb removed */}

          <div style={{ maxWidth:"1400px", margin:"0 auto", position:"relative" }}>
            {/* Eyebrow */}
            <div style={{ fontSize:"11px", letterSpacing:"0.18em", color:"#942945", textTransform:"uppercase", fontWeight:600, marginBottom:"32px", display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{ width:"24px", height:"1px", background:"#942945" }} /> Our Story
            </div>

            {/* Pull quote */}
            <div style={{ maxWidth:"900px" }}>
              <h2 style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(36px,5.5vw,72px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "#fdf2f4",
                margin: 0,
              }}>
                Built for creators,<br/>
                <em style={{ fontFamily:"Instrument Serif,serif", fontWeight:400, color:"#e1496d", fontStyle:"italic" }}>by creators.</em>
              </h2>
              <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.38)", lineHeight:1.7, fontWeight:300, maxWidth:"620px", marginTop:"28px" }}>
                Creatify was born from a simple frustration—¯— professional design tools demanded years of training and steep subscriptions. We built an entirely browser-native suite so anyone can create at a professional level, instantly.
              </p>
            </div>

            {/* Stat strip */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "0",
              marginTop: "64px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
            }}>
              {[
                { value:"2021", label:"Founded" },
                { value:"3.8M+", label:"Creators worldwide" },
                { value:"120M+", label:"Projects exported" },
                { value:"140", label:"Countries reached" },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "32px 28px",
                  borderRight: "1px solid rgba(255,255,255,0.07)",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(28px,3.5vw,44px)", fontWeight:800, letterSpacing:"-0.04em", background:"linear-gradient(135deg,#fdf2f4,#e1496d)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1, marginBottom:"8px" }}>{s.value}</div>
                  <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", letterSpacing:"0.04em", fontWeight:400 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─¬ Bottom split: mission + principles */}
        <div style={{
          background: isDark ? "#120810" : "#faf5f8",
          padding: "80px 48px",
          borderTop: `1px solid ${colors.border}`,
        }}>
          <div style={{ maxWidth:"1400px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"start" }}>

            {/* Left — Mission statement */}
            <div>
              <div style={{ fontSize:"11px", letterSpacing:"0.16em", color:"#942945", textTransform:"uppercase", fontWeight:600, marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:"20px", height:"1px", background:"#942945" }} /> Mission
              </div>
              <p style={{ fontSize:"18px", color:colors.text, lineHeight:1.75, fontWeight:300, margin:0, letterSpacing:"-0.01em" }}>
                We believe creativity is a human right, not a premium feature. Every tool in Creatify is designed to collapse the distance between an idea and a finished, professional piece of work.
              </p>
              <div style={{ marginTop:"36px", paddingTop:"36px", borderTop:`1px solid ${colors.border}` }}>
                <p style={{ fontSize:"14px", color:colors.textMuted, lineHeight:1.7, fontWeight:300, margin:0 }}>
                  From a first-time freelancer to a studio of fifty—¯— Creatify scales with you. Everything runs in your browser. Nothing ever leaves your machine without your say.
                </p>
              </div>
            </div>

            {/* Right — Principles (clean list, no emoji boxes) */}
            <div>
              <div style={{ fontSize:"11px", letterSpacing:"0.16em", color:"#942945", textTransform:"uppercase", fontWeight:600, marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:"20px", height:"1px", background:"#942945" }} /> Principles
              </div>
              <div style={{ display:"flex", flexDirection:"column" }}>
                {[
                  { num:"01", title:"Browser-native",     body:"Zero downloads. Zero plugins. Your work is always a tab away, on any machine." },
                  { num:"02", title:"Privacy by default",  body:"Raw footage never touches our servers. Rendering happens locally, always." },
                  { num:"03", title:"Radical simplicity",  body:"Professional power, stripped of unnecessary complexity. Opinionated and fast." },
                ].map((p, i, arr) => (
                  <div key={p.num} style={{
                    display:"grid", gridTemplateColumns:"48px 1fr", gap:"16px", alignItems:"start",
                    padding:"24px 0",
                    borderBottom: i < arr.length-1 ? `1px solid ${colors.border}` : "none",
                  }}>
                    <div style={{ fontFamily:"Syne,sans-serif", fontSize:"11px", fontWeight:700, color: isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.3)", letterSpacing:"0.06em", paddingTop:"3px" }}>{p.num}</div>
                    <div>
                      <div style={{ fontSize:"15px", fontWeight:600, color:colors.text, marginBottom:"6px", letterSpacing:"-0.01em" }}>{p.title}</div>
                      <div style={{ fontSize:"13px", color:colors.textMuted, lineHeight:1.6, fontWeight:300 }}>{p.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact-section" style={{
        background: isDark ? "#0a0508" : "#0f0208",
        borderTop: "1px solid rgba(225,73,109,0.10)",
        width: "100%",
        padding: "72px 64px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background orb removed */}

        <div style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", position:"relative", zIndex:1 }}>

          {/* Left — copy */}
          <div>
            <p style={{ fontSize:11, fontWeight:600, color:"rgba(225,73,109,0.65)", fontFamily:"'Poppins',sans-serif", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 14px" }}>Get in touch</p>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(28px,3.5vw,44px)", fontWeight:800, letterSpacing:"-0.04em", color:"#fff", margin:"0 0 16px", lineHeight:1.1 }}>
              Have a question<br/>or feedback?
            </h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.38)", lineHeight:1.7, fontFamily:"'Instrument Sans',sans-serif", margin:"0 0 32px", maxWidth:340 }}>
              We read every message. Whether it's a bug, a feature request, or just a hello — reach out and we'll reply within 24 hours.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label:"demandsightsupport@gmail.com" },
                { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label:"We reply within 24 hours" },
              ].map(({ icon, label }, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, color:"rgba(255,255,255,0.35)", fontSize:13, fontFamily:"'Poppins',sans-serif" }}>
                  <span style={{ color:"rgba(225,73,109,0.6)" }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form or lock */}
          {user ? (
            <ContactForm isDark={isDark} user={user} />
          ) : (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 32px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, textAlign:"center", gap:16 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(225,73,109,0.12)", border:"1px solid rgba(225,73,109,0.22)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(225,73,109,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:17, color:"#fff", margin:"0 0 8px" }}>Sign in to send a message</h3>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.38)", fontFamily:"'Poppins',sans-serif", margin:"0 0 24px", lineHeight:1.6 }}>You need to be signed in so we can reply to you.</p>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => onNavigate("auth","signin")}
                  style={{ background:"linear-gradient(135deg,#942945,#e1496d)", color:"#fff", border:"none", padding:"11px 28px", borderRadius:99, fontSize:13, fontFamily:"'Poppins',sans-serif", fontWeight:600, cursor:"pointer" }}>
                  Sign in
                </button>
                <button onClick={() => onNavigate("auth","signup")}
                  style={{ background:"transparent", color:"rgba(255,255,255,0.55)", border:"1px solid rgba(255,255,255,0.14)", padding:"11px 24px", borderRadius:99, fontSize:13, fontFamily:"'Poppins',sans-serif", cursor:"pointer" }}>
                  Create account
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth:960, margin:"48px auto 0", paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:20, height:20, borderRadius:5, background:"linear-gradient(135deg,#942945,#e1496d)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M3 8 L8 2 L13 8 L8 14 Z" fill="white" opacity="0.9"/><circle cx="8" cy="8" r="2" fill="white"/></svg>
            </div>
            <span style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:13, color:"#fff", letterSpacing:"-0.03em" }}>Creat<span style={{ color:"#e1496d" }}>ify</span></span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.16)", fontFamily:"'Poppins',sans-serif", marginLeft:6 }}>
              © {new Date().getFullYear()} Creatify. All rights reserved.
            </span>
          </div>
          <div style={{ display:"flex", gap:20 }}>
            {["Privacy","Terms","Security"].map(l => (
              <span key={l} style={{ fontSize:11.5, color:"rgba(255,255,255,0.2)", fontFamily:"'Poppins',sans-serif", cursor:"pointer", transition:"color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.2)"}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

          </>
        )}
      </main>

      {/* Studio Picker Modal */}
      {showStudioPicker && (
        <StudioPicker
          isDark={isDark}
          onClose={() => setShowStudioPicker(false)}
          onSelect={(toolId) => onNavigate(toolId)}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&family=Poppins:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
        @keyframes slideInFromRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse      { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes marquee    { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes scrollAnim { 0% { transform:scaleY(0); transform-origin:top; } 50% { transform:scaleY(1); transform-origin:top; } 51% { transform:scaleY(1); transform-origin:bottom; } 100% { transform:scaleY(0); transform-origin:bottom; } }
        @keyframes float1     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
        @keyframes float2     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        @keyframes spin       { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}
