"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "sign-up") {
        await authClient.signUp.email({ email, password, name: name });
      } else {
        await authClient.signIn.email({ email, password });
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          {mode === "sign-up" ? "Create an account" : "Welcome back"}
        </CardTitle>
        <CardDescription>
          {mode === "sign-up"
            ? "Enter your email below to create your account"
            : "Enter your email to sign in to your account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              {mode === "sign-up" && (
                <>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                  />
                </>
              )}
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading
              ? "Loading..."
              : mode === "sign-up"
              ? "Sign up"
              : "Sign in"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {mode === "sign-up" ? (
              <>
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
