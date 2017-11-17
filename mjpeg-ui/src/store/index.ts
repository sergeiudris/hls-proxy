import Vue from 'vue'
import Vuex from 'vuex'



const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})



export default store;
if (typeof window !== 'undefined') {
  window['store'] = store;
  window['Vue'] = Vue;
}
