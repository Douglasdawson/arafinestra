export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="relative w-12 h-12 mb-6">
        <div className="absolute inset-0 border-2 border-slate-200 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-navy-900 rounded-full animate-spin" />
      </div>
      <span className="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
        ARA FINESTRA
      </span>
    </div>
  );
}
