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
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: 'Dashboard', icon: 'mdi-home', to: '/' },
        { title: 'Settings', icon: 'mdi-cog', to: '/settings' },
        { title: 'Profile', icon: 'mdi-account', to: '/profile' },
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
