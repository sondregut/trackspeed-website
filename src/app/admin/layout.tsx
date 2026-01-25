import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin Dashboard | TrackSpeed",
  description: "TrackSpeed admin dashboard for analytics and promo code management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#191919]">
      <AdminNav />
      {children}
    </div>
  );
}
