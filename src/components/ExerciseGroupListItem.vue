<template>
  <v-card class="ma-2 pa-4 rounded-lg shadow-sm" :class="{'bg-light': !isDark}">
    <v-row class="d-flex justify-space-between align-center">
      <v-col cols="auto">
        <v-text-body class="headline">{{ exercise.name }}</v-text-body>
      </v-col>

      <v-col cols="auto">
        <v-btn 
          @click="editExercise"
          color="primary" 
          small
          outlined
        >
          Edit
        </v-btn>
        <v-btn 
          @click="deleteExercise"
          color="red" 
          small
          outlined
        >
          Delete
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col>
        <span class="text-muted">
          <strong>Sets:</strong> {{ exercise.sets }} &nbsp; | &nbsp; 
          <strong>Reps:</strong> {{ exercise.reps }} &nbsp; | &nbsp; 
          <strong>Weight:</strong> {{ exercise.weight }} &nbsp;
        </span>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  emits: ["delete-exercise", "edit-exercise"],
  props: {
    exercise: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deleteExercise() {
      this.$emit("delete-exercise", this.exercise);
    },
    editExercise() {
      this.$emit("edit-exercise", this.exercise);
    },
  },
};
</script>

<style scoped>
/* Customize if needed based on Vuetify theme or specific design needs */
.bg-light {
  background-color: #f5f5f5 !important;
}
</style>
