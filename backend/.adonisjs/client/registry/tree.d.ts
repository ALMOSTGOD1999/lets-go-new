/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  destinations: {
    index: typeof routes['destinations.index']
    store: typeof routes['destinations.store']
    show: typeof routes['destinations.show']
    update: typeof routes['destinations.update']
  }
  destination: {
    destroy: typeof routes['destination.destroy']
  }
  itineraries: {
    index: typeof routes['itineraries.index']
    store: typeof routes['itineraries.store']
    show: typeof routes['itineraries.show']
    update: typeof routes['itineraries.update']
  }
  itinerary: {
    destroy: typeof routes['itinerary.destroy']
  }
  roomTypes: {
    index: typeof routes['room_types.index']
    store: typeof routes['room_types.store']
    show: typeof routes['room_types.show']
    update: typeof routes['room_types.update']
  }
  roomType: {
    destroy: typeof routes['room_type.destroy']
  }
  customers: {
    index: typeof routes['customers.index']
    store: typeof routes['customers.store']
    show: typeof routes['customers.show']
    update: typeof routes['customers.update']
  }
  customer: {
    destroy: typeof routes['customer.destroy']
  }
  quotations: {
    index: typeof routes['quotations.index']
    store: typeof routes['quotations.store']
    show: typeof routes['quotations.show']
    update: typeof routes['quotations.update']
  }
  quotation: {
    destroy: typeof routes['quotation.destroy']
    generatePdf: typeof routes['quotation.generate_pdf']
    sendEmail: typeof routes['quotation.send_email']
  }
  quotationFeatures: {
    index: typeof routes['quotation_features.index']
    store: typeof routes['quotation_features.store']
    show: typeof routes['quotation_features.show']
    update: typeof routes['quotation_features.update']
  }
  quotationFeatur: {
    destroy: typeof routes['quotation_featur.destroy']
  }
  doAndDonts: {
    index: typeof routes['do_and_donts.index']
    store: typeof routes['do_and_donts.store']
    show: typeof routes['do_and_donts.show']
    update: typeof routes['do_and_donts.update']
    destroy: typeof routes['do_and_donts.destroy']
  }
  emailTemplates: {
    index: typeof routes['email_templates.index']
    store: typeof routes['email_templates.store']
    show: typeof routes['email_templates.show']
    update: typeof routes['email_templates.update']
  }
  emailTemplate: {
    destroy: typeof routes['email_template.destroy']
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
}
