// import { Data, Evt } from '@streaming/types'

import * as nsq from 'nsqjs'
import { logger } from '../logger'
import { Evt, FFmpeg } from '@streaming/types'

import * as config from '../config'

new nsq.Reader('streaming', 'camera-move', {
  lookupdHTTPAddresses: config.NSQLOOKUPD_HOST,
  maxInFlight: 1000,
  // maxAttempts:1,
  lookupdPollInterval: 5,
})
  .on('message', msg => {
    // if (msg.hasResponded) {
    //   logger.warn('has responedn', JSON.parse(msg.body.toString()))
    //   return
    // }
    const e: Evt = JSON.parse(msg.body.toString())
    logger.error('message [ffmpeg] [%s]: %s', msg.id)

    // logger.info(msg.timeUntilTimeout().toString())
    // if(msg.hasResponded){
    //   msg.requeue(0,false)
    // }
    // if (e.data.type == 'ERROR') {
    //   return
    // }
    msg.finish()
    // msg.finish()

    // const e: Evt.Event = JSON.parse(msg.body.toString())
    // const d = e.data as Evt.FFmpeg.Type.I.Data
    // if (e.channel == 'ffmpeg') {
    //   if (e.data.type == 'START') {
    //     const data = d as Evt.FFmpeg.Type.I.START
    //     logger.info(`starting stream  ${data.url} `)
    //     setTimeout(() => {
    //       publishFFmepg<Evt.FFmpeg.Type.I.STARTED>({
    //         type: Evt.FFmpeg.Type.E.STARTED,
    //         url: data.url
    //       })
    //     }, 1000)
    //     msg.finish()
    //     return

    //   }
    //   if (e.data.type == 'TERMINATE') {
    //     const data = d as Evt.FFmpeg.Type.I.TERMINATE
    //     logger.info(`terminating  ${data.url}`)
    //     setTimeout(() => {
    //       publishFFmepg<Evt.FFmpeg.Type.I.TERMINATED>({
    //         type: Evt.FFmpeg.Type.E.TERMINATED,
    //         url: data.url
    //       })
    //     }, 1000)
    //     msg.finish()
    //     return

    //   }
    // }

  })
  .connect()

const writer = new nsq.Writer(config.NSQD_HOSTNAME, config.NSQD_PORT)
  .on('ready', () => {
    logger.info(`writer ready, connected to ${config.NSQD_PORT}`)
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
    console.log('Writer closed')
  })


writer.connect()

// function publishFFmepg<T = any>(data: T) {
//   logger.warn('publishsing', data)
//   publish({
//     topic: 'streaming',
//     channel: 'ffmpeg',
//     timestamp: Date.now(),
//     data: data
//   })
// }

function publish<T>(evt: Evt<T>) {
  logger.warn('puublishing')
  writer.publish(evt.topic, JSON.stringify(evt))
}


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
