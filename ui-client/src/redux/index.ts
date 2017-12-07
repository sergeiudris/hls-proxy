import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers, ReducersMapObject, Middleware } from 'redux'
import { Stream } from '@streaming/types'
import * as hls from './modules/hls'
import * as app from './modules/app'
import * as mjpeg from './modules/mjpeg'



export interface Store {
  hls: hls.HlsStore,
  app: app.AppStore,
  mjpeg: mjpeg.MjpegStore
}


const loggerReduxMiddleware = createLogger({
  collapsed: true
})


export const store = createStore<Store>(
  combineReducers<Store>({
    hls: hls.reducer_hls,
    app: app.reducer_app,
    mjpeg: mjpeg.reducer_mjpeg
  }),
  applyMiddleware(
    thunkMiddleware,
    loggerReduxMiddleware,
    hls.hlsSocketMiddleWare,
    // // loggerReduxMiddleware,
    // ...middleware,
    // middlewareCanvas,
    // createEpicMiddleware(combineEpics(
    //   tennisEpic,
    //   ...epics
    // ))
  )
)

window['store'] = store

