import { useState } from "react";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/productos", label: "Productos" },
  { to: "/admin/testimonios", label: "Testimonios" },
  { to: "/admin/zonas", label: "Zonas" },
  { to: "/admin/contenido", label: "Contenido" },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-navy-800">
        <h2 className="text-lg font-bold tracking-wide">ARA FINESTRA</h2>
        <p className="text-xs text-navy-100 mt-1">Admin</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-navy-800 text-white font-medium"
                  : "text-navy-100 hover:bg-navy-800/50 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-navy-800 text-xs text-navy-100">
        {user.username}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? "block" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-navy-900 text-white flex flex-col z-50 transform transition-transform duration-200 ease-in-out">
          {sidebarContent}
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-navy-900 text-white flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Abrir menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-sm font-semibold text-navy-800">ARA FINESTRA Admin</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Cerrar sesion
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 bg-gray-50 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
