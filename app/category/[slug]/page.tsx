import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { CategoryClient } from "@/components/CategoryClient";

export const revalidate = 60;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [products, categories] = await Promise.all([
    getProducts(slug),
    getCategories().catch(() => []),
  ]);

  const category = categories.find((item) => item.slug === slug);
  const categoryName = category?.name ?? slug;

  if (!products.length) {
    return (
      <main className="container-page min-h-[calc(100vh-220px)] py-10 sm:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-green-700">
            হোম
          </Link>
          <span aria-hidden="true">›</span>
          <span className="truncate text-[#263329]">
            {categoryName}
          </span>
        </nav>

        <div className="mx-auto max-w-xl rounded-3xl border border-[#e6ece5] bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#f0f7ed] text-5xl">
            📦
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[#263329] sm:text-3xl">
            কোনো পণ্য পাওয়া যায়নি
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই। অন্য ক্যাটাগরি থেকে
            আপনার পছন্দের পণ্য খুঁজে দেখুন।
          </p>

          <Link
            href="/"
            className="btn btn-green mt-7 inline-flex min-h-11 items-center justify-center rounded-xl border-0 px-6 font-semibold"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page min-h-[calc(100vh-220px)] py-6 sm:py-9">

{/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500"
      >
        <Link href="/" className="transition hover:text-green-700">
          হোম
        </Link>

        <span aria-hidden="true" className="text-slate-300">
          /
        </span>

        <span className="font-medium text-[#263329]">
          {categoryName}
        </span>
      </nav>

{/* Category header */}

      <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#e4ece1] bg-gradient-to-br from-white via-white to-[#f0f7ed] p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-[#dcebd5]/40 blur-2xl" />

        <div className="relative flex items-center gap-4 sm:gap-5">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-[#e1ebdd] bg-white text-4xl shadow-sm sm:size-[76px] sm:text-5xl">
            {category?.icon ?? "📦"}
          </div>

          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-green-700">
              পণ্যের ক্যাটাগরি
            </p>

            <h1 className="break-words text-2xl font-extrabold tracking-tight text-[#263329] sm:text-3xl">
              {categoryName}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              এই ক্যাটাগরির পণ্যের আজকের দাম ও মূল্য পরিবর্তন দেখুন।
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#dce9d7] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#42634a]">
              <span className="size-2 rounded-full bg-green-600" />
              মোট {products.length}টি পণ্য
            </div>
          </div>
        </div>
      </section>

{/* Products, filters and sorting */}
      <section
        aria-label={`${categoryName} ক্যাটাগরির পণ্য`}
      >
        <CategoryClient products={products} />
      </section>
    </main>
  );
}
