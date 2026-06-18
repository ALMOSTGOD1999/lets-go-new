/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'destinations.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/destinations',
    tokens: [{"old":"/api/v1/destinations","type":0,"val":"api","end":""},{"old":"/api/v1/destinations","type":0,"val":"v1","end":""},{"old":"/api/v1/destinations","type":0,"val":"destinations","end":""}],
    types: placeholder as Registry['destinations.index']['types'],
  },
  'destinations.store': {
    methods: ["POST"],
    pattern: '/api/v1/destinations',
    tokens: [{"old":"/api/v1/destinations","type":0,"val":"api","end":""},{"old":"/api/v1/destinations","type":0,"val":"v1","end":""},{"old":"/api/v1/destinations","type":0,"val":"destinations","end":""}],
    types: placeholder as Registry['destinations.store']['types'],
  },
  'destinations.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/destinations/:id',
    tokens: [{"old":"/api/v1/destinations/:id","type":0,"val":"api","end":""},{"old":"/api/v1/destinations/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/destinations/:id","type":0,"val":"destinations","end":""},{"old":"/api/v1/destinations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['destinations.show']['types'],
  },
  'destinations.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/destinations/:id',
    tokens: [{"old":"/api/v1/destinations/:id","type":0,"val":"api","end":""},{"old":"/api/v1/destinations/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/destinations/:id","type":0,"val":"destinations","end":""},{"old":"/api/v1/destinations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['destinations.update']['types'],
  },
  'destination.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/destinations',
    tokens: [{"old":"/api/v1/destinations","type":0,"val":"api","end":""},{"old":"/api/v1/destinations","type":0,"val":"v1","end":""},{"old":"/api/v1/destinations","type":0,"val":"destinations","end":""}],
    types: placeholder as Registry['destination.destroy']['types'],
  },
  'itineraries.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/itineraries',
    tokens: [{"old":"/api/v1/itineraries","type":0,"val":"api","end":""},{"old":"/api/v1/itineraries","type":0,"val":"v1","end":""},{"old":"/api/v1/itineraries","type":0,"val":"itineraries","end":""}],
    types: placeholder as Registry['itineraries.index']['types'],
  },
  'itineraries.store': {
    methods: ["POST"],
    pattern: '/api/v1/itineraries',
    tokens: [{"old":"/api/v1/itineraries","type":0,"val":"api","end":""},{"old":"/api/v1/itineraries","type":0,"val":"v1","end":""},{"old":"/api/v1/itineraries","type":0,"val":"itineraries","end":""}],
    types: placeholder as Registry['itineraries.store']['types'],
  },
  'itineraries.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/itineraries/:id',
    tokens: [{"old":"/api/v1/itineraries/:id","type":0,"val":"api","end":""},{"old":"/api/v1/itineraries/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/itineraries/:id","type":0,"val":"itineraries","end":""},{"old":"/api/v1/itineraries/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['itineraries.show']['types'],
  },
  'itineraries.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/itineraries/:id',
    tokens: [{"old":"/api/v1/itineraries/:id","type":0,"val":"api","end":""},{"old":"/api/v1/itineraries/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/itineraries/:id","type":0,"val":"itineraries","end":""},{"old":"/api/v1/itineraries/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['itineraries.update']['types'],
  },
  'itinerary.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/itineraries',
    tokens: [{"old":"/api/v1/itineraries","type":0,"val":"api","end":""},{"old":"/api/v1/itineraries","type":0,"val":"v1","end":""},{"old":"/api/v1/itineraries","type":0,"val":"itineraries","end":""}],
    types: placeholder as Registry['itinerary.destroy']['types'],
  },
  'room_types.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/room-types',
    tokens: [{"old":"/api/v1/room-types","type":0,"val":"api","end":""},{"old":"/api/v1/room-types","type":0,"val":"v1","end":""},{"old":"/api/v1/room-types","type":0,"val":"room-types","end":""}],
    types: placeholder as Registry['room_types.index']['types'],
  },
  'room_types.store': {
    methods: ["POST"],
    pattern: '/api/v1/room-types',
    tokens: [{"old":"/api/v1/room-types","type":0,"val":"api","end":""},{"old":"/api/v1/room-types","type":0,"val":"v1","end":""},{"old":"/api/v1/room-types","type":0,"val":"room-types","end":""}],
    types: placeholder as Registry['room_types.store']['types'],
  },
  'room_types.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/room-types/:id',
    tokens: [{"old":"/api/v1/room-types/:id","type":0,"val":"api","end":""},{"old":"/api/v1/room-types/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/room-types/:id","type":0,"val":"room-types","end":""},{"old":"/api/v1/room-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['room_types.show']['types'],
  },
  'room_types.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/room-types/:id',
    tokens: [{"old":"/api/v1/room-types/:id","type":0,"val":"api","end":""},{"old":"/api/v1/room-types/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/room-types/:id","type":0,"val":"room-types","end":""},{"old":"/api/v1/room-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['room_types.update']['types'],
  },
  'room_type.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/room-types',
    tokens: [{"old":"/api/v1/room-types","type":0,"val":"api","end":""},{"old":"/api/v1/room-types","type":0,"val":"v1","end":""},{"old":"/api/v1/room-types","type":0,"val":"room-types","end":""}],
    types: placeholder as Registry['room_type.destroy']['types'],
  },
  'customers.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customers',
    tokens: [{"old":"/api/v1/customers","type":0,"val":"api","end":""},{"old":"/api/v1/customers","type":0,"val":"v1","end":""},{"old":"/api/v1/customers","type":0,"val":"customers","end":""}],
    types: placeholder as Registry['customers.index']['types'],
  },
  'customers.store': {
    methods: ["POST"],
    pattern: '/api/v1/customers',
    tokens: [{"old":"/api/v1/customers","type":0,"val":"api","end":""},{"old":"/api/v1/customers","type":0,"val":"v1","end":""},{"old":"/api/v1/customers","type":0,"val":"customers","end":""}],
    types: placeholder as Registry['customers.store']['types'],
  },
  'customers.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customers/:id',
    tokens: [{"old":"/api/v1/customers/:id","type":0,"val":"api","end":""},{"old":"/api/v1/customers/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/customers/:id","type":0,"val":"customers","end":""},{"old":"/api/v1/customers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['customers.show']['types'],
  },
  'customers.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/customers/:id',
    tokens: [{"old":"/api/v1/customers/:id","type":0,"val":"api","end":""},{"old":"/api/v1/customers/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/customers/:id","type":0,"val":"customers","end":""},{"old":"/api/v1/customers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['customers.update']['types'],
  },
  'customer.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/customers',
    tokens: [{"old":"/api/v1/customers","type":0,"val":"api","end":""},{"old":"/api/v1/customers","type":0,"val":"v1","end":""},{"old":"/api/v1/customers","type":0,"val":"customers","end":""}],
    types: placeholder as Registry['customer.destroy']['types'],
  },
  'quotations.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/quotations',
    tokens: [{"old":"/api/v1/quotations","type":0,"val":"api","end":""},{"old":"/api/v1/quotations","type":0,"val":"v1","end":""},{"old":"/api/v1/quotations","type":0,"val":"quotations","end":""}],
    types: placeholder as Registry['quotations.index']['types'],
  },
  'quotations.store': {
    methods: ["POST"],
    pattern: '/api/v1/quotations',
    tokens: [{"old":"/api/v1/quotations","type":0,"val":"api","end":""},{"old":"/api/v1/quotations","type":0,"val":"v1","end":""},{"old":"/api/v1/quotations","type":0,"val":"quotations","end":""}],
    types: placeholder as Registry['quotations.store']['types'],
  },
  'quotations.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/quotations/:id',
    tokens: [{"old":"/api/v1/quotations/:id","type":0,"val":"api","end":""},{"old":"/api/v1/quotations/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/quotations/:id","type":0,"val":"quotations","end":""},{"old":"/api/v1/quotations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['quotations.show']['types'],
  },
  'quotations.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/quotations/:id',
    tokens: [{"old":"/api/v1/quotations/:id","type":0,"val":"api","end":""},{"old":"/api/v1/quotations/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/quotations/:id","type":0,"val":"quotations","end":""},{"old":"/api/v1/quotations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['quotations.update']['types'],
  },
  'quotation.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/quotations',
    tokens: [{"old":"/api/v1/quotations","type":0,"val":"api","end":""},{"old":"/api/v1/quotations","type":0,"val":"v1","end":""},{"old":"/api/v1/quotations","type":0,"val":"quotations","end":""}],
    types: placeholder as Registry['quotation.destroy']['types'],
  },
  'quotation_features.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/quotation-features',
    tokens: [{"old":"/api/v1/quotation-features","type":0,"val":"api","end":""},{"old":"/api/v1/quotation-features","type":0,"val":"v1","end":""},{"old":"/api/v1/quotation-features","type":0,"val":"quotation-features","end":""}],
    types: placeholder as Registry['quotation_features.index']['types'],
  },
  'quotation_features.store': {
    methods: ["POST"],
    pattern: '/api/v1/quotation-features',
    tokens: [{"old":"/api/v1/quotation-features","type":0,"val":"api","end":""},{"old":"/api/v1/quotation-features","type":0,"val":"v1","end":""},{"old":"/api/v1/quotation-features","type":0,"val":"quotation-features","end":""}],
    types: placeholder as Registry['quotation_features.store']['types'],
  },
  'quotation_features.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/quotation-features/:id',
    tokens: [{"old":"/api/v1/quotation-features/:id","type":0,"val":"api","end":""},{"old":"/api/v1/quotation-features/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/quotation-features/:id","type":0,"val":"quotation-features","end":""},{"old":"/api/v1/quotation-features/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['quotation_features.show']['types'],
  },
  'quotation_features.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/quotation-features/:id',
    tokens: [{"old":"/api/v1/quotation-features/:id","type":0,"val":"api","end":""},{"old":"/api/v1/quotation-features/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/quotation-features/:id","type":0,"val":"quotation-features","end":""},{"old":"/api/v1/quotation-features/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['quotation_features.update']['types'],
  },
  'quotation_featur.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/quotation-features',
    tokens: [{"old":"/api/v1/quotation-features","type":0,"val":"api","end":""},{"old":"/api/v1/quotation-features","type":0,"val":"v1","end":""},{"old":"/api/v1/quotation-features","type":0,"val":"quotation-features","end":""}],
    types: placeholder as Registry['quotation_featur.destroy']['types'],
  },
  'do_and_donts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/do-and-donts',
    tokens: [{"old":"/api/v1/do-and-donts","type":0,"val":"api","end":""},{"old":"/api/v1/do-and-donts","type":0,"val":"v1","end":""},{"old":"/api/v1/do-and-donts","type":0,"val":"do-and-donts","end":""}],
    types: placeholder as Registry['do_and_donts.index']['types'],
  },
  'do_and_donts.store': {
    methods: ["POST"],
    pattern: '/api/v1/do-and-donts',
    tokens: [{"old":"/api/v1/do-and-donts","type":0,"val":"api","end":""},{"old":"/api/v1/do-and-donts","type":0,"val":"v1","end":""},{"old":"/api/v1/do-and-donts","type":0,"val":"do-and-donts","end":""}],
    types: placeholder as Registry['do_and_donts.store']['types'],
  },
  'do_and_donts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/do-and-donts/:id',
    tokens: [{"old":"/api/v1/do-and-donts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/do-and-donts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/do-and-donts/:id","type":0,"val":"do-and-donts","end":""},{"old":"/api/v1/do-and-donts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['do_and_donts.show']['types'],
  },
  'do_and_donts.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/do-and-donts/:id',
    tokens: [{"old":"/api/v1/do-and-donts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/do-and-donts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/do-and-donts/:id","type":0,"val":"do-and-donts","end":""},{"old":"/api/v1/do-and-donts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['do_and_donts.update']['types'],
  },
  'do_and_donts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/do-and-donts',
    tokens: [{"old":"/api/v1/do-and-donts","type":0,"val":"api","end":""},{"old":"/api/v1/do-and-donts","type":0,"val":"v1","end":""},{"old":"/api/v1/do-and-donts","type":0,"val":"do-and-donts","end":""}],
    types: placeholder as Registry['do_and_donts.destroy']['types'],
  },
  'email_templates.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/email-templates',
    tokens: [{"old":"/api/v1/email-templates","type":0,"val":"api","end":""},{"old":"/api/v1/email-templates","type":0,"val":"v1","end":""},{"old":"/api/v1/email-templates","type":0,"val":"email-templates","end":""}],
    types: placeholder as Registry['email_templates.index']['types'],
  },
  'email_templates.store': {
    methods: ["POST"],
    pattern: '/api/v1/email-templates',
    tokens: [{"old":"/api/v1/email-templates","type":0,"val":"api","end":""},{"old":"/api/v1/email-templates","type":0,"val":"v1","end":""},{"old":"/api/v1/email-templates","type":0,"val":"email-templates","end":""}],
    types: placeholder as Registry['email_templates.store']['types'],
  },
  'email_templates.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/email-templates/:id',
    tokens: [{"old":"/api/v1/email-templates/:id","type":0,"val":"api","end":""},{"old":"/api/v1/email-templates/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/email-templates/:id","type":0,"val":"email-templates","end":""},{"old":"/api/v1/email-templates/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['email_templates.show']['types'],
  },
  'email_templates.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/email-templates/:id',
    tokens: [{"old":"/api/v1/email-templates/:id","type":0,"val":"api","end":""},{"old":"/api/v1/email-templates/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/email-templates/:id","type":0,"val":"email-templates","end":""},{"old":"/api/v1/email-templates/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['email_templates.update']['types'],
  },
  'email_template.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/email-templates',
    tokens: [{"old":"/api/v1/email-templates","type":0,"val":"api","end":""},{"old":"/api/v1/email-templates","type":0,"val":"v1","end":""},{"old":"/api/v1/email-templates","type":0,"val":"email-templates","end":""}],
    types: placeholder as Registry['email_template.destroy']['types'],
  },
  'quotation.generate_pdf': {
    methods: ["POST"],
    pattern: '/api/v1/quotations/:id/pdf',
    tokens: [{"old":"/api/v1/quotations/:id/pdf","type":0,"val":"api","end":""},{"old":"/api/v1/quotations/:id/pdf","type":0,"val":"v1","end":""},{"old":"/api/v1/quotations/:id/pdf","type":0,"val":"quotations","end":""},{"old":"/api/v1/quotations/:id/pdf","type":1,"val":"id","end":""},{"old":"/api/v1/quotations/:id/pdf","type":0,"val":"pdf","end":""}],
    types: placeholder as Registry['quotation.generate_pdf']['types'],
  },
  'quotation.send_email': {
    methods: ["POST"],
    pattern: '/api/v1/quotations/:id/send-email',
    tokens: [{"old":"/api/v1/quotations/:id/send-email","type":0,"val":"api","end":""},{"old":"/api/v1/quotations/:id/send-email","type":0,"val":"v1","end":""},{"old":"/api/v1/quotations/:id/send-email","type":0,"val":"quotations","end":""},{"old":"/api/v1/quotations/:id/send-email","type":1,"val":"id","end":""},{"old":"/api/v1/quotations/:id/send-email","type":0,"val":"send-email","end":""}],
    types: placeholder as Registry['quotation.send_email']['types'],
  },
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
