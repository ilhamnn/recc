import { useState } from "react";
import { Search, Trash2, Pencil, Zap } from "lucide-react";

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
    <div className="flex-1 bg-[#f5f2ec] min-h-screen p-6 overflow-auto">
      {/* Breadcrumb */}
      <p className="text-xs text-[#9a9688] mb-4">home &gt; recipient</p>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-[#2d2d25]">Job Tawaran Anda</h1>
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="cari tawaranmu..."
            className="pl-3 pr-8 py-1.5 rounded-full bg-[#16A34A] text-white placeholder-green-200 text-sm outline-none w-44"
          />
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-200" />
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="relative bg-white rounded-xl border border-[#e2ddd6] p-5"
          >
            {/* Featured badge */}
            {job.featured && (
              <div className="absolute top-3 right-3 bg-green-500 rounded-lg p-1.5">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
            )}

            <h2 className="text-base font-bold text-[#2d2d25] mb-0.5">
              {job.title}
            </h2>
            <p className="text-sm text-[#5a5a4e] mb-2">{job.pay}</p>

            <ul className="mb-3 space-y-0.5">
              {job.tags.map((tag) => (
                <li
                  key={tag}
                  className="text-sm text-[#5a5a4e] flex items-center gap-1.5"
                >
                  <span className="h-1 w-1 rounded-full bg-[#5a5a4e] inline-block" />
                  {tag}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#9a9688]">
                <span>upload at {job.date}</span>
                <span>·</span>
                <span className={`font-medium ${statusColor[job.status]}`}>
                  {job.status}
                  {job.applicants ? (
                    <span className="text-[#2d2d25]">
                      {" "}
                      {job.applicants}applicant
                    </span>
                  ) : null}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors">
                  <Trash2 className="h-3 w-3" /> delete
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16A34A] hover:bg-[#3a6c3a] text-white text-xs font-medium transition-colors">
                  <Pencil className="h-3 w-3" /> edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TawaranContent;
