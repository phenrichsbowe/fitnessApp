<template>
  <v-list-item
    @click="$emit('click')"
    class="mb-2"
    :title="exercise.name"
  >
    <template v-slot:append>
      <div class="d-flex align-center">
        <v-chip
          v-if="exercise.isCustom"
          color="success"
          size="small"
          class="mr-2"
        >
          Custom
        </v-chip>
        <v-btn
          v-if="exercise.isCustom"
          icon="mdi-delete"
          variant="text"
          color="error"
          density="comfortable"
          @click.stop="$emit('delete')"
        />
      </div>
    </template>
  </v-list-item>
</template>

<script setup>
defineProps({
  exercise: {
    type: Object,
    required: true,
    validator: (prop) => {
      return prop.name && typeof prop.isCustom === 'boolean'
    }
  }
})

defineEmits(['click', 'delete'])
</script> 