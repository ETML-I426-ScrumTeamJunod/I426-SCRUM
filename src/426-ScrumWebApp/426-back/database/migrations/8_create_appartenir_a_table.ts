import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 't_appartenir_a'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('site_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('t_site')
        .onDelete('CASCADE')

      table
        .integer('pays_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('t_pays')
        .onDelete('CASCADE')

      table.primary(['site_id', 'pays_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
