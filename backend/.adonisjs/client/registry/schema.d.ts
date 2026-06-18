/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'destinations.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/destinations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'destinations.store': {
    methods: ["POST"]
    pattern: '/api/v1/destinations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'destinations.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/destinations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'destinations.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/destinations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'destination.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/destinations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/destination_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/destination_controller').default['destroy']>>>
    }
  }
  'itineraries.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/itineraries'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['index']>>>
    }
  }
  'itineraries.store': {
    methods: ["POST"]
    pattern: '/api/v1/itineraries'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pms/itinerary').createItineraryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pms/itinerary').createItineraryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'itineraries.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/itineraries/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['show']>>>
    }
  }
  'itineraries.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/itineraries/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pms/itinerary').updateItineraryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/pms/itinerary').updateItineraryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'itinerary.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/itineraries'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/itinerary_controller').default['destroy']>>>
    }
  }
  'room_types.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/room-types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['index']>>>
    }
  }
  'room_types.store': {
    methods: ["POST"]
    pattern: '/api/v1/room-types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['store']>>>
    }
  }
  'room_types.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/room-types/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['show']>>>
    }
  }
  'room_types.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/room-types/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['update']>>>
    }
  }
  'room_type.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/room-types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/room_type_controller').default['destroy']>>>
    }
  }
  'customers.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['index']>>>
    }
  }
  'customers.store': {
    methods: ["POST"]
    pattern: '/api/v1/customers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['store']>>>
    }
  }
  'customers.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['show']>>>
    }
  }
  'customers.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/customers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['update']>>>
    }
  }
  'customer.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/customers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/customer_controller').default['destroy']>>>
    }
  }
  'quotations.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/quotations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['index']>>>
    }
  }
  'quotations.store': {
    methods: ["POST"]
    pattern: '/api/v1/quotations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['store']>>>
    }
  }
  'quotations.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/quotations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['show']>>>
    }
  }
  'quotations.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/quotations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['update']>>>
    }
  }
  'quotation.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/quotations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['destroy']>>>
    }
  }
  'quotation_features.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/quotation-features'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['index']>>>
    }
  }
  'quotation_features.store': {
    methods: ["POST"]
    pattern: '/api/v1/quotation-features'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['store']>>>
    }
  }
  'quotation_features.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/quotation-features/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['show']>>>
    }
  }
  'quotation_features.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/quotation-features/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['update']>>>
    }
  }
  'quotation_featur.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/quotation-features'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_featur_controller').default['destroy']>>>
    }
  }
  'do_and_donts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/do-and-donts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['index']>>>
    }
  }
  'do_and_donts.store': {
    methods: ["POST"]
    pattern: '/api/v1/do-and-donts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['store']>>>
    }
  }
  'do_and_donts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/do-and-donts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['show']>>>
    }
  }
  'do_and_donts.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/do-and-donts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['update']>>>
    }
  }
  'do_and_donts.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/do-and-donts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/do_and_donts_controller').default['destroy']>>>
    }
  }
  'email_templates.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/email-templates'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['index']>>>
    }
  }
  'email_templates.store': {
    methods: ["POST"]
    pattern: '/api/v1/email-templates'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['store']>>>
    }
  }
  'email_templates.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/email-templates/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['show']>>>
    }
  }
  'email_templates.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/email-templates/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['update']>>>
    }
  }
  'email_template.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/email-templates'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/email_template_controller').default['destroy']>>>
    }
  }
  'quotation.generate_pdf': {
    methods: ["POST"]
    pattern: '/api/v1/quotations/:id/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['generatePdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['generatePdf']>>>
    }
  }
  'quotation.send_email': {
    methods: ["POST"]
    pattern: '/api/v1/quotations/:id/send-email'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['sendEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pms/quotation_controller').default['sendEmail']>>>
    }
  }
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
}
