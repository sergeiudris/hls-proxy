<template>
  <div id="app" class="fc relative h-100">
    <header class="relative fr ai-start h-10">
      <div class="w-10 h-100"></div>
       <nav class="nav w-90 fr fi as-stretch jc-start ai-center">
        <router-link to="/" exact>
          <i class="fa fa-home" aria-hidden="true"></i>
        </router-link>
        <router-link to="/settings">settings</router-link>
        <router-link to="/streams">streams</router-link>
        <!-- <router-link to="/stream">stream</router-link> -->
        <!-- <router-link to="/hls">hls</router-link> -->
      </nav>
    </header>
    <main class="relative h-90">
      <router-view class="box-gray relative fi h-100"></router-view>
    </main>
    <footer></footer>
    <router-link class="version" v-bind:title="RELEASE_DATE" to="/changelog">v{{VERSION}}</router-link>
  </div>
</template>

<script >
const version = _VERSION_;
const releaseDate = _RELEASE_DATE_;

export default {
  name: "app",
  data: {
    VERSION: version,
    RELEASE_DATE: releaseDate
  },
  methods: {},
  mounted: function() {},
  updated: function() {}
};
</script>
<style lang="stylus" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // font-size: 12px;
}

.nav {
}

.nav a {
  margin: 1em;
  font-size: 1.3em;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff6600;
  }

  &.router-link-active {
    color: orange;
    font-weight: 400;
    // background-color: rgba(255,255,0,0.3)
  }
}

.nav a:hover {
}

.version {
  position: fixed;
  bottom: 2px;
  right: 2px;
  color: #777;
  font-size: 1.2em;
  opacity: 0.5;
}
</style>
