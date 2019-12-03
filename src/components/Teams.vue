<template>
  <div class="page">
    <h1>Select Kitchens & Create Teams</h1>
    <p class="alert alert-success" v-if="hasTeamIds">
      Great! Go on and <a href="#" @click="$store.commit('setCurrentPage', 'assignments')">create a route for your newly selected teams!</a>
    </p>
    <p v-if="csv.length < 2" class="alert alert-info">
      Here, people are assigned to random teams according to their
      <b>distance to the city center</b>, depending if they have a
      <b>kitchen and space</b>, a
      <b>maybe kitchen</b>, and on their
      <b>organization.</b>
    </p>
    <div class="card" style="max-width: 40em; margin: 0 auto;" v-if="csv.length > 0 && !hasTeamIds">
      <div class="card-body">
        <h5 class="card-title">
          <span
            v-if="noKitchenToSelect != 0"
          >You still have to select {{ noKitchenToSelect }} kitchens.</span>
          <span v-else-if="!hasTeamIds">You are good to go. Create Teams now.</span>
          <span v-else>You are good to go. Go on with the Assignments!</span>
        </h5>
        <p class="card-text">
          <span v-if="!hasTeamIds">
            <span v-if="noKitchenToSelect != 0">
              You can also select kitchens by
              <b>clicking on them on the map</b>
            </span>.
            <br />Maximum Distance from Center:
            <input
              style="width: 60px"
              v-model.number="maxDist"
              type="number"
            />km
            <br />
          </span>
          <button
            @click="preselectKitches"
            type="button"
            class="btn btn-primary"
            v-if="!hasTeamIds"
          >Automatically pre-select kitchens in {{maxDist}} km radis</button>
          <button
            v-if="!hasTeamIds"
            :disabled="noKitchenToSelect != 0"
            @click="createTeamIds"
            type="button"
            class="btn btn-primary"
          >Create Team IDs</button>
        </p>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <v-client-table
            v-if="csv.length > 0"
            ref="table"
            @update="updateTeamId"
            :data="csv"
            :options="{editableColumns:['teamId']}"
            :columns="mapFields"
          >
            <div 
              slot="teamId"
              slot-scope="{row, update}"
              :style="{'background-color': getTeamColor(row.teamId, 0), 'padding': '5px'}">
              <select
              v-model="row.teamId"
              @input="update(row.teamId)"
              @change="update(row.teamId)"
            >
              <option
                v-for="n in (csv.length / 2)"
                :key="n"
                :value="n"
              >{{n}} with {{getTeamPartner(n, row.kitchenUsed).firstname}}</option>
            </select>
            </div>
            
          </v-client-table>
        </div>
        <div class="col-sm">
          <div v-if="csv.length > 0" style="height: 100%; width: 100%; margin: auto;">
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
                @click="toggleKitchen(kitchen)"
              >
                <l-icon
                  :icon-size="[20, 30]"
                  :icon-anchor="[10, 15]"
                  :icon-url="getIconFor(kitchen)"
                />
                <l-tooltip :content="kitchen.firstname + ' <br> ' + kitchen.message"></l-tooltip>
              </l-marker>
            </l-map>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LTooltip, LIcon } from "vue2-leaflet";
import { globalFunctions } from './mixins/globalFunctions';

