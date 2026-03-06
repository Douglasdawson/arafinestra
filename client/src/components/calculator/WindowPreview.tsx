import { useTranslation } from "react-i18next";

interface Props {
  tipo: string;
  ancho: number;
  alto: number;
  hojas: number;
  color: string;
  vidrio: string;
  extras: string[];
}

const COLOR_MAP: Record<string, { frame: string; frameDark: string }> = {
  blanc: { frame: "#E8E8E8", frameDark: "#D0D0D0" },
  roure: { frame: "#8B5E3C", frameDark: "#6B4226" },
  gris_antracita: { frame: "#4A4A4A", frameDark: "#333333" },
  noguer: { frame: "#5C3A1E", frameDark: "#3E2510" },
  crema: { frame: "#F0E8D8", frameDark: "#DDD3BE" },
};

const GLASS_MAP: Record<string, { fill: string; opacity: number; label: string }> = {
  doble: { fill: "#B8D8F0", opacity: 0.35, label: "2x" },
  baix_emissiu: { fill: "#90C8E8", opacity: 0.45, label: "Low-E" },
  triple: { fill: "#68B8E0", opacity: 0.55, label: "3x" },
};

export default function WindowPreview({
  tipo,
  ancho,
  alto,
  hojas,
  color,
  vidrio,
  extras,
}: Props) {
  const { t } = useTranslation();
  const colors = COLOR_MAP[color] || COLOR_MAP.blanc;
  const glass = GLASS_MAP[vidrio] || GLASS_MAP.doble;

  // Normalize dimensions for SVG (max 200px either direction)
  const maxDim = 200;
  const ratio = ancho / alto;
  let svgW: number, svgH: number;
  if (ratio >= 1) {
    svgW = maxDim;
    svgH = maxDim / ratio;
  } else {
    svgH = maxDim;
    svgW = maxDim * ratio;
  }

  const hasShutter = extras.includes("persiana_integrada");
  const hasMosquito = extras.includes("mosquitera_integrada");
  const shutterH = hasShutter ? 24 : 0;
  const totalH = svgH + shutterH;

  const frameW = 8;
  const dividerW = 6;
  const innerW = svgW - frameW * 2;
  const innerH = svgH - frameW * 2;

  const renderWindow = () => {
    const panes: JSX.Element[] = [];
    const paneW = (innerW - dividerW * (hojas - 1)) / hojas;

    for (let i = 0; i < hojas; i++) {
      const x = frameW + i * (paneW + dividerW);
      const y = frameW + shutterH;

      panes.push(
        <g key={i}>
          {/* Glass pane */}
          <rect
            x={x}
            y={y}
            width={paneW}
            height={innerH}
            fill={glass.fill}
            opacity={glass.opacity}
            rx={1}
          />
          {/* Glass reflection */}
          <rect
            x={x + paneW * 0.1}
            y={y + innerH * 0.05}
            width={paneW * 0.15}
            height={innerH * 0.4}
            fill="white"
            opacity={0.3}
            rx={2}
          />
          {/* Handle */}
          <rect
            x={i === 0 ? x + paneW - 5 : x + 2}
            y={y + innerH * 0.45}
            width={3}
            height={innerH * 0.1}
            fill={colors.frameDark}
            rx={1}
          />
          {/* Mosquito net grid overlay */}
          {hasMosquito && (
            <g opacity={0.15}>
              {Array.from({ length: Math.floor(paneW / 8) }).map((_, gi) => (
                <line
                  key={`v${gi}`}
                  x1={x + gi * 8}
                  y1={y}
                  x2={x + gi * 8}
                  y2={y + innerH}
                  stroke="#666"
                  strokeWidth={0.5}
                />
              ))}
              {Array.from({ length: Math.floor(innerH / 8) }).map((_, gi) => (
                <line
                  key={`h${gi}`}
                  x1={x}
                  y1={y + gi * 8}
                  x2={x + paneW}
                  y2={y + gi * 8}
                  stroke="#666"
                  strokeWidth={0.5}
                />
              ))}
            </g>
          )}
        </g>
      );

      // Divider between panes
      if (i < hojas - 1) {
        panes.push(
          <rect
            key={`div${i}`}
            x={x + paneW}
            y={shutterH}
            width={dividerW}
            height={svgH}
            fill={colors.frame}
            stroke={colors.frameDark}
            strokeWidth={0.5}
          />
        );
      }
    }
    return panes;
  };

  const renderShutter = () => {
    if (!hasShutter) return null;
    const slats = 5;
    const slatH = (shutterH - 4) / slats;
    return (
      <g>
        {/* Shutter box */}
        <rect
          x={0}
          y={0}
          width={svgW}
          height={shutterH}
          fill={colors.frame}
          stroke={colors.frameDark}
          strokeWidth={1}
          rx={2}
        />
        {/* Slats */}
        {Array.from({ length: slats }).map((_, i) => (
          <rect
            key={i}
            x={4}
            y={2 + i * slatH}
            width={svgW - 8}
            height={slatH - 1}
            fill={colors.frameDark}
            opacity={0.3}
            rx={1}
          />
        ))}
      </g>
    );
  };

  if (tipo === "persiana") {
    // Standalone shutter view
    const slatCount = 12;
    const sH = svgH / slatCount;
    return (
      <div className="flex flex-col items-center gap-3">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={svgW}
          height={svgH}
          className="drop-shadow-md"
        >
          <rect
            x={0}
            y={0}
            width={svgW}
            height={svgH}
            fill={colors.frame}
            stroke={colors.frameDark}
            strokeWidth={1.5}
            rx={3}
          />
          {Array.from({ length: slatCount }).map((_, i) => (
            <rect
              key={i}
              x={3}
              y={3 + i * sH}
              width={svgW - 6}
              height={sH - 2}
              fill={colors.frameDark}
              opacity={0.25 + i * 0.04}
              rx={1}
            />
          ))}
        </svg>
        <PreviewLabel
          ancho={ancho}
          alto={alto}
          glass={glass.label}
          t={t}
          tipo={tipo}
        />
      </div>
    );
  }

  if (tipo === "mosquitera") {
    // Standalone mosquito net view
    return (
      <div className="flex flex-col items-center gap-3">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={svgW}
          height={svgH}
          className="drop-shadow-md"
        >
          <rect
            x={0}
            y={0}
            width={svgW}
            height={svgH}
            fill="#E0E0E0"
            stroke="#BDBDBD"
            strokeWidth={1.5}
            rx={3}
          />
          <rect
            x={frameW}
            y={frameW}
            width={svgW - frameW * 2}
            height={svgH - frameW * 2}
            fill="#F5F5F5"
            rx={1}
          />
          {/* Grid */}
          <g opacity={0.2}>
            {Array.from({
              length: Math.floor((svgW - frameW * 2) / 6),
            }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={frameW + i * 6}
                y1={frameW}
                x2={frameW + i * 6}
                y2={svgH - frameW}
                stroke="#999"
                strokeWidth={0.5}
              />
            ))}
            {Array.from({
              length: Math.floor((svgH - frameW * 2) / 6),
            }).map((_, i) => (
              <line
                key={`h${i}`}
                x1={frameW}
                y1={frameW + i * 6}
                x2={svgW - frameW}
                y2={frameW + i * 6}
                stroke="#999"
                strokeWidth={0.5}
              />
            ))}
          </g>
        </svg>
        <PreviewLabel
          ancho={ancho}
          alto={alto}
          glass=""
          t={t}
          tipo={tipo}
        />
      </div>
    );
  }

  // Window or sliding door
  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox={`0 0 ${svgW} ${totalH}`}
        width={svgW}
        height={totalH}
        className="drop-shadow-md"
      >
        {renderShutter()}
        {/* Main frame */}
        <rect
          x={0}
          y={shutterH}
          width={svgW}
          height={svgH}
          fill={colors.frame}
          stroke={colors.frameDark}
          strokeWidth={1.5}
          rx={3}
        />
        {/* Inner area */}
        <rect
          x={frameW}
          y={frameW + shutterH}
          width={innerW}
          height={innerH}
          fill="white"
          rx={1}
        />
        {renderWindow()}
      </svg>
      <PreviewLabel
        ancho={ancho}
        alto={alto}
        glass={glass.label}
        t={t}
        tipo={tipo}
      />
    </div>
  );
}

function PreviewLabel({
  ancho,
  alto,
  glass,
  t,
  tipo,
}: {
  ancho: number;
  alto: number;
  glass: string;
  t: (k: string) => string;
  tipo: string;
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-500">
      <span className="font-mono">
        {ancho} x {alto} cm
      </span>
      {glass && tipo !== "persiana" && tipo !== "mosquitera" && (
        <>
          <span className="w-px h-3 bg-slate-300" />
          <span>
            {t("calculator.insulation")}: {glass}
          </span>
        </>
      )}
    </div>
  );
}
