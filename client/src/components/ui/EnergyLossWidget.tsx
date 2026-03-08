import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

export default function EnergyLossWidget() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || "ca";
  const [temp, setTemp] = useState<number | null>(null);
  const [lossToday, setLossToday] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((data) => {
        if (data?.temperature != null) setTemp(Math.round(data.temperature));
      })
      .catch(() => {});
  }, []);

  // Calculate hourly loss based on temperature difference
  // Below 18°C, old aluminum windows lose ~€0.012/hour per degree below 18
  const hourlyLoss = temp !== null && temp < 18 ? (18 - temp) * 0.012 : 0;

  // Animate the daily loss counter incrementing
  useEffect(() => {
    if (hourlyLoss <= 0) return;

    // Start with estimated loss so far today (hours elapsed × hourly rate)
    const hoursElapsed = new Date().getHours() + new Date().getMinutes() / 60;
    setLossToday(hoursElapsed * hourlyLoss);

    // Increment every 3 seconds by a small amount (hourly rate / 1200)
    const increment = hourlyLoss / 1200;
    intervalRef.current = setInterval(() => {
      setLossToday((prev) => prev + increment);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hourlyLoss]);

  // Don't render if warm weather or no data
  if (temp === null || temp >= 18) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/60 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <p className="text-slate-600">
          {t("energy_loss.prefix")}{" "}
          <span className="text-2xl font-bold text-navy-900">{temp}°C</span>{" "}
          {t("energy_loss.at")}
        </p>
        <p className="text-slate-700">
          {t("energy_loss.losing")}{" "}
          <span className="text-3xl sm:text-4xl font-bold text-red-600 tabular-nums">
            {lossToday.toFixed(2)}€
          </span>{" "}
          {t("energy_loss.today")}
        </p>
        <p className="text-sm text-slate-500">{t("energy_loss.in_heating")}</p>
        <p className="text-sm font-medium text-red-700 mt-2">{t("energy_loss.each_day")}</p>
        <Link
          to={`/${prefix}/pressupost`}
          className="inline-block mt-4 px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          {t("energy_loss.cta")}
        </Link>
      </div>
    </div>
  );
}
