export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
      <span className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
        ARA FINESTRA
      </span>
    </div>
  );
}
