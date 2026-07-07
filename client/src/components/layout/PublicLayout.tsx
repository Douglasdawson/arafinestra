import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../ui/WhatsAppButton";
import StickyMobileBar from "../ui/StickyMobileBar";
import CookieBanner from "../ui/CookieBanner";
import ExitPopup from "../ui/ExitPopup";
import ScrollToTop from "../ui/ScrollToTop";
import ScrollProgressBar from "../ui/ScrollProgressBar";
import PageTransition from "../ui/PageTransition";
import SocialProofToast from "../ui/SocialProofToast";
import StickyCTA from "../ui/StickyCTA";

export default function PublicLayout() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[100svh] flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-lg focus:text-sm">
        {t("common.skip_to_content", { defaultValue: "Saltar al contenido" })}
      </a>
      <ScrollToTop />
      <ScrollProgressBar />
      <Header />
      <main id="main-content" className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyMobileBar />
      <StickyCTA />
      <SocialProofToast />
      <ExitPopup />
      <CookieBanner />
    </div>
  );
}
