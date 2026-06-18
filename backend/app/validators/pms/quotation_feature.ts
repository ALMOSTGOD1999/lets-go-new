import vine from '@vinejs/vine'

export const createQuotationFeatureValidator = vine.compile(
  vine.object({
    quotationId: vine.string(),
    featureName: vine.string(),
    description: vine.string().optional(),
  })
)

export const updateQuotationFeatureValidator = vine.compile(
  vine.object({
    quotationId: vine.string().optional(),
    featureName: vine.string().optional(),
    description: vine.string().optional(),
  })
)
