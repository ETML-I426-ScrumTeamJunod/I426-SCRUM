import { ref } from 'vue'

export interface WishlistSite {
  id: number
  nom: string
  categorie: string
  description: string
  imageUrl: string | null
  pays: string[]
}

const STORAGE_KEY = 'unesco_wishlist'

function loadFromStorage(): WishlistSite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const wishlist = ref<WishlistSite[]>(loadFromStorage())

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist.value))
}

export function useWishlist() {
  function addToWishlist(site: any) {
    if (isInWishlist(site.id)) return
    const item: WishlistSite = {
      id: site.id,
      nom: site.nom ?? site.name ?? site.site ?? '',
      categorie: site.categorie ?? site.category ?? '',
      description: site.description ?? site.short_description ?? '',
      imageUrl: site.imageUrl ?? (site.id ? `/sites/${site.id}/image` : null),
      pays: Array.isArray(site.states)
        ? site.states
        : Array.isArray(site.pays)
          ? site.pays.map((p: any) => p.nom || p)
          : [],
    }
    wishlist.value = [...wishlist.value, item]
    save()
  }

  function removeFromWishlist(siteId: number) {
    wishlist.value = wishlist.value.filter((s) => s.id !== siteId)
    save()
  }

  function isInWishlist(siteId: number): boolean {
    return wishlist.value.some((s) => s.id === siteId)
  }

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist }
}
