import type DoAndDont from '#models/do_and_dont'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class DoAndDontTransformer extends BaseTransformer<DoAndDont> {
  toObjcect() {
    return this.pick(this.resource, [
      'id',
      'destinationId',
      'type',
      'content',
      'createdAt',
      'updatedAt',
    ])
  }
}