export default {
  name: "Teams",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LIcon
  },
  mixins: [globalFunctions],
  computed: {
    kitchens: function() {
      return this.csv.filter(x => {
        return (
          x.hasKitchen != this.$store.state.kitchenOptions.no && x.lat != x.firstname && x.lon != x.firstname
        );
      });
    },
    selectedKitchens: function() {
      return this.csv.filter(x => {
        return x.kitchenUsed == this.$store.state.kitchenOptions.yes;
      });
    },
    noKitchenToSelect: function() {
      return this.csv.length / 2 - this.selectedKitchens.length;
    }
  },
  data: function() {
    return {
      maxDist: 2,
      cityCenter: [49.872517, 8.651333],
      currentZoom: 13,
      kitchen_yes_used_icon: require("../assets/kitchen_yes_used_icon.png"),
      kitchen_yes_unused_icon: require("../assets/kitchen_yes_unused_icon.png"),
      kitchen_maybe_used_icon: require("../assets/kitchen_maybe_used_icon.png"),
      kitchen_maybe_unused_icon: require("../assets/kitchen_maybe_unused_icon.png"),
      mapFields: ["firstname", "lastname", "organization", "kitchenUsed"],
      csv: [],
      personToChangeFrom: 0,
      teamIdToChangeFrom: 0,
      changedPerson: 0,
      changedTo: 0,
      hasTeamIds: false
    };
  },
  methods: {
    updateOtherTeamMember() {
      // change the person that is affected by the change
      for (let i = 0; i < this.csv.length; i++) {
        if (
          this.csv[i].teamId == this.personToChangeFrom.teamId &&
          this.csv[i].firstname == this.personToChangeFrom.firstname
        ) {
          console.log("changing", this.csv[i].firstname); //eslint-disable-line
          this.csv[i].teamId = parseInt(this.teamIdToChange);
          this.personToChangeFrom = 0;
          this.teamIdToChange = 0;
          break;
        }
      }

      // double-check the change of the person that was changed
      for (let i = 0; i < this.csv.length; i++) {
        if (
          this.csv[i].lastname == this.changedPerson.lastname &&
          this.csv[i].firstname == this.changedPerson.firstname
        ) {
          console.log("double-check the change of", this.csv[i].firstname); //eslint-disable-line
          this.csv[i].teamId = parseInt(this.changedTo);
          this.changedPerson = 0;
          this.changedTo = 0;
          break;
        }
      }
      this.$store.commit("setCsv", this.csv);
    },
    updateTeamId(e) {
      let foundPerson = false;
      this.changedPerson = e.row; // save the person that was changed
      for (let i = 0; i < this.csv.length; i++) {
        // find the other person with the teamId that has to be changed
        if (
          this.csv[i].teamId == parseInt(e.newVal) &&
          (this.csv[i].firstname != e.row.firstname ||
            this.csv[i].lastname != e.row.lastname) &&
          this.csv[i].kitchenUsed == e.row.kitchenUsed
        ) {
          foundPerson = true;
          this.changedTo = e.newVal;
          this.personToChangeFrom = this.csv[i];
          break;
        }
      }
      if (!foundPerson) {
        // We found the original teamId value before it was changed - save it
        this.teamIdToChange = e.oldVal;
      }
      this.updateOtherTeamMember();
      return;
    },
    getTeamPartner(teamId, kitchenUsed) {
      for (let i = 0; i < this.csv.length; i++) {
        if (
          this.csv[i].teamId == teamId &&
          this.csv[i].kitchenUsed != kitchenUsed
        ) {
          return this.csv[i];
        }
      }
      return "noone";
    },
    toggleKitchen(kitchen) {
      if (this.hasTeamIds){
        return;
      }
      if (kitchen.kitchenUsed == this.$store.state.kitchenOptions.yes) {
        kitchen.kitchenUsed = this.$store.state.kitchenOptions.no;
      } else {
        kitchen.kitchenUsed = this.$store.state.kitchenOptions.yes;
      }
    },
    getIconFor(kitchen) {
      if (kitchen.kitchenUsed == this.$store.state.kitchenOptions.yes) {
        return kitchen.hasKitchen == this.$store.state.kitchenOptions.yes
          ? this.kitchen_yes_used_icon
          : this.kitchen_maybe_used_icon;
      } else {
        return kitchen.hasKitchen == this.$store.state.kitchenOptions.yes
          ? this.kitchen_yes_unused_icon
          : this.kitchen_maybe_unused_icon;
      }
    },
    preselectKitches() {
      this.csv.forEach(x => {
        if (
          x.hasKitchen == this.$store.state.kitchenOptions.yes &&
          this.distance(x.lat, x.lon, this.cityCenter[0], this.cityCenter[1]) <
            this.maxDist
        ) {
          x.kitchenUsed = this.$store.state.kitchenOptions.yes;
        } else {
          x.kitchenUsed = this.$store.state.kitchenOptions.no;
        }
      });
    },
    peopleWithUsedUnusedKitches(used) {
      return this.csv.filter(x => {
        return x.kitchenUsed == used;
      });
    },
    createTeamIds() {
      let peopleWithKitchens = this.peopleWithUsedUnusedKitches(this.$store.state.kitchenOptions.yes);
      let peopleWithoutKitchens = this.peopleWithUsedUnusedKitches(this.$store.state.kitchenOptions.no);
      let currentTeamId = 1;
      peopleWithKitchens.forEach(x => {
        x.teamId = currentTeamId;
        currentTeamId += 1;
      });
      currentTeamId = 1;
      peopleWithoutKitchens.forEach(x => {
        x.teamId = currentTeamId;
        currentTeamId += 1;
      });
      this.hasTeamIds = true;
      this.mapFields.push("teamId");
      this.$store.commit("setCsv", this.csv);
    }
  },
  mounted: function() {
    if (this.$store.state.csv) {
      this.csv = this.$store.state.csv;
      this.hasTeamIds = this.$store.state.hasTeamIds;
      if (this.hasTeamIds) {
        this.mapFields.push("teamId");
      }
    }
  }
};
</script>

<style>
</style>
