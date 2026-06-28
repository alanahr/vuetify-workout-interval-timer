import { ref } from 'vue'
import type { Workout, ExerciseStyle } from '../types/workout'

const STEP = 0.25

/**
 * Composable for managing workout editing state and operations.
 * Provides functions to add/remove/reorder sets and exercises, and update their properties.
 */
export function useWorkoutEdit(workout: () => Workout, onChanged: () => void) {
  const isEditMode = ref(false)

  /** Toggles edit mode on/off. */
  function toggleEditMode() {
    isEditMode.value = !isEditMode.value
  }

  /** Updates the workout's name. */
  function updateWorkoutName(name: string) {
    workout().workoutName = name
    onChanged()
  }

  /** Adds a new set with default values to the workout. */
  function addSet() {
    workout().sets.push({
      setName: 'New Set',
      setRepeat: 1,
      exercises: [
        {
          exerciseName: 'Exercise',
          exerciseStyle: 'cardio',
          exerciseValue: 1,
          exercisePic: '',
          workDuration: 60,
          restDuration: 0,
        },
      ],
    })
    onChanged()
  }

  /** Removes a set at the given index. */
  function removeSet(setIndex: number) {
    workout().sets.splice(setIndex, 1)
    onChanged()
  }

  /** Moves a set up one position in the list. */
  function moveSetUp(setIndex: number) {
    if (setIndex === 0) return
    const sets = workout().sets
    ;[sets[setIndex - 1], sets[setIndex]] = [sets[setIndex], sets[setIndex - 1]]
    onChanged()
  }

  /** Moves a set down one position in the list. */
  function moveSetDown(setIndex: number) {
    const sets = workout().sets
    if (setIndex === sets.length - 1) return
    ;[sets[setIndex], sets[setIndex + 1]] = [sets[setIndex + 1], sets[setIndex]]
    onChanged()
  }

  /** Updates the name of a set at the given index. */
  function updateSetName(setIndex: number, name: string) {
    workout().sets[setIndex].setName = name
    onChanged()
  }

  /** Updates the repeat count for a set (minimum 1). */
  function updateSetRepeat(setIndex: number, value: number) {
    workout().sets[setIndex].setRepeat = Math.max(1, value)
    onChanged()
  }

  /** Adds a new exercise with default values to a set. */
  function addExercise(setIndex: number) {
    workout().sets[setIndex].exercises.push({
      exerciseName: 'New Exercise',
      exerciseStyle: 'cardio',
      exerciseValue: 1,
      exercisePic: '',
      workDuration: 60,
      restDuration: 30,
    })
    onChanged()
  }

  /** Removes an exercise from a set at the given indices. */
  function removeExercise(setIndex: number, exerciseIndex: number) {
    workout().sets[setIndex].exercises.splice(exerciseIndex, 1)
    onChanged()
  }

  /** Moves an exercise up one position within its set. */
  function moveExerciseUp(setIndex: number, exerciseIndex: number) {
    if (exerciseIndex === 0) return
    const exs = workout().sets[setIndex].exercises
    ;[exs[exerciseIndex - 1], exs[exerciseIndex]] = [exs[exerciseIndex], exs[exerciseIndex - 1]]
    onChanged()
  }

  /** Moves an exercise down one position within its set. */
  function moveExerciseDown(setIndex: number, exerciseIndex: number) {
    const exs = workout().sets[setIndex].exercises
    if (exerciseIndex === exs.length - 1) return
    ;[exs[exerciseIndex], exs[exerciseIndex + 1]] = [exs[exerciseIndex + 1], exs[exerciseIndex]]
    onChanged()
  }

  /** Updates the name of an exercise. */
  function updateExerciseName(setIndex: number, exerciseIndex: number, name: string) {
    workout().sets[setIndex].exercises[exerciseIndex].exerciseName = name
    onChanged()
  }

  /** Updates the style of an exercise (e.g., cardio, hiit, stretch). */
  function updateExerciseStyle(setIndex: number, exerciseIndex: number, style: ExerciseStyle) {
    workout().sets[setIndex].exercises[exerciseIndex].exerciseStyle = style
    onChanged()
  }

  /** Increments the exercise value by 0.25. */
  function incrementValue(setIndex: number, exerciseIndex: number) {
    const ex = workout().sets[setIndex].exercises[exerciseIndex]
    ex.exerciseValue = Math.round((ex.exerciseValue + STEP) * 100) / 100
    onChanged()
  }

  /** Decrements the exercise value by 0.25 (minimum 0.25). */
  function decrementValue(setIndex: number, exerciseIndex: number) {
    const ex = workout().sets[setIndex].exercises[exerciseIndex]
    ex.exerciseValue = Math.max(STEP, Math.round((ex.exerciseValue - STEP) * 100) / 100)
    onChanged()
  }

  /** Increments a time duration (work or rest) by 30 seconds. */
  function incrementTime(timeType: 'workDuration' | 'restDuration', setIndex: number, exerciseIndex: number) {
    const ex = workout().sets[setIndex].exercises[exerciseIndex]
    ex[timeType] = (ex[timeType] + 30)
    onChanged()
  }

  /** Decrements a time duration (work or rest) by 30 seconds. */
  function decrementTime(timeType: 'workDuration' | 'restDuration', setIndex: number, exerciseIndex: number) {
    const ex = workout().sets[setIndex].exercises[exerciseIndex]
    ex[timeType] = (ex[timeType] - 30)
    onChanged()
  }

  return {
    isEditMode,
    toggleEditMode,
    updateWorkoutName,
    addSet,
    removeSet,
    moveSetUp,
    moveSetDown,
    updateSetName,
    updateSetRepeat,
    addExercise,
    removeExercise,
    moveExerciseUp,
    moveExerciseDown,
    updateExerciseName,
    updateExerciseStyle,
    incrementValue,
    decrementValue,
    incrementTime,
    decrementTime
  }
}
