<script setup lang="ts">
import { ref, computed } from 'vue'
import WorkoutSelector from './components/WorkoutSelector.vue'
import TimerDisplay from './components/TimerDisplay.vue'
import ExerciseList from './components/ExerciseList.vue'
import EditMode from './components/EditMode.vue'
import SaveWorkout from './components/SaveWorkout.vue'
import { fetchWorkout } from './composables/useWorkoutApi'
import { flattenExercises } from './composables/useFlatExercises'
import { useWorkoutTimer } from './composables/useWorkoutTimer'
import { useWorkoutEdit } from './composables/useWorkoutEdit'
import type { Workout, WorkoutIndexEntry, FlatExercise } from './types/workout'

const workout = ref<Workout | null>(null)
const flatList = ref<FlatExercise[]>([])
const loading = ref(false)
const showTimer = ref(true)
const showList = ref(true)
const loadError = ref<string | null>(null)

/** Rebuilds the flat exercise list when the workout changes. */
function rebuildFlat() {
  if (workout.value) {
    console.debug("flattening workout")
    flatList.value = flattenExercises(workout.value)
  }
}

 /** Toggles the timer display visibility. */
 function toggleTimer() {
    showTimer.value = !showTimer.value
  }
 /** Toggles the exercise list visibility. */
 function toggleList() {
    showList.value = !showList.value
  }
  
/** Loads a workout from the server and initializes the timer. */
async function loadWorkout(entry: WorkoutIndexEntry) {
  loading.value = true
  console.debug(entry)
  loadError.value = null
  try {
    workout.value = await fetchWorkout(entry.filename)
    rebuildFlat()
    timer.reset()
  } catch (e: any) {
    console.error(`Failed to load workout: ${e.message}`)
    loadError.value = e.message ?? 'Failed to load workout'
  } finally {
    loading.value = false
  }
}

const timer = useWorkoutTimer(() => flatList.value)

const edit = useWorkoutEdit(
  () => workout.value!,
  () => { rebuildFlat() }
)

const hasWorkout = computed(() => workout.value !== null)
</script>

<template>
  <v-app>
    <v-app-bar :elevation="0" density="compact" color="white" border="b">
       <template v-slot:prepend>
         <v-btn icon="mdi-timer" @click ="toggleTimer()"
          :color="showTimer ? 'primary' : 'info'"></v-btn>

         <v-btn icon="mdi-list-box" @click="toggleList()"
          :color="showList ? 'primary' : 'info'">

          </v-btn>
          
         <v-btn
          v-if="hasWorkout"
          :icon="edit.isEditMode.value ? 'mdi-check' : 'mdi-pencil'"
          variant="text"
          @click="edit.toggleEditMode()"
          :color="edit.isEditMode.value ? 'primary' : undefined"
        />
         
         <v-btn icon="mdi-plus"></v-btn>
         

    
        </template>
      <v-app-bar-title>
        <span class="app-title"> 
        <v-icon
            color="green-darken-2"
            icon="mdi-home"
            size="large"
          ></v-icon>
              </span>
      </v-app-bar-title>
      
        <WorkoutSelector @select="loadWorkout" />
      <template #append>
        
        
      </template>
    </v-app-bar>

    <v-main>
      <v-container min-width="750px" class="mb-1">

       
        <v-alert v-if="loadError" type="error" density="compact" class="mb-2">{{ loadError }}</v-alert>

        <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-2" />
        
        <div v-if="!loading && !hasWorkout" class="empty-state">
          <v-icon size="64" color="grey-lighten-1">mdi-timer-outline</v-icon>
          <p class="empty-text">Select a workout above to get started.</p>
        </div>

        <!-- <template v-if="hasWorkout && !loading"> -->
          <div v-if="hasWorkout" class="workout-header mb-1">
            <h2 class="workout-title">{{ workout!.workoutName }}</h2>
          </div>
         <v-container class="bg-surface-variant">
           <v-row density="compact">
             <v-col sm="12" md="6" v-if="showTimer">
          
              <TimerDisplay
                :formatted-time="timer.formattedTime.value"
                :current-exercise="timer.currentExercise.value"
                :current-flat-index="timer.currentFlatIndex.value"
                :total-exercises="timer.totalExercises.value"
                :is-running="timer.isRunning.value"
                :is-paused="timer.isPaused.value"
                :is-complete="timer.isComplete.value"
                :is-rest-phase="timer.isRestPhase.value"
                @start="timer.start()"
                @pause="timer.pause()"
                @resume="timer.resume()"
                @reset="timer.reset()"
                @skip-forward="timer.skipForward()"
                @skip-back="timer.skipBack()"
              />
              
             </v-col>
             
           
        
       <v-col sm="12" md="6"  v-if="showList">
         <h2>Exercise List</h2>
         <ExerciseList
                :flat-exercises="flatList"
                :current-flat-index="timer.currentFlatIndex.value"
                :is-running="timer.isRunning.value"
                :is-paused="timer.isPaused.value"
              />
          
       </v-col>
        <v-col cols="12" v-if="edit.isEditMode.value">
        
            <EditMode :workout="workout!" :edit="edit" />
              <v-divider class="my-4" />
              <SaveWorkout :workout="workout!" @saved="() => {}" />
          </v-col>
         
           </v-row>
         </v-container>


        
        

      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-title {
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}

.workout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.workout-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #212121;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  gap: 16px;
}

.empty-text {
  color: #9e9e9e;
  font-size: 1rem;
}
</style>
