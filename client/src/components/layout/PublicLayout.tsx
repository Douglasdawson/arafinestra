import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../ui/WhatsAppButton";
import ExitPopup from "../ui/ExitPopup";
import CustomCursor from "../ui/CustomCursor";
import ScrollToTop from "../ui/ScrollToTop";
import PageTransition from "../ui/PageTransition";

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col cursor-none lg:cursor-none">
      <CustomCursor />
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
      <ExitPopup />
    </div>
  );
}
