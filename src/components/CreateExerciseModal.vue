<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
  >
    <v-card>
      <v-card-title class="text-h5 pa-4">
        Create Custom Exercise
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="form.name"
          label="Exercise Name"
          required
          :error-messages="nameError"
          @update:model-value="validateName"
        />

        <v-select
          v-model="form.category"
          :items="muscleGroups"
          label="Primary Muscle Group"
          required
          :error-messages="categoryError"
          @update:model-value="validateCategory"
        />

        <v-combobox
          v-model="form.muscleGroups"
          :items="muscleGroups"
          label="Secondary Muscle Groups"
          multiple
          chips
          closable-chips
        />

        <v-textarea
          v-model="form.description"
          label="Description (optional)"
          rows="3"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          @click="handleCreate"
          :disabled="!isValid"
        >
          Create Exercise
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  muscleGroups: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'create', 'error'])

const form = reactive({
  name: '',
  category: '',
  muscleGroups: [],
  description: ''
})

const nameError = ref('')
const categoryError = ref('')
const isValid = computed(() => !nameError.value && !categoryError.value)

const validateName = () => {
  if (!form.name?.trim()) {
    nameError.value = 'Please enter an exercise name'
    emit('error', nameError.value)
    return false
  }
  nameError.value = ''
  return true
}

const validateCategory = () => {
  if (!form.category) {
    categoryError.value = 'Please select a primary muscle group'
    emit('error', categoryError.value)
    return false
  }
  categoryError.value = ''
  return true
}

const handleCreate = () => {
  if (!validateName() || !validateCategory()) return

  emit('create', {
    name: form.name.trim(),
    category: form.category,
    muscleGroups: form.muscleGroups,
    description: form.description.trim()
  })
  
  handleCancel()
}

const handleCancel = () => {
  // Reset form
  form.name = ''
  form.category = ''
  form.muscleGroups = []
  form.description = ''
  nameError.value = ''
  categoryError.value = ''
  emit('update:modelValue', false)
}
</script> 