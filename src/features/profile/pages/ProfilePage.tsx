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
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getProfile, getUserReviews } from "@/lib/services/user.service";
import { logout as apiLogout } from "@/lib/services/auth.service";
import clsx from "clsx";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { token, user, logout: storeLogout, fetchUser } = useAuthStore();
  const [profile, setProfile] = React.useState<any>(null);
  const [reviews, setReviews] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"info" | "reviews">("info");

  React.useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [profileData, reviewsData] = await Promise.all([
          getProfile(),
          getUserReviews(),
        ]);
        setProfile(profileData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      if (token) await apiLogout(token);
    } catch {
      // ignore
    }
    storeLogout();
    navigate("/login", { replace: true });
  };

  if (loading) {
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={clsx(
          "size-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
        )}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#16A34A] to-[#15803d] px-4 pt-6 pb-16">
        <div className="flex flex-col items-center">
          {/* Avatar dengan camera icon */}
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {profile.firstName?.[0] || profile.username?.[0] || "?"}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
              <Camera className="size-4 text-gray-700" />
            </button>
          </div>

          {/* Name */}
          <h2 className="mt-3 text-xl font-bold text-white">
            {profile.firstName || profile.username || "User"}
          </h2>
          {profile.username && (
            <p className="mt-0.5 text-sm text-white/80">@{profile.username}</p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mx-4 -mt-8 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white p-3 text-center shadow-sm border">
          <p className="text-2xl font-bold text-[#16A34A]">
            {reviews?.data?.length || 0}
          </p>
          <p className="text-xs text-muted-foreground">Transaksi</p>
        </div>
        <div className="rounded-xl bg-white p-3 text-center shadow-sm border">
          <div className="flex items-center justify-center gap-0.5">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <p className="text-lg font-bold text-[#16A34A]">
              {profile.averageRating || "0.0"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Rating</p>
        </div>
        <div className="rounded-xl bg-white p-3 text-center shadow-sm border">
          <p className="text-lg font-bold text-[#16A34A]">
            {profile.role || "user"}
          </p>
          <p className="text-xs text-muted-foreground">Role</p>
        </div>
      </div>

      {/* Tabs */}
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
          Review
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {activeTab === "info" ? (
          <div className="space-y-4">
            {/* Info Items */}
            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                <Mail className="size-5 text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{profile.email || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                <Phone className="size-5 text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Telepon</p>
                <p className="text-sm font-medium">{profile.phone || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                <MapPin className="size-5 text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Alamat</p>
                <p className="text-sm font-medium">{profile.address || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                <Calendar className="size-5 text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Tanggal Lahir</p>
                <p className="text-sm font-medium">
                  {profile.birthDate || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A]/10">
                <Shield className="size-5 text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Status Akun</p>
                <p className="text-sm font-medium">
                  {profile.isVerified ? (
                    <span className="text-[#16A34A]">Terverifikasi</span>
                  ) : (
                    <span className="text-orange-500">Belum Terverifikasi</span>
                  )}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <Button className="w-full bg-[#16A34A] hover:bg-[#15803d]">
              Edit Profil
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews?.data?.length > 0 ? (
              reviews.data.map((review: any) => (
                <div
                  key={review.id}
                  className="rounded-lg bg-white p-4 shadow-sm border"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating || 0)}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {review.reviewerName || "Anonymous"}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("id-ID")
                        : ""}
                    </p>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm border">
                <Star className="mx-auto size-12 text-gray-300" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada review
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="px-4 pt-4 border-t">
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
