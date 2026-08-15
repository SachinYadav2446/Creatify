import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { 
  ArrowLeft, Camera, RotateCw, Sun, Moon, 
  Download, Upload, Sliders, Sparkles, Image as ImageIcon, Box
} from "lucide-react";

export default function MockupStudio({ onBack, user, onNavigate }) {
  const mountRef = useRef(null);
  const [activeModel, setActiveModel] = useState("iphone"); // "iphone", "macbook", "can", "glassCard"
  const [activeLighting, setActiveLighting] = useState("cyber"); // "cyber", "studio", "sunset", "noir"
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.8);
  const [bgColor, setBgColor] = useState("#0b0409");
  const [uploadedTexture, setUploadedTexture] = useState(null);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);
  const screenMeshRef = useRef(null);
  const lightsRef = useRef({});

  // ── Three.js Scene Setup ──
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe1496d, 2.0);
    dirLight1.position.set(5, 5, 4);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    lightsRef.current = { ambient: ambientLight, key: dirLight1, fill: dirLight2 };

    // Model Container Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Build Initial Model
    build3DModel(activeModel, modelGroup);

    // Orbit Dragging Interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !modelGroupRef.current) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      modelGroupRef.current.rotation.y += dx * 0.008;
      modelGroupRef.current.rotation.x += dy * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      camera.position.z = Math.max(3, Math.min(12, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isAutoRotating && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      renderer.dispose();
    };
  }, [bgColor]);

  // Helper to create dynamic Screen Canvas Texture
  const createScreenTexture = (text, subtitle, bgGrad) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");

    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 1024, 2048);
    grad.addColorStop(0, bgGrad ? bgGrad[0] : "#e1496d");
    grad.addColorStop(1, bgGrad ? bgGrad[1] : "#160510");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 2048);

    // Hologram circles
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(512, 1024, 340, 0, Math.PI * 2);
    ctx.stroke();

    // Text details
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text || "CREATIFY OS", 512, 980);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "36px sans-serif";
    ctx.fillText(subtitle || "Next-Gen 3D Render", 512, 1060);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Build Geometry for 3D Models
  const build3DModel = (type, group) => {
    // Clear old children
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const matMetallic = new THREE.MeshStandardMaterial({
      color: 0x1f1b24,
      metalness: metalness,
      roughness: roughness,
    });

    if (type === "iphone") {
      // Body
      const bodyGeo = new THREE.BoxGeometry(2.1, 4.2, 0.22);
      const body = new THREE.Mesh(bodyGeo, matMetallic);
      group.add(body);

      // Glass Screen
      const screenGeo = new THREE.PlaneGeometry(1.95, 4.05);
      const screenTex = createScreenTexture("iPhone 16 Pro", "Spatial Canvas Screen", ["#e1496d", "#0e060b"]);
      const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.z = 0.115;
      group.add(screen);
      screenMeshRef.current = screen;

      // Camera Bump
      const camBumpGeo = new THREE.BoxGeometry(0.8, 0.8, 0.08);
      const camBump = new THREE.Mesh(camBumpGeo, matMetallic);
      camBump.position.set(-0.5, 1.5, -0.15);
      group.add(camBump);

    } else if (type === "can") {
      // Beverage Can Cylinder
      const canGeo = new THREE.CylinderGeometry(1.1, 1.1, 3.6, 64);
      const canTex = createScreenTexture("ELIXIR ENERGY", "Zero Sugar • Carbonated", ["#ff8da7", "#942945"]);
      const canMat = new THREE.MeshStandardMaterial({
        map: canTex,
        metalness: 0.9,
        roughness: 0.15,
      });
      const can = new THREE.Mesh(canGeo, canMat);
      group.add(can);

      // Top & bottom caps
      const capGeo = new THREE.CylinderGeometry(1.05, 1.1, 0.2, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 });
      const topCap = new THREE.Mesh(capGeo, capMat);
      topCap.position.y = 1.85;
      group.add(topCap);

    } else if (type === "glassCard") {
      // Floating Glass Card Slab
      const cardGeo = new THREE.BoxGeometry(3.6, 2.2, 0.08);
      const cardTex = createScreenTexture("TITANIUM BLACK", "Verified Creator Pass", ["#1f2937", "#111827"]);
      const cardMat = new THREE.MeshPhysicalMaterial({
        map: cardTex,
        transmission: 0.6,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        metalness: 0.4,
        ior: 1.5,
      });
      const card = new THREE.Mesh(cardGeo, cardMat);
      group.add(card);

    } else if (type === "macbook") {
      // Base
      const baseGeo = new THREE.BoxGeometry(4.2, 0.14, 2.8);
      const base = new THREE.Mesh(baseGeo, matMetallic);
      base.position.y = -0.8;
      group.add(base);

      // Screen Lid angled back
      const lidGeo = new THREE.BoxGeometry(4.2, 2.8, 0.08);
      const lid = new THREE.Mesh(lidGeo, matMetallic);
      lid.position.set(0, 0.6, -1.35);
      lid.rotation.x = -Math.PI / 10;
      group.add(lid);

      // Display Screen
      const displayGeo = new THREE.PlaneGeometry(3.9, 2.5);
      const displayTex = createScreenTexture("MacBook Pro M3", "Liquid Retina XDR Display", ["#38bdf8", "#030712"]);
      const displayMat = new THREE.MeshBasicMaterial({ map: displayTex });
      const display = new THREE.Mesh(displayGeo, displayMat);
      display.position.set(0, 0.6, -1.3);
      display.rotation.x = -Math.PI / 10;
      group.add(display);
    }
  };

  // Switch Model
  const handleModelChange = (model) => {
    setActiveModel(model);
    if (modelGroupRef.current) {
      build3DModel(model, modelGroupRef.current);
    }
  };

  // Switch Lighting
  const handleLightingChange = (lightPreset) => {
    setActiveLighting(lightPreset);
    if (!lightsRef.current.key) return;

    if (lightPreset === "cyber") {
      lightsRef.current.key.color.setHex(0xe1496d);
      lightsRef.current.fill.color.setHex(0x38bdf8);
      setBgColor("#0b0409");
    } else if (lightPreset === "sunset") {
      lightsRef.current.key.color.setHex(0xfbbf24);
      lightsRef.current.fill.color.setHex(0xe1496d);
      setBgColor("#140905");
    } else if (lightPreset === "studio") {
      lightsRef.current.key.color.setHex(0xffffff);
      lightsRef.current.fill.color.setHex(0xe5e7eb);
      setBgColor("#121214");
    } else if (lightPreset === "noir") {
      lightsRef.current.key.color.setHex(0x888888);
      lightsRef.current.fill.color.setHex(0x222222);
      setBgColor("#050505");
    }
  };

  // Snapshot Capture & Download
  const takeSnapshot = () => {
    if (!rendererRef.current || !sceneRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `creatify_${activeModel}_3d_mockup.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div style={{
      height: "100vh", width: "100vw", overflow: "hidden",
      background: bgColor, color: "#f3f4f6",
      fontFamily: "'Instrument Sans', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      
      {/* Top Bar Header */}
      <header style={{
        height: 56, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(225, 73, 109, 0.2)",
        background: "rgba(14, 6, 11, 0.85)", backdropFilter: "blur(12px)",
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(225, 73, 109, 0.12)", border: "1px solid rgba(225, 73, 109, 0.3)",
              color: "#ff8da7", borderRadius: 8, padding: "6px 12px",
              cursor: "pointer", fontSize: 12.5, fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>
                3D Device & Packaging Mockup Studio
              </span>
              <span style={{
                fontSize: 9.5, padding: "2px 8px", borderRadius: 99,
                background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.4)", fontWeight: 700,
              }}>
                WEBGL 3D VIEWPORT
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setIsAutoRotating(r => !r)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: isAutoRotating ? "rgba(225,73,109,0.2)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${isAutoRotating ? "#e1496d" : "rgba(255,255,255,0.12)"}`,
              color: isAutoRotating ? "#ff8da7" : "rgba(255,255,255,0.7)",
              borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCw size={13} /> {isAutoRotating ? "Auto-Rotate ON" : "Auto-Rotate OFF"}
          </button>

          <button
            onClick={takeSnapshot}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #e1496d, #942945)",
              border: "none", color: "#fff", borderRadius: 8, padding: "6px 18px",
              fontSize: 12.5, fontWeight: 700, fontFamily: "Syne, sans-serif",
              cursor: "pointer", boxShadow: "0 4px 16px rgba(225,73,109,0.4)",
            }}
          >
            <Camera size={14} />
            Capture 4K Snapshot
          </button>
        </div>
      </header>

      {/* Main Studio View */}
      <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
        
        {/* Left Controls Sidebar */}
        <aside style={{
          width: 300, background: "rgba(14, 6, 11, 0.8)", backdropFilter: "blur(16px)",
          borderRight: "1px solid rgba(225, 73, 109, 0.2)",
          padding: 24, display: "flex", flexDirection: "column", gap: 24, zIndex: 10,
          overflowY: "auto",
        }}>
          
          {/* Model Selector */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#ff8da7", textTransform: "uppercase", marginBottom: 10 }}>
              Select 3D Stage Model
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { id: "iphone", label: "iPhone 16 Pro" },
                { id: "macbook", label: "MacBook M3" },
                { id: "can", label: "Beverage Can" },
                { id: "glassCard", label: "Glass Slab" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id)}
                  style={{
                    padding: "10px 8px", borderRadius: 10,
                    background: activeModel === m.id ? "linear-gradient(135deg, #e1496d, #942945)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${activeModel === m.id ? "#e1496d" : "rgba(255,255,255,0.08)"}`,
                    color: activeModel === m.id ? "#fff" : "rgba(255,255,255,0.6)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lighting Environment */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#ff8da7", textTransform: "uppercase", marginBottom: 10 }}>
              Lighting Environment
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { id: "cyber", label: "Cyber Neon" },
                { id: "sunset", label: "Sunset Gold" },
                { id: "studio", label: "Studio Soft" },
                { id: "noir", label: "Obsidian Noir" },
              ].map(l => (
                <button
                  key={l.id}
                  onClick={() => handleLightingChange(l.id)}
                  style={{
                    padding: "8px", borderRadius: 8,
                    background: activeLighting === l.id ? "rgba(225,73,109,0.25)" : "rgba(0,0,0,0.3)",
                    border: `1px solid ${activeLighting === l.id ? "#e1496d" : "rgba(255,255,255,0.06)"}`,
                    color: activeLighting === l.id ? "#ff8da7" : "rgba(255,255,255,0.5)",
                    fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Material Sliders */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#ff8da7", textTransform: "uppercase", marginBottom: 10 }}>
              Surface Material Properties
            </label>
            
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                <span>Metalness</span>
                <span>{Math.round(metalness * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={metalness}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMetalness(val);
                  if (modelGroupRef.current) build3DModel(activeModel, modelGroupRef.current);
                }}
                style={{ width: "100%", accentColor: "#e1496d" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                <span>Roughness</span>
                <span>{Math.round(roughness * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={roughness}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setRoughness(val);
                  if (modelGroupRef.current) build3DModel(activeModel, modelGroupRef.current);
                }}
                style={{ width: "100%", accentColor: "#e1496d" }}
              />
            </div>
          </div>

          {/* Drag instructions */}
          <div style={{ marginTop: "auto", padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              🎮 3D Navigation Tips
            </div>
            <p style={{ margin: 0, fontSize: 10.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
              • Click and drag anywhere in the 3D viewport to orbit around the object.<br/>
              • Scroll mouse wheel to zoom in and out.
            </p>
          </div>

        </aside>

        {/* 3D WebGL Canvas Mount */}
        <div
          ref={mountRef}
          style={{ flex: 1, width: "100%", height: "100%", cursor: "grab" }}
        />
      </div>

    </div>
  );
}
