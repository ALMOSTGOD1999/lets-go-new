import { QuotationFeatureSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import withID from '#mixins/with_id'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Quotation from './quotation.ts'

export default class QuotationFeature extends compose(QuotationFeatureSchema, withID()) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare quotationId: string

  @column()
  declare featureName: string

  @column()
  declare description: string | null

  @belongsTo(() => Quotation)
  declare quotation: BelongsTo<typeof Quotation>

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime
}
