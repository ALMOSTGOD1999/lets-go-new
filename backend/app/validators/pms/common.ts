import vine from '@vinejs/vine'

export const idParamValidator = vine.compile(
  vine.object({
    id: vine.string(),
  })
)
