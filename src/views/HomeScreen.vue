<template>
    <v-main class="ml-auto mr-auto">
      <v-container>
        <v-row class="mb-6">
          <v-col cols="12">
            <v-card color="primary" class="welcome-banner">
              <v-card-text class="text-h5 text-center text-white">
                Welcome back, {{ authStore.user?.username || 'user' }}!
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <DateCarousel @dateChanged="updateDate" />

        <WorkoutHistory
          :selectedDate="currentDate"
        />
      </v-container>
    </v-main>
</template>


<script setup>
import { ref } from "vue";
import { useAuthStore } from '@/stores/auth'
import DateCarousel from "@/components/DateCarousel.vue";
import WorkoutHistory from "@/components/WorkoutHistory.vue";

const authStore = useAuthStore()
const currentDate = ref(new Date());

const updateDate = (newDate) => {
  currentDate.value = newDate;
};
</script>

<style scoped>
.welcome-banner {
  border-radius: 8px;
}
</style>