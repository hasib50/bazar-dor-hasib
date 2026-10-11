"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { getCategories } from "@/lib/api";
import type { Category, Product } from "@/types";
import { changeText, formatPrice } from "@/lib/utils";

const fallbackCategories: Category[] = [
  { slug: "chal", name: "চাল", icon: "🍚" },
  { slug: "dal", name: "ডাল", icon: "🫘" },
  { slug: "tel", name: "তেল", icon: "🫙" },
  { slug: "sobji", name: "সবজি", icon: "🥬" },
  { slug: "mach", name: "মাছ", icon: "🐟" },
  { slug: "mangsho", name: "মাংস", icon: "🍗" },
  { slug: "dim-dudh", name: "ডিম-দুধ", icon: "🥛" },
  { slug: "moshla", name: "মসলা", icon: "🌶️" },
];

function todayBn() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

type ApiProduct = {
  id?: string | number;
  _id?: string;
  nameBn?: string;
  name?: string;
  title?: string;
  slug?: string;
  category?: string | { slug?: string; name?: string };
  unit?: string;
  today?: number | string;
  price?: number | string;
  todayPrice?: number | string;
  change?: number | string | { pct?: number | string };
  percentageChange?: number | string;
  changePercent?: number | string;
  image?: string;
  categoryIcon?: string;
  icon?: string;
  emoji?: string;
};

