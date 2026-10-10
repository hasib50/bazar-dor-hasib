
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";
import { ProfileUpdateForm } from "@/components/ProfileUpdateForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=protected&redirect=/profile");
  }

  return (
    <main className="container-page min-h-[calc(100vh-220px)] py-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-black text-[#26332b]">
          আমার প্রোফাইল
        </h1>

        <p className="mt-1 text-sm text-[#68736b]">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>

        <section className="mt-6 rounded-2xl border border-[#dfe7e0] bg-[#f9fcfa] p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="size-20 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-[#edf1ee] text-3xl">
                  👤
                </div>
              )}

              <div className="min-w-0">
                <h2 className="break-words text-xl font-bold text-[#26332b]">
                  {session.user.name}
                </h2>
                <p className="mt-1 break-all text-sm text-[#68736b] sm:text-base">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <SignOutButton />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#dfe7e0] bg-[#f9fcfa] p-5 sm:p-6">
          <h2 className="font-bold text-[#26332b]">তথ্য</h2>

          <div className="mt-8">
            <ProfileUpdateForm initialName={session.user.name ?? ""} />
          </div>
        </section>
      </div>
    </main>
  );
}