import * as nsq from 'nsqjs'
import { LOOKUPD_HTTP_ADDRESS, CHANNEL } from '../config'
import { logger } from '../logger'
import { Pkg } from '@streaming/types'

export const reader = new nsq.Reader(Pkg.Topic.STREAMING, CHANNEL, {
  lookupdHTTPAddresses: LOOKUPD_HTTP_ADDRESS,
  maxInFlight: 1000,
  // maxAttempts:1,
  lookupdPollInterval: 10,
})

reader.on('nsqd_connected', () => {
  logger.info(`reader ${CHANNEL} connected  ${LOOKUPD_HTTP_ADDRESS}`)
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
