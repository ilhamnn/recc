import { useState } from "react";
import {
  ChevronDown,
  Plus,
  LayoutDashboard,
  Clock,
  Lightbulb,
  Loader,
} from "lucide-react";

const Sidepenerima = () => {
  const [selected, setSelected] = useState("Tawaran");
  const [filterOpen, setFilterOpen] = useState<string | null>(null);

  const navItems = [
    { Icon: LayoutDashboard, title: "Dashboard" },
    { Icon: Clock, title: "Tawaran" },
    { Icon: Lightbulb, title: "Insight" },
    { Icon: Loader, title: "Progress" },
  ];

  return (
    <nav className="sticky top-0 h-screen shrink-0 flex flex-col w-64 bg-[#f5f2ec] border-r border-[#d0ccc3]">
      {/* Tombol tambah */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#16A34A] text-[#2d4a2d] text-sm font-medium hover:bg-[#a3c0a3] transition-colors">
          <Plus className="h-4 w-4" />
          tambah tawaran
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ Icon, title }) => (
          <button
            key={title}
            onClick={() => setSelected(title)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
              selected === title
                ? "bg-[#e8e2d7] text-[#2d2d25] font-medium"
                : "text-[#5a5a4e] hover:bg-[#ede9e0]"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {title}
          </button>
        ))}
      </div>

      {/* Filter section */}
      <div className="border-t border-[#d0ccc3] p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-[#2d2d25]">filter</span>
          <button
            onClick={() => setFilterOpen(null)}
            className="text-xs text-[#6a8c5a] font-medium hover:text-[#4a6c3a] transition-colors"
          >
            hapus
          </button>
        </div>
        {["urut berdasarkan", "status"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterOpen(filterOpen === f ? null : f)}
            className="flex justify-between items-center w-full py-3 border-t border-[#d0ccc3] text-sm text-[#2d2d25]"
          >
            {f}
            <ChevronDown
              className={`h-4 w-4 text-[#5a5a4e] transition-transform duration-200 ${
                filterOpen === f ? "rotate-180" : ""
              }`}
            />
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Sidepenerima;