function extractProducts(payload: unknown): ApiProduct[] {
  // Some APIs return the array directly; others wrap it in an object.
  if (Array.isArray(payload)) {
    return payload as ApiProduct[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = payload as Record<string, unknown>;

  for (const key of ["data", "products", "items", "results"]) {
    const value = data[key];

    if (Array.isArray(value)) {
      return value as ApiProduct[];
    }

    // Some APIs use { data: { products: [...] } }.
    if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>;

      for (const nestedKey of [
        "products",
        "items",
        "results",
        "data",
      ]) {
        if (Array.isArray(nested[nestedKey])) {
          return nested[nestedKey] as ApiProduct[];
        }
      }
    }
  }

  return [];
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  
  useEffect(() => {
    if (isPending || !session) return;

    const params = new URLSearchParams(window.location.search);
    const socialLogin = params.get("socialLogin");
    const provider = params.get("provider");

    if (socialLogin !== "success") return;

    if (provider === "google" || provider === "github") {
      toast.success(
        provider === "google"
          ? "Google দিয়ে সফলভাবে সাইন ইন হয়েছে"
          : "GitHub দিয়ে সফলভাবে সাইন ইন হয়েছে"
      );

      // Remove the success marker so refreshing won't show it again.
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [session, isPending]);


  const [dateText, setDateText] = useState("");
  const [categories, setCategories] =
    useState<Category[]>(fallbackCategories);
  const [ticker, setTicker] = useState<Product[]>([]);
  const [menu, setMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Render the date after mounting to prevent hydration mismatch.
  useEffect(() => {
    setDateText(todayBn());
  }, []);

  // Load categories and market prices.
  useEffect(() => {
    const controller = new AbortController();

    getCategories()
      .then((items) => {
        if (items.length && !controller.signal.aborted) {
          setCategories(items);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Failed to load categories:", error);
        }
      });

    async function loadMarketPrices() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

        if (!apiUrl) {
          console.error(
            "Market API URL is missing. Check NEXT_PUBLIC_API_BASE_URL."
          );
          return;
        }

        /*
         * IMPORTANT:
         * Set NEXT_PUBLIC_API_BASE_URL to the actual API endpoint
         * that provides the market-price data.
         */
        const response = await fetch(
  "https://openapi.programming-hero.com/api/bazardor/products",
  {
    signal: controller.signal,
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  }
);

        if (!response.ok) {
          throw new Error(`Market API error: ${response.status}`);
        }

        const payload: unknown = await response.json();
        console.log("Market API URL:", apiUrl);
        console.log("HTTP status:", response.status);
        console.log("Raw API payload:", JSON.stringify(payload, null, 2));

        const raw = extractProducts(payload);

        if (raw.length === 0) {
          console.error(
            "Market API returned no recognizable product array:",
            payload
          );
          setTicker([]);
          return;
        }

        const products: Product[] = raw.slice(0, 12).map((p, index) => {
          const id = p.id ?? p._id ?? index;

          const category =
            typeof p.category === "string"
              ? p.category
              : p.category?.slug ?? p.category?.name ?? "other";

          const changeValue =
            typeof p.change === "object" && p.change !== null
              ? p.change.pct
              : p.change;

          return {
            id,
            name: p.nameBn ?? p.name ?? p.title ?? "পণ্য",
            slug: p.slug ?? String(id),
            category,
            unit: p.unit ?? "প্রতি কেজি",
            price: toNumber(p.today ?? p.todayPrice ?? p.price),
            change: toNumber(
              changeValue ??
                p.percentageChange ??
                p.changePercent ??
                0
            ),
            icon:
              p.image ??
              p.categoryIcon ??
              p.icon ??
              p.emoji ??
              "🛒",
          } as Product;
        });

        if (!controller.signal.aborted) {
          setTicker(products);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Failed to load market prices:", error);
          setTicker([]);
        }
      }
    }

    loadMarketPrices();

    return () => controller.abort();
  }, []);

  // Close the mobile/account menu when navigating.
  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  // Close the account menu when clicking outside.
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const doubled = [...ticker, ...ticker];

  async function logout() {
    try {
      await authClient.signOut();

      setMenu(false);
      toast.success("সফলভাবে সাইন আউট হয়েছে");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  const avatarLetter = (
    session?.user.name || session?.user.email || "U"
  )
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e3eae1] bg-white/95 shadow-[0_2px_12px_rgba(30,50,30,0.04)] backdrop-blur-xl">
      {/* Brand and account */}
      <div className="container-page flex min-h-18 items-center justify-between gap-3 sm:min-h-20 sm:gap-5">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-green-600 to-green-800 text-2xl text-white shadow-md shadow-green-900/15 transition-transform group-hover:scale-105 sm:size-12">
            🛒
          </span>

          <span className="min-w-0">
            <span className="block text-xl font-extrabold leading-tight tracking-tight text-[#243428] sm:text-2xl">
              বাজার দর
            </span>

            <span className="mt-1 block max-w-47.5 truncate text-[10px] font-medium text-slate-500 sm:max-w-none sm:text-xs">
              {dateText || "\u00A0"}
            </span>
          </span>
        </Link>

        {/* Account actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {!isPending && session ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-expanded={menu}
                aria-haspopup="menu"
                aria-label="Account menu"
                onClick={() => setMenu((value) => !value)}
                className="flex items-center gap-2 rounded-2xl border border-transparent p-1.5 transition hover:border-[#e3eae1] hover:bg-[#f5f9f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 sm:gap-2.5 sm:px-2.5"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    className="size-9 rounded-full border-2 border-green-100 object-cover sm:size-10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="grid size-9 place-items-center rounded-full bg-green-100 text-sm font-bold text-green-800 sm:size-10">
                    {avatarLetter}
                  </span>
                )}

                <span className="hidden max-w-32 truncate text-sm font-semibold text-[#263329] sm:block">
                  {session.user.name || session.user.email}
                </span>

                <span
                  className={`text-xs text-slate-500 transition-transform ${
                    menu ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {menu && (
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-[min(280px,calc(100vw-24px))] rounded-2xl border border-[#e3eae1] bg-white p-2 shadow-[0_14px_40px_rgba(20,35,25,0.15)]"
                >
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="truncate text-sm font-bold text-[#263329]">
                      {session.user.name || "ব্যবহারকারী"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    role="menuitem"
                    href="/profile"
                    onClick={() => setMenu(false)}
                    className="mt-1 flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-800"
                  >
                    <span>👤</span>
                    আমার প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <span>↩</span>
                    সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : !isPending ? (
            <>
              <Link
                href="/signin"
                className="rounded-xl px-2.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-800 sm:px-4"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-green-700 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 hover:shadow-md sm:px-4"
              >
                সাইন আপ
              </Link>
            </>
          ) : (
            <span className="size-9 animate-pulse rounded-xl bg-slate-100" />
          )}
        </div>
      </div>

      {/* Category navigation */}
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-[#edf1eb] bg-white"
      >
        <div className="container-page overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1 py-2">
            {categories.map((category) => {
              const active =
                pathname === `/category/${category.slug}` ||
                pathname.startsWith(`/category/${category.slug}/`);

              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-green-50 font-bold text-green-800"
                      : "font-medium text-slate-600 hover:bg-[#f5f8f3] hover:text-green-800"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}

                  {active && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-green-700" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Scrolling market price ticker */}
      <div className="overflow-hidden border-t border-[#e7ece5] bg-[#f8faf7]">
        {doubled.length > 0 ? (
          <div className="ticker-track flex w-max">
            {doubled.map((product, index) => (
              <Link
                href={`/product/${product.slug}`}
                key={`${product.slug}-${index}`}
                className="flex shrink-0 items-center gap-2.5 whitespace-nowrap border-r border-[#e3eae1] px-4 py-2.5 text-xs text-slate-700 transition hover:bg-green-50 sm:gap-3 sm:px-5 sm:text-sm"
              >
                <span className="text-base">{product.icon}</span>

                <span className="font-medium">{product.name}</span>

                <b className="font-bold text-[#263329]">
                  {formatPrice(product.price)} টাকা/
                  {product.unit?.replace("প্রতি ", "") || "কেজি"}
                </b>

                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    product.change > 0
                      ? "bg-red-50 text-red-600"
                      : product.change < 0
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {changeText(product.change)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-2.5 text-center text-xs text-slate-500">
            আজকের বাজার দর আপাতত পাওয়া যাচ্ছে না।
          </div>
        )}
      </div>
    </header>
  );
}
