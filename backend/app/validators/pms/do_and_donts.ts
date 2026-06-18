import vine from '@vinejs/vine'

export const createDoAndDontValidator = vine.compile(
  vine.object({
    destinationId: vine.string(),
    type: vine.enum(['do', 'dont']),
    content: vine.string(),
  })
)

export const updateDoAndDontValidator = vine.compile(
  vine.object({
    destinationId: vine.string().optional(),
    type: vine.enum(['do', 'dont']).optional(),
    content: vine.string().optional(),
  })
)
