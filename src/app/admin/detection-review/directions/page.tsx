import DirectionReviewDashboard from "@/components/admin/DirectionReviewDashboard"
import { directionReviewCohort } from "@/lib/direction-review-cohorts"

interface DirectionReviewPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function queryValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value.join(",") : value || ""
}

export default async function DirectionReviewPage({ searchParams }: DirectionReviewPageProps) {
  const query = await searchParams
  const cohortId = queryValue(query.cohort)
  const cohort = directionReviewCohort(cohortId)
  const reviewQuery = cohort
    ? cohort.items.map((item) => item.captureId).join(",")
    : queryValue(query.review)
  const unsureQuery = cohort
    ? cohort.items
        .filter((item) => item.agentFlag === "unsure")
        .map((item) => item.captureId)
        .join(",")
    : queryValue(query.unsure)
  return (
    <DirectionReviewDashboard
      reviewQuery={reviewQuery}
      unsureQuery={unsureQuery}
      cohortId={cohort?.id}
    />
  )
}
