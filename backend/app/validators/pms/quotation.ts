import vine from '@vinejs/vine'

export const createQuotationValidator = vine.compile(
  vine.object({
    customerId: vine.string(),
    destinationId: vine.string(),
    itineraryId: vine.string(),
    roomTypeId: vine.string(),
    totalPrice: vine.number(),
    status: vine.string().optional(),
    notes: vine.string().optional(),
  })
)

export const updateQuotationValidator = vine.compile(
  vine.object({
    customerId: vine.string().optional(),
    destinationId: vine.string().optional(),
    itineraryId: vine.string().optional(),
    roomTypeId: vine.string().optional(),
    totalPrice: vine.number().optional(),
    status: vine.string().optional(),
    notes: vine.string().optional(),
  })
)
