import Environment from '@rdfjs/environment'
import DatasetFactory from '@rdfjs/environment/DataFactory.js'
import DataFactory from '@rdfjs/environment/DatasetFactory.js'
import FormatsFactory from '@rdfjs/environment/FormatsFactory.js'
import NsBuildersFactory from '@tpluscode/rdf-ns-builders'
// import ClownfaceFactory from 'clownface/Factory.js'

const env = new Environment([
  DataFactory,
  DatasetFactory,
  FormatsFactory,
  NsBuildersFactory,
  // ClownfaceFactory,
])

export default env
