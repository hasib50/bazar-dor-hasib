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

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [categories, setCategories] =
    useState<Category[]>(fallbackCategories);
  const [ticker, setTicker] = useState<Product[]>([]);
  const [menu, setMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCategories()
      .then((items) => {
        if (items.length) setCategories(items);
      })
      .catch(() => undefined);

    const controller = new AbortController();

    

fetch(
  "https://api.abcz.workers.dev/api/bazardor/products",
  { signal: controller.signal }
)


      .then((response) => {
        if (!response.ok) {
          throw new Error("Market data unavailable");
        }
        return response.json();
      })
      .then((payload) => {
        const raw =
          payload?.data ??
          payload?.products ??
          payload?.items ??
          payload;

        if (Array.isArray(raw)) {
          setTicker(
            raw.slice(0, 12).map((p: any, index: number) => ({
              id: p?.id ?? index,
              name: p?.nameBn ?? p?.name ?? p?.title ?? "পণ্য",
              slug: p?.slug ?? String(p?.id ?? index),
              category: p?.category ?? "other",
              unit: p?.unit ?? "প্রতি কেজি",
              price: Number(
                p?.today ?? p?.price ?? p?.todayPrice ?? 0
              ),
              change: Number(
                p?.change?.pct ??
                  p?.change ??
                  p?.percentageChange ??
                  p?.changePercent ??
                  0
              ),
              icon:
                p?.image ??
                p?.categoryIcon ??
                p?.icon ??
                p?.emoji ??
                "🛒",
            }))
          );
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event: Event) {
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
              {todayBn()}
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
        {doubled.length ? (
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
            আজকের বাজার দর লোড হচ্ছে...
          </div>
        )}
      </div>
    </header>
  );
}
