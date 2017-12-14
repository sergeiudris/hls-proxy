export * from './store'
export * from './hls'
import { Store } from './store'


export const store = new Store()
window['store'] = store

store.fetchDatasets()
