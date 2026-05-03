import { Outlet } from "react-router-dom";
import { SimpleHeader } from "@/components/navBase/headr";
import { BottomNav } from "@/components/navBase/BottomNav";
import { Fot } from "@/components/ui/footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SimpleHeader />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
      <div className="hidden lg:block">
        <Fot />
      </div>
    </div>
  );
}
