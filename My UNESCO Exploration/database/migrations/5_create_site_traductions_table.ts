import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 't_site_traduction'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('code_langue', 2).nullable()
      table.string('nom', 256).notNullable()
      table.string('description', 4096).notNullable()
      table.string('image_alt', 1024).nullable()

      table
        .integer('site_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('t_site')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
