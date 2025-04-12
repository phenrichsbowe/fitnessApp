<template>
  <v-app>
    <v-container class="py-4 px-3 workout-history-container" fluid>
      <div v-if="workouts.length === 0" class="text-center text-grey my-6">
        No workouts recorded for this date.
      </div>

      <ExerciseGroupList
        v-else
        :exercises="workouts"
        @delete-exercise="handleDeleteExercise"
      />

      <div class="d-flex justify-center mt-6">
        <v-btn color="success" class="add-exercise-btn" @click="openModal">
          Add Exercise
        </v-btn>
      </div>

      <AddExerciseModal
        v-model:show="showModal"
        :exercise="newExercise"
        @save-exercise="saveExercise"
      />

    </v-container>
  </v-app>
</template>


<script>
import { ref, watch } from "vue";
import DateCarousel from "../components/DateCarousel.vue";
import ExerciseGroupList from "../components/ExerciseCategoryList.vue";
import AddExerciseModal from "../components/AddExerciseModal.vue";
import Navbar from "./Navbar.vue";
import WorkoutManager from "../models/WorkoutManager.js";

export default {
  components: {
    DateCarousel,
    ExerciseGroupList,
    AddExerciseModal,
    Navbar,
  },
  props: {
    selectedDate: {
      type: Date,
      required: true,
    },
  },
  setup(props) {
    const workouts = ref([]);
    const showModal = ref(false);

    const workoutManager = new WorkoutManager();

    const dummyData = [
      {
        date: "2025-04-09",
        exercises: [
          { name: "Bench Press", sets: 3, reps: 10, weight: "80lbs", timePerSet: "45s" },
          { name: "Squats", sets: 4, reps: 12, weight: "100lbs", timePerSet: "50s" },
        ],
      },
      {
        date: "2025-03-26",
        exercises: [
          { name: "Pull-ups", sets: 3, reps: 8, weight: "Bodyweight", timePerSet: "30s" },
          { name: "Bicep Curls", sets: 3, reps: 12, weight: "15lbs", timePerSet: "40s" },
        ],
      },
    ];

    dummyData.forEach(entry => {
      const date = new Date(entry.date);
      entry.exercises.forEach(ex => workoutManager.addExercise(date, ex));
    });

    const newExercise = ref({
      name: "",
      sets: 3,
      reps: 10,
      weight: "",
      timePerSet: "",
    });

    const updateWorkouts = () => {
      workouts.value = [...workoutManager.getWorkouts(props.selectedDate)];
    };

    const openModal = () => {
      showModal.value = true;
    };

    const handleDeleteExercise = (exerciseToDelete) => {
      const workout = workoutManager.getWorkoutByDate(props.selectedDate);
      if (!workout) { console.log('no workout'); return; }

      const index = workout.getExercises().findIndex(
        (exercise) => exercise.name === exerciseToDelete.name
      );

      console.log(index)

      if (index !== -1) {
        workoutManager.removeExercise(props.selectedDate, index);
        updateWorkouts();
      }
    };

    const saveExercise = () => {
      if (!newExercise.value.name) return;

      workoutManager.addExercise(props.selectedDate, { ...newExercise.value });
      updateWorkouts();

      newExercise.value = {
        name: "",
        sets: 3,
        reps: 10,
        weight: "",
        timePerSet: "",
      };
    };

    watch(() => props.selectedDate, updateWorkouts, { immediate: true });

    return {
      workouts,
      showModal,
      newExercise,
      openModal,
      handleDeleteExercise,
      saveExercise,
    };
  },
};
</script>


<style scoped>
.workout-history-container {
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.text-grey {
  color: #888888;
}

.add-exercise-btn {
  min-width: 220px;
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
}
</style>
