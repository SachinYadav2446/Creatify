import { useState, useEffect, useRef } from "react";
import THEME from "../theme";

// Import generated preview images
import videoPrev  from "../assets/images/video_preview.png";
import pptPrev    from "../assets/images/ppt_preview.png";
import socialPrev from "../assets/images/social_preview.png";
import imagePrev  from "../assets/images/image_preview.png";
import aiPrev     from "../assets/images/ai_preview.png";

export default function HomePage({ onNavigate, user, onSignOut, theme = "light" }) {
  const [hoveredCard, setHoveredCard]         = useState(null);
  const [mousePosition, setMousePosition]     = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered]     = useState(false);
  const [revealedSections, setRevealedSections] = useState(new Set());
  const [animatedStats, setAnimatedStats]     = useState(new Set());
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeNav, setActiveNav]             = useState("home");
  const [navScrolled, setNavScrolled]         = useState(false);

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
        accent: "#942945",
        gradient: "linear-gradient(135deg, #23141b 0%, #3a0c19 50%, #1a0f14 100%)",
        image: videoPrev,
        tags: ["4K UHD", "LUTs", "15s"],
        desc: "Cinematic intro sequence with warm amber color LUTs and smooth title transitions.",
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
        accent: "#7c233c",
        gradient: "linear-gradient(135deg, #111827 0%, #1f2937 50%, #030712 100%)",
        image: pptPrev,
        tags: ["10 Slides", "Vector", "Pitch"],
        desc: "Modern corporate pitch deck layout with minimalist vector grid alignment.",
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

  // Stats counter
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats.has("stats")) {
          setAnimatedStats(s => new Set([...s, "stats"]));
          const nums = entry.target.querySelectorAll(".stat-num");
          [[12000000,"+"],[3800000,""],[500000,"+"],[180,"+"]].forEach(([t,s],i) => animateCount(nums[i],t,s));
        }
      });
    }, { threshold: 0.3 });
    const el = document.querySelector(".stats-inner");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [animatedStats]);

  const animateCount = (el, target, suffix) => {
    if (!el) return;
    const dur = 1800, start = performance.now();
    const isM = target >= 1e6, isK = target >= 1000 && !isM;
    const disp = isM ? target / 1e6 : isK ? target / 1000 : target;
    const step = ts => {
      const p = Math.min((ts - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (disp * ease).toFixed(1) + (isM ? "M" : isK ? "K" : "") + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = disp.toFixed(1) + (isM ? "M" : isK ? "K" : "") + suffix;
    };
    requestAnimationFrame(step);
  };

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
  // Grid: 4 columns. Video=2×2, Image=1×1, Logo=1×1, PPT=2×1, Social=2×2, Doc=2×1, Print=2×1
  const tools = [
    { id:"video",  name:"Video Editor",    desc:"Full multi-track timeline with WebGL color grading, audio mixing & in-browser rendering. No uploads needed.", icon:"🎬", color:"#942945",  tag:"WebGL · WASM",       colSpan:2, rowSpan:2, image: videoPrev  },
    { id:"image",  name:"Image Editor",    desc:"Layers, masks, filters, blend modes. Pro-grade photo editing in your browser.",                               icon:"🖼️", color:"#e1496d",  tag:"Canvas API",          colSpan:1, rowSpan:1, image: imagePrev  },
    { id:"logo",   name:"Logo Maker",      desc:"Vector-based logo studio. AI suggestions, custom icons, SVG export.",                                         icon:"✦",  color:"#ec4899",  tag:"SVG · AI-assisted",   colSpan:1, rowSpan:1, image: null       },
    { id:"ai",     name:"AI Magic Studio", desc:"AI-powered background removal, prompt-based generative artwork styles, and smart resizing tools.",            icon:"✨",  color:"#a855f7",  tag:"AI · Canvas API",     colSpan:2, rowSpan:1, image: aiPrev      },
    { id:"ppt",    name:"Presentations",   desc:"Slides that animate. Real-time collaboration, 500+ templates, one-click export.",                             icon:"📊", color:"#7c233c",  tag:"PPTX · PDF · HTML5",  colSpan:2, rowSpan:1, image: pptPrev    },
    { id:"social", name:"Social Studio",   desc:"All platform sizes at once. Schedule and auto-publish when you're done.",                                     icon:"📱", color:"#dd728b",  tag:"Stories · Reels",     colSpan:2, rowSpan:2, image: socialPrev },
    { id:"doc",    name:"Documents",       desc:"Rich docs with embedded media, tables, charts. Beautiful by default.",                                        icon:"📄", color:"#eba5b6",  tag:"DOCX · PDF",          colSpan:2, rowSpan:1, image: null       },
    { id:"print",  name:"Print Design",    desc:"Flyers, posters, business cards. CMYK-ready, bleed lines included.",                                          icon:"🖨️", color:"#942945",  tag:"Print-ready PDF",     colSpan:4, rowSpan:1, image: null       },
  ];

  const pricing = [
    { name:"Free",  price:0,  period:"forever free",              popular:false, features:["5 active projects","Basic templates","2GB storage","Export PNG & PDF","Community support"] },
    { name:"Pro",   price:16, period:"per month, billed annually", popular:true,  features:["Unlimited projects","500K+ premium templates","100GB storage","All export formats","AI design tools","Brand kit","Priority support"] },
    { name:"Team",  price:42, period:"per month, up to 5 seats",  popular:false, features:["Everything in Pro","Real-time collaboration","Shared brand assets","Admin controls","1TB storage","Dedicated support"] },
  ];

  // ── Gradient fallbacks for cards without images ──────────────────────────
  const cardGradients = {
    logo:  "linear-gradient(135deg, #1a0f14 0%, #3a0c19 40%, #ec489920 100%)",
    ai:    "linear-gradient(135deg, #180825 0%, #3a0e5b 50%, #a855f720 100%)",
    doc:   "linear-gradient(135deg, #170b11 0%, #23141b 50%, #eba5b620 100%)",
    print: "linear-gradient(135deg, #1a0f14 0%, #3a0c19 50%, #94294530 100%)",
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

  const sidebarW = 72;
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

  const SidebarIcon = ({ active, icon, label, onClick, crownBadge, bottom = false }) => (
    <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: bottom ? 6 : 0 }}>
      <button
        onClick={onClick}
        title={label}
        style={{
          width: 44, height: 44, borderRadius: 12, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: active ? THEME.wineTint : "transparent",
          border: active
            ? `1px solid ${THEME.hexA(THEME.wine, 0.35)}`
            : "1px solid transparent",
          color: active ? THEME.wine : THEME.text,
          cursor: "pointer", transition: "all 0.2s", outline: "none", position: "relative",
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = THEME.wineTint;
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {icon}
        {crownBadge && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            background: THEME.grad.gold,
            width: 14, height: 14, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}>👑</div>
        )}
      </button>
      <span style={{
        fontSize: 9.5, marginTop: 3, color: active ? THEME.wine : THEME.textMuted,
        fontFamily: "'Poppins',sans-serif", fontWeight: active ? 600 : 400, letterSpacing: "-0.01em",
      }}>{label}</span>
    </div>
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
          {isCrown && <div style={{ position: "absolute", top: -4, right: -4, fontSize: 14 }}>👑</div>}
        </div>
        <span style={{
          fontSize: 11.5, color: isDark ? "rgba(245,240,232,0.78)" : "rgba(45,45,45,0.82)",
          fontFamily: "'Poppins',sans-serif", fontWeight: 400, whiteSpace: "nowrap",
        }}>{label}</span>
      </button>
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
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Instrument+Sans:wght@300;400;500;600&family=Syne:wght@700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />

      {/* ═══════════════ CANVA-STYLE VERTICAL SIDEBAR ═══════════════ */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: sidebarW,
        background: THEME.grad.sidebar,
        borderRight: `1px solid ${THEME.borderSoft}`,
        zIndex: 200,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "14px 0 12px",
        boxShadow: "2px 0 20px rgba(148,41,69,0.05)",
      }}>
        {/* Logo icon (top) */}
        <div
          style={{ cursor: "pointer", marginBottom: 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Creatify Home"
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: THEME.grad.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: THEME.shadow.sm,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8 L8 2 L13 8 L8 14 Z" fill="white" opacity="0.95"/>
              <circle cx="8" cy="8" r="2" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Create button (big +) */}
        <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 12 }}>
          <button
            title="Create a new design"
            onClick={() => onNavigate(user ? "editor" : "auth", "signup")}
            style={{
              width: 48, height: 48, borderRadius: 16,
              background: THEME.grad.primary,
              border: "none", color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 300, outline: "none",
              boxShadow: "0 4px 14px rgba(148,41,69,0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px) scale(1.04)"; e.currentTarget.style.filter = "brightness(1.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "none"; }}
          >＋</button>
          <span style={{
            fontSize: 10, marginTop: 4, color: THEME.wine,
            fontFamily: "'Poppins',sans-serif", fontWeight: 600, letterSpacing: "-0.01em",
          }}>Create</span>
        </div>

        <div style={{ width: "70%", height: 1, background: THEME.hexA(THEME.wine, 0.12), margin: "4px 0 10px" }} />

        {/* Nav stack */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
          <SidebarIcon active={activeNav === "home"} label="Home" onClick={() => { setActiveNav("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 7v11h-6v-7H9v7H3V10z"/></svg>} />
          <SidebarIcon active={activeNav === "projects"} label="Projects" onClick={() => { setActiveNav("projects"); scrollTo("past-work-section", "projects"); }}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>} />
          <SidebarIcon active={activeNav === "templates"} label="Templates" onClick={() => { setActiveNav("templates"); scrollTo("tools-section", "templates"); }}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>} />
          <SidebarIcon active={activeNav === "brand"} label="Brand" crownBadge onClick={() => setActiveNav("brand")}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>} />
          <SidebarIcon active={activeNav === "ai"} label="Canva AI" onClick={() => { setActiveNav("ai"); onNavigate(user ? "ai_magic" : "auth", "signup"); }}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>} />
          <SidebarIcon active={activeNav === "more"} label="More" onClick={() => setActiveNav("more")}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>} />
        </div>

        {/* Bottom icons: notifications, avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <button
            onClick={() => onNavigate("profile")}
            title="Profile & settings"
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: THEME.wineTint,
              border: `1px solid ${THEME.hexA(THEME.wine, 0.2)}`,
              color: THEME.wine, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", outline: "none", fontSize: 18,
            }}
          >🔔</button>

          {/* Avatar (bottom) */}
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
      </aside>

      {/* ═══════════════ MAIN CONTENT (right of sidebar) ═══════════════ */}
      <main style={{ marginLeft: sidebarW, width: `calc(100% - ${sidebarW}px)`, position: "relative", overflow: "hidden" }}>

        {/* ═══════════════ PLAIN HERO SECTION WITH HEADING ═══════════════ */}
        <section style={{
          position: "relative", padding: "80px 48px 60px",
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
                What will you design today?
              </h1>
            </div>
          </div>
        </section>

      {/* Marquee */}
      <div style={{ padding:"28px 0", borderTop:`1px solid ${colors.border}`, borderBottom:`1px solid ${colors.border}`, overflow:"hidden", background:colors.marqueeBg, transition:"background 0.3s, border-color 0.3s" }}>
        <div style={{ display:"flex", whiteSpace:"nowrap", animation:"marquee 25s linear infinite" }}>
          {[...Array(2)].flatMap(() => ["Video Editor","Logo Maker","Presentations","Social Media","Brand Kit","Print Design","Documents","Mockups","Infographics"].map((item,i) => (
            <span key={item+i} style={{ display:"inline-flex", alignItems:"center", gap:"12px", padding:"0 40px", fontSize:"12px", color:colors.textMuted, letterSpacing:"0.06em", textTransform:"uppercase", fontWeight:500 }}>
              <span style={{ width:"4px", height:"4px", background:"#942945", borderRadius:"50%", flexShrink:0 }} />{item}
            </span>
          )))}
        </div>
      </div>

      {/* ── PAST WORK — Horizontal Scrollable Showcase ── */}
      <section className="reveal" id="past-work-section" style={{
        padding: "96px 0 80px",
        background: isDark ? "#1a0f14" : "#f7f4f7",
        opacity: revealedSections.has("past-work-section") ? 1 : 0,
        transform: revealedSections.has("past-work-section") ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s, transform 0.7s",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ padding: "0 48px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#942945", textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }}>Made with Creatify</div>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: colors.text, margin: 0 }}>
              Past Work.
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <p style={{ fontSize: "14px", color: colors.textMuted, maxWidth: "320px", lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
              Projects crafted across every tool in the suite.
            </p>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              {[{ dir: -1, icon: "←" }, { dir: 1, icon: "→" }].map(({ dir, icon }) => (
                <button key={dir}
                  onClick={() => pastWorkScrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" })}
                  style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: "transparent",
                    border: `1px solid ${colors.border}`,
                    color: colors.textMuted, fontSize: "16px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", outline: "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#942945"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#942945"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = colors.textMuted; e.currentTarget.style.borderColor = colors.border; }}
                >{icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll rail */}
        <div
          ref={pastWorkScrollRef}
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "4px 48px 24px",
            cursor: "grab",
          }}
          onMouseDown={e => { e.currentTarget.dataset.down = "1"; e.currentTarget.dataset.startX = e.pageX; e.currentTarget.dataset.scrollLeft = e.currentTarget.scrollLeft; e.currentTarget.style.cursor = "grabbing"; }}
          onMouseMove={e => { if (!e.currentTarget.dataset.down || e.currentTarget.dataset.down !== "1") return; e.currentTarget.scrollLeft = parseInt(e.currentTarget.dataset.scrollLeft) - (e.pageX - parseInt(e.currentTarget.dataset.startX)); }}
          onMouseUp={e => { e.currentTarget.dataset.down = "0"; e.currentTarget.style.cursor = "grab"; }}
          onMouseLeave={e => { e.currentTarget.dataset.down = "0"; e.currentTarget.style.cursor = "grab"; }}
        >
          {/* ──────────────────────────────────────────────────────────────────────
            ADD YOUR WORK HERE.
            Each item in this array becomes one card. Fill in:
              title    — project name
              category — short label shown top-left (e.g. "Video Edit")
              tool     — which Creatify tool was used
              year     — "2024"
              accent   — hex colour for glow / badge
              gradient — card background (CSS gradient string)
              image    — optional image URL; if empty, icon is shown instead
              icon     — emoji fallback when no image
              tags     — array of short feature strings
              desc     — one-sentence description (shown on hover)
          ────────────────────────────────────────────────────────────────────── */}
          {pastWorks.map((work, i) => {
            const isHov = hoveredWork === i;
            return (
              <div key={work.id || i}
                onMouseEnter={() => setHoveredWork(i)}
                onMouseLeave={() => setHoveredWork(null)}
                onClick={() => {
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
                  width: "240px",
                  height: "300px",
                  borderRadius: "16px",
                  scrollSnapAlign: "start",
                  position: "relative",
                  overflow: "hidden",
                  background: work.gradient || "linear-gradient(135deg,#170b11,#1a0f14)",
                  border: isHov ? `1px solid ${work.accent || "#942945"}55` : `1px solid ${colors.border}`,
                  cursor: "pointer",
                  transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s",
                  transform: isHov ? "translateY(-4px) scale(1.01)" : "none",
                  boxShadow: isHov ? `0 16px 40px ${(work.accent||"#942945")}20` : "0 4px 15px rgba(0,0,0,0.15)",
                  userSelect: "none",
                }}
              >
                {/* Delete button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePastWork(work.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 15,
                    fontSize: "11px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#ef4444";
                    e.currentTarget.style.borderColor = "#ef4444";
                    e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.background = "rgba(0,0,0,0.6)";
                  }}
                  title="Delete Project"
                >
                  ✕
                </button>

                {/* Accent orb */}
                <div style={{ position:"absolute", width:"120px", height:"120px", borderRadius:"50%", filter:"blur(40px)", background:(work.accent||"#942945")+"2a", top:"-30px", right:"-30px", opacity: isHov ? 1 : 0.5, transition:"opacity 0.4s", pointerEvents:"none" }} />

                {/* Image or icon */}
                {work.image ? (
                  <img src={work.image} alt={work.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity: isHov ? 0.5 : 0.3, transition:"opacity 0.4s" }} />
                ) : (
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:`translate(-50%,-50%) scale(${isHov?0.8:1})`, fontSize:"44px", opacity: isHov ? 0.07 : 0.13, transition:"all 0.4s", pointerEvents:"none", userSelect:"none" }}>{work.icon || "🎬"}</div>
                )}

                {/* Top bar */}
                <div style={{ position:"absolute", top:"14px", left:"14px", right:"14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:"9px", color: work.accent||"#e1496d", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", background:(work.accent||"#942945")+"1a", border:`1px solid ${(work.accent||"#942945")}33`, borderRadius:"30px", padding:"2px 8px" }}>
                    {work.category || "Project"}
                  </div>
                  <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.25)", fontWeight:400 }}>{work.year || ""}</div>
                </div>

                {/* Bottom panel */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 14px", background:"linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)", transform: isHov ? "none" : "translateY(2px)", opacity: isHov ? 1 : 0.95, transition:"all 0.4s" }}>
                  {work.tool && (
                    <div style={{ fontSize:"8px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color: work.accent||"#e1496d", marginBottom:"4px", opacity:0.8 }}>{work.tool}</div>
                  )}
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:"14px", fontWeight:800, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.2, marginBottom: isHov && work.desc ? "6px" : 0 }}>
                    {work.title || "Untitled Project"}
                  </div>
                  {work.desc && (
                    <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)", lineHeight:1.45, fontWeight:300, maxHeight: isHov ? "42px" : "0px", overflow:"hidden", transition:"max-height 0.4s" }}>
                      {work.desc}
                    </div>
                  )}
                  {work.tags && work.tags.length > 0 && (
                    <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginTop: isHov ? "8px" : 0, maxHeight: isHov ? "36px" : 0, overflow:"hidden", transition:"max-height 0.4s" }}>
                      {work.tags.map(t => (
                        <span key={t} style={{ fontSize:"8px", color:"rgba(255,255,255,0.35)", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"3px", padding:"1px 5px", letterSpacing:"0.04em" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Always-visible empty slot as a visual guide when no work added yet */}
          {pastWorks.length < 3 && ( [
            "Your project here","Add a work","Coming soon"
          ].slice(0, 3 - pastWorks.length) ).map((label, i) => (
            <div key={`empty-${i}`} style={{
              flexShrink: 0, width: "240px", height: "300px", borderRadius: "16px",
              scrollSnapAlign: "start",
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.025)",
              border: `1.5px dashed ${colors.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "10px",
            }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%", border:`1.5px dashed ${colors.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke={isDark?"rgba(225,73,109,0.25)":"rgba(148,41,69,0.2)"} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ fontSize:"11px", color: isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.2)", fontWeight:400, letterSpacing:"0.04em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator line */}
        <div style={{ padding:"0 48px", marginTop:"8px" }}>
          <div style={{ height:"1px", background: isDark ? "rgba(225,73,109,0.08)" : "rgba(148,41,69,0.07)", borderRadius:"1px", position:"relative" }}>
            <div style={{ position:"absolute", left:0, top:0, height:"100%", width:"18%", background: "linear-gradient(90deg,#942945,#e1496d)", borderRadius:"1px" }} />
          </div>
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
              <div style={{ fontSize:"11px", letterSpacing:"0.14em", color:"#942945", textTransform:"uppercase", marginBottom:"14px", fontWeight:500 }}>Everything you need</div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,5vw,60px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1, color:colors.text }}>One studio.<br/>All formats.</h2>
            </div>
            <p style={{ fontSize:"16px", color:colors.textMuted, maxWidth:"440px", lineHeight:1.65, fontWeight:300 }}>
              From a quick social post to a full brand identity — Creatify handles every format your ideas demand.
            </p>
          </div>

          {/* Bento Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gridTemplateRows:"repeat(5, 200px)", gap:"16px" }}>
            {tools.map(tool => {
              const isHovered = hoveredCard === tool.id;
              return (
                <div
                  key={tool.id}
                  onMouseEnter={() => { setHoveredCard(tool.id); setCursorHovered(true); }}
                  onMouseLeave={() => { setHoveredCard(null); setCursorHovered(false); }}
                  onClick={() => {
                    if (tool.id === "video") onNavigate("editor");
                    else if (tool.id === "ppt") onNavigate("presentation");
                    else if (tool.id === "image") onNavigate("image_editor");
                    else if (tool.id === "logo") onNavigate("logo_maker");
                    else if (tool.id === "social") onNavigate("social_studio");
                    else if (tool.id === "doc") onNavigate("documents");
                    else if (tool.id === "print") onNavigate("print_design");
                    else if (tool.id === "ai") onNavigate("ai_magic");
                    else onNavigate("auth", "signup");
                  }}
                  style={{
                    gridColumn: `span ${tool.colSpan}`,
                    gridRow:    `span ${tool.rowSpan}`,
                    position:"relative", borderRadius:"24px", overflow:"hidden",
                    cursor:"pointer", transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    transform: isHovered ? "translateY(-4px) scale(1.01)" : "none",
                    boxShadow: isHovered ? `0 28px 70px ${tool.color}30` : "0 4px 20px rgba(148,41,69,0.08)",
                    border: `1px solid ${isHovered ? tool.color + "60" : "rgba(148,41,69,0.15)"}`,
                  }}
                >
                  {/* Background: image or gradient */}
                  {tool.image ? (
                    <div style={{ position:"absolute", inset:0 }}>
                      <img src={tool.image} alt={tool.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }} />
                      {/* Dark overlay that lightens on hover */}
                      <div style={{ position:"absolute", inset:0, background: isHovered ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.62)", transition:"background 0.4s" }} />
                    </div>
                  ) : (
                    <div style={{ position:"absolute", inset:0, background: cardGradients[tool.id] || `linear-gradient(135deg, #111318, ${tool.color}20)` }}>
                      {/* Subtle pattern for no-image cards */}
                      <div style={{ position:"absolute", inset:0, opacity:0.06, backgroundImage:`radial-gradient(${tool.color} 1px, transparent 1px)`, backgroundSize:"28px 28px" }} />
                    </div>
                  )}

                  {/* Accent glow on hover */}
                  <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 30% 20%, ${tool.color}25, transparent 60%)`, opacity: isHovered ? 1 : 0, transition:"opacity 0.4s", pointerEvents:"none" }} />

                  {/* Content */}
                  <div style={{ position:"relative", zIndex:2, padding:"28px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                    {/* Tag chip */}
                    <div style={{ alignSelf:"flex-start", background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"20px", padding:"3px 12px", fontSize:"10px", color:"rgba(255,255,255,0.8)", letterSpacing:"0.04em", marginBottom:"auto", marginTop:"0" }}>
                      {tool.tag}
                    </div>

                    {/* Icon + name + desc */}
                    <div>
                      {/* Interactive micro-animation for logo card (no image) */}
                      {tool.id === "logo" && (
                        <div style={{ marginBottom:"14px" }}>
                          <svg width="44" height="44" viewBox="0 0 100 100" style={{ transform:`rotate(${logoAngle}deg)`, transition:"transform 0.05s linear", display:"block" }}>
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="15,10"/>
                            <polygon points="50,18 78,66 22,66" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinejoin="round"/>
                            <circle cx="50" cy="50" r="8" fill="#ec4899"/>
                          </svg>
                        </div>
                      )}



                      {/* Doc card decoration */}
                      {tool.id === "doc" && (
                        <div style={{ marginBottom:"14px", display:"flex", flexDirection:"column", gap:"4px" }}>
                          <div style={{ width:"50%", height:"5px", background:tool.color, borderRadius:"2px", opacity:0.9 }} />
                          <div style={{ width:"80%", height:"3px", background:"rgba(255,255,255,0.2)", borderRadius:"2px" }} />
                          <div style={{ width:"70%", height:"3px", background:"rgba(255,255,255,0.15)", borderRadius:"2px" }} />
                        </div>
                      )}

                      {/* Print card decoration */}
                      {tool.id === "print" && (
                        <div style={{ marginBottom:"14px" }}>
                          <div style={{ width:"56px", height:"38px", border:`1.5px dashed ${tool.color}`, borderRadius:"4px", background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ fontSize:"7px", color:tool.color, fontWeight:700, letterSpacing:"0.06em" }}>CMYK</span>
                          </div>
                        </div>
                      )}

                      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
                        <span style={{ fontSize:"22px" }}>{tool.icon}</span>
                        <span style={{ fontFamily:"Syne,sans-serif", fontSize: tool.colSpan >= 2 ? "22px" : "16px", fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>{tool.name}</span>
                      </div>
                      <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)", lineHeight:1.55, fontWeight:300, margin:0, maxWidth: tool.colSpan >= 2 ? "340px" : "none" }}>
                        {tool.desc}
                      </p>

                      {/* CTA arrow */}
                      <div style={{ marginTop:"14px", display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", color:tool.color, fontFamily:"'Poppins',sans-serif", fontWeight:400, opacity: isHovered ? 1 : 0, transform: isHovered ? "translateX(0)" : "translateX(-8px)", transition:"all 0.3s" }}>
                        <span>Open {tool.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Video playhead overlay */}
                  {tool.id === "video" && isHovered && (
                    <div style={{ position:"absolute", bottom:"100px", left:"28px", right:"28px", zIndex:3 }}>
                      <div style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", borderRadius:"10px", padding:"10px", border:"1px solid rgba(148,41,69,0.3)" }}>
                        <div style={{ fontSize:"8px", color:"#22d3a8", fontWeight:700, marginBottom:"6px" }}>● LIVE PLAYBACK</div>
                        <div style={{ position:"relative", height:"6px", background:"rgba(255,255,255,0.1)", borderRadius:"3px" }}>
                          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${timelinePlayhead}%`, background:`linear-gradient(90deg, #942945, #e1496d)`, borderRadius:"3px", transition:"width 0.05s" }} />
                          <div style={{ position:"absolute", top:"-3px", width:"12px", height:"12px", borderRadius:"50%", background:"#ef4444", boxShadow:"0 0 8px #ef4444", transition:"left 0.05s", left:`calc(${timelinePlayhead}% - 6px)` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PPT slides overlay */}
                  {tool.id === "ppt" && isHovered && (
                    <div style={{ position:"absolute", top:"24px", right:"24px", zIndex:3, display:"flex", gap:"6px" }}>
                      {[0,1,2].map(idx => {
                        const off = (idx - activeSlide + 3) % 3;
                        return (
                          <div key={idx} style={{ width:"48px", height:"32px", borderRadius:"4px", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(6px)", border:`1.5px solid rgba(255,255,255,${0.6 - off*0.2})`, opacity: 1 - off*0.3, transform:`translateY(${off*-4}px) scale(${1-off*0.06})`, transition:"all 0.4s" }}>
                            <div style={{ width:"40%", height:"3px", background:"#7c233c", borderRadius:"1px", margin:"5px 4px 3px" }} />
                            <div style={{ display:"flex", gap:"2px", alignItems:"flex-end", padding:"0 4px 4px", height:"12px" }}>
                              {[8,13,6,10].map((h,i) => <div key={i} style={{ flex:1, height:`${h}px`, background:"rgba(124,35,60,0.6)", borderRadius:"1px" }} />)}
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

      {/* Stats */}
      <div style={{ background:colors.marqueeBg, borderTop:`1px solid ${colors.border}`, borderBottom:`1px solid ${colors.border}`, padding:"64px 48px", transition:"background 0.3s, border-color 0.3s" }}>
        <div className="stats-inner reveal" id="stats-section" style={{ maxWidth:"1400px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"32px", opacity: revealedSections.has("stats-section") ? 1 : 0, transform: revealedSections.has("stats-section") ? "translateY(0)" : "translateY(40px)", transition:"opacity 0.7s, transform 0.7s" }}>
          {[
            { value:"12M+", label:"Designs created daily",    color:"#942945" },
            { value:"3.8M", label:"Active creators",          color:"#e1496d" },
            { value:"500K+",label:"Templates available",      color:"#22d3a8" },
            { value:"180+", label:"Countries represented",    color:"#dd728b" },
          ].map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div className="stat-num" style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,4vw,56px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:"14px", color:colors.textMuted, marginTop:"6px", fontWeight:300 }}>{s.label}</div>
            </div>
          ))}
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
      <section style={{ background:"linear-gradient(135deg,#1a0f0a,#2d1a0f)", padding:"100px 48px", textAlign:"center", width:"100%", position:"relative", overflow:"hidden" }}>
        {/* Glowing orb background */}
        <div style={{ position:"absolute", width:"600px", height:"600px", borderRadius:"50%", filter:"blur(120px)", background:"rgba(148,41,69,0.15)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(225,73,109,0.12)", border:"1px solid rgba(225,73,109,0.2)", borderRadius:"40px", padding:"6px 16px", fontSize:"12px", color:"#e1496d", marginBottom:"28px", letterSpacing:"0.02em" }}>
            <span style={{ width:"5px", height:"5px", background:"#22d3a8", borderRadius:"50%", display:"inline-block", animation:"pulse 2s infinite" }} />
            3.8M creators and counting
          </div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(40px,6vw,72px)", fontWeight:800, letterSpacing:"-0.04em", color:"#fff", marginBottom:"20px", lineHeight:0.95 }}>
            Ready to create<br/><em style={{ fontFamily:"Instrument Serif,serif", color:"#e1496d", fontWeight:400 }}>something great?</em>
          </h2>
          <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.45)", marginBottom:"44px", fontWeight:300, maxWidth:"420px", margin:"0 auto 44px", lineHeight:1.6 }}>Join millions of creators. Free forever, no credit card required.</p>
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

        </main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&family=Poppins:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
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
