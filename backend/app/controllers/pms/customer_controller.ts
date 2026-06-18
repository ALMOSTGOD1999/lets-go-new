import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import { createCustomerValidator, updateCustomerValidator } from '#validators/pms/customer'
import CustomerTransformer from '#transformers/customer_transformer'

export default class CustomersController {
  async index() {
    return await Customer.all()
  }

  async store({ request }: HttpContext) {
    return await Customer.create(request.all())
  }

  async show({ params }: HttpContext) {
    return await Customer.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)

    customer.merge(request.all())

    await customer.save()

    return customer
  }

  async destroy({ params }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)

    await customer.delete()

    return { message: 'Customer deleted' }
  }
}
