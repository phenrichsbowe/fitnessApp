<template>
  <v-card class="exercise-card mb-4">
    <v-expand-transition>
      <div v-show="showTimer" class="px-4 pb-4">
        <WorkoutTimer />
      </div>
    </v-expand-transition>

    <v-card-actions>
      <v-btn
        variant="text"
        color="primary"
        @click="showTimer = !showTimer"
      >
        {{ showTimer ? 'Hide Timer' : 'Show Timer' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import WorkoutTimer from './WorkoutTimer.vue'

const showTimer = ref(false)
</script> 