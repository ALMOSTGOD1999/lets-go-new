import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()

      table
        .string('itinerary_id', 24)
        .notNullable()
        .references('id')
        .inTable('itineraries')
        .onDelete('CASCADE')

      table.string('name').notNullable()

      table.decimal('price', 12, 2).notNullable()

      table.integer('max_person').defaultTo(2)

      table.text('description').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
