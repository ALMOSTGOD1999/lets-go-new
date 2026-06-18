import vine from '@vinejs/vine'

export const createEmailTemplateValidator = vine.compile(
  vine.object({
    name: vine.string(),
    subject: vine.string(),
    body: vine.string(),
    isActive: vine.boolean().optional(),
  })
)

export const updateEmailTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    subject: vine.string().optional(),
    body: vine.string().optional(),
    isActive: vine.boolean().optional(),
  })
)
