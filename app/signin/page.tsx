
import { AuthForm } from "@/components/AuthForm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignInNotice } from "./SignInNotice";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    reason?: string;
    redirect?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return (
    <>
      <SignInNotice />

      <main className="container-page flex min-h-[calc(100vh-224px)] flex-col items-center px-4 py-10 sm:py-12">
        <div className="w-full max-w-[416px] text-center">
          <h1 className="text-2xl font-black text-[#26332b]">
            সাইন ইন
          </h1>

          <p className="mt-1 text-sm text-[#68736b]">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>

          <div className="mt-6 text-left">
            <AuthForm mode="signin" />
          </div>

          <a
            href="/"
            className="mt-6 inline-block text-sm text-[#849087] transition hover:text-[#26332b]"
          >
            ← হোম পেজে ফিরে যান
          </a>
        </div>
      </main>
    </>
  );
}
