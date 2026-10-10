import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#dce5dc] bg-white px-5 py-12 text-center">
        <div className="text-4xl">🛒</div>
        <p className="mt-3 font-semibold text-[#263329]">
          কোনো পণ্য পাওয়া যায়নি
        </p>
        <p className="mt-1 text-sm text-slate-500">
          অন্য ক্যাটাগরি নির্বাচন করে দেখুন।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={String(product.id)}
          product={product}
        />
      ))}
    </div>
  );
}