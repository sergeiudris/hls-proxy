import './hub'
import './http'

import { logger } from './logger'

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', '\n', err.stack)
})




