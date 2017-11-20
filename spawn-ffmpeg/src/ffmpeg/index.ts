import * as cp from 'child_process'
import * as path from 'path'
import * as WebSocket from 'ws'
import * as stream from 'stream'
import * as events from "events";
import * as os from 'os'
import * as ffmpeg from 'fluent-ffmpeg';
import * as winston from 'winston'
import * as R from 'ramda'

import { Evt, FFmpeg, Cams, Pkg, Stream, ReadyState } from '@streaming/types'
import { publishStatus, reader } from '../nsq'
import { createStreamLogger } from '../logger'
import { NGINX_TS_HOSTNAME, NGINX_TS_PORT, HOSTNAME } from '../config'
import { urlToIdString } from '../url-to-id'
import { Router, Request, Response, NextFunction } from 'express'

import { FFMpegStream } from './ffmpeg-stream'

import { app } from '../express'

const STREAMS = new Map<string, FFMpegStream>()

process.on('exit', () => {
  STREAMS.forEach((stream) => {
    stream.cmd.kill('SIGKILL')
  })
})

app.get('/status', (req, res, next) => {
  res.json(Array.from(STREAMS.keys()));
})

reader
  .on('message', msg => {
    const pkg: Pkg<Pkg.FFmpeg> = JSON.parse(msg.body.toString())
    console.log(`pkg: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)
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

  if (pkg.data.type == FFmpeg.Type.START) {
    const state = pkg.data.state
    const id = state.id
    const stream = STREAMS.get(id)

    if (stream) {
      publishStatus(stream.state)
      return
    }
    startStream(pkg.data.state.url_src)
  }
  if (pkg.data.type == FFmpeg.Type.STOP) {
    stopStream(pkg.data.state.url_src)
  }

}

function startStream(url: string) {
  const logger = createStreamLogger(url)

  // const optionsHttp = ['-re', '-y', '-use_wallclock_as_timestamps 1', `-i ${url}`, '-c:v libx264', '-f mpegts', `${urlPublishTs(url)}`]
  const optionsHttp = {
    input: url,
    output: urlPublishTs(url),
    inputOptions: ['-re', '-y', '-use_wallclock_as_timestamps 1'],
    outputOptions: ['-c libx264', '-f mpegts',]
  }
  // const optionsRtsp = ['-y', '-rtsp_transport tcp', '-i  rtsp://host:554/57', '-c:v libx264', '-s 1280x720', '-b:v 600k', '-f mpegts', `${urlPublishTs(url)}`]
  const optionsRtsp = {
    input: url,
    output: urlPublishTs(url),
    inputOptions: ['-y', '-rtsp_transport tcp'],
    outputOptions: ["-c:v libx264", "-s 1280x720", /* "-b:v 800k",  */"-f mpegts"]
  }
  const options = url.startsWith('rtsp') ? optionsRtsp : optionsHttp

  const stream = new FFMpegStream({
    id: url,
    url_src: url,
    url_play_hls: urlWatchTs(url),
    url_publish_hls: urlPublishTs(url),
    logger: logger,
    cmdOptions: options
  })
    .cmdMount()
    .on(FFMpegStream.STATE_CHANGED, (state: FFmpeg.State) => {
      publishStatus(state)
    })

  stream
    .cmd
    .on('error', () => {
      stopStream(stream.options.id)
    })
    .on('end', () => {
      stopStream(stream.options.id)
    })

  STREAMS.set(stream.options.id, stream)

  stream.cmd.run()

}

function stopStream(id: string) {
  const stream = STREAMS.get(id)
  if (stream) {
    stream.cmd.kill('SIGKILL')
  }
  STREAMS.delete(id)
}

function urlPublishTs(url: string) {
  return `http://${NGINX_TS_HOSTNAME}:${NGINX_TS_PORT}/publish/${urlToIdString(url)}`
}

function urlWatchTs(url: string) {
  return `http://${HOSTNAME}:${NGINX_TS_PORT}/play/hls/${urlToIdString(url)}/index.m3u8`
}
