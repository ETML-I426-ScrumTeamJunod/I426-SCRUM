<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SiteService from '@/services/SiteService'
import { getUser, isAuthenticated } from '@/services/AuthService'

const { locale } = useI18n()
const router = useRouter()

const wishlist = ref<any[]>([])
const visited = ref<any[]>([])
const loading = ref(true)
const user = ref(getUser())

const getSiteName = (site: any) => {
  const translation = site?.traductions?.find((t: any) => t.codeLangue === locale.value)
  return translation?.nom ?? site?.traductions?.[0]?.nom ?? ''
}

const getSiteImageUrl = (site: any) =>
  site.imageExtension ? `http://localhost:3333/api/sites/${site.id}/image` : null

const getSiteCountries = (site: any) => site?.pays?.map((p: any) => p.nom).join(', ') ?? ''

const totalSites = computed(() => wishlist.value.length + visited.value.length)
const visitedCount = computed(() => visited.value.length)
const progressPercent = computed(() =>
  totalSites.value > 0 ? Math.round((visitedCount.value / totalSites.value) * 100) : 0,
)

onMounted(async () => {
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }

  try {
    const { data } = await SiteService.getUserLists()
    wishlist.value = data.wishlist
    visited.value = data.visited
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page-wrapper">
    <div class="content-container">
      <h1 class="welcome-title">Bonjour, {{ user?.nom ?? '' }}!</h1>

      <section class="stats-card">
        <div class="stats-header">
          <h2 class="stats-main-title">Progression UNESCO</h2>
          <p class="stats-subtitle">Votre voyage autour du monde</p>
        </div>
        <div class="progress-container">
          <progress :value="visitedCount" :max="totalSites || 1" style="border-radius: 10px"></progress>
          <div class="progress-info">
            <span>Vous avez visité {{ visitedCount }} sites sur {{ totalSites }} inscrit dans votre liste!</span>
            <span class="percentage-label">{{ progressPercent }}%<br /><small style="font-weight: bold; font-size: 20">complété</small></span>
          </div>
        </div>
      </section>

      <h2 class="list-title">Votre Liste</h2>
      <div v-if="loading" class="loading-msg">Chargement...</div>
      <div v-else class="sites-grid">
        <p v-if="wishlist.length === 0" class="visited-or-not">Vous n'avez aucun site dans votre liste pour le moment</p>
        <div v-for="site in wishlist" :key="site.id" class="site-card">
          <div class="image-box">
            <img
              v-if="getSiteImageUrl(site)"
              :src="getSiteImageUrl(site)!"
              :alt="getSiteName(site)"
            />
            <div v-else class="no-image"></div>
          </div>
          <div class="site-details">
            <h3>{{ getSiteName(site) }}</h3>
            📍 <span class="country-info">{{ getSiteCountries(site) }}</span>
          </div>
        </div>
      </div>

      <h2 class="list-title">Sites visités</h2>
      <div v-if="loading" class="loading-msg">Chargement...</div>
      <div v-else class="sites-grid">
        <p v-if="visited.length === 0" class="visited-or-not">Vous n'avez visité aucun site pour le moment</p>
        <div v-for="site in visited" :key="site.id" class="site-card">
          <div class="image-box">
            <img
              v-if="getSiteImageUrl(site)"
              :src="getSiteImageUrl(site)!"
              :alt="getSiteName(site)"
            />
            <div v-else class="no-image"></div>
          </div>
          <div class="site-details">
            <h3>{{ getSiteName(site) }}</h3>
            📍 <span class="country-info">{{ getSiteCountries(site) }}</span>
          </div>
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

.stats-card {
  background-color: #e2e2da;
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

progress {
  width: 100%;
  height: 22px;
  appearance: none;
  border: 1px solid #999;
  border-radius: 11px;
  overflow: hidden;
}

progress::-webkit-progress-bar {
  background-color: white;
  border-radius: 11px;
}

progress::-webkit-progress-value {
  background-color: #b30000;
  border-radius: 11px;
}

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

.sites-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}

.site-card {
  background-color: #d9d9d9;
  padding: 15px;
  border-radius: 20px;
  color: #333;
}

.site-card:hover {
  cursor: pointer;
  transform: scale(1.03);
}

.image-box {
  width: 100%;
  height: 200px;
  background: white;
  margin-bottom: 15px;
  border-radius: 15px;
  overflow: hidden;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  background-color: #ccc;
}

.site-details h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
}

.country-info {
  margin: 5px 0 0 0;
  font-size: 0.8rem;
  color: #cc0000;
  font-weight: bold;
}

.loading-msg {
  color: #aaa;
  font-style: italic;
  margin-bottom: 30px;
}

.visited-or-not {
  color: rgb(181, 181, 181);
  font-style: italic;
}

@media (max-width: 1024px) {
  .sites-grid {
    grid-template-columns: repeat(2, 1fr);
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
    justify-self: center;
  }

  .stats-card {
    margin-bottom: 40px;
  }

  .page-wrapper {
    padding-top: 10px;
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
</style>
