import assert from "node:assert/strict"
import test from "node:test"
import {
  clusterConcurrentEvidenceSessions,
  clusterEvidenceEvents,
  evidenceSetupStatus,
  isDetectionEvidenceReviewLabel,
} from "../src/lib/detection-evidence.ts"

test("accepted windows inside 750 ms form one physical crossing", () => {
  const clusters = clusterEvidenceEvents([
    { id: "a", eventWallClockUnixMs: 10_000 },
    { id: "b", eventWallClockUnixMs: 10_120 },
    { id: "c", eventWallClockUnixMs: 12_000 },
  ])
  assert.deepEqual(clusters.map((cluster) => cluster.map((event) => event.id)), [
    ["a", "b"],
    ["c"],
  ])
})

test("separate concurrent phone blocks are not cross-compared", () => {
  const groups = clusterConcurrentEvidenceSessions([
    { id: "block-1-a", startedUnixMs: 10_000, endedUnixMs: 20_000 },
    { id: "block-1-b", startedUnixMs: 11_000, endedUnixMs: 19_000 },
    { id: "block-2-a", startedUnixMs: 40_000, endedUnixMs: 50_000 },
    { id: "block-2-b", startedUnixMs: 41_000, endedUnixMs: 51_000 },
  ])
  assert.deepEqual(groups.map((group) => group.map((session) => session.id)), [
    ["block-1-a", "block-1-b"],
    ["block-2-a", "block-2-b"],
  ])
})

test("setup timing is distinguished from covered detector evidence", () => {
  const intervals = [
    { startUnixMs: 10_000, endUnixMs: 12_000, frameCount: 61 },
    { startUnixMs: 15_000, endUnixMs: 20_000, frameCount: 151 },
  ]
  assert.equal(evidenceSetupStatus(9_900, 10_000, 20_000, intervals), "before_ready")
  assert.equal(evidenceSetupStatus(15_000, 10_000, 20_000, intervals), "covered")
  assert.equal(evidenceSetupStatus(13_500, 10_000, 20_000, intervals), "capture_gap")
  assert.equal(evidenceSetupStatus(20_500, 10_000, 20_000, intervals), "after_coverage")
  assert.equal(evidenceSetupStatus(15_000, 10_000, 20_000, []), "unmeasured")
  assert.equal(evidenceSetupStatus(15_000, null, 20_000), "unmeasured")
})

test("review labels are constrained to the evidence contract", () => {
  assert.equal(isDetectionEvidenceReviewLabel("true_crossing"), true)
  assert.equal(isDetectionEvidenceReviewLabel("hard_negative"), true)
  assert.equal(isDetectionEvidenceReviewLabel("false_positive"), false)
})
