import { BookingRulesSection } from "@/components/admin/settings/booking-rules-section";
import { PaymentSection } from "@/components/admin/settings/payment-section";
import { SettingsSaveBar } from "@/components/admin/settings/settings-save-bar";
import { VenueProfileSection } from "@/components/admin/settings/venue-profile-section";

export default function AdminSetting() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola profil venue, aturan booking, dan pembayaran.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Halaman ini masih tampilan saja. Isian belum tersimpan dan belum
        terhubung ke database.
      </div>

      <VenueProfileSection />
      <BookingRulesSection />
      <PaymentSection />

      <SettingsSaveBar />
    </main>
  );
}
