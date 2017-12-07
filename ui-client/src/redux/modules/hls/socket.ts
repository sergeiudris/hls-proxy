import { Dispatch, ActionCreator, Action, Middleware, MiddlewareAPI, Reducer } from 'redux'
import * as hlsStore from '../../modules/hls'
import { Store } from 'src/store'

import { Sock } from 'src/modules/sock'
import * as api from 'src/api'
import { Pkg, Stream, ReadyState , Cams} from '@streaming/types'

let socket: Sock = undefined

export const hlsSocketMiddleWare: Middleware = store => next => (action) => {

  const { type, payload } = action;

  if (type == hlsStore.SOCKET_OPEN) {

    if (socket) {
      socket.disconnect()
    }
    try {
      socket = new Sock({
        url: api.HUB_HOST_WS,
        isReconnecting: true,
        reconnectInterval: 1000,
        reconnectMaxAttemps: 3,
      })
      socket.connect()
      // console.warn(`connect to ${api.HUB_HOST_WS}`)

      socket.socket.addEventListener('message', (evt) => {
        const pkg: Pkg<Pkg.Stream> = JSON.parse(evt.data)
        // console.warn('PKG STREAM', pkg)
        if (pkg.type == Pkg.Type.ECHO &&
          pkg.dataType == Pkg.DataType.STREAM
        ) {
          // console.warn('PKG STREAM', pkg)
          const streamStatePkg = pkg.data.state
          const hls = store.getState()['hls'] as hlsStore.HlsStore
          const streamStateLocal = hls.streams[streamStatePkg.id]
          // const window = cameras.windows[streamStatePkg.id]
          if (!streamStateLocal) {
            return
          }
          // if (streamStateLocal.isWindowMode && !window) {
          //   return
          // }
          store.dispatch(hlsStore.hlsStreamState(streamStatePkg))

        }
      })

    } catch (err) {
      console.warn(err)
    }

  }

  else if (type == hlsStore.SOCKET_CLOSE) {
    if (socket) {
      socket.disconnect()
    }
  }

  else if (type == hlsStore.HLS_STREAM_START) {
    // console.warn(payload)
    const cam = payload as Cams.CameraInfo
    const cam_url = cam.version.object.cam_url
    const typeId = cam.version.object.type
    const pkg: Pkg<Pkg.Stream> = {
      timestamp: Date.now(),
      topic: Pkg.Topic.STREAMING,
      channel: 'web',
      type: Pkg.Type.CMD,
      dataType: Pkg.DataType.STREAM,
      data: {
        type: Stream.Type.START,
        state: {
          id: cam.version.object.cam_url,
          readyState: ReadyState.UNSET,
          ffmpeg: {
            id: cam_url,
            url_src: cam_url,
            url_mpd: undefined,
            url_hls: undefined,
            msg: undefined,
            error: undefined,
            readyState: ReadyState.UNSET,
            cmdLine: undefined,
            codecData: undefined
          },
          nginx: {
            id: cam_url,
            url_src: cam_url,
            url_hls: undefined,
            url_mpd: undefined,
            readyState: ReadyState.UNSET,
            last_healthcheck: undefined,
            last_healthcheck_str: undefined,
            last_status: undefined,
            msg: undefined,
            error: undefined,
          }
        }
      }
    }
    if (socket && typeId != 1) {
      socket.socket.send(JSON.stringify(pkg))
    }

  }

  next(action);

}
