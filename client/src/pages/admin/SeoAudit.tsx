import { useState } from "react";

interface AuditResult {
  url: string;
  title: boolean;
  description: boolean;
  h1: boolean;
  canonical: boolean;
  schema: boolean;
  score: number;
}

interface AuditResponse {
  pages: AuditResult[];
  totalScore: number;
}

export default function SeoAudit() {
  const [results, setResults] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo/audit", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Audit failed");
      const data: AuditResponse = await res.json();
      setResults(data);
    } catch (err) {
      console.error("SEO audit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const check = (ok: boolean) =>
    ok ? (
      <span className="text-green-600 font-bold">✓</span>
    ) : (
      <span className="text-red-500 font-bold">✗</span>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Auditoria SEO</h1>
        <button
          onClick={runAudit}
          disabled={loading}
          className="bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
        >
          {loading ? "Analitzant..." : "Executar auditoria"}
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-gray-500 py-12 justify-center">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Analitzant pàgines...</span>
        </div>
      )}

      {results && !loading && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600 font-medium">
                    <th className="px-4 py-3">Pàgina</th>
                    <th className="px-4 py-3 text-center">Title</th>
                    <th className="px-4 py-3 text-center">Desc</th>
                    <th className="px-4 py-3 text-center">H1</th>
                    <th className="px-4 py-3 text-center">Canonical</th>
                    <th className="px-4 py-3 text-center">Schema</th>
                    <th className="px-4 py-3 text-center">Puntuació</th>
                  </tr>
                </thead>
                <tbody>
                  {results.pages.map((page) => (
                    <tr key={page.url} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-navy-800 max-w-xs truncate">
                        {page.url}
                      </td>
                      <td className="px-4 py-3 text-center">{check(page.title)}</td>
                      <td className="px-4 py-3 text-center">{check(page.description)}</td>
                      <td className="px-4 py-3 text-center">{check(page.h1)}</td>
                      <td className="px-4 py-3 text-center">{check(page.canonical)}</td>
                      <td className="px-4 py-3 text-center">{check(page.schema)}</td>
                      <td className={`px-4 py-3 text-center font-bold ${scoreColor(page.score)}`}>
                        {page.score}/5
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Pàgines analitzades: {results.pages.length} | Puntuació global:{" "}
            <span className="font-bold">{results.totalScore}/10</span>
          </div>
        </>
      )}
    </div>
  );
}
