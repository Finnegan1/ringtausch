import { AuthForm } from "@/components/authentication/auth-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthForm mode="sign-in" />
    </div>
  );
}
