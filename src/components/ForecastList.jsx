function DayCard({ dateStr, max, min, code, codeMap, precip }) {
  const d = new Date(dateStr);
  const label = d.toLocaleDateString(undefined, { weekday: 'short' });
  const icon = codeMap[code]?.emoji || '🌡️';
  const desc = codeMap[code]?.label || '—';
  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 flex flex-col items-center text-center">
      <div className="text-white/70 text-sm">{label}</div>
      <div className="text-2xl mt-2" aria-hidden>{icon}</div>
      <div className="text-xs text-white/50 mt-1">{desc}</div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="text-white font-medium">{Math.round(max)}°</span>
        <span className="text-white/50">/</span>
        <span className="text-white/70">{Math.round(min)}°</span>
      </div>
      <div className="mt-2 text-xs text-white/60">💧 {Math.round(precip || 0)} mm</div>
    </div>
  );
}

export default function ForecastList({ daily, codeMap, loading }) {
  if (loading && !daily) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!daily) {
    return <div className="text-white/60">Forecast will appear here after a search.</div>;
  }

  const items = daily.time.map((t, idx) => ({
    date: t,
    max: daily.temperature_2m_max[idx],
    min: daily.temperature_2m_min[idx],
    code: daily.weather_code[idx],
    precip: daily.precipitation_sum?.[idx] ?? 0,
  })).slice(0, 7);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">7-Day Forecast</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {items.map((it) => (
          <DayCard
            key={it.date}
            dateStr={it.date}
            max={it.max}
            min={it.min}
            code={it.code}
            codeMap={codeMap}
            precip={it.precip}
          />)
        )}
      </div>
    </div>
  );
}
