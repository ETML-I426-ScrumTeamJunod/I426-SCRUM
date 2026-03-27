<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref, computed, inject, watch } from 'vue'

declare const L: any

//liest des sites unesco
const sitesList = ref<any[]>([])

//recherche de l'utilisateur
const { searchQuery, selectedCategory, searchTrigger } = inject('searchState') as any

watch(selectedCategory, (newCat) => {
  if (!markerCluster) return
  markerCluster.clearLayers()
  markers.forEach((marker) => {
    if (newCat === 'all' || marker.category === newCat) {
      markerCluster.addLayer(marker)
    }
  })

  if (markerSelected.value) {
    markerSelected.value.setIcon(markerSelected.value.originalIcon)
    markerSelected.value = null
  }
  const panel = document.getElementById('info-panel')
  if (panel) panel.innerHTML = `<h3>Veuillez sélectionner un site</h3>`
})

watch(searchTrigger, () => {
  if (!searchQuery.value || markers.length === 0) return

  const marker = markers.find((m) =>
    m.options.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )

  if (marker) {
    markerCluster.zoomToShowLayer(marker, () => {
      marker.fire('click')
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 6), { animate: true })
    })
  }
})

//recherche intelligente
const filteredSites = computed(() => {
  if (searchQuery.value.length < 2) return []

  //suggère seulement les 5 premiers sites
  return sitesList.value
    .filter((site) => site.site.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(0, 5)
})

//highlight de la recherche utilisateur
const highlightMatch = (text: string) => {
  if (!searchQuery.value) return text

  //regex pour ne pas avoir d'erreurs à cause des caractères spéciaux
  const safeQuery = searchQuery.value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`(${safeQuery})`, 'gi')

  return text.replace(regex, '<span class="highlight-blue">$1</span>')
}

const isFilterOpen = ref(false)

const setCategory = (category: string) => {
  const filterSelect = document.getElementById('filter-category') as HTMLSelectElement
  if (filterSelect) {
    filterSelect.value = category
    filterSelect.dispatchEvent(new Event('change'))
  }
  isFilterOpen.value = false
}

//variables leaflet
let map: any = null
let markerCluster: any = null
let markers: any[] = []
const markerSelected = ref<any>(null)

//recherche
const submitSearch = () => {
  if (!searchQuery.value) return

  const marker = markers.find((m) =>
    m.options.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )

  if (!marker) {
    alert('Aucun résultat trouvé')
    return
  }

  markerCluster.zoomToShowLayer(marker, () => {
    marker.fire('click')
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 6), { animate: true })
  })

  searchQuery.value = ''
}

const selectSite = (siteName: string) => {
  searchQuery.value = siteName
  submitSearch()
}

onMounted(() => {
  if (typeof L === 'undefined') {
    console.error("Leaflet n'est pas chargé.")
    return
  }

  map = L.map('map', {
    center: [20, 0],
    zoom: 3,
    minZoom: 3,
    maxBounds: L.latLngBounds(L.latLng(-95, -190), L.latLng(95, 190)),
    maxBoundsViscosity: 1.0,
  })

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles © Esri — Source: Esri' },
  ).addTo(map)

  const pinNatural = L.icon({
    iconUrl: '/ressources/images/marker-green.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  })
  const pinCultural = L.icon({
    iconUrl: '/ressources/images/marker-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  })
  const pinMixed = L.icon({
    iconUrl: '/ressources/images/marker-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  })
  const pinSelected = L.icon({
    iconUrl: '/ressources/images/marker-red.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  })

  markerCluster = L.markerClusterGroup()

  fetch('/ressources/data/world-heritage-list.json')
    .then((result) => result.json())
    .then((data) => {
      sitesList.value = data

      data.forEach((site: any) => {
        let pinChosen =
          site.category == 'Natural'
            ? pinNatural
            : site.category == 'Cultural'
              ? pinCultural
              : pinMixed
        let marker = L.marker([site.coordinates.lat, site.coordinates.lon], {
          icon: pinChosen,
          title: site.site,
        })

        marker.originalIcon = pinChosen
        marker.category = site.category

        marker.on('click', () => {
          if (markerSelected.value && markerSelected.value !== marker) {
            markerSelected.value.setIcon(markerSelected.value.originalIcon)
          }

          markerSelected.value = marker
          marker.setIcon(pinSelected)

          const panel = document.getElementById('info-panel')
          if (panel) {
            panel.innerHTML = `
              <div class="site-details">
                <h2>${site.site}</h2>
                <p class="site-category"><strong>Catégorie :</strong> ${site.category}</p>
                <p class="site-location"><strong>Pays :</strong> ${site.states}</p>
                <hr />
                <p class="site-description">${site.short_description}</p>
              </div>
            `
          }

          markerCluster.zoomToShowLayer(marker, () =>
            map.setView(marker.getLatLng(), Math.max(map.getZoom(), 6), { animate: true }),
          )
        })
        markerCluster.addLayer(marker)
        markers.push(marker)
      })
      map.addLayer(markerCluster)
    })

  map.on('click', () => {
    if (markerSelected.value) {
      markerSelected.value.setIcon(markerSelected.value.originalIcon)
      markerSelected.value = null
    }
    const panel = document.getElementById('info-panel')
    if (panel) {
      panel.innerHTML = `<h3>Veuillez sélectionner un site</h3><p>Cliquez sur un site pour voir sa description</p>`
    }
  })
})
</script>

<template>
  <div class="page-container">
    <main class="map-layout">
      <div id="map" class="map-container"></div>
      <aside v-show="markerSelected" class="side-panel">
        <div class="filter-box">
          <label for="filter-category" class="filter-label">Filtrer par catégorie :</label>
          <select id="filter-category" class="filter-select">
            <option value="all">Tous les sites</option>
            <option value="Natural">Naturel</option>
            <option value="Cultural">Culturel</option>
            <option value="Mixed">Mixte</option>
          </select>
        </div>
        <div id="info-panel"></div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.map-layout {
  display: flex;
  flex: 1;
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
}

.map-container {
  flex-grow: 1;
  height: 100%;
  z-index: 1;
}

.side-panel {
  width: 30vw;
  min-width: 300px;
  padding: 16px;
  border-left: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
  overflow-y: auto;
  font-family: sans-serif;
  color: var(--color-text);
  z-index: 2;
}

.filter-box {
  display: none;
}

#info-panel {
  margin-top: 1rem;
}

:deep(.site-details h2) {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

:deep(.site-category) {
  font-weight: bold;
  color: #666;
}

:deep(.site-description) {
  margin-top: 10px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .map-layout {
    flex-direction: column;
  }

  .map-container {
    height: 65vh;
    flex-grow: 0;
  }

  .side-panel {
    width: 100%;
    min-width: 100%;
    height: auto;
    padding: 1rem;
    border-left: none;
    border-top: 1px solid var(--color-border);
  }
}
</style>
