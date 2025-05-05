<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="6" class="pa-4">
          <v-card-title class="text-h5 text-center">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitLogin" ref="loginForm">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <router-link to="/home">Go to Home (login)</router-link>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const loginForm = ref(null)

const rules = {
  required: value => !!value || 'Required.',
  email: value => {
    const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/
    return pattern.test(value) || 'Invalid email.'
  },
}

const submitLogin = () => {
  if (loginForm.value?.validate()) {
    // Handle login logic here
    console.log('Logging in with', { email: email.value, password: password.value });
    router.push('/Home')
  }
}
</script>
