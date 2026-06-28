<script setup lang="ts">
import { computed } from 'vue'
import type { FlatExercise } from '../types/workout'

const props = defineProps<{
  formattedTime: string
  currentExercise: FlatExercise | null
  currentFlatIndex: number
  totalExercises: number
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
  isRestPhase: boolean
}>()

defineEmits<{
  (e: 'start'): void
  (e: 'pause'): void
  (e: 'resume'): void
  (e: 'reset'): void
  (e: 'skipForward'): void
  (e: 'skipBack'): void
}>()

/** Computes the CSS class for the timer background based on current exercise style. */
const timerBgClass = computed(() => {
  if (props.isRestPhase) return 'timer-bg-rest'
  if (!props.currentExercise) return 'timer-bg-rest'
  return `timer-bg-${props.currentExercise.exerciseStyle}`
})

/** Computes the phase label text (Work or Rest). */
const phaseLabel = computed(() => {
  if (props.isRestPhase) return 'Rest'
  if (!props.currentExercise) return ''
  return 'Work'
})

/** Computes the workout progress percentage for the progress ring. */
const progressPercent = computed(() => {
  if (props.totalExercises === 0) return 0
  return Math.round(((props.currentFlatIndex + 1) / props.totalExercises) * 100)
})
</script>

<template>
  <div class="timer-wrapper" :class="timerBgClass">
    <div class="timer-inner">
    <v-container class="timer-inner">
      <v-row>
        <v-col cols="6">
          <div class="timer-meta">
            <span class="set-name">{{ currentExercise?.setName ?? '' }}</span>
            <span class="exercise-count">{{ currentFlatIndex + 1 }} / {{ totalExercises }}</span>
          </div>
        </v-col>
        <v-col cols="6">

          <div class="phase-label" v-if="(isRunning || isPaused) && !isComplete">
            {{ phaseLabel }}
          </div>
    
          <div class="exercise-name">
            {{ isComplete ? 'Workout Complete!' : (currentExercise?.exerciseName ?? 'Ready') }}
          </div>
          </v-col>
        </v-row>
      </v-container>

   <div class="timer-countdown">{{ formattedTime }}</div>
    
<!--
      <v-progress-linear
        :model-value="progressPercent"
        color="rgba(255,255,255,0.6)"
        bg-color="rgba(0,0,0,0.2)"
        height="6"
        rounded
        class="timer-progress"
      />
      -->

      <div class="timer-controls">
        <v-btn icon variant="text" color="white" @click="$emit('skipBack')">
          <v-icon size="30">mdi-skip-previous</v-icon>
        </v-btn>

        <v-progress-circular
      :model-value="progressPercent"
      :size="100" :width="12"
        color="blue"
        bg-color="rgba(0,0,0,0.2)"
        
        class="timer-progress">

<v-btn
          v-if="!isRunning && !isPaused && !isComplete"
          icon
          variant="flat"
          color="white"
          size="x-large"
          class="main-control-btn"
          @click="$emit('start')"
        >
          <v-icon size="40" color="grey-darken-3">mdi-play</v-icon>
        </v-btn>

        <v-btn
          v-if="isRunning"
          icon
          variant="flat"
          color="white"
          size="x-large"
          class="main-control-btn"
          @click="$emit('pause')"
        >
          <v-icon size="40" color="grey-darken-3">mdi-pause</v-icon>
        </v-btn>

        <v-btn
          v-if="isPaused"
          icon
          variant="flat"
          color="white"
          size="x-large"
          class="main-control-btn"
          @click="$emit('resume')"
        >
          <v-icon size="40" color="grey-darken-3">mdi-play</v-icon>
        </v-btn>

        <v-btn
          v-else-if="isComplete"
          icon
          variant="flat"
          color="white"
          size="x-large"
          class="main-control-btn"
          @click="$emit('reset')"
        >
          <v-icon size="40" color="grey-darken-3">mdi-restart</v-icon>
        </v-btn>
      
    </v-progress-circular>

        <v-btn icon variant="text" color="white" @click="$emit('skipForward')">
          <v-icon size="30">mdi-skip-next</v-icon>
        </v-btn>
      </div>

      <v-btn
        v-if="isRunning || isPaused"
        variant="text"
        color="rgba(255,255,255,0.7)"
        size="small"
        @click="$emit('reset')"
      >
        Stop &amp; Reset
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.timer-wrapper {
  border-radius: 16px;
  transition: background-color 0.4s ease;
  padding: 32px 24px 24px;
  color: white;
  text-align: center;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.timer-meta {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 1rem;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.phase-label {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 10px;
  border-radius: 20px;
}

.exercise-name {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.timer-countdown {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -2px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.timer-progress {
  width: 100%;
  margin: 4px 0;
}

.timer-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.main-control-btn {
  border-radius: 50% !important;
}
</style>
