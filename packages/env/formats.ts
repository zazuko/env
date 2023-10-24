export interface RdfFormat {
  'n-triples': 'application/n-triples'
  'json-ld': 'application/ld+json'
  'n-quads': 'application/n-quads'
  'turtle': 'text/turtle'
  'trig': 'application/trig'
  'rdf/xml': 'application/rdf+xml'
}

export type MediaType = RdfFormat[keyof RdfFormat]
