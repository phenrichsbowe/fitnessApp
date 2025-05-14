<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <v-row no-gutters>
        <v-col cols="2" class="d-flex align-center">
          <v-icon icon="mdi-dumbbell" />
        </v-col>
        <v-col cols="10" class="text-h6">
          {{ group.name }}
        </v-col>
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-list density="compact">
        <exercise-list-item
          v-for="exercise in group.exercises"
          :key="exercise.id"
          :exercise="exercise"
          @click="$emit('exercise-click', exercise)"
          @delete="$emit('delete-exercise', { exercise, group })"
        />
        <v-list-item
          v-if="group.exercises.length === 0"
          color="grey"
          class="text-center"
        >
          No exercises in this group
        </v-list-item>
      </v-list>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
import ExerciseListItem from './ExerciseListItem.vue'

defineProps({
  group: {
    type: Object,
    required: true,
    validator: (prop) => {
      return prop.name && Array.isArray(prop.exercises)
    }
  }
})

defineEmits(['exercise-click', 'delete-exercise'])
</script> 