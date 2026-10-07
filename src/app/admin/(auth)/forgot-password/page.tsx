import { PasswordResetRequest } from "@/components/admin/LoginForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl">
        <h1 className="font-display text-2xl font-bold text-ink">Reset your password</h1>
        <PasswordResetRequest />
      </div>
    </main>
  );
}
