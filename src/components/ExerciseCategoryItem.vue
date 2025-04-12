<template>
  <v-card class="exercise-item-card" outlined>
    <v-card-text class="d-flex flex-column gap-2">
      <div class="d-flex justify-space-between align-center">
        <div class="exercise-name">{{ exercise.name }}</div>
        <v-btn icon @click="$emit('delete', exercise)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </div>

      <div class="control-row">
        <v-text-field
          v-model.number="editableSets"
          label="Sets"
          type="number"
          min="1"
          hide-details
          density="compact"
        />
        <v-text-field
          v-model.number="editableReps"
          label="Reps"
          type="number"
          min="1"
          hide-details
          density="compact"
        />
        <v-btn color="primary" class="save-btn" @click="emitEdit">
          Save
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  props: {
    exercise: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      editableSets: this.exercise.sets,
      editableReps: this.exercise.reps
    };
  },
  methods: {
    emitEdit() {
      const updated = {
        ...this.exercise,
        sets: this.editableSets,
        reps: this.editableReps
      };
      this.$emit('edit', updated);
    }
  }
};
</script>

<style scoped>
.exercise-item-card {
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease-in-out;
  background-color: #ffffff;
}

.exercise-item-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.exercise-name {
  font-size: 18px;
  font-weight: 600;
  color: #1976d2;
}

.control-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 10px;
}

.v-text-field {
  max-width: 120px;
}

.save-btn {
  border-radius: 8px;
  text-transform: none;
}
</style>