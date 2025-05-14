<!-- src/views/Settings.vue -->
<template>
  <v-container class="py-10" fluid>
    <v-card class="mx-auto" max-width="600" elevation="10">
      <v-card-title class="bg-primary text-white">
        Settings
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-switch
            v-model="store.notifications"
            label="Enable Notifications"
            color="primary"
            @change="saveSettings"
          />
          <v-switch
            v-model="store.enableTips"
            label="Enable Tips"
            color="primary"
            @change="saveSettings"
            :hint="store.enableTips ? 'You will see helpful tips while using the app' : 'No tips will be shown'"
            persistent-hint
          />
          <v-switch
            v-model="store.isMetric"
            :label="'Use Metric System (' + store.weightUnit + ')'"
            color="primary"
            @change="saveSettings"
          />
          <v-select
            v-model="store.language"
            label="Preferred Language"
            :items="['English', 'Spanish', 'French']"
            color="primary"
            @update:model-value="saveSettings"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'

const store = useSettingsStore()

const saveSettings = () => {
  store.saveSettings()
}
</script>
