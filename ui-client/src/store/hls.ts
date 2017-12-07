import { observable, action, reaction, IReactionDisposer, computed, autorun, IObservableValue, IObservable, ObservableMap, IMapChange, extendObservable } from 'mobx';
import { History, Location } from 'history'
import { history } from 'src/history'

import { Evt, Cams, Stream, ReadyState, Pkg, FFmpeg, Nginx } from '@streaming/types'

import * as api from 'src/api'
import { Store } from './'
import { HlsStreamState, PlayerState } from 'src/types'



export class HlsStore {

  store: Store

  @observable.shallow streams = new Map<string, HlsStreamState>()
  @observable.shallow streamsSelected = new Map<string, string>()

  constructor(store: Store) {
    this.store = store
  }

  @action
  selectStream(id: string) {
    this.streamsSelected.set(id, id)
  }

  @action
  unselectStream(id: string) {
    this.streamsSelected.delete(id)
  }

  @action
  updateStreamState(state: Partial<Stream.State>) {
    const stream = this.streams.get(state.id)
    Object.assign(stream.state, state)

  }

  @action
  updateStreamPlayer(player: Partial<PlayerState>) {
    const stream = this.streams.get(player.id)
    Object.assign(stream.player, player)
  }



}
