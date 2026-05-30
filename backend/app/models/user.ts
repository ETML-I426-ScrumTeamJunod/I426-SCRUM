import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Site from '#models/site'
import { DateTime } from 'luxon'

const AuthFinder = withAuthFinder(() => hash, {
  uids: ['email'],
  passwordColumnName: 'motDePasse',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 't_user'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nom: string

  @column()
  declare email: string

  @column({ columnName: 'mot_de_passe', serializeAs: null })
  declare motDePasse: string

  // Relations
  @manyToMany(() => Site, {
    pivotTable: 't_user_site_deja_visite',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'site_id',
  })
  declare visitedSites: ManyToMany<typeof Site>

  @manyToMany(() => Site, {
    pivotTable: 't_user_site_a_visiter',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'site_id',
    pivotColumns: ['couleur'],
  })
  declare wishSites: ManyToMany<typeof Site>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Provider de tokens d'accès
  static accessTokens = DbAccessTokensProvider.forModel(User)
}
