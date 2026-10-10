"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
  const [today, setToday] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const formattedDate = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date());

      setToday(formattedDate);
    };

    updateDate();

    const timer = setInterval(updateDate, 60_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container-page pt-5 sm:pt-7">
      <div className="relative isolate overflow-hidden rounded-3xl border border-[#e0eadc] bg-gradient-to-br from-[#f5faf1] via-white to-[#edf6e9] shadow-sm">

{/* Decorative background */}

        <div className="pointer-events-none absolute -right-16 -top-20 -z-10 size-64 rounded-full bg-green-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 size-56 rounded-full bg-lime-100/40 blur-3xl" />

        <div className="grid items-center gap-5 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-10 lg:py-10">

{/* Left content */}

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/85 px-3.5 py-2 text-xs font-bold text-green-800 shadow-sm sm:text-sm">
              <span className="size-2 rounded-full bg-green-600" />
              {today || "আজকের তারিখ"}
            </span>

            <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight text-[#203326] sm:text-4xl lg:text-5xl">
              আজকের বাজারের দাম
              <span className="mt-1 block text-green-700">
                এক নজরে
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম—
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
              দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="#সব-পণ্য"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                সব পণ্য দেখুন
                <span aria-hidden="true">→</span>
              </Link>

              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                আপনার নিত্যদিনের বাজারের তথ্য
              </span>
            </div>
          </div>

{/* Right banner image */}

          <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center lg:max-w-none">
            <div className="absolute inset-8 rounded-full bg-green-200/30 blur-2xl" />

            <Image
              src="/images/bazar-hero.png"
              alt="বাজার দর — নিত্যপ্রয়োজনীয় পণ্যের বাজার"
              width={700}
              height={500}
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="relative h-auto max-h-[280px] w-full object-contain sm:max-h-[340px] lg:max-h-[370px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
