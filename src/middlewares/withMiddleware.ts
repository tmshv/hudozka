import { withCollection } from './withCollection'
import { NextApiRequest, NextApiResponse } from 'next'

export type Handler = (req: NextApiRequest, res: NextApiResponse) => void

export const withMiddleware = (handler: Handler) => withCollection(handler)
