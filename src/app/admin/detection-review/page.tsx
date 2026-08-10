import DetectionReviewDashboard from "@/components/admin/DetectionReviewDashboard"

interface DetectionReviewPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DetectionReviewPage({ searchParams }: DetectionReviewPageProps) {
  const query = await searchParams
  const review = Array.isArray(query.review) ? query.review.join(",") : query.review || ""
  return <DetectionReviewDashboard initialReviewSetQuery={review} />
}
