import type { HttpContext } from '@adonisjs/core/http'
import EmailTemplate from '#models/email_template'
import {
  createEmailTemplateValidator,
  updateEmailTemplateValidator,
} from '#validators/pms/email_template'
import EmailTemplateTransformer from '#transformers/email_template_transformer'

export default class EmailTemplatesController {
  async index() {
    return await EmailTemplate.all()
  }

  async store({ request }: HttpContext) {
    return await EmailTemplate.create(request.all())
  }

  async show({ params }: HttpContext) {
    return await EmailTemplate.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const template = await EmailTemplate.findOrFail(params.id)

    template.merge(request.all())

    await template.save()

    return template
  }

  async destroy({ params }: HttpContext) {
    const template = await EmailTemplate.findOrFail(params.id)

    await template.delete()

    return { message: 'Template deleted' }
  }
}
