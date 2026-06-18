import type { HttpContext } from '@adonisjs/core/http'
import RoomType from '#models/room_type'
import { createRoomTypeValidator, updateRoomTypeValidator } from '#validators/pms/room_type'
import RoomTypeTransformer from '#transformers/room_type_transformer'

export default class RoomTypesController {
  async index() {
    return await RoomType.all()
  }

  async store({ request }: HttpContext) {
    return await RoomType.create(request.all())
  }

  async show({ params }: HttpContext) {
    return await RoomType.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const room = await RoomType.findOrFail(params.id)

    room.merge(request.all())

    await room.save()

    return room
  }

  async destroy({ params }: HttpContext) {
    const room = await RoomType.findOrFail(params.id)

    await room.delete()

    return { message: 'Room type deleted' }
  }
}
