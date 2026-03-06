import { useEffect, useState } from "react";

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  portfolioCount: number;
  blogCount: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    portfolioCount: 0,
    blogCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [leadsRes, portfolioRes, blogRes] = await Promise.all([
          fetch("/api/leads", { credentials: "include" }),
          fetch("/api/portfolio"),
          fetch("/api/blog"),
        ]);

        const leads = leadsRes.ok ? await leadsRes.json() : [];
        const portfolio = portfolioRes.ok ? await portfolioRes.json() : [];
        const blog = blogRes.ok ? await blogRes.json() : [];

        const leadsArr = Array.isArray(leads) ? leads : [];
        const newLeads = leadsArr.filter(
          (l: { estado?: string }) => l.estado === "nuevo"
        ).length;

        setStats({
          totalLeads: leadsArr.length,
          newLeads,
          portfolioCount: Array.isArray(portfolio) ? portfolio.length : 0,
          blogCount: Array.isArray(blog) ? blog.length : 0,
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
