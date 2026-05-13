import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Sidepenerima from "../components/sidebarpen";
import { getJobCategories } from "@/lib/services/master.service";
import {
  getAddresses,
  createAddress,
  getProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
  getSubdistrictsByDistrict,
} from "@/lib/services/location.service";
import { createJob } from "@/lib/services/jobs.service";

// Fix marker icons for leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Click-to-set marker component
function MapClickPicker({
  lat,
  lng,
  onSelect,
}: {
  lat: number;
  lng: number;
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return lat !== 0 && lng !== 0 ? <Marker position={[lat, lng]} /> : null;
}

interface JobCategory {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

interface Address {
  id: string;
  street: string;
  isPrimary: boolean;
  locations: {
    subdistrict: { name: string };
    district: { name: string };
    city: { name: string };
    province: { name: string };
  };
}

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
const JOB_SITES = ["On site", "Hybrid", "Remote"] as const;
const BUDGET_TYPES = ["Fixed", "Hourly", "Negotiable"] as const;
const JOB_TYPES = ["urgent", "non urgent"] as const;

interface FormData {
  addressId: string;
  title: string;
  introduction: string;
  description: string;
  levels: string[];
  type: string;
  required: number;
  jobSite: string;
  budgetMin: string;
  budgetMax: string;
  budgetType: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export const AddTawaranContent = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Location cascading state
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [subdistricts, setSubdistricts] = useState<
    { id: string; name: string }[]
  >([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Modal state for new address
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    postalCode: "",
    markAs: "home",
    isPrimary: false,
    lat: 0,
    lng: 0,
    subdistrictId: "",
  });

  const [form, setForm] = useState<FormData>({
    addressId: "",
    title: "",
    introduction: "",
    description: "",
    levels: [],
    type: "non urgent",
    required: 1,
    jobSite: "On site",
    budgetMin: "",
    budgetMax: "",
    budgetType: "Fixed",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, addrRes, provRes] = await Promise.all([
          getJobCategories(),
          getAddresses(),
          getProvinces(),
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (addrRes.success) setAddresses(addrRes.data);
        if (provRes.success) setProvinces(provRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Cascade: cities when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setSelectedCity("");
      setDistricts([]);
      setSelectedDistrict("");
      setSubdistricts([]);
      return;
    }
    getCitiesByProvince(selectedProvince).then((res) => {
      if (res.success) {
        setCities(res.data);
        setSelectedCity("");
        setDistricts([]);
        setSubdistricts([]);
      }
    });
  }, [selectedProvince]);

  // Cascade: districts when city changes
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      setSelectedDistrict("");
      setSubdistricts([]);
      return;
    }
    getDistrictsByCity(selectedCity).then((res) => {
      if (res.success) setDistricts(res.data);
    });
  }, [selectedCity]);

  // Cascade: subdistricts when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setSubdistricts([]);
      setNewAddress((p) => ({ ...p, subdistrictId: "" }));
      return;
    }
    getSubdistrictsByDistrict(selectedDistrict).then((res) => {
      if (res.success) setSubdistricts(res.data);
    });
  }, [selectedDistrict]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleLevel = (level: string) => {
    setForm((prev) => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter((l) => l !== level)
        : [...prev.levels, level],
    }));
  };

  const updateForm = (key: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): {
    valid: boolean;
    errors: Partial<Record<keyof FormData, string>>;
  } => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.title.trim()) newErrors.title = "Judul job wajib diisi";
    if (showAddressModal && !newAddress.subdistrictId)
      newErrors.addressId = "Pilih lokasi (subdistrict) untuk alamat baru";
    else if (!form.addressId && !showAddressModal)
      newErrors.addressId = "Pilih alamat lokasi pekerjaan";
    if (selectedCategories.length === 0)
      newErrors.levels = "Pilih minimal 1 kategori";
    if (form.levels.length === 0) newErrors.levels = "Pilih minimal 1 level";
    if (!form.introduction.trim()) newErrors.introduction = "Intro wajib diisi";
    if (!form.description.trim())
      newErrors.description = "Deskripsi wajib diisi";

    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("=== SUBMIT TRIGGERED ===");
    console.log("Form state:", form);
    console.log("Selected categories:", selectedCategories);
    console.log("Show address modal:", showAddressModal);
    console.log("New address:", newAddress);

    // Validate first
    const { valid } = validate();
    console.log("Validate result:", valid);

    if (!valid) {
      alert("Lengkapi semua field yang wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);

      let resolvedAddressId = form.addressId;

      if (showAddressModal && newAddress.subdistrictId) {
        const addrPayload: Record<string, string | boolean> = {};
        if (newAddress.subdistrictId)
          addrPayload.subdistrictId = newAddress.subdistrictId;
        if (newAddress.street.trim()) addrPayload.street = newAddress.street;
        if (newAddress.postalCode)
          addrPayload.postalCode = newAddress.postalCode;
        if (newAddress.markAs) addrPayload.markAs = newAddress.markAs;
        if (newAddress.isPrimary != null)
          addrPayload.isPrimary = newAddress.isPrimary;
        // if (newAddress.lat !== 0) {
        //   const latVal = String(newAddress.lat);
        //   addrPayload.lat = latVal;
        //   console.log("LAT raw:", newAddress.lat, "→ string:", latVal);
        // }
        // if (newAddress.lng !== 0) {
        //   const lngVal = String(newAddress.lng);
        //   addrPayload.lng = lngVal;
        //   console.log("LNG raw:", newAddress.lng, "→ string:", lngVal);
        // }
        if (newAddress.lat !== 0) {
          addrPayload.lat = newAddress.lat.toFixed(7); // ← ganti String() jadi toFixed(7)
          console.log("LAT raw:", newAddress.lat, "→ string:", addrPayload.lat);
        }
        if (newAddress.lng !== 0) {
          addrPayload.lng = newAddress.lng.toFixed(7); // ← ganti String() jadi toFixed(7)
          console.log("LNG raw:", newAddress.lng, "→ string:", addrPayload.lng);
        }
        console.log("Full addrPayload:", JSON.stringify(addrPayload, null, 2));

        console.log(
          "Creating address with payload:",
          JSON.stringify(addrPayload, null, 2),
        );

        let addrRes;
        try {
          addrRes = await createAddress(addrPayload as any);
          console.log("Address creation SUCCESS:", addrRes);
        } catch (addrErr: any) {
          const errData = addrErr.response?.data;
          const errStatus = addrErr.response?.status;
          const errMessage =
            typeof errData === "string"
              ? errData
              : JSON.stringify(errData, null, 2);
          console.error("=== CREATE ADDRESS ERROR ===");
          console.error("HTTP Status:", errStatus);
          console.error("Response:", errMessage);

          // Format error message untuk user
          let userMsg = "Gagal membuat alamat!\n\n";
          if (errData?.errors && Array.isArray(errData.errors)) {
            errData.errors.forEach((err: { path: string; message: string }) => {
              userMsg += `• ${err.path}: ${err.message}\n`;
            });
          } else {
            userMsg += errData?.message || errMessage;
          }
          alert(userMsg);
          setSubmitting(false);
          return;
        }

        // Handle both { success, data: { id } } or direct { id } response
        const addrData = addrRes?.data ?? addrRes;
        if (addrData && addrData.id) {
          resolvedAddressId = addrData.id;
        } else {
          alert("Gagal membuat alamat. Response: " + JSON.stringify(addrRes));
          setSubmitting(false);
          return;
        }
      }

      // Validate resolved addressId
      if (!resolvedAddressId) {
        alert("Pilih atau isi alamat lokasi pekerjaan.");
        setSubmitting(false);
        return;
      }

      const payload: Record<string, any> = {
        addressId: resolvedAddressId,
        jobCategoriesId: selectedCategories,
        title: form.title,
        introduction: form.introduction,
        description: form.description,
        level: form.levels,
        type: form.type,
        required: form.required,
        jobSite: form.jobSite,
        status: "Open",
      };

      if (form.startDate) payload.startDate = form.startDate;
      if (form.endDate) payload.endDate = form.endDate;
      if (form.startTime) payload.startTime = form.startTime;
      if (form.endTime) payload.endTime = form.endTime;
      if (form.budgetMin) payload.budgetMin = Number(form.budgetMin);
      if (form.budgetMax) payload.budgetMax = Number(form.budgetMax);
      if (form.budgetType) payload.budgetType = form.budgetType;

      console.log("Creating job with payload:", payload);
      const res = await createJob(payload);
      console.log("Job creation response:", res);

      alert("Job berhasil dibuat!");
      navigate("/r");
    } catch (err: any) {
      console.error("Submit error:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      const msg =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.message ||
        "Gagal membuat job.";
      alert("Error: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f2ec]">
      <Sidepenerima />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-[#16A34A] px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/r")}
              className="text-white hover:bg-white/20 rounded-lg p-1.5 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-white font-bold text-lg">Buat Tawaran Baru</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#16A34A]" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#2d2d25] mb-1.5">
                Judul Job <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="Contoh: Bersih-bersih Rumah"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] placeholder-[#9a9688] outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition"
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Job Categories */}
            <div>
              <label className="block text-sm font-semibold text-[#2d2d25] mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      selectedCategories.includes(cat.id)
                        ? "bg-[#16A34A] text-white border-[#16A34A]"
                        : "bg-white text-[#5a5a4e] border-[#e2ddd6] hover:border-[#16A34A]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {errors.levels && (
                <p className="text-xs text-red-500 mt-1">{errors.levels}</p>
              )}
            </div>

            {/* Job Site */}
            <div>
              <label className="block text-sm font-semibold text-[#2d2d25] mb-2">
                Lokasi Kerja
              </label>
              <div className="flex gap-2">
                {JOB_SITES.map((site) => (
                  <button
                    key={site}
                    type="button"
                    onClick={() => updateForm("jobSite", site)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                      form.jobSite === site
                        ? "bg-[#16A34A] text-white border-[#16A34A]"
                        : "bg-white text-[#5a5a4e] border-[#e2ddd6] hover:border-[#16A34A]"
                    }`}
                  >
                    {site}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#2d2d25]">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(!showAddressModal)}
                  className="text-xs text-[#16A34A] hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Tambah alamat baru
                </button>
              </div>

              {addresses.length > 0 && !showAddressModal && (
                <select
                  value={form.addressId}
                  onChange={(e) => updateForm("addressId", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] outline-none focus:border-[#16A34A]"
                >
                  <option value="">Pilih alamat tersimpan</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.locations.subdistrict.name},{" "}
                      {addr.locations.city.name}{" "}
                      {addr.isPrimary ? "(Utama)" : ""}
                    </option>
                  ))}
                </select>
              )}

              {showAddressModal && (
                <div className="space-y-3 p-4 bg-white rounded-xl border border-[#e2ddd6]">
                  <div className="flex items-center gap-2 text-xs text-[#9a9688] mb-2">
                    <MapPin className="h-4 w-4" />
                    Tambah alamat baru
                  </div>

                  {/* Province */}
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm outline-none focus:border-[#16A34A]"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {/* City */}
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedProvince}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm outline-none focus:border-[#16A34A] disabled:opacity-50"
                  >
                    <option value="">Pilih Kota/Kabupaten</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {/* District */}
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedCity}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm outline-none focus:border-[#16A34A] disabled:opacity-50"
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  {/* Subdistrict */}
                  <select
                    value={newAddress.subdistrictId}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        subdistrictId: e.target.value,
                      }))
                    }
                    disabled={!selectedDistrict}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm outline-none focus:border-[#16A34A] disabled:opacity-50"
                  >
                    <option value="">Pilih Desa/Kelurahan</option>
                    {subdistricts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Nama jalan / alamat lengkap"
                    value={newAddress.street}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, street: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm outline-none focus:border-[#16A34A]"
                  />
                  <input
                    placeholder="Kode pos (opsional)"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        postalCode: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm outline-none focus:border-[#16A34A]"
                  />
                  <div className="flex gap-2">
                    {/* <input
                      placeholder="Label (contoh: Rumah, Kantor)"
                      value={newAddress.markAs}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, markAs: e.target.value }))
                      }
                      className="flex-1 px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm outline-none focus:border-[#16A34A]"
                    /> */}
                    <select
                      value={newAddress.markAs}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, markAs: e.target.value }))
                      }
                      className="flex-1 px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm outline-none focus:border-[#16A34A]"
                    >
                      <option value="home">Rumah</option>
                      <option value="office">Kantor</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-[#5a5a4e] px-3">
                      <input
                        type="checkbox"
                        checked={newAddress.isPrimary}
                        onChange={(e) =>
                          setNewAddress((p) => ({
                            ...p,
                            isPrimary: e.target.checked,
                          }))
                        }
                        className="accent-[#16A34A]"
                      />
                      Utama
                    </label>
                  </div>

                  {/* OpenStreetMap Picker */}
                  <div>
                    <label className="block text-xs text-[#9a9688] mb-1">
                      Klik peta untuk set lokasi (opsional)
                    </label>
                    <div className="rounded-lg border border-[#e2ddd6] overflow-hidden h-52">
                      <MapContainer
                        center={[-2.5, 118]}
                        zoom={5}
                        className="h-full w-full"
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapClickPicker
                          lat={newAddress.lat}
                          lng={newAddress.lng}
                          onSelect={(lat, lng) =>
                            setNewAddress((p) => ({ ...p, lat, lng }))
                          }
                        />
                      </MapContainer>
                    </div>
                    {newAddress.lat !== 0 && newAddress.lng !== 0 && (
                      <p className="text-xs text-[#9a9688] mt-1">
                        Lat: {newAddress.lat.toFixed(5)}, Lng:{" "}
                        {newAddress.lng.toFixed(5)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="text-xs text-red-400 hover:text-red-500"
                  >
                    Batal tambah alamat
                  </button>
                </div>
              )}

              {errors.addressId && (
                <p className="text-xs text-red-500 mt-1">{errors.addressId}</p>
              )}
            </div>

            {/* Introduction */}
            <div>
              <label className="block text-sm font-semibold text-[#2d2d25] mb-1.5">
                Intro / Perkenalan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.introduction}
                onChange={(e) => updateForm("introduction", e.target.value)}
                placeholder="Ceritakan tentang perusahaan/anda..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] placeholder-[#9a9688] outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition resize-none"
              />
              {errors.introduction && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.introduction}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#2d2d25] mb-1.5">
                Deskripsi / Tugas <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="- Membantu pindahan barang&#10;- Memastikan barang aman&#10;- Membersihkan area kerja"
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] placeholder-[#9a9688] outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition resize-none"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-[#2d2d25] mb-2">
                Level / Tingkat <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleLevel(level)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                      form.levels.includes(level)
                        ? "bg-[#16A34A] text-white border-[#16A34A]"
                        : "bg-white text-[#5a5a4e] border-[#e2ddd6] hover:border-[#16A34A]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Type & Required */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#2d2d25] mb-2">
                  Tipe Job
                </label>
                <div className="flex gap-2">
                  {JOB_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateForm("type", t)}
                      className={`flex-1 py-2 rounded-full text-xs font-medium border transition ${
                        form.type === t
                          ? "bg-[#16A34A] text-white border-[#16A34A]"
                          : "bg-white text-[#5a5a4e] border-[#e2ddd6]"
                      }`}
                    >
                      {t === "urgent" ? "Urgent ⚡" : "Non Urgent"}
                    </button>
                  ))}
                </div>
                {form.type === "urgent" && (
                  <p className="text-xs text-[#9a9688] mt-1">
                    Budget +15% biaya urgent
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2d2d25] mb-1.5">
                  Jumlah Needed
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.required}
                  onChange={(e) =>
                    updateForm("required", parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-[#2d2d25] mb-2">
                Budget (Opsional)
              </label>
              <div className="flex flex-wrap gap-3">
                {BUDGET_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateForm("budgetType", type)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                      form.budgetType === type
                        ? "bg-[#16A34A] text-white border-[#16A34A]"
                        : "bg-white text-[#5a5a4e] border-[#e2ddd6]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-xs text-[#9a9688] mb-1 block">
                    Min (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="50000"
                    value={form.budgetMin}
                    onChange={(e) => updateForm("budgetMin", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9a9688] mb-1 block">
                    Max (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="100000"
                    value={form.budgetMax}
                    onChange={(e) => updateForm("budgetMax", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm font-semibold text-[#2d2d25] mb-2">
                Jadwal (Opsional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9a9688] mb-1 block">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateForm("startDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9a9688] mb-1 block">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => updateForm("endDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9a9688] mb-1 block">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => updateForm("startTime", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9a9688] mb-1 block">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => updateForm("endTime", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2ddd6] bg-white text-sm text-[#2d2d25] outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 pb-6">
              <button
                type="button"
                onClick={() => navigate("/r")}
                className="flex-1 py-3 rounded-full border border-[#e2ddd6] text-[#5a5a4e] text-sm font-medium hover:bg-[#e2ddd6]/30 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-full bg-[#16A34A] text-white text-sm font-medium hover:bg-[#158a3a] disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Pasang Job"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddTawaranContent;
