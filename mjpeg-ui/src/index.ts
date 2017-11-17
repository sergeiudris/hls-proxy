import Vue from 'vue'
// import * as App from './app.vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
// import * as filters from './filters'

import '!style-loader!css-loader!smallstyle/dist/smallstyle.min.css';
import '!style-loader!css-loader!./default.css';
import '!style-loader!css-loader!./global.css';
import '!style-loader!css-loader!font-awesome/css/font-awesome.min.css';




const App = require('./app.vue').default
// console.log(App)
// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// // register global utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
  router,
  store,
  ...App
})

app.$mount('#app')

// new Vue({
//   el: '#app',
//   router,
//   store,
//   template: '<App/>',
//   components: { App }
// })

// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
// export { app, router, store }
