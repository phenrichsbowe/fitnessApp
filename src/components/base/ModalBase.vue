<template>
  <v-dialog v-model="isVisible" max-width="600px" persistent @click:outside="closeModal">
    <v-card>
      <!-- Header -->
      <v-card-title class="modal-title">
        <span class="text-h6 font-weight-medium">{{ title }}</span>
        <v-spacer></v-spacer>
      </v-card-title>

      <!-- Body -->
      <v-card-text>
        <slot name="body"></slot>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions>
        <slot name="footer"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'update:show'],
  computed: {
    isVisible: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit('update:show', value);
        if (!value) this.$emit('close');
      }
    }
  },
  methods: {
    closeModal() {
      this.isVisible = false;
    }
  }
};
</script>

<style scoped>
.modal-title {
  padding-right: 8px;
}
</style>
