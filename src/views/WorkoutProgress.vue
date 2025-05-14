<template>
  <v-container class="py-4 px-3 pb-16">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Workout Progress</h1>
      </v-col>

      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title class="text-h6">
            Weekly Overview
          </v-card-title>
          <v-card-text>
            <WorkoutProgressChart />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title class="text-h6">
            Quick Stats
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-calendar-check</v-icon>
                </template>
                <v-list-item-title>Workouts This Week</v-list-item-title>
                <v-list-item-subtitle>{{ weeklyWorkouts }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-dumbbell</v-icon>
                </template>
                <v-list-item-title>Total Exercises</v-list-item-title>
                <v-list-item-subtitle>{{ totalExercises }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-trending-up</v-icon>
                </template>
                <v-list-item-title>Most Popular Category</v-list-item-title>
                <v-list-item-subtitle>{{ mostPopularCategory }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title class="text-h6">
            Recent Achievements
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-if="hasWorkoutsThisWeek">
                <template v-slot:prepend>
                  <v-icon color="success">mdi-medal</v-icon>
                </template>
                <v-list-item-title>Active Week</v-list-item-title>
                <v-list-item-subtitle>Completed workouts this week</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="hasMultipleCategories">
                <template v-slot:prepend>
                  <v-icon color="success">mdi-star</v-icon>
                </template>
                <v-list-item-title>Diverse Training</v-list-item-title>
                <v-list-item-subtitle>Trained multiple muscle groups</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!hasWorkoutsThisWeek">
                <template v-slot:prepend>
                  <v-icon color="info">mdi-information</v-icon>
                </template>
                <v-list-item-title>Get Started</v-list-item-title>
                <v-list-item-subtitle>Complete your first workout this week</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useWorkoutStore } from '@/stores/workout'
import WorkoutProgressChart from '@/components/WorkoutProgressChart.vue'

const workoutStore = useWorkoutStore()

// Calculate weekly workouts
const weeklyWorkouts = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return workoutStore.workouts.filter(workout => {
    const workoutDate = new Date(workout.date)
    return workoutDate >= oneWeekAgo
  }).length
})

// Calculate total exercises across all workouts
const totalExercises = computed(() => {
  return workoutStore.workouts.reduce((total, workout) => {
    return total + workout.exercises.length
  }, 0)
})

// Find most popular exercise category
const mostPopularCategory = computed(() => {
  const categories = {}
  workoutStore.workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      categories[exercise.category] = (categories[exercise.category] || 0) + 1
    })
  })
  
  const sortedCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
  
  return sortedCategories.length > 0 ? sortedCategories[0][0] : 'None'
})

// Achievement computations
const hasWorkoutsThisWeek = computed(() => weeklyWorkouts.value > 0)
const hasMultipleCategories = computed(() => {
  const categories = new Set()
  workoutStore.workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      categories.add(exercise.category)
    })
  })
  return categories.size > 1
})
</script>

<style scoped>
.v-card-title {
  border-bottom: 1px solid var(--v-border-color);
  padding-bottom: 16px;
}

.v-container {
  min-height: calc(100vh - 64px - 64px);
  padding-bottom: 80px !important;
}
</style> 