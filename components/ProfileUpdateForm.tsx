"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function ProfileUpdateForm({
  initialName,
}: {
  initialName: string;
}) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("নাম লিখুন");
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });

      if (result.error) {
        toast.error(result.error.message || "আপডেট করা যায়নি");
        return;
      }

      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("আপডেট করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <label
        htmlFor="profile-name"
        className="block text-sm font-medium text-[#26332b]"
      >
        নাম
      </label>

      <input
        id="profile-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-2 h-10 w-full rounded-lg border border-[#dfe7e0] bg-transparent px-3 text-sm text-[#26332b] outline-none transition focus:border-[#078b43] focus:ring-2 focus:ring-[#078b43]/10"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-[#078b43] px-4 text-sm font-semibold text-white shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition hover:bg-[#067a3b] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "আপডেট"
        )}
      </button>
    </form>
  );
}