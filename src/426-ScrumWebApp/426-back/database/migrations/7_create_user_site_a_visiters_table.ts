import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_site_a_visiters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('site_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('site')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.string('couleur', 50).nullable()

      table.primary(['user_id', 'site_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
