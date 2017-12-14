import * as React from 'react';
import { inject,observer } from 'mobx-react'
import { Cams } from '@streaming/types'
import * as BoardComp from './board'
import { Store, Stores } from 'src/store'


export const Board =
  inject<Stores, BoardComp.Props, BoardComp.Props, {}>(({ store }, np, ctx) => {
    const streamsSize = store.hls.streams.size
    const props: BoardComp.Props = {
      streams: store.hls.streams,
      streamsSelected: store.hls.streamsSelected as any
    }
    return props
  })(observer(BoardComp.Board))

// import { ObjectOmit } from "typelevel-ts"; // Thanks @gcanti, we <3 you all!

// declare module "mobx-react" {
//   export function inject<D>(
//     mapStoreToProps: (store: any) => D
//   ): <A extends D>(
//       component: React.ComponentType<A>
//     ) => React.SFC<ObjectOmit<A, keyof D> & Partial<D>>;
// }

// const MyComp = ({ label, count }: { label: string; count: number }) =>
//   <p>
//     {label} x {count} times!
//     </p>;
// const MyCompConnected = inject((store: any) => ({

//   count: 1

//  }))(MyComp);

// export const el1 = <MyCompConnected label="hello" />;
// export const el2 = <MyCompConnected labels="hello" />; // error! :D
// export const el3 = <MyCompConnected label="Hello world!" count={2} />;
