import * as React from "react";

import { cn } from "@/lib/utils";

type BarDatum = {
  label: string;
  value: number;
  color?: string;
  disabled?: boolean;
};

export function SimpleBarChart({
  title,
  data,
  valueFormatter,
  className,
}: {
  title: string;
  data: BarDatum[];
  valueFormatter?: (value: number) => string;
  className?: string;
}) {
  const showTitle = title.trim().length > 0;
  const safeData = data.map((item) => ({
    ...item,
    value: Number.isFinite(item.value) ? Math.max(0, item.value) : 0,
  }));
  const maxValue = Math.max(1, ...safeData.map((item) => item.value));
  const roundedMax = roundUpToNice(maxValue);

  const width = 1000;
  const height = 420;
  const margin = { top: 24, right: 24, bottom: 70, left: 70 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const barGap = safeData.length > 0 ? plotWidth / safeData.length : plotWidth;
  const barWidth = Math.min(96, barGap * 0.7);

  const ticks = 5;
  const tickValues = Array.from({ length: ticks + 1 }, (_, index) =>
    Math.round((roundedMax / ticks) * index)
  );

  const formatValue = valueFormatter ?? ((value: number) => value.toString());

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {showTitle && (
        <p className="mb-2 text-sm font-semibold text-brand-primary">{title}</p>
      )}
      <div className="min-h-0 flex-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g className="text-[12px] text-brand-muted">
            {tickValues.map((tick, index) => {
              const y = plotHeight - (tick / roundedMax) * plotHeight;
              return (
                <g key={`grid-y-${tick}-${index}`} transform={`translate(0, ${y})`}>
                  <line
                    x1={0}
                    x2={plotWidth}
                    y1={0}
                    y2={0}
                    stroke="currentColor"
                    strokeOpacity={index === 0 ? 0.4 : 0.2}
                  />
                  <text x={-10} y={4} textAnchor="end" fill="currentColor">
                    {formatValue(tick)}
                  </text>
                </g>
              );
            })}
          </g>
          {safeData.map((item, index) => {
            const x = index * barGap + (barGap - barWidth) / 2;
            const barHeight = (item.value / roundedMax) * plotHeight;
            const y = plotHeight - barHeight;
            const fill = item.color ?? "var(--color-brand-primary)";
            return (
              <g key={`bar-${item.label}-${index}`}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={6}
                  fill={item.disabled ? "rgba(148,166,207,0.5)" : fill}
                />
                <text
                  x={x + barWidth / 2}
                  y={plotHeight + 32}
                  textAnchor="middle"
                  className="fill-brand-primary text-[12px] font-semibold"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
          </g>
        </svg>
      </div>
    </div>
  );
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
