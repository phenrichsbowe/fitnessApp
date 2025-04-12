<template>
  <ModalBase
    :title="'Add Exercise'"
    :show="show"
    @update:show="$emit('update:show', $event)"
    @close="closeModal"
  >
    <template #body>
      <v-form ref="form">
        <v-text-field
          label="Exercise Name"
          v-model="exercise.name"
          :rules="[(v) => !!v || 'Exercise name is required']"
          required
        />
        <v-text-field
          label="Sets"
          v-model.number="exercise.sets"
          type="number"
          min="1"
          :rules="[(v) => !!v || 'Sets are required']"
          required
        />
        <v-text-field
          label="Reps"
          v-model.number="exercise.reps"
          type="number"
          min="1"
          :rules="[(v) => !!v || 'Reps are required']"
          required
        />
      </v-form>
    </template>

    <template #footer>
      <div class="d-flex justify-end">
        <v-btn color="primary" @click="saveExercise">Save</v-btn>
        <v-btn text @click="closeModal">Cancel</v-btn>
      </div>
    </template>
  </ModalBase>
</template>

<script>
import ModalBase from "./base/ModalBase.vue";

export default {
  components: { ModalBase },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    exercise: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:show", "save-exercise"],

  methods: {
    closeModal() {
      this.$emit("update:show", false);
    },
    saveExercise() {
      this.$emit("save-exercise", { ...this.exercise });
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.v-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
}

.v-text-field {
  background-color: #fff;
  border-radius: 8px;
}

.v-btn {
  min-width: 120px;
  text-transform: none;
  font-weight: 500;
}

.v-btn:first-of-type {
  margin-right: 12px;
}

.v-btn[text] {
  color: #757575;
}
</style>
