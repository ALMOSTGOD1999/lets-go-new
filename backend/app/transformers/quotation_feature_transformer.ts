import type QuotationFeature from '#models/quotation_feature'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class QuotationFeatureTransformer extends BaseTransformer<QuotationFeature> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'quotationId',
      'featureName',
      'description',
      'createdAt',
      'updatedAt',
    ])
  }
}
