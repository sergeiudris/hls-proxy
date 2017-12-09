
// declare var NSQLOOKUPD_HOSTNAME
// console.log('NSQLOOKUPD_HOSTNAME',NSQLOOKUPD_HOSTNAME)

interface Env {
  NSQLOOKUPD_HOSTNAME: string
  NSQD_HOSTNAME: string
  NSQADMIN_HOSTNAME: string
  NSQLOOKUPD_PORT: number
  NSQD_PORT: number
  PORT: number
  HOSTNAME: string
}

const env: Env & NodeJS.ProcessEnv = process.env as any
export const HOSTNAME = env.HOSTNAME || '127.0.0.1'
export const REGISTRY_HOST = env.REGISTRY_HOST
export const NSQLOOKUPD_HOSTNAME = env.NSQLOOKUPD_HOSTNAME || HOSTNAME
export const NSQD_HOSTNAME = env.NSQD_HOSTNAME || HOSTNAME
export const NSQADMIN_HOSTNAME = env.NSQADMIN_HOSTNAME || HOSTNAME

export const NSQLOOKUPD_PORT = env.NSQLOOKUPD_PORT || 4161
export const NSQD_PORT = env.NSQD_PORT || 4150
export const NSQLOOKUPD_HOST = `${NSQLOOKUPD_HOSTNAME}:${NSQLOOKUPD_PORT}`
export const PORT = env.PORT || 1825
