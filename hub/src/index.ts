import { Writer, Reader } from 'nsqjs'
import { logger } from './logger'
import * as WebSocket from 'ws'
import { Cams, FFmpeg, Evt, Pkg } from '@streaming/types'
import { NSQD_PORT, NSQD_HOSTNAME, NSQLOOKUPD_HOST, PORT_WSS } from './config'
import { reader } from './reader'
import { writer } from './writer'


// process.on('uncaughtException', (err) => {
//   logger.error('uncaughtException', '\n', err.stack)
// })

reader.on('message', msg => {
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



export const wss = new WebSocket.Server({
  port: PORT_WSS
} as WebSocket.ServerOptions, () => {
  logger.info(`wssHub started, port ${wss.options.port}`)
});

wss.on('connection', (client: WebSocket) => {
  logger.info(`client connected`)
  client.on('message', data => {
    const pkgString = data.toString()
    const pkg: Pkg = JSON.parse(pkgString)
    logger.info(`publishing: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)
    writer.publish(pkg.topic, pkgString, (err) => {
      if (err) {
        logger.warn(err.message)
      }
    })
  })
  client.on('close', (arg) => {
    logger.info('client disconnected', arg)
  })
});

wss.on('error', (err) => {
  logger.error(err.message)
})

export function broadcast(pkg: Pkg) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(pkg));
    }
  })
}
