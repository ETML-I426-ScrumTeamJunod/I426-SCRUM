<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, ref, computed, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteService from '@/services/SiteService'
import { isAuthenticated } from '@/services/AuthService'

declare const L: any

const { t, locale } = useI18n()
const router = useRouter()

const sitesList = ref<any[]>([])

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
  currentSite.value = null
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

watch(locale, async () => {
  // Reload markers and update their titles when language changes
  if (markerCluster && sitesList.value.length > 0) {
    markers.forEach((marker) => {
      const site = sitesList.value.find((s) => s.id === marker.getLatLng().id)
      if (site) {
        marker.options.title = getSiteName(site)
      }
    })
    if (markerSelected.value) {
      currentSite.value = sitesList.value.find((s) => s.latitude === markerSelected.value.getLatLng().lat && s.longitude === markerSelected.value.getLatLng().lng)
    }
  }
})

const filteredSites = computed(() => {
  if (searchQuery.value.length < 2) return []

  return sitesList.value
    .filter((site) =>
      getSiteName(site).toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
    .slice(0, 5)
})

const highlightMatch = (text: string) => {
  if (!searchQuery.value) return text
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

let map: any = null
let markerCluster: any = null
let markers: any[] = []
const markerSelected = ref(null)
const currentSite = ref(null)

const wishlistIds = ref<number[]>([])
const visitedIds = ref<number[]>([])

const isInWishlist = computed(() =>
  currentSite.value ? wishlistIds.value.includes(currentSite.value.id) : false,
)
const isVisited = computed(() =>
  currentSite.value ? visitedIds.value.includes(currentSite.value.id) : false,
)

const toggleWishlist = async () => {
  if (!currentSite.value) return
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
  const id = (currentSite.value as any).id
  if (isInWishlist.value) {
    await SiteService.removeFromWishlist(id)
    wishlistIds.value = wishlistIds.value.filter((i) => i !== id)
  } else {
    await SiteService.addToWishlist(id)
    wishlistIds.value = [...wishlistIds.value, id]
  }
}

const toggleVisited = async () => {
  if (!currentSite.value) return
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
  const id = (currentSite.value as any).id
  if (isVisited.value) {
    await SiteService.removeFromVisited(id)
    visitedIds.value = visitedIds.value.filter((i) => i !== id)
  } else {
    await SiteService.markAsVisited(id)
    visitedIds.value = [...visitedIds.value, id]
  }
}

let pinNatural: any = null
let pinCultural: any = null
let pinMixed: any = null
let pinSelected: any = null

// Helpers to read from your API shape - use current locale
const getSiteName = (site: any) => {
  const translation = site?.traductions?.find((t: any) => t.codeLangue === locale.value)
  return translation?.nom ?? site?.traductions?.[0]?.nom ?? ''
}
const getSiteDescription = (site: any) => {
  const translation = site?.traductions?.find((t: any) => t.codeLangue === locale.value)
  return translation?.description ?? site?.traductions?.[0]?.description ?? ''
}
const getSiteCountries = (site: any) => site?.pays?.map((p: any) => p.nom).join(', ') ?? ''
const getSiteImageUrl = (site: any) =>
  site.imageExtension ? `http://localhost:3333/api/sites/${site.id}/image` : null

const submitSearch = () => {
  if (!searchQuery.value) return

  const marker = markers.find((m) =>
    m.options.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )

  if (!marker) {
    alert(t('header.noResultsFound'))
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

const loadAndDisplaySites = async () => {
  // Fetch from your API instead of the JSON file
  const { data } = await SiteService.getSites()
  sitesList.value = data

  // Clear existing markers
  if (markerCluster) {
    markerCluster.clearLayers()
    markers = []
  }

  data.forEach((site: any) => {
    const name = getSiteName(site)
    let pinChosen =
      site.categorie === 'Natural'
        ? pinNatural
        : site.categorie === 'Cultural'
          ? pinCultural
          : pinMixed

    let marker = L.marker([site.latitude, site.longitude], {
      icon: pinChosen,
      title: name,
    })

    marker.originalIcon = pinChosen
    marker.category = site.categorie

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
}

onMounted(async () => {
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

  pinNatural = L.icon({
    iconUrl: '/ressources/images/marker-green.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  })
  pinCultural = L.icon({
    iconUrl: '/ressources/images/marker-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  })
  pinMixed = L.icon({
    iconUrl: '/ressources/images/marker-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  })
  pinSelected = L.icon({
    iconUrl: '/ressources/images/marker-red.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  })

  markerCluster = L.markerClusterGroup()

  await loadAndDisplaySites()

  if (isAuthenticated()) {
    const { data } = await SiteService.getUserLists()
    wishlistIds.value = data.wishlist.map((s: any) => s.id)
    visitedIds.value = data.visited.map((s: any) => s.id)
  }

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
      const selected = (e.target as HTMLSelectElement).value
      markerCluster.clearLayers()
      markers.forEach((marker) => {
        if (selected === 'all' || marker.category === selected) markerCluster.addLayer(marker)
      })
      if (markerSelected.value) {
        markerSelected.value.setIcon(markerSelected.value.originalIcon)
        markerSelected.value = null
      }
      currentSite.value = null
    })
  }
})
</script>

<template>
  <div class="page-container">
    <main class="map-layout">
      <div id="map" class="map-container"></div>
      <aside v-show="markerSelected" class="side-panel">
        <div class="filter-box">
          <label for="filter-category" class="filter-label">{{
            $t('home.filterByCategory')
          }}</label>
          <select id="filter-category" class="filter-select">
            <option value="all">{{ $t('home.allSites') }}</option>
            <option value="Natural">{{ $t('home.natural') }}</option>
            <option value="Cultural">{{ $t('home.cultural') }}</option>
            <option value="Mixed">{{ $t('home.mixed') }}</option>
          </select>
        </div>
        <div id="info-panel">
          <div class="site-details">
            <img
              v-if="currentSite && getSiteImageUrl(currentSite)"
              :src="getSiteImageUrl(currentSite)!"
              :alt="currentSite.traductions?.[0]?.imageAlt ?? getSiteName(currentSite)"
              class="site-image"
            />
            <h2>{{ getSiteName(currentSite) }}</h2>
            <p class="site-category">
              <strong>{{ $t('home.category') }}</strong> {{ currentSite?.categorie || '' }}
            </p>
            <p class="site-location">
              <strong>{{ $t('home.country') }}</strong>
              {{ currentSite ? getSiteCountries(currentSite) : '' }}
            </p>
            <hr />
            <p class="site-description">{{ getSiteDescription(currentSite) }}</p>
            <button class="action-btn wishlist-btn" @click="toggleWishlist">
              {{ isInWishlist ? $t('home.removeFromWishlist') : $t('home.addToWishlist') }}
            </button>
            <button class="action-btn visited-btn" @click="toggleVisited">
              {{ isVisited ? $t('home.markAsNotVisited') : $t('home.markAsVisited') }}
            </button>
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
}

.map-container {
  flex-grow: 1;
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

.site-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
  object-fit: cover;
  max-height: 200px;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}

.wishlist-btn {
  background-color: #1a73e8;
  color: white;
}

.wishlist-btn:hover {
  background-color: #1558b0;
}

.visited-btn {
  background-color: #2e7d32;
  color: white;
}

.visited-btn:hover {
  background-color: #1b5e20;
}
</style>
