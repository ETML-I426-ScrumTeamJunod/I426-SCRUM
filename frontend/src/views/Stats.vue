<script setup>
import { onMounted, ref, computed } from 'vue'
import Header from './partials/Header.vue'
import StatsCard from '@/components/Stats-card.vue'
import siteServices from '@/services/SiteService.js'
import { getUser } from '@/services/AuthService.js'

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
    'Europe et Amérique du nord',
    'Amérique latine et Caraïbes',
    'Afrique',
    'Asie et Océan Pacifique',
    'États arabes',
  ]
  const data = graphCountByRegionData.value
  const maxVal = Math.max(...data)

  if (maxVal === 0) return 'Aucune donnée'

  const indices = data.reduce((acc, val, i) => (val === maxVal ? [...acc, i] : acc), [])

  if (indices.length > 1) return 'Égalité'
  return regionNames[indices[0]]
}

const topSiteType = () => {
  const typeNames = ['culturels', 'naturels', 'mixte']
  const data = graphPercentageByTypeOfSiteData.value
  const maxVal = Math.max(...data)

  if (maxVal === 0) return 'Aucune donnée'

  const indices = data.reduce((acc, val, i) => (val === maxVal ? [...acc, i] : acc), [])

  if (indices.length > 1) return 'Égalité'
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
      'Europe et Amérique du nord',
      'Amérique latine et Caraïbes',
      'Afrique',
      'Asie et Océan Pacifique',
      'États arabes',
    ],
    labels: {
      rotate: -30,
      offsetX: 10,
    },
  },
  yaxis: {
    title: {
      text: 'Nombre de sites',
      offsetX: -4,
    },
    stepSize: getStepSize(Math.max(...graphCountByRegionData.value, 0)),
  },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter: (val) => val + ' sites explorés',
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
  labels: ['Découverte du monde'],
}))

const graphPercentageByTypeOfSite = computed(() => ({
  series: graphPercentageByTypeOfSiteData.value,
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Culturels', 'Naturels', 'Mixtes'],
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
    <h1>Bonjour {{ user?.nom ?? '' }}</h1>
    <div id="statistics">
      <StatsCard
        :key="chartKey"
        title="Exploration"
        class="stats"
        :graph="graphCountByRegion"
        :topValue="topSiteRegion()"
      />
      <StatsCard
        :key="chartKey"
        title="Sites visités"
        class="stats"
        :graph="graphPercentageOfDiscovery"
      />
      <StatsCard
        :key="chartKey"
        title="Répartition"
        class="stats"
        :graph="graphPercentageByTypeOfSite"
        :topValue="topSiteType()"
      />
    </div>
  </main>
</template>

<style>
/* Style du conteneur principal */
main {
  background-color: #2d312e; /* Couleur de fond sombre de ta maquette */
  min-height: 100vh;
  padding: 40px 20px;
  font-family: sans-serif;
  color: #ffffff;
}

/* Titre principal */
h1 {
  text-align: center;
  margin-bottom: 50px;
  font-size: 3rem;
  font-weight: 800;
  font-style: italic; /* Style penché comme sur l'image */
}

/* Conteneur des statistiques */
#statistics {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 40px; /* Espace uniforme entre toutes les cartes */
  max-width: 1200px;
  margin: 0 auto;
}

/* Style de base d'une carte (à appliquer dans StatsCard si nécessaire) */
.stats {
  background-color: #d9d9d9; /* Fond gris clair des cartes */
  color: #000000; /* Texte noir à l'intérieur des cartes */
  border-radius: 30px; /* Coins très arrondis comme sur l'image */
  padding: 30px;
  width: 450px; /* Largeur fixe pour garder l'alignement de la maquette */
  min-height: 250px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

  /* Permet d'aligner le badge "TOP" en haut à droite de la carte */
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
