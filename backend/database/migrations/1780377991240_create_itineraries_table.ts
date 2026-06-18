import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'itineraries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()

      table
        .string('destination_id', 24)
        .notNullable()
        .references('id')
        .inTable('destinations')
        .onDelete('CASCADE')

      table.string('title').notNullable()

      table.integer('days').notNullable()

      table.integer('nights').notNullable()

      table.text('overview').nullable()

      table.decimal('price', 12, 2).nullable()

      table.json('day_details').nullable()

      table.timestamp('deleted_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
