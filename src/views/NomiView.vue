<!-- src/views/NomiView.vue -->
<template>
  <div class="nomi-view">
    <div class="title">💬 Номи</div>
    <div class="placeholder">Скоро: Чат с Номи</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.nomi-view {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}
.title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 14px;
}
.placeholder {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}
</style>