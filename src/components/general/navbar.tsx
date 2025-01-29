"use client";

import { CheckSquare, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function NavBar() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/meine-angebote">
            <Button variant="ghost" size="sm">
              <CheckSquare className="mr-2 h-4 w-4" />
              Meine Angebote
            </Button>
          </Link>
          <Link href="/meine-verleihungen">
            <Button variant="ghost" size="sm">
              <CheckSquare className="mr-2 h-4 w-4" />
              Meine Verleihungen
            </Button>
          </Link>
          <Link href="/meine-anfragen">
            <Button variant="ghost" size="sm">
              <CheckSquare className="mr-2 h-4 w-4" />
              Meine Anfragen
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}
