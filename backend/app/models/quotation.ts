import { QuotationSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import withID from '#mixins/with_id'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { column } from '@adonisjs/lucid/orm'
import { belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { hasMany } from '@adonisjs/lucid/orm'
import Customer from './customer.ts'
import Itinerary from './itinerary.ts'
import RoomType from './room_type.ts'
import QuotationFeature from './quotation_feature.ts'
import Destination from './destination.ts'

export default class Quotation extends compose(QuotationSchema, withID()) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare customerId: string

  @column()
  declare destinationId: string

  @column()
  declare itineraryId: string

  @column()
  declare roomTypeId: string

  @column()
  declare totalPrice: number

  @column()
  declare status: string

  @column()
  declare pdfPath: string | null

  @column()
  declare notes: string | null

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => Destination)
  declare destination: BelongsTo<typeof Destination>

  @belongsTo(() => Itinerary)
  declare itinerary: BelongsTo<typeof Itinerary>

  @belongsTo(() => RoomType)
  declare roomType: BelongsTo<typeof RoomType>

  @hasMany(() => QuotationFeature)
  declare features: HasMany<typeof QuotationFeature>

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime
}
