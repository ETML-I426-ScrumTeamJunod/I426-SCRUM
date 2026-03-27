import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Region from '#models/region'
import Pays from '#models/pays'
import User from '#models/user'
import SiteTraduction from '#models/site_traduction'

export enum SiteCategorie {
  Natural = 'Natural',
  Cultural = 'Cultural',
  Mixed = 'Mixed',
}

export default class Site extends BaseModel {
  public static table = 't_site'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categorie: SiteCategorie

  @column()
  declare longitude: number

  @column()
  declare latitude: number

  @column({ columnName: 'lien_image' })
  declare lienImage: string | null

  @column()
  declare regionId: number

  @belongsTo(() => Region, { foreignKey: 'regionId' })
  declare region: BelongsTo<typeof Region>

  @hasMany(() => SiteTraduction, { foreignKey: 'siteId' })
  declare traductions: HasMany<typeof SiteTraduction>

  @manyToMany(() => User, {
    pivotTable: 't_user_site_deja_visite',
    localKey: 'id',
    pivotForeignKey: 'site_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare usersVisited: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 't_user_site_a_visiter',
    localKey: 'id',
    pivotForeignKey: 'site_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['couleur'],
  })
  declare usersWishlist: ManyToMany<typeof User>

  @manyToMany(() => Pays, {
    pivotTable: 't_appartenir_a',
    localKey: 'id',
    pivotForeignKey: 'site_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'pays_id',
  })
  declare pays: ManyToMany<typeof Pays>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
