import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Site from '#models/site'

export default class Region extends BaseModel {
  public static table = 't_region'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare label: string | null

  @hasMany(() => Site, { foreignKey: 'regionFk' })
  declare sites: HasMany<typeof Site>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
