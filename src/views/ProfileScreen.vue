<!-- src/views/Profile.vue -->
<template>
  <v-container class="py-10" fluid>
    <navbar />

    <v-card class="mx-auto" max-width="600" elevation="10">
      <v-card-title class="bg-primary text-white">
        Profile
      </v-card-title>
      <v-card-text>
        <v-avatar size="80" class="mx-auto my-4">
          <v-img src="https://i.pravatar.cc/100" alt="Profile" />
        </v-avatar>
        <v-text-field
          v-model="name"
          label="Full Name"
          color="primary"
        />
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          color="primary"
        />
        <v-btn class="mt-4" color="primary" @click="updateProfile">
          Update Profile
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from "@/components/Navbar.vue";

const name = ref('John Doe')
const email = ref('john@example.com')

const updateProfile = () => {
  console.log('Updated profile:', {
    name: name.value,
    email: email.value,
  })
}
</script>
