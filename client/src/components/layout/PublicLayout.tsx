import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../ui/WhatsAppButton";
import CookieBanner from "../ui/CookieBanner";
import ExitPopup from "../ui/ExitPopup";
import ScrollToTop from "../ui/ScrollToTop";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-lg focus:text-sm">
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ExitPopup />
      <CookieBanner />
    </div>
  );
}
