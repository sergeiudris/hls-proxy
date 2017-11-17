import * as nsq from 'nsqjs'
import { logger } from '../logger'
import { Evt, FFmpeg, Pkg } from '@streaming/types'

import { LOOKUPD_HTTP_ADDRESS, HOST_NAME, PORT_WRITER, CHANNEL } from '../config'

export const writer = new nsq.Writer(HOST_NAME, PORT_WRITER)
  .on('ready', () => {
    logger.info(`writer ${CHANNEL} connected  ${PORT_WRITER}`)
    // w.publish('sample_topic', 'it really tied the room together')
    // w.publish('sample_topic', 'This message gonna arrive 1 sec later.', 1000 as any)
    // w.publish('sample_topic', [
    //   'Uh, excuse me. Mark it zero. Next frame.',
    //   'Smokey, this is not \'Nam. This is bowling. There are rules.'
    // ])
    // w.publish('sample_topic', 'Wu?', err => {
    //   if (err) { return console.error(err.message) }
    //   console.log('Message sent successfully')
    //   w.close()
    // })
  })
  .on('closed', () => {
    logger.info('Writer closed')
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
    channel: 'camera-health',
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
