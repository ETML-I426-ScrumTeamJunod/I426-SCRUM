import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AppartenirA extends BaseModel {
  public static table = 't_appartenir_a'

  @column({ isPrimary: true })
  declare siteId: number

  @column({ isPrimary: true })
  declare paysId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
