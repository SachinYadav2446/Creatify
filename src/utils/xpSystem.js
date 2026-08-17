/**
 * Creatify Real-Time XP & Ranking Ecosystem
 * 
 * Rules:
 *  - Every project publish: +100 XP
 *  - Every project creation: +20 XP
 *  - When published template gets downloaded: +20 XP
 *  - High-res artifact export/render: +15 XP
 *  - Automated pipeline execution: +25 XP
 *  - AI Prompt synthesis: +15 XP
 */

export const XP_RULES = {
  PUBLISH_TEMPLATE: {
    xp: 100,
    title: "Template Published Live",
    icon: "award",
    badge: "PUBLISH",
    color: "#e1496d"
  },
  CREATE_PROJECT: {
    xp: 20,
    title: "New Creative Project Created",
    icon: "sparkles",
    badge: "CREATION",
    color: "#38bdf8"
  },
  TEMPLATE_DOWNLOADED: {
    xp: 20,
    title: "Template Remixed by Community",
    icon: "download",
    badge: "COMMUNITY",
    color: "#10b981"
  },
  EXPORT_RENDER: {
    xp: 15,
    title: "High-Res Masterpiece Exported",
    icon: "cpu",
    badge: "RENDER",
    color: "#f59e0b"
  },
  EXECUTE_PIPELINE: {
    xp: 25,
    title: "Automated Pipeline Executed",
    icon: "zap",
    badge: "PIPELINE",
    color: "#a855f7"
  },
  AI_GENERATE: {
    xp: 15,
    title: "Neural Prompt-to-DOM Synthesis",
    icon: "sparkles",
    badge: "AI SYNTHESIS",
    color: "#ec4899"
  }
};

export const RANK_TIERS = [
  { level: 1,  minXp: 0,     maxXp: 99,    title: "Novice Synthesizer",  badge: "TIER I",    color: "#94a3b8", icon: "disc",       aura: "#94a3b8" },
  { level: 2,  minXp: 100,   maxXp: 249,   title: "Apprentice Artisan",  badge: "TIER II",   color: "#38bdf8", icon: "sparkles",   aura: "#38bdf8" },
  { level: 3,  minXp: 250,   maxXp: 499,   title: "Visual Alchemist",    badge: "TIER III",  color: "#a855f7", icon: "sparkles",   aura: "#a855f7" },
  { level: 4,  minXp: 500,   maxXp: 999,   title: "Studio Visionary",    badge: "TIER IV",   color: "#ec4899", icon: "palette",    aura: "#ec4899" },
  { level: 5,  minXp: 1000,  maxXp: 1999,  title: "Motion Maestro",      badge: "TIER V",    color: "#ef4444", icon: "video",      aura: "#ef4444" },
  { level: 6,  minXp: 2000,  maxXp: 3499,  title: "3D Raytracer",        badge: "TIER VI",   color: "#c084fc", icon: "box",        aura: "#c084fc" },
  { level: 7,  minXp: 3500,  maxXp: 5499,  title: "Pipeline Virtuoso",   badge: "TIER VII",  color: "#f59e0b", icon: "zap",        aura: "#f59e0b" },
  { level: 8,  minXp: 5500,  maxXp: 7999,  title: "Master Grandmaster",  badge: "TIER VIII", color: "#10b981", icon: "trophy",     aura: "#10b981" },
  { level: 9,  minXp: 8000,  maxXp: 11999, title: "Sovereign Alchemist", badge: "TIER IX",   color: "#e1496d", icon: "crown",      aura: "#e1496d" },
  { level: 10, minXp: 12000, maxXp: 999999,title: "Cosmic Creator",      badge: "MAX TIER",  color: "#fbbf24", icon: "star",       aura: "#fbbf24" },
];

const STORAGE_KEY = "creatify_xp_ecosystem_v1";

/**
 * Compute level and progress details from total XP
 */
export function getLevelInfo(totalXp = 0) {
  const currentRank = RANK_TIERS.find(r => totalXp >= r.minXp && totalXp <= r.maxXp) || RANK_TIERS[0];
  const nextRank = RANK_TIERS.find(r => r.level === currentRank.level + 1) || currentRank;
  
  const xpInCurrentLevel = totalXp - currentRank.minXp;
  const xpRequiredForLevel = currentRank.level === 10 
    ? 1 
    : (nextRank.minXp - currentRank.minXp);
  
  const progressPercent = currentRank.level === 10 
    ? 100 
    : Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpRequiredForLevel) * 100)));

  return {
    level: currentRank.level,
    rankTitle: currentRank.title,
    badge: currentRank.badge,
    color: currentRank.color,
    icon: currentRank.icon,
    aura: currentRank.aura,
    minXp: currentRank.minXp,
    maxXp: currentRank.maxXp,
    nextRankTitle: nextRank.title,
    nextRankXp: nextRank.minXp,
    xpRemaining: Math.max(0, nextRank.minXp - totalXp),
    progressPercent,
  };
}

/**
 * Seed initial sample XP events if user is fresh
 */
function getInitialState() {
  const initialActivities = [
    {
      id: "act_init_1",
      type: "PUBLISH_TEMPLATE",
      xp: 100,
      title: "Template Published Live",
      detail: "Published 'Cyberpunk 4K Neon Title Reveal' to Marketplace",
      timestamp: Date.now() - 3600 * 1000 * 4,
      badge: "PUBLISH",
      color: "#e1496d"
    },
    {
      id: "act_init_2",
      type: "TEMPLATE_DOWNLOADED",
      xp: 20,
      title: "Template Remixed by Community",
      detail: "Community creator remixed your 'Isometric Device Showcase'",
      timestamp: Date.now() - 3600 * 1000 * 12,
      badge: "COMMUNITY",
      color: "#10b981"
    },
    {
      id: "act_init_3",
      type: "CREATE_PROJECT",
      xp: 20,
      title: "New Creative Project Created",
      detail: "Created project 'Procedural Kinetic Brand Identity'",
      timestamp: Date.now() - 3600 * 1000 * 24,
      badge: "CREATION",
      color: "#38bdf8"
    },
    {
      id: "act_init_4",
      type: "EXECUTE_PIPELINE",
      xp: 25,
      title: "Automated Pipeline Executed",
      detail: "Executed 5-node video color grading graph",
      timestamp: Date.now() - 3600 * 1000 * 48,
      badge: "PIPELINE",
      color: "#a855f7"
    }
  ];

  const totalXp = initialActivities.reduce((sum, a) => sum + a.xp, 0); // 165 XP (Level 2)
  return {
    totalXp,
    stats: {
      publishes: 1,
      creations: 1,
      downloads: 1,
      exports: 0,
      pipelines: 1
    },
    activityLog: initialActivities
  };
}

/**
 * Get current XP state from localStorage
 */
export function getXpState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return {
        ...initial,
        levelInfo: getLevelInfo(initial.totalXp)
      };
    }
    const state = JSON.parse(raw);
    return {
      ...state,
      levelInfo: getLevelInfo(state.totalXp)
    };
  } catch (e) {
    console.error("Error reading XP state:", e);
    const initial = getInitialState();
    return {
      ...initial,
      levelInfo: getLevelInfo(initial.totalXp)
    };
  }
}

/**
 * Award XP for an action and update the activity log
 */
export function awardXP(actionType, customDetail = {}) {
  const rule = XP_RULES[actionType];
  if (!rule) {
    console.warn(`XP rule not found for: ${actionType}`);
    return null;
  }

  try {
    const currentState = getXpState();
    const xpGained = customDetail.xpOverride || rule.xp;
    const newTotalXp = currentState.totalXp + xpGained;

    const newActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: actionType,
      xp: xpGained,
      title: customDetail.title || rule.title,
      detail: customDetail.detail || (customDetail.name ? `Project: "${customDetail.name}"` : rule.title),
      timestamp: Date.now(),
      badge: rule.badge,
      color: rule.color
    };

    // Update stats counters
    const newStats = { ...(currentState.stats || {}) };
    if (actionType === "PUBLISH_TEMPLATE") newStats.publishes = (newStats.publishes || 0) + 1;
    if (actionType === "CREATE_PROJECT") newStats.creations = (newStats.creations || 0) + 1;
    if (actionType === "TEMPLATE_DOWNLOADED") newStats.downloads = (newStats.downloads || 0) + 1;
    if (actionType === "EXPORT_RENDER") newStats.exports = (newStats.exports || 0) + 1;
    if (actionType === "EXECUTE_PIPELINE") newStats.pipelines = (newStats.pipelines || 0) + 1;

    const updatedState = {
      totalXp: newTotalXp,
      stats: newStats,
      activityLog: [newActivity, ...(currentState.activityLog || [])].slice(0, 100) // Keep last 100
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));

    const levelInfo = getLevelInfo(newTotalXp);
    const prevLevelInfo = getLevelInfo(currentState.totalXp);
    const leveledUp = levelInfo.level > prevLevelInfo.level;

    // Dispatch global event for instant reactive UI updates across all components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("creatify_xp_updated", {
        detail: {
          action: newActivity,
          totalXp: newTotalXp,
          levelInfo,
          leveledUp,
          xpGained
        }
      }));
    }

    return {
      success: true,
      xpGained,
      newTotalXp,
      levelInfo,
      leveledUp,
      activity: newActivity
    };
  } catch (e) {
    console.error("Failed to award XP:", e);
    return null;
  }
}
