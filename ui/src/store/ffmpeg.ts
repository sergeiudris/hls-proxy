import { observable, action, reaction, IReactionDisposer, computed, autorun, IObservableValue, IObservable, ObservableMap, IMapChange, extendObservable } from 'mobx';
import { History, Location } from 'history'
import { history } from 'src/history'

import { Evt, Cams, Stream, ReadyState, Pkg, FFmpeg, Nginx } from '@streaming/types'

import { api } from 'src/api'

import { AppStore } from './store'



export class FFmpegState {

  root: AppStore
  @observable.shallow streamSets: Map<string, FFmpeg.State[]> = new Map()

  constructor(root: AppStore) {
    this.root = root

    this.root.sock.socket.addEventListener('message', (evt: MessageEvent) => {
      const pkg: Pkg = JSON.parse(evt.data)
      if (pkg.type == Pkg.Type.ECHO &&
        pkg.dataType == Pkg.DataType.FFMPEG
      ) {
        this.processStreamEvent(pkg)
      }
    })

  }

  setStreamSets(key: string, arr: FFmpeg.State[]) {
    this.streamSets.set(key, observable.shallowArray<FFmpeg.State>(arr))
  }

  get streams() {
    return this.streamSets.get(this.root.datasetSelectedFilename)
  }

  @action
  add(stream: FFmpeg.State) {
    this.streams.push(stream)
  }

  @action
  update(ps: Partial<FFmpeg.State>) {
    const i = this.streams.findIndex(s => s.id == ps.id)
    const stream = this.streams[i]
    this.streams.splice(i, 1, Object.assign({}, {
      ...stream,
      ...ps
    }))
  }

  @action
  remove(info: Cams.CameraInfo) {
    const i = this.streams.findIndex(s => s.id == info.version.object.cam_url)
    if (i > 0) {
      this.streams.splice(i, 1)
    }
  }

  // sendPkg(url: string, type?: Stream.Type) {
  //   const root = this.root

  //   const pkg: Pkg<Stream.State, Pkg.Topic.STREAMING> = {
  //     timestamp: Date.now(),
  //     topic: Pkg.Topic.STREAMING,
  //     channel: 'web',
  //     type: Pkg.Type.CMD,
  //     data: {
  //       id: url,
  //       type: Stream.Type.START,
  //       readyState: ReadyState.UNSET,
  //       nginx: {
  //         id: url,
  //         readyState: ReadyState.UNSET,
  //       },
  //       ffmpeg: {
  //         id: url,
  //         url_src: url,
  //         readyState: ReadyState.UNSET
  //       }
  //     }
  //   }
  //   root.send(pkg)

  // }

  sendPkgFfmpeg(url: string, type?: FFmpeg.Type) {
    const root = this.root

    const pkg: Pkg<Pkg.FFmpeg> = {
      timestamp: Date.now(),
      topic: Pkg.Topic.STREAMING,
      channel: 'web',
      type: Pkg.Type.CMD,
      dataType: Pkg.DataType.FFMPEG,
      data: {
        type: type,
        state: {
          id: url,
          url_src: url,
          url_hls: undefined,
          url_mpd: undefined,
          cmdLine: undefined,
          codecData: undefined,
          error: undefined,
          msg: undefined,
          readyState: ReadyState.UNSET
        }
      }
    }
    root.send(pkg)

  }



  @action
  processStreamEvent = (pkg: Pkg<Pkg.FFmpeg>) => {

    const app = this.root

    console.log(`pkg: ${pkg.channel} ${pkg.dataType} ${pkg.type} ${pkg.data.type} ${pkg.data.state.readyState}`)

    this.update(pkg.data.state)

    // if (evt. == FFmpeg.Cmd.START) {
    //   const d = evt.data as any as FFmpeg.Data
    //   const stream = this.streams.find(s => s.props.version.object.cam_url == d.url)
    //   this.update({
    //     ...stream,
    //     status: Status.CONNECTING,
    //     data: d
    //   })
    //   app.sendEvent(evt)
    // }

    // if ([FFmpeg.Cmd.STARTED, FFmpeg.Cmd.EXISTS].includes(evt.data.cmd)) {
    //   const d = evt.data as any as FFmpeg.Data
    //   const stream = this.streams.find(s => s.props.version.object.cam_url == d.url)
    //   this.update({
    //     ...stream,
    //     status: Status.OPEN,
    //     url_hls: d.url_hls,
    //     data: d
    //   })
    // }

    // if (evt.data.cmd == FFmpeg.Cmd.TERMINATE) {
    //   const d = evt.data as any as FFmpeg.Data
    //   const stream = this.streams.find(s => s.props.version.object.cam_url == d.url)
    //   this.update({
    //     ...stream,
    //     status: Status.CLOSING,
    //     data: d
    //   })
    //   app.sendEvent(evt)
    // }


    // if (evt.data.cmd == FFmpeg.Cmd.TERMINATED) {
    //   const d = evt.data as any as FFmpeg.Data
    //   const stream = this.streams.find(s => s.props.version.object.cam_url == d.url)
    //   this.update({
    //     ...stream,
    //     status: Status.CLOSED
    //   })
    // }

  }

}

