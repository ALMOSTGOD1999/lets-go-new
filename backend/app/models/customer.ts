import { CustomerSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import withID from '#mixins/with_id'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { hasMany } from '@adonisjs/lucid/orm'
import Quotation from './quotation.ts'
import type { HasMany } from '@adonisjs/lucid/types/relations'
export default class Customer extends compose(CustomerSchema, withID()) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column()
  declare address: string | null

  @hasMany(() => Quotation)
  declare quotations: HasMany<typeof Quotation>

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime
}
