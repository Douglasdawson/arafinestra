import { useReducer, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHead from "../../components/seo/PageHead";
import BreadcrumbSchema from "../../components/seo/BreadcrumbSchema";
import FaqSchema from "../../components/seo/FaqSchema";
import ProgressBar from "../../components/calculator/ProgressBar";
import StepProductType from "../../components/calculator/StepProductType";
import StepModel from "../../components/calculator/StepModel";
import StepDimensions from "../../components/calculator/StepDimensions";
import StepColor from "../../components/calculator/StepColor";
import StepGlass from "../../components/calculator/StepGlass";
import StepExtras from "../../components/calculator/StepExtras";
import StepQuantity from "../../components/calculator/StepQuantity";
import Result from "../../components/calculator/Result";
import WindowPreview from "../../components/calculator/WindowPreview";

interface CalculatorState {
  step: number;
  tipo: string;
  modelo: string;
  modeloId: number | null;
  hojas: number;
  ancho: number;
  alto: number;
  color: string;
  vidrio: string;
  extras: string[];
  cantidad: number;
}

type Action =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_TIPO"; tipo: string }
  | { type: "SET_MODEL"; modelo: string; modeloId: number | null }
  | { type: "SET_DIMENSION"; field: "ancho" | "alto" | "hojas"; value: number }
  | { type: "SET_COLOR"; color: string }
  | { type: "SET_GLASS"; vidrio: string }
  | { type: "TOGGLE_EXTRA"; extra: string }
  | { type: "SET_QUANTITY"; cantidad: number }
  | { type: "RESET" };

const INITIAL_STATE: CalculatorState = {
  step: 1,
  tipo: "",
  modelo: "",
  modeloId: null,
  hojas: 2,
  ancho: 120,
  alto: 120,
  color: "blanc",
  vidrio: "doble",
  extras: [],
  cantidad: 1,
};

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_TIPO":
      return { ...state, tipo: action.tipo, step: 2 };
    case "SET_MODEL":
      return { ...state, modelo: action.modelo, modeloId: action.modeloId };
    case "SET_DIMENSION":
      return { ...state, [action.field]: action.value };
    case "SET_COLOR":
      return { ...state, color: action.color };
    case "SET_GLASS":
      return { ...state, vidrio: action.vidrio };
    case "TOGGLE_EXTRA": {
      const extras = state.extras.includes(action.extra)
        ? state.extras.filter((e) => e !== action.extra)
        : [...state.extras, action.extra];
      return { ...state, extras };
    }
    case "SET_QUANTITY":
      return { ...state, cantidad: action.cantidad };
    case "RESET":
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}

const TOTAL_STEPS = 7;

function canAdvance(state: CalculatorState): boolean {
  switch (state.step) {
    case 1:
      return state.tipo !== "";
    case 2:
      return state.modelo !== "";
    case 3:
      return state.ancho >= 40 && state.alto >= 40;
    case 4:
      return state.color !== "";
    case 5:
      return state.vidrio !== "";
    case 6:
      return true; // extras are optional
    case 7:
      return state.cantidad >= 1;
    default:
      return false;
  }
}

