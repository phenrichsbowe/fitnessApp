<template>
  <v-card>
    <v-card-title class="py-3 px-4">
      <v-icon icon="mdi-chart-box" class="mr-2" />
      Daily Summary
    </v-card-title>

    <v-card-text>
      <v-list>
        <v-list-item>
          <template v-slot:prepend>
            <v-icon color="primary" icon="mdi-fire" />
          </template>
          <v-list-item-title>Calories</v-list-item-title>
          <v-list-item-subtitle>{{ dailyTotals.calories || 0 }} kcal</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon color="success" icon="mdi-protein" />
          </template>
          <v-list-item-title>Protein</v-list-item-title>
          <v-list-item-subtitle>{{ dailyTotals.protein || 0 }}g</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon color="warning" icon="mdi-bread-slice" />
          </template>
          <v-list-item-title>Carbohydrates</v-list-item-title>
          <v-list-item-subtitle>{{ dailyTotals.carbs || 0 }}g</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon color="error" icon="mdi-food-drumstick" />
          </template>
          <v-list-item-title>Fats</v-list-item-title>
          <v-list-item-subtitle>{{ dailyTotals.fats || 0 }}g</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <div class="px-4 pb-4">
        <div class="text-h6 mb-4">Macronutrient Distribution</div>
        <v-progress-linear
          v-model="proteinPercentage"
          color="success"
          height="24"
          class="mb-3 rounded-lg"
        >
          <template v-slot:default="{ value }">
            <div class="text-subtitle-2 font-weight-medium">Protein: {{ Math.round(value) }}%</div>
          </template>
        </v-progress-linear>

        <v-progress-linear
          v-model="carbsPercentage"
          color="warning"
          height="24"
          class="mb-3 rounded-lg"
        >
          <template v-slot:default="{ value }">
            <div class="text-subtitle-2 font-weight-medium">Carbs: {{ Math.round(value) }}%</div>
          </template>
        </v-progress-linear>

        <v-progress-linear
          v-model="fatsPercentage"
          color="error"
          height="24"
          class="rounded-lg"
        >
          <template v-slot:default="{ value }">
            <div class="text-subtitle-2 font-weight-medium">Fats: {{ Math.round(value) }}%</div>
          </template>
        </v-progress-linear>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  dailyTotals: {
    type: Object,
    default: () => ({
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    })
  }
})

const totalMacros = computed(() => {
  const protein = props.dailyTotals.protein || 0
  const carbs = props.dailyTotals.carbs || 0
  const fats = props.dailyTotals.fats || 0
  return protein + carbs + fats
})

const proteinPercentage = computed(() => {
  if (totalMacros.value === 0) return 0
  return ((props.dailyTotals.protein || 0) / totalMacros.value) * 100
})

const carbsPercentage = computed(() => {
  if (totalMacros.value === 0) return 0
  return ((props.dailyTotals.carbs || 0) / totalMacros.value) * 100
})

const fatsPercentage = computed(() => {
  if (totalMacros.value === 0) return 0
  return ((props.dailyTotals.fats || 0) / totalMacros.value) * 100
})
</script>

<style scoped>
.v-progress-linear {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

@media (max-width: 600px) {
  .v-progress-linear {
    height: 20px !important;
  }
  
  .text-subtitle-2 {
    font-size: 0.875rem !important;
  }
}
</style> 