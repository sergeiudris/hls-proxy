<template>
    <section class="root fr">
    <ul class="ul fc ai-center jc-center" v-if="streamList">
       <router-link v-for="stream in streamList" v-bind:to="'/stream/'+stream.id">{{stream.id}}</router-link>
    </ul>
    <cStream v-if="stream" v-bind:stream="stream"></cStream>
    <div v-else>
      no stream list..
    </div>
    </section >
</template>

<script lang="ts" src="./stream-switch.ts"></script>

<style scoped>
.root {
  // position: fixed;
  // top:10vh;
  // left: 1vw;
  // width: 10em;
  // height: 40em;
  // border: 1px solid black;
  border-radius: 3px;
  // background-color: rgba(255,255,255,0.7);
  // z-index: 1;
  min-height: 80vh;
}
.ul {
  table-layout: fixed;
  width: 100%;
  // border: 1px solid black;
  list-style-type: none;
  margin:0;
  padding:0;
  width: 20vw;
}

.ul a {
  // border: 1px solid black;
  margin:0.2em;

}

</style>
