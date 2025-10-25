import { useState } from 'react';

export default function SearchBar({ onSearch, onUseMyLocation, loading }) {
  const [query, setQuery] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());
  }

  return (
    <form onSubmit={submit} className="flex w-full gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search city (e.g., Tokyo, Paris, Nairobi)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none px-4 text-white placeholder-white/40"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hidden sm:block">
          Enter ↵
        </div>
      </div>
      <button
        type="submit"
        className="h-12 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        Search
      </button>
      <button
        type="button"
        onClick={onUseMyLocation}
        className="h-12 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        Use my location
      </button>
    </form>
  );
}
