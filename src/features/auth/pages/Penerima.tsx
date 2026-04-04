import { useState } from "react";
import { Search, Trash2, Pencil, Zap } from "lucide-react";
import Sidepenerima from "../components/sidebarpen";

const jobData = [
  {
    id: 1,
    title: "Kitchen Staff coffe shop",
    pay: "Rp 50.000 - 100.000 per day",
    tags: ["weekend helper", "washing station"],
    date: "1/7/2025",
    status: "prog",
    featured: false,
  },
  {
    id: 2,
    title: "Kitchen Staff coffe shop",
    pay: "Rp 50.000 - 100.000 per day",
    tags: ["weekend helper", "washing station"],
    date: "1/7/2026",
    status: "open",
    applicants: 100,
    featured: true,
  },
  {
    id: 3,
    title: "Kitchen Staff coffe shop",
    pay: "Rp 50.000 - 100.000 per day",
    tags: ["weekend helper", "washing station"],
    date: "1/7/2026",
    status: "closed",
    featured: false,
  },
  {
    id: 4,
    title: "Kitchen Staff coffe shop",
    pay: "Rp 50.000 - 100.000 per day",
    tags: ["weekend helper", "washing station"],
    date: "1/7/2026",
    status: "closed",
    featured: false,
  },
];

const statusColor: Record<string, string> = {
  prog: "text-yellow-600",
  open: "text-green-600",
  closed: "text-red-500",
};

export const TawaranContent = () => {
  const [search, setSearch] = useState("");

  const filtered = jobData.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#f5f2ec]">
      {/* Sidebar */}
      <Sidepenerima />

      {/* Content */}
      <div className="flex-1 px-3 sm:px-6 py-4 sm:py-6 overflow-auto">
        {/* Breadcrumb */}
        <p className="text-xs text-[#9a9688] mb-3 sm:mb-4">
          home &gt; recipient
        </p>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h1 className="text-lg sm:text-xl font-bold text-[#2d2d25]">
            Job Tawaran Anda
          </h1>

          <div className="relative w-full sm:w-56">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="cari tawaranmu..."
              className="w-full pl-3 pr-8 py-2 rounded-full bg-[#16A34A] text-white placeholder-green-200 text-sm outline-none"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-green-200" />
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="relative bg-white rounded-xl border border-[#e2ddd6] p-4 sm:p-5 hover:shadow-sm transition"
            >
              {job.featured && (
                <div className="absolute top-3 right-3 bg-green-500 rounded-lg p-1.5">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
              )}

              <h2 className="text-sm sm:text-base font-bold text-[#2d2d25] mb-0.5">
                {job.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#5a5a4e] mb-2">
                {job.pay}
              </p>

              <ul className="mb-3 space-y-0.5">
                {job.tags.map((tag) => (
                  <li
                    key={tag}
                    className="text-xs sm:text-sm text-[#5a5a4e] flex items-center gap-1.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#5a5a4e]" />
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#9a9688]">
                  <span>upload at {job.date}</span>
                  <span>·</span>
                  <span className={`font-medium ${statusColor[job.status]}`}>
                    {job.status}
                    {job.applicants && (
                      <span className="text-[#2d2d25]">
                        {" "}
                        {job.applicants} applicant
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition">
                    <Trash2 className="h-3 w-3" /> delete
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#16A34A] hover:bg-[#3a6c3a] text-white text-xs font-medium transition">
                    <Pencil className="h-3 w-3" /> edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TawaranContent;
