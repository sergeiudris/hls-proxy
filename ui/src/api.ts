
import { isObservableArray } from 'mobx'
import { Cams } from '@streaming/types'

// interface Env {
//   NSQLOOKUPD_HOSTNAME: string
//   NSQD_HOSTNAME: string
//   NSQADMIN_HOSTNAME: string
//   NSQLOOKUPD_PORT: number
//   NSQD_PORT: number
//   HUB_PORT_WSS: number
//   HUB_PORT: number
//   HOSTNAME: string
//   DATA_PORT: number
// }




export namespace api {

  const API_ORIGIN = window.location.origin

  export const HUB_PORT = 1805
  export const HUB_PORT_WSS = 1100
  export const SERVICE_HOSTNAME = location.hostname
  export const DATA_PORT = 1825
  export const SPAWN_FFMPEG_HOST = `http://${location.hostname}:${1806}`
  // export const HUB_HOSTNAME = NODE_ENV == 'production' ? 'host' : '127.0.0.1'

  export const HUB_HOSTNAME = location.hostname
  // export const HUB_HOSTNAME = 'host'

  export const DATA_HOST = `http://${SERVICE_HOSTNAME}:${DATA_PORT}`



  export const FETCH_PARAMS = {
    mode: 'cors' // ?
  }

  export async function fetchJson<R = any>(url: string, query: string = '', partialInit?: RequestInit): Promise<R> {
    const data = await fetch(`${url}?${query}`, Object.assign({}, FETCH_PARAMS, partialInit))
    const json = await data.json()
    return json
  }

  export const fetchDatasetsInfo = () => fetchJson<Cams.DatasetInfo[]>(`${DATA_HOST}/datasets.json`)

  export const fetchDataset = (name: string) => fetchJson<{ items: Cams.CameraInfo[] }>(`${DATA_HOST}/dataset-2/${name}`)
  export const terminateAllStreams = () => fetchJson<any[]>(`${SPAWN_FFMPEG_HOST}/stop-all`)

}
