<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 py-3 px-4">
        {{ entry ? 'Edit Food Entry' : 'Add Food Entry' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="handleSave">
          <v-select
            v-model="formData.mealType"
            :items="mealTypes"
            label="Meal Type"
            required
            class="mb-2"
          />

          <v-text-field
            v-model="formData.food_name"
            label="Food Name"
            required
            :rules="[v => !!v || 'Food name is required']"
            class="mb-2"
          />

          <v-text-field
            v-model.number="formData.calories"
            label="Calories"
            type="number"
            min="0"
            required
            :rules="[v => v >= 0 || 'Must be 0 or greater']"
            class="mb-2"
          />

          <div class="d-flex gap-2">
            <v-text-field
              v-model.number="formData.protein"
              label="Protein (g)"
              type="number"
              min="0"
              :rules="[v => v >= 0 || 'Must be 0 or greater']"
            />

            <v-text-field
              v-model.number="formData.carbs"
              label="Carbs (g)"
              type="number"
              min="0"
              :rules="[v => v >= 0 || 'Must be 0 or greater']"
            />

            <v-text-field
              v-model.number="formData.fats"
              label="Fats (g)"
              type="number"
              min="0"
              :rules="[v => v >= 0 || 'Must be 0 or greater']"
            />
          </div>

          <v-textarea
            v-model="formData.notes"
            label="Notes"
            rows="2"
            class="mt-2"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="dialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!valid"
          @click="handleSave"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  entry: {
    type: Object,
    default: null
  },
  date: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref(null)
const valid = ref(false)
const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

const defaultFormData = {
  mealType: 'breakfast',
  food_name: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  notes: ''
}

const formData = ref({ ...defaultFormData })

watch(() => props.entry, (newEntry) => {
  if (newEntry) {
    formData.value = {
      mealType: newEntry.meal_type,
      food_name: newEntry.food_name,
      calories: newEntry.calories,
      protein: newEntry.protein,
      carbs: newEntry.carbs,
      fats: newEntry.fats,
      notes: newEntry.notes
    }
  } else {
    formData.value = { ...defaultFormData }
  }
}, { immediate: true })

const handleSave = async () => {
  if (!form.value.validate()) return

  emit('save', {
    mealType: formData.value.mealType,
    food_name: formData.value.food_name,
    calories: Number(formData.value.calories),
    protein: Number(formData.value.protein),
    carbs: Number(formData.value.carbs),
    fats: Number(formData.value.fats),
    notes: formData.value.notes
  })
}
</script> 