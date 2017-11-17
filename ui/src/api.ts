
import { isObservableArray } from 'mobx'
import { Cams } from '@streaming/types'

declare var NODE_ENV

export namespace api {

  const API_ORIGIN = window.location.origin

  export const HUB_PORT = 1803
  export const HUB_PORT_WS = 1100
  // export const HUB_HOSTNAME = NODE_ENV == 'production' ? 'host' : '127.0.0.1'

  // export const HUB_HOSTNAME = '127.0.0.1'
  export const HUB_HOSTNAME = 'host'

  export const DATA_HOST = `http://host:1825`


  export const SERVICE_ORIGIN = `http://${HUB_HOSTNAME}:${HUB_PORT}`


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

}