export default function Calculator() {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const isResult = state.step > TOTAL_STEPS;

  // Save progress state
  const [saveOpen, setSaveOpen] = useState(false);
  const [savePhone, setSavePhone] = useState("");
  const [saveSending, setSaveSending] = useState(false);
  const [saveSent, setSaveSent] = useState(false);

  const goNext = useCallback(() => {
    if (state.step <= TOTAL_STEPS && canAdvance(state)) {
      dispatch({ type: "SET_STEP", step: state.step + 1 });
    }
  }, [state]);

  const goBack = useCallback(() => {
    if (state.step > 1) {
      dispatch({ type: "SET_STEP", step: state.step - 1 });
    }
  }, [state.step]);

  // Browser back button support
  useEffect(() => {
    const handlePop = () => {
      if (state.step > 1) {
        dispatch({ type: "SET_STEP", step: state.step - 1 });
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [state.step]);

  return (
    <>
      <PageHead
        title={t("calculator.title")}
        description={t("calculator.seo_desc")}
        path="/pressupost"
      />
      <BreadcrumbSchema items={[
        { name: t("nav.home"), url: "/" },
        { name: t("nav.calculator"), url: "/pressupost" },
      ]} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[30%] right-[10%] w-[120px] h-[120px] rounded-full bg-brand/10 blur-3xl" />
            <div className="absolute bottom-[20%] left-[15%] w-[100px] h-[100px] rounded-full bg-brand/6 blur-2xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t("calculator.title")}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 font-light">{t("calculator.subtitle")}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 pb-24 sm:pb-6">
          {/* Progress */}
          {!isResult && <ProgressBar currentStep={state.step} />}

          {/* Main content: steps + live preview */}
          <div className={`mt-6 ${!isResult && state.step > 1 ? "flex flex-col lg:flex-row gap-8" : ""}`}>
            {/* Step content */}
            <div className={`${!isResult && state.step > 1 ? "flex-1 min-w-0" : ""} animate-[fadeIn_0.3s_ease-out]`} key={state.step}>
              {state.step === 1 && (
                <StepProductType
                  selected={state.tipo}
                  onSelect={(tipo) => dispatch({ type: "SET_TIPO", tipo })}
                />
              )}
              {state.step === 2 && (
                <StepModel
                  tipo={state.tipo}
                  selectedModel={state.modelo}
                  selectedModelId={state.modeloId}
                  onSelect={(modelo, modeloId) =>
                    dispatch({ type: "SET_MODEL", modelo, modeloId })
                  }
                />
              )}
              {state.step === 3 && (
                <StepDimensions
                  ancho={state.ancho}
                  alto={state.alto}
                  hojas={state.hojas}
                  onChange={(field, value) =>
                    dispatch({ type: "SET_DIMENSION", field, value })
                  }
                />
              )}
              {state.step === 4 && (
                <StepColor
                  selected={state.color}
                  onSelect={(color) => dispatch({ type: "SET_COLOR", color })}
                />
              )}
              {state.step === 5 && (
                <StepGlass
                  selected={state.vidrio}
                  onSelect={(vidrio) => dispatch({ type: "SET_GLASS", vidrio })}
                />
              )}
              {state.step === 6 && (
                <StepExtras
                  tipo={state.tipo}
                  extras={state.extras}
                  onToggle={(extra) => dispatch({ type: "TOGGLE_EXTRA", extra })}
                />
              )}
              {state.step === 7 && (
                <StepQuantity
                  cantidad={state.cantidad}
                  onChange={(cantidad) => dispatch({ type: "SET_QUANTITY", cantidad })}
                />
              )}
              {isResult && (
                <Result
                  state={state}
                  onReset={() => dispatch({ type: "RESET" })}
                />
              )}
            </div>

            {/* Live window preview — desktop only from step 2 onwards */}
            {!isResult && state.step > 1 && (
              <div className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4 text-center">
                    {t("calculator.preview")}
                  </p>
                  <div className="flex justify-center">
                    <WindowPreview
                      tipo={state.tipo}
                      ancho={state.ancho}
                      alto={state.alto}
                      hojas={state.hojas}
                      color={state.color}
                      vidrio={state.vidrio}
                      extras={state.extras}
                    />
                  </div>
                  {/* Config summary chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                    {state.tipo && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-navy-50 text-navy-700 rounded-full">
                        {t(
                          state.tipo === "ventana"
                            ? "nav.windows"
                            : state.tipo === "puerta"
                              ? "nav.sliding_doors"
                              : state.tipo === "persiana"
                                ? "nav.shutters"
                                : "nav.mosquito_nets"
                        )}
                      </span>
                    )}
                    {state.modelo && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                        {state.modelo}
                      </span>
                    )}
                    {state.color !== "blanc" && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                        {t(`calculator.color_${state.color}`)}
                      </span>
                    )}
                    {state.extras.length > 0 &&
                      state.extras.map((e) => (
                        <span
                          key={e}
                          className="px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full"
                        >
                          {t(`calculator.${e}`)}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons — sticky on mobile */}
          {!isResult && (
            <div className="fixed bottom-0 left-0 right-0 sm:static sm:mt-10 bg-white sm:bg-transparent border-t border-gray-200 sm:border-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-0 sm:pb-0 z-30">
              <div className="flex justify-between max-w-2xl mx-auto">
                <button
                  onClick={goBack}
                  disabled={state.step <= 1}
                  className={`px-5 py-3 rounded-lg font-medium transition-all ${
                    state.step <= 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    {t("calculator.back")}
                  </span>
                </button>

                {state.step > 1 && (
                  <button
                    onClick={goNext}
                    disabled={!canAdvance(state)}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                      canAdvance(state)
                        ? "bg-brand hover:bg-brand-dark text-white shadow-md hover:shadow-lg"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {state.step === TOTAL_STEPS ? t("calculator.see_result") : t("calculator.next")}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Save & Continue Later — steps 3+ only */}
          {!isResult && state.step >= 3 && (
            <div className="mt-4 text-center max-w-2xl mx-auto">
              {!saveSent ? (
                <>
                  {!saveOpen ? (
                    <button
                      onClick={() => setSaveOpen(true)}
                      className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
                    >
                      {t("calculator.save_progress")}
                    </button>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!savePhone.trim() || saveSending) return;
                        setSaveSending(true);
                        try {
                          const res = await fetch("/api/leads", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              nombre: savePhone.trim(),
                              telefono: savePhone.trim(),
                              origen: "calculator_save",
                              tipoCliente: "particular",
                              presupuestoDatos: { ...state },
                            }),
                          });
                          if (res.ok) setSaveSent(true);
                        } catch {
                          // silent fail
                        } finally {
                          setSaveSending(false);
                        }
                      }}
                      className="inline-flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]"
                    >
                      <input
                        type="tel"
                        value={savePhone}
                        onChange={(e) => setSavePhone(e.target.value)}
                        placeholder={t("calculator.save_phone_placeholder")}
                        inputMode="tel"
                        autoComplete="tel"
                        className="px-3 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand/40 w-44"
                        required
                      />
                      <button
                        type="submit"
                        disabled={saveSending || !savePhone.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors"
                      >
                        {saveSending ? "..." : t("calculator.save_progress").split(" ")[0]}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaveOpen(false)}
                        className="p-2 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <p className="text-sm text-green-600 animate-[fadeIn_0.2s_ease-out]">
                  {t("calculator.save_sent")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <CalculatorFaq />
      </div>
    </>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-medium text-navy-800 group-hover:text-brand transition-colors pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "500px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-sm text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

function CalculatorFaq() {
  const { t } = useTranslation();

  const faqs = [];
  for (let i = 1; i <= 5; i++) {
    const qKey = `calculator.faq_q${i}`;
    const aKey = `calculator.faq_a${i}`;
    const q = t(qKey);
    const a = t(aKey);
    if (q !== qKey && a !== aKey) faqs.push({ question: q, answer: a });
  }

  if (faqs.length === 0) return null;

  return (
    <>
      <FaqSchema faqs={faqs} />
      <section className="py-10 sm:py-16 bg-white mt-8 sm:mt-12 rounded-2xl border border-gray-200 shadow-sm mx-2 sm:mx-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 mb-8 sm:mb-12 text-center tracking-tight">
            {t("calculator.faq_title")}
          </h2>
          <div className="border-t border-slate-200">
            {faqs.map((faq, i) => (
              <FaqAccordionItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
