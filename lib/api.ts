import type { Category, MarketPrice, Product } from "@/types";
import { parseNumber, slugify } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.api-store.workers.dev/api/bazardor";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
}

function unwrap(payload: any): any {
  return payload?.data ?? payload?.products ?? payload?.items ?? payload?.results ?? payload;
}

function normalizeProduct(raw: any, index = 0): Product {

  // Bazar Dor API fields: 
  
  const price = parseNumber(raw?.today ?? raw?.price ?? raw?.todayPrice ?? raw?.currentPrice ?? raw?.latestPrice ?? raw?.averagePrice);
  const change = parseNumber(raw?.change?.pct ?? raw?.change ?? raw?.percentageChange ?? raw?.changePercent ?? raw?.percent ?? 0);
  const name = String(raw?.nameBn ?? raw?.name ?? raw?.title ?? `পণ্য ${index + 1}`);
  const slug = String(raw?.slug ?? raw?.code ?? raw?.id ?? slugify(name));
  const marketsRaw = raw?.markets ?? raw?.marketPrices ?? raw?.prices ?? [];
  const markets: MarketPrice[] = Array.isArray(marketsRaw)
    ? marketsRaw.map((m: any) => {
        const min = parseNumber(m?.min ?? m?.minimum ?? m?.minPrice ?? m?.lowest);
        const max = parseNumber(m?.max ?? m?.maximum ?? m?.maxPrice ?? m?.highest);
        return {
          market: String(m?.market ?? m?.bazar ?? m?.name ?? "বাজার"),
          district: String(m?.division ?? m?.district ?? "") || undefined,
          min,
          max,
          avg: parseNumber(m?.avg ?? m?.average ?? m?.averagePrice ?? m?.price) || (min && max ? (min + max) / 2 : price),
        };
      })
    : [];

  return {
    id: raw?.id ?? slug,
    name,
    slug,
    category: String(raw?.category?.slug ?? raw?.categorySlug ?? raw?.category ?? "other"),
    categoryName: String(raw?.categoryNameBn ?? raw?.category?.nameBn ?? raw?.category?.name ?? raw?.categoryName ?? "অন্যান্য"),
    unit: String(raw?.unit ?? raw?.measure ?? raw?.unitName ?? "kg"),
    price,
    change,
    icon: String(raw?.image ?? raw?.categoryIcon ?? raw?.icon ?? raw?.emoji ?? "🛒"),
    description: raw?.description ?? raw?.summary ?? raw?.subtitle,
    markets,
    minPrice: markets.length ? Math.min(...markets.map((m) => m.min || m.avg)) : price,
    maxPrice: markets.length ? Math.max(...markets.map((m) => m.max || m.avg)) : price,
    avgPrice: markets.length ? markets.reduce((sum, m) => sum + (m.avg || m.min || m.max), 0) / markets.length : price,
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const path = category ? `/products?category=${encodeURIComponent(category)}` : "/products";
    const payload = await request<any>(path);
    const data = unwrap(payload);
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const payload = await request<any>(`/products/${encodeURIComponent(slug)}`);
    const data = unwrap(payload);
    if (Array.isArray(data)) return data.length ? normalizeProduct(data[0]) : null;
    if (data && typeof data === "object") return normalizeProduct(data);
  } catch {
    // Fall back to the list if the API doesn't resolve slugs directly.
  }
  const products = await getProducts();
  return products.find((p) => String(p.slug) === String(slug) || String(p.id) === String(slug)) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const payload = await request<any>("/categories");
    const data = unwrap(payload);
    if (Array.isArray(data) && data.length) {
      return data.map((c: any) => ({
        slug: String(c?.slug ?? c?.id ?? c?.category ?? slugify(String(c?.nameBn ?? c?.name ?? c?.title ?? "other"))),
        name: String(c?.nameBn ?? c?.categoryNameBn ?? c?.name ?? c?.title ?? c?.label ?? "অন্যান্য"),
        icon: String(c?.icon ?? c?.categoryIcon ?? c?.emoji ?? "📦"),
      }));
    }
  } catch {
    
  }

  const products = await getProducts();
  const unique = new Map<string, Category>();
  for (const p of products) {
    if (!unique.has(p.category)) unique.set(p.category, { slug: p.category, name: p.categoryName ?? p.category, icon: p.icon });
  }
  return [...unique.values()];
}
