import type { HttpContext } from '@adonisjs/core/http'
import Itinerary from '#models/itinerary'
import { createItineraryValidator, updateItineraryValidator } from '#validators/pms/itinerary'

export default class ItinerariesController {
  async index() {
    return await Itinerary.all()
  }

  async store({ request }: HttpContext) {
    const data = await request.validateUsing(createItineraryValidator)
    return await Itinerary.create(data)
  }

  async show({ params }: HttpContext) {
    return await Itinerary.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const itinerary = await Itinerary.findOrFail(params.id)
    const data = await request.validateUsing(updateItineraryValidator)

    itinerary.merge(data)
    await itinerary.save()

    return itinerary
  }

  async destroy({ params }: HttpContext) {
    const itinerary = await Itinerary.findOrFail(params.id)
    await itinerary.delete()

    return { message: 'Itinerary deleted' }
  }
}
