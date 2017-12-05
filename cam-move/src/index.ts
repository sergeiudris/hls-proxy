import { logger } from './logger'
import * as request from 'request'
import { Cams, FFmpeg, Pkg, ReadyState, Stream } from '@streaming/types'
import { reader } from './reader'
import { HOSTNAME, NGINX_TS_HOSTNAME, NGINX_TS_PORT, DATA_HOSTNAME, DATA_PORT } from './config'
import { CAMERAS } from './state'
import './express-app'
import './writer'
const INTERVAL = 2000



reader
  .on('message', msg => {
    const pkg: Pkg = JSON.parse(msg.body.toString())
    console.log(`pkg: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)

    msg.finish()

  })

