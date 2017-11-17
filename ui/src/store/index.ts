import { history } from 'src/history'
import { observable, action, reaction, IReactionDisposer, computed, autorun, IObservableValue, IObservable, ObservableMap, IMapChange } from 'mobx';
import { AppStore } from './store'

export * from './store'
export * from './ffmpeg'


import './mst'

export const store = window['store'] = new AppStore(history)

// autorun(() => {
//   console.warn('random autorun ', store.location)
// })


