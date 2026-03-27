<script setup lang="ts">
import { Link } from '@adonisjs/inertia/vue'
import { onMounted, onUnmounted, ref } from 'vue'
declare const L: any
const lang = ref('fr')
const props = defineProps<{
  sites: any[]
  nom?: string
}>()

// Reactive state
const selectedSite = ref<any>(null)
const selectedFilter = ref<'all' | 'Natural' | 'Cultural' | 'Mixed'>('all')

// Map references
const map = ref<L.Map | null>(null)
const markerCluster = ref<L.MarkerClusterGroup | null>(null)
const allMarkers = ref<any[]>([])
const currentSelectedMarker = ref<any>(null)

onMounted(async () => {
  // Initialize map
  map.value = L.map('map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
    maxBoundsViscosity: 1.0,
  })

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
    }
  ).addTo(map.value)

  // Custom icons
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

  markerCluster.value = L.markerClusterGroup()

  try {
    props.sites.forEach((site) => {
      let pinChosen = pinMixed
      if (site.categorie === 'Natural') pinChosen = pinNatural
      else if (site.categorie === 'Cultural') pinChosen = pinCultural

      const marker = L.marker([site.latitude, site.longitude], {
        icon: pinChosen,
        title: 'temp',
      }) as any

      marker.originalIcon = pinChosen
      marker.category = site.categorie
      marker.siteData = site

      marker.on('click', async () => {
        try {
          const response = await fetch(`/sites/${site.id}/details?lang=${lang.value}`)
          const details = await response.json()
          selectedSite.value = {
            ...site,
            nom: details.nom,
            description: details.description,
          }
        } catch (error) {
          console.error('Erreur lors du chargement des détails:', error)
        }

        if (currentSelectedMarker.value && currentSelectedMarker.value !== marker) {
          currentSelectedMarker.value.setIcon(currentSelectedMarker.value.originalIcon)
        }

        marker.setIcon(pinSelected)
        currentSelectedMarker.value = marker

        markerCluster.value?.zoomToShowLayer(marker, () => {
          map.value?.setView(marker.getLatLng(), Math.max(map.value.getZoom(), 6), {
            animate: true,
          })
        })
      })

      markerCluster.value?.addLayer(marker)
      allMarkers.value.push(marker)
    })

    if (map.value && markerCluster.value) {
      map.value.addLayer(markerCluster.value)
    }
  } catch (error) {
    console.error('Error loading world heritage data:', error)
  }

  // Reset selection when clicking on the map background
  map.value?.on('click', () => {
    if (currentSelectedMarker.value) {
      currentSelectedMarker.value.setIcon(currentSelectedMarker.value.originalIcon)
      currentSelectedMarker.value = null
    }
    selectedSite.value = null
  })
})

const applyFilter = () => {
  if (!markerCluster.value) return

  markerCluster.value.clearLayers()

  allMarkers.value.forEach((marker) => {
    if (selectedFilter.value === 'all' || marker.category === selectedFilter.value) {
      markerCluster.value?.addLayer(marker)
    }
  })

  if (currentSelectedMarker.value) {
    currentSelectedMarker.value.setIcon(currentSelectedMarker.value.originalIcon)
    currentSelectedMarker.value = null
  }
  selectedSite.value = null
}

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
  markerCluster.value = null
  allMarkers.value = []
  currentSelectedMarker.value = null
})
</script>

<template>
  <div class="page-container">
    <header>
      <img :src="'/ressources/images/BSI_Logo.png'" height="50" alt="Logo" />

      <div class="search-container">
        <form action="/search/" class="search-form">
          <input
            type="search"
            id="search"
            name="search-bar"
            placeholder="Rechercher un site..."
            class="search-input"
          />
          <button type="submit" class="search-btn">
            <img :src="'/ressources/images/loupeBG.png'" alt="loupe" height="23" />
          </button>
        </form>
      </div>

      <nav>
        <ul>
          <li>
            <Link href="/" class="nav-btn">Accueil</Link>
            <Link href="/stats" class="nav-btn">Stats</Link>
            <Link href="/list" class="nav-btn">Listes</Link>
            <li v-if="nom">
              <span>{{ nom }}</span>
              <Link 
                href="/user/logout" 
                method="post" 
                as="button" 
                class="nav-btn logout-style"
              >
                Déconnexion
              </Link>
            </li>
            <li v-else>
              <Link href="/user/login" class="nav-btn">Connexion</Link>
            </li>
          </li>
        </ul>
      </nav>

      <div class="right-actions">
        <div class="lang-switch">
          <span class="lang active">fr</span>
          <span class="separator">|</span>
          <span class="lang">en</span>
        </div>
        <div class="profile-menu">
          <!-- profile icon -->
        </div>
      </div>
    </header>

    <main class="map-layout">
      <div id="map" class="map-container"></div>

      <aside class="side-panel">
        <div class="filter-box">
          <label for="filter-category" class="filter-label">Filtrer par catégorie :</label>
          <select
            id="filter-category"
            class="filter-select"
            v-model="selectedFilter"
            @change="applyFilter"
          >
            <option value="all">Tous les sites</option>
            <option value="Natural">Naturel</option>
            <option value="Cultural">Culturel</option>
            <option value="Mixed">Mixte</option>
          </select>
        </div>

        <div class="info-panel">
          <template v-if="selectedSite">
            <h2>{{ selectedSite.nom }}</h2>
            <small style="color: gray">{{ selectedSite.categorie }}</small>
            <hr />
            <p>{{ selectedSite.description }}</p>
            <button style="padding: 12px">Marquer comme visité</button>
          </template>

          <template v-else>
            <h3>Veuillez sélectionner un site</h3>
            <p>Cliquez sur un marqueur pour voir sa description</p>
          </template>
        </div>
      </aside>
    </main>
  </div>
</template>
<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4rem;
  padding: 1rem 2rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.search-form {
  display: flex;
  align-items: center;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 50px;
  padding: 0.3rem 0.5rem 0.3rem 1.2rem;
  width: 600px;
  transition: border-color 0.2s;
}

.search-form:focus-within {
  border-color: var(--color-text);
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  color: var(--color-text);
  flex-grow: 1;
  font-size: 0.95rem;
}

.search-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.5rem;
  display: flex;
  align-items: center;
}

nav {
  margin: 0 auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  gap: 2.5rem;
}

.nav-btn {
  text-decoration: none;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  transition: all 0.2s ease;
  display: inline-block;
}

.nav-btn:hover {
  background-color: var(--color-border);
  color: rgb(255, 0, 0);
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.lang {
  cursor: pointer;
  transition: color 0.2s;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.lang:hover {
  color: rgb(255, 0, 0);
}

.lang.active {
  font-weight: bold;
  color: rgb(255, 0, 0);
}

.separator {
  color: var(--color-border-hover);
  cursor: default;
}

.profile-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.profile-icon {
  width: 45px;
  height: 45px;
  color: var(--color-text);
  transition: color 0.2s ease;
}

.profile-icon:hover {
  color: rgb(255, 0, 0);
}

.search-input::-webkit-search-cancel-button {
  cursor: pointer;
  transform: scale(1.5);
}

.map-layout {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.map-container {
  flex-grow: 1;
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
}

.filter-box {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.filter-label {
  font-weight: bold;
}

.filter-select {
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
}

#info-panel {
  margin-top: 1rem;
}
</style>
