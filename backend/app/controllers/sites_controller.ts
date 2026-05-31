import Site from '#models/site'
import type { HttpContext } from '@adonisjs/core/http'

export default class SitesController {
  async index({ response }: HttpContext) {
    response.ok(await Site.query().preload('traductions').preload('pays'))
  }

  async getUserLists({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('wishSites', (query) => query.preload('traductions').preload('pays'))
    await user.load('visitedSites', (query) => query.preload('traductions').preload('pays'))
    return response.ok({
      wishlist: user.wishSites.map((s) => s.serialize()),
      visited: user.visitedSites.map((s) => s.serialize()),
    })
  }

  async addToWishlist({ auth, params, response }: HttpContext) {
    const user = auth.user!
    await user.related('wishSites').attach([Number(params.id)])
    return response.ok({ message: 'Added to wishlist' })
  }

  async removeFromWishlist({ auth, params, response }: HttpContext) {
    const user = auth.user!
    await user.related('wishSites').detach([Number(params.id)])
    return response.ok({ message: 'Removed from wishlist' })
  }

  async markAsVisited({ auth, params, response }: HttpContext) {
    const user = auth.user!
    await user.related('visitedSites').attach([Number(params.id)])
    return response.ok({ message: 'Marked as visited' })
  }

  async removeFromVisited({ auth, params, response }: HttpContext) {
    const user = auth.user!
    await user.related('visitedSites').detach([Number(params.id)])
    return response.ok({ message: 'Removed from visited' })
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
