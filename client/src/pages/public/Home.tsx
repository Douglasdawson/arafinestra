import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useInView,
} from "framer-motion";
import PageHead from "../../components/seo/PageHead";
import ScrollReveal from "../../components/ui/ScrollReveal";
import Counter from "../../components/ui/Counter";
import MagneticButton from "../../components/ui/MagneticButton";

/* ─── Types ─── */
interface TestimonialItem {
  id: number;
  nombre: string;
  localidad: string | null;
  estrellas: number;
  texto_ca: string | null;
  texto_es: string | null;
  texto_en: string | null;
}

/* ─── Helpers ─── */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

/* ═══════════════════════════════════════════════════════════════
   EFFECT 1 — Window Mask Reveal (Hero)
   ═══════════════════════════════════════════════════════════════ */
function WindowMaskHero({
  prefix,
  t,
}: {
  prefix: string;
  t: (k: string) => string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Mask insets shrink from large (small opening) to 0 (full viewport)
  const insetY = useTransform(scrollYProgress, [0, 0.7], [42, 0]);
  const insetX = useTransform(scrollYProgress, [0, 0.7], [38, 0]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round 8px)`;

  // Crossbar opacity — fades out as window opens
  const crossbarOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0]);
  // Scale text inside the window
  const textScale = useTransform(scrollYProgress, [0, 0.6], [0.6, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  // Scroll hint fades out
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  if (isMobile) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-amber-100 to-orange-100 overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            ARA FINESTRA
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-slate-600 font-light max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {t("home.mask_subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-block mt-10 px-10 py-4 bg-slate-900 text-white text-lg font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              {t("cta.calculate")}
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Layer 1: Bright content BEHIND the mask */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100">
          {/* Sunlight rays */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.5) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Layer 2: Dark overlay with window-shaped clip-path cutout */}
        <motion.div
          className="absolute inset-0 bg-slate-950 z-10"
          style={{ clipPath }}
        >
          {/* This is the INVERSE — the dark area. We clip it so the bright shows through. */}
        </motion.div>

        {/* Actually, clip-path on the dark overlay should EXCLUDE the center.
            We need the opposite: mask the bright content with a window shape.
            Let's use the bright layer with the clip-path instead. */}

        {/* Layer 2 (corrected): Full dark background */}
        <div className="absolute inset-0 bg-slate-950 z-[5]" />

        {/* Layer 3: Bright content revealed through window mask */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{ clipPath }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.5) 0%, transparent 70%)",
              }}
            />
          </div>
        </motion.div>

        {/* Window crossbars — on top of everything */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
          style={{ opacity: crossbarOpacity }}
        >
          {/* Vertical crossbar */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2 bg-slate-300/60" />
          {/* Horizontal crossbar */}
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-slate-300/60" />
        </motion.div>

        {/* Text content — centered, on top */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4"
          style={{ scale: textScale, opacity: textOpacity }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-slate-900 tracking-tight leading-none text-center">
            ARA FINESTRA
          </h1>
          <p className="mt-6 sm:mt-8 text-xl sm:text-2xl text-slate-600 font-light max-w-2xl mx-auto text-center">
            {t("home.mask_subtitle")}
          </p>
          <Link
            to={`/${prefix}/pressupost`}
            className="inline-block mt-10 sm:mt-12 px-10 py-4 bg-slate-900 text-white text-lg font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            {t("cta.calculate")}
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-sm text-slate-400 tracking-widest uppercase">
            {t("home.scroll_hint")}
          </span>
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-slate-400"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EFFECT 2 — Pinned Multi-Stage Storytelling
   ═══════════════════════════════════════════════════════════════ */
function PinnedStorytelling({ t }: { t: (k: string) => string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Background color temperature
  const bgR = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [15, 30, 120, 217, 254]);
  const bgG = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [23, 41, 53, 119, 243]);
  const bgB = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [42, 59, 15, 6, 199]);
  const bgColor = useMotionTemplate`rgb(${bgR}, ${bgG}, ${bgB})`;

  // Stage opacities
  const s1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.2, 0.25], [0, 1, 1, 0]);
  const s2Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.5], [0, 1, 1, 0]);
  const s3Opacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.72], [0, 1, 1, 0]);
  const s4Opacity = useTransform(scrollYProgress, [0.68, 0.78, 0.95, 1], [0, 1, 1, 1]);

  // Frost effect opacity (cold stages)
  const frostOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.15, 0.15, 0]);

  if (isMobile) {
    return (
      <div className="bg-slate-950">
        {/* Stage 1 */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                {t("home.stage1_title")}
              </h2>
              <p className="mt-4 text-lg text-slate-400">{t("home.stage1_sub")}</p>
            </div>
          </ScrollReveal>
        </section>
        {/* Stage 2 */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-900">
          <div className="text-center space-y-8">
            <ScrollReveal>
              <p className="text-6xl sm:text-7xl font-bold text-red-400">
                <Counter target={847} suffix=" EUR" />
              </p>
              <p className="mt-2 text-xl text-slate-400">{t("home.stage2_cost")}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-5xl sm:text-6xl font-bold text-red-400">
                <Counter target={32} suffix=" dB" />
              </p>
              <p className="mt-2 text-xl text-slate-400">{t("home.stage2_noise")}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <p className="text-5xl sm:text-6xl font-bold text-red-400">
                <Counter target={85} suffix="%" />
              </p>
              <p className="mt-2 text-xl text-slate-400">{t("home.stage2_humidity")}</p>
            </ScrollReveal>
          </div>
        </section>
        {/* Stage 3 */}
        <section className="min-h-[50vh] flex items-center justify-center px-4 py-20 bg-amber-900">
          <ScrollReveal>
            <p className="text-2xl sm:text-3xl text-amber-100 font-light text-center italic">
              {t("home.stage3_transition")}
            </p>
          </ScrollReveal>
        </section>
        {/* Stage 4 */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-amber-50">
          <div className="text-center space-y-6">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {t("home.stage4_title")}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col gap-4 mt-8">
                <BenefitPill icon="sun" label={t("home.stage4_warm")} />
                <BenefitPill icon="silence" label={t("home.stage4_quiet")} />
                <BenefitPill icon="save" label={t("home.stage4_save")} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div ref={outerRef} className="relative h-[400vh]">
      <motion.div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Frost overlay (cold stages) */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: frostOpacity,
            background:
              "repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 80px 80px",
          }}
        />

        {/* Stage 1: Old window */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-4"
          style={{ opacity: s1Opacity }}
        >
          <div className="text-center max-w-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
              {t("home.stage1_title")}
            </h2>
            <p className="mt-6 text-xl sm:text-2xl text-slate-400 font-light">
              {t("home.stage1_sub")}
            </p>
          </div>
        </motion.div>

        {/* Stage 2: Numbers */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-4"
          style={{ opacity: s2Opacity }}
        >
          <div className="text-center max-w-4xl space-y-10">
            <div>
              <p className="text-6xl sm:text-7xl md:text-8xl font-bold text-red-400">
                <Counter target={847} suffix=" EUR" />
              </p>
              <p className="mt-2 text-xl sm:text-2xl text-slate-300">{t("home.stage2_cost")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 justify-center">
              <div>
                <p className="text-4xl sm:text-5xl font-bold text-red-400">
                  <Counter target={32} suffix=" dB" />
                </p>
                <p className="mt-2 text-lg text-slate-400">{t("home.stage2_noise")}</p>
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-bold text-red-400">
                  <Counter target={85} suffix="%" />
                </p>
                <p className="mt-2 text-lg text-slate-400">{t("home.stage2_humidity")}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stage 3: Transition */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-4"
          style={{ opacity: s3Opacity }}
        >
          <p className="text-3xl sm:text-4xl md:text-5xl text-amber-100 font-light text-center italic max-w-2xl">
            {t("home.stage3_transition")}
          </p>
        </motion.div>

        {/* Stage 4: New world */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-4"
          style={{ opacity: s4Opacity }}
        >
          <div className="text-center max-w-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              {t("home.stage4_title")}
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
              <BenefitPill icon="sun" label={t("home.stage4_warm")} />
              <BenefitPill icon="silence" label={t("home.stage4_quiet")} />
              <BenefitPill icon="save" label={t("home.stage4_save")} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function BenefitPill({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, JSX.Element> = {
    sun: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
    silence: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    ),
    save: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-100 text-amber-600">
        {icons[icon]}
      </div>
      <span className="text-lg font-semibold text-slate-800">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EFFECT 3 — Parallax Window Frame
   ═══════════════════════════════════════════════════════════════ */
function ParallaxWindow({ t }: { t: (k: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const cloudX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  if (isMobile) {
    return (
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 overflow-hidden">
        <div className="text-center px-4 z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {t("home.parallax_title")}
            </h2>
            <p className="mt-4 text-lg text-slate-600 font-light">
              {t("home.parallax_sub")}
            </p>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Parallax background — landscape */}
      <motion.div
        className="absolute inset-[-20%] z-0"
        style={{ y: bgY }}
      >
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100" />
        {/* Sun */}
        <div
          className="absolute w-40 h-40 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.8) 0%, rgba(251,191,36,0) 70%)",
            top: "15%",
            right: "20%",
          }}
        />
        {/* Cloud 1 */}
        <motion.div
          className="absolute top-[20%] left-[10%]"
          style={{ x: cloudX }}
        >
          <div className="w-48 h-16 bg-white/60 rounded-full blur-sm" />
          <div className="w-32 h-12 bg-white/50 rounded-full blur-sm -mt-8 ml-8" />
        </motion.div>
        {/* Cloud 2 */}
        <motion.div
          className="absolute top-[30%] right-[15%]"
          style={{ x: cloudX }}
        >
          <div className="w-56 h-16 bg-white/50 rounded-full blur-sm" />
        </motion.div>
        {/* Hills */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%]">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, #4ade80 0%, #22c55e 40%, transparent 100%)",
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
              transform: "scaleX(2)",
            }}
          />
        </div>
      </motion.div>

      {/* Window frame overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Outer dark frame — fills the edges */}
          <defs>
            <mask id="windowMask">
              <rect width="100" height="100" fill="white" />
              {/* Cut out the window panes */}
              <rect x="12" y="8" width="35" height="40" rx="0.5" fill="black" />
              <rect x="53" y="8" width="35" height="40" rx="0.5" fill="black" />
              <rect x="12" y="52" width="35" height="40" rx="0.5" fill="black" />
              <rect x="53" y="52" width="35" height="40" rx="0.5" fill="black" />
            </mask>
          </defs>
          <rect
            width="100"
            height="100"
            fill="#1e293b"
            mask="url(#windowMask)"
          />
        </svg>
      </div>

      {/* Text overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pointer-events-none">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight text-center drop-shadow-lg">
          {t("home.parallax_title")}
        </h2>
        <p className="mt-4 text-xl sm:text-2xl text-white/90 font-light text-center drop-shadow-md">
          {t("home.parallax_sub")}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC SERVICE CARD
   ═══════════════════════════════════════════════════════════════ */
function MagneticServiceCard({
  icon,
  title,
  desc,
  link,
  delay,
}: {
  icon: JSX.Element;
  title: string;
  desc: string;
  link: string;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 8;
    const y = ((e.clientY - top) / height - 0.5) * 8;
    setTilt({ x: -y, y: x });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <Link to={link} className="block">
        <motion.div
          className="group bg-white rounded-2xl p-8 sm:p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
          onMouseMove={handleMouse}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{ perspective: 800, transformStyle: "preserve-3d" }}
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-sky-50 text-sky-600 mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 leading-relaxed">{desc}</p>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";
  const currentLang = lang || i18n.language || "ca";

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch("/api/testimonials?published=true")
      .then((r) => (r.ok ? r.json() : []))
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  const getTestimonialText = (item: TestimonialItem) => {
    if (currentLang === "es") return item.texto_es || item.texto_ca || "";
    if (currentLang === "en") return item.texto_en || item.texto_ca || "";
    return item.texto_ca || "";
  };

  const firstTestimonial = testimonials.length > 0 ? testimonials[0] : null;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ARA FINESTRA",
    description: t("hero.description"),
    url: "https://arafinestra.com",
    telephone: "+34XXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Girona",
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.9794,
      longitude: 2.8214,
    },
    areaServed: ["Girona", "Maresme", "Blanes", "Lloret de Mar", "Figueres"],
    priceRange: "$$",
  };

  return (
    <>
      <PageHead
        title={t("hero.title")}
        description={t("hero.description")}
        path=""
        schema={localBusinessSchema}
      />

      {/* ─── EFFECT 1: Window Mask Reveal Hero ─── */}
      <WindowMaskHero prefix={prefix} t={t} />

      {/* ─── EFFECT 2: Pinned Multi-Stage Storytelling ─── */}
      <PinnedStorytelling t={t} />

      {/* ─── EFFECT 3: Parallax Window Frame ─── */}
      <ParallaxWindow t={t} />

      {/* ─── SERVICES GRID ─── */}
      <section className="py-24 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-center mb-16">
              {t("services.title")}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <MagneticServiceCard
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm9 0v18M3 12h18" />
                </svg>
              }
              title={t("nav.windows")}
              desc={t("services.windows_desc")}
              link={`/${prefix}/serveis/finestres-pvc`}
              delay={0}
            />
            <MagneticServiceCard
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 12h.01" />
                </svg>
              }
              title={t("nav.sliding_doors")}
              desc={t("services.doors_desc")}
              link={`/${prefix}/serveis/portes-corredisses`}
              delay={0.1}
            />
            <MagneticServiceCard
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm0 4h16m0 4H4m0 4h16" />
                </svg>
              }
              title={t("nav.shutters")}
              desc={t("services.shutters_desc")}
              link={`/${prefix}/serveis/persianes`}
              delay={0.2}
            />
            <MagneticServiceCard
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm4 0v16m4-16v16m4-16v16M4 8h16M4 12h16M4 16h16" />
                </svg>
              }
              title={t("nav.mosquito_nets")}
              desc={t("services.mosquito_desc")}
              link={`/${prefix}/serveis/mosquiteres`}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-r from-sky-600 via-blue-600 to-blue-700 overflow-hidden">
        {/* Subtle animated background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
            animation: "float 20s ease-in-out infinite",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center">
            <ScrollReveal delay={0}>
              <p className="text-6xl sm:text-7xl font-bold text-white">
                <Counter target={15} suffix="+" />
              </p>
              <p className="mt-3 text-lg text-sky-100 font-medium">
                {t("stats.experience")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-6xl sm:text-7xl font-bold text-white">
                <Counter target={500} suffix="+" />
              </p>
              <p className="mt-3 text-lg text-sky-100 font-medium">
                {t("stats.projects")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <p className="text-6xl sm:text-7xl font-bold text-white">
                <Counter target={60} suffix="km" />
              </p>
              <p className="mt-3 text-lg text-sky-100 font-medium">
                {t("stats.coverage")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL SPOTLIGHT ─── */}
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-20">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          {/* Giant quote marks */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[12rem] sm:text-[16rem] leading-none text-slate-100 font-serif pointer-events-none select-none">
            &ldquo;
          </div>

          <ScrollReveal>
            <div className="relative z-10">
              {firstTestimonial ? (
                <>
                  <motion.p
                    className="text-xl sm:text-2xl md:text-3xl italic text-slate-700 leading-relaxed font-light"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    {getTestimonialText(firstTestimonial)}
                  </motion.p>
                  <div className="mt-8 flex items-center justify-center gap-1">
                    {Array.from({ length: firstTestimonial.estrellas }).map(
                      (_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ),
                    )}
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    {firstTestimonial.nombre}
                  </p>
                  {firstTestimonial.localidad && (
                    <p className="text-sm text-slate-500">
                      {firstTestimonial.localidad}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xl sm:text-2xl md:text-3xl italic text-slate-700 leading-relaxed font-light">
                  {t("testimonials.title")}
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── SUBSIDIES CTA ─── */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t("home.subsidies_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-5xl sm:text-6xl md:text-7xl font-bold text-white/90">
              {t("home.subsidies_headline")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <p className="mt-6 text-xl sm:text-2xl text-white/80 font-light">
              {t("home.subsidies_sub")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.6}>
            <Link
              to={`/${prefix}/subvencions`}
              className="inline-block mt-10 px-10 py-4 bg-white text-orange-600 text-lg font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              {t("home.subsidies_cta")}
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-32 sm:py-40 bg-slate-950 overflow-hidden flex items-center justify-center">
        <div className="text-center px-4">
          <ScrollReveal>
            <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-tight">
              {t("home.final_title")}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mt-12">
              <Link to={`/${prefix}/pressupost`}>
                <MagneticButton className="relative px-14 py-6 bg-white text-slate-900 text-xl font-semibold rounded-lg shadow-lg shadow-white/10 pulse-glow-btn">
                  <span className="relative z-10">{t("cta.calculate")}</span>
                </MagneticButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
