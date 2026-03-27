import Site from '#models/site'
import type { HttpContext } from '@adonisjs/core/http'

export default class SitesController {
  /**
   * Display a list of resource
   */
  async index({ auth, inertia }: HttpContext) {
    const allSites = await Site.all()
    const user = auth.user
    return inertia.render('home', {
      sites: allSites.map((s) => s.serialize()),
      nom: user?.nom
    })
  }

  public async getDetails({ params, response, request }: HttpContext) {
    const language = request.input('lang', 'en')
    
    const site = await Site.query()
      .where('id', params.id)
      .preload('traductions', (query) => {
        query.where('code_langue', language)
      })
      .first()

    return {
      nom: site?.traductions[0].nom,
      description: site?.traductions[0].description,
    }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
