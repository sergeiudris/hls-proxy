import * as React from 'react';
import { inject, observer } from 'mobx-react'
import { Cams } from '@streaming/types'
import * as ListItemComp from './list-item'
import { Store, Stores } from 'src/store'


export const ListItem =
  inject<Stores, ListItemComp.Props, Partial<ListItemComp.Props>, {}>(({ store }, np, ctx) => {
    // const stream = store.hls.streams.size
    const props: Partial<ListItemComp.Props> = {
      onAddToWall: store.hls.addToBoard,
      onSubtractFromWall: store.hls.subtractFromBoard,
      onStart: store.hls.onStartStream,
      onTerminate: store.hls.onTerminateStream
    }
    return props
  })(observer(ListItemComp.ListItem))
