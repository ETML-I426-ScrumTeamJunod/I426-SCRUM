<script setup>
import ApexCharts from 'apexcharts'
import { onMounted, ref } from 'vue'

const { title, graph, topValue } = defineProps({
  title: {
    type: String,
    required: true,
  },
  graph: {
    type: Object,
    required: true,
  },
  topValue: {
    type: String,
    required: false,
  },
})
//on utilise ref(null) afin de pouvoir ensuite cibler l'élément html
const chartId = ref(null)

onMounted(async () => {
  var chart = new ApexCharts(chartId.value, graph) //charId.value = l'élément <div>
  chart.render()
})
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <!-- utiliser une class "top" car id -> crash -->
    <p v-if="!!topValue" class="top">Top : {{ topValue }}</p>
    <div ref="chartId"></div>
    <!-- assignation afin de pouvoir retrouver la <div>, ne pas utiliser d'id -> plusieurs graphes du même id = crash -->
  </div>
</template>

<style>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  box-shadow: 4px 4px 8px rgb(152, 152, 152);
  color: var(--color-text);
  background-color: var(--color-background-soft);
  border-radius: 16px;
  margin: 32px;
  width: 660px;
  height: 440px;
  padding: 8px;
}
h3 {
  font-size: 200%;
  font-weight: bold;
}
</style>
