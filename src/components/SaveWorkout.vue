<script setup lang="ts">
import { ref } from 'vue'
import type { Workout } from '../types/workout'
import { saveWorkout } from '../composables/useWorkoutApi'

const props = defineProps<{
  workout: Workout
}>()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const filename = ref('')
const saving = ref(false)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

/** Saves the workout to the server with the given filename. */
async function handleSave() {
  if (!filename.value.trim()) return
  saving.value = true
  saveError.value = null
  saveSuccess.value = false
  try {
    await saveWorkout(filename.value.trim(), props.workout)
    saveSuccess.value = true
    emit('saved')
    setTimeout(() => { saveSuccess.value = false }, 3000)
  } catch (e: any) {
    saveError.value = e.message ?? 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="save-workout">
    <div class="save-row">
      <v-text-field
        v-model="filename"
        label="Filename (without .json)"
        variant="outlined"
        density="compact"
        hide-details
        placeholder="my-custom-workout"
        class="filename-field"
        @keyup.enter="handleSave"
      />
      <v-btn
        color="primary"
        :loading="saving"
        :disabled="!filename.trim()"
        @click="handleSave"
        prepend-icon="mdi-content-save"
      >
        Save
      </v-btn>
    </div>
    <v-alert v-if="saveError" type="error" density="compact" class="mt-2">{{ saveError }}</v-alert>
    <v-alert v-if="saveSuccess" type="success" density="compact" class="mt-2">Workout saved successfully.</v-alert>
  </div>
</template>

<style scoped>
.save-workout {
  width: 100%;
}
.save-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.filename-field {
  flex: 1;
}
</style>
