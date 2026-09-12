"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AuthHeaderButtons from "./AuthHeaderButtons";
import Reveal from "./Reveal";
import SiteFooter from "./SiteFooter";
import { PROGRAMS, SUBJECT_SLUGS, getAllClassesForSubject } from "@/lib/programs";
import { CREDIT_PACKAGES } from "@/lib/credits";
import { FAQ } from "@/lib/landing-faq";

// Категорії для фільтра в блоці "Предмети" — просто угруповання назв із
// lib/programs.ts, не окреме джерело правди (якщо предмет туди додається,
// але сюди не потрапляє, він піде в "Інше" — не зникне з фільтра).
const CATEGORIES: Record<string, string> = {
  "Англійська мова": "Мови",
  "Німецька мова": "Мови",
  "Французька мова": "Мови",
  "Іспанська мова": "Мови",
  "Українська мова": "Мови",
  "Зарубіжна література": "Мови",
  "Українська література": "Мови",
  "Математика": "Природничі",
  "Інформатика": "Природничі",
  "Хімія": "Природничі",
  "Біологія": "Природничі",
  "Фізика": "Природничі",
  "Астрономія": "Природничі",
  "Природничі науки": "Природничі",
  "Історія України": "Суспільні",
  "Всесвітня історія": "Суспільні",
  "Географія": "Суспільні",
  "Основи правознавства": "Суспільні",
  "Історія: Україна і світ": "Суспільні",
};
const ICONS: Record<string, string> = {
  "Англійська мова": "🇬🇧",
  "Німецька мова": "🇩🇪",
  "Французька мова": "🇫🇷",
  "Іспанська мова": "🇪🇸",
  "Українська мова": "🖋️",
  "Зарубіжна література": "📖",
  "Українська література": "📚",
  "Технології": "🛠️",
  "Фізична культура": "🏃",
  "Математика": "📐",
  "Інформатика": "💻",
  "Історія України": "🏛️",
  "Всесвітня історія": "🌍",
  "Мистецтво": "🎨",
  "Географія": "🗺️",
  "Основи правознавства": "⚖️",
  "Хімія": "🧪",
  "Біологія": "🧬",
  "Фізика": "🔭",
  "Захист України": "🛡️",
  "Фінансова грамотність": "💰",
  "Астрономія": "🪐",
  "Природничі науки": "🔬",
  "Історія: Україна і світ": "📜",
};

const SUBJECTS = Object.keys(PROGRAMS).map((subject) => {
  const classes = getAllClassesForSubject(subject);
  const range = classes.length > 1 ? `${classes[0]}-${classes[classes.length - 1]} клас` : `${classes[0]} клас`;
  return {
    name: subject,
    slug: SUBJECT_SLUGS[subject],
    icon: ICONS[subject] || "📘",
    category: CATEGORIES[subject] || "Інше",
    range,
  };
});
const FILTER_CATS = ["Усі", "Мови", "Природничі", "Суспільні", "Інше"];

function PlanksBackground() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const palette = ["#12313B", "#17404C", "#0E2830", "#1C4B58"];
    const sand = ["#C9B896", "#B5A480", "#D4C4A0"];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 16; i++) {
      const el = document.createElement("div");
      el.className = "plank";
      const isSand = Math.random() < 0.28;
      const w = 34 + Math.random() * 46;
      const h = 220 + Math.random() * 420;
      const left = (i / 16) * 100 + (Math.random() * 4 - 2);
      const top = -80 + Math.random() * 160;
      el.style.width = w + "px";
      el.style.height = h + "px";
      el.style.left = `calc(${left}% - ${w / 2}px)`;
      el.style.top = top + "px";
      el.style.background = isSand
        ? `linear-gradient(180deg, ${sand[Math.floor(Math.random() * sand.length)]}, ${sand[Math.floor(Math.random() * sand.length)]})`
        : `linear-gradient(180deg, ${palette[Math.floor(Math.random() * palette.length)]}, ${palette[Math.floor(Math.random() * palette.length)]})`;
      el.style.opacity = isSand ? ".85" : ".95";
      frag.appendChild(el);
    }
    container.appendChild(frag);
    return () => {
      container.innerHTML = "";
    };
  }, []);
  return <div className="planks-zone" ref={ref} />;
}

function useSpotlight() {
  return (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };
}

