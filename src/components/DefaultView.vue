<template>
  <v-app>
    <header>
      <Navbar />
    </header>

    <v-main class="ml-auto mr-auto">
      <!-- Date Carousel stays here -->
      <DateCarousel @dateChanged="updateDate" />

      <!-- Pass the selected date as a prop to WorkoutHistory -->
      <WorkoutHistory
        :selectedDate="currentDate"
      />
    </v-main>
  </v-app>
</template>


<script>
import { ref } from "vue";
import DateCarousel from "./DateCarousel.vue";
import Navbar from "./Navbar.vue";
import WorkoutHistory from "./WorkoutHistory.vue";

export default {
  components: {
    DateCarousel,
    Navbar,
    WorkoutHistory
  },
  data() {
    return {
    };
  },
  setup() {
    const currentDate = ref(new Date());
    const updateDate = (newDate) => {
      currentDate.value = newDate;
    };

    return {
      currentDate,
      updateDate,
    };
  },
};
</script>

<style scoped>
</style>