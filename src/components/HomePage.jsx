import { useState, useEffect, useRef } from "react";
import THEME from "../theme";
import { 
  Home, FolderOpen, Wrench, LayoutGrid, 
  Settings, MoreHorizontal, Sparkles 
} from "lucide-react";

// Import generated preview images
import videoPrev  from "../assets/images/video_preview.png";
import pptPrev    from "../assets/images/ppt_preview.png";
import socialPrev from "../assets/images/social_preview.png";
import imagePrev  from "../assets/images/image_preview.png";
import aiPrev     from "../assets/images/ai_preview.png";

// ─── ADVANCED MIND MAP GRAPH COMPONENT ───────────────────────────────────────
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
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ w: 900, h: 600 });
  const [stats, setStats] = useState({ nodes: 0, edges: 0, active: 0 });

  // Derive activity nodes ONLY from real project fields — zero hardcoded data
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

    // Project nodes — golden spiral placement
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

    // Branch nodes — real data only, no fake timestamps
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
    // Hub → main (with multiple animated pulses)
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
    // Main → branch
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
      // DPR-aware canvas sizing — this is the fix for blurriness
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
        const isSel = selectedNode?.id===n.id;
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
          let lbl=n.label; while(ctx.measureText(lbl).width>mw&&lbl.length>3)lbl=lbl.slice(0,-1); if(lbl!==n.label)lbl+="…";
          ctx.fillText(lbl,n.x,n.y-7);
          ctx.font=`400 8px 'Poppins',sans-serif`; ctx.fillStyle=isDark?"rgba(255,255,255,0.42)":"rgba(0,0,0,0.38)";
          let sub=n.sublabel; while(ctx.measureText(sub).width>mw&&sub.length>3)sub=sub.slice(0,-1); if(sub!==n.sublabel)sub+="…";
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
          // Label only — no timestamps
          ctx.textBaseline="middle"; ctx.textAlign="left";
          ctx.fillStyle=isDark?"rgba(255,255,255,0.85)":"rgba(0,0,0,0.78)";
          ctx.font=`600 8px 'Poppins',sans-serif`;
          let bl=n.label;
          while(ctx.measureText(bl).width>pw-24&&bl.length>3)bl=bl.slice(0,-1);
          if(bl!==n.label)bl+="…";
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
  }, [dimensions, isDark, selectedNode]);

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
    setHoveredNode(found);
    setTooltip(found && found.type!=="hub" ? { x: found.x, y: found.y - found.r - 16, node: found } : null);
  };

  const handleClick = () => {
    const n = nodesRef.current.find(x => x.id === hoveredNodeRef.current);
    if (!n) return;
    if (n.type === "main") {
      setSelectedNode(prev => prev?.id === n.id ? null : n);
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
      {/* No background overlays — graph floats freely */}

      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, cursor: hoveredNode ? "pointer" : "default" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { hoveredNodeRef.current=null; mouseRef.current={x:-999,y:-999}; setHoveredNode(null); setTooltip(null); }}
        onClick={handleClick}
      />

      {/* Rich tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: Math.min(tooltip.x, dimensions.w - 200),
          top: Math.max(8, tooltip.y - 8),
          transform: "translate(-50%, -100%)",
          background: isDark
            ? "linear-gradient(135deg, #1e0f16, #2a1020)"
            : "linear-gradient(135deg, #ffffff, #fdf4f8)",
          border: `1px solid ${tooltip.node.color}50`,
          borderRadius: "14px",
          padding: "12px 16px",
          pointerEvents: "none",
          boxShadow: `0 12px 40px ${tooltip.node.color}30, 0 4px 12px rgba(0,0,0,0.15)`,
          zIndex: 20, minWidth: 150, maxWidth: 220,
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{
              width:10, height:10, borderRadius:"50%",
              background: tooltip.node.color,
              boxShadow: `0 0 8px ${tooltip.node.color}`,
              flexShrink: 0,
            }} />
            <span style={{ fontSize:12, fontWeight:700, color: tooltip.node.color, fontFamily:"'Poppins',sans-serif", lineHeight:1.2 }}>
              {tooltip.node.label}
            </span>
          </div>
          {tooltip.node.sublabel && (
            <div style={{ fontSize:10, color: isDark?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.45)", fontFamily:"'Instrument Sans',sans-serif", marginBottom:6 }}>
              {tooltip.node.sublabel}
            </div>
          )}
          {tooltip.node.tags?.length > 0 && (
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:6 }}>
              {tooltip.node.tags.slice(0,3).map(tag => (
                <span key={tag} style={{
                  fontSize:8, padding:"2px 6px", borderRadius:99,
                  background: `${tooltip.node.color}20`,
                  color: tooltip.node.color,
                  fontFamily:"'Poppins',sans-serif", fontWeight:600,
                }}>{tag}</span>
              ))}
            </div>
          )}
          {tooltip.node.isActive && (
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }} />
              <span style={{ fontSize:9, color:"#22c55e", fontWeight:600, fontFamily:"'Poppins',sans-serif" }}>Active now</span>
            </div>
          )}
          {tooltip.node.type==="main" && (
            <div style={{ marginTop:8, fontSize:9, color: isDark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)", fontFamily:"'Poppins',sans-serif" }}>
              Click to select · View in Projects tab →
            </div>
          )}
          {tooltip.node.type==="branch" && (
            <div style={{ marginTop:4, fontSize:9, color: isDark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)", fontFamily:"'Poppins',sans-serif" }}>
              {tooltip.node.sublabel}
            </div>
          )}
        </div>
      )}

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
          {/* Selected project quick action */}
          {selectedNode && (
            <button
              onClick={() => onSwitchTab && onSwitchTab("projects")}
              style={{
                background: `linear-gradient(135deg, ${selectedNode.color}, ${selectedNode.color}cc)`,
                border: "none", borderRadius: 99,
                padding: "6px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: `0 4px 12px ${selectedNode.color}40`,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ fontSize:10, fontWeight:700, color:"#fff", fontFamily:"'Poppins',sans-serif" }}>
                {selectedNode.label}
              </span>
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.75)", fontFamily:"'Poppins',sans-serif" }}>
                → View projects
              </span>
            </button>
          )}
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
          <div style={{ fontSize:40, opacity:0.3 }}>🕸️</div>
          <div style={{ fontSize:14, fontWeight:600, color:isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.25)", fontFamily:"'Poppins',sans-serif" }}>
            Create your first project to see the graph
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage({ onNavigate, user, onSignOut, theme = "light" }) {
  const [hoveredCard, setHoveredCard]         = useState(null);
  const [mousePosition, setMousePosition]     = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered]     = useState(false);
  const [revealedSections, setRevealedSections] = useState(new Set());
  const [animatedStats, setAnimatedStats]     = useState(new Set());
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeNav, setActiveNav]             = useState("home");
  const [navScrolled, setNavScrolled]         = useState(false);
  const [heroSettled, setHeroSettled]         = useState(false);
  const [heroCreateHover, setHeroCreateHover] = useState(false);

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
  const pastWorkScrollRef = useRef(null);


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

  useEffect(() => {
    const h = e => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

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
  // Grid: 3 columns × 2 rows. All tools equally sized to fit in one studio without gaps
  const tools = [
    { id:"video",   name:"Video Editor",       desc:"Full multi-track timeline with WebGL color grading, audio mixing & in-browser rendering. No uploads needed.", icon:"🎬", color:"#942945",  tag:"WebGL · WASM",           colSpan:1, rowSpan:1, image: videoPrev  },
    { id:"image",   name:"Image Editor",       desc:"Layers, masks, filters, blend modes. Pro-grade photo editing in your browser.",                                icon:"🖼️", color:"#e1496d",  tag:"Canvas API",             colSpan:1, rowSpan:1, image: imagePrev  },
    { id:"logo",    name:"Logo Maker",         desc:"Vector-based logo studio. AI suggestions, custom icons, SVG export.",                                          icon:"✦",  color:"#ec4899",  tag:"SVG · AI-assisted",      colSpan:1, rowSpan:1, image: null       },
    { id:"ppt",     name:"Presentations",      desc:"Slides that animate. Real-time collaboration, 500+ templates, one-click export.",                              icon:"📊", color:"#7c233c",  tag:"PPTX · PDF · HTML5",     colSpan:1, rowSpan:1, image: pptPrev    },
    { id:"studio",  name:"Infinite Studio",    desc:"Code-to-canvas nodes, infinite spatial graph, live API data, dev mode handoff, AI prompt-to-DOM & multiplayer ghost replay.", icon:"∞",  color:"#4f46e5",  tag:"AI · Nodes · API · Dev", colSpan:1, rowSpan:1, image: null       },
    { id:"white",   name:"Whiteboard",         desc:"Freehand canvas with sticky notes, arrows, shapes, laser pointer & live multiplayer cursors.",                  icon:"✏️",  color:"#be185d",  tag:"Canvas · Real-time",     colSpan:1, rowSpan:1, image: null       },
    { id:"doc",     name:"Documents",          desc:"Rich docs with embedded media, tables, charts. Beautiful by default.",                                         icon:"📄", color:"#eba5b6",  tag:"DOCX · PDF",             colSpan:1, rowSpan:1, image: null       },
  ];

  const pricing = [
    { name:"Free",  price:0,  period:"forever free",              popular:false, features:["5 active projects","Basic templates","2GB storage","Export PNG & PDF","Community support"] },
    { name:"Pro",   price:16, period:"per month, billed annually", popular:true,  features:["Unlimited projects","500K+ premium templates","100GB storage","All export formats","AI design tools","Brand kit","Priority support"] },
    { name:"Team",  price:42, period:"per month, up to 5 seats",  popular:false, features:["Everything in Pro","Real-time collaboration","Shared brand assets","Admin controls","1TB storage","Dedicated support"] },
  ];

  // ── Gradient fallbacks for cards without images ──────────────────────────
  const cardGradients = {
    logo:  "linear-gradient(135deg, #1a0f14 0%, #3a0c19 40%, #ec489920 100%)",
    doc:   "linear-gradient(135deg, #170b11 0%, #23141b 50%, #eba5b620 100%)",
    white: "linear-gradient(135deg, #140a0f 0%, #2a0d1b 45%, #be185d25 100%)",
  };

  const colors = {
    bg: isDark ? "#1a0f14" : "#f7f4f7",
    text: isDark ? "#fdf2f4" : "#2d2d2d",
    textMuted: isDark ? "#a8a29e" : "#666",
    navBg: isDark ? "rgba(12, 10, 9, 0.94)" : "rgba(250, 248, 245, 0.94)",
    border: isDark ? "rgba(212, 165, 116, 0.22)" : "rgba(139, 90, 43, 0.1)",
    btnBg: isDark ? "rgba(212, 165, 116, 0.12)" : "rgba(139, 90, 43, 0.1)",
    btnBorder: isDark ? "rgba(212, 165, 116, 0.25)" : "rgba(139, 90, 43, 0.2)",
    marqueeBg: isDark ? "#23141b" : "#fdf2f4",
    logoGlow: isDark ? "rgba(212, 165, 116, 0.2)" : "rgba(139, 90, 43, 0.35)",
    cardBorder: isDark ? "rgba(212, 165, 116, 0.22)" : "rgba(139, 90, 43, 0.15)",
    cardShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(139, 90, 43, 0.08)",
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

  const SidebarIcon = ({ active, icon: IconComponent, label, onClick, crownBadge, bottom = false, animationType = "scale" }) => {
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
          case "rotate":
            return { transform: "scale(1.1) rotate(15deg)" };
          case "bounce":
            return { transform: "scale(1.1) translateY(-2px)" };
          case "pulse":
            return { transform: "scale(1.15)" };
          default:
            return { transform: "scale(1.1)" };
        }
      }
      return {};
    };

    return (
      <div style={{ 
        position: "relative", 
        width: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        marginBottom: bottom ? 4 : 0 
      }}>
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title={label}
          style={{
            width: 40, 
            height: 40, 
            borderRadius: 11, 
            display: "flex",
            alignItems: "center", 
            justifyContent: "center",
            background: active 
              ? `linear-gradient(135deg, ${THEME.hexA(THEME.wine, 0.15)}, ${THEME.hexA(THEME.wine, 0.08)})` 
              : isHovered 
                ? `linear-gradient(135deg, ${THEME.hexA(THEME.wine, 0.08)}, ${THEME.hexA(THEME.wine, 0.03)})`
                : "transparent",
            border: active
              ? `2px solid ${THEME.hexA(THEME.wine, 0.4)}`
              : `2px solid transparent`,
            color: active ? THEME.wine : isHovered ? THEME.wine : THEME.textMuted,
            cursor: "pointer", 
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
            outline: "none", 
            position: "relative",
            boxShadow: active 
              ? `0 4px 12px ${THEME.hexA(THEME.wine, 0.2)}` 
              : isHovered 
                ? `0 2px 8px ${THEME.hexA(THEME.wine, 0.1)}`
                : "none",
          }}
        >
          <div style={{
            ...getAnimationStyles(),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            <IconComponent 
              size={20} 
              strokeWidth={active ? 2.5 : 2}
              style={{ 
                filter: active ? `drop-shadow(0 0 4px ${THEME.hexA(THEME.wine, 0.3)})` : "none",
              }}
            />
          </div>
          {crownBadge && (
            <div style={{
              position: "absolute", 
              top: -3, 
              right: -3,
              background: THEME.grad.gold,
              width: 13, 
              height: 13, 
              borderRadius: "50%",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: 7, 
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              animation: isHovered ? "bounce 0.5s ease-in-out" : "none"
            }}>👑</div>
          )}
        </button>
        <span style={{
          fontSize: 8.5, 
          marginTop: 2, 
          color: active ? THEME.wine : isHovered ? THEME.wine : THEME.textMuted,
          fontFamily: "'Poppins',sans-serif", 
          fontWeight: active ? 600 : 400, 
          letterSpacing: "-0.01em",
          transition: "all 0.2s ease",
          opacity: isHovered || active ? 1 : 0.8
        }}>{label}</span>
      </div>
    );
  };

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
          {isCrown && <div style={{ position: "absolute", top: -4, right: -4, fontSize: 14 }}>👑</div>}
        </div>
        <span style={{
          fontSize: 11.5, color: isDark ? "rgba(245,240,232,0.78)" : "rgba(45,45,45,0.82)",
          fontFamily: "'Poppins',sans-serif", fontWeight: 400, whiteSpace: "nowrap",
        }}>{label}</span>
      </button>
    );
  };

  const AnimatedCreateRow = ({ onNavigate, user, isDark, THEME, heroCreateHover, setHeroCreateHover }) => {
    const ANIM_STORAGE_KEY = "creatify_hero_create_animated";

    const hasPlayedSession = (() => {
      try { return sessionStorage.getItem(ANIM_STORAGE_KEY) === "1"; }
      catch (e) { return false; }
    })();

    const [phase, setPhase] = useState(hasPlayedSession ? 2 : 0);
    const [animOnce, setAnimOnce] = useState(!hasPlayedSession);
    const btnRef = useRef(null);

    useEffect(() => {
      if (!animOnce) return;
      const t1 = setTimeout(() => setPhase(1), 650);
      const t2 = setTimeout(() => {
        setPhase(2);
        try { sessionStorage.setItem(ANIM_STORAGE_KEY, "1"); } catch (e) {}
        setAnimOnce(false);
      }, 1600);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [animOnce]);

    const rowCenterBig = {
      position: "relative",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "44px 0 64px",
    };

    const rowSettled = {
      position: "relative",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "36px 12px 52px",
      gap: "40px",
    };

    const showBig = phase === 0 && animOnce;
    const detailsVisible = phase === 2;
    const showShimmer = phase === 0 && animOnce;

    const bigBtn = { w: 440, h: 88, radius: 999, icon: 28, text: 20 };
    const smallBtn = { w: 248, h: 60, radius: 16, icon: 20, text: 15 };
    const dims = showBig ? bigBtn : smallBtn;

    return (
      <div style={showBig ? rowCenterBig : rowSettled}>
        <style>{`
          @keyframes heroRectPop {
            0% { transform: scale(0.6); opacity: 0; filter: blur(14px); }
            55% { transform: scale(1.04); opacity: 1; filter: blur(0); }
            78% { transform: scale(0.985); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes heroRectShine {
            0% { transform: translateX(-130%) skewX(-18deg); }
            100% { transform: translateX(230%) skewX(-18deg); }
          }
          @keyframes heroBorderPulse {
            0%, 100% { opacity: 0.65; }
            50% { opacity: 1; }
          }
          @keyframes heroIconDraw {
            0% { stroke-dashoffset: 80; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes heroGlowPulse {
            0%, 100% { opacity: 0.55; transform: translate(-50%,-50%) scale(1); }
            50% { opacity: 0.95; transform: translate(-50%,-50%) scale(1.06); }
          }
        `}</style>

        {/* LEFT: Editor-style details (no Start Creating chip) */}
        <div style={{
          flex: 1,
          maxWidth: 520,
          opacity: detailsVisible ? 1 : (animOnce ? 0 : 1),
          transform: detailsVisible ? "translateX(0)" : (animOnce ? "translateX(-60px)" : "translateX(0)"),
          transition: animOnce
            ? "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s"
            : "none",
          pointerEvents: detailsVisible || !animOnce ? "auto" : "none",
        }}>
          <h3 style={{
            fontFamily: "Syne,sans-serif", fontWeight: 700,
            fontSize: "clamp(26px, 3vw, 38px)",
            letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 14px",
            color: isDark ? "#fff" : THEME.text,
          }}>
            Your creative
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${THEME.wine} 0%, ${THEME.roseGold} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>design studio.</span>
          </h3>
          <p style={{
            fontSize: 14.5, lineHeight: 1.65, margin: 0,
            color: isDark ? "rgba(255,255,255,0.7)" : THEME.textMuted,
            fontFamily: "'Instrument Sans',sans-serif", fontWeight: 400,
            maxWidth: 460,
          }}>
            Professional tools for video editing, presentations, graphics, and more. Everything you need to create stunning content.
          </p>
          <div style={{ display: "flex", gap: "14px", marginTop: "22px", alignItems: "center", flexWrap: "wrap" }}>
            {[
              { icon: "⚡", label: "Templates" },
              { icon: "🎬", label: "Video" },
              { icon: "🎨", label: "Designs" },
              { icon: "✨", label: "AI Tools" },
            ].map(chip => (
              <div key={chip.label} style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "7px 13px", borderRadius: 10,
                background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : THEME.borderSoft}`,
                boxShadow: THEME.shadow.sm,
              }}>
                <span style={{ fontSize: 14 }}>{chip.icon}</span>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: isDark ? "rgba(255,255,255,0.82)" : THEME.text,
                  fontFamily: "'Poppins',sans-serif",
                }}>{chip.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ RECTANGULAR PILL CREATE BUTTON ═══════ */}
        <div
          ref={btnRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: dims.w + 60,
            height: dims.h + 60,
            cursor: "pointer",
          }}
          onMouseEnter={() => setHeroCreateHover(true)}
          onMouseLeave={() => setHeroCreateHover(false)}
          onClick={() => onNavigate(user ? "editor" : "auth", "signup")}
        >
          {/* Outer glow halo */}
          <div style={{
            position: "absolute",
            left: "50%", top: "50%",
            width: dims.w + 50, height: dims.h + 50,
            borderRadius: dims.radius,
            background: `radial-gradient(ellipse at center, ${THEME.hexA(THEME.roseGold, 0.28)} 0%, ${THEME.hexA(THEME.wine, 0.12)} 50%, transparent 80%)`,
            filter: "blur(12px)",
            transform: "translate(-50%,-50%)",
            opacity: heroCreateHover ? 1 : 0.6,
            transition: "opacity 0.35s",
            pointerEvents: "none",
            animation: !showBig ? "heroGlowPulse 4s ease-in-out infinite" : "heroGlowPulse 4s ease-in-out 0.4s infinite",
          }} />

          {/* Animated gradient border */}
          <div style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: dims.w + 4, height: dims.h + 4,
            borderRadius: dims.radius,
            padding: 2,
            background: `linear-gradient(135deg, ${THEME.roseGoldLight} 0%, ${THEME.wineLight} 35%, ${THEME.plumLight} 65%, ${THEME.wineMid} 100%)`,
            backgroundSize: "200% 200%",
            animation: "heroGradientShift 6s ease-in-out infinite",
            opacity: heroCreateHover ? 0.95 : 0.65,
            transition: "opacity 0.3s",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          }} />

          {/* MAIN RECTANGLE BUTTON */}
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(user ? "editor" : "auth", "signup"); }}
            onMouseEnter={() => setHeroCreateHover(true)}
            onMouseLeave={() => setHeroCreateHover(false)}
            style={{
              position: "relative",
              width: dims.w,
              height: dims.h,
              borderRadius: dims.radius,
              background: `linear-gradient(135deg, #e1496d 0%, #b13453 32%, #942945 68%, #7c233c 100%)`,
              backgroundSize: "200% 200%",
              animation: (showBig
                ? "heroRectPop 0.75s cubic-bezier(0.16,1.3,0.3,1) 0.15s forwards, heroGradientShift 5s ease-in-out 0.9s infinite"
                : "heroGradientShift 5s ease-in-out infinite"),
              border: `1px solid ${THEME.hexA("#ffffff", 0.22)}`,
              color: "#fff",
              cursor: "pointer",
              padding: `0 ${showBig ? 34 : 18}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: showBig ? 14 : 10,
              boxShadow: heroCreateHover
                ? `0 18px 48px ${THEME.hexA(THEME.wine, 0.45)}, 0 2px 0 ${THEME.hexA("#ffffff", 0.28)} inset, 0 -4px 14px ${THEME.hexA(THEME.wineDarker, 0.55)} inset`
                : `0 10px 30px ${THEME.hexA(THEME.wine, 0.3)}, 0 2px 0 ${THEME.hexA("#ffffff", 0.22)} inset, 0 -3px 10px ${THEME.hexA(THEME.wineDarker, 0.45)} inset`,
              outline: "none",
              transform: `translateY(${heroCreateHover ? -3 : 0}px) scale(${heroCreateHover ? 1.03 : 1})`,
              transition: showBig
                ? "box-shadow 0.35s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)"
                : "all 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* Top rim highlight */}
            <div style={{
              position: "absolute",
              top: 1, left: 10, right: 10,
              height: dims.h * 0.42,
              borderRadius: dims.radius,
              background: `linear-gradient(180deg, ${THEME.hexA("#ffffff", 0.28)} 0%, transparent 80%)`,
              pointerEvents: "none",
            }} />
            {/* Bottom vignette */}
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: dims.radius,
              background: `linear-gradient(180deg, transparent 40%, ${THEME.hexA(THEME.wineDarker, 0.35)} 100%)`,
              pointerEvents: "none",
            }} />
            {/* Shimmer sweep */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: dims.radius, pointerEvents: "none",
              background: "linear-gradient(105deg, transparent 22%, rgba(255,255,255,0.38) 50%, transparent 78%)",
              animation: showShimmer
                ? "heroRectShine 1.8s ease-in-out 0.35s 2"
                : heroCreateHover
                ? "heroRectShine 1.4s ease-in-out infinite"
                : "none",
            }} />

            {/* PLUS SQUARE icon (editor-style: filled badge + plus line art) */}
            <span style={{
              position: "relative",
              zIndex: 2,
              flexShrink: 0,
              width: showBig ? 44 : 32,
              height: showBig ? 44 : 32,
              borderRadius: showBig ? 12 : 9,
              background: `linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05))`,
              border: `1px solid ${THEME.hexA("#ffffff", 0.3)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: heroCreateHover ? "rotate(-90deg) scale(1.08)" : "rotate(0deg) scale(1)",
              transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
              boxShadow: `0 2px 8px ${THEME.hexA(THEME.wineDarker, 0.4)}, inset 0 1px 0 rgba(255,255,255,0.25)`,
            }}>
              <svg
                width={dims.icon}
                height={dims.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 1px 2px ${THEME.hexA(THEME.wineDarker, 0.6)})`,
                }}
              >
                <line x1="12" y1="5" x2="12" y2="19" style={{
                  strokeDasharray: 18,
                  strokeDashoffset: showBig ? 18 : 0,
                  animation: showBig ? "heroIconDraw 0.55s cubic-bezier(0.16,1,0.3,1) 0.5s forwards" : "none",
                }} />
                <line x1="5" y1="12" x2="19" y2="12" style={{
                  strokeDasharray: 18,
                  strokeDashoffset: showBig ? 18 : 0,
                  animation: showBig ? "heroIconDraw 0.55s cubic-bezier(0.16,1,0.3,1) 0.6s forwards" : "none",
                }} />
              </svg>
            </span>

            {/* Label + subline */}
            <span style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column",
              alignItems: showBig ? "flex-start" : "center",
              gap: showBig ? 2 : 0,
            }}>
              <span style={{
                fontSize: dims.text,
                fontWeight: 700,
                fontFamily: "'Poppins',sans-serif",
                letterSpacing: showBig ? "-0.01em" : "0.01em",
                lineHeight: 1,
                color: "#fff",
                textShadow: `0 1px 2px ${THEME.hexA(THEME.wineDarker, 0.7)}`,
              }}>
                {showBig ? "Create a new design" : "New design"}
              </span>
              {showBig && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 400,
                  fontFamily: "'Instrument Sans',sans-serif",
                  letterSpacing: "0",
                  color: THEME.hexA("#ffffff", 0.82),
                }}>
                  Start from scratch or with a template
                </span>
              )}
            </span>

            {/* Arrow on right when settled */}
            {!showBig && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: "relative", zIndex: 2,
                  marginLeft: 2,
                  opacity: 0.88,
                  transform: heroCreateHover ? "translateX(4px)" : "translateX(0)",
                  transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      margin: 0, padding: 0, width: "100%",
      background: isDark ? "#f6f5fb" : "#f7f6fb",
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

      {/* ═══════════════ CANVA-STYLE VERTICAL SIDEBAR ═══════════════ */}
      <aside style={{
        position: "fixed", top: 20, left: 12, bottom: 20, width: sidebarW,
        background: THEME.grad.sidebar,
        borderRight: `1px solid ${THEME.borderSoft}`,
        border: `1px solid ${THEME.borderSoft}`,
        zIndex: 200,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "14px 0 12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        borderRadius: "20px",
        backdropFilter: "blur(10px)",
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <SidebarIcon 
            active={activeNav === "home"} 
            label="Home" 
            onClick={() => { setActiveNav("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            icon={Home}
            animationType="bounce"
          />
          <SidebarIcon 
            active={activeNav === "projects"} 
            label="Projects" 
            onClick={() => { setActiveNav("projects"); }}
            icon={FolderOpen}
            animationType="scale"
          />
          <SidebarIcon 
            active={activeNav === "tools"} 
            label="Tools" 
            onClick={() => { setActiveNav("tools"); scrollTo("tools-section", "tools"); }}
            icon={Wrench}
            animationType="rotate"
          />
          <SidebarIcon 
            active={activeNav === "templates"} 
            label="Templates" 
            onClick={() => { setActiveNav("templates"); scrollTo("tools-section", "templates"); }}
            icon={LayoutGrid}
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
            active={activeNav === "settings"} 
            label="Settings" 
            onClick={() => setActiveNav("settings")}
            icon={Settings}
            animationType="rotate"
          />
          <SidebarIcon 
            active={activeNav === "more"} 
            label="More" 
            onClick={() => setActiveNav("more")}
            icon={MoreHorizontal}
            animationType="scale"
          />
        </div>
      </aside>

      {/* ═══════════════ MAIN CONTENT (full width with sidebar padding) ═══════════════ */}
      <main style={{ width: "100%", position: "relative", overflow: "hidden", paddingLeft: "88px" }}>

        {/* Conditional rendering based on activeNav */}
        {activeNav === "projects" ? (
          /* ── INLINE PROJECTS VIEW — keeps sidebar visible ── */
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
                onClick={() => setActiveNav("home")}
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
                ← Back to Home
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
                        e.currentTarget.style.boxShadow=`0 12px 32px ${THEME.hexA(accent,0.18)}`;
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
                        {/* Tags — real data only */}
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

        {/* ═══════════════ PLAIN HERO SECTION WITH HEADING ═══════════════ */}
        <section style={{
          position: "relative", padding: "80px 48px 40px",
          background: THEME.grad.hero,
        }}>
          <div style={{ maxWidth: pageMax, margin: "0 auto" }}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <h1 style={{
                fontFamily: "Syne,sans-serif", fontWeight: 700,
                fontSize: "clamp(40px, 5.2vw, 70px)",
                letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0,
                background: `linear-gradient(135deg, ${THEME.wine} 0%, ${THEME.wineMid} 50%, ${THEME.gold} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Bring your ideas to life in seconds.
              </h1>
            </div>

            {/* ═══════ ANIMATED CREATE BUTTON + DETAILS ROW ═══════ */}
            <AnimatedCreateRow
              onNavigate={onNavigate}
              user={user}
              isDark={isDark}
              THEME={THEME}
              heroCreateHover={heroCreateHover}
              setHeroCreateHover={setHeroCreateHover}
            />
          </div>
        </section>

      {/* Marquee */}
      <div style={{ padding:"28px 0", borderTop:`1px solid ${colors.border}`, borderBottom:`1px solid ${colors.border}`, overflow:"hidden", background:colors.marqueeBg, transition:"background 0.3s, border-color 0.3s" }}>
        <div style={{ display:"flex", whiteSpace:"nowrap", animation:"marquee 25s linear infinite" }}>
          {[...Array(2)].flatMap((_, outerIdx) => ["Video Editor","Logo Maker","Presentations","Social Media","Brand Kit","Print Design","Documents","Mockups","Infographics"].map((item,i) => (
            <span key={`${outerIdx}-${item}-${i}`} style={{ display:"inline-flex", alignItems:"center", gap:"12px", padding:"0 40px", fontSize:"12px", color:colors.textMuted, letterSpacing:"0.06em", textTransform:"uppercase", fontWeight:500 }}>
              <span style={{ width:"4px", height:"4px", background:"#942945", borderRadius:"50%", flexShrink:0 }} />{item}
            </span>
          )))}
        </div>
      </div>

      {/* ── PAST WORK — Horizontal Scrollable Showcase ── */}
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
        {/* Section ambient gradient blobs */}
        <div aria-hidden style={{
          position: "absolute", top: 80, left: -80,
          width: 360, height: 360, borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.hexA(THEME.wine, isDark ? 0.18 : 0.12)} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", bottom: 40, right: -60,
          width: 320, height: 320, borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.hexA(THEME.plum, isDark ? 0.16 : 0.1)} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Header */}
        <div style={{ padding: "0 48px", marginBottom: "44px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", position: "relative", zIndex: 1 }}>
          <div>
            <h2 style={{
              fontFamily: "Syne,sans-serif", fontSize: "clamp(32px,4vw,56px)",
              fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.95,
              color: colors.text, margin: 0,
            }}>
              Past Work<span style={{ color: THEME.wine, marginLeft: 2 }}>.</span>
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <p style={{ fontSize: "14px", color: colors.textMuted, maxWidth: "340px", lineHeight: 1.6, fontWeight: 400, margin: 0, fontFamily: "'Instrument Sans',sans-serif" }}>
              Projects crafted across every tool in the suite.
            </p>
            <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
              {[
                { dir: -1, rotate: "-2deg" },
                { dir: 1, rotate: "2deg" },
              ].map(({ dir, rotate }) => (
                <button key={dir}
                  onClick={() => pastWorkScrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" })}
                  style={{
                    position: "relative",
                    width: "48px", height: "48px", borderRadius: "14px",
                    background: isDark
                      ? "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                      : "linear-gradient(145deg, #ffffff, #f8f2f5)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : THEME.borderSoft}`,
                    color: colors.textMuted,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    outline: "none",
                    boxShadow: isDark
                      ? "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.35)"
                      : `0 1px 0 #fff inset, 0 8px 24px ${THEME.hexA(THEME.wine, 0.09)}`,
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `linear-gradient(145deg, ${THEME.roseGoldLight}, ${THEME.wine} 55%, ${THEME.plum})`;
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = `translateY(-2px) rotate(${rotate}) scale(1.06)`;
                    e.currentTarget.style.boxShadow = `0 14px 34px ${THEME.hexA(THEME.wine, 0.42)}, 0 1px 0 ${THEME.hexA("#ffffff", 0.22)} inset, 0 0 0 3px ${THEME.hexA(THEME.roseGoldLight, 0.18)}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isDark
                      ? "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                      : "linear-gradient(145deg, #ffffff, #f8f2f5)";
                    e.currentTarget.style.color = colors.textMuted;
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : THEME.borderSoft;
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = isDark
                      ? "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.35)"
                      : `0 1px 0 #fff inset, 0 8px 24px ${THEME.hexA(THEME.wine, 0.09)}`;
                  }}
                >
                  {/* Glow sheen sweep — slides across on hover */}
                  <div aria-hidden style={{
                    position: "absolute", top: 0, left: "-120%",
                    width: "120%", height: "100%",
                    background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.32) 50%, transparent 70%)",
                    pointerEvents: "none",
                    transition: "left 0.7s cubic-bezier(0.16,1,0.3,1)",
                  }}
                    ref={el => {
                      // schedule once via mouseenter listener hook
                      const btn = el?.parentElement;
                      if (!btn || btn.dataset.sheenAttached === "1") return;
                      btn.dataset.sheenAttached = "1";
                      btn.addEventListener("mouseenter", () => { if (el) el.style.left = "120%"; });
                      btn.addEventListener("mouseleave", () => { if (el) setTimeout(() => { el.style.left = "-120%"; }, 120); });
                    }}
                  />

                  {/* Chevron arrow SVG, rotated by direction */}
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.6"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      transform: dir === -1 ? "rotate(0deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                      filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))",
                    }}
                  >
                    {dir === -1 ? (
                      <>
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </>
                    ) : (
                      <>
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </>
                    )}
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll rail */}
        <div
          ref={pastWorkScrollRef}
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "8px 48px 28px",
            cursor: "grab",
            position: "relative",
            zIndex: 1,
          }}
          onMouseDown={e => { e.currentTarget.dataset.down = "1"; e.currentTarget.dataset.startX = e.pageX; e.currentTarget.dataset.scrollLeft = e.currentTarget.scrollLeft; e.currentTarget.style.cursor = "grabbing"; }}
          onMouseMove={e => { if (!e.currentTarget.dataset.down || e.currentTarget.dataset.down !== "1") return; e.currentTarget.scrollLeft = parseInt(e.currentTarget.dataset.scrollLeft) - (e.pageX - parseInt(e.currentTarget.dataset.startX)); }}
          onMouseUp={e => { e.currentTarget.dataset.down = "0"; e.currentTarget.style.cursor = "grab"; }}
          onMouseLeave={e => { e.currentTarget.dataset.down = "0"; e.currentTarget.style.cursor = "grab"; }}
        >
          {pastWorks.map((work, i) => {
            const isHov = hoveredWork === i;
            const accent = work.accent || THEME.wine;
            const accentSoft = THEME.hexA(accent, 0.18);
            const accentGlow = THEME.hexA(accent, 0.32);

            return (
              <div key={work.id || i}
                onMouseEnter={() => setHoveredWork(i)}
                onMouseLeave={() => setHoveredWork(null)}
                onClick={() => {
                  if (!user) return onNavigate("auth", "signup");
                  if (work.category === "Video Edit") {
                    onNavigate("editor_load", work);
                  } else if (work.category === "Presentation") {
                    onNavigate("presentation_load", work);
                  } else if (work.category === "Image Edit") {
                    onNavigate("image_editor_load", work);
                  } else if (work.category === "Logo Design") {
                    onNavigate("logo_maker_load", work);
                  } else if (work.category === "Social Post") {
                    onNavigate("social_studio_load", work);
                  } else if (work.category === "Document") {
                    onNavigate("documents_load", work);
                  } else if (work.category === "Print Layout") {
                    onNavigate("print_design_load", work);
                  }
                }}
                style={{
                  flexShrink: 0,
                  width: "264px",
                  height: "340px",
                  borderRadius: "20px",
                  scrollSnapAlign: "start",
                  position: "relative",
                  overflow: "hidden",
                  background: work.gradient || "linear-gradient(135deg,#170b11,#1a0f14)",
                  cursor: "pointer",
                  transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.3s",
                  transform: isHov
                    ? "translateY(-6px) scale(1.02)"
                    : "translateY(0) scale(1)",
                  boxShadow: isHov
                    ? `0 24px 56px ${accentGlow}, 0 2px 0 ${THEME.hexA("#ffffff", 0.08)} inset`
                    : `0 10px 30px ${isDark ? "rgba(0,0,0,0.35)" : THEME.hexA(THEME.wine, 0.08)}`,
                  userSelect: "none",
                  border: `1px solid ${isHov ? THEME.hexA(accent, 0.55) : (isDark ? "rgba(255,255,255,0.06)" : THEME.borderSoft)}`,
                }}
              >
                {/* Animated gradient border halo — visible on hover */}
                <div aria-hidden style={{
                  position: "absolute", inset: isHov ? -2 : 0,
                  borderRadius: "inherit",
                  padding: 1,
                  background: isHov
                    ? `linear-gradient(135deg, ${accent}, ${THEME.roseGoldLight}, ${THEME.plumLight}, ${accent})`
                    : "transparent",
                  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  opacity: isHov ? 1 : 0,
                  transition: "opacity 0.4s, inset 0.4s",
                  pointerEvents: "none",
                }} />

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePastWork(work.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "26px",
                    height: "26px",
                    borderRadius: "8px",
                    background: isHov ? THEME.hexA("#000000", 0.72) : THEME.hexA("#000000", 0.45),
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    border: `1px solid ${isHov ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)"}`,
                    color: "rgba(255,255,255,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 15,
                    fontSize: "12px",
                    fontWeight: 600,
                    transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
                    opacity: isHov ? 1 : 0,
                    transform: isHov ? "translateY(0) scale(1)" : "translateY(-4px) scale(0.92)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#ef4444";
                    e.currentTarget.style.borderColor = THEME.hexA("#ef4444", 0.5);
                    e.currentTarget.style.background = THEME.hexA("#ef4444", 0.12);
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                    e.currentTarget.style.background = THEME.hexA("#000000", 0.72);
                  }}
                  title="Delete Project"
                >
                  ✕
                </button>

                {/* Dual accent orbs */}
                <div aria-hidden style={{
                  position: "absolute", width: "160px", height: "160px", borderRadius: "50%",
                  filter: "blur(42px)",
                  background: accentSoft,
                  top: "-50px", right: "-40px",
                  opacity: isHov ? 1 : 0.55,
                  transition: "opacity 0.5s, transform 0.5s",
                  transform: isHov ? "scale(1.15)" : "scale(1)",
                  pointerEvents: "none",
                }} />
                <div aria-hidden style={{
                  position: "absolute", width: "140px", height: "140px", borderRadius: "50%",
                  filter: "blur(38px)",
                  background: THEME.hexA(THEME.plumLight, 0.22),
                  bottom: "-40px", left: "-30px",
                  opacity: isHov ? 0.95 : 0.4,
                  transition: "opacity 0.5s, transform 0.5s",
                  transform: isHov ? "scale(1.1)" : "scale(1)",
                  pointerEvents: "none",
                }} />

                {/* Grain overlay for texture */}
                <div aria-hidden style={{
                  position: "absolute", inset: 0,
                  background: isDark
                    ? "radial-gradient(ellipse at top, rgba(255,255,255,0.08), transparent 55%)"
                    : "radial-gradient(ellipse at top, rgba(255,255,255,0.18), transparent 55%)",
                  pointerEvents: "none",
                }} />

                {/* Image or icon + zoom on hover */}
                {work.image ? (
                  <img src={work.image} alt={work.title} style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    opacity: isHov ? 0.55 : 0.32,
                    transform: isHov ? "scale(1.12)" : "scale(1)",
                    transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                  }} />
                ) : (
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: `translate(-50%,-50%) scale(${isHov ? 0.85 : 1})`,
                    fontSize: "62px",
                    opacity: isHov ? 0.1 : 0.18,
                    transition: "all 0.5s",
                    pointerEvents: "none", userSelect: "none",
                  }}>{work.icon || "🎬"}</div>
                )}

                {/* Wine-tinted image overlay */}
                <div aria-hidden style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(180deg, ${THEME.hexA(THEME.wineDarker, isHov ? 0.15 : 0.35)} 0%, ${THEME.hexA(THEME.wineDarker, isHov ? 0.65 : 0.92)} 100%)`,
                  pointerEvents: "none",
                  transition: "background 0.5s",
                }} />

                {/* Top bar — glassy category pill + year */}
                <div style={{
                  position: "absolute", top: "14px", left: "14px", right: "14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  zIndex: 2,
                }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    fontSize: "9.5px", color: "#fff",
                    fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                    background: isHov ? THEME.hexA(accent, 0.92) : THEME.hexA(accent, 0.78),
                    border: `1px solid ${THEME.hexA("#ffffff", 0.22)}`,
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontFamily: "'Poppins',sans-serif",
                    boxShadow: `0 2px 8px ${accentGlow}`,
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    transform: isHov ? "translateY(0) scale(1)" : "translateY(0) scale(0.98)",
                    transition: "all 0.35s",
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "#fff",
                      boxShadow: `0 0 0 2px ${THEME.hexA("#ffffff", 0.25)}`,
                    }} />
                    {work.category || "Project"}
                  </div>
                  <div style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.72)",
                    fontWeight: 500,
                    fontFamily: "'Poppins',sans-serif",
                    padding: "3px 8px",
                    borderRadius: "8px",
                    background: THEME.hexA("#000000", 0.3),
                    border: `1px solid ${THEME.hexA("#ffffff", 0.08)}`,
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                  }}>{work.year || ""}</div>
                </div>

                {/* Bottom glass panel */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  margin: "12px",
                  padding: "16px 14px 14px",
                  borderRadius: "14px",
                  background: `linear-gradient(180deg, ${THEME.hexA(isDark ? "#23141b" : "#000000", isHov ? 0.78 : 0.68)} 0%, ${THEME.hexA(isDark ? "#1a0f14" : "#000000", isHov ? 0.92 : 0.85)} 100%)`,
                  border: `1px solid ${isHov ? THEME.hexA(accent, 0.35) : THEME.hexA("#ffffff", 0.09)}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  transform: isHov ? "translateY(0)" : "translateY(3px)",
                  boxShadow: isHov ? `0 10px 30px ${THEME.hexA("#000", 0.5)}` : "none",
                  opacity: isHov ? 1 : 0.97,
                  transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                  zIndex: 2,
                }}>
                  {/* Tool / accent label */}
                  {work.tool && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      fontSize: "9.5px", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: accent,
                      marginBottom: "6px",
                      fontFamily: "'Poppins',sans-serif",
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, boxShadow: `0 0 6px ${accent}` }} />
                      {work.tool}
                    </div>
                  )}
                  <div style={{
                    fontFamily: "Syne,sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.18,
                    marginBottom: isHov && work.desc ? "8px" : 0,
                  }}>
                    {work.title || "Untitled Project"}
                  </div>
                  {work.desc && (
                    <div style={{
                      fontSize: "11.5px",
                      color: "rgba(255,255,255,0.58)",
                      lineHeight: 1.5,
                      fontWeight: 400,
                      fontFamily: "'Instrument Sans',sans-serif",
                      maxHeight: isHov ? "52px" : "0px",
                      opacity: isHov ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.4s",
                    }}>
                      {work.desc}
                    </div>
                  )}
                  {work.tags && work.tags.length > 0 && (
                    <div style={{
                      display: "flex", gap: "5px", flexWrap: "wrap",
                      marginTop: isHov ? "10px" : 0,
                      maxHeight: isHov ? "40px" : 0,
                      opacity: isHov ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.4s, margin 0.4s",
                    }}>
                      {work.tags.map(t => (
                        <span key={t} style={{
                          fontSize: "8.5px",
                          color: "rgba(255,255,255,0.7)",
                          background: THEME.hexA(accent, 0.22),
                          border: `1px solid ${THEME.hexA(accent, 0.35)}`,
                          borderRadius: "6px",
                          padding: "2px 7px",
                          letterSpacing: "0.04em",
                          fontFamily: "'Poppins',sans-serif",
                          fontWeight: 500,
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover CTA arrow — bottom right floating */}
                <div aria-hidden style={{
                  position: "absolute",
                  right: "20px", top: "50%",
                  transform: isHov ? "translate(0, -50%) scale(1)" : "translate(12px, -50%) scale(0.9)",
                  opacity: isHov ? 1 : 0,
                  transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                  width: "38px", height: "38px",
                  borderRadius: "50%",
                  background: "#fff",
                  color: accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 8px 22px ${THEME.hexA("#000", 0.35)}, 0 0 0 4px ${accentSoft}`,
                  zIndex: 3,
                  pointerEvents: "none",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            );
          })}

          {/* Empty slot cards as visual guide — styled to match */}
          {pastWorks.length < 3 && ( [
            "Your project here","Add a work","Coming soon"
          ].slice(0, 3 - pastWorks.length) ).map((label, i) => (
            <div key={`empty-${i}`} style={{
              flexShrink: 0, width: "264px", height: "340px", borderRadius: "20px",
              scrollSnapAlign: "start",
              background: isDark
                ? "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(148,41,69,0.04) 100%)"
                : "linear-gradient(135deg, #fff 0%, #fdf2f4 100%)",
              border: `1.5px dashed ${colors.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "12px",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: isDark ? "none" : THEME.shadow.sm,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = THEME.wine;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.transform = "none";
              }}
              onClick={() => onNavigate(user ? "editor" : "auth", "signup")}
            >
              <div style={{
                width: "52px", height: "52px", borderRadius: "16px",
                background: `linear-gradient(135deg, ${THEME.wineTint} 0%, ${THEME.hexA(THEME.plum, 0.08)} 100%)`,
                border: `1.5px dashed ${THEME.hexA(THEME.wine, 0.35)}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={THEME.wine} strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "12.5px", color: isDark ? "#eba5b6" : THEME.wine,
                  fontWeight: 600, letterSpacing: "-0.01em", fontFamily: "'Poppins',sans-serif",
                  marginBottom: 2,
                }}>{label}</div>
                <div style={{
                  fontSize: "10.5px",
                  color: colors.textMuted,
                  fontWeight: 400,
                  fontFamily: "'Instrument Sans',sans-serif",
                }}>Click to start</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator line */}
        <div style={{ padding:"0 48px", marginTop:"8px", position:"relative", zIndex:1 }}>
          <div style={{
            height:"2px",
            background: isDark ? "rgba(225,73,109,0.08)" : "rgba(148,41,69,0.07)",
            borderRadius:"2px",
            position:"relative",
            overflow: "hidden",
          }}>
            <div style={{
              position:"absolute", left:0, top:0, height:"100%", width:"22%",
              background: `linear-gradient(90deg, ${THEME.wine}, ${THEME.roseGold}, ${THEME.plum})`,
              borderRadius:"2px",
              boxShadow: `0 0 12px ${THEME.hexA(THEME.roseGold, 0.5)}`,
            }} />
          </div>
        </div>
      </section>

      {/* ── MIND MAP / GRAPH NODE ACTIVITY ─────────────────────────────────── */}
      <section className="reveal" id="mindmap-section" style={{
        padding: "80px 48px",
        background: isDark ? "rgba(20,10,15,0.6)" : "rgba(247,244,251,0.8)",
        opacity: revealedSections.has("mindmap-section") ? 1 : 0,
        transform: revealedSections.has("mindmap-section") ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: `linear-gradient(135deg, ${THEME.wine}, ${THEME.roseGold})`,
                boxShadow: `0 0 12px ${THEME.hexA(THEME.wine, 0.6)}`,
                animation: "glow 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: THEME.wine, fontFamily: "'Poppins',sans-serif" }}>
                Live Activity Graph
              </span>
            </div>
            <h2 style={{
              fontFamily: "Syne,sans-serif", fontSize: "clamp(28px,4vw,48px)",
              fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1,
              color: colors.text, margin: 0,
            }}>
              Your projects,<br />
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

      {/* ── BENTO GRID TOOLS SECTION ─────────────────────────────────────── */}
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
              From a cinematic edit to a full brand deck — Creatify handles every format your ideas demand.
            </p>
          </div>

          {/* Bento Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gridTemplateRows:"repeat(2, 200px)", gap:"14px" }}>
            {tools.map(tool => {
              const isHovered = hoveredCard === tool.id;
              return (
                <div
                  key={tool.id}
                  onMouseEnter={() => { setHoveredCard(tool.id); setCursorHovered(true); }}
                  onMouseLeave={() => { setHoveredCard(null); setCursorHovered(false); }}
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
                    boxShadow: isHovered ? `0 22px 52px ${tool.color}30` : "0 3px 14px rgba(148,41,69,0.07)",
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
                    <div style={{ position:"absolute", inset:0, background: cardGradients[tool.id] || `linear-gradient(135deg, #111318, ${tool.color}20)` }}>
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

                      {/* Whiteboard card decoration — sticky notes + marker lines */}
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
                        <div style={{ fontSize:"7.5px", color:"#22d3a8", fontWeight:700, marginBottom:"5px" }}>● LIVE PLAYBACK</div>
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



      {/* Features showcase */}
      <section className="reveal" id="features-section" style={{ background:colors.marqueeBg, borderBottom:`1px solid ${colors.border}`, opacity: revealedSections.has("features-section") ? 1 : 0, transform: revealedSections.has("features-section") ? "translateY(0)" : "translateY(40px)", transition:"opacity 0.7s, transform 0.7s, background 0.3s, border-color 0.3s" }}>
        <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"100px 48px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"11px", letterSpacing:"0.14em", color:"#942945", textTransform:"uppercase", marginBottom:"16px", fontWeight:500 }}>The Editor</div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,5vw,60px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1, marginBottom:"20px", color:colors.text }}>A canvas<br/>built for<br/><em style={{ fontFamily:"Instrument Serif,serif", color:"#942945" }}>flow.</em></h2>
            <p style={{ fontSize:"16px", color:colors.textMuted, lineHeight:1.7, margin:"0 0 32px", fontWeight:300 }}>Every tool is one click away. No buried menus. No learning curve. Just your ideas, amplified.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {[
                { icon:"🎨", title:"Smart layers & artboards",  desc:"Unlimited layers with blend modes and masks",      color:"#942945" },
                { icon:"⚡", title:"Real-time collaboration",   desc:"Edit with your team simultaneously",               color:"#22d3a8" },
                { icon:"📤", title:"Export anywhere",           desc:"PNG, SVG, MP4, PPTX, PDF — all from browser",     color:"#e1496d" },
              ].map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 18px", background: isDark ? "rgba(225,73,109,0.06)" : "rgba(148,41,69,0.05)", border: isDark ? "1px solid rgba(225,73,109,0.15)" : "1px solid rgba(148,41,69,0.1)", borderRadius:"12px" }}>
                  <div style={{ width:"36px", height:"36px", background:`${f.color}20`, borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{f.icon}</div>
                  <div><div style={{ fontSize:"14px", fontWeight:500, marginBottom:"2px", color:colors.text }}>{f.title}</div><div style={{ fontSize:"12px", color:colors.textMuted }}>{f.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          {/* Visual mockup */}
          <div style={{ position:"relative", aspectRatio:"4/3", borderRadius:"24px", overflow:"hidden", background:"#111318", border:"1px solid rgba(148,41,69,0.15)" }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(148,41,69,0.12), rgba(34,211,168,0.06))" }} />
            <div style={{ position:"absolute", width:"52px", top:0, bottom:0, left:0, background:"rgba(255,255,255,0.03)", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 0", gap:"8px" }}>
              {["↖","✏","▭","○","T"].map((ic,i) => <div key={i} style={{ width:"32px", height:"32px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", background:i===0?"#942945":"rgba(255,255,255,0.05)", color:i===0?"#fff":"rgba(255,255,255,0.5)" }}>{ic}</div>)}
            </div>
            <div style={{ position:"absolute", inset:0, left:"52px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:"28px", fontWeight:800, color:"rgba(255,255,255,0.06)", letterSpacing:"-0.04em" }}>CREATIFY</div>
            </div>
            <div style={{ position:"absolute", width:"120px", height:"80px", top:"20px", left:"80px", borderRadius:"12px", background:"linear-gradient(135deg,rgba(225,73,109,0.3),rgba(196,154,108,0.2))", border:"1px solid rgba(225,73,109,0.3)", animation:"float1 4s ease-in-out infinite" }} />
            <div style={{ position:"absolute", width:"80px", height:"100px", top:"40px", right:"30px", borderRadius:"12px", background:"linear-gradient(135deg,rgba(148,41,69,0.3),rgba(245,200,66,0.2))", border:"1px solid rgba(148,41,69,0.3)", animation:"float2 5s ease-in-out infinite" }} />
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

        {/* ─ Top editorial band: full-width dark */}
        <div style={{
          background: isDark ? "#0f070b" : "#1a0f14",
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
          {/* Glow */}
          <div style={{ position:"absolute", width:"500px", height:"500px", borderRadius:"50%", filter:"blur(120px)", background:"rgba(148,41,69,0.1)", top:"-100px", right:"-100px", pointerEvents:"none" }} />

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
                Creatify was born from a simple frustration — professional design tools demanded years of training and steep subscriptions. We built an entirely browser-native suite so anyone can create at a professional level, instantly.
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

        {/* ─ Bottom split: mission + principles */}
        <div style={{
          background: isDark ? "#0a0807" : "#fff",
          padding: "80px 48px",
          borderTop: `1px solid ${colors.border}`,
        }}>
          <div style={{ maxWidth:"1400px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"start" }}>

            {/* Left — Mission statement */}
            <div>
              <div style={{ fontSize:"11px", letterSpacing:"0.16em", color:"#942945", textTransform:"uppercase", fontWeight:600, marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:"20px", height:"1px", background:"#942945" }} /> Mission
              </div>
              <p style={{ fontSize:"18px", color:colors.text, lineHeight:1.75, fontWeight:300, margin:0, letterSpacing:"-0.01em" }}>
                We believe creativity is a human right, not a premium feature. Every tool in Creatify is designed to collapse the distance between an idea and a finished, professional piece of work.
              </p>
              <div style={{ marginTop:"36px", paddingTop:"36px", borderTop:`1px solid ${colors.border}` }}>
                <p style={{ fontSize:"14px", color:colors.textMuted, lineHeight:1.7, fontWeight:300, margin:0 }}>
                  From a first-time freelancer to a studio of fifty — Creatify scales with you. Everything runs in your browser. Nothing ever leaves your machine without your say.
                </p>
              </div>
            </div>

            {/* Right — Principles (clean list, no emoji boxes) */}
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



      {/* Footer CTA */}
      <section style={{ background: isDark ? "linear-gradient(135deg,#0f0809,#1a0f14)" : "linear-gradient(135deg,#fdf2f4,#f7f4f7)", padding:"100px 48px", textAlign:"center", width:"100%", position:"relative", overflow:"hidden" }}>
        {/* Glowing orb background */}
        <div style={{ position:"absolute", width:"600px", height:"600px", borderRadius:"50%", filter:"blur(120px)", background:"rgba(148,41,69,0.12)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(40px,6vw,72px)", fontWeight:800, letterSpacing:"-0.04em", color: isDark ? "#fff" : "#2d2d2d", marginBottom:"20px", lineHeight:0.95 }}>
            Ready to create<br/><em style={{ fontFamily:"Instrument Serif,serif", color:"#942945", fontWeight:400 }}>something great?</em>
          </h2>
          <p style={{ fontSize:"16px", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(45,45,45,0.65)", marginBottom:"44px", fontWeight:300, maxWidth:"420px", margin:"0 auto 44px", lineHeight:1.6 }}>Join millions of creators. Free forever, no credit card required.</p>
          <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
            <button style={{ background:"linear-gradient(135deg,#942945,#e1496d)", color:"#fff", border:"none", padding:"18px 48px", borderRadius:"50px", fontSize:"17px", fontFamily:"'Poppins',sans-serif", fontWeight:400, cursor:"pointer", transition:"all 0.3s", boxShadow:"0 8px 40px rgba(148,41,69,0.5)", letterSpacing:"-0.02em" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 16px 60px rgba(148,41,69,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 40px rgba(148,41,69,0.5)"; }}
              onClick={() => onNavigate("auth","signup")}>Start for free</button>
            <button style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.8)", border:"1px solid rgba(255,255,255,0.12)", padding:"18px 36px", borderRadius:"50px", fontSize:"17px", fontFamily:"'Poppins',sans-serif", fontWeight:300, cursor:"pointer", transition:"all 0.3s", backdropFilter:"blur(8px)", letterSpacing:"-0.02em" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; }}
              onClick={() => onNavigate("auth","signin")}>Sign in instead</button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer style={{ background:"#111", padding:"36px 48px", borderTop:"1px solid rgba(255,255,255,0.05)", width:"100%" }}>
        <div style={{ maxWidth:"1400px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"24px", height:"24px", borderRadius:"6px", background:"linear-gradient(135deg,#942945,#e1496d)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8 L8 2 L13 8 L8 14 Z" fill="white" opacity="0.9"/><circle cx="8" cy="8" r="2" fill="white"/></svg>
            </div>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"16px", color:"#fff", letterSpacing:"-0.03em" }}>Creat<span style={{ color:"#e1496d" }}>ify</span></div>
          </div>
          <div style={{ display:"flex", gap:"32px" }}>
            {["Privacy","Terms","Support","Blog"].map(l => <a key={l} href="#" style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.7)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.3)"}>{l}</a>)}
          </div>
          <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.25)" }}>© 2025 Creatify Inc. All rights reserved.</div>
        </div>
      </footer>

          </>
        )}
      </main>

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
