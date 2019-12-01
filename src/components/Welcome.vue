<template>
  <div class="page">
    <h2>Welcome to the Running Dinner Solver</h2>
    <p></p>
    <div class="alert alert-info">
      <span v-if="!$store.state.csv">This is the project of the open-source Running Dinner generator.</span><b v-if="!$store.state.csv">Please start by uploading a csv file.</b>
      <b v-else>You can continue with the next steps. The data shown in the table below will automatically be updated.</b>
    </div>
    <div class="alert alert-warning" v-if="!$store.state.csv">
      Likely, you do not have the info like "is the kitchen used", "lat" (latitude), "lon" (longitude), teamId etc. yet - <strong>please set all values you cannot provide to the first name of the person</strong>.
    </div>
    <div class="card" style="max-width: 40em; margin: 0 auto;" v-if="csv.length < 2">
      <div class="card-body">
        <h5 class="card-title">Upload CSV-File</h5>
        <p class="card-text">
          <vue-csv-import v-model="csv" :map-fields="mapFields"></vue-csv-import>
        </p>
      </div>
    </div>
    <div class="card" style="max-width: 40em; margin: 0 auto;" v-if="csv.length > 2">
      <div class="card-body">
        <h5 class="card-title" v-if="!$store.state.csv">Is the Data Correct?</h5>
        <p class="card-text">
            <button v-if="!$store.state.csv" @click="csv = []" type="button" class="btn btn-primary">Reset</button>
            <button v-if="!$store.state.csv" @click="saveCsv" type="button" class="btn btn-primary">Use Data for next steps</button>
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
  name: "Welcome",
  components: { VueCsvImport },
  data: function() {
    return {
      csv: [
        {
          Vorname: "test",
          Nachname: "test",
          Organisation: "test",
          Küche: "test"
        }
      ],
      mapFields: this.$store.state.mapFields
    };
  },
  methods: {
    saveCsv() {
      this.$store.commit("setCsv", this.csv);
    }
  },
  mounted: function () {
    if(this.$store.state.csv) {
      this.csv = this.$store.state.csv
    }
    this.mapFields = this.$store.state.mapFields
  }
};
</script>

<style scoped>
</style>
