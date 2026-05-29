<script setup lang="ts">
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import AppLayout from '../layouts/AppLayout.vue'
import { useWishlist } from '../composables/useWishlist'
defineOptions({ layout: AppLayout })

const user = {
  name: 'Bertrand',
  email: 'bertrand.sahli@eduvaud.ch',
  mot_de_passe: '1234567890',
}

const hardcodedSites = [
  {
    id: -1,
    nom: 'Ancient and Primeval Beech Forests',
    categorie: 'Natural',
    description: 'This transboundary property...',
    imageUrl: '/ressources/images/forests.png',
    pays: [
      'Albania', 'Austria', 'Belgium', 'Bulgaria', 'Croatia',
      'Germany', 'Italy', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Ukraine',
    ],
    visited: true,
  },
  {
    id: -2,
    nom: 'Jesuit Missions of the Guaranis',
    categorie: 'Natural',
    description: 'Jesuit Missions of the Guaranis...',
    imageUrl: '/ressources/images/san-ignacio.png',
    pays: ['Argentina', 'Brazil'],
    visited: true,
  },
]

const { wishlist, removeFromWishlist } = useWishlist()

const dynamicSites = computed(() =>
  wishlist.value.map((s) => ({ ...s, visited: false }))
)

const allSites = computed(() => [...hardcodedSites, ...dynamicSites.value])

const visitedSites = computed(() => allSites.value.filter((s) => s.visited))
const wishlistSites = computed(() => allSites.value.filter((s) => !s.visited))

const visitedCount = computed(() => visitedSites.value.length)
const totalCount = computed(() => allSites.value.length)
const progressPercent = computed(() =>
  totalCount.value ? Math.round((visitedCount.value / totalCount.value) * 100) : 0
)
</script>

<template>
  <div class="page-wrapper">
    <div class="content-container">
      <h1 class="welcome-title">Bonjour, {{ user.name }}!</h1>
      <section class="stats-card">
        <div class="stats-header">
          <h2 class="stats-main-title">Progression UNESCO</h2>
          <p class="stats-subtitle">Votre voyage autour du monde</p>
        </div>
        <div class="progress-container">
          <progress :value="visitedCount" :max="totalCount" style="border-radius: 10px"></progress>
          <div class="progress-info">
            <span>Vous avez visité {{ visitedCount }} sites sur {{ totalCount }} inscrits dans votre liste!</span>
            <span class="percentage-label">{{ progressPercent }}%<br /><small style="font-weight: bold; font-size: 20">complété</small></span>
          </div>
        </div>
      </section>

      <h2 class="list-title">Votre Liste</h2>
      <div class="sites-grid">
        <p v-if="wishlistSites.length === 0" class="visited-or-not">Vous n'avez aucun site dans votre liste pour le moment</p>
        <div v-for="item in wishlistSites" :key="item.id" class="site-card">
          <div class="image-box">
            <img :src="item.imageUrl ?? ''" :alt="item.nom" />
          </div>
          <div class="site-details">
            <h3>{{ item.nom }}</h3>
            📍<span class="country-info" v-for="value in item.pays" :key="value"> {{ value + ', ' }}</span>
          </div>
          <button class="btn-remove" @click="removeFromWishlist(item.id)">Retirer de ma liste</button>
        </div>
      </div>

      <h2 class="list-title">Sites visités</h2>
      <div class="sites-grid">
        <p v-if="visitedSites.length === 0" class="visited-or-not">Vous n'avez visité aucun site pour le moment</p>
        <div v-for="item in visitedSites" :key="item.id" class="site-card">
          <Link href="/">
            <div class="image-box">
              <img :src="item.imageUrl ?? ''" :alt="item.nom" />
            </div>
            <div class="site-details">
              <h3>{{ item.nom }}</h3>
              📍<span class="country-info" v-for="value in item.pays" :key="value"> {{ value + ', ' }}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  background-color: #333333;
  min-height: 100vh;
  padding: 50px 20px;
  font-family: Arial, sans-serif;
  color: white;
}

.content-container {
  max-width: 1100px;
  margin: 0 auto;
}

.welcome-title,
.list-title {
  font-style: italic;
  font-weight: 900;
  font-size: 3.5rem;
  margin-bottom: 30px;
  letter-spacing: -1px;
}

/* --- Section Statistiques (La bulle claire) --- */
.stats-card {
  background-color: #e2e2da; /* Couleur beige/gris clair */
  border-radius: 30px;
  padding: 25px 40px;
  color: #444;
  margin-bottom: 60px;
}

.stats-main-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.stats-subtitle {
  margin: 0 0 15px 0;
  font-size: 0.9rem;
}

/* Barre de progression Rouge */
progress {
  width: 100%;
  height: 22px;
  appearance: none; /* Désactive le look Windows/Mac par défaut */
  border: 1px solid #999;
  border-radius: 11px; /* Arrondi du contour */
  overflow: hidden; /* Coupe ce qui dépasse des arrondis */
}

/* L'ARRONDI DE L'INTÉRIEUR (Chrome, Safari, Edge) */
progress::-webkit-progress-bar {
  background-color: white;
  border-radius: 11px;
}

progress::-webkit-progress-value {
  background-color: #b30000; /* Ton rouge maquette */
  border-radius: 11px; /* C'est ça qui arrondit la barre de couleur ! */
}

/* L'ARRONDI DE L'INTÉRIEUR (Firefox) */
progress::-moz-progress-bar {
  background-color: #b30000;
  border-radius: 11px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: bold;
}

.percentage-label {
  text-align: right;
  font-weight: bold;
  font-style: oblique;
  font-size: 20px;
  line-height: 1;
}



/* --- Grille des sites (4 colonnes) --- */
.sites-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 colonnes identiques */
  gap: 30px;
}

.site-card {
  background-color: #d9d9d9; /* Gris des cartes */
  padding: 15px;
  color: #333;
}

.site-card:hover {
  cursor: pointer;
  transform: scale(1.03);
}

.btn-remove {
  margin-top: 10px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background-color: #555;
  color: white;
  transition: background-color 0.2s;
}

.btn-remove:hover {
  background-color: #b30000;
}

.image-box {
  width: 100%;
  height: 200px;
  background: white;
  margin-bottom: 15px;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.site-details h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
}

.country-info {
  margin: 5px 0 0 0;
  font-size: 0.8rem;
  color: #cc0000; /* Rouge pour le pays */
  font-weight: bold;
}

/* Responsive */
@media (max-width: 1024px) {
  .sites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .sites-grid {
    grid-template-columns: 1fr;
  }
  .welcome-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 33px;
  }

  .list-title {
    font-size: 33px;
    text-align: center;
    margin-bottom: 5px;
  }

  .site-card {
    margin-bottom: 20px;
    width: 320px;
  }

  .stats-card {
    margin-bottom: 40px;
  }

  .site-card {
    justify-self: center;
  }

  .page-wrapper {
    padding-top: 10px;
  }

  .visited-or-not {
    color: rgb(181, 181, 181);
    font-style: italic;
    text-align: center;
  }
}
</style>
