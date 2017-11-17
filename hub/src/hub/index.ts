import { Writer, Reader } from 'nsqjs'
import { logger } from '../logger'
import * as WebSocket from 'ws'
import { Cams, FFmpeg, Evt, Pkg } from '@streaming/types'
import { PORT_WRTIER, PORT_READER, PORT_WS } from '../config'




export const WRITER = new Writer('127.0.0.1', PORT_WRTIER)
WRITER.on('ready', () => {
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

WRITER.on('closed', () => {
  console.log('Writer closed')
})

WRITER.on('ready', () => {
  logger.info(`writer ready, connected to ${PORT_WRTIER}`)
})

WRITER.on('error', (err) => {
  logger.info(`writer error`, err.message)
})

WRITER.connect()





export const READER = new Reader(Pkg.Topic.STREAMING, 'hub', {
  lookupdHTTPAddresses: `127.0.0.1:${PORT_READER}`,
  maxInFlight: 1000,
})

READER.on('message', msg => {
  // logger.warn('before broadcast', JSON.parse(msg.body.toString()))
  // if(msg.hasResponded){
  //   logger.warn('has responded', JSON.parse(msg.body.toString()))
  //   return
  // }
  const pkg: Pkg = JSON.parse(msg.body.toString())
  logger.info(`pkg: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)
  if (pkg.type == Pkg.Type.ECHO) {
    logger.info(`bradcasting: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)
    broadcast(pkg)
  }

  msg.finish()

  // msg.finish()
  // if(!msg.hasResponded){

  // }
  // msg.requeue(0,false)

})

READER.on('nsqd_connected', () => {
  logger.info(`nsqd_connected, ${PORT_READER}`)
})

READER.connect()





export const WSS = new WebSocket.Server({
  port: PORT_WS
} as WebSocket.ServerOptions, () => {
  logger.info(`wssHub started, port ${WSS.options.port}`)
});

WSS.on('connection', (client: WebSocket) => {
  logger.info(`client connected`)
  client.on('message', data => {
    const pkgString = data.toString()
    const pkg: Pkg = JSON.parse(pkgString)
    logger.info(`publishing: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)
    WRITER.publish(pkg.topic, pkgString, (err) => {
      if (err) {
        logger.warn(err.message)
      }
    })
  })
  client.on('close', (arg) => {
    logger.info('client disconnected', arg)
  })
});

WSS.on('error', (err) => {
  logger.error(err.message)
})

export function broadcast(pkg: Pkg) {
  WSS.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(pkg));
    }
  })
}
