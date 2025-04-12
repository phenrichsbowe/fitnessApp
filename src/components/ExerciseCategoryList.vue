<template>
  <v-list class="exercise-category-list">
    <ExerciseCategoryItem
      v-for="(exercise, index) in exercises"
      :key="index"
      :exercise="exercise"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </v-list>
</template>

<script>
import ExerciseCategoryItem from './ExerciseCategoryItem.vue';

export default {
  components: { ExerciseCategoryItem },
  props: {
    exercises: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleEdit(updatedExercise) {
      this.$emit('edit-exercise', updatedExercise);
    },
    handleDelete(exercise) {
      this.$emit('delete-exercise', exercise);
    }
  }
};
</script>

<style scoped>
.exercise-category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
