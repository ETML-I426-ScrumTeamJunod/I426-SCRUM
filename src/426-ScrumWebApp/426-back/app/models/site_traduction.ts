import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Site from './site.js'

export default class SiteTraduction extends BaseModel {
  public static table = 't_site_traduction'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'code_langue' })
  declare codeLangue: string | null

  @column()
  declare nom: string

  @column()
  declare description: string

  @column({ columnName: 'image_alt' })
  declare imageAlt: string | null

  @column({ columnName: 'site_id' })
  declare siteId: number

  @belongsTo(() => Site, { foreignKey: 'siteId' })
  declare site: BelongsTo<typeof Site>
}
