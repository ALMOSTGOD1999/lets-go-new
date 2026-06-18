import type Destination from '#models/destination'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class DestinationTransformer extends BaseTransformer<Destination> {
  toObject() {
    return this.pick(this.resource, ['id', 'name', 'description', 'createdAt', 'updatedAt'])
  }
}
