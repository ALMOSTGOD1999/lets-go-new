import type Quotation from '#models/quotation'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class QuotationTransformer extends BaseTransformer<Quotation> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'customerId',
      'destinationId',
      'itineraryId',
      'roomTypeId',
      'totalPrice',
      'status',
      'pdfPath',
      'notes',
      'createdAt',
      'updatedAt',
    ])
  }
}
