import axios from 'axios'

const token = localStorage.getItem('token')

const apiClient = axios.create({
  baseURL: 'http://localhost:3333/api/sites/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
})

export default {
  // GET /api/sites — all sites with EN traductions + pays
  getSites() {
    return apiClient.get('')
  },

  // GET /api/sites/:id/image — raw image blob
  getImage(id) {
    return apiClient.get(`${id}/image`, { responseType: 'blob' })
  },

  // GET /api/sites/:id/details?lang=en — nom + description
  getDetails(id, lang = 'en') {
    return apiClient.get(`${id}/details`, { params: { lang } })
  },
}
