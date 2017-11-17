import { StreamFFmpegNode } from './modules/stream-ffmpeg-node'
import { StreamFluentFFmpeg } from './modules/stream-fluent-ffmpeg'

export type IState = typeof state
export const state = {

  PORT: 3004,
  PORT_TS: 1912,
  MIN_PORT: 1000,
  MAX_PORT: 1500,
  streamsFluentMjpeg: new Map<string, StreamFluentFFmpeg>(),
  STREAMS_HLS: new Map<string, StreamFFmpegNode>(),
  STREAMS_MJPEG_NEW: new Map<string, StreamFFmpegNode>()

}
