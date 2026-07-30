import { useState, useEffect } from "react";
import THEME from "../theme";

export default function ProjectsDetail({ onBack, onNavigate, user }) {
  const [pastWorks, setPastWorks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatify_past_works");
    if (saved) {
      try {
        setPastWorks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse past works", e);
      }
    }
  }, []);

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("creatify_token");
    if (token) {
      try {
        await fetch(`${window.API_URL || "http://localhost:3001"}/api/projects/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to delete project from DB:", err.message);
      }
    }

    const updated = pastWorks.filter(p => p.id !== id);
    localStorage.setItem("creatify_past_works", JSON.stringify(updated));
    setPastWorks(updated);
    setSelectedProject(null);
  };

  const handleEditProject = (project) => {
    const toolMap = {
      "Video Editor": "editor_load",
      "Slide Studio": "presentation_load",
      "Image Editor": "image_editor_load",
      "Logo Maker": "logo_maker_load",
      "Whiteboard": "whiteboard_load",
      "Documents": "documents_load",
    };
    if (toolMap[project.tool]) {
      onNavigate(toolMap[project.tool], project);
    }
  };

  const colors = {
    bg: "#f7f4f7",
    text: "#2d2d2d",
    textMuted: "#888",
    border: "rgba(148, 41, 69, 0.1)",
    cardBorder: "rgba(148, 41, 69, 0.12)",
    accent: "#942945",
    accentLight: "#e1496d",
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, color: colors.text, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        padding: "48px 48px 32px",
        background: `linear-gradient(135deg, rgba(148, 41, 69, 0.05), rgba(225, 73, 109, 0.02))`,
        borderBottom: `1px solid ${colors.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <h1 style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "36px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.03em",
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "8px",
          }}>Your Projects</h1>
          <p style={{
            fontSize: "14px",
            color: colors.textMuted,
            margin: 0,
            fontWeight: 400,
          }}>{pastWorks.length} {pastWorks.length === 1 ? "project" : "projects"} created</p>
        </div>
      </header>

      <main style={{ flex: 1, overflow: "auto", padding: "48px" }}>
        {pastWorks.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "120px 40px",
          }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>📁</div>
            <h2 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 12px 0", color: colors.accent }}>No projects yet</h2>
            <p style={{ color: colors.textMuted, margin: "0 0 32px 0", fontSize: "15px", lineHeight: 1.6 }}>
              Start creating your first design to see your projects here
            </p>
            <button
              onClick={() => onNavigate("editor")}
              style={{
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`,
                color: "#fff",
                border: "none",
                padding: "14px 36px",
                borderRadius: "28px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "15px",
                transition: "all 0.3s",
                boxShadow: "0 8px 24px rgba(148, 41, 69, 0.25)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(148, 41, 69, 0.35)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(148, 41, 69, 0.25)";
              }}
            >
              + Create New Project
            </button>
          </div>
        ) : selectedProject ? (
          // Detailed View
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                color: colors.accent,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "32px",
                transition: "all 0.2s",
                padding: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateX(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              ← Back to Projects
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px" }}>
              {/* Main Preview */}
              <div>
                <div style={{
                  aspectRatio: "16 / 9",
                  borderRadius: "28px",
                  overflow: "hidden",
                  background: selectedProject.gradient || "#f0f0f0",
                  border: `1px solid ${colors.cardBorder}`,
                  marginBottom: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 16px 48px rgba(148, 41, 69, 0.12)",
                }}>
                  {selectedProject.image ? (
                    <img src={selectedProject.image} alt={selectedProject.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ fontSize: "64px", opacity: 0.2 }}>🎨</div>
                  )}
                </div>

                {/* Details Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                  {[
                    { label: "Category", value: selectedProject.category, icon: "📂" },
                    { label: "Year", value: selectedProject.year, icon: "📅" },
                    { label: "Tool", value: selectedProject.tool, icon: "🛠️" },
                    { label: "Status", value: "Saved", icon: "✓" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: "18px",
                        padding: "20px",
                        transition: "all 0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "rgba(148, 41, 69, 0.25)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(148, 41, 69, 0.08)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = colors.cardBorder;
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        color: colors.accent,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        marginBottom: "8px",
                        fontWeight: 700,
                      }}>
                        <span>{item.icon}</span>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: colors.text }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div style={{
                  background: "#fff",
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: "24px",
                  padding: "32px",
                  position: "sticky",
                  top: "120px",
                  boxShadow: "0 8px 32px rgba(148, 41, 69, 0.08)",
                }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px 0", color: colors.text }}>
                    {selectedProject.title}
                  </h3>

                  <p style={{ fontSize: "13px", color: colors.textMuted, lineHeight: 1.7, margin: "0 0 28px 0" }}>
                    {selectedProject.desc || "A beautifully crafted design created in Creatify."}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px" }}>
                    {selectedProject.tags && selectedProject.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "12px",
                          background: `linear-gradient(135deg, rgba(148, 41, 69, 0.08), rgba(225, 73, 109, 0.04))`,
                          color: colors.accent,
                          padding: "7px 14px",
                          borderRadius: "14px",
                          fontWeight: 600,
                          letterSpacing: "0.01em",
                          border: `1px solid rgba(148, 41, 69, 0.15)`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button
                      onClick={() => handleEditProject(selectedProject)}
                      style={{
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`,
                        color: "#fff",
                        border: "none",
                        padding: "13px 16px",
                        borderRadius: "14px",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.3s",
                        width: "100%",
                        boxShadow: "0 6px 16px rgba(148, 41, 69, 0.18)",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 10px 28px rgba(148, 41, 69, 0.28)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(148, 41, 69, 0.18)";
                      }}
                    >
                      ✏️ Edit Project
                    </button>
                    <button
                      onClick={() => setSelectedProject(null)}
                      style={{
                        background: "rgba(148, 41, 69, 0.06)",
                        color: colors.accent,
                        border: `1.5px solid rgba(148, 41, 69, 0.2)`,
                        padding: "13px 16px",
                        borderRadius: "14px",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.3s",
                        width: "100%",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(148, 41, 69, 0.12)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(148, 41, 69, 0.06)";
                      }}
                    >
                      📋 View All
                    </button>
                    <button
                      onClick={() => handleDeleteProject(selectedProject.id)}
                      style={{
                        background: "rgba(220, 38, 38, 0.06)",
                        color: "#dc2626",
                        border: `1.5px solid rgba(220, 38, 38, 0.2)`,
                        padding: "13px 16px",
                        borderRadius: "14px",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.3s",
                        width: "100%",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(220, 38, 38, 0.12)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(220, 38, 38, 0.06)";
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Grid View
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "28px" }}>
              {pastWorks.map((project) => (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "24px",
                    overflow: "hidden",
                    background: "#fff",
                    border: `1px solid ${colors.border}`,
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: hoveredProjectId === project.id ? "translateY(-12px)" : "none",
                    boxShadow: hoveredProjectId === project.id
                      ? "0 24px 48px rgba(148, 41, 69, 0.18)"
                      : "0 4px 16px rgba(148, 41, 69, 0.06)",
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    aspectRatio: "4 / 3",
                    background: project.gradient || "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: hoveredProjectId === project.id ? "brightness(0.8) contrast(1.1)" : "brightness(1)",
                          transition: "filter 0.4s",
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: "56px", opacity: 0.15 }}>🎨</div>
                    )}
                    {hoveredProjectId === project.id && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0, 0, 0, 0.35)",
                        backdropFilter: "blur(3px)",
                      }}>
                        <div style={{ fontSize: "40px", animation: "pulse 2s infinite", color: "#fff" }}>👁️</div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "20px" }}>
                    <h3 style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      margin: "0 0 6px 0",
                      color: colors.accent,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: colors.textMuted, margin: "0 0 12px 0", fontWeight: 400 }}>
                      {project.category} • {project.year}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {project.tags && project.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "11px",
                            background: "rgba(148, 41, 69, 0.08)",
                            color: colors.accent,
                            padding: "4px 10px",
                            borderRadius: "10px",
                            fontWeight: 600,
                            border: "1px solid rgba(148, 41, 69, 0.12)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
