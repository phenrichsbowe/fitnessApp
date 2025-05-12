<template>
  <div class="exercise-management-page">
    <Navbar />
    <v-main class="main-content">
      <v-container class="py-4 px-3 exercise-management-container" fluid>
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Exercise Management</h1>
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

        <div v-if="loading" class="exercise-skeleton">
          <v-skeleton-loader
            v-for="n in 3"
            :key="n"
            type="card"
            class="mb-4"
          />
        </div>

        <div v-else-if="error" class="text-center text-error my-6">
          {{ error }}
        </div>

        <div v-else-if="exerciseStore.allExercises.length === 0" class="text-center text-grey my-6">
          No exercises found. Add your first exercise!
        </div>

        <div v-else class="exercise-list">
          <div v-for="category in groupedExercises" :key="category.name" class="category-section">
            <div class="category-header">
              <h2 class="text-h6">{{ category.name }}</h2>
            </div>
            <v-list class="category-list">
              <v-list-item
                v-for="exercise in category.exercises"
                :key="exercise.name"
                class="exercise-item"
              >
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-dumbbell</v-icon>
                </template>
                <v-list-item-title>{{ exercise.name }}</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    icon
                    variant="text"
                    color="primary"
                    @click="editExercise(exercise)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    color="error"
                    @click="confirmDelete(exercise)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </div>

        <!-- Add/Edit Exercise Modal -->
        <v-dialog
          v-model="showModal"
          max-width="500"
          transition="dialog-bottom-transition"
        >
          <v-card class="exercise-modal">
            <v-card-title class="text-h5 pt-6 pb-2">
              {{ editingExercise ? 'Edit Exercise' : 'Add Exercise' }}
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="handleSave" ref="form">
                <v-text-field
                  v-model="exerciseForm.name"
                  label="Exercise Name"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  :disabled="loading"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mr-2">mdi-dumbbell</v-icon>
                  </template>
                </v-text-field>

                <v-select
                  v-model="exerciseForm.category"
                  :items="categories"
                  label="Category"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  :disabled="loading"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mr-2">mdi-tag</v-icon>
                  </template>
                </v-select>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0">
              <v-spacer></v-spacer>
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="closeModal"
                :disabled="loading"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                variant="elevated"
                @click="handleSave"
                :loading="loading"
                :disabled="loading"
              >
                {{ editingExercise ? 'Save Changes' : 'Add Exercise' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog
          v-model="showDeleteDialog"
          max-width="400"
        >
          <v-card>
            <v-card-title class="text-h5 pt-6">
              Delete Exercise
            </v-card-title>
            <v-card-text class="pt-4">
              Are you sure you want to delete "{{ exerciseToDelete?.name }}"? This action cannot be undone.
            </v-card-text>
            <v-card-actions class="pa-6 pt-0">
              <v-spacer></v-spacer>
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="showDeleteDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="error"
                variant="elevated"
                @click="handleDelete"
                :loading="loading"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useExerciseStore } from '@/stores/exercise'
import Navbar from '@/components/Navbar.vue'

const exerciseStore = useExerciseStore()
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const showDeleteDialog = ref(false)
const form = ref(null)
const editingExercise = ref(null)
const exerciseToDelete = ref(null)

const exerciseForm = ref({
  name: '',
  category: ''
})

const rules = {
  required: value => !!value || 'Required.'
}

const categories = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio',
  'Other'
]

// Computed property for grouped exercises
const groupedExercises = computed(() => {
  const grouped = {}
  exerciseStore.allExercises.forEach(exercise => {
    if (!grouped[exercise.category]) {
      grouped[exercise.category] = {
        name: exercise.category,
        exercises: []
      }
    }
    grouped[exercise.category].exercises.push(exercise)
  })
  return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name))
})

// Initialize store
onMounted(async () => {
  try {
    loading.value = true
    await exerciseStore.fetchAll()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const openModal = () => {
  editingExercise.value = null
  exerciseForm.value = {
    name: '',
    category: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingExercise.value = null
  exerciseForm.value = {
    name: '',
    category: ''
  }
}

const editExercise = (exercise) => {
  editingExercise.value = exercise
  exerciseForm.value = {
    name: exercise.name,
    category: exercise.category
  }
  showModal.value = true
}

const handleSave = async () => {
  if (!form.value?.validate()) return

  try {
    loading.value = true
    error.value = null

    if (editingExercise.value) {
      await exerciseStore.updateExercise(editingExercise.value.id, {
        name: exerciseForm.value.name,
        category: exerciseForm.value.category
      })
    } else {
      await exerciseStore.addExercise(
        exerciseForm.value.name,
        exerciseForm.value.category
      )
    }

    closeModal()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const confirmDelete = (exercise) => {
  exerciseToDelete.value = exercise
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!exerciseToDelete.value) return

  try {
    loading.value = true
    error.value = null
    await exerciseStore.deleteExercise(exerciseToDelete.value.id)
    showDeleteDialog.value = false
    exerciseToDelete.value = null
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.exercise-management-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 64px; /* Account for footer height */
}

.exercise-management-container {
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.add-exercise-btn {
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.exercise-skeleton {
  padding: 16px;
}

.text-grey {
  color: #888888;
}

.text-error {
  color: rgb(var(--v-theme-error));
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-section {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-header {
  background-color: #f5f5f5;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.category-list {
  padding: 8px 0;
}

.exercise-item {
  border-bottom: 1px solid #f5f5f5;
}

.exercise-item:last-child {
  border-bottom: none;
}

.exercise-modal {
  border-radius: 16px;
  overflow: hidden;
}

.v-card-title {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.v-text-field {
  margin-bottom: 16px;
}

:deep(.v-field--variant-outlined) {
  --v-field-border-opacity: 0.12;
}

:deep(.v-field--focused) {
  --v-field-border-opacity: 0.5;
}
</style> 