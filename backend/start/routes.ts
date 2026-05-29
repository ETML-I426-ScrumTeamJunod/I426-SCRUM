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
const NewAccountController = () => import('#controllers/new_account_controller')
const SessionController = () => import('#controllers/session_controller')

router
  .group(() => {
    router.get('/sites/', [SitesController, 'index'])
    router.get('/sites/:id/details', [SitesController, 'getDetails'])
    router.get('/sites/:id/image', [SitesController, 'getImage'])

    router.group(() => {
      router.get('signup', [NewAccountController, 'create'])
      router.post('signup', [NewAccountController, 'store'])

      router.get('login', [SessionController, 'create'])
      router.post('login', [SessionController, 'store'])
    })

    router
      .group(() => {
        router.post('logout', [SessionController, 'destroy'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')
