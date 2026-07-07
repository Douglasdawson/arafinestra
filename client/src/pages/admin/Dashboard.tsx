import { useEffect, useState } from "react";

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  portfolioCount: number;
  blogCount: number;
}

interface LeadStatsData {
  byEstado: { estado: string; count: number }[];
  byOrigen: { origen: string; count: number }[];
}

interface Lead {
  estado?: string;
  createdAt?: string;
}

const estadoColors: Record<string, string> = {
  nuevo: "bg-yellow-100 text-yellow-800",
  contactado: "bg-blue-100 text-blue-800",
  presupuestado: "bg-orange-100 text-orange-800",
  ganado: "bg-green-100 text-green-800",
  perdido: "bg-red-100 text-red-800",
};

const origenColors: Record<string, string> = {
  formulario: "bg-indigo-100 text-indigo-800",
  calculadora: "bg-purple-100 text-purple-800",
  whatsapp: "bg-emerald-100 text-emerald-800",
  telefono: "bg-sky-100 text-sky-800",
  referido: "bg-pink-100 text-pink-800",
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    portfolioCount: 0,
    blogCount: 0,
  });
  const [leadStats, setLeadStats] = useState<LeadStatsData>({
    byEstado: [],
    byOrigen: [],
  });
  const [timeStats, setTimeStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [leadsRes, portfolioRes, blogRes, leadStatsRes] =
          await Promise.all([
            // limit=100 para que los cálculos por fecha tengan datos suficientes
            fetch("/api/leads?limit=100", { credentials: "include" }),
            fetch("/api/portfolio", { credentials: "include" }),
            fetch("/api/blog", { credentials: "include" }),
            fetch("/api/leads/stats", { credentials: "include" }),
          ]);

        // /api/leads y /api/blog devuelven { data, total, ... } paginado
        const leadsPayload = leadsRes.ok ? await leadsRes.json() : { data: [], total: 0 };
        const portfolio = portfolioRes.ok ? await portfolioRes.json() : [];
        const blogPayload = blogRes.ok ? await blogRes.json() : { data: [], total: 0 };
        const leadStatsData: LeadStatsData = leadStatsRes.ok
          ? await leadStatsRes.json()
          : { byEstado: [], byOrigen: [] };

        const leadsArr: Lead[] = Array.isArray(leadsPayload.data) ? leadsPayload.data : [];
        const totalLeads = leadsPayload.total ?? leadsArr.length;
        const newLeads = leadsArr.filter(
          (l) => l.estado === "nuevo"
        ).length;

        setStats({
          totalLeads,
          newLeads,
          portfolioCount: Array.isArray(portfolio) ? portfolio.length : 0,
          blogCount: blogPayload.total ?? (Array.isArray(blogPayload.data) ? blogPayload.data.length : 0),
        });

        setLeadStats(leadStatsData);

        // Calculate time-based stats
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const leadsToday = leadsArr.filter(
          (l) => l.createdAt && l.createdAt.slice(0, 10) === todayStr
        ).length;
        const leadsThisWeek = leadsArr.filter(
          (l) => l.createdAt && new Date(l.createdAt) >= weekAgo
        ).length;
        const leadsThisMonth = leadsArr.filter(
          (l) => l.createdAt && new Date(l.createdAt) >= monthAgo
        ).length;
        const ganados = leadsArr.filter((l) => l.estado === "ganado").length;
        const conversionRate =
          leadsArr.length > 0 ? (ganados / leadsArr.length) * 100 : 0;

        setTimeStats({
          today: leadsToday,
          thisWeek: leadsThisWeek,
          thisMonth: leadsThisMonth,
          conversionRate,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total leads",
      value: loading ? "..." : String(stats.totalLeads),
      description: "Contactos recibidos",
    },
    {
      title: "Leads nuevos",
      value: loading ? "..." : String(stats.newLeads),
      description: "Pendientes de contactar",
    },
    {
      title: "Proyectos",
      value: loading ? "..." : String(stats.portfolioCount),
      description: "En portfolio",
    },
    {
      title: "Articulos publicados",
      value: loading ? "..." : String(stats.blogCount),
      description: "En el blog",
    },
  ];

  const timeCards = [
    {
      title: "Leads hoy",
      value: loading ? "..." : String(timeStats.today),
      description: "Recibidos hoy",
    },
    {
      title: "Leads esta semana",
      value: loading ? "..." : String(timeStats.thisWeek),
      description: "Últimos 7 días",
    },
    {
      title: "Leads este mes",
      value: loading ? "..." : String(timeStats.thisMonth),
      description: "Últimos 30 días",
    },
    {
      title: "Tasa de conversión",
      value: loading ? "..." : `${timeStats.conversionRate.toFixed(1)}%`,
      description: "Leads ganados / total",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className="text-3xl font-bold text-navy-900 mt-2">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {timeCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className="text-3xl font-bold text-navy-900 mt-2">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">
            Leads por estado
          </h2>
          <div className="flex flex-wrap gap-3">
            {loading ? (
              <p className="text-gray-400">Cargando...</p>
            ) : leadStats.byEstado.length === 0 ? (
              <p className="text-gray-400">Sin datos</p>
            ) : (
              leadStats.byEstado.map((item) => (
                <span
                  key={item.estado}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                    estadoColors[item.estado] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.estado}
                  <span className="font-bold">{item.count}</span>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">
            Leads por origen
          </h2>
          <div className="flex flex-wrap gap-3">
            {loading ? (
              <p className="text-gray-400">Cargando...</p>
            ) : leadStats.byOrigen.length === 0 ? (
              <p className="text-gray-400">Sin datos</p>
            ) : (
              leadStats.byOrigen.map((item) => (
                <span
                  key={item.origen}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                    origenColors[item.origen] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.origen}
                  <span className="font-bold">{item.count}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
