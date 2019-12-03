<template>
  <div class="page">
    <h1>Assignments</h1>
    <p class="alert alert-success" v-if="hasAssignments">
      That's already sufficient! You are now able to <a href="#" @click="$store.commit('setCurrentPage', 'emails')">create & download the data for your E-Mails!</a>
    </p>
    <p
      class="alert alert-info"
    >Here, all teams are assigned routes, telling them where they will have the first, second and third course.</p>

    <button
      type="button"
      class="btn btn-primary"
      @click="createRandomAssignment"
    >Create Team Assignments Randomly</button>
    <button
      type="button"
      class="btn btn-primary"
      @click="createFirstCourseOutsideAssignment"
    >Change to FirstCourse Away from city Center</button>
    <button
      type="button"
      class="btn btn-primary"
      @click="getBestConfig"
    >Get best Config in 20 Trials</button>
    <div style="margin: 1em">
      <span
        v-for="team in teams"
        @click="toggleSelectedTeam(team.teamId)"
        :key="team.teamId"
        :style="{'background-color': getTeamColor(team.teamId, selectedTeamNo)}"
        style="cursor: pointer"
        class="badge badge-secondary"
      >{{team.firstname}} and {{team.partner.firstname}} ({{team.sequence.distance.toFixed(2)}} km)</span>
    </div>
    <div
      v-if="teams"
    >Overall Distance: {{overallDistance.toFixed(2)}} km | maxDistance: {{maxDistance.toFixed(2)}} km</div>
    <p class="alert alert-warning" v-if="!validConfig[0]">Error: {{validConfig[1]}}</p>
    <l-map
      v-if="csv.length > -2"
      style="height: 50em; width: 100%"
      :center="[49.872517,8.651333]"
      :zoom="currentZoom"
    >
      <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" layer-type="base" />
      <l-marker
        v-for="kitchen in usedKitchens"
        v-bind:key="'kitchen_' + kitchen.teamId"
        :lat-lng="[kitchen.lat, kitchen.lon]"
        :title="kitchen.firstname"
      >
          <l-icon
            :icon-size="[15, 21]"
            :icon-anchor="[8, 11]"
            :icon-url="kitchen_yes_icon"
          />
          <l-tooltip :content="kitchen.firstname"></l-tooltip>
      </l-marker>
      <l-polyline
        v-for="team in teams"
        @mouseup="toggleSelectedTeam(team.teamId)"
        :key="'line_'+team.teamId"
        :lat-lngs="team.sequence.latlngs"
        :color="getTeamColor(team.teamId, selectedTeamNo)"
      ></l-polyline>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LTooltip, LPolyline, LIcon } from "vue2-leaflet";
import { globalFunctions } from "./mixins/globalFunctions";
import { assignmentInitializer } from "./mixins/assignmentInitializer";
import { assignmentOptimizers } from "./mixins/assignmentOptimizers";
import { assignmentStats } from "./mixins/assignmentStats";

