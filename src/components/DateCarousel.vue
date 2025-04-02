<template>
  <div class="d-flex align-items-center justify-content-center gap-4">
    <!-- Previous Date Button -->
    <v-btn icon @click="prevDate(); increment();" color="primary" class="mx-2">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <!-- Date Display -->
    <span
      class="date-display"
      @click="showDatePicker = true"
    >
      {{ formattedDate }}
    </span>

    <!-- Next Date Button -->
    <v-btn icon @click="nextDate" color="primary" class="mx-2">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>

    <!-- Date Picker Dialog -->
    <v-dialog v-model="showDatePicker" persistent max-width="290">
      <v-card>
        <v-date-picker v-model="currentDate" @update:modelValue="selectDate" :min="new Date().toISOString().split('T')[0]" :max="0"></v-date-picker>
        <v-card-actions>
          <v-btn text @click="showDatePicker = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { VDialog, VCard, VDatePicker, VCardActions, VBtn, VIcon } from 'vuetify/components';

export default {
  emits: ["dateChanged"],
  components: {
    VDialog,
    VCard,
    VDatePicker,
    VCardActions,
    VBtn,
    VIcon
  },
  setup(_, { emit }) {
    const TIPS_DISABLED = false;
    const TODAYS_DATE = new Date();

    let totalConsecutiveClicks = 0;
    const currentDate = ref(new Date());
    const showDatePicker = ref(false);

    function increment() {
      totalConsecutiveClicks++;
      if (!TIPS_DISABLED && totalConsecutiveClicks >= 10) {
        console.log('Tip: You can press the date to open a calendar view.');
        totalConsecutiveClicks = 0;
      }
    }

    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const updateDate = (modifier) => {
      const updatedDate = currentDate.value.getDate() + modifier;
      currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + modifier));
      emit("dateChanged", currentDate.value);
    };

    const selectDate = (date) => {
      currentDate.value = new Date(date);
      showDatePicker.value = false;
      emit("dateChanged", currentDate.value);
    };

    return {
      formattedDate: computed(() => formatDate(currentDate.value)),
      prevDate: () => updateDate(-1),
      nextDate: () => updateDate(1),
      increment,
      showDatePicker,
      selectDate,
      currentDate
    };
  }
};
</script>

<style scoped>
/* Styling for the date display text */
.date-display {
  font-size: 18px;
  padding: 10px 20px;
  margin: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.date-display:hover {
  background-color: #e0e0e0;
}

.v-btn {
  min-width: 40px;
}

.v-dialog .v-card {
  border-radius: 8px;
}
</style>
