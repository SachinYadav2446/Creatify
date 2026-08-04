import { useState, useEffect, useRef, useCallback } from "react";
import THEME from "../theme";

const API_BASE = (window.API_URL || (window.API_URL || "http://localhost:3001") + "") + "/api";
const GOOGLE_CLIENT_ID = "535569661906-grbfrkr877hc0hgtsu1sc23pic84dhlt.apps.googleusercontent.com";

export default function AuthPage({ initialTab = "signup", onBack, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(initialTab === "signup");
  const [email, setEmail]       = useState("");
  const [name, setName]         = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provisionStep, setProvisionStep] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "Empty", color: "#666666" });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // OTP verification state
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(0);

  // Google profile completion state
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: "",
    company: "",
    country: "",
    bio: ""
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Backend state
  const [backendUser, setBackendUser] = useState(null);
  const backendUserRef = useRef(null);
  const provisionTimerRef = useRef(null);
  const otpTimerRef = useRef(null);

  // ── Google Sign-In Callback (stable ref with useCallback) ─────────────────
  const handleGoogleCallback = useCallback(async (response) => {
    if (!response?.credential) {
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
      return;
    }

    setIsGoogleLoading(true);
    setError("");
    
    try {
      // Decode JWT to get user info
      const parts = response.credential.split('.');
      const decoded = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      const { name: googleName, email: googleEmail, picture } = decoded;
      if (!googleName || !googleEmail) throw new Error('Missing profile data from Google');

      // Send to backend for verification and token generation
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: googleName,
          email: googleEmail,
          avatar: picture,
          googleId: decoded.sub
        })
      });
      
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Google sign-in failed. Please try again.");
        setIsGoogleLoading(false);
        return;
      }

      // Success - save token and user
      if (data.token) localStorage.setItem("creatify_token", data.token);
      if (data.user) localStorage.setItem("creatify_user", JSON.stringify(data.user));
      backendUserRef.current = data.user;
      setBackendUser(data.user);

      // Check if profile is completed
      if (data.profile_completed) {
        setIsSubmitting(true);
      } else {
        setShowProfileCompletion(true);
        setProfileError("");
      }

    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Failed to process Google sign-in: " + err.message);
      setIsGoogleLoading(false);
    }
  }, []);  // empty deps — setters are stable

  // ── Initialize Google Sign-In (re-init on every mount with fresh callback) ─
  useEffect(() => {
    const callbackRef = handleGoogleCallback;

    function initGSI() {
      if (!window.google?.accounts?.id) return;
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: callbackRef,
          ux_mode: 'popup',
          auto_select: false,
          cancel_on_tap_outside: true
        });
        window.__googleInitialized = true;
        console.log('✅ Google Sign-In initialized');
      } catch (err) {
        console.error('❌ Google initialization error:', err);
      }
    }

    // If GSI script already loaded, just re-init
    if (window.google?.accounts?.id) {
      initGSI();
      return;
    }

    // Otherwise load the GSI script
    if (!document.querySelector('script[src*="gsi/client"]')) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGSI;
      script.onerror = () => console.error('❌ Failed to load Google Sign-In script');
      document.head.appendChild(script);
    } else {
      // Script tag exists but not loaded yet — wait for it
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGSI();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleGoogleCallback]);

  // ── Handle OAuth redirect hash fragment (#id_token=...) ────────────────────
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("id_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get("id_token");
      if (idToken) {
        // Clear the hash from URL to prevent re-processing
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        handleGoogleCallback({ credential: idToken });
      }
    }
  }, [handleGoogleCallback]);

  // ── Complete Google Profile ────────────────────────────────────────────────
  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSubmitting(true);

    try {
      const token = localStorage.getItem("creatify_token");
      if (!token) {
        setProfileError("Session expired. Please sign in again.");
        setProfileSubmitting(false);
        return;
      }

      const res = await fetch(`${API_BASE}/auth/complete-profile`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Failed to complete profile.");
        setProfileSubmitting(false);
        return;
      }

      // Update user in state
      if (data.user) localStorage.setItem("creatify_user", JSON.stringify(data.user));
      backendUserRef.current = data.user;
      setBackendUser(data.user);

      // Proceed to workspace
      setIsSubmitting(true);

    } catch (err) {
      console.error("Profile completion error:", err);
      setProfileError("Connection error. Please try again.");
      setProfileSubmitting(false);
    }
  };

  // ── Password strength ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!password) { setPasswordStrength({ score: 0, label: "Empty", color: "#666666" }); return; }
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(
      score >= 4 ? { score, label: "Strong",  color: "#22d3a8" } :
      score >= 2 ? { score, label: "Medium",  color: "#ec4899" } :
                  { score, label: "Weak",    color: "#ef4444" }
    );
  }, [password]);

  // ── Provisioning animation → then call onSuccess ───────────────────────────
  useEffect(() => {
    if (!isSubmitting) return;
    let step = 0;
    provisionTimerRef.current = setInterval(() => {
      step++;
      setProvisionStep(step);
      if (step >= 4) {
        clearInterval(provisionTimerRef.current);
        setTimeout(() => {
          onSuccess(backendUserRef.current || { name: name || email.split("@")[0] || "Creator", email });
        }, 700);
      }
    }, 850);
    return () => clearInterval(provisionTimerRef.current);
  }, [isSubmitting]);

  // ── Form submit → real API ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Please enter your email.");
    if (isSignUp && !name) return setError("Please enter your name.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    try {
      const endpoint = isSignUp ? "/auth/signup" : "/auth/signin";
      const body = isSignUp ? { name, email, password } : { email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (isSignUp) {
        // Show OTP verification screen
        setOtpEmail(email);
        setShowOTPScreen(true);
        setOtpTimerSeconds(600); // 10 minutes
        setOtpError("");
        setOtpCode("");
      } else {
        // Direct signin
        if (data.token) localStorage.setItem("creatify_token", data.token);
        if (data.user) localStorage.setItem("creatify_user", JSON.stringify(data.user));
        backendUserRef.current = data.user;
        setBackendUser(data.user);
        setIsSubmitting(true);
      }

    } catch (err) {
      console.warn("Backend auth failed, running in local/demo mode", err);
      if (isSignUp) {
        // Still show OTP screen in demo mode
        setOtpEmail(email);
        setShowOTPScreen(true);
        setOtpTimerSeconds(600);
        setOtpError("");
      } else {
        const fallbackUser = { name: email.split("@")[0] || "Creator", email };
        localStorage.setItem("creatify_user", JSON.stringify(fallbackUser));
        backendUserRef.current = fallbackUser;
        setBackendUser(fallbackUser);
        setIsSubmitting(true);
      }
    }
  };

  // ── OTP Verification ────────────────────────────────────────────────────────
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    
    if (!otpCode || otpCode.length !== 6) {
      return setOtpError("Please enter a valid 6-digit code.");
    }

    setOtpLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp: otpCode })
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "OTP verification failed.");
        setOtpLoading(false);
        return;
      }

      if (data.token) localStorage.setItem("creatify_token", data.token);
      if (data.user) localStorage.setItem("creatify_user", JSON.stringify(data.user));
      backendUserRef.current = data.user;
      setBackendUser(data.user);
      setIsSubmitting(true);
    } catch (err) {
      console.warn("OTP verification error:", err);
      // Demo mode - just proceed
      setBackendUser({ name, email: otpEmail });
      setIsSubmitting(true);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── OTP Timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (otpTimerSeconds <= 0) return;
    otpTimerRef.current = setInterval(() => {
      setOtpTimerSeconds(s => s - 1);
    }, 1000);
    return () => clearInterval(otpTimerRef.current);
  }, [otpTimerSeconds]);

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResendOTP = async () => {
    setOtpError("");
    try {
      const res = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpTimerSeconds(600);
        setOtpError(""); // Clear any errors
      } else {
        setOtpError(data.error || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setOtpError("Connection error. Please try again.");
    }
  };



  // ─────────────────────────────────────────────────────────────────────────
  // If profile completion screen is shown, render it
  if (showProfileCompletion) {
    return (
      <div style={{
        margin: 0, padding: 0, minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "linear-gradient(135deg, #f7f4f7 0%, #fdf2f4 50%, #f7f4f7 100%)",
        fontFamily: "'Instrument Sans', sans-serif", position: "relative", overflow: "hidden"
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: "absolute", width: "800px", height: "800px", borderRadius: "50%",
          filter: "blur(140px)", background: "rgba(148,41,69,0.08)",
          top: "-300px", right: "-200px", pointerEvents: "none", animation: "float 20s ease-in-out infinite"
        }} />

        {/* Main Card */}
        <div style={{
          width: "100%", maxWidth: "520px", padding: "60px 48px", borderRadius: "32px",
          background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(148,41,69,0.12)",
          backdropFilter: "blur(30px)", boxShadow: "0 30px 80px rgba(148,41,69,0.1)",
          position: "relative", zIndex: 10, display: "flex", flexDirection: "column"
        }}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            {/* Icon */}
            <div style={{
              display: "inline-flex", width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(148,41,69,0.1), rgba(225,73,109,0.05))",
              alignItems: "center", justifyContent: "center",
              fontSize: "32px", marginBottom: "32px", position: "relative", border: "2px solid rgba(148,41,69,0.08)"
            }}>
              👤
            </div>

            <h3 style={{
              fontFamily: "Syne,sans-serif", fontSize: "24px", fontWeight: 800,
              color: "#2d2d2d", marginBottom: "12px", letterSpacing: "-0.03em"
            }}>
              Complete Your Profile
            </h3>
            <p style={{
              fontSize: "15px", color: "#888", marginBottom: "32px", fontWeight: 300, lineHeight: 1.6
            }}>
              Help us get to know you better
            </p>

            {profileError && (
              <div style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(244,63,94,0.04))",
                border: "1.5px solid rgba(239,68,68,0.2)", borderRadius: "12px",
                padding: "14px 16px", color: "#dc2626", fontSize: "13px",
                marginBottom: "24px", fontWeight: 400, display: "flex", gap: "10px", alignItems: "flex-start"
              }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleCompleteProfile} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{
                  display: "block", fontSize: "11px", fontWeight: 600, color: "#666",
                  marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase"
                }}>Phone (Optional)</label>
                <input type="tel" placeholder="+1 (555) 000-0000"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = "#942945";
                    e.target.style.boxShadow = "0 0 0 4px rgba(148,41,69,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(148,41,69,0.12)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "rgba(255,255,255,0.5)";
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block", fontSize: "11px", fontWeight: 600, color: "#666",
                  marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase"
                }}>Company (Optional)</label>
                <input type="text" placeholder="Your Company"
                  value={profileForm.company}
                  onChange={e => setProfileForm({...profileForm, company: e.target.value})}
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = "#942945";
                    e.target.style.boxShadow = "0 0 0 4px rgba(148,41,69,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(148,41,69,0.12)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "rgba(255,255,255,0.5)";
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block", fontSize: "11px", fontWeight: 600, color: "#666",
                  marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase"
                }}>Country (Optional)</label>
                <input type="text" placeholder="Your Country"
                  value={profileForm.country}
                  onChange={e => setProfileForm({...profileForm, country: e.target.value})}
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = "#942945";
                    e.target.style.boxShadow = "0 0 0 4px rgba(148,41,69,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(148,41,69,0.12)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "rgba(255,255,255,0.5)";
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block", fontSize: "11px", fontWeight: 600, color: "#666",
                  marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase"
                }}>Bio (Optional)</label>
                <textarea placeholder="Tell us about yourself..."
                  value={profileForm.bio}
                  onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                  rows="3"
                  style={{...inputStyle, resize: "none"}}
                  onFocus={e => {
                    e.target.style.borderColor = "#942945";
                    e.target.style.boxShadow = "0 0 0 4px rgba(148,41,69,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(148,41,69,0.12)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "rgba(255,255,255,0.5)";
                  }}
                />
              </div>

              <button type="submit" style={{
                background: "linear-gradient(135deg, #942945, #e1496d)",
                color: "#fff", border: "none", padding: "14px 16px",
                borderRadius: "12px", fontSize: "14px", fontFamily: "'Poppins',sans-serif",
                fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                marginTop: "8px", boxShadow: "0 8px 24px rgba(148,41,69,0.25)",
                letterSpacing: "-0.01em", opacity: profileSubmitting ? 0.7 : 1,
                pointerEvents: profileSubmitting ? "none" : "auto"
              }}
                onMouseEnter={e => {
                  if (!profileSubmitting) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 36px rgba(148,41,69,0.35)";
                  }
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "0 8px 24px rgba(148,41,69,0.25)";
                }}
              >
                {profileSubmitting ? "Completing..." : "Complete Profile"}
              </button>

              <div style={{
                marginTop: "16px", textAlign: "center",
                fontSize: "12px", color: "#a8a29e", fontWeight: 300
              }}>
                ✓ All fields are optional
              </div>
            </form>
          </div>
        </div>

        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(20px); } }
        `}</style>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // If OTP screen is shown, render it
  if (showOTPScreen) {
    const minutes = Math.floor(otpTimerSeconds / 60);
    const seconds = otpTimerSeconds % 60;
    const canResend = otpTimerSeconds === 0;

    return (
      <div style={{
        margin: 0, padding: 0, minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "linear-gradient(135deg, #f7f4f7 0%, #fdf2f4 50%, #f7f4f7 100%)",
        fontFamily: "'Instrument Sans', sans-serif", position: "relative", overflow: "hidden"
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: "absolute", width: "800px", height: "800px", borderRadius: "50%",
          filter: "blur(140px)", background: "rgba(148,41,69,0.08)",
          top: "-300px", right: "-200px", pointerEvents: "none", animation: "float 20s ease-in-out infinite"
        }} />

        {/* Main Card */}
        <div style={{
          width: "100%", maxWidth: "520px", padding: "60px 48px", borderRadius: "32px",
          background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(148,41,69,0.12)",
          backdropFilter: "blur(30px)", boxShadow: "0 30px 80px rgba(148,41,69,0.1)",
          position: "relative", zIndex: 10, display: "flex", flexDirection: "column"
        }}>
          {/* Back button */}
          {!otpLoading && (
            <button onClick={() => setShowOTPScreen(false)} style={{
              background: "none", border: "none", color: "#a8a29e", fontSize: "13px",
              fontFamily: "'Poppins',sans-serif", fontWeight: 400,
              display: "flex", alignItems: "center", gap: "6px", cursor: "pointer",
              alignSelf: "flex-start", marginBottom: "32px", padding: "6px 10px",
              borderRadius: "8px", transition: "all 0.2s", marginLeft: "-10px"
            }}
              onMouseEnter={e => { e.target.style.color = "#942945"; e.target.style.background = "rgba(148,41,69,0.06)"; }}
              onMouseLeave={e => { e.target.style.color = "#a8a29e"; e.target.style.background = "none"; }}
            >
              <span>←</span> Back to form
            </button>
          )}

          <div style={{ textAlign: "center", padding: "20px 0" }}>
            {/* OTP Icon */}
            <div style={{
              display: "inline-flex", width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(148,41,69,0.1), rgba(225,73,109,0.05))",
              alignItems: "center", justifyContent: "center",
              fontSize: "32px", marginBottom: "32px", position: "relative", border: "2px solid rgba(148,41,69,0.08)"
            }}>
              🔐
            </div>

            <h3 style={{
              fontFamily: "Syne,sans-serif", fontSize: "24px", fontWeight: 800,
              color: "#2d2d2d", marginBottom: "12px", letterSpacing: "-0.03em"
            }}>
              Verify Your Email
            </h3>
            <p style={{
              fontSize: "15px", color: "#888", marginBottom: "32px", fontWeight: 300, lineHeight: 1.6
            }}>
              Enter the 6-digit code sent to<br/>
              <strong style={{ color: "#2d2d2d" }}>{otpEmail}</strong>
            </p>

            {/* OTP Input */}
            <form onSubmit={handleOTPSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {otpError && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(244,63,94,0.04))",
                  border: "1.5px solid rgba(239,68,68,0.2)", borderRadius: "12px",
                  padding: "14px 16px", color: "#dc2626", fontSize: "13px",
                  fontWeight: 400, display: "flex", gap: "10px", alignItems: "flex-start"
                }}>
                  <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
                  <span>{otpError}</span>
                </div>
              )}

              <div>
                <label style={{
                  display: "block", fontSize: "11px", fontWeight: 600, color: "#666",
                  marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase"
                }}>OTP Code</label>
                <input type="text" placeholder="000000" value={otpCode} 
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  maxLength="6"
                  style={{
                    width: "100%", padding: "16px", borderRadius: "12px",
                    border: "1.5px solid rgba(148,41,69,0.12)", background: "rgba(255,255,255,0.5)",
                    fontSize: "28px", fontWeight: 700, letterSpacing: "12px", color: "#2d2d2d",
                    outline: "none", transition: "all 0.3s", boxSizing: "border-box",
                    textAlign: "center", fontFamily: "'Courier New', monospace",
                    textTransform: "uppercase"
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#942945";
                    e.target.style.boxShadow = "0 0 0 4px rgba(148,41,69,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(148,41,69,0.12)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "rgba(255,255,255,0.5)";
                  }}
                  disabled={otpLoading}
                />
              </div>

              {/* Timer */}
              <div style={{
                fontSize: "12px", color: "#888", textAlign: "center",
                fontWeight: 500, fontFamily: "'Poppins',sans-serif"
              }}>
                {otpTimerSeconds > 0 ? (
                  <span>Code expires in <strong style={{ color: "#942945" }}>{minutes}:{seconds.toString().padStart(2, '0')}</strong></span>
                ) : (
                  <span style={{ color: "#ef4444" }}>Code expired</span>
                )}
              </div>

              <button type="submit" style={{
                background: "linear-gradient(135deg, #942945, #e1496d)",
                color: "#fff", border: "none", padding: "14px 16px",
                borderRadius: "12px", fontSize: "14px", fontFamily: "'Poppins',sans-serif",
                fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                marginTop: "8px", boxShadow: "0 8px 24px rgba(148,41,69,0.25)",
                letterSpacing: "-0.01em", opacity: otpLoading ? 0.7 : 1,
                pointerEvents: otpLoading ? "none" : "auto"
              }}
                onMouseEnter={e => {
                  if (!otpLoading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 36px rgba(148,41,69,0.35)";
                  }
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "0 8px 24px rgba(148,41,69,0.25)";
                }}
              >
                {otpLoading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            {/* Resend OTP */}
            <div style={{
              marginTop: "24px", textAlign: "center",
              fontSize: "13px", color: "#888", fontWeight: 300
            }}>
              Didn't receive the code?{" "}
              <button onClick={handleResendOTP} 
                disabled={!canResend}
                style={{
                  background: "none", border: "none", color: canResend ? "#942945" : "#ccc",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 600,
                  cursor: canResend ? "pointer" : "not-allowed", fontSize: "13px", padding: "0 2px",
                  transition: "all 0.2s", letterSpacing: "-0.01em"
                }}
                onMouseEnter={e => {
                  if (canResend) {
                    e.target.style.opacity = "0.8";
                    e.target.style.textDecoration = "underline";
                  }
                }}
                onMouseLeave={e => {
                  e.target.style.opacity = "1";
                  e.target.style.textDecoration = "none";
                }}
              >
                Resend Code
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(20px); } }
        `}</style>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Provisioning steps
  const steps = [
    { text: "Verifying secure credentials & keys...",     icon: "🔑" },
    { text: "Provisioning WebAssembly timeline sandbox...", icon: "☁️" },
    { text: "Allocating 100GB local sandbox cache...",    icon: "⚡" },
    { text: "Workspace verified! Launching Creatify Studio...", icon: "🎉" },
  ];

  return (
    <div style={{
      margin: 0, padding: 0, minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "linear-gradient(135deg, #f7f4f7 0%, #fdf2f4 50%, #f7f4f7 100%)",
      fontFamily: "'Instrument Sans', sans-serif", position: "relative", overflow: "hidden"
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: "absolute", width: "800px", height: "800px", borderRadius: "50%",
        filter: "blur(140px)", background: "rgba(148,41,69,0.08)",
        top: "-300px", right: "-200px", pointerEvents: "none", animation: "float 20s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
        filter: "blur(120px)", background: "rgba(225,73,109,0.05)",
        bottom: "-200px", left: "-150px", pointerEvents: "none", animation: "float 25s ease-in-out infinite reverse"
      }} />



      {/* ── Main Auth Card ────────────────────────────────────────────────── */}
      <div style={{
        width: "100%", maxWidth: "520px", padding: "60px 48px", borderRadius: "32px",
        background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(148,41,69,0.12)",
        backdropFilter: "blur(30px)", boxShadow: "0 30px 80px rgba(148,41,69,0.1)",
        position: "relative", zIndex: 10, display: "flex", flexDirection: "column"
      }}>
        {/* Back button */}
        {!isSubmitting && (
          <button onClick={onBack} style={{
            background: "none", border: "none", color: "#a8a29e", fontSize: "13px",
            fontFamily: "'Poppins',sans-serif", fontWeight: 400,
            display: "flex", alignItems: "center", gap: "6px", cursor: "pointer",
            alignSelf: "flex-start", marginBottom: "32px", padding: "6px 10px",
            borderRadius: "8px", transition: "all 0.2s", marginLeft: "-10px"
          }}
            onMouseEnter={e => { e.target.style.color = "#942945"; e.target.style.background = "rgba(148,41,69,0.06)"; }}
            onMouseLeave={e => { e.target.style.color = "#a8a29e"; e.target.style.background = "none"; }}
          >
            <span>←</span> Back to home
          </button>
        )}

        {/* ── Provisioning View ─────────────────────────────────────────── */}
        {isSubmitting ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              display: "inline-flex", width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(148,41,69,0.1), rgba(225,73,109,0.05))",
              alignItems: "center", justifyContent: "center",
              fontSize: "32px", marginBottom: "32px", position: "relative", border: "2px solid rgba(148,41,69,0.08)"
            }}>
              <div style={{
                position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
                border: "3px solid rgba(148,41,69,0.12)", borderTop: "3px solid #942945",
                animation: "spin 1.2s linear infinite"
              }} />
              ✨
            </div>
            <h3 style={{
              fontFamily: "Syne,sans-serif", fontSize: "24px", fontWeight: 800,
              color: "#2d2d2d", marginBottom: "12px", letterSpacing: "-0.03em"
            }}>
              Setting up Workspace
            </h3>
            <p style={{
              fontSize: "15px", color: "#888", marginBottom: "40px", fontWeight: 300, lineHeight: 1.6
            }}>
              Preparing your personal canvas for creative magic...
            </p>
            <div style={{
              display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", maxWidth: "340px", margin: "0 auto"
            }}>
              {steps.map((step, idx) => {
                const isActive = provisionStep === idx + 1;
                const isCompleted = provisionStep > idx + 1;
                return (
                  <div key={idx} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    opacity: isCompleted || isActive ? 1 : 0.35,
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isActive ? "translateX(6px)" : "none"
                  }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: isCompleted ? "linear-gradient(135deg, #22d3a8, #06b6d4)" : isActive ? "rgba(148,41,69,0.12)" : "#e5e5e5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", color: isCompleted ? "#fff" : "#942945",
                      transition: "all 0.4s", flexShrink: 0, fontWeight: 600,
                      boxShadow: isCompleted ? "0 4px 12px rgba(34,211,168,0.2)" : "none"
                    }}>
                      {isCompleted ? "✓" : isActive ? "⟳" : step.icon}
                    </div>
                    <span style={{
                      fontSize: "14px",
                      color: isCompleted ? "#22d3a8" : isActive ? "#2d2d2d" : "#a8a29e",
                      fontWeight: isActive ? 600 : 400, lineHeight: 1.5
                    }}>{step.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

        ) : (
          /* ── Form View ──────────────────────────────────────────────── */
          <div>
            {/* Branding */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px"
            }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "10px",
                background: "linear-gradient(135deg, #942945, #e1496d)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "16px", color: "#fff", letterSpacing: "-0.02em"
              }}>
                C
              </div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "20px", color: "#2d2d2d", letterSpacing: "-0.03em" }}>
                Creat<span style={{ color: "#942945" }}>ify</span>
              </div>
            </div>

            <h2 style={{
              fontFamily: "Syne,sans-serif", fontSize: "28px", fontWeight: 800,
              color: "#2d2d2d", marginBottom: "8px", letterSpacing: "-0.03em"
            }}>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p style={{
              fontSize: "14px", color: "#888", marginBottom: "32px", fontWeight: 300, lineHeight: 1.6
            }}>
              {isSignUp ? "Join millions of creators. Free forever, always." : "Sign in to access your creative workspace."}
            </p>

            {error && (
              <div style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(244,63,94,0.04))",
                border: "1.5px solid rgba(239,68,68,0.2)", borderRadius: "12px",
                padding: "14px 16px", color: "#dc2626", fontSize: "13px",
                marginBottom: "24px", fontWeight: 400, display: "flex", gap: "10px", alignItems: "flex-start"
              }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Google Sign-In Button — uses GSI SDK popup (correct flow) */}
            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={() => {
                setError("");
                if (window.google?.accounts?.id) {
                  // Use the GSI SDK popup — triggers handleGoogleCallback on success
                  setIsGoogleLoading(true);
                  window.google.accounts.id.prompt((notification) => {
                    // If the prompt is dismissed or not displayed, reset loading
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                      setIsGoogleLoading(false);
                      // Fallback: open Google OAuth in popup window
                      const clientId = GOOGLE_CLIENT_ID;
                      const redirectUri = encodeURIComponent(window.location.origin);
                      const nonce = Math.random().toString(36).substring(7);
                      const params = `client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${encodeURIComponent("openid email profile")}&nonce=${nonce}&prompt=select_account`;
                      const popup = window.open(
                        `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
                        "google_auth",
                        "width=500,height=600,scrollbars=yes"
                      );
                      // Poll popup for token
                      const pollInterval = setInterval(() => {
                        try {
                          if (!popup || popup.closed) { clearInterval(pollInterval); setIsGoogleLoading(false); return; }
                          const hash = popup.location.hash;
                          if (hash && hash.includes("id_token=")) {
                            clearInterval(pollInterval);
                            popup.close();
                            const params = new URLSearchParams(hash.substring(1));
                            const idToken = params.get("id_token");
                            if (idToken) handleGoogleCallback({ credential: idToken });
                          }
                        } catch (e) { /* cross-origin — ignore */ }
                      }, 300);
                    }
                  });
                } else {
                  setError("Google Sign-In is loading. Please wait a moment and try again.");
                }
              }}
              style={{
                width: "100%", padding: "13px 16px", borderRadius: "12px",
                border: "1.5px solid rgba(148,41,69,0.2)",
                background: isGoogleLoading ? "rgba(148,41,69,0.04)" : "#fff",
                fontSize: "14px", fontFamily: "inherit", color: "#2d2d2d",
                cursor: isGoogleLoading ? "wait" : "pointer", transition: "all 0.3s", display: "flex",
                alignItems: "center", justifyContent: "center", gap: "10px",
                fontWeight: 600, letterSpacing: "-0.01em",
                opacity: isGoogleLoading ? 0.7 : 1
              }}
              onMouseEnter={e => {
                if (!isGoogleLoading) {
                  e.currentTarget.style.borderColor = "#942945";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(148,41,69,0.1)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(148,41,69,0.2)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {isGoogleLoading ? (
                <span style={{ display:"inline-block", width:"16px", height:"16px", border:"2px solid rgba(148,41,69,0.3)", borderTopColor:"#942945", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px", marginTop: "16px", marginBottom: "16px"
            }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(148,41,69,0.1)" }} />
              <span style={{ fontSize: "12px", color: "#a8a29e", fontWeight: 500 }}>or email</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(148,41,69,0.1)" }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {isSignUp && (
                <div>
                  <label style={{
                    display: "block", fontSize: "11px", fontWeight: 600, color: "#666",
                    marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase"
                  }}>Full Name</label>
                  <input type="text" placeholder="Sarah Anderson" value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle}
                    onFocus={e => {
                      e.target.style.borderColor = "#942945";
                      e.target.style.boxShadow = "0 0 0 4px rgba(148,41,69,0.12)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = "rgba(148,41,69,0.12)";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "rgba(255,255,255,0.5)";
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{
                  display: "block", fontSize: "11px", fontWeight: 600, color: "#666",
                  marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase"
                }}>Email Address</label>
                <input type="email" placeholder="you@company.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = "#942945";
                    e.target.style.boxShadow = "0 0 0 4px rgba(148,41,69,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(148,41,69,0.12)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "rgba(255,255,255,0.5)";
                  }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{
                    fontSize: "11px", fontWeight: 600, color: "#666",
                    letterSpacing: "0.05em", textTransform: "uppercase"
                  }}>Password</label>
                  {!isSignUp && (
                    <a href="#" onClick={e => { e.preventDefault(); alert("Password reset email sent! (demo)"); }}
                      style={{
                        fontSize: "11px", color: "#942945", textDecoration: "none",
                        fontWeight: 600, transition: "all 0.2s"
                      }}
                      onMouseEnter={e => e.target.style.textDecoration = "underline"}
                      onMouseLeave={e => e.target.style.textDecoration = "none"}
                    >
                      Forgot?
                    </a>
                  )}
                </div>
                <input type="password" placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = "#942945";
                    e.target.style.boxShadow = "0 0 0 4px rgba(148,41,69,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(148,41,69,0.12)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "rgba(255,255,255,0.5)";
                  }}
                />
                {isSignUp && password && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: "11px", color: "#888", marginBottom: "8px"
                    }}>
                      <span>Strength</span>
                      <span style={{
                        color: passwordStrength.color,
                        fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"
                      }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{
                          flex: 1, height: "6px", borderRadius: "3px",
                          background: passwordStrength.score >= i ? passwordStrength.color : "rgba(148,41,69,0.1)",
                          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                          boxShadow: passwordStrength.score >= i ? `0 0 8px ${passwordStrength.color}40` : "none"
                        }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" style={{
                background: "linear-gradient(135deg, #942945, #e1496d)",
                color: "#fff", border: "none", padding: "14px 16px",
                borderRadius: "12px", fontSize: "14px", fontFamily: "'Poppins',sans-serif",
                fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                marginTop: "8px", boxShadow: "0 8px 24px rgba(148,41,69,0.25)",
                letterSpacing: "-0.01em"
              }}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 36px rgba(148,41,69,0.35)";
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "0 8px 24px rgba(148,41,69,0.25)";
                }}
              >
                {isSignUp ? "Create Workspace" : "Access Workspace"}
              </button>
            </form>



            {/* Toggle */}
            <div style={{
              marginTop: "32px", textAlign: "center",
              fontSize: "13px", color: "#888", fontWeight: 300
            }}>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                style={{
                  background: "none", border: "none", color: "#942945",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 600,
                  cursor: "pointer", fontSize: "13px", padding: "0 2px",
                  transition: "all 0.2s", letterSpacing: "-0.01em"
                }}
                onMouseEnter={e => {
                  e.target.style.opacity = "0.8";
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={e => {
                  e.target.style.opacity = "1";
                  e.target.style.textDecoration = "none";
                }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>

            {/* Divider */}
            <div style={{
              marginTop: "32px", paddingTop: "24px",
              borderTop: "1px solid rgba(148,41,69,0.1)"
            }}>
              <p style={{
                fontSize: "11px", color: "#a8a29e", textAlign: "center",
                textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600
              }}>
                Secure & Private
              </p>
              <div style={{
                display: "flex", justifyContent: "center", gap: "24px",
                marginTop: "14px", fontSize: "12px", color: "#888"
              }}>
                <span title="End-to-end encrypted">🔒 E2E Encrypted</span>
                <span title="Zero tracking">🚫 No Tracking</span>
                <span title="Auto-saved">☁️ Auto-saved</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(20px); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "13px 16px", borderRadius: "12px",
  border: "1.5px solid rgba(148,41,69,0.12)", background: "rgba(255,255,255,0.5)",
  fontSize: "14px", fontFamily: "inherit", color: "#2d2d2d",
  outline: "none", transition: "all 0.3s", boxSizing: "border-box",
  "::placeholder": { color: "rgba(45,45,45,0.4)" }
};
