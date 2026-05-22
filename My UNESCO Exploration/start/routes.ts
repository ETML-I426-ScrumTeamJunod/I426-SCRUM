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
import VisitedSitesController from '#controllers/visited_sites_controller'
import StatsController from '#controllers/stats_controller'
router.get('/', [SitesController, 'index']).as('home')

router.get('/sites/:id/details', [SitesController, 'getDetails']).as('details')
router.get('/sites/:id/image', [SitesController, 'getImage']).as('site.image')

router
  .group(() => {
    router.get('/stats', [StatsController, 'index']).as('stats')
    router.on('/wishlist').renderInertia('wishlist', {}).as('wishlist')
    router.post('/api/sites/:id/toggle-visited', [VisitedSitesController, 'toggle'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
