<template>
  <section class="relative fc ai-stretch jc-center w-100 h-100" v-if="streamInfo">
    <header>
      <!-- <div>{{url}}</div>
            <div>{{title}}</div>-->
    </header>
    <main class="relative fi ">
      <canvas ref="canvas" class="canvas"></canvas>
      <img ref="image" class="img"></img>
    </main>
    <footer>
      <div class="url">{{title}}</div>
      <div class="url">{{readyState}}</div>
      <div class="buttons frw ai-start jc-start">
        <button @click="connect">connnect</button>
        <button @click="pause">pause</button>
        <button @click="resume">resume</button>
        <button @click="record">record</button>
        <button @click="snapshot">snapshot</button>
        <button style="color:red;" @click="terminateStream">sterminate</button>
      </div>
      <div class="url">{{url}}</div>
    </footer>
  </section>
  <section v-else>
    no stream data
  </section>
</template>

<script lang="ts">

import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { StreamWebMjepg } from 'src/modules/stream-web-mjpeg'
import * as _ from 'lodash'
import { Cams } from '@streaming/types'
import { SERVICE_HOST, SERVICE_HOSTNAME, SERVICE_PORT } from 'src/api'


@Component({
  // name: 'cStreamStream',
})
export default class cStream extends Vue {

  // @Prop()
  // dataset: Cams.Dataset

  @Prop()
  streamInfo: Cams.CameraInfo

  stream: StreamWebMjepg = null
  readyState_: number = WebSocket.CLOSED;
  response: string | Object = ""
  port: string | number = "-1"


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

  get image(): HTMLImageElement {
    return this.$refs['image'] as HTMLImageElement
  }

  get canvas(): HTMLCanvasElement {
    return this.$refs['canvas'] as HTMLCanvasElement
  }

  connect() {
    window['fetch'](`${SERVICE_HOST}/mjpeg/start?url=${this.url}`, {
      method: 'post'
    })
      .then((res) => {
        return res.json()
      })
      .then((res: any) => {
        console.log(res);
        this.response = JSON.stringify(res);

        if (res.port) {
          this.port = res.port;
          this.stream.connect(`ws://${SERVICE_HOSTNAME}:${res.port}`)
          this.readyState_ = WebSocket.CONNECTING;
          this.stream.socket.addEventListener('open', () => {
            this.readyState_ = this.stream.socket.readyState;
          })
          // this.stream.socket.addEventListener('error', () => {
          //   console.log(this.stream.socket.readyState);
          //   this.readyState_ = this.stream.socket.readyState;
          //   this.port = -1;
          // })
          this.stream.socket.addEventListener('close', () => {
            this.readyState_ = this.stream.socket.readyState;
            this.port = -1;
          })
          this.stream.resume();
        }
      })
  }

  terminateStream() {
    window['fetch'](`${SERVICE_HOST}/mjpeg/stop?url=${this.url}`, {
      method: 'post'
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        this.response = JSON.stringify(res);
      })
  }

  resume() {
    this.stream.resume();
  }

  pause() {
    this.stream.pause();
  }
  updated() {
    // console.log('updated');
  }
  record() {
    console.log('record');
    this.stream.recordingStart(10000).then((blob) => {
      this.stream.saveToDevice(blob, 'test.mjpeg')
    })
  }


  snapshot() {
    console.log('snapshot');
    this.stream.screenshot().then((blob) => {
      this.stream.saveToDevice(blob, 'test.png')
    })
  }

  mounted() {
    this.stream = new StreamWebMjepg(this.image, this.$refs['canvas'] as HTMLCanvasElement, undefined, undefined, 50000);
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
  background-color: #AED6F1;
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
