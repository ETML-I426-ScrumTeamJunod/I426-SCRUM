const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

function saveSession(token, user) {
  localStorage.setItem('token', token.value ?? token.token ?? token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem('token')
}

export function getUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function isAuthenticated() {
  return !!getToken()
}

export async function register({ nom, email, motDePasse }) {
  const response = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, email, motDePasse }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractError(data))
  }

  saveSession(data.token, data.user)
  return data
}

export async function login({ email, motDePasse }) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractError(data))
  }

  saveSession(data.token, data.user)
  return data
}

export async function logout() {
  const token = getToken()

  try {
    await fetch(`${API_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

function extractError(data) {
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join(', ')
  }
  return data?.message || 'Une erreur est survenue'
}
