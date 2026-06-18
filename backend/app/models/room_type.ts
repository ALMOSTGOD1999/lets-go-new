import { RoomTypeSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import withID from '#mixins/with_id'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Itinerary from './itinerary.ts'
import Quotation from './quotation.ts'

export default class RoomType extends compose(RoomTypeSchema, withID()) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare itineraryId: string

  @column()
  declare name: string

  @column()
  declare price: number

  @column()
  declare maxPerson: number

  @column()
  declare description: string | null

  @belongsTo(() => Itinerary)
  declare itinerary: BelongsTo<typeof Itinerary>

  @hasMany(() => Quotation)
  declare quotations: HasMany<typeof Quotation>

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime
}
