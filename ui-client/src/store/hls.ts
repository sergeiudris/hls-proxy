import { observable, action, reaction, IReactionDisposer, computed, autorun, IObservableValue, IObservable, ObservableMap, IMapChange, extendObservable } from 'mobx';
import { History, Location } from 'history'
import { history } from 'src/history'

import { Evt, Cams, Stream, ReadyState, Pkg, FFmpeg, Nginx } from '@streaming/types'

import * as api from 'src/api'
import * as config from 'src/config'

import { Store } from './'
import { HlsStreamState, PlayerState } from 'src/types'
import { Sock } from 'src/modules/sock'



export class HlsStore {

  store: Store
  sock: Sock

  @observable streams = new Map<string, HlsStreamState>()
  @observable.shallow streamsSelected = new Map<string, number>()

  constructor(store: Store) {
    this.store = store
    this.sock = new Sock({
      url: `ws://${config.HUB_HOSTNAME}:${config.HUB_PORT_WSS}`,
      reconnectInterval: 1000,
      isReconnecting: true,
      // reconnectMaxAttemps: 3
    })
    this.sock.connect()
    this.sock.socket.addEventListener('message', (evt: MessageEvent) => {
      const pkg: Pkg = JSON.parse(evt.data)
      if (pkg.type == Pkg.Type.ECHO &&
        pkg.dataType == Pkg.DataType.STREAM
      ) {
        this.processStreamEvent(pkg)
      }
    })
  }

  @action
  selectStream(id: string) {
    this.streamsSelected.set(id, 1)
  }

  @action
  unselectStream(id: string) {
    this.streamsSelected.delete(id)
  }

  @action
  updateStream(ps: Partial<HlsStreamState>) {
    const stream = this.streams.get(ps.id)
    Object.assign(stream, ps)
  }

  @action
  updateStreamState(state: Partial<Stream.State>) {
    const stream = this.streams.get(state.id)
    if(!stream){
      console.warn('cold not update stream', state)
      return
    }
    Object.assign(stream.state, state)
  }

  @action
  updateStreamPlayer(player: Partial<PlayerState>) {
    const stream = this.streams.get(player.id)
    Object.assign(stream.player, player)
  }

  @action
  addToWall = (id: string) => {
    const stream = this.streams.get(id)
    // Object.assign(stream,{
    //   wallCount: ++stream.wallCount
    // })
    const count =  ++stream.wallCount
    this.updateStream({
      id: id,
      wallCount:count
    })
    this.streamsSelected.set(id, count)
  }

  @action
  subtractFromWall = (id: string) => {
    const stream = this.streams.get(id)
    if(stream.wallCount == 0){
      return
    }
    const count =  --stream.wallCount
    this.updateStream({
      id: id,
      wallCount: count
    })
    this.streamsSelected.set(id, count)
  }

  @action
  processStreamEvent = (pkg: Pkg<Pkg.Stream>) => {

    const app = this.store
    console.warn('PKG STREAM', pkg)

    this.updateStreamState(pkg.data.state)


    // console.log(`pkg: ${pkg.channel} ${pkg.dataType} ${pkg.type} ${pkg.data.type} ${pkg.data.state.readyState}`)

    // this.update(pkg.data.state)

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
