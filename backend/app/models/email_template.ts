import { EmailTemplateSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import withID from '#mixins/with_id'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class EmailTemplate extends compose(EmailTemplateSchema, withID()) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare subject: string

  @column()
  declare body: string

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime
}
