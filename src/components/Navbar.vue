<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon variant="text" @click.stop="toggleDrawer" />
    <v-toolbar-title>My Workouts</v-toolbar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-btn icon="mdi-magnify" variant="text" />
      <v-btn icon="mdi-filter" variant="text" />
    </template>

    <v-btn icon="mdi-dots-vertical" variant="text" />
  </v-app-bar>

  <!-- Navigation Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list :items="items" />
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        // Add items for the navigation list
        { title: 'Dashboard', icon: 'mdi-home' },
        { title: 'Settings', icon: 'mdi-settings' },
        { title: 'Profile', icon: 'mdi-account' },
      ],
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style scoped>
/* Add styles here if needed */
</style>