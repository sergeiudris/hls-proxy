export * from './cams'
export * from './evt'
export * from './ready-state'
import { ReadyState } from './ready-state'

export interface Pkg<D = any> {
  timestamp: number;
  channel: string;
  type: Pkg.Type;
  dataType: Pkg.DataType
  topic: Pkg.Topic;
  data: D;
}
export namespace Pkg {
  export enum Topic {
    STREAMING = "STREAMING",
  }
  export enum DataType {
    STREAM = 'STREAM',
    FFMPEG = 'FFMPEG',
    NGINX = 'NGINX'
  }
  export enum Type {
    CMD = "CMD",
    QRY = "QRY",
    ECHO = "ECHO",
  }

  export interface Stream {
    type: Stream.Type
    state: Stream.State
  }
  export interface Nginx {
    type: Nginx.Type
    state: Nginx.State
  }
  export interface FFmpeg {
    type: FFmpeg.Type
    state: FFmpeg.State
  }
}
export namespace Stream {
  export enum Type {
    STATUS = "STATUS",
    START = "START",
    STOP = "STOP",
  }
  export interface State {
    id: string;
    readyState?: ReadyState;
    nginx?: Nginx.State;
    ffmpeg?: FFmpeg.State;
  }
}
export namespace Nginx {
  export enum Type {
    STATUS = "STATUS"
  }
  export interface State {
    id: string;
    readyState: ReadyState;
    url_src: string;
    last_healthcheck: number
    last_healthcheck_str: string
    last_status: number
    url_hls: string;
    url_mpd: string;
    msg: string;
    error: string;
  }
}
export namespace FFmpeg {
  export enum Type {
    STATUS = "STATUS",
    START = "START",
    STOP = "STOP",
  }
  export interface State {
    id: string;
    readyState: ReadyState;
    url_src: string;
    url_hls: string;
    url_mpd: string;
    msg: string;
    error: string;
    cmdLine: string;
    codecData: string
  }
}






// export enum ReadyState {
//   CHILL,
//   ERROR,
//   OPEN,
//   LOADING,
//   RECORDING
// }


// export enum Status {
//   OPEN = 'OPEN',
//   CLOSED = 'CLOSED',
//   CLOSING = 'CLOSING',
//   CONNECTING = 'CONNECTING',
//   ERROR = 'ERROR',
//   UNSET = 'UNSET'

// }


// type ttt = EventDataFFmpeg[EventDataTypeFFmpeg.ERROR]
  // type t = Pick<EventDataFFmpeg, 'ERROR'>
  // type tt = Record<'ERROR', EventDataFFmpeg>
