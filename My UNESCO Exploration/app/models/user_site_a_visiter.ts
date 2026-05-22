import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserSiteAVisiter extends BaseModel {
  public static table = 't_user_site_a_visiter'

  @column({ isPrimary: true })
  declare userId: number

  @column({ isPrimary: true })
  declare siteId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
