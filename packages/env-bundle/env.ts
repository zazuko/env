import { create } from '@zazuko/env'
import FetchFactory from '@rdfjs/fetch-lite/Factory.js'
import formats from '@rdfjs/formats-common'

const env = create(FetchFactory)
env.formats.import(formats)

export default env
