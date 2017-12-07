import { ReducersMapObject, Reducer, Action } from 'redux'

export function createReducer<S>(initialState: S, handlers: ReducersMapObject): Reducer<S> {
  const reducer: Reducer<S> = (state = initialState, action: Action) => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
  return reducer
}
