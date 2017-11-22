import { logger } from './logger'
import * as request from 'request'
import { Cams, FFmpeg, Pkg, ReadyState, Stream } from '@streaming/types'
import fetch from 'node-fetch'
import { publishFFmpeg, publishStream, reader } from './nsq'
import { Camera } from './camera'
import { HOSTNAME, NGINX_TS_HOSTNAME, NGINX_TS_PORT, DATA_HOSTNAME, DATA_PORT } from './config'
import { app } from './express'

let cams: Cams.CameraInfo[] = []
const CAMERAS = new Map<string, Camera>()
let intervalID: any
const INTERVAL = 2000


getCams().then(() => {
  cams.forEach((cam, i) => {
    const url = cam.version.object.cam_url
    const camera = createCamera(url)
    CAMERAS.set(camera.state.id, camera)

  })

  intervalID = setInterval(() => {
    CAMERAS.forEach((c) => {
      const cam = c
      if (cam.state.ffmpeg.readyState != ReadyState.OPEN) {
        return
      }
      // if(cam.state.nginx.readyState == ReadyState.OPEN && cam.state.ffmpeg.readyState == ReadyState.OPEN){
      //   return
      // }
      fetch(urlWatchTsInnnerNetwork(cam.state.ffmpeg.url_src)).then(r => {
        // logger.info(r.status.toString()) // 200, 400
        // logger.info(r.statusText) // OK  Not Found
        r.text().then((i3u8)=>{
          const date = new Date()
          const isClosing = i3u8.includes('EXT-X-ENDLIST')
          const readyState = r.status != 200 ? ReadyState.CLOSED : (isClosing ? ReadyState.CLOSING: ReadyState.OPEN)
          const ps: Partial<Stream.State> = {
            nginx: {
              ...cam.state.nginx,
              readyState: readyState,
              last_healthcheck: date.getTime(),
              last_healthcheck_str: date.toString(),
              last_status: r.status,
              msg: 'readyState set by cam-health helthcheck routine'
            }
          }
          cam.setState(ps)
        })

      })
      // cams.forEach((info, i) => {
      //   const cam = getCamera(info.version.object.cam_url, info.version.object.cam_url)
      //   setTimeout(() => {
      //     fetch(urlWatchTs(cam.state.ffmpeg.url_hls)).then(r => {
      //       // logger.info(r.status.toString()) // 200, 400
      //       // logger.info(r.statusText) // OK  Not Found
      //       const date = new Date()
      //       let readyState = r.status == 200 ? ReadyState.OPEN : ReadyState.CLOSED
      //       cam.setState({
      //         nginx: {
      //           readyState: readyState,
      //           ...cam.state.nginx,
      //           last_healthcheck: date.getTime(),
      //           last_healthcheck_str: date.toString(),
      //           last_status: r.status
      //         }
      //       })
      //     })

      //   }, i * (INTERVAL / cams.length))

    })
  }, INTERVAL)

})

app.get('/status', (req, res) => {

  res.json(Array.from(CAMERAS).map(c => c[1].state))

})

reader
  .on('message', msg => {
    const pkg: Pkg = JSON.parse(msg.body.toString())
    console.log(`pkg: ${pkg.channel} ${pkg.type} ${pkg.dataType}`)

    if (
      pkg.dataType == Pkg.DataType.STREAM &&
      pkg.type != Pkg.Type.ECHO
    ) {
      onPkgStream(pkg)
    }

    if (pkg.dataType == Pkg.DataType.FFMPEG) {
      onPkgFFmpeg(pkg)
    }

    msg.finish()

  })


function onPkgStream(pkg: Pkg<Pkg.Stream>) {

  const cam = getCamera(pkg.data.state.id, pkg.data.state.ffmpeg.url_src)

  // cam.touch()

  if (pkg.data.type == Stream.Type.START) {
    publishFFmpeg({
      type: FFmpeg.Type.START,
      state: cam.state.ffmpeg,
    }, Pkg.Type.CMD)
    //
  }

  if (pkg.data.type == Stream.Type.STOP) {
    // cam.setState({
    //   nginx: {
    //     ...cam.state.nginx,
    //     readyState: ReadyState.CLOSING
    //   }
    // })
    publishFFmpeg({
      type: FFmpeg.Type.STOP,
      state: cam.state.ffmpeg,
    }, Pkg.Type.CMD)

    //
  }

  if (pkg.data.type == Stream.Type.STATUS) {
    publishStream({
      type: Stream.Type.STATUS,
      state: cam.state,
    }, Pkg.Type.ECHO)
  }

}

function onPkgFFmpeg(pkg: Pkg<Pkg.FFmpeg>) {

  if (pkg.type != Pkg.Type.ECHO) {
    return
  }

  if (pkg.data.type == FFmpeg.Type.STATUS) {
    const ffmpegState = pkg.data.state
    const cam = CAMERAS.get(ffmpegState.id)
    if (!cam) {
      logger.info(`camera not exists, ffmpeg does : ${ffmpegState.id}`)
      return
    }
    cam.setState({
      ffmpeg: {
        ...cam.state.ffmpeg,
        ...ffmpegState
      }
    })
  }


}

function createCamera(url: string) {
  // console.warn('create camera ' + url)
  const cam = new Camera({
    selfDestruct: (cam) => {
      publishFFmpeg({
        type: FFmpeg.Type.STOP,
        state: cam.state.ffmpeg
      }, Pkg.Type.CMD)
    }
  })

  cam.setState({
    id: url,
    readyState: ReadyState.CLOSED,
    ffmpeg: {
      ...cam.state.ffmpeg,
      id: url,
      readyState: ReadyState.UNSET,
      url_src: url,
      url_hls: urlWatchTs(url)
    },
    nginx: {
      ...cam.state.nginx,
      id: url,
      url_src: url,
      readyState: ReadyState.CLOSED,
      url_hls: urlWatchTs(url)
    }
  })
  cam.on(Camera.STATE_CHANGED, (state: Stream.State) => {
    // console.warn('amera.STATE_CHANGE',state)
    publishStream({
      type: Stream.Type.STATUS,
      state: state
    })
  })

  // cam.touch()

  return cam

}
function getCamera(id: string, url: string) {
  let cam = CAMERAS.get(id)
  console.warn(id)
  if (!cam) {
    cam = createCamera(url)
    CAMERAS.set(cam.state.id, cam)
  }
  return cam
}
function getCams() {

  return Promise.all<Cams.Dataset, Cams.Dataset>([
    fetch(`http://${DATA_HOSTNAME}:${DATA_PORT}/dataset-2/httpcameras.json`).then(r => r.json()),
    fetch(`http://${DATA_HOSTNAME}:${DATA_PORT}/dataset-2/rtspcameras.json`).then(r => r.json())
  ])
    .then(([kre, int]) => {
      cams = kre.items.concat(int.items)
        .filter(c => c.version.object.cam_url)
      return cams
    })


}

// setInterval(() => {
//   CAMERAS.forEach((cam) => {
//     console.warn('reader', reader.listenerCount('message'))
//     if(cam.listenerCount(Camera.STATE_CHANGED) > 1){
//       console.warn(cam.state.id, cam.listenerCount(Camera.STATE_CHANGED))
//     }
//   })
// }, 10000)

function urlPublishTs(url: string) {
  return `http://${NGINX_TS_HOSTNAME}:${NGINX_TS_PORT}/publish/${urlToIdString(url)}`
}

function urlWatchTs(url: string) {
  return `http://${HOSTNAME}:${NGINX_TS_PORT}/play/hls/${urlToIdString(url)}/index.m3u8`
}
function urlWatchTsInnnerNetwork(url: string) {
  return `http://${NGINX_TS_HOSTNAME}:${NGINX_TS_PORT}/play/hls/${urlToIdString(url)}/index.m3u8`
}
export function urlToIdString(url: string) {
  return url.replace(/(\/|\\|:|\.)/g, '_')
}


// request
//   .get('http://host:1825/dataset/httpcameras.json', {
//   }, (err, res, body) => {
//     cams = JSON.parse(body).items
//   })
//   .on('error', (err) => {
//     console.log(err.message)
//   })



Object.assign(process.env, {
  NODE_ENV: process.argv['includes']('--release') ? 'production' : 'development',
})
