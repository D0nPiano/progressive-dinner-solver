<template>
  <div class="page">
    <h2>Location of People</h2>
    <p class="alert alert-info">
      Here, you can add location information to each person. The search uses the free service provided by
      <a
        href="https://nominatim.openstreetmap.org/"
      >nominatim</a>.
    </p>
    <p class="alert alert-success" v-if="hasLocationData">
      You are good to go! Go on and <a href="#" @click="$store.commit('setCurrentPage', 'teams')">select which kitchens are used and create teams!</a>
    </p>
    <p v-if="csv.length < 2" class="alert alert-warning">
      Please provide list of people first
      <button
        @click="goToWelcomePage"
        type="button"
        class="btn btn-primary"
      >Go back to the Welcome Page</button>
    </p>
    <div class="card" style="max-width: 40em; margin: 0 auto;" v-if="csv.length > 2 && !this.hasLocationData">
      <div class="card-body">
        <h5 class="card-title">Add Locations</h5>
        <p class="card-text">
          <button
            @click="addLocationInfo"
            type="button"
            class="btn btn-primary"
          >Add Location Informaion</button>
        </p>
      </div>
    </div>
    <div v-if="csv.length > 2" style="height: 30em; width: 30em; margin: auto;">
      <l-map
        style="height: 100%; width: 100%;margin: 20px;"
        :center="[49.872517,8.651333]"
        :zoom="currentZoom"
      >
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" layer-type="base" />
        <l-marker
          v-for="kitchen in kitchens"
          v-bind:key="kitchen.TeamId"
          :lat-lng="[kitchen.lat, kitchen.lon]"
          :title="kitchen.firstname"
        >
          <l-icon
            :icon-size="[20, 30]"
            :icon-anchor="[10, 15]"
            :icon-url="kitchen.hasKitchen == 'Ja' ? kitchen_yes_icon : kitchen_maybe_icon"
          />
          <l-tooltip :content="kitchen.firstname"></l-tooltip>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LTooltip, LIcon } from "vue2-leaflet";

export default {
  name: "Locations",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LIcon
  },
  data: function() {
    return {
      kitchen_yes_icon: require('../assets/kitchen_yes_icon.png'),
      kitchen_maybe_icon: require('../assets/kitchen_maybe_icon.svg'),
      csv: [],
      currentZoom: 13,
      hasLocationData: false,
      küchenMap: {
        Ja: -1,
        Nein: 1,
        "Wenn es nicht anders geht": 0
      }
    };
  },
  computed: {
    kitchens: function() {
      if (this.hasLocationData) {
        return this.csv.filter(x => {
          return (
            x.hasKitchen != "Nein" &&
            x.lat != x.firstname &&
            x.lon != x.firstname
          );
          // return x.kitchenUsed == "true" || x.kitchenUsed == "Ja";
        });
      } else {
        return [];
      }
    }
  },
  methods: {
    goToWelcomePage() {
      this.$store.commit("setCurrentPage", "welcome");
    },
    searchLocation(firstname, street, streetnumber, zip) {
      let location = street + " " + streetnumber + " " + zip;
      location = encodeURI(location);
      this.axios
        .get(
          "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" +
            location
        )
        .then(response => {
          //console.log(response.data[0]); //eslint-disable-line
          this.header = response.data[0];
          this.csv.forEach(x => {
            if (x.firstname == firstname && x.street == street) {
              x.lat = response.data[0].lat;
              x.lon = response.data[0].lon;
            }
          });
          this.hasLocationData = true;
          this.$store.commit("setCsv", this.csv);
        });
    },
    addLocationInfo() {
      this.csv.forEach(x => {
        this.searchLocation(x.firstname, x.street, x.streetnumber, x.zip);
      });
    },
    exportCsv() {}
  },
  mounted: function() {
    if (this.$store.state.csv) {
      this.csv = this.$store.state.csv;
      this.hasLocationData = this.$store.state.hasLocationData;
    }
  }
};
</script>

<style>
</style>
