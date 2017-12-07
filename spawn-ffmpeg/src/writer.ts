import * as nsq from 'nsqjs'
import { logger } from './logger'
import { Evt, FFmpeg, Pkg } from '@streaming/types'

import { NSQD_HOSTNAME, NSQD_PORT, CHANNEL } from './config'

export const writer = new nsq.Writer(NSQD_HOSTNAME, NSQD_PORT)
  .on('ready', () => {
    logger.info(`writer ${CHANNEL} connected ${NSQD_PORT}`)
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