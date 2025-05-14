<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="6" class="login-card">
          <v-card-title class="text-h5 text-center pt-6">
            Welcome to My Fitness App
          </v-card-title>
          
          <v-card-text>
            <v-tabs v-model="activeTab" color="primary" align-tabs="center">
              <v-tab value="login">Login</v-tab>
              <v-tab value="signup">Sign Up</v-tab>
              <v-tab value="offline">Offline Mode</v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
              <!-- Login Form -->
              <v-window-item value="login">
                <v-form @submit.prevent="submitLogin" ref="loginForm" class="mt-4" validate>
                  <v-text-field
                    v-model="loginEmail"
                    label="Email"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    variant="outlined"
                    density="comfortable"
                    required
                    :error-messages="authStore.error"
                    autocomplete="email"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary" class="mr-2">mdi-email</v-icon>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="loginPassword"
                    label="Password"
                    type="password"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    required
                    autocomplete="current-password"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary" class="mr-2">mdi-lock</v-icon>
                    </template>
                  </v-text-field>

                  <v-btn
                    color="primary"
                    block
                    class="mt-4"
                    type="submit"
                  >
                    <v-icon start>mdi-login</v-icon>
                    Login
                  </v-btn>
                </v-form>
              </v-window-item>

              <!-- Sign Up Form -->
              <v-window-item value="signup">
                <v-form @submit.prevent="submitSignUp" ref="signupForm" class="mt-4" validate>
                  <v-text-field
                    v-model="signupUsername"
                    label="Username"
                    :rules="[rules.required, rules.username]"
                    variant="outlined"
                    density="comfortable"
                    required
                    :error-messages="authStore.error"
                    autocomplete="username"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="signupEmail"
                    label="Email"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    variant="outlined"
                    density="comfortable"
                    required
                    autocomplete="username"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary" class="mr-2">mdi-email</v-icon>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="signupPassword"
                    label="Password"
                    type="password"
                    :rules="[rules.required, rules.password]"
                    variant="outlined"
                    density="comfortable"
                    required
                    autocomplete="new-password"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary" class="mr-2">mdi-lock</v-icon>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    :rules="[rules.required, rules.confirmPassword]"
                    variant="outlined"
                    density="comfortable"
                    required
                    autocomplete="new-password"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary" class="mr-2">mdi-lock-check</v-icon>
                    </template>
                  </v-text-field>

                  <v-btn
                    color="primary"
                    block
                    class="mt-4"
                    type="submit"
                  >
                    <v-icon start>mdi-account-plus</v-icon>
                    Sign Up
                  </v-btn>
                </v-form>
              </v-window-item>

              <!-- Offline Mode -->
              <v-window-item value="offline">
                <div class="text-center mt-6">
                  <v-icon
                    color="primary"
                    size="64"
                    class="mb-4"
                  >
                    mdi-cloud-off-outline
                  </v-icon>
                  <p class="text-body-1 mb-4">
                    Continue without an account. Your data will be stored locally.
                  </p>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    block
                    @click="loginOffline"
                  >
                    <v-icon start>mdi-account</v-icon>
                    Continue Offline
                  </v-btn>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = ref(null)
const loginEmail = ref('')
const loginPassword = ref('')

const signupForm = ref(null)
const signupUsername = ref('')
const signupEmail = ref('')
const signupPassword = ref('')
const confirmPassword = ref('')

const activeTab = ref('login')

const rules = {
  required: value => !!value || 'Required.', 
  email: value => {
    const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/
    return pattern.test(value) || 'Invalid email.'
  },
  username: value => {
    const pattern = /^[a-zA-Z0-9_]{3,20}$/
    return pattern.test(value) || 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
  },
  password: value => {
    return value.length >= 6 || 'Password must be at least 6 characters'
  },
  confirmPassword: value => {
    return value === signupPassword.value || 'Passwords do not match'
  }
}

const submitLogin = async () => {
  const valid = loginForm.value?.validate()
  if (!valid) return

  try {
    await authStore.loginWithSupabase(loginEmail.value, loginPassword.value)
    router.push('/home')
  } catch (err) {
    console.error('Login error:', err)
  }
}

const submitSignUp = async () => {
  const valid = signupForm.value?.validate()
  if (!valid) return

  try {
    await authStore.signUp(signupEmail.value, signupPassword.value, signupUsername.value)
    if (authStore.isAuthenticated) {
      router.push('/home')
    } else {
      activeTab.value = 'login'
      loginEmail.value = signupEmail.value
      loginPassword.value = signupPassword.value
    }
  } catch (err) {
    console.error('Signup error:', err)
  }
}

const loginOffline = async () => {
  try {
    authStore.loginOffline()
    router.push('/home')
  } catch (err) {
    console.error('Offline login error:', err)
  }
}
</script>

<style scoped>
.login-card {
  border-radius: 16px;
  overflow: hidden;
}

.v-card-title {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.v-tabs {
  margin-top: 8px;
}

.v-window {
  margin-top: 16px;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.v-text-field {
  margin-bottom: 16px;
}

:deep(.v-field--variant-outlined) {
  --v-field-border-opacity: 0.12;
}

:deep(.v-field--focused) {
  --v-field-border-opacity: 0.5;
}
</style>
