import { useState } from "react";
import { Heart, User } from "lucide-react";
import Sidepenerima from "@/features/auth/components/sidebarpen";

const jobs = Array(9).fill({
  title: "Kitchen Staff coffe shop",
  company: "alaskuy angkringan",
  tags: ["recomended", "closest", "fast money"],
  location: "Tlogomas, Malang, East Java",
  distance: "150 M",
  pay: "Rp 50.000 – 100.000 per day",
  tasks: ["weekend helper", "washing station"],
  slots: 1,
  posted: "1 day ago",
  applicants: null,
  onsite: true,
});

const jobsWithApplicant = jobs.map((j, i) =>
  i === 0 ? { ...j, applicants: 100 } : j,
);

export default function GiverContent() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [posisi, setPosisi] = useState("");
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      {/* Hero */}
      <div className="bg-[#16A34A] px-4 sm:px-6 pt-6 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-white text-xs mb-1.5 font-medium">
              Gawe yang dicari
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mau kerja apa hari ini ?"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-[#2d2d25] placeholder-[#9a9688] bg-white outline-none"
            />
          </div>
          <div>
            <label className="block text-white text-xs mb-1.5 font-medium">
              Kategory
            </label>
            <input
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              placeholder="Keahlian"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-[#2d2d25] placeholder-[#9a9688] bg-white outline-none"
            />
          </div>
          <div>
            <label className="block text-white text-xs mb-1.5 font-medium">
              Posisi
            </label>
            <input
              value={posisi}
              onChange={(e) => setPosisi(e.target.value)}
              placeholder="Lokasi pekerjaan"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-[#2d2d25] placeholder-[#9a9688] bg-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-4 pb-2">
        <p className="text-xs text-[#9a9688]">home &gt; giver</p>
      </div>

      {/* Job Grid */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobsWithApplicant.map((job, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#e2ddd6] p-4 flex flex-col gap-2 hover:shadow-sm transition"
            >
              {/* Top */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#2d2d25] leading-snug">
                    {job.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9a9688]">
                    {job.company}
                  </p>
                </div>
                {job.onsite && (
                  <span className="text-xs text-[#5a5a4e] whitespace-nowrap ml-2 mt-0.5">
                    On site
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {job.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-[#16A34A] text-white text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Location */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#2d2d25]">
                  {job.location}
                </p>
                <p className="text-xs text-[#9a9688]">{job.distance}</p>
              </div>

              {/* Pay */}
              <p className="text-xs sm:text-sm text-[#5a5a4e]">{job.pay}</p>

              {/* Tasks */}
              <ul className="space-y-0.5">
                {job.tasks.map((t: string) => (
                  <li
                    key={t}
                    className="text-xs text-[#5a5a4e] flex items-center gap-1.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#5a5a4e] inline-block shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>

              {/* Slots */}
              <div className="flex items-center gap-1 text-xs text-[#5a5a4e]">
                <User className="h-3 w-3" />
                {job.slots}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-1">
                <div className="flex items-center gap-2 text-xs text-[#9a9688]">
                  <span>{job.posted}</span>
                  {job.applicants && (
                    <>
                      <span>·</span>
                      <span className="font-medium text-[#2d2d25]">
                        {job.applicants} applicant
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() =>
                    setLiked((prev) => ({ ...prev, [i]: !prev[i] }))
                  }
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      liked[i]
                        ? "fill-red-500 text-red-500"
                        : "text-[#9a9688] hover:text-red-400"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
