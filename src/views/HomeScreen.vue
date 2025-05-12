<template>
    <v-main class="ml-auto mr-auto">
      <DateCarousel @dateChanged="updateDate" />

      <WorkoutHistory
        :selectedDate="currentDate"
      />
    </v-main>
</template>


<script>
import { ref } from "vue";
import DateCarousel from "@/components/DateCarousel.vue";
import Navbar from "@/components/Navbar.vue";
import WorkoutHistory from "@/components/WorkoutHistory.vue";

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