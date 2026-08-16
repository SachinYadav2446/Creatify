import { useState, useEffect } from "react";

export default function Documents({ onBack, user, initialProject }) {
  const [projectTitle, setProjectTitle] = useState(() => {
    return initialProject ? initialProject.title : "RFC-042: Distributed GPU Raytracing Architecture";
  });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [docBlocks, setDocBlocks] = useState([
    { id: "b_title", type: "h1", content: "RFC-042: Distributed GPU Raytracing Architecture" },
    { id: "b_badge", type: "callout", calloutType: "info", content: "STATUS: APPROVED · Target Release: v2.4.0 · Author: Core Engine Team" },
    { id: "b_intro", type: "p", content: "This document formalizes the memory model, parallel dispatch topology, and AST vector projection pipeline for the Creatify web runtime." },
    { id: "b_h2_arch", type: "h2", content: "1. Core Architectural Invariants" },
    { id: "b_code", type: "code", language: "rust", content: `// Zero-copy SharedArrayBuffer dispatch\npub fn dispatch_pipeline(ctx: &RenderContext) -> Result<TextureHandle, Error> {\n    let memory_view = ctx.acquire_direct_buffer()?;\n    simd_matrix_transform(memory_view)\n}` },
    { id: "b_h2_api", type: "h2", content: "2. Ingress API Endpoint" },
    { id: "b_api", type: "api_endpoint", method: "POST", route: "/v1/raytracer/bake", reqType: "application/json", resCode: "200 OK", resBody: `{\n  "status": "compiled",\n  "latency_ms": 3.4,\n  "buffer_size_kb": 128\n}` },
    { id: "b_h2_env", type: "h2", content: "3. Environment Configuration" },
    { id: "b_table", type: "table", headers: ["Environment Variable", "Type", "Default", "Description"], rows: [
      ["RAYTRACER_MAX_THREADS", "int", "8", "Worker cluster concurrency threadpool"],
      ["GPU_BACKEND_DRIVER", "enum", "webgl2", "Fallback driver (webgl2 | webgpu)"],
      ["CACHE_STORAGE_MB", "int", "512", "L2 Memory cache allocation size"]
    ]},
    { id: "b_warn", type: "callout", calloutType: "warning", content: "CRITICAL: Changing GPU_BACKEND_DRIVER requires client WebAssembly cache invalidation." }
  ]);
  const [activeBlockId, setActiveBlockId] = useState("b_code");

  useEffect(() => {
    if (initialProject && initialProject.data) {
      const d = initialProject.data;
      if (d.docBlocks) setDocBlocks(d.docBlocks);
    }
  }, [initialProject]);

  const updateBlockContent = (id, newContent) => {
    setDocBlocks(prev => prev.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const updateBlockProp = (id, prop, val) => {
    setDocBlocks(prev => prev.map(b => b.id === id ? { ...b, [prop]: val } : b));
  };

  // Table manipulation helpers
  const updateTableCell = (blockId, rowIdx, colIdx, val) => {
    setDocBlocks(prev => prev.map(b => {
      if (b.id === blockId && b.type === "table") {
        const newRows = [...b.rows];
        newRows[rowIdx] = [...newRows[rowIdx]];
        newRows[rowIdx][colIdx] = val;
        return { ...b, rows: newRows };
      }
      return b;
    }));
  };

  const addTableRow = (blockId) => {
    setDocBlocks(prev => prev.map(b => {
      if (b.id === blockId && b.type === "table") {
        const newRow = Array(b.headers.length).fill("");
        return { ...b, rows: [...b.rows, newRow] };
      }
      return b;
    }));
  };

  const deleteTableRow = (blockId, rowIdx) => {
    setDocBlocks(prev => prev.map(b => {
      if (b.id === blockId && b.type === "table") {
        const newRows = b.rows.filter((_, idx) => idx !== rowIdx);
        return { ...b, rows: newRows };
      }
      return b;
    }));
  };

  // Block Insertion helpers
  const addBlock = (type) => {
    const id = `block_${Date.now()}`;
    let newBlock = { id, type, content: "New block content..." };
    if (type === "code") {
      newBlock = {
        id,
        type,
        language: "typescript",
        content: `export async function handleRequest(req: Request): Promise<Response> {\n  return new Response(JSON.stringify({ status: "ok" }));\n}`
      };
    } else if (type === "callout") {
      newBlock = {
        id,
        type,
        calloutType: "info",
        content: "NOTE: This endpoint requires Bearer authentication token in the Authorization header."
      };
    } else if (type === "api_endpoint") {
      newBlock = {
        id,
        type,
        method: "GET",
        route: "/v1/health",
        reqType: "None",
        resCode: "200 OK",
        resBody: `{\n  "status": "healthy",\n  "uptime": "99.99%"\n}`
      };
    } else if (type === "table") {
      newBlock = {
        id,
        type,
        headers: ["Variable", "Type", "Default", "Description"],
        rows: [["PORT", "int", "3000", "Server listening port"], ["ENV", "string", "production", "Runtime deployment stage"]]
      };
    }
    setDocBlocks(prev => [...prev, newBlock]);
    setActiveBlockId(id);
  };

  const deleteBlock = (id) => {
    setDocBlocks(prev => prev.filter(b => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  // SVG Chart Engine
  const renderSVGChart = (block) => {
    // Find the nearest table block above this chart to fetch data from
    const tableBlock = docBlocks.find(b => b.type === "table");
    if (!tableBlock || !tableBlock.rows || tableBlock.rows.length === 0) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#666", fontSize: "11px" }}>
          Insert a data table to populate chart values automatically.
        </div>
      );
    }

    const dataPoints = tableBlock.rows.map(row => {
      const label = row[0] || "Label";
      const val = parseFloat(row[1]) || 0;
      return { label, val };
    });

    const maxVal = Math.max(...dataPoints.map(p => p.val), 1);
    const chartW = 460;
    const chartH = 200;
    const padding = 30;
    const graphW = chartW - padding * 2;
    const graphH = chartH - padding * 2;

    if (block.chartType === "line") {
      // SVG Line Chart
      const points = dataPoints.map((p, idx) => {
        const x = padding + (idx / Math.max(dataPoints.length - 1, 1)) * graphW;
        const y = padding + graphH - (p.val / maxVal) * graphH;
        return `${x},${y}`;
      }).join(" ");

      return (
        <div style={{ textAlign: "center" }}>
          <h5 style={{ margin: "0 0 10px", fontSize: "12px", color: "#333", fontWeight: 600 }}>{block.title || "Interactive Graph"}</h5>
          <svg width={chartW} height={chartH} style={{ background: "#fcfcfc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line key={i} x1={padding} y1={padding + ratio * graphH} x2={chartW - padding} y2={padding + ratio * graphH} stroke="#edf2f7" strokeWidth="1" />
            ))}
            {/* The Line path */}
            <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={points} />
            {/* Nodes */}
            {dataPoints.map((p, idx) => {
              const x = padding + (idx / Math.max(dataPoints.length - 1, 1)) * graphW;
              const y = padding + graphH - (p.val / maxVal) * graphH;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="5" fill="#ec4899" stroke="#6366f1" strokeWidth="2" />
                  <text x={x} y={y - 10} textAnchor="middle" fontSize="9" fill="#2d3748" fontWeight="bold">{p.val}%</text>
                  <text x={x} y={chartH - 12} textAnchor="middle" fontSize="8.5" fill="#718096">{p.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    } else {
      // SVG Bar Chart
      const barW = Math.min(40, graphW / dataPoints.length - 12);
      return (
        <div style={{ textAlign: "center" }}>
          <h5 style={{ margin: "0 0 10px", fontSize: "12px", color: "#333", fontWeight: 600 }}>{block.title || "Quarterly Conversion metrics"}</h5>
          <svg width={chartW} height={chartH} style={{ background: "#fcfcfc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line key={i} x1={padding} y1={padding + ratio * graphH} x2={chartW - padding} y2={padding + ratio * graphH} stroke="#edf2f7" strokeWidth="1" />
            ))}
            {/* Bars */}
            {dataPoints.map((p, idx) => {
              const x = padding + (idx / dataPoints.length) * graphW + (graphW / dataPoints.length - barW) / 2;
              const barH = (p.val / maxVal) * graphH;
              const y = padding + graphH - barH;
              return (
                <g key={idx}>
                  <rect x={x} y={y} width={barW} height={barH} fill="url(#barGrad)" rx="3" />
                  <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize="9" fill="#2d3748" fontWeight="bold">{p.val}%</text>
                  <text x={x + barW / 2} y={chartH - 12} textAnchor="middle" fontSize="8.5" fill="#718096">{p.label}</text>
                </g>
              );
            })}
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    }
  };

  const handleSaveAndExit = () => {
    const savedWorks = JSON.parse(localStorage.getItem("creatify_past_works") || "[]");
    const projectId = initialProject?.id || `doc_${Date.now()}`;
    const existingIdx = savedWorks.findIndex(w => w.id === projectId);

    const projectData = {
      id: projectId,
      title: projectTitle.trim() || "Untitled Report Document",
      category: "Document",
      tool: "Documents",
      year: new Date().getFullYear().toString(),
      accent: "#eba5b6",
      gradient: "linear-gradient(135deg, #1c1813 0%, #3e3223 50%, #1a0f14 100%)",
      image: "",
      icon: "📄",
      tags: ["DOCX · PDF", `${docBlocks.length} Blocks`, "Charts"],
      desc: `Interactive corporate document with ${docBlocks.length} formatted nodes.`,
      data: {
        docBlocks
      }
    };

    if (existingIdx > -1) {
      savedWorks[existingIdx] = projectData;
    } else {
      savedWorks.unshift(projectData);
    }
    localStorage.setItem("creatify_past_works", JSON.stringify(savedWorks));

    const token = localStorage.getItem("creatify_token");
    if (token) {
      fetch((window.API_URL || "http://localhost:3001") + "/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      })
      .then(res => {
        if (!res.ok) throw new Error("Server rejected save");
        console.log("Saved document to DB successfully");
      })
      .catch(err => {
        console.error("DB save error:", err.message);
      })
      .finally(() => {
        onBack();
      });
    } else {
      onBack();
    }
  };

  const handleDiscardAndExit = () => {
    onBack();
  };

  const getSVGChartString = (block) => {
    const tableBlock = docBlocks.find(b => b.type === "table");
    if (!tableBlock || !tableBlock.rows || tableBlock.rows.length === 0) {
      return "";
    }
    const dataPoints = tableBlock.rows.map(row => {
      const label = row[0] || "Label";
      const val = parseFloat(row[1]) || 0;
      return { label, val };
    });
    const maxVal = Math.max(...dataPoints.map(p => p.val), 1);
    const chartW = 460;
    const chartH = 200;
    const padding = 30;
    const graphW = chartW - padding * 2;
    const graphH = chartH - padding * 2;

    if (block.chartType === "line") {
      const points = dataPoints.map((p, idx) => {
        const x = padding + (idx / Math.max(dataPoints.length - 1, 1)) * graphW;
        const y = padding + graphH - (p.val / maxVal) * graphH;
        return `${x},${y}`;
      }).join(" ");

      let gridLines = "";
      [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
        gridLines += `<line x1="${padding}" y1="${padding + ratio * graphH}" x2="${chartW - padding}" y2="${padding + ratio * graphH}" stroke="#edf2f7" stroke-width="1" />`;
      });

      let nodes = "";
      dataPoints.forEach((p, idx) => {
        const x = padding + (idx / Math.max(dataPoints.length - 1, 1)) * graphW;
        const y = padding + graphH - (p.val / maxVal) * graphH;
        nodes += `<circle cx="${x}" cy="${y}" r="5" fill="#ec4899" stroke="#6366f1" stroke-width="2" />
        <text x="${x}" y="${y - 10}" text-anchor="middle" font-size="9" fill="#2d3748" font-weight="bold">${p.val}%</text>
        <text x="${x}" y="${chartH - 12}" text-anchor="middle" font-size="8.5" fill="#718096">${p.label}</text>`;
      });

      return `<svg width="${chartW}" height="${chartH}" style="background: #fcfcfc; border-radius: 10px; border: 1px solid #e2e8f0; font-family: sans-serif;">
        ${gridLines}
        <polyline fill="none" stroke="#6366f1" stroke-width="3" points="${points}" />
        ${nodes}
      </svg>`;
    } else {
      const barW = Math.min(40, graphW / dataPoints.length - 12);
      let gridLines = "";
      [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
        gridLines += `<line x1="${padding}" y1="${padding + ratio * graphH}" x2="${chartW - padding}" y2="${padding + ratio * graphH}" stroke="#edf2f7" stroke-width="1" />`;
      });

      let bars = "";
      dataPoints.forEach((p, idx) => {
        const x = padding + (idx / dataPoints.length) * graphW + (graphW / dataPoints.length - barW) / 2;
        const barH = (p.val / maxVal) * graphH;
        const y = padding + graphH - barH;
        bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="url(#barGrad)" rx="3" />
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" font-size="9" fill="#2d3748" font-weight="bold">${p.val}%</text>
        <text x="${x + barW / 2}" y="${chartH - 12}" text-anchor="middle" font-size="8.5" fill="#718096">${p.label}</text>`;
      });

      return `<svg width="${chartW}" height="${chartH}" style="background: #fcfcfc; border-radius: 10px; border: 1px solid #e2e8f0; font-family: sans-serif;">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6366f1" />
            <stop offset="100%" stop-color="#a855f7" />
          </linearGradient>
        </defs>
        ${gridLines}
        ${bars}
      </svg>`;
    }
  };

  const exportAsHTML = () => {
    let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${projectTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: #f7fafc;
      color: #1a202c;
      margin: 0;
      padding: 40px 20px;
    }
    .sheet {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 60px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    h1 {
      font-family: 'Syne', sans-serif;
      font-size: 32px;
      font-weight: 800;
      margin: 0;
      color: #111;
      letter-spacing: -0.02em;
    }
    h2 {
      font-size: 22px;
      font-weight: 600;
      margin: 0;
      color: #2d3748;
      border-bottom: 2px solid #edf2f7;
      padding-bottom: 8px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #4a5568;
      margin: 0;
    }
    .quote {
      border-left: 4px solid #6366f1;
      padding: 12px 18px;
      font-style: italic;
      font-size: 14.5px;
      color: #4a5568;
      background: #f7fafc;
      border-radius: 0 6px 6px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: left;
      margin-top: 10px;
    }
    th {
      padding: 10px 12px;
      font-weight: 600;
      color: #2d3748;
      background: #edf2f7;
      border-bottom: 2px solid #cbd5e0;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      color: #4a5568;
    }
    .chart-container {
      text-align: center;
      margin: 20px 0;
    }
    .chart-title {
      font-size: 14px;
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .signature {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-top: 24px;
    }
    .sig-line {
      width: 180px;
      border-bottom: 1.5px solid #1a202c;
      padding-bottom: 6px;
      text-align: center;
      font-family: cursive;
      font-size: 18px;
      color: #6366f1;
    }
    .sig-role {
      font-size: 11px;
      color: #718096;
      margin-top: 6px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="sheet">
`;

    docBlocks.forEach(block => {
      if (block.type === "h1") {
        htmlContent += `    <h1>${block.content}</h1>\n`;
      } else if (block.type === "h2") {
        htmlContent += `    <h2>${block.content}</h2>\n`;
      } else if (block.type === "p") {
        htmlContent += `    <p>${block.content}</p>\n`;
      } else if (block.type === "quote") {
        htmlContent += `    <div class="quote">${block.content}</div>\n`;
      } else if (block.type === "table") {
        htmlContent += `    <table>\n      <thead>\n        <tr>\n`;
        block.headers.forEach(h => {
          htmlContent += `          <th>${h}</th>\n`;
        });
        htmlContent += `        </tr>\n      </thead>\n      <tbody>\n`;
        block.rows.forEach(row => {
          htmlContent += `        <tr>\n`;
          row.forEach(cell => {
            htmlContent += `          <td>${cell}</td>\n`;
          });
          htmlContent += `        </tr>\n`;
        });
        htmlContent += `      </tbody>\n    </table>\n`;
      } else if (block.type === "chart") {
        const svgString = getSVGChartString(block);
        htmlContent += `    <div class="chart-container">\n      <div class="chart-title">${block.title || "Data Trend"}</div>\n      ${svgString}\n    </div>\n`;
      } else if (block.type === "signature") {
        htmlContent += `    <div class="signature">\n      <div class="sig-line">${block.name}</div>\n      <div class="sig-role">${block.role}</div>\n    </div>\n`;
      }
    });

    htmlContent += `  </div>\n</body>\n</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${projectTitle.replace(/\s+/g, "_")}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = () => {
    let md = `---
title: "${projectTitle}"
author: "${user?.name || "Developer"}"
date: "${new Date().toISOString().split("T")[0]}"
---

`;
    docBlocks.forEach(block => {
      if (block.type === "h1") md += `# ${block.content}\n\n`;
      else if (block.type === "h2") md += `## ${block.content}\n\n`;
      else if (block.type === "p") md += `${block.content}\n\n`;
      else if (block.type === "quote") md += `> ${block.content}\n\n`;
      else if (block.type === "callout") md += `> [!${block.calloutType === "warning" ? "WARNING" : "NOTE"}]\n> ${block.content}\n\n`;
      else if (block.type === "code") md += `\`\`\`${block.language || "rust"}\n${block.content}\n\`\`\`\n\n`;
      else if (block.type === "api_endpoint") md += `### \`${block.method} ${block.route}\`\n\n\`\`\`json\n${block.resBody}\n\`\`\`\n\n`;
      else if (block.type === "table") {
        md += `| ${block.headers.join(" | ")} |\n`;
        md += `| ${block.headers.map(() => "---").join(" | ")} |\n`;
        block.rows.forEach(r => {
          md += `| ${r.join(" | ")} |\n`;
        });
        md += "\n";
      }
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${projectTitle.toLowerCase().replace(/\s+/g, "_")}.md`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerPrint = () => {
    window.print();
  };

  const activeBlock = docBlocks.find(b => b.id === activeBlockId);

  return (
    <div style={{ background: "#1a0f14", color: "#e5e5e5", fontFamily: "'Poppins',sans-serif", height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-sheet, .print-sheet * {
            visibility: visible;
          }
          .print-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          input {
            border: none !important;
            outline: none !important;
          }
        }
      ` }} />
      
      {/* Header Toolbar */}
      <div style={{ height: "54px", background: "rgba(10,8,7,0.95)", borderBottom: "1px solid rgba(225,73,109,0.12)", display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setShowLeaveModal(true)} className="tool-btn danger" style={{ padding: "6px 14px", fontSize: "11px" }}>Exit</button>
          <div style={{ width: "1px", height: "18px", background: "rgba(225,73,109,0.15)" }} />
          <span style={{ fontFamily: "Syne", fontSize: "16px", fontWeight: 800 }}>TechSpec Studio</span>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input 
            type="text" 
            value={projectTitle} 
            onChange={e => setProjectTitle(e.target.value)} 
            style={{ background: "#1a0f14", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "8px", color: "#fff", padding: "6px 12px", fontSize: "12px", outline: "none", width: "320px" }}
            placeholder="Document Title"
          />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={exportAsMarkdown} className="tool-btn" style={{ border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", background: "rgba(56,189,248,0.08)", padding: "6px 14px", fontSize: "12px", fontWeight: 600 }}>
            📝 Export Markdown (RFC.md)
          </button>
          <button onClick={exportAsHTML} className="tool-btn" style={{ border: "1px solid rgba(225,73,109,0.25)", color: "#fff", background: "rgba(255,255,255,0.02)", padding: "6px 14px", fontSize: "12px" }}>
            Export HTML
          </button>
          <button onClick={triggerPrint} className="tool-btn" style={{ border: "1px solid rgba(225,73,109,0.25)", color: "#fff", background: "rgba(255,255,255,0.02)", padding: "6px 14px", fontSize: "12px" }}>
            Print / PDF
          </button>
          <button onClick={handleSaveAndExit} className="tool-btn primary" style={{ background: "linear-gradient(135deg,#eba5b6,#942945)", border: "none", color: "#fff", padding: "6px 16px", fontSize: "12px" }}>
            Save Document
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Left Sidebar: Block Inserter */}
        <div style={{ width: "300px", minWidth: "300px", borderRight: "1px solid rgba(225,73,109,0.12)", background: "rgba(10,8,7,0.5)", display: "flex", flexDirection: "column", padding: "20px", gap: "20px" }}>
          
          <div>
            <span style={{ fontSize: "10px", color: "#eba5b6", fontWeight: 700, letterSpacing: "0.06em", display: "block", marginBottom: "8px" }}>INSERT TECH BLOCKS</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button onClick={() => addBlock("h1")} className="tool-btn" style={{ padding: "6px", fontSize: "11px", justifyContent: "center" }}>H1 Title</button>
              <button onClick={() => addBlock("h2")} className="tool-btn" style={{ padding: "6px", fontSize: "11px", justifyContent: "center" }}>H2 Section</button>
              <button onClick={() => addBlock("p")} className="tool-btn" style={{ padding: "6px", fontSize: "11px", justifyContent: "center" }}>Paragraph</button>
              <button onClick={() => addBlock("callout")} className="tool-btn" style={{ padding: "6px", fontSize: "11px", justifyContent: "center", color: "#38bdf8" }}>📘 Callout</button>
              <button onClick={() => addBlock("code")} className="tool-btn" style={{ padding: "6px", fontSize: "11px", justifyContent: "center", color: "#e1496d" }}>💻 Code Block</button>
              <button onClick={() => addBlock("api_endpoint")} className="tool-btn" style={{ padding: "6px", fontSize: "11px", justifyContent: "center", color: "#22c55e" }}>📡 API Route</button>
              <button onClick={() => addBlock("table")} className="tool-btn" style={{ padding: "6px", fontSize: "11px", justifyContent: "center", gridColumn: "span 2" }}>📋 Env Config Table</button>
            </div>
          </div>

          {/* Pre-built Templates */}
          <div>
            <span style={{ fontSize: "10px", color: "#eba5b6", fontWeight: 700, letterSpacing: "0.06em", display: "block", marginBottom: "8px" }}>TECH SPEC TEMPLATES</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { name: "📜 System Architecture RFC", title: "RFC-042: Distributed GPU Raytracing Architecture" },
                { name: "📡 API Endpoint Spec", title: "API-Spec: Pipeline Batch Execution & Webhooks" },
                { name: "🚨 Incident Post-Mortem", title: "Post-Mortem: 2026-08-12 Redis Shard Failover Incident" },
                { name: "📦 Open Source README", title: "Creatify: Modern High-Performance Creative Engine" }
              ].map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setProjectTitle(tpl.title);
                    alert(`✓ Loaded template: ${tpl.name}`);
                  }}
                  className="tool-btn"
                  style={{ fontSize: "11px", justifyContent: "flex-start", padding: "8px 10px" }}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(225,73,109,0.08)" }} />

          {/* Active Block Inspector */}
          {activeBlock ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: "#eba5b6", fontWeight: 700 }}>EDITING BLOCK ({activeBlock.type.toUpperCase()})</span>
                <button onClick={() => deleteBlock(activeBlock.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "11px" }}>✕ Delete</button>
              </div>

              {/* Text content block editor */}
              {(activeBlock.type === "h1" || activeBlock.type === "h2" || activeBlock.type === "p" || activeBlock.type === "quote") && (
                <div>
                  <label style={{ fontSize: "10px", color: "#5c5650", display: "block", marginBottom: "4px" }}>Block Text</label>
                  <textarea
                    value={activeBlock.content}
                    onChange={e => updateBlockContent(activeBlock.id, e.target.value)}
                    style={{ width: "100%", height: "120px", background: "#1a0f14", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "8px", color: "#fff", padding: "8px 12px", fontSize: "11.5px", resize: "none", outline: "none" }}
                  />
                </div>
              )}

              {/* Code block editor */}
              {activeBlock.type === "code" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "10px", color: "#5c5650", display: "block", marginBottom: "4px" }}>Language</label>
                    <select
                      value={activeBlock.language || "rust"}
                      onChange={e => updateBlockProp(activeBlock.id, "language", e.target.value)}
                      style={{ width: "100%", background: "#1a0f14", color: "#fff", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "6px", fontSize: "11px", padding: "6px" }}
                    >
                      <option value="rust">Rust</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="go">Go</option>
                      <option value="sql">SQL</option>
                      <option value="bash">Bash / Shell</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#5c5650", display: "block", marginBottom: "4px" }}>Source Code</label>
                    <textarea
                      rows={6}
                      value={activeBlock.content}
                      onChange={e => updateBlockContent(activeBlock.id, e.target.value)}
                      style={{ width: "100%", background: "#0b040c", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "8px", color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", padding: "8px 12px", fontSize: "11px", outline: "none" }}
                    />
                  </div>
                </div>
              )}

              {/* Callout editor */}
              {activeBlock.type === "callout" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "10px", color: "#5c5650", display: "block", marginBottom: "4px" }}>Callout Type</label>
                    <select
                      value={activeBlock.calloutType || "info"}
                      onChange={e => updateBlockProp(activeBlock.id, "calloutType", e.target.value)}
                      style={{ width: "100%", background: "#1a0f14", color: "#fff", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "6px", fontSize: "11px", padding: "6px" }}
                    >
                      <option value="info">📘 Note / Info</option>
                      <option value="warning">⚠️ Warning</option>
                      <option value="tip">⚡ Performance Tip</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#5c5650", display: "block", marginBottom: "4px" }}>Callout Message</label>
                    <textarea
                      rows={4}
                      value={activeBlock.content}
                      onChange={e => updateBlockContent(activeBlock.id, e.target.value)}
                      style={{ width: "100%", background: "#1a0f14", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "8px", color: "#fff", padding: "8px 12px", fontSize: "11.5px", outline: "none" }}
                    />
                  </div>
                </div>
              )}

              {/* API Endpoint editor */}
              {activeBlock.type === "api_endpoint" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "10px", color: "#5c5650", display: "block", marginBottom: "4px" }}>Method</label>
                      <select
                        value={activeBlock.method || "POST"}
                        onChange={e => updateBlockProp(activeBlock.id, "method", e.target.value)}
                        style={{ width: "100%", background: "#1a0f14", color: "#fff", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "6px", fontSize: "11px", padding: "6px" }}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ fontSize: "10px", color: "#5c5650", display: "block", marginBottom: "4px" }}>Route</label>
                      <input
                        type="text"
                        value={activeBlock.route || "/v1/api"}
                        onChange={e => updateBlockProp(activeBlock.id, "route", e.target.value)}
                        style={{ width: "100%", background: "#1a0f14", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "6px", color: "#fff", padding: "6px", fontSize: "11px" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#5c5650", display: "block", marginBottom: "4px" }}>Response JSON Body</label>
                    <textarea
                      rows={5}
                      value={activeBlock.resBody}
                      onChange={e => updateBlockProp(activeBlock.id, "resBody", e.target.value)}
                      style={{ width: "100%", background: "#080309", border: "1px solid rgba(225,73,109,0.15)", borderRadius: "8px", color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", padding: "8px 12px", fontSize: "11px", outline: "none" }}
                    />
                  </div>
                </div>
              )}

              {/* Table controls */}
              {activeBlock.type === "table" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button onClick={() => addTableRow(activeBlock.id)} className="tool-btn" style={{ fontSize: "11px", justifyContent: "center", padding: "6px" }}>+ Add Config Row</button>
                </div>
              )}

            </div>
          ) : (
            <div style={{ color: "#5c5650", fontSize: "11px", textAlign: "center" }}>
              Select any document block to customize it.
            </div>
          )}

        </div>

        {/* Center: A4 styled Workbench sheet */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0f070b", overflowY: "auto", padding: "40px 20px", alignItems: "center" }}>
          
          {/* Paper sheet */}
          <div className="print-sheet" style={{ width: "100%", maxWidth: "680px", minHeight: "842px", background: "#ffffff", color: "#1a202c", padding: "50px", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {docBlocks.map(block => {
              const isSelected = block.id === activeBlockId;
              
              return (
                <div
                  key={block.id}
                  onClick={() => setActiveBlockId(block.id)}
                  style={{
                    position: "relative",
                    borderRadius: "6px",
                    outline: isSelected ? "1.5px dashed #e1496d" : "none",
                    cursor: "pointer",
                    padding: "4px 8px",
                    transition: "outline 0.2s"
                  }}
                >
                  
                  {/* Title block */}
                  {block.type === "h1" && (
                    <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "26px", fontWeight: 800, margin: 0, color: "#0f172a", letterSpacing: "-0.02em" }}>
                      {block.content}
                    </h1>
                  )}

                  {/* Subtitle block */}
                  {block.type === "h2" && (
                    <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "#1e293b", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                      {block.content}
                    </h2>
                  )}

                  {/* Paragraph block */}
                  {block.type === "p" && (
                    <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#334155", margin: 0 }}>
                      {block.content}
                    </p>
                  )}

                  {/* Callout block */}
                  {block.type === "callout" && (
                    <div style={{
                      borderLeft: `4px solid ${block.calloutType === "warning" ? "#ef4444" : block.calloutType === "tip" ? "#22c55e" : "#0284c7"}`,
                      background: block.calloutType === "warning" ? "#fef2f2" : block.calloutType === "tip" ? "#f0fdf4" : "#f0f9ff",
                      padding: "10px 14px", borderRadius: "0 6px 6px 0", fontSize: "12px",
                      color: block.calloutType === "warning" ? "#991b1b" : block.calloutType === "tip" ? "#166534" : "#075985",
                      fontWeight: 500
                    }}>
                      {block.content}
                    </div>
                  )}

                  {/* Code block */}
                  {block.type === "code" && (
                    <div style={{ background: "#0a030b", border: "1px solid rgba(225,73,109,0.3)", borderRadius: "8px", overflow: "hidden", fontFamily: "'JetBrains Mono', monospace" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "6px 12px" }}>
                        <span style={{ fontSize: "10px", color: "#e1496d", fontWeight: 700, textTransform: "uppercase" }}>{block.language || "rust"}</span>
                        <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(block.content); alert("✓ Code snippet copied!"); }} style={{ background: "none", border: "none", color: "#38bdf8", fontSize: "10px", cursor: "pointer", fontWeight: 600 }}>Copy</button>
                      </div>
                      <pre style={{ margin: 0, padding: "12px", fontSize: "11px", color: "#38bdf8", lineHeight: 1.5, overflowX: "auto" }}>
                        {block.content}
                      </pre>
                    </div>
                  )}

                  {/* API Endpoint block */}
                  {block.type === "api_endpoint" && (
                    <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ background: "#22c55e", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 800 }}>{block.method || "POST"}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{block.route || "/v1/api"}</span>
                        <span style={{ marginLeft: "auto", fontSize: "10px", background: "#e2e8f0", color: "#475569", padding: "2px 6px", borderRadius: "4px" }}>{block.resCode || "200 OK"}</span>
                      </div>
                      <pre style={{ margin: 0, background: "#080309", padding: "10px", borderRadius: "6px", color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", overflowX: "auto" }}>
                        {block.resBody}
                      </pre>
                    </div>
                  )}

                  {/* Quote block */}
                  {block.type === "quote" && (
                    <div style={{ borderLeft: "4px solid #e1496d", paddingLeft: "14px", fontStyle: "italic", fontSize: "13px", color: "#4a5568", background: "#fdf2f4", padding: "10px 14px", borderRadius: "0 6px 6px 0" }}>
                      {block.content}
                    </div>
                  )}

                  {/* Interactive Table block */}
                  {block.type === "table" && (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
                            {block.headers.map((h, i) => (
                              <th key={i} style={{ padding: "8px 10px", fontWeight: 600, color: "#1e293b" }}>{h}</th>
                            ))}
                            {isSelected && <th style={{ width: "30px" }} />}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                              {row.map((cell, colIdx) => (
                                <td key={colIdx} style={{ padding: "6px 8px" }}>
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={e => updateTableCell(block.id, rowIdx, colIdx, e.target.value)}
                                    style={{ width: "100%", border: "none", background: "none", fontSize: "11.5px", outline: "none", padding: "2px" }}
                                  />
                                </td>
                              ))}
                              {isSelected && (
                                <td style={{ textAlign: "center" }}>
                                  <button onClick={(e) => { e.stopPropagation(); deleteTableRow(block.id, rowIdx); }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "11px" }}>✕</button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Exit confirmation modal */}
      {showLeaveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(12px)" }}>
          <div className="glass-panel" style={{ width: "420px", padding: "30px", borderRadius: "24px", textAlign: "center", border: "1px solid rgba(225,73,109,0.25)", background: "#131110" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📄</div>
            <h3 style={{ fontFamily: "Syne,sans-serif", fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>Save interactive report?</h3>
            <p style={{ fontSize: "13px", color: "#8c8780", lineHeight: 1.6, marginBottom: "24px" }}>
              Would you like to save this formatted report to your past works database, or discard your current session edits?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="tool-btn primary" onClick={handleSaveAndExit} style={{ justifyContent: "center", padding: "12px", fontSize: "13px" }}>
                Save & Exit to Dashboard
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="tool-btn danger" onClick={handleDiscardAndExit} style={{ flex: 1, justifyContent: "center", padding: "10px", fontSize: "12px" }}>
                  Discard Edits
                </button>
                <button className="tool-btn" onClick={() => setShowLeaveModal(false)} style={{ flex: 1, justifyContent: "center", padding: "10px", fontSize: "12px" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
