import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Plus,
  LayoutDashboard,
  Clock,
  Lightbulb,
  Loader,
  ArrowUpDown,
  Radio,
} from "lucide-react";

const filterConfig = {
  "urut berdasarkan": {
    Icon: ArrowUpDown,
    options: ["Terbaru", "Terlama", "Nama A-Z"],
  },
  status: {
    Icon: Radio,
    options: ["Semua", "Aktif", "Tertunda", "Selesai"],
  },
};

const navItems = [
  { Icon: LayoutDashboard, title: "Dashboard" },
  { Icon: Clock, title: "Tawaran" },
  { Icon: Lightbulb, title: "Insight" },
  { Icon: Loader, title: "Progress" },
];

const Sidepenerima = () => {
  const [selected, setSelected] = useState("Tawaran");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Detect viewport
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node))
        setOpenFilter(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectOpt = (key: string, opt: string) => {
    setFilterVals((prev) => ({ ...prev, [key]: opt }));
    setOpenFilter(null);
  };

  // ── BOTTOM NAV (mobile) ──────────────────────────────────────────
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#f5f2ec] border-t border-[#d0ccc3] flex items-center justify-around px-2 z-50">
        {navItems.map(({ Icon, title }) => (
          <button
            key={title}
            onClick={() => setSelected(title)}
            className="flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors"
          >
            <Icon
              className={`h-5 w-5 transition-colors ${
                selected === title ? "text-[#16A34A]" : "text-[#5a5a4e]"
              }`}
            />
            <span
              className={`text-[10px] transition-colors ${
                selected === title
                  ? "text-[#16A34A] font-semibold"
                  : "text-[#5a5a4e]"
              }`}
            >
              {title}
            </span>
          </button>
        ))}

        {/* Tambah FAB */}
        <button className="flex flex-col items-center gap-0.5 flex-1 py-1">
          <div className="w-9 h-9 rounded-full bg-[#16A34A] flex items-center justify-center shadow-md shadow-green-200">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <span className="text-[10px] text-[#5a5a4e]">tambah</span>
        </button>
      </nav>
    );
  }

  // ── SIDEBAR (desktop) ────────────────────────────────────────────
  return (
    <nav className="sticky top-0 h-screen shrink-0 flex flex-col w-56 bg-[#f5f2ec] border-r border-[#d0ccc3]">
      {/* Tombol tambah */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803d] active:scale-95 transition-all">
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
                ? "bg-[#e8e2d7] text-[#2d2d25] font-semibold"
                : "text-[#5a5a4e] hover:bg-[#ede9e0]"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {title}
          </button>
        ))}
      </div>

      {/* Filter section */}
      <div className="border-t border-[#d0ccc3] p-4" ref={popupRef}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-[#2d2d25]">filter</span>
          <button
            onClick={() => {
              setFilterVals({});
              setOpenFilter(null);
            }}
            className="text-xs text-[#6a8c5a] font-semibold hover:text-[#4a6c3a]"
          >
            hapus
          </button>
        </div>

        {Object.entries(filterConfig).map(([key, { Icon, options }]) => (
          <div key={key} className="relative">
            <button
              onClick={() => setOpenFilter(openFilter === key ? null : key)}
              className="flex justify-between items-center w-full py-3 border-t border-[#d0ccc3] text-sm text-[#2d2d25]"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#6a8c5a]" />
                {key}
                {filterVals[key] && (
                  <span className="text-[11px] text-[#16A34A] font-semibold">
                    ({filterVals[key]})
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-[#5a5a4e] transition-transform duration-200 ${
                  openFilter === key ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Popup */}
            {openFilter === key && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-[#d0ccc3] rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectOpt(key, opt)}
                    className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#f5f2ec] ${
                      filterVals[key] === opt
                        ? "text-[#16A34A] font-semibold"
                        : "text-[#2d2d25]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidepenerima;
