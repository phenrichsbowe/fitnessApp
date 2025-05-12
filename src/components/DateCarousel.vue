<template>
  <div class="mx-auto pt-4" style="max-width: 400px; display: flex; align-items: center; justify-content: center;">
    <v-btn icon @click="prevDate(); handleCalenderViewTip();" color="primary">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <span class="date-display mx-4"@click="showDatePicker = true"> 
      {{ formattedDate }} 
    </span>

    <v-btn icon @click="nextDate(); handleCalenderViewTip();" color="primary">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>

    <v-dialog v-model="showDatePicker" max-width="400px" persistent>
      <v-card class="date-picker-card">
        <v-date-picker
          v-model="currentDate"
          @update:modelValue="selectDate"
          :min="minDate"
          :max="maxDate"
          class="date-picker"
        ></v-date-picker>
        <v-card-actions>
          <v-btn text @click="showDatePicker = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar-queue v-model="messages" timeout="5000" color="primary"></v-snackbar-queue>
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
    const currentDate = ref(new Date());
    const showDatePicker = ref(false);

    const maxDate = computed(() => {
      return new Date().toISOString().split("T")[0];
    });

    const minDate = computed(() => {
      const epoch = new Date(0);
      return epoch.toISOString().split("T")[0];
    });

    const messages = ref([]);
    let totalConsecutiveClicks = 0;
    let calenderViewTipDisabled = false;

    function handleCalenderViewTip () {
      totalConsecutiveClicks++;

      if (!calenderViewTipDisabled && totalConsecutiveClicks >= 10) {
        calenderViewTipDisabled = true;
        messages.value.push('Tip: Click on the date to open a calendar view.')
      }
    }

    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const updateDate = (modifier) => {
      const newDate = new Date(currentDate.value)
      newDate.setDate(newDate.getDate() + modifier)
      
      // Ensure we don't go beyond today
      if (newDate > new Date()) {
        newDate.setHours(0, 0, 0, 0)
        newDate.setTime(new Date().getTime())
      }
      
      currentDate.value = newDate
      emit("dateChanged", newDate)
    };

    const selectDate = (date) => {
      const selectedDate = new Date(date)
      
      // Ensure we don't go beyond today
      if (selectedDate > new Date()) {
        selectedDate.setHours(0, 0, 0, 0)
        selectedDate.setTime(new Date().getTime())
      }
      
      currentDate.value = selectedDate
      showDatePicker.value = false
      emit("dateChanged", selectedDate)
    };

    return {
      formattedDate: computed(() => formatDate(currentDate.value)),
      prevDate: () => updateDate(-1),
      nextDate: () => updateDate(1),
      showDatePicker,
      selectDate,
      currentDate,
      minDate,
      maxDate,
      handleCalenderViewTip,
      messages
    };
  }
};
</script>

<style scoped>
.date-display {
  font-size: 18px;
  padding: 10px 20px;
  margin: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 400px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-display:hover {
  background-color: #e0e0e0;
}

.v-dialog__content {
  width: 100%;
  max-width: 400px;
  padding: 0 !important; 
}

.date-picker-card {
  width: 100%;
  max-width: 400px;
  padding: 0 !important;
  margin: 0 !important;
}

.date-picker {
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.v-dialog__content .v-card {
  width: 100%;
  overflow: hidden;
}
</style>
