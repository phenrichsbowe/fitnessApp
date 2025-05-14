<template>
  <v-card class="mb-4">
    <v-card-title class="text-capitalize d-flex align-center py-3 px-4">
      <v-icon :icon="getMealIcon" class="mr-2" />
      {{ mealType }}
      <v-spacer />
      <span class="text-subtitle-2 text-medium-emphasis">
        {{ totalCalories }} calories
      </span>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list v-if="entries.length > 0">
        <v-list-item
          v-for="entry in entries"
          :key="entry.id"
          :title="entry.food_name"
          :subtitle="`${entry.calories} cal • P: ${entry.protein}g • C: ${entry.carbs}g • F: ${entry.fats}g`"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              class="mr-2"
              @click="$emit('edit', entry)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="$emit('delete', entry)"
            />
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="pa-4 text-center text-medium-emphasis">
        No entries for {{ mealType }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  mealType: {
    type: String,
    required: true
  },
  entries: {
    type: Array,
    default: () => []
  }
})

defineEmits(['edit', 'delete'])

const getMealIcon = computed(() => {
  const icons = {
    breakfast: 'mdi-coffee',
    lunch: 'mdi-food',
    dinner: 'mdi-food-turkey',
    snack: 'mdi-cookie'
  }
  return icons[props.mealType] || 'mdi-food'
})

const totalCalories = computed(() => {
  return props.entries.reduce((total, entry) => total + (entry.calories || 0), 0)
})
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.v-list-item:last-child {
  border-bottom: none;
}
</style> 