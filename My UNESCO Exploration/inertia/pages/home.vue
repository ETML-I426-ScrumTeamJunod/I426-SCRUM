<script setup lang="ts">
import { onMounted, ref, computed, inject, watch } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { router } from '@inertiajs/vue3'

declare const L: any // Keeping this line for context
defineOptions({ layout: AppLayout })
const props = defineProps<{ sites: any[] }>()
const sitesList = ref<any[]>(props.sites || [])

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
    .filter((site) => getSiteTitle(site).toLowerCase().includes(searchQuery.value.toLowerCase()))
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
const currentSite = ref<any>(null)

const getSiteLatitude = (site: any) => site.coordinates?.lat ?? site.latitude
const getSiteLongitude = (site: any) => site.coordinates?.lon ?? site.longitude
const getSiteCategory = (site: any) => site.category ?? site.categorie
const getSiteTitle = (site: any) => site.site ?? site.nom ?? site.name ?? ''
const getSiteImageUrl = (site: any) => site.imageUrl || (site.id ? `/sites/${site.id}/image` : null)
const getSiteStates = (site: any) => {
  if (!site) return ''
  if (Array.isArray(site.states)) return site.states.join(', ')
  if (Array.isArray(site.states_names)) return site.states_names.join(', ')
  if (Array.isArray(site.pays)) return site.pays.map((p: any) => p.nom || p).join(', ')
  return site.states || site.pays || ''
}
const getSiteDescription = (site: any) => site.short_description ?? site.description ?? ''

const currentSiteImageUrl = computed(() => {
  return currentSite.value ? getSiteImageUrl(currentSite.value) : null
})


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

  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
    attribution:
      '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'jpg',
  }).addTo(map)

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

  sitesList.value.forEach((site: any) => {
    const lat = getSiteLatitude(site)
    const lon = getSiteLongitude(site)
    if (lat == null || lon == null) return

    const pinChosen =
      getSiteCategory(site) === 'Natural'
        ? pinNatural
        : getSiteCategory(site) === 'Cultural'
          ? pinCultural
          : pinMixed
    const marker = L.marker([lat, lon], {
      icon: pinChosen,
      title: getSiteTitle(site),
    })

    marker.originalIcon = pinChosen
    marker.category = getSiteCategory(site)

    marker.on('click', () => {
      if (markerSelected.value && markerSelected.value !== marker) {
        markerSelected.value.setIcon(markerSelected.value.originalIcon)
      }

      markerSelected.value = marker
      marker.setIcon(pinSelected)

      currentSite.value = site

      markerCluster.zoomToShowLayer(marker, () =>
        map.setView(marker.getLatLng(), Math.max(map.getZoom(), 6), { animate: true }),
      )
    })
    markerCluster.addLayer(marker)
    markers.push(marker)
  })
  map.addLayer(markerCluster)

  map.on('click', () => {
    if (markerSelected.value) {
      markerSelected.value.setIcon(markerSelected.value.originalIcon)
      markerSelected.value = null
    }
    currentSite.value = null
  })

  const filterSelect = document.getElementById('filter-category')
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      const selectedCategory = (e.target as HTMLSelectElement).value
      markerCluster.clearLayers()
      markers.forEach((marker) => {
        if (selectedCategory === 'all' || marker.category === selectedCategory)
          markerCluster.addLayer(marker)
      })
      if (markerSelected) {
        markerSelected.value.setIcon(markerSelected.value.originalIcon)
        markerSelected.value = null
      }
      currentSite.value = null
    })
  }
})
function toggleVisited(site: any) {
  router.post(`/api/sites/${site.id}/toggle-visited`, {}, {
    preserveState: true,
    preserveScroll: true,
    onSuccess: () => {
      if (currentSite.value) {
        const updatedSite = sitesList.value.find(s => s.id === site.id)
        if (updatedSite) currentSite.value = updatedSite
      }
    }
  })
}
</script>

<template>
  <div class="page-container">
    <main class="map-layout">
      <div id="map" class="map-container"></div>
      
      <aside v-if="markerSelected && currentSite" class="side-panel">
        <div id="info-panel">
          <div class="site-details">
            <img v-if="currentSiteImageUrl" :src="currentSiteImageUrl" alt="Image du site" style="width: 100%; border-radius: 8px; margin-bottom: 10px;" />
            <h2>{{ getSiteTitle(currentSite) }}</h2>
            <p class="site-category">
              <strong>Catégorie :</strong> {{ getSiteCategory(currentSite) }}
            </p>
            <p class="site-location"><strong>Pays :</strong> {{ getSiteStates(currentSite) }}</p>
            <hr />
            <p class="site-description">{{ getSiteDescription(currentSite) }}</p>
            
            <div class="actions-buttons">
              <button 
                @click="toggleWishlist(currentSite)"
                :class="{ 'in-wishlist': currentSite.InWishlist }"
              >
                {{ currentSite.InWishlist ? 'Supprimer de ma liste' : 'Ajouter à ma liste' }}
              </button>

              <button 
                @click="toggleVisited(currentSite)"
                :class="{ 'is-visited': currentSite.Visited }"
              >
                {{ currentSite.Visited ? 'Marquer comme non-visité' : 'Marquer comme visité' }}
              </button>
            </div>

          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  overflow-y: hidden;
  height: 100%;
}

.map-layout {
  display: flex;
  flex: 1;
  width: 100%;
  position: relative;
  height: 100%;
}

.map-container {
  flex-grow: 1;
  z-index: 1;
  height: 100%;
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

.actions-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.actions-buttons button {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.2s ease;
}

/* Styles pour les états actifs */
.actions-buttons button.is-visited {
  background-color: #2e7d32;
  color: white;
  border-color: #1b5e20;
}

.actions-buttons button.in-wishlist {
  background-color: #0288d1;
  color: white;
  border-color: #01579b;
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