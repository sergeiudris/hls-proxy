import { types, onSnapshot, IModelType, getRoot, applyPatch, recordPatches } from "mobx-state-tree"
import { observable, action, reaction, IReactionDisposer, computed, autorun, IObservableValue, IObservable, ObservableMap, IMapChange } from 'mobx';

interface ITodoStore {
  todos: Todo[]
  selectedTodo: Todo
  hello: string
}

interface ITodo {
  id: string
  title: string
  done: boolean
}

interface Todo extends ITodo {
  toggle: (x: string) => any
}

const Todo = types.model("Todo", {
  id: types.identifier<string>(),
  title: types.optional(types.string, ''),
  done: false
}).actions(self => ({
  /** hello, dolly */
  toggle(s: string) {
    const root: TStore = getRoot(self)
    self.done = !self.done
    self.title = s
  }
}))

const Store = types.model<ITodoStore>("Store", {
  todos: types.array(Todo),
  selectedTodo: types.reference(Todo),
  hello: types.string
})


type TStore = typeof Store.Type

const store = Store.create({
  todos: [{
    done: false,
    title: "Get coffee",
    id: '1'
  }],
  selectedTodo: '1',
  hello: '123'
})

console.warn(store.selectedTodo.title)

applyPatch(store, {
  op: 'replace',
  path: '/todos/0/title',
  value: 'asd' as typeof Todo.Type.title
})
console.warn(store.selectedTodo.title)

window['sss'] = store


// create an instance from a snapshot

// const x: typeof store

// listen to new snapshots
onSnapshot(store, (snapshot) => {
  console.dir(snapshot)
})

// const r = getRoot(a)

// invoke action that modifies the tree
const todo = store.todos[0]

// prints: `{ todos: [{ title: "Get coffee", done: true }]}`


class Planet {
  @observable name: string
}

const planet = new Planet()

