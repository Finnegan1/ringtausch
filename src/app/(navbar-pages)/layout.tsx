import { NavBar } from "@/components/general/navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-10 mt-6 flex items-center justify-center">
        <div className="container">{children}</div>
      </div>
    </div>
  );
}
