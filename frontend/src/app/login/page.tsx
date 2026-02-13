/* Login page with split layout design.

[Task]: T031, T075
[From]: specs/001-user-auth/plan.md, specs/005-ux-improvement/tasks.md

Modern split-screen layout with branding on left, form on right.
*/
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import Link from "next/link";

export const metadata = {
  title: "Sign In - TaskFlow",
  description: "Sign in to your TaskFlow account",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue managing your tasks"
    >
      <LoginForm />

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Create one now
        </Link>
      </p>
    </AuthLayout>
  );
}
