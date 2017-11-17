<template>
  <section class="relative fc ai-stretch jc-center w-100 h-100" v-if="streamInfo">
    <header>
      <!-- <div>{{url}}</div>
            <div>{{title}}</div>-->
    </header>
    <main class="relative fi ">
      <video controls ref="video" class="img" autoplay></video>
    </main>
    <footer>
      <div class="url">{{url}}</div>
      <div class="url">{{readyState}}</div>
      <div class="buttons frw ai-start jc-start">
        <button @click="connect">connnect</button>
        <button @click="record">record</button>
        <button @click="snapshot">snapshot</button>
        <button style="color:red;" @click="terminateStream">terminate</button>
      </div>
    </footer>
  </section>
  <section v-else>
    no stream data
  </section>
</template>

<script lang="ts">

import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import * as _ from 'lodash'
import Hls, {} from 'hls.js'


import {SERVICE_HOST} from 'src/api'



import {Cams} from '@streaming/types'

@Component({
  // name: 'cStreamStream',
})
export default class cStream extends Vue {

  @Prop()
  dataset: Cams.Dataset

  @Prop()
  streamInfo: any

  readyState_: number = WebSocket.CLOSED;
  response: string | Object = ""
  port: string | number = "-1"
  socket: WebSocket

  get readyState(): string {
    const state = this.readyState_;
    if (state === WebSocket.CLOSED) {
      return 'CLOSED'
    }
    if (state === WebSocket.CLOSING) {
      return 'CLOSING'
    }
    if (state === WebSocket.CONNECTING) {
      return 'CONNECTING'
    }
    if (state === WebSocket.OPEN) {
      return 'OPEN'
    }
  }

get url(): string {
    return this.streamInfo.version.object.cam_url
  }

  get title(): string {
    return this.streamInfo.version.object.title
  }

  @Watch('streamInfo')
  onStreamChange(val, oldVal) {
    // console.log(val,oldVal)
    // this.connect();
  }

  get video(): HTMLVideoElement {
    return this.$refs['video'] as HTMLVideoElement
  }

  connect() {
    window['fetch'](`${SERVICE_HOST}/hls/start?url=${this.url}`, {
      method: 'get'
    })
      .then((res) => {
        return res.json()
      })
      .then((res: any) => {
        console.log(res);
        this.response = JSON.stringify(res);

        if (res.port) {
          this.port = res.port;
          this.socket = new WebSocket(`ws://${location.hostname}:${res.port}`)
          this.readyState_ = WebSocket.CONNECTING;
          this.socket.addEventListener('open', () => {
            this.readyState_ = this.socket.readyState;
          })
          this.socket.addEventListener('error', () => {
            console.log(this.socket.readyState);
            this.readyState_ = this.socket.readyState;
            this.port = -1;
          })
          this.socket.addEventListener('close', () => {
            this.readyState_ = this.socket.readyState;
            this.port = -1;
          })

          if(res.url){
            var hls = new Hls({
              manifestLoadingMaxRetry: 10,
            } as Hls.OptionalConfig);
            hls.loadSource(res.url);
            // hls.loadSource('http://127.0.0.1:8080/play/hls/sintel/index.m3u8');

            hls.attachMedia(this.video);
            hls.on(Hls.Events.MANIFEST_PARSED,  () => {
              console.warn('Hls.Events.MANIFEST_PARSED')
              this.video.play();
            });
          }

        }
      })
  }

  terminateStream() {
    window['fetch'](`${SERVICE_HOST}/hls/stop?url=${this.url}`, {
      method: 'post'
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        this.response = JSON.stringify(res);
      })
  }

  updated() {
    // console.log('updated');
  }
  record() {
    console.log('record');
    // this.stream.recordingStart(10000).then((blob) => {
    //   this.stream.saveToDevice(blob, 'test.mjpeg')
    // })
  }


  snapshot() {
    console.log('snapshot');
    // this.stream.screenshot().then((blob) => {
    //   this.stream.saveToDevice(blob, 'test.png')
    // })
  }

  mounted() {
  }

}

</script>

<style lang="stylus" scoped>
.table {
  table-layout: fixed;
  // width: 100%;
  border: 1px solid black;
  border-radius: 3px;
  margin: 0em;
}

.table td {
  height: 100%;
  position: relative;
}

.table tr, .table td {
  border: 1px solid black;
  border-radius: 3px;
}

.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid darkgreen;
  // background-color: #AED6F1;
  // position: absolute;
  // top:0;
  // left:0;
}

.info {
  position: absolute;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: lightgrey;
  bottom: 0;
  right: 0;
}

.buttons button {
  margin: 1px 3px;
}

.url {
  overflow: hidden;
  font-size: 0.8em;
}
</style>
