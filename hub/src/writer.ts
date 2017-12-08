import { Writer } from 'nsqjs'
import { logger } from './logger'
import { Evt, FFmpeg, Pkg } from '@streaming/types'

import { NSQD_HOSTNAME, NSQD_PORT, CHANNEL } from './config'

export const writer = new Writer(NSQD_HOSTNAME, NSQD_PORT, {})

writer
  .on(Writer.READY as 'ready', () => {
    logger.info(`writer ${CHANNEL} connected ${NSQD_PORT}`)
  })
  .on(Writer.ERROR as 'error', (err) => {
    logger.error(`writer ${CHANNEL} error: ${err.message}`)
  })
  .on(Writer.CLOSED as 'closed', () => {
    logger.warn('Writer closed')
    logger.info('Writer will reconnect...')
    writer.connect()
  })

writer.connect()
