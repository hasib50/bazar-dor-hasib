import Link from "next/link";
import type { Product } from "@/types";
import { changeText, formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const up = product.change > 0;
  const down = product.change < 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-[#e6ece5] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#c9ddc9] hover:shadow-lg sm:p-5"
    >

{/* Product information */}
      <div className="flex items-center gap-3">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#f3f8f1] text-3xl transition-colors group-hover:bg-[#e8f3e5]">
          {product.icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-[#263329] transition-colors group-hover:text-[#287a3d]">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
  প্রতি {{
    kg: "কেজি",
    dozon: "ডজন",
    dozen: "ডজন",
    litre: "লিটার",
    liter: "লিটার",
    piece: "টি",
  }[product.unit.toLowerCase()] ?? product.unit}
</p>
        </div>

        <span className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>


{/* Price information */}
      <div className="mt-5 pt-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">
              আজকের দাম
            </p>

            <p className="mt-1 text-xl font-extrabold tracking-tight text-[#263329] sm:text-2xl">
              {formatPrice(product.price)}
              <span className="ml-1 text-sm font-semibold text-slate-500">
                টাকা
              </span>
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
              up
                ? "bg-red-50 text-red-600"
                : down
                  ? "bg-green-50 text-green-700"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {changeText(product.change)}
          </span>
        </div>
      </div>
    </Link>
  );
}

