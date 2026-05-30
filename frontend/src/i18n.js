import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    header: {
      home: 'Home',
      stats: 'Stats',
      lists: 'Lists',
      searchPlaceholder: 'Search for a site...',
      noResultsFound: 'No results found',
    },
    home: {
      filterByCategory: 'Filter by category:',
      allSites: 'All sites',
      natural: 'Natural',
      cultural: 'Cultural',
      mixed: 'Mixed',
      category: 'Category:',
      country: 'Country:',
      addToWishlist: 'Add to my list',
      removeFromWishlist: 'Remove from my list',
      markAsVisited: 'Mark as visited',
      markAsNotVisited: 'Mark as not visited',
    },
    auth: {
      backToMap: 'Back to Map',
      login: 'Login to your account',
      register: 'Create an account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      submit: 'Submit',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
    },
    stats: {
      title: 'Statistics',
      yourProgress: 'Your Progress',
      totalSites: 'Total Sites',
      visited: 'Visited',
      wishlist: 'Wishlist',
    },
    wishlist: {
      title: 'My Lists',
      empty: 'Your wishlist is empty',
      visited: 'Visited Sites',
      wishlist: 'Wishlist',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      ok: 'OK',
      cancel: 'Cancel',
    },
  },
  fr: {
    header: {
      home: 'Accueil',
      stats: 'Stats',
      lists: 'Listes',
      searchPlaceholder: 'Rechercher un site...',
      noResultsFound: 'Aucun résultat trouvé',
    },
    home: {
      filterByCategory: 'Filtrer par catégorie :',
      allSites: 'Tous les sites',
      natural: 'Naturel',
      cultural: 'Culturel',
      mixed: 'Mixte',
      category: 'Catégorie :',
      country: 'Pays :',
      addToWishlist: 'Ajouter à ma liste',
      removeFromWishlist: 'Supprimer de ma liste',
      markAsVisited: 'Marquer comme visité',
      markAsNotVisited: 'Marquer comme non-visité',
    },
    auth: {
      backToMap: 'Retour à la Carte',
      login: 'Connexion à votre compte',
      register: 'Créer un compte',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      submit: 'Envoyer',
      noAccount: "Pas encore de compte?",
      haveAccount: 'Vous avez déjà un compte?',
    },
    stats: {
      title: 'Statistiques',
      yourProgress: 'Votre Progression',
      totalSites: 'Nombre de sites',
      visited: 'Visités',
      wishlist: 'Liste de souhaits',
    },
    wishlist: {
      title: 'Mes Listes',
      empty: 'Votre liste est vide',
      visited: 'Sites visités',
      wishlist: 'Liste de souhaits',
    },
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      ok: 'OK',
      cancel: 'Annuler',
    },
  },
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'fr',
  globalInjection: true,
  messages,
})

export default i18n

