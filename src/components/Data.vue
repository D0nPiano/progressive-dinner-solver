<template>
  <div class="page">
    <h2>Data Import & Export</h2>
    <p></p>
    <div class="alert alert-info">
      <span v-if="!$store.state.csv"></span>
      <b v-if="!$store.state.csv">Please start by uploading a csv file.</b>
      <b
        v-else
      >You can continue with the next steps. The data shown in the table below will automatically be updated.</b>
    </div>
    <div class="alert alert-warning" v-if="!$store.state.csv">
      Likely, you do not have the info like "is the kitchen used", "lat" (latitude), "lon" (longitude), teamId etc. yet -
      <strong>please set all values you cannot provide to the first name of the person</strong>.
    </div>
    <div class="card" style="max-width: 40em; margin: 0 auto;" v-if="csv.length < 2">
      <div class="card-body">
        <h5 class="card-title">Upload CSV-File</h5>
        <p class="card-text">
          <select v-model="selected">
            <option disabled value="">Please select one</option>
            <option value="new">New File</option>
            <option value="old">Continue with existing data</option>
          </select>
          {{ selected }}
          <vue-csv-import v-if="selected == 'new'" v-model="csv" :map-fields="newDataMapFiels" auto-match-fields auto-match-ignore-case :headers="true"></vue-csv-import>
          <vue-csv-import v-if="selected == 'old'" v-model="csv" :map-fields="mapFields" auto-match-fields auto-match-ignore-case :headers="true"></vue-csv-import>
        </p>
      </div>
    </div>
    <div class="card" style="max-width: 40em; margin: 0 auto;" v-if="csv.length > 0">
      <div class="card-body">
        <h5 class="card-title" v-if="!$store.state.kitchenOptions">Please select kitchen options</h5>
        <p class="card-text">
          Yes:
          <select v-model="select_yes">
            <option disabled value>Please select one</option>
            <option v-for="option in getKitchenOptions" :key="option" :value="option">{{option}}</option>
          </select><br/>
          If necessary:
          <select v-model="select_if">
            <option disabled value>Please select one</option>
            <option v-for="option in getKitchenOptions" :key="option" :value="option">{{option}}</option>
          </select><br/>
          No:
          <select v-model="select_no">
            <option disabled value>Please select one</option>
            <option v-for="option in getKitchenOptions" :key="option" :value="option">{{option}}</option>
          </select>
        </p>
        <h5 class="card-title" v-if="!$store.state.csv">Is the Data Correct?</h5>
        <p class="card-text">
          <button
            v-if="!$store.state.csv"
            @click="csv = []"
            type="button"
            class="btn btn-primary"
          >Reset</button>
          <button
            v-if="!$store.state.csv && this.select_yes && this.select_if && this.select_no"
            @click="saveCsv"
            type="button"
            class="btn btn-primary"
          >Use Data for next steps</button>
          <download-csv v-if="$store.state.csv" :data="csv">
            <button type="button" class="btn btn-primary">Download Data</button>
          </download-csv>
        </p>
      </div>
    </div>
    <div id="people" v-if="csv.length > 2">
      <v-client-table :data="csv" :columns="mapFields">
        <template slot="submit" slot-scope="{submit}">
          <button @click.prevent="submit">send!</button>
        </template>
      </v-client-table>
    </div>
  </div>
</template>

<script>
import { VueCsvImport } from "vue-csv-import";

export default {
  name: "Data",
  components: { VueCsvImport },
  computed: {
    csv: {
      get: function () {
        return this.currentCsv
      },
      set: function (newValue) {
        console.log(newValue)
        let renameKey = (obj, oldKey, newKey) => {
          for (let i = 0; i < obj.length; i++) {
            if (obj[i][oldKey]) {
              obj[i][newKey] = obj[i][oldKey]
              delete obj[i][oldKey]
            }
            
          }
          return obj
        }
        let setKeyToFirstName = (obj, key) => {
          for (let i = 0; i < obj.length; i++) {
            if (!obj[i][key]){
              obj[i][key] = obj[i]["firstname"]
            }
          }
          return obj
        }
        newValue = renameKey(newValue, 'first-name', 'firstname')
        newValue = renameKey(newValue, 'last-name', 'lastname')
        newValue = renameKey(newValue, 'address-street', 'street')
        newValue = renameKey(newValue, 'address-number', 'streetnumber')
        newValue = renameKey(newValue, 'postal-code', 'zip')
        newValue = renameKey(newValue, 'organisation', 'organization')
        newValue = renameKey(newValue, 'kitchen', 'hasKitchen')
        newValue = setKeyToFirstName(newValue, "kitchenUsed")
        newValue = setKeyToFirstName(newValue, "teamId")
        newValue = setKeyToFirstName(newValue, "kitchenUsed")
        newValue = setKeyToFirstName(newValue, "lat")
        newValue = setKeyToFirstName(newValue, "lon")
        newValue = setKeyToFirstName(newValue, "firstCourse")
        newValue = setKeyToFirstName(newValue, "secondCourse")
        newValue = setKeyToFirstName(newValue, "thirdCourse")
        console.log(newValue)
        this.currentCsv = newValue
      }
    },
    getKitchenOptions: function() {
      let kitchenOptions = []
      this.csv.forEach(e => {
        if(!kitchenOptions.includes(e.hasKitchen)){
          kitchenOptions.push(e.hasKitchen)
        }        
      });
      return kitchenOptions;
    }
  },
  data: function() {
    return {
      currentCsv: [],
      mapFields: this.$store.state.mapFields,
      selected: 'new',
      select_yes: undefined,
      select_if: undefined,
      select_no: undefined,
      newDataMapFiels: [
        "first-name",
        "last-name",
        "email",
        "phone",
        "address-street",
        "address-number",
        "postal-code",
        "area",
        "organisation",
        "kitchen",
        "allergies",
        "message",
      ]
    };
  },
  methods: {
    saveCsv() {
      if (this.select_yes && this.select_if && this.select_no) {
        this.$store.commit("setKitchenOptions", {yes: this.select_yes, if: this.select_if, no: this.select_no});
        this.$store.commit("setCsv", this.csv);
      }
    }
  },
  mounted: function() {
    if (this.$store.state.csv) {
      this.csv = this.$store.state.csv;
      this.select_yes = this.$store.state.kitchenOptions.yes
      this.select_if = this.$store.state.kitchenOptions.if
      this.select_no = this.$store.state.kitchenOptions.no
    }
    this.mapFields = this.$store.state.mapFields;
  }
};
</script>

<style scoped>
</style>
