<template>
  <main class="relative fc h-100 ">
    <section class="relative fc h-90 box-orange streambox">
      <h3>{{message}}</h3>
      <div class="fr jc-around">
        <h4>streams: {{count_streams}}</h4>
        <h4>cleints: {{count_clients}}</h4>
        <button class="stop-all" @click="stopAll">stop all streams</button>
      </div>
      <ul>
        <li  class="li" v-for="key in streams" v-bind:key="key">{{key}}</li>
      </ul>
      <!-- <div class="fr jc-around">
        <h4>{{spawnMjpegResponse}}</h4>
        <button class="stop-all" @click="getSpawnMjpegResponse">call spawn-mjpeg</button>
      </div> -->
    </section>
  </main>
</template>

<script lang="ts">

  import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class'


// import a from 'vuex-store-module-persons/src/actions'

import { SERVICE_HOST, SERVICE_HOSTNAME, SERVICE_PORT } from 'src/api'

@Component({
  name: 'view-settings',
})
export default class ViewSettings extends Vue {


  count_streams = 0
  count_clients = 0

  streams : string[] = []

  spawnMjpegResponse = "we'll see )"

  updated() {
    // console.log('updated');
  }

  get message(): string {
    return '';
  }


  mounted() {
    const status = `${SERVICE_HOST}/mjpeg/status`
    window.fetch(status, {
    })
    .then(res => {
      return res.json()
    })
    .then((res) => {
        this.streams = Object.keys(res.streams)
        this.count_streams = Number(res.count_streams)
    })

  }

  stopAll() {
    const url = `${SERVICE_HOST}/mjpeg/stopAll`
    window['fetch'](url, {
      method: 'post'
    }).then((res) => {
      return res.json()
    })
      .then((res) => {
        console.log(res);
      })
  }

  getSpawnMjpegResponse() {
    const url = `/api/random`
    window['fetch'](url, {
      method: 'get'
    }).then((res) => {
      return res.json()
    })
      .then((res) => {
        console.log(res);
        this.spawnMjpegResponse = res.random
      })
  }



}



</script>

<style lang="stylus" scoped>
.root {
  // position: fixed;
  // top:10vh;
  // left: 1vw;
  // width: 10em;
  // height: 40em;
  // border: 1px solid black;
  // background-color: rgba(255,255,255,0.7);
  // z-index: 1;
}

.li{
  text-align: start;
}

.stop-all {
  background-color: #ff864d;
}

</style>
