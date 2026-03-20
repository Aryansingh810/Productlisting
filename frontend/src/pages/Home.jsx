import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Filters from "../components/Filters.jsx";
import ProductCard from "../components/ProductCard.jsx";
import AddProduct from "../components/AddProduct.jsx";
import { fetchProducts } from "../services/api.js";

const DEFAULT_FILTERS = {
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
  search: "",
};

export default function Home() {
  // Draft filters = what user is currently editing in the UI
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  // Applied filters = what the product grid is currently using
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [hasApplied, setHasApplied] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  const gridRef = useRef(null);

  function onSearchChangeDebounced(value) {
    setDraftFilters((prev) => ({ ...prev, search: value }));
  }

  const categories = useMemo(() => {
    const set = new Set(
      products.map((p) => p.category).filter((c) => typeof c === "string" && c)
    );
    const arr = Array.from(set);
    if (arr.length) return arr.sort();
    return ["Electronics", "Fashion", "Home", "Books", "Sports"];
  }, [products]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!hasApplied) return;
      setLoading(true);
      setError("");
      try {
        const params = {
          category: appliedFilters.category || "",
          minPrice: appliedFilters.minPrice || "",
          maxPrice: appliedFilters.maxPrice || "",
          sort: appliedFilters.sort || "",
          search: appliedFilters.search || "",
        };

        const data = await fetchProducts(params);
        if (cancelled) return;
        setProducts(Array.isArray(data?.products) ? data.products : []);
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch products."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [
    appliedFilters.category,
    appliedFilters.minPrice,
    appliedFilters.maxPrice,
    appliedFilters.sort,
    appliedFilters.search,
    hasApplied,
    refreshTick,
  ]);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = Array.from(gridRef.current.querySelectorAll(".product-card"));
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
      }
    );
  }, [products]);

  function applyFilters() {
    setHasApplied(true);
    setAppliedFilters(draftFilters);
  }

  function resetFilters() {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setHasApplied(false);
    setProducts([]);
    setError("");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-500/10 via-slate-950 to-indigo-500/10">
      <Navbar
        initialSearch={draftFilters.search}
        onSearchChangeDebounced={onSearchChangeDebounced}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="hidden lg:block">
            <Filters
              categories={categories}
              filters={draftFilters}
              onChange={setDraftFilters}
              onReset={resetFilters}
              onApply={applyFilters}
            />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm text-white/70">
                Showing <span className="font-semibold text-white/90">{products.length}</span>{" "}
                products
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("filters-mobile")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                >
                  Filters
                </button>
                <button
                  type="button"
                  onClick={() => setDraftFilters((p) => ({ ...p, search: "" }))}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                >
                  Clear Search
                </button>
              </div>
            </div>

            <div id="filters-mobile" className="lg:hidden">
              <Filters
                categories={categories}
                filters={draftFilters}
                onChange={setDraftFilters}
                onReset={resetFilters}
                onApply={applyFilters}
              />
            </div>

            {!hasApplied ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/75 backdrop-blur">
                Set your filters (and optional search), then click{" "}
                <span className="font-semibold text-white">Apply</span> to load
                products.
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur">
                  <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
                  <span className="text-sm text-white/80">Loading products...</span>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
                {error}
              </div>
            ) : (
              <div
                ref={gridRef}
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}

            <AddProduct onAdded={() => setRefreshTick((t) => t + 1)} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

