import { Dispatch, ActionCreator, Action, Middleware, MiddlewareAPI, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { createReducer } from '../../create-reducer'
import { Store } from 'redux';

const MODULE_NAME = 'mjpeg'
const actionType = (name: string) => `${MODULE_NAME}/${name}`
const MJPEG_STORE = actionType('MJPEG_STORE')


interface MjpegStream {

}

export interface MjpegStore {
  streams: { [key: string]: MjpegStream }
}

const initialState: MjpegStore = {
  streams: {}
}


interface ActionMjpegStore extends Action {
  payload: Partial<MjpegStore>
}

export const mjpegStoreSet = (pState: Partial<MjpegStore>): ActionMjpegStore => {
  return {
    type: MJPEG_STORE,
    payload: pState
  }
}

const reducer_mjpegStoreSet: Reducer<MjpegStore> = (state: MjpegStore, action: ActionMjpegStore): MjpegStore => {

  return {
    ...state,
    ...action.payload
  }

}

export const reducer_mjpeg = createReducer(initialState, {
  [MJPEG_STORE]: reducer_mjpegStoreSet
})
