import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import JsonCSV from 'vue-json-csv'
import { VueCsvImport } from 'vue-csv-import';
import { ClientTable } from 'vue-tables-2';
import './assets/bootstrap.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.use(VueAxios, axios)

Vue.component('downloadCsv', JsonCSV)

Vue.use(ClientTable, {}, false, 'bootstrap4', 'default');
//Vue.use(ServerTable, [options = {}], [useVuex = false], [theme = 'bootstrap3'], [template = 'default']);

Vue.use(Vuex)

Vue.config.productionTip = false


const store = new Vuex.Store({
  state: {
    mapFields: [
      "firstname",
      "lastname",
      "email",
      "phone",
      /*"age",*/
      "street",
      "streetnumber",
      "zip",
      "area",
      "organization",
      "hasKitchen",
      "allergies",
      "message",
      "date",
      "kitchenUsed",
      "teamId",
      "lat",
      "lon",
      "firstCourse",
      "secondCourse",
      "thirdCourse"
    ],
    csv: undefined,
    page: 'welcome',
    hasLocationData: false,
    hasTeamIds: false,
    hasAssignments: false,
  },
  mutations: {
    setCsv(state, csv) {
      state.csv = csv


      // check if the data has locations
      let hasLocationData = false;
      csv.forEach(x => {
        if (x.lat != x.firstname || x.lon != x.firstname) {
          hasLocationData = true;
        }
      });
      state.hasLocationData = hasLocationData;

      // check if the data has teamIds
      let hasTeamIds = true;
      csv.forEach(e => {
        if (e.teamId == e.firstname) {
          hasTeamIds = false;
        }
      });
      state.hasTeamIds = hasTeamIds;

      // check if the data has assignments
      let hasAssignments = true;
      csv.forEach(e => {
        if (
          e.firstCourse == e.firstname ||
          e.secondCourse == e.firstname ||
          e.thirdCourse == e.firstname
        ) {
          hasAssignments = false;
        }
      });
      state.hasAssignments = hasAssignments;

    },
    setCurrentPage(state, page) {
      state.page = page
    }
  }
})

new Vue({
  components: { VueCsvImport },
  render: h => h(App),
  store,
}).$mount('#app')

