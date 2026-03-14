import * as React from "react";

import { cn } from "@/lib/utils";

type LineSeries = {
  id: string;
  label: string;
  values: number[];
  color?: string;
  dash?: string;
  disabled?: boolean;
};

export function SimpleLineChart({
  title,
  series,
  valueFormatter,
  xLabelFormatter,
  yLabelFormatter,
  className,
}: {
  title: string;
  series: LineSeries[];
  valueFormatter?: (value: number) => string;
  xLabelFormatter?: (index: number) => string;
  yLabelFormatter?: (value: number) => string;
  className?: string;
}) {
  const showTitle = title.trim().length > 0;
  const safeSeries = series.map((item) => ({
    ...item,
    values: item.values.length > 0 ? item.values : [0],
  }));
  const maxLength = Math.max(...safeSeries.map((item) => item.values.length), 1);
  const paddedSeries = safeSeries.map((item) => {
    if (item.values.length >= maxLength) return item;
    const padded = [...item.values];
    for (let i = item.values.length; i < maxLength; i += 1) {
      padded.push(0);
    }
    return { ...item, values: padded };
  });

  const maxValue = Math.max(
    1,
    ...paddedSeries.flatMap((item) =>
      item.values.map((value) => (Number.isFinite(value) ? value : 0))
    )
  );
  const roundedMax = roundUpToNice(maxValue);

  const renderSeries = [...paddedSeries].sort((a, b) => {
    const score = (label: string) => {
      const lower = label.toLowerCase();
      if (lower.includes("avalanche")) return 3;
      if (lower.includes("snowball")) return 2;
      return 1;
    };
    return score(a.label) - score(b.label);
  });

  const width = 1000;
  const height = 420;
  const margin = { top: 24, right: 24, bottom: 56, left: 70 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const formatValue = valueFormatter ?? ((value: number) => value.toString());
  const formatY = yLabelFormatter ?? formatValue;

  const yTicks = 4;
  const yValues = Array.from({ length: yTicks + 1 }, (_, index) =>
    Math.round((roundedMax / yTicks) * index)
  );
  const xTickCount = 4;
  const xStep = Math.max(1, Math.floor((maxLength - 1) / xTickCount));
  const xValues = Array.from({ length: xTickCount + 1 }, (_, index) =>
    Math.min(index * xStep, maxLength - 1)
  );

  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [tooltip, setTooltip] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPx = event.clientX - rect.left;
    const yPx = event.clientY - rect.top;
    const x = (xPx / rect.width) * width;
    if (x < margin.left || x > width - margin.right) {
      setHoverIndex(null);
      setTooltip(null);
      return;
    }
    const relativeX = Math.min(Math.max(x - margin.left, 0), plotWidth);
    const index = Math.round((relativeX / plotWidth) * (maxLength - 1));
    setHoverIndex(index);
    setTooltip({ x: xPx, y: yPx, width: rect.width, height: rect.height });
  };

  const handleLeave = () => {
    setHoverIndex(null);
    setTooltip(null);
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {showTitle && (
        <p className="mb-2 text-sm font-semibold text-brand-primary">{title}</p>
      )}
      <div className="relative min-h-0 flex-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <g className="text-[12px] text-brand-muted">
              {yValues.map((tick, index) => {
                const y = plotHeight - (tick / roundedMax) * plotHeight;
                return (
                  <g key={`y-${tick}-${index}`} transform={`translate(0, ${y})`}>
                    <line
                      x1={0}
                      x2={plotWidth}
                      y1={0}
                      y2={0}
                      stroke="currentColor"
                      strokeOpacity={index === 0 ? 0.4 : 0.2}
                    />
                    <text x={-10} y={4} textAnchor="end" fill="currentColor">
                      {formatY(tick)}
                    </text>
                  </g>
                );
              })}
              {xValues.map((tick, index) => {
                const x = (tick / (maxLength - 1 || 1)) * plotWidth;
                return (
                  <g key={`x-${tick}-${index}`} transform={`translate(${x}, 0)`}>
                    <line
                      x1={0}
                      x2={0}
                      y1={0}
                      y2={plotHeight}
                      stroke="currentColor"
                      strokeOpacity={0.1}
                    />
                    <text
                      x={0}
                      y={plotHeight + 18}
                      textAnchor="middle"
                      fill="currentColor"
                    >
                      {xLabelFormatter ? xLabelFormatter(tick) : `${tick} mo`}
                    </text>
                  </g>
                );
              })}
            </g>

            {hoverIndex !== null && (
              <line
                x1={(hoverIndex / (maxLength - 1 || 1)) * plotWidth}
                x2={(hoverIndex / (maxLength - 1 || 1)) * plotWidth}
                y1={0}
                y2={plotHeight}
                stroke="rgba(26,54,121,0.35)"
                strokeDasharray="4 4"
              />
            )}

            {renderSeries.map((item) => {
              if (item.disabled) return null;
              const style = getSeriesStyle(item, item.color);
              const path = buildPath(item.values, plotWidth, plotHeight, roundedMax);
              return (
                <path
                  key={`line-${item.id}`}
                  d={path}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.dash}
                  strokeOpacity={style.opacity}
                />
              );
            })}

            {hoverIndex !== null &&
              renderSeries.map((item) => {
                if (item.disabled) return null;
                const style = getSeriesStyle(item, item.color);
                const value = item.values[hoverIndex] ?? 0;
                const x = (hoverIndex / (maxLength - 1 || 1)) * plotWidth;
                const y = plotHeight - (value / roundedMax) * plotHeight;
                return (
                  <circle
                    key={`point-${item.id}`}
                    cx={x}
                    cy={y}
                    r={4}
                    fill={style.stroke}
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              })}
          </g>
        </svg>

        {hoverIndex !== null && tooltip && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-brand-primary/10 bg-white/95 p-2 text-xs text-brand-primary shadow-md"
            style={{
              left: Math.min(tooltip.x + 12, tooltip.width - 180),
              top: Math.max(tooltip.y - 12, 0),
            }}
          >
            <div className="font-semibold text-brand-primary">
              Month {hoverIndex}
            </div>
            <div className="mt-1 space-y-1 text-brand-muted">
              {series.map((item) => {
                const seriesValues = paddedSeries.find((s) => s.id === item.id)?.values;
                const value = seriesValues ? seriesValues[hoverIndex] : 0;
                if (item.disabled) {
                  return (
                    <div key={`tooltip-${item.id}`} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-secondary" />
                      <span>{item.label}: Not eligible</span>
                    </div>
                  );
                }
                return (
                  <div key={`tooltip-${item.id}`} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color ?? "var(--color-brand-primary)" }}
                    />
                    <span>
                      {item.label}: {formatValue(value ?? 0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-brand-muted">
        {series.map((item) => {
          const style = getSeriesStyle(item, item.color);
          return (
            <div key={`legend-${item.id}`} className="flex items-center gap-2">
              <svg width="18" height="8" className="block">
                <line
                  x1="0"
                  y1="4"
                  x2="18"
                  y2="4"
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.dash}
                  strokeOpacity={style.opacity}
                />
              </svg>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildPath(values: number[], width: number, height: number, maxValue: number) {
  const safeMax = maxValue <= 0 ? 1 : maxValue;
  const maxIndex = values.length - 1;
  return values
    .map((rawValue, index) => {
      const value = Number.isFinite(rawValue) ? rawValue : 0;
      const x = (index / (maxIndex || 1)) * width;
      const y = height - (value / safeMax) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function roundUpToNice(value: number) {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const base = Math.pow(10, exponent);
  const normalized = value / base;
  const rounded =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return rounded * base;
}

function getSeriesStyle(series: LineSeries, color?: string) {
  const lower = series.label.toLowerCase();
  const stroke = color ?? "var(--color-brand-primary)";
  if (lower.includes("snowball")) {
    return { stroke, strokeWidth: 2.6, dash: series.dash, opacity: 1 };
  }
  if (lower.includes("avalanche")) {
    return { stroke, strokeWidth: 2.25, dash: series.dash ?? "6 4", opacity: 0.95 };
  }
  return { stroke, strokeWidth: 2, dash: series.dash ?? "2 3", opacity: 0.75 };
}
