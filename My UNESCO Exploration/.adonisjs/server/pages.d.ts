import '@adonisjs/inertia/types'

import type { VNodeProps, AllowedComponentProps, ComponentInstance } from 'vue'

type ExtractProps<T> = Omit<
  ComponentInstance<T>['$props'],
  keyof VNodeProps | keyof AllowedComponentProps
>

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/LoginOrRegister': ExtractProps<(typeof import('../../inertia/pages/auth/LoginOrRegister.vue'))['default']>
    'components/Header': ExtractProps<(typeof import('../../inertia/pages/components/Header.vue'))['default']>
    'components/Stats-card': ExtractProps<(typeof import('../../inertia/pages/components/Stats-card.vue'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.vue'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.vue'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.vue'))['default']>
    'stats': ExtractProps<(typeof import('../../inertia/pages/stats.vue'))['default']>
    'wishlist': ExtractProps<(typeof import('../../inertia/pages/wishlist.vue'))['default']>
  }
}
