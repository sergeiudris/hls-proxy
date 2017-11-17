<template>
  <div class="root">
      <span>{{message}}</span>
      <iframe src="./changelog.html" class="h-100 w-100"></iframe>
  </div>
</template>

<script lang="ts" >

import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'



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


@Component({
  name: 'changelog',
  components: {}
})
export default class ViewIndex extends Vue {
  message: string = 'cahngelog'
  mounted() {
  }

}


</script>
<style scoped>
  .root {
    color:gray;
  }
</style>
