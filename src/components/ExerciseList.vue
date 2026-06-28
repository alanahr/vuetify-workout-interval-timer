<script setup lang="ts">
import type { FlatExercise } from '../types/workout'

defineProps<{
  flatExercises: FlatExercise[]
  currentFlatIndex: number
  isRunning: boolean
  isPaused: boolean
}>()
</script>

<template>
  <div class="exercise-list">
    <div
      v-for="(ex, i) in flatExercises"
      :key="i"
      class="exercise-row"
      :class="[
        `exercise-type-${ex.exerciseStyle}`,
        { 'is-current': i === currentFlatIndex, 'is-done': i < currentFlatIndex }
      ]"
    >
      <div class="row-indicator">
        <v-icon v-if="i < currentFlatIndex" size="16" color="grey">mdi-check</v-icon>
        <v-icon v-else-if="i === currentFlatIndex && (isRunning || isPaused)" size="16">mdi-play</v-icon>
        <span v-else class="row-num">{{ i + 1 }}</span>
      </div>
      <div class="row-content">
        <div class="row-exercise-name">{{ ex.exerciseName }}</div>
        <div class="row-meta">{{ ex.setName }}</div>
      </div>
      <div class="row-duration">{{ ex.exerciseValue }}m</div>
    </div>
  </div>
</template>

<style scoped>
.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exercise-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: opacity 0.2s, transform 0.2s;
  font-size: 1rem;
}

.exercise-row.is-done {
  opacity: 0.45;
}

.exercise-row.is-current {
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  font-weight: 600;
}

.row-indicator {
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  font-size: 0.75rem;
  color: inherit;
  opacity: 0.7;
}

.row-num {
  font-size: 0.75rem;
}

.row-content {
  flex: 1;
}

.row-exercise-name {
  font-weight: 500;
  line-height: 1.3;
}

.row-meta {
  font-size: 0.75rem;
  opacity: 0.65;
}

.row-duration {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.8;
  white-space: nowrap;
}
</style>
