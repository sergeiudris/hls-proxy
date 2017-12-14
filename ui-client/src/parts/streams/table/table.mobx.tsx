import * as React from 'react';
import { inject } from 'mobx-react'
import { Cams } from '@streaming/types'
import * as TableComp from './table'
import { Store, Stores } from 'src/store'



export const Table =
  inject<Stores, TableComp.Props, TableComp.Props, {}>(({ store }, np, ctx) => {
    const props: TableComp.Props = {
      datasets: store.datasets,
      datasetsInfo: store.datasetsInfo,
      streams: store.hls.streams,
      onAdd: (cam) => {

      },
      onRemove: (cam) => {

      },
      onTerminate: (cam) => {

      }
    }
    return props
  })(TableComp.TableView)

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
