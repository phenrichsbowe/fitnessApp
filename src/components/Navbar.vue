<template>
  <v-app-bar color="primary" flat>
    <v-app-bar-nav-icon variant="text" @click.stop="toggleDrawer" />
    <v-toolbar-title>My Workouts</v-toolbar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-btn icon="mdi-magnify" variant="text" />
      <v-btn icon="mdi-filter" variant="text" />
    </template>

    <v-btn icon="mdi-dots-vertical" variant="text" />
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        link
        @click="drawer = false"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const items = [
  { title: 'Dashboard', icon: 'mdi-home', to: '/' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' },
  { title: 'Profile', icon: 'mdi-account', to: '/profile' },
  { title: 'Exercises', icon: 'mdi-account', to: '/exercises' },
]

const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>
