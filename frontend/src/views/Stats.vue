<script setup>
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from './partials/Header.vue'
import StatsCard from '@/components/Stats-card.vue'
import siteServices from '@/services/SiteService.js'
import { getUser } from '@/services/AuthService.js'

const { locale, t } = useI18n()

const user = ref(getUser())
const totalOfSites = 1247
const chartKey = ref(0)

const sites = ref([])

onMounted(async () => {
  try {
    const response = await siteServices.getUserLists()
    sites.value = response.data.visited
    chartKey.value++
    console.log('Voici les sites: ', sites.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des sites', error)
  }
})

// Fonctions utiles
const countSitesByRegion = (region) => {
  return sites.value.filter((site) => site.regionId === region).length
}

const getStepSize = (max) => {
  if (max <= 10) return 2
  if (max <= 50) return 10
  if (max <= 100) return 20
  if (max <= 500) return 100
  return 200
}

const numberOfSitesVisited = () => {
  return sites.value.length
}

const countSitesByCategory = (category) => {
  return sites.value.filter((site) => site.categorie === category).length
}

// Dimensions des graphes
const chartsHeight = 360
const chartsWidth = 650

// ─── Data computed ───────────────────────────────────────────

const graphCountByRegionData = computed(() => [
  countSitesByRegion(1), // Europe and North America
  countSitesByRegion(2), // Latin America and the Caribbean
  countSitesByRegion(3), // Africa
  countSitesByRegion(4), // Asia and the Pacific
  countSitesByRegion(5), // Arab States
])

const percentageVisited = computed(() => ((numberOfSitesVisited() / totalOfSites) * 100).toFixed(2))

const graphPercentageByTypeOfSiteData = computed(() => [
  countSitesByCategory('Cultural'),
  countSitesByCategory('Natural'),
  countSitesByCategory('Mixed'),
])

// ─── Fonctions topValue ───────────────────────────────────────

const topSiteRegion = () => {
  const regionNames = [
    t('stats.europeAmerica'),
    t('stats.latinAmerica'),
    t('stats.africa'),
    t('stats.asiaOceania'),
    t('stats.arabicStates'),
  ]
  const data = graphCountByRegionData.value
  const maxVal = Math.max(...data)

  if (maxVal === 0) return t('stats.noData')

  const indices = data.reduce((acc, val, i) => (val === maxVal ? [...acc, i] : acc), [])

  if (indices.length > 1) return t('stats.draw')
  return regionNames[indices[0]]
}

const topSiteType = () => {
  const typeNames = [t('stats.cultural'), t('stats.natural'), t('stats.mixt')]
  const data = graphPercentageByTypeOfSiteData.value
  const maxVal = Math.max(...data)

  if (maxVal === 0) return t('stats.noData')

  const indices = data.reduce((acc, val, i) => (val === maxVal ? [...acc, i] : acc), [])

  if (indices.length > 1) return t('stats.draw')
  return typeNames[indices[0]]
}

// ─── Graphes computed ─────────────────────────────────────────

const graphCountByRegion = computed(() => ({
  colors: ['brown'],
  series: [
    {
      name: 'Continent',
      data: graphCountByRegionData.value,
    },
  ],
  chart: {
    type: 'bar',
    height: chartsHeight,
    width: chartsWidth,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '70%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: { enabled: true },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [
      t('stats.europeAmerica'),
      t('stats.latinAmerica'),
      t('stats.africa'),
      t('stats.asiaOceania'),
      t('stats.arabicStates'),
    ],
    labels: {
      rotate: -30,
      offsetX: 10,
    },
  },
  yaxis: {
    title: {
      text: t('stats.nbrSites'),
      offsetX: -4,
    },
    stepSize: getStepSize(Math.max(...graphCountByRegionData.value, 0)),
  },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter: (val) => val + t('stats.exploredSites'),
    },
  },
}))

const graphPercentageOfDiscovery = computed(() => ({
  series: [Number(percentageVisited.value)],
  chart: {
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: { size: '70%' },
    },
  },
  labels: [t('stats.discover')],
}))

const graphPercentageByTypeOfSite = computed(() => ({
  series: graphPercentageByTypeOfSiteData.value,
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: [t('stats.cultural'), t('stats.natural'), t('stats.mixt')],
  legend: { position: 'bottom' },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: { width: 200 },
      },
    },
  ],
}))
</script>

<template>
  <main>
    <h1>{{ $t('stats.greetings') + user?.nom ?? '' }}</h1>
    <div id="statistics">
      <StatsCard
        :key="locale"
        title="Exploration"
        class="stats"
        :graph="graphCountByRegion"
        :topValue="topSiteRegion()"
      />
      <StatsCard
        :key="locale"
        :title="$t('stats.visitedSites')"
        class="stats"
        :graph="graphPercentageOfDiscovery"
      />
      <StatsCard
        :key="locale"
        :title="$t('stats.distribution')"
        class="stats"
        :graph="graphPercentageByTypeOfSite"
        :topValue="topSiteType()"
      />
    </div>
  </main>
</template>

<style>
main {
  background-color: #2d312e;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: sans-serif;
  color: #ffffff;
}

h1 {
  text-align: center;
  margin-bottom: 50px;
  font-size: 3rem;
  font-weight: 800;
  font-style: italic;
}

#statistics {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats {
  background-color: #d9d9d9;
  color: #000000;
  border-radius: 30px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#statistics .stats:nth-child(1) {
  flex: 1 1 100%;
  max-width: 940px;
  min-height: 420px;
}

#statistics .stats:nth-child(2),
#statistics .stats:nth-child(3) {
  width: 450px;
  flex: 0 0 450px;
  min-height: 380px;
}

.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
