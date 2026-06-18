import type { HttpContext } from '@adonisjs/core/http'
import QuotationFeature from '#models/quotation_feature'
import {
  createQuotationFeatureValidator,
  updateQuotationFeatureValidator,
} from '#validators/pms/quotation_feature'
import QuotationFeatureTransformer from '#transformers/quotation_feature_transformer'

export default class QuotationFeaturesController {
  async index() {
    return await QuotationFeature.all()
  }

  async store({ request }: HttpContext) {
    return await QuotationFeature.create(request.all())
  }

  async show({ params }: HttpContext) {
    return await QuotationFeature.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const feature = await QuotationFeature.findOrFail(params.id)

    feature.merge(request.all())

    await feature.save()

    return feature
  }

  async destroy({ params }: HttpContext) {
    const feature = await QuotationFeature.findOrFail(params.id)

    await feature.delete()

    return { message: 'Feature deleted' }
  }
}
