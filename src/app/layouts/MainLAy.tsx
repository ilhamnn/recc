import { Outlet } from "react-router-dom";
import { SimpleHeader } from "@/components/navBase/headr";

export default function MainLayout() {
  return (
    <>
      <SimpleHeader />
      <Outlet />
    </>
  );
}
