import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
// import a from 'vuex-store-module-persons/src/actions';

const cStream = require('./stream.vue').default

@Component({
  // name: 'view-streams',
  components: {
    cStream
  }
})
export default class ViewStreamSwitch extends Vue {

  streamList: any[] = []


  updated() {
    console.log('updadted');
  }

  get stream(): any {

    const id = this.$route.params['id']
    let selected = undefined;
    for (let stream of this.streamList) {
      if (stream.id === id) {
        selected = stream;
        break;
      }
    }
    return selected;

  }

  mounted() {

    const url = `${location.origin}/api/settings/streams`

    window['fetch'](url, {
      mode: 'no-cors'
    }).then((res: any) => {
      return res.json()
    })
      .then((res) => {
        console.log(res);
        this.streamList = res.streams;
      })

  }

}

