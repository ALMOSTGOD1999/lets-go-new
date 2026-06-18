import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'destinations.index': { paramsTuple?: []; params?: {} }
    'destinations.store': { paramsTuple?: []; params?: {} }
    'destinations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'destinations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'destination.destroy': { paramsTuple?: []; params?: {} }
    'itineraries.index': { paramsTuple?: []; params?: {} }
    'itineraries.store': { paramsTuple?: []; params?: {} }
    'itineraries.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'itineraries.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'itinerary.destroy': { paramsTuple?: []; params?: {} }
    'room_types.index': { paramsTuple?: []; params?: {} }
    'room_types.store': { paramsTuple?: []; params?: {} }
    'room_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'room_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'room_type.destroy': { paramsTuple?: []; params?: {} }
    'customers.index': { paramsTuple?: []; params?: {} }
    'customers.store': { paramsTuple?: []; params?: {} }
    'customers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.destroy': { paramsTuple?: []; params?: {} }
    'quotations.index': { paramsTuple?: []; params?: {} }
    'quotations.store': { paramsTuple?: []; params?: {} }
    'quotations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation.destroy': { paramsTuple?: []; params?: {} }
    'quotation_features.index': { paramsTuple?: []; params?: {} }
    'quotation_features.store': { paramsTuple?: []; params?: {} }
    'quotation_features.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation_features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation_featur.destroy': { paramsTuple?: []; params?: {} }
    'do_and_donts.index': { paramsTuple?: []; params?: {} }
    'do_and_donts.store': { paramsTuple?: []; params?: {} }
    'do_and_donts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'do_and_donts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'do_and_donts.destroy': { paramsTuple?: []; params?: {} }
    'email_templates.index': { paramsTuple?: []; params?: {} }
    'email_templates.store': { paramsTuple?: []; params?: {} }
    'email_templates.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'email_templates.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'email_template.destroy': { paramsTuple?: []; params?: {} }
    'quotation.generate_pdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation.send_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'destinations.index': { paramsTuple?: []; params?: {} }
    'destinations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'itineraries.index': { paramsTuple?: []; params?: {} }
    'itineraries.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'room_types.index': { paramsTuple?: []; params?: {} }
    'room_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customers.index': { paramsTuple?: []; params?: {} }
    'customers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotations.index': { paramsTuple?: []; params?: {} }
    'quotations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation_features.index': { paramsTuple?: []; params?: {} }
    'quotation_features.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'do_and_donts.index': { paramsTuple?: []; params?: {} }
    'do_and_donts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'email_templates.index': { paramsTuple?: []; params?: {} }
    'email_templates.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'destinations.index': { paramsTuple?: []; params?: {} }
    'destinations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'itineraries.index': { paramsTuple?: []; params?: {} }
    'itineraries.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'room_types.index': { paramsTuple?: []; params?: {} }
    'room_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customers.index': { paramsTuple?: []; params?: {} }
    'customers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotations.index': { paramsTuple?: []; params?: {} }
    'quotations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation_features.index': { paramsTuple?: []; params?: {} }
    'quotation_features.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'do_and_donts.index': { paramsTuple?: []; params?: {} }
    'do_and_donts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'email_templates.index': { paramsTuple?: []; params?: {} }
    'email_templates.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'destinations.store': { paramsTuple?: []; params?: {} }
    'itineraries.store': { paramsTuple?: []; params?: {} }
    'room_types.store': { paramsTuple?: []; params?: {} }
    'customers.store': { paramsTuple?: []; params?: {} }
    'quotations.store': { paramsTuple?: []; params?: {} }
    'quotation_features.store': { paramsTuple?: []; params?: {} }
    'do_and_donts.store': { paramsTuple?: []; params?: {} }
    'email_templates.store': { paramsTuple?: []; params?: {} }
    'quotation.generate_pdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation.send_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'destinations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'itineraries.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'room_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation_features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'do_and_donts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'email_templates.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'destinations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'itineraries.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'room_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quotation_features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'do_and_donts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'email_templates.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'destination.destroy': { paramsTuple?: []; params?: {} }
    'itinerary.destroy': { paramsTuple?: []; params?: {} }
    'room_type.destroy': { paramsTuple?: []; params?: {} }
    'customer.destroy': { paramsTuple?: []; params?: {} }
    'quotation.destroy': { paramsTuple?: []; params?: {} }
    'quotation_featur.destroy': { paramsTuple?: []; params?: {} }
    'do_and_donts.destroy': { paramsTuple?: []; params?: {} }
    'email_template.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}