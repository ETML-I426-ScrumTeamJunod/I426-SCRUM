<script setup>
import Header from './partials/Header.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { login } from '@/services/AuthService'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await login({
      email: email.value,
      motDePasse: password.value,
    })

    router.push('/')
  } catch (err) {
    error.value = err.message || 'Email ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-container">
      <a href="/" class="back-btn">
        <svg
          viewBox="0 0 20 20"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g
            id="Dribbble-Light-Preview"
            transform="translate(-100.000000, -6599.000000)"
            fill="#ffffff"
          >
            <g id="icons" transform="translate(56.000000, 160.000000)">
              <path
                d="M52.87975,6458.70724 C53.27075,6459.09759 53.90375,6459.09759 54.29375,6458.70724 C54.68475,6458.3169 54.68475,6457.68497 54.29375,6457.29563 L47.85375,6450.86648 C47.53875,6450.55201 47.76175,6450.01491 48.20675,6450.01491 L62.99975,6450.01491 C63.55175,6450.01491 63.99975,6449.55868 63.99975,6449.00761 L63.99975,6449.00362 C63.99975,6448.45255 63.55175,6448.01828 62.99975,6448.01828 L48.20675,6448.01828 C47.76175,6448.01828 47.53875,6447.48019 47.85375,6447.16572 L54.32475,6440.70462 C54.71575,6440.31428 54.71575,6439.68235 54.32475,6439.29201 L54.32475,6439.29201 C53.93475,6438.90266 53.30175,6438.90266 52.91075,6439.29201 L44.58575,6447.60398 C43.80475,6448.38367 43.80475,6449.64753 44.58575,6450.42722 C44.78875,6450.62987 53.04075,6458.86797 52.87975,6458.70724"
              ></path>
            </g>
          </g>
        </svg>
        <span>{{ $t('auth.backToMap') }}</span>
      </a>

      <div class="flex">
        <h1>{{ $t('auth.login') }}</h1>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">{{ $t('auth.email') }}</label>
            <input
              type="email"
              id="email"
              v-model="email"
              :placeholder="$t('auth.email')"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">{{ $t('auth.password') }}</label>
            <input
              type="password"
              id="password"
              v-model="password"
              :placeholder="$t('auth.password')"
              required
              :disabled="loading"
            />
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? 'Connexion en cours...' : $t('auth.login') }}
          </button>

          <RouterLink to="/register" class="register-link">
            {{ $t('auth.noAccount') }}
          </RouterLink>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  width: 100%;
  background-color: #30322e;
  color: white;
  height: 100%;
  min-height: 100vh;
}

.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-container {
  padding: 2rem;
}

.login-container h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 3rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: inline-block;
  margin: 0 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}

input {
  width: 100%;
  padding: 1rem;
  margin-top: 0.25rem;
  border-radius: 1rem;
  border: 0;
  font-size: 1rem;
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-btn,
button {
  width: 100%;
  padding: 0.5rem;
  background-color: #881a16;
  color: white;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

button[type='submit'] {
  padding: 1rem 0;
  font-weight: bold;
  font-size: 1.2rem;
}

.back-btn:hover,
button:hover:not(:disabled) {
  background-color: #58100eff;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.5rem 1.5rem 0.5rem 1rem;
  gap: 1rem;
  margin-bottom: 3rem;
  border-radius: 2rem;
}

.back-btn span {
  margin-top: -0.2rem;
}

.back-btn svg {
  width: 1.2rem;
  height: 1.2rem;
  overflow: visible;
}

.back-btn svg path {
  stroke: white;
  stroke-width: 1.2;
  paint-order: stroke;
}

.register-link {
  margin-top: 0.5rem;
  color: white;
  text-align: center;
  display: block;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.register-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.error-message {
  background-color: #c41e3a;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  width: 100%;
}

@media (max-width: 768px) {
  .login-container h1 {
    font-size: 2rem;
  }

  .login-container {
    margin: 0;
    height: 100%;
    overflow: hidden;
  }

  .form-group label {
    font-size: 1rem;
  }
}
</style>
