import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg: "#030303",
  accent: "#38BDF8",
  java: "#F89820",
  success: "#4ade80",
  warn: "#facc15",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --accent: #38BDF8;
    --java: #F89820;
    --bg: #030303;
    --success: #4ade80;
    --card-bg: rgba(255,255,255,0.02);
    --border: rgba(255,255,255,0.08);
  }

  html { scroll-behavior: smooth; }

  body {
    background: #030303;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    line-height: 1.625;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #030303; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }

  @property --grad-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes spin-border { to { --grad-angle: 360deg; } }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-18px); }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes grad-shift {
    0%,100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes beam {
    0% { stroke-dashoffset: 1000; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:.4; transform:scale(.85); }
  }
  @keyframes blink { 50% { opacity:0; } }
  @keyframes sonar {
    0% { r:8; opacity:.8; }
    100% { r:72; opacity:0; }
  }
  @keyframes slideUp {
    from { transform:translateY(24px); opacity:0; }
    to   { transform:translateY(0);    opacity:1; }
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  @keyframes spin-rev  { to { transform: rotate(-360deg); } }

  .reveal {
    opacity:0;
    transform:translateY(38px);
    transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
  }
  .reveal.visible { opacity:1; transform:translateY(0); }

  .card-spotlight {
    position:relative;
    overflow:hidden;
  }
  .card-spotlight::before {
    content:'';
    position:absolute;
    inset:0;
    background:radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.055), transparent 40%);
    pointer-events:none;
    opacity:0;
    transition:opacity .5s;
    z-index:1;
  }
  .card-spotlight:hover::before { opacity:1; }

  .btn-primary {
    position:relative;
    background:#000;
    border:none;
    border-radius:999px;
    cursor:pointer;
    padding:2px;
    z-index:0;
  }
  .btn-primary::before {
    content:'';
    position:absolute;
    inset:-1px;
    border-radius:999px;
    background: conic-gradient(from var(--grad-angle), transparent 0%, #0ea5e9 8%, #38BDF8 18%, #F89820 35%, #0ea5e9 50%, transparent 60%);
    animation: spin-border 2.4s linear infinite;
    z-index:-1;
  }
  .btn-primary-inner {
    background:#030303;
    border-radius:999px;
    padding:12px 28px;
    display:flex;
    align-items:center;
    gap:8px;
    font-family:'DM Sans',sans-serif;
    font-weight:500;
    font-size:.9rem;
    color:#fff;
    transition: background .3s;
    white-space:nowrap;
  }
  .btn-primary:hover .btn-primary-inner { background:rgba(56,189,248,0.15); }

  .btn-secondary {
    background:rgba(255,255,255,0.05);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(255,255,255,0.15);
    border-radius:999px;
    padding:13px 28px;
    display:flex;
    align-items:center;
    gap:8px;
    font-family:'DM Sans',sans-serif;
    font-weight:500;
    font-size:.9rem;
    color:rgba(255,255,255,.7);
    cursor:pointer;
    transition: border-color .3s, color .3s, box-shadow .3s;
    white-space:nowrap;
  }
  .btn-secondary:hover {
    border-color:rgba(56,189,248,.5);
    color:#fff;
    box-shadow:0 0 20px rgba(56,189,248,.12);
  }

  .skill-tag {
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:999px;
    padding:5px 13px;
    font-family:'JetBrains Mono',monospace;
    font-size:.72rem;
    color:rgba(255,255,255,.55);
    transition: all .25s;
    cursor:default;
  }
  .skill-tag:hover {
    border-color:rgba(56,189,248,.5);
    background:rgba(56,189,248,.08);
    color:rgba(56,189,248,.9);
    transform:translateY(-2px);
    box-shadow:0 4px 16px rgba(56,189,248,.12);
  }

  .nav-link {
    position:relative;
    font-family:'DM Sans',sans-serif;
    font-size:.78rem;
    font-weight:500;
    letter-spacing:.06em;
    color:rgba(255,255,255,.45);
    text-decoration:none;
    cursor:pointer;
    padding:4px 0;
    transition:color .25s;
    background:none;
    border:none;
  }
  .nav-link::after {
    content:'';
    position:absolute;
    bottom:-2px; left:0;
    width:0; height:1px;
    background:var(--accent);
    transition:width .3s;
  }
  .nav-link:hover, .nav-link.active { color:#fff; }
  .nav-link:hover::after, .nav-link.active::after { width:100%; }

  .gradient-text {
    background:linear-gradient(90deg, #38BDF8, #F89820, #38BDF8);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:grad-shift 4s ease infinite;
  }

  .section-label {
    font-family:'JetBrains Mono',monospace;
    font-size:.65rem;
    font-weight:500;
    letter-spacing:.22em;
    text-transform:uppercase;
    color:rgba(56,189,248,.65);
    margin-bottom:1.2rem;
  }

  .h1 {
    font-family:'Syne',sans-serif;
    font-size:clamp(2.6rem,6.5vw,4.8rem);
    font-weight:800;
    line-height:1.05;
    letter-spacing:-.025em;
  }
  .h2 {
    font-family:'Syne',sans-serif;
    font-size:clamp(2rem,4.5vw,3.6rem);
    font-weight:700;
    line-height:1.08;
    letter-spacing:-.02em;
  }

  .glass-card {
    background:rgba(255,255,255,0.025);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:24px;
    transition: border-color .3s, background .3s, transform .3s, box-shadow .3s;
  }
  .glass-card:hover {
    border-color:rgba(56,189,248,.22);
    background:rgba(255,255,255,0.04);
    box-shadow:0 0 40px rgba(56,189,248,.07);
  }

  /* Mobile menu */
  .mobile-menu {
    position:fixed;
    inset:0;
    z-index:60;
    background:rgba(3,3,3,.97);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:2rem;
    transform:translateX(100%);
    transition:transform .4s cubic-bezier(.16,1,.3,1);
  }
  .mobile-menu.open { transform:translateX(0); }

  /* Marquee */
  .marquee-track {
    display:flex;
    width:max-content;
    animation:marquee 40s linear infinite;
  }
  .marquee-wrap {
    overflow:hidden;
    mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }

  /* Code block */
  .code-win {
    background:rgba(10,10,14,0.95);
    border:1px solid rgba(255,255,255,0.09);
    border-radius:16px;
    overflow:hidden;
    transition:border-color .3s;
  }
  .code-win:hover { border-color:rgba(56,189,248,.2); }
  .code-bar {
    display:flex;
    align-items:center;
    gap:8px;
    padding:10px 14px;
    background:rgba(255,255,255,0.03);
    border-bottom:1px solid rgba(255,255,255,0.07);
  }
  .dot-r { width:11px;height:11px;border-radius:50%;background:#ff5f56; }
  .dot-y { width:11px;height:11px;border-radius:50%;background:#ffbd2e; }
  .dot-g { width:11px;height:11px;border-radius:50%;background:#27c93f; }
  .code-body {
    padding:16px;
    font-family:'JetBrains Mono',monospace;
    font-size:.7rem;
    line-height:1.8;
    color:rgba(255,255,255,.5);
    overflow-x:auto;
  }
  .kw { color:#79a8d4; }
  .cn { color:#f0c674; }
  .an { color:#b58900; }
  .st { color:#98be65; }
  .cm { color:rgba(255,255,255,.3); font-style:italic; }
  .ac { color:#38BDF8; }
  .jv { color:#F89820; }

  /* Toast */
  .toast {
    position:fixed;
    bottom:28px; right:28px;
    background:rgba(10,20,10,.95);
    border:1px solid rgba(74,222,128,.3);
    border-radius:14px;
    padding:14px 20px;
    display:flex;
    align-items:center;
    gap:10px;
    font-size:.85rem;
    z-index:999;
    animation:slideUp .4s cubic-bezier(.16,1,.3,1) forwards;
    box-shadow:0 8px 32px rgba(0,0,0,.4);
  }

  /* Contact input */
  .c-input {
    width:100%;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09);
    border-radius:12px;
    padding:13px 16px;
    color:#fff;
    font-family:'DM Sans',sans-serif;
    font-size:.9rem;
    outline:none;
    transition:border-color .25s, box-shadow .25s;
  }
  .c-input::placeholder { color:rgba(255,255,255,.25); }
  .c-input:focus {
    border-color:rgba(56,189,248,.45);
    box-shadow:0 0 0 3px rgba(56,189,248,.06);
  }
  .c-input.error { border-color:rgba(239,68,68,.5); }
  .c-label {
    font-family:'JetBrains Mono',monospace;
    font-size:.62rem;
    font-weight:500;
    letter-spacing:.16em;
    text-transform:uppercase;
    color:rgba(255,255,255,.38);
    display:block;
    margin-bottom:6px;
  }

  @media(max-width:768px) {
    .hide-mobile { display:none !important; }
    .show-mobile { display:flex !important; }
    .hero-grid { flex-direction:column !important; }
    .projects-grid { grid-template-columns:1fr !important; }
    .skills-grid { grid-template-columns:1fr !important; }
    .cert-grid { grid-template-columns:1fr !important; }
    .about-grid { flex-direction:column !important; }
    .stats-row { flex-direction:column !important; gap:12px !important; }
    .contact-links { flex-wrap:wrap !important; }
  }
`;

// ─── SPOTLIGHT HOOK ───────────────────────────────────────────────────────────
function useSpotlight(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, []);
}

// ─── REVEAL HOOK ─────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08, rootMargin: "-40px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── COUNTER HOOK ─────────────────────────────────────────────────────────────
function useCounter(target, suffix = "") {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const dur = 1800;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return [ref, val];
}

// ─── SPOTLIGHT CARD ───────────────────────────────────────────────────────────
function SpotCard({ children, style, className = "" }) {
  const ref = useRef(null);
  useSpotlight(ref);
  return (
    <div ref={ref} className={`card-spotlight glass-card ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ target, suffix, label, icon }) {
  const [ref, val] = useCounter(target);
  return (
    <SpotCard
      ref={ref}
      style={{ padding: "24px 28px", textAlign: "center", flex: 1 }}
      className="reveal"
    >
      <div ref={ref} style={{ fontSize: "2rem", marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, color: "#38BDF8" }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.4)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".12em", textTransform: "uppercase", marginTop: 4 }}>
        {label}
      </div>
    </SpotCard>
  );
}

// ─── HERO SVG DECORATION ─────────────────────────────────────────────────────
function HeroDecor() {
  return (
    <div style={{ position: "relative", width: 380, height: 380, flexShrink: 0 }}>
      {/* Spinning rings */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "spin-slow 12s linear infinite" }} viewBox="0 0 380 380">
        <circle cx="190" cy="190" r="170" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="1" strokeDasharray="8 16" />
        <path d="M 190 20 A 170 170 0 1 1 189 20" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" strokeDasharray="80 1000" style={{ animation: "beam 3s linear infinite" }} />
      </svg>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "spin-rev 15s linear infinite" }} viewBox="0 0 380 380">
        <circle cx="190" cy="190" r="140" fill="none" stroke="rgba(248,152,32,0.07)" strokeWidth="1" strokeDasharray="4 20" />
        <path d="M 190 50 A 140 140 0 1 1 189 50" fill="none" stroke="rgba(248,152,32,0.25)" strokeWidth="1" strokeDasharray="60 1000" style={{ animation: "beam 4s linear infinite" }} />
      </svg>

      {/* Sonar ping */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 380 380">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="190" cy="190" fill="none" stroke="rgba(56,189,248,0.4)" style={{ animation: `sonar 3s cubic-bezier(0,0,.2,1) ${i}s infinite` }} />
        ))}
      </svg>

      {/* Center code block */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 200, borderRadius: 14, overflow: "hidden", background: "rgba(8,10,14,0.95)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 60px rgba(56,189,248,0.15)" }}>
        <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 6, alignItems: "center" }}>
          <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", color: "rgba(255,255,255,.3)", marginLeft: 6 }}>App.java</span>
        </div>
        <div style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", lineHeight: 1.9, color: "rgba(255,255,255,.45)" }}>
          <span className="an">@RestController</span><br />
          <span className="kw">public class </span><span className="cn">UserApi </span>{"{"}<br />
          {"  "}<span className="an">@GetMapping</span><br />
          {"  "}<span className="kw">public </span><span className="cn">List</span>{"<"}<span className="jv">User</span>{">"}<br />
          {"  getUsers() {"}<br />
          {"    "}<span className="kw">return </span><span className="ac">service</span><br />
          {"      .findAll();"}<br />
          {"  }}"}<span style={{ animation: "blink 1s step-end infinite" }}>▌</span>
        </div>
      </div>

      {/* Floating badges */}
      {[
        { label: "☕ Java", top: "6%", left: "62%", delay: "0s" },
        { label: "🌿 Spring", top: "18%", left: "2%", delay: "-1.5s" },
        { label: "🗄️ MySQL", top: "75%", left: "68%", delay: "-2.8s" },
        { label: "⚛️ React", top: "72%", left: "0%", delay: "-1s" },
      ].map(({ label, top, left, delay }) => (
        <div key={label} style={{
          position: "absolute", top, left,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 999, padding: "5px 12px",
          fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem",
          color: "rgba(255,255,255,.7)",
          animation: `float 6s ease-in-out ${delay} infinite`,
          backdropFilter: "blur(12px)",
          whiteSpace: "nowrap",
        }}>{label}</div>
      ))}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["About", "Experience", "Projects", "Skills", "Certifications", "Contact"];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
      const sections = NAV_LINKS.map((l) => document.getElementById(l.toLowerCase()));
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && window.scrollY >= sections[i].offsetTop - 160) {
          setActive(NAV_LINKS[i]); break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const navGlass = {
    background: scrolled ? "rgba(3,3,3,0.9)" : "linear-gradient(to bottom right,rgba(255,255,255,0.08),rgba(255,255,255,0))",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 2.8px 2.2px rgba(0,0,0,.034),0 6.7px 5.3px rgba(0,0,0,.048),0 12.5px 10px rgba(0,0,0,.06),0 22.3px 17.9px rgba(0,0,0,.072),0 41.8px 33.4px rgba(0,0,0,.086)",
    transition: "background .4s",
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 50, borderRadius: 999,
        display: "flex", alignItems: "center", gap: 28,
        padding: "10px 20px", ...navGlass,
        maxWidth: "calc(100vw - 32px)",
      }}>
        <button onClick={() => scrollTo("hero")} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: ".9rem", color: "#fff", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
          <span style={{ color: "#38BDF8" }}>R</span>anjeet
        </button>

        <div className="hide-mobile" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {NAV_LINKS.map((l) => (
            <button key={l} className={`nav-link ${active === l ? "active" : ""}`} onClick={() => scrollTo(l)}>{l}</button>
          ))}
        </div>

        <div className="hide-mobile">
          <button className="btn-primary" onClick={() => scrollTo("contact")}>
            <span className="btn-primary-inner" style={{ padding: "9px 20px", fontSize: ".78rem" }}>Hire Me ↗</span>
          </button>
        </div>

        <button className="show-mobile" style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "1.3rem" }} onClick={() => setMobileOpen(true)}>☰</button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", color: "#fff", fontSize: "1.6rem", cursor: "pointer" }} onClick={() => setMobileOpen(false)}>✕</button>
        {NAV_LINKS.map((l) => (
          <button key={l} onClick={() => scrollTo(l)} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "rgba(255,255,255,.7)", background: "none", border: "none", cursor: "pointer", transition: "color .2s" }}
            onMouseEnter={e => e.target.style.color = "#38BDF8"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.7)"}
          >{l}</button>
        ))}
        <button className="btn-primary" onClick={() => scrollTo("contact")}>
          <span className="btn-primary-inner">Hire Me ↗</span>
        </button>
      </div>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 100, paddingBottom: 80, padding: "100px 24px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div className="hero-grid" style={{ display: "flex", gap: 48, alignItems: "center", justifyContent: "space-between" }}>

          {/* Left */}
          <div style={{ flex: 1, maxWidth: 600 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 999, padding: "6px 14px", marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, background: "#4ade80", borderRadius: "50%", display: "inline-block", animation: "pulse-dot 1.5s cubic-bezier(.4,0,.6,1) infinite" }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "#4ade80", letterSpacing: ".16em", textTransform: "uppercase" }}>Open to Opportunities</span>
            </div>

            <h1 className="h1" style={{ marginBottom: 16 }}>
              <span style={{ display: "block", color: "#fff" }}>Ranjeet</span>
              <span className="gradient-text" style={{ display: "block" }}>Prajapati</span>
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ width: 32, height: 1, background: "rgba(56,189,248,.5)" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", color: "rgba(255,255,255,.5)" }}>
                Java <span style={{ color: "#38BDF8", fontWeight: 600, textShadow: "0 0 20px rgba(56,189,248,.45)" }}>Software Engineer</span> & Backend Developer
              </span>
            </div>

            <p style={{ fontSize: ".95rem", color: "rgba(255,255,255,.5)", lineHeight: 1.75, maxWidth: 520, marginBottom: 36 }}>
              Building <strong style={{ color: "rgba(255,255,255,.85)" }}>production-grade Java backends</strong> with Spring Boot, Spring Security & RESTful APIs.
              Passionate about <strong style={{ color: "rgba(255,255,255,.85)" }}>scalable software architecture</strong> and eliminating manual overhead through smart automation.
              Currently @ <strong style={{ color: "#38BDF8" }}>NIU</strong> · CGPA <strong style={{ color: "#F89820" }}>8.79/10</strong>.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <button className="btn-primary" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                <span className="btn-primary-inner">Let's Talk ↗</span>
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                📁 View Projects
              </button>
            </div>

            {/* Stats */}
            <div className="stats-row" style={{ display: "flex", gap: 16 }}>
              <StatCard target={1} suffix="+" label="Years Building" icon="⚡" />
              <StatCard target={2} suffix="" label="Projects Shipped" icon="🚀" />
              <StatCard target={15} suffix="+" label="Bugs Crushed" icon="🐛" />
            </div>
          </div>

          {/* Right */}
          <div className="hide-mobile" style={{ display: "flex" }}>
            <HeroDecor />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ textAlign: "center", marginTop: 64, animation: "pulse-dot 2s ease-in-out infinite" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".58rem", color: "rgba(255,255,255,.3)", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 6 }}>scroll</div>
          <div style={{ color: "rgba(255,255,255,.25)", fontSize: "1.2rem" }}>⌄</div>
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
const TECHS = ["Java", "Spring Boot", "Spring Security", "MySQL", "Hibernate", "REST API", "React", "JavaScript", "HTML", "CSS", "Thymeleaf", "Maven", "Git", "GitHub", "Postman", "IntelliJ IDEA", "Spring Data JPA", "JWT", "RBAC", "MVC Architecture", "DSA", "OOP Design Patterns"];

