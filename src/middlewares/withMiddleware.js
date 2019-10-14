import { withCollection } from './withCollection'

export const withMiddleware = handler => withCollection(handler)
