import type { Workout, FlatExercise } from '../types/workout'

/**
 * Flattens a workout's nested set/exercise structure into a linear list.
 * Each exercise is repeated according to its set's repeat count.
 */
export function flattenExercises(workout: Workout): FlatExercise[] {
  console.debug(`trying to flatten ${workout}`)
  const flat: FlatExercise[] = []
  let flatIndex = 0

  workout.sets.forEach((set, setIndex) => {
    for (let rep = 0; rep < set.setRepeat; rep++) {
      set.exercises.forEach((exercise, exerciseIndex) => {
        flat.push({
          ...exercise,
          setIndex,
          setName: set.setName,
          setRepeat: set.setRepeat,
          exerciseIndex,
          flatIndex: flatIndex++,
        })
      })
    }
  })
console.debug(`${flat}`)
  return flat
}
