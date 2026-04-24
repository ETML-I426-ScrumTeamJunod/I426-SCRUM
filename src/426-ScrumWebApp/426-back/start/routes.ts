/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import SitesController from '#controllers/sites_controller'

router.get('/', [SitesController, 'index']).as('home')

router.get('/sites/:id/details', [SitesController, 'getDetails']).as('details')
router.get('/sites/:id/image', [SitesController, 'getImage']).as('site.image')

router
  .group(() => {
    router.on('/stats').renderInertia('stats', {}).as('stats')
    router.on('/list').renderInertia('list', {}).as('list')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .prefix('/user')
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
