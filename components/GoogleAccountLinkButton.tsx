
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export function GoogleAccountLinkButton() {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  if (isPending || !session) return null;

  async function linkGoogle() {
    setLoading(true);

    try {
      const result = await authClient.linkSocial({
        provider: "google",
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(result.error.message || "Google account link করা যায়নি");
        setLoading(false);
      }
    } catch {
      toast.error("Google account link করতে সমস্যা হয়েছে");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={linkGoogle}
      disabled={loading}
      className="rounded-lg bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
    >
      {loading ? "অপেক্ষা করুন..." : "Link Google Account"}
    </button>
  );
}