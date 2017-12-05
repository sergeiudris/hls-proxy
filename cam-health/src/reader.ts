import * as nsq from 'nsqjs'
import { NSQLOOKUPD_HOST, CHANNEL } from './config'
import { logger } from './logger'
import { Pkg } from '@streaming/types'
import { Reader } from 'nsqjs';

export const reader = new nsq.Reader(Pkg.Topic.STREAMING, CHANNEL, {
  lookupdHTTPAddresses: NSQLOOKUPD_HOST,
  maxInFlight: 1000,
  // maxAttempts:1,
  lookupdPollInterval: 10,
})

reader.on(Reader.NSQD_CONNECTED as any, () => {
  logger.info(`reader ${CHANNEL} connected  ${NSQLOOKUPD_HOST}`)
})

reader.on(Reader.NSQD_CLOSED as any, () => {
  logger.info(`reader ${CHANNEL} closed  ${NSQLOOKUPD_HOST}`)
})

reader.on(Reader.ERROR as any, (err) => {
  logger.error(`nsqd reader error ${CHANNEL}, ${NSQLOOKUPD_HOST}`)
  logger.error(err.message)

})


reader.connect()




// setInterval(() => {

//   publish<Evt.FFmpeg.Type.I.ERROR>({
//     data: {
//       type: Evt.FFmpeg.Type.E.ERROR,
//       err: 'manual'
//     },
//     timestamp: Date.now(),
//     topic: 'streaming',
//     channel: 'ffmpeg'
//   })

// }, 5000)
