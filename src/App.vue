<template>
  <v-app>
    <Navbar />
    <router-view />
    <AppFooter />
    <v-snackbar-queue />
  </v-app>
</template>

<script setup>
  import Navbar from './components/Navbar.vue';
  import AppFooter from '@/components/base/AppFooter.vue'
</script>

<style>
  body {
    padding-top: 70px;
  }
</style>
