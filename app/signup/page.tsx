
import { AuthForm } from "@/components/AuthForm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return (
    <main className="container-page flex min-h-[calc(100vh-224px)] flex-col items-center px-4 py-10 sm:py-12">
  <div className="w-full max-w-[416px]">
    <div className="mb-6 text-center">
      <h1 className="text-2xl font-black text-[#26332b]">
        অ্যাকাউন্ট তৈরি করুন
      </h1>
      <p className="mt-1 text-sm text-[#68736b]">
        বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
      </p>
    </div>

    <AuthForm mode="signup" />
  </div>
</main>
  );
}
