<template>
    <section >
    <ul class="ul fc" v-if="streamList">
        <li v-for="stream in streamList">
          <cStream v-bind:streamProp="stream"></cStream>
        </li>
    </ul>
    <div v-else>
      no stream list..
    </div>
    </section >
</template>

<script lang="ts" src="./stream-list.ts"></script>

<style scoped>
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
