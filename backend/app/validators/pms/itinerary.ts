import vine from '@vinejs/vine'

export const createItineraryValidator = vine.compile(
  vine.object({
    destinationId: vine.string(),
    title: vine.string().trim(),
    days: vine.number(),
    nights: vine.number(),
    overview: vine.string().optional(),
    price: vine.number().optional(),
  })
)

export const updateItineraryValidator = vine.compile(
  vine.object({
    destinationId: vine.string().optional(),
    title: vine.string().trim().optional(),
    days: vine.number().optional(),
    nights: vine.number().optional(),
    overview: vine.string().optional(),
    price: vine.number().optional(),
  })
)
