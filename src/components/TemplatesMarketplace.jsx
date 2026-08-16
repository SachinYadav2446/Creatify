import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Search, Filter, Sparkles, Star, Download, Play, 
  Layers, Eye, ExternalLink, RefreshCw, Grid, Tag, Compass, Flame, Award,
  Plus, Upload, Heart, Share2, Check, X, User, Palette, Video, Image as ImageIcon,
  Presentation, Cpu, Box, FileText, Layout, Copy, Sliders, Globe, Bookmark, TrendingUp,
  FolderOpen, ThumbsUp, ShieldCheck, Zap, Users, BarChart2
} from "lucide-react";

import videoPreviewImg from "../assets/images/video_preview.png";
import logoPreviewImg from "../assets/images/logo_preview.png";
import pptPreviewImg from "../assets/images/ppt_preview.png";
import socialPreviewImg from "../assets/images/social_preview.png";
import imagePreviewImg from "../assets/images/image_preview.png";
import docPreviewImg from "../assets/images/doc_preview.png";
import whiteboardPreviewImg from "../assets/images/whiteboard_preview.png";
import aiPreviewImg from "../assets/images/ai_preview.png";

export default function TemplatesMarketplace({ onBack, onNavigate, user, isEmbedded = false, isDark = true }) {
  const effectiveDark = isDark !== undefined ? isDark : (typeof window !== "undefined" && localStorage.getItem("creatify_theme") === "dark");

  // Dynamic Theme Palette
  const theme = {
    bg: effectiveDark
      ? "linear-gradient(180deg, #0d0309 0%, #150510 50%, #0a0207 100%)"
      : "linear-gradient(180deg, #faf5f8 0%, #f6ecf3 50%, #faeef4 100%)",
    headerBg: effectiveDark ? "rgba(13, 3, 9, 0.85)" : "rgba(255, 255, 255, 0.88)",
    headerBorder: effectiveDark ? "rgba(225, 73, 109, 0.18)" : "rgba(148, 41, 69, 0.14)",
    cardBg: effectiveDark ? "rgba(22, 7, 16, 0.8)" : "rgba(255, 255, 255, 0.95)",
    cardBorder: effectiveDark ? "1px solid rgba(225, 73, 109, 0.2)" : "1px solid rgba(148, 41, 69, 0.14)",
    cardShadow: effectiveDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(148, 41, 69, 0.07)",
    textPrimary: effectiveDark ? "#ffffff" : "#18040f",
    textMuted: effectiveDark ? "rgba(255, 255, 255, 0.65)" : "rgba(24, 4, 15, 0.65)",
    inputBg: effectiveDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
    inputBorder: effectiveDark ? "1px solid rgba(225, 73, 109, 0.25)" : "1px solid rgba(148, 41, 69, 0.2)",
    pillBg: effectiveDark ? "rgba(255, 255, 255, 0.05)" : "rgba(148, 41, 69, 0.05)",
    pillBorder: effectiveDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(148, 41, 69, 0.12)",
    pillText: effectiveDark ? "rgba(255, 255, 255, 0.7)" : "#6c5662",
    badgeBg: effectiveDark ? "rgba(0,0,0,0.75)" : "rgba(255, 255, 255, 0.92)",
    badgeText: effectiveDark ? "#ffffff" : "#18040f",
    modalBg: effectiveDark
      ? "linear-gradient(135deg, #1c0615, #0d020a)"
      : "linear-gradient(135deg, #ffffff, #fdf2f7)",
    modalBackdrop: effectiveDark ? "rgba(0,0,0,0.8)" : "rgba(24, 4, 15, 0.45)",
    modalBorder: effectiveDark ? "1.5px solid #e1496d" : "1.5px solid rgba(225, 73, 109, 0.4)",
    subtleBox: effectiveDark ? "rgba(255, 255, 255, 0.04)" : "rgba(148, 41, 69, 0.04)",
  };

  // Seed Initial Community Marketplace Products if not in localStorage
  // State
  const [marketplaceCatalog, setMarketplaceCatalog] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRatio, setSelectedRatio] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [activeTab, setActiveTab] = useState("explore"); // "explore" | "my_published"
  const [activeModalTemplate, setActiveModalTemplate] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [likedTemplates, setLikedTemplates] = useState({});
  const [vaultWorks, setVaultWorks] = useState([]);
  const [selectedVaultWorkId, setSelectedVaultWorkId] = useState("");
  const [userRatingsState, setUserRatingsState] = useState({});
  const [notification, setNotification] = useState(null);

  // New Template Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("youtube");
  const [newTool, setNewTool] = useState("Video Editor");
  const [newRatio, setNewRatio] = useState("16:9");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const fileInputRef = useRef(null);

  // Load REAL products and Developer Blueprints from localStorage
  useEffect(() => {
    try {
      const SEED_BLUEPRINTS = [
        {
          id: "bp_pipe_release",
          title: "Release Asset CI/CD & OpenGraph Matrix",
          category: "pipelines",
          tool: "Spatial Pipelines",
          route: "pipelines",
          ratio: "16:9",
          aspectLabel: "1920 × 1080",
          image: aiPreviewImg,
          creator: { name: "DevOps Core", badge: "Official Blueprint", avatar: "⚡" },
          remixes: 428,
          likes: 215,
          rating: 4.9,
          ratingsCount: 42,
          tags: ["CI/CD", "GitHub Actions", "DAG", "OpenGraph", "WASM"],
          colors: ["#38bdf8", "#e1496d", "#a855f7"],
          layers: 8,
          desc: "Automated release pipeline generating GitHub README assets, social banners, and favicon packages on git tag trigger.",
          isUserPublished: false,
          publishedAt: "2026-08-16"
        },
        {
          id: "bp_mock_rayso",
          title: "Ray.so Glass Scribe 3D Floating Rig",
          category: "mockup",
          tool: "3D Mockups",
          route: "mockup_studio",
          ratio: "16:9",
          aspectLabel: "1920 × 1080",
          image: docPreviewImg,
          creator: { name: "Graphics Team", badge: "Official Blueprint", avatar: "🖥️" },
          remixes: 612,
          likes: 389,
          rating: 5.0,
          ratingsCount: 89,
          tags: ["3D Rig", "Three.js", "Syntax Highlight", "Rust", "Cyber Glass"],
          colors: ["#e1496d", "#38bdf8", "#22c55e"],
          layers: 12,
          desc: "Ultra-sharp 3D glass card mockup with real-time AST token syntax rendering and orbit controls.",
          isUserPublished: false,
          publishedAt: "2026-08-16"
        },
        {
          id: "bp_arch_event",
          title: "Event-Driven Microservices Blueprint",
          category: "whiteboard",
          tool: "Whiteboard",
          route: "whiteboard_load",
          ratio: "16:9",
          aspectLabel: "1920 × 1080",
          image: whiteboardPreviewImg,
          creator: { name: "System Architects", badge: "Official Blueprint", avatar: "🏛️" },
          remixes: 840,
          likes: 512,
          rating: 4.9,
          ratingsCount: 104,
          tags: ["Architecture", "Mermaid.js", "Kafka", "PostgreSQL", "mTLS"],
          colors: ["#38bdf8", "#e1496d", "#22c55e"],
          layers: 15,
          desc: "Distributed event broker topology with Envoy ingress, Kafka message bus, WASM compute cluster, and PostgreSQL pgvector sharding.",
          isUserPublished: false,
          publishedAt: "2026-08-16"
        },
        {
          id: "bp_pitch_wasm",
          title: "WASM & Rust Engine Pitch Deck",
          category: "pitch",
          tool: "Presentations",
          route: "presentation_load",
          ratio: "16:9",
          aspectLabel: "1920 × 1080",
          image: pptPreviewImg,
          creator: { name: "Tech Evangelist", badge: "Official Blueprint", avatar: "💻" },
          remixes: 395,
          likes: 247,
          rating: 4.8,
          ratingsCount: 56,
          tags: ["Slidev", "Marp", "Benchmark", "Rust", "Architecture"],
          colors: ["#942945", "#e1496d", "#38bdf8"],
          layers: 10,
          desc: "Developer-first technical slide deck with syntax-highlighted code splits, benchmark bars, and Marp markdown export.",
          isUserPublished: false,
          publishedAt: "2026-08-16"
        },
        {
          id: "bp_logo_tokens",
          title: "Modern SaaS Vector Brand & Tailwind Tokens",
          category: "logo",
          tool: "Logo Maker",
          route: "logo_maker_load",
          ratio: "1:1",
          aspectLabel: "1200 × 1200",
          image: logoPreviewImg,
          creator: { name: "Brand Systems", badge: "Official Blueprint", avatar: "🎨" },
          remixes: 730,
          likes: 420,
          rating: 5.0,
          ratingsCount: 112,
          tags: ["Brand Kit", "Tailwind CSS", "React TSX", "Favicons", "SVG"],
          colors: ["#e1496d", "#ff8da7", "#160a13"],
          layers: 6,
          desc: "Procedural developer tech vector logo with 1-click React TSX component export and Tailwind CSS design tokens.",
          isUserPublished: false,
          publishedAt: "2026-08-16"
        },
        {
          id: "bp_doc_rfc",
          title: "RFC-042: GPU Raytracing Architecture Spec",
          category: "doc",
          tool: "Documents",
          route: "documents_load",
          ratio: "16:9",
          aspectLabel: "1920 × 1080",
          image: docPreviewImg,
          creator: { name: "RFC Standards", badge: "Official Blueprint", avatar: "📜" },
          remixes: 310,
          likes: 198,
          rating: 4.9,
          ratingsCount: 38,
          tags: ["RFC", "API Spec", "Markdown", "Post-Mortem", "Code Blocks"],
          colors: ["#38bdf8", "#e1496d", "#22c55e"],
          layers: 9,
          desc: "Technical specification standard document with AST code callouts, interactive API routes, and raw markdown export.",
          isUserPublished: false,
          publishedAt: "2026-08-16"
        }
      ];

      const storedPublished = JSON.parse(localStorage.getItem("creatify_published_templates") || "[]");
      const userOnly = storedPublished.filter(item => item && item.isUserPublished);
      const combined = [...userOnly, ...SEED_BLUEPRINTS];

      setMarketplaceCatalog(combined);
      localStorage.setItem("creatify_marketplace_catalog", JSON.stringify(combined));

      const storedLikes = JSON.parse(localStorage.getItem("creatify_template_likes") || "{}");
      setLikedTemplates(storedLikes);

      const storedUserRatings = JSON.parse(localStorage.getItem("creatify_user_ratings") || "{}");
      setUserRatingsState(storedUserRatings);

      const storedVault = JSON.parse(localStorage.getItem("creatify_past_works") || "[]");
      setVaultWorks(storedVault);
    } catch (e) {
      console.error("Marketplace initialization error:", e);
    }
  }, [isPublishModalOpen]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper to persist catalog changes
  const updateCatalog = (newCatalog) => {
    setMarketplaceCatalog(newCatalog);
    localStorage.setItem("creatify_marketplace_catalog", JSON.stringify(newCatalog));
  };

  const toggleLike = (tmplId, e) => {
    e?.stopPropagation();
    const isNowLiked = !likedTemplates[tmplId];
    const updatedLikes = { ...likedTemplates, [tmplId]: isNowLiked };
    setLikedTemplates(updatedLikes);
    localStorage.setItem("creatify_template_likes", JSON.stringify(updatedLikes));

    // Update like count in real time in catalog
    const updatedCatalog = marketplaceCatalog.map(item => {
      if (item.id === tmplId) {
        const newLikes = Math.max(0, (item.likes || 0) + (isNowLiked ? 1 : -1));
        return { ...item, likes: newLikes };
      }
      return item;
    });
    updateCatalog(updatedCatalog);

    showToast(isNowLiked ? "Added to your Saved Inspirations" : "Removed from Saved Inspirations");
  };

  // Real-Time 5-Star Rating Handler
  const handleRateTemplate = (tmplId, starValue, e) => {
    e?.stopPropagation();
    const updatedUserRatings = { ...userRatingsState, [tmplId]: starValue };
    setUserRatingsState(updatedUserRatings);
    localStorage.setItem("creatify_user_ratings", JSON.stringify(updatedUserRatings));

    const updatedCatalog = marketplaceCatalog.map(item => {
      if (item.id === tmplId) {
        const currentCount = item.ratingsCount || 1;
        const currentRating = item.rating || 5.0;
        // Weighted incremental average formula
        const newCount = currentCount + 1;
        const newRating = Number(((currentRating * currentCount + starValue) / newCount).toFixed(1));
        return {
          ...item,
          rating: newRating,
          ratingsCount: newCount,
          userRatings: { ...(item.userRatings || {}), [user?.email || "me"]: starValue }
        };
      }
      return item;
    });

    updateCatalog(updatedCatalog);

    if (activeModalTemplate && activeModalTemplate.id === tmplId) {
      const activeUpdated = updatedCatalog.find(i => i.id === tmplId);
      if (activeUpdated) setActiveModalTemplate(activeUpdated);
    }

    showToast(`⭐ You rated this product ${starValue} Stars! Real-time score updated.`);
  };

  // Real-Time Remix / Download Handler
  const handleRemix = (tmpl) => {
    // Increment download/remix count in real-time
    const updatedCatalog = marketplaceCatalog.map(item => {
      if (item.id === tmpl.id) {
        return { ...item, downloads: (item.downloads || 0) + 1 };
      }
      return item;
    });
    updateCatalog(updatedCatalog);

    const initialProjectData = {
      id: `remix_${Date.now()}`,
      title: `${tmpl.title} (Remix)`,
      category: tmpl.category,
      tool: tmpl.tool,
      date: new Date().toLocaleDateString(),
      tags: tmpl.tags,
      gradient: tmpl.gradient,
      data: {
        layers: Array.from({ length: tmpl.layers || 6 }).map((_, i) => ({
          id: i + 1,
          name: `Layer ${i + 1}`,
          type: i === 0 ? "image" : "shape",
          visible: true,
          locked: false,
          opacity: 100,
        })),
        fonts: tmpl.fonts || ["Syne", "Poppins"],
      }
    };

    // Save to past works so it appears in Vault
    try {
      const saved = JSON.parse(localStorage.getItem("creatify_past_works") || "[]");
      saved.unshift(initialProjectData);
      localStorage.setItem("creatify_past_works", JSON.stringify(saved));
    } catch (e) {
      console.error(e);
    }

    showToast(`🚀 Remixed "${tmpl.title}"! (+1 Download added for author)`);

    setTimeout(() => {
      if (tmpl.route === "mockup_studio") {
        onNavigate("mockup_studio");
      } else {
        onNavigate(tmpl.route, initialProjectData);
      }
    }, 400);
  };

  const categories = [
    { id: "all", label: "All Formats", icon: Globe },
    { id: "youtube", label: "4K Video & Intros", icon: Video },
    { id: "pitch", label: "Pitch Decks & Slides", icon: Presentation },
    { id: "social", label: "Social Media & Stories", icon: Sparkles },
    { id: "logo", label: "Logos & Brand Kits", icon: Palette },
    { id: "poster", label: "Image Editing & Posters", icon: ImageIcon },
    { id: "mockup", label: "3D Product Mockups", icon: Box },
    { id: "doc", label: "Rich Docs & Reports", icon: FileText },
    { id: "pipelines", label: "Spatial Pipelines", icon: Cpu },
  ];

  // Filter & Search
  const isMyProduct = (item) => {
    return item.isUserPublished || item.author?.id === (user?.email || "me") || item.author?.name === (user?.name || "You");
  };

  const displayedTemplates = marketplaceCatalog.filter(t => {
    if (activeTab === "my_published" && !isMyProduct(t)) return false;
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesRatio = selectedRatio === "all" || t.ratio === selectedRatio;
    const matchesSearch = searchQuery === "" || 
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.tool?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRatio && matchesSearch;
  });

  // Sorting
  const sortedTemplates = [...displayedTemplates].sort((a, b) => {
    if (sortBy === "trending") return ((b.downloads || 0) + (b.likes || 0) * 2) - ((a.downloads || 0) + (a.likes || 0) * 2);
    if (sortBy === "downloads") return (b.downloads || 0) - (a.downloads || 0);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "recent") return String(b.id).localeCompare(String(a.id));
    return 0;
  });

  // 100% Real-Time Community Ecosystem Metrics (Calculated dynamically)
  const totalCommunityProducts = marketplaceCatalog.length;
  const totalEcosystemDownloads = marketplaceCatalog.reduce((sum, item) => sum + (item.downloads || 0), 0);
  const uniqueAuthors = Array.from(new Set(marketplaceCatalog.map(item => item.author?.id || item.author?.name).filter(Boolean)));
  const uniqueAuthorsCount = uniqueAuthors.length;
  const myPublishedCount = marketplaceCatalog.filter(isMyProduct).length;
  const myTotalAuthorDownloads = marketplaceCatalog.filter(isMyProduct).reduce((sum, item) => sum + (item.downloads || 0), 0);

  const totalReviewsCount = marketplaceCatalog.reduce((sum, item) => sum + (item.ratingsCount || 0), 0);
  const avgCommunityScore = totalReviewsCount > 0
    ? (marketplaceCatalog.reduce((sum, item) => sum + ((item.rating || 5.0) * (item.ratingsCount || 1)), 0) / totalReviewsCount).toFixed(1)
    : "0.0";

  // Handle Vault Work Selection in Publish Modal
  const handleSelectVaultWork = (workId) => {
    setSelectedVaultWorkId(workId);
    if (!workId) return;
    const found = vaultWorks.find(w => String(w.id) === String(workId));
    if (found) {
      setNewTitle(found.title || "");
      if (found.category) setNewCategory(found.category.toLowerCase());
      if (found.tool) setNewTool(found.tool);
      if (found.thumbnail || found.image) setNewThumbnail(found.thumbnail || found.image);
      if (found.tags) setNewTags(Array.isArray(found.tags) ? found.tags.join(", ") : found.tags);
    }
  };

  // Handle Image Upload for Publishing
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewThumbnail(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Publish New Template Handler
  const handlePublishSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Please enter a product title");
      return;
    }

    const routeMap = {
      "Video Editor": "editor_load",
      "Presentations": "presentation_load",
      "Image Editor": "image_editor_load",
      "Logo Maker": "logo_maker_load",
      "Social Studio": "social_studio_load",
      "Documents": "documents_load",
      "Whiteboard": "whiteboard_load",
      "3D Mockups": "mockup_studio",
      "Spatial Pipelines": "pipelines",
    };

    const publishedItem = {
      id: `pub_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      tool: newTool,
      route: routeMap[newTool] || "editor_load",
      ratio: newRatio,
      aspectLabel: newRatio === "16:9" ? "1920 × 1080" : newRatio === "9:16" ? "1080 × 1920" : "1200 × 1200",
      image: newThumbnail || (newTool.includes("Video") ? videoPreviewImg : newTool.includes("Logo") ? logoPreviewImg : pptPreviewImg),
      author: {
        id: user?.email || "me",
        name: user?.name || "Community Creator",
        badge: "Verified Publisher",
        avatar: (user?.name?.[0] || "U").toUpperCase(),
      },
      downloads: 0,
      likes: 1,
      rating: 5.0,
      ratingsCount: 1,
      userRatings: {},
      tags: newTags ? newTags.split(",").map(t => t.trim()).filter(Boolean) : [newTool, "Community"],
      colors: ["#e1496d", "#38bdf8", "#10b981"],
      layers: 6,
      fonts: ["Syne", "Poppins"],
      gradient: "linear-gradient(135deg, #e1496d 0%, #1a0826 100%)",
      desc: newDesc.trim() || "A custom community template published directly to the Creatify sovereign marketplace.",
      isUserPublished: true,
      publishedAt: new Date().toLocaleDateString(),
    };

    const updatedCatalog = [publishedItem, ...marketplaceCatalog];
    updateCatalog(updatedCatalog);

    // Also update published list
    const storedPublished = JSON.parse(localStorage.getItem("creatify_published_templates") || "[]");
    localStorage.setItem("creatify_published_templates", JSON.stringify([publishedItem, ...storedPublished]));

    setIsPublishModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewTags("");
    setNewThumbnail("");
    setSelectedVaultWorkId("");
    setActiveTab("my_published");
    showToast("🎉 Product published live to Community Marketplace!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      color: theme.textPrimary,
      fontFamily: "'Instrument Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      transition: "background 0.3s ease, color 0.3s ease",
    }}>
      
      {/* Real-time Toast Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 1000,
          background: "linear-gradient(135deg, #e1496d, #942945)",
          color: "#ffffff", padding: "12px 22px", borderRadius: 12,
          boxShadow: "0 10px 30px rgba(225,73,109,0.5)",
          display: "flex", alignItems: "center", gap: 10,
          fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600,
          animation: "fadeIn 0.2s ease",
        }}>
          <Sparkles size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header style={{
        padding: "16px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${theme.headerBorder}`,
        background: theme.headerBg,
        backdropFilter: "blur(16px)",
        position: "sticky", top: 0, zIndex: 90,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: effectiveDark ? "rgba(225, 73, 109, 0.1)" : "rgba(148, 41, 69, 0.08)",
                border: effectiveDark ? "1px solid rgba(225, 73, 109, 0.25)" : "1px solid rgba(148, 41, 69, 0.2)",
                color: effectiveDark ? "#ff8da7" : "#942945", borderRadius: 10,
                padding: "7px 14px", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: effectiveDark ? "#ff8da7" : "#942945", fontFamily: "'Poppins', sans-serif" }}>
                COMMUNITY CREATOR ECOSYSTEM • LIVE HUB
              </span>
            </div>
            <h2 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: theme.textPrimary }}>
              Creator <span style={{ color: "#e1496d" }}>Marketplace</span>
            </h2>
          </div>
        </div>

        {/* Header Actions: Publish Button & Tab Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            display: "flex", background: effectiveDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.06)",
            padding: 3, borderRadius: 10, border: theme.cardBorder,
          }}>
            <button
              onClick={() => setActiveTab("explore")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 7, border: "none",
                background: activeTab === "explore" ? "linear-gradient(135deg, #e1496d, #942945)" : "transparent",
                color: activeTab === "explore" ? "#ffffff" : theme.textMuted,
                fontSize: 12, fontWeight: 700, fontFamily: "'Poppins', sans-serif", cursor: "pointer",
              }}
            >
              <Globe size={13} />
              <span>Explore ({totalCommunityProducts})</span>
            </button>
            <button
              onClick={() => setActiveTab("my_published")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 7, border: "none",
                background: activeTab === "my_published" ? "linear-gradient(135deg, #e1496d, #942945)" : "transparent",
                color: activeTab === "my_published" ? "#ffffff" : theme.textMuted,
                fontSize: 12, fontWeight: 700, fontFamily: "'Poppins', sans-serif", cursor: "pointer",
              }}
            >
              <User size={13} />
              <span>My Published ({myPublishedCount})</span>
            </button>
          </div>

          <button
            onClick={() => setIsPublishModalOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 20px", borderRadius: 10,
              background: "linear-gradient(135deg, #e1496d, #942945)",
              border: "none", color: "#ffffff",
              fontSize: 13, fontWeight: 700, fontFamily: "Syne, sans-serif",
              cursor: "pointer", boxShadow: "0 6px 20px rgba(225,73,109,0.4)",
            }}
          >
            <Plus size={16} />
            <span>Publish Product</span>
          </button>
        </div>
      </header>

      {/* Main Marketplace Area */}
      <main style={{ padding: "28px 40px 80px", maxWidth: 1440, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        
        {/* Real-time Ecosystem Telemetry Bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14,
          marginBottom: 28,
        }}>
          {[
            {
              label: "Community Products",
              val: `${totalCommunityProducts} ${totalCommunityProducts === 1 ? "Published Asset" : "Published Assets"}`,
              icon: Box,
              color: "#e1496d"
            },
            {
              label: "Total Studio Remixes",
              val: `${totalEcosystemDownloads.toLocaleString()} ${totalEcosystemDownloads === 1 ? "Download" : "Downloads"}`,
              icon: Download,
              color: "#38bdf8"
            },
            {
              label: "Verified Authors",
              val: `${uniqueAuthorsCount} ${uniqueAuthorsCount === 1 ? "Active Creator" : "Active Creators"}`,
              icon: Users,
              color: "#10b981"
            },
            {
              label: activeTab === "my_published" ? "Your Author Impact" : "Community Avg Rating",
              val: activeTab === "my_published"
                ? `${myTotalAuthorDownloads} Total Remixes`
                : (totalReviewsCount > 0 ? `${avgCommunityScore} ⭐ (${totalReviewsCount} ${totalReviewsCount === 1 ? "Review" : "Reviews"})` : "No Reviews Yet"),
              icon: Star,
              color: "#f59e0b"
            },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={i}
                style={{
                  padding: "14px 18px", borderRadius: 16,
                  background: theme.cardBg, border: theme.cardBorder,
                  backdropFilter: "blur(14px)", display: "flex",
                  alignItems: "center", gap: 12, boxShadow: theme.cardShadow,
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${m.color}15`, border: `1px solid ${m.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} color={m.color} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, fontFamily: "Syne, sans-serif", color: m.color }}>
                    {m.val}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search, Categories & Controls */}
        <div style={{ marginBottom: 32 }}>
          
          {/* Search Bar & Sort Dropdown */}
          <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{
              flex: 1, minWidth: 280, maxWidth: 640,
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 18px", borderRadius: 14,
              background: theme.inputBg,
              border: theme.inputBorder,
              backdropFilter: "blur(12px)",
              boxShadow: effectiveDark ? "none" : "0 4px 16px rgba(148,41,69,0.06)",
            }}>
              <Search size={16} color="#e1496d" />
              <input
                type="text"
                placeholder="Search templates by style, tool, creator or tags (e.g. YouTube, Glitch, 4K, Cyberpunk)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: theme.textPrimary, fontSize: 13, width: "100%",
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer" }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: theme.textMuted, fontFamily: "'Poppins', sans-serif" }}>
                <TrendingUp size={14} color="#e1496d" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "9px 14px", borderRadius: 10,
                  background: theme.inputBg,
                  border: theme.inputBorder,
                  color: theme.textPrimary, fontSize: 12, fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif", outline: "none", cursor: "pointer",
                }}
              >
                <option value="trending" style={{ background: effectiveDark ? "#170511" : "#ffffff", color: effectiveDark ? "#fff" : "#000" }}>Trending & Popular</option>
                <option value="downloads" style={{ background: effectiveDark ? "#170511" : "#ffffff", color: effectiveDark ? "#fff" : "#000" }}>Most Downloads & Remixes</option>
                <option value="rating" style={{ background: effectiveDark ? "#170511" : "#ffffff", color: effectiveDark ? "#fff" : "#000" }}>Top Rated (5.0)</option>
                <option value="recent" style={{ background: effectiveDark ? "#170511" : "#ffffff", color: effectiveDark ? "#fff" : "#000" }}>Recently Published</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 16px", borderRadius: 99,
                    background: active ? "linear-gradient(135deg, #e1496d, #942945)" : theme.pillBg,
                    border: active ? "1.5px solid #e1496d" : theme.pillBorder,
                    color: active ? "#ffffff" : theme.pillText,
                    fontSize: 12, fontWeight: active ? 700 : 500,
                    fontFamily: "'Poppins', sans-serif", cursor: "pointer",
                    whiteSpace: "nowrap", transition: "all 0.2s ease",
                    boxShadow: active ? "0 4px 14px rgba(225,73,109,0.4)" : "none",
                  }}
                >
                  <Icon size={13} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template Gallery Grid */}
        {sortedTemplates.length === 0 ? (
          <div style={{
            padding: "80px 32px", textAlign: "center",
            borderRadius: 24, background: theme.cardBg,
            border: `1.5px dashed ${effectiveDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.2)"}`,
            boxShadow: theme.cardShadow,
            maxWidth: 640, margin: "0 auto",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: effectiveDark ? "rgba(225,73,109,0.15)" : "rgba(148,41,69,0.1)",
              color: "#e1496d",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
              boxShadow: "0 8px 24px rgba(225,73,109,0.2)",
              border: "1px solid rgba(225,73,109,0.3)",
            }}>
              <Globe size={30} />
            </div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, color: theme.textPrimary, margin: "0 0 8px", fontWeight: 800 }}>
              {activeTab === "my_published"
                ? "You Haven't Published Any Products Yet"
                : "Community Marketplace is Ready for Real Products"}
            </h3>
            <p style={{ color: theme.textMuted, fontSize: 14, maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.55 }}>
              {activeTab === "my_published"
                ? "Publish your custom artwork, video projects, slide decks, or logos directly from your Vault to share them with the ecosystem."
                : "No products published yet. Create art in any studio tool or publish existing projects from your Sovereign Vault to start building the marketplace."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => setIsPublishModalOpen(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 24px", borderRadius: 12,
                  background: "linear-gradient(135deg, #e1496d, #942945)",
                  border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
                  fontFamily: "Syne, sans-serif", cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(225,73,109,0.35)",
                }}
              >
                <Plus size={16} />
                <span>Publish New Product</span>
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "11px 20px", borderRadius: 12,
                    background: effectiveDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.06)",
                    border: theme.cardBorder, color: theme.textPrimary,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  <FolderOpen size={15} color="#e1496d" />
                  <span>Browse Your Vault</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: 24,
          }}>
            {sortedTemplates.map((tmpl) => {
              const isLiked = !!likedTemplates[tmpl.id];
              const myRating = userRatingsState[tmpl.id] || 0;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setActiveModalTemplate(tmpl)}
                  style={{
                    borderRadius: 20, overflow: "hidden",
                    background: theme.cardBg,
                    border: theme.cardBorder,
                    backdropFilter: "blur(16px)",
                    boxShadow: theme.cardShadow,
                    display: "flex", flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px) scale(1.01)";
                    e.currentTarget.style.borderColor = "#e1496d";
                    e.currentTarget.style.boxShadow = "0 18px 45px rgba(225,73,109,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px) scale(1)";
                    e.currentTarget.style.borderColor = effectiveDark ? "rgba(225, 73, 109, 0.2)" : "rgba(148, 41, 69, 0.14)";
                    e.currentTarget.style.boxShadow = theme.cardShadow;
                  }}
                >
                  {/* Thumbnail Stage */}
                  <div style={{
                    height: 180, position: "relative",
                    overflow: "hidden", background: effectiveDark ? "#0c0208" : "#f5e6ee",
                    borderBottom: theme.cardBorder,
                  }}>
                    {tmpl.image && (
                      <img
                        src={tmpl.image}
                        alt={tmpl.title}
                        style={{
                          width: "100%", height: "100%", objectFit: "cover",
                          filter: effectiveDark ? "brightness(0.9) contrast(1.05)" : "brightness(0.98)",
                        }}
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: effectiveDark
                        ? "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(13,3,9,0.75) 100%)"
                        : "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 100%)",
                    }} />

                    {/* Tool Badge Top-Left */}
                    <div style={{
                      position: "absolute", top: 12, left: 12,
                      padding: "4px 11px", borderRadius: 99,
                      background: theme.badgeBg, backdropFilter: "blur(8px)",
                      border: "1px solid rgba(225, 73, 109, 0.25)",
                      color: theme.badgeText, fontSize: 10.5, fontWeight: 700,
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {tmpl.tool}
                    </div>

                    {/* Like Button Top-Right */}
                    <button
                      onClick={(e) => toggleLike(tmpl.id, e)}
                      style={{
                        position: "absolute", top: 12, right: 12,
                        width: 32, height: 32, borderRadius: "50%",
                        background: isLiked ? "#e1496d" : (effectiveDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.85)"),
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(225, 73, 109, 0.3)",
                        color: isLiked ? "#ffffff" : (effectiveDark ? "#ffffff" : "#18040f"),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Heart size={14} fill={isLiked ? "#fff" : "none"} color={isLiked ? "#fff" : (effectiveDark ? "#fff" : "#e1496d")} />
                    </button>

                    {/* Aspect Ratio Tag Bottom-Right */}
                    <div style={{
                      position: "absolute", bottom: 10, right: 12,
                      padding: "2px 8px", borderRadius: 6,
                      background: effectiveDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(6px)",
                      color: "#e1496d", fontSize: 9.5, fontWeight: 800,
                      fontFamily: "monospace", border: "1px solid rgba(225,73,109,0.3)",
                    }}>
                      {tmpl.ratio} • {tmpl.aspectLabel}
                    </div>
                  </div>

                  {/* Card Content Info */}
                  <div style={{ padding: "18px 20px 16px" }}>
                    
                    {/* Author & Live Rating Info */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%",
                          background: "linear-gradient(135deg, #e1496d, #942945)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 800, color: "#fff",
                        }}>
                          {tmpl.author?.avatar || "C"}
                        </div>
                        <span style={{ fontSize: 11.5, color: theme.textMuted, fontFamily: "'Instrument Sans', sans-serif" }}>
                          {tmpl.author?.name}
                        </span>
                      </div>

                      {/* Interactive 5-Star Rating */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={(e) => handleRateTemplate(tmpl.id, star, e)}
                              style={{ background: "none", border: "none", padding: "0 1px", cursor: "pointer", color: star <= (myRating || Math.round(tmpl.rating)) ? "#f59e0b" : "rgba(255,255,255,0.2)" }}
                              title={`Rate ${star} Stars`}
                            >
                              <Star size={11} fill={star <= (myRating || Math.round(tmpl.rating)) ? "#f59e0b" : "none"} />
                            </button>
                          ))}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#f59e0b", fontFamily: "monospace" }}>
                          {tmpl.rating}
                        </span>
                      </div>
                    </div>

                    <h4 style={{
                      margin: "0 0 4px", fontFamily: "Syne, sans-serif",
                      fontSize: 16, fontWeight: 800, color: theme.textPrimary,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {tmpl.title}
                    </h4>

                    {/* Live Community Downloads Tracker */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#38bdf8", fontWeight: 700, fontFamily: "monospace", marginBottom: 10 }}>
                      <Download size={12} />
                      <span>{(tmpl.downloads || 0).toLocaleString()} community downloads</span>
                    </div>

                    <p style={{
                      margin: "0 0 16px", fontSize: 12, color: theme.textMuted,
                      lineHeight: 1.45, maxHeight: 34, overflow: "hidden",
                    }}>
                      {tmpl.desc}
                    </p>

                    {/* Action Bar: Remix in Studio & Inspect */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemix(tmpl);
                        }}
                        style={{
                          flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
                          gap: 6, padding: "9px 14px", borderRadius: 10,
                          background: "linear-gradient(135deg, #e1496d, #942945)",
                          border: "none", color: "#ffffff",
                          fontFamily: "Syne, sans-serif", fontSize: 12.5, fontWeight: 700,
                          cursor: "pointer", boxShadow: "0 4px 14px rgba(225,73,109,0.4)",
                        }}
                      >
                        <Play size={13} fill="#fff" />
                        <span>Remix & Use Asset</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalTemplate(tmpl);
                        }}
                        style={{
                          padding: "9px", borderRadius: 10,
                          background: effectiveDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.06)",
                          border: theme.cardBorder,
                          color: effectiveDark ? "#ff8da7" : "#942945", cursor: "pointer",
                        }}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── PUBLISH TEMPLATE MODAL ── */}
      {isPublishModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: theme.modalBackdrop, backdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, boxSizing: "border-box",
        }}>
          <div style={{
            width: "100%", maxWidth: 640,
            background: theme.modalBg,
            border: theme.modalBorder,
            borderRadius: 24, padding: "28px 32px",
            boxShadow: "0 25px 60px rgba(225,73,109,0.35)",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#e1496d", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Poppins', sans-serif" }}>
                  COMMUNITY CREATOR ECOSYSTEM
                </span>
                <h3 style={{ margin: "2px 0 0", fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: theme.textPrimary }}>
                  Publish Product to Marketplace
                </h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Optional: Pick from Vault */}
              {vaultWorks.length > 0 && (
                <div style={{ padding: 12, borderRadius: 12, background: theme.subtleBox, border: theme.cardBorder }}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                    Select Existing Project from Vault (Optional)
                  </label>
                  <select
                    value={selectedVaultWorkId}
                    onChange={(e) => handleSelectVaultWork(e.target.value)}
                    style={{
                      width: "100%", padding: "9px 12px", borderRadius: 8,
                      background: theme.inputBg, border: theme.inputBorder,
                      color: theme.textPrimary, fontSize: 12.5, outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="">-- Or enter custom project details below --</option>
                    {vaultWorks.map((vw) => (
                      <option key={vw.id} value={vw.id}>
                        {vw.title} ({vw.tool || vw.category || "Project"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Cyberpunk YouTube Opener"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    background: theme.inputBg, border: theme.inputBorder,
                    color: theme.textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                    Studio Tool
                  </label>
                  <select
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      background: theme.inputBg, border: theme.inputBorder,
                      color: theme.textPrimary, fontSize: 12.5, outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="Video Editor">4K Video Editor</option>
                    <option value="Presentations">Presentations / Slide Studio</option>
                    <option value="Image Editor">Image Studio / Poster</option>
                    <option value="Logo Maker">Logo Maker & Brand Kit</option>
                    <option value="Social Studio">Social Studio (Reels / Stories)</option>
                    <option value="Documents">Rich Documents</option>
                    <option value="Whiteboard">Whiteboard Canvas</option>
                    <option value="3D Mockups">3D Mockups</option>
                    <option value="Spatial Pipelines">Spatial Pipelines</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                    Aspect Ratio
                  </label>
                  <select
                    value={newRatio}
                    onChange={(e) => setNewRatio(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      background: theme.inputBg, border: theme.inputBorder,
                      color: theme.textPrimary, fontSize: 12.5, outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="16:9">16:9 (Landscape / Video / Presentation)</option>
                    <option value="9:16">9:16 (Vertical Story / TikTok / Reel)</option>
                    <option value="1:1">1:1 (Square / Brandmark / Post)</option>
                    <option value="4:5">4:5 (Portrait / Editorial / Poster)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                  Description & Creator Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your template layers, keyframes, transitions, and recommended usage..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    background: theme.inputBg, border: theme.inputBorder,
                    color: theme.textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4K, Cyberpunk, Cinematic, Glitch, Audio Wave"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    background: theme.inputBg, border: theme.inputBorder,
                    color: theme.textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                  Thumbnail Preview Image
                </label>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 8,
                      background: effectiveDark ? "rgba(255,255,255,0.08)" : "rgba(148,41,69,0.08)",
                      border: theme.inputBorder,
                      color: theme.textPrimary, fontSize: 12, cursor: "pointer", fontWeight: 600,
                    }}
                  >
                    <Upload size={14} />
                    <span>Upload Image</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  {newThumbnail && (
                    <span style={{ fontSize: 11.5, color: "#22c55e", fontWeight: 600 }}>
                      ✓ Preview Image Loaded
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  style={{
                    padding: "10px 18px", borderRadius: 10,
                    background: effectiveDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                    border: "none", color: theme.textPrimary, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 24px", borderRadius: 10,
                    background: "linear-gradient(135deg, #e1496d, #942945)",
                    border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
                    fontFamily: "Syne, sans-serif", cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(225,73,109,0.4)",
                  }}
                >
                  Publish to Community Marketplace →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TEMPLATE INSPECTOR MODAL ── */}
      {activeModalTemplate && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: theme.modalBackdrop, backdropFilter: "blur(18px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, boxSizing: "border-box",
        }}>
          <div style={{
            width: "100%", maxWidth: 740,
            background: theme.modalBg,
            border: theme.modalBorder,
            borderRadius: 24, padding: "28px 32px",
            boxShadow: "0 25px 65px rgba(225,73,109,0.4)",
            maxHeight: "92vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(225,73,109,0.2)", color: "#e1496d", fontWeight: 800, fontFamily: "monospace" }}>
                    {activeModalTemplate.tool}
                  </span>
                  <span style={{ fontSize: 10, color: theme.textMuted, fontFamily: "monospace" }}>
                    {activeModalTemplate.ratio} • {activeModalTemplate.aspectLabel}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: theme.textPrimary }}>
                  {activeModalTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalTemplate(null)}
                style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: 20 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div style={{
              height: 240, borderRadius: 16, overflow: "hidden",
              marginBottom: 20, position: "relative",
              border: theme.cardBorder,
            }}>
              <img
                src={activeModalTemplate.image}
                alt={activeModalTemplate.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <p style={{ fontSize: 13.5, color: theme.textPrimary, lineHeight: 1.6, margin: "0 0 20px", opacity: 0.9 }}>
              {activeModalTemplate.desc}
            </p>

            {/* Template Specs & Real-Time Author Metrics */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
              marginBottom: 24, padding: 14, borderRadius: 14,
              background: theme.subtleBox, border: theme.cardBorder,
            }}>
              <div>
                <div style={{ fontSize: 10.5, color: theme.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Total Downloads</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#38bdf8", fontFamily: "Syne, sans-serif" }}>
                  {(activeModalTemplate.downloads || 0).toLocaleString()} times
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: theme.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Rating ({activeModalTemplate.ratingsCount || 1} Reviews)</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={(e) => handleRateTemplate(activeModalTemplate.id, star, e)}
                      style={{ background: "none", border: "none", padding: "0 1px", cursor: "pointer", color: star <= (userRatingsState[activeModalTemplate.id] || Math.round(activeModalTemplate.rating)) ? "#f59e0b" : "rgba(255,255,255,0.2)" }}
                    >
                      <Star size={13} fill={star <= (userRatingsState[activeModalTemplate.id] || Math.round(activeModalTemplate.rating)) ? "#f59e0b" : "none"} />
                    </button>
                  ))}
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b", fontFamily: "monospace", marginLeft: 4 }}>
                    {activeModalTemplate.rating}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: theme.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Creator Profile</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary, fontFamily: "Syne, sans-serif" }}>
                  {activeModalTemplate.author?.name || activeModalTemplate.creator?.name}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
              {activeModalTemplate.tags?.map((tg, i) => (
                <span key={i} style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 99, background: theme.pillBg, border: theme.pillBorder, color: theme.pillText }}>
                  #{tg}
                </span>
              ))}
            </div>

            {/* Modal Bottom Action */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                onClick={() => setActiveModalTemplate(null)}
                style={{
                  padding: "11px 20px", borderRadius: 12,
                  background: effectiveDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  border: "none", color: theme.textPrimary, fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const tmpl = activeModalTemplate;
                  setActiveModalTemplate(null);
                  handleRemix(tmpl);
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 26px", borderRadius: 12,
                  background: "linear-gradient(135deg, #e1496d, #942945)",
                  border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700,
                  fontFamily: "Syne, sans-serif", cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(225,73,109,0.45)",
                }}
              >
                <Play size={14} fill="#fff" />
                <span>Remix & Launch Studio →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
