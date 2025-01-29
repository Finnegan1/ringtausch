import { NavBar } from "@/components/general/navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <NavBar />
      {children}
    </div>
  );
}
