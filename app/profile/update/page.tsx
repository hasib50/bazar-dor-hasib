
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileUpdateForm } from "@/components/ProfileUpdateForm";

export const dynamic = "force-dynamic";

export default async function UpdateProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=protected&redirect=/profile/update");
  }

  return (
    <main className="container-page min-h-[calc(100vh-220px)] py-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-black text-[#26332b]">
          তথ্য আপডেট করুন
        </h1>

        <p className="mt-1 text-sm text-[#68736b]">
          আপনার নাম পরিবর্তন করুন।
        </p>

        <section className="mt-6 rounded-2xl border border-[#dfe7e0] bg-[#f9fcfa] p-5 sm:p-6">
          <h2 className="font-bold text-[#26332b]">তথ্য</h2>

          <div className="mt-6">
            <ProfileUpdateForm
              initialName={session.user.name ?? ""}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
