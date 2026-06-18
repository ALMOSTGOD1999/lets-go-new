import { DestinationSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import withID from '#mixins/with_id'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Destination extends compose(DestinationSchema, withID()) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