export default {
  name: "Assignments",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LPolyline,
    LIcon
  },
  mixins: [
    assignmentInitializer,
    globalFunctions,
    assignmentOptimizers,
    assignmentStats
  ],
  computed: {
    usedKitchens: function() {
      return this.csv.filter(x => {
        return x.kitchenUsed == this.$store.state.kitchenOptions.yes;
      });
    }
  },
  methods: {
    toggleSelectedTeam(teamId) {
      this.selectedTeamNo = this.selectedTeamNo == teamId ? 0 : teamId;
    },
    getBestConfig() {
      // trial and error version to find best assignment
      let tried_assignments = []; // [assignmentIds, totalDist, maxDist], sorted by maxDist

      // try 10 configurations
      for (let i = 0; i < 20; i++) {
        // start random with teams of first and last course randomly by distance
        let assignments = this.getRandomAssignmentIds();
        assignments = this.getFirstCourseOutsideAssignmentIds(assignments);
        let teamArray = this.assignIdsToTeam(this.csv, assignments, this.assignmentMatrix);
        let teamObject = this.createEnhancedTeamInfo(teamArray);
        let stats = this.getStatsForAssignments(teamObject);
        //console.log('current score:', assignments, stats.overallScore); //eslint-disable-line

        assignments = this.getBetterAssignments(assignments, stats.overallScore);
        teamArray = this.assignIdsToTeam(this.csv, assignments, this.assignmentMatrix);
        teamObject = this.createEnhancedTeamInfo(teamArray);
        stats = this.getStatsForAssignments(teamObject);
        //console.log('current better score:', assignments, stats.overallScore); //eslint-disable-line

        // get stats for assignment
        // console.log('tried', assignments, stats.overallScore) //eslint-disable-line
        tried_assignments.push([Array.from(assignments), stats.overallScore]);
      }
      let sortedAssignments = tried_assignments.sort((a, b) => {
        return a[1] - b[1];
      });
      //console.log('BestConfigs:', sortedAssignments); //eslint-disable-line
      console.log('BestConfig:', sortedAssignments[0][0], 'with', sortedAssignments[0][1]); //eslint-disable-line
      let teamArray = this.assignIdsToTeam(this.csv, sortedAssignments[0][0], this.assignmentMatrix);
      let teamObject = this.createEnhancedTeamInfo(teamArray);
      let stats = this.getStatsForAssignments(teamObject);
      console.log('BestConfigScore:', stats.overallScore); //eslint-disable-line
      this.applyAssignments(sortedAssignments[0][0]);
    },
    getBetterAssignments(assignments, currentScore) {
      // loop through all possibilities
      let bestAssignment = JSON.stringify(assignments)
      let newAssignments = []
      let teamArray = []
      let teamObject = null
      let stats = []
      for (let i = 1; i <= assignments.length; i++) {
        for (let j = i; j <= assignments.length; j++) {
          newAssignments = this.switchTeams(i, j, JSON.parse(bestAssignment))
          
          teamArray = this.assignIdsToTeam(this.csv, newAssignments, this.assignmentMatrix);
          teamObject = this.createEnhancedTeamInfo(teamArray);
          
          stats = this.getStatsForAssignments(teamObject);
          
          if(stats.overallScore < currentScore){
            bestAssignment = JSON.stringify(newAssignments)
            currentScore = stats.overallScore
          }
        }
      }
      bestAssignment = JSON.parse(bestAssignment)
      //console.log('better assignments', bestAssignment, currentScore); //eslint-disable-line
      return bestAssignment;
    },
    createRandomAssignment() {
      const assignments = this.getRandomAssignmentIds();
      this.applyAssignments(assignments);
      // console.log('better assignments', this.teams); //eslint-disable-line
    },
    createFirstCourseOutsideAssignment() {
      let assignments = this.getRandomAssignmentIds();
      assignments = this.getFirstCourseOutsideAssignmentIds(assignments);
      this.applyAssignments(assignments);
    },
    applyAssignments(assignments) {
      this.teamToAssignIdMap = assignments;
      const teamArray = this.assignIdsToTeam(this.csv, assignments, this.assignmentMatrix);
      this.teams = this.createEnhancedTeamInfo(teamArray);
      const stats = this.getStatsForAssignments(this.teams);
      this.maxDistance = stats.maxDist;
      this.overallDistance = stats.overallDist;
      this.$store.commit("setCsv", teamArray);
    }
  },
  data: function() {
    return {
      kitchen_yes_icon: require('../assets/kitchen_yes_icon.png'),
      header: "Teams",
      currentZoom: 13,
      teams: {},
      csv: [],
      polylines: [],
      hasAssignments: false,
      selectedTeamNo: 0,
      cityCenter: [49.872517, 8.651333],
      teamToAssignIdMap: [],
      assignmentMatrix: [],
      overallDistance: 0,
      maxDistance: 0,
      validConfig: [true]
    };
  },
  mounted: function() {
    if (this.$store.state.csv) {
      this.csv = this.$store.state.csv;

      // create Assignment Matrix
      this.assignmentMatrix =  JSON.stringify(this.createAssignmentMatrix(this.csv.length / 2))

      // check if assignments are already created
      let hasAssignments = true;
      this.csv.forEach(e => {
        if (
          e.firstCourse == e.firstname ||
          e.secondCourse == e.firstname ||
          e.thirdCourse == e.firstname
        ) {
          hasAssignments = false;
        }
      });
      if (hasAssignments) {
        this.hasAssignments = hasAssignments;
        this.teams = this.createEnhancedTeamInfo(this.csv);
      }
    }
  }
};
</script>

<style scoped>
.badge {
  margin: 2px;
  font-size: 1em;
}
</style>
