// import { ReducersMapObject, Reducer, Action } from 'redux'
// import { ThunkAction } from 'redux-thunk'

// interface ThunkActionNamespaced<S, M> {
//   <R, S, E, M>(thunk: ThunkAction<R, { state: S, module: M }, E>): ThunkAction<R, S, E>
// }

// // export type StateToModule<S,M> = <S, M>(state: S) => M


// export function createThunkActions<S, M>(stateToModuleConverter?: (state: S) => M): ThunkActionNamespaced<S, M> {
//   const stateToModule = stateToModuleConverter
//   const getSubState = (getState: () => S) => () => ({ module: stateToModule(getState()), state: getState() })
//   const thunkAction: ThunkActionNamespaced<S, M> = <R, E>(thunk: ThunkAction<R, { state: S, module: M }, E>): ThunkAction<R, S, E> =>
//     (dispatch, getState, extraArg) => {
//       return thunk(dispatch, getSubState(getState), extraArg)
//     }

//   return thunkAction
// }


// // interface StateToModule {
// //   <S, M>(state: S): M
// // }
