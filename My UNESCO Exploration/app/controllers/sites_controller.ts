import Site from '#models/site'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db' // Make sure to import db

export default class SitesController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const userId = user.id

    // 1. Your original query for the Map markers
    const allSites = await Site.query()
      .preload('traductions', (query) => query.where('code_langue', 'en'))
      .preload('pays')

    // 2. STATS DATA: Count the total number of unesco sites in your DB
    const totalSitesCount = await db.from('t_site').count('* as total')
    const totalOfSites = Number(totalSitesCount[0].total || 0)

    // 3. STATS DATA: Fetch the user's specific interactions from your pivot tables
    const visitedRows = await db.from('t_user_site_deja_visite').where('user_id', userId).select('site_id')
    const wishRows = await db.from('t_user_site_a_visiter').where('user_id', userId).select('site_id')

    const visitedSet = new Set(visitedRows.map(row => row.site_id))
    const wishSet = new Set(wishRows.map(row => row.site_id))

    const markedSites = allSites.map((site) => ({
      id: site.id,
      category: site.category,
      region: site.region,
      visited: visitedSet.has(site.id),
      wishlist: wishSet.has(site.id)
    }))

    return inertia.render('home', {
      sites: allSites.map((s) => ({
        ...s.serialize(),
        nom: s.traductions[0]?.nom ?? null,
        description: s.traductions[0]?.description ?? null,
        states: s.pays.map((p) => p.nom),
        imageUrl: s.imageBlob ? `/sites/${s.id}/image` : null,
      })),
      nom: user.email.split('@')[0],
      totalOfSites: totalOfSites,
      markedSites: markedSites
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
