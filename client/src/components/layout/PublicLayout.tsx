import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../ui/WhatsAppButton";
import ExitPopup from "../ui/ExitPopup";
import ScrollToTop from "../ui/ScrollToTop";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ExitPopup />
    </div>
  );
}
