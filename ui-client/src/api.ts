
import { Cams } from '@streaming/types'
import * as config from './config'

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










export const FETCH_PARAMS = {
  mode: 'cors' // ?
}

export async function fetchJson<R = any>(url: string, query: string = '', partialInit?: RequestInit): Promise<R> {
  const data = await fetch(`${url}?${query}`, Object.assign({}, FETCH_PARAMS, partialInit))
  const json = await data.json()
  return json
}

export const fetchDatasetsInfo = () => fetchJson<Cams.DatasetInfo[]>(`${config.DATA_HOST}/datasets.json`)

export const fetchDataset = (name: string) => fetchJson<Cams.Dataset>(`${config.DATA_HOST}/dataset-2/${name}`)
export const terminateAllStreams = () => fetchJson<any[]>(`${config.SPAWN_FFMPEG_HOST}/stop-all`)

