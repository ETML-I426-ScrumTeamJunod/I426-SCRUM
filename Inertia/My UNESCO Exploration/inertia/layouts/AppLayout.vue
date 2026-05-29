<script setup>
import { ref, provide } from 'vue'
import Header from '../pages/components/Header.vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const searchTrigger = ref(0)

const setCategory = (category) => {
  selectedCategory.value = category
}

const searchState = {
  searchQuery,
  selectedCategory,
  searchTrigger,
  setCategory,
}

provide('searchState', searchState)
</script>

<template>
  <div class="page-container">
    <Header></Header>
    <div class="app">
      <slot />
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
  min-height: 0;
}

@media (max-width: 768px) {

}
</style>