function Marquee() {
  const items = [...TECHS, ...TECHS];
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "16px 0", overflow: "hidden" }}>
      <div className="marquee-wrap">
        <div className="marquee-track">
          {items.map((t, i) => (
            <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".72rem", color: "rgba(255,255,255,.2)", whiteSpace: "nowrap", padding: "0 28px" }}>
              {t} <span style={{ color: "rgba(56,189,248,.3)" }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="section-label reveal">01 — About Me</div>
        <div className="about-grid reveal" style={{ display: "flex", gap: 64 }}>
          <div style={{ flex: 1, maxWidth: 580 }}>
            <h2 className="h2" style={{ marginBottom: 32, color: "#fff" }}>
              Engineering reliable<br /><span style={{ color: "rgba(255,255,255,.3)" }}>backend systems.</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,.5)", lineHeight: 1.8, marginBottom: 20 }}>
              I'm a <strong style={{ color: "rgba(255,255,255,.85)" }}>Java Software Engineer & Backend Developer</strong> with hands-on experience building scalable, production-grade web applications using <strong style={{ color: "#38BDF8" }}>Spring Boot, Spring Security, and RESTful APIs</strong>.
            </p>
            <p style={{ color: "rgba(255,255,255,.5)", lineHeight: 1.8, marginBottom: 20 }}>
              I'm proficient in <strong style={{ color: "rgba(255,255,255,.8)" }}>relational database design</strong> with MySQL, Hibernate ORM, and Spring Data JPA — and well-versed in <strong style={{ color: "#F89820" }}>Multithreading, DSA, OOP design patterns</strong>, and computer science fundamentals.
            </p>
            <p style={{ color: "rgba(255,255,255,.5)", lineHeight: 1.8 }}>
              Known for <strong style={{ color: "rgba(255,255,255,.8)" }}>analytical problem-solving, attention to detail</strong>, and collaborating across teams to deliver backend solutions on schedule. Seeking a Java internship to contribute to impactful engineering systems.
            </p>
          </div>

          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "start" }}>
            {[
              { icon: "🎓", val: "8.79", suffix: "/10", label: "CGPA at NIU" },
              { icon: "🔧", val: "10", suffix: "+", label: "REST APIs Built" },
              { icon: "🐛", val: "15", suffix: "+", label: "Backend Defects Fixed" },
              { icon: "📧", val: "80", suffix: "%", label: "Email Response Time ↓" },
            ].map(({ icon, val, suffix, label }) => (
              <SpotCard key={label} style={{ padding: "24px", textAlign: "center" }} className="reveal">
                <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#38BDF8" }}>{val}<span style={{ fontSize: "1rem" }}>{suffix}</span></div>
                <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
              </SpotCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
const EXPERIENCES = [
  {
    title: "Java Backend Developer (Project)",
    company: "MyDoctorApp",
    companyUrl: "https://github.com/ranjeetprajapati",
    period: "Jan 2024 – Present",
    type: "Healthcare Management Platform",
    bullets: [
      { text: "Constructed a full-stack healthcare platform enabling patients to search doctors, book appointments, and attend real-time video consultations", metric: "reducing manual scheduling effort by 100%" },
      { text: "Implemented Role-Based Access Control (RBAC) and secure user authentication using Spring Security", metric: "enforcing strict data access boundaries" },
      { text: "Built and documented", metric: "10+ RESTful API endpoints", tail: " in Spring Boot covering appointment scheduling, doctor availability management, and user profile operations." },
      { text: "Integrated Java Mail API for automated transactional email notifications", metric: "reducing response time by ~80%" },
      { text: "Resolved", metric: "15+ backend defects", tail: " related to session handling, JPA query performance, and API response formatting." },
    ],
    tags: ["Java", "Spring Boot", "Spring Security", "MySQL", "Spring Data JPA", "Hibernate", "Java Mail API", "Zego Video SDK"],
  },
  {
    title: "Java Backend Developer (Project)",
    company: "Email Writer",
    companyUrl: "https://github.com/ranjeetprajapati",
    period: "Aug 2024 – Dec 2024",
    type: "AI-Powered Email Generation Tool",
    bullets: [
      { text: "Developed an AI-powered email generation tool that converts natural language prompts into polished email drafts", metric: "reducing writing time by ~70%" },
      { text: "Created", metric: "5+ backend REST APIs", tail: " in Spring Boot to handle prompt processing, AI API orchestration, and structured email response delivery." },
      { text: "Architected a modular three-tier software structure decoupling React frontend, Spring Boot backend, and browser extension for independent deployment." },
      { text: "Constructed a browser extension enabling one-click email generation directly from any browser tab", metric: "expanding accessibility to non-technical users" },
    ],
    tags: ["Java", "Spring Boot", "REST API", "React", "JavaScript", "AI API Integration", "Browser Extension"],
  },
];

function Experience() {
  return (
    <section id="experience" style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="section-label reveal">02 — Experience</div>
        <h2 className="h2 reveal" style={{ color: "#fff", marginBottom: 48 }}>
          What I've <span style={{ color: "rgba(255,255,255,.3)" }}>built.</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {EXPERIENCES.map((exp, i) => (
            <SpotCard key={i} style={{ padding: "36px 40px", transition: "all .3s" }} className="reveal">
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#fff", marginBottom: 2 }}>{exp.title}</div>
                    <div>
                      <span style={{ color: "#38BDF8", fontWeight: 600 }}>{exp.company}</span>
                      <span style={{ color: "rgba(255,255,255,.35)", fontSize: ".8rem", marginLeft: 8 }}>— {exp.type}</span>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "5px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "rgba(255,255,255,.4)", whiteSpace: "nowrap" }}>
                    {exp.period}
                  </div>
                </div>

                <ul style={{ listStyle: "none", marginBottom: 24, marginTop: 16 }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: 10, marginBottom: 10, color: "rgba(255,255,255,.5)", fontSize: ".88rem", lineHeight: 1.65 }}>
                      <span style={{ color: "#38BDF8", marginTop: 2, flexShrink: 0 }}>›</span>
                      <span>
                        {b.text}{" "}
                        {b.metric && <strong style={{ color: "rgba(255,255,255,.8)" }}>{b.metric}</strong>}
                        {b.tail || ""}
                      </span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {exp.tags.map((t) => <span key={t} className="skill-tag">{t}</span>)}
                </div>
              </div>
            </SpotCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    name: "MyDoctorApp",
    desc: "A full-stack healthcare management platform enabling patients to search doctors, book appointments, and attend real-time video consultations. Built with layered MVC architecture and RBAC.",
    tags: ["Java", "Spring Boot", "Spring Security", "MySQL", "Hibernate", "React"],
    github: "https://github.com/ranjeetprajapati",
    live: "#",
    badge: "Production",
    badgeColor: "#38BDF8",
    seed: "healthcare",
    img: "https://picsum.photos/seed/healthcare-app/600/340",
  },
  {
    name: "Email Writer",
    desc: "An AI-powered email generation tool that converts natural language prompts into polished professional email drafts. Includes a browser extension for one-click generation from any webpage.",
    tags: ["Java", "Spring Boot", "REST API", "React", "JavaScript", "AI API"],
    github: "https://github.com/ranjeetprajapati",
    live: "#",
    badge: "Open Source",
    badgeColor: "#4ade80",
    seed: "email-ai",
    img: "https://picsum.photos/seed/email-ai/600/340",
  },
];

function Projects() {
  return (
    <section id="projects" style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="section-label reveal">03 — Featured Projects</div>
        <h2 className="h2 reveal" style={{ color: "#fff", marginBottom: 48 }}>
          Things I've <span style={{ color: "rgba(255,255,255,.3)" }}>shipped.</span>
        </h2>

        <div className="projects-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {PROJECTS.map((p) => {
            const ref = useRef(null);
            useSpotlight(ref);
            return (
              <div key={p.name} ref={ref} className="card-spotlight glass-card" style={{ borderRadius: 24, overflow: "hidden", transition: "all .35s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(56,189,248,0.12)"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = ""; }}
              >
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(3,3,3,1) 0%,transparent 60%)" }} />
                  <div style={{ position: "absolute", top: 14, left: 16, background: `rgba(${p.badgeColor === "#38BDF8" ? "56,189,248" : "74,222,128"},0.15)`, border: `1px solid ${p.badgeColor}44`, borderRadius: 999, padding: "4px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", color: p.badgeColor, letterSpacing: ".1em" }}>
                    {p.badge}
                  </div>
                </div>

                <div style={{ padding: "24px 28px", position: "relative", zIndex: 2 }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#fff", marginBottom: 10 }}>{p.name}</h3>
                  <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.45)", lineHeight: 1.7, marginBottom: 18 }}>{p.desc}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
                    {p.tags.map((t) => <span key={t} className="skill-tag">{t}</span>)}
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <a href={p.github} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".8rem", color: "rgba(255,255,255,.5)", textDecoration: "none", transition: "color .2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.5)"}
                    >
                      ⌘ Source Code
                    </a>
                    <span style={{ color: "rgba(255,255,255,.15)" }}>|</span>
                    <a href={p.live} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".8rem", color: "rgba(56,189,248,.6)", textDecoration: "none", transition: "color .2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#38BDF8"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(56,189,248,.6)"}
                    >
                      ↗ Live Demo
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
  { icon: "☕", color: "#F89820", title: "Core Java", skills: ["Java", "Core Java", "OOP", "Collections", "Multithreading", "Exception Handling", "Java Servlets", "Java EE"] },
  { icon: "🌿", color: "#6DB33F", title: "Spring Ecosystem", skills: ["Spring Boot", "Spring MVC", "Spring Security", "Spring Data JPA", "REST API", "MVC Architecture"] },
  { icon: "🗄️", color: "#38BDF8", title: "Databases & ORM", skills: ["MySQL", "Hibernate ORM", "SQL", "Database Design", "Normalization", "RDBMS"] },
  { icon: "⚛️", color: "#61DAFB", title: "Frontend & UI", skills: ["React", "JavaScript", "HTML", "CSS", "Thymeleaf"] },
  { icon: "🔐", color: "#b58900", title: "Architecture & Security", skills: ["RBAC", "JWT", "OOP Design Patterns", "Layered Architecture", "API Integration", "Software Architecture"] },
  { icon: "🛠️", color: "#9b59b6", title: "Tools & Engineering", skills: ["Git", "GitHub", "Maven", "Postman", "IntelliJ IDEA", "DSA", "UML Diagrams", "Flowcharts"] },
];

function Skills() {
  return (
    <section id="skills" style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="section-label reveal">04 — Technical Arsenal</div>
        <h2 className="h2 reveal" style={{ color: "#fff", marginBottom: 48 }}>
          My <span style={{ color: "rgba(255,255,255,.3)" }}>toolkit.</span>
        </h2>

        <div className="skills-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {SKILL_GROUPS.map((g) => (
            <SpotCard key={g.title} style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, background: `${g.color}18`, border: `1px solid ${g.color}30`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{g.icon}</div>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#fff" }}>{g.title}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {g.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </SpotCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CERTIFICATIONS ───────────────────────────────────────────────────────────
function Certifications() {
  const cards = [
    {
      icon: "🏆", iconBg: "#F89820",
      title: "Java Backend Development Bootcamp",
      issuer: "GeeksforGeeks",
      date: "April 2026",
      desc: "Comprehensive bootcamp covering Java backend development, Spring Boot, REST APIs, and production patterns.",
      link: "https://media.geeksforgeeks.org/certificates/1746115023022434304/90907ad8910628c698649c63d2f81733.pdf",
    },
    {
      icon: "🎓", iconBg: "#38BDF8",
      title: "B.Tech CSE (Data Science)",
      issuer: "Noida International University",
      date: "Aug 2023 – May 2027",
      desc: "Bachelor of Technology in Computer Science & Engineering with Data Science specialization. CGPA: 8.79/10.",
      link: "#",
    },
  ];

  return (
    <section id="certifications" style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="section-label reveal">05 — Certifications & Education</div>
        <h2 className="h2 reveal" style={{ color: "#fff", marginBottom: 48 }}>
          Credentials & <span style={{ color: "rgba(255,255,255,.3)" }}>Learning.</span>
        </h2>

        <div className="cert-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
          {cards.map((c) => (
            <SpotCard key={c.title} style={{ padding: "32px 36px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.iconBg}44`; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.transform = ""; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, background: `${c.iconBg}15`, border: `1px solid ${c.iconBg}35`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: 3 }}>{c.title}</div>
                  <div style={{ color: c.iconBg === "#38BDF8" ? "#38BDF8" : "#F89820", fontWeight: 600, fontSize: ".85rem" }}>{c.issuer}</div>
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", color: "rgba(255,255,255,.35)", letterSpacing: ".1em", marginBottom: 10 }}>{c.date}</div>
              <p style={{ fontSize: ".83rem", color: "rgba(255,255,255,.45)", lineHeight: 1.65, marginBottom: 16 }}>{c.desc}</p>
              {c.link !== "#" && (
                <a href={c.link} target="_blank" rel="noreferrer" style={{ fontSize: ".75rem", color: "rgba(56,189,248,.6)", textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#38BDF8"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(56,189,248,.6)"}
                >↗ Verify Certificate</a>
              )}
            </SpotCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CODE SHOWCASE ────────────────────────────────────────────────────────────
function CodeShowcase() {
  return (
    <section style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="section-label reveal">06 — Code Showcase</div>
        <h2 className="h2 reveal" style={{ color: "#fff", marginBottom: 48 }}>
          How I <span style={{ color: "rgba(255,255,255,.3)" }}>write code.</span>
        </h2>

        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Pattern */}
          <div className="code-win">
            <div className="code-bar">
              <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "rgba(255,255,255,.3)", marginLeft: 8 }}>AppointmentService.java</span>
            </div>
            <div className="code-body">
              <span className="an">@Service</span><br />
              <span className="an">@Transactional</span><br />
              <span className="kw">public class </span><span className="cn">AppointmentService</span> {"{"}<br />
              <br />
              {"  "}<span className="an">@Autowired</span><br />
              {"  "}<span className="kw">private </span><span className="cn">AppointmentRepository</span> <span className="ac">repo</span>;<br />
              <br />
              {"  "}<span className="cm">// Book appointment with validation</span><br />
              {"  "}<span className="kw">public </span><span className="cn">AppointmentDTO</span> bookAppointment(<br />
              {"      "}<span className="cn">AppointmentRequest</span> request) {"{"}<br />
              {"    "}<span className="kw">if </span>(<span className="ac">repo</span>.existsConflict(<br />
              {"        "}request.getDoctorId(),<br />
              {"        "}request.getDateTime())) {"{"}<br />
              {"      "}<span className="kw">throw new </span><span className="cn">ConflictException</span>(<br />
              {"          "}<span className="st">"Slot unavailable"</span>);<br />
              {"    }"}<br />
              {"    "}<span className="cn">Appointment</span> appt =<br />
              {"      mapper.toEntity(request);"}<br />
              {"    "}<span className="kw">return </span>mapper.toDTO(<br />
              {"      "}<span className="ac">repo</span>.save(appt));<br />
              {"  }}"}<br />
            </div>
          </div>

          {/* Security config */}
          <div className="code-win">
            <div className="code-bar">
              <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "rgba(255,255,255,.3)", marginLeft: 8 }}>SecurityConfig.java</span>
            </div>
            <div className="code-body">
              <span className="an">@Configuration</span><br />
              <span className="an">@EnableWebSecurity</span><br />
              <span className="kw">public class </span><span className="cn">SecurityConfig</span> {"{"}<br />
              <br />
              {"  "}<span className="an">@Bean</span><br />
              {"  "}<span className="kw">public </span><span className="cn">SecurityFilterChain</span><br />
              {"  filterChain("}
              <span className="cn">HttpSecurity</span> http) <span className="kw">throws </span><span className="cn">Exception</span> {"{"}<br />
              {"    "}http.csrf(<span className="cn">AbstractHttpConfigurer</span>::disable)<br />
              {"      "}.authorizeHttpRequests(auth -> auth<br />
              {"        "}.requestMatchers(<span className="st">"/api/auth/**"</span>).permitAll()<br />
              {"        "}.requestMatchers(<span className="st">"/api/doctor/**"</span>)<br />
              {"          "}.hasRole(<span className="st">"DOCTOR"</span>)<br />
              {"        "}.anyRequest().authenticated())<br />
              {"      "}.sessionManagement(sm -> sm<br />
              {"        "}.sessionCreationPolicy(<span className="jv">STATELESS</span>))<br />
              {"      "}.addFilterBefore(jwtFilter, <span className="cn">UsernamePasswordAuthenticationFilter</span>.class);<br />
              {"    "}<span className="kw">return </span>http.build();<br />
              {"  }}"}<br />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    if (!form.message.trim()) e.message = true;
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setToast(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setToast(false), 5000);
    }
  };

  const SOCIAL = [
    { label: "Email", href: "mailto:ranjeet75504@gmail.com", icon: "✉" },
    { label: "GitHub", href: "https://github.com/ranjeetprajapati", icon: "⌘" },
    { label: "LinkedIn", href: "https://linkedin.com/in/ranjeet-prajapati-286956394", icon: "in" },
    { label: "Portfolio", href: "https://my-portfolio-liard-omega92ea0rn067.vercel.app", icon: "↗" },
  ];

  return (
    <section id="contact" style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div className="section-label reveal">07 — Get In Touch</div>
        <h2 className="h2 reveal" style={{ marginBottom: 16 }}>
          <span style={{ color: "#fff" }}>Let's build</span><br />
          <span className="gradient-text">something great.</span>
        </h2>
        <p className="reveal" style={{ color: "rgba(255,255,255,.45)", fontSize: ".95rem", marginBottom: 48, maxWidth: 480, lineHeight: 1.7 }}>
          I'm actively seeking Java backend internship opportunities. Whether you have a project in mind or just want to connect — I'd love to hear from you.
        </p>

        <SpotCard style={{ padding: "40px" }} className="reveal">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <label className="c-label">Name *</label>
              <input className={`c-input ${errors.name ? "error" : ""}`} placeholder="Ranjeet Prajapati" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: false }); }} />
            </div>
            <div>
              <label className="c-label">Email *</label>
              <input className={`c-input ${errors.email ? "error" : ""}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: false }); }} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="c-label">Subject</label>
            <input className="c-input" placeholder="Java Backend Internship Opportunity" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label className="c-label">Message *</label>
            <textarea className={`c-input ${errors.message ? "error" : ""}`} rows={5} placeholder="Tell me about the opportunity or project..." value={form.message} onChange={e => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: false }); }} style={{ resize: "vertical" }} />
          </div>
          <button className="btn-primary" onClick={submit} style={{ width: "100%" }}>
            <span className="btn-primary-inner" style={{ justifyContent: "center", padding: "14px 28px" }}>Send Message ↗</span>
          </button>
        </SpotCard>

        {/* Social links */}
        <div className="reveal contact-links" style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 999, padding: "10px 20px",
              fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem",
              color: "rgba(255,255,255,.55)", textDecoration: "none",
              transition: "all .25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(56,189,248,.4)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,.55)"; }}
            >
              <span style={{ color: "#38BDF8" }}>{s.icon}</span> {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast">
          <span style={{ color: "#4ade80", fontSize: "1.1rem" }}>✓</span>
          <span style={{ color: "rgba(255,255,255,.8)" }}>Message sent! I'll get back to you soon.</span>
          <button onClick={() => setToast(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.3)", cursor: "pointer", marginLeft: 8 }}>✕</button>
        </div>
      )}
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "40px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1280, margin: "0 auto", flexWrap: "wrap", gap: 16 }}>
      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: ".9rem", color: "rgba(255,255,255,.3)" }}>
        <span style={{ color: "rgba(56,189,248,.5)" }}>R</span>anjeet
      </span>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "rgba(255,255,255,.25)", letterSpacing: ".06em" }}>
        Crafted with ☕ and attention to detail · © 2025
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 7, height: 7, background: "#4ade80", borderRadius: "50%", display: "inline-block", animation: "pulse-dot 1.5s cubic-bezier(.4,0,.6,1) infinite" }} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "rgba(255,255,255,.35)", letterSpacing: ".1em" }}>Open to opportunities</span>
      </div>
    </footer>
  );
}

// ─── BACKGROUND ───────────────────────────────────────────────────────────────
function Background() {
  return (
    <>
      {/* Dot grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(to right,rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.025) 1px,transparent 1px)",
        backgroundSize: "80px 160px",
        maskImage: "radial-gradient(ellipse at center,black 30%,transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse at center,black 30%,transparent 90%)",
      }} />
      {/* Glow blobs */}
      <div style={{ position: "fixed", top: -200, left: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,0.05),transparent 70%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -200, right: -200, width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(248,152,32,0.05),transparent 70%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <Background />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <CodeShowcase />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
