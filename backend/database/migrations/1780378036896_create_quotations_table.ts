import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quotations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()

      table
        .string('customer_id', 24)
        .notNullable()
        .references('id')
        .inTable('customers')
        .onDelete('CASCADE')

      table
        .string('destination_id', 24)
        .notNullable()
        .references('id')
        .inTable('destinations')
        .onDelete('CASCADE')

      table
        .string('itinerary_id', 24)
        .notNullable()
        .references('id')
        .inTable('itineraries')
        .onDelete('CASCADE')

      table
        .string('room_type_id', 24)
        .notNullable()
        .references('id')
        .inTable('room_types')
        .onDelete('CASCADE')

      table.decimal('total_price', 12, 2).notNullable()

      table.string('status').notNullable().defaultTo('draft')

      table.string('pdf_path').nullable()

      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
