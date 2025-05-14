<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
  >
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="snackbar.show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>

  <v-container class="all-exercises">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 mb-6">Exercise Library</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col 
        v-for="group in exerciseStore.exercisesByMuscleGroup" 
        :key="group.name" 
        cols="12" 
        sm="6" 
        lg="4"
      >
        <v-expansion-panels>
          <exercise-group-panel
            :group="group"
            @exercise-click="openExerciseModal"
            @delete-exercise="handleDeleteExercise"
          />
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Create Exercise Button -->
    <v-row class="mt-4">
      <v-col cols="12" sm="6" lg="4">
        <v-btn
          color="success"
          prepend-icon="mdi-plus"
          variant="elevated"
          @click="showCreateModal = true"
          block
        >
          Create Custom Exercise
        </v-btn>
      </v-col>
    </v-row>

    <!-- Exercise Details Modal -->
    <exercise-details-modal
      v-model="showModal"
      :exercise="selectedExercise"
      @add="handleAddToWorkout"
    />

    <!-- Create Exercise Modal -->
    <create-exercise-modal
      v-model="showCreateModal"
      :muscle-groups="exerciseStore.exercisesByMuscleGroup.map(g => g.name)"
      @create="handleCreateExercise"
      @error="handleError"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Delete Exercise
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete "{{ exerciseToDelete?.name }}"?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="cancelDelete"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExerciseStore } from '@/stores/exercise'
import { useWorkoutStore } from '@/stores/workout'
import { useSettingsStore } from '@/stores/settings'
import ExerciseGroupPanel from '@/components/ExerciseGroupPanel.vue'
import ExerciseDetailsModal from '@/components/ExerciseDetailsModal.vue'
import CreateExerciseModal from '@/components/CreateExerciseModal.vue'

const router = useRouter()
const exerciseStore = useExerciseStore()
const workoutStore = useWorkoutStore()
const settings = useSettingsStore()

const showModal = ref(false)
const showCreateModal = ref(false)
const showDeleteDialog = ref(false)
const selectedExercise = ref(null)
const exerciseToDelete = ref(null)
const groupToDeleteFrom = ref(null)

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

const showSnackbar = (text, color = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

onMounted(async () => {
  try {
    console.log('Mounting AllExercises view')
    await exerciseStore.fetchAll()
    console.log('Exercise groups:', exerciseStore.exercisesByMuscleGroup)
    exerciseStore.exercisesByMuscleGroup.forEach(group => {
      console.log(`${group.name} exercises:`, group.exercises)
    })
  } catch (error) {
    console.error('Error in AllExercises mount:', error)
    showSnackbar('Error loading exercises', 'error')
  }
})

const openExerciseModal = (exercise) => {
  selectedExercise.value = exercise
  showModal.value = true
}

const handleAddToWorkout = async (workoutExercise) => {
  try {
    console.log('Adding exercise to workout:', workoutExercise)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Find the exercise template
    const exerciseTemplate = exerciseStore.findExerciseByName(workoutExercise.name)
    
    if (!exerciseTemplate) {
      console.error('Exercise template not found:', workoutExercise.name)
      showSnackbar('Error: Exercise not found in database', 'error')
      return
    }

    // Ensure we have a valid UUID
    if (!exerciseTemplate.id || typeof exerciseTemplate.id !== 'string') {
      console.error('Invalid exercise ID:', exerciseTemplate.id)
      showSnackbar('Error: Invalid exercise ID', 'error')
      return
    }
    
    await workoutStore.addExercise(today, {
      ...workoutExercise,
      exerciseId: exerciseTemplate.id
    })
    
    showSnackbar('Exercise added to workout')
    showModal.value = false
    router.push('/workout')
  } catch (error) {
    console.error('Error adding exercise to workout:', error)
    showSnackbar(error.message || 'Error adding exercise to workout', 'error')
  }
}

const handleCreateExercise = async (newExercise) => {
  try {
    await exerciseStore.createCustomExercise(newExercise)
    showSnackbar('Exercise created successfully')
    showCreateModal.value = false
  } catch (error) {
    showSnackbar('Error creating exercise', 'error')
  }
}

const handleError = (message) => {
  showSnackbar(message, 'error')
}

const handleDeleteExercise = ({ exercise, group }) => {
  if (!exercise.isCustom) return
  
  exerciseToDelete.value = exercise
  groupToDeleteFrom.value = group
  showDeleteDialog.value = true
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  exerciseToDelete.value = null
  groupToDeleteFrom.value = null
}

const confirmDelete = async () => {
  if (!exerciseToDelete.value) return
  
  try {
    await exerciseStore.deleteCustomExercise(exerciseToDelete.value.id)
    showSnackbar('Exercise deleted successfully', 'info')
    cancelDelete()
  } catch (error) {
    showSnackbar('Error deleting exercise', 'error')
  }
}
</script>

<style scoped>
.all-exercises {
  padding-top: 2rem;
  padding-bottom: 2rem;
  min-height: calc(100vh - 128px); /* Adjust for Navbar and AppFooter */
}
</style> 
