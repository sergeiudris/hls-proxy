import * as cp from 'child_process'
import * as path from 'path'
import * as WebSocket from 'ws'
import * as stream from 'stream'
import * as events from "events";
import * as os from 'os'
import * as ffmpeg from 'fluent-ffmpeg';
import * as winston from 'winston'
import * as R from 'ramda'

import { Evt, FFmpeg, Cams, Stream, Pkg, ReadyState } from '@streaming/types'

export interface FFMpegStreamOptions {
  id: string
  url_src: string
  timeoutSelfDestruct?: number
  logger: winston.LoggerInstance
  // type: Cams.CamType
  url_play_hls: string
  url_publish_hls: string
  cmdOptions: {
    input: string
    output: string
    inputOptions: string[]
    outputOptions: string[]
  }
}


export class FFMpegStream extends events.EventEmitter {

  static STATE_CHANGED = 'STATE_CHANGED'

  options: FFMpegStreamOptions = {
    id: undefined,
    url_src: undefined,
    url_play_hls: undefined,
    url_publish_hls: undefined,
    logger: undefined,
    timeoutSelfDestruct: 10000,
    cmdOptions: undefined,
    // type: undefined
  }
  state: FFmpeg.State
  timeoutID: any = undefined
  cmd: ffmpeg.FfmpegCommand

  constructor(options: FFMpegStreamOptions) {
    super()
    Object.assign(this.options, options)

    this.state = {
      id: options.id,
      readyState: ReadyState.CLOSED,
      url_src: options.url_src,
      url_hls: options.url_play_hls,
      url_mpd: undefined,
      msg: 'INITIAL',
      error: undefined,
      cmdLine: undefined,
      codecData: undefined
    }

    return this
  }

  setState(ps: Partial<FFmpeg.State>) {
    Object.assign(this.state, ps)
    this.emit(FFMpegStream.STATE_CHANGED, this.state)
  }

  log(msg: string, logger: any) {
    logger(`${this.options.id}: ${msg}`)
  }

  cmdMount() {
    const { cmdOptions } = this.options
    const logger = this.options.logger

    const onceOnFrame = (stderrLine: string) => {
      if (stderrLine.includes('frame=')) {
        clearTimeout(this.timeoutID)
        this.setState({
          readyState: ReadyState.OPEN,
        })
        this.cmd.removeListener('stderr', onceOnFrame)
      }
    }

    this.cmd = ffmpeg()
      // .withOptions(options)
      .input(cmdOptions.input)
      .inputOption(cmdOptions.inputOptions)
      .outputOptions(cmdOptions.outputOptions)
      .output(cmdOptions.output)
      .on('start', (cmdLine) => {
        this.timeoutID = setTimeout(this.selfDestruct, this.options.timeoutSelfDestruct)
        const msg = `spawned ffmpeg w/ commandline: ${cmdLine} `
        this.setState({
          readyState: ReadyState.CONNECTING,
          msg: msg,
          cmdLine: cmdLine,
        })
        this.log(msg, logger.info)
      })
      .on('stderr', onceOnFrame)
      .on('codecData', (data) => {
        const msg = `video: ${data.video} ; audio: ${data.audio}`
        this.setState({
          codecData: msg
        })
        this.log(msg, logger.info)

      })
      .on('error', (err) => {
        clearTimeout(this.timeoutID)
        const msg = `ffmpeg error - ${err.message}`
        this.setState({
          msg: msg,
          error: err.message,
          readyState: ReadyState.CLOSED
        })
        this.log(msg, logger.error)
      })
      .on('end', () => {
        const errMsg = `ffmpeg transcoding succeeded, shutting stream down`
        this.setState({
          readyState: ReadyState.CLOSED,
          error: errMsg,
          msg: errMsg
        })
        this.log(errMsg, logger.error)
      })
    return this
  }

  selfDestruct = () => {
    const { id, timeoutSelfDestruct } = this.options
    const errmsg = `stream ${id}: no data received for ${timeoutSelfDestruct}`
    this.log(errmsg, this.options.logger.info)
    this.cmd.emit('error', new Error(errmsg))
  }

}
