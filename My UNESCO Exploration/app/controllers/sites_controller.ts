import Site from '#models/site'
import type { HttpContext } from '@adonisjs/core/http'

export default class SitesController {
  /**
   * Display a list of resource
   */
  async index({ auth, inertia }: HttpContext) {
    const allSites = await Site.query()
      .preload('traductions', (query) => query.where('code_langue', 'en'))
      .preload('pays')

    const user = auth.user
    return inertia.render('home', {
      sites: allSites.map((s) => ({
        ...s.serialize(),
        nom: s.traductions[0]?.nom ?? null,
        description: s.traductions[0]?.description ?? null,
        states: s.pays.map((p) => p.nom),
        imageUrl: s.imageBlob ? `/sites/${s.id}/image` : null,
      })),
      nom: user?.nom,
    })
  }

  public async getImage({ params, response }: HttpContext) {
    const site = await Site.findOrFail(params.id)

    if (!site.imageBlob) {
      return response.notFound()
    }

    response.header('Content-Type', `image/${site.imageExtension || 'jpeg'}`)
    response.send(site.imageBlob)
  }

  public async getDetails({ params, response, request }: HttpContext) {
    const language = request.input('lang', 'en')

    const site = await Site.query()
      .where('id', params.id)
      .preload('traductions', (query) => {
        query.where('code_langue', language)
      })
      .first()

    response.ok({
      nom: site?.traductions[0].nom,
      description: site?.traductions[0].description,
    })
  }
}
