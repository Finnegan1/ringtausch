"use client";

import {
  Archive,
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
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
          <Link href="/" prefetch={true}>
            <Button variant="ghost" size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/meine-angebote" prefetch={true}>
            <Button variant="ghost" size="sm">
              <Archive className="mr-2 h-4 w-4" />
              Meine Angebote
            </Button>
          </Link>
          <Link href="/meine-verleihungen" prefetch={true}>
            <Button variant="ghost" size="sm">
              <HandCoins className="mr-2 h-4 w-4" />
              Meine Verleihungen
            </Button>
          </Link>
          <Link href="/meine-anfragen" prefetch={true}>
            <Button variant="ghost" size="sm">
              <HeartHandshake className="mr-2 h-4 w-4" />
              Meine Anfragen
            </Button>
          </Link>
        </div>
        <div className="ml-auto">
          <Link href="/settings" prefetch={true}>
            <Button variant="ghost" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}
