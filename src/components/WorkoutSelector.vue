<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchWorkoutIndex } from '../composables/useWorkoutApi'
import type { WorkoutIndexEntry } from '../types/workout'

const emit = defineEmits<{
  (e: 'select', entry: WorkoutIndexEntry): void
}>()

const workoutList = ref<WorkoutIndexEntry[]>([])
const selectedId = ref<string | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    workoutList.value = await fetchWorkoutIndex()
  } catch (e) {
    error.value = 'Could not load workout list.'
  } finally {
    loading.value = false
  }
})

/** Emits the selected workout entry when the Load button is clicked. */
function handleSelect() {
  const entry = workoutList.value.find(w => w.id === selectedId.value)
  if (entry) emit('select', entry)
}
</script>

<template>
  <div class="workout-selector">
    <v-progress-circular v-if="loading" indeterminate color="primary" />
    <v-alert v-else-if="error" type="error" density="compact">{{ error }}</v-alert>
    <div v-else class="selector-row">
      <v-select
        v-model="selectedId"
        :items="workoutList"
        item-title="name"
        item-value="id"
        label="Select a Workout"
        variant="solo-filled"
        density="compact"
        hide-details
        class="workout-select"
      />
      <v-btn
        color="primary"
        :disabled="!selectedId"
        @click="handleSelect"
        size="large"
      >
        Load
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.workout-selector {
  width: 100%;
  padding: 16px 0;
}
.selector-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.workout-select {
  flex: 1;
}
</style>
