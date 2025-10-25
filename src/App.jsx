import { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import WeatherSummary from './components/WeatherSummary';
import ForecastList from './components/ForecastList';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export default function App() {
  const [location, setLocation] = useState(null); // { name, country, latitude, longitude }
  const [current, setCurrent] = useState(null); // current data
  const [daily, setDaily] = useState(null); // daily forecast
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const weatherCodeMap = useMemo(() => ({
    0: { label: 'Clear sky', emoji: '☀️' },
    1: { label: 'Mainly clear', emoji: '🌤️' },
    2: { label: 'Partly cloudy', emoji: '⛅' },
    3: { label: 'Overcast', emoji: '☁️' },
    45: { label: 'Fog', emoji: '🌫️' },
    48: { label: 'Depositing rime fog', emoji: '🌫️' },
    51: { label: 'Light drizzle', emoji: '🌦️' },
    53: { label: 'Moderate drizzle', emoji: '🌦️' },
    55: { label: 'Dense drizzle', emoji: '🌧️' },
    56: { label: 'Freezing drizzle', emoji: '🌧️' },
    57: { label: 'Dense freezing drizzle', emoji: '🌧️' },
    61: { label: 'Slight rain', emoji: '🌦️' },
    63: { label: 'Moderate rain', emoji: '🌧️' },
    65: { label: 'Heavy rain', emoji: '🌧️' },
    66: { label: 'Freezing rain', emoji: '🌧️' },
    67: { label: 'Heavy freezing rain', emoji: '🌧️' },
    71: { label: 'Slight snow', emoji: '🌨️' },
    73: { label: 'Moderate snow', emoji: '🌨️' },
    75: { label: 'Heavy snow', emoji: '❄️' },
    77: { label: 'Snow grains', emoji: '🌨️' },
    80: { label: 'Slight showers', emoji: '🌦️' },
    81: { label: 'Moderate showers', emoji: '🌦️' },
    82: { label: 'Violent showers', emoji: '⛈️' },
    85: { label: 'Slight snow showers', emoji: '🌨️' },
    86: { label: 'Heavy snow showers', emoji: '❄️' },
    95: { label: 'Thunderstorm', emoji: '⛈️' },
    96: { label: 'Thunderstorm with hail', emoji: '⛈️' },
    99: { label: 'Thunderstorm with heavy hail', emoji: '⛈️' },
  }), []);

  async function geocode(query) {
    const url = new URL(GEO_URL);
    url.searchParams.set('name', query);
    url.searchParams.set('count', '1');
    url.searchParams.set('language', 'en');
    url.searchParams.set('format', 'json');
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to search location');
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error('Location not found');
    const r = data.results[0];
    return {
      name: r.name,
      country: r.country,
      latitude: r.latitude,
      longitude: r.longitude,
      admin1: r.admin1 || '',
    };
  }

  async function fetchWeather(lat, lon) {
    const url = new URL(WEATHER_URL);
    url.searchParams.set('latitude', lat);
    url.searchParams.set('longitude', lon);
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m');
    url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum');
    url.searchParams.set('timezone', 'auto');
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();
    return data;
  }

  async function handleSearch(query) {
    if (!query || !query.trim()) return;
    try {
      setError('');
      setLoading(true);
      const loc = await geocode(query.trim());
      const wx = await fetchWeather(loc.latitude, loc.longitude);
      setLocation(loc);
      setCurrent(wx.current);
      setDaily(wx.daily);
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleUseMyLocation() {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported');
      return;
    }
    setError('');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const wx = await fetchWeather(latitude, longitude);
        // Reverse geocode best-effort using forecast timezone if available
        const loc = {
          name: 'Your location',
          country: wx.timezone || '',
          latitude,
          longitude,
          admin1: '',
        };
        setLocation(loc);
        setCurrent(wx.current);
        setDaily(wx.daily);
      } catch (e) {
        setError(e.message || 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    }, (err) => {
      setLoading(false);
      setError(err.message || 'Unable to get your location');
    });
  }

  useEffect(() => {
    // Initial load: try geolocation, fall back to New York
    let did = false;
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (pos) => {
        if (did) return;
        try {
          const { latitude, longitude } = pos.coords;
          const wx = await fetchWeather(latitude, longitude);
          const loc = { name: 'Your location', country: wx.timezone || '', latitude, longitude, admin1: '' };
          setLocation(loc);
          setCurrent(wx.current);
          setDaily(wx.daily);
        } catch (e) {
          setError(e.message || 'Failed to fetch weather');
        } finally {
          setLoading(false);
        }
      }, async () => {
        if (did) return;
        await handleSearch('New York');
      });
    } else {
      handleSearch('New York');
    }
    return () => { did = true; };
  }, []);

  const currentDescriptor = current ? (weatherCodeMap[current.weather_code] || { label: 'Unknown', emoji: '🌡️' }) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero onSearch={handleSearch} onUseMyLocation={handleUseMyLocation} loading={loading} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur border border-white/10 p-5">
              <WeatherSummary
                loading={loading}
                location={location}
                current={current}
                descriptor={currentDescriptor}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur border border-white/10 p-5">
              <ForecastList daily={daily} codeMap={weatherCodeMap} loading={loading} />
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-white/50 mt-10 pb-10">
          Data by Open-Meteo. 3D cover by Spline.
        </footer>
      </main>
    </div>
  );
}
