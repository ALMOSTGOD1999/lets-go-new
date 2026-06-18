import vine from '@vinejs/vine'

export const createRoomTypeValidator = vine.compile(
  vine.object({
    itineraryId: vine.string(),
    name: vine.string(),
    price: vine.number(),
    maxPerson: vine.number(),
    description: vine.string().optional(),
  })
)

export const updateRoomTypeValidator = vine.compile(
  vine.object({
    itineraryId: vine.string().optional(),
    name: vine.string().optional(),
    price: vine.number().optional(),
    maxPerson: vine.number().optional(),
    description: vine.string().optional(),
  })
)
