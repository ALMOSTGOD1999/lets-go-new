import type { HttpContext } from '@adonisjs/core/http'
import Destination from '#models/destination'
import { createDestinationValidator, updateDestinationValidator } from '#validators/pms/destination'
import DestinationTransformer from '#transformers/destination_transformer'

export default class DestinationsController {
  async index() {
    return await Destination.all()
  }

  async store({ request }: HttpContext) {
    return await Destination.create(request.only(['name', 'description']))
  }

  async show({ params }: HttpContext) {
    return await Destination.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const destination = await Destination.findOrFail(params.id)

    destination.merge(request.only(['name', 'description']))

    await destination.save()

    return destination
  }

  async destroy({ params }: HttpContext) {
    const destination = await Destination.findOrFail(params.id)

    await destination.delete()

    return { message: 'Destination deleted' }
  }
}
