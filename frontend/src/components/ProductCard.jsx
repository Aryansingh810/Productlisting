const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function initials(category = "") {
  return category
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default function ProductCard({ product }) {
  const imageSrc = product?.image ? `${API_BASE_URL}${product.image}` : "";

  return (
    <div
      className="product-card group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_-25px_rgba(34,211,238,0.4)]"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={product.name}
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-44 items-center justify-center bg-gradient-to-br from-cyan-400/10 to-indigo-500/10">
          <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-2 text-xs font-semibold text-white/70">
            {initials(product.category)} • No Image
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 text-xs font-semibold tracking-wide text-cyan-200/70">
          {product.category}
        </div>
        <div className="min-h-[48px] text-sm font-semibold text-white/90">{product.name}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold text-white">${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

