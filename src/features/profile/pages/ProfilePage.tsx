"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Upload,
  CameraOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/navBase/sheet";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getProfile } from "@/lib/services/user.service";
import { updateProfilePicture } from "@/lib/services/user.service";
import { logout as apiLogout } from "@/lib/services/auth.service";
import clsx from "clsx";

// ─── Tipe Data sesuai API Contract (GET /api/users/profile) ─────────────────
interface ReviewItem {
  id: string;
  rating: number;
  type: "PROVIDER_TO_WORKER" | "WORKER_TO_PROVIDER";
  review: {
    comment: string;
    isMyReview?: boolean;
    by: {
      id: string;
      name: string;
      profilePictUrl?: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  reply?: {
    comment: string;
    isMyReply?: boolean;
    by: {
      id: string;
      name: string;
      profilePictUrl?: string;
    };
    repliedAt: string;
  } | null;
  job: {
    id: string;
    title: string;
  };
}

interface ReviewsAggregate {
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
  latest: ReviewItem[];
}

interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  profilePictUrl?: string;
  birthDate?: string;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  createdAt: string;
  isOwnProfile: boolean;
  locations?: {
    subdistrict: { id: string; name: string; code: string };
    district: { id: string; name: string; code: string };
    city: { id: string; name: string; code: string };
    province: { id: string; name: string; code: string };
  };
  asWorker?: {
    totalApplied: number;
    totalAccepted: number;
    totalRejected: number;
    reviews: ReviewsAggregate;
  };
  asProvider?: {
    totalJobsPosted: number;
    totalJobsCompleted: number;
    totalJobsCanceled: number;
    reviews: ReviewsAggregate;
  };
  bookmark?: {
    totalBookmark: number;
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Hari ini";
  if (days === 1) return "Kemarin";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
  return `${Math.floor(days / 365)} tahun lalu`;
};

const getStatusLabel = (status: string) => {
  if (status === "ACTIVE") return "Aktif";
  if (status === "PENDING_VERIFICATION") return "Menunggu Verifikasi";
  return status;
};

// ─── Render Stars ────────────────────────────────────────────────────────────
const renderStars = (rating: number, size: "sm" | "md" = "md") => {
  const starSize = size === "sm" ? "size-3" : "size-4";
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={clsx(
        starSize,
        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
      )}
    />
  ));
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const { token, isHydrated, logout: storeLogout } = useAuthStore();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"info" | "reviews">("info");
  const [uploading, setUploading] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ─── Load Data ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isHydrated) return;

    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const res = await getProfile();
        const data = (res as ProfileResponse).data;
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, isHydrated, navigate]);

  // ─── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      if (token) await apiLogout(token);
    } catch {
      // ignore
    }
    storeLogout();
    navigate("/login", { replace: true });
  };

  // ─── Upload Profile Picture ───────────────────────────────────────────────
  const handleCameraOption = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.setAttribute("capture", "environment");
    fileInputRef.current.click();
  };

  const handleGalleryOption = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.removeAttribute("capture");
    fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Sesuai backend: max 2MB (bukan 5MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    // validasi tipe tetap sama
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diizinkan");
      return;
    }

    setSheetOpen(false);
    setUploading(true);

    try {
      await updateProfilePicture(file);
      const res = await getProfile();
      const data = (res as ProfileResponse).data;
      setProfile(data);
    } catch (err: any) {
      console.error("Failed to upload profile picture", err);
      const errorMsg =
        err?.apiMessage || err?.message || "Gagal mengunggah foto profil";
      alert(errorMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (!isHydrated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Gagal memuat profil</p>
      </div>
    );
  }

  // ─── Derived Data ───────────────────────────────────────────────────────────
  const workerStats = profile.asWorker;
  const providerStats = profile.asProvider;

  const workerReviews = workerStats?.reviews;
  const providerReviews = providerStats?.reviews;

  const workerAvgRating = workerReviews?.averageRating ?? 0;
  const workerTotalReviews = workerReviews?.totalReviews ?? 0;
  const workerLatest = workerReviews?.latest ?? [];
  const providerLatest = providerReviews?.latest ?? [];

  const providerAvgRating = providerReviews?.averageRating ?? 0;
  const providerTotalReviews = providerReviews?.totalReviews ?? 0;

  // Gabung latest reviews dari worker + provider, sort by createdAt
  const allReviews = [...workerLatest, ...providerLatest].sort((a, b) => {
    const dateA = new Date(a.review.createdAt).getTime();
    const dateB = new Date(b.review.createdAt).getTime();
    return dateB - dateA;
  });

  const locationStr = profile.locations
    ? [
        profile.locations.subdistrict?.name,
        profile.locations.district?.name,
        profile.locations.city?.name,
        profile.locations.province?.name,
      ]
        .filter(Boolean)
        .join(", ")
    : undefined;

  const isEmailVerified = profile.isEmailVerified;
  const isPhoneVerified = profile.isPhoneVerified;
  const isFullyVerified = isEmailVerified && isPhoneVerified;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#16A34A] to-[#15803d] px-4 pt-6 pb-16">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/20">
              {profile.profilePictUrl ? (
                <img
                  src={profile.profilePictUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {profile.name?.[0]?.toUpperCase() ?? "?"}
                </span>
              )}
            </div>

            {/* Hidden file input for camera/gallery */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Uploading overlay */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                  <Camera className="size-4 text-gray-700" />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl pb-8">
                <SheetHeader>
                  <SheetTitle>Ubah Foto Profil</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-3 px-4">
                  <button
                    onClick={handleCameraOption}
                    disabled={uploading}
                    className="flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16A34A]/10">
                      <CameraOff className="size-6 text-[#16A34A]" />
                    </div>
                    <div>
                      <p className="font-medium">Ambil Foto</p>
                      <p className="text-sm text-muted-foreground">
                        Gunakan kamera untuk foto baru
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={handleGalleryOption}
                    disabled={uploading}
                    className="flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16A34A]/10">
                      <Upload className="size-6 text-[#16A34A]" />
                    </div>
                    <div>
                      <p className="font-medium">Pilih dari Galeri</p>
                      <p className="text-sm text-muted-foreground">
                        Unggah foto dari perangkat
                      </p>
                    </div>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Name */}
          <h2 className="mt-3 text-xl font-bold text-white">
            {profile.name || profile.username || "User"}
          </h2>
          {profile.username && (
            <p className="mt-0.5 text-sm text-white/80">@{profile.username}</p>
          )}
        </div>
      </div>

      {/* ─── Stats Cards ────────────────────────────────────────────────── */}
      <div className="mx-4 -mt-8 grid grid-cols-3 gap-2">
        <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#16A34A]">
            {providerStats?.totalJobsCompleted ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Selesai</p>
        </div>
        <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
          <div className="flex items-center justify-center gap-0.5">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <p className="text-lg font-bold text-[#16A34A]">
              {workerAvgRating > 0 ? workerAvgRating.toFixed(1) : "0.0"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Rating ({workerTotalReviews})
          </p>
        </div>
        <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
          <p className="text-lg font-bold text-[#16A34A]">
            {getStatusLabel(profile.status)}
          </p>
          <p className="text-xs text-muted-foreground">Status</p>
        </div>
      </div>

      {/* ─── Worker / Provider Summary ──────────────────────────────────── */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border bg-white p-3 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground">
            Sebagai Worker
          </p>
          <div className="mt-1 flex items-center gap-1">
            {renderStars(Math.round(workerAvgRating), "sm")}
            <span className="text-xs font-bold text-[#16A34A]">
              {workerAvgRating > 0 ? workerAvgRating.toFixed(1) : "-"}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {workerTotalReviews} review
          </p>
          <div className="mt-1 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
            <span>Diterima: {workerStats?.totalAccepted ?? 0}</span>
            <span>Ditolak: {workerStats?.totalRejected ?? 0}</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-3 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground">
            Sebagai Pemberi Kerja
          </p>
          <div className="mt-1 flex items-center gap-1">
            {renderStars(Math.round(providerAvgRating), "sm")}
            <span className="text-xs font-bold text-[#16A34A]">
              {providerAvgRating > 0 ? providerAvgRating.toFixed(1) : "-"}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {providerTotalReviews} review
          </p>
          <div className="mt-1 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
            <span>Posting: {providerStats?.totalJobsPosted ?? 0}</span>
            <span>Batal: {providerStats?.totalJobsCanceled ?? 0}</span>
          </div>
        </div>
      </div>

      {/* ─── Tabs ───────────────────────────────────────────────────────── */}
      <div className="mt-6 flex border-b px-4">
        <button
          onClick={() => setActiveTab("info")}
          className={clsx(
            "flex-1 pb-3 text-sm font-medium transition-colors",
            activeTab === "info"
              ? "border-b-2 border-[#16A34A] text-[#16A34A]"
              : "text-muted-foreground",
          )}
        >
          Informasi
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={clsx(
            "flex-1 pb-3 text-sm font-medium transition-colors",
            activeTab === "reviews"
              ? "border-b-2 border-[#16A34A] text-[#16A34A]"
              : "text-muted-foreground",
          )}
        >
          Review ({workerTotalReviews + providerTotalReviews})
        </button>
      </div>

      {/* ─── Tab Content ─────────────────────────────────────────────────── */}
      <div className="px-4 py-4">
        {activeTab === "info" ? (
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                <Mail className="size-5 text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{profile.email || "-"}</p>
                {isEmailVerified && (
                  <span className="text-[10px] text-[#16A34A]">
                    ✓ Terverifikasi
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            {profile.phone && (
              <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                  <Phone className="size-5 text-[#16A34A]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <p className="text-sm font-medium">{profile.phone}</p>
                  {isPhoneVerified && (
                    <span className="text-[10px] text-[#16A34A]">
                      ✓ Terverifikasi
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {locationStr && (
              <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                  <MapPin className="size-5 text-[#16A34A]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p className="text-sm font-medium">{locationStr}</p>
                </div>
              </div>
            )}

            {/* Birth Date */}
            {profile.birthDate && (
              <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                  <Calendar className="size-5 text-[#16A34A]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Tanggal Lahir</p>
                  <p className="text-sm font-medium">
                    {formatDate(profile.birthDate)}
                  </p>
                </div>
              </div>
            )}

            {/* Account Status */}
            <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                <Shield className="size-5 text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Status Akun</p>
                <p className="text-sm font-medium">
                  {isFullyVerified ? (
                    <span className="text-[#16A34A]">Terverifikasi</span>
                  ) : (
                    <span className="text-orange-500">Belum Terverifikasi</span>
                  )}
                </p>
                <div className="mt-0.5 flex gap-2">
                  <span
                    className={clsx(
                      "text-[10px]",
                      isEmailVerified ? "text-[#16A34A]" : "text-orange-500",
                    )}
                  >
                    Email {isEmailVerified ? "✓" : "✗"}
                  </span>
                  <span
                    className={clsx(
                      "text-[10px]",
                      isPhoneVerified ? "text-[#16A34A]" : "text-orange-500",
                    )}
                  >
                    Telepon {isPhoneVerified ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bookmark */}
            {profile.bookmark && (
              <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                  <Star className="size-5 text-[#16A34A]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    Lowongan Tersimpan
                  </p>
                  <p className="text-sm font-medium">
                    {profile.bookmark.totalBookmark} lowongan
                  </p>
                </div>
              </div>
            )}

            {/* Edit Button */}
            <Button className="w-full bg-[#16A34A] hover:bg-[#15803d]">
              Edit Profil
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {allReviews.length > 0 ? (
              allReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border bg-white p-4 shadow-sm"
                >
                  {/* Header: stars + meta */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        oleh{" "}
                        <span className="font-medium text-foreground">
                          {review.review.by.name}
                        </span>{" "}
                        · Job: {review.job.title}
                      </p>
                      <span
                        className={clsx(
                          "mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium",
                          review.type === "PROVIDER_TO_WORKER"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700",
                        )}
                      >
                        {review.type === "PROVIDER_TO_WORKER"
                          ? " Pemberi → Worker"
                          : " Worker → Pemberi"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeDate(review.review.createdAt)}
                    </p>
                  </div>

                  {/* Comment */}
                  {review.review.comment && (
                    <p className="mt-2 text-sm text-foreground">
                      {review.review.comment}
                    </p>
                  )}

                  {/* Reply */}
                  {review.reply && (
                    <div className="mt-2 rounded bg-gray-50 p-2 text-xs">
                      <p className="font-semibold text-muted-foreground">
                        💬 {review.reply.by.name}:
                      </p>
                      <p className="mt-0.5 text-foreground">
                        {review.reply.comment}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {formatRelativeDate(review.reply.repliedAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <Star className="mx-auto size-12 text-gray-300" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada review
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Logout ──────────────────────────────────────────────────────── */}
      <div className="border-t px-4 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="size-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
}
