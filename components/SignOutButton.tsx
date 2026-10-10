"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const result = await authClient.signOut();

    if (result.error) {
      toast.error("সাইন আউট করা যায়নি");
      return;
    }

    toast.success("সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500 bg-transparent px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
      onClick={handleSignOut}
    >
      <span aria-hidden="true" className="text-lg leading-none">
        ↩
      </span>
      সাইন আউট
    </button>
  );
}
