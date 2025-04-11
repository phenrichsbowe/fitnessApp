<template>
  <v-app>
    <header>
      <Navbar />
    </header>

    <!-- Main Content Area -->
    <v-main class="ml-auto mr-auto">
          <!-- Date Carousel -->
          <DateCarousel class="" @dateChanged="updateDate" />

          <!-- Workout History -->
            <p v-if="workouts.length === 0">No workouts recorded for this date.</p>
            <ExerciseGroupList
              v-else
              :workouts="workouts"
              @delete-exercise="handleDeleteExercise"
            />


          <!-- Add Exercise Button -->
          <v-btn color="success" class="" @click="openModal">Add Exercise</v-btn>

          <!-- Add Exercise Modal -->
          <AddExerciseModal
            v-model:show="showModal"
            :exercise="newExercise"
            @update:exerciseName="newExercise.name = $event"
            @update:exerciseSets="newExercise.sets = $event"
            @update:exerciseReps="newExercise.reps = $event"
          />
    </v-main>
  </v-app>
</template>

<script>
import { ref } from "vue";
import DateCarousel from "../components/DateCarousel.vue";
import ExerciseGroupList from "../components/ExerciseGroupList.vue";
import AddExerciseModal from "../components/AddExerciseModal.vue";
import Navbar from "./Navbar.vue";

export default {
  components: {
    DateCarousel,
    ExerciseGroupList,
    AddExerciseModal,
    Navbar
  },
  data() {
    return {
      showModal: false,
      workouts: [],
      newExercise: {
        name: "",
        sets: 3,
        reps: 10,
        weight: "",
      },
    };
  },
  setup() {
    const drawer = ref(false);
    const currentDate = ref(new Date());
    const workouts = ref([]);
    const newExercise = ref({
      name: "",
      sets: 3,
      reps: 10,
      weight: "",
    });

    const exerciseNames = ref([
      "Bench Press",
      "Squats",
      "Deadlifts",
      "Pull-ups",
      "Bicep Curls",
      "Tricep Dips",
    ]);

    const items = ref([
      { title: "Home", icon: "mdi-home" },
      { title: "Workouts", icon: "mdi-dumbbell" },
      { title: "Settings", icon: "mdi-cog" },
    ]);

    const fetchWorkouts = (date) => {
      const data = {
        "2025-04-09": [
          {
            group: "Chest",
            exercises: [
              { name: "Bench Press", sets: 3, reps: 10, weight: "80lbs", timePerSet: "45s" },
            ],
          },
          {
            group: "Legs",
            exercises: [
              { name: "Squats", sets: 4, reps: 12, weight: "100lbs", timePerSet: "50s" },
            ],
          },
        ],
        "2025-03-26": [
          {
            group: "Back",
            exercises: [
              { name: "Pull-ups", sets: 3, reps: 8, weight: "Bodyweight", timePerSet: "30s" },
            ],
          },
          {
            group: "Arms",
            exercises: [
              { name: "Bicep Curls", sets: 3, reps: 12, weight: "15lbs", timePerSet: "40s" },
            ],
          },
        ],
      };
      const dateKey = date.toISOString().split("T")[0];
      workouts.value = data[dateKey] || [];
    };

    const updateDate = (newDate) => {
      currentDate.value = newDate;
      fetchWorkouts(newDate);
    };

    const saveExercise = () => {
      if (!newExercise.value.name) return;
      const exerciseData = { ...newExercise.value };
      if (workouts.value.length > 0) {
        workouts.value[0].exercises.push(exerciseData);
      } else {
        workouts.value.push({ group: "Custom", exercises: [exerciseData] });
      }
      newExercise.value = { name: "", sets: 3, reps: 10, weight: "", timePerSet: "" };
    };

    fetchWorkouts(currentDate.value);

    return {
      workouts,
      updateDate,
      newExercise,
      saveExercise,
      exerciseNames,
      fetchWorkouts,
      currentDate,
      items,
      drawer,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    handleDeleteExercise(exerciseToDelete) {
      this.workouts.forEach((group, groupIndex) => {
        const exerciseIndex = group.exercises.findIndex(
          (exercise) => exercise.name === exerciseToDelete.name
        );
        if (exerciseIndex !== -1) {
          group.exercises.splice(exerciseIndex, 1);
          if (group.exercises.length === 0) {
            this.workouts.splice(groupIndex, 1);
          }
        }
      });
    },
  },
};
</script>

<style scoped>
</style>