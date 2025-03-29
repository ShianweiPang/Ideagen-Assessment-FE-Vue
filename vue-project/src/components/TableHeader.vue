<script setup>
const props = defineProps({
  header: String,
  headerKey: String,
  sortKey: String,
  sortOrder: Number,
})
</script>

<template>
  <div class="header">
    <p>{{ header }}</p>
    <div v-if="sortKey === headerKey">
      <svg v-if="sortOrder === -1" width="10" height="10">
        <path d="M 0 5 L 5 10 L 10 5 Z" fill="white" />
      </svg>
      <svg v-if="sortOrder === 1" width="10" height="10">
        <path d="M 0 5 L 5 0 L 10 5 Z" fill="white" />
      </svg>
    </div>
  </div>
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
}
</style>
