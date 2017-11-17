import { logger } from './logger'


import './ffmpeg'
import './express'


Object.assign(process.env, {
  NODE_ENV: process.argv['includes']('--release') ? 'production' : 'development',
})



