// app/controllers/stats_controller.ts
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class StatsController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const userId = user.id

    const totalSitesCount = await db.from('t_site').count('* as total')
    const totalOfSites = Number(totalSitesCount[0].total || 0)
    const allSites = await db
      .from('t_site')
      .join('t_region', 't_site.region_id', '=', 't_region.id')
      .select('t_site.id', 't_site.categorie', 't_region.label as region_name') 

    const visitedRows = await db.from('t_user_site_deja_visite').where('user_id', userId).select('site_id')
    const wishRows = await db.from('t_user_site_a_visiter').where('user_id', userId).select('site_id')

    const visitedSet = new Set(visitedRows.map(row => row.site_id))
    const wishSet = new Set(wishRows.map(row => row.site_id))

    const markedSites = allSites.map((site) => ({
      id: site.id,
      category: site.categorie || 'Unknown', 
      region: site.region_name || 'Unknown',
      visited: visitedSet.has(site.id),
      wishlist: wishSet.has(site.id)
    }))

    return inertia.render('stats', {
      nom: user.email.split('@')[0],
      totalOfSites: totalOfSites,
      markedSites: markedSites
    })
  }
}