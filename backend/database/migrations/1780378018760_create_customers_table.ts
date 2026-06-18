import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()

      table.string('name').notNullable()

      table.string('email').notNullable()

      table.string('phone').nullable()

      table.text('address').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['email'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
