import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as THREE from "three";
import { 
  ArrowLeft, Camera, RotateCw, Sun, Moon, 
  Download, Upload, Sliders, Sparkles, Image as ImageIcon, Box,
  Terminal, Globe, Code, Copy, Check, RefreshCw, Layers, Monitor,
  Smartphone, Shield, Layout, Eye, Cpu, ZoomIn, ZoomOut, CheckCheck,
  Radio, Sparkle, Palette, Maximize2, FileCode, Disc, Package, Search,
  ArrowUpRight, ChevronRight, X, Play, PlayCircle, ShieldCheck,
  GitBranch, Cloud, Share2, Settings, CheckCircle2, AlertCircle,
  Clock, ArrowRight, Database, Send, Compass, Filter, Grid, Bookmark,
  Laptop, LaptopMinimal, Tv, Flame, Sparkles as SparklesIcon
} from "lucide-react";
import CommunityLandscapeBanner from "./CommunityLandscapeBanner";

export default function MockupStudio({ onBack, user, onNavigate, isEmbedded = false, isDark = false }) {
  // Navigation mode: "hub" (Overview & Stage Presets Marketplace) or "studio" (3D Three.js PBR Viewport)
  const [viewMode, setViewMode] = useState("hub");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [blueprintLayoutMode, setBlueprintLayoutMode] = useState("stack"); // "stack", "grid", "carousel"
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const [isDeckHovered, setIsDeckHovered] = useState(false);

  const mountRef = useRef(null);

  // ── Active 3D Studio State & Models ──
  // Models: "terminal", "macbook", "iphone", "software_box", "dual_monitor", "crt_monitor", "glass_card", "browser", "social_banner"
  const [activeModel, setActiveModel] = useState("terminal");
  const [activeLighting, setActiveLighting] = useState("cyber"); // "cyber", "studio", "matrix", "sunset", "neon_tokyo", "clean_white"
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showGridFloor, setShowGridFloor] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [focalLength, setFocalLength] = useState(45); // Camera FOV: 24 to 75
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.85);
  const [glassTransmission, setGlassTransmission] = useState(0.88);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [bgColor, setBgColor] = useState(isDark ? "#090207" : "#f8fafc");
  const [cameraView, setCameraView] = useState("perspective");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSdk, setCopiedSdk] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState("code"); // "code", "materials", "lighting", "export"
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  
  // ── Code & File Tabs ──
  const [activeFileTab, setActiveFileTab] = useState("server.ts");
  const [codeTheme, setCodeTheme] = useState("synthwave");
  const [windowTitle, setWindowTitle] = useState("server.ts — Creatify Engine v2.4");
  const [urlBarText, setUrlBarText] = useState("https://creatify.dev/dashboard");
  const [boxBrandTitle, setBoxBrandTitle] = useState("CREATIFY PRO");
  const [boxTagline, setBoxTagline] = useState("Developer 3D Spatial Engine");
  const [uploadedImage, setUploadedImage] = useState(null);

  // ── Pre-built Developer Code Templates ──
  const SAMPLE_CODE_SNIPPETS = {
    "server.ts": `// 🚀 High-Velocity Developer 3D Mockup Suite
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
            - capabilities: [gpu]`,
    "App.tsx": `// ⚛️ React 19 Next.js Client Component
import { useState, useTransition } from "react";
import { Canvas3D, OrbitControls, PBRShader } from "@creatify/react-3d";

export default function HeroViewport() {
  const [isPending, startTransition] = useTransition();
  const [rig, setRig] = useState("glass_terminal");

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
      <Canvas3D camera={{ fov: 45, position: [0, 1.2, 3.8] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ff8da7" />
        <PBRShader rig={rig} metalness={0.88} roughness={0.15} />
        <OrbitControls autoRotate enableZoom />
      </Canvas3D>
    </div>
  );
}`
  };

  const [customCode, setCustomCode] = useState(SAMPLE_CODE_SNIPPETS["server.ts"]);

  // ── Three.js Engine References ──
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelGroupRef = useRef(null);
  const gridHelperRef = useRef(null);
  const particlesRef = useRef(null);
  const screenMeshRef = useRef(null);
  const lightsRef = useRef({});
  const animationFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // ── Curated 3D Stage Environments for Hub ──
  const STAGE_CARDS = useMemo(() => [
    {
      id: "terminal",
      name: "Terminal Window CLI (Ray.so Glass)",
      category: "terminals",
      categoryLabel: "Developer Terminals",
      tag: "4K Ray.so Glass",
      desc: "Floating translucent terminal chassis with live AST syntax highlighting, terminal tabs, and neon edge specular reflection.",
      specs: ["Live Code Editor", "PBR Metalness 0.85", "Cyber Neon Lighting", "4K Lossless PNG"],
      color: "#e1496d",
      icon: Terminal,
      previewBadge: "HOT 🔥",
      stats: { vertices: "14.2k", shaders: "PBR Specular", fps: "60 FPS" },
    },
    {
      id: "macbook",
      name: "MacBook Pro M3 Liquid Retina",
      category: "hardware",
      categoryLabel: "Hardware & Devices",
      tag: "Space Black M3",
      desc: "Anodized aluminum chassis, precision notch display, chiclet backlit keyboard deck, and 120Hz ProMotion screen projection.",
      specs: ["Anodized Metallic", "Liquid Retina Screen", "Studio Softbox Lighting", "Custom Image Texture"],
      color: "#0284c7",
      icon: Laptop,
      previewBadge: "PRO ⚡",
      stats: { vertices: "28.6k", shaders: "Dielectric Metal", fps: "60 FPS" },
    },
    {
      id: "iphone",
      name: "iPhone 16 Pro Max Titanium",
      category: "hardware",
      categoryLabel: "Hardware & Devices",
      tag: "Titanium Chassis",
      desc: "Floating bezel-less smartphone mockup with Dynamic Island, rounded glass corners, and realistic PBR brushed titanium frame.",
      specs: ["Dynamic Island", "Titanium Brushed Finish", "Reflective Glass", "Portrait / Mobile"],
      color: "#9333ea",
      icon: Smartphone,
      previewBadge: "MOBILE 📱",
      stats: { vertices: "19.4k", shaders: "Frosted Glass", fps: "60 FPS" },
    },
    {
      id: "software_box",
      name: "Software Package & Retail Box 3D",
      category: "packaging",
      categoryLabel: "Packaging & Retail",
      tag: "Glossy Emboss",
      desc: "Architectural 3D software packaging box with holographic security seal, embossed typography, and realistic cardboard seams.",
      specs: ["Gloss Emboss Layer", "Custom Brand Titles", "Isometric Tilt Rig", "Holographic Stamp"],
      color: "#16a34a",
      icon: Package,
      previewBadge: "RETAIL 📦",
      stats: { vertices: "8.2k", shaders: "Matte + Clearcoat", fps: "60 FPS" },
    },
    {
      id: "dual_monitor",
      name: "Dual-Monitor Dev Workstation",
      category: "hardware",
      categoryLabel: "Hardware & Devices",
      tag: "Ultrawide Desk",
      desc: "Twin curved 32-inch developer displays with split terminal and web app viewports, desktop stand, and RGB ambient bias lighting.",
      specs: ["Twin Curved Panels", "Split Code + Web View", "Ambient Glow Bias", "Desktop Mount"],
      color: "#f59e0b",
      icon: Monitor,
      previewBadge: "DESK 🖥️",
      stats: { vertices: "34.1k", shaders: "RGB Bias Light", fps: "60 FPS" },
    },
    {
      id: "crt_monitor",
      name: "Retro CRT Terminal (Amber Glow)",
      category: "retro",
      categoryLabel: "Retro & Holographic",
      tag: "Phosphor 1984",
      desc: "Curved retro-futuristic CRT monitor with glowing amber scanlines, chromatic aberration, and tactile mechanical bezel chassis.",
      specs: ["Curved Phosphor Mesh", "Scanline Glow Shaders", "Matrix Emerald / Amber", "Cyberpunk Aesthetic"],
      color: "#10b981",
      icon: Tv,
      previewBadge: "RETRO 👾",
      stats: { vertices: "16.8k", shaders: "Scanline Shader", fps: "60 FPS" },
    },
    {
      id: "glass_card",
      name: "Floating Glass Hologram Card",
      category: "retro",
      categoryLabel: "Retro & Holographic",
      tag: "Fresnel Refraction",
      desc: "Ultra-thin optical glass card with frosted depth blur, floating holographic code glyphs, and iridescent edge diffraction.",
      specs: ["Transmission 0.95", "Fresnel Iridescence", "Floating Token Badges", "Tokyo Midnight Light"],
      color: "#ec4899",
      icon: SparklesIcon,
      previewBadge: "FUTURISTIC ✨",
      stats: { vertices: "11.2k", shaders: "Thin Optical Glass", fps: "60 FPS" },
    },
    {
      id: "browser",
      name: "Safari & Chrome Window Frame",
      category: "terminals",
      categoryLabel: "Developer Terminals",
      tag: "Web Browser UI",
      desc: "Clean floating browser chassis with traffic light controls, custom SSL URL address bar, and back/forward navigation buttons.",
      specs: ["Custom URL Address", "Clean Light/Dark UI", "Interactive Texture", "Lossless Web Export"],
      color: "#06b6d4",
      icon: Globe,
      previewBadge: "BROWSER 🌐",
      stats: { vertices: "9.5k", shaders: "Acrylic Glass", fps: "60 FPS" },
    },
    {
      id: "social_banner",
      name: "OpenGraph 3D Social Banner",
      category: "social",
      categoryLabel: "Social & OpenGraph",
      tag: "1200x630 Hero",
      desc: "Perspective angled 3D card tailored for GitHub README banners, Twitter / X summary cards, and Discord embed previews.",
      specs: ["1200x630 Aspect Ratio", "README Markdown Hero", "4K CDN Ready", "Angle Tilt Preset"],
      color: "#6366f1",
      icon: Layout,
      previewBadge: "BANNER 🚀",
      stats: { vertices: "12.0k", shaders: "PBR Glossy", fps: "60 FPS" },
    }
  ], []);

  // Filtered stage cards
  const filteredStages = useMemo(() => {
    return STAGE_CARDS.filter(stage => {
      const matchesCategory = activeCategory === "all" || stage.category === activeCategory;
      const matchesSearch = !searchQuery || 
        stage.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stage.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stage.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [STAGE_CARDS, activeCategory, searchQuery]);

  // Auto-rotate 3D Deck every 3 seconds unless hovered
  useEffect(() => {
    if (blueprintLayoutMode !== "stack" || isDeckHovered || filteredStages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveDeckIndex(prev => (prev + 1) % filteredStages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [blueprintLayoutMode, isDeckHovered, filteredStages.length]);

  // ── Open Studio from Hub ──
  const openModelInStudio = (modelId) => {
    setActiveModel(modelId);
    setViewMode("studio");
  };

  // ── Helper: Generate Dynamic Screen Texture via HTML5 Canvas ──
  const generateDynamicTexture = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");

    if (uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    if (activeModel === "software_box") {
      // Software Box Packaging Face
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#1a0814");
      grad.addColorStop(0.5, "#4a1228");
      grad.addColorStop(1, "#0e030b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold / Rose Accent Lines
      ctx.strokeStyle = "#e1496d";
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Holographic Circle
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 240, 90, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(225, 73, 109, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "#ff8da7";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Brand Title
      ctx.font = "bold 44px 'Syne', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(boxBrandTitle, canvas.width / 2, 400);

      ctx.font = "20px 'Poppins', sans-serif";
      ctx.fillStyle = "#ff8da7";
      ctx.fillText(boxTagline, canvas.width / 2, 445);

      // Barcode simulation
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(canvas.width / 2 - 120, 560, 240, 60);
      ctx.fillStyle = "#000000";
      for (let i = 0; i < 240; i += 6) {
        if (Math.sin(i * 99) > -0.2) {
          ctx.fillRect(canvas.width / 2 - 120 + i, 565, 3, 50);
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    // Default Code / Terminal Screen Texture
    const isDarkTheme = codeTheme !== "light";
    ctx.fillStyle = isDarkTheme ? "#0e0c12" : "#fdf8fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Window Header Bar
    ctx.fillStyle = isDarkTheme ? "#18131d" : "#f1e4e9";
    ctx.fillRect(0, 0, canvas.width, 54);

    // Traffic light dots
    ctx.fillStyle = "#ff5f56"; ctx.beginPath(); ctx.arc(28, 27, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffbd2e"; ctx.beginPath(); ctx.arc(52, 27, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#27c93f"; ctx.beginPath(); ctx.arc(76, 27, 8, 0, Math.PI * 2); ctx.fill();

    // Window Title
    ctx.font = "bold 17px 'JetBrains Mono', monospace";
    ctx.fillStyle = isDarkTheme ? "#9ca3af" : "#6a2135";
    ctx.textAlign = "center";
    ctx.fillText(activeModel === "browser" ? urlBarText : windowTitle, canvas.width / 2, 34);

    // Code Lines
    const lines = customCode.split("\n");
    ctx.font = "19px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    let lineY = 100;

    lines.forEach((line, index) => {
      if (lineY > canvas.height - 30) return;
      // Line number
      ctx.fillStyle = isDarkTheme ? "#4b5563" : "#a8818f";
      ctx.fillText(String(index + 1).padStart(2, " "), 28, lineY);

      // Syntax color parser
      if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
        ctx.fillStyle = "#6b7280"; // Comment
      } else if (line.includes("import") || line.includes("export") || line.includes("function") || line.includes("return") || line.includes("pub fn")) {
        ctx.fillStyle = isDarkTheme ? "#f43f5e" : "#be123c"; // Keyword
      } else if (line.includes("const") || line.includes("let") || line.includes("struct") || line.includes("class")) {
        ctx.fillStyle = isDarkTheme ? "#38bdf8" : "#0369a1"; // Storage
      } else if (line.includes('"') || line.includes("'") || line.includes("`")) {
        ctx.fillStyle = isDarkTheme ? "#34d399" : "#047857"; // String
      } else {
        ctx.fillStyle = isDarkTheme ? "#e5e7eb" : "#1a040d"; // Default text
      }

      ctx.fillText(line, 75, lineY);
      lineY += 27;
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [uploadedImage, activeModel, boxBrandTitle, boxTagline, codeTheme, urlBarText, windowTitle, customCode]);

  // ── Three.js Scene Setup & Loop ──
  useEffect(() => {
    if (viewMode !== "studio" || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(bgColor);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(focalLength, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 3.8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(activeLighting === "cyber" ? 0xff4081 : 0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(activeLighting === "cyber" ? 0x00e5ff : 0x88bbff, 1.6);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(activeLighting === "matrix" ? 0x00ff66 : 0xa855f7, 2.5, 12);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    lightsRef.current = { ambientLight, keyLight, fillLight, rimLight };

    // 5. Grid Floor
    const grid = new THREE.GridHelper(12, 24, 0xe1496d, isDark ? 0x24111d : 0xe2d4dc);
    grid.position.y = -1.35;
    grid.visible = showGridFloor;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 6. Floating Ambient Particle Swarm
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 5;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: activeLighting === "cyber" ? 0xff4081 : 0x00e5ff,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.visible = showParticles;
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Dynamic 3D Model Group Generator
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const screenTexture = generateDynamicTexture();

    // Model Chassis Material
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: activeModel === "terminal" || activeModel === "glass_card" ? 0x160812 : 0x1e1e24,
      metalness: metalness,
      roughness: roughness,
      transmission: activeModel === "terminal" || activeModel === "glass_card" ? glassTransmission : 0.0,
      transparent: activeModel === "terminal" || activeModel === "glass_card",
      opacity: activeModel === "terminal" || activeModel === "glass_card" ? 0.92 : 1.0,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      wireframe: wireframeMode,
    });

    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      wireframe: wireframeMode,
    });

    if (activeModel === "terminal" || activeModel === "browser" || activeModel === "social_banner") {
      // Floating Glass Terminal / Browser Plane
      const isBanner = activeModel === "social_banner";
      const w = isBanner ? 3.0 : 2.6;
      const h = isBanner ? 1.58 : 1.8;
      const chassisGeo = new THREE.BoxGeometry(w, h, 0.08);
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      modelGroup.add(chassis);

      const screenGeo = new THREE.PlaneGeometry(w * 0.97, h * 0.96);
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.z = 0.042;
      modelGroup.add(screen);
      screenMeshRef.current = screen;
    } else if (activeModel === "macbook") {
      // Laptop Display + Base
      const screenGeo = new THREE.BoxGeometry(2.7, 1.75, 0.05);
      const screenMesh = new THREE.Mesh(screenGeo, chassisMat);
      screenMesh.position.set(0, 0.45, -0.6);
      screenMesh.rotation.x = -0.18;
      modelGroup.add(screenMesh);

      const screenDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 1.62), screenMat);
      screenDisplay.position.set(0, 0.45, -0.57);
      screenDisplay.rotation.x = -0.18;
      modelGroup.add(screenDisplay);

      const baseGeo = new THREE.BoxGeometry(2.7, 0.05, 1.8);
      const baseMesh = new THREE.Mesh(baseGeo, chassisMat);
      baseMesh.position.set(0, -0.4, 0.25);
      modelGroup.add(baseMesh);
    } else if (activeModel === "iphone") {
      // Smartphone Chassis
      const phoneGeo = new THREE.BoxGeometry(1.2, 2.4, 0.1);
      const phoneMesh = new THREE.Mesh(phoneGeo, chassisMat);
      modelGroup.add(phoneMesh);

      const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 2.3), screenMat);
      phoneScreen.position.z = 0.052;
      modelGroup.add(phoneScreen);
    } else if (activeModel === "software_box") {
      // 3D Retail Software Box
      const boxGeo = new THREE.BoxGeometry(1.8, 2.4, 0.65);
      const boxMesh = new THREE.Mesh(boxGeo, [
        chassisMat, chassisMat, chassisMat, chassisMat, screenMat, chassisMat
      ]);
      modelGroup.add(boxMesh);
    } else {
      // Generic Refractive Glass Hologram Card
      const cardGeo = new THREE.BoxGeometry(2.5, 1.6, 0.06);
      const cardMesh = new THREE.Mesh(cardGeo, chassisMat);
      modelGroup.add(cardMesh);

      const cardDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.38, 1.48), screenMat);
      cardDisplay.position.z = 0.032;
      modelGroup.add(cardDisplay);
    }

    // 8. Mouse Drag Orbit Controls
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 9. Render Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isAutoRotating && modelGroupRef.current && !isDraggingRef.current) {
        modelGroupRef.current.rotation.y += delta * 0.35;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y += delta * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.dispose();
    };
  }, [viewMode, activeModel, activeLighting, isAutoRotating, showGridFloor, showParticles, focalLength, roughness, metalness, glassTransmission, wireframeMode, bgColor, isDark, generateDynamicTexture]);

  // ── Camera View Angle Presets ──
  const setCameraPreset = (preset) => {
    if (!modelGroupRef.current || !cameraRef.current) return;
    setCameraView(preset);
    setIsAutoRotating(false);

    if (preset === "perspective") {
      modelGroupRef.current.rotation.set(0.1, -0.3, 0);
      cameraRef.current.position.set(0, 0.3, 3.8);
    } else if (preset === "front") {
      modelGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0, 3.6);
    } else if (preset === "isometric") {
      modelGroupRef.current.rotation.set(0.4, 0.6, -0.2);
      cameraRef.current.position.set(0, 0.5, 4.0);
    } else if (preset === "top") {
      modelGroupRef.current.rotation.set(1.2, 0, 0);
      cameraRef.current.position.set(0, 1.2, 3.2);
    }
  };

  // ── Snapshot Export 4K PNG ──
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    setIsExporting(true);

    setTimeout(() => {
      const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `creatify-3d-${activeModel}-${Date.now()}.png`;
      a.click();
      setIsExporting(false);
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    }, 400);
  };

  // ── Copy React 3D Component Code ──
  const handleCopyReactCode = () => {
    const reactSnippet = `// 🚀 Next.js React 3D Mockup Component
import { Canvas3D, ModelRig, OrbitControls } from "@creatify/react-3d";

export function Product3DMockup() {
  return (
    <Canvas3D 
      camera={{ fov: ${focalLength}, position: [0, 0.4, 3.8] }}
      lighting="${activeLighting}"
      background="${bgColor}"
    >
      <ModelRig 
        model="${activeModel}" 
        metalness={${metalness}} 
        roughness={${roughness}} 
        autoRotate={${isAutoRotating}} 
      />
      <OrbitControls enableZoom={true} />
    </Canvas3D>
  );
}`;
    navigator.clipboard.writeText(reactSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ── Copy CLI Command ──
  const handleCopySdkCli = () => {
    const cli = `npx @creatify/mockup --rig=${activeModel} --lighting=${activeLighting} --code=server.ts --export=4k.png`;
    navigator.clipboard.writeText(cli);
    setCopiedSdk(true);
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 1: 3D MOCKUP STAGES & MARKETPLACE HUB (Matches WorkflowPipelines.jsx)
  // ══════════════════════════════════════════════════════════════════════════════
  if (viewMode === "hub") {
    return (
      <div style={{
        minHeight: "100vh",
        background: isDark ? "#0c040a" : "#fdf8fa",
        color: isDark ? "#ffffff" : "#1a040d",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "32px 0 0",
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
      }}>
        {/* Ambient Background Auras */}
        <div style={{
          position: "absolute", top: "-150px", left: "25%", width: 550, height: 550,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(225,73,109,0.16) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none", zIndex: 0
        }} />
        <div style={{
          position: "absolute", top: "400px", right: "10%", width: 450, height: 450,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)",
          filter: "blur(90px)", pointerEvents: "none", zIndex: 0
        }} />

        {/* ── TOP HERO CENTERPIECE: OPEN UNBOXED LAYOUT WITH ART ── */}
        <section style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto 52px",
          padding: "24px 24px 0",
          textAlign: "center",
        }}>
          {/* Majestic Hero Headline */}
          <h1 style={{
            margin: "0 auto 14px",
            fontSize: "clamp(32px, 4.5vw, 58px)",
            fontWeight: 900,
            fontFamily: "Syne, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: isDark ? "#ffffff" : "#4a0e22",
            maxWidth: 920
          }}>
            Raytrace 3D Device & Code Mockups with <span style={{
              color: isDark ? "#ff8da7" : "#e1496d"
            }}>Physical WebGL Shaders</span>.
          </h1>

          <p style={{
            margin: "0 auto 36px",
            fontSize: "clamp(14.5px, 1.7vw, 17px)",
            color: isDark ? "rgba(255,255,255,0.7)" : "#6a2135",
            maxWidth: 720,
            lineHeight: 1.6,
          }}>
            Bake floating Ray.so glass terminals, MacBook M3 displays, titanium smartphones, and 4K OpenGraph social assets with real-time dielectric PBR materials.
          </p>

          {/* ── INTERACTIVE VISUAL ARTWORK: PROCEDURAL 3D PIPELINE MATRIX ── */}
          <div style={{
            position: "relative",
            maxWidth: 960,
            height: 180,
            margin: "0 auto 36px",
            borderRadius: 20,
            background: isDark ? "rgba(10, 2, 8, 0.8)" : "rgba(255, 255, 255, 0.75)",
            border: `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.2)" : "rgba(148, 41, 69, 0.12)"}`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 24px",
            boxShadow: isDark ? "inset 0 0 30px rgba(0,0,0,0.6)" : "inset 0 0 20px rgba(148,41,69,0.03)"
          }}>
            {/* SVG Connecting Bezier Cable Stream */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <path
                d="M 120 90 C 260 40, 340 140, 460 90 S 660 40, 840 90"
                fill="none"
                stroke={isDark ? "rgba(225,73,109,0.4)" : "rgba(225,73,109,0.3)"}
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Stage 1: Source Code & Image Texture Ingest */}
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 18px rgba(2, 132, 199, 0.45)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}>
                <Code size={22} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fff" : "#1a040d" }}>
                  Code / Screenshot
                </span>
                <div style={{ fontSize: 9.5, color: "#0284c7", fontWeight: 700 }}>AST Ingest</div>
              </div>
            </div>

            {/* Stage 2: WebGL Dielectric PBR Shading */}
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #e1496d, #942945)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 18px rgba(225, 73, 109, 0.45)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}>
                <Box size={22} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fff" : "#1a040d" }}>
                  PBR Normal Maps
                </span>
                <div style={{ fontSize: 9.5, color: "#e1496d", fontWeight: 700 }}>Metal / Glass 0.88</div>
              </div>
            </div>

            {/* Stage 3: Studio Multi-Point Lighting */}
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #a855f7, #7e22ce)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 18px rgba(168, 85, 247, 0.45)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}>
                <Sparkles size={22} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fff" : "#1a040d" }}>
                  Cyber Studio Rig
                </span>
                <div style={{ fontSize: 9.5, color: "#a855f7", fontWeight: 700 }}>HDR 60 FPS</div>
              </div>
            </div>

            {/* Stage 4: 4K Lossless PNG Export */}
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #10b981, #047857)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 18px rgba(16, 185, 129, 0.45)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}>
                <CheckCircle2 size={22} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fff" : "#1a040d" }}>
                  4K Lossless PNG
                </span>
                <div style={{ fontSize: 9.5, color: "#10b981", fontWeight: 700 }}>Instant CDN</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => openModelInStudio("terminal")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 28px", borderRadius: 14,
                background: "linear-gradient(135deg, #e1496d, #942945)",
                color: "#ffffff", border: "none",
                fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 15,
                boxShadow: "0 8px 24px rgba(225,73,109,0.35)",
                cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
            >
              <Box size={18} /> Launch 3D Studio Engine
            </button>

            <button
              onClick={handleCopySdkCli}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 22px", borderRadius: 14,
                background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                color: isDark ? "#ffffff" : "#4a0e22",
                border: `1.5px solid ${isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.18)"}`,
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 13,
                cursor: "pointer", transition: "all 0.18s",
              }}
            >
              {copiedSdk ? <Check size={16} color="#10b981" /> : <Terminal size={16} color="#e1496d" />}
              {copiedSdk ? "CLI Command Copied!" : "npx @creatify/mockup"}
            </button>
          </div>
        </section>

        {/* ── INTERACTIVE 3D STAGE DECK SHOWCASE (STACK / GRID MODES) ── */}
        <section 
          style={{ maxWidth: 1200, margin: "0 auto 48px", padding: "0 24px", position: "relative", zIndex: 1 }}
          onMouseEnter={() => setIsDeckHovered(true)}
          onMouseLeave={() => setIsDeckHovered(false)}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Sparkles size={16} color="#e1496d" />
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#e1496d", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Interactive 3D Stages Showcase
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 900, fontFamily: "Syne, sans-serif", color: isDark ? "#ffffff" : "#4a0e22" }}>
                Featured Developer Rigs & Viewports
              </h2>
            </div>

            {/* Layout Mode Switcher */}
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: 4, borderRadius: 12,
              background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.12)"}`,
            }}>
              {[
                { id: "stack", label: "3D Stack Deck", icon: Layers },
                { id: "grid", label: "Grid Matrix", icon: Grid },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setBlueprintLayoutMode(m.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 8,
                    background: blueprintLayoutMode === m.id ? (isDark ? "rgba(225,73,109,0.25)" : "#e1496d") : "transparent",
                    color: blueprintLayoutMode === m.id ? "#ffffff" : (isDark ? "#ffffff" : "#6a2135"),
                    border: "none", fontSize: 11.5, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <m.icon size={13} /> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Stack Deck View */}
          {blueprintLayoutMode === "stack" && (
            <div style={{ position: "relative", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {filteredStages.map((stage, idx) => {
                const total = filteredStages.length;
                const offset = (idx - activeDeckIndex + total) % total;
                const isTop = offset === 0;
                const isSecond = offset === 1;
                const isThird = offset === 2;

                if (!isTop && !isSecond && !isThird) return null;

                const translateY = offset * 22;
                const scale = 1 - offset * 0.05;
                const zIndex = 10 - offset;
                const opacity = 1 - offset * 0.22;

                return (
                  <div
                    key={stage.id}
                    onClick={() => isTop ? openModelInStudio(stage.id) : setActiveDeckIndex(idx)}
                    style={{
                      position: isTop ? "relative" : "absolute",
                      width: "100%", maxWidth: 940,
                      borderRadius: 24,
                      background: isDark ? "rgba(18, 6, 15, 0.95)" : "#ffffff",
                      border: `1.5px solid ${isTop ? "#e1496d" : (isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.12)")}`,
                      padding: "28px 32px",
                      boxShadow: isTop ? (isDark ? "0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(225,73,109,0.18)" : "0 20px 50px rgba(148,41,69,0.12)") : "none",
                      transform: `translateY(${translateY}px) scale(${scale})`,
                      zIndex, opacity,
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 14,
                          background: `linear-gradient(135deg, ${stage.color}, #942945)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#ffffff", boxShadow: `0 6px 16px ${stage.color}40`,
                        }}>
                          <stage.icon size={24} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, fontFamily: "Syne, sans-serif", color: isDark ? "#ffffff" : "#4a0e22" }}>
                              {stage.name}
                            </h3>
                            <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 12, background: "rgba(225,73,109,0.15)", color: "#e1496d", border: "1px solid rgba(225,73,109,0.3)" }}>
                              {stage.previewBadge}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.6)" : "#6a2135", marginTop: 2 }}>
                            {stage.categoryLabel} • {stage.tag}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); openModelInStudio(stage.id); }}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "10px 18px", borderRadius: 10,
                          background: "#e1496d", color: "#ffffff",
                          border: "none", fontWeight: 700, fontSize: 13,
                          fontFamily: "Syne, sans-serif", cursor: "pointer",
                        }}
                      >
                        Launch 3D Studio <ArrowRight size={14} />
                      </button>
                    </div>

                    <p style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.5, color: isDark ? "rgba(255,255,255,0.75)" : "#4a0e22" }}>
                      {stage.desc}
                    </p>

                    {/* Specs badges */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {stage.specs.map((sp, i) => (
                        <span key={i} style={{
                          fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8,
                          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.06)",
                          color: isDark ? "#ff8da7" : "#942945", border: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.12)"}`
                        }}>
                          ✓ {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Grid Matrix Mode */}
          {blueprintLayoutMode === "grid" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {filteredStages.map((stage) => (
                <div
                  key={stage.id}
                  onClick={() => openModelInStudio(stage.id)}
                  style={{
                    borderRadius: 20,
                    background: isDark ? "rgba(18, 6, 15, 0.9)" : "#ffffff",
                    border: `1.5px solid ${isDark ? "rgba(225,73,109,0.18)" : "rgba(148,41,69,0.12)"}`,
                    padding: 24,
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex", flexDirection: "column", justifyContent: "space-between"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "#e1496d";
                    e.currentTarget.style.boxShadow = isDark ? "0 16px 36px rgba(0,0,0,0.6)" : "0 14px 30px rgba(148,41,69,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.borderColor = isDark ? "rgba(225,73,109,0.18)" : "rgba(148,41,69,0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: `linear-gradient(135deg, ${stage.color}, #942945)`,
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
                      }}>
                        <stage.icon size={20} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10, background: "rgba(225,73,109,0.12)", color: "#e1496d" }}>
                        {stage.previewBadge}
                      </span>
                    </div>

                    <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 900, fontFamily: "Syne, sans-serif", color: isDark ? "#ffffff" : "#4a0e22" }}>
                      {stage.name}
                    </h3>
                    <p style={{ margin: "0 0 16px", fontSize: 12.5, color: isDark ? "rgba(255,255,255,0.65)" : "#6a2135", lineHeight: 1.5 }}>
                      {stage.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                      {stage.specs.slice(0, 2).map((sp, idx) => (
                        <span key={idx} style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.06)", color: isDark ? "#ff8da7" : "#942945" }}>
                          ✓ {sp}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); openModelInStudio(stage.id); }}
                      style={{
                        width: "100%", padding: "10px", borderRadius: 10,
                        background: isDark ? "rgba(225,73,109,0.15)" : "#fdf2f4",
                        color: "#e1496d", border: "1px solid rgba(225,73,109,0.3)",
                        fontWeight: 800, fontSize: 12.5, fontFamily: "Syne, sans-serif",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#e1496d"; e.currentTarget.style.color = "#ffffff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "rgba(225,73,109,0.15)" : "#fdf2f4"; e.currentTarget.style.color = "#e1496d"; }}
                    >
                      Open in 3D Viewport <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── SEARCH & CATEGORY FILTER MATRIX ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto 60px", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
            {/* Search Input */}
            <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
              <Search size={16} color={isDark ? "#8c8780" : "#a8818f"} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search 3D Rigs, PBR Shaders, Devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px 11px 38px",
                  borderRadius: 12,
                  background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                  border: `1.5px solid ${isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.14)"}`,
                  color: isDark ? "#ffffff" : "#1a040d",
                  fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Category Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { id: "all", label: "All Rigs" },
                { id: "terminals", label: "Terminals & Code" },
                { id: "hardware", label: "Hardware & Devices" },
                { id: "packaging", label: "Packaging & Retail" },
                { id: "retro", label: "Retro & Holographic" },
                { id: "social", label: "Social & OpenGraph" },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: "8px 16px", borderRadius: 10,
                    background: activeCategory === cat.id ? "#e1496d" : (isDark ? "rgba(255,255,255,0.06)" : "#ffffff"),
                    color: activeCategory === cat.id ? "#ffffff" : (isDark ? "#ffffff" : "#6a2135"),
                    border: `1px solid ${activeCategory === cat.id ? "#e1496d" : (isDark ? "rgba(225,73,109,0.2)" : "rgba(148,41,69,0.12)")}`,
                    fontWeight: 700, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARALLAX COMMUNITY FOOTER BANNER (Matches Pipelines page) ── */}
        <CommunityLandscapeBanner isDark={isDark} onNavigate={onNavigate} themeShade="pipeline" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 2: 3D THREE.JS PBR VIEWPORT & STUDIO ENGINE
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: isDark ? "#080206" : "#f8fafc",
      color: isDark ? "#ffffff" : "#0f172a",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: "flex", flexDirection: "column",
      overflow: "hidden", userSelect: "none"
    }}>
      {/* ── Top Studio Navigation Bar ── */}
      <header style={{
        height: 52,
        background: isDark ? "#12050e" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", zIndex: 30, flexShrink: 0
      }}>
        {/* Left: Back to Hub + Rig Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setViewMode("hub")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: isDark ? "rgba(225,73,109,0.12)" : "#f1f5f9",
              border: `1px solid ${isDark ? "rgba(225,73,109,0.25)" : "#e2e8f0"}`,
              color: isDark ? "#ff8da7" : "#475569",
              padding: "5px 12px", borderRadius: 8, fontSize: 12,
              fontWeight: 700, cursor: "pointer"
            }}
          >
            <ArrowLeft size={14} /> Back to Hub
          </button>

          <div style={{ height: 18, width: 1, background: isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0" }} />

          {/* Active Model Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Box size={16} color="#e1496d" />
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              style={{
                background: "transparent", border: "none",
                color: isDark ? "#ffffff" : "#0f172a",
                fontSize: 13, fontWeight: 800, fontFamily: "Syne, sans-serif",
                outline: "none", cursor: "pointer"
              }}
            >
              {STAGE_CARDS.map(s => (
                <option key={s.id} value={s.id} style={{ background: isDark ? "#160512" : "#ffffff", color: isDark ? "#fff" : "#000" }}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Camera Angles & Lighting */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Camera Angles */}
          <div style={{ display: "flex", background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9", borderRadius: 8, padding: 2 }}>
            {[
              { id: "perspective", label: "Perspective" },
              { id: "front", label: "Front" },
              { id: "isometric", label: "Isometric" },
              { id: "top", label: "Top" },
            ].map(cam => (
              <button
                key={cam.id}
                onClick={() => setCameraPreset(cam.id)}
                style={{
                  background: cameraView === cam.id ? "#e1496d" : "transparent",
                  color: cameraView === cam.id ? "#ffffff" : (isDark ? "#ffffff" : "#64748b"),
                  border: "none", borderRadius: 6,
                  padding: "4px 10px", fontSize: 11, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.15s"
                }}
              >
                {cam.label}
              </button>
            ))}
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotating(prev => !prev)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: isAutoRotating ? "rgba(225,73,109,0.18)" : (isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
              border: `1px solid ${isAutoRotating ? "#e1496d" : (isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0")}`,
              color: isAutoRotating ? "#e1496d" : (isDark ? "#ffffff" : "#64748b"),
              padding: "5px 10px", borderRadius: 8, fontSize: 11.5,
              fontWeight: 700, cursor: "pointer"
            }}
          >
            <RotateCw size={13} className={isAutoRotating ? "animate-spin" : ""} /> {isAutoRotating ? "Rotating" : "Static"}
          </button>
        </div>

        {/* Right: Snapshot & Code Copy */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleCopyReactCode}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
              border: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0"}`,
              color: isDark ? "#ffffff" : "#0f172a",
              padding: "6px 12px", borderRadius: 8, fontSize: 12,
              fontWeight: 700, cursor: "pointer"
            }}
          >
            {copiedCode ? <Check size={14} color="#10b981" /> : <Code size={14} />}
            {copiedCode ? "React Code Copied!" : "React 3D"}
          </button>

          <button
            onClick={handleCaptureSnapshot}
            disabled={isExporting}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #e1496d, #942945)",
              color: "#ffffff", border: "none",
              padding: "7px 16px", borderRadius: 8, fontSize: 12.5,
              fontWeight: 800, fontFamily: "Syne, sans-serif",
              cursor: "pointer", boxShadow: "0 4px 12px rgba(225,73,109,0.35)"
            }}
          >
            <Camera size={14} /> {isExporting ? "Baking 4K..." : "Bake 4K PNG"}
          </button>
        </div>
      </header>

      {/* ── Main Viewport Area + Right Property Inspector ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        
        {/* 3D WebGL Canvas Stage */}
        <div 
          ref={mountRef} 
          style={{ flex: 1, height: "100%", position: "relative", cursor: "grab" }} 
        />

        {/* Floating Viewport Controls (Bottom Left of Canvas) */}
        <div style={{
          position: "absolute", bottom: 20, left: 20, zIndex: 20,
          display: "flex", alignItems: "center", gap: 10,
          background: isDark ? "rgba(14, 5, 12, 0.85)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)", padding: "6px 14px", borderRadius: 14,
          border: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0"}`
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#e1496d" }}>FOV Zoom</span>
            <input
              type="range" min="25" max="75" value={focalLength}
              onChange={(e) => setFocalLength(parseInt(e.target.value))}
              style={{ width: 80, accentColor: "#e1496d", cursor: "pointer" }}
            />
            <span style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{focalLength}°</span>
          </div>

          <div style={{ height: 14, width: 1, background: isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0" }} />

          <button
            onClick={() => setShowGridFloor(prev => !prev)}
            style={{ background: "none", border: "none", color: showGridFloor ? "#e1496d" : "#8c8780", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
          >
            Grid {showGridFloor ? "ON" : "OFF"}
          </button>
        </div>

        {/* Right Inspector Panel */}
        <aside style={{
          width: 380, minWidth: 380,
          background: isDark ? "#12050e" : "#ffffff",
          borderLeft: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0"}`,
          display: "flex", flexDirection: "column",
          height: "100%", zIndex: 25
        }}>
          {/* Tab Navigation */}
          <div style={{ display: "flex", borderBottom: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0"}` }}>
            {[
              { id: "code", label: "Code & Text", icon: Code },
              { id: "materials", label: "PBR Shaders", icon: Sliders },
              { id: "lighting", label: "Lighting", icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id)}
                style={{
                  flex: 1, padding: "12px 6px",
                  background: activeSidebarTab === tab.id ? (isDark ? "rgba(225,73,109,0.14)" : "#fdf2f4") : "transparent",
                  color: activeSidebarTab === tab.id ? "#e1496d" : (isDark ? "#ffffff" : "#64748b"),
                  border: "none", borderBottom: activeSidebarTab === tab.id ? "2px solid #e1496d" : "2px solid transparent",
                  fontSize: 11.5, fontWeight: 700, fontFamily: "Syne, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  cursor: "pointer", transition: "all 0.15s"
                }}
              >
                <tab.icon size={13} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Code & Content */}
          {activeSidebarTab === "code" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: "#e1496d", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Template Files
                </label>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  {Object.keys(SAMPLE_CODE_SNIPPETS).map(file => (
                    <button
                      key={file}
                      onClick={() => {
                        setActiveFileTab(file);
                        setCustomCode(SAMPLE_CODE_SNIPPETS[file]);
                        setWindowTitle(`${file} — Creatify Engine`);
                      }}
                      style={{
                        padding: "5px 10px", borderRadius: 6,
                        background: activeFileTab === file ? "#e1496d" : (isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
                        color: activeFileTab === file ? "#fff" : (isDark ? "#fff" : "#475569"),
                        border: "none", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      {file}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor Area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 220 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: "#e1496d", textTransform: "uppercase", marginBottom: 6 }}>
                  Live Code Content (Real-time Projected)
                </label>
                <textarea
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  style={{
                    flex: 1, width: "100%",
                    background: isDark ? "#090207" : "#f8fafc",
                    border: `1px solid ${isDark ? "rgba(225,73,109,0.25)" : "#cbd5e1"}`,
                    borderRadius: 10, padding: 12,
                    color: isDark ? "#f3f4f6" : "#0f172a",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
                    lineHeight: 1.5, outline: "none", resize: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Custom Image Upload */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: "#e1496d", textTransform: "uppercase", marginBottom: 6, display: "block" }}>
                  Or Upload Custom Screenshot Image
                </label>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setUploadedImage(url);
                    }
                  }}
                  style={{ fontSize: 12 }}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Materials & Physical Shaders */}
          {activeSidebarTab === "materials" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  <span>PBR Metalness</span>
                  <span style={{ color: "#e1496d" }}>{Math.round(metalness * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05" value={metalness}
                  onChange={(e) => setMetalness(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#e1496d" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  <span>Surface Roughness</span>
                  <span style={{ color: "#e1496d" }}>{Math.round(roughness * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05" value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#e1496d" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  <span>Glass Optical Transmission</span>
                  <span style={{ color: "#e1496d" }}>{Math.round(glassTransmission * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05" value={glassTransmission}
                  onChange={(e) => setGlassTransmission(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#e1496d" }}
                />
              </div>

              {/* Wireframe Toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0"}` }}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>Wireframe Geometry Mode</span>
                <button
                  onClick={() => setWireframeMode(prev => !prev)}
                  style={{
                    padding: "4px 12px", borderRadius: 8,
                    background: wireframeMode ? "#e1496d" : (isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
                    color: wireframeMode ? "#fff" : (isDark ? "#fff" : "#475569"),
                    border: "none", fontWeight: 700, fontSize: 11, cursor: "pointer"
                  }}
                >
                  {wireframeMode ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Lighting Rig */}
          {activeSidebarTab === "lighting" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: "#e1496d", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Studio Lighting Rigs
              </label>

              {[
                { id: "cyber", name: "Cyberpunk Neon (Magenta / Cyan)", color: "#e1496d" },
                { id: "studio", name: "Studio Softbox (Neutral 5600K)", color: "#0284c7" },
                { id: "matrix", name: "Matrix Emerald Terminal", color: "#10b981" },
                { id: "sunset", name: "Sunset Amber & Rose Gold", color: "#f59e0b" },
                { id: "neon_tokyo", name: "Tokyo Midnight Purple", color: "#9333ea" },
                { id: "clean_white", name: "Clean Minimalist Daylight", color: "#64748b" },
              ].map(lit => (
                <div
                  key={lit.id}
                  onClick={() => setActiveLighting(lit.id)}
                  style={{
                    padding: "12px 14px", borderRadius: 10,
                    background: activeLighting === lit.id ? (isDark ? "rgba(225,73,109,0.18)" : "#fdf2f4") : (isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"),
                    border: `1.5px solid ${activeLighting === lit.id ? "#e1496d" : (isDark ? "rgba(225,73,109,0.2)" : "#e2e8f0")}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", transition: "all 0.15s"
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{lit.name}</span>
                  {activeLighting === lit.id && <Check size={14} color="#e1496d" />}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* Success Toast for 4K Export */}
      {showExportSuccess && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 100,
          background: "#10b981", color: "#ffffff",
          padding: "12px 20px", borderRadius: 12,
          fontWeight: 700, fontSize: 13, fontFamily: "Syne, sans-serif",
          boxShadow: "0 10px 30px rgba(16,185,129,0.4)",
          display: "flex", alignItems: "center", gap: 8
        }}>
          <CheckCircle2 size={18} /> 4K Lossless 3D Render Saved!
        </div>
      )}
    </div>
  );
}
