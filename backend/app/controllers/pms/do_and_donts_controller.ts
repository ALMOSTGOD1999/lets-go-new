import type { HttpContext } from '@adonisjs/core/http'
import DoAndDont from '#models/do_and_dont'
import { createDoAndDontValidator, updateDoAndDontValidator } from '#validators/pms/do_and_donts'
import DoAndDontTransformer from '#transformers/do_and_donts_transformer'

export default class DoAndDontsController {
  async index() {
    return await DoAndDont.all()
  }

  async store({ request }: HttpContext) {
    return await DoAndDont.create(request.all())
  }

  async show({ params }: HttpContext) {
    return await DoAndDont.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const item = await DoAndDont.findOrFail(params.id)

    item.merge(request.all())

    await item.save()

    return item
  }

  async destroy({ params }: HttpContext) {
    const item = await DoAndDont.findOrFail(params.id)

    await item.delete()

    return { message: 'Record deleted' }
  }
}
