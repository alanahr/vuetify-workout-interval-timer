<script setup lang="ts">
import type { Workout } from '../types/workout'
import type { useWorkoutEdit } from '../composables/useWorkoutEdit'

  // # todo - get below from constant - maybe in types
  // # should be metadata
const EXERCISE_STYLES = [
  'cardio', 'hiit', 'heavybag', 'shadowbox', 'stretch',
  'rest', 'core', 'strength', 'circuit', 'burpees', 'jumprope',
]

defineProps<{
  workout: Workout
  edit: ReturnType<typeof useWorkoutEdit>
}>()
</script>

<template>
  <div class="edit-mode">
    <div class="edit-section-header">
      <span class="edit-section-title">Workout Name</span>
    </div>
    <v-text-field
      :model-value="workout.workoutName"
      @update:model-value="edit.updateWorkoutName($event as string)"
      variant="outlined"
      density="compact"
      hide-details
      class="mb-4"
    />

    <div v-for="(set, si) in workout.sets" :key="si" class="set-card">
      <div class="set-header">
        <v-text-field
          :model-value="set.setName"
          @update:model-value="edit.updateSetName(si, $event as string)"
          label="Set Name"
          variant="outlined"
          density="compact"
          hide-details
          class="set-name-field"
        />
        <div class="set-repeat-control">
          <span class="repeat-label">Repeat</span>
          <v-btn icon size="x-small" variant="text" @click="edit.updateSetRepeat(si, set.setRepeat - 1)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <span class="repeat-value">{{ set.setRepeat }}</span>
          <v-btn icon size="x-small" variant="text" @click="edit.updateSetRepeat(si, set.setRepeat + 1)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="set-actions">
          <v-btn icon size="x-small" variant="text" @click="edit.moveSetUp(si)" :disabled="si === 0">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          <v-btn icon size="x-small" variant="text" @click="edit.moveSetDown(si)" :disabled="si === workout.sets.length - 1">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
          <v-btn icon size="x-small" variant="text" color="error" @click="edit.removeSet(si)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-for="(ex, ei) in set.exercises" :key="ei" class="exercise-edit-row" :class="`exercise-type-${ex.exerciseStyle}`">
        <div class="exercise-edit-main">
          <v-text-field
            :model-value="ex.exerciseName"
            @update:model-value="edit.updateExerciseName(si, ei, $event as string)"
            label="Exercise"
            variant="outlined"
            density="compact"
            hide-details
            class="ex-name-field"
          />
          <v-select
            :model-value="ex.exerciseStyle"
            @update:model-value="edit.updateExerciseStyle(si, ei, $event as any)"
            :items="EXERCISE_STYLES"
            label="Type"
            variant="outlined"
            density="compact"
            hide-details
            class="ex-style-field"
          />
          <div class="value-control">
            <v-btn icon size="x-small" variant="text" @click="edit.decrementValue(si, ei)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <span class="value-display">{{ ex.exerciseValue }}m</span>
            <v-btn icon size="x-small" variant="text" @click="edit.incrementValue(si, ei)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="value-control">
            <v-btn icon size="x-small" variant="text" @click="edit.decrementTime('workDuration', si, ei)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <span class="value-display">{{ ex.workDuration }}s</span>
            <v-btn icon size="x-small" variant="text" @click="edit.incrementTime('workDuration', si, ei)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
        </div>
        
        <div class="exercise-edit-actions">
          <v-btn icon size="x-small" variant="text" @click="edit.moveExerciseUp(si, ei)" :disabled="ei === 0">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          <v-btn icon size="x-small" variant="text" @click="edit.moveExerciseDown(si, ei)" :disabled="ei === set.exercises.length - 1">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
          <v-btn icon size="x-small" variant="text" color="error" @click="edit.removeExercise(si, ei)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>

      <v-btn
        size="small"
        variant="tonal"
        prepend-icon="mdi-plus"
        @click="edit.addExercise(si)"
        class="mt-2"
      >
        Add Exercise
      </v-btn>
    </div>

    <v-btn
      block
      variant="tonal"
      prepend-icon="mdi-plus"
      @click="edit.addSet()"
      class="mt-2"
    >
      Add Set
    </v-btn>
  </div>
</template>

<style scoped>
.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.edit-section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
  font-weight: 600;
}

.set-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.set-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.set-name-field {
  flex: 1;
  min-width: 120px;
}

.set-repeat-control {
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 2px 6px;
}

.repeat-label {
  font-size: 0.75rem;
  color: #666;
  margin-right: 2px;
}

.repeat-value {
  font-weight: 700;
  min-width: 20px;
  text-align: center;
}

.set-actions {
  display: flex;
  gap: 2px;
}

.exercise-edit-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  flex-wrap: wrap;
}

.exercise-edit-main {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  flex-wrap: wrap;
}

.ex-name-field {
  flex: 2;
  min-width: 120px;
}

.ex-style-field {
  flex: 1;
  min-width: 100px;
}

.value-control {
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(255,255,255,0.6);
  border-radius: 6px;
  padding: 2px 4px;
  white-space: nowrap;
}

.value-display {
  font-weight: 700;
  min-width: 36px;
  text-align: center;
  font-size: 0.85rem;
}

.exercise-edit-actions {
  display: flex;
  gap: 2px;
}
</style>
