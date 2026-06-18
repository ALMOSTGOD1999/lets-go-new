import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'do_and_donts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()

      table
        .string('destination_id', 24)
        .notNullable()
        .references('id')
        .inTable('destinations')
        .onDelete('CASCADE')

      table.string('type').notNullable()

      table.text('content').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
