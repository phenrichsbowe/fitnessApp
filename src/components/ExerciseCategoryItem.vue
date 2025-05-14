<template>
  <div class="exercise-entry pa-2">
    <div v-for="entry in exercise.entries" :key="entry.id" class="entry-item">
      <div class="d-flex align-center justify-space-between">
        <div class="exercise-details text-body-1">
          <span class="font-weight-medium">Weight: {{ entry.weight }}{{ settingsStore.weightUnit }}</span>
          <span class="mx-2">•</span>
          <span class="font-weight-medium">Sets: {{ entry.sets }}</span>
        </div>
        <v-btn
          icon="mdi-delete"
          variant="text"
          density="compact"
          color="error"
          size="small"
          @click="$emit('delete', entry)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
  }
})

defineEmits(['delete'])
</script>

<style scoped>
.exercise-entry {
  background-color: rgb(var(--v-theme-surface));
}

.entry-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.entry-item:last-child {
  border-bottom: none;
}

.exercise-details {
  color: rgba(var(--v-theme-on-surface), 0.87);
}
</style>