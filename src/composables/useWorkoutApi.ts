import type { Workout, WorkoutIndexEntry } from '../types/workout'

const BASE_URL = window.location.origin

/** Fetches the list of available workouts from the index file. */
export async function fetchWorkoutIndex(): Promise<WorkoutIndexEntry[]> {
  const res = await fetch(`${BASE_URL}/workouts/workout-index.json`)
  if (!res.ok) throw new Error('Failed to load workout index')
  return res.json()
}

/** Fetches a specific workout by its filename. */
export async function fetchWorkout(filename: string): Promise<Workout> {
  const res = await fetch(`${BASE_URL}/workouts/${filename}`)
  if (!res.ok) {
    console.error(`Failed to load workout: ${filename}`)
    throw new Error(`Failed to load workout: ${filename}`)
  }
  return res.json()
}

/** Saves a workout to the server via POST request. */
export async function saveWorkout(filename: string, workout: Workout): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, workout }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || 'Save failed')
  }
}
