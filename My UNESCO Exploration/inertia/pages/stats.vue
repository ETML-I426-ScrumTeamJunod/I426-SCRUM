<script setup>
import StatsCard from './components/Stats-card.vue'
import AppLayout from '../layouts/AppLayout.vue'
defineOptions({ layout: AppLayout })
//fake data for the example
const user = 'Bertrand'
const totalOfSites = 1247
const markedSites = [
  {
    id: 1,
    category: 'Natural',
    region: 'Africa',
    states: ['Benin', 'Burkina Faso', 'Niger'],
    coordinates: { lon: 2.4877777778, lat: 11.8841666667 },
    visited: false,
    wishlist: true,
  },
  {
    id: 2,
    category: 'Cultural',
    region: 'Europe and North America',
    states: ['Bosnia and Herzegovina', 'Croatia', 'Serbia', 'Montenegro'],
    coordinates: { lon: 17.9240527778, lat: 43.0922138889 },
    visited: true,
    wishlist: false,
  },
  {
    id: 3,
    category: 'Natural',
    region: 'Africa',
    states: ['Cameroon', 'Central African Republic', 'Congo'],
    coordinates: { lon: 16.5541666667, lat: 2.6094444444 },
    visited: true,
    wishlist: false,
  },
  {
    id: 4,
    category: 'Natural',
    region: 'Europe and North America',
    states: ['Canada', 'United States of America'],
    coordinates: { lon: -140.9919722, lat: 61.19758333 },
    visited: true,
    wishlist: true,
  },
  {
    id: 5,
    category: 'Cultural',
    region: 'Latin America and the Caribbean',
    states: ['Argentina'],
    coordinates: { lon: -70.66666667, lat: -47.15 },
    visited: false,
    wishlist: true,
  },
  {
    id: 6,
    category: 'Natural',
    region: 'Latin America and the Caribbean',
    states: ['Argentina'],
    coordinates: { lon: -64.0, lat: -42.5 },
    visited: true,
    wishlist: false,
  },
  {
    id: 7,
    category: 'Natural',
    region: 'Latin America and the Caribbean',
    states: ['Argentina'],
    coordinates: { lon: -68.0, lat: -30.0 },
    visited: false,
    wishlist: true,
  },
  {
    id: 8,
    category: 'Cultural',
    region: 'Europe and North America',
    states: ['Armenia'],
    coordinates: { lon: 44.29514, lat: 40.15931 },
    visited: true,
    wishlist: false,
  },
  {
    id: 9,
    category: 'Natural',
    region: 'Asia and the Pacific',
    states: ['Australia'],
    coordinates: { lon: 158.8955556, lat: -54.59472222 },
    visited: false,
    wishlist: true,
  },
]

//fonctions utiles
const countSitesByRegion = (regionName) => {
  return markedSites.filter((site) => site.region === regionName && site.visited === true).length
}
const getStepSize = (max) => {
  //permet de définir la graduation en fonction des valeurs (axe Y graphe 1)
  if (max <= 10) return 2
  if (max <= 50) return 10
  if (max <= 100) return 20
  if (max <= 500) return 100
  return 200
}
const numberOfSitesVisited = () => {
  return markedSites.filter((site) => site.visited === true).length
}
const percentageVisited = ((numberOfSitesVisited() / totalOfSites) * 100).toFixed(2) // -> string
const countSitesByCategory = (category) => {
  return markedSites.filter((site) => site.category === category).length
}

// graphs
const chartsHeight = 360
const chartsWidth = 650

//data 1
const graphCountByRegionData = [
  //utile afin de déterminer la stepsize du graphe 1 (graduation de l'axe Y)
  countSitesByRegion('Europe and North America'),
  countSitesByRegion('Latin America and the Caribbean'),
  countSitesByRegion('Africa'),
  countSitesByRegion('Asia ans the Pacific'),
  countSitesByRegion('Arab States'),
]
const topSiteRegion = () => {
  let max = 0
  let draw = false
  let maxIndex = ''
  //trouver la catégorie avec le plus de sites
  for (let index in graphCountByRegionData) {
    if (max < graphCountByRegionData[index]) {
      max = graphCountByRegionData[index]
      maxIndex = index
    } else if (max === graphCountByRegionData[index]) {
      draw = true
    }
  }
  //donner à max la valeur du nom du type de site le plus récurrent
  switch (Number(maxIndex)) {
    case 0:
      max = 'Europe et Amérique du nord'
      break
    case 1:
      max = 'Amérique latine et Caraïbes'
      break
    case 2:
      max = 'Afrique'
      break
    case 3:
      max = 'Asie et Océan Pacifique'
      break
    case 4:
      max = 'États arabes'
      break
  }
  //si égalité
  if (draw) {
    max = 'égalité'
  }

  return max
}
//data 3
const graphPercentageByTypeOfSiteData = [
  countSitesByCategory('Cultural'),
  countSitesByCategory('Natural'),
  countSitesByCategory('Mixed'),
]
const topSiteType = () => {
  let max = 0
  let draw = false
  let maxIndex = ''
  //trouver la catégorie avec le plus de sites
  for (let index in graphPercentageByTypeOfSiteData) {
    if (max < graphPercentageByTypeOfSiteData[index]) {
      max = graphPercentageByTypeOfSiteData[index]
      maxIndex = index
    } else if (max === graphPercentageByTypeOfSiteData[index]) {
      draw = true
    }
  }
  //donner à max la valeur du nom du type de site le plus récurrent
  switch (Number(maxIndex)) {
    case 0:
      max = 'culturels'
      break
    case 1:
      max = 'naturels'
      break
    case 2:
      max = 'mixte'
      break
  }
  //si égalité
  if (draw) {
    max = 'égalité'
  }

  return max
}

//graphe 1
const graphCountByRegion = {
  colors: ['brown'],
  series: [
    {
      name: 'Continent',
      data: graphCountByRegionData,
    },
  ],
  chart: {
    type: 'bar',
    height: chartsHeight,
    width: chartsWidth,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '70%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: true, //afficher les chiffres sur les barres
  },
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
    stepSize: getStepSize(Math.max(...graphCountByRegionData)),
  },
  fill: {
    opacity: 1,
  },
  // Quand on passe la souris sur une data
  tooltip: {
    y: {
      formatter: function (val) {
        return val + ' sites explorés'
      },
    },
  },
}
//graphe 2
const graphPercentageOfDiscovery = {
  series: [Number(percentageVisited)], // on reconverti en Number
  chart: {
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%',
      },
    },
  },
  labels: ['Découverte du monde'],
}
//graphe 3
const graphPercentageByTypeOfSite = {
  series: graphPercentageByTypeOfSiteData,
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Culturels', 'Naturels', 'Mixtes'],
  legend: {
    position: 'bottom',
  },

  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
}
</script>

<template>
  <main>
    <h1>Bonjour {{ user }}</h1>
    <div id="statistics">
      <StatsCard
        title="Exploration"
        class="stats"
        :graph="graphCountByRegion"
        :topValue="topSiteRegion()"
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
        :topValue="topSiteType()"
      ></StatsCard>
    </div>
  </main>
</template>
<style>
h1 {
  text-align: center;
  margin: 0, 0, 16px;
  font-size: 250%;
  color: antiquewhite;
  /* added */
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
}
main {
  background-color: #333333;
}
</style>
