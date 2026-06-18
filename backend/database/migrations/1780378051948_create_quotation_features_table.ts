import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quotation_features'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()

      table
        .string('quotation_id', 24)
        .notNullable()
        .references('id')
        .inTable('quotations')
        .onDelete('CASCADE')

      table.string('feature_name').notNullable()

      table.text('description').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
