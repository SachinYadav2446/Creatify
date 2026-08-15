import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import PresentationPage from "./components/PresentationPage";
import VideoEditor from "./components/VideoEditor";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import ImageEditor from "./components/ImageEditor";
import LogoMaker from "./components/LogoMaker";
import SocialStudio from "./components/SocialStudio";
import Documents from "./components/Documents";
import PrintDesign from "./components/PrintDesign";
import AiMagic from "./components/AiMagic";
import ProjectsDetail from "./components/ProjectsDetail";
import Whiteboard from "./components/Whiteboard";
import InfiniteStudio from "./components/InfiniteStudio";
import BrandKit from "./components/BrandKit";
import TemplatesMarketplace from "./components/TemplatesMarketplace";
import WorkflowPipelines from "./components/WorkflowPipelines";
import MockupStudio from "./components/MockupStudio";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [authTab, setAuthTab] = useState("signup");
  const [user, setUser] = useState(null);
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem("creatify_theme") || "light");
  const [activePresentation, setActivePresentation] = useState(null);
  const [activeVideoProject, setActiveVideoProject] = useState(null);
  const [activeImageProject, setActiveImageProject] = useState(null);
  const [activeLogoProject, setActiveLogoProject] = useState(null);
  const [activeSocialProject, setActiveSocialProject] = useState(null);
  const [activeDocProject, setActiveDocProject] = useState(null);
  const [activePrintProject, setActivePrintProject] = useState(null);
  const [activeWhiteboardProject, setActiveWhiteboardProject] = useState(null);
  const [activeStudioProject, setActiveStudioProject] = useState(null);

  // Sync theme setting to body/root styles for seamless app-wide integration
  useEffect(() => {
    const root = document.documentElement;
    if (appTheme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--app-bg",   "#120810");
      root.style.setProperty("--app-text", "#fdf2f4");
      root.style.setProperty("--app-border","rgba(225,73,109,0.18)");
      document.body.style.background = "#0e060b";
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--app-bg",   "#f7f6fb");
      root.style.setProperty("--app-text", "#2d2d2d");
      root.style.setProperty("--app-border","rgba(148,41,69,0.10)");
      document.body.style.background = "#f7f6fb";
    }
  }, [appTheme]);

  // Load session on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("creatify_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("creatify_user");
      }
    }

    const token = localStorage.getItem("creatify_token");
    if (token) {
      fetch((window.API_URL || "http://localhost:3001") + "/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Invalid token");
      })
      .then(data => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("creatify_user", JSON.stringify(data.user));
        }
      })
      .catch(err => {
        console.warn("Session verification failed, logging out:", err.message);
        handleSignOut();
      });
    }
  }, []);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("creatify_token");
    localStorage.removeItem("creatify_user");
    setCurrentPage("home");
  };

  // Manage body overflow and scroll reset on page changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentPage === "editor" || currentPage === "presentation") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [currentPage]);

  const navigate = (page, data) => {
    if (page === "auth") {
      setAuthTab(data || "signup");
      setCurrentPage("auth");
    } else if (page === "presentation_load") {
      setActivePresentation(data);
      setCurrentPage("presentation");
    } else if (page === "presentation") {
      setActivePresentation(null); // Load clean editor
      setCurrentPage("presentation");
    } else if (page === "editor_load") {
      setActiveVideoProject(data);
      setCurrentPage("editor");
    } else if (page === "editor") {
      setActiveVideoProject(null); // Load clean editor
      setCurrentPage("editor");
    } else if (page === "image_editor_load") {
      setActiveImageProject(data);
      setCurrentPage("image_editor");
    } else if (page === "image_editor") {
      setActiveImageProject(null);
      setCurrentPage("image_editor");
    } else if (page === "logo_maker_load") {
      setActiveLogoProject(data);
      setCurrentPage("logo_maker");
    } else if (page === "logo_maker") {
      setActiveLogoProject(null);
      setCurrentPage("logo_maker");
    } else if (page === "social_studio_load") {
      setActiveSocialProject(data);
      setCurrentPage("social_studio");
    } else if (page === "social_studio") {
      setActiveSocialProject(null);
      setCurrentPage("social_studio");
    } else if (page === "documents_load") {
      setActiveDocProject(data);
      setCurrentPage("documents");
    } else if (page === "documents") {
      setActiveDocProject(null);
      setCurrentPage("documents");
    } else if (page === "print_design_load") {
      setActivePrintProject(data);
      setCurrentPage("print_design");
    } else if (page === "print_design") {
      setActivePrintProject(null);
      setCurrentPage("print_design");
    } else if (page === "whiteboard_load") {
      setActiveWhiteboardProject(data);
      setCurrentPage("whiteboard");
    } else if (page === "whiteboard") {
      setActiveWhiteboardProject(null);
      setCurrentPage("whiteboard");
    } else if (page === "infinite_studio") {
      setActiveStudioProject(data || null);
      setCurrentPage("infinite_studio");
    } else {
      setCurrentPage(page);
    }
  };

  if (currentPage === "home") {
    return <HomePage onNavigate={navigate} user={user} onSignOut={handleSignOut} theme={appTheme} />;
  }

  if (currentPage === "auth") {
    return (
      <AuthPage
        initialTab={authTab}
        onBack={() => setCurrentPage("home")}
        onSuccess={(userData) => {
          setUser(userData);
          setCurrentPage("home");
        }}
      />
    );
  }

  if (currentPage === "profile") {
    return (
      <ProfilePage
        onBack={() => setCurrentPage("home")}
        onNavigate={navigate}
        user={user}
        onSignOut={handleSignOut}
        theme={appTheme}
        onToggleTheme={(newTheme) => {
          setAppTheme(newTheme);
          localStorage.setItem("creatify_theme", newTheme);
        }}
      />
    );
  }

  if (currentPage === "settings") {
    return (
      <SettingsPage
        onBack={() => navigate("home")}
        user={user}
        onSignOut={handleSignOut}
        theme={appTheme}
        onToggleTheme={(t) => { setAppTheme(t); localStorage.setItem("creatify_theme", t); }}
      />
    );
  }

  if (currentPage === "presentation") {
    return (
      <PresentationPage
        onBack={() => setCurrentPage("home")}
        user={user}
        initialPresentation={activePresentation}
      />
    );
  }

  if (currentPage === "image_editor") {
    return (
      <ImageEditor
        onBack={() => setCurrentPage("home")}
        user={user}
        initialProject={activeImageProject}
      />
    );
  }

  if (currentPage === "logo_maker") {
    return (
      <LogoMaker
        onBack={() => setCurrentPage("home")}
        user={user}
        initialProject={activeLogoProject}
      />
    );
  }

  if (currentPage === "social_studio") {
    return (
      <SocialStudio
        onBack={() => setCurrentPage("home")}
        user={user}
        initialProject={activeSocialProject}
      />
    );
  }

  if (currentPage === "documents") {
    return (
      <Documents
        onBack={() => setCurrentPage("home")}
        user={user}
        initialProject={activeDocProject}
      />
    );
  }

  if (currentPage === "print_design") {
    return (
      <PrintDesign
        onBack={() => setCurrentPage("home")}
        user={user}
        initialProject={activePrintProject}
      />
    );
  }

  if (currentPage === "ai_magic") {
    return (
      <AiMagic
        onBack={() => setCurrentPage("home")}
        user={user}
      />
    );
  }

  if (currentPage === "projects" || currentPage === "vault") {
    return (
      <HomePage
        onNavigate={navigate}
        user={user}
        onSignOut={handleSignOut}
        theme={appTheme}
        initialNav="vault"
      />
    );
  }

  if (currentPage === "whiteboard") {
    return (
      <Whiteboard
        onBack={() => setCurrentPage("home")}
        user={user}
        initialProject={activeWhiteboardProject}
      />
    );
  }

  if (currentPage === "infinite_studio") {
    return (
      <InfiniteStudio
        onBack={() => setCurrentPage("home")}
        user={user}
      />
    );
  }

  if (currentPage === "brand_kit") {
    return (
      <BrandKit
        onBack={() => setCurrentPage("home")}
        onNavigate={navigate}
        user={user}
      />
    );
  }

  if (currentPage === "templates") {
    return (
      <TemplatesMarketplace
        onBack={() => setCurrentPage("home")}
        onNavigate={navigate}
        user={user}
      />
    );
  }

  if (currentPage === "pipelines") {
    return (
      <WorkflowPipelines
        onBack={() => setCurrentPage("home")}
        onNavigate={navigate}
        user={user}
      />
    );
  }

  if (currentPage === "mockup_studio") {
    return (
      <MockupStudio
        onBack={() => setCurrentPage("home")}
        onNavigate={navigate}
        user={user}
      />
    );
  }

  // Video Editor (default / "editor" page)
  return (
    <VideoEditor
      onBack={() => setCurrentPage("home")}
      user={user}
      initialProject={activeVideoProject}
    />
  );
}
