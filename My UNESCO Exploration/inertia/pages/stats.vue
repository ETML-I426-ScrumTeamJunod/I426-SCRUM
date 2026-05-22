<script setup lang="ts">
import { computed } from 'vue'
import StatsCard from './components/Stats-card.vue'
import AppLayout from '../layouts/AppLayout.vue'

defineOptions({ layout: AppLayout })

const props = withDefaults(
  defineProps<{
    nom?: string
    totalOfSites?: number
    markedSites?: Array<{
      id: number
      category: string
      region: string
      visited: boolean
      wishlist: boolean
    }>
  }>(),
  {
    nom: 'Utilisateur',
    totalOfSites: 0,
    markedSites: () => []
  }
)

const countSitesByRegion = (regionName: string) => {
  if (!props.markedSites || !Array.isArray(props.markedSites)) return 0
  
  return props.markedSites.filter((site) => {
    const dbRegion = String(site.region || '').toLowerCase().trim()
    const targetRegion = regionName.toLowerCase().trim()
    return dbRegion === targetRegion && site.visited === true
  }).length
}

const countSitesByCategory = (category: string) => {
  if (!props.markedSites || !Array.isArray(props.markedSites)) return 0

  return props.markedSites.filter((site) => {
    const dbCategory = String(site.category || '').toLowerCase().trim()
    const targetCategory = category.toLowerCase().trim()
    return dbCategory === targetCategory && site.visited === true
  }).length
}

const numberOfSitesVisited = computed(() => {
  if (!props.markedSites || !Array.isArray(props.markedSites)) return 0
  return props.markedSites.filter((site) => site.visited === true).length
})

const percentageVisited = computed(() => {
  if (!props.totalOfSites) return '0.00'
  return ((numberOfSitesVisited.value / props.totalOfSites) * 100).toFixed(2)
})

const getStepSize = (max: number) => {
  if (max <= 10) return 2
  if (max <= 50) return 10
  if (max <= 100) return 20
  if (max <= 500) return 100
  return 200
}

const chartsHeight = 360
const chartsWidth = 650

const graphCountByRegionData = computed(() => [
  countSitesByRegion('Europe and North America'),
  countSitesByRegion('Latin America and the Caribbean'),
  countSitesByRegion('Africa'),
  countSitesByRegion('Asia and the Pacific'),
  countSitesByRegion('Arab States'),
])

const topSiteRegion = computed(() => {
  const data = graphCountByRegionData.value
  let max = 0, draw = false, maxIndex = -1
  for (let i = 0; i < data.length; i++) {
    if (data[i] > max) { max = data[i]; maxIndex = i; draw = false }
    else if (data[i] === max && max > 0) { draw = true }
  }
  if (max === 0) return 'Aucun site'
  if (draw) return 'égalité'
  const regions = ['Europe et Amérique du nord', 'Amérique latine et Caraïbes', 'Afrique', 'Asie et Océan Pacifique', 'États arabes']
  return regions[maxIndex]
})

const graphCountByRegion = computed(() => {
  const currentData = graphCountByRegionData.value
  return {
    colors: ['#8B5A2B'],
    series: [{ name: 'Continent', data: currentData }],
    chart: { type: 'bar', height: chartsHeight, width: chartsWidth, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '70%', borderRadius: 5, borderRadiusApplication: 'end' } },
    dataLabels: { enabled: true },
    xaxis: {
      categories: ['Europe et Amérique du nord', 'Amérique latine et Caraïbes', 'Afrique', 'Asie et Océan Pacifique', 'États arabes'],
      labels: { rotate: -30, offsetX: 10 }
    },
    yaxis: { title: { text: 'Nombre de sites' }, stepSize: getStepSize(Math.max(...currentData, 0)) },
    tooltip: { y: { formatter: (val: number) => val + ' sites explorés' } }
  }
})

const graphPercentageOfDiscovery = computed(() => ({
  series: [Number(percentageVisited.value)],
  chart: { height: 350, type: 'radialBar' },
  plotOptions: { radialBar: { hollow: { size: '70%' } } },
  labels: ['Découverte du monde'],
}))

const graphPercentageByTypeOfSiteData = computed(() => [
  countSitesByCategory('Cultural'),
  countSitesByCategory('Natural'),
  countSitesByCategory('Mixed'),
])

const topSiteType = computed(() => {
  const data = graphPercentageByTypeOfSiteData.value
  let max = 0, draw = false, maxIndex = -1
  for (let i = 0; i < data.length; i++) {
    if (data[i] > max) { max = data[i]; maxIndex = i; draw = false }
    else if (data[i] === max && max > 0) { draw = true }
  }
  if (max === 0) return 'Aucun site'
  if (draw) return 'égalité'
  return ['culturels', 'naturels', 'mixte'][maxIndex]
})

const graphPercentageByTypeOfSite = computed(() => ({
  series: graphPercentageByTypeOfSiteData.value,
  chart: { width: 380, type: 'pie' },
  labels: ['Culturels', 'Naturels', 'Mixtes'],
  legend: { position: 'bottom' }
}))
</script>

<template>
  <main class="stats-page">
    <h1>Bonjour {{ props.nom }}</h1>
    <div id="statistics">
      <StatsCard
        title="Exploration"
        class="stats"
        :graph="graphCountByRegion"
        :topValue="topSiteRegion"
      ></StatsCard>

      <StatsCard
        title="Sites visités"
        class="stats"
        :graph="graphPercentageOfDiscovery"
      ></StatsCard>

      <StatsCard
        title="Répartition"
        class="stats"
        :graph="graphPercentageByTypeOfSite"
        :topValue="topSiteType"
      ></StatsCard>
    </div>
  </main>
</template>

<style scoped>
.stats-page {
  background-color: #333333;
  min-height: 100vh;
  padding: 40px 20px;
}
h1 {
  text-align: center;
  color: antiquewhite;
  font-style: italic;
  font-weight: 900;
  font-size: 3.5rem;
  margin-bottom: 30px;
  letter-spacing: -1px;
}
#statistics {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
</style>