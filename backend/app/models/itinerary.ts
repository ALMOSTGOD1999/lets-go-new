import { ItinerarySchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import withID from '#mixins/with_id'
import { column } from '@adonisjs/lucid/orm'
import { hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RoomType from './room_type.ts'
import Quotation from './quotation.ts'

export default class Itinerary extends compose(ItinerarySchema, withID()) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare destinationId: string

  @column()
  declare title: string

  @column()
  declare days: number

  @column()
  declare nights: number

  @column()
  declare overview: string | null

  @column()
  declare price: number | null

  @column()
  declare dayDetails: string[] | null

  @hasMany(() => RoomType)
  declare roomTypes: HasMany<typeof RoomType>

  @hasMany(() => Quotation)
  declare quotations: HasMany<typeof Quotation>

  @column.dateTime() // ✅ Add this
  declare deletedAt: DateTime | null

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime
}
