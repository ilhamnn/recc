import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, Pencil, Zap, Plus } from "lucide-react";
import Sidepenerima from "../components/sidebarpen";
import { getProviderJobs, deleteJob } from "@/lib/services/jobs.service";

// ─── Interfaces (matched to real API response) ────────────────────────────────

interface JobCategory {
  id: string;
  name: string;
}

interface MasterLocations {
  city?: { id: string; code: string; name: string };
  district?: { id: string; code: string; name: string };
  province?: { id: string; code: string; name: string };
  subdistrict?: { id: string; code: string; name: string };
}

interface Location {
  lat?: string;
  lng?: string;
  street?: string;
  masterLocations?: MasterLocations;
}

interface Job {
  id: string;
  title: string;
  introduction?: string;
  isPublic: boolean;
  isProvider: boolean;
  locations: Location;
  type: string;
  jobSite: string;
  budgetMin?: number;
  budgetMax?: number;
  budgetType?: string;
  status: string;
  jobAge?: string;
  categories: JobCategory[];
  createdAt: string;
  updatedAt: string;
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
    data: Job[];
    paging: Paging;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatBudget = (min?: number, max?: number | null, type?: string) => {
  if (!min && !max) return null;
  const formatNum = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const suffix = `per ${type?.toLowerCase() || "day"}`;
  if (min && max) return `${formatNum(min)} - ${formatNum(max)} ${suffix}`;
  if (min) return `${formatNum(min)} ${suffix}`;
  return `${formatNum(max!)} ${suffix}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// API returns capitalized status values e.g. "Open", "Closed"
const statusColor: Record<string, string> = {
  Open: "text-green-600",
  In_Progress: "text-yellow-600",
  Canceled: "text-red-500",
  Closed: "text-gray-500",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const TawaranContent = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res: ApiResponse = await getProviderJobs({ page: 1, size: 20 });
        if (res.success) {
          // API wraps jobs in res.data.data (double-nested)
          setJobs(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    if (!confirm("Yakin ingin menghapus job ini?")) return;
    try {
      setDeletingId(jobId);
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("Gagal menghapus job");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = Array.isArray(jobs)
    ? jobs.filter((j) =>
        (j.title ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : [];

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

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/r/add")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#16A34A] hover:bg-[#158a3a] text-white text-xs font-medium transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah
            </button>

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
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#e2ddd6] p-4 sm:p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-[#9a9688]">
            <p className="text-sm">Belum ada job yang dibuat</p>
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="relative bg-white rounded-xl border border-[#e2ddd6] p-4 sm:p-5 hover:shadow-sm transition"
              >
                {job.type === "Urgent" && (
                  <div className="absolute top-3 right-3 bg-green-500 rounded-lg p-1.5">
                    <Zap className="h-4 w-4 text-white fill-white" />
                  </div>
                )}

                <h2 className="text-sm sm:text-base font-bold text-[#2d2d25] mb-0.5">
                  {job.title}
                </h2>

                {formatBudget(job.budgetMin, job.budgetMax, job.budgetType) && (
                  <p className="text-xs sm:text-sm text-[#5a5a4e] mb-2">
                    {formatBudget(job.budgetMin, job.budgetMax, job.budgetType)}
                  </p>
                )}

                {/* Categories — now uses `categories` with `id` key */}
                <ul className="mb-3 space-y-0.5">
                  {job.categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="text-xs sm:text-sm text-[#5a5a4e] flex items-center gap-1.5"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#5a5a4e]" />
                      {cat.name}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#9a9688]">
                    {/* jobAge from API e.g. "2 Hari yang lalu" */}
                    <span>{job.jobAge}</span>
                    <span>·</span>
                    {/* status is capitalized from API e.g. "Open" */}
                    <span
                      className={`font-medium ${statusColor[job.status] ?? "text-gray-500"}`}
                    >
                      {job.status}
                    </span>
                    <span>·</span>
                    <span>{job.jobSite}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium transition"
                    >
                      <Trash2 className="h-3 w-3" />
                      {deletingId === job.id ? "deleting..." : "delete"}
                    </button>
                    <button
                      onClick={() => navigate(`/r/edit/${job.id}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#16A34A] hover:bg-[#3a6c3a] text-white text-xs font-medium transition"
                    >
                      <Pencil className="h-3 w-3" /> edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TawaranContent;
