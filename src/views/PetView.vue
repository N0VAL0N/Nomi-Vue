<!-- src/views/PetView.vue -->
<template>
  <div class="pet-view">
    <NomiRoom :show-hud="false" :show-tip="true" :avatar-size="140" />
  </div>
</template>

<script setup lang="ts">
import NomiRoom from '@/components/nomi/NomiRoom.vue'
</script>

<style scoped>
.pet-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}
</style>