
const API_ORIGIN = location.origin;

import { Cams } from '@streaming/types'

declare var NODE_ENV

const isDev = NODE_ENV != 'production'

export const SERVICE_PORT = 3004
export const TS_PORT = 1912
export const RTMP_PORT_RTMP = 1913
export const RTMP_PORT_HTTP = 1914
export const SERVICE_HOSTNAME = 'host' // location.hostname // isDev ? 'localhost' : 'host'

export const SERVICE_HOST = `http://${SERVICE_HOSTNAME}:${SERVICE_PORT}`
export const DATA_HOST = `http://host:1825`

// export const SERVICE_PORT = 1999



// export const SERVICE_HOST = `http://${location.hostname}:${SERVICE_PORT}`
// export const SERVICE_HOSTNAME = `host`


// export const SERVICE_HOST = `http://host:1998`



const FETCH_PARAMS = {
    mode: 'cors' // ?
}

function makeUrlOrigin(partialUrl: string): string {
    return `${API_ORIGIN}${partialUrl}`;
}

function LOG_REQUEST_JSON_URL(partialUrl) {
    console.log(`fetch: ${makeUrlOrigin(partialUrl)}`);
}

async function fetchJson<R>(url: string, params?: string, partialRequestInit?: RequestInit): Promise<R> {
    const data = await fetch(`${url}?${params}`, Object.assign({}, FETCH_PARAMS, partialRequestInit))
    const json = await data.json()
    return json
}

async function fetchJsonSimple<R>(url: string, partialRequestInit?: RequestInit): Promise<R> {
    const data = await fetch(url, Object.assign({}, FETCH_PARAMS, partialRequestInit))
    const json = await data.json()
    return json
}

async function fetchFromOrigin<R>(partialUrl: string, params?: string, partialRequestInit?: RequestInit) {
    const url = makeUrlOrigin(partialUrl)
    LOG_REQUEST_JSON_URL(`${partialUrl}?${params}`)
    return fetchJson<R>(url, params, partialRequestInit)
}

async function fetchFromOriginSimple<R>(partialUrl: string, partialRequestInit?: RequestInit) {
    const url = makeUrlOrigin(partialUrl)
    LOG_REQUEST_JSON_URL(partialUrl)
    return fetchJsonSimple<R>(url, partialRequestInit)
}

function fetchService<R>(partialUrl?: string) {
    return (params?: string, partialRequestInit?: RequestInit) => {
        return fetchFromOrigin<R>(partialUrl, params, partialRequestInit)
    }
}

function fetchServiceSimple<R>(partialUrl?: string, partialRequestInit?: Partial<RequestInit>) {
    return (pUrl?: string, params?: string) => {
        return fetchFromOriginSimple<R>(`${partialUrl}${pUrl ? `/${pUrl}` : ''}`, partialRequestInit)
    }
}


export const FETCH_datasets = () => fetchJsonSimple<Cams.DatasetInfo[]>(`${DATA_HOST}/datasets.json`, { cache: 'default' }) //fetchServiceSimple<Types.DatasetInfo[]>('/static/datasets', { cache: 'default' })
// export const FETCH_dataset = fetchServiceSimple<any>('/static/dataset', { cache: 'default' })
export const FETCH_dataset = (name: string) => fetchJsonSimple<Cams.Dataset>(`${DATA_HOST}/dataset-2/${name}`, { cache: 'default' })

