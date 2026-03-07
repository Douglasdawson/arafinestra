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
import { Helmet } from "react-helmet-async";
import PageHead from "../../components/seo/PageHead";
import ScrollReveal from "../../components/ui/ScrollReveal";
import Counter from "../../components/ui/Counter";

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
   EFFECT 1 — Window Opens Hero (3D shutters that open on scroll)
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

  // Left shutter rotates open to the left (0 → -85deg)
  const leftRotate = useTransform(scrollYProgress, [0, 0.35], [0, -85]);
  // Right shutter rotates open to the right (0 → 85deg)
  const rightRotate = useTransform(scrollYProgress, [0, 0.35], [0, 85]);
  // Frame fades out once shutters are open
  const frameOpacity = useTransform(scrollYProgress, [0.3, 0.45], [1, 0]);
  // Content behind fades in
  const contentOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const contentScale = useTransform(scrollYProgress, [0.05, 0.3], [0.92, 1]);
  // Scroll hint fades out
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  if (isMobile) {
    return (
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-navy-950 overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(232,101,43,0.5) 0%, transparent 70%)",
              animation: "heroGlow 4s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute bottom-[20%] left-[20%] w-[200px] h-[200px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(232,101,43,0.4) 0%, transparent 70%)",
              animation: "heroGlow 4s ease-in-out 1s infinite alternate",
            }}
          />
          <div
            className="absolute top-[40%] right-[10%] w-[150px] h-[150px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)",
              animation: "heroGlow 5s ease-in-out 2s infinite alternate",
            }}
          />
        </div>

        {/* Geometric window silhouette — scaled down on short screens */}
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 opacity-[0.07]"
          style={{ animation: "heroWindowFloat 8s ease-in-out infinite" }}
        >
          <svg className="w-[200px] h-[240px] sm:w-[280px] sm:h-[340px]" viewBox="0 0 280 340" fill="none">
            <rect x="10" y="10" width="260" height="320" rx="4" stroke="white" strokeWidth="3" />
            <line x1="140" y1="10" x2="140" y2="330" stroke="white" strokeWidth="2" />
            <line x1="10" y1="170" x2="270" y2="170" stroke="white" strokeWidth="2" />
            <rect x="20" y="20" width="110" height="140" rx="2" stroke="white" strokeWidth="1" opacity="0.5" />
            <rect x="150" y="20" width="110" height="140" rx="2" stroke="white" strokeWidth="1" opacity="0.5" />
            <rect x="20" y="180" width="110" height="140" rx="2" stroke="white" strokeWidth="1" opacity="0.5" />
            <rect x="150" y="180" width="110" height="140" rx="2" stroke="white" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
          {/* Brand mark */}
          <div
            className="animate-fadeIn mb-3"
            style={{ animationDuration: "0.6s" }}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.35em] uppercase text-brand/80 border border-brand/20 rounded-full px-4 py-1.5 backdrop-blur-sm">
              Partner Cortizo
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-[2.75rem] sm:text-6xl font-bold tracking-tight leading-[0.95] animate-fadeIn"
            style={{ animationDuration: "0.6s", animationDelay: "0.15s", animationFillMode: "backwards" }}
          >
            <span className="text-white">ARA</span>
            <br />
            <span
              className="text-gradient"
              style={{ backgroundImage: "linear-gradient(135deg, #e8652b 0%, #fbbf24 100%)" }}
            >
              FINESTRA
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-5 text-base sm:text-lg text-slate-400 font-light leading-relaxed animate-fadeIn"
            style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
          >
            {t("home.mask_subtitle")}
          </p>

          {/* Trust indicators */}
          <div
            className="mt-8 flex items-center justify-center gap-5 animate-fadeIn"
            style={{ animationDelay: "0.45s", animationFillMode: "backwards" }}
          >
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-white">4.9</span>
            </div>
            <div className="w-px h-5 bg-slate-700" />
            <div className="text-sm text-slate-400">
              <span className="font-semibold text-white">500+</span> {t("stats.projects").toLowerCase()}
            </div>
          </div>

          {/* CTA Button */}
          <div
            className="mt-8 sm:mt-10 animate-fadeIn"
            style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}
          >
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-block px-10 py-4 bg-brand text-white text-lg font-semibold rounded-xl shadow-lg shadow-brand/30 active:scale-[0.97] transition-transform duration-150 pulse-glow-btn"
            >
              {t("cta.calculate")}
            </Link>
            <p className="mt-3 text-xs text-slate-500">{t("cta.free_no_commitment")}</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fadeIn" style={{ animationDelay: "1s", animationFillMode: "backwards" }}>
          <span className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">{t("home.scroll_hint")}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-600 animate-bounce" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: "1200px" }}>
        {/* Background — bright landscape behind the window */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 z-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.5) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Content behind the window */}
        <motion.div
          className="absolute inset-0 z-[5] flex flex-col items-center justify-center px-4"
          style={{ opacity: contentOpacity, scale: contentScale }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-navy-900 tracking-tight leading-none text-center">
            ARA FINESTRA
          </h1>
          <p className="mt-6 sm:mt-8 text-xl sm:text-2xl text-slate-600 font-light max-w-2xl mx-auto text-center">
            {t("home.mask_subtitle")}
          </p>
          <Link
            to={`/${prefix}/pressupost`}
            className="inline-block mt-10 sm:mt-12 px-10 py-4 bg-navy-900 text-white text-lg font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            {t("cta.calculate")}
          </Link>
        </motion.div>

        {/* Window frame + shutters */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ opacity: frameOpacity }}
        >
          {/* Dark surround (wall) */}
          <div className="absolute inset-0 bg-navy-900" />

          {/* Window opening — the hole in the wall */}
          <div className="relative w-[60vw] h-[70vh] max-w-[800px] max-h-[600px]">
            {/* Window frame border */}
            <div className="absolute inset-0 border-[6px] border-slate-600 rounded-sm z-30 pointer-events-none" />

            {/* Horizontal crossbar */}
            <div className="absolute left-0 right-0 top-1/2 h-[5px] -translate-y-1/2 bg-slate-600 z-30 pointer-events-none" />

            {/* LEFT shutter */}
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-full z-20"
              style={{
                rotateY: leftRotate,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front face (what you see when closed) */}
              <div
                className="absolute inset-0 bg-navy-800 border-r-[2px] border-slate-600"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Shutter panels */}
                <div className="absolute inset-[8%] flex flex-col gap-[4%]">
                  <div className="flex-1 bg-navy-700/80 rounded-sm" />
                  <div className="flex-1 bg-navy-700/80 rounded-sm" />
                </div>
                {/* Handle */}
                <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[6px] h-[30px] bg-slate-500 rounded-full" />
              </div>
              {/* Back face (inside of shutter visible when opening) */}
              <div
                className="absolute inset-0 bg-navy-700"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              />
            </motion.div>

            {/* RIGHT shutter */}
            <motion.div
              className="absolute top-0 right-0 w-1/2 h-full z-20"
              style={{
                rotateY: rightRotate,
                transformOrigin: "right center",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0 bg-navy-800 border-l-[2px] border-slate-600"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="absolute inset-[8%] flex flex-col gap-[4%]">
                  <div className="flex-1 bg-navy-700/80 rounded-sm" />
                  <div className="flex-1 bg-navy-700/80 rounded-sm" />
                </div>
                {/* Handle */}
                <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[6px] h-[30px] bg-slate-500 rounded-full" />
              </div>
              {/* Back face */}
              <div
                className="absolute inset-0 bg-navy-700"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              />
            </motion.div>

            {/* Glass behind shutters (subtle reflection) */}
            <div className="absolute inset-0 z-10 bg-brand-light/10 backdrop-blur-[1px]">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-sm text-white/60 tracking-widest uppercase">
            {t("home.scroll_hint")}
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-white/60 animate-bounce"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EFFECT 2 — Pinned Multi-Stage Storytelling (optimized)
   ═══════════════════════════════════════════════════════════════ */
function PinnedStorytelling({ t }: { t: (k: string) => string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["rgb(15,23,42)", "rgb(30,41,59)", "rgb(120,53,15)", "rgb(217,119,6)", "rgb(254,243,199)"]
  );

  const s1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.2, 0.25], [0, 1, 1, 0]);
  const s2Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.5], [0, 1, 1, 0]);
  const s3Opacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.72], [0, 1, 1, 0]);
  const s4Opacity = useTransform(scrollYProgress, [0.68, 0.78, 0.95, 1], [0, 1, 1, 1]);

  if (isMobile) {
    return (
      <div>
        {/* Stage 1 — The Problem */}
        <section className="relative min-h-[75vh] flex items-center justify-center px-6 py-20 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] right-[10%] w-[180px] h-[180px] rounded-full bg-red-500/10 blur-3xl" />
          </div>
          <ScrollReveal>
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">{t("home.stage1_badge")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {t("home.stage1_title")}
              </h2>
              <p className="mt-5 text-base text-slate-400 leading-relaxed">{t("home.stage1_sub")}</p>
            </div>
          </ScrollReveal>
        </section>

        {/* Stage 2 — The Cost (pain points with numbers) */}
        <section className="relative min-h-[75vh] flex items-center justify-center px-6 py-20 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-[15%] left-[15%] w-[200px] h-[200px] rounded-full bg-red-500/8 blur-3xl" />
          </div>
          <div className="relative text-center space-y-8 sm:space-y-10 w-full max-w-sm mx-auto">
            <ScrollReveal>
              <p className="text-4xl sm:text-6xl font-bold text-red-400">
                <Counter target={847} suffix=" EUR" />
              </p>
              <p className="mt-3 text-sm sm:text-base text-slate-400">{t("home.stage2_cost")}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-navy-800/60 border border-navy-700/50">
                  <p className="text-2xl sm:text-3xl font-bold text-red-400">
                    <Counter target={32} suffix=" dB" />
                  </p>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-400">{t("home.stage2_noise")}</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-navy-800/60 border border-navy-700/50">
                  <p className="text-2xl sm:text-3xl font-bold text-red-400">
                    <Counter target={85} suffix="%" />
                  </p>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-400">{t("home.stage2_humidity")}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Stage 3 — Transition */}
        <section className="relative py-20 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, #0f2a4a 0%, #78350f 50%, #d97706 100%)" }}>
          <ScrollReveal>
            <div className="relative text-center">
              <div className="w-12 h-px bg-amber-400/40 mx-auto mb-6" />
              <p className="text-2xl sm:text-3xl text-amber-100 font-light italic leading-relaxed">
                {t("home.stage3_transition")}
              </p>
              <div className="w-12 h-px bg-amber-400/40 mx-auto mt-6" />
            </div>
          </ScrollReveal>
        </section>

        {/* Stage 4 — The Solution */}
        <section className="relative min-h-[70vh] flex items-center justify-center px-6 py-20 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[250px] h-[250px] rounded-full bg-amber-200/40 blur-3xl" />
          </div>
          <div className="relative text-center space-y-8 w-full max-w-sm mx-auto">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{t("home.stage4_badge")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight">
                {t("home.stage4_title")}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="flex flex-col gap-3">
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
    <div ref={outerRef} className="relative h-[300vh]">
      <motion.div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Stage 1 */}
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

        {/* Stage 2 */}
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

        {/* Stage 3 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-4"
          style={{ opacity: s3Opacity }}
        >
          <p className="text-3xl sm:text-4xl md:text-5xl text-amber-100 font-light text-center italic max-w-2xl">
            {t("home.stage3_transition")}
          </p>
        </motion.div>

        {/* Stage 4 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-4"
          style={{ opacity: s4Opacity }}
        >
          <div className="text-center max-w-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy-900 tracking-tight">
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
      <span className="text-lg font-semibold text-navy-800">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EFFECT 4 — Acoustic Demo (optimized: 10 bars, CSS animations)
   ═══════════════════════════════════════════════════════════════ */
const BARS = Array.from({ length: 10 }, () => 30 + Math.random() * 70);

function AcousticDemo({ t }: { t: (k: string) => string }) {
  const [isPVC, setIsPVC] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative py-20 sm:py-28 bg-navy-950 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[20%] right-0 w-[200px] h-[200px] rounded-full bg-brand/5 blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-5">
              <svg className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51" />
              </svg>
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">{t("home.acoustic_badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t("home.acoustic_title")}
            </h2>
            <p className="mt-4 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto">
              {t("home.acoustic_sub")}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative flex items-center justify-center gap-0">
          {/* Outside */}
          <div className="flex-1 flex flex-col items-center min-w-0">
            <p className="text-[10px] sm:text-sm uppercase tracking-widest text-slate-500 mb-4 sm:mb-6">
              {t("home.acoustic_outside")}
            </p>
            <div className="flex items-end gap-[3px] sm:gap-1 h-24 sm:h-48">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="w-[4px] sm:w-[10px] rounded-full bg-gradient-to-t from-red-500 to-orange-400"
                  style={{
                    height: isInView ? `${h}%` : 0,
                    transition: `height 0.5s ease ${i * 0.04}s`,
                    animation: isInView ? `barPulse 1.8s ease-in-out ${i * 0.08}s infinite alternate` : "none",
                  }}
                />
              ))}
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-2xl sm:text-5xl font-bold text-red-400">75 dB</p>
              <p className="text-[10px] sm:text-sm text-slate-500 mt-1">
                {t("home.acoustic_street")}
              </p>
            </div>
          </div>

          {/* Window divider */}
          <div className="relative w-10 sm:w-24 flex flex-col items-center mx-1 sm:mx-4 shrink-0">
            <div className="w-full h-32 sm:h-56 relative">
              <div className="absolute inset-0 border-[3px] sm:border-4 border-slate-600 rounded-sm bg-navy-800/30">
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-slate-600" />
                <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-slate-600" />
              </div>
              <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span
                  className={`text-[10px] sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full transition-colors duration-300 ${
                    isPVC
                      ? "bg-brand/20 text-brand"
                      : "bg-navy-700 text-slate-500"
                  }`}
                >
                  {isPVC ? "PVC Cortizo" : t("home.acoustic_old")}
                </span>
              </div>
            </div>
          </div>

          {/* Inside */}
          <div className="flex-1 flex flex-col items-center min-w-0">
            <p className="text-[10px] sm:text-sm uppercase tracking-widest text-slate-500 mb-4 sm:mb-6">
              {t("home.acoustic_inside")}
            </p>
            <div className="flex items-end gap-[3px] sm:gap-1 h-24 sm:h-48">
              {BARS.map((h, i) => {
                const reduction = isPVC ? 0.12 : 0.55;
                return (
                  <div
                    key={i}
                    className={`w-[4px] sm:w-[10px] rounded-full bg-gradient-to-t transition-all duration-500 ${
                      isPVC
                        ? "from-emerald-500 to-emerald-300"
                        : "from-amber-500 to-yellow-400"
                    }`}
                    style={{
                      height: isInView ? `${h * reduction}%` : 0,
                      transition: `height 0.5s ease ${i * 0.04}s`,
                      animation: isInView ? `barPulse 1.8s ease-in-out ${i * 0.08}s infinite alternate` : "none",
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <p
                className={`text-2xl sm:text-5xl font-bold transition-colors duration-300 ${
                  isPVC ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {isPVC ? "33 dB" : "55 dB"}
              </p>
              <p className="text-[10px] sm:text-sm text-slate-500 mt-1">
                {isPVC
                  ? t("home.acoustic_whisper")
                  : t("home.acoustic_conversation")}
              </p>
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => setIsPVC(!isPVC)}
            className={`relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isPVC
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-navy-800 text-slate-300 hover:bg-navy-700"
            }`}
          >
            {isPVC
              ? t("home.acoustic_toggle_old")
              : t("home.acoustic_toggle_pvc")}
          </button>
        </div>

        {isPVC && (
          <div className="flex justify-center mt-6">
            <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-400 font-semibold text-base sm:text-lg">
                -42 dB — {t("home.acoustic_reduction")}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EFFECT 5 — Thermal Split (simplified, no infinite animations)
   ═══════════════════════════════════════════════════════════════ */
function ThermalSplit({ t }: { t: (k: string) => string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, width } = containerRef.current.getBoundingClientRect();
      setSplitPos(Math.max(10, Math.min(90, ((e.clientX - left) / width) * 100)));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const { left, width } = containerRef.current.getBoundingClientRect();
      setSplitPos(
        Math.max(10, Math.min(90, ((e.touches[0].clientX - left) / width) * 100))
      );
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging]);

  return (
    <section className="relative py-20 sm:py-28 bg-navy-900 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707" />
              </svg>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{t("home.thermal_badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t("home.thermal_title")}
            </h2>
            <p className="mt-4 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto">
              {t("home.thermal_sub")}
            </p>
          </div>
        </ScrollReveal>

        <div
          ref={containerRef}
          className="relative w-full aspect-[4/3] sm:aspect-[2/1] rounded-2xl overflow-hidden cursor-ew-resize select-none touch-none"
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* COLD side */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
            <div className="absolute top-[20%] left-[15%] w-32 h-32 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-48 h-36 sm:h-56 border-2 border-cyan-400/30 rounded-sm">
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-cyan-400/20" />
              <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-cyan-400/20" />
            </div>
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
              <p className="text-xs sm:text-sm uppercase tracking-widest text-cyan-400/60">
                {t("home.thermal_before")}
              </p>
              <p className="text-2xl sm:text-4xl font-bold text-cyan-300 mt-1">5°C</p>
              <p className="text-xs sm:text-sm text-cyan-400/50 mt-1">
                {t("home.thermal_cold_desc")}
              </p>
            </div>
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
              <p className="text-sm sm:text-xl font-bold text-cyan-300">
                {t("home.thermal_heat_loss")}
              </p>
              <p className="text-xs sm:text-sm text-cyan-400/60">Uf = 5.7 W/m²K</p>
            </div>
          </div>

          {/* WARM side */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${splitPos}%)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-red-900">
              <div className="absolute top-[30%] right-[15%] w-40 h-40 rounded-full bg-amber-500/25 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-48 h-36 sm:h-56 border-2 border-amber-400/40 rounded-sm">
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-amber-400/25" />
                <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-amber-400/25" />
                <div className="absolute inset-2 bg-amber-500/10 rounded-sm" />
              </div>
              <div className="absolute top-4 right-4 sm:top-8 sm:right-8 text-right">
                <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-400/60">
                  {t("home.thermal_after")}
                </p>
                <p className="text-2xl sm:text-4xl font-bold text-amber-300 mt-1">21°C</p>
                <p className="text-xs sm:text-sm text-amber-400/50 mt-1">
                  {t("home.thermal_warm_desc")}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 text-right">
                <p className="text-sm sm:text-xl font-bold text-amber-300">
                  {t("home.thermal_no_loss")}
                </p>
                <p className="text-xs sm:text-sm text-amber-400/60">Uf = 1.0 W/m²K</p>
              </div>
            </div>
          </div>

          {/* Divider handle */}
          <div
            className="absolute top-0 bottom-0 z-20"
            style={{ left: `${splitPos}%`, transform: "translateX(-50%)" }}
          >
            <div className="w-[2px] h-full bg-white/80" />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg shadow-black/30 flex items-center justify-center">
              <svg width="20" height="20" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="2">
                <path d="M7 4l-4 6 4 6M13 4l4 6-4 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-12">
          <ScrollReveal>
            <div className="text-center p-3 sm:p-6 rounded-2xl bg-navy-800/50 border border-navy-700/50">
              <p className="text-xl sm:text-4xl font-bold text-brand">70%</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-slate-400 leading-tight">{t("home.thermal_stat_heat")}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="text-center p-3 sm:p-6 rounded-2xl bg-navy-800/50 border border-navy-700/50">
              <p className="text-xl sm:text-4xl font-bold text-emerald-400">40%</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-slate-400 leading-tight">{t("home.thermal_stat_bill")}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="text-center p-3 sm:p-6 rounded-2xl bg-navy-800/50 border border-navy-700/50">
              <p className="text-xl sm:text-4xl font-bold text-amber-400">1.0</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-slate-400 leading-tight">{t("home.thermal_stat_uf")}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EFFECT 6 — Energy Savings (simplified, no weather API call)
   ═══════════════════════════════════════════════════════════════ */
const OLD_WINDOW_UF: Record<string, number> = {
  alumini: 5.7,
  fusta: 3.5,
  pvc_antic: 2.8,
};
const PVC_CORTIZO_UF = 1.0;
const KWH_PRICE = 0.18;
const HEATING_HOURS = 1800;

function calcAnnualLoss(uf: number, m2: number): number {
  return uf * m2 * 12 * HEATING_HOURS * 0.001;
}

function EnergySavings({
  t,
  prefix,
}: {
  t: (k: string) => string;
  prefix: string;
}) {
  const [windowArea, setWindowArea] = useState(8);
  const [oldType, setOldType] = useState("alumini");

  const oldUf = OLD_WINDOW_UF[oldType];
  const oldKwh = calcAnnualLoss(oldUf, windowArea);
  const newKwh = calcAnnualLoss(PVC_CORTIZO_UF, windowArea);
  const savingsKwh = oldKwh - newKwh;
  const savingsEur = Math.round(savingsKwh * KWH_PRICE);
  const savingsPercent = Math.round((savingsKwh / oldKwh) * 100);

  const windowTypes = [
    { id: "alumini", label: t("home.energy_aluminium") },
    { id: "fusta", label: t("home.energy_wood") },
    { id: "pvc_antic", label: t("home.energy_old_pvc") },
  ];

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707" />
              </svg>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{t("home.energy_badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">
              {t("home.energy_title")}
            </h2>
            <p className="mt-4 text-base sm:text-xl text-slate-500 max-w-2xl mx-auto">
              {t("home.energy_sub")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Controls */}
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                {t("home.energy_current_type")}
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {windowTypes.map((wt) => (
                  <button
                    key={wt.id}
                    onClick={() => setOldType(wt.id)}
                    className={`px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      oldType === wt.id
                        ? "bg-navy-900 text-white shadow-md"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {wt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  {t("home.energy_window_area")}
                </label>
                <span className="text-2xl font-bold text-navy-900">
                  {windowArea} m²
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={40}
                value={windowArea}
                onChange={(e) => setWindowArea(parseInt(e.target.value))}
                className="w-full accent-navy-900 h-2"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{t("home.energy_small")}</span>
                <span>{t("home.energy_large")}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-xs text-red-400 uppercase tracking-wider font-semibold">
                  {t("home.energy_current")}
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">Uf {oldUf}</p>
                <p className="text-xs text-red-400 mt-1">W/m²K</p>
              </div>
              <div className="flex-1 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-500 uppercase tracking-wider font-semibold">
                  PVC Cortizo
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">Uf {PVC_CORTIZO_UF}</p>
                <p className="text-xs text-emerald-500 mt-1">W/m²K</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-sm text-emerald-100 uppercase tracking-wider font-semibold">
                {t("home.energy_annual_savings")}
              </p>
              <p className="text-4xl sm:text-6xl font-bold mt-2 tracking-tight">
                {savingsEur.toLocaleString("es")}€
              </p>
              <p className="text-emerald-200 mt-2">
                {savingsKwh.toFixed(0)} kWh/{t("home.energy_year")}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-full bg-emerald-400/30 rounded-full h-3">
                  <div
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${savingsPercent}%` }}
                  />
                </div>
                <span className="text-lg font-bold whitespace-nowrap">
                  -{savingsPercent}%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <p className="text-sm font-semibold text-slate-700">
                {t("home.energy_annual_cost")}
              </p>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">{t("home.energy_current")}</span>
                  <span className="font-bold text-red-600">
                    {Math.round(oldKwh * KWH_PRICE).toLocaleString("es")}€
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4">
                  <div className="bg-red-400 rounded-full h-4" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">PVC Cortizo</span>
                  <span className="font-bold text-emerald-600">
                    {Math.round(newKwh * KWH_PRICE).toLocaleString("es")}€
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4">
                  <div
                    className="bg-emerald-400 rounded-full h-4 transition-all duration-500"
                    style={{ width: `${(newKwh / oldKwh) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              to={`/${prefix}/pressupost`}
              className="block w-full text-center px-8 py-4 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 transition-colors shadow-lg btn-press"
            >
              {t("cta.calculate")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SERVICE CARD (simplified, no tilt/perspective)
   ═══════════════════════════════════════════════════════════════ */
function ServiceCard({
  icon,
  title,
  desc,
  link,
}: {
  icon: JSX.Element;
  title: string;
  desc: string;
  link: string;
}) {
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-100 shadow-sm hover:shadow-lg hover:border-brand/30 transition-all duration-300 active:scale-[0.98]">
        <div className="flex items-start gap-4 sm:block">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-brand-light text-brand sm:mb-6 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-navy-900">{title}</h3>
              <svg className="w-4 h-4 text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ARA FINESTRA",
    description: t("hero.description"),
    url: "https://arafinestra.com",
    telephone: "+34611500372",
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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ARA FINESTRA",
    "url": "https://arafinestra.com",
    "logo": "https://arafinestra.com/logo.png",
    "description": "Instal\u00b7laci\u00f3 de finestres PVC a Catalunya. Finestres, portes corredisses, persianes i mosquiteres Cortizo.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Blanes",
      "addressRegion": "Girona",
      "addressCountry": "ES"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 41.6742,
        "longitude": 2.7903
      },
      "geoRadius": "60000"
    },
    "sameAs": [
      "https://instagram.com/arafinestra",
      "https://facebook.com/arafinestra"
    ]
  };

  return (
    <>
      <PageHead
        title={t("hero.title")}
        description={t("hero.description")}
        path=""
        schema={localBusinessSchema}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      </Helmet>

      <WindowMaskHero prefix={prefix} t={t} />
      <PinnedStorytelling t={t} />
      <AcousticDemo t={t} />
      {/* Wave: navy-950 → navy-900 */}
      <div className="relative h-12 sm:h-16 bg-navy-900 -mt-px">
        <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 64" fill="none">
          <path d="M0,0 C480,64 960,64 1440,0 L1440,0 L0,0 Z" fill="var(--color-navy-950)" />
        </svg>
      </div>
      <ThermalSplit t={t} />
      {/* Wave: navy-900 → slate-50 */}
      <div className="relative h-12 sm:h-16 bg-gradient-to-b from-slate-50 to-slate-50 -mt-px">
        <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 64" fill="none">
          <path d="M0,0 C480,64 960,64 1440,0 L1440,0 L0,0 Z" fill="var(--color-navy-900)" />
        </svg>
      </div>
      <EnergySavings t={t} prefix={prefix} />

      {/* Services Grid */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-900 tracking-tight">
                {t("services.title")}
              </h2>
              <div className="w-12 h-1 bg-brand rounded-full mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <ScrollReveal>
              <ServiceCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm9 0v18M3 12h18" />
                  </svg>
                }
                title={t("nav.windows")}
                desc={t("services.windows_desc")}
                link={`/${prefix}/serveis/finestres-pvc`}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <ServiceCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 12h.01" />
                  </svg>
                }
                title={t("nav.sliding_doors")}
                desc={t("services.doors_desc")}
                link={`/${prefix}/serveis/portes-corredisses`}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <ServiceCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm0 4h16m0 4H4m0 4h16" />
                  </svg>
                }
                title={t("nav.shutters")}
                desc={t("services.shutters_desc")}
                link={`/${prefix}/serveis/persianes`}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <ServiceCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm4 0v16m4-16v16m4-16v16M4 8h16M4 12h16M4 16h16" />
                  </svg>
                }
                title={t("nav.mosquito_nets")}
                desc={t("services.mosquito_desc")}
                link={`/${prefix}/serveis/mosquiteres`}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 sm:py-28 bg-gradient-to-br from-brand via-brand-dark to-navy-800 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-8 text-center">
            <ScrollReveal>
              <p className="text-3xl sm:text-7xl font-bold text-white">
                <Counter target={15} suffix="+" />
              </p>
              <p className="mt-1.5 sm:mt-3 text-[10px] sm:text-lg text-white/70 font-medium leading-tight">
                {t("stats.experience")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="border-x border-white/15 sm:border-0">
                <p className="text-3xl sm:text-7xl font-bold text-white">
                  <Counter target={500} suffix="+" />
                </p>
                <p className="mt-1.5 sm:mt-3 text-[10px] sm:text-lg text-white/70 font-medium leading-tight">
                  {t("stats.projects")}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p className="text-3xl sm:text-7xl font-bold text-white">
                <Counter target={60} suffix="km" />
              </p>
              <p className="mt-1.5 sm:mt-3 text-[10px] sm:text-lg text-white/70 font-medium leading-tight">
                {t("stats.coverage")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Subsidies CTA */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[150px] h-[150px] rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-[10%] right-[5%] w-[200px] h-[200px] rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm mb-6">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-semibold text-white uppercase tracking-wider">{t("home.subsidies_badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t("home.subsidies_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-4 sm:mt-5 text-3xl sm:text-6xl md:text-7xl font-bold text-white/95">
              {t("home.subsidies_headline")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="mt-5 text-lg sm:text-2xl text-white/80 font-light leading-relaxed">
              {t("home.subsidies_sub")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <Link
              to={`/${prefix}/subvencions`}
              className="inline-block mt-10 px-10 py-4 bg-white text-orange-600 text-lg font-semibold rounded-xl active:scale-[0.97] transition-transform duration-150 shadow-lg shadow-black/10"
            >
              {t("home.subsidies_cta")}
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 sm:py-36 bg-navy-950 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(232,101,43,0.4) 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative text-center px-6">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              {t("home.final_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-10 sm:mt-12 flex flex-col items-center gap-4">
              <Link
                to={`/${prefix}/pressupost`}
                className="inline-block px-10 py-4 sm:px-14 sm:py-6 bg-brand text-white text-base sm:text-xl font-semibold rounded-xl shadow-lg shadow-brand/30 pulse-glow-btn active:scale-[0.97] transition-transform duration-150"
              >
                {t("cta.calculate")}
              </Link>
              <p className="text-sm text-slate-500">{t("cta.free_no_commitment")}</p>
              <div className="mt-4 flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-slate-500 ml-1">4.9 — 500+ {t("stats.projects").toLowerCase()}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
