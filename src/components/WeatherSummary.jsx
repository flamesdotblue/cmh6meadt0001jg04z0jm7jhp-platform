export default function WeatherSummary({ loading, location, current, descriptor }) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Current Conditions</h2>
          <p className="text-white/60 text-sm mt-1">
            {location ? (
              <>
                {location.name}
                {location.admin1 ? `, ${location.admin1}` : ''}
                {location.country ? `, ${location.country}` : ''}
              </>
            ) : (
              '—'
            )}
          </p>
        </div>
        {descriptor && (
          <div className="text-3xl" aria-hidden>{descriptor.emoji}</div>
        )}
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-10 w-28 bg-white/10 rounded" />
            <div className="h-4 w-48 bg-white/10 rounded mt-3" />
            <div className="h-4 w-40 bg-white/10 rounded mt-2" />
          </div>
        ) : current ? (
          <div>
            <div className="flex items-baseline gap-3">
              <div className="text-5xl font-semibold">
                {Math.round(current.temperature_2m)}°
              </div>
              <div className="text-white/70">{descriptor?.label || '—'}</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                <div className="text-white/60">Feels like</div>
                <div className="mt-1 text-white">{Math.round(current.apparent_temperature)}°</div>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                <div className="text-white/60">Humidity</div>
                <div className="mt-1 text-white">{Math.round(current.relative_humidity_2m)}%</div>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                <div className="text-white/60">Wind</div>
                <div className="mt-1 text-white">{Math.round(current.wind_speed_10m)} km/h</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white/60">Search a city to see current weather.</div>
        )}
      </div>
    </div>
  );
}
