import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Region from '#models/region'
import Pays from '#models/pays'

export default class Site extends BaseModel {
  public static table = 't_site'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nom: string

  @column()
  declare categorie: string

  @column()
  declare description: string

  @column()
  declare longitude: number

  @column()
  declare latitude: number

  @column()
  declare lien_image: string

  /* FK vers Region */
  @column({ columnName: 'region_fk' })
  declare regionId: number

  @belongsTo(() => Region, {
    foreignKey: 'regionId',
  })
  declare region: BelongsTo<typeof Region>

  /* Relation many-to-many avec Pays */
  @manyToMany(() => Pays, {
    pivotTable: 't_appartenir_a',
    pivotForeignKey: 'site_fk',
    pivotRelatedForeignKey: 'pays_fk',
  })
  declare pays: ManyToMany<typeof Pays>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
