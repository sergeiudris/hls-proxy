import { FFMpegStream } from './ffmpeg-stream'
import { createStreamLogger } from './logger'
import { NGINX_TS_HOSTNAME, NGINX_TS_PORT, HOSTNAME } from './config'
import { publishStatus } from './writer'
import { Evt, FFmpeg, Cams, Pkg, Stream, ReadyState } from '@streaming/types'


export const STREAMS: FFMpegStream[] = []


export function stopStream(id: string) {
  const stream = STREAMS.find(s => s.options.id == id)
  if (stream) {
    stream.cmd.kill('SIGKILL')
    const i = STREAMS.findIndex(s => s.options.id == id)
    STREAMS.splice(i, 1)
  }

}


export function startStream(url: string) {
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
    outputOptions: ["-c:v libx264", "-s 1280x720", "-b:v 2500k", "-f mpegts"]
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

  STREAMS.push(stream)

  stream.cmd.run()

}



function urlPublishTs(url: string) {
  return `http://${NGINX_TS_HOSTNAME}:${NGINX_TS_PORT}/publish/${urlToIdString(url)}`
}

function urlWatchTs(url: string) {
  return `http://${HOSTNAME}:${NGINX_TS_PORT}/play/hls/${urlToIdString(url)}/index.m3u8`
}

export function urlToIdString(url: string) {
  return url.replace(/(\/|\\|:|\.)/g, '_')
}
