import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    // Destinations
    router
      .resource('destinations', '#controllers/destination_controller')
      .apiOnly()
      .only(['index', 'store', 'show', 'update'])

    router.delete('destinations', [controllers.pms.Destination, 'destroy'])

    // Itineraries
    router
      .resource('itineraries', controllers.pms.Itinerary)
      .apiOnly()
      .only(['index', 'store', 'show', 'update'])

    router.delete('itineraries', [controllers.pms.Itinerary, 'destroy'])

    // Room Types
    router
      .resource('room-types', controllers.pms.RoomType)
      .apiOnly()
      .only(['index', 'store', 'show', 'update'])

    router.delete('room-types', [controllers.pms.RoomType, 'destroy'])

    // Customers
    router
      .resource('customers', controllers.pms.Customer)
      .apiOnly()
      .only(['index', 'store', 'show', 'update'])

    router.delete('customers', [controllers.pms.Customer, 'destroy'])

    // Quotations
    router
      .resource('quotations', controllers.pms.Quotation)
      .apiOnly()
      .only(['index', 'store', 'show', 'update'])

    router.delete('quotations', [controllers.pms.Quotation, 'destroy'])

    // Quotation Features
    router
      .resource('quotation-features', controllers.pms.QuotationFeatur)
      .apiOnly()
      .only(['index', 'store', 'show', 'update'])

    router.delete('quotation-features', [controllers.pms.QuotationFeatur, 'destroy'])

    // Do & Don'ts
    router
      .resource('do-and-donts', controllers.pms.DoAndDonts)
      .apiOnly()
      .only(['index', 'store', 'show', 'update'])

    router.delete('do-and-donts', [controllers.pms.DoAndDonts, 'destroy'])

    // Email Templates
    router
      .resource('email-templates', controllers.pms.EmailTemplate)
      .apiOnly()
      .only(['index', 'store', 'show', 'update'])

    router.delete('email-templates', [controllers.pms.EmailTemplate, 'destroy'])

    // PDF & Email
    router.post('quotations/:id/pdf', [controllers.pms.Quotation, 'generatePdf'])

    router.post('quotations/:id/send-email', [controllers.pms.Quotation, 'sendEmail'])
  })
  .prefix('/api/v1')
  .use(middleware.auth())
