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

// export function publish<T = any>(data: T) {
//   publishEvent({
//     topic: 'streaming',
//     from: 'spawn-hls',
//     timestamp: Date.now(),
//     data: data
//   })
// }

export function publishStatus(state: FFmpeg.State) {
  const pkg: Pkg<Pkg.FFmpeg> = {
    topic: Pkg.Topic.STREAMING,
    channel: 'spawn-hls',
    type: Pkg.Type.ECHO,
    timestamp: Date.now(),
    dataType: Pkg.DataType.FFMPEG,
    data: {
      type: FFmpeg.Type.STATUS,
      state: state
    }
  }
  writer.publish(pkg.topic, JSON.stringify(pkg))
}
