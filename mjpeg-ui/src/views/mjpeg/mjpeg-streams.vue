<template>
  <main class="relative fc h-100 ">
    <section class="relative fc h-90 box-orange streambox">
      <div class="frw h-100 ac-start" v-if="datasetActive && datasetActive.items.length">
        <div class="stream" v-for="(info,i) in datasetActive.items" v-bind:key="info.version.object.cam_url">
          <Stream v-bind:streamInfo="info"></Stream>
        </div>
      </div>
      <div v-else>
        choose a dataset...
      </div>
    </section>
    <footer class="fr h-10 box-orange">
      <h4 class="p-10">datasets</h4>
      <ul class="fr ai-start jc-start">
        <li class="fr ai-start p-3 m-8 dataset" v-for="(datasetInfo,i) in datasetsInfo" v-bind:key="i">
          <span @click="onClickDataset(datasetInfo.fileName)">{{datasetInfo.title}}</span>
        </li>
      </ul>
      <!--<input type="file" id="input" multiple onchange="onFileUpload">-->
    </footer>
  </main>
</template>


<script lang="ts">

import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
// import a from 'vuex-store-module-persons/src/actions';
import { FETCH_datasets, FETCH_dataset } from '../../api'

const Stream = require('./mjpeg.vue').default

import {Cams} from '@streaming/types'


@Component({
  // name: 'view-streams',
  components: {
    Stream
  }
})
export default class ViewStreamsMjpeg extends Vue {

  streamList: Cams.CameraInfo[] = []
  datasetsInfo: Cams.DatasetInfo[] = []
  datasets: { [key: string]: Cams.Dataset } = {}
  datasetActive: Cams.Dataset = { items: [] } as any


  count: number = 0

  updated() {
    // console.log('updadted streams');
  }

  randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
  }

  mounted() {

    FETCH_datasets()
      .then((datasetsInfo) => {
        this.datasetsInfo = datasetsInfo
        // console.warn(this, this.datasetsInfo)
      })
    // window['fetch'](url, {
    //   mode: 'no-cors'
    // }).then((res) => {
    //   return res.json()
    // })
    //   .then((res: any) => {
    //     console.log(res);
    //     this.streamList = res.CAMERA_rtspcameras.reduce((p, cam, i, a) => {

    //       if (cam.version.object.cam_url) {
    //         p.push({
    //           url: cam.version.object.cam_url,
    //           id: cam.version.object.cam_url.slice(-3)
    //         })
    //       }
    //       return p
    //     }, []);
    //     console.log(this.streamList.length)
    //   })

  }
  onClickDataset(name: string) {
    // console.log(name)
    FETCH_dataset(name)
      .then((dataset) => {
        if (!this.datasets[name]) {
          dataset.items = dataset.items.filter((it)=>{
            return !!it.version.object.cam_url
          })
          this.datasets[name] = dataset
        }
        this.datasetActive = this.datasets[name]

      })

  }

  onUploadFile(evt) {
    console.warn(evt)
  }

}

</script>

<style lang="stylus" scoped>
.stream {
  width: 16em;
  height: 16em;
  border: 1px solid cornflowerblue;
  border-radius: 3px;
  margin: 5px;
}

.dataset {
  background-color: #7FDBFF;
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
}

.dataset:active, .dataset:focus {
  background-color: darken(#7FDBFF, 20%);
}

.streambox {
  overflow-y: auto;
}
</style>
