<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
  >
    <v-card>
      <v-card-title class="text-h5 pa-4">
        Add {{ exercise?.name }} to Workout
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="exercise?.description"
          type="info"
          variant="tonal"
          class="mb-4"
        >
          {{ exercise.description }}
        </v-alert>

        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model.number="details.sets"
              label="Sets"
              type="number"
              min="1"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model.number="details.reps"
              label="Reps"
              type="number"
              min="1"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model.number="details.weight"
              :label="`Weight (${settings.weightUnit})`"
              type="number"
              min="0"
              :step="settings.isMetric ? 0.5 : 1"
              hide-details
            />
          </v-col>
        </v-row>

        <v-textarea
          v-model="details.notes"
          label="Notes"
          rows="3"
          class="mt-4"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          @click="handleAdd"
        >
          Add to Workout
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  exercise: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'add'])
const settings = useSettingsStore()

const details = reactive({
  sets: 3,
  reps: 12,
  weight: 0,
  notes: ''
})

// Watch for changes in metric setting to convert weight
watch(() => settings.isMetric, (newIsMetric, oldIsMetric) => {
  if (newIsMetric !== oldIsMetric && details.weight) {
    details.weight = settings.convertWeight(details.weight, newIsMetric)
  }
})

const handleAdd = () => {
  // Always store weight in kg internally
  const weightInKg = settings.isMetric 
    ? details.weight 
    : settings.convertWeight(details.weight, true)

  const workoutExercise = {
    name: props.exercise.name,
    category: props.exercise.category,
    muscleGroups: props.exercise.muscleGroups || [],
    sets: details.sets,
    reps: details.reps,
    weight: weightInKg,
    notes: details.notes.trim(),
    isCustom: props.exercise.isCustom || false
  }
  
  emit('add', workoutExercise)
  
  // Reset form
  details.sets = 3
  details.reps = 12
  details.weight = 0
  details.notes = ''
  
  // Close modal
  emit('update:modelValue', false)
}
</script> 