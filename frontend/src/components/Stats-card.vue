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
/* Titre de la carte */
.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 5px 0;
}

/* Sous-titre ou description en petit */
.card-subtitle {
  font-size: 0.8rem;
  color: #555555;
  margin-bottom: 20px;
}

/* Badge rouge "TOP : ..." en haut à droite */
.top-badge {
  position: absolute;
  top: 30px;
  right: 30px;
  background-color: #b30000; /* Rouge bordeaux de la maquette */
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 6px;
}

/* Conteneur pour le graphique ApexCharts */
.chart-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
