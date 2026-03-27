import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Site from '#models/site'

export default class User extends compose(
  BaseModel,
  withAuthFinder(hash, {
    uids: ['email'],
    passwordColumnName: 'motDePasse',
  })
) {
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

  get initials() {
    const [first, last] = this.nom ? this.nom.split(' ') : this.email.split('@')

    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }

    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
