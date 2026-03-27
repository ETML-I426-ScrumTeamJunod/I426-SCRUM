<script setup>
import Header from './partials/Header.vue'
import StatsCard from '@/components/Stats-card.vue'
//fake data for the example
const user = 'Bertrand'
</script>

<template>
  <header>
    <Header></Header>
  </header>
  <main>
    <h1>Bonjour, {{ user }}</h1>
    <StatsCard
      title="Test"
      text="A columns graph used for testing"
      graphType="column"
      class="stats"
    />
  </main>
</template>
<style>
.stats {
  color: black;
  margin: 32px;
  border-radius: 16px;
  background-color: antiquewhite;
  height: 256px;
  width: 512px;
}
</style>
