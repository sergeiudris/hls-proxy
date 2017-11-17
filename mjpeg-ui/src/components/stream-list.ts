import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
// import a from 'vuex-store-module-persons/src/actions';

// const cStream = require('./stream.vue').default

const cStream = require('./stream-sfc.vue').default


@Component({
  // name: 'view-streams',


  components: {
    cStream
  }
})
export default class ViewStreamList extends Vue {

  @Prop({ default: [] })
  streamList: any[]


  updated() {
    console.log('updadted');
  }


  mounted() {


  }

}

