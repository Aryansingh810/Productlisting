import { useEffect, useState } from "react";
import { createProduct } from "../services/api";

export default function AddProduct({ onAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "success", text: "" });

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "success", text: "" });
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      if (imageFile) formData.append("image", imageFile);

      await createProduct(formData);

      setName("");
      setPrice("");
      setCategory("");
      setImageFile(null);
      setMessage({ type: "success", text: "Product added successfully!" });

      onAdded?.();
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add product.";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6">
      <div className="mb-4 text-sm font-semibold text-white/90">
        Admin / Add Product
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:grid-cols-2"
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-white/70">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/40"
            placeholder="e.g. Apple iPhone"
            required
            type="text"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-white/70">Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/40"
            placeholder="e.g. 999"
            required
            type="number"
            min={0}
            step={0.01}
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-white/70">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/40"
            placeholder="e.g. Electronics"
            required
            type="text"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs font-medium text-white/70">
            Image Upload (JPG/PNG, max 2MB)
          </label>
          <input
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
            }}
            className="block w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500/80 file:px-4 file:py-2 file:text-xs file:text-white hover:file:bg-cyan-500"
            type="file"
            accept="image/png,image/jpeg"
            required
          />

          {previewUrl ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/10">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-44 w-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/50">
              Select an image to preview it before uploading.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 sm:col-span-2">
          <div className="text-sm">
            {message.text ? (
              <span
                className={
                  message.type === "error" ? "text-red-300" : "text-emerald-300"
                }
              >
                {message.text}
              </span>
            ) : null}
          </div>
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500/90 to-indigo-500/90 px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
            type="submit"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/50 border-t-black" />
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

