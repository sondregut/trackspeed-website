import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | TrackSpeed",
  description: "TrackSpeed admin dashboard for promo code management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin layout without the main site navbar/footer
  return (
    <div className="min-h-screen bg-[#191919]">
      {children}
    </div>
  );
}
