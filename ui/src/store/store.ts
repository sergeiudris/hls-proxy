import { observable, action, reaction, IReactionDisposer, computed, autorun, IObservableValue, IObservable, ObservableMap, IMapChange, extendObservable } from 'mobx';
import { History, Location } from 'history'
import { history } from 'src/history'

import { ReadyState, Evt, Cams, Pkg, FFmpeg,Stream } from '@streaming/types'
import { api } from 'src/api'
import { Sock } from 'src/comps/sock'

import { FFmpegState } from './ffmpeg'
import { StreamsState } from './streams'



export class AppStore {

  history: History

  ffmpeg: FFmpegState
  streams: StreamsState

  sock: Sock

  @observable.shallow location: Location

  @observable.shallow datasetsInfo: Cams.DatasetInfo[] = []
  @observable.shallow datasets: Map<string, Cams.CameraInfo[]> = new Map()
  @observable.shallow cams: Cams.CameraInfo[] = []
  @observable datasetSelectedFilename: string = 'httpcameras.json'

  constructor(history: History) {
    this.history = history
    this.location = this.history.location

    this.history.listen(action((location: Location) => {
      this.location = location
    }))

    this.sock = new Sock({
      url: `ws://${api.HUB_HOSTNAME}:${api.HUB_PORT_WSS}`,
      reconnectInterval: 1000,
      isReconnecting: true,
      // reconnectMaxAttemps: 3
    })
    this.sock.connect()

    this.ffmpeg = new FFmpegState(this)
    this.streams = new StreamsState(this)
    this.load()



    return this
  }

  load() {
    this.loadDatasetsInfo()
  }

  @action
  loadDatasetsInfo() {
    api.fetchDatasetsInfo().then((d) => {
      this.datasetsInfo = d
    })
      .then(() => {
        Promise.all(
          this.datasetsInfo.map((d) => {
            return this.loadDataset(d.fileName)
          })
        ).then(() => {
          this.datasets.forEach((v, k) => {
            this.cams = this.cams.concat(v)
          })
        })

      })
  }

  @action
  loadDataset(filename: string) {
    if (this.datasets.get(filename)) {
      return
    }
    return api.fetchDataset(filename).then((d) => {
      const streamsInfo: Cams.CameraInfo[] =
        d.items.filter(s => s.version.object.cam_url)
      this.datasets.set(filename, streamsInfo)
      this.ffmpeg.setStreamSets(filename, streamsInfo.map((info) => {
        const url = info.version.object.cam_url
        const state: FFmpeg.State = {
          id: url,
          readyState: ReadyState.UNSET,
          url_src: url,
          url_hls: undefined,
          url_mpd: undefined,
          error: undefined,
          msg: undefined,
          cmdLine: undefined,
          codecData: undefined
        }
        return state
        // return {
        //   id: info.id.toString(),
        //   status: ReadyState.UNSET,
        //   props: info
        // }
      }))

      this.streams.setStreamSets(filename, streamsInfo.map((info) => {
        const url = info.version.object.cam_url
        const state: Stream.State = {
          id: url,
          readyState: ReadyState.UNSET,
          ffmpeg: {
            id: url,
            url_src: url,
            readyState: ReadyState.UNSET,
            url_hls: undefined,
            url_mpd: undefined,
            error: undefined,
            msg: undefined,
            cmdLine: undefined,
            codecData: undefined
          },
          nginx:{
            id: url,
            url_src: url,
            readyState: ReadyState.UNSET,
            url_hls: undefined,
            url_mpd: undefined,
            error: undefined,
            last_healthcheck: undefined,
            last_healthcheck_str: undefined,
            last_status: undefined,
            msg: undefined,
          }

        }
        return state
        // return {
        //   id: info.id.toString(),
        //   status: ReadyState.UNSET,
        //   props: info
        // }
      }))
    })

  }

  @action
  selectDataset(filename: string) {
    this.datasetSelectedFilename = filename
    this.loadDataset(filename)
  }

  send(data: Pkg) {
    this.sock.socket.send(JSON.stringify(data))
  }



}
