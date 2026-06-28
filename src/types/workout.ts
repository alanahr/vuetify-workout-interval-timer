export type ExerciseStyle =
  | 'cardio'
  | 'hiit'
  | 'heavybag'
  | 'shadowbox'
  | 'stretch'
  | 'rest'
  | 'core'
  | 'strength'
  | 'circuit'
  | 'burpees'
  | 'jumprope'

export interface Exercise {
  exerciseName: string
  exerciseStyle: ExerciseStyle
  exerciseValue: number
  exercisePic: string
  workDuration: number
  restDuration: number
}

export interface WorkoutSet {
  setName: string
  setRepeat: number
  exercises: Exercise[]
}

export interface Workout {
  workoutName: string
  sets: WorkoutSet[]
}

export interface FlatExercise {
  exerciseName: string
  exerciseStyle: ExerciseStyle
  exerciseValue: number
  exercisePic: string
  workDuration: number
  restDuration: number
  setIndex: number
  setName: string
  setRepeat: number
  exerciseIndex: number
  flatIndex: number
}

export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  currentFlatIndex: number
  timeRemaining: number
  totalElapsed: number
}

export interface WorkoutIndexEntry {
  id: string
  name: string
  filename: string
}
