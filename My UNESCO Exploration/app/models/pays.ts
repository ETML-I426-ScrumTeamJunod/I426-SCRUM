import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Site from '#models/site'

export default class Pays extends BaseModel {
  public static table = 't_pays'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nom: string

  @manyToMany(() => Site, {
    pivotTable: 't_appartenir_a',
    localKey: 'id',
    pivotForeignKey: 'pays_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'site_id',
  })
  declare sites: ManyToMany<typeof Site>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
