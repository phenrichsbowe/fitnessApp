<template>
  <v-container class="py-4">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <h1 class="text-h4">Food Diary</h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            Add Food Entry
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center py-3 px-4">
            <v-icon icon="mdi-calendar" class="mr-2" />
            <v-date-picker
              v-model="selectedDate"
              class="ml-2"
              density="compact"
              variant="plain"
            />
          </v-card-title>
        </v-card>

        <template v-if="loading">
          <v-skeleton-loader
            v-for="n in 3"
            :key="n"
            type="card-heading, list-item-three-line"
            class="mb-4"
          />
        </template>

        <template v-else>
          <MealSection
            v-for="mealType in mealTypes"
            :key="mealType"
            :meal-type="mealType"
            :entries="getEntriesByMealType(selectedDateAsDate, mealType)"
            @edit="editEntry"
            @delete="deleteEntry"
            class="mb-4"
          />
        </template>
      </v-col>

      <v-col cols="12" md="4">
        <div class="sticky-top">
          <NutritionSummary
            :daily-totals="getDailyNutrition(selectedDateAsDate)"
            class="mb-6"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <FoodEntryDialog
      v-model="showAddDialog"
      :entry="editingEntry"
      :date="selectedDate"
      @save="saveEntry"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useFoodDiaryStore } from '@/stores/foodDiary'
import { useAuthStore } from '@/stores/auth'
import MealSection from '@/components/food/MealSection.vue'
import NutritionSummary from '@/components/food/NutritionSummary.vue'
import FoodEntryDialog from '@/components/food/FoodEntryDialog.vue'
import { useRouter } from 'vue-router'

const foodDiaryStore = useFoodDiaryStore()
const authStore = useAuthStore()
const router = useRouter()
const selectedDate = ref(new Date().toISOString().split('T')[0])
const showAddDialog = ref(false)
const editingEntry = ref(null)

// Helper function to ensure valid date
const ensureValidDate = (dateStr) => {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return new Date()
    }
    return date
  } catch (e) {
    return new Date()
  }
}

const selectedDateAsDate = computed(() => {
  return ensureValidDate(selectedDate.value)
})

// Watch for date changes to fetch new data
watch(selectedDate, async (newDate) => {
  if (!authStore.isAuthenticated) return
  
  const date = ensureValidDate(newDate)
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)
  
  await foodDiaryStore.fetchEntries(startOfDay, endOfDay)
})

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

const loading = computed(() => foodDiaryStore.loading)

const getEntriesByMealType = (date, mealType) => {
  if (!date || !mealType || !authStore.isAuthenticated) return []
  return foodDiaryStore.getEntriesByMealType(date, mealType) || []
}

const getDailyNutrition = (date) => {
  if (!date || !authStore.isAuthenticated) return { calories: 0, protein: 0, carbs: 0, fats: 0 }
  return foodDiaryStore.getDailyNutrition(date)
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/')
    return
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)
  
  await foodDiaryStore.fetchEntries(today, endOfDay)
})

const saveEntry = async (entryData) => {
  try {
    if (editingEntry.value) {
      await foodDiaryStore.updateEntry(editingEntry.value.id, entryData)
    } else {
      await foodDiaryStore.addEntry(selectedDateAsDate.value, entryData)
    }
    showAddDialog.value = false
    editingEntry.value = null
  } catch (error) {
    console.error('Error saving food entry:', error)
  }
}

const editEntry = (entry) => {
  editingEntry.value = entry
  showAddDialog.value = true
}

const deleteEntry = async (entry) => {
  try {
    await foodDiaryStore.deleteEntry(entry.id)
  } catch (error) {
    console.error('Error deleting food entry:', error)
  }
}
</script>

<style scoped>
.v-date-picker {
  background: transparent !important;
  box-shadow: none !important;
}

.sticky-top {
  position: sticky;
  top: 80px; /* Account for navbar */
  z-index: 1;
}

@media (max-width: 960px) {
  .sticky-top {
    position: static;
  }
}
</style> 