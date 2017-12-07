import { Dispatch, ActionCreator, Action, Middleware, MiddlewareAPI, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { createReducer } from '../../create-reducer'
import { Store } from 'redux';
import * as api from 'src/api'
import { Cams } from '@streaming/types'

const MODULE_NAME = 'app'
const actionType = (name: string) => `${MODULE_NAME}/${name}`
const APP_STORE = actionType('APP_STORE')
const FETCH_DATASETS = actionType('FETCH_DATASETS')
const DATASETS = actionType('DATASETS')




export interface AppStore {
  sidebar: {
    collapsed: boolean
  }
  datasetsInfo: Cams.DatasetInfo[]
  datasets: Cams.Dataset[]
}

const initialState: AppStore = {
  sidebar: {
    collapsed: true
  },
  datasetsInfo: [],
  datasets: []
}


interface ActionAppStore extends Action {
  payload: Partial<AppStore>
}

interface ActionDatasets extends Action {
  payload: {
    datasetsInfo: Cams.DatasetInfo[],
    datasets: Cams.Dataset[]
  }
}

export const appStoreSet = (pState: Partial<AppStore>): ActionAppStore => {
  return {
    type: APP_STORE,
    payload: pState
  }
}

export const fetchDatasets = () => {
  return (dispatch, getState, extraArg) => {

    api.fetchDatasetsInfo().then((dInfo) => {
      return Promise.all(
        dInfo.map(di => api.fetchDataset(di.fileName))
      )
        .then((sets) => {

          dispatch({
            type: DATASETS,
            payload: {
              datasetsInfo: dInfo,
              datasets: sets
            }
          })

        })
    })
  }


}


const reducer_appStoreSet: Reducer<AppStore> = (state: AppStore, action: ActionAppStore): AppStore => {

  return {
    ...state,
    ...action.payload
  }

}

const reducer_datasets: Reducer<AppStore> = (state: AppStore, action: ActionDatasets): AppStore => {

  return {
    ...state,
    ...action.payload
  }

}

export const reducer_app = createReducer(initialState, {
  [APP_STORE]: reducer_appStoreSet,
  [DATASETS]: reducer_datasets

})
