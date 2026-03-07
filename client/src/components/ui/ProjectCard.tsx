import { useState } from "react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  photo: string | null;
  title: string;
  location: string | null;
  link: string;
}

export default function ProjectCard({ photo, title, location, link }: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={link}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[4/3] bg-slate-200 overflow-hidden">
        {photo && !imgError ? (
          <img
            src={photo}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-navy-800 group-hover:text-brand transition-colors">
          {title}
        </h3>
        {location && (
          <p className="mt-1 text-xs text-slate-500">{location}</p>
        )}
      </div>
    </Link>
  );
}
