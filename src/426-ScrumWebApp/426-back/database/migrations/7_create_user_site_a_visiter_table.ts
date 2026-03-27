import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 't_user_site_a_visiter'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('t_user')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('site_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('t_site')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.primary(['user_id', 'site_id'])

      table.string('couleur', 50).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
