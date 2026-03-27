<script setup>
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import Header from './views/partials/Header.vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const searchTrigger = ref(0)

const setCategory = (category) => {
  selectedCategory.value = category
}

provide('searchState', {
  searchQuery,
  selectedCategory,
  searchTrigger,
  setCategory,
})
</script>

<template>
  <div class="page-container">
    <Header></Header>
    <div class="app">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.app {
  flex-grow: 1;
  overflow-x: hidden;
}
</style>
