import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";

const Home = lazy(() => import("./pages/public/Home"));
const ServicePage = lazy(() => import("./pages/public/ServicePage"));
const Cortizo = lazy(() => import("./pages/public/Cortizo"));
const Subvenciones = lazy(() => import("./pages/public/Subvenciones"));

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

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center bg-slate-50 py-32">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="mt-4 text-slate-500">Properament / Proximamente / Coming soon</p>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Cargando...</div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:lang" element={<Home />} />
          <Route path="/:lang/serveis/:serviceSlug" element={<ServicePage />} />
          <Route path="/:lang/cortizo" element={<Cortizo />} />
          <Route path="/:lang/subvencions" element={<Subvenciones />} />
          <Route path="/:lang/projectes" element={<Placeholder title="Projectes" />} />
          <Route path="/:lang/pressupost" element={<Placeholder title="Pressupost" />} />
          <Route path="/:lang/blog" element={<Placeholder title="Blog" />} />
          <Route path="/:lang/opinions" element={<Placeholder title="Opinions" />} />
          <Route path="/:lang/contacte" element={<Placeholder title="Contacte" />} />
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
      </Routes>
    </Suspense>
  );
}
