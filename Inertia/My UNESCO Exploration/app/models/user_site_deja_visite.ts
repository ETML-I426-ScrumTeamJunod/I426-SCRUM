import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserSiteDejaVisite extends BaseModel {
  public static table = 't_user_site_deja_visite'

  @column({ isPrimary: true })
  declare userId: number

  @column({ isPrimary: true })
  declare siteId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
