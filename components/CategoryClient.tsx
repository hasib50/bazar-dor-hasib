"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { ProductGrid } from "@/components/ProductGrid";

export function CategoryClient({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState("default");

  const sorted = useMemo(() => {
    const copy = [...products];

    if (sort === "asc") {
      copy.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      copy.sort((a, b) => b.price - a.price);
    }

    return copy;
  }, [products, sort]);

  return (
    <div className="w-full">
      {/* Filter and sort bar */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#e6ece5] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="font-bold text-[#263329]">
            পণ্য সাজান
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            আপনার পছন্দ অনুযায়ী দাম নির্বাচন করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="product-sort"
            className="shrink-0 text-sm font-medium text-slate-500"
          >
            সাজান:
          </label>

          <select
            id="product-sort"
            aria-label="পণ্যের দাম অনুযায়ী সাজান"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 min-w-0 flex-1 rounded-xl border border-[#dce5dc] bg-[#fbfdfb] px-3 text-sm font-medium text-[#263329] outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100 sm:w-52 sm:flex-none"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Product count */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          মোট{" "}
          <span className="font-bold text-[#263329]">
            {sorted.length}
          </span>{" "}
          টি পণ্য
        </p>

        {sort !== "default" && (
          <button
            type="button"
            onClick={() => setSort("default")}
            className="text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            সাজানো রিসেট করুন
          </button>
        )}
      </div>

      {/* Product cards */}
      <ProductGrid products={sorted} />
    </div>
  );
}
