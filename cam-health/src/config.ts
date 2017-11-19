interface Env {
  NSQLOOKUPD_HOSTNAME: string
  NSQD_HOSTNAME: string
  NSQADMIN_HOSTNAME: string
  NSQLOOKUPD_PORT: number
  NSQD_PORT: number
  NGINX_TS_HOSTNAME: string
  NGINX_TS_PORT: number
  DATA_HOSTNAME: string
  DATA_PORT: number
  PORT: number
  HOSTNAME:string
}

const env: Env & NodeJS.ProcessEnv = process.env as any

export const CHANNEL = 'cam-health'
export const HOSTNAME = env.HOSTNAME || 'localhost'
export const DATA_HOSTNAME = env.DATA_HOSTNAME || 'localhost'
export const DATA_PORT = env.DATA_PORT || 'localhost'


export const NSQLOOKUPD_HOSTNAME = env.NSQLOOKUPD_HOSTNAME || HOSTNAME
export const NSQD_HOSTNAME = env.NSQD_HOSTNAME || HOSTNAME
export const NGINX_TS_HOSTNAME = env.NGINX_TS_HOSTNAME || HOSTNAME
export const NGINX_TS_PORT = env.NGINX_TS_PORT || 1840

export const NSQLOOKUPD_PORT = env.NSQLOOKUPD_PORT || 4161
export const NSQD_PORT = env.NSQD_PORT || 4150
export const NSQLOOKUPD_HOST = `${NSQLOOKUPD_HOSTNAME}:${NSQLOOKUPD_PORT}`
export const PORT = env.PORT || 1808
