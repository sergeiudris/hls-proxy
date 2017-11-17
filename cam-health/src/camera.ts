
import * as cp from 'child_process'
import * as path from 'path'
import * as stream from 'stream'
import * as events from "events";
import * as os from 'os'
import * as winston from 'winston'
import { Evt, FFmpeg, Cams, Stream, Pkg, ReadyState, Nginx } from '@streaming/types'


interface CameraOptions {
  selfDestruct: (cam: Camera) => any

}

export class Camera extends events.EventEmitter {

  static STATE_CHANGED = 'STATE_CHANGED'

  selfDestructTimeout: number = 10000
  timeoutID: any

  options: CameraOptions = {
    selfDestruct: undefined
  }

  state: Stream.State = {
    id: undefined,
    readyState: ReadyState.UNSET,
    ffmpeg: {
      id: undefined,
      url_src: undefined,
      url_hls: undefined,
      url_mpd: undefined,
      readyState: ReadyState.UNSET,
      msg: undefined,
      error: undefined,
      cmdLine: undefined,
      codecData: undefined
    },
    nginx: {
      id: undefined,
      url_src: undefined,
      url_mpd: undefined,
      url_hls: undefined,
      readyState: ReadyState.UNSET,
      last_status: undefined,
      last_healthcheck: undefined,
      last_healthcheck_str: undefined,
      msg: undefined,
      error: undefined
    }
  }

  constructor(options: CameraOptions) {
    super()
    this.options = options
  }

  touch() {
    clearTimeout(this.timeoutID)
    this.timeoutID = setTimeout(() => {
      this.options.selfDestruct(this)
    }, this.selfDestructTimeout)
  }

  setState(ps: Partial<Stream.State>) {
    Object.assign(this.state, ps)
    this.computeReadyState()
    this.emit(Camera.STATE_CHANGED, this.state)
  }

  setStateQuiet(ps: Partial<Stream.State>){
    Object.assign(this.state, ps)
    this.computeReadyState()
  }

  computeReadyState(){
    if (this.state.ffmpeg.readyState == ReadyState.OPEN && this.state.nginx.readyState == ReadyState.OPEN) {
      this.state.readyState = ReadyState.OPEN
    } else if (this.state.ffmpeg.readyState == ReadyState.OPEN || this.state.ffmpeg.readyState == ReadyState.CONNECTING) {
      this.state.readyState = ReadyState.CONNECTING
    } else if (this.state.ffmpeg.readyState == ReadyState.CLOSED && this.state.nginx.readyState == ReadyState.OPEN) {
      this.state.readyState = ReadyState.CLOSING
    } else if (this.state.ffmpeg.readyState == ReadyState.CLOSING) {
      this.state.readyState = ReadyState.CLOSING
    }
    else {
      this.state.readyState = ReadyState.CLOSED
    }
  }





}
