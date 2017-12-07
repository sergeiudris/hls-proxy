import * as cp from 'child_process'
import * as path from 'path'
import * as WebSocket from 'ws'
import * as stream from 'stream'
import * as events from "events";
import * as os from 'os'
import * as ffmpeg from 'fluent-ffmpeg';
import * as winston from 'winston'
import * as R from 'ramda'
import { Router, Request, Response, NextFunction } from 'express'
import { Evt, FFmpeg, Cams, Pkg, Stream, ReadyState } from '@streaming/types'

import { NGINX_TS_HOSTNAME, NGINX_TS_PORT, HOSTNAME } from './config'
import { reader } from './reader'
import { publishStatus } from './writer'

import { FFMpegStream } from './ffmpeg-stream'
import { app } from './express-app'
import { STREAMS, startStream, stopStream } from './state'

const MAX_STREAM_COUNT = 3

process.on('exit', () => {
  STREAMS.forEach((stream) => {
    stream.cmd.kill('SIGKILL')
  })
})

app.get('/status', (req, res, next) => {
  res.json(STREAMS.map(s => s.state));
})

app.get('/stop-all', (req, res, next) => {
  STREAMS.forEach((stream) => {
    stopStream(stream.state.id)
  })
  res.json(STREAMS.map(s => s.options.id));
})

reader
  .on('message', msg => {
    const pkg: Pkg<Pkg.FFmpeg> = JSON.parse(msg.body.toString())
    // console.log(`pkg: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)
    if (pkg.dataType != Pkg.DataType.FFMPEG) {
      msg.finish()
      return
    }
    if (![Pkg.Type.CMD, Pkg.Type.QRY].includes(pkg.type)) {
      msg.finish()
      return
    }
    if (pkg.data.type == FFmpeg.Type.STATUS) {
      msg.finish()
      return
    }
    onevent(pkg)
    msg.finish()

  })


export function onevent(pkg: Pkg<Pkg.FFmpeg>) {
  console.log(`pkg: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)
  if (pkg.data.type == FFmpeg.Type.START) {
    const state = pkg.data.state
    const id = state.id
    const stream = STREAMS.find(s => s.options.id == id)
    if (stream) {
      publishStatus(stream.state)
      return
    }
    if(STREAMS.length > MAX_STREAM_COUNT){
      const oldestStream = STREAMS[0]
      stopStream(oldestStream.options.id)
    }
    startStream(pkg.data.state.url_src)
  }
  if (pkg.data.type == FFmpeg.Type.STOP) {
    stopStream(pkg.data.state.url_src)
  }

}




