import type RoomType from '#models/room_type'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class RoomTypeTransformer extends BaseTransformer<RoomType> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'itineraryId',
      'name',
      'price',
      'maxPerson',
      'description',
      'createdAt',
      'updatedAt',
    ])
  }
}
