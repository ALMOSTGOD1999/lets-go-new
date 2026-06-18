import type { HttpContext } from '@adonisjs/core/http'
import Quotation from '#models/quotation'
import { createQuotationValidator, updateQuotationValidator } from '#validators/pms/quotation'
import QuotationTransformer from '#transformers/quotation_transformer'

export default class QuotationsController {
  async index() {
    return await Quotation.all()
  }

  async store({ request }: HttpContext) {
    return await Quotation.create(request.all())
  }

  async show({ params }: HttpContext) {
    return await Quotation.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const quotation = await Quotation.findOrFail(params.id)

    quotation.merge(request.all())

    await quotation.save()

    return quotation
  }

  async destroy({ params }: HttpContext) {
    const quotation = await Quotation.findOrFail(params.id)

    await quotation.delete()

    return { message: 'Quotation deleted' }
  }
}
