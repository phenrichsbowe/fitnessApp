<template>
  <v-footer 
    class="text-center d-flex flex-column justify-center"
    color="primary"
    app
  >
    <v-divider></v-divider>
    <div class="py-3 text-white">
      <div>© {{ new Date().getFullYear() }} My Workouts</div>
      <div class="text-caption">Some super cool caption</div>
    </div>
  </v-footer>
</template>

<script setup>
</script>

<style scoped>
.v-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
