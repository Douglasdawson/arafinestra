import { Link } from "react-router-dom";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

export default function ServiceCard({ icon, title, description, link }: ServiceCardProps) {
  return (
    <Link
      to={link}
      className="group block bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-sky-100 text-sky-600 mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      <span className="inline-block mt-4 text-sm font-medium text-sky-600 group-hover:text-sky-700 transition-colors">
        &rarr;
      </span>
    </Link>
  );
}
