export default function Dashboard() {
  const cards = [
    { title: "Leads nuevos", value: "--", description: "Pendientes de contactar" },
    { title: "Proyectos", value: "--", description: "En portfolio" },
    { title: "Articulos publicados", value: "--", description: "En el blog" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
