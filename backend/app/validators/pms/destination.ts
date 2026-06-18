import vine from '@vinejs/vine'

export const createDestinationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    description: vine.string().optional(),
  })
)

export const updateDestinationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    description: vine.string().optional(),
  })
)
