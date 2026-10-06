'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { RawAthlete, RawCrossing, RawDataset, RawRun, RawSession } from './types'

const PAGE_SIZE = 1000

const SESSION_COLUMNS = 'id, user_id, name, location, notes, distance, start_type, device_model, created_at'
const RUN_COLUMNS =
  'id, session_id, user_id, athlete_id, athlete_name, athlete_color, run_number, time_seconds, distance, start_type, reaction_time, is_personal_best, is_season_best, thumbnail_url, splits_json, created_at'
const ATHLETE_COLUMNS = 'id, name, nickname, color, photo_url, created_at, updated_at'
const CROSSING_COLUMNS = 'id, session_id, run_id, gate_role, thumbnail_url, created_at'

async function fetchAll<T>(
  supabase: SupabaseClient,
  table: string,
  columns: string,
  userId: string,
): Promise<T[]> {
  const rows: T[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)
    if (error) throw new Error(`Could not load ${table}: ${error.message}`)
    const page = (data ?? []) as T[]
    rows.push(...page)
    if (page.length < PAGE_SIZE) break
  }
  return rows
}

export async function fetchDashboardData(supabase: SupabaseClient, userId: string): Promise<RawDataset> {
  const [sessions, runs, athletes] = await Promise.all([
    fetchAll<RawSession>(supabase, 'sessions', SESSION_COLUMNS, userId),
    fetchAll<RawRun>(supabase, 'runs', RUN_COLUMNS, userId),
    fetchAll<RawAthlete>(supabase, 'athletes', ATHLETE_COLUMNS, userId),
  ])
  return { sessions, runs, athletes }
}

/** Crossing rows (start / split_N / finish photos) for the given runs. */
export async function fetchCrossings(supabase: SupabaseClient, runIds: string[]): Promise<RawCrossing[]> {
  const rows: RawCrossing[] = []
  const unique = [...new Set(runIds)]
  for (let i = 0; i < unique.length; i += 100) {
    const chunk = unique.slice(i, i + 100)
    const { data, error } = await supabase.from('crossings').select(CROSSING_COLUMNS).in('run_id', chunk)
    if (error) throw new Error(`Could not load crossing photos: ${error.message}`)
    rows.push(...((data ?? []) as RawCrossing[]))
  }
  return rows
}
