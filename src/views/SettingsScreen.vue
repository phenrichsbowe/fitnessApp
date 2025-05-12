<!-- src/views/Settings.vue -->
<template>
  <v-container class="py-10" fluid>
    <navbar />

    <v-card class="mx-auto" max-width="600" elevation="10">
      <v-card-title class="bg-primary text-white">
        Settings
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-switch
            v-model="notifications"
            label="Enable Notifications"
            color="primary"
          />
          <v-switch
            v-model="darkMode"
            label="Enable Tips"
            color="primary"
          />
          <v-text-field
            v-model="language"
            label="Preferred Language"
            color="primary"
          />
          <v-btn class="mt-4" color="primary" @click="saveSettings">
            Save Changes
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from "@/components/Navbar.vue";

const notifications = ref(true)
const darkMode = ref(false)
const language = ref('English')

const saveSettings = () => {
  console.log('Settings saved:', {
    notifications: notifications.value,
    darkMode: darkMode.value,
    language: language.value,
  })
}
</script>
