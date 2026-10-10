
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getProduct } from "@/lib/api";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/signin?reason=protected&redirect=/product/${encodeURIComponent(slug)}`
    );
  }

  const product = await getProduct(slug);

  if (!product) {
    return (
      <main className="container-page py-12">
        <div className="card-soft mx-auto max-w-xl p-10 text-center">
          <div className="text-5xl">📦</div>
          <h1 className="mt-4 text-3xl font-black">
            পণ্যটি পাওয়া যায়নি
          </h1>
          <Link href="/" className="btn btn-green mt-6 border-0">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const min = product.minPrice ?? product.price;
  const max = product.maxPrice ?? product.price;
  const avg = product.avgPrice ?? product.price;
  const markets = product.markets ?? [];

  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#eff5f0] pb-24 pt-7 text-[#26332b]">
      <div className="container-page mx-auto max-w-[1000px] px-4">

{/* Breadcrumb */}
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs text-[#68736b]">
          <Link href="/" className="hover:text-[#078b43]">
            হোম
          </Link>
          <span>›</span>
          <span>{product.categoryName ?? product.category}</span>
          <span>›</span>
          <span className="text-[#26332b]">{product.name}</span>
        </nav>

        

{/* Product overview */}
<section className="rounded-2xl border border-[#dfe7e0] bg-[#f9fcfa] p-5 transition-all duration-200 hover:border-[#078b43]/50 hover:shadow-[0_4px_14px_rgba(7,139,67,0.08)]">
  <div className="flex min-h-[132px] items-center justify-between gap-4">
    <div className="flex min-w-0 items-center gap-4">
      <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-[#eff5f0] text-5xl transition-colors duration-200 group-hover:bg-[#e5f2e8]">
        {product.icon}
      </div>

      <div className="min-w-0">
        <h1 className="text-2xl font-black leading-tight tracking-tight text-[#202b24] sm:text-[28px]">
          {product.name}
        </h1>

        <p className="mt-1 text-sm text-[#849087]">
          প্রতি {product.unit === "kg" ? "কেজি" : product.unit} ·{" "}
          {product.categoryName ?? product.category}
        </p>

        <p className="mt-2 text-xs leading-5 text-[#26332b] sm:text-sm">
          {product.description ?? "গতকালের তুলনায় আজকের বাজার দর"}
        </p>
      </div>
    </div>

    <div className="flex min-h-[132px] w-[118px] shrink-0 flex-col items-center justify-center rounded-2xl bg-[#eff5f0] px-3 py-3 transition-colors duration-200 hover:bg-[#e5f2e8]">
      <p className="text-xs text-[#68736b]">আজকের দাম</p>

      <p className="mt-1 text-[28px] font-black leading-tight text-[#202b24]">
        {formatPrice(product.price)}
      </p>

      <p className="mt-1 text-xs text-[#68736b]">
        টাকা / প্রতি {product.unit === "kg" ? "কেজি" : product.unit}
      </p>

      <p className="mt-1 text-xs font-bold text-[#e53935]">
        ▲ ৩.৬%
      </p>
    </div>
  </div>
</section>



       
{/* Price summary and market table */}
<section className="mt-5 rounded-2xl border border-[#dfe7e0] bg-[#f9fcfa] p-4 transition-all duration-200 hover:border-[#078b43]/50 hover:shadow-[0_4px_14px_rgba(7,139,67,0.08)] sm:p-5">
  <h2 className="text-base font-black">
    দামের সারসংক্ষেপ
  </h2>

  <div className="mt-3 grid gap-3 sm:grid-cols-3">
    <div className="rounded-2xl border border-[#dfe7e0] p-4 transition-all duration-200 hover:border-[#078b43]/50 hover:shadow-[0_4px_14px_rgba(7,139,67,0.08)]">
      <p className="text-xs text-[#68736b]">সর্বনিম্ন দাম</p>
      <p className="mt-1 text-xl font-black text-[#079447]">
        {formatPrice(min)}{" "}
        <span className="text-sm font-medium">টাকা</span>
      </p>
      <p className="mt-1 text-[11px] text-[#68736b]">
        সবচেয়ে কম দামের বাজার
      </p>
    </div>

    <div className="rounded-2xl border border-[#dfe7e0] p-4 transition-all duration-200 hover:border-[#078b43]/50 hover:shadow-[0_4px_14px_rgba(7,139,67,0.08)]">
      <p className="text-xs text-[#68736b]">সর্বাধিক দাম</p>
      <p className="mt-1 text-xl font-black text-[#e53935]">
        {formatPrice(max)}{" "}
        <span className="text-sm font-medium">টাকা</span>
      </p>
      <p className="mt-1 text-[11px] text-[#68736b]">
        সবচেয়ে বেশি দামের বাজার
      </p>
    </div>

    <div className="rounded-2xl border border-[#dfe7e0] p-4 transition-all duration-200 hover:border-[#078b43]/50 hover:shadow-[0_4px_14px_rgba(7,139,67,0.08)]">
      <p className="text-xs text-[#68736b]">গড় দাম</p>
      <p className="mt-1 text-xl font-black text-[#079447]">
        {formatPrice(avg)}{" "}
        <span className="text-sm font-medium">টাকা</span>
      </p>
      <p className="mt-1 text-[11px] text-[#68736b]">
        প্রতি একক হিসেবে
      </p>
    </div>
  </div>


          
{/* Market-wise prices */}
<h2 className="mb-3 mt-5 text-base font-black">
  বাজারভিত্তিক আজকের দাম
</h2>

{markets.length ? (
  <div className="overflow-x-auto rounded-2xl border border-[#dfe7e0] transition-all duration-200 hover:border-[#078b43]/50 hover:shadow-[0_4px_14px_rgba(7,139,67,0.08)]">
    <table className="w-full min-w-[650px] border-collapse text-left text-xs">
      <thead>
        <tr className="bg-[#f9fcfa] text-[#849087]">
          <th className="px-3 py-3 font-semibold">বাজার</th>
          <th className="px-3 py-3 font-semibold">জেলা</th>
          <th className="px-3 py-3 text-right font-semibold">
            সর্বনিম্ন
          </th>
          <th className="px-3 py-3 text-right font-semibold">
            সর্বাধিক
          </th>
          <th className="px-3 py-3 text-right font-semibold">
            গড়
          </th>
        </tr>
      </thead>

      <tbody>
        {markets.map((m, i) => (
          <tr
            key={`${m.market}-${i}`}
            className={`border-t border-[#dfe7e0] transition-colors duration-200 hover:bg-[#e5f2e8] ${
              i % 2 === 1 ? "bg-[#eff5f0]" : "bg-[#f9fcfa]"
            }`}
          >
            <td className="px-3 py-3 font-medium">
              {m.market}
            </td>
            <td className="px-3 py-3">
              {m.district ?? "—"}
            </td>
            <td className="px-3 py-3 text-right">
              {formatPrice(m.min || m.avg)} টাকা
            </td>
            <td className="px-3 py-3 text-right">
              {formatPrice(m.max || m.avg)} টাকা
            </td>
            <td className="px-3 py-3 text-right font-bold">
              {formatPrice(m.avg)} টাকা
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="rounded-2xl border border-[#dfe7e0] bg-[#eff5f0] p-8 text-center text-sm text-[#68736b] transition-all duration-200 hover:border-[#078b43]/50 hover:shadow-[0_4px_14px_rgba(7,139,67,0.08)]">
    এই পণ্যের বাজারভিত্তিক তথ্য API-তে পাওয়া যায়নি।
  </div>
)}
</section>
</div>
</main>

  );
}
