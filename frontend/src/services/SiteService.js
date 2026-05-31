import axios from 'axios'
import { getToken } from './AuthService'

const apiClient = axios.create({
  baseURL: 'http://localhost:3333/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  getSites() {
    return apiClient.get('sites/')
  },

  getImage(id) {
    return apiClient.get(`sites/${id}/image`, { responseType: 'blob' })
  },

  getDetails(id, lang = 'en') {
    return apiClient.get(`sites/${id}/details`, { params: { lang } })
  },

  getUserLists() {
    return apiClient.get('me/lists')
  },

  addToWishlist(id) {
    return apiClient.post(`sites/${id}/wishlist`)
  },

  removeFromWishlist(id) {
    return apiClient.delete(`sites/${id}/wishlist`)
  },

  markAsVisited(id) {
    return apiClient.post(`sites/${id}/visited`)
  },

  removeFromVisited(id) {
    return apiClient.delete(`sites/${id}/visited`)
  },
}
