import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { 
  ArrowLeft, Camera, RotateCw, Sun, Moon, 
  Download, Upload, Sliders, Sparkles, Image as ImageIcon, Box,
  Terminal, Globe, Code, Copy, Check, RefreshCw, Layers, Monitor,
  Smartphone, Shield, Layout, Eye, Cpu, ZoomIn, ZoomOut, CheckCheck,
  Radio, Sparkle, Palette, Maximize2, FileCode, Disc, Package
} from "lucide-react";

export default function MockupStudio({ onBack, user, onNavigate }) {
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

  // ── Syntax Color Themes ──
  const CODE_THEMES = {
    synthwave: { bg: "#140618", border: "#e1496d", comment: "#6d5475", keyword: "#ff7edb", string: "#72f1b8", function: "#36f9f6", number: "#fede5d", type: "#fe4450", text: "#f8f8f2" },
    onedark: { bg: "#1e1e24", border: "#61afef", comment: "#5c6370", keyword: "#c678dd", string: "#98c379", function: "#61afef", number: "#d19a66", type: "#e5c07b", text: "#abb2bf" },
    dracula: { bg: "#181424", border: "#bd93f9", comment: "#6272a4", keyword: "#ff79c6", string: "#f1fa8c", function: "#50fa7b", number: "#bd93f9", type: "#8be9fd", text: "#f8f8f2" },
    matrix: { bg: "#040e06", border: "#00ff66", comment: "#1e5c26", keyword: "#00ff66", string: "#80ffaa", function: "#33ff77", number: "#66ff99", type: "#00ff88", text: "#00ff44" },
    github: { bg: "#0d1117", border: "#38bdf8", comment: "#8b949e", keyword: "#ff7b72", string: "#a5d6ff", function: "#d2a8ff", number: "#79c0ff", type: "#ffa657", text: "#c9d1d9" },
    neon_tokyo: { bg: "#0f0e17", border: "#ff8906", comment: "#a7a9be", keyword: "#ff8906", string: "#f25f4c", function: "#e53170", number: "#fffffe", type: "#ff8906", text: "#fffffe" },
  };

  // ── Multi-Token Syntax Lexer for High-Resolution 3D Projection ──
  const tokenizeLine = (line, th) => {
    if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      return [{ text: line, color: th.comment, italic: true }];
    }

    const tokens = [];
    const words = line.split(/(\s+|[(),={}:;.[\]<>"]|=>)/g).filter(Boolean);
    let inString = false;

    words.forEach(w => {
      if (w === '"' || w === "'" || w === "`") {
        inString = !inString;
        tokens.push({ text: w, color: th.string });
        return;
      }
      if (inString) {
        tokens.push({ text: w, color: th.string });
        return;
      }

      if (/^(import|export|from|function|async|await|const|let|var|return|class|struct|pub|fn|use|def|class|if|else|for|while|try|catch)$/.test(w)) {
        tokens.push({ text: w, color: th.keyword, bold: true });
      } else if (/^(string|number|boolean|Promise|NextRequest|NextResponse|dict|Tensor|Vec3|Result|Option|void|any|Record)$/.test(w)) {
        tokens.push({ text: w, color: th.type });
      } else if (/^(true|false|null|undefined|None|Some|Ok|Err)$/.test(w) || /^\d+(\.\d+)?(ms|s|px|rem|em)?$/.test(w)) {
        tokens.push({ text: w, color: th.number });
      } else if (/^[A-Z][a-zA-Z0-9_]*$/.test(w)) {
        tokens.push({ text: w, color: th.function });
      } else if (w.includes("(") || /^(console|log|json|generate3DMockup|createSpatialWorkspace|compile_pbr_shader|forward)$/.test(w)) {
        tokens.push({ text: w, color: th.function });
      } else {
        tokens.push({ text: w, color: th.text });
      }
    });

    return tokens;
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
      // ── ULTRA-MODERN SLEEK FLOATING TERMINAL / IDE WORKBENCH ──
      // Clean Deep Terminal Background with Soft Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, th.bg);
      bgGrad.addColorStop(1, activeModel === "crt_monitor" ? "#020a04" : "#0a0208");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Delicate 1px Outer Border
      ctx.strokeStyle = th.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Top Sleek Header & Tab Bar (Compact 68px height)
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, 68);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 68);
      ctx.lineTo(canvas.width, 68);
      ctx.stroke();

      // Modern Minimalist macOS Window Traffic Lights
      ctx.fillStyle = "#ff5f56"; ctx.beginPath(); ctx.arc(36, 34, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffbd2e"; ctx.beginPath(); ctx.arc(68, 34, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#27c93f"; ctx.beginPath(); ctx.arc(100, 34, 10, 0, Math.PI * 2); ctx.fill();

      // Compact Modern Tabs
      const files = ["server.ts", "pipeline.rs", "model.py", "docker.yml"];
      let tabX = 145;
      files.forEach(f => {
        const isActive = activeFileTab === f;
        ctx.fillStyle = isActive ? "rgba(225, 73, 109, 0.28)" : "rgba(255, 255, 255, 0.03)";
        ctx.beginPath();
        ctx.roundRect(tabX, 12, 210, 44, 8);
        ctx.fill();
        ctx.strokeStyle = isActive ? th.border : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.55)";
        ctx.font = "600 18px 'JetBrains Mono', Consolas, monospace";
        ctx.textAlign = "left";
        ctx.fillText(`⚡ ${f}`, tabX + 18, 40);
        tabX += 222;
      });

      // Subtle Breadcrumb Path (Compact 36px)
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.fillRect(0, 68, canvas.width, 36);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "16px 'JetBrains Mono', monospace";
      ctx.fillText(`src > components > ${activeFileTab} > export async function bootstrapStudio()`, 36, 92);

      // ── CRISP, MODERN CODE LINES (Refined 22px Font Size & 34px Spacing) ──
      ctx.textAlign = "left";
      ctx.font = "22px 'JetBrains Mono', Consolas, monospace";
      const lines = customCode.split("\n");
      let lineY = 144;

      lines.forEach((l, idx) => {
        // Crisp Line number
        ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
        ctx.font = "17px 'JetBrains Mono', monospace";
        ctx.fillText(String(idx + 1).padStart(2, " "), 32, lineY);

        // Lexed Tokens with Refined Typography
        ctx.font = "22px 'JetBrains Mono', Consolas, monospace";
        const tokens = tokenizeLine(l, th);
        let tokenX = 86;
        tokens.forEach(tok => {
          ctx.fillStyle = tok.color;
          ctx.fillText(tok.text, tokenX, lineY);
          tokenX += ctx.measureText(tok.text).width;
        });

        lineY += 34; // Sleek modern line step
      });

      // Sleek Neon Pulsing Cursor
      ctx.fillStyle = th.border;
      ctx.fillRect(lines[lines.length - 1].length * 13.5 + 96, lineY - 34, 10, 24);

      // Compact Modern Status Bar (Height 42px)
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(0, canvas.height - 42, canvas.width, 42);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, canvas.height - 42, canvas.width, 42);

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`⎇ main*  •  TypeScript 5.4  •  UTF-8  •  Ln ${lines.length}, Col 24  •  ✓ 0 Errors`, 30, canvas.height - 15);

      // CRT Scanline Shader Overlay (If CRT Model)
      if (activeModel === "crt_monitor") {
        ctx.fillStyle = "rgba(0, 255, 100, 0.04)";
        for (let y = 0; y < canvas.height; y += 4) {
          ctx.fillRect(0, y, canvas.width, 2);
        }
      }

    } else if (activeModel === "browser") {
      // ── BROWSER CHROME FRAME TEXTURE ──
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Chrome Header Bar
      ctx.fillStyle = "#161b22";
      ctx.fillRect(0, 0, canvas.width, 78);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, 78);

      // Dots
      ctx.fillStyle = "#ff5f56"; ctx.beginPath(); ctx.arc(36, 39, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffbd2e"; ctx.beginPath(); ctx.arc(68, 39, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#27c93f"; ctx.beginPath(); ctx.arc(100, 39, 10, 0, Math.PI * 2); ctx.fill();

      // URL Pill Bar
      ctx.fillStyle = "#0d1117";
      ctx.beginPath();
      ctx.roundRect(140, 16, canvas.width - 280, 46, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(225, 73, 109, 0.4)";
      ctx.stroke();

      ctx.fillStyle = "#e1496d";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("🔒", 165, 46);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "bold 20px 'JetBrains Mono', monospace";
      ctx.fillText(urlBarText, 200, 46);

      // Body Gradient
      const bodyGrad = ctx.createLinearGradient(0, 78, canvas.width, canvas.height);
      bodyGrad.addColorStop(0, "#130510");
      bodyGrad.addColorStop(0.5, "#26091e");
      bodyGrad.addColorStop(1, "#0d0309");
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(0, 78, canvas.width, canvas.height - 78);

      // Hero Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 58px 'Syne', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Creatify Developer Cloud", canvas.width / 2, 280);

      ctx.fillStyle = "#ff8da7";
      ctx.font = "26px 'Instrument Sans', sans-serif";
      ctx.fillText("Production-grade creative engines right in your browser", canvas.width / 2, 340);

      // 3 SaaS Cards
      [0, 1, 2].forEach(i => {
        const cardX = 180 + i * 580;
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.beginPath();
        ctx.roundRect(cardX, 440, 520, 480, 20);
        ctx.fill();
        ctx.strokeStyle = "rgba(225, 73, 109, 0.3)";
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(i === 0 ? "⚡ 4K Raytracer" : i === 1 ? "📦 Component SDK" : "🔗 CI/CD Pipelines", cardX + 30, 500);

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "20px sans-serif";
        ctx.fillText("Lossless GPU shaders and", cardX + 30, 550);
        ctx.fillText("instant React code generation.", cardX + 30, 582);
      });

    } else if (activeModel === "github_readme" || activeModel === "software_box") {
      // ── GITHUB README HERO BANNER / SOFTWARE PACKAGING ──
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 68px 'Syne', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`⚡ ${repoTitle}`, canvas.width / 2, 280);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "30px 'Instrument Sans', sans-serif";
      ctx.fillText(repoTagline, canvas.width / 2, 360);

      const badges = ["⭐ 14.8k Stars", "🚀 npm v4.2.0", "🛡️ MIT License", "⚡ Zero Lock-in"];
      badges.forEach((b, i) => {
        const bx = 360 + i * 350;
        ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
        ctx.beginPath();
        ctx.roundRect(bx, 450, 290, 54, 12);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px 'JetBrains Mono', monospace";
        ctx.fillText(b, bx + 145, 485);
      });

      // Quick Install Box
      ctx.fillStyle = "#161b22";
      ctx.beginPath();
      ctx.roundRect(400, 570, canvas.width - 800, 90, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(225, 73, 109, 0.5)";
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 28px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("$ npx creatify-engine init my-project", canvas.width / 2, 626);

    } else {
      // General Fallback Screen
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#e1496d");
      grad.addColorStop(0.5, "#180614");
      grad.addColorStop(1, "#030712");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 68px 'Syne', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CREATIFY DEVELOPER OS", canvas.width / 2, 540);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "32px 'JetBrains Mono', monospace";
      ctx.fillText("v2.4.0-pro • GPU PBR Active", canvas.width / 2, 620);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [activeModel, codeTheme, customCode, windowTitle, urlBarText, repoTitle, repoTagline, activeFileTab, uploadedImage]);

  // ── Three.js Scene Lifecycle ──
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(focalLength, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // ── 3D Studio Perspective Floor Grid ──
    const gridHelper = new THREE.GridHelper(30, 40, 0xe1496d, 0x261020);
    gridHelper.position.y = -2.8;
    gridHelper.material.opacity = 0.35;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // ── Ambient Floating Cyber Particles ──
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 20;
      posArray[i + 1] = (Math.random() - 0.5) * 16;
      posArray[i + 2] = (Math.random() - 0.5) * 15;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.07,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // ── Dynamic Studio Lights ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe1496d, 2.2);
    dirLight1.position.set(6, 7, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0xff8da7, 1.6, 15);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    lightsRef.current = { ambient: ambientLight, key: dirLight1, fill: dirLight2, rim: rimLight };

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Build Model
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

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isAutoRotating && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += 0.004;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.03;
        particlesRef.current.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;
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
  }, [bgColor, focalLength]);

  // ── Construct 3D Geometries & Textures (Ultra-Thin Sleek Bezel Frame) ──
  const build3DModel = (type, group) => {
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const screenTex = generateTextureCanvas();

    const matDarkFrame = new THREE.MeshStandardMaterial({
      color: 0x121218,
      metalness: metalness,
      roughness: roughness,
    });

    const matGlassScreen = new THREE.MeshBasicMaterial({
      map: screenTex,
    });

    if (type === "terminal" || type === "browser" || type === "github_readme" || type === "glass_card") {
      // ── ULTRA-SLEEK MODERN FLOATING SLAB (ZERO CLUNKY BORDER) ──
      const width = type === "github_readme" ? 6.2 : 5.4;
      const height = type === "github_readme" ? 3.6 : 3.5;

      if (type === "glass_card") {
        // Frosted Glass Slab
        const glassGeo = new THREE.BoxGeometry(width + 0.04, height + 0.04, 0.08);
        const glassMat = new THREE.MeshPhysicalMaterial({
          map: screenTex,
          transmission: glassTransmission,
          opacity: 1,
          transparent: true,
          roughness: 0.06,
          metalness: 0.15,
          ior: 1.52,
        });
        const card = new THREE.Mesh(glassGeo, glassMat);
        group.add(card);
      } else {
        // Micro-Thin Modern Chamfered Bezel (Only 0.02 thickness!)
        const frameGeo = new THREE.BoxGeometry(width + 0.04, height + 0.04, 0.06);
        const frame = new THREE.Mesh(frameGeo, matDarkFrame);
        group.add(frame);

        // Screen Face with Edge-to-Edge Fill
        const screenGeo = new THREE.PlaneGeometry(width, height);
        const screen = new THREE.Mesh(screenGeo, matGlassScreen);
        screen.position.z = 0.032;
        group.add(screen);
        screenMeshRef.current = screen;
      }

      // Soft Backplate Glass Drop Glow
      const glowGeo = new THREE.PlaneGeometry(width + 0.6, height + 0.6);
      const glowMat = new THREE.MeshBasicMaterial({
        color: type === "terminal" ? 0xe1496d : (type === "github_readme" ? 0x38bdf8 : 0xc084fc),
        transparent: true,
        opacity: 0.12,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.z = -0.06;
      group.add(glow);

    } else if (type === "macbook") {
      // ── MACBOOK PRO WORKSTATION (Sleek Modern Bezel) ──
      const baseGeo = new THREE.BoxGeometry(5.4, 0.14, 3.5);
      const base = new THREE.Mesh(baseGeo, matDarkFrame);
      base.position.y = -1.0;
      group.add(base);

      const trackpadGeo = new THREE.PlaneGeometry(1.7, 1.1);
      const trackpadMat = new THREE.MeshStandardMaterial({ color: 0x1e1e26, roughness: 0.4 });
      const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
      trackpad.rotation.x = -Math.PI / 2;
      trackpad.position.set(0, -0.925, 0.85);
      group.add(trackpad);

      const lidGeo = new THREE.BoxGeometry(5.4, 3.5, 0.06);
      const lid = new THREE.Mesh(lidGeo, matDarkFrame);
      lid.position.set(0, 0.7, -1.65);
      lid.rotation.x = -Math.PI / 12;
      group.add(lid);

      const displayGeo = new THREE.PlaneGeometry(5.25, 3.35);
      const display = new THREE.Mesh(displayGeo, matGlassScreen);
      display.position.set(0, 0.7, -1.61);
      display.rotation.x = -Math.PI / 12;
      group.add(display);
      screenMeshRef.current = display;

    } else if (type === "crt_monitor") {
      // ── RETRO CRT DEVELOPER TERMINAL ──
      const crtBodyGeo = new THREE.BoxGeometry(5.2, 4.4, 3.2);
      const crtBody = new THREE.Mesh(crtBodyGeo, new THREE.MeshStandardMaterial({ color: 0x181816, roughness: 0.6 }));
      group.add(crtBody);

      const crtScreenGeo = new THREE.PlaneGeometry(4.4, 3.6);
      const crtScreen = new THREE.Mesh(crtScreenGeo, matGlassScreen);
      crtScreen.position.z = 1.61;
      group.add(crtScreen);
      screenMeshRef.current = crtScreen;

      const crtStandGeo = new THREE.CylinderGeometry(1.2, 1.6, 0.8, 32);
      const crtStand = new THREE.Mesh(crtStandGeo, matDarkFrame);
      crtStand.position.y = -2.4;
      group.add(crtStand);

    } else if (type === "software_box") {
      // ── ENTERPRISE DEVELOPER SOFTWARE BOX ──
      const boxGeo = new THREE.BoxGeometry(3.6, 5.0, 1.2);
      const boxMat = new THREE.MeshPhysicalMaterial({
        map: screenTex,
        roughness: 0.15,
        metalness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      group.add(box);

    } else if (type === "iphone") {
      // ── IPHONE 16 PRO (Edge-to-Edge Glass) ──
      const bodyGeo = new THREE.BoxGeometry(2.3, 4.7, 0.18);
      const body = new THREE.Mesh(bodyGeo, matDarkFrame);
      group.add(body);

      const screenGeo = new THREE.PlaneGeometry(2.22, 4.62);
      const screen = new THREE.Mesh(screenGeo, matGlassScreen);
      screen.position.z = 0.095;
      group.add(screen);
      screenMeshRef.current = screen;

      const camBumpGeo = new THREE.BoxGeometry(0.9, 0.9, 0.08);
      const camBump = new THREE.Mesh(camBumpGeo, matDarkFrame);
      camBump.position.set(-0.55, 1.7, -0.14);
      group.add(camBump);

    } else if (type === "dual_monitor") {
      // ── DUAL DEVELOPER BATTLESTATION (Thin Bezels) ──
      const mainGeo = new THREE.BoxGeometry(4.8, 2.8, 0.1);
      const main = new THREE.Mesh(mainGeo, matDarkFrame);
      main.position.set(-0.6, 0.2, 0);
      group.add(main);

      const mainScreenGeo = new THREE.PlaneGeometry(4.72, 2.72);
      const mainScreen = new THREE.Mesh(mainScreenGeo, matGlassScreen);
      mainScreen.position.set(-0.6, 0.2, 0.055);
      group.add(mainScreen);

      const vertGeo = new THREE.BoxGeometry(1.9, 3.4, 0.1);
      const vert = new THREE.Mesh(vertGeo, matDarkFrame);
      vert.position.set(2.6, 0.2, -0.3);
      vert.rotation.y = -Math.PI / 8;
      group.add(vert);

      const vertScreenGeo = new THREE.PlaneGeometry(1.82, 3.32);
      const vertScreen = new THREE.Mesh(vertScreenGeo, matGlassScreen);
      vertScreen.position.set(2.6, 0.2, -0.245);
      vertScreen.rotation.y = -Math.PI / 8;
      group.add(vertScreen);

      const standPoleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2);
      const standPole = new THREE.Mesh(standPoleGeo, matDarkFrame);
      standPole.position.set(-0.6, -1.0, -0.3);
      group.add(standPole);

      const standBaseGeo = new THREE.BoxGeometry(1.4, 0.08, 1.0);
      const standBase = new THREE.Mesh(standBaseGeo, matDarkFrame);
      standBase.position.set(-0.6, -2.1, -0.3);
      group.add(standBase);
    }
  };

  // Rebuild model when configuration changes
  useEffect(() => {
    if (modelGroupRef.current) {
      build3DModel(activeModel, modelGroupRef.current);
    }
  }, [activeModel, codeTheme, customCode, windowTitle, urlBarText, repoTitle, repoTagline, activeFileTab, uploadedImage, roughness, metalness, glassTransmission]);

  // Handle file tab click
  const handleFileTabSelect = (filename) => {
    setActiveFileTab(filename);
    if (SAMPLE_CODE_SNIPPETS[filename]) {
      setCustomCode(SAMPLE_CODE_SNIPPETS[filename]);
    }
  };

  // Switch Lighting
  const handleLightingChange = (lightPreset) => {
    setActiveLighting(lightPreset);
    if (!lightsRef.current.key) return;

    if (lightPreset === "cyber") {
      lightsRef.current.key.color.setHex(0xe1496d);
      lightsRef.current.fill.color.setHex(0x38bdf8);
      setBgColor("#080206");
    } else if (lightPreset === "matrix") {
      lightsRef.current.key.color.setHex(0x00ff66);
      lightsRef.current.fill.color.setHex(0x008833);
      setBgColor("#020904");
    } else if (lightPreset === "studio") {
      lightsRef.current.key.color.setHex(0xffffff);
      lightsRef.current.fill.color.setHex(0xe2e8f0);
      setBgColor("#0d0f14");
    } else if (lightPreset === "monokai") {
      lightsRef.current.key.color.setHex(0xf92672);
      lightsRef.current.fill.color.setHex(0xa6e22e);
      setBgColor("#09040b");
    } else if (lightPreset === "sunset") {
      lightsRef.current.key.color.setHex(0xf59e0b);
      lightsRef.current.fill.color.setHex(0xe1496d);
      setBgColor("#0f0502");
    } else if (lightPreset === "neon_tokyo") {
      lightsRef.current.key.color.setHex(0xff8906);
      lightsRef.current.fill.color.setHex(0xf25f4c);
      setBgColor("#08070d");
    }
  };

  // Camera Quick Views
  const setPresetView = (view) => {
    setCameraView(view);
    if (!cameraRef.current || !modelGroupRef.current) return;

    if (view === "front") {
      modelGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0, 7.5);
    } else if (view === "perspective") {
      modelGroupRef.current.rotation.set(0.12, -0.35, 0);
      cameraRef.current.position.set(0, 0, 8);
    } else if (view === "isometric") {
      modelGroupRef.current.rotation.set(0.4, 0.6, -0.2);
      cameraRef.current.position.set(0, 0, 8.5);
    } else if (view === "cinematic") {
      modelGroupRef.current.rotation.set(-0.2, 0.45, 0.15);
      cameraRef.current.position.set(0, 0.5, 7.2);
    }
  };

  // Toggle Grid
  const toggleGrid = () => {
    setShowGridFloor(prev => {
      if (gridHelperRef.current) gridHelperRef.current.visible = !prev;
      return !prev;
    });
  };

  // Toggle Particles
  const toggleParticles = () => {
    setShowParticles(prev => {
      if (particlesRef.current) particlesRef.current.visible = !prev;
      return !prev;
    });
  };

  // Download Snapshot
  const downloadSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `creatify_${activeModel}_mockup_4k.png`;
    link.href = dataUrl;
    link.click();
  };

  // Copy Markdown
  const copyMarkdownSnippet = () => {
    const md = `<!-- 🚀 Hero 3D Mockup generated with Creatify -->\n<p align="center">\n  <img src="./assets/creatify_${activeModel}_mockup.png" alt="${windowTitle}" width="850" />\n</p>`;
    navigator.clipboard.writeText(md);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      height: "100vh", width: "100vw", overflow: "hidden",
      background: bgColor, color: "#f3f4f6",
      fontFamily: "'Instrument Sans', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      
      {/* ── Top Bar ── */}
      <header style={{
        height: 54, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(225, 73, 109, 0.22)",
        background: "rgba(12, 4, 10, 0.94)", backdropFilter: "blur(18px)",
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(225, 73, 109, 0.14)", border: "1px solid rgba(225, 73, 109, 0.35)",
              color: "#ff8da7", borderRadius: 8, padding: "6px 12px",
              cursor: "pointer", fontSize: 12.5, fontWeight: 700,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: 16.5, fontWeight: 800, color: "#fff" }}>
              3D Mockup Studio for Developers
            </span>
            <span style={{
              fontSize: 9.5, padding: "2px 8px", borderRadius: 99,
              background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.4)", fontWeight: 800,
              letterSpacing: "0.06em",
            }}>
              WEBGL PBR ENGINE
            </span>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={copyMarkdownSnippet}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#ffffff", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s ease",
            }}
          >
            {copiedCode ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
            <span>{copiedCode ? "Copied Markdown!" : "Copy README.md"}</span>
          </button>

          <button
            onClick={downloadSnapshot}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 18px", borderRadius: 8,
              background: "linear-gradient(135deg, #e1496d, #942945)",
              border: "none", color: "#ffffff",
              fontSize: 12.5, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 4px 16px rgba(225, 73, 109, 0.45)",
            }}
          >
            <Download size={14} />
            <span>Download 4K PNG</span>
          </button>
        </div>
      </header>

      {/* ── Main Workspace ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        
        {/* Left Side Customizer Drawer */}
        <div style={{
          width: 300, borderRight: "1px solid rgba(225, 73, 109, 0.18)",
          background: "rgba(14, 5, 12, 0.9)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", zIndex: 40,
        }}>
          {/* Navigation Tab Bar */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(225, 73, 109, 0.16)", background: "rgba(0,0,0,0.25)" }}>
            {[
              { id: "models", label: "3D Rigs", icon: Box },
              { id: "code", label: "Code & Tabs", icon: Code },
              { id: "studio", label: "Stage & Lights", icon: Sun },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id)}
                  style={{
                    flex: 1, padding: "9px 4px",
                    background: isActive ? "rgba(225, 73, 109, 0.2)" : "transparent",
                    border: "none", borderBottom: isActive ? "2.5px solid #e1496d" : "2.5px solid transparent",
                    color: isActive ? "#ff8da7" : "rgba(255, 255, 255, 0.6)",
                    fontSize: 10.5, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  }}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            
            {/* ── TAB 1: 3D RIG MODELS ── */}
            {activeSidebarTab === "models" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#ff8da7", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Developer Rig Presets
                </span>

                {[
                  { id: "terminal", label: "Terminal Window (CLI)", tag: "DEV FAVORITE", icon: Terminal, desc: "macOS / Linux terminal with AST syntax" },
                  { id: "glass_card", label: "Ray.so Glass Scribe Card", tag: "NEO-BRUTAL", icon: Sparkles, desc: "Dielectric frosted glass floating code card" },
                  { id: "browser", label: "Clean Browser Chrome", tag: "SAAS HERO", icon: Globe, desc: "Dark glass browser with custom URL bar" },
                  { id: "github_readme", label: "GitHub README Banner", tag: "REPO HERO", icon: Layout, desc: "Widescreen hero with stars & install box" },
                  { id: "crt_monitor", label: "Retro CRT Terminal", tag: "FALLOUT GREEN", icon: Disc, desc: "Curved cathode tube with phosphor scanlines" },
                  { id: "software_box", label: "3D Software Box Packaging", tag: "PHYSICAL", icon: Package, desc: "Retail enterprise dev box with clearcoat" },
                  { id: "macbook", label: "MacBook Pro M3 Max", tag: "WORKSTATION", icon: Monitor, desc: "Aluminum unibody laptop with Retina display" },
                  { id: "iphone", label: "iPhone 16 Pro Titanium", tag: "MOBILE APP", icon: Smartphone, desc: "Ceramic glass with Dynamic Island" },
                  { id: "dual_monitor", label: "Dual BattleStation", tag: "ULTRAWIDE", icon: Layers, desc: "Ultrawide horizontal + vertical portrait monitor" },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = activeModel === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveModel(item.id)}
                      style={{
                        padding: "10px 12px", borderRadius: 10,
                        background: isSelected ? "rgba(225, 73, 109, 0.22)" : "rgba(255, 255, 255, 0.03)",
                        border: `1.5px solid ${isSelected ? "#e1496d" : "rgba(255, 255, 255, 0.07)"}`,
                        cursor: "pointer", transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Icon size={14} color={isSelected ? "#ff8da7" : "#38bdf8"} />
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: isSelected ? "#ffffff" : "#e5e7eb" }}>
                            {item.label}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 8, padding: "1px 5px", borderRadius: 4,
                          background: isSelected ? "#e1496d" : "rgba(56, 189, 248, 0.15)",
                          color: isSelected ? "#ffffff" : "#38bdf8", fontWeight: 800,
                        }}>
                          {item.tag}
                        </span>
                      </div>
                      <p style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.5)", margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TAB 2: CODE & CONTENT CUSTOMIZER ── */}
            {activeSidebarTab === "code" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                
                {/* 1-Click Code Presets */}
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#ff8da7", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                    Quick Code Presets
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {[
                      { id: "server.ts", label: "Next.js / TS" },
                      { id: "pipeline.rs", label: "Rust WebGPU" },
                      { id: "model.py", label: "PyTorch AI" },
                      { id: "docker.yml", label: "Docker Swarm" },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => handleFileTabSelect(f.id)}
                        style={{
                          padding: "4px 8px", borderRadius: 6,
                          background: activeFileTab === f.id ? "#e1496d" : "rgba(255, 255, 255, 0.05)",
                          border: `1px solid ${activeFileTab === f.id ? "#ff8da7" : "rgba(255, 255, 255, 0.1)"}`,
                          color: "#ffffff", fontSize: 10, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Syntax Theme Selector */}
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#ff8da7", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                    Syntax Color Theme
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5 }}>
                    {[
                      { id: "synthwave", label: "Synthwave 84", color: "#ff7edb" },
                      { id: "onedark", label: "One Dark Pro", color: "#61afef" },
                      { id: "dracula", label: "Dracula", color: "#bd93f9" },
                      { id: "matrix", label: "Matrix Green", color: "#00ff66" },
                      { id: "github", label: "GitHub Dark", color: "#79c0ff" },
                      { id: "neon_tokyo", label: "Neon Tokyo", color: "#ff8906" },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setCodeTheme(t.id)}
                        style={{
                          padding: "5px 6px", borderRadius: 6,
                          background: codeTheme === t.id ? "rgba(225, 73, 109, 0.25)" : "rgba(255, 255, 255, 0.04)",
                          border: `1px solid ${codeTheme === t.id ? t.color : "rgba(255, 255, 255, 0.08)"}`,
                          color: codeTheme === t.id ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          fontSize: 10, fontWeight: 600, cursor: "pointer", textAlign: "left",
                          display: "flex", alignItems: "center", gap: 5,
                        }}
                      >
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} />
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Specific Text Inputs */}
                {activeModel === "terminal" && (
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 3 }}>
                      Window Header Title
                    </label>
                    <input
                      type="text"
                      value={windowTitle}
                      onChange={e => setWindowTitle(e.target.value)}
                      style={{
                        width: "100%", padding: "6px 8px", borderRadius: 6,
                        background: "rgba(0,0,0,0.4)", border: "1px solid rgba(225, 73, 109, 0.3)",
                        color: "#fff", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        boxSizing: "border-box", outline: "none",
                      }}
                    />
                  </div>
                )}

                {activeModel === "browser" && (
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 3 }}>
                      URL Bar Address
                    </label>
                    <input
                      type="text"
                      value={urlBarText}
                      onChange={e => setUrlBarText(e.target.value)}
                      style={{
                        width: "100%", padding: "6px 8px", borderRadius: 6,
                        background: "rgba(0,0,0,0.4)", border: "1px solid rgba(225, 73, 109, 0.3)",
                        color: "#fff", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        boxSizing: "border-box", outline: "none",
                      }}
                    />
                  </div>
                )}

                {activeModel === "github_readme" && (
                  <>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 3 }}>
                        Repo Title
                      </label>
                      <input
                        type="text"
                        value={repoTitle}
                        onChange={e => setRepoTitle(e.target.value)}
                        style={{
                          width: "100%", padding: "6px 8px", borderRadius: 6,
                          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(225, 73, 109, 0.3)",
                          color: "#fff", fontSize: 11, boxSizing: "border-box", outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 3 }}>
                        Repo Tagline
                      </label>
                      <input
                        type="text"
                        value={repoTagline}
                        onChange={e => setRepoTagline(e.target.value)}
                        style={{
                          width: "100%", padding: "6px 8px", borderRadius: 6,
                          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(225, 73, 109, 0.3)",
                          color: "#fff", fontSize: 11, boxSizing: "border-box", outline: "none",
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Source Code Editor */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <label style={{ fontSize: 10, fontWeight: 800, color: "#ff8da7", textTransform: "uppercase" }}>
                      Source Code
                    </label>
                    <span style={{ fontSize: 9, color: "#38bdf8" }}>Live 3D Sync</span>
                  </div>
                  <textarea
                    rows={7}
                    value={customCode}
                    onChange={e => {
                      setCustomCode(e.target.value);
                      setUploadedImage(null);
                    }}
                    style={{
                      width: "100%", padding: "8px", borderRadius: 8,
                      background: "#080206", border: "1px solid rgba(225, 73, 109, 0.4)",
                      color: "#38bdf8", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace",
                      boxSizing: "border-box", resize: "vertical", outline: "none", lineHeight: 1.4,
                    }}
                  />
                </div>

                {/* Upload Screenshot Option */}
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 3 }}>
                    Or Upload Custom Screenshot
                  </label>
                  <label style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    padding: "7px 10px", borderRadius: 6,
                    background: "rgba(56, 189, 248, 0.12)", border: "1px dashed rgba(56, 189, 248, 0.4)",
                    color: "#38bdf8", fontSize: 11, fontWeight: 600, cursor: "pointer",
                  }}>
                    <Upload size={13} />
                    <span>Upload Image / PNG</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  </label>
                  {uploadedImage && (
                    <button
                      onClick={() => setUploadedImage(null)}
                      style={{
                        width: "100%", marginTop: 5, padding: "4px", borderRadius: 5,
                        background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#f87171", fontSize: 10, cursor: "pointer",
                      }}
                    >
                      Clear Uploaded Image
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 3: STUDIO STAGE & SHADERS ── */}
            {activeSidebarTab === "studio" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* Stage Toggles */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#ff8da7", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                    Stage Environment
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={toggleGrid}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8,
                        background: showGridFloor ? "rgba(225, 73, 109, 0.25)" : "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${showGridFloor ? "#e1496d" : "rgba(255, 255, 255, 0.1)"}`,
                        color: "#ffffff", fontSize: 11, fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {showGridFloor ? "✓ Grid Floor" : "+ Grid Floor"}
                    </button>

                    <button
                      onClick={toggleParticles}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8,
                        background: showParticles ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${showParticles ? "#38bdf8" : "rgba(255, 255, 255, 0.1)"}`,
                        color: "#ffffff", fontSize: 11, fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {showParticles ? "✓ Dust Sparks" : "+ Dust Sparks"}
                    </button>
                  </div>
                </div>

                {/* Lighting Presets */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#ff8da7", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                    Studio Lighting Shaders
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 7 }}>
                    {[
                      { id: "cyber", label: "Cyberpunk Neon (Rose & Cyan)", desc: "High contrast dual-tone glow" },
                      { id: "matrix", label: "Matrix Terminal Green", desc: "Hacker phosphor aesthetic" },
                      { id: "neon_tokyo", label: "Tokyo Synthwave Amber", desc: "Warm coral and violet rim lights" },
                      { id: "studio", label: "Clean Product White", desc: "Neutral softbox daylight" },
                      { id: "monokai", label: "Monokai Vivid Glow", desc: "Magenta and lime key lights" },
                      { id: "sunset", label: "Golden Hour Glow", desc: "Warm amber sunburst" },
                    ].map(l => (
                      <button
                        key={l.id}
                        onClick={() => handleLightingChange(l.id)}
                        style={{
                          padding: "9px 12px", borderRadius: 10,
                          background: activeLighting === l.id ? "rgba(225, 73, 109, 0.24)" : "rgba(255, 255, 255, 0.04)",
                          border: `1.5px solid ${activeLighting === l.id ? "#e1496d" : "rgba(255, 255, 255, 0.08)"}`,
                          color: activeLighting === l.id ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                          fontSize: 11.5, fontWeight: 700, cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <div>{l.label}</div>
                        <div style={{ fontSize: 9.5, color: "rgba(255, 255, 255, 0.5)", marginTop: 2 }}>{l.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Camera Focal Length */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#ff8da7", marginBottom: 4 }}>
                    <span>Camera Focal Length (FOV)</span>
                    <span>{focalLength}mm</span>
                  </div>
                  <input
                    type="range" min="24" max="75" step="1"
                    value={focalLength}
                    onChange={e => setFocalLength(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "#e1496d" }}
                  />
                </div>

                {/* Material Sliders */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#ff8da7", marginBottom: 4 }}>
                    <span>Metalness Shading</span>
                    <span>{Math.round(metalness * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={metalness}
                    onChange={e => setMetalness(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "#e1496d" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#ff8da7", marginBottom: 4 }}>
                    <span>Roughness (Matte vs Gloss)</span>
                    <span>{Math.round(roughness * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={roughness}
                    onChange={e => setRoughness(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "#38bdf8" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Center 3D WebGL Canvas ── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          
          {/* Floating Camera Quick-Jump Views & Orbit Controls */}
          <div style={{
            position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
            background: "rgba(12, 4, 10, 0.88)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(225, 73, 109, 0.35)", borderRadius: 99,
            padding: "5px 10px", display: "flex", alignItems: "center", gap: 8,
            zIndex: 30, boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}>
            {[
              { id: "perspective", label: "3/4 Hero" },
              { id: "front", label: "Front Flat" },
              { id: "isometric", label: "Isometric" },
              { id: "cinematic", label: "Dramatic Tilt" },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setPresetView(v.id)}
                style={{
                  padding: "5px 14px", borderRadius: 99,
                  background: cameraView === v.id ? "#e1496d" : "transparent",
                  border: "none", color: "#ffffff",
                  fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {v.label}
              </button>
            ))}

            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />

            {/* Auto Rotate Button */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title="Toggle Auto 360° Orbit Rotation"
              style={{
                padding: "5px 12px", borderRadius: 99,
                background: isAutoRotating ? "rgba(56, 189, 248, 0.25)" : "transparent",
                border: `1px solid ${isAutoRotating ? "#38bdf8" : "transparent"}`,
                color: isAutoRotating ? "#38bdf8" : "rgba(255,255,255,0.75)",
                fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <RotateCw size={13} className={isAutoRotating ? "mascot-anim-spin" : ""} />
              <span>360° Orbit</span>
            </button>
          </div>

          {/* Three.js Mount Container */}
          <div
            ref={mountRef}
            style={{
              width: "100%", height: "100%",
              cursor: "grab",
            }}
          />

          {/* Interaction Helper Pill on bottom left */}
          <div style={{
            position: "absolute", bottom: 16, left: 16,
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
            padding: "6px 14px", fontSize: 11.5, color: "rgba(255,255,255,0.7)",
            pointerEvents: "none", display: "flex", alignItems: "center", gap: 7,
          }}>
            <Eye size={13} color="#ff8da7" />
            <span>Click & Drag to rotate 3D model • Scroll to Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
