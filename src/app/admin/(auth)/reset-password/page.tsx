import { SetPasswordForm } from "@/components/admin/LoginForm";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl">
        <h1 className="font-display text-2xl font-bold text-ink">Choose a password</h1>
        <SetPasswordForm />
      </div>
    </main>
  );
}
