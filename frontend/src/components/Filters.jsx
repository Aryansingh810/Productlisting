export default function Filters({
  categories = [],
  filters,
  onChange,
  onReset,
  onApply,
}) {
  const categoriesWithAll = ["All", ...(categories || [])];

  function setField(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <aside className="glass rounded-3xl p-4">
      <div className="mb-4 text-sm font-semibold text-white/90">Filters</div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/70">Category</label>
          <select
            value={filters.category || "All"}
            onChange={(e) => setField("category", e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/40"
          >
            {categoriesWithAll.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Min Price</label>
            <input
              value={filters.minPrice}
              onChange={(e) => setField("minPrice", e.target.value)}
              type="number"
              min={0}
              step={0.01}
              placeholder="0"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Max Price</label>
            <input
              value={filters.maxPrice}
              onChange={(e) => setField("maxPrice", e.target.value)}
              type="number"
              min={0}
              step={0.01}
              placeholder="1000"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-white/70">Sort By Price</label>
          <select
            value={filters.sort || ""}
            onChange={(e) => setField("sort", e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/40"
          >
            <option value="">Default</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-2xl bg-gradient-to-r from-cyan-500/90 to-indigo-500/90 px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Apply
          </button>
        </div>
      </div>
    </aside>
  );
}

