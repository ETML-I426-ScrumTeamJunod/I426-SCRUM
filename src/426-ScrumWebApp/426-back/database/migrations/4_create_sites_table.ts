import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.enum('categorie', ['Natural', 'Cultural', 'Mixed']).notNullable()
      table.double('longitude').notNullable()
      table.double('latitude').notNullable()
      table.string('lien_image', 128).nullable()

      table
        .integer('region_fk')
        .unsigned()
        .notNullable()
        .references('region_id')
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
