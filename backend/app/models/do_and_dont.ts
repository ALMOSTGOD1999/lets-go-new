import { DoAndDontSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import withID from '#mixins/with_id'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Destination from '#models/destination'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DoAndDont extends compose(DoAndDontSchema, withID()) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare destinationId: string

  @column()
  declare type: string

  @column()
  declare content: string

  @belongsTo(() => Destination)
  declare destination: BelongsTo<typeof Destination>

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime
}