function AnimatedStat({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(decimals ? "0.0" : "0");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target.toFixed(decimals));
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const duration = 900;
        function tick(now: number) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal((target * eased).toFixed(decimals));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, decimals]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function HomePageContent() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeCategory, setActiveCategory] = useState("Усі");
  const [reqText, setReqText] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqStatus, setReqStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const heroRef = useRef<HTMLDivElement>(null);
  const spotlight = useSpotlight();

  useEffect(() => {
    document.documentElement.setAttribute("data-tp-theme", theme);
  }, [theme]);

  // Паралакс миші для карток у хіро — той самий рух, що й у макеті: тільки
  // side-card/main-card, note-card має власне "гойдання" через CSS-анімацію.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function onMove(e: MouseEvent) {
      const rect = hero!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      hero!.querySelectorAll<HTMLElement>(".stack-card:not(.note-card)").forEach((card, i) => {
        const depth = (i + 1) * 4;
        card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    }
    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  const filteredSubjects = useMemo(
    () => (activeCategory === "Усі" ? SUBJECTS : SUBJECTS.filter((s) => s.category === activeCategory)),
    [activeCategory]
  );

  async function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReqStatus("sending");
    try {
      const res = await fetch("/api/subject-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestText: reqText, email: reqEmail || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Помилка");
      setReqStatus("sent");
      setReqText("");
      setReqEmail("");
    } catch {
      setReqStatus("error");
    }
  }

  return (
    <div className="tp-home">
      <style>{`
        .tp-home{
          --paper:#081019; --card-dark:#0F1D28; --card-dark-2:#122334; --ink:#F4F1EA; --ink-dim:#8FA3AE;
          --rule:#1C2E38; --cyan:#4FD1E8; --cyan-dim:#2FA8C0; --sand:#C9B896; --sand-dim:#8A7A58;
          --light-card:#F2EEE3; --light-ink:#16232B; --light-ink-dim:#5C6B72;
          --btn-ink:#07222b; --cyan-bright:#6fdcee; --header-bg:rgba(8,16,25,.8); --plank-opacity:1;
          background:var(--paper); color:var(--ink); font-family:"Inter",-apple-system,sans-serif; line-height:1.6;
          overflow-x:hidden; min-height:100vh;
        }
        html[data-tp-theme="light"] .tp-home{
          --paper:#FFFFFF; --card-dark:#F6F7F8; --card-dark-2:#EEF0F2; --ink:#12161B; --ink-dim:#5B6570;
          --rule:#E3E6E9; --cyan:#0E8FA6; --cyan-dim:#0B7182; --sand:#64748B; --sand-dim:#475569;
          --light-card:#FFFFFF; --light-ink:#16232B; --light-ink-dim:#5C6B72;
          --btn-ink:#FFFFFF; --cyan-bright:#12A6C0; --header-bg:rgba(255,255,255,.85); --plank-opacity:.14;
        }
        html[data-tp-theme="light"] .tp-home .main-card,
        html[data-tp-theme="light"] .tp-home .cal-lesson,
        html[data-tp-theme="light"] .tp-home .funnel-card:nth-child(3){ border:1px solid var(--rule); }
        html[data-tp-theme="light"] .tp-home .kicker,
        html[data-tp-theme="light"] .tp-home .kicker2{
          background:none; border:none; border-radius:0; padding:0 0 .3rem;
          color:#0B0D10; text-transform:uppercase; letter-spacing:.14em; font-size:.72rem;
          border-bottom:2px solid #0B0D10; display:inline-block;
        }
        html[data-tp-theme="light"] .tp-home .filter-tab.active{ background:#0B0D10; border-color:#0B0D10; color:#fff; }
        html[data-tp-theme="light"] .tp-home .compare-card.win{ background:#0B0D10; border-color:#0B0D10; }
        html[data-tp-theme="light"] .tp-home .compare-card.win .compare-num,
        html[data-tp-theme="light"] .tp-home .compare-card.win .compare-label{ color:#F5F3EE; }
        html[data-tp-theme="light"] .tp-home .compare-card.win p{ color:#A9ACB3; }
        html[data-tp-theme="light"] .tp-home section.process{ background:#0B0D10; border-color:#0B0D10; }
        html[data-tp-theme="light"] .tp-home section.process .kicker2,
        html[data-tp-theme="light"] .tp-home section.process h2,
        html[data-tp-theme="light"] .tp-home section.process .step h4{ color:#F5F3EE; border-color:#F5F3EE; }
        html[data-tp-theme="light"] .tp-home section.process .section-lede,
        html[data-tp-theme="light"] .tp-home section.process .step p{ color:#9EA2AA; }
        html[data-tp-theme="light"] .tp-home section.process .step .num{ background:#0B0D10; border-color:#F5F3EE; color:#F5F3EE; }
        html[data-tp-theme="light"] .tp-home section.process .steps::before{ background:linear-gradient(180deg,#F5F3EE,transparent); }
        html[data-tp-theme="light"] .tp-home .funnel-card:not(:nth-child(3)){ background:#15181D; border-color:#2A2E35; color:#E4E5E8; }
        html[data-tp-theme="light"] .tp-home .funnel-card:not(:nth-child(3)) .prompt{ color:#9EA2AA; }
        html[data-tp-theme="light"] .tp-home .price-card.popular::before{ background:conic-gradient(from var(--ang,0deg), #0B0D10, var(--cyan), #0B0D10); }
        html[data-tp-theme="light"] .tp-home .popular-tag{ background:#0B0D10; color:#fff; }

        /* Тіні від карток у білій темі — без них картки зливаються з білим
           фоном (лише тонка рамка), сайт виглядає пласким. У темній темі
           не чіпаємо — там інша, вже об'ємна композиція (funnel/cal-card
           тощо мають власні тіні незалежно від теми). */
        html[data-tp-theme="light"] .tp-home .compare-card,
        html[data-tp-theme="light"] .tp-home .subject-card,
        html[data-tp-theme="light"] .tp-home .price-card,
        html[data-tp-theme="light"] .tp-home .request-card,
        html[data-tp-theme="light"] .tp-home .schools-card{
          box-shadow:0 1px 2px rgba(16,24,32,.04), 0 14px 32px -16px rgba(16,24,32,.16);
        }
        html[data-tp-theme="light"] .tp-home .compare-card:hover,
        html[data-tp-theme="light"] .tp-home .subject-card:hover,
        html[data-tp-theme="light"] .tp-home .price-card:hover{
          box-shadow:0 4px 10px rgba(16,24,32,.06), 0 26px 48px -16px rgba(16,24,32,.22);
        }
        html[data-tp-theme="light"] .tp-home .schools-card:hover{
          box-shadow:0 4px 10px rgba(16,24,32,.06), 0 20px 40px -16px rgba(16,24,32,.18);
        }
        /* compare-card.win і price-card.popular темні навіть у білій темі —
           їм пасує глибша, помітніша тінь, ніж світлим картками поряд. */
        html[data-tp-theme="light"] .tp-home .compare-card.win{
          box-shadow:0 1px 2px rgba(0,0,0,.2), 0 20px 40px -14px rgba(0,0,0,.4);
        }
        html[data-tp-theme="light"] .tp-home .compare-card.win:hover{
          box-shadow:0 4px 10px rgba(0,0,0,.24), 0 30px 56px -14px rgba(0,0,0,.48);
        }

        .tp-home a{ color:inherit; text-decoration:none; }
        .tp-home .wrap{ max-width:1180px; margin:0 auto; padding:0 1.75rem; position:relative; z-index:2; }
        .tp-home h1,.tp-home h2,.tp-home h3,.tp-home h4{ font-weight:700; text-wrap:balance; letter-spacing:-.02em; }
        .tp-home .hero h1, .tp-home h2.section-title{ font-family:Georgia,serif; font-weight:700; letter-spacing:-.01em; }
        .tp-home .script{ font-family:cursive; }

        .tp-home .planks-zone{ position:absolute; inset:0; overflow:hidden; z-index:0; pointer-events:none; opacity:var(--plank-opacity); transition:opacity .3s; }
        .tp-home .plank{ position:absolute; border-radius:999px; }
        .tp-home .scrim{ position:absolute; inset:0; background:linear-gradient(90deg, var(--paper) 0%, var(--paper) 26%, transparent 60%); z-index:1; pointer-events:none; }

        .tp-home header{ background:var(--header-bg); backdrop-filter:blur(14px); border-bottom:1px solid var(--rule); padding:1rem 0; position:sticky; top:0; z-index:40; transition:background .3s; }
        .tp-home .theme-toggle{ display:inline-flex; align-items:center; justify-content:center; width:2.3rem; height:2.3rem; border-radius:999px; border:1px solid var(--rule); background:transparent; color:var(--ink-dim); cursor:pointer; font-size:1rem; transition:all .25s; }
        .tp-home .theme-toggle:hover{ border-color:var(--cyan-dim); color:var(--cyan); transform:rotate(15deg); }
        .tp-home header .row{ display:flex; align-items:center; justify-content:space-between; gap:1rem; }
        .tp-home .brand{ display:flex; align-items:center; gap:.6rem; font-weight:700; font-size:1.08rem; color:var(--ink); }
        .tp-home .brand .mark{ width:1.9rem; height:1.9rem; border-radius:.55rem; background:var(--cyan); color:var(--btn-ink); display:flex; align-items:center; justify-content:center; font-size:.95rem; }
        .tp-home nav.top{ display:flex; align-items:center; gap:2rem; font-size:.86rem; }
        .tp-home nav.top .links{ display:flex; align-items:center; gap:1.9rem; }
        .tp-home nav.top a.navlink{ color:var(--ink-dim); transition:color .2s; }
        .tp-home nav.top a.navlink:hover{ color:var(--ink); }
        .tp-home .btn{ display:inline-flex; align-items:center; gap:.5rem; padding:.65rem 1.3rem; border-radius:999px; font-weight:600; font-size:.85rem; cursor:pointer; border:1px solid transparent; transition:all .25s cubic-bezier(.2,.8,.2,1); }
        .tp-home .btn-solid{ background:var(--cyan); color:var(--btn-ink); }
        .tp-home .btn-solid:hover{ background:var(--cyan-bright); transform:translateY(-2px); box-shadow:0 10px 24px -8px color-mix(in srgb, var(--cyan) 60%, transparent); }
        .tp-home .btn-ghost{ background:transparent; color:var(--ink); border-color:var(--rule); }
        .tp-home .btn-ghost:hover{ border-color:var(--sand-dim); color:var(--sand); }
        .tp-home .btn:active{ transform:scale(.96); }

        .tp-home .hero{ position:relative; padding:5rem 0 6rem; min-height:600px; }
        .tp-home .hero-grid{ display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:center; position:relative; z-index:2; }
        .tp-home .kicker{ display:inline-flex; align-items:center; gap:.5rem; font-size:.76rem; font-weight:600; color:var(--sand); background:color-mix(in srgb, var(--sand) 10%, transparent); border:1px solid color-mix(in srgb, var(--sand) 30%, transparent); padding:.35rem .85rem; border-radius:999px; margin-bottom:1.5rem; }
        .tp-home .hero h1{ font-size:clamp(2.4rem,4.6vw,3.5rem); line-height:1.06; margin:0 0 1.1rem; animation:tp-hero-in .7s cubic-bezier(.22,.8,.25,1) both; }
        .tp-home .hero h1 .cy{ color:var(--cyan); }
        .tp-home .hero p.lede{ font-size:1.08rem; color:var(--ink-dim); max-width:42ch; margin:0 0 1.9rem; }
        .tp-home .hero .cta-row{ display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:2rem; }
        .tp-home .stats-row{ display:flex; gap:2.2rem; }
        .tp-home .stat b{ display:block; font-size:1.4rem; font-weight:800; font-variant-numeric:tabular-nums; }
        .tp-home .stat span{ font-size:.76rem; color:var(--ink-dim); }
        @keyframes tp-hero-in{ from{ opacity:0; transform:translateY(24px); } to{ opacity:1; transform:translateY(0); } }
        .tp-home .hero-visual{ animation:tp-hero-in .7s cubic-bezier(.22,.8,.25,1) .12s both; }

        .tp-home #parallaxHero{ position:relative; height:420px; }
        .tp-home .stack-card{ position:absolute; transition:transform .15s ease-out; will-change:transform; }
        .tp-home .side-card{ background:var(--card-dark-2); border:1px solid var(--rule); border-radius:1.2rem; padding:1.3rem 1.1rem; width:220px; top:18px; left:-10px; box-shadow:0 20px 50px -20px rgba(0,0,0,.6); z-index:1; }
        .tp-home .side-card .brand{ font-size:.85rem; margin-bottom:1rem; padding-bottom:.9rem; border-bottom:1px solid var(--rule); }
        .tp-home .side-nav{ display:flex; flex-direction:column; gap:.15rem; }
        .tp-home .side-nav a{ display:flex; align-items:center; gap:.6rem; padding:.55rem .6rem; border-radius:.5rem; font-size:.8rem; color:var(--ink-dim); }
        .tp-home .side-nav a.active{ background:color-mix(in srgb, var(--cyan) 12%, transparent); color:var(--cyan); }
        .tp-home .side-nav .dot{ width:.4rem; height:.4rem; border-radius:50%; background:currentColor; opacity:.6; }
        .tp-home .main-card{ background:var(--light-card); color:var(--light-ink); border-radius:1.4rem; padding:1.6rem 1.7rem; width:340px; top:0; left:130px; box-shadow:0 30px 70px -18px rgba(0,0,0,.55); z-index:2; transition:transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
        .tp-home .main-card:hover{ transform:translateY(-8px); box-shadow:0 40px 90px -16px rgba(0,0,0,.65); }
        .tp-home .app-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
        .tp-home .app-title{ font-weight:700; font-size:.95rem; }
        .tp-home .select-row{ display:flex; gap:.5rem; margin-bottom:1rem; }
        .tp-home select.fake{ font-family:"Inter",sans-serif; font-size:.76rem; color:var(--light-ink-dim); background:#fff; border:1px solid #E2DCC8; border-radius:.5rem; padding:.35rem .6rem; }
        .tp-home ul.lesson-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.5rem; }
        .tp-home ul.lesson-list li{ display:flex; align-items:center; gap:.6rem; font-size:.85rem; }
        .tp-home ul.lesson-list .n{ width:1.5rem; height:1.5rem; border-radius:.4rem; background:#E8F9FB; color:var(--cyan-dim); display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:700; flex:none; }
        .tp-home .note-card{ position:absolute; top:60px; right:-30px; z-index:3; text-align:right; animation:tp-float 5.5s ease-in-out infinite; }
        .tp-home .note-card .script{ font-size:1.5rem; color:var(--sand); line-height:1.2; }
        @keyframes tp-float{ 0%,100%{ transform:translateY(0) rotate(-1.5deg); } 50%{ transform:translateY(-9px) rotate(1deg); } }

        .tp-home .spotlight{ position:relative; overflow:hidden; }
        .tp-home .spotlight::before{ content:""; position:absolute; inset:0; z-index:0; opacity:0; pointer-events:none; background:radial-gradient(320px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--cyan) 14%, transparent), transparent 65%); transition:opacity .3s; }
        .tp-home .spotlight:hover::before{ opacity:1; }
        .tp-home .spotlight > *{ position:relative; z-index:1; }

        .tp-home section.compare{ padding:2rem 0 2rem; position:relative; z-index:2; }
        .tp-home .compare-grid{ display:grid; grid-template-columns:1fr 1fr; gap:1.4rem; max-width:920px; margin:0 auto; }
        .tp-home .compare-card{ background:var(--card-dark); border:1px solid var(--rule); border-radius:1.1rem; padding:1.9rem; text-align:center; transition:transform .25s, box-shadow .25s; }
        .tp-home .compare-card:hover{ transform:translateY(-4px); }
        .tp-home .compare-card.win{ border-color:color-mix(in srgb, var(--cyan) 40%, transparent); background:linear-gradient(160deg, color-mix(in srgb, var(--cyan) 9%, transparent), var(--card-dark)); }
        .tp-home .compare-num{ font-size:2.7rem; font-weight:800; }
        .tp-home .compare-card.win .compare-num{ color:var(--cyan); }
        .tp-home .compare-label{ font-size:.8rem; color:var(--ink-dim); font-weight:600; text-transform:uppercase; letter-spacing:.05em; }
        .tp-home .compare-card p{ color:var(--ink-dim); margin:.9rem 0 0; font-size:.88rem; }

        .tp-home section.features{ padding:4.5rem 0; position:relative; z-index:2; }
        .tp-home .feat-section-grid{ display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center; }
        .tp-home .kicker2{ display:inline-flex; align-items:center; gap:.5rem; font-size:.76rem; font-weight:600; color:var(--cyan); background:color-mix(in srgb, var(--cyan) 8%, transparent); border:1px solid color-mix(in srgb, var(--cyan) 30%, transparent); padding:.35rem .85rem; border-radius:999px; margin-bottom:1.3rem; }
        .tp-home h2.section-title{ font-size:1.9rem; margin:0 0 .7rem; }
        .tp-home p.section-lede{ color:var(--ink-dim); margin:0 0 1.8rem; max-width:44ch; }
        .tp-home .feat-2x2{ display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .tp-home .feat-item{ display:flex; gap:.7rem; }
        .tp-home .feat-item .ico{ width:2.3rem; height:2.3rem; border-radius:.65rem; display:flex; align-items:center; justify-content:center; font-size:1.05rem; flex:none; transition:transform .35s cubic-bezier(.34,1.56,.64,1); }
        .tp-home .feat-item:hover .ico{ transform:scale(1.15) rotate(-6deg); }
        .tp-home .feat-item:nth-child(odd) .ico{ background:color-mix(in srgb, var(--cyan) 12%, transparent); color:var(--cyan); }
        .tp-home .feat-item:nth-child(even) .ico{ background:color-mix(in srgb, var(--sand) 15%, transparent); color:var(--sand); }
        .tp-home .feat-item h4{ font-size:.92rem; margin:0 0 .25rem; }
        .tp-home .feat-item p{ color:var(--ink-dim); font-size:.8rem; margin:0; }

        .tp-home .cal-stack{ position:relative; height:380px; }
        .tp-home .cal-card{ position:absolute; top:0; right:20px; width:270px; background:var(--card-dark-2); border:1px solid var(--rule); border-radius:1.1rem; padding:1.3rem; z-index:1; box-shadow:0 20px 50px -20px rgba(0,0,0,.6); }
        .tp-home .cal-title{ font-size:.85rem; font-weight:700; margin-bottom:.8rem; }
        .tp-home .cal-grid{ display:grid; grid-template-columns:repeat(5,1fr); gap:.3rem; font-size:.68rem; text-align:center; color:var(--ink-dim); }
        .tp-home .cal-grid .d{ padding:.35rem 0; border-radius:.35rem; }
        .tp-home .cal-grid .d.active{ background:var(--cyan); color:var(--btn-ink); font-weight:700; }
        .tp-home .cal-lesson{ position:absolute; top:140px; left:0; width:280px; background:var(--light-card); color:var(--light-ink); border-radius:1.1rem; padding:1.3rem 1.4rem; z-index:2; box-shadow:0 30px 70px -18px rgba(0,0,0,.55); transition:transform .3s; }
        .tp-home .cal-lesson:hover{ transform:translateY(-6px); }
        .tp-home .cal-lesson .tag{ display:inline-block; font-size:.68rem; font-weight:700; background:#E8F9FB; color:var(--cyan-dim); padding:.25rem .6rem; border-radius:.4rem; margin-bottom:.7rem; }
        .tp-home .cal-lesson ul{ list-style:none; margin:0 0 1rem; padding:0; display:flex; flex-direction:column; gap:.4rem; font-size:.82rem; }
        .tp-home .cal-lesson ul li::before{ content:"✓ "; color:var(--cyan-dim); font-weight:700; }
        .tp-home .cal-lesson .btn-solid{ width:100%; justify-content:center; }

        .tp-home section.process{ padding:4.5rem 0; position:relative; z-index:2; background:var(--card-dark); border-top:1px solid var(--rule); border-bottom:1px solid var(--rule); }
        .tp-home .process-grid{ display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center; }
        .tp-home .steps{ position:relative; }
        .tp-home .steps::before{ content:""; position:absolute; left:1.1rem; top:1.6rem; bottom:1.6rem; width:2px; background:linear-gradient(180deg, var(--cyan), transparent); }
        .tp-home .step{ display:flex; gap:1.1rem; margin-bottom:2rem; position:relative; }
        .tp-home .step:last-child{ margin-bottom:0; }
        .tp-home .step .num{ width:2.3rem; height:2.3rem; border-radius:50%; background:var(--paper); border:2px solid var(--cyan); color:var(--cyan); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.95rem; flex:none; z-index:1; }
        .tp-home .step h4{ font-size:1.02rem; margin:.15rem 0 .3rem; }
        .tp-home .step p{ color:var(--ink-dim); font-size:.87rem; margin:0; }
        .tp-home .funnel-stack{ position:relative; height:330px; }
        .tp-home .funnel-card{ position:absolute; left:0; right:0; background:var(--card-dark-2); border:1px solid var(--rule); border-radius:1rem; padding:1.1rem 1.3rem; transition:transform .3s, opacity .3s; }
        .tp-home .funnel-card:nth-child(1){ top:0; opacity:.6; transform:scale(.94); }
        .tp-home .funnel-card:nth-child(2){ top:90px; opacity:.85; transform:scale(.97); }
        .tp-home .funnel-card:nth-child(3){ top:180px; z-index:2; background:var(--light-card); color:var(--light-ink); box-shadow:0 30px 70px -16px rgba(0,0,0,.55); }
        .tp-home .funnel-stack:hover .funnel-card:nth-child(1){ transform:translateY(-4px) scale(.95); }
        .tp-home .funnel-stack:hover .funnel-card:nth-child(2){ transform:translateY(-4px) scale(.98); }
        .tp-home .funnel-stack:hover .funnel-card:nth-child(3){ transform:translateY(-8px); }
        .tp-home .funnel-card .prompt{ font-size:.85rem; color:var(--ink-dim); }
        .tp-home .funnel-card .prompt-btn{ float:right; width:1.8rem; height:1.8rem; border-radius:50%; background:var(--cyan); color:var(--btn-ink); display:flex; align-items:center; justify-content:center; }
        .tp-home .funnel-card .gen-row{ display:flex; align-items:center; gap:.6rem; font-size:.85rem; color:var(--cyan); font-weight:600; margin-bottom:.6rem; }
        .tp-home .progress-bar{ height:6px; background:var(--rule); border-radius:99px; overflow:hidden; }
        .tp-home .progress-bar span{ display:block; height:100%; width:64%; background:linear-gradient(90deg,var(--cyan),var(--sand)); }
        .tp-home .funnel-card:nth-child(3) h4{ font-size:.95rem; margin:0 0 .6rem; }
        .tp-home .funnel-card:nth-child(3) .bars{ display:flex; flex-direction:column; gap:.4rem; }
        .tp-home .funnel-card:nth-child(3) .bars div{ height:6px; background:#E5E0D2; border-radius:99px; }
        .tp-home .funnel-card:nth-child(3) .bars div:nth-child(1){ width:90%; }
        .tp-home .funnel-card:nth-child(3) .bars div:nth-child(2){ width:65%; }

        .tp-home section.schools{ padding:4.5rem 0; position:relative; z-index:2; }
        .tp-home .schools-card{ max-width:1040px; margin:0 auto; border-radius:1.6rem; padding:2.7rem 2.9rem; display:grid; grid-template-columns:1.3fr .7fr; gap:2rem; align-items:center; border:1px solid color-mix(in srgb, var(--sand) 35%, transparent); background:linear-gradient(135deg, color-mix(in srgb, var(--sand) 10%, transparent), var(--paper) 60%); transition:border-color .3s, box-shadow .3s; }
        .tp-home .schools-card:hover{ border-color:color-mix(in srgb, var(--sand) 60%, transparent); }
        .tp-home .schools-card h2{ font-size:1.9rem; margin:0 0 .7rem; }
        .tp-home .schools-card p{ color:var(--ink-dim); margin:0 0 1.3rem; max-width:46ch; }
        .tp-home .schools-list{ list-style:none; margin:0 0 1.5rem; padding:0; display:flex; flex-direction:column; gap:.5rem; font-size:.9rem; }
        .tp-home .schools-list li::before{ content:"✓ "; color:var(--sand); font-weight:700; }
        .tp-home .schools-side{ background:rgba(255,255,255,.04); border:1px solid var(--rule); border-radius:1rem; padding:1.5rem; text-align:center; }
        .tp-home .schools-side .big{ font-size:1.85rem; font-weight:800; color:var(--sand); }
        .tp-home .schools-side .small{ font-size:.75rem; color:var(--ink-dim); margin-top:.3rem; }

        .tp-home section.examples{ padding:1rem 0 4.5rem; position:relative; z-index:2; }
        .tp-home .filter-tabs{ display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1.6rem; }
        .tp-home .filter-tab{ padding:.55rem 1.1rem; border-radius:999px; font-size:.84rem; font-weight:600; border:1px solid var(--rule); color:var(--ink-dim); cursor:pointer; background:transparent; transition:all .2s; }
        .tp-home .filter-tab.active{ background:var(--cyan); color:var(--btn-ink); border-color:var(--cyan); }
        .tp-home .filter-tab:hover:not(.active){ border-color:var(--cyan-dim); color:var(--ink); }
        .tp-home .subject-grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(210px,1fr)); gap:1rem; }
        .tp-home .subject-card{ background:var(--card-dark); border:1px solid var(--rule); border-radius:1rem; padding:1.1rem; transition:all .25s; display:flex; flex-direction:column; gap:.7rem; }
        .tp-home .subject-card:hover{ transform:translateY(-4px); border-color:var(--cyan-dim); background:var(--card-dark-2); }
        .tp-home .subject-card .ic{ width:2.6rem; height:2.6rem; border-radius:.7rem; display:flex; align-items:center; justify-content:center; font-size:1.3rem; background:color-mix(in srgb, var(--cyan) 12%, transparent); transition:transform .35s cubic-bezier(.34,1.56,.64,1); }
        .tp-home .subject-card:hover .ic{ transform:scale(1.12) rotate(6deg); }
        .tp-home .subject-card h4{ font-size:.92rem; margin:0; }
        .tp-home .subject-card .meta{ display:flex; align-items:center; justify-content:space-between; font-size:.74rem; color:var(--ink-dim); }
        .tp-home .subject-card .meta span:last-child{ display:inline-block; transition:transform .25s; }
        .tp-home .subject-card:hover .meta span:last-child{ transform:translateX(4px); }

        .tp-home section.pricing{ padding:1rem 0 4.5rem; position:relative; z-index:2; }
        .tp-home .pricing-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:1.3rem; max-width:1000px; margin:0 auto; }
        .tp-home .price-card{ background:var(--card-dark); border:1px solid var(--rule); border-radius:1.3rem; padding:1.9rem; transition:transform .25s, border-color .25s, box-shadow .25s; position:relative; }
        .tp-home .price-card:hover{ transform:translateY(-5px); }
        .tp-home .price-card.popular{ position:relative; z-index:0; border-color:var(--cyan); background:linear-gradient(160deg, color-mix(in srgb, var(--cyan) 10%, transparent), var(--card-dark)); }
        .tp-home .price-card.popular::before{ content:""; position:absolute; inset:-1.5px; z-index:-1; border-radius:inherit; background:conic-gradient(from var(--ang,0deg), var(--cyan), var(--sand), var(--cyan)); animation:tp-spin-border 4s linear infinite; }
        @keyframes tp-spin-border{ to{ --ang:360deg; } }
        .tp-home .popular-tag{ position:absolute; top:-.8rem; left:50%; transform:translateX(-50%); background:var(--cyan); color:var(--btn-ink); font-size:.7rem; font-weight:700; padding:.3rem .8rem; border-radius:999px; }
        .tp-home .price-card h3{ font-size:1.05rem; margin:0 0 .3rem; }
        .tp-home .price-card .desc{ font-size:.8rem; color:var(--ink-dim); margin-bottom:1.2rem; }
        .tp-home .price-card .amount{ font-size:2.1rem; font-weight:800; margin-bottom:1.2rem; }
        .tp-home .price-card .amount span{ font-size:.85rem; color:var(--ink-dim); font-weight:500; }
        .tp-home .price-card ul{ list-style:none; margin:0 0 1.4rem; padding:0; display:flex; flex-direction:column; gap:.55rem; font-size:.85rem; }
        .tp-home .price-card ul li::before{ content:"✓ "; color:var(--cyan-dim); }
        .tp-home .price-card .btn{ width:100%; justify-content:center; }
        .tp-home .pricing-note{ text-align:center; color:var(--ink-dim); font-size:.85rem; margin-top:1.8rem; }

        .tp-home section.request{ padding:1rem 0 4.5rem; position:relative; z-index:2; }
        .tp-home .request-card{ max-width:820px; margin:0 auto; background:var(--card-dark); border:1px solid var(--rule); border-radius:1.4rem; padding:2.2rem 2.4rem; text-align:center; }
        .tp-home .request-card h2{ font-size:1.5rem; margin:0 0 .5rem; }
        .tp-home .request-card p{ color:var(--ink-dim); margin:0 0 1.4rem; }
        .tp-home form.request-form{ display:flex; gap:.7rem; flex-wrap:wrap; justify-content:center; }
        .tp-home form.request-form input{ padding:.75rem 1rem; border:1.5px solid var(--rule); border-radius:.8rem; background:var(--paper); color:var(--ink); font-family:"Inter",sans-serif; font-size:.9rem; }
        .tp-home form.request-form input:focus{ outline:none; border-color:var(--cyan-dim); }
        .tp-home form.request-form input[type=text]{ flex:1; min-width:240px; }
        .tp-home form.request-form input[type=email]{ width:220px; }
        .tp-home .request-note{ font-size:.8rem; color:var(--ink-dim); margin-top:.9rem; }

        .tp-home section.faq{ padding:1rem 0 5rem; position:relative; z-index:2; }
        .tp-home .faq-list{ max-width:740px; margin:0 auto; display:flex; flex-direction:column; gap:.8rem; }
        .tp-home .faq-item{ background:var(--card-dark); border:1px solid var(--rule); border-radius:1rem; padding:1.3rem 1.5rem; }
        .tp-home .faq-item h4{ font-size:.98rem; margin:0 0 .4rem; }
        .tp-home .faq-item p{ color:var(--ink-dim); font-size:.88rem; margin:0; }

        @media (max-width:900px){
          .tp-home .hero-grid, .tp-home .feat-section-grid, .tp-home .process-grid, .tp-home .compare-grid, .tp-home .pricing-grid, .tp-home .schools-card{ grid-template-columns:1fr; }
          .tp-home #parallaxHero, .tp-home .cal-stack, .tp-home .funnel-stack{ height:auto; }
          .tp-home .stack-card{ position:static; margin-bottom:1rem; width:100% !important; }
          .tp-home .note-card{ display:none; }
          .tp-home .cal-card, .tp-home .cal-lesson{ position:static; width:100%; margin-bottom:1rem; }
          .tp-home .funnel-card{ position:static; margin-bottom:1rem; transform:none !important; opacity:1 !important; }
        }
      `}</style>

      <header>
        <div className="wrap row">
          <div className="brand">
            <span className="mark">✓</span> TeacherPlan
          </div>
          <nav className="top">
            <div className="links">
              <a className="navlink" href="#features">Можливості</a>
              <a className="navlink" href="#examples">Предмети</a>
              <a className="navlink" href="#pricing">Ціни</a>
              <a className="navlink" href="#schools">Для шкіл</a>
            </div>
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              title="Перемкнути тему"
              aria-label="Перемкнути світлу/темну тему"
            >
              {theme === "light" ? "☀️" : "🌙"}
            </button>
            <AuthHeaderButtons />
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <PlanksBackground />
          <div className="scrim" />
          <div className="wrap hero-grid">
            <div>
              <span className="kicker">✨ AI-платформа для планування уроків</span>
              <h1>
                Ідеальний
                <br />
                календарний <span className="cy">план</span>
                <br />
                за хвилини
              </h1>
              <p className="lede">
                TeacherPlan допомагає створювати детальні плани уроків, річні календарі й більше — за допомогою AI.
                Менше часу на папери, більше на викладання.
              </p>
              <div className="cta-row">
                <Link className="btn btn-solid" href="/register">
                  Спробувати безкоштовно →
                </Link>
                <a className="btn btn-ghost" href="#examples">
                  ▷ Приклади планів
                </a>
              </div>
              <div className="stats-row">
                <div className="stat">
                  <b><AnimatedStat target={10} suffix="K+" /></b>
                  <span>Вчителів</span>
                </div>
                <div className="stat">
                  <b><AnimatedStat target={SUBJECTS.length} suffix="" /></b>
                  <span>Предметів</span>
                </div>
                <div className="stat">
                  <b><AnimatedStat target={4.9} suffix="★" decimals={1} /></b>
                  <span>Оцінка</span>
                </div>
              </div>
            </div>
            <div id="parallaxHero" className="hero-visual" ref={heroRef}>
              <div className="stack-card side-card">
                <div className="brand">✓ TeacherPlan</div>
                <div className="side-nav">
                  <a className="active"><span className="dot" /> Кабінет</a>
                  <a><span className="dot" /> Плани</a>
                  <a><span className="dot" /> Календар</a>
                  <a><span className="dot" /> Шаблони</a>
                  <a><span className="dot" /> Налаштування</a>
                </div>
              </div>
              <div className="stack-card main-card spotlight" onMouseMove={spotlight}>
                <div className="app-top">
                  <div className="app-title">Річний план</div>
                </div>
                <div className="select-row">
                  <select className="fake"><option>10 клас</option></select>
                  <select className="fake"><option>Хімія</option></select>
                </div>
                <ul className="lesson-list">
                  <li><span className="n">1</span> Мова як суспільне явище</li>
                  <li><span className="n">2</span> Спілкування і мовлення</li>
                  <li><span className="n">3</span> Текст. Типи мовлення</li>
                  <li><span className="n">4</span> Стилі мовлення</li>
                </ul>
              </div>
              <div className="stack-card note-card">
                <div className="script">Менше планування.<br />Більше викладання.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="compare">
          <Reveal>
            <div className="wrap compare-grid">
              <div className="compare-card">
                <div className="compare-num">4-6 год</div>
                <div className="compare-label">вручну</div>
                <p>Пошук тем, підрахунок годин, форматування таблиць у Word.</p>
              </div>
              <div className="compare-card win">
                <div className="compare-num">10 сек</div>
                <div className="compare-label">з TeacherPlan AI</div>
                <p>Обрали предмет і клас — готовий план з датами й темами по програмі МОН.</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="features" id="features">
          <div className="wrap feat-section-grid">
            <Reveal>
              <div>
                <span className="kicker2">Усе, що потрібно</span>
                <h2 className="section-title">Плануйте розумніше,<br />викладайте краще</h2>
                <p className="section-lede">
                  Від річних календарів до поурочних планів — TeacherPlan дає всі інструменти для створення
                  структурованих планів за секунди.
                </p>
                <div className="feat-2x2">
                  <div className="feat-item"><div className="ico">⚡</div><div><h4>AI-плани уроків</h4><p>Детальні плани за секунди</p></div></div>
                  <div className="feat-item"><div className="ico">📅</div><div><h4>Річний календар</h4><p>Плануйте весь рік легко</p></div></div>
                  <div className="feat-item"><div className="ico">📄</div><div><h4>Власні шаблони</h4><p>Під ваш предмет і клас</p></div></div>
                  <div className="feat-item"><div className="ico">✓</div><div><h4>Відповідність МОН</h4><p>Вимоги програми враховано</p></div></div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="cal-stack">
                <div className="cal-card">
                  <div className="cal-title">Вересень 2026</div>
                  <div className="cal-grid">
                    <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div>
                    <div className="d">1</div><div className="d">2</div><div className="d">3</div><div className="d">4</div><div className="d">5</div>
                    <div className="d">8</div><div className="d">9</div><div className="d active">10</div><div className="d">11</div><div className="d">12</div>
                    <div className="d">15</div><div className="d">16</div><div className="d">17</div><div className="d">18</div><div className="d">19</div>
                  </div>
                </div>
                <div className="cal-lesson spotlight" onMouseMove={spotlight}>
                  <span className="tag">10 клас · Хімія</span>
                  <ul>
                    <li>Актуалізація знань</li>
                    <li>Основна частина</li>
                    <li>Закріплення</li>
                    <li>Домашнє завдання</li>
                  </ul>
                  <button className="btn btn-solid">Згенерувати з AI</button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="process">
          <div className="wrap process-grid">
            <Reveal>
              <div>
                <span className="kicker2">Простий процес</span>
                <h2 className="section-title">Отримайте план за 3 кроки</h2>
                <p className="section-lede">Без складних налаштувань. Кілька кліків — і план готовий.</p>
                <div className="steps">
                  <div className="step">
                    <div className="num">1</div>
                    <div><h4>Скажіть, що потрібно</h4><p>Оберіть клас, предмет і програму — або опишіть словами.</p></div>
                  </div>
                  <div className="step">
                    <div className="num">2</div>
                    <div><h4>AI виконує роботу</h4><p>Отримайте детальний, структурований план за секунди.</p></div>
                  </div>
                  <div className="step">
                    <div className="num">3</div>
                    <div><h4>Редагуйте й використовуйте</h4><p>Зробіть план своїм і починайте викладати.</p></div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="funnel-stack">
                <div className="funnel-card">
                  <div className="prompt">Створи календарний план для 10 класу з хімії на I семестр<div className="prompt-btn">↑</div></div>
                </div>
                <div className="funnel-card">
                  <div className="gen-row">✨ Генеруємо ваш план...</div>
                  <div className="progress-bar"><span /></div>
                </div>
                <div className="funnel-card spotlight" onMouseMove={spotlight}>
                  <h4>Календарний план готовий</h4>
                  <div className="bars"><div /><div /></div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="schools" id="schools">
          <Reveal>
            <div className="wrap">
              <div className="schools-card spotlight" onMouseMove={spotlight}>
                <div>
                  <h2>Для шкіл і методоб'єднань</h2>
                  <p>
                    Весь педколектив генерує плани за хвилини — а платить за це заклад, рахунком на бухгалтерію, а не
                    вчитель зі своєї картки.
                  </p>
                  <ul className="schools-list">
                    <li>Окремий акаунт кожному вчителю</li>
                    <li>Оплата рахунком-фактурою на заклад</li>
                    <li>Пакети від 10 до необмеженої кількості вчителів</li>
                  </ul>
                  <Link className="btn btn-solid" href="/dlya-shkil">Дізнатися умови →</Link>
                </div>
                <div className="schools-side">
                  <div className="big">від 4 500 ₴</div>
                  <div className="small">10 вчителів / навч. рік</div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="examples" id="examples">
          <div className="wrap">
            <Reveal>
              <>
                <span className="kicker2">Реальні приклади</span>
                <h2 className="section-title">Плани для кожного предмету</h2>
                <p className="section-lede">Перегляньте, які предмети й класи вже підтримуються.</p>
              </>
            </Reveal>
            <div className="filter-tabs">
              {FILTER_CATS.map((cat) => (
                <button
                  key={cat}
                  className={`filter-tab${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="subject-grid">
              {filteredSubjects.map((s, i) => (
                <Reveal key={s.slug} delay={Math.min(i, 9) * 45}>
                  <Link href={`/plans/${s.slug}`} className="subject-card spotlight" onMouseMove={spotlight}>
                    <div className="ic">{s.icon}</div>
                    <h4>{s.name}</h4>
                    <div className="meta">
                      <span>{s.range}</span>
                      <span>→</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing" id="pricing">
          <div className="wrap">
            <Reveal>
              <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 2.4rem" }}>
                <span className="kicker2">Ціни</span>
                <h2 className="section-title">Просто й прозоро</h2>
                <p className="section-lede" style={{ margin: "0 auto" }}>
                  Платите лише за згенеровані плани. Жодних прихованих платежів.
                </p>
              </div>
            </Reveal>
            <div className="pricing-grid">
              {CREDIT_PACKAGES.map((pkg, i) => (
                <Reveal key={pkg.id} delay={i * 70}>
                  <div className={`price-card${pkg.popular ? " popular" : ""} spotlight`} onMouseMove={spotlight}>
                    {pkg.popular && <span className="popular-tag">Популярний</span>}
                    <h3>{pkg.name}</h3>
                    <div className="desc">
                      {pkg.credits === 1 ? "Спробувати на одному класі" : pkg.credits <= 3 ? "Для кількох класів одразу" : "На весь навчальний рік"}
                    </div>
                    <div className="amount">
                      {pkg.price} ₴<span> / {pkg.credits === 1 ? "план" : "пакет"}</span>
                    </div>
                    <ul>
                      <li>{pkg.credits} {pkg.credits === 1 ? "календарний план" : "календарних планів"}</li>
                      {pkg.savings && <li>{pkg.savings}</li>}
                      <li>Формат .docx</li>
                      <li>Відповідність МОН</li>
                    </ul>
                    <Link className={`btn ${pkg.popular ? "btn-solid" : "btn-ghost"}`} href="/register">
                      Обрати
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="pricing-note">🎁 1 безкоштовний кредит одразу при реєстрації · Приєднались 10 000+ вчителів</p>
          </div>
        </section>

        <section className="request">
          <Reveal>
            <div className="wrap">
              <div className="request-card spotlight" onMouseMove={spotlight}>
                <h2>Не знайшли свій предмет чи курс?</h2>
                <p>Напишіть, який предмет, клас або авторську програму очікуєте — розглянемо й додамо.</p>
                {reqStatus === "sent" ? (
                  <p style={{ color: "var(--cyan)", fontWeight: 600 }}>✓ Дякуємо, розглянемо!</p>
                ) : (
                  <form className="request-form" onSubmit={handleRequestSubmit}>
                    <input
                      type="text"
                      placeholder="Який предмет/клас/програму очікуєте?"
                      required
                      maxLength={500}
                      value={reqText}
                      onChange={(e) => setReqText(e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Email (щоб повідомити)"
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                    />
                    <button className="btn btn-solid" type="submit" disabled={reqStatus === "sending"}>
                      {reqStatus === "sending" ? "Надсилання..." : "Надіслати"}
                    </button>
                  </form>
                )}
                {reqStatus === "error" && (
                  <p style={{ color: "#ef4444", marginTop: "0.75rem" }}>Не вдалося надіслати. Спробуйте ще раз.</p>
                )}
                <p className="request-note">Без реєстрації — просто короткий рядок і, за бажання, пошта для відповіді.</p>
              </div>
            </div>
          </Reveal>
        </section>
        <section className="faq">
          <Reveal>
            <div className="wrap">
              <h2 className="section-title" style={{ textAlign: "center", marginBottom: "2rem" }}>
                Часті запитання
              </h2>
              <div className="faq-list">
                {FAQ.map((item) => (
                  <div className="faq-item" key={item.q}>
                    <h4>{item.q}</h4>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
