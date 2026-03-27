<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Home from './components/Home.vue'
import Header from './views/partials/Header.vue'
</script>

<template>
  <div class="page-container">
    <!-- <Header></Header> -->
    <div class="app">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
