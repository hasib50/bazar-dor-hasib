import type { Product } from "@/types";
import { ProductGrid } from "@/components/ProductGrid";

function Section({ title, subtitle, products, id }: { title: string; subtitle?: string; products: Product[]; id?: string }) {
  return <section id={id} className="container-page mt-10"><div className="mb-4"><h2 className="text-xl font-black sm:text-2xl">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div><ProductGrid products={products} /></section>;
}

export function HomeSections({ products }: { products: Product[] }) {
  const risers = [...products].filter((p) => p.change > 0).sort((a,b) => b.change-a.change).slice(0,6);
  const fallers = [...products].filter((p) => p.change < 0).sort((a,b) => a.change-b.change).slice(0,6);
  return <>
    {risers.length > 0 && <Section title="🔺 আজ দাম বেড়েছে" products={risers} />}
    {fallers.length > 0 && <Section title="🔻 আজ দাম কমেছে" products={fallers} />}
    <Section id="সব-পণ্য" title="সব পণ্য" subtitle="সব পণ্যের আজকের বাজার দর এক জায়গায়" products={products} />
  </>;
}
