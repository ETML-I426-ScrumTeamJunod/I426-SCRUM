<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref, computed } from 'vue'

declare const L: any
//recherche de l'utilisateur
const searchQuery = ref('')
//liest des sites unesco
const sitesList = ref<any[]>([])

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

//variables leaflet
let map: any = null
let markerCluster: any = null
let markers: any[] = []
let markerSelected: any = null

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
    zoom: 2,
    minZoom: 2,
    maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
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
          document.getElementById('info-panel')!.innerHTML = `
            <h2>${site.site}</h2>
            <small style="color: gray">${site.category}</small>
            <hr />
            <p>${site.short_description}</p>
            <button style="padding: 12px">Marquer comme visité</button>
          `
          if (markerSelected && markerSelected !== marker)
            markerSelected.setIcon(markerSelected.originalIcon)
          marker.setIcon(pinSelected)
          markerSelected = marker
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
    if (markerSelected) {
      markerSelected.setIcon(markerSelected.originalIcon)
      markerSelected = null
    }
    document.getElementById('info-panel')!.innerHTML =
      `<h3>Veuillez sélectionner un site</h3><p>Cliquez sur un site pour voir sa description</p>`
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
        markerSelected.setIcon(markerSelected.originalIcon)
        markerSelected = null
      }
      document.getElementById('info-panel')!.innerHTML =
        `<h3>Veuillez sélectionner un site</h3><p>Cliquez sur un site pour voir sa description</p>`
    })
  }
})
</script>

<template>
  <div class="page-container">
    <header>
      <img src="../assets/BSI_Logo.png" height="50" />
      <search class="search-container">
        <form @submit.prevent="submitSearch" class="search-form">
          <button type="submit" class="search-btn">
            <img src="../assets/loupeBG.png" alt="loupe" height="23" />
          </button>
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Rechercher un site..."
            class="search-input"
          />
        </form>

        <ul v-if="filteredSites.length > 0" class="suggestions-list">
          <li v-for="site in filteredSites" :key="site.site" @click="selectSite(site.site)">
            <span v-html="highlightMatch(site.site)"></span>
          </li>
        </ul>
      </search>
      <nav>
        <ul>
          <li>
            <RouterLink to="/home" class="nav-btn">Accueil</RouterLink>
            <RouterLink to="/stats" class="nav-btn">Stats</RouterLink>
            <RouterLink to="/list" class="nav-btn">Listes</RouterLink>
            <RouterLink to="/about" class="nav-btn">A propos</RouterLink>
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
          <svg
            class="profile-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20.2C9.5 20.2 7.29 18.92 6 16.98C6.03 14.99 10 13.9 12 13.9C13.99 13.9 17.97 14.99 18 16.98C16.71 18.92 14.5 20.2 12 20.2Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </header>

    <main class="map-layout">
      <div id="map" class="map-container"></div>

      <aside class="side-panel">
        <div class="filter-box">
          <label for="filter-category" class="filter-label">Filtrer par catégorie :</label>
          <select id="filter-category" class="filter-select">
            <option value="all">Tous les sites</option>
            <option value="Natural">Naturel</option>
            <option value="Cultural">Culturel</option>
            <option value="Mixed">Mixte</option>
          </select>
        </div>
        <div id="info-panel">
          <h3>Veuillez sélectionner un site</h3>
          <p>Cliquez sur un site pour voir sa description</p>
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
  background-color: #5d5b4e;
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
  background-color: #dfe2db;
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
  background-color: #dfe2db;
}

.nav-btn:hover {
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
  color: #000;
}

.lang:hover {
  color: rgb(255, 255, 255);
}

.lang.active {
  font-weight: bold;
  color: rgb(255, 255, 255);
}

.separator {
  color: var(--color-border-hover);
  cursor: default;
  color: black;
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
  color: #131212;
}

.profile-icon:hover {
  color: rgb(255, 255, 255);
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

.search-container {
  position: relative;
}

.suggestions-list {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.suggestions-list li {
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.suggestions-list li:last-child {
  border-bottom: none;
}

:deep(.highlight-blue) {
  color: #007bff;
  font-weight: 500;
  display: inline;
}

.suggestions-list li:hover {
  background-color: var(--color-background-mute);
  font-weight: 900 !important;
}

.suggestions-list li:hover * {
  font-weight: 620 !important;
}

.suggestions-list li:hover :deep(.highlight-blue) {
  color: #007bff !important;
}

@media (max-width: 768px) {
  header {
    flex-wrap: wrap;
    padding: 0.5rem 1rem;
    gap: 0.5rem;
  }

  header > img {
    height: 28px;
  }

  .right-actions {
    margin-left: auto;
    gap: 1rem;
  }

  .search-container {
    order: 3;
    width: 100%;
    margin-top: 0.5rem;
  }

  .search-form {
    width: 100%;
  }

  nav {
    order: 4;
    width: 100%;
    margin-top: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  li {
    gap: 0.5rem;
  }

  .nav-btn {
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
  }

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
