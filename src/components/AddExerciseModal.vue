<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    transition="dialog-bottom-transition"
  >
    <v-card class="exercise-modal">
      <v-card-title class="text-h5 pt-6 pb-2">
        Add Exercise
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSave" ref="form">
          <v-autocomplete
            v-model="exercise.name"
            :items="exerciseOptions"
            label="Exercise"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            :loading="loading"
            :disabled="loading"
            :error-messages="error"
          >
            <template v-slot:prepend-inner>
              <v-icon color="primary" class="mr-2">mdi-dumbbell</v-icon>
            </template>
          </v-autocomplete>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="exercise.sets"
                label="Sets"
                type="number"
                :rules="[rules.required, rules.minValue(1)]"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              >
                <template v-slot:prepend-inner>
                  <v-icon color="primary" class="mr-2">mdi-repeat</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="exercise.reps"
                label="Reps"
                type="number"
                :rules="[rules.required, rules.minValue(1)]"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              >
                <template v-slot:prepend-inner>
                  <v-icon color="primary" class="mr-2">mdi-counter</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="exercise.weight"
                label="Weight"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              >
                <template v-slot:prepend-inner>
                  <v-icon color="primary" class="mr-2">mdi-weight</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="exercise.timePerSet"
                label="Time per Set"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              >
                <template v-slot:prepend-inner>
                  <v-icon color="primary" class="mr-2">mdi-timer</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="handleCancel"
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
          Save Exercise
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useExerciseStore } from '@/stores/exercise'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  exercise: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:show', 'save-exercise'])

const exerciseStore = useExerciseStore()
const form = ref(null)
const loading = ref(false)
const error = ref(null)

// Local dialog state that syncs with the show prop
const dialog = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const rules = {
  required: value => !!value || 'Required.',
  minValue: (min) => value => value >= min || `Must be at least ${min}`
}

// Computed property for exercise options
const exerciseOptions = computed(() => {
  return exerciseStore.allExercises.map(ex => ex.name)
})

// Watch for show changes to reset form
watch(() => props.show, (newValue) => {
  if (!newValue) {
    error.value = null
    form.value?.reset()
  }
})

const handleSave = async () => {
  if (!form.value?.validate()) return

  try {
    loading.value = true
    error.value = null
    emit('save-exercise', { ...props.exercise })
    dialog.value = false
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  dialog.value = false
}
</script>

<style scoped>
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
