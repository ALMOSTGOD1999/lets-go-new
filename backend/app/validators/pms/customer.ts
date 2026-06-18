import vine from '@vinejs/vine'

export const createCustomerValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
    phone: vine.string().optional(),
    address: vine.string().optional(),
  })
)

export const updateCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    email: vine.string().email().optional(),
    phone: vine.string().optional(),
    address: vine.string().optional(),
  })
)
