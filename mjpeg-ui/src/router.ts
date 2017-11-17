import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const ViewMjpegStreams = require('./views/mjpeg/mjpeg-streams.vue').default;
const ViewMjpeg = require('./views/mjpeg/mjpeg-stream.vue').default;

// const ViewStreamSwitch = require('./views/stream/stream-switch.vue').default;
const ViewSettings = require('./views/settings/settings.vue').default;
const ViewChangelog = require('./views/changelog/changelog.vue').default;
const ViewHome = require('./views/home/home.vue').default;
const ViewHls = require('./views/hls/hls-streams.vue').default;


export default new Router({
  // mode: 'history',
  mode: 'hash',
  scrollBehavior: () => ({ y: 0, x: 0 }),
  routes: [
    { path: '/', component: ViewHome },
    { path: '/hls', component: ViewHls, name: 'view-hls' },
    { path: '/streams', component: ViewMjpegStreams, name: 'view-mjpeg-streams' },
    { path: '/stream', component: ViewMjpeg, name: 'view-mjpeg-stream' },
    // { path: '/hls', component: ViewHls, name: 'view-hls' },
    { path: '/changelog', component: ViewChangelog, name: 'view-changelog' },
    // { path: '/stream/:id', component: ViewStreamSwitch, name: 'view-stream-switch-id' },
    { path: '/settings', component: ViewSettings, name: 'view-settings' },
  ]
});


// export default new Router({
//   mode: 'history',
//   scrollBehavior: () => ({ y: 0 }),
//   routes: [
//     { path: '/top/:page(\\d+)?', component: createListView('top') },
//     { path: '/new/:page(\\d+)?', component: createListView('new') },
//     { path: '/show/:page(\\d+)?', component: createListView('show') },
//     { path: '/ask/:page(\\d+)?', component: createListView('ask') },
//     { path: '/job/:page(\\d+)?', component: createListView('job') },
//     { path: '/item/:id(\\d+)', component: ItemView },
//     { path: '/user/:id', component: UserView },
//     { path: '/', redirect: '/top' }
//   ]
// })

// export default new Router({
//   mode: 'history',
//   scrollBehavior: () => ({ y: 0 }),
//   routes: [
//     { path: '/top/:page(\\d+)?', component: Top },
//     { path: '/new/:page(\\d+)?', component: r => require.ensure([], () => r(require('../views/new.vue').default)) },
//     { path: '/show/:page(\\d+)?', component: r => require.ensure([], () => r(require('../views/show.vue').default)) },
//     { path: '/ask/:page(\\d+)?', component: r => require.ensure([], () => r(require('../views/ask.vue').default)) },
//     { path: '/job/:page(\\d+)?', component: r => require.ensure([], () => r(require('../views/job.vue').default)) },
//     { path: '/item/:id(\\d+)', component: ItemView },
//     { path: '/user/:id', component: UserView },
//     { path: '/', redirect: '/top' }
//   ]
// })
