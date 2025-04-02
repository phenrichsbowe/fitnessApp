<template>
  <v-card class="mx-auto my-5" max-width="600px">
    <!-- App Bar Section -->
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>My Workouts</v-toolbar-title>
        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>
        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <!-- Side Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
        <v-list :items="items"></v-list>
      </v-navigation-drawer>

      <!-- Main Content Section (Everything Below the App Bar) -->
      <v-main class="d-flex flex-column align-center px-4 py-5" style="min-height: 100vh; max-width: 600px;">
        <!-- Date Carousel Section -->
        <DateCarousel 
          class="mb-6 mx-auto dateCarousel" 
          style="max-width: 500px;" 
          @dateChanged="updateDate" 
        />

        <!-- Exercise Groups List Section -->
        <div class="workout-history text-center w-100 mb-6">
          <p v-if="workouts.length === 0">No workouts recorded for this date.</p>
          <ExerciseGroupList 
            :workouts="workouts" 
            v-else 
            @delete-exercise="handleDeleteExercise" 
          />
        </div>
        
        <!-- Add Exercise Button -->
        <v-btn 
          class="mt-4 mb-6" 
          color="success" 
          @click="openModal" 
        >
          Add Exercise
        </v-btn>

        <!-- Add Exercise Modal -->
        <AddExerciseModal
          v-model:show="showModal"
          :exercise="newExercise"
          @update:exerciseName="newExercise.name = $event"
          @update:exerciseSets="newExercise.sets = $event"
          @update:exerciseReps="newExercise.reps = $event"
        />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import { ref } from "vue";
import DateCarousel from "../components/DateCarousel.vue";
import ExerciseGroupList from "../components/ExerciseGroupList.vue";
import AddExerciseModal from "../components/AddExerciseModal.vue";

export default {
  components: {
    DateCarousel,
    ExerciseGroupList,
    AddExerciseModal,
  },
  data() {
    return {
      showModal: false, // Controls the visibility of the modal
      workouts: [], // Store the workout data
      newExercise: {  // Store the new exercise data
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
        "2025-04-02": [
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
      if (!newExercise.value.name) {
        return;
      }

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
      this.showModal = true; // Show the modal
    },
    handleDeleteExercise(exerciseToDelete) {
      this.workouts.forEach((group, groupIndex) => {
        const exerciseIndex = group.exercises.findIndex(exercise => exercise.name === exerciseToDelete.name);
    
        if (exerciseIndex !== -1) {
          group.exercises.splice(exerciseIndex, 1);
    
          if (group.exercises.length === 0) {
            this.workouts.splice(groupIndex, 1);
          }
        }
      });
    }
  }
};
</script>

<style scoped>
/* Custom styles for spacing and alignment */
.v-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.workout-history {
  margin: 24px;
  text-align: center;
}

.v-btn {
  margin-top: 12px;
}

.dateCarousel {
  margin: 10px;
}
</style>
