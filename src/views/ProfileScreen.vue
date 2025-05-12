<!-- src/views/Profile.vue -->
<template>
  <v-container class="py-10" fluid>
    <navbar />

    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="profile-card" elevation="4">
          <v-card-title class="text-h5 text-center pt-6 pb-2">
            Profile Settings
          </v-card-title>

          <v-card-text>
            <div v-if="loading" class="profile-skeleton">
              <v-skeleton-loader
                type="avatar"
                class="mx-auto mb-4"
                width="120"
                height="120"
              ></v-skeleton-loader>
              <v-skeleton-loader
                type="text"
                class="mx-auto mb-2"
                width="200"
              ></v-skeleton-loader>
              <v-skeleton-loader
                type="text"
                class="mx-auto mb-6"
                width="150"
              ></v-skeleton-loader>
            </div>

            <div v-else class="text-center mb-6">
              <v-avatar
                size="120"
                class="profile-avatar"
                color="primary"
              >
                <v-icon size="64" color="white">
                  mdi-account
                </v-icon>
              </v-avatar>
              <div class="text-h6 mt-4">{{ user?.username || 'User' }}</div>
              <div class="text-subtitle-1 text-medium-emphasis">
                {{ user?.email || 'No email' }}
              </div>
            </div>

            <v-divider class="mb-6"></v-divider>

            <v-form @submit.prevent="updateProfile" ref="profileForm">
              <v-card class="mb-6" elevation="0" color="grey-lighten-4">
                <v-card-text>
                  <v-skeleton-loader
                    v-if="loading"
                    type="list-item-two-line"
                    class="mb-4"
                  ></v-skeleton-loader>
                  <v-skeleton-loader
                    v-if="loading"
                    type="list-item-two-line"
                  ></v-skeleton-loader>

                  <template v-else>
                    <v-text-field
                      v-model="username"
                      label="Username"
                      :rules="[rules.required, rules.username]"
                      variant="outlined"
                      density="comfortable"
                      :disabled="isOfflineMode"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                      </template>
                    </v-text-field>

                    <v-text-field
                      v-model="email"
                      label="Email"
                      type="email"
                      :rules="[rules.required, rules.email]"
                      variant="outlined"
                      density="comfortable"
                      disabled
                    >
                      <template v-slot:prepend-inner>
                        <v-icon color="primary" class="mr-2">mdi-email</v-icon>
                      </template>
                    </v-text-field>
                  </template>
                </v-card-text>
              </v-card>

              <v-card class="mb-6" elevation="0" color="grey-lighten-4">
                <v-card-title class="text-subtitle-1 font-weight-medium">
                  Account Type
                </v-card-title>
                <v-card-text>
                  <v-skeleton-loader
                    v-if="loading"
                    type="chip"
                    class="d-inline-block"
                  ></v-skeleton-loader>
                  <v-chip
                    v-else
                    :color="isOfflineMode ? 'warning' : 'success'"
                    class="text-capitalize"
                  >
                    <v-icon start>
                      {{ isOfflineMode ? 'mdi-cloud-off' : 'mdi-cloud-check' }}
                    </v-icon>
                    {{ isOfflineMode ? 'Offline Mode' : 'Online Account' }}
                  </v-chip>
                </v-card-text>
              </v-card>

              <div class="d-flex justify-end gap-2">
                <v-btn
                  color="primary"
                  variant="elevated"
                  type="submit"
                  :loading="loading"
                  :disabled="loading || isOfflineMode"
                >
                  <v-icon start>mdi-content-save</v-icon>
                  Save Changes
                </v-btn>
                <v-btn
                  color="error"
                  variant="tonal"
                  @click="handleLogout"
                  :loading="loading"
                >
                  <v-icon start>mdi-logout</v-icon>
                  Logout
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from "@/components/Navbar.vue"
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const profileForm = ref(null)
const loading = ref(false)

const username = ref('')
const email = ref('')

const rules = {
  required: value => !!value || 'Required.',
  email: value => {
    const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/
    return pattern.test(value) || 'Invalid email.'
  },
  username: value => {
    const pattern = /^[a-zA-Z0-9_]{3,20}$/
    return pattern.test(value) || 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
  }
}

const user = computed(() => authStore.currentUser)
const isOfflineMode = computed(() => authStore.isOfflineMode)

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/')
    return
  }
  
  username.value = authStore.currentUser?.username || ''
  email.value = authStore.currentUser?.email || ''
})

const updateProfile = async () => {
  if (!profileForm.value?.validate()) return
  
  loading.value = true
  try {
    await authStore.updateProfile(username.value)
  } catch (err) {
    console.error('Error updating profile:', err)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  loading.value = true
  try {
    await authStore.logout()
    router.push('/')
  } catch (err) {
    console.error('Error logging out:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
  overflow: hidden;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  font-weight: 600;
  letter-spacing: 0.5px;
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

.gap-2 {
  gap: 8px;
}

.profile-skeleton {
  padding: 16px;
}
</style>
