import type Itinerary from '#models/itinerary'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ItineraryTransformer extends BaseTransformer<Itinerary> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'destinationId',
      'title',
      'days',
      'nights',
      'overview',
      'price',
      'createdAt',
      'updatedAt',
    ])
  }
}
