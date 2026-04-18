import { Outlet } from "react-router-dom";
import { SimpleHeader } from "@/components/navBase/headr";
import { Fot } from "@/components/ui/footer";

export default function MainLayout() {
  return (
    <>
      <SimpleHeader />
      <Outlet />
      <Fot />
    </>
  );
}
