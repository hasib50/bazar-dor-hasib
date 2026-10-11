
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="size-5 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.5l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.8 28.1a12 12 0 0 1 0-7.6v-5.2H5.9a20 20 0 0 0 0 18l6.9-5.2Z"
      />
      <path
        fill="#EA4335"
        d="M24 12.3c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.3 29.5 4.5 24 4.5a20 20 0 0 0-18.1 10.8l6.9 5.2c1.6-4.7 6-8.2 11.2-8.2Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0 fill-current"
      aria-hidden="true"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.2.8-.5v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.4.1-3 0 0 .9-.3 3 1.2a10.6 10.6 0 0 1 5.6 0c2.1-1.5 3-1.2 3-1.2.6 1.6.2 2.7.1 3 .7.8 1.2 1.8 1.2 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1 .8 2.1v3.1c0 .3.2.6.8.5A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

export function AuthForm({
  mode,
}: {
  mode: "signin" | "signup";
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signup = mode === "signup";

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (signup && !form.name.trim()) {
      return toast.error("আপনার নাম লিখুন");
    }

    if (!form.email.trim()) {
      return toast.error("ইমেইল লিখুন");
    }

    if (form.password.length < 8) {
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    }

    if (signup && form.password !== form.confirmPassword) {
      return toast.error("পাসওয়ার্ড দুটি মিলছে না");
    }

    setLoading(true);

    try {
      const result = signup
        ? await authClient.signUp.email({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          })
        : await authClient.signIn.email({
            email: form.email.trim(),
            password: form.password,
          });

      if (result.error) {
        toast.error(result.error.message || "কিছু সমস্যা হয়েছে");
        return;
      }

      toast.success(
        signup
          ? "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে"
          : "সফলভাবে সাইন ইন হয়েছে"
      );

      router.push(signup ? "/signin" : "/");
      router.refresh();
    } catch {
      toast.error(
        "Authentication চালু হয়নি। আগে npm run auth:migrate চালাও।"
      );
    } finally {
      setLoading(false);
    }
  }

  
  async function social(provider: "google" | "github") {
    setLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: `/?socialLogin=success&provider=${provider}`,
      });

      if (result.error) {
        toast.error(
          result.error.message || `${provider} login ব্যর্থ হয়েছে`
        );
        setLoading(false);
      }
    } catch {
      toast.error("Social login শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  }


  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-[#dfe7e0] bg-transparent px-3 text-sm text-[#26332b] outline-none transition focus:border-[#078b43] focus:ring-2 focus:ring-[#078b43]/10";

  const socialButtonClass =
    "flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-[#dfe7e0] bg-transparent px-2 text-xs font-semibold text-[#26332b] transition hover:bg-[#f0f6f1] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm";

  return (
    <div className="mx-auto w-full max-w-[416px] rounded-2xl border border-[#dfe7e0] bg-[#f9fcfa] p-5 sm:p-6">

      <form onSubmit={submit} className="mt-6 space-y-4">
        {signup && (
          <label className="block text-sm font-medium text-[#26332b]">
            নাম
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className={inputClass}
              placeholder="যেমন: রহিম উদ্দিন"
            />
          </label>
        )}

        <label className="block text-sm font-medium text-[#26332b]">
          ইমেইল
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm font-medium text-[#26332b]">
          পাসওয়ার্ড
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className={inputClass}
            placeholder="কমপক্ষে ৮ অক্ষর"
          />
        </label>

        {signup && (
          <label className="block text-sm font-medium text-[#26332b]">
            পাসওয়ার্ড নিশ্চিত করুন
            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className={inputClass}
              placeholder="আবার লিখুন"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-full items-center justify-center rounded-lg bg-[#078b43] px-4 text-sm font-bold text-white shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition hover:bg-[#067a3b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : signup ? (
            "অ্যাকাউন্ট তৈরি করুন"
          ) : (
            "সাইন ইন"
          )}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-[#68736b]">
        <span className="h-px flex-1 bg-[#dfe7e0]" />
        <span>অথবা</span>
        <span className="h-px flex-1 bg-[#dfe7e0]" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => social("google")}
          className={socialButtonClass}
        >
          <GoogleIcon />
          <span>Google দিয়ে চালিয়ে যান</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => social("github")}
          className={socialButtonClass}
        >
          <GitHubIcon />
          <span>GitHub দিয়ে চালিয়ে যান</span>
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-[#26332b]">
        {signup ? "অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}
        <Link
          href={signup ? "/signin" : "/signup"}
          className="text-[#078b43] hover:underline"
        >
          {signup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
        </Link>
      </p>

      <Link
        href="/"
        className="mt-6 block text-center text-sm text-[#849087] transition hover:text-[#26332b]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
