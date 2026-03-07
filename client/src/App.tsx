import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const Home = lazy(() => import("./pages/public/Home"));
const ServicePage = lazy(() => import("./pages/public/ServicePage"));
const Cortizo = lazy(() => import("./pages/public/Cortizo"));
const Subvenciones = lazy(() => import("./pages/public/Subvenciones"));
const Calculator = lazy(() => import("./pages/public/Calculator"));
const Projects = lazy(() => import("./pages/public/Projects"));
const PublicBlogList = lazy(() => import("./pages/public/BlogList"));
const BlogPost = lazy(() => import("./pages/public/BlogPost"));
const PublicTestimonials = lazy(() => import("./pages/public/Testimonials"));
const Contact = lazy(() => import("./pages/public/Contact"));
const ZonesList = lazy(() => import("./pages/public/ZonesList"));
const Zone = lazy(() => import("./pages/public/Zone"));
const Process = lazy(() => import("./pages/public/Process"));
const Legal = lazy(() => import("./pages/public/Legal"));
const NotFound = lazy(() => import("./pages/public/NotFound"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Leads = lazy(() => import("./pages/admin/Leads"));
const Products = lazy(() => import("./pages/admin/Products"));
const Portfolio = lazy(() => import("./pages/admin/Portfolio"));
const BlogList = lazy(() => import("./pages/admin/BlogList"));
const BlogEditor = lazy(() => import("./pages/admin/BlogEditor"));
const Testimonials = lazy(() => import("./pages/admin/Testimonials"));
const Zones = lazy(() => import("./pages/admin/Zones"));
const SiteConfig = lazy(() => import("./pages/admin/SiteConfig"));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:lang" element={<Home />} />
          <Route path="/:lang/serveis/:serviceSlug" element={<ServicePage />} />
          <Route path="/:lang/cortizo" element={<Cortizo />} />
          <Route path="/:lang/subvencions" element={<Subvenciones />} />
          <Route path="/:lang/projectes" element={<Projects />} />
          <Route path="/:lang/pressupost" element={<Calculator />} />
          <Route path="/:lang/blog" element={<PublicBlogList />} />
          <Route path="/:lang/blog/:slug" element={<BlogPost />} />
          <Route path="/:lang/opinions" element={<PublicTestimonials />} />
          <Route path="/:lang/contacte" element={<Contact />} />
          <Route path="/:lang/zones" element={<ZonesList />} />
          <Route path="/:lang/zones/:slug" element={<Zone />} />
          <Route path="/:lang/proces" element={<Process />} />
          <Route path="/:lang/legal/:type" element={<Legal />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="productos" element={<Products />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogEditor />} />
          <Route path="blog/:id" element={<BlogEditor />} />
          <Route path="testimonios" element={<Testimonials />} />
          <Route path="zonas" element={<Zones />} />
          <Route path="contenido" element={<SiteConfig />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
