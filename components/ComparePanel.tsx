interface Betrieb {
  name: string;
  ort: string;
  mitarbeitende: number;
  teams: number;
  beteiligung: number;
  veloanteil: number;
  distanz: number;
  co2: number;
}

const COMPARE_METRICS = [
  { key: "mitarbeitende" as const, label: "Betriebsgrösse", unit: "MA", format: formatSwiss },
  { key: "teams" as const, label: "Anzahl Teams", unit: "Teams", format: formatSwiss },
  { key: "beteiligung" as const, label: "Beteiligung %", unit: "%", format: formatPercent },
  { key: "distanz" as const, label: "Distanz", unit: "km", format: formatSwiss },
];

function formatSwiss(n: number): string {
  const rounded = Math.round(n);
  const s = rounded.toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join("\u2019");
}

function formatPercent(n: number): string {
  if (Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.05) {
    return Math.round(n).toString();
  }
  return n.toFixed(1);
}

function getBarColor(index: number): string {
  switch (index) {
    case 0: return "bg-brand-pink";
    case 1: return "bg-brand-turquoise";
    case 2: return "bg-brand-lemon";
    default: return "bg-brand-blue";
  }
}

function getValue(b: Betrieb, key: string): number {
  switch (key) {
    case "mitarbeitende": return b.mitarbeitende ?? 0;
    case "teams": return b.teams ?? 0;
    case "beteiligung": return Math.min(b.beteiligung ?? 0, 100);
    case "distanz": return b.distanz ?? 0;
    default: return 0;
  }
}

export function ComparePanel({ selected }: { selected: Betrieb[] }) {
  if (selected.length < 2) {
    return (
      <div className="py-8 text-center text-black/40 text-base">
        Wähle mindestens 2 Betriebe zum Vergleichen aus.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      {COMPARE_METRICS.map((metric) => {
        const values = selected.map((b) => getValue(b, metric.key));
        const maxVal = Math.max(...values, 1);

        return (
          <div key={metric.key}>
            {/* Metric heading */}
            <h3 className="text-sm sm:text-base font-bold text-black mb-3 sm:mb-4">
              {metric.label}
            </h3>

            <div className="flex flex-col gap-3">
              {selected.map((b, i) => {
                const value = getValue(b, metric.key);
                const barWidth = maxVal > 0 ? (value / maxVal) * 100 : 0;
                const barColor = "bg-brand-blue";

                return (
                  <div key={b.name}>
                    {/* Desktop */}
                    <div className="hidden sm:flex items-center gap-3 lg:gap-4">
                      <p className="w-[180px] lg:w-[220px] shrink-0 text-xs lg:text-sm text-black truncate">
                        {b.name}
                      </p>
                      <div className="flex-1 h-9 lg:h-[44px] relative">
                        <div className="absolute inset-0 bg-white rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        {barWidth > 22 ? (
                          <div
                            className="absolute top-0 h-full flex items-center justify-end gap-1 px-4 transition-all duration-500 ease-out"
                            style={{ left: 0, width: `${barWidth}%` }}
                          >
                            <span className="text-sm lg:text-base font-bold text-black whitespace-nowrap">
                              {metric.format(value)}
                            </span>
                            <span className="text-sm lg:text-base text-black/75 whitespace-nowrap font-normal">
                              {metric.unit}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="absolute top-0 h-full flex items-center gap-1 pl-4"
                            style={{ left: `${barWidth}%` }}
                          >
                            <span className="text-sm lg:text-base font-bold text-black whitespace-nowrap">
                              {metric.format(value)}
                            </span>
                            <span className="text-sm lg:text-base text-black/75 whitespace-nowrap font-normal">
                              {metric.unit}
                            </span>
                          </div>
                        )}

                        {/* CO₂ for Distanz */}
                        {metric.key === "distanz" && (
                          <div className="absolute top-0 right-0 h-full flex items-center pr-2">
                            <span className="text-xs lg:text-sm text-black/40 whitespace-nowrap">
                              {formatSwiss(b.co2)} kg CO₂
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex sm:hidden flex-col gap-0.5">
                      <p className="text-xs text-black truncate">
                        {b.name}
                      </p>
                      <div className="h-7 relative">
                        <div className="absolute inset-0 bg-white rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        {barWidth > 30 ? (
                          <div
                            className="absolute top-0 h-full flex items-center justify-end gap-1 px-3 transition-all duration-500 ease-out"
                            style={{ left: 0, width: `${barWidth}%` }}
                          >
                            <span className="text-xs font-bold text-black whitespace-nowrap">
                              {metric.format(value)}
                            </span>
                            <span className="text-xs text-black/75 whitespace-nowrap font-normal">
                              {metric.unit}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="absolute top-0 h-full flex items-center gap-1 pl-3"
                            style={{ left: `${barWidth}%` }}
                          >
                            <span className="text-xs font-bold text-black whitespace-nowrap">
                              {metric.format(value)}
                            </span>
                            <span className="text-xs text-black/75 whitespace-nowrap font-normal">
                              {metric.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
