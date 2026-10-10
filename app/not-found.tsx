import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[65vh] place-items-center py-16">
      <div className="card-soft max-w-lg p-10 text-center">
        <div className="text-6xl">🛒</div>

        <h1 className="mt-4 text-4xl font-black">
          পেজটি পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-slate-500">
          আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা লিংকটি ভুল।
        </p>

        <Link
          href="/"
          className="btn btn-green mt-7 border-0"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}