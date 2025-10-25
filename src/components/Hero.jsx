import Spline from '@splinetool/react-spline';
import SearchBar from './SearchBar';

export default function Hero({ onSearch, onUseMyLocation, loading }) {
  return (
    <section className="relative w-full" style={{ height: '65vh' }}>
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/6tUXqVcUA0xgJugv/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-black/40 to-black"></div>

      <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-start justify-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">Foresight Weather</h1>
        <p className="mt-3 text-white/70 max-w-xl">Live conditions and a clean, glanceable forecast. Search any city or use your current location.</p>
        <div className="mt-6 w-full max-w-2xl">
          <SearchBar onSearch={onSearch} onUseMyLocation={onUseMyLocation} loading={loading} />
        </div>
      </div>
    </section>
  );
}
