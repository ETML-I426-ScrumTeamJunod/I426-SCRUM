/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const SitesController = () => import('#controllers/sites_controller')
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.get('/sites/', [SitesController, 'index'])
    router.get('/sites/:id/details', [SitesController, 'getDetails'])
    router.get('/sites/:id/image', [SitesController, 'getImage'])

    // Routes d'authentification (publiques)
    router.group(() => {
      router.post('register', [AuthController, 'register'])
      router.post('login', [AuthController, 'login'])
    })

    // Routes protégées (nécessitent d'être connecté)
    router
      .group(() => {
        router.post('logout', [AuthController, 'logout'])
        router.get('me', [AuthController, 'me'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')
