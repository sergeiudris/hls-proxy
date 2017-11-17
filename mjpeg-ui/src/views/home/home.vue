<template>
  <div class="root">
      <span class="as-start">{{message}}</span>
  </div>
</template>

<script lang="ts" >

  import Vue from 'vue'
  import { Component, Prop, Watch } from 'vue-property-decorator'

  declare var _VERSION_: string
  declare var _RELEASE_DATE_: string
  declare var NODE_ENV: string

  // import {
  //   State,
  //   Getter,
  //   Action,
  //   Mutation,
  //   namespace
  // } from 'vuex-class'



  // const res = Vue.compile(`
  //   <div >
  //     hello
  //   </div>

  //   `);

  const version = _VERSION_
  const releaseDate = _RELEASE_DATE_

  @Component({
    name: 'index',
    components: {}
  })
  export default class ViewIndex extends Vue {
    message: string = `stream-server v ${_VERSION_}`
    mounted() {
    }



  }



</script>
<style scoped>
  .root {
    color:gray;
  }
</style>
