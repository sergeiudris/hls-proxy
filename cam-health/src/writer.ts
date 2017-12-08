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


export function publishStream(data: Pkg.Stream, type: Pkg.Type = Pkg.Type.ECHO) {
  const pkg: Pkg<Pkg.Stream> = {
    topic: Pkg.Topic.STREAMING,
    channel: CHANNEL,
    timestamp: Date.now(),
    type: type,
    dataType: Pkg.DataType.STREAM,
    data: data
  }
  writer.publish(pkg.topic, JSON.stringify(pkg))
}

export function publishFFmpeg(data: Pkg.FFmpeg, type: Pkg.Type = Pkg.Type.CMD) {
  const pkg: Pkg<Pkg.FFmpeg> = {
    topic: Pkg.Topic.STREAMING,
    channel: CHANNEL,
    timestamp: Date.now(),
    type: type,
    dataType: Pkg.DataType.FFMPEG,
    data: data
  }

  writer.publish(pkg.topic, JSON.stringify(pkg))
}

// export function publishEvent<T>(evt: Evt<T>) {
//   writer.publish(evt.topic, JSON.stringify(evt))
// }
