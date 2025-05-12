<template>
  <v-list class="exercise-category-list">
    <template v-if="loading">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="list-item-avatar-two-line"
        class="mb-4"
      />
    </template>
    <template v-else>
      <div v-for="category in exercises" :key="category.category" class="category-group">
        <div class="category-header">
          <div class="category-name">{{ category.category }}</div>
        </div>
        <div class="exercises-container">
          <div v-for="exercise in category.exercises" :key="exercise.name" class="exercise-group">
            <div class="exercise-name">{{ exercise.name }}</div>
            <ExerciseCategoryItem
              v-for="entry in exercise.entries"
              :key="entry.id"
              :exercise="entry"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>
        </div>
      </div>
    </template>
  </v-list>
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

const emit = defineEmits(['edit-exercise', 'delete-exercise'])

const handleEdit = (updatedExercise) => {
  emit('edit-exercise', updatedExercise)
}

const handleDelete = (exercise) => {
  emit('delete-exercise', exercise)
}
</script>

<style scoped>
.exercise-category-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-header {
  padding: 8px 16px;
  background-color: #1976d2;
  border-radius: 8px;
}

.category-name {
  font-size: 20px;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
}

.exercises-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 8px;
}

.exercise-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 12px;
}

.exercise-name {
  font-size: 18px;
  font-weight: 500;
  color: #1976d2;
  margin-bottom: 8px;
}
</style>
