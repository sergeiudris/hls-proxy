import { Reader } from 'nsqjs'
import { NSQLOOKUPD_HOST, CHANNEL } from './config'
import { logger } from './logger'
import { Pkg } from '@streaming/types'

export const reader = new Reader(Pkg.Topic.STREAMING, CHANNEL, {
  lookupdHTTPAddresses: NSQLOOKUPD_HOST,
  maxInFlight: 1000,
  // maxAttempts:1,
  lookupdPollInterval: 10,
})

reader
  .on(Reader.NSQD_CONNECTED as 'nsqd_connected', () => {
    logger.info(`reader ${CHANNEL} connected  ${NSQLOOKUPD_HOST}`)
  })
  .on(Reader.ERROR as 'error', (err) => {
    logger.error(`reader ${CHANNEL} error:   ${err.message}`)
  })
  .on(Reader.NSQD_CLOSED as 'nsqd_closed', (err) => {
    logger.warn(`reader ${CHANNEL} closed:   ${err}`)
    logger.info(`reader ${CHANNEL} will reconnect...`)
    reader.connect()
  })

reader.connect()
