<template>
  <v-container class="py-4 px-3 workout-history-container" fluid>
    <div v-if="loading" class="workout-skeleton">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="card"
        class="mb-4"
      ></v-skeleton-loader>
    </div>

    <div v-else-if="error" class="text-center text-error my-6">
      {{ error }}
    </div>

    <div v-else-if="workouts.length === 0" class="text-center text-grey my-6">
      No workouts recorded for this date.
    </div>

    <ExerciseCategoryList
      v-else
      :exercises="workouts"
      :loading="loading"
      @delete-exercise="handleDeleteExercise"
    />

    <div class="d-flex justify-center mt-6">
      <v-btn
        color="primary"
        class="add-exercise-btn"
        @click="openModal"
        :loading="loading"
        :disabled="loading"
      >
        <v-icon start>mdi-plus</v-icon>
        Add Exercise
      </v-btn>
    </div>

    <AddExerciseModal
      v-model:show="showModal"
      :exercise="newExercise"
      @save-exercise="saveExercise"
    />
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useWorkoutStore } from '@/stores/workout'
import { useExerciseStore } from '@/stores/exercise'
import ExerciseCategoryList from './ExerciseCategoryList.vue'
import AddExerciseModal from './AddExerciseModal.vue'

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true
  }
})

const workoutStore = useWorkoutStore()
const exerciseStore = useExerciseStore()

const showModal = ref(false)
const loading = ref(false)
const error = ref(null)

const newExercise = ref({
  name: '',
  sets: 3,
  reps: 10,
  weight: '',
  timePerSet: ''
})

// Computed property for workouts
const workouts = computed(() => {
  return workoutStore.getWorkoutsByDate(props.selectedDate)
})

// Initialize stores
onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      workoutStore.fetchWorkouts(),
      exerciseStore.fetchAll()
    ])
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// Watch for date changes
watch(() => props.selectedDate, async (newDate) => {
  try {
    loading.value = true
    error.value = null
    
    // Check if we already have the workout for this date
    const existingWorkout = workoutStore.getWorkoutByDate(newDate)
    if (!existingWorkout) {
      // Only fetch if we don't have the workout
      await workoutStore.fetchWorkouts()
    }
  } catch (err) {
    error.value = 'Failed to load workouts: ' + err.message
    console.error('Error fetching workouts:', err)
  } finally {
    loading.value = false
  }
})

const openModal = () => {
  showModal.value = true
}

const handleDeleteExercise = async (exerciseToDelete) => {
  try {
    loading.value = true
    await workoutStore.removeExercise(
      props.selectedDate,
      exerciseToDelete.name,
      exerciseToDelete.id
    )
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const saveExercise = async () => {
  if (!newExercise.value.name) return

  try {
    loading.value = true
    const exerciseData = {
      ...newExercise.value,
      category: exerciseStore.allExercises.find(ex => ex.name === newExercise.value.name)?.category
    }
    await workoutStore.addExercise(props.selectedDate, exerciseData)
    
    // Reset form
    newExercise.value = {
      name: '',
      sets: 3,
      reps: 10,
      weight: '',
      timePerSet: ''
    }
    showModal.value = false
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.workout-history-container {
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.text-grey {
  color: #888888;
}

.text-error {
  color: rgb(var(--v-theme-error));
}

.add-exercise-btn {
  min-width: 220px;
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.workout-skeleton {
  padding: 16px;
}
</style>
