import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 't_site'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.enum('categorie', ['Natural', 'Cultural', 'Mixed']).notNullable()
      table.double('longitude').notNullable()
      table.double('latitude').notNullable()
      
      table.specificType('image_BLOB', 'LONGBLOB').nullable()
      table.string('image_extension', 10).nullable()

      table
        .integer('region_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('t_region')
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
