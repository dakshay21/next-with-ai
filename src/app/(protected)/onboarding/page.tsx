import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { getCurrentUser, getProfileByUserId } from "@/lib/auth";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfileByUserId(user.id);

  if (profile) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">Set up your profile</h1>
        <p className="mb-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Pick a unique handle for your public bookmark page
        </p>
        <OnboardingForm />
      </div>
    </main>
  );
}
