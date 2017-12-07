import { Dispatch, ActionCreator, Action, Middleware, MiddlewareAPI, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { createReducer } from '../../create-reducer'
import { Stream, Cams, ReadyState } from '@streaming/types'

const MODULE_NAME = 'hls'
const actionType = (name: string) => `${MODULE_NAME}/${name}`
export const SOCKET_OPEN = actionType('SOCKET_OPEN')
export const SOCKET_CLOSE = actionType('SOCKET_CLOSE')
export const HLS_STREAM_STATE = actionType('HLS_STREAM_STATE')
export const HLS_STREAM_START = actionType('HLS_STREAM_START')
export const HLS_STREAM_TERMINATE = actionType('HLS_STREAM_TERMINATE')
export const HLS_STREAM_REMOVE = actionType('HLS_STREAM_REMOVE')





export interface IStreamHlsState {
  id: string
  isWindowMode: boolean
  typeId: Cams.CamType
  cam_url: string
  title: string
  control_url: string
  state: Stream.State
  featureId: string
  isMoveControlsVisible: boolean
  wasMoveControlRequestSuccessful: boolean
  isRecording: boolean
  timeRecordingStarted: number
  timeRecordingCurrent: number
  timeRecordingDuration: number
  timeRecordingDurationString: string
}

export interface HlsStore {
  streams: { [key: string]: IStreamHlsState }
}



const initialState: HlsStore = {
  streams: {}
}


interface ActionSocketOpenClose extends Action {

}

interface ActionHlsStreamState extends Action {
  payload: Stream.State
}

interface ActionHlsStreamStartTerminate extends Action {
  payload: Cams.CameraInfo
}

export const socketOpen = (): ActionSocketOpenClose => {
  return {
    type: SOCKET_OPEN
  }
}

export const socketClose = (): ActionSocketOpenClose => {
  return {
    type: SOCKET_CLOSE
  }
}
export const hlsStreamState = (state: Stream.State): ActionHlsStreamState => {
  return {
    type: HLS_STREAM_STATE,
    payload: state
  }
}

export const hlsStreamStart = (cam: Cams.CameraInfo): ActionHlsStreamStartTerminate => {
  return {
    type: HLS_STREAM_START,
    payload: cam
  }
}


export const hlsStreamTerminate = (cam: Cams.CameraInfo): ActionHlsStreamStartTerminate => {
  return {
    type: HLS_STREAM_TERMINATE,
    payload: cam
  }
}

export const hlsStreamRemove = (cam: Cams.CameraInfo): ActionHlsStreamStartTerminate => {
  return {
    type: HLS_STREAM_REMOVE,
    payload: cam
  }
}

const reducer_hlsStreamState: Reducer<HlsStore> = (state: HlsStore, action: ActionHlsStreamState): HlsStore => {

  const streamState = action.payload
  const stream = state.streams[streamState.id]
  return {
    streams: {
      ...state.streams,
      [streamState.id]: Object.assign({}, stream, {
        state: streamState
      })
    }
  }

}

const reducer_hlsStreamStart: Reducer<HlsStore> = (state: HlsStore, action: ActionHlsStreamStartTerminate): HlsStore => {

  const cam = action.payload
  const cam_url = cam.version.object.cam_url
  return {
    streams: {
      ...state.streams,
      [cam_url]: {
        ...defaultStreamHlsState(cam_url),
        id: cam_url,
        typeId: cam.version.object.type,
        title: cam.title
      }
    }
  }

}

const reducer_hlsStreamRemove: Reducer<HlsStore> = (state: HlsStore, action: ActionHlsStreamStartTerminate): HlsStore => {

  const cam = action.payload
  const cam_url = cam.version.object.cam_url
  const streams = { ...state.streams }
  delete streams[cam_url]
  return {
    ...state,
    streams: {
      ...streams
    }
  }

}


export const reducer_hls = createReducer(initialState, {
  [HLS_STREAM_STATE]: reducer_hlsStreamState,
  [HLS_STREAM_START]: reducer_hlsStreamStart,
  [HLS_STREAM_REMOVE]: reducer_hlsStreamRemove,
  [HLS_STREAM_TERMINATE]: reducer_hlsStreamRemove,

})

export function defaultStreamHlsState(cam_url: string) {
  const newStreamHlsState: IStreamHlsState = {
    id: undefined,
    typeId: undefined,
    control_url: undefined,
    cam_url: cam_url,
    title: undefined,
    isWindowMode: true,
    state: {
      id: cam_url,
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
    },
    featureId: undefined,
    isMoveControlsVisible: false,
    wasMoveControlRequestSuccessful: false,
    isRecording: false,
    timeRecordingStarted: 0,
    timeRecordingCurrent: 0,
    timeRecordingDuration: 0,
    timeRecordingDurationString: '00:00:00'
  }

  return newStreamHlsState
}
