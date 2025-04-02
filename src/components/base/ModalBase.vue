<template>
  <div class="modal fade show" tabindex="-1" style="display: block;" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <slot name="header"></slot>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        
        <!-- Modal Footer -->
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');  // Emit a 'close' event to inform the parent component to close the modal
    },
  },
};
</script>

<style scoped>
/* Add custom styles here if necessary */
</style>
