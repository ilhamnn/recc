import React from "react";
import Sidepenerima from "@/components/sidebarpen.tsx";
import TawaranContent from "@/components/basecontpen.tsx";
import { SimpleHeader } from "@/components/ui/navBase/headr";
export default function Penerima() {
  return (
    <>
      <nav>
        <SimpleHeader />
      </nav>
      <div className="flex min-h-screen">
        <Sidepenerima />
        <TawaranContent />
      </div>
    </>
  );
}
