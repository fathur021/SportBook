import { Card } from "@/components/ui/card";
import { Lock, User, Mail, MessageSquare } from "lucide-react";
import type { UserProfile } from "@/lib/user";

type Props = {
  user: UserProfile;
};

export function ContactDetailsCard({ user }: Props) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* 1. Header: Step 1 & Badge Encrypted Entry */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
            1
          </span>
          <h2 className="text-base font-bold text-slate-900">
            Contact & Player Details
          </h2>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Lock className="h-3.5 w-3.5 text-slate-400" />
          Encrypted Entry
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {/* 2. Baris 1: Full Name & Email Address (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kolom Nama */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-700">Full Name</span>
            <div className="flex items-center gap-2.5 h-10 px-3 rounded-xl border border-slate-200/90 bg-white text-xs text-slate-800">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-medium">{user.fullName}</span>
            </div>
          </div>

          {/* Kolom Email */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-700">Email Address</span>
            <div className="flex items-center gap-2.5 h-10 px-3 rounded-xl border border-slate-200/90 bg-white text-xs text-slate-800">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-medium">{user.email}</span>
            </div>
          </div>
        </div>

        {/* 3. Baris 2: Phone / WhatsApp Number */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">
              Phone / WhatsApp Number
            </span>
            <span className="text-[11px] font-medium text-emerald-700">
              Receives Instant Court QR Pass
            </span>
          </div>
          <div className="flex items-center gap-2.5 h-10 px-3 rounded-xl border border-slate-200/90 bg-white text-xs text-slate-800">
            <MessageSquare className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="font-medium">{user.phone}</span>
          </div>
        </div>

        {/* 4. Baris 3: Note to Venue (Optional) */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-slate-700">
            Note to Venue (Optional)
          </span>
          <div className="flex items-center h-10 px-3 rounded-xl border border-slate-200/90 bg-white text-xs text-slate-700">
            <span>{user.defaultNote || "-"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
