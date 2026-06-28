import { ref, computed, onUnmounted } from 'vue'
import type { FlatExercise } from '../types/workout'

const AUDIO_BASE = '/media'

const EXERCISE_STYLE_AUDIO: Record<string, string> = {
  cardio: 'cardio.mp3',
  hiit: 'hiit.mp3',
  heavybag: 'heavybag.mp3',
  shadowbox: 'shadowbox.mp3',
  stretch: 'stretch.mp3',
  rest: 'rest.mp3',
  core: 'core.mp3',
  strength: 'strength.mp3',
  circuit: 'circuit.mp3',
  burpees: 'burpees.mp3',
  jumprope: 'jumprope.mp3',
}

/** Returns the audio file path for a given exercise style. */
function getAudioPath(exerciseStyle: string): string {
  const file = EXERCISE_STYLE_AUDIO[exerciseStyle] ?? `${exerciseStyle}.mp3`
  return `${AUDIO_BASE}/${file}`
}

/** Creates a preloaded HTMLAudioElement for the given path. */
function createAudio(path: string): HTMLAudioElement {
  const audio = new Audio(path)
  audio.preload = 'auto'
  return audio
}

/**
 * Composable for managing workout timer state and playback.
 * Handles exercise progression, rest phases, audio cues, and skip controls.
 */
export function useWorkoutTimer(flatExercises: () => FlatExercise[]) {
  console.debug(flatExercises)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const currentFlatIndex = ref(0)
  const timeRemaining = ref(0)
  const isComplete = ref(false)
  const isRestPhase = ref(false)

  let intervalId: ReturnType<typeof setInterval> | null = null
  let currentAudio: HTMLAudioElement | null = null
  let countdownAudio: HTMLAudioElement | null = null
  let countdownPlayed = false

  const startAudio = createAudio(`${AUDIO_BASE}/start.mp3`)
  const completeAudio = createAudio(`${AUDIO_BASE}/complete.mp3`)
  const restAudio = createAudio(`${AUDIO_BASE}/rest.mp3`)

  const currentExercise = computed<FlatExercise | null>(() => {
    const exercises = flatExercises()

    return exercises[currentFlatIndex.value] ?? null
  })

  const totalExercises = computed(() => flatExercises().length)

  /** Plays the audio cue for the given exercise style. */
  function playExerciseAudio(style: string) {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
    currentAudio = createAudio(getAudioPath(style))
    currentAudio.play().catch(() => {})
  }

  /** Plays the 3-2-1 countdown audio cue. */
  function playCountdownAudio() {
    if (countdownAudio) {
      countdownAudio.pause()
      countdownAudio.currentTime = 0
    }
    countdownAudio = createAudio(`${AUDIO_BASE}/countdown.mp3`)
    countdownAudio.play().catch(() => {})
  }

  /** Transitions to the rest phase after completing an exercise. */
  function enterRestPhase(exercise: FlatExercise) {
    isRestPhase.value = true
    countdownPlayed = false
    timeRemaining.value = exercise.restDuration
    restAudio.currentTime = 0
    restAudio.play().catch(() => {})
  }

  /** Handles each tick of the timer (called every second while running). */
  function tick() {
    if (timeRemaining.value <= 0) {
      const exercises = flatExercises()
      const current = exercises[currentFlatIndex.value]

      if (!isRestPhase.value && current && current.restDuration > 0) {
        enterRestPhase(current)
        return
      }

      advance()
      return
    }

    if (timeRemaining.value === 3 && !countdownPlayed) {
      countdownPlayed = true
      playCountdownAudio()
    }

    timeRemaining.value -= 1
  }

  /** Moves to the next exercise in the workout sequence. */
  function advance() {
    const exercises = flatExercises()
    if (currentFlatIndex.value + 1 >= exercises.length) {
      stop()
      isComplete.value = true
      completeAudio.play().catch(() => {})
      return
    }

    currentFlatIndex.value += 1
    isRestPhase.value = false
    countdownPlayed = false
    const next = exercises[currentFlatIndex.value]
    timeRemaining.value = next.workDuration
    playExerciseAudio(next.exerciseStyle)
  }

  /** Starts the workout timer from the beginning. */
  function start() {
    const exercises = flatExercises()
    if (!exercises.length) return

    currentFlatIndex.value = 0
    isComplete.value = false
    isRestPhase.value = false
    countdownPlayed = false
    const first = exercises[0]
    timeRemaining.value = first.workDuration

    isRunning.value = true
    isPaused.value = false

    startAudio.play().catch(() => {})
    playExerciseAudio(first.exerciseStyle)

    intervalId = setInterval(tick, 1000)
  }

  /** Pauses the workout timer. */
  function pause() {
    if (!isRunning.value) return
    isPaused.value = true
    isRunning.value = false
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    if (currentAudio) currentAudio.pause()
  }

  /** Resumes the workout timer from a paused state. */
  function resume() {
    if (isComplete.value) return
    isPaused.value = false
    isRunning.value = true
    if (currentAudio) currentAudio.play().catch(() => {})
    intervalId = setInterval(tick, 1000)
  }

  /** Stops the timer and clears all audio. */
  function stop() {
    isRunning.value = false
    isPaused.value = false
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
  }

  /** Resets the timer to its initial state. */
  function reset() {
    stop()
    isComplete.value = false
    isRestPhase.value = false
    currentFlatIndex.value = 0
    timeRemaining.value = 0
    countdownPlayed = false
  }

  /** Skips to the next exercise in the workout. */
  function skipForward() {
    const exercises = flatExercises()
    if (currentFlatIndex.value + 1 < exercises.length) {
      currentFlatIndex.value += 1
      isRestPhase.value = false
      countdownPlayed = false
      const next = exercises[currentFlatIndex.value]
      timeRemaining.value = next.workDuration
      if (isRunning.value) playExerciseAudio(next.exerciseStyle)
    }
  }

  /** Skips to the previous exercise in the workout. */
  function skipBack() {
    if (currentFlatIndex.value > 0) {
      currentFlatIndex.value -= 1
      isRestPhase.value = false
      countdownPlayed = false
      const exercises = flatExercises()
      const prev = exercises[currentFlatIndex.value]
      timeRemaining.value = prev.workDuration
      if (isRunning.value) playExerciseAudio(prev.exerciseStyle)
    }
  }

  const formattedTime = computed(() => {
    const t = timeRemaining.value
    const m = Math.floor(t / 60)
    const s = t % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  onUnmounted(() => {
    stop()
  })

  return {
    isRunning,
    isPaused,
    isComplete,
    isRestPhase,
    currentFlatIndex,
    timeRemaining,
    formattedTime,
    currentExercise,
    totalExercises,
    start,
    pause,
    resume,
    stop,
    reset,
    skipForward,
    skipBack,
  }
}
