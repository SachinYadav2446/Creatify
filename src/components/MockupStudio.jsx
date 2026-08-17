import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { 
  ArrowLeft, Camera, RotateCw, Sun, Moon, 
  Download, Upload, Sliders, Sparkles, Image as ImageIcon, Box,
  Terminal, Globe, Code, Copy, Check, RefreshCw, Layers, Monitor,
  Smartphone, Shield, Layout, Eye, Cpu, ZoomIn, ZoomOut, CheckCheck,
  Radio, Sparkle, Palette, Maximize2, FileCode, Disc, Package, Search,
  ArrowUpRight
} from "lucide-react";

export default function MockupStudio({ onBack, user, onNavigate, isEmbedded = false, isDark = false }) {
  // Navigation mode: "hub" (Overview & Stage Presets) or "studio" (3D Three.js Viewport)
  const [viewMode, setViewMode] = useState("hub");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const mountRef = useRef(null);

  // ── Active State & Models ──
  // Models: "terminal", "browser", "github_readme", "macbook", "iphone", "dual_monitor", "glass_card", "crt_monitor", "software_box"
  const [activeModel, setActiveModel] = useState("terminal");
  const [activeLighting, setActiveLighting] = useState("cyber"); // "cyber", "matrix", "studio", "monokai", "sunset", "neon_tokyo"
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showGridFloor, setShowGridFloor] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [focalLength, setFocalLength] = useState(45); // Camera FOV: 24 to 75
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.8);
  const [glassTransmission, setGlassTransmission] = useState(0.85);
  const [bgColor, setBgColor] = useState("#080206");
  const [cameraView, setCameraView] = useState("perspective");
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState("code"); // "models", "code", "presets", "studio", "export"
  
  // ── Code & File Tabs ──
  const [activeFileTab, setActiveFileTab] = useState("server.ts");
  const [codeTheme, setCodeTheme] = useState("synthwave");
  const [windowTitle, setWindowTitle] = useState("server.ts — Creatify Engine v2.4");
  const [urlBarText, setUrlBarText] = useState("https://creatify.dev/dashboard");
  const [repoTitle, setRepoTitle] = useState("creatify-engine/core-sdk");
  const [repoTagline, setRepoTagline] = useState("Next-Gen Creative Studio & Procedural Design Suite for Developers");

  // ── Pre-built Developer Code Templates ──
  const SAMPLE_CODE_SNIPPETS = {
    "server.ts": `// 🚀 High-Velocity Developer Creative Suite
import { CreatifyEngine, PBRRenderer } from "@creatify/core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, model, resolution } = await req.json();
  
  const engine = new CreatifyEngine({
    gpuAcceleration: true,
    localFirstVault: true,
    shadingMode: "dielectric-pbr",
  });

  const stream = await engine.generate3DMockup({
    rig: "terminal",
    theme: "synthwave",
    resolution: resolution || "4k",
  });

  console.log("⚡ 3D Raytraced Shader Compiled in 1.8ms");
  return NextResponse.json({ success: true, url: stream.assetUrl });
}`,
    "pipeline.rs": `// ⚡ Zero-Allocation GPU Geometry Pipeline
use creatify_core::gl_context::{Buffer, ShaderStage};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct MeshVertexLayout {
    pub position: [f32; 3],
    pub normal_vector: [f32; 3],
    pub uv_coords: [f32; 2],
}

pub fn compile_pbr_shader(device: &wgpu::Device) -> Result<wgpu::RenderPipeline, String> {
    let raw_wgsl = include_str!("../shaders/dielectric_refraction.wgsl");
    let shader_module = device.create_shader_module(wgpu::ShaderModuleDescriptor {
        label: Some("Creatify 3D PBR Kernel"),
        source: wgpu::ShaderSource::Wgsl(raw_wgsl.into()),
    });
    println!("🔥 Metalness & Roughness Shaders Initialized");
    Ok(build_pipeline(device, shader_module))
}`,
    "model.py": `# 🧠 Neural Spatial Blueprint Synthesizer
import torch
import torch.nn as nn
from creatify.pipelines import SpatialNodeGraph

class NeuralAssetCompiler(nn.Module):
    def __init__(self, latent_dim: int = 1024):
        super().__init__()
        self.encoder = nn.TransformerEncoderLayer(d_model=latent_dim, nhead=16)
        self.raytracer = SpatialNodeGraph.load_pbr_pipeline("dielectric_glass")
        
    def forward(self, source_tensor: torch.Tensor) -> dict:
        embeddings = self.encoder(source_tensor)
        master_render = self.raytracer.bake_4k_textures(embeddings)
        print(f"✓ 60 FPS PBR Output Baked: {master_render.dimensions}")
        return {"lossless_svg": master_render.svg, "pbr_normals": master_render.normals}`,
    "docker.yml": `# 🐳 Scalable Cloud GPU Worker Swarm
version: '3.9'
services:
  creatify-renderer:
    image: creatify/pbr-raytracer:v2.4-cuda
    runtime: nvidia
    environment:
      - CUDA_VISIBLE_DEVICES=all
      - VAULT_STORAGE_MODE=local_first
      - SHADER_CACHE=true
    deploy:
      replicas: 4
      resources:
        reservations:
          devices:
            - capabilities: [gpu]`
  };

  const [customCode, setCustomCode] = useState(SAMPLE_CODE_SNIPPETS["server.ts"]);
  const [uploadedImage, setUploadedImage] = useState(null);

  // ── Three.js Engine References ──
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelGroupRef = useRef(null);
  const gridHelperRef = useRef(null);
  const particlesRef = useRef(null);
  const screenMeshRef = useRef(null);
  const lightsRef = useRef({});

  // ── Curated 3D Stage Environments for Hub ──
  const STAGE_CARDS = [
    {
      id: "terminal",
      name: "Terminal Window CLI (Ray.so Glass)",
      category: "terminals",
      categoryLabel: "Developer Terminals",
      tag: "4K Ray.so Glass",
      desc: "Floating translucent terminal chassis with live AST syntax highlighting, terminal tabs, and neon edge specular reflection.",
      specs: ["Live Code Editor", "PBR Metalness 0.85", "Cyber Neon Lighting", "4K Lossless PNG"],
      color: "#e1496d",
    },
    {
      id: "macbook",
      name: "MacBook Pro M3 Liquid Retina",
      category: "hardware",
      categoryLabel: "Hardware & Devices",
      tag: "Space Black Aluminum",
      desc: "Anodized aluminum laptop chassis with Liquid Retina XDR display, glass reflections, and adjustable hinge angle.",
      specs: ["16:10 Liquid Retina", "Anodized Aluminum", "Specular Highlights", "360° Orbit"],
      color: "#0284c7",
    },
    {
      id: "iphone",
      name: "iPhone 16 Pro Titanium",
      category: "hardware",
      categoryLabel: "Hardware & Devices",
      tag: "Natural Titanium",
      desc: "Curved aerospace titanium smartphone body with realistic Dynamic Island, texture mapping, and orbital studio lighting.",
      specs: ["Aerospace Titanium", "Dynamic Island", "Curved Bevels", "Portrait / Landscape"],
      color: "#9333ea",
    },
    {
      id: "dual_monitor",
      name: "Dual Developer Monitor Station",
      category: "terminals",
      categoryLabel: "Developer Terminals",
      tag: "Dual Display Rig",
      desc: "Side-by-side developer workspace rig with dual screens mounted on an articulated brushed steel monitor arm.",
      specs: ["Dual 4K Screens", "Articulated Stand", "Multi-File Code View", "Studio Softbox"],
      color: "#16a34a",
    },
    {
      id: "software_box",
      name: "Software Box & Digital Packaging",
      category: "packaging",
      categoryLabel: "Packaging & Print",
      tag: "3D Isometric Carton",
      desc: "Photorealistic 3D software carton with embossed spine, metallic gloss finish, and customizable brand UV maps.",
      specs: ["PBR Carton Shaders", "Embossed Spine", "UV Texture Map", "Studio Rim Light"],
      color: "#d97706",
    },
    {
      id: "glass_card",
      name: "Floating Frosted Glass Slab",
      category: "glass",
      categoryLabel: "Frosted Glass",
      tag: "Dielectric Transmission",
      desc: "High-refractive physical glass shader with translucent transmission, rainbow dispersion highlights, and floating badge elevation.",
      specs: ["Transmission 0.88", "Refraction 1.5", "Beveled Glass Edges", "Floating Elevation"],
      color: "#06b6d4",
    },
    {
      id: "crt_monitor",
      name: "Retro Cyber CRT Monitor",
      category: "terminals",
      categoryLabel: "Developer Terminals",
      tag: "Phosphor Scanline",
      desc: "Curved retro phosphor cathode-ray tube with scanlines, green-amber matrix glow, and vintage heavy chassis.",
      specs: ["Curved Phosphor Screen", "Scanline Shader", "Matrix Green Glow", "Retro Chassis"],
      color: "#22c55e",
    },
    {
      id: "github_readme",
      name: "GitHub Repository README Showcase",
      category: "terminals",
      categoryLabel: "Developer Terminals",
      tag: "GitHub Dark / Light",
      desc: "Official GitHub repository card layout with stars, forks, language distribution bar, and live README hero mockup.",
      specs: ["Repo Metadata", "Release Badges", "Syntax Highlighting", "Star Counter"],
      color: "#38bdf8",
    },
  ];

  // ── Syntax Color Themes ──
  const CODE_THEMES = {
    synthwave: { bg: "#140618", border: "#e1496d", comment: "#6d5475", keyword: "#ff7edb", string: "#72f1b8", function: "#36f9f6", number: "#fede5d", type: "#fe4450", text: "#f8f8f2" },
    onedark: { bg: "#1e1e24", border: "#61afef", comment: "#5c6370", keyword: "#c678dd", string: "#98c379", function: "#61afef", number: "#d19a66", type: "#e5c07b", text: "#abb2bf" },
    dracula: { bg: "#181424", border: "#bd93f9", comment: "#6272a4", keyword: "#ff79c6", string: "#f1fa8c", function: "#50fa7b", number: "#bd93f9", type: "#8be9fd", text: "#f8f8f2" },
    matrix: { bg: "#040e06", border: "#00ff66", comment: "#1e5c26", keyword: "#00ff66", string: "#80ffaa", function: "#33ff77", number: "#66ff99", type: "#00ff88", text: "#00ff44" },
    github: { bg: "#0d1117", border: "#38bdf8", comment: "#8b949e", keyword: "#ff7b72", string: "#a5d6ff", function: "#d2a8ff", number: "#79c0ff", type: "#ffa657", text: "#c9d1d9" },
    neon_tokyo: { bg: "#0f0e17", border: "#ff8906", comment: "#a7a9be", keyword: "#ff8906", string: "#f25f4c", function: "#e53170", number: "#fffffe", type: "#ff8906", text: "#fffffe" },
  };

  // ── Generates High-DPI Dynamic Canvas Textures for 3D Screen Projection ──
  const generateTextureCanvas = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1320;
    const ctx = canvas.getContext("2d");

    const th = CODE_THEMES[codeTheme] || CODE_THEMES.synthwave;

    if (uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    if (activeModel === "terminal" || activeModel === "crt_monitor" || activeModel === "glass_card") {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, th.bg);
      bgGrad.addColorStop(1, activeModel === "crt_monitor" ? "#020a04" : "#0a0208");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = th.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, 68);

      // Traffic lights
      ctx.fillStyle = "#ff5f56"; ctx.beginPath(); ctx.arc(36, 34, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffbd2e"; ctx.beginPath(); ctx.arc(68, 34, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#27c93f"; ctx.beginPath(); ctx.arc(100, 34, 10, 0, Math.PI * 2); ctx.fill();

      // Tabs
      const files = ["server.ts", "pipeline.rs", "model.py", "docker.yml"];
      let tabX = 145;
      files.forEach(f => {
        const isActive = activeFileTab === f;
        ctx.fillStyle = isActive ? "rgba(225, 73, 109, 0.28)" : "rgba(255, 255, 255, 0.03)";
        ctx.beginPath();
        ctx.roundRect(tabX, 12, 210, 44, 8);
        ctx.fill();

        ctx.fillStyle = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.55)";
        ctx.font = "600 18px 'JetBrains Mono', Consolas, monospace";
        ctx.fillText(`⚡ ${f}`, tabX + 18, 40);
        tabX += 222;
      });

      // Code lines
      const lines = customCode.split("\n");
      ctx.font = "500 24px 'JetBrains Mono', Consolas, monospace";
      let y = 135;
      lines.slice(0, 24).forEach((line, idx) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillText(String(idx + 1).padStart(2, " "), 32, y);

        ctx.fillStyle = th.text;
        ctx.fillText(line, 85, y);
        y += 42;
      });
    } else {
      // Default modern screen
      ctx.fillStyle = "#0c040e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#e1496d";
      ctx.font = "900 48px 'Syne', sans-serif";
      ctx.fillText("Creatify Developer Studio", 80, 140);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "28px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("Real-time WebGL PBR Hardware & Packaging Stage", 80, 210);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [activeModel, codeTheme, activeFileTab, customCode, uploadedImage]);

  // ── Construct 3D Geometries & Textures ──
  const build3DModel = useCallback((type, group) => {
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const texture = generateTextureCanvas();

    if (type === "terminal" || type === "glass_card") {
      const chassisMat = new THREE.MeshPhysicalMaterial({
        color: 0x140614,
        metalness: metalness,
        roughness: roughness,
        transmission: type === "glass_card" ? glassTransmission : 0.4,
        ior: 1.5,
        reflectivity: 0.9,
        clearcoat: 1.0,
      });

      const cardGeo = new THREE.BoxGeometry(6.4, 4.2, 0.18);
      const cardMesh = new THREE.Mesh(cardGeo, chassisMat);
      cardMesh.castShadow = true;
      group.add(cardMesh);

      const screenGeo = new THREE.PlaneGeometry(6.25, 4.05);
      const screenMat = new THREE.MeshBasicMaterial({ map: texture });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.z = 0.1;
      group.add(screenMesh);
      screenMeshRef.current = screenMesh;
    } else if (type === "macbook") {
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a24, metalness: 0.9, roughness: 0.2 });
      const baseGeo = new THREE.BoxGeometry(6.8, 0.2, 4.6);
      const baseMesh = new THREE.Mesh(baseGeo, bodyMat);
      baseMesh.position.y = -1.2;
      group.add(baseMesh);

      const lidGeo = new THREE.BoxGeometry(6.8, 4.4, 0.12);
      const lidMesh = new THREE.Mesh(lidGeo, bodyMat);
      lidMesh.position.set(0, 1.0, -2.1);
      lidMesh.rotation.x = -0.15;
      group.add(lidMesh);

      const screenGeo = new THREE.PlaneGeometry(6.5, 4.1);
      const screenMat = new THREE.MeshBasicMaterial({ map: texture });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 1.0, -2.03);
      screenMesh.rotation.x = -0.15;
      group.add(screenMesh);
      screenMeshRef.current = screenMesh;
    } else if (type === "iphone") {
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x2d242a, metalness: 0.92, roughness: 0.15 });
      const phoneGeo = new THREE.BoxGeometry(2.8, 5.6, 0.24);
      const phoneMesh = new THREE.Mesh(phoneGeo, frameMat);
      phoneMesh.castShadow = true;
      group.add(phoneMesh);

      const screenGeo = new THREE.PlaneGeometry(2.65, 5.45);
      const screenMat = new THREE.MeshBasicMaterial({ map: texture });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.z = 0.13;
      group.add(screenMesh);
      screenMeshRef.current = screenMesh;
    } else if (type === "software_box") {
      const boxGeo = new THREE.BoxGeometry(4.2, 5.6, 1.6);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x942945,
        metalness: 0.4,
        roughness: 0.3,
        map: texture,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.castShadow = true;
      group.add(boxMesh);
    } else {
      // Default card
      const geo = new THREE.BoxGeometry(6.0, 4.0, 0.2);
      const mat = new THREE.MeshStandardMaterial({ map: texture });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
    }
  }, [generateTextureCanvas, metalness, roughness, glassTransmission]);

  // ── Launch Studio View from Hub Card ──
  const launchStageStudio = (modelId) => {
    setActiveModel(modelId);
    setViewMode("studio");
  };

  // ── Three.js Studio Scene Initialization ──
  useEffect(() => {
    if (viewMode !== "studio" || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(focalLength, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe1496d, 2.2);
    dirLight1.position.set(6, 7, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 1.8);
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    build3DModel(activeModel, modelGroup);

    // Mouse Drag Orbit
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

      modelGroupRef.current.rotation.y += dx * 0.007;
      modelGroupRef.current.rotation.x += dy * 0.007;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      camera.position.z = Math.max(3, Math.min(15, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isAutoRotating && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

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
  }, [viewMode, activeModel, bgColor, focalLength, build3DModel, isAutoRotating]);

  // Export 4K PNG
  const handleExportPNG = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `creatify-3d-${activeModel}-${Date.now()}.png`;
    a.click();
  };

  // Filtered stage cards in Hub
  const filteredStages = STAGE_CARDS.filter(stg => {
    const matchesCat = activeCategory === "all" || stg.category === activeCategory;
    const matchesQuery = !searchQuery || stg.name.toLowerCase().includes(searchQuery.toLowerCase()) || stg.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 1: 3D MOCKUPS STAGES HUB (Pure Classy Light / Dark Theme)
  // ══════════════════════════════════════════════════════════════════════════════
  if (viewMode === "hub") {
    return (
      <div style={{
        minHeight: "100vh",
        background: isDark ? "#0c040a" : "#fdf8fa",
        color: isDark ? "#ffffff" : "#1a040d",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "40px 48px 80px",
        boxSizing: "border-box",
      }}>
        {/* Top Hub Navigation Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              borderRadius: 99,
              background: isDark ? "rgba(2, 132, 199, 0.15)" : "rgba(2, 132, 199, 0.08)",
              border: `1px solid ${isDark ? "rgba(2, 132, 199, 0.3)" : "rgba(2, 132, 199, 0.2)"}`,
              marginBottom: 10,
            }}>
              <Box size={13} color="#0284c7" />
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                fontFamily: "Syne, sans-serif",
                color: "#0284c7",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                WebGL 3D Stages Hub
              </span>
            </div>

            <h1 style={{
              margin: "0 0 6px",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 900,
              fontFamily: "Syne, sans-serif",
              letterSpacing: "-0.03em",
              color: isDark ? "#ffffff" : "#4a0e22",
            }}>
              3D Mockup Studio
            </h1>
            <p style={{
              margin: 0,
              fontSize: "14.5px",
              color: isDark ? "rgba(255,255,255,0.7)" : "#6a2135",
              maxWidth: 640,
              lineHeight: 1.45,
            }}>
              Real-time Three.js WebGL stages for developer code syntax, terminal shaders, and software packaging.
            </p>
          </div>

          {/* Quick Launch Terminal Stage Button */}
          <button
            onClick={() => launchStageStudio("terminal")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #0284c7, #942945)",
              border: "none",
              color: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 800,
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(2, 132, 199, 0.35)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(2, 132, 199, 0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(2, 132, 199, 0.35)";
            }}
          >
            <Box size={16} />
            <span>Launch Ray.so 3D Stage</span>
          </button>
        </div>

        {/* Filter Chips & Search Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}>
          {/* Category Tabs */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(148, 41, 69, 0.05)",
            padding: "4px 8px",
            borderRadius: 12,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 41, 69, 0.1)"}`,
          }}>
            {[
              { id: "all", label: "All Stages" },
              { id: "terminals", label: "Developer Terminals" },
              { id: "hardware", label: "Hardware & Devices" },
              { id: "packaging", label: "Packaging & Print" },
              { id: "glass", label: "Frosted Glass" },
            ].map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 9,
                    background: active 
                      ? (isDark ? "linear-gradient(135deg, #0284c7, #942945)" : "#ffffff") 
                      : "transparent",
                    border: active && !isDark ? "1px solid rgba(148, 41, 69, 0.15)" : "none",
                    color: active ? (isDark ? "#ffffff" : "#0284c7") : (isDark ? "rgba(255,255,255,0.7)" : "#6a2135"),
                    fontSize: "12.5px",
                    fontWeight: active ? 800 : 600,
                    fontFamily: "Syne, sans-serif",
                    cursor: "pointer",
                    boxShadow: active && !isDark ? "0 2px 8px rgba(148,41,69,0.08)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div style={{ position: "relative", minWidth: 260 }}>
            <Search size={15} style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(148,41,69,0.4)",
            }} />
            <input
              type="text"
              placeholder="Search 3D stages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 14px 8px 36px",
                borderRadius: 10,
                background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(148, 41, 69, 0.18)"}`,
                color: "inherit",
                fontSize: "12.5px",
                outline: "none",
                boxSizing: "border-box",
                boxShadow: !isDark ? "0 2px 6px rgba(148,41,69,0.04)" : "none",
              }}
            />
          </div>
        </div>

        {/* 3D Stage Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 24,
        }}>
          {filteredStages.map((stg) => (
            <div
              key={stg.id}
              style={{
                borderRadius: 18,
                background: isDark ? "rgba(18, 5, 14, 0.88)" : "#ffffff",
                border: `1.5px solid ${isDark ? "rgba(2, 132, 199, 0.22)" : "rgba(148, 41, 69, 0.12)"}`,
                boxShadow: isDark 
                  ? "0 10px 30px rgba(0,0,0,0.5)" 
                  : "0 8px 24px rgba(148, 41, 69, 0.06)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = stg.color;
                e.currentTarget.style.boxShadow = isDark 
                  ? `0 16px 40px ${stg.color}35` 
                  : "0 14px 36px rgba(148, 41, 69, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isDark ? "rgba(2, 132, 199, 0.22)" : "rgba(148, 41, 69, 0.12)";
                e.currentTarget.style.boxShadow = isDark 
                  ? "0 10px 30px rgba(0,0,0,0.5)" 
                  : "0 8px 24px rgba(148, 41, 69, 0.06)";
              }}
            >
              <div>
                {/* Card Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{
                    fontSize: "10.5px",
                    fontWeight: 800,
                    fontFamily: "Syne, sans-serif",
                    padding: "3px 10px",
                    borderRadius: 99,
                    background: `${stg.color}15`,
                    color: stg.color,
                    border: `1px solid ${stg.color}35`,
                    textTransform: "uppercase",
                  }}>
                    {stg.tag}
                  </span>
                  
                  <span style={{
                    fontSize: "11px",
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    color: isDark ? "rgba(255,255,255,0.5)" : "#831843",
                  }}>
                    {stg.categoryLabel}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 style={{
                  margin: "0 0 8px",
                  fontSize: "18px",
                  fontWeight: 800,
                  fontFamily: "Syne, sans-serif",
                  color: isDark ? "#ffffff" : "#1a040d",
                  lineHeight: 1.25,
                }}>
                  {stg.name}
                </h3>

                <p style={{
                  margin: "0 0 20px",
                  fontSize: "13px",
                  color: isDark ? "rgba(255,255,255,0.7)" : "#5a1827",
                  lineHeight: 1.45,
                }}>
                  {stg.desc}
                </p>

                {/* Specs Chips */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: 22,
                }}>
                  {stg.specs.map((sp, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(148, 41, 69, 0.04)",
                        color: isDark ? "rgba(255,255,255,0.8)" : "#4a0e22",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 41, 69, 0.08)"}`,
                      }}
                    >
                      • {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Launch in Studio Button */}
              <button
                onClick={() => launchStageStudio(stg.id)}
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${stg.color}, #942945)`,
                  border: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 800,
                  fontFamily: "Syne, sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: `0 4px 14px ${stg.color}35`,
                }}
              >
                <span>Launch 3D WebGL Stage</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 2: 3D THREE.JS WEBGL VIEWPORT STUDIO
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: isEmbedded ? "calc(100vh - 72px)" : "100vh",
        width: "100%",
        background: isDark ? "#0c040a" : "#fdf8fa",
        color: isDark ? "#ffffff" : "#1a040d",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── TOP STUDIO TOOLBAR ── */}
      <header style={{
        height: 56,
        background: isDark ? "rgba(16, 5, 14, 0.96)" : "rgba(255, 255, 255, 0.98)",
        borderBottom: `1px solid ${isDark ? "rgba(225, 73, 109, 0.2)" : "rgba(148, 41, 69, 0.12)"}`,
        backdropFilter: "blur(16px)",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 25,
        gap: 12,
      }}>
        {/* Left: Back to Hub + Active Stage Model */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => setViewMode("hub")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.06)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(148,41,69,0.12)"}`,
              color: isDark ? "#ffffff" : "#831843",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} />
            <span>Mockups Hub</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #0284c7, #e1496d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}>
              <Box size={15} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                  {STAGE_CARDS.find(s => s.id === activeModel)?.name || "3D Stage Viewport"}
                </span>
                <span style={{
                  fontSize: 9, padding: "2px 6px", borderRadius: 4,
                  background: "rgba(2, 132, 199, 0.15)", color: "#0284c7",
                  border: "1px solid rgba(2, 132, 199, 0.3)", fontWeight: 800,
                }}>
                  THREE.JS WEBGL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Stage Selector */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(148,41,69,0.05)",
          padding: "3px 6px",
          borderRadius: 10,
          border: `1px solid ${isDark ? "rgba(225,73,109,0.15)" : "rgba(148,41,69,0.12)"}`,
        }}>
          {[
            { id: "terminal", label: "Ray.so Glass" },
            { id: "macbook", label: "MacBook Pro" },
            { id: "iphone", label: "iPhone 16 Pro" },
            { id: "software_box", label: "Software Box" },
          ].map(m => {
            const active = activeModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModel(m.id)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  background: active ? "linear-gradient(135deg, #0284c7, #942945)" : "transparent",
                  border: "none",
                  color: active ? "#ffffff" : (isDark ? "rgba(255,255,255,0.7)" : "#4a0e22"),
                  fontSize: 11.5,
                  fontWeight: active ? 800 : 600,
                  fontFamily: "Syne, sans-serif",
                  cursor: "pointer",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 13px",
              borderRadius: 8,
              background: isAutoRotating ? "rgba(2, 132, 199, 0.2)" : (isDark ? "rgba(255,255,255,0.06)" : "#ffffff"),
              border: `1px solid ${isAutoRotating ? "#0284c7" : (isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.18)")}`,
              color: isAutoRotating ? "#0284c7" : "inherit",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <RotateCw size={13} className={isAutoRotating ? "mascot-anim-spin" : ""} />
            <span>360° Spin</span>
          </button>

          <button
            onClick={handleExportPNG}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 18px",
              borderRadius: 99,
              background: "linear-gradient(135deg, #0284c7, #942945)",
              border: "none",
              color: "#ffffff",
              fontSize: 12.5,
              fontWeight: 800,
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(2, 132, 199, 0.4)",
            }}
          >
            <Download size={13} />
            <span>Export 4K PNG</span>
          </button>
        </div>
      </header>

      {/* ── MAIN STUDIO 3D VIEWPORT CANVAS ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div
          ref={mountRef}
          style={{ width: "100%", height: "100%", cursor: "grab" }}
        />

        {/* Orbit Helper */}
        <div style={{
          position: "absolute", bottom: 20, left: 24,
          background: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(148,41,69,0.15)"}`,
          borderRadius: 8,
          padding: "6px 14px",
          fontSize: 11.5,
          color: isDark ? "rgba(255,255,255,0.75)" : "#4a0e22",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}>
          <Eye size={13} color="#e1496d" />
          <span>Click & Drag to rotate 3D model • Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
}
