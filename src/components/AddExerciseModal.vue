<template>
  <v-dialog
    v-model="internalShow"
    max-width="500px"
  >
    <v-card>
      <!-- Modal Header -->
      <v-card-title>
        <span class="headline">Add Exercise</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Modal Body (Form Fields) -->
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Exercise Name"
            required
            :rules="[v => !!v || 'Exercise name is required']"
          ></v-text-field>

          <v-text-field
            label="Sets"
            type="number"
            min="1"
            required
            :rules="[v => !!v || 'Sets are required']"
          ></v-text-field>

          <v-text-field
            label="Reps"
            type="number"
            min="1"
            required
            :rules="[v => !!v || 'Reps are required']"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <!-- Modal Footer (Save Button) -->
      <v-card-actions>
        <v-btn color="primary" @click="saveExercise">Save Exercise</v-btn>
        <v-btn text @click="closeModal">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,  // The visibility prop for the dialog
    },
    exercise: {
      type: Object,
      required: true,  // The exercise data
    },
  },
  emits: [
    "update:show",  // Emit updated visibility to parent
    "update:exercise-name",  // Emit updated exercise name to parent
    "update:exercise-sets",  // Emit updated sets to parent
    "update:exercise-reps",  // Emit updated reps to parent
  ],
  data() {
    return {
      internalShow: this.show,  // Internal state for dialog visibility
    };
  },
  watch: {
    show(newVal) {
      this.internalShow = newVal;  // Sync prop value with internal state
    },
    internalShow(newVal) {
      this.$emit("update:show", newVal);  // Emit visibility updates back to parent
    },
  },
  methods: {
    closeModal() {
      this.internalShow = false;  // Close modal
    },
    saveExercise() {
      this.$emit("update:exercise-name", this.exercise.name);  // Emit exercise name change
      this.$emit("update:exercise-sets", this.exercise.sets);  // Emit exercise sets change
      this.$emit("update:exercise-reps", this.exercise.reps);  // Emit exercise reps change
      this.closeModal();  // Close the modal after saving
    },
  },
};
</script>

<style scoped>
/* Add custom styles for the modal if needed */
</style>
