import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 't_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.string('nom', 20).notNullable()
      table.string('email', 20).notNullable()
      table.string('mot_de_passe', 64).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
