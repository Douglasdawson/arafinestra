import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  gama: string | null;
  modelo: string | null;
  descripcion: string | null;
  precioBase: number | null;
  precioPorM2: number | null;
}

interface Props {
  tipo: string;
  selectedModel: string;
  selectedModelId: number | null;
  onSelect: (model: string, modelId: number | null) => void;
}

const DEFAULT_MODELS = [
  { id: -1, gama: "Standard", modelo: "Gama Standard", descripcion: null },
  { id: -2, gama: "Premium", modelo: "Gama Premium", descripcion: null },
];

export default function StepModel({ tipo, selectedModel, selectedModelId, onSelect }: Props) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?tipo=${tipo}&activo=true`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) && data.length > 0 ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [tipo]);

  const models = products.length > 0 ? products : DEFAULT_MODELS;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-navy-100 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy-900 text-center">
        {t("calculator.step_model")}
      </h2>
      <p className="text-gray-500 text-center">{t("calculator.select_model_desc")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {models.map((p) => {
          const name = p.gama || p.modelo || "Model";
          const isSelected = selectedModelId === p.id || (selectedModelId === null && selectedModel === name);
          return (
            <button
              key={p.id}
              onClick={() => onSelect(name, p.id > 0 ? p.id : null)}
              className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-brand bg-brand-light shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              {p.descripcion && (
                <p className="text-sm text-gray-500 mt-1">{p.descripcion}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
