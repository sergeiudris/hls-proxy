import { StreamFFmpegNode } from './modules/stream-ffmpeg-node'
import { StreamFluentFFmpeg } from './modules/stream-fluent-ffmpeg'


// declare var NSQLOOKUPD_HOSTNAME
// console.log('NSQLOOKUPD_HOSTNAME',NSQLOOKUPD_HOSTNAME)

interface Env {
  NSQLOOKUPD_HOSTNAME: string
  NSQD_HOSTNAME: string
  NSQADMIN_HOSTNAME: string
  NSQLOOKUPD_PORT: number
  NSQD_PORT: number
  PORT: number,
  PORT_MIN: number
  PORT_MAX: number
}

export const HOSTNAME = '127.0.0.1'
const env: Env & NodeJS.ProcessEnv = process.env as any

export const NSQLOOKUPD_HOSTNAME = env.NSQLOOKUPD_HOSTNAME || HOSTNAME
export const NSQD_HOSTNAME = env.NSQD_HOSTNAME || HOSTNAME
export const NSQADMIN_HOSTNAME = env.NSQADMIN_HOSTNAME || HOSTNAME

export const NSQLOOKUPD_PORT = env.NSQLOOKUPD_PORT || 4161
export const NSQD_PORT = env.NSQD_PORT || 4150
export const NSQLOOKUPD_HOST = `${NSQLOOKUPD_HOSTNAME}:${NSQLOOKUPD_PORT}`
export const PORT = env.PORT || 3004
export const PORT_MIN = env.PORT_MIN || 1101
export const PORT_MAX = env.PORT_MAX || 1400


