
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
export default class VisitedSitesController {
  async toggle({ auth, params, response }: HttpContext) {
    const authUser = auth.getUserOrFail()
    const siteId = Number(params.id)
    const userId = authUser.id

    const existingRelation = await db
      .from('t_user_site_deja_visite')
      .where('user_id', userId)
      .andWhere('site_id', siteId)
      .first()

    if (existingRelation) {
      await db
        .from('t_user_site_deja_visite')
        .where('user_id', userId)
        .andWhere('site_id', siteId)
        .del()
    } else {
      await db
        .table('t_user_site_deja_visite')
        .insert({
          user_id: userId,
          site_id: siteId,
        })
    }

    return response.redirect().back()
  }
}