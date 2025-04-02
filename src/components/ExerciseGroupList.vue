<template>
  <v-row class="ma-3">
    <!-- Iterate over each workout group -->
    <v-col v-for="(group, index) in workouts" :key="index" cols="12" md="6" lg="4">
      <v-card class="mb-4" outlined>
        <!-- Card Header -->
        <v-card-title>
          <span class="headline">{{ group.group }}</span>
        </v-card-title>

        <!-- Card Body -->
        <v-card-text>
          <!-- Iterate over each exercise in the group -->
          <v-list>
            <ExerciseGroupListItem
              v-for="(exercise, exIndex) in group.exercises"
              :key="exIndex"
              :exercise="exercise"
              @delete-exercise="$emit('delete-exercise', exercise)"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ExerciseGroupListItem from "../components/ExerciseGroupListItem.vue";

export default {
  components: { ExerciseGroupListItem },
  emits: ['delete-exercise'],
  props: {
    workouts: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
