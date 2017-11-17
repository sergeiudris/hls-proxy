<template>
  <section>
    <h5>stream</h5>
    <input type="text" placeholder="url" @change="onchange" ref="url"></input>
    <button @click="update">update</button>
    <Stream v-if="streamInfo && streamInfo.url" v-bind:streamInfo="streamInfo" v-bind:dataset="dataset"></Stream>
  </section>
</template>

<script lang="ts" >

import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
// import a from 'vuex-store-module-persons/src/actions';

const Stream = require('./mjpeg.vue').default

@Component({
  // name: 'view-streams',
  components: {
    Stream
  }
})
export default class ViewStreamMjpeg extends Vue {

  streamInfo: any = {
    id: 'dummy',
    url: '',
    title: 'dummy'
  }
  dataset: any = {
    key_id: 'id',
    key_url: 'url',
    key_title: 'title'
  }

  count: number = 0

  url: string = ''

  updated() {
  }

  update() {
    const streamInfo = {
      ...this.streamInfo,
      url: this.url
    }
    // console.info('new stream prop', streamInfo)
    this.streamInfo = streamInfo
  }

  onchange(evt) {
    this.url = (this.$refs['url'] as HTMLInputElement).value
  }

  mounted() {



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
  border: 1px solid black;
  // background-color: rgba(255,255,255,0.7);
  // z-index: 1;
}
.ul {
  table-layout: fixed;
  width: 100%;
  border: 1px solid black;
  list-style-type: none;
  margin:0;
  padding:0;
}

.ul li {
  // border: 1px solid black;
  // margin:0.2em;
}

</style>
