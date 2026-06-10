import { useState, useEffect } from "react";
import { Heart, MapPin, Zap } from "lucide-react";
import { getJobs } from "@/lib/services/jobs.service";

// ─── Interfaces (matched to real API response) ────────────────────────────────

interface LocationArea {
  id: string;
  code: string;
  name: string;
}

interface MasterLocations {
  city?: LocationArea;
  district?: LocationArea;
  province?: LocationArea;
  subdistrict?: LocationArea;
}

interface JobLocation {
  lat?: string;
  lng?: string;
  street?: string;
  masterLocations?: MasterLocations;
}

interface Job {
  id: string;
  jobProviderId: string;
  addressId: string;
  isPublic: boolean;
  locations: JobLocation; // ← "locations" plural, nested masterLocations
  title: string;
  type: string; // "Urgent" | "Non Urgent"
  jobSite: string; // "On Site" | "Hybrid" | "Remote"
  budgetMin?: number | null;
  budgetMax?: number | null;
  budgetType?: string;
  status: string; // "Open" | "Closed" | "Canceled" | "In_Progress"
  jobAge?: string; // already formatted e.g. "2 Hari yang lalu"
  primaryImage?: string | null;
}

interface Paging {
  currentPage: number;
  totalPage: number;
  totalElement: number;
  size: number;
  nextPage: boolean;
  previousPage: boolean;
  firstPage: boolean;
  lastPage: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Job[]; // ← double-nested: res.data.data
    paging: Paging;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatBudget = (
  min?: number | null,
  max?: number | null,
  type?: string,
) => {
  if (!min && !max) return null;
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const suffix = type ? `/ ${type}` : "";
  if (min && max) return `${fmt(min)} – ${fmt(max)} ${suffix}`;
  if (min) return `${fmt(min)} ${suffix}`;
  return `${fmt(max!)} ${suffix}`;
};

// Build readable location string from masterLocations
const formatLocation = (loc?: JobLocation) => {
  if (!loc) return "-";
  const ml = loc.masterLocations;
  const parts = [
    ml?.subdistrict?.name,
    ml?.district?.name,
    ml?.city?.name,
    ml?.province?.name,
  ].filter(Boolean);
  return parts.join(", ") || loc.street || "-";
};

const statusStyle: Record<string, string> = {
  Open: "bg-green-100 text-green-700",
  In_Progress: "bg-yellow-100 text-yellow-700",
  Canceled: "bg-red-100 text-red-500",
  Closed: "bg-gray-100 text-gray-500",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GiverContent() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [posisi, setPosisi] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res: ApiResponse = await getJobs({ page: 1, size: 20 });
        if (res.success) {
          // response: { data: { data: Job[], paging: Paging } }
          const list = res.data?.data;
          setJobs(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = Array.isArray(jobs)
    ? jobs.filter((j) =>
        (j.title ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      {/* Hero / Search Bar */}
      <div className="bg-[#16A34A] px-4 sm:px-6 pt-6 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-white text-xs mb-1.5 font-medium">
              Gawe yang dicari
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mau kerja apa hari ini?"
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

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#e2ddd6] overflow-hidden animate-pulse"
              >
                <div className="h-36 bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-[#9a9688]">
          <p className="text-sm">Tidak ada pekerjaan yang ditemukan</p>
        </div>
      )}

      {/* Job Grid */}
      {!loading && filtered.length > 0 && (
        <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-[#e2ddd6] overflow-hidden flex flex-col hover:shadow-sm transition"
              >
                {/* Primary Image */}
                {job.primaryImage ? (
                  <img
                    src={job.primaryImage}
                    alt={job.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-[#f5f2ec] flex items-center justify-center">
                    <span className="text-xs text-[#9a9688]">No image</span>
                  </div>
                )}

                <div className="p-4 flex flex-col gap-2 flex-1">
                  {/* Title + jobSite */}
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-[#2d2d25] leading-snug flex-1 min-w-0">
                      {job.title}
                    </h2>
                    <span className="text-xs text-[#9a9688] whitespace-nowrap shrink-0 mt-0.5">
                      {job.jobSite}
                    </span>
                  </div>

                  {/* Urgent badge */}
                  {job.type === "Urgent" && (
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <Zap className="h-3 w-3 fill-green-500 text-green-500" />
                      Urgent
                    </div>
                  )}

                  {/* Location — from locations.masterLocations */}
                  <div className="flex items-start gap-1 text-xs text-[#9a9688]">
                    <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">
                      {formatLocation(job.locations)}
                    </span>
                  </div>

                  {/* Budget */}
                  {formatBudget(
                    job.budgetMin,
                    job.budgetMax,
                    job.budgetType,
                  ) && (
                    <p className="text-xs sm:text-sm text-[#5a5a4e] font-medium">
                      {formatBudget(
                        job.budgetMin,
                        job.budgetMax,
                        job.budgetType,
                      )}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {job.jobAge && (
                        <span className="text-xs text-[#9a9688]">
                          {job.jobAge}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusStyle[job.status] ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    {/* Like button — keyed by job.id not array index */}
                    <button
                      onClick={() =>
                        setLiked((prev) => ({
                          ...prev,
                          [job.id]: !prev[job.id],
                        }))
                      }
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          liked[job.id]
                            ? "fill-red-500 text-red-500"
                            : "text-[#9a9688] hover:text-red-400"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
