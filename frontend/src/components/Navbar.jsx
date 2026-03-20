import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

export default function Navbar({ onSearchChangeDebounced, initialSearch = "" }) {
  const titleRef = useRef(null);
  const [draft, setDraft] = useState(initialSearch);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setDraft(initialSearch || "");
    // If parent reset changes the initial search, cancel any pending debounce
    // so the previous search doesn't get re-applied.
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [initialSearch]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchChangeDebounced(draft);
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [draft, onSearchChangeDebounced]);

  const normalizedSearch = useMemo(() => draft, [draft]);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 ring-1 ring-white/10">
            <span className="text-xl">📦</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-white/80">Campus Store</div>
          </div>
        </div>

        <div className="flex-1 text-center">
          <div ref={titleRef} className="text-lg font-semibold tracking-wide text-white">
            ProductHub
          </div>
          <div className="mt-0.5 text-xs text-white/60">Fresh deals, every day</div>
        </div>

        <div className="w-full max-w-[340px]">
          <label className="sr-only" htmlFor="search">
            Search products
          </label>
          <div className="relative">
            <input
              id="search"
              value={normalizedSearch}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 focus:border-cyan-400/40 focus:bg-white/10"
              type="text"
            />
            {normalizedSearch ? (
              <button
                type="button"
                onClick={() => setDraft("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

