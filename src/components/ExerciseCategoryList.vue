<template>
  <div class="exercise-list">
    <template v-if="loading">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="list-item-two-line"
        class="mb-4"
      />
    </template>
    <template v-else>
      <v-card
        v-for="category in exercises"
        :key="category.category"
        class="mb-4"
        variant="outlined"
      >
        <v-card-title class="text-capitalize py-2 px-4 bg-primary text-white">
          {{ category.category }}
        </v-card-title>
        <v-card-text class="pa-0">
          <div class="exercise-items">
            <div v-for="exercise in category.exercises" :key="exercise.name" class="exercise-group pa-3">
              <div class="text-h6 mb-2">{{ exercise.name }}</div>
              <ExerciseCategoryItem
                :exercise="exercise"
                @delete="handleDelete"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ExerciseCategoryItem from './ExerciseCategoryItem.vue'

const props = defineProps({
  exercises: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete-exercise'])

const handleDelete = (exercise) => {
  emit('delete-exercise', exercise)
}
</script>

<style scoped>
.exercise-list {
  display: flex;
  flex-direction: column;
}

.exercise-items {
  display: flex;
  flex-direction: column;
}

.exercise-group {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.exercise-group:last-child {
  border-bottom: none;
}

.v-card-title {
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
}
</style>
